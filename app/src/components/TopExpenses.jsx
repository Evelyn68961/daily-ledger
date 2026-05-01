import { useMemo } from 'react';
import { useLang } from '../lang-context';
import { fmtCurrency } from '../i18n';
import Panel from './Panel';
import styles from './TopExpenses.module.css';

export default function TopExpenses({ expenses = [], limit = 5 }) {
  const { lang, t } = useLang();

  const top = useMemo(
    () => [...expenses].sort((a, b) => b.amount - a.amount).slice(0, limit),
    [expenses, limit],
  );

  return (
    <Panel title={t.top} count={t.topSub}>
      {top.length === 0 ? (
        <div className={styles.empty}>{t.emptyTop}</div>
      ) : (
        <div className={styles.list}>
          {top.map((e) => (
            <div key={e.id} className={styles.row}>
              <div className={styles.left}>
                <div className={styles.note}>{e.note || e.category}</div>
                <div className={styles.meta}>{e.date} · {e.category}</div>
              </div>
              <div className={styles.amt}>{fmtCurrency(lang, e.amount)}</div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
