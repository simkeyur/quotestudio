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
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Languages,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { FONTS, SANSKRIT_FONTS } from '../constants/fonts';
import { PRESET_AVATARS, PRESET_BACKGROUNDS, THEME_PRESETS } from '../constants/presets';
import { getSavedDrafts, saveDraft, deleteDraft, exportAllDataAsJSON } from '../services/storage';
import {
  getGitaChapters,
  getChapterVerseCount,
  getGitaVerse,
  getNextVerseRef,
  getPrevVerseRef,
  formatGitaHeader
} from '../services/geetaService';

const ICONIC_GEETA_VERSES = [
  { chapter: 2, verse: 47, label: '2.47 (कर्मण्येवाधिकारस्ते)' },
  { chapter: 4, verse: 7, label: '4.7 (यदा यदा हि धर्मस्य)' },
  { chapter: 4, verse: 8, label: '4.8 (परित्राणाय साधूनां)' },
  { chapter: 2, verse: 20, label: '2.20 (न जायते म्रियते)' },
  { chapter: 2, verse: 22, label: '2.22 (वासांसि जीर्णानि)' },
  { chapter: 9, verse: 22, label: '9.22 (अनन्याश्चिन्तयन्तो)' },
  { chapter: 18, verse: 65, label: '18.65 (मन्मना भव)' },
  { chapter: 18, verse: 66, label: '18.66 (सर्वधर्मान्परित्यज्य)' },
];

const GEETA_TILE_PRESETS = [
  {
    id: 'pure-white',
    name: 'Pure White',
    cardBg: '#ffffff',
    cardOpacity: 96,
    cardBlur: 0,
    textColor: '#111827',
    geetaShlokaColor: '#111827',
    geetaTranslationColor: '#1f2937',
    geetaHeaderColor: '#b45309',
    borderColor: '#ffffff',
    borderWidth: 0,
  },
  {
    id: 'frosted-glass',
    name: 'Frosted Glass',
    cardBg: '#ffffff',
    cardOpacity: 65,
    cardBlur: 18,
    textColor: '#111827',
    geetaShlokaColor: '#111827',
    geetaTranslationColor: '#1f2937',
    geetaHeaderColor: '#b45309',
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    cardBg: '#121214',
    cardOpacity: 92,
    cardBlur: 14,
    textColor: '#f8fafc',
    geetaShlokaColor: '#ffffff',
    geetaTranslationColor: '#e2e8f0',
    geetaHeaderColor: '#fbbf24',
    borderColor: '#27272a',
    borderWidth: 1,
  },
  {
    id: 'deep-glass',
    name: 'Deep Glass',
    cardBg: '#000000',
    cardOpacity: 55,
    cardBlur: 22,
    textColor: '#ffffff',
    geetaShlokaColor: '#ffffff',
    geetaTranslationColor: '#f1f5f9',
    geetaHeaderColor: '#f59e0b',
    borderColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
  },
  {
    id: 'warm-parchment',
    name: 'Warm Parchment',
    cardBg: '#fef3c7',
    cardOpacity: 95,
    cardBlur: 0,
    textColor: '#451a03',
    geetaShlokaColor: '#451a03',
    geetaTranslationColor: '#78350f',
    geetaHeaderColor: '#b45309',
    borderColor: '#fde68a',
    borderWidth: 1,
  },
  {
    id: 'sacred-saffron',
    name: 'Sacred Saffron',
    cardBg: '#fff7ed',
    cardOpacity: 94,
    cardBlur: 0,
    textColor: '#7c2d12',
    geetaShlokaColor: '#7c2d12',
    geetaTranslationColor: '#9a3412',
    geetaHeaderColor: '#ea580c',
    borderColor: '#fed7aa',
    borderWidth: 1,
  },
  {
    id: 'minimal-outline',
    name: 'Crystal Outline',
    cardBg: '#ffffff',
    cardOpacity: 15,
    cardBlur: 16,
    textColor: '#ffffff',
    geetaShlokaColor: '#ffffff',
    geetaTranslationColor: '#ffffff',
    geetaHeaderColor: '#fde047',
    borderColor: '#ffffff',
    borderWidth: 1.5,
  },
];

