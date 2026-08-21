export const PRESET_QUOTES = [
  {
    title: 'Gadhada Last 36 (ઉપાસના ને ધ્યાન)',
    name: 'Harikrishna Maharaj',
    handle: '@vachanamrutquotes',
    isVerified: true,
    text: `પછી શ્રીજીમહારાજ એમ બોલ્યા જે, "હું તો એમ જાણું છું જે, ભગવાનની મૂર્તિની જે ઉપાસના ને ધ્યાન તે વિના જે આત્માને દેખવો ને બ્રહ્મને દેખવું તે તો થાય જ નહીં ને ઉપાસનાએ કરીને જ આત્મા દેખાય, બ્રહ્મ દેખાય, પણ તે વિના તો દેખાય જ નહીં. અને ઉપાસના વિના આત્મા-બ્રહ્મને દેખવાને ઇચ્છવું તે કેમ છે? તો જેમ આકાશને જીભે કરીને સો વર્ષ સુધી ચાટીએ તો પણ ક્યારેય ખાટો-ખારો સ્વાદ આવે જ નહીં, તેમ ભગવાનની મૂર્તિની ઉપાસના વિના આત્મા-બ્રહ્મ દેખાય જ નહીં; તે ગમે તેટલું જતન કરે તો પણ ન દેખાય. અને નિર્બીજ એવા જે સાંખ્ય ને યોગ તેણે કરીને જે આત્માનું દર્શન શાસ્ત્રમાં કહ્યું છે તે ભલે કહ્યું છે, પણ અમે એવો કોઈ દીઠો નથી ને અનુભવમાં પણ એ વાર્તા મળતી આવતી નથી. માટે એ વાર્તા ખોટી છે."`,
    citation: '(ગઢડા અંત્ય ૩૬)'
  },
  {
    title: 'Panchala 1 (સુખની તુલના)',
    name: 'Harikrishna Maharaj',
    handle: '@vachanamrutquotes',
    isVerified: true,
    text: `"પશુના સુખથી મનુષ્યમાં અધિક સુખ છે ને તે કરતાં રાજાનુ સુખ અધિક છે ને તેથી દેવતાનું સુખ અધિક છે ને તેથી ઇન્દ્રનું અધિક છે ને તેથી બૃહસ્પતિનું ને તેથી બ્રહ્માનું ને તેથી વૈકુંઠલોકનું ને તેથી ગોલોકનું સુખ તે અધિક છે અને તેથી ભગવાનના અક્ષરધામનું સુખ અતિ અધિક છે."`,
    citation: '(પંચાળ ૧)'
  },
  {
    title: 'Sarangpur 4 (હિંમત ને ભજન)',
    name: 'Harikrishna Maharaj',
    handle: '@vachanamrutquotes',
    isVerified: true,
    text: `"ભગવાનનો ભક્ત હોય તેને વાસનાનું બળ દેખીને હિંમત હારવી નહીં ને આનંદમાં ભગવાનનું ભજન કર્યા કરવું અને વાસના ટાળ્યાના ઉપાયમાં રહેવું અને ભગવાન ને ભગવાનના સંતના વચનમાં દૃઢ વિશ્વાસ રાખવો."`,
    citation: '(સારંગપુર ૪)'
  },
  {
    title: 'Gadhada Last 7 (વજની ખીલી)',
    name: 'Harikrishna Maharaj',
    handle: '@vachanamrutquotes',
    isVerified: true,
    text: `"જેમ વજની પૃથ્વી હોય તેમાં વજની ખીલી ચોડી હોય તે કોઈ રીતે ઊખડે નહીં, તેમ ભગવાનનાં ચરણારવિંદને વિષે પોતાના મનને દૃઢ રાખવું. અને એવી રીતે જે ભગવાનનાં ચરણારવિંદને વિષે પોતાના મનને રાખે તેને મરીને ભગવાનના ધામમાં જવું એમ નથી, એ તો છતી દેહે જ ભગવાનના ધામને પામી રહ્યો છે."`,
    citation: '(ગઢડા અંત્ય ૭)'
  },
  {
    title: 'Gadhada Last 15 (નવધા ભક્તિ)',
    name: 'Harikrishna Maharaj',
    handle: '@vachanamrutquotes',
    isVerified: true,
    text: `જ્યારે નવધા ભક્તિ માંહેલી જે ભક્તિ કરતાં થકાં એ પંચવિષયના ઘાની પીડા ન રહે ને પંચવિષયનું સ્મરણ ન થાય એ જ એને પાટો ગોઠ્યો જાણવો અને એ જ એને ભજન-સ્મરણનું અંગ દૃઢ જાણવું. પછી એ અંગમાં રહીને માનસી પૂજા કરવી, નામસ્મરણ કરવું, જે કરવું તે એ પોતાના અંગમાં રહીને કરવું, તો એને અતિશય સમાસ થાય.`,
    citation: '(ગઢડા અંત્ય ૧૫)'
  },
  {
    title: 'Inspirational Wisdom',
    name: 'Pramukh Swami Maharaj',
    handle: '@spiritualquotes',
    isVerified: true,
    text: `"In the joy of others lies our own. In the progress of others rests our own. In the good of others abides our own."`,
    citation: '— Universal Prayer'
  }
];

