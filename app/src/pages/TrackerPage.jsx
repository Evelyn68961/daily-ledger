import { useMemo, useRef } from 'react';
import { useLang } from '../lang-context';
import { useEntries } from '../hooks/useEntries';
import Hero from '../components/Hero';
import StatsRow from '../components/StatsRow';
import AddEntryPanel from '../components/AddEntryPanel';
import EntryListPanel from '../components/EntryListPanel';
import GardenPanel from '../components/GardenPanel';
import FootBar from '../components/FootBar';
import styles from './TrackerPage.module.css';

function currentYearMonth() {
  const now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
}

export default function TrackerPage() {
  const { t } = useLang();
  const { data: entries = [] } = useEntries();
  const appRef = useRef(null);

  const monthEntries = useMemo(() => {
    const ym = currentYearMonth();
    return entries.filter((e) => e.date.startsWith(ym));
  }, [entries]);

  function scrollToApp() {
    appRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      <Hero onCtaClick={scrollToApp} />

      <section ref={appRef} className={styles.appWrap}>
        <div className={`${styles.sectionHead} ${styles.reveal}`}>
          <div>
            <span className={styles.eyebrow}>{t.balanceSub}</span>
            <h2 className={styles.sectionTitle}>
              {t.balanceTitleA} <em>{t.balanceTitleB}</em>
            </h2>
          </div>
        </div>

        <div className={`${styles.reveal} ${styles.d1}`}>
          <StatsRow entries={monthEntries} />
        </div>

        <div className={styles.gridMain}>
          <div className={`${styles.reveal} ${styles.d2}`}>
            <AddEntryPanel />
          </div>
          <div className={`${styles.reveal} ${styles.d3}`}>
            <EntryListPanel entries={entries} />
          </div>
        </div>

        <div className={`${styles.reveal} ${styles.d4}`}>
          <GardenPanel entries={entries} />
        </div>

        <FootBar entries={entries} />

        <div className={styles.foot}>
          <p>
            Daily Ledger · <span className={styles.footTag}>{t.footTag}</span>
          </p>
          <p style={{ marginTop: 6 }}>{t.footNote}</p>
        </div>
      </section>
    </>
  );
}
