import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../lang-context';
import styles from './Header.module.css';

const PAGES = [
  { path: '/', labelKey: 'navTracker' },
  { path: '/analyze', labelKey: 'navAnalyze' },
  { path: '/about', labelKey: 'navAbout' },
];

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { pathname } = useLocation();

  const otherPages = PAGES.filter((p) => p.path !== pathname);

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <svg className={styles.logoMark} viewBox="0 0 40 40" fill="none">
          <path d="M20 6 Q12 14 11 24 Q11 32 20 34 Q29 32 29 24 Q28 14 20 6 Z" fill="#A8B89A" opacity="0.9" />
          <path d="M20 10 L20 34" stroke="#5D6E4D" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M20 16 Q15 17 13 22" stroke="#5D6E4D" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          <path d="M20 22 Q26 23 28 27" stroke="#5D6E4D" strokeWidth="0.7" fill="none" strokeLinecap="round" />
        </svg>
        <span>Daily Ledger</span>
      </Link>
      <div className={styles.right}>
        {otherPages.map((p) => (
          <Link key={p.path} className={styles.link} to={p.path}>
            {t[p.labelKey]}
          </Link>
        ))}
        <div className={styles.langSwitch}>
          <button
            className={lang === 'zh' ? styles.langOn : ''}
            onClick={() => setLang('zh')}
          >
            中文
          </button>
          <button
            className={lang === 'en' ? styles.langOn : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </div>
    </nav>
  );
}
