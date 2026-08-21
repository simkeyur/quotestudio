import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Smartphone,
  Square,
  RectangleVertical,
  RectangleHorizontal,
  RefreshCw,
  ChevronDown,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { ASPECT_RATIOS } from '../constants/fonts';

export default function Header({
  aspectRatio,
  onAspectRatioChange,
  onExport,
  onCopy,
  onRandomize,
  isExporting,
  copied,
  scale,
  setScale,
  autoFit,
  setAutoFit
}) {
  const [downloadDropdown, setDownloadDropdown] = useState(false);
  const [aspectDropdown, setAspectDropdown] = useState(false);

  const getAspectIcon = (id) => {
    switch (id) {
      case '1:1':
        return Square;
      case '4:5':
        return RectangleVertical;
      case '9:16':
        return Smartphone;
      case '16:9':
        return RectangleHorizontal;
      default:
        return Square;
    }
  };

  const CurrentAspectIcon = getAspectIcon(aspectRatio);
  const currentRatioObj = ASPECT_RATIOS.find((r) => r.id === aspectRatio) || ASPECT_RATIOS[0];

  return (
    <header className="h-16 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 select-none transition-all">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <img
          src="./logo.png"
          alt="Quote Studio"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-md ring-1 ring-white/10 object-cover shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
            Quote Studio
          </h1>
          <p className="text-[10px] text-zinc-400 hidden sm:block">Minimalist Social Card Studio</p>
        </div>
      </div>

      {/* Aspect Ratio Selector: Mobile Dropdown (hidden on md:) */}
      <div className="relative md:hidden">
        <button
          onClick={() => setAspectDropdown(!aspectDropdown)}
          className="h-8 px-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md active:scale-95 shadow-sm cursor-pointer"
          title="Change Aspect Ratio"
        >
          <CurrentAspectIcon size={12} />
          <span className="text-[11px] font-mono">{aspectRatio}</span>
          <ChevronDown size={11} className={`text-zinc-400 transition-transform ${aspectDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Mobile Dropdown Menu */}
        {aspectDropdown && (
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 rounded-2xl bg-zinc-950/95 border border-white/10 shadow-2xl p-1.5 z-50 animate-fadeIn backdrop-blur-xl space-y-1"
            onMouseLeave={() => setAspectDropdown(false)}
          >
            {ASPECT_RATIOS.map((ratio) => {
              const Icon = getAspectIcon(ratio.id);
              const isSelected = aspectRatio === ratio.id;
              return (
                <button
                  key={ratio.id}
                  onClick={() => {
                    onAspectRatioChange(ratio.id);
                    setAspectDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <div className="flex flex-col leading-tight">
                      <span>{ratio.tag}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-zinc-600' : 'text-zinc-500'}`}>
                        {ratio.dimensions} ({ratio.id})
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-black" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Aspect Ratio Selector: Desktop Full Segmented Pill (hidden on < md:) */}
      <div className="hidden md:flex items-center bg-zinc-900/60 p-1 rounded-full border border-white/[0.08] backdrop-blur-md shadow-sm">
        {ASPECT_RATIOS.map((ratio) => {
          const Icon = getAspectIcon(ratio.id);
          const isSelected = aspectRatio === ratio.id;
          return (
            <button
              key={ratio.id}
              onClick={() => onAspectRatioChange(ratio.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
              }`}
              title={ratio.tag}
            >
              <Icon size={12} />
              <span className="text-[11px]">{ratio.id}</span>
            </button>
          );
        })}
      </div>

      {/* Zoom & Fit Controls (Integrated in Navbar, completely outside the preview image) */}
      <div className="hidden lg:flex items-center bg-zinc-900/60 p-1 rounded-full border border-white/[0.08] backdrop-blur-md">
        <button
          onClick={() => {
            setAutoFit?.(false);
            setScale?.((s) => Math.max(0.15, s - 0.05));
          }}
          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut size={12} />
        </button>
        <span className="text-[10px] font-mono text-zinc-300 px-1.5 select-none">
          {Math.round((scale ?? 0.4) * 100)}%
        </span>
        <button
          onClick={() => {
            setAutoFit?.(false);
            setScale?.((s) => Math.min(1.0, s + 0.05));
          }}
          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn size={12} />
        </button>
        <div className="h-3 w-px bg-white/10 mx-0.5" />
        <button
          onClick={() => setAutoFit?.(true)}
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
            autoFit
              ? 'bg-white text-black shadow-sm'
              : 'hover:bg-white/10 text-zinc-400 hover:text-white'
          }`}
          title="Auto Fit Preview"
        >
          <Maximize2 size={10} />
          <span>Fit</span>
        </button>
      </div>

      {/* Actions (Free, Airy Pill Buttons) */}
      <div className="flex items-center gap-2">
        {/* Shuffle / Randomize */}
        <button
          onClick={onRandomize}
          className="h-8 px-2.5 sm:px-3 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md active:scale-95"
          title="Shuffle Quote & Background"
        >
          <RefreshCw size={13} />
          <span className="hidden sm:inline text-[11px]">Shuffle</span>
        </button>

        {/* Copy to Clipboard */}
        <button
          onClick={onCopy}
          disabled={isExporting}
          className={`h-8 px-2.5 sm:px-3 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md active:scale-95 ${
            copied
              ? 'bg-zinc-800 border-zinc-600 text-white'
              : 'bg-zinc-900/60 hover:bg-zinc-800 border-white/[0.08] text-zinc-300 hover:text-white'
          }`}
          title="Copy Image to Clipboard"
        >
          {copied ? <Check size={13} className="text-white" /> : <Copy size={13} />}
          <span className="hidden sm:inline text-[11px]">{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Download Pill Button */}
        <div className="relative">
          <div className="inline-flex rounded-full shadow-md bg-white overflow-hidden p-0.5">
            <button
              onClick={() => onExport('png')}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1 text-black hover:bg-zinc-100 rounded-l-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isExporting ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Download size={12} />
              )}
              <span className="text-[11px]">{isExporting ? 'Saving...' : 'PNG'}</span>
            </button>
            <button
              onClick={() => setDownloadDropdown(!downloadDropdown)}
              className="px-1.5 py-1 text-black hover:bg-zinc-200 rounded-r-full border-l border-zinc-200 text-xs font-bold transition-all cursor-pointer"
            >
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Format Dropdown */}
          {downloadDropdown && (
            <div
              className="absolute right-0 mt-2 w-44 rounded-xl bg-zinc-900/95 border border-white/10 shadow-2xl py-1 z-50 animate-fadeIn backdrop-blur-xl"
              onMouseLeave={() => setDownloadDropdown(false)}
            >
              <button
                onClick={() => {
                  setDownloadDropdown(false);
                  onExport('png');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>Download PNG (Lossless)</span>
                <span className="text-[10px] text-zinc-500 font-mono">High-Res</span>
              </button>
              <button
                onClick={() => {
                  setDownloadDropdown(false);
                  onExport('jpeg');
                }}
                className="w-full text-left px-3.5 py-2 text-xs text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>Download JPEG (Compact)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Photo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
