import { catIndexFor } from './i18n';

const SIZE = 13;

const EXPENSE_ICONS = [
  // 0 — Food (fork + knife)
  (
    <svg key="food" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <path d="M4.5 2v5M4.5 7c-1.3 0-1.8-.8-1.8-2V2M4.5 7c1.3 0 1.8-.8 1.8-2V2M4.5 7v7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M11.5 2c-1 0-2 2-2 4s.6 3 2 3v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // 1 — Transport (car)
  (
    <svg key="transport" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 10.5l1.2-4.2A1 1 0 014.7 5.5h6.6a1 1 0 011 .8l1.2 4.2M2.5 10.5h11M2.5 10.5v1.5M13.5 10.5v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="11" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  // 2 — Shopping (bag)
  (
    <svg key="shopping" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 6h9l-.8 7.5a1 1 0 01-1 .9H5.3a1 1 0 01-1-.9L3.5 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 6V4.5a2 2 0 014 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  // 3 — Leisure (music note)
  (
    <svg key="leisure" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <path d="M6 11.5V3l7-1v8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="4.5" cy="11.5" rx="1.6" ry="1.3" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="11.5" cy="10.5" rx="1.6" ry="1.3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  // 4 — Housing (house)
  (
    <svg key="housing" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 8L8 3l5.5 5v6h-11V8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6.5 14v-3.5h3V14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  // 5 — Medical (cross in circle)
  (
    <svg key="medical" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  // 6 — Other (dots)
  (
    <svg key="exp-other" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="8" r="1.1" fill="currentColor" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
      <circle cx="12" cy="8" r="1.1" fill="currentColor" />
    </svg>
  ),
];

const INCOME_ICONS = [
  // 0 — Salary (banknote)
  (
    <svg key="salary" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4.5" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  // 1 — Bonus (star)
  (
    <svg key="bonus" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <path d="M8 2l1.7 3.8 4.1.5-3 2.9.8 4.1L8 11.3l-3.6 1.9.7-4.1-3-2.9 4.2-.5L8 2z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  ),
  // 2 — Investment (rising chart)
  (
    <svg key="investment" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <path d="M2.5 12.5l4-5 3 3 4-6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 4.5h3v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  // 3 — Side gig (briefcase)
  (
    <svg key="sidegig" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5.5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  // 4 — Other (dots)
  (
    <svg key="inc-other" width={SIZE} height={SIZE} viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="8" r="1.1" fill="currentColor" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
      <circle cx="12" cy="8" r="1.1" fill="currentColor" />
    </svg>
  ),
];

export function CategoryIcon({ type, index }) {
  const list = type === 'expense' ? EXPENSE_ICONS : INCOME_ICONS;
  return list[index] ?? list[list.length - 1];
}

export function IconForCategory({ type, category }) {
  return <CategoryIcon type={type} index={catIndexFor(type, category)} />;
}
