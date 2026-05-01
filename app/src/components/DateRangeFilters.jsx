import { useLang } from '../lang-context';
import styles from './DateRangeFilters.module.css';

export default function DateRangeFilters({ start, end, onStartChange, onEndChange, onClear }) {
  const { t } = useLang();
  return (
    <div className={styles.filters}>
      <input
        type="date"
        className={styles.field}
        value={start}
        onChange={(e) => onStartChange(e.target.value)}
      />
      <span className={styles.separator}>—</span>
      <input
        type="date"
        className={styles.field}
        value={end}
        onChange={(e) => onEndChange(e.target.value)}
      />
      <button className={styles.btnMini} onClick={onClear} title={t.clearFilter}>
        {t.clearFilter}
      </button>
    </div>
  );
}
