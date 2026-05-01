import { useMemo, useState } from 'react';
import { useLang } from '../lang-context';
import { fmtCurrency } from '../i18n';
import { IconForCategory } from '../icons';
import { useDeleteEntry } from '../hooks/useEntries';
import Panel from './Panel';
import DateRangeFilters from './DateRangeFilters';
import styles from './EntryListPanel.module.css';

export default function EntryListPanel({ entries = [] }) {
  const { lang, t } = useLang();
  const deleteEntry = useDeleteEntry();
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  const filtered = useMemo(() => {
    return entries
      .filter((e) => {
        if (filterStart && e.date < filterStart) return false;
        if (filterEnd && e.date > filterEnd) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id)));
  }, [entries, filterStart, filterEnd]);

  function clearFilters() {
    setFilterStart('');
    setFilterEnd('');
  }

  return (
    <Panel title={t.hist} count={t.count(filtered.length)}>
      <DateRangeFilters
        start={filterStart}
        end={filterEnd}
        onStartChange={setFilterStart}
        onEndChange={setFilterEnd}
        onClear={clearFilters}
      />

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>{t.emptyList}</p>
          </div>
        ) : (
          filtered.map((e) => {
            const isInc = e.type === 'income';
            return (
              <div key={e.id} className={styles.txn}>
                <div className={`${styles.mark} ${isInc ? styles.markInc : styles.markExp}`}>
                  <IconForCategory type={e.type} category={e.category} />
                </div>
                <div className={styles.body}>
                  <div className={styles.note}>{e.note || e.category}</div>
                  <div className={styles.meta}>{e.date} · {e.category}</div>
                </div>
                <div className={`${styles.amt} ${isInc ? styles.amtInc : styles.amtExp}`}>
                  {(isInc ? '+' : '−') + fmtCurrency(lang, e.amount)}
                </div>
                <button
                  className={styles.del}
                  title="Delete"
                  onClick={() => deleteEntry.mutate(e.id)}
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}
