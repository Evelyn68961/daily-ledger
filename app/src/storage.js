const ENTRIES_KEY = 'daily_ledger_v1';
const LANG_KEY = 'daily_ledger_lang_v1';
const TYPE_KEY = 'daily_ledger_type_v1';

function readEntries() {
  const raw = localStorage.getItem(ENTRIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeEntries(entries) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function getEntries() {
  return readEntries();
}

export async function addEntry(entry) {
  const entries = readEntries();
  const created = { ...entry, id: entry.id ?? crypto.randomUUID() };
  entries.push(created);
  writeEntries(entries);
  return created;
}

export async function updateEntry(id, patch) {
  const entries = readEntries();
  const idx = entries.findIndex(e => e.id === id);
  if (idx === -1) throw new Error(`Entry ${id} not found`);
  entries[idx] = { ...entries[idx], ...patch, id };
  writeEntries(entries);
  return entries[idx];
}

export async function deleteEntry(id) {
  const entries = readEntries().filter(e => e.id !== id);
  writeEntries(entries);
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
