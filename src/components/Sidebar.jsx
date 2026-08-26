import React, { useState, useRef } from 'react';
import {
  Type,
  Image as ImageIcon,
  Sliders,
  Sparkles,
  User,
  Check,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bookmark,
  Plus,
  Trash2,
  Download,
  RotateCcw
} from 'lucide-react';
import { FONTS } from '../constants/fonts';
import { PRESET_AVATARS, PRESET_BACKGROUNDS, THEME_PRESETS } from '../constants/presets';
import { getSavedDrafts, saveDraft, deleteDraft, exportAllDataAsJSON } from '../services/storage';

export default function Sidebar({
  config,
  onChange,
  onApplyTheme,
  onResetDefaults,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('content');
  const [bgCategory, setBgCategory] = useState('All');
  const [draftName, setDraftName] = useState('');
  const [savedDraftsList, setSavedDraftsList] = useState(getSavedDrafts());
  const avatarInputRef = useRef(null);
  const bgInputRef = useRef(null);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ avatarUrl: event.target.result, avatarSvg: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ background: event.target.result, isGradientBg: false });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    const name = draftName.trim() || `${config.authorName} - ${config.citation || 'Quote'}`;
    const newDraft = saveDraft(name, config);
    if (newDraft) {
      setSavedDraftsList(getSavedDrafts());
      setDraftName('');
      onShowToast?.(`Saved "${name}" to local drafts! 💾`);
    }
  };

  const handleDeleteDraft = (id, name) => {
    const updated = deleteDraft(id);
    setSavedDraftsList(updated);
    onShowToast?.(`Deleted "${name}"`);
  };

  const handleLoadDraft = (draft) => {
    onChange({ ...draft.config });
    onShowToast?.(`Loaded "${draft.name}"`);
  };

  const filteredBackgrounds = PRESET_BACKGROUNDS.filter((bg) => {
    if (bgCategory === 'All') return true;
    return bg.category === bgCategory;
  });

  const tabs = [
    { id: 'content', label: 'Content', icon: User },
    { id: 'typography', label: 'Fonts', icon: Type },
    { id: 'card', label: 'Card', icon: Sliders },
    { id: 'background', label: 'Background', icon: ImageIcon },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <aside className="w-full lg:w-[410px] xl:w-[440px] flex flex-col bg-zinc-950/95 backdrop-blur-xl border-t lg:border-t-0 lg:border-r border-white/[0.06] text-zinc-200 shrink-0 z-20 overflow-hidden max-h-[50vh] lg:max-h-full">
      {/* Floating Segmented Pill Tab Dock */}
      <div className="p-2 sm:px-3 sm:py-2.5 border-b border-white/[0.06] bg-black/40 shrink-0">
        <div className="flex items-center p-1 rounded-2xl bg-zinc-900/90 border border-white/[0.08] gap-1 overflow-x-auto no-scrollbar shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-black shadow-sm font-bold scale-[1.01]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
                {tab.id === 'saved' && savedDraftsList.length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-black text-white'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}
                  >
                    {savedDraftsList.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* ================= CONTENT TAB ================= */}
        {activeTab === 'content' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Profile Identity */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Profile Identity
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">Author Name</span>
                  <input
                    type="text"
                    value={config.authorName}
                    onChange={(e) => onChange({ authorName: e.target.value })}
                    placeholder="e.g. Harikrishna Maharaj"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:border-zinc-500 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 block mb-1">Handle / Subtitle</span>
                  <input
                    type="text"
                    value={config.handle}
                    onChange={(e) => onChange({ handle: e.target.value })}
                    placeholder="e.g. @vachanamrutquotes"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Verified Badge */}
              <div className="flex items-center justify-between p-2.5 bg-zinc-900/60 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white">Verified Badge</span>
                  <span className="text-[11px] text-zinc-500">Tick icon</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {config.isVerified && (
                    <input
                      type="color"
                      value={config.badgeColor}
                      onChange={(e) => onChange({ badgeColor: e.target.value })}
                      title="Badge Color"
                      className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => onChange({ isVerified: !config.isVerified })}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                      config.isVerified ? 'bg-white' : 'bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-black transition-transform ${
                        config.isVerified ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-2">Avatar Picture</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      onClick={() => onChange({ avatarUrl: av.url, avatarSvg: av.svg })}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-zinc-900 ${
                        (config.avatarUrl === av.url && !config.avatarSvg) || (av.svg && config.avatarSvg === av.svg)
                          ? 'border-white ring-2 ring-white/30 scale-105 shadow-md'
                          : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                      title={av.name}
                    >
                      <img
                        src={av.svg || av.url}
                        alt={av.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </button>
                  ))}

                  {/* Upload Custom Avatar Button */}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="h-10 px-3 rounded-full border border-dashed border-zinc-700 hover:border-white bg-zinc-900 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Upload size={12} />
                    <span>Upload</span>
                  </button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Avatar Ring Options (Golden, Black, Custom) */}
              <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800 space-y-3">
                <span className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider block">
                  Avatar Ring Style
                </span>

                {/* Ring style selector */}
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'gold', label: 'Gold', icon: '🥇' },
                    { id: 'black', label: 'Black', icon: '⬛' },
                    { id: 'white', label: 'White', icon: '⬜' },
                    { id: 'none', label: 'None', icon: '🚫' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onChange({ avatarRingType: r.id })}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        (config.avatarRingType ?? 'gold') === r.id
                          ? 'bg-white text-black border-white shadow font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span>{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>

                {/* Ring thickness & Glow */}
                {(config.avatarRingType ?? 'gold') !== 'none' && (
                  <div className="space-y-2 pt-1">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>Ring Thickness</span>
                        <span className="text-white font-mono">{config.avatarRingWidth ?? 4}px</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={config.avatarRingWidth ?? 4}
                        onChange={(e) => onChange({ avatarRingWidth: parseInt(e.target.value) })}
                        className="w-full accent-white cursor-pointer"
                      />
                    </div>

                    {(config.avatarRingType ?? 'gold') === 'gold' && (
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-zinc-400">Golden Radiance Aura</span>
                        <button
                          type="button"
                          onClick={() => onChange({ avatarRingGlow: !(config.avatarRingGlow ?? true) })}
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer ${
                            (config.avatarRingGlow ?? true) ? 'bg-white' : 'bg-zinc-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-2.5 w-2.5 transform rounded-full bg-black transition-transform ${
                              (config.avatarRingGlow ?? true) ? 'translate-x-3.5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Avatar Image Centering & Zoom Controls */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-300">
                      Center / Crop Avatar Image
                    </span>
                    {((config.avatarZoom && config.avatarZoom !== 100) || config.avatarOffsetX || config.avatarOffsetY) && (
                      <button
                        type="button"
                        onClick={() => onChange({ avatarZoom: 100, avatarOffsetX: 0, avatarOffsetY: 0 })}
                        className="text-[10px] text-zinc-400 hover:text-white underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Zoom Scale</span>
                      <span className="text-white font-mono">{config.avatarZoom ?? 100}%</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="220"
                      step="5"
                      value={config.avatarZoom ?? 100}
                      onChange={(e) => onChange({ avatarZoom: parseInt(e.target.value) })}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>Pan X (Horiz)</span>
                        <span className="text-white font-mono">{config.avatarOffsetX ?? 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        step="2"
                        value={config.avatarOffsetX ?? 0}
                        onChange={(e) => onChange({ avatarOffsetX: parseInt(e.target.value) })}
                        className="w-full accent-white cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>Pan Y (Vert)</span>
                        <span className="text-white font-mono">{config.avatarOffsetY ?? 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        step="2"
                        value={config.avatarOffsetY ?? 0}
                        onChange={(e) => onChange({ avatarOffsetY: parseInt(e.target.value) })}
                        className="w-full accent-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Body */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Quote Text
              </label>
              <textarea
                rows={5}
                value={config.quoteText}
                onChange={(e) => onChange({ quoteText: e.target.value })}
                placeholder="Enter your quote in Gujarati, English, or any language..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs sm:text-sm text-white focus:border-zinc-500 focus:outline-none resize-y leading-relaxed font-sans"
              />
            </div>

            {/* Citation / Reference */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Citation / Reference
                </label>
                <button
                  type="button"
                  onClick={() => onChange({ showCitation: !config.showCitation })}
                  className="text-xs text-zinc-400 hover:text-white cursor-pointer underline decoration-zinc-600"
                >
                  {config.showCitation ? 'Hide' : 'Show'}
                </button>
              </div>

              {config.showCitation && (
                <input
                  type="text"
                  value={config.citation}
                  onChange={(e) => onChange({ citation: e.target.value })}
                  placeholder="e.g. (ગઢડા અંત્ય ૩૬)"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:border-zinc-500 focus:outline-none"
                />
              )}
            </div>

            {/* Bottom-Right Watermark / Website Branding */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Website / Handle Watermark
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ showWatermark: !config.showWatermark })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                    config.showWatermark ? 'bg-white' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-black transition-transform ${
                      config.showWatermark ? 'translate-x-4.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {config.showWatermark && (
                <div className="space-y-2.5 p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 animate-fadeIn">
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Watermark Text</span>
                    <input
                      type="text"
                      value={config.watermarkText || ''}
                      onChange={(e) => onChange({ watermarkText: e.target.value })}
                      placeholder="e.g. vachanamrut.in"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-zinc-500 focus:outline-none"
                    />
                  </div>

                  {/* Position selector */}
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Position</span>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'bottom-left', label: 'Left' },
                        { id: 'bottom-center', label: 'Center' },
                        { id: 'bottom-right', label: 'Right' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => onChange({ watermarkPosition: pos.id })}
                          className={`py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                            config.watermarkPosition === pos.id
                              ? 'bg-white text-black border-white shadow'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style selector */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'pill', label: 'Frosted Pill' },
                      { id: 'clean', label: 'Clean Shadow' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => onChange({ watermarkStyle: st.id })}
                        className={`py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                          config.watermarkStyle === st.id
                            ? 'bg-white text-black border-white shadow'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Opacity slider */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Watermark Opacity</span>
                      <span className="font-mono text-white">{config.watermarkOpacity ?? 85}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="5"
                      value={config.watermarkOpacity ?? 85}
                      onChange={(e) => onChange({ watermarkOpacity: parseInt(e.target.value) })}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TYPOGRAPHY TAB ================= */}
        {activeTab === 'typography' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Font Family Selection */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Font Family (Gujarati & Latin)
              </label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {FONTS.map((f) => {
                  const isSelected = config.fontFamily === f.fontFamily;
                  return (
                    <button
                      key={f.id}
                      onClick={() => onChange({ fontFamily: f.fontFamily, fontWeight: f.defaultWeight })}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-zinc-900 border-white text-white shadow-sm ring-1 ring-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{f.name}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400">
                            {f.language}
                          </span>
                        </div>
                        <p
                          className="text-sm mt-0.5 text-zinc-200 truncate"
                          style={{ fontFamily: f.fontFamily }}
                        >
                          {f.preview}
                        </p>
                      </div>
                      {isSelected && <Check size={16} className="text-white shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Weight */}
            <div className="pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                <span>Font Weight</span>
                <span className="text-white font-mono">{config.fontWeight}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: 'Light', val: 300 },
                  { label: 'Regular', val: 400 },
                  { label: 'Medium', val: 500 },
                  { label: 'SemiBold', val: 600 },
                  { label: 'Bold', val: 700 },
                  { label: 'ExtraBold', val: 800 },
                ].map((wt) => (
                  <button
                    key={wt.val}
                    onClick={() => onChange({ fontWeight: wt.val })}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                      config.fontWeight === wt.val
                        ? 'bg-white text-black border-white shadow'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {wt.label} ({wt.val})
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Spacing Sliders */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Font Size</span>
                  <span className="text-white font-mono">{config.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="36"
                  step="1"
                  value={config.fontSize}
                  onChange={(e) => onChange({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Line Spacing</span>
                  <span className="text-white font-mono">{config.lineHeight}x</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="2.2"
                  step="0.05"
                  value={config.lineHeight}
                  onChange={(e) => onChange({ lineHeight: parseFloat(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>

            {/* Text Alignment */}
            <div className="pt-2 border-t border-zinc-800/80">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Alignment
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'left', label: 'Left', icon: AlignLeft },
                  { id: 'center', label: 'Center', icon: AlignCenter },
                  { id: 'right', label: 'Right', icon: AlignRight },
                  { id: 'justify', label: 'Justify', icon: AlignJustify },
                ].map((al) => {
                  const Icon = al.icon;
                  return (
                    <button
                      key={al.id}
                      onClick={() => onChange({ textAlign: al.id })}
                      className={`flex items-center justify-center py-2 rounded-lg border transition-all cursor-pointer ${
                        config.textAlign === al.id
                          ? 'bg-white text-black border-white shadow'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon size={15} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= CARD STYLE TAB ================= */}
        {activeTab === 'card' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Quick Themes */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Card Themes
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onApplyTheme(t)}
                    className="p-2 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-left text-xs font-medium text-zinc-200 hover:border-zinc-600 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: t.cardBg }}
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Curves (Border Radius) */}
            <div className="pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                <span>Card Curves (Radius)</span>
                <span className="text-white font-mono">{config.cardRadius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="48"
                step="2"
                value={config.cardRadius}
                onChange={(e) => onChange({ cardRadius: parseInt(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>Sharp (0)</span>
                <span>Subtle (16)</span>
                <span>Curved (28)</span>
                <span>Pill (48)</span>
              </div>
            </div>

            {/* Card Background Opacity & Blur */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Card Color</span>
                <input
                  type="color"
                  value={config.cardBg.startsWith('#') ? config.cardBg : '#ffffff'}
                  onChange={(e) => onChange({ cardBg: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Card Opacity</span>
                  <span className="text-white font-mono">{config.cardOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="2"
                  value={config.cardOpacity}
                  onChange={(e) => onChange({ cardOpacity: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Frosted Blur</span>
                  <span className="text-white font-mono">{config.cardBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={config.cardBlur}
                  onChange={(e) => onChange({ cardBlur: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>

            {/* Card Width */}
            <div className="pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                <span>Card Width</span>
                <span className="text-white font-mono">{config.cardWidth ?? 86}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="96"
                step="1"
                value={config.cardWidth ?? 86}
                onChange={(e) => onChange({ cardWidth: parseInt(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
            </div>

            {/* 2D Drag & Position Controls */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Card Position (2D Free Drag)
              </span>

              {/* Horizontal Position Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Horizontal (X)</span>
                  <span className="text-white font-mono">{config.cardPositionX ?? 50}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={config.cardPositionX ?? 50}
                  onChange={(e) => onChange({ cardPositionX: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Left (10%)</span>
                  <span>Center (50%)</span>
                  <span>Right (90%)</span>
                </div>
              </div>

              {/* Vertical Position Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Vertical (Y)</span>
                  <span className="text-white font-mono">{config.cardPositionY ?? 50}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="1"
                  value={config.cardPositionY ?? 50}
                  onChange={(e) => onChange({ cardPositionY: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Top (10%)</span>
                  <span>Center (50%)</span>
                  <span>Bottom (90%)</span>
                </div>
              </div>

              {/* 9-Point Quick Alignment Grid */}
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1.5">Quick 2D Alignment</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { x: 30, y: 20, label: '↖ Top-L' },
                    { x: 50, y: 20, label: '↑ Top' },
                    { x: 70, y: 20, label: '↗ Top-R' },
                    { x: 30, y: 50, label: '← Left' },
                    { x: 50, y: 50, label: '• Center' },
                    { x: 70, y: 50, label: '→ Right' },
                    { x: 30, y: 80, label: '↙ Btm-L' },
                    { x: 50, y: 80, label: '↓ Bottom' },
                    { x: 70, y: 80, label: '↘ Btm-R' },
                  ].map((a) => {
                    const isActive =
                      Math.abs((config.cardPositionX ?? 50) - a.x) < 8 &&
                      Math.abs((config.cardPositionY ?? 50) - a.y) < 8;
                    return (
                      <button
                        key={a.label}
                        type="button"
                        onClick={() => onChange({ cardPositionX: a.x, cardPositionY: a.y })}
                        className={`py-1.5 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-black border-white shadow font-bold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag Hint Banner */}
              <div className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-400">
                <span className="text-sm">✋</span>
                <span>Click & drag the quote card freely in 2D anywhere on the canvas!</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= BACKGROUND TAB ================= */}
        {activeTab === 'background' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {['All', 'Maharaj', 'Day & Sunset', 'Night & Dark', 'Gradients'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBgCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    bgCategory === cat
                      ? 'bg-white text-black border-white shadow'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Upload Custom Background */}
            <div>
              <button
                onClick={() => bgInputRef.current?.click()}
                className="w-full py-2.5 border-2 border-dashed border-zinc-800 hover:border-white rounded-xl bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Upload size={14} />
                <span>Upload Custom Background</span>
              </button>
              <input
                type="file"
                ref={bgInputRef}
                onChange={handleBgUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Presets Grid */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Default Backgrounds ({filteredBackgrounds.length})
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredBackgrounds.map((bg) => {
                  const isSelected = config.background === bg.url;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => onChange({ background: bg.url, isGradientBg: !!bg.isGradient })}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-white ring-2 ring-white/30 scale-102 shadow-lg'
                          : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {bg.isGradient ? (
                        <div className="w-full h-full" style={{ background: bg.url }} />
                      ) : (
                        <img
                          src={bg.url}
                          alt={bg.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5 text-left">
                        <span className="text-[10px] font-semibold text-white truncate">
                          {bg.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 text-black shadow">
                          <Check size={10} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atmosphere Filters */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Atmosphere & Dim Filters
              </label>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Background Blur</span>
                  <span className="text-white font-mono">{config.bgBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={config.bgBlur}
                  onChange={(e) => onChange({ bgBlur: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 mb-0.5">
                  <span>Dim / Darken Tint</span>
                  <span className="text-white font-mono">{config.bgDarkenOverlay}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="2"
                  value={config.bgDarkenOverlay}
                  onChange={(e) => onChange({ bgDarkenOverlay: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SAVED TAB ================= */}
        {activeTab === 'saved' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Save Current Card */}
            <form onSubmit={handleSaveDraft} className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Save Current Quote Card
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Draft Name..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:border-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-white text-black font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow hover:bg-zinc-200 transition-all"
                >
                  <Plus size={14} />
                  <span>Save</span>
                </button>
              </div>
            </form>

            {/* Saved Drafts List */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Saved Local Drafts ({savedDraftsList.length})
                </label>
                {savedDraftsList.length > 0 && (
                  <button
                    onClick={exportAllDataAsJSON}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer underline decoration-zinc-600"
                  >
                    <Download size={12} />
                    <span>Backup JSON</span>
                  </button>
                )}
              </div>

              {savedDraftsList.length === 0 ? (
                <div className="p-5 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950">
                  <Bookmark size={24} className="mx-auto text-zinc-700 mb-1.5" />
                  <p className="text-xs text-zinc-400">No saved drafts yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {savedDraftsList.map((d) => (
                    <div
                      key={d.id}
                      className="p-2.5 bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 rounded-xl transition-all flex items-center justify-between gap-2.5 group"
                    >
                      <div
                        onClick={() => handleLoadDraft(d)}
                        className="flex-1 min-w-0 cursor-pointer"
                      >
                        <h4 className="text-xs font-semibold text-white truncate">
                          {d.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {d.config.quoteText}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleLoadDraft(d)}
                          className="px-2 py-1 bg-white text-black font-semibold rounded-md text-xs cursor-pointer hover:bg-zinc-200 transition-all"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDeleteDraft(d.id, d.name)}
                          className="p-1 text-zinc-500 hover:text-rose-400 rounded cursor-pointer transition-all"
                          title="Delete draft"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reset Defaults */}
            <div className="pt-2 border-t border-zinc-800/80">
              <button
                onClick={onResetDefaults}
                className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <RotateCcw size={13} />
                <span>Reset to Default Template</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