const TILE_COLOR_SWATCHES = [
  { name: 'White', color: '#ffffff' },
  { name: 'Warm Cream', color: '#fbf8ee' },
  { name: 'Parchment', color: '#fef3c7' },
  { name: 'Saffron Tint', color: '#fff7ed' },
  { name: 'Soft Gray', color: '#e4e4e7' },
  { name: 'Charcoal', color: '#18181b' },
  { name: 'Deep Navy', color: '#0f172a' },
  { name: 'Pure Black', color: '#000000' },
  { name: 'Sacred Ochre', color: '#451a03' },
  { name: 'Deep Temple', color: '#78350f' },
];

export default function Sidebar({
  config,
  onChange,
  onApplyTheme,
  onResetDefaults,
  onShowToast,
  savedDraftsList: propDraftsList,
  onDraftsChange,
  setCurrentDraftId
}) {
  const [activeTab, setActiveTab] = useState('content');
  const [bgCategory, setBgCategory] = useState('All');
  const [draftName, setDraftName] = useState('');
  const [localDraftsList, setLocalDraftsList] = useState(getSavedDrafts);
  const savedDraftsList = propDraftsList ?? localDraftsList;
  const avatarInputRef = useRef(null);
  const bgInputRef = useRef(null);

  // Bhagavad Gita Navigation & Handlers
  const chapters = getGitaChapters();
  const currentChapterNum = config.geetaChapter ?? 2;
  const currentVerseNum = config.geetaVerse ?? 47;
  const currentLang = config.geetaLanguage ?? 'gujarati';
  const currentChapterVerseCount = getChapterVerseCount(currentChapterNum);

  const handleSelectVerse = (ch, v, lang = currentLang) => {
    const verseData = getGitaVerse(ch, v);
    if (!verseData) return;
    const translation = verseData[lang] || verseData.english || '';
    onChange({
      geetaChapter: ch,
      geetaVerse: v,
      geetaLanguage: lang,
      geetaShloka: verseData.sloka,
      geetaTransliteration: verseData.transliteration,
      geetaTranslation: translation,
    });
  };

  const handleChapterChange = (newChapter) => {
    handleSelectVerse(newChapter, 1, currentLang);
  };

  const handleVerseChange = (newVerse) => {
    const maxV = getChapterVerseCount(currentChapterNum);
    const parsed = parseInt(newVerse, 10) || 1;
    const clamped = Math.max(1, Math.min(maxV, parsed));
    handleSelectVerse(currentChapterNum, clamped, currentLang);
  };

  const handlePrevVerse = () => {
    const prev = getPrevVerseRef(currentChapterNum, currentVerseNum);
    handleSelectVerse(prev.chapter, prev.verse, currentLang);
  };

  const handleNextVerse = () => {
    const next = getNextVerseRef(currentChapterNum, currentVerseNum);
    handleSelectVerse(next.chapter, next.verse, currentLang);
  };

  const handleLanguageChange = (lang) => {
    const verseData = getGitaVerse(currentChapterNum, currentVerseNum);
    const translation = verseData ? (verseData[lang] || '') : config.geetaTranslation;
    onChange({
      geetaLanguage: lang,
      geetaTranslation: translation,
    });
  };

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
      setLocalDraftsList(getSavedDrafts());
      onDraftsChange?.();
      setCurrentDraftId?.(newDraft.id);
      setDraftName('');
      onShowToast?.(`Saved "${name}" to local drafts! 💾`);
    }
  };

  const handleDeleteDraft = (id, name) => {
    const updated = deleteDraft(id);
    setLocalDraftsList(updated);
    onDraftsChange?.();
    onShowToast?.(`Deleted "${name}"`);
  };

  const handleLoadDraft = (draft) => {
    onChange({ ...draft.config });
    setCurrentDraftId?.(draft.id);
    onShowToast?.(`Loaded "${draft.name}"! 🚀`);
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
            {config.cardMode === 'geeta' ? (
              /* Bhagavad Gita Content Controls */
              <div className="space-y-4">
                {/* Mode Indicator & Quick Verses */}
                <div className="p-3 bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-zinc-900/80 rounded-xl border border-amber-500/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
                      <BookOpen size={14} className="text-amber-400" />
                      <span>Bhagavad Gita 9:16 Mode</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-mono">
                      701 Verses
                    </span>
                  </div>

                  {/* Iconic Verses Quick Jump */}
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider block mb-1.5">
                      ⭐ Quick Iconic Verses
                    </span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {ICONIC_GEETA_VERSES.map((item) => {
                        const isCurrent = currentChapterNum === item.chapter && currentVerseNum === item.verse;
                        return (
                          <button
                            key={`${item.chapter}.${item.verse}`}
                            type="button"
                            onClick={() => handleSelectVerse(item.chapter, item.verse)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer border shrink-0 ${
                              isCurrent
                                ? 'bg-amber-400 text-black border-amber-300 shadow font-bold scale-[1.02]'
                                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Chapter & Verse Selection */}
                <div className="p-3.5 bg-zinc-900/70 rounded-xl border border-zinc-800 space-y-3">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Scripture Selection
                  </label>

                  {/* Chapter Select */}
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">
                      Chapter (અધ્યાय / अध्याय)
                    </span>
                    <select
                      value={currentChapterNum}
                      onChange={(e) => handleChapterChange(parseInt(e.target.value, 10))}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                      {chapters.map((ch) => (
                        <option key={ch.chapter} value={ch.chapter}>
                          {ch.chapter}. {ch.name} ({ch.name_translation}) • {ch.verses_count} Verses
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Verse Stepper & Jump Input */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Verse (શ્લોक / श्लोक)</span>
                      <span className="text-amber-300 font-mono">
                        Verse {currentVerseNum} of {currentChapterVerseCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrevVerse}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white rounded-lg text-xs font-medium border border-zinc-700 transition-all cursor-pointer"
                        title="Previous Verse"
                      >
                        <ChevronLeft size={14} />
                        <span>Prev</span>
                      </button>

                      <div className="w-24 shrink-0 relative">
                        <input
                          type="number"
                          min="1"
                          max={currentChapterVerseCount}
                          value={currentVerseNum}
                          onChange={(e) => handleVerseChange(e.target.value)}
                          className="w-full bg-black border border-zinc-700 rounded-lg px-2 py-2 text-center text-xs sm:text-sm text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleNextVerse}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-white rounded-lg text-xs font-medium border border-zinc-700 transition-all cursor-pointer"
                        title="Next Verse"
                      >
                        <span>Next</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Translation Language Selector */}
                  <div className="pt-2 border-t border-zinc-800/80">
                    <span className="text-[11px] text-zinc-400 block mb-1.5">
                      Translation Language (ભાષા / भाषा)
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'english', label: 'English' },
                        { id: 'gujarati', label: 'ગુજરાતી' },
                        { id: 'hindi', label: 'हिन्दी' },
                      ].map((lang) => (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => handleLanguageChange(lang.id)}
                          className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            currentLang === lang.id
                              ? 'bg-amber-400 text-black border-amber-300 shadow font-bold'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                          }`}
                        >
                          <span>{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Box 1: Sanskrit Sloka Section with Stylish Font Selector */}
                <div className="p-3.5 bg-zinc-900/70 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                      Box 1: Sanskrit Sloka (संस्कृत श्लोक)
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                      <span>Size: {config.geetaShlokaFontSize ?? 24}px</span>
                    </div>
                  </div>

                  {/* Stylish Sanskrit Font Quick Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                        ✨ Stylish Shloka Font
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {SANSKRIT_FONTS.find(f => f.fontFamily === (config.geetaShlokaFont || "'Rozha One', serif"))?.name.split(' (')[0] || 'Rozha One'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1">
                      {SANSKRIT_FONTS.map((font) => {
                        const isSelected = (config.geetaShlokaFont || "'Rozha One', serif") === font.fontFamily;
                        return (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() => onChange({ geetaShlokaFont: font.fontFamily })}
                            className={`px-2.5 py-1.5 rounded-lg text-left border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-amber-400/20 border-amber-400 text-white ring-1 ring-amber-400 shadow'
                                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[11px] font-semibold text-white truncate">
                                {font.name.split(' (')[0]}
                              </span>
                              {isSelected && <Check size={12} className="text-amber-400 shrink-0 ml-1" />}
                            </div>
                            <p
                              className="text-xs text-amber-200/90 truncate mt-0.5 leading-tight"
                              style={{ fontFamily: font.fontFamily }}
                            >
                              {font.preview}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea
                    rows={4}
                    value={config.geetaShloka ?? ''}
                    onChange={(e) => onChange({ geetaShloka: e.target.value })}
                    placeholder="Sanskrit Shloka in Devanagari..."
                    className="w-full bg-zinc-950 border border-zinc-700/90 rounded-lg p-3 text-sm text-white focus:border-amber-400 focus:outline-none resize-y leading-relaxed"
                    style={{ fontFamily: config.geetaShlokaFont || "'Rozha One', serif" }}
                  />
                  <input
                    type="range"
                    min="18"
                    max="36"
                    step="1"
                    value={config.geetaShlokaFontSize ?? 24}
                    onChange={(e) => onChange({ geetaShlokaFontSize: parseInt(e.target.value, 10) })}
                    className="w-full accent-amber-400 cursor-pointer"
                    title="Shloka Font Size"
                  />
                </div>

                {/* Box 2: Translation Textarea & Enhanced Font Size Controls */}
                <div className="p-3.5 bg-zinc-900/70 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                      Box 2: Translation ({currentLang.toUpperCase()})
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                      <span>Size: {config.geetaTranslationFontSize ?? 22}px</span>
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={config.geetaTranslation ?? ''}
                    onChange={(e) => onChange({ geetaTranslation: e.target.value })}
                    placeholder="Verse Translation..."
                    className="w-full bg-zinc-950 border border-zinc-700/90 rounded-lg p-3 text-xs sm:text-sm text-white focus:border-amber-400 focus:outline-none resize-y leading-relaxed"
                  />

                  {/* Translation Font Size Controls (Supports Extra Large Sizes) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Font Size</span>
                      <div className="flex items-center gap-1">
                        {[18, 22, 26, 32, 38, 44].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => onChange({ geetaTranslationFontSize: sz })}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer border ${
                              (config.geetaTranslationFontSize ?? 22) === sz
                                ? 'bg-amber-400 text-black border-amber-300 font-bold scale-105'
                                : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-white hover:bg-zinc-900'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="48"
                      step="1"
                      value={config.geetaTranslationFontSize ?? 22}
                      onChange={(e) => onChange({ geetaTranslationFontSize: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-400 cursor-pointer"
                      title="Translation Font Size"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Standard (18px)</span>
                      <span>Medium (26px)</span>
                      <span>Large (36px)</span>
                      <span>Extra Large (48px)</span>
                    </div>
                  </div>

                  {/* Translation Weight Selector */}
                  <div className="pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                      <span>Translation Weight</span>
                      <span className="text-white font-mono text-[10px]">{config.geetaTranslationWeight ?? 500}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { label: 'Regular', val: 400 },
                        { label: 'Medium', val: 500 },
                        { label: 'SemiBold', val: 600 },
                        { label: 'Bold', val: 700 },
                      ].map((wt) => (
                        <button
                          key={wt.val}
                          type="button"
                          onClick={() => onChange({ geetaTranslationWeight: wt.val })}
                          className={`py-1 text-center rounded text-[11px] font-medium transition-all cursor-pointer border ${
                            (config.geetaTranslationWeight ?? 500) === wt.val
                              ? 'bg-white text-black border-white font-bold shadow'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                          }`}
                        >
                          {wt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dedicated Tile Background Color & Styling Section */}
                <div className="p-3.5 bg-zinc-900/70 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Palette size={14} className="text-amber-400" />
                      <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                        Tile Background & Colors
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">Both Boxes</span>
                  </div>

                  {/* Quick Color & Theme Presets */}
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1.5 font-medium">
                      Theme & Color Presets
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {GEETA_TILE_PRESETS.map((p) => {
                        const isSelected = config.cardBg === p.cardBg && Math.abs((config.cardOpacity ?? 95) - p.cardOpacity) < 8;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => onChange({
                              cardBg: p.cardBg,
                              cardOpacity: p.cardOpacity,
                              cardBlur: p.cardBlur,
                              textColor: p.textColor,
                              geetaShlokaColor: p.geetaShlokaColor,
                              geetaTranslationColor: p.geetaTranslationColor,
                              geetaHeaderColor: p.geetaHeaderColor,
                              borderColor: p.borderColor,
                              borderWidth: p.borderWidth,
                            })}
                            className={`p-2 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${
                              isSelected
                                ? 'bg-zinc-800 border-amber-400 ring-1 ring-amber-400 text-white font-semibold shadow'
                                : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                            }`}
                          >
                            <div
                              className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-sm"
                              style={{ backgroundColor: p.cardBg }}
                            />
                            <span className="truncate text-[11px]">{p.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Background Color Picker & Swatches */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400">Tile Background Color</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-300 uppercase">
                          {config.cardBg || '#ffffff'}
                        </span>
                        <input
                          type="color"
                          value={config.cardBg?.startsWith('#') ? config.cardBg : '#ffffff'}
                          onChange={(e) => onChange({ cardBg: e.target.value })}
                          className="w-7 h-7 rounded cursor-pointer border border-zinc-700 bg-transparent p-0"
                          title="Pick Tile Background Color"
                        />
                      </div>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                      {TILE_COLOR_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.color}
                          type="button"
                          onClick={() => onChange({ cardBg: swatch.color })}
                          title={swatch.name}
                          className={`w-6 h-6 rounded-full border shrink-0 transition-transform cursor-pointer ${
                            config.cardBg === swatch.color ? 'scale-110 ring-2 ring-amber-400 border-white' : 'border-white/20 hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tile Opacity Slider */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Tile Opacity</span>
                      <span className="text-white font-mono">{config.cardOpacity ?? 95}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={config.cardOpacity ?? 95}
                      onChange={(e) => onChange({ cardOpacity: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Frosted Glass Blur Slider */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Frosted Glass Blur</span>
                      <span className="text-white font-mono">{config.cardBlur ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={config.cardBlur ?? 0}
                      onChange={(e) => onChange({ cardBlur: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Corner Curves & Border Width */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>Corner Curves</span>
                        <span className="text-white font-mono">{config.cardRadius ?? 28}px</span>
                      </div>
                      <input
                        type="range"
                        min="8"
                        max="44"
                        step="2"
                        value={config.cardRadius ?? 28}
                        onChange={(e) => onChange({ cardRadius: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                        <span>Tile Border</span>
                        <span className="text-white font-mono">{config.borderWidth ?? 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        step="1"
                        value={config.borderWidth ?? 0}
                        onChange={(e) => onChange({ borderWidth: parseInt(e.target.value, 10) })}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Quick Text Sync & Color Pickers */}
                  <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400 font-medium">Text Colors</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onChange({
                            textColor: '#f8fafc',
                            geetaShlokaColor: '#ffffff',
                            geetaTranslationColor: '#f1f5f9',
                            geetaHeaderColor: '#fbbf24',
                          })}
                          className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer flex items-center gap-1"
                          title="Quickly set white/light text for dark tiles"
                        >
                          <Moon size={10} /> Light Text
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange({
                            textColor: '#111827',
                            geetaShlokaColor: '#111827',
                            geetaTranslationColor: '#1f2937',
                            geetaHeaderColor: '#b45309',
                          })}
                          className="px-2 py-0.5 text-[10px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer flex items-center gap-1"
                          title="Quickly set dark text for light tiles"
                        >
                          <Sun size={10} /> Dark Text
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-1.5 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col items-center">
                        <span className="text-[10px] text-zinc-400 mb-1">Shloka</span>
                        <input
                          type="color"
                          value={config.geetaShlokaColor || config.textColor || '#111827'}
                          onChange={(e) => onChange({ geetaShlokaColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                          title="Sanskrit Shloka Color"
                        />
                      </div>
                      <div className="p-1.5 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col items-center">
                        <span className="text-[10px] text-zinc-400 mb-1">Translation</span>
                        <input
                          type="color"
                          value={config.geetaTranslationColor || config.textColor || '#1f2937'}
                          onChange={(e) => onChange({ geetaTranslationColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                          title="Translation Text Color"
                        />
                      </div>
                      <div className="p-1.5 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col items-center">
                        <span className="text-[10px] text-zinc-400 mb-1">Header</span>
                        <input
                          type="color"
                          value={config.geetaHeaderColor || '#b45309'}
                          onChange={(e) => onChange({ geetaHeaderColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                          title="Chapter & Verse Header Color"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Alignment for Boxes */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <span className="text-[11px] text-zinc-400 block mb-1">Text Alignment</span>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'left', label: 'Left', icon: AlignLeft },
                      { id: 'center', label: 'Center', icon: AlignCenter },
                      { id: 'right', label: 'Right', icon: AlignRight },
                    ].map((align) => {
                      const Icon = align.icon;
                      const isSelected = (config.geetaTextAlign ?? 'center') === align.id;
                      return (
                        <button
                          key={align.id}
                          type="button"
                          onClick={() => onChange({ geetaTextAlign: align.id })}
                          className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-white text-black border-white shadow font-semibold'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <Icon size={13} />
                          <span>{align.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Two-Box Sizing & Spacing */}
                <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3">
                  <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Two-Box Width & Spacing
                  </span>

                  {/* Width slider */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Boxes Width</span>
                      <span className="text-white font-mono">{config.cardWidth ?? 88}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="96"
                      step="1"
                      value={config.cardWidth ?? 88}
                      onChange={(e) => onChange({ cardWidth: parseInt(e.target.value, 10) })}
                      className="w-full accent-white cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Slim (50%)</span>
                      <span>Default (88%)</span>
                      <span>Wide (96%)</span>
                    </div>
                  </div>

                  {/* Vertical Gap between boxes */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Gap Between Boxes</span>
                      <span className="text-white font-mono">{config.geetaBoxGap ?? 24}px</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      step="2"
                      value={config.geetaBoxGap ?? 24}
                      onChange={(e) => onChange({ geetaBoxGap: parseInt(e.target.value, 10) })}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-2 pt-1 border-t border-zinc-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300">Show Sanskrit Header</span>
                      <button
                        type="button"
                        onClick={() => onChange({ geetaShowHeader: !(config.geetaShowHeader ?? true) })}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer ${
                          (config.geetaShowHeader ?? true) ? 'bg-amber-400' : 'bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 transform rounded-full bg-black transition-transform ${
                            (config.geetaShowHeader ?? true) ? 'translate-x-3.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300">Show Translation Tag</span>
                      <button
                        type="button"
                        onClick={() => onChange({ geetaShowTranslationTag: !(config.geetaShowTranslationTag ?? true) })}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors cursor-pointer ${
                          (config.geetaShowTranslationTag ?? true) ? 'bg-amber-400' : 'bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-2.5 w-2.5 transform rounded-full bg-black transition-transform ${
                            (config.geetaShowTranslationTag ?? true) ? 'translate-x-3.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Social Mode Profile Identity & Quote */
              <>
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
                        placeholder="e.g. @vachanamrut.quotes"
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
              </>
            )}

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
                    <div className="grid grid-cols-3 gap-1 mb-1">
                      {[
                        { id: 'top-left', label: 'Top Left' },
                        { id: 'top-center', label: 'Top Center' },
                        { id: 'top-right', label: 'Top Right' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => onChange({ watermarkPosition: pos.id })}
                          className={`py-1 text-[11px] font-medium rounded-md border transition-all cursor-pointer ${
                            config.watermarkPosition === pos.id
                              ? 'bg-white text-black border-white shadow font-semibold'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'bottom-left', label: 'Bottom Left' },
                        { id: 'bottom-center', label: 'Bottom Center' },
                        { id: 'bottom-right', label: 'Bottom Right' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() => onChange({ watermarkPosition: pos.id })}
                          className={`py-1 text-[11px] font-medium rounded-md border transition-all cursor-pointer ${
                            config.watermarkPosition === pos.id
                              ? 'bg-white text-black border-white shadow font-semibold'
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
            {config.cardMode === 'geeta' ? (
              <div className="space-y-4">
                {/* Sanskrit Font Selector */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                    Sanskrit Shloka Font (संस्कृत लिपि)
                  </label>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {SANSKRIT_FONTS.map((sf) => {
                      const isSelected = (config.geetaShlokaFont || "'Rozha One', serif") === sf.fontFamily;
                      return (
                        <button
                          key={sf.id}
                          type="button"
                          onClick={() => onChange({ geetaShlokaFont: sf.fontFamily })}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-zinc-900 border-amber-400 text-white ring-1 ring-amber-400'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold text-white block truncate">{sf.name}</span>
                            <p className="text-sm mt-0.5 text-zinc-200 truncate" style={{ fontFamily: sf.fontFamily }}>
                              {sf.preview}
                            </p>
                          </div>
                          {isSelected && <Check size={16} className="text-amber-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Translation Font Selector */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                    Translation Font (ગુજરાતી / English / हिन्दी)
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {FONTS.map((f) => {
                      const isSelected = (config.geetaTranslationFont || config.fontFamily) === f.fontFamily;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => onChange({ geetaTranslationFont: f.fontFamily })}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-zinc-900 border-white text-white ring-1 ring-white'
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
                            <p className="text-xs mt-0.5 text-zinc-300 truncate" style={{ fontFamily: f.fontFamily }}>
                              {f.preview}
                            </p>
                          </div>
                          {isSelected && <Check size={14} className="text-white shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Color Controls for Gita */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2.5">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Colors
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col items-center">
                      <span className="text-[10px] text-zinc-400 mb-1">Shloka</span>
                      <input
                        type="color"
                        value={config.geetaShlokaColor || config.textColor || '#111827'}
                        onChange={(e) => onChange({ geetaShlokaColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                        title="Shloka Text Color"
                      />
                    </div>

                    <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col items-center">
                      <span className="text-[10px] text-zinc-400 mb-1">Translation</span>
                      <input
                        type="color"
                        value={config.geetaTranslationColor || config.textColor || '#1f2937'}
                        onChange={(e) => onChange({ geetaTranslationColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                        title="Translation Text Color"
                      />
                    </div>

                    <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 flex flex-col items-center">
                      <span className="text-[10px] text-zinc-400 mb-1">Header Accent</span>
                      <input
                        type="color"
                        value={config.geetaHeaderColor || '#b45309'}
                        onChange={(e) => onChange({ geetaHeaderColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                        title="Header Citation Color"
                      />
                    </div>
                  </div>
                </div>

                {/* Typography Sizes & Weights for Gita */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-3">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    Sizes & Weights
                  </label>

                  {/* Translation Size */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Translation Size</span>
                      <span className="text-white font-mono">{config.geetaTranslationFontSize ?? 22}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="48"
                      step="1"
                      value={config.geetaTranslationFontSize ?? 22}
                      onChange={(e) => onChange({ geetaTranslationFontSize: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>14px</span>
                      <span>26px</span>
                      <span>36px</span>
                      <span>48px</span>
                    </div>
                  </div>

                  {/* Shloka Size */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-0.5">
                      <span>Sanskrit Shloka Size</span>
                      <span className="text-white font-mono">{config.geetaShlokaFontSize ?? 24}px</span>
                    </div>
                    <input
                      type="range"
                      min="18"
                      max="38"
                      step="1"
                      value={config.geetaShlokaFontSize ?? 24}
                      onChange={(e) => onChange({ geetaShlokaFontSize: parseInt(e.target.value, 10) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Translation Weight */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                      <span>Translation Weight</span>
                      <span className="text-white font-mono text-[10px]">{config.geetaTranslationWeight ?? 500}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { label: 'Regular', val: 400 },
                        { label: 'Medium', val: 500 },
                        { label: 'SemiBold', val: 600 },
                        { label: 'Bold', val: 700 },
                      ].map((wt) => (
                        <button
                          key={wt.val}
                          type="button"
                          onClick={() => onChange({ geetaTranslationWeight: wt.val })}
                          className={`py-1 text-center rounded text-[11px] font-medium transition-all cursor-pointer border ${
                            (config.geetaTranslationWeight ?? 500) === wt.val
                              ? 'bg-white text-black border-white font-bold shadow'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                          }`}
                        >
                          {wt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}

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
