import { useMemo, useState } from 'react';
import { useLang } from '../lang-context';
import { useEntries } from '../hooks/useEntries';
import '../chart-setup';
import Header from '../components/Header';
import StatsRow from '../components/StatsRow';
import DateRangeFilters from '../components/DateRangeFilters';
import CategoryDoughnut from '../components/CategoryDoughnut';
import CategoryRanking from '../components/CategoryRanking';
import TopExpenses from '../components/TopExpenses';
import DailyTrendChart from '../components/DailyTrendChart';
import styles from './AnalyzePage.module.css';

function defaultRange() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return {
    start: `${y}-${m}-01`,
    end: `${y}-${m}-${String(lastDay).padStart(2, '0')}`,
  };
}

function previousPeriodRange(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  const span = e - s;
  const prevEnd = new Date(s.getTime() - 86400000);
  const prevStart = new Date(prevEnd.getTime() - span);
  return {
    start: prevStart.toISOString().slice(0, 10),
    end: prevEnd.toISOString().slice(0, 10),
  };
}

export default function AnalyzePage() {
  const { t } = useLang();
  const { data: entries = [] } = useEntries();
  const [{ start, end }, setRange] = useState(defaultRange);

  const filtered = useMemo(
    () =>
      entries.filter((e) => {
        if (start && e.date < start) return false;
        if (end && e.date > end) return false;
        return true;
      }),
    [entries, start, end],
  );

  const expenses = useMemo(
    () => filtered.filter((e) => e.type === 'expense'),
    [filtered],
  );

  const prevExpenses = useMemo(() => {
    const prev = previousPeriodRange(start, end);
    if (!prev) return [];
    return entries.filter(
      (e) => e.type === 'expense' && e.date >= prev.start && e.date <= prev.end,
    );
  }, [entries, start, end]);

  return (
    <section className={styles.wrap}>
      <Header />

      <div className={styles.head}>
        <span className={styles.eyebrow}>{t.pageEyebrow}</span>
        <h1 className={styles.title}>
          {t.pageTitleA} <em>{t.pageTitleB}</em>
        </h1>
      </div>

      <div className={styles.panelGap}>
        <StatsRow entries={filtered} compact />
      </div>

      <div className={styles.panelGap}>
        <CategoryDoughnut
          expenses={expenses}
          prevExpenses={prevExpenses}
          filterStart={start}
          filterEnd={end}
          filtersSlot={
            <DateRangeFilters
              start={start}
              end={end}
              onStartChange={(v) => setRange((r) => ({ ...r, start: v }))}
              onEndChange={(v) => setRange((r) => ({ ...r, end: v }))}
              onClear={() => setRange({ start: '', end: '' })}
            />
          }
        />
      </div>

      <div className={styles.twoCol}>
        <CategoryRanking expenses={expenses} />
        <TopExpenses expenses={expenses} />
      </div>

      <div className={styles.panelGap}>
        <DailyTrendChart expenses={expenses} />
      </div>

      <div className={styles.foot}>
        <p>
          Daily Ledger · <span className={styles.footTag}>{t.footTag}</span>
        </p>
        <p style={{ marginTop: 6 }}>{t.footNote}</p>
      </div>
    </section>
  );
}
