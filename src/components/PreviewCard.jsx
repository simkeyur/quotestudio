import React, { forwardRef } from 'react';
import VerifiedBadge from './VerifiedBadge';

const PreviewCard = forwardRef(({ config }, ref) => {
  const {
    aspectRatio = '4:5',
    background = 'backgrounds/IMG_8205.jpg',
    isGradientBg = false,
    bgBlur = 0,
    bgBrightness = 100,
    bgDarkenOverlay = 0,
    bgScale = 100,
    bgPosition = 'center',
    
    // Card styling & vertical drag position
    cardPositionY = 50, // % from top (0 = top, 50 = center, 100 = bottom)
    cardWidth = 88, // %
    cardRadius = 28, // px
    cardBg = '#ffffff',
    cardOpacity = 95,
    cardBlur = 0,
    cardShadow = '2xl',
    borderWidth = 0,
    borderColor = '#ffffff',
    
    // Interactive drag & resize state passed from parent
    isDragging = false,
    isResizing = false,
    hideHandles = false,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onResizePointerDown,
    onResizePointerMove,
    onResizePointerUp,
    
    // Avatar Ring & Profile
    avatarUrl = 'avatars/harikrishna.jpg',
    avatarSvg = '',
    avatarRingType = 'gold', // 'gold', 'black', 'white', 'none', 'custom'
    avatarRingWidth = 4, // px
    avatarRingColor = '#d4af37',
    avatarRingGlow = true,
    avatarSize = 56,
    avatarZoom = 100,
    avatarOffsetX = 0,
    avatarOffsetY = 0,
    authorName = 'Harikrishna Maharaj',
    handle = '@vachanamrutquotes',
    isVerified = true,
    badgeColor = '#1d9bf0',
    quoteText = 'પછી શ્રીજીમહારાજ એમ બોલ્યા જે...',
    citation = '(ગઢડા અંત્ય ૩૬)',
    showCitation = true,
    
    // Typography
    fontFamily = "'Mukta Vaani', sans-serif",
    fontWeight = 500,
    fontSize = 20, // px
    lineHeight = 1.6,
    letterSpacing = 0,
    textAlign = 'left', // 'left', 'center', 'right', 'justify'
    textColor = '#111827',
    nameColor = '#111827',
    handleColor = '#6b7280',
    citationColor = '#374151',
    citationFontSize = 18,
    citationFontWeight = 600,
    
    // Watermark / Website branding at bottom of image
    showWatermark = true,
    watermarkText = 'vachanamrut.in',
    watermarkPosition = 'bottom-right', // 'bottom-right', 'bottom-left', 'bottom-center'
    watermarkStyle = 'pill', // 'pill', 'clean'
    watermarkColor = '#ffffff',
    watermarkOpacity = 85,
    watermarkFontSize = 15,
    watermarkFontWeight = 600,
    watermarkShowIcon = true,
    
    // Canvas preview scale (for fitting in editor UI)
    scale = 1
  } = config;

  // Aspect ratio dimensions
  const getDimensions = () => {
    switch (aspectRatio) {
      case '1:1':
        return { width: 1080, height: 1080, aspectStyle: 'aspect-square' };
      case '4:5':
        return { width: 1080, height: 1350, aspectStyle: 'aspect-[4/5]' };
      case '9:16':
        return { width: 1080, height: 1920, aspectStyle: 'aspect-[9/16]' };
      case '16:9':
        return { width: 1920, height: 1080, aspectStyle: 'aspect-[16/9]' };
      default:
        return { width: 1080, height: 1350, aspectStyle: 'aspect-[4/5]' };
    }
  };

  const dims = getDimensions();

  // Position alignment classes
  const getAlignmentClass = () => {
    switch (cardPosition) {
      case 'top':
        return 'justify-start pt-14';
      case 'bottom':
        return 'justify-end pb-14';
      case 'center':
      default:
        return 'justify-center';
    }
  };

  // Convert hex + opacity to rgba
  const hexToRgba = (hex, alphaPercent) => {
    if (!hex) return 'rgba(255, 255, 255, 0.95)';
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const a = (alphaPercent / 100).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  // Shadow class mappings
  const getShadowStyle = () => {
    switch (cardShadow) {
      case 'none':
        return 'none';
      case 'sm':
        return '0 2px 8px rgba(0,0,0,0.12)';
      case 'md':
        return '0 4px 16px rgba(0,0,0,0.18)';
      case 'lg':
        return '0 8px 24px rgba(0,0,0,0.22)';
      case 'xl':
        return '0 12px 32px rgba(0,0,0,0.28)';
      case '2xl':
      default:
        return '0 20px 48px -10px rgba(0,0,0,0.45), 0 0 1px rgba(0,0,0,0.2)';
    }
  };

  return (
    <div
      ref={ref}
      id="quote-capture-card"
      style={{
        width: `${dims.width}px`,
        height: `${dims.height}px`,
      }}
      className="relative select-none overflow-hidden shrink-0 flex flex-col bg-black"
    >
      {/* Background layer */}
      {isGradientBg ? (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: background,
            filter: `blur(${bgBlur}px) brightness(${bgBrightness}%)`,
            transform: `scale(${bgScale / 100})`,
          }}
        />
      ) : (
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            filter: `blur(${bgBlur}px) brightness(${bgBrightness}%)`,
            transform: `scale(${bgScale / 100})`,
            transformOrigin: 'center center',
          }}
        >
          <img
            src={background}
            alt="Background"
            crossOrigin="anonymous"
            className="w-full h-full object-cover"
            style={{ objectPosition: bgPosition }}
          />
        </div>
      )}

      {/* Dark overlay tint layer */}
      {bgDarkenOverlay > 0 && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transition-colors"
          style={{ backgroundColor: `rgba(0, 0, 0, ${bgDarkenOverlay / 100})` }}
        />
      )}

      {/* Card Content Container */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        <div
          id="quote-tile-card"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className={`pointer-events-auto select-none transition-shadow duration-150 cursor-grab active:cursor-grabbing group ${
            isDragging || isResizing ? 'shadow-2xl' : ''
          }`}
          style={{
            position: 'absolute',
            left: `${(100 - cardWidth) / 2}%`,
            width: `${cardWidth}%`,
            top: `${cardPositionY}%`,
            transform: `translateY(-${cardPositionY}%)`,
            borderRadius: `${cardRadius * 1.5}px`,
            backgroundColor: hexToRgba(cardBg, cardOpacity),
            backdropFilter: cardBlur > 0 ? `blur(${cardBlur}px)` : 'none',
            WebkitBackdropFilter: cardBlur > 0 ? `blur(${cardBlur}px)` : 'none',
            boxShadow: getShadowStyle(),
            border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
            padding: '44px 44px',
            touchAction: 'none',
          }}
        >
          {/* Interactive Corner & Side Resize Handles */}
          {!hideHandles && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Subtle active bounding outline */}
              <div
                className={`absolute inset-0 rounded-[inherit] transition-opacity duration-150 ${
                  isDragging || isResizing
                    ? 'ring-2 ring-white/70 opacity-100'
                    : 'opacity-0 group-hover:opacity-100 group-hover:ring-1 group-hover:ring-white/40'
                }`}
              />

              {/* Top-Left Corner */}
              <div
                onPointerDown={(e) => onResizePointerDown?.('nw', e)}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
                onPointerCancel={onResizePointerUp}
                className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center pointer-events-auto cursor-nwse-resize touch-none z-30"
                title="Drag corner to resize"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-950 shadow-md hover:scale-125 transition-transform" />
              </div>

              {/* Top-Right Corner */}
              <div
                onPointerDown={(e) => onResizePointerDown?.('ne', e)}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
                onPointerCancel={onResizePointerUp}
                className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center pointer-events-auto cursor-nesw-resize touch-none z-30"
                title="Drag corner to resize"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-950 shadow-md hover:scale-125 transition-transform" />
              </div>

              {/* Bottom-Left Corner */}
              <div
                onPointerDown={(e) => onResizePointerDown?.('sw', e)}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
                onPointerCancel={onResizePointerUp}
                className="absolute -bottom-3 -left-3 w-8 h-8 flex items-center justify-center pointer-events-auto cursor-nesw-resize touch-none z-30"
                title="Drag corner to resize"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-950 shadow-md hover:scale-125 transition-transform" />
              </div>

              {/* Bottom-Right Corner */}
              <div
                onPointerDown={(e) => onResizePointerDown?.('se', e)}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
                onPointerCancel={onResizePointerUp}
                className="absolute -bottom-3 -right-3 w-8 h-8 flex items-center justify-center pointer-events-auto cursor-nwse-resize touch-none z-30"
                title="Drag corner to resize"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-zinc-950 shadow-md hover:scale-125 transition-transform" />
              </div>

              {/* Left Edge Handle */}
              <div
                onPointerDown={(e) => onResizePointerDown?.('w', e)}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
                onPointerCancel={onResizePointerUp}
                className="absolute top-1/2 -left-3 -translate-y-1/2 w-8 h-10 flex items-center justify-center pointer-events-auto cursor-ew-resize touch-none z-30"
                title="Drag edge to resize width"
              >
                <div className="w-1.5 h-6 rounded-full bg-white border border-zinc-950 shadow-md hover:scale-125 transition-transform" />
              </div>

              {/* Right Edge Handle */}
              <div
                onPointerDown={(e) => onResizePointerDown?.('e', e)}
                onPointerMove={onResizePointerMove}
                onPointerUp={onResizePointerUp}
                onPointerCancel={onResizePointerUp}
                className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-10 flex items-center justify-center pointer-events-auto cursor-ew-resize touch-none z-30"
                title="Drag edge to resize width"
              >
                <div className="w-1.5 h-6 rounded-full bg-white border border-zinc-950 shadow-md hover:scale-125 transition-transform" />
              </div>
            </div>
          )}

          {/* Header Row: Avatar, Name, Handle, Verified Badge */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar Container with Golden / Black / Custom Ring & Centering */}
            {(() => {
              let ringBg = 'transparent';
              let ringShadow = '0 2px 10px rgba(0,0,0,0.18)';
              let pad = `${avatarRingWidth}px`;

              if (avatarRingType === 'gold') {
                ringBg = 'linear-gradient(135deg, #fef08a 0%, #eab308 25%, #ca8a04 50%, #fef08a 75%, #a16207 100%)';
                ringShadow = avatarRingGlow
                  ? '0 0 18px rgba(234, 179, 8, 0.6), 0 2px 8px rgba(0,0,0,0.3)'
                  : '0 2px 8px rgba(0,0,0,0.25)';
              } else if (avatarRingType === 'black') {
                ringBg = '#000000';
                ringShadow = '0 3px 12px rgba(0,0,0,0.45)';
              } else if (avatarRingType === 'white') {
                ringBg = '#ffffff';
                ringShadow = '0 3px 12px rgba(0,0,0,0.25)';
              } else if (avatarRingType === 'custom') {
                ringBg = avatarRingColor || '#d4af37';
                ringShadow = '0 2px 10px rgba(0,0,0,0.2)';
              } else {
                pad = '0px';
                ringShadow = '0 2px 8px rgba(0,0,0,0.12)';
              }

              const totalDim = avatarSize * 1.5;

              return (
                <div
                  style={{
                    width: `${totalDim}px`,
                    height: `${totalDim}px`,
                    background: ringBg,
                    padding: pad,
                    borderRadius: '9999px',
                    boxShadow: ringShadow,
                  }}
                  className="relative shrink-0 flex items-center justify-center transition-all duration-150"
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-black/10 relative">
                    {avatarSvg ? (
                      <img
                        src={avatarSvg}
                        alt="Avatar"
                        crossOrigin="anonymous"
                        style={{
                          transform: `scale(${avatarZoom / 100}) translate(${avatarOffsetX}%, ${avatarOffsetY}%)`,
                          transformOrigin: 'center center',
                        }}
                        className="w-full h-full object-cover transition-transform"
                      />
                    ) : (
                      <img
                        src={avatarUrl || 'defaults/avatars/harikrishna-1.jpg'}
                        alt={authorName}
                        crossOrigin="anonymous"
                        style={{
                          transform: `scale(${avatarZoom / 100}) translate(${avatarOffsetX}%, ${avatarOffsetY}%)`,
                          transformOrigin: 'center center',
                        }}
                        className="w-full h-full object-cover transition-transform"
                      />
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Author info */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2">
                <span
                  style={{
                    color: nameColor,
                    fontSize: '24px',
                    fontWeight: 700,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.2,
                  }}
                  className="truncate"
                >
                  {authorName}
                </span>
                {isVerified && (
                  <VerifiedBadge color={badgeColor} size={20} className="shrink-0" />
                )}
              </div>

              {handle && (
                <span
                  style={{
                    color: handleColor,
                    fontSize: '18px',
                    fontWeight: 400,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.2,
                  }}
                  className="mt-1 tracking-tight truncate block"
                >
                  {handle}
                </span>
              )}
            </div>
          </div>

          {/* Quote Body */}
          <div
            style={{
              fontFamily: fontFamily,
              fontWeight: fontWeight,
              fontSize: `${fontSize * 1.55}px`,
              lineHeight: lineHeight,
              letterSpacing: `${letterSpacing}px`,
              textAlign: textAlign,
              color: textColor,
              whiteSpace: 'pre-line',
            }}
            className="tracking-normal break-words"
          >
            {quoteText}
          </div>

          {/* Citation / Reference */}
          {showCitation && citation && (
            <div
              style={{
                fontFamily: fontFamily,
                fontWeight: citationFontWeight,
                fontSize: `${citationFontSize * 1.45}px`,
                color: citationColor,
                textAlign: textAlign === 'right' ? 'right' : 'left',
                marginTop: '20px'
              }}
              className="tracking-wide"
            >
              {citation}
            </div>
          )}
        </div>
      </div>

      {/* Watermark / Website Footer Branding */}
      {showWatermark && watermarkText && (
        <div
          className={`absolute z-20 pointer-events-none transition-all ${
            watermarkPosition === 'bottom-left'
              ? 'bottom-8 left-10'
              : watermarkPosition === 'bottom-center'
              ? 'bottom-8 left-1/2 -translate-x-1/2'
              : 'bottom-8 right-10'
          }`}
        >
          <div
            style={{
              color: watermarkColor,
              opacity: watermarkOpacity / 100,
              fontSize: `${watermarkFontSize * 1.55}px`,
              fontWeight: watermarkFontWeight,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              textShadow: watermarkStyle === 'pill' ? 'none' : '0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)',
              backgroundColor: watermarkStyle === 'pill' ? 'rgba(0, 0, 0, 0.45)' : 'transparent',
              backdropFilter: watermarkStyle === 'pill' ? 'blur(10px)' : 'none',
              WebkitBackdropFilter: watermarkStyle === 'pill' ? 'blur(10px)' : 'none',
              borderRadius: '9999px',
              padding: watermarkStyle === 'pill' ? '8px 20px' : '0px',
              border: watermarkStyle === 'pill' ? '1px solid rgba(255, 255, 255, 0.18)' : 'none',
              boxShadow: watermarkStyle === 'pill' ? '0 4px 16px rgba(0,0,0,0.3)' : 'none'
            }}
            className="flex items-center gap-2 select-none tracking-wider"
          >
            {watermarkShowIcon && (
              <svg
                viewBox="0 0 24 24"
                width={watermarkFontSize * 1.5}
                height={watermarkFontSize * 1.5}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            )}
            <span>{watermarkText}</span>
          </div>
        </div>
      )}
    </div>
  );
});

PreviewCard.displayName = 'PreviewCard';

export default PreviewCard;
