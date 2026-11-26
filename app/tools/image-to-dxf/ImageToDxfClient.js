"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import {
  Upload,
  Download,
  Sliders,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  FileCode,
  Layers,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { traceImageCanvas, generateDxfString, generateSvgString } from "../../lib/vectorTracer";

const PRESETS = [
  {
    name: "Gear Bracket",
    desc: "Mechanical contour",
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="white"/>
        <g fill="black">
          <circle cx="150" cy="150" r="90"/>
          <circle cx="150" cy="150" r="40" fill="white"/>
          <rect x="135" y="40" width="30" height="30"/>
          <rect x="135" y="230" width="30" height="30"/>
          <rect x="40" y="135" width="30" height="30"/>
          <rect x="230" y="135" width="30" height="30"/>
        </g>
      </svg>
    `)}`,
  },
  {
    name: "Wildlife Emblem",
    desc: "Organic silhouette",
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="white"/>
        <path d="M150,30 C155,45 160,50 170,55 C190,50 220,60 250,90 C220,95 195,110 180,130 C200,140 230,160 260,200 C220,190 190,195 170,210 C165,225 155,250 150,270 C145,250 135,225 130,210 C110,195 80,190 40,200 C70,160 100,140 120,130 C105,110 80,95 50,90 C80,60 110,50 130,55 C140,50 145,45 150,30 Z M150,70 C140,85 130,100 135,115 C142,120 158,120 165,115 C170,100 160,85 150,70 Z" fill="black"/>
      </svg>
    `)}`,
  },
  {
    name: "Wall Clock Face",
    desc: "Radial cutting loops",
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="white"/>
        <g fill="black">
          <circle cx="150" cy="150" r="120" fill="none" stroke="black" stroke-width="12"/>
          <circle cx="150" cy="150" r="16"/>
          <rect x="145" y="50" width="10" height="30"/>
          <rect x="145" y="220" width="10" height="30"/>
          <rect x="50" y="145" width="30" height="10"/>
          <rect x="220" y="145" width="30" height="10"/>
        </g>
      </svg>
    `)}`,
  },
  {
    name: "Ornament Sign",
    desc: "Decorative perimeter",
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="white"/>
        <path d="M150,50 L220,180 L180,180 L210,240 L90,240 L120,180 L80,180 Z" fill="black"/>
        <circle cx="230" cy="80" r="22" fill="black"/>
        <rect x="40" y="240" width="220" height="15" fill="black"/>
      </svg>
    `)}`,
  },
];

