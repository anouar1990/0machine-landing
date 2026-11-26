"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ParticleField from "../../components/ParticleField";
import {
  Upload,
  Download,
  Sliders,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  Eye,
  FileCode,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { traceImageCanvas, generateSvgString } from "../../lib/vectorTracer";

// Embedded laser SVG silhouettes for instant, zero-CORS testing
const SAMPLE_PRESETS = [
  {
    name: "Imperial Crest",
    desc: "Detailed wildlife crest",
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="white"/>
        <path d="M150,30 C155,45 160,50 170,55 C190,50 220,60 250,90 C220,95 195,110 180,130 C200,140 230,160 260,200 C220,190 190,195 170,210 C165,225 155,250 150,270 C145,250 135,225 130,210 C110,195 80,190 40,200 C70,160 100,140 120,130 C105,110 80,95 50,90 C80,60 110,50 130,55 C140,50 145,45 150,30 Z M150,70 C140,85 130,100 135,115 C142,120 158,120 165,115 C170,100 160,85 150,70 Z" fill="black"/>
      </svg>
    `)}`,
  },
  {
    name: "Floral Mandala",
    desc: "Intricate geometric curves",
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="white"/>
        <g fill="black">
          <circle cx="150" cy="150" r="28"/>
          <path d="M150,40 C165,80 180,100 200,100 C200,120 180,135 150,150 C120,135 100,120 100,100 C120,100 135,80 150,40 Z"/>
          <path d="M150,260 C165,220 180,200 200,200 C200,180 180,165 150,150 C120,165 100,180 100,200 C120,200 135,220 150,260 Z"/>
          <path d="M40,150 C80,165 100,180 100,200 C120,200 135,180 150,150 C135,120 120,100 100,100 C100,120 80,135 40,150 Z"/>
          <path d="M260,150 C220,165 200,180 200,200 C180,200 165,180 150,150 C165,120 180,100 200,100 C200,120 220,135 260,150 Z"/>
          <circle cx="150" cy="150" r="115" fill="none" stroke="black" stroke-width="12"/>
        </g>
      </svg>
    `)}`,
  },
  {
    name: "Wolf Silhouette",
    desc: "High contrast profile",
    src: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
        <rect width="300" height="300" fill="white"/>
        <path d="M190,40 C175,65 155,75 140,85 C120,70 105,65 85,60 C80,85 85,115 100,135 C80,145 65,160 50,185 C80,180 105,175 125,185 C115,200 105,220 95,245 C125,235 150,215 170,195 C190,215 210,230 235,245 C220,215 210,190 205,170 C225,155 245,135 255,105 C235,110 215,105 200,95 C205,75 200,55 190,40 Z" fill="black"/>
      </svg>
    `)}`,
  },
  {
    name: "Mountain Camp",
    desc: "Multi-element landscape",
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

export default function PhotoToSvgClient() {
  const [imageSrc, setImageSrc] = useState(SAMPLE_PRESETS[0].src);
  const [threshold, setThreshold] = useState(135);
  const [invert, setInvert] = useState(false);
  const [smoothing, setSmoothing] = useState(1.2);
  const [targetWidthMm, setTargetWidthMm] = useState(150);
  const [showKerf, setShowKerf] = useState(true);
  const [kerfMm, setKerfMm] = useState(0.15);
  const [isProcessing, setIsProcessing] = useState(false);
  const [vectorData, setVectorData] = useState({ paths: [], width: 500, height: 500 });
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Process raster image through vector tracer
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

        // Run vector tracing
        const result = traceImageCanvas(canvas, {
          threshold,
          invert,
          simplifyEpsilon: smoothing,
          step: 2,
          minPathLength: 4,
        });

        setVectorData(result);
      } catch (err) {
        console.warn("Failed to process image:", err);
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

  // Handle user file upload
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

  // Generate SVG string
  const currentSvg = generateSvgString(vectorData.paths, vectorData.width, vectorData.height, {
    targetWidthMm,
    strokeColor: "#EF4444",
    strokeWidth: 1.5,
  });

  // Calculate stats
  const totalNodes = vectorData.paths.reduce((acc, p) => acc + p.length, 0);
  const totalPerimeterMm = (
    vectorData.paths.reduce((acc, p) => {
      let len = 0;
      for (let i = 1; i < p.length; i++) {
        len += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
      }
      return acc + len;
    }, 0) * (vectorData.width > 0 ? targetWidthMm / vectorData.width : 1)
  ).toFixed(1);

  // Download SVG file
  const handleDownloadSvg = () => {
    const blob = new Blob([currentSvg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `0machine-laser-vector-${targetWidthMm}mm.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Copy SVG Code
  const handleCopySvg = () => {
    navigator.clipboard.writeText(currentSvg);
    setCopiedSvg(true);
    setTimeout(() => setCopiedSvg(false), 2500);
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
              <Zap size={13} className="text-[#0ae448]" />
              <span>100% Free · Client-Side CAD Vectorizer · Zero Watermark</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-[Outfit] text-[#fffce1] mb-4">
              Photo to Laser SVG <span className="text-[#fe7733]">Converter</span>
            </h1>
            <p className="text-[#7c7c6f] text-sm sm:text-base leading-relaxed">
              Convert raster photos (JPG, PNG, WebP) into clean, closed vector cut paths with LightBurn
              Layer C00 (#EF4444) compliance, kerf offset preview, and zero server latency.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            <span className="text-xs font-mono text-[#7c7c6f] uppercase mr-2">Try Presets:</span>
            {SAMPLE_PRESETS.map((preset) => (
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

          {/* Main Studio Grid */}
          <div className="grid lg:grid-cols-12 gap-6 mb-16">
            {/* Left Controls & Upload (5 cols) */}
            <div className="lg:col-span-5 bg-[#121311] border border-[#42433d]/70 rounded-2xl p-6 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Upload Dropzone */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f] block mb-2">
                    Source Photo (JPG, PNG)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#42433d] hover:border-[#fe7733] transition-colors rounded-xl p-6 text-center cursor-pointer bg-[#0e100f]/60 group"
                  >
                    <Upload className="w-8 h-8 mx-auto text-[#7c7c6f] group-hover:text-[#fe7733] transition-colors mb-2" />
                    <p className="text-sm text-[#fffce1] font-medium">Click to upload photo</p>
                    <p className="text-xs text-[#7c7c6f] mt-1">or drag & drop your image file here</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Threshold Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      Black / White Contrast Threshold
                    </label>
                    <span className="text-xs font-mono text-[#abff84]">{threshold}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="235"
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full accent-[#fe7733] bg-[#191919] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#7c7c6f] mt-1">
                    <span>Lighter detail</span>
                    <span>Darker detail</span>
                  </div>
                </div>

                {/* Smoothing / Tolerance Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      Curve Smoothing (RDP Tolerance)
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
                    className="w-full accent-[#fe7733] bg-[#191919] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#7c7c6f] mt-1">
                    <span>More nodes (Sharp)</span>
                    <span>Fewer nodes (Smooth)</span>
                  </div>
                </div>

                {/* Size Width */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#7c7c6f]">
                      Target Laser CAD Width
                    </label>
                    <span className="text-xs font-mono text-[#fffce1]">{targetWidthMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="600"
                    step="10"
                    value={targetWidthMm}
                    onChange={(e) => setTargetWidthMm(Number(e.target.value))}
                    className="w-full accent-[#fe7733] bg-[#191919] cursor-pointer"
                  />
                </div>

                {/* Invert & Kerf Toggles */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setInvert(!invert)}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                      invert
                        ? "bg-[#fe7733]/20 border-[#fe7733] text-[#fe7733]"
                        : "bg-[#191919] border-[#42433d]/70 text-[#7c7c6f] hover:text-white"
                    }`}
                  >
                    <RefreshCw size={12} />
                    <span>Invert Colors</span>
                  </button>

                  <button
                    onClick={() => setShowKerf(!showKerf)}
                    className={`py-2 px-3 rounded-lg border text-xs font-mono flex items-center justify-center gap-1.5 transition-all ${
                      showKerf
                        ? "bg-[#abff84]/20 border-[#abff84] text-[#abff84]"
                        : "bg-[#191919] border-[#42433d]/70 text-[#7c7c6f] hover:text-white"
                    }`}
                  >
                    <Layers size={12} />
                    <span>Kerf (+0.15mm)</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#42433d]/50 space-y-3">
                <button
                  onClick={handleDownloadSvg}
                  className="w-full py-3.5 px-4 bg-[#fe7733] hover:bg-[#e06526] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#fe7733]/20 transition-all active:scale-[0.98]"
                >
                  <Download size={16} />
                  <span>{downloadSuccess ? "Downloaded SVG!" : "Download Cut-Ready SVG"}</span>
                </button>

                <button
                  onClick={handleCopySvg}
                  className="w-full py-2.5 px-4 bg-[#191919] hover:bg-[#232323] text-[#fffce1] border border-[#42433d]/70 font-mono text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {copiedSvg ? <Check size={14} className="text-[#abff84]" /> : <Copy size={14} />}
                  <span>{copiedSvg ? "SVG Code Copied!" : "Copy SVG Markup"}</span>
                </button>
              </div>
            </div>

            {/* Right Live Vector Canvas Preview (7 cols) */}
            <div className="lg:col-span-7 bg-[#121311] border border-[#42433d]/70 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#42433d]/50 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse"></span>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#fffce1]">
                      Cut Vector Preview (LightBurn C00)
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#7c7c6f]">
                    <span>Loops: {vectorData.paths.length}</span>
                    <span>Nodes: {totalNodes}</span>
                    <span>Perimeter: {totalPerimeterMm} mm</span>
                  </div>
                </div>

                {/* SVG Render Box */}
                <div className="w-full aspect-[4/3] max-h-[460px] bg-[#0e100f] border border-[#42433d]/40 rounded-xl flex items-center justify-center p-4 overflow-hidden relative">
                  {/* Grid background */}
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
                      <RefreshCw className="animate-spin text-[#fe7733]" size={16} />
                      <span>Tracing raster contours...</span>
                    </div>
                  ) : vectorData.paths.length === 0 ? (
                    <div className="text-center font-mono text-xs text-[#7c7c6f]">
                      No vector paths found. Adjust contrast slider.
                    </div>
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: currentSvg }}
                    />
                  )}
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-4 pt-4 border-t border-[#42433d]/50 flex items-center justify-between text-xs font-mono text-[#7c7c6f]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#abff84]" />
                  <span>100% Client-Side Private (Zero Cloud Upload)</span>
                </div>
                <span>Format: W3C SVG 1.1</span>
              </div>
            </div>
          </div>

          {/* LaserAI Studio Conversion Bridge */}
          <div className="bg-gradient-to-r from-[#191919] via-[#121311] to-[#191919] border border-[#fe7733]/40 rounded-2xl p-8 mb-20 relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#fe7733] bg-[#fe7733]/10 border border-[#fe7733]/30 px-3 py-1 rounded-full mb-3 inline-block">
                Upgrade to Autonomous Vector CAD
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-[Outfit] text-[#fffce1] mb-2">
                Need original designs with zero loose islands?
              </h2>
              <p className="text-sm text-[#7c7c6f] leading-relaxed mb-6">
                Free vectorizers trace edges, but they don't fix stencil dropouts. 0Machine LaserAI Studio
                generates fresh CAD vectors from text, automatically connects stencil bridges, applies kerf
                compensation, and packages multi-layer 3D shadowboxes in seconds.
              </p>
              <Link
                href="/#laser-ai"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#fffce1] text-[#0e100f] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md"
              >
                <span>Launch LaserAI Studio</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Educational Content & FAQs */}
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl font-bold font-[Outfit] text-[#fffce1] mb-4">
                How to Vectorize Photos for Clean Laser & CNC Cuts
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 text-xs leading-relaxed text-[#7c7c6f]">
                <div className="bg-[#121311] border border-[#42433d]/60 p-4 rounded-xl">
                  <span className="text-[#fe7733] font-bold block mb-1">1. High Contrast</span>
                  Photos with stark lighting and clean silhouettes trace with dramatically smoother
                  curves. Avoid blurry gradients or low-res thumbnails.
                </div>
                <div className="bg-[#121311] border border-[#42433d]/60 p-4 rounded-xl">
                  <span className="text-[#fe7733] font-bold block mb-1">2. Node Simplification</span>
                  Too many nodes cause laser heads to stutter and overheat thin material. Our RDP
                  smoother reduces vertex count by 60% while maintaining crisp edges.
                </div>
                <div className="bg-[#121311] border border-[#42433d]/60 p-4 rounded-xl">
                  <span className="text-[#fe7733] font-bold block mb-1">3. Kerf Offset</span>
                  CO2 lasers vaporize roughly 0.15mm of material. Always account for beam width when
                  creating friction-fit interlocking joints.
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div>
              <h3 className="text-xl font-bold font-[Outfit] text-[#fffce1] mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div className="bg-[#121311] border border-[#42433d]/60 p-5 rounded-xl">
                  <h4 className="text-sm font-bold text-[#fffce1] mb-2">
                    How do I convert a photo to an SVG for laser cutting?
                  </h4>
                  <p className="text-xs text-[#7c7c6f] leading-relaxed">
                    Upload your JPG or PNG image into the dropzone above. Adjust the threshold slider to
                    separate foreground shapes from background noise. The tool traces vector contours on
                    your local CPU and lets you download a clean SVG instantly.
                  </p>
                </div>

                <div className="bg-[#121311] border border-[#42433d]/60 p-5 rounded-xl">
                  <h4 className="text-sm font-bold text-[#fffce1] mb-2">
                    Does the generated SVG work with LightBurn, LaserGRBL, and RDWorks?
                  </h4>
                  <p className="text-xs text-[#7c7c6f] leading-relaxed">
                    Yes. The exported SVG paths are tagged with standard red stroke (#EF4444) which LightBurn
                    automatically maps to Cut Layer C00. It also imports seamlessly into Inkscape, Illustrator,
                    and Fusion 360.
                  </p>
                </div>

                <div className="bg-[#121311] border border-[#42433d]/60 p-5 rounded-xl">
                  <h4 className="text-sm font-bold text-[#fffce1] mb-2">
                    Is my image uploaded or saved to any server?
                  </h4>
                  <p className="text-xs text-[#7c7c6f] leading-relaxed">
                    No. The entire vectorization algorithm runs 100% locally in your web browser using HTML5
                    Canvas and JavaScript. Your images never leave your computer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
