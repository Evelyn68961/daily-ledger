import { useMemo } from 'react';
import { useLang } from '../lang-context';
import { fmtCurrency } from '../i18n';
import { PALETTE } from '../chart-setup';
import Panel from './Panel';
import styles from './CategoryRanking.module.css';

export default function CategoryRanking({ expenses = [] }) {
  const { lang, t } = useLang();

  const sorted = useMemo(() => {
    const bucket = {};
    for (const e of expenses) bucket[e.category] = (bucket[e.category] || 0) + e.amount;
    return Object.entries(bucket).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const total = sorted.reduce((s, r) => s + r[1], 0);

  return (
    <Panel title={t.rank} count={t.rankSub}>
      {sorted.length === 0 ? (
        <div className={styles.empty}>{t.emptyRank}</div>
      ) : (
        <div className={styles.list}>
          {sorted.map(([cat, amt], i) => {
            const pct = total ? Math.round((amt / total) * 100) : 0;
            const color = PALETTE[i % PALETTE.length];
            return (
              <div key={cat} className={styles.row}>
                <div className={styles.info}>
                  <div className={styles.top}>
                    <span className={styles.cat}>{cat}</span>
                    <span className={styles.pct}>{pct}%</span>
                  </div>
                  <div className={styles.barBg}>
                    <div
                      className={styles.bar}
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
                <div className={styles.amt}>{fmtCurrency(lang, amt)}</div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
