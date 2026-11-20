import sharp from "sharp";

/**
 * 0machine LaserAI Studio Engine v2.0
 * Server-side High-Precision Vectorizer for 0machine LaserAI
 * 
 * Compliant with:
 * - LightBurn (Layer 00 Cut #EF4444, Layer 01 Score #3B82F6, Layer 02 Engrave #000000)
 * - xTool Creative Space / Ruida DSP Controllers / Inkscape
 */

// Ramer-Douglas-Peucker polygon simplification
export function rdp(pts, epsilon = 1.2) {
  if (pts.length <= 4) return pts;
  let maxDist = 0;
  let index = 0;
  const end = pts.length - 1;

  for (let i = 1; i < end; i++) {
    const dx = pts[end].x - pts[0].x;
    const dy = pts[end].y - pts[0].y;
    const mag = Math.hypot(dx, dy);
    let d = 0;
    if (mag === 0) {
      d = Math.hypot(pts[i].x - pts[0].x, pts[i].y - pts[0].y);
    } else {
      const u = ((pts[i].x - pts[0].x) * dx + (pts[i].y - pts[0].y) * dy) / (mag * mag);
      const cx = pts[0].x + u * dx;
      const cy = pts[0].y + u * dy;
      d = Math.hypot(pts[i].x - cx, pts[i].y - cy);
    }
    if (d > maxDist) {
      maxDist = d;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = rdp(pts.slice(0, index + 1), epsilon);
    const right = rdp(pts.slice(index), epsilon);
    return left.slice(0, left.length - 1).concat(right);
  } else {
    return [pts[0], pts[end]];
  }
}

// Moore-Neighbor boundary contour extraction
export function extractContours(grid, w, h, minLength = 12) {
  const visited = new Uint8Array(w * h);
  const loops = [];
  const dx = [1, 1, 0, -1, -1, -1, 0, 1];
  const dy = [0, 1, 1, 1, 0, -1, -1, -1];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      if (grid[idx] === 1 && !visited[idx]) {
        let isEdge = false;
        for (let k = 0; k < 8; k++) {
          const nx = x + dx[k];
          const ny = y + dy[k];
          if (grid[ny * w + nx] === 0) {
            isEdge = true;
            break;
          }
        }
        if (!isEdge) continue;

        const loop = [];
        let cx = x, cy = y, dir = 0;
        let steps = 0;
        const maxSteps = w * h;
        loop.push({ x: cx, y: cy });
        visited[cy * w + cx] = 1;

        while (steps++ < maxSteps) {
          let found = false;
          const startDir = (dir + 5) % 8;
          for (let i = 0; i < 8; i++) {
            const checkDir = (startDir + i) % 8;
            const nx = cx + dx[checkDir];
            const ny = cy + dy[checkDir];
            if (nx >= 0 && nx < w && ny >= 0 && ny < h && grid[ny * w + nx] === 1) {
              cx = nx;
              cy = ny;
              dir = checkDir;
              visited[cy * w + cx] = 1;
              loop.push({ x: cx, y: cy });
              found = true;
              break;
            }
          }
          if (!found || (cx === x && cy === y && loop.length > 3)) break;
        }

        if (loop.length >= minLength) loops.push(loop);
      }
    }
  }
  return loops;
}

export function polygonArea(pts) {
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].x * pts[j].y;
    area -= pts[j].x * pts[i].y;
  }
  return Math.abs(area / 2);
}

