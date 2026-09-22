import gitaData from '../constants/bhagvad_geeta.js';

/**
 * Returns all 18 chapters of Bhagavad Gita with metadata
 */
export function getGitaChapters() {
  return gitaData.chapters || [];
}

/**
 * Returns a specific chapter's info
 */
export function getGitaChapter(chapterNum) {
  const ch = parseInt(chapterNum, 10);
  return (gitaData.chapters || []).find((c) => c.chapter === ch) || null;
}

/**
 * Returns total verses in a given chapter
 */
export function getChapterVerseCount(chapterNum) {
  const ch = getGitaChapter(chapterNum);
  return ch ? ch.verses_count : 47;
}

/**
 * Get verse data by chapter and verse number
 * @param {number|string} chapterNum
 * @param {number|string} verseNum
 * @returns {object|null}
 */
export function getGitaVerse(chapterNum, verseNum) {
  const ch = parseInt(chapterNum, 10);
  const v = parseInt(verseNum, 10);
  const key = `${ch}.${v}`;
  return gitaData.verses?.[key] || null;
}

/**
 * Get next verse reference
 */
export function getNextVerseRef(chapterNum, verseNum) {
  let ch = parseInt(chapterNum, 10);
  let v = parseInt(verseNum, 10);
  const totalInCh = getChapterVerseCount(ch);

  if (v < totalInCh) {
    return { chapter: ch, verse: v + 1 };
  } else if (ch < 18) {
    return { chapter: ch + 1, verse: 1 };
  } else {
    return { chapter: 1, verse: 1 };
  }
}

/**
 * Get previous verse reference
 */
export function getPrevVerseRef(chapterNum, verseNum) {
  let ch = parseInt(chapterNum, 10);
  let v = parseInt(verseNum, 10);

  if (v > 1) {
    return { chapter: ch, verse: v - 1 };
  } else if (ch > 1) {
    const prevCh = ch - 1;
    const prevTotal = getChapterVerseCount(prevCh);
    return { chapter: prevCh, verse: prevTotal };
  } else {
    const lastTotal = getChapterVerseCount(18);
    return { chapter: 18, verse: lastTotal };
  }
}

/**
 * Format Sanskrit chapter & verse title in Devanagari numerals
 */
export function formatDevanagariNumeral(num) {
  const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return String(num).replace(/[0-9]/g, (d) => devanagariDigits[parseInt(d, 10)]);
}

export function formatGitaHeader(chapterNum, verseNum, devanagari = true) {
  if (devanagari) {
    return `॥ श्रीमद्भगवद्गीता ${formatDevanagariNumeral(chapterNum)}.${formatDevanagariNumeral(verseNum)} ॥`;
  }
  return `Bhagavad Gita ${chapterNum}.${verseNum}`;
}

/**
 * Cleans and formats shloka Sanskrit text for royal presentation:
 * Replaces ASCII or unformatted verse markers like ।।2.47।। or ||2.47|| with ॥ २.४७ ॥
 * and standardizes danda punctuation.
 */
export function cleanShlokaDisplay(text) {
  if (!text) return '';
  return text
    // Replace verse tags like ।।2.47।। or ||2.47|| with ॥ २.४७ ॥
    .replace(/(?:।।|\|\||॥)\s*(\d+)\.(\d+)\s*(?:।।|\|\||॥)/g, (_, ch, v) => `॥ ${formatDevanagariNumeral(ch)}.${formatDevanagariNumeral(v)} ॥`)
    .replace(/(?:।।|\|\||॥)\s*(\d+)\s*(?:।।|\|\||॥)/g, (_, v) => `॥ ${formatDevanagariNumeral(v)} ॥`)
    // Replace ASCII pipes or double devanagari dandas with authentic Sanskrit ॥
    .replace(/(\|\||।।)/g, '॥')
    // Replace single ASCII pipe with single Sanskrit danda ।
    .replace(/\|/g, '।');
}
