import { useLang } from '../lang-context';
import Header from './Header';
import styles from './Hero.module.css';

export default function Hero({ onCtaClick }) {
  const { t } = useLang();
  return (
    <section className={styles.hero}>
      <Header />
      <div className={styles.grid}>
        <div>
          <span className={styles.eyebrow}>{t.heroEyebrow}</span>
          <h1 className={styles.title}>
            {t.heroTitleA}
            <br />
            <em>{t.heroTitleB}</em>
          </h1>
          <p className={styles.desc}>{t.heroDesc}</p>
          <button className={styles.cta} onClick={onCtaClick}>
            <span>{t.heroCta}</span>
            <svg className={styles.arrow} width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className={styles.note}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5a5 5 0 00-5 5v1.5H2.5A1.5 1.5 0 001 9.5v4A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0013.5 8H13V6.5a5 5 0 00-5-5zm-3 6.5V6.5a3 3 0 116 0V8H5z" fill="currentColor" opacity="0.5" />
            </svg>
            <span>{t.heroNote}</span>
          </p>
        </div>

        <div className={styles.art}>
          <svg viewBox="0 0 400 400" fill="none" className={styles.artSvg}>
            <circle cx="200" cy="200" r="160" fill="#EDDEC0" opacity="0.5" />
            <circle cx="200" cy="200" r="120" fill="#F4EAD5" opacity="0.6" />
            <path d="M 60 280 Q 200 260, 340 280 L 340 340 L 60 340 Z" fill="#D4A574" opacity="0.25" />
            <path d="M 60 280 Q 200 260, 340 280" stroke="#B88756" strokeWidth="0.8" fill="none" opacity="0.6" />

            <g transform="translate(280 250)">
              <ellipse cx="0" cy="20" rx="28" ry="7" fill="#B88756" />
              <rect x="-28" y="12" width="56" height="10" fill="#D4A574" />
              <ellipse cx="0" cy="12" rx="28" ry="7" fill="#D4A574" />
              <ellipse cx="0" cy="10" rx="28" ry="7" fill="#E4B984" />
              <rect x="-28" y="0" width="56" height="12" fill="#D4A574" />
              <ellipse cx="0" cy="0" rx="28" ry="7" fill="#E4B984" />
              <text x="0" y="5" textAnchor="middle" fontFamily="Manrope, sans-serif" fontSize="15" fontWeight="600" fill="#7A5C3F">$</text>
              <path d="M 0 -4 Q -2 -18 -8 -24" stroke="#5D6E4D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M 0 -4 Q 2 -15 6 -20" stroke="#5D6E4D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <ellipse cx="-9" cy="-25" rx="5" ry="3" fill="#A8B89A" transform="rotate(-30 -9 -25)" />
              <ellipse cx="7" cy="-21" rx="4" ry="2.5" fill="#A8B89A" transform="rotate(30 7 -21)" />
            </g>

            <ellipse cx="320" cy="310" rx="10" ry="4" fill="#B8A58A" opacity="0.6" />
            <ellipse cx="85" cy="315" rx="8" ry="3" fill="#B8A58A" opacity="0.5" />
            <path d="M 255 220 L 255 215 Q 257 213 259 215 Q 261 213 263 215 L 263 220 L 259 224 Z" fill="#B5634A" opacity="0.7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
