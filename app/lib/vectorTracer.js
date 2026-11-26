/**
 * Client-Side Laser & CNC Vector Tracer
 * Pure JavaScript - 0 external dependencies
 * Implements: Binarization, Marching Squares contour tracing, Ramer-Douglas-Peucker simplification,
 * SVG export (with LightBurn C00 Red Cut contours) and AutoCAD R12 DXF export.
 */

export function ramerDouglasPeucker(points, epsilon = 1.0) {
  if (!points || points.length <= 2) return points || [];
  let dmax = 0;
  let index = 0;
  const a = points[0];
  const b = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const num = Math.abs((b.y - a.y) * p.x - (b.x - a.x) * p.y + b.x * a.y - b.y * a.x);
    const den = Math.hypot(b.y - a.y, b.x - a.x);
    const d = den === 0 ? Math.hypot(p.x - a.x, p.y - a.y) : num / den;
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  if (dmax > epsilon) {
    const rec1 = ramerDouglasPeucker(points.slice(0, index + 1), epsilon);
    const rec2 = ramerDouglasPeucker(points.slice(index), epsilon);
    return rec1.slice(0, rec1.length - 1).concat(rec2);
  }
  return [a, b];
}

export function traceImageCanvas(canvas, options = {}) {
  const {
    threshold = 128,
    invert = false,
    simplifyEpsilon = 1.2,
    minPathLength = 4,
    step = 2, // downsample grid step for high-res images
  } = options;

  if (!canvas) return { paths: [], width: 0, height: 0 };

  const ctx = canvas.getContext("2d");
  const origW = canvas.width;
  const origH = canvas.height;
  if (!origW || !origH) return { paths: [], width: 0, height: 0 };

  let data;
  try {
    const imgData = ctx.getImageData(0, 0, origW, origH);
    data = imgData.data;
  } catch (err) {
    console.warn("traceImageCanvas: unable to read canvas pixels (CORS or canvas security)", err);
    return { paths: [], width: origW, height: origH };
  }

  // Build binary grid with downsample step
  const gridW = Math.floor(origW / step);
  const gridH = Math.floor(origH / step);
  const grid = new Uint8Array(gridW * gridH);

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const px = gx * step;
      const py = gy * step;
      const idx = (py * origW + px) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Alpha check
      if (a < 50) {
        grid[gy * gridW + gx] = invert ? 1 : 0;
      } else {
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const isDark = lum < threshold;
        grid[gy * gridW + gx] = invert ? (isDark ? 0 : 1) : (isDark ? 1 : 0);
      }
    }
  }

  // Marching Squares Segments
  const segments = [];

  for (let gy = 0; gy < gridH - 1; gy++) {
    for (let gx = 0; gx < gridW - 1; gx++) {
      const tl = grid[gy * gridW + gx];
      const tr = grid[gy * gridW + (gx + 1)];
      const br = grid[(gy + 1) * gridW + (gx + 1)];
      const bl = grid[(gy + 1) * gridW + gx];

      const mask = (tl << 3) | (tr << 2) | (br << 1) | bl;
      if (mask === 0 || mask === 15) continue;

      // Midpoints in original canvas pixels
      const top = { x: (gx + 0.5) * step, y: gy * step };
      const right = { x: (gx + 1) * step, y: (gy + 0.5) * step };
      const bottom = { x: (gx + 0.5) * step, y: (gy + 1) * step };
      const left = { x: gx * step, y: (gy + 0.5) * step };

      switch (mask) {
        case 1: segments.push([left, bottom]); break;
        case 2: segments.push([bottom, right]); break;
        case 3: segments.push([left, right]); break;
        case 4: segments.push([top, right]); break;
        case 5:
          segments.push([left, top]);
          segments.push([bottom, right]);
          break;
        case 6: segments.push([top, bottom]); break;
        case 7: segments.push([left, top]); break;
        case 8: segments.push([left, top]); break;
        case 9: segments.push([top, bottom]); break;
        case 10:
          segments.push([top, right]);
          segments.push([left, bottom]);
          break;
        case 11: segments.push([top, right]); break;
        case 12: segments.push([left, right]); break;
        case 13: segments.push([bottom, right]); break;
        case 14: segments.push([left, bottom]); break;
      }
    }
  }

  // Chain segments into polylines
  const map = new Map();
  function key(p) {
    return `${Math.round(p.x * 10)},${Math.round(p.y * 10)}`;
  }

  segments.forEach((s, idx) => {
    const k1 = key(s[0]);
    const k2 = key(s[1]);
    if (!map.has(k1)) map.set(k1, []);
    if (!map.has(k2)) map.set(k2, []);
    map.get(k1).push({ seg: s, to: s[1], from: s[0], idx });
    map.get(k2).push({ seg: s, to: s[0], from: s[1], idx });
  });

  const visited = new Set();
  const rawPaths = [];

  for (let i = 0; i < segments.length; i++) {
    if (visited.has(i)) continue;
    visited.add(i);

    const path = [segments[i][0], segments[i][1]];
    let curr = segments[i][1];
    let extended = true;

    while (extended) {
      extended = false;
      const k = key(curr);
      const candidates = map.get(k) || [];
      for (const cand of candidates) {
        if (!visited.has(cand.idx)) {
          visited.add(cand.idx);
          path.push(cand.to);
          curr = cand.to;
          extended = true;
          break;
        }
      }
    }

    if (path.length >= minPathLength) {
      rawPaths.push(path);
    }
  }

  // Simplify each path with RDP
  const paths = rawPaths.map((p) => {
    if (simplifyEpsilon > 0) {
      return ramerDouglasPeucker(p, simplifyEpsilon);
    }
    return p;
  });

  return { paths, width: origW, height: origH };
}

