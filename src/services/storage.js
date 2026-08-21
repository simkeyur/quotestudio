const STORAGE_KEY_ACTIVE = 'quote_studio_active_state_v1';
const STORAGE_KEY_DRAFTS = 'quote_studio_saved_drafts_v1';

/**
 * Load the last active editor configuration from localStorage
 */
export function loadActiveState(defaultConfig) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw);
    return { ...defaultConfig, ...parsed };
  } catch (e) {
    console.warn('Failed to load active state from localStorage:', e);
    return defaultConfig;
  }
}

/**
 * Save current active editor configuration to localStorage
 */
export function saveActiveState(config) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save active state to localStorage:', e);
  }
}

/**
 * Get all saved user drafts
 */
export function getSavedDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DRAFTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to get drafts from localStorage:', e);
    return [];
  }
}

/**
 * Save a new named draft
 */
export function saveDraft(name, config) {
  try {
    const drafts = getSavedDrafts();
    const newDraft = {
      id: 'draft_' + Date.now(),
      name: name || `Quote Draft ${drafts.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: { ...config }
    };
    const updatedDrafts = [newDraft, ...drafts];
    localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(updatedDrafts));
    return newDraft;
  } catch (e) {
    console.error('Failed to save draft:', e);
    return null;
  }
}

/**
 * Delete a draft by ID
 */
export function deleteDraft(id) {
  try {
    const drafts = getSavedDrafts().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(drafts));
    return drafts;
  } catch (e) {
    console.error('Failed to delete draft:', e);
    return [];
  }
}

/**
 * Export all data as JSON
 */
export function exportAllDataAsJSON() {
  try {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      activeConfig: JSON.parse(localStorage.getItem(STORAGE_KEY_ACTIVE) || '{}'),
      savedDrafts: getSavedDrafts()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quote-studio-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Failed to export data JSON:', e);
  }
}

/**
 * Clear all local data and reset to defaults
 */
export function clearAllLocalData() {
  try {
    localStorage.removeItem(STORAGE_KEY_ACTIVE);
    localStorage.removeItem(STORAGE_KEY_DRAFTS);
  } catch (e) {
    console.error('Failed to clear data:', e);
  }
}
