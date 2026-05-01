import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useLang } from '../lang-context';
import { fmtCurrency, I18N } from '../i18n';
import Panel from './Panel';
import styles from './DailyTrendChart.module.css';

export default function DailyTrendChart({ expenses = [] }) {
  const { lang, t } = useLang();

  const { labels, amounts } = useMemo(() => {
    const daily = {};
    for (const e of expenses) {
      daily[e.date] = (daily[e.date] || 0) + e.amount;
    }
    const dates = Object.keys(daily).sort();
    if (dates.length === 0) return { labels: [], amounts: [] };

    const labels = [];
    const amounts = [];
    const startD = new Date(dates[0]);
    const endD = new Date(dates[dates.length - 1]);
    for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      labels.push(key.slice(5)); // MM-DD
      amounts.push(daily[key] || 0);
    }
    return { labels, amounts };
  }, [expenses]);

  const data = {
    labels,
    datasets: [
      {
        data: amounts,
        backgroundColor: '#A8B89A',
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2D3E2A',
        titleFont: { family: "Manrope, 'Noto Sans TC', sans-serif", size: 12, weight: '600' },
        bodyFont: { family: "Manrope, 'Noto Sans TC', sans-serif", size: 13 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (c) => '  ' + fmtCurrency(lang, c.raw),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11, family: "Manrope, 'Noto Sans TC', sans-serif" },
          color: '#9AA68E',
          maxRotation: 0,
        },
      },
      y: {
        grid: { color: '#E8DEC4' },
        ticks: {
          font: { size: 11, family: "Manrope, 'Noto Sans TC', sans-serif" },
          color: '#9AA68E',
          callback: (v) => I18N[lang].currency + ' ' + v.toLocaleString(),
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Panel title={t.trend} count={t.trendSub}>
      {labels.length === 0 ? (
        <div className={styles.empty}>{t.emptyTrend}</div>
      ) : (
        <div className={styles.wrap}>
          <Bar data={data} options={options} />
        </div>
      )}
    </Panel>
  );
}
