import styles from './Panel.module.css';

export default function Panel({ title, count, className = '', children }) {
  return (
    <div className={`${styles.panel} ${className}`}>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        {count !== undefined && count !== null && (
          <span className={styles.count}>{count}</span>
        )}
      </div>
      {children}
    </div>
  );
}