export default function ImageToDxfClient() {
  const [imageSrc, setImageSrc] = useState(PRESETS[0].src);
  const [threshold, setThreshold] = useState(140);
  const [invert, setInvert] = useState(false);
  const [smoothing, setSmoothing] = useState(1.4);
  const [targetWidthMm, setTargetWidthMm] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vectorData, setVectorData] = useState({ paths: [], width: 500, height: 500 });
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedDxf, setCopiedDxf] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Process raster image
  const processImage = useCallback(() => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      try {
        const canvas = canvasRef.current || document.createElement("canvas");
        const maxDim = 600;
        let w = img.width || 300;
        let h = img.height || 300;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        const result = traceImageCanvas(canvas, {
          threshold,
          invert,
          simplifyEpsilon: smoothing,
          step: 2,
          minPathLength: 4,
        });

        setVectorData(result);
      } catch (err) {
        console.warn("Failed to process DXF image:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    img.onerror = () => {
      setIsProcessing(false);
    };
  }, [imageSrc, threshold, invert, smoothing]);

  useEffect(() => {
    processImage();
  }, [processImage]);

  // Handle user upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate DXF string
  const currentDxf = generateDxfString(vectorData.paths, vectorData.width, vectorData.height, {
    targetWidthMm,
  });

  // Generate SVG for in-browser visual preview
  const previewSvg = generateSvgString(vectorData.paths, vectorData.width, vectorData.height, {
    targetWidthMm,
    strokeColor: "#abff84",
    strokeWidth: 1.5,
  });

  // Calculate statistics
  const totalEntities = vectorData.paths.length;
  const totalVertices = vectorData.paths.reduce((acc, p) => acc + p.length, 0);

  // Download DXF
  const handleDownloadDxf = () => {
    const blob = new Blob([currentDxf], { type: "application/dxf;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `0machine-cad-vector-${targetWidthMm}mm.dxf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Copy DXF snippet
  const handleCopyDxf = () => {
    navigator.clipboard.writeText(currentDxf.slice(0, 5000));
    setCopiedDxf(true);
    setTimeout(() => setCopiedDxf(false), 2500);
  };

  return (
    <>
      <ParticleField />
      <Navbar />

      <main className="min-h-screen pt-32 pb-24 relative z-10 bg-[#0e100f] text-gray-300">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#abff84] bg-[#abff84]/10 border border-[#abff84]/20 px-3.5 py-1.5 rounded-full mb-4">
              <Cpu size={13} className="text-[#0ae448]" />
              <span>AutoCAD R12 Standard · Millimeter Scaling · 100% Free</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[Outfit] text-[#fffce1] mb-4">
              Image to CAD DXF <span className="text-[#fe7733]">Converter</span>
            </h1>
            <p className="text-[#7c7c6f] text-sm sm:text-base leading-relaxed">
              Transform raster images into closed DXF polylines calibrated for CNC routers, plasma
              cutters, and laser systems. Opens immediately in LightBurn, Fusion 360, Vectric, and AutoCAD.
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            <span className="text-xs font-mono text-[#7c7c6f] uppercase mr-2">Sample Presets:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setImageSrc(preset.src)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  imageSrc === preset.src
                    ? "bg-[#fe7733]/15 text-[#fe7733] border-[#fe7733]/50 font-medium"
                    : "bg-[#191919] text-[#7c7c6f] border-[#42433d]/50 hover:text-white hover:border-[#42433d]"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-12 gap-6 mb-16">
            {/* Left Controls (5 cols) */}
            <div className="lg:col-span-5 bg-[#121311] border border-[#42433d]/70 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Upload */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f] block mb-2">
                    Source Graphic (PNG, JPG)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#42433d] hover:border-[#abff84] transition-colors rounded-xl p-6 text-center cursor-pointer bg-[#0e100f]/60 group"
                  >
                    <Upload className="w-8 h-8 mx-auto text-[#7c7c6f] group-hover:text-[#abff84] transition-colors mb-2" />
                    <p className="text-sm text-[#fffce1] font-medium">Upload image to vectorize</p>
                    <p className="text-xs text-[#7c7c6f] mt-1">PNG, JPG, or WebP</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Binarization Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      Boundary Edge Threshold
                    </label>
                    <span className="text-xs font-mono text-[#abff84]">{threshold}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="235"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-[#abff84] bg-[#191919] cursor-pointer"
                  />
                </div>

                {/* Node Smoothing */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      CAD Polyline Smoothing
                    </label>
                    <span className="text-xs font-mono text-[#abff84]">{smoothing}px</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3.5"
                    step="0.1"
                    value={smoothing}
                    onChange={(e) => setSmoothing(Number(e.target.value))}
                    className="w-full accent-[#abff84] bg-[#191919] cursor-pointer"
                  />
                </div>

                {/* Target Width */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      DXF Bounding Width (mm)
                    </label>
                    <span className="text-xs font-mono text-[#fffce1]">{targetWidthMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={targetWidthMm}
                    onChange={(e) => setTargetWidthMm(Number(e.target.value))}
                    className="w-full accent-[#abff84] bg-[#191919] cursor-pointer"
                  />
                </div>

                {/* Invert */}
                <div className="pt-2">
                  <button
                    onClick={() => setInvert(!invert)}
                    className={`w-full py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                      invert
                        ? "bg-[#abff84]/20 border-[#abff84] text-[#abff84]"
                        : "bg-[#191919] border-[#42433d]/70 text-[#7c7c6f] hover:text-white"
                    }`}
                  >
                    <RefreshCw size={12} />
                    <span>Invert Polarity (Cut Out vs Cut In)</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#42433d]/50 space-y-3">
                <button
                  onClick={handleDownloadDxf}
                  className="w-full py-3.5 px-4 bg-[#abff84] hover:bg-[#96ec6e] text-[#0e100f] font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#abff84]/15 transition-all active:scale-[0.98]"
                >
                  <Download size={16} />
                  <span>{downloadSuccess ? "Downloaded DXF File!" : "Download Cut-Ready DXF"}</span>
                </button>

                <button
                  onClick={handleCopyDxf}
                  className="w-full py-2.5 px-4 bg-[#191919] hover:bg-[#232323] text-[#fffce1] border border-[#42433d]/70 font-mono text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {copiedDxf ? <Check size={14} className="text-[#abff84]" /> : <Copy size={14} />}
                  <span>{copiedDxf ? "Copied DXF Header!" : "Copy DXF Header"}</span>
                </button>
              </div>
            </div>

            {/* Right Live CAD Preview (7 cols) */}
            <div className="lg:col-span-7 bg-[#121311] border border-[#42433d]/70 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#42433d]/50 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#abff84] animate-pulse"></span>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#fffce1]">
                      CAD Vector Preview (Layer: CUT)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#7c7c6f]">
                    <span>Polylines: {totalEntities}</span>
                    <span>Vertices: {totalVertices}</span>
                    <span>Width: {targetWidthMm} mm</span>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="w-full aspect-[4/3] max-h-[460px] bg-[#0e100f] border border-[#42433d]/40 rounded-xl flex items-center justify-center p-4 overflow-hidden relative">
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(#abff84 1px, transparent 1px), radial-gradient(#abff84 1px, #0e100f 1px)",
                      backgroundSize: "24px 24px",
                    }}
                  />

                  {isProcessing ? (
                    <div className="text-center font-mono text-xs text-[#7c7c6f] flex items-center gap-2">
                      <RefreshCw className="animate-spin text-[#abff84]" size={16} />
                      <span>Generating CAD polylines...</span>
                    </div>
                  ) : vectorData.paths.length === 0 ? (
                    <div className="text-center font-mono text-xs text-[#7c7c6f]">
                      No entities detected. Adjust threshold.
                    </div>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: previewSvg }}
                    />
                  )}
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-4 border-t border-[#42433d]/50 flex items-center justify-between text-xs font-mono text-[#7c7c6f]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#abff84]" />
                  <span>Units: $INSUNITS 4 (Millimeters)</span>
                </div>
                <span>AutoCAD R12 ASCII DXF</span>
              </div>
            </div>
          </div>

          {/* Nesting Studio Bridge */}
          <div className="bg-gradient-to-r from-[#191919] via-[#121311] to-[#191919] border border-[#abff84]/40 rounded-2xl p-8 mb-20 relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#abff84] bg-[#abff84]/10 border border-[#abff84]/30 px-3 py-1 rounded-full mb-3 inline-block">
                Stop Wasting Sheet Material
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-[#fffce1] mb-2">
                Need to nest multiple DXF parts into raw sheets?
              </h2>
              <p className="text-sm text-[#7c7c6f] leading-relaxed mb-6">
                Converting parts to DXF is only step one. 0Machine True-Shape Nesting packs irregular
                parts into sheet inventory, nests smaller parts inside internal drop holes, and reduces scrap
                waste by 30% to 40%.
              </p>
              <Link
                href="/tools/nesting"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#abff84] text-[#0e100f] font-bold text-xs uppercase tracking-wider hover:bg-[#96ec6e] transition-all shadow-md"
              >
                <span>Launch Nesting Estimator</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* FAQs */}
          <div className="max-w-4xl mx-auto space-y-8">
            <h3 className="text-xl font-bold font-[Outfit] text-[#fffce1]">
              Image to DXF Technical Guide & FAQs
            </h3>
            <div className="space-y-4">
              <div className="bg-[#121311] border border-[#42433d]/60 p-5 rounded-xl">
                <h4 className="text-sm font-bold text-[#fffce1] mb-2">
                  Why is AutoCAD Release 12 (R12) DXF the industry gold standard?
                </h4>
                <p className="text-xs text-[#7c7c6f] leading-relaxed">
                  R12 DXF is the cleanest, most widely supported vector format in industrial manufacturing.
                  Unlike newer DXF revisions that introduce bloated spline dictionaries, R12 uses pure 2D
                  closed polylines that CNC controllers, plasma torches, and laser cutters parse with zero errors.
                </p>
              </div>

              <div className="bg-[#121311] border border-[#42433d]/60 p-5 rounded-xl">
                <h4 className="text-sm font-bold text-[#fffce1] mb-2">
                  How does coordinate scaling work?
                </h4>
                <p className="text-xs text-[#7c7c6f] leading-relaxed">
                  When you set a target width (e.g., 200 mm), the generator scales all vertex positions
                  proportionally and sets the standard AutoCAD header unit variable ($INSUNITS = 4 for mm).
                  When imported into LightBurn or Fusion 360, dimensions match your physical machine bed exactly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
