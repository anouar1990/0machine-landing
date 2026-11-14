/**
 * 0Machine CAD Vector Export Engine (Web)
 * Generates standard AutoCAD DXF R12 and clean SVG files compatible with:
 * LightBurn, LaserGRBL, RDWorks, AutoCAD, Fusion 360, Illustrator, Inkscape.
 */

export function triggerDownload(filename, content, mimeType = "application/dxf") {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateDxfString({ lines = [], polylines = [], texts = [] }) {
  const out = [];

  // Header section
  out.push("0", "SECTION", "2", "HEADER");
  out.push("9", "$ACADVER", "1", "AC1009"); // AutoCAD R12 standard
  out.push("9", "$INSUNITS", "70", "4");    // Millimeters
  out.push("0", "ENDSEC");

  // Tables section (Layers)
  out.push("0", "SECTION", "2", "TABLES");
  out.push("0", "TABLE", "2", "LAYER", "70", "2");
  out.push("0", "LAYER", "2", "CUT", "70", "0", "62", "1", "6", "CONTINUOUS"); // Color 1: Red
  out.push("0", "LAYER", "2", "ENGRAVE", "70", "0", "62", "5", "6", "CONTINUOUS"); // Color 5: Blue
  out.push("0", "ENDTAB");
  out.push("0", "ENDSEC");

  // Entities section
  out.push("0", "SECTION", "2", "ENTITIES");

  // Straight Lines
  for (const line of lines) {
    out.push("0", "LINE");
    out.push("8", line.layer || "CUT");
    out.push("10", Number(line.x1).toFixed(3));
    out.push("20", Number(line.y1).toFixed(3));
    out.push("30", "0.0");
    out.push("11", Number(line.x2).toFixed(3));
    out.push("21", Number(line.y2).toFixed(3));
    out.push("31", "0.0");
  }

  // 2D Polylines
  for (const poly of polylines) {
    if (!poly.points || poly.points.length < 2) continue;
    out.push("0", "POLYLINE");
    out.push("8", poly.layer || "CUT");
    out.push("66", "1");
    out.push("70", poly.closed ? "1" : "0");
    out.push("10", "0.0");
    out.push("20", "0.0");
    out.push("30", "0.0");

    for (const pt of poly.points) {
      out.push("0", "VERTEX");
      out.push("8", poly.layer || "CUT");
      out.push("10", Number(pt.x).toFixed(3));
      out.push("20", Number(pt.y).toFixed(3));
      out.push("30", "0.0");
    }
    out.push("0", "SEQEND");
  }

  // Text Entities
  for (const txt of texts) {
    out.push("0", "TEXT");
    out.push("8", txt.layer || "ENGRAVE");
    out.push("10", Number(txt.x).toFixed(3));
    out.push("20", Number(txt.y).toFixed(3));
    out.push("30", "0.0");
    out.push("40", Number(txt.height || 2.5).toFixed(3));
    out.push("1", String(txt.text));
  }

  out.push("0", "ENDSEC");
  out.push("0", "EOF");

  return out.join("\r\n");
}

