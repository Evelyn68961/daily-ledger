import { useMemo, useRef, useState } from 'react';
import { useLang } from '../lang-context';
import { catIndexFor, fmtCurrency } from '../i18n';
import { plantFor, heightFor } from '../plants';
import Panel from './Panel';
import styles from './GardenPanel.module.css';

const VW = 1000;
const VH = 320;
const GROUND_Y = VH - 60;

function currentYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

function ymString({ year, month }) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

function stepMonth({ year, month }, delta) {
  const next = month + delta;
  if (next < 0) return { year: year - 1, month: 11 };
  if (next > 11) return { year: year + 1, month: 0 };
  return { year, month: next };
}

function formatMonthLabel({ year, month }, lang) {
  return new Date(year, month, 1).toLocaleDateString(
    lang === 'zh' ? 'zh-Hant' : 'en-US',
    { year: 'numeric', month: 'long' },
  );
}

function hash01(seed) {
  const x = Math.sin(seed * 9301.7 + 49297.3) * 43758.5453;
  return x - Math.floor(x);
}

function hashSeed(id) {
  const s = String(id);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function GardenPanel({ entries = [] }) {
  const { lang, t } = useLang();
  const wrapRef = useRef(null);
  const [chip, setChip] = useState(null);
  const [viewMonth, setViewMonth] = useState(currentYearMonth);

  const ym = ymString(viewMonth);
  const isCurrent = useMemo(() => {
    const cur = currentYearMonth();
    return cur.year === viewMonth.year && cur.month === viewMonth.month;
  }, [viewMonth]);

  const placements = useMemo(() => {
    const expenses = entries
      .filter((e) => e.type === 'expense' && e.date.startsWith(ym))
      .sort((a, b) => a.date.localeCompare(b.date) || String(a.id).localeCompare(String(b.id)));

    if (expenses.length === 0) return [];

    const marginL = 80;
    const marginR = 80;
    const usableW = VW - marginL - marginR;
    const n = expenses.length;
    const slotW = n <= 1 ? usableW : usableW / (n - 1);
    const jitterMax = Math.min(slotW * 0.22, 28);

    return expenses
      .map((e, i) => {
        const catIdx = catIndexFor('expense', e.category);
        const Plant = plantFor(catIdx);
        const plantH = heightFor(catIdx);
        const slotX = n === 1 ? VW / 2 : marginL + (i / (n - 1)) * usableW;
        const seed = hashSeed(e.id);
        const x = slotX + (hash01(seed) - 0.5) * 2 * jitterMax;
        const y = GROUND_Y + (hash01(seed + 7919) - 0.5) * 10;
        const amtLog = Math.log(Math.max(10, e.amount));
        const scale = 0.55 + Math.min(1, amtLog / Math.log(40000)) * 0.95;
        return { e, Plant, plantH, x, y, scale };
      })
      .sort((a, b) => b.plantH * b.scale - a.plantH * a.scale);
  }, [entries, ym]);

  function handlePlantClick(evt, p) {
    evt.stopPropagation();
    const wrapRect = wrapRef.current?.getBoundingClientRect();
    if (!wrapRect) return;
    const cx = evt.clientX - wrapRect.left;
    const cy = evt.clientY - wrapRect.top;
    setChip({
      entry: p.e,
      left: Math.max(80, Math.min(wrapRect.width - 80, cx)),
      top: Math.max(8, cy - 52),
    });
  }

  function handleBackgroundClick() {
    setChip(null);
  }

  function goPrev() {
    setChip(null);
    setViewMonth((vm) => stepMonth(vm, -1));
  }

  function goNext() {
    if (isCurrent) return;
    setChip(null);
    setViewMonth((vm) => stepMonth(vm, 1));
  }

  return (
    <Panel title={t.garden} count={t.gardenSub}>
      <div className={styles.monthNav}>
        <button
          className={styles.monthBtn}
          onClick={goPrev}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className={styles.monthLabel}>{formatMonthLabel(viewMonth, lang)}</span>
        <button
          className={styles.monthBtn}
          onClick={goNext}
          disabled={isCurrent}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div ref={wrapRef} className={styles.wrap} onClick={handleBackgroundClick}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMax meet"
        >
          <path
            d={`M0 ${GROUND_Y} Q${VW / 2} ${GROUND_Y - 18} ${VW} ${GROUND_Y} L${VW} ${VH} L0 ${VH} Z`}
            fill="#D4A574"
            opacity="0.22"
          />
          <path
            d={`M0 ${GROUND_Y} Q${VW / 2} ${GROUND_Y - 18} ${VW} ${GROUND_Y}`}
            stroke="#B88756"
            strokeWidth="0.6"
            fill="none"
            opacity="0.5"
          />
          <circle cx="880" cy="60" r="22" fill="#E4B984" opacity="0.35" />
          <circle cx="880" cy="60" r="14" fill="#E4B984" opacity="0.5" />
          <ellipse cx="130" cy={GROUND_Y + 18} rx="12" ry="4" fill="#B8A58A" opacity="0.5" />
          <ellipse cx="760" cy={GROUND_Y + 22} rx="10" ry="3.5" fill="#B8A58A" opacity="0.45" />

          {placements.length === 0 ? (
            <text
              x={VW / 2}
              y={VH / 2}
              textAnchor="middle"
              fill="#9AA68E"
              fontSize="15"
              fontStyle="italic"
              fontFamily="Manrope, 'Noto Sans TC', sans-serif"
            >
              {t.emptyGarden}
            </text>
          ) : (
            placements.map((p) => {
              const { Plant, e } = p;
              return (
                <g
                  key={e.id}
                  className={styles.plant}
                  transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${p.scale.toFixed(3)})`}
                  onClick={(evt) => handlePlantClick(evt, p)}
                >
                  <title>
                    {`${e.date} · ${e.category}${e.note ? ' · ' + e.note : ''} · ${fmtCurrency(lang, e.amount)}`}
                  </title>
                  <Plant />
                </g>
              );
            })
          )}
        </svg>

        <div
          className={`${styles.chip} ${chip ? styles.chipOn : ''}`}
          role="status"
          aria-live="polite"
          style={chip ? { left: chip.left, top: chip.top } : undefined}
        >
          {chip && (
            <>
              <div className={styles.chipMeta}>
                {chip.entry.date} · {chip.entry.category}
                {chip.entry.note ? ' · ' + chip.entry.note : ''}
              </div>
              <div className={styles.chipAmt}>{fmtCurrency(lang, chip.entry.amount)}</div>
            </>
          )}
        </div>
      </div>
      <p className={styles.legend}>{t.gardenLegend}</p>
    </Panel>
  );
}