// Automatically auto-discover all avatar images in public/defaults/avatars/
const dynamicAvatarFiles = import.meta.glob(
  '/public/defaults/avatars/**/*.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' }
);

function formatTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Map discovered avatar files dynamically
const dynamicAvatars = Object.keys(dynamicAvatarFiles)
  .sort()
  .map((path) => {
    const relativeUrl = path.replace(/^\/public\//, '');
    const filename = path.split('/').pop();
    const id = `avatar-${filename.replace(/\.[^/.]+$/, '')}`;
    return {
      id,
      name: formatTitle(filename),
      url: relativeUrl,
      svg: '',
    };
  });

const BUILTIN_SVGS = [
  {
    id: 'lotus',
    name: 'Sacred Lotus',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%2327272a"/><path d="M50 20 C40 40 30 55 50 80 C70 55 60 40 50 20 Z" fill="%23ffffff"/><path d="M50 35 C35 50 20 60 40 80 C48 70 50 55 50 35 Z" fill="%23e4e4e7"/><path d="M50 35 C65 50 80 60 60 80 C52 70 50 55 50 35 Z" fill="%23e4e4e7"/></svg>`
  },
  {
    id: 'wisdom-sun',
    name: 'Radiant Sun',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%2327272a"/><circle cx="50" cy="50" r="24" fill="%23ffffff"/><circle cx="50" cy="50" r="16" fill="%2318181b"/></svg>`
  },
  {
    id: 'peacock',
    name: 'Peacock Feather',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%2327272a"/><ellipse cx="50" cy="50" rx="20" ry="32" fill="%2352525b"/><ellipse cx="50" cy="45" rx="14" ry="20" fill="%23a1a1aa"/><circle cx="50" cy="42" r="7" fill="%23ffffff"/></svg>`
  },
  {
    id: 'quote-icon',
    name: 'Classic Quote',
    svg: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%2318181b"/><text x="50" y="68" font-size="56" font-family="serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">“</text></svg>`
  }
];

export const PRESET_AVATARS = [
  ...dynamicAvatars,
  ...BUILTIN_SVGS
];

// Automatically auto-discover all background images in public/defaults/backgrounds/
const dynamicBgFiles = import.meta.glob(
  '/public/defaults/backgrounds/**/*.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true, query: '?url', import: 'default' }
);

function getCategoryFromPath(path) {
  if (path.includes('/maharaj/')) return 'Maharaj';
  if (path.includes('/day/')) return 'Day & Sunset';
  if (path.includes('/night/')) return 'Night & Dark';
  const parts = path.split('/');
  if (parts.length > 5) {
    return formatTitle(parts[parts.length - 2]);
  }
  return 'Maharaj';
}

const dynamicBackgrounds = Object.keys(dynamicBgFiles)
  .sort()
  .map((path) => {
    const relativeUrl = path.replace(/^\/public\//, '');
    const filename = path.split('/').pop();
    const id = `bg-${filename.replace(/\.[^/.]+$/, '')}`;
    return {
      id,
      name: formatTitle(filename),
      url: relativeUrl,
      category: getCategoryFromPath(path)
    };
  });

export const PRESET_BACKGROUNDS = [
  ...dynamicBackgrounds,
  // Gradients
  {
    id: 'bg-grad-cosmic',
    name: 'Cosmic Pitch Black',
    url: 'linear-gradient(135deg, #18181b 0%, #000000 100%)',
    isGradient: true,
    category: 'Gradients'
  },
  {
    id: 'bg-grad-charcoal',
    name: 'Deep Charcoal',
    url: 'linear-gradient(135deg, #27272a 0%, #09090b 100%)',
    isGradient: true,
    category: 'Gradients'
  },
  {
    id: 'bg-grad-sunrise',
    name: 'Amber Glow',
    url: 'linear-gradient(135deg, #78350f 0%, #18181b 100%)',
    isGradient: true,
    category: 'Gradients'
  },
  {
    id: 'bg-grad-mystic',
    name: 'Midnight Indigo',
    url: 'linear-gradient(135deg, #1e1b4b 0%, #020617 100%)',
    isGradient: true,
    category: 'Gradients'
  }
];

export const THEME_PRESETS = [
  {
    id: 'clean-white',
    name: 'Classic White',
    cardBg: '#ffffff',
    cardOpacity: 96,
    textColor: '#111827',
    nameColor: '#111827',
    handleColor: '#6b7280',
    citationColor: '#374151',
    cardRadius: 28,
    cardShadow: '2xl',
    cardBlur: 0,
    borderWidth: 0,
    borderColor: '#ffffff',
    badgeColor: '#1d9bf0'
  },
  {
    id: 'frosted-glass',
    name: 'Frosted Glass',
    cardBg: '#ffffff',
    cardOpacity: 82,
    textColor: '#0f172a',
    nameColor: '#0f172a',
    handleColor: '#475569',
    citationColor: '#334155',
    cardRadius: 32,
    cardShadow: '2xl',
    cardBlur: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    badgeColor: '#1d9bf0'
  },
  {
    id: 'dark-luxury',
    name: 'Midnight Dark',
    cardBg: '#09090b',
    cardOpacity: 90,
    textColor: '#f4f4f5',
    nameColor: '#ffffff',
    handleColor: '#a1a1aa',
    citationColor: '#d4d4d8',
    cardRadius: 28,
    cardShadow: '2xl',
    cardBlur: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    badgeColor: '#ffffff'
  },
  {
    id: 'warm-sand',
    name: 'Warm Parchment',
    cardBg: '#fffdf8',
    cardOpacity: 96,
    textColor: '#292524',
    nameColor: '#1c1917',
    handleColor: '#78716c',
    citationColor: '#44403c',
    cardRadius: 24,
    cardShadow: 'xl',
    cardBlur: 0,
    borderWidth: 0,
    borderColor: '#e7e5e4',
    badgeColor: '#d97706'
  },
  {
    id: 'minimal-outline',
    name: 'Minimal Clean',
    cardBg: '#ffffff',
    cardOpacity: 100,
    textColor: '#000000',
    nameColor: '#000000',
    handleColor: '#71717a',
    citationColor: '#27272a',
    cardRadius: 20,
    cardShadow: 'md',
    cardBlur: 0,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    badgeColor: '#1d9bf0'
  }
];
