import { useLang } from '../lang-context';
import Header from '../components/Header';
import styles from './AboutPage.module.css';

const FEATURE_ICONS = [
  // 1 — plus
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10h14M10 3v14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  // 2 — clock
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 3v7l5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  // 3 — chart line
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 17l5-8 4 5 5-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // 4 — download
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 5h12v10H4z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 8v5M7 10l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
];

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AboutPage() {
  const { t } = useLang();

  return (
    <section className={styles.wrap}>
      <Header />

      <div className={styles.aboutHead}>
        <span className={`${styles.eyebrow}`}>{t.aboutEyebrow}</span>
        <h1 className={styles.aboutTitle}>
          {t.aboutTitleA} <em>{t.aboutTitleB}</em>
        </h1>
        <p className={styles.aboutDesc}>{t.aboutDesc}</p>
      </div>

      <div className={styles.why}>
        <span className={`${styles.eyebrow} ${styles.whyEyebrow}`}>{t.whyEyebrow}</span>
        <h2 className={styles.whyTitle}>
          {t.whyTitleA} <em>{t.whyTitleB}</em>
        </h2>
        <p>{t.whyP1}</p>
        <p>{t.whyP2}</p>
      </div>

      <div className={styles.secHead}>
        <span className={`${styles.eyebrow} ${styles.secEyebrow}`}>{t.featEyebrow}</span>
        <h2 className={styles.secTitle}>
          {t.featTitleA} <em>{t.featTitleB}</em>
        </h2>
      </div>
      <div className={styles.featRibbon}>
        {t.feats.map((f, i) => (
          <div key={i} className={styles.feat}>
            <span className={styles.featIcon}>{FEATURE_ICONS[i]}</span>
            <div className={styles.featLabel}>{f.label}</div>
            <div className={styles.featDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div className={styles.how}>
        <div className={styles.secHead}>
          <span className={`${styles.eyebrow} ${styles.secEyebrow}`}>{t.howEyebrow}</span>
          <h2 className={styles.secTitle}>
            {t.howTitleA} <em>{t.howTitleB}</em>
          </h2>
        </div>
        <div className={styles.steps}>
          {t.steps.map((s, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
              <div className={styles.stepLabel}>{s.label}</div>
              <div className={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.privacy}>
        <div className={styles.secHead}>
          <span className={`${styles.eyebrow} ${styles.secEyebrow}`}>{t.privEyebrow}</span>
          <h2 className={styles.secTitle}>
            {t.privTitleA} <em>{t.privTitleB}</em>
          </h2>
        </div>
        <div className={styles.privacyCard}>
          <div className={styles.privacyIcon}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 11V8a7 7 0 1114 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="16" r="1.3" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className={styles.privacyIntro}>{t.privIntro}</p>
            <ul className={styles.privacyList}>
              {t.privList.map((item, i) => (
                <li key={i}>
                  <Check />
                  <span>
                    <b>{item.bold}</b>
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
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
