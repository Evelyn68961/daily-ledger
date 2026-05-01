import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useLang } from '../lang-context';
import { fmtCurrency } from '../i18n';
import { PALETTE } from '../chart-setup';
import Panel from './Panel';
import PlantBadge from './PlantBadge';
import styles from './CategoryDoughnut.module.css';

function bucketByCategory(expenses) {
  const bucket = {};
  for (const e of expenses) bucket[e.category] = (bucket[e.category] || 0) + e.amount;
  return bucket;
}

function daysBetween(start, end) {
  if (!start || !end) return 1;
  return Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000) + 1);
}

export default function CategoryDoughnut({
  expenses = [],
  prevExpenses = [],
  filterStart,
  filterEnd,
  title,
  subtitle,
  filtersSlot,
}) {
  const { lang, t } = useLang();

  const { labels, data, totalExp, sortedBuckets } = useMemo(() => {
    const bucket = bucketByCategory(expenses);
    const labels = Object.keys(bucket);
    const data = Object.values(bucket);
    const totalExp = data.reduce((a, b) => a + b, 0);
    const sortedBuckets = Object.entries(bucket).sort((a, b) => b[1] - a[1]);
    return { labels, data, totalExp, sortedBuckets };
  }, [expenses]);

  const prevTotal = useMemo(
    () => prevExpenses.reduce((s, e) => s + e.amount, 0),
    [prevExpenses],
  );

  const txnCount = expenses.length;
  const days = daysBetween(filterStart, filterEnd);
  const dailyAvg = labels.length ? totalExp / days : 0;
  const topCat = sortedBuckets[0]?.[0];

  const compare = useMemo(() => {
    if (prevTotal <= 0 || labels.length === 0) return null;
    const diff = totalExp - prevTotal;
    const pct = Math.round((Math.abs(diff) / prevTotal) * 100);
    if (diff > 0) return { kind: 'up', text: `↑ ${pct}% ${t.compareUp}` };
    if (diff < 0) return { kind: 'down', text: `↓ ${pct}% ${t.compareDown}` };
    return { kind: 'same', text: `— ${t.compareSame}` };
  }, [totalExp, prevTotal, labels.length, t]);

  const centerTextPlugin = useMemo(
    () => ({
      id: 'centerText',
      afterDraw: (ch) => {
        const meta = ch.getDatasetMeta(0);
        const arc = meta?.data?.[0];
        if (!arc) return;
        const c = ch.ctx;
        c.save();
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.font = "700 22px Manrope, 'Noto Sans TC', sans-serif";
        c.fillStyle = '#2D3E2A';
        c.fillText(fmtCurrency(lang, totalExp), arc.x, arc.y - 10);
        c.font = "500 11px Manrope, 'Noto Sans TC', sans-serif";
        c.fillStyle = '#9AA68E';
        c.fillText(t.centerLabel, arc.x, arc.y + 14);
        c.restore();
      },
    }),
    [totalExp, lang, t],
  );

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: PALETTE.slice(0, labels.length),
        borderWidth: 3,
        borderColor: '#FBF5E7',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2D3E2A',
        titleFont: { family: "Manrope, 'Noto Sans TC', sans-serif", size: 13, weight: '600' },
        bodyFont: { family: "Manrope, 'Noto Sans TC', sans-serif", size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = total ? Math.round((ctx.raw / total) * 100) : 0;
            return `  ${fmtCurrency(lang, ctx.raw)}  ·  ${pct}%`;
          },
        },
      },
    },
  };

  return (
    <Panel title={title ?? t.chart} count={subtitle ?? t.chartSub}>
      {filtersSlot}

      {labels.length === 0 ? (
        <div className={styles.empty}>{t.emptyChart}</div>
      ) : (
        <>
          <div className={styles.area}>
            <div className={styles.canvasWrap}>
              <Doughnut
                data={chartData}
                options={chartOptions}
                plugins={[centerTextPlugin]}
              />
            </div>
            <div className={styles.legendRight}>
              {labels.map((label, i) => {
                const pct = totalExp ? Math.round((data[i] / totalExp) * 100) : 0;
                return (
                  <div key={label} className={styles.legendItem}>
                    <PlantBadge category={label} />
                    <span className={styles.legendCat}>{label}</span>
                    <span className={styles.legendPct}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryVal}>{txnCount}</div>
              <div className={styles.summaryLbl}>{t.sumTxn}</div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryVal}>{fmtCurrency(lang, dailyAvg)}</div>
              <div className={styles.summaryLbl}>{t.sumAvg}</div>
            </div>
            <div className={styles.summaryItem}>
              <div className={styles.summaryVal}>{topCat ?? '—'}</div>
              <div className={styles.summaryLbl}>{t.sumTopCat}</div>
            </div>
          </div>

          {compare && (
            <div>
              <div
                className={`${styles.compare} ${
                  compare.kind === 'up' ? styles.compareUp : compare.kind === 'down' ? styles.compareDown : ''
                }`}
              >
                {compare.text}
              </div>
            </div>
          )}
        </>
      )}
    </Panel>
  );
}
