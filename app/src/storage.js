const API_BASE = '/api';
const LANG_KEY = 'daily_ledger_lang_v1';
const TYPE_KEY = 'daily_ledger_type_v1';
const ENTRIES_LEGACY_KEY = 'daily_ledger_v1';
const MIGRATED_FLAG = 'daily_ledger_migrated_v1';

async function api(path, options = {}) {
  const r = await fetch(API_BASE + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`${r.status} ${r.statusText}: ${text}`);
  }
  if (r.status === 204) return null;
  return r.json();
}

export async function getEntries() {
  return api('/entries');
}

export async function addEntry(entry) {
  return api('/entries', { method: 'POST', body: JSON.stringify(entry) });
}

export async function updateEntry(id, patch) {
  return api(`/entries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

export async function deleteEntry(id) {
  await api(`/entries/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function getLang() {
  return localStorage.getItem(LANG_KEY) ?? 'zh';
}

export async function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

export async function getType() {
  return localStorage.getItem(TYPE_KEY) ?? 'expense';
}

export async function setType(type) {
  localStorage.setItem(TYPE_KEY, type);
}

export async function migrateLegacyEntries() {
  if (localStorage.getItem(MIGRATED_FLAG) === 'true') {
    return { skipped: true };
  }

  const raw = localStorage.getItem(ENTRIES_LEGACY_KEY);
  if (!raw) {
    localStorage.setItem(MIGRATED_FLAG, 'true');
    return { skipped: true };
  }

  let local = [];
  try {
    local = JSON.parse(raw);
  } catch {
    local = [];
  }
  if (!Array.isArray(local) || local.length === 0) {
    localStorage.setItem(MIGRATED_FLAG, 'true');
    return { skipped: true };
  }

  const remote = await getEntries();
  if (remote.length > 0) {
    localStorage.setItem(MIGRATED_FLAG, 'true');
    return { skipped: true, reason: 'backend not empty' };
  }

  let migrated = 0;
  for (const entry of local) {
    const { id, ...rest } = entry;
    await addEntry(rest);
    migrated++;
  }

  localStorage.setItem(MIGRATED_FLAG, 'true');
  return { migrated };
}