/**
 * Generate standard SVG string from paths
 */
export function generateSvgString(paths, width, height, options = {}) {
  const {
    strokeColor = "#EF4444",
    strokeWidth = 1.5,
    fill = "none",
    unit = "mm",
    targetWidthMm = 150,
  } = options;

  const scale = width > 0 ? targetWidthMm / width : 1;
  const targetHeightMm = Math.round((height * scale) * 10) / 10;

  let pathData = "";
  for (const path of paths) {
    if (!path || path.length < 2) continue;
    const pts = path.map((pt) => `${(pt.x * scale).toFixed(2)},${(pt.y * scale).toFixed(2)}`);
    pathData += `M ${pts[0]} L ${pts.slice(1).join(" ")} Z\n`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${targetWidthMm} ${targetHeightMm}"
     width="${targetWidthMm}${unit}"
     height="${targetHeightMm}${unit}">
  <!-- Generated by 0Machine Laser CAD Vector Engine (LightBurn Ready) -->
  <g id="CUT_LAYER_C00" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fill}">
    <path d="${pathData.trim()}" />
  </g>
</svg>`;
}

/**
 * Generate standard AutoCAD R12 DXF string from paths
 */
export function generateDxfString(paths, width, height, options = {}) {
  const { targetWidthMm = 150 } = options;
  const scale = width > 0 ? targetWidthMm / width : 1;
  const targetHeightMm = height * scale;

  let dxf = "";
  dxf += "0\nSECTION\n2\nHEADER\n";
  dxf += "9\n$INSUNITS\n70\n4\n"; // 4 = Millimeters
  dxf += "0\nENDSEC\n";

  dxf += "0\nSECTION\n2\nTABLES\n";
  dxf += "0\nTABLE\n2\nLAYER\n70\n1\n";
  dxf += "0\nLAYER\n2\n0\n70\n0\n62\n7\n6\nCONTINUOUS\n";
  dxf += "0\nLAYER\n2\nCUT\n70\n0\n62\n1\n6\nCONTINUOUS\n"; // 1 = Red (LightBurn C00)
  dxf += "0\nENDTAB\n0\nENDSEC\n";

  dxf += "0\nSECTION\n2\nENTITIES\n";

  for (const path of paths) {
    if (!path || path.length < 2) continue;
    dxf += "0\nPOLYLINE\n8\nCUT\n66\n1\n70\n1\n"; // 70=1 is closed polyline
    for (const pt of path) {
      const x = (pt.x * scale).toFixed(3);
      // Invert Y coordinate for standard Cartesian / CAD coordinate system
      const y = (targetHeightMm - pt.y * scale).toFixed(3);
      dxf += `0\nVERTEX\n8\nCUT\n10\n${x}\n20\n${y}\n30\n0.0\n`;
    }
    dxf += "0\nSEQEND\n8\nCUT\n";
  }

  dxf += "0\nENDSEC\n0\nEOF\n";
  return dxf;
}
