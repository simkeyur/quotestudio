import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PreviewCard from './components/PreviewCard';
import { PRESET_QUOTES, PRESET_BACKGROUNDS, THEME_PRESETS } from './constants/presets';
import { loadActiveState, saveActiveState, clearAllLocalData } from './services/storage';
import { ZoomIn, ZoomOut, Maximize2, CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_DEFAULT_CONFIG = {
  // Canvas & Aspect
  aspectRatio: '4:5',
  
  // Background (Default Converted PNG)
  background: 'defaults/backgrounds/day/1.png',
  isGradientBg: false,
  bgBlur: 0,
  bgBrightness: 100,
  bgDarkenOverlay: 0,
  bgScale: 100,
  bgPosition: 'center',

  // Card Style
  cardPositionY: 50, // % from top (0 = top, 50 = center, 100 = bottom)
  cardWidth: 86,
  cardRadius: 28,
  cardBg: '#ffffff',
  cardOpacity: 96,
  cardBlur: 0,
  cardShadow: '2xl',
  borderWidth: 0,
  borderColor: '#ffffff',

  // Identity (Default Converted Harikrishna Maharaj Avatar)
  avatarUrl: 'defaults/avatars/person_avatar.png',
  avatarSvg: '',
  avatarRingType: 'gold', // 'gold', 'black', 'white', 'none'
  avatarRingWidth: 4,
  avatarRingGlow: true,
  avatarZoom: 100,
  avatarOffsetX: 0,
  avatarOffsetY: 0,
  authorName: 'Harikrishna Maharaj',
  handle: '@vachanamrutquotes',
  isVerified: true,
  badgeColor: '#1d9bf0',

  // Quote & Citation
  quoteText: PRESET_QUOTES[0].text,
  citation: PRESET_QUOTES[0].citation,
  showCitation: true,

  // Watermark / Website Branding
  showWatermark: true,
  watermarkText: 'vachanamrut.in',
  watermarkPosition: 'bottom-right',
  watermarkStyle: 'pill',
  watermarkColor: '#ffffff',
  watermarkOpacity: 85,
  watermarkFontSize: 15,
  watermarkFontWeight: 600,
  watermarkShowIcon: true,

  // Typography
  fontFamily: "'Mukta Vaani', sans-serif",
  fontWeight: 500,
  fontSize: 21,
  lineHeight: 1.6,
  letterSpacing: 0,
  textAlign: 'left',
  textColor: '#111827',
  nameColor: '#111827',
  handleColor: '#6b7280',
  citationColor: '#374151',
  citationFontSize: 18,
  citationFontWeight: 600,
};

function getCanvasDimensions(aspectRatio) {
  switch (aspectRatio) {
    case '1:1':
      return { width: 1080, height: 1080 };
    case '4:5':
      return { width: 1080, height: 1350 };
    case '9:16':
      return { width: 1080, height: 1920 };
    case '16:9':
      return { width: 1920, height: 1080 };
    default:
      return { width: 1080, height: 1350 };
  }
}

export default function App() {
  const cardRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Core App State loaded from LocalStorage or Default
  const [config, setConfig] = useState(() => loadActiveState(INITIAL_DEFAULT_CONFIG));

  // UI State
  const [scale, setScale] = useState(0.42);
  const [autoFit, setAutoFit] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Interactive Drag & Drop positioning for the quote card tile
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const dragStartPosRef = useRef(50);

  const handleCardPointerDown = (e) => {
    // If resizing is active, do not trigger drag
    if (resizeRef.current.active) return;
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = true;
    dragStartYRef.current = e.clientY;
    dragStartPosRef.current = config.cardPositionY ?? 50;
    setIsDragging(true);
  };

  const handleCardPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaY = (e.clientY - dragStartYRef.current) / scale;
    const { height: canvasHeight } = getCanvasDimensions(config.aspectRatio);
    const deltaPercent = (deltaY / canvasHeight) * 100;
    let newPos = dragStartPosRef.current + deltaPercent;
    newPos = Math.max(8, Math.min(92, newPos));
    handleConfigChange({ cardPositionY: Math.round(newPos) });
  };

  const handleCardPointerUp = (e) => {
    if (isDraggingRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      isDraggingRef.current = false;
      setIsDragging(false);
    }
  };

  // Interactive Corner & Edge Resizing
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef({
    active: false,
    handle: '',
    startX: 0,
    startY: 0,
    startWidth: 86,
    startPosY: 50,
  });

  const handleResizePointerDown = (handle, e) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    resizeRef.current = {
      active: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: config.cardWidth ?? 86,
      startPosY: config.cardPositionY ?? 50,
    };
    setIsResizing(true);
  };

  const handleResizePointerMove = (e) => {
    if (!resizeRef.current.active) return;
    const { handle, startX, startY, startWidth, startPosY } = resizeRef.current;
    const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions(config.aspectRatio);

    const deltaX = (e.clientX - startX) / scale;
    const deltaY = (e.clientY - startY) / scale;

    let newWidth = startWidth;
    let newPosY = startPosY;

    // Horizontal width resizing
    if (handle.includes('e')) {
      // Right handle or right corners
      const deltaPercent = (deltaX * 2 / canvasWidth) * 100;
      newWidth = Math.max(50, Math.min(96, startWidth + deltaPercent));
    } else if (handle.includes('w')) {
      // Left handle or left corners
      const deltaPercent = (-deltaX * 2 / canvasWidth) * 100;
      newWidth = Math.max(50, Math.min(96, startWidth + deltaPercent));
    }

    // Vertical position adjusting when dragging corner
    if (handle.includes('s')) {
      const deltaYPercent = (deltaY / canvasHeight) * 45;
      newPosY = Math.max(8, Math.min(92, startPosY + deltaYPercent));
    } else if (handle.includes('n')) {
      const deltaYPercent = (deltaY / canvasHeight) * 45;
      newPosY = Math.max(8, Math.min(92, startPosY + deltaYPercent));
    }

    handleConfigChange({
      cardWidth: Math.round(newWidth),
      cardPositionY: Math.round(newPosY),
    });
  };

  const handleResizePointerUp = (e) => {
    if (resizeRef.current.active) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      resizeRef.current.active = false;
      setIsResizing(false);
    }
  };

  // Debounced auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveActiveState(config);
    }, 300);
    return () => clearTimeout(timer);
  }, [config]);

  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleConfigChange = (updates) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  // Reset to default template
  const handleResetDefaults = () => {
    clearAllLocalData();
    setConfig({ ...INITIAL_DEFAULT_CONFIG });
    showToast('Reset to default template!');
  };

  // Apply a Theme Preset
  const handleApplyTheme = (theme) => {
    handleConfigChange({
      cardBg: theme.cardBg,
      cardOpacity: theme.cardOpacity,
      textColor: theme.textColor,
      nameColor: theme.nameColor,
      handleColor: theme.handleColor,
      citationColor: theme.citationColor,
      cardRadius: theme.cardRadius,
      cardShadow: theme.cardShadow,
      cardBlur: theme.cardBlur,
      borderWidth: theme.borderWidth,
      borderColor: theme.borderColor,
      badgeColor: theme.badgeColor,
    });
    showToast(`Applied ${theme.name} theme`);
  };

  // Shuffle / Randomize (Preserves author name, handle, avatar image, and user settings)
  const handleRandomize = () => {
    const randomQuote = PRESET_QUOTES[Math.floor(Math.random() * PRESET_QUOTES.length)];
    const randomBg = PRESET_BACKGROUNDS[Math.floor(Math.random() * PRESET_BACKGROUNDS.length)];
    const randomTheme = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];

    handleConfigChange({
      quoteText: randomQuote.text,
      citation: randomQuote.citation,
      background: randomBg.url,
      isGradientBg: !!randomBg.isGradient,
      cardBg: randomTheme.cardBg,
      cardOpacity: randomTheme.cardOpacity,
      textColor: randomTheme.textColor,
      nameColor: randomTheme.nameColor,
      handleColor: randomTheme.handleColor,
      citationColor: randomTheme.citationColor,
    });
    showToast('Shuffled quote & background! ✨');
  };

  // Auto-scale preview canvas for Mobile & Desktop
  useEffect(() => {
    const calculateFitScale = () => {
      if (!canvasContainerRef.current || !autoFit) return;
      const container = canvasContainerRef.current;
      
      const isMobile = window.innerWidth < 1024;
      const containerWidth = Math.max(160, container.clientWidth - (isMobile ? 32 : 64));
      const containerHeight = Math.max(160, container.clientHeight - (isMobile ? 32 : 80));

      const { width: targetWidth, height: targetHeight } = getCanvasDimensions(config.aspectRatio);

      const scaleW = containerWidth / targetWidth;
      const scaleH = containerHeight / targetHeight;
      const maxScaleCap = isMobile ? 0.45 : 0.65;
      const optimalScale = Math.min(scaleW, scaleH, maxScaleCap);
      setScale(Math.max(0.16, optimalScale));
    };

    calculateFitScale();
    window.addEventListener('resize', calculateFitScale);
    return () => window.removeEventListener('resize', calculateFitScale);
  }, [config.aspectRatio, autoFit]);

  // Helper to convert any image URL into a Base64 data URL for iOS WebKit compatibility
  const toDataUrl = async (url) => {
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url;
    try {
      const res = await fetch(url, { mode: 'cors' });
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn('Could not convert to data URL:', url, e);
      return url;
    }
  };

  // High-DPI Export & Save to Photos (with native iOS / Android Share API support)
  const handleExport = async (format = 'png', forceDownload = false) => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      // 1. Ensure all custom Google fonts are fully rasterized
      if (document.fonts) {
        await document.fonts.ready;
      }

      // 2. Pre-inline background and avatar images if they are external / relative URLs
      if (config.background && !config.isGradientBg && !config.background.startsWith('data:')) {
        const inlinedBg = await toDataUrl(config.background);
        if (inlinedBg && inlinedBg !== config.background) {
          handleConfigChange({ background: inlinedBg });
          await new Promise((r) => setTimeout(r, 60));
        }
      }

      if (config.avatarUrl && !config.avatarSvg && !config.avatarUrl.startsWith('data:')) {
        const inlinedAvatar = await toDataUrl(config.avatarUrl);
        if (inlinedAvatar && inlinedAvatar !== config.avatarUrl) {
          handleConfigChange({ avatarUrl: inlinedAvatar });
          await new Promise((r) => setTimeout(r, 60));
        }
      }

      const isJpeg = format === 'jpeg' || format === 'jpg';
      const mimeType = isJpeg ? 'image/jpeg' : 'image/png';
      const ext = isJpeg ? 'jpg' : 'png';
      const cleanAuthor = (config.authorName || 'quote').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `${cleanAuthor}-${Date.now()}.${ext}`;

      const options = {
        pixelRatio: 2.0, // High-DPI crisp export
        cacheBust: true,
        quality: isJpeg ? 0.95 : undefined,
      };

      // iOS WebKit warm-up pass to force asset rendering in foreignObject
      try {
        await toPng(cardRef.current, options);
      } catch {}

      const blob = await toBlob(cardRef.current, options);
      if (!blob) throw new Error('Failed to generate image blob');

      const file = new File([blob], filename, { type: mimeType });

      // If mobile device (iOS/Android) supports Web Share API with files
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1);

      if (!forceDownload && isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: config.authorName || 'Quote Card',
          });
          showToast('Tap "Save Image" to save directly to Photos! 📸');
          return;
        } catch (shareErr) {
          if (shareErr.name === 'AbortError') {
            // User cancelled/closed share sheet
            return;
          }
          console.warn('Share API failed, falling back to download:', shareErr);
        }
      }

      // Standard browser download fallback
      const dataUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(dataUrl), 1500);

      showToast(`Exported image successfully! 🎉`);
    } catch (err) {
      console.error('Export error:', err);
      showToast('Export failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy Image directly to Clipboard
  const handleCopy = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 1.5,
        cacheBust: true,
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        showToast('Image copied to clipboard! 📋');
        setTimeout(() => setCopied(false), 2500);
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch (err) {
      console.error('Clipboard copy error:', err);
      showToast('Downloading image instead...', 'error');
      handleExport('png');
    } finally {
      setIsExporting(false);
    }
  };

  const canvasDims = getCanvasDimensions(config.aspectRatio);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-zinc-100 font-sans">
      {/* Toast Notification (Monochrome) */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 animate-fadeIn">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl shadow-2xl border text-xs font-semibold backdrop-blur-xl ${
              toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : 'bg-zinc-900/95 border-zinc-700 text-white'
            }`}
          >
            {toastMessage.type === 'error' ? (
              <AlertCircle size={15} className="text-rose-400" />
            ) : (
              <CheckCircle2 size={15} className="text-white" />
            )}
            <span>{toastMessage.msg}</span>
          </div>
        </div>
      )}

      {/* Top Header Navbar */}
      <Header
        aspectRatio={config.aspectRatio}
        onAspectRatioChange={(ratio) => handleConfigChange({ aspectRatio: ratio })}
        onExport={handleExport}
        onCopy={handleCopy}
        onRandomize={handleRandomize}
        isExporting={isExporting}
        copied={copied}
        scale={scale}
        setScale={setScale}
        autoFit={autoFit}
        setAutoFit={setAutoFit}
      />

      {/* Main Studio Area: Mobile-First layout (Canvas on top, Controls on bottom on mobile; Split on desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Desktop Sidebar (hidden on mobile, shown on lg:) */}
        <div className="hidden lg:flex h-full">
          <Sidebar
            config={config}
            onChange={handleConfigChange}
            onApplyTheme={handleApplyTheme}
            onResetDefaults={handleResetDefaults}
            onShowToast={showToast}
          />
        </div>

        {/* Center Preview Canvas Viewport */}
        <main
          ref={canvasContainerRef}
          className="flex-1 min-h-[45vh] lg:min-h-full overflow-auto bg-[#000000] relative p-3 sm:p-6 lg:p-10 flex flex-col items-center justify-center select-none"
        >
          {/* Subtle minimal grid background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Centering container */}
          <div className="min-h-full min-w-full flex items-center justify-center py-2">
            <div
              style={{
                width: `${canvasDims.width * scale}px`,
                height: `${canvasDims.height * scale}px`,
              }}
              className="relative shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-zinc-800 my-auto mx-auto bg-black transition-all duration-150"
            >
              <div
                style={{
                  width: `${canvasDims.width}px`,
                  height: `${canvasDims.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: '0 0',
                }}
              >
                <PreviewCard
                  ref={cardRef}
                  config={{
                    ...config,
                    isDragging,
                    isResizing,
                    hideHandles: isExporting,
                    onPointerDown: handleCardPointerDown,
                    onPointerMove: handleCardPointerMove,
                    onPointerUp: handleCardPointerUp,
                    onPointerCancel: handleCardPointerUp,
                    onResizePointerDown: handleResizePointerDown,
                    onResizePointerMove: handleResizePointerMove,
                    onResizePointerUp: handleResizePointerUp,
                  }}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Controls Drawer (shown on mobile, hidden on lg:) */}
        <div className="flex lg:hidden w-full shrink-0">
          <Sidebar
            config={config}
            onChange={handleConfigChange}
            onApplyTheme={handleApplyTheme}
            onResetDefaults={handleResetDefaults}
            onShowToast={showToast}
          />
        </div>
      </div>
    </div>
  );
}
