import { useLang } from '../lang-context';
import { useAddEntry, useClearAllEntries } from '../hooks/useEntries';
import styles from './FootBar.module.css';

function buildSampleDates(count) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthLastDay = new Date(year, month, 0).getDate();
  return Array.from({ length: count }, (_, i) => {
    const day = Math.max(1, Math.round(((i + 0.5) / count) * monthLastDay));
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  });
}

function escapeCsv(v) {
  const s = String(v == null ? '' : v);
  return /[,"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export default function FootBar({ entries = [] }) {
  const { lang, t } = useLang();
  const addEntry = useAddEntry();
  const clearAll = useClearAllEntries();

  async function handleLoadSample() {
    const dates = buildSampleDates(8);
    const samples = [
      { type: 'income', amount: 45000, date: dates[0], category: t.catsInc[0], note: t.sampleNotes.salary },
      { type: 'expense', amount: 18000, date: dates[1], category: t.catsExp[4], note: t.sampleNotes.rent },
      { type: 'expense', amount: 3200, date: dates[2], category: t.catsExp[0], note: t.sampleNotes.groceries },
      { type: 'expense', amount: 1200, date: dates[3], category: t.catsExp[1], note: t.sampleNotes.transit },
      { type: 'expense', amount: 2800, date: dates[4], category: t.catsExp[2], note: t.sampleNotes.supplies },
      { type: 'expense', amount: 850, date: dates[5], category: t.catsExp[0], note: t.sampleNotes.lunch },
      { type: 'expense', amount: 1500, date: dates[6], category: t.catsExp[3], note: t.sampleNotes.movie },
      { type: 'income', amount: 5000, date: dates[7], category: t.catsInc[3], note: t.sampleNotes.freelance },
    ];
    for (const s of samples) {
      await addEntry.mutateAsync(s);
    }
  }

  function handleExportCsv() {
    if (entries.length === 0) {
      alert(t.noExportData);
      return;
    }
    const typeMap = {
      expense: lang === 'zh' ? '支出' : 'Expense',
      income: lang === 'zh' ? '收入' : 'Income',
    };
    const rows = entries.map((e) =>
      [e.date, typeMap[e.type], e.category, e.amount, e.note || '']
        .map(escapeCsv)
        .join(','),
    );
    const csv = '﻿' + t.csvHeaders.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daily-ledger-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleClearAll() {
    if (!confirm(t.confirmClear)) return;
    clearAll.mutate();
  }

  return (
    <div className={styles.bar}>
      <button onClick={handleLoadSample}>{t.loadSample}</button>
      <button onClick={handleExportCsv}>{t.exportCsv}</button>
      <button onClick={handleClearAll}>{t.clearAll}</button>
    </div>
  );
}
