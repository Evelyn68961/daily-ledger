import { useMemo } from 'react';
import { useLang } from '../lang-context';
import { fmtCurrency } from '../i18n';
import styles from './StatsRow.module.css';

export default function StatsRow({ entries = [], compact = false }) {
  const { lang, t } = useLang();

  const { inc, exp } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    for (const e of entries) {
      if (e.type === 'income') inc += e.amount;
      else exp += e.amount;
    }
    return { inc, exp };
  }, [entries]);

  const bal = inc - exp;

  return (
    <div className={`${styles.row} ${compact ? styles.compact : ''}`}>
      <div className={`${styles.stat} ${styles.inc}`}>
        <div className={styles.label}>{t.inc}</div>
        <div className={styles.value}>{fmtCurrency(lang, inc)}</div>
      </div>
      <div className={`${styles.stat} ${styles.exp}`}>
        <div className={styles.label}>{t.exp}</div>
        <div className={styles.value}>{fmtCurrency(lang, exp)}</div>
      </div>
      <div className={`${styles.stat} ${styles.bal}`}>
        <div className={styles.label}>{t.bal}</div>
        <div className={`${styles.value} ${bal < 0 ? styles.balNeg : ''}`}>
          {fmtCurrency(lang, bal)}
        </div>
      </div>
    </div>
  );
}