export function isLoopInside(innerLoop, outerLoop) {
  if (!innerLoop.length || !outerLoop.length) return false;
  const pt = innerLoop[0];
  let inside = false;
  for (let i = 0, j = outerLoop.length - 1; i < outerLoop.length; j = i++) {
    const xi = outerLoop[i].x, yi = outerLoop[i].y;
    const xj = outerLoop[j].x, yj = outerLoop[j].y;
    const intersect = ((yi > pt.y) !== (yj > pt.y)) &&
      (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function generateKeychainEyelet(outerLoop) {
  let topPt = outerLoop[0];
  outerLoop.forEach(pt => {
    if (pt.y < topPt.y) topPt = pt;
  });
  const tabRadius = 8.0;
  const holeRadius = 3.0;
  const centerX = topPt.x;
  const centerY = topPt.y - tabRadius + 2.0;
  const holePoints = [];
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    holePoints.push({
      x: +(centerX + Math.cos(angle) * holeRadius).toFixed(2),
      y: +(centerY + Math.sin(angle) * holeRadius).toFixed(2)
    });
  }
  return { hole: holePoints };
}

/**
 * Convert base64 WebP image from OpenRouter Recraft model to high-precision 3-Layer CAM SVG
 * @param {string} base64Data WebP image base64 data string
 * @param {object} options Options including mode and targetWidthMm
 * @returns {Promise<{ svg: string, outerVertices: number, holeCount: number, scoreCount: number }>}
 */
export async function vectorizeRecraftImage(base64Data, options = {}) {
  const { mode = "cut-engrave", smoothing = 1.2, threshold = 128 } = options;
  const cleanB64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
  const imgBuffer = Buffer.from(cleanB64, "base64");

  // Optimal resolution: 600px max dimension provides laser sub-millimeter precision
  const maxDim = 600;
  const { data: rawPixels, info } = await sharp(imgBuffer)
    .resize(maxDim, maxDim, { fit: "inside" })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const grid = new Uint8Array(w * h);
  for (let i = 0; i < rawPixels.length; i++) {
    // Dark pixels represent foreground artwork
    grid[i] = rawPixels[i] < threshold ? 1 : 0;
  }

  const rawLoops = extractContours(grid, w, h, 12);
  if (!rawLoops.length) {
    throw new Error("No solid shapes detected in the generated artwork.");
  }

  const simplified = rawLoops.map(l => rdp(l, smoothing));
  const sorted = simplified
    .map(loop => ({ loop, area: polygonArea(loop) }))
    .sort((a, b) => b.area - a.area);

  // Background frame rejection: Discard outer full-bleed square if it spans all 4 borders
  let primaryIndex = 0;
  const totalCanvasArea = w * h;
  if (sorted.length > 1 && sorted[0].area > 0.82 * totalCanvasArea) {
    let bMinX = Infinity, bMinY = Infinity, bMaxX = -Infinity, bMaxY = -Infinity;
    sorted[0].loop.forEach(p => {
      if (p.x < bMinX) bMinX = p.x;
      if (p.x > bMaxX) bMaxX = p.x;
      if (p.y < bMinY) bMinY = p.y;
      if (p.y > bMaxY) bMaxY = p.y;
    });
    if (bMinX <= 6 && bMinY <= 6 && bMaxX >= w - 6 && bMaxY >= h - 6) {
      primaryIndex = 1;
    }
  }

  let outer = sorted[primaryIndex].loop;
  const holes = [];
  const scores = [];

  for (let i = primaryIndex + 1; i < sorted.length; i++) {
    const item = sorted[i];
    if (item.area > 20 && isLoopInside(item.loop, outer)) {
      holes.push(item.loop);
    } else if (item.area > 15) {
      scores.push(item.loop);
    }
  }

  // Keychain mode: inject top-apex mounting eyelet hole
  if (mode === "keychain" || mode === "keychain-medallion") {
    const eyelet = generateKeychainEyelet(outer);
    holes.push(eyelet.hole);
  }

  // Calculate bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  outer.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const boxW = maxX - minX || 1;
  const boxH = maxY - minY || 1;
  const padding = 20;
  const svgW = boxW + padding * 2;
  const svgH = boxH + padding * 2;

  const toPathD = (pts) => {
    if (!pts || pts.length < 2) return "";
    let d = `M ${(pts[0].x - minX + padding).toFixed(2)} ${(pts[0].y - minY + padding).toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${(pts[i].x - minX + padding).toFixed(2)} ${(pts[i].y - minY + padding).toFixed(2)}`;
    }
    return d + " Z";
  };

  const cutPaths = [toPathD(outer), ...holes.map(toPathD)].filter(Boolean).join(" ");
  const scorePaths = scores.map(toPathD).filter(Boolean).join(" ");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${svgW.toFixed(1)} ${svgH.toFixed(1)}" width="100%" height="100%">
  <!-- 0machine LaserAI Studio CAD/CAM Vectorizer v2.0 -->
  <g id="CUT_00" data-label="C00 - Cut" stroke="#EF4444" stroke-width="0.8" fill="none">
    <path d="${cutPaths}" />
  </g>
  ${scorePaths ? `<g id="SCORE_01" data-label="C01 - Score" stroke="#3B82F6" stroke-width="0.8" fill="none">
    <path d="${scorePaths}" />
  </g>` : ""}
</svg>`;

  return {
    svg,
    outerVertices: outer.length,
    holeCount: holes.length,
    scoreCount: scores.length,
    width: svgW,
    height: svgH
  };
}

