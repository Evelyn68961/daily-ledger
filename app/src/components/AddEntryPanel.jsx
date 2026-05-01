import { useEffect, useState } from 'react';
import { useLang } from '../lang-context';
import { CategoryIcon } from '../icons';
import { useAddEntry } from '../hooks/useEntries';
import { getType, setType as persistType } from '../storage';
import Panel from './Panel';
import styles from './AddEntryPanel.module.css';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function AddEntryPanel() {
  const { t } = useLang();
  const addEntry = useAddEntry();

  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(null);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayIso());
  const [note, setNote] = useState('');

  useEffect(() => {
    getType().then((stored) => {
      setType(stored === 'income' ? 'income' : 'expense');
    });
  }, []);

  const cats = type === 'expense' ? t.catsExp : t.catsInc;

  useEffect(() => {
    if (!cats.includes(category)) setCategory(cats[0]);
  }, [cats, category]);

  function handleTypeChange(next) {
    setType(next);
    persistType(next);
  }

  const amt = parseFloat(amount);
  const canSubmit = amt > 0 && date && category && !addEntry.isPending;

  function handleSubmit() {
    if (!canSubmit) return;
    addEntry.mutate(
      { type, amount: amt, date, category, note: note.trim() },
      {
        onSuccess: () => {
          setAmount('');
          setNote('');
        },
      },
    );
  }

  return (
    <Panel title={t.add}>
      <div className={styles.typeToggle}>
        <button
          className={type === 'expense' ? styles.onExp : ''}
          onClick={() => handleTypeChange('expense')}
        >
          {t.expense}
        </button>
        <button
          className={type === 'income' ? styles.onInc : ''}
          onClick={() => handleTypeChange('income')}
        >
          {t.income}
        </button>
      </div>

      <div className={styles.row2}>
        <input
          type="number"
          className={styles.input}
          placeholder={t.amount}
          step="1"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          className={styles.input}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <input
        type="text"
        className={`${styles.input} ${styles.noteInput}`}
        placeholder={t.note}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <p className={styles.formLabel}>{t.labelCat}</p>
      <div className={styles.cats}>
        {cats.map((c, i) => (
          <button
            key={c}
            className={`${styles.chip} ${category === c ? styles.chipOn : ''}`}
            onClick={() => setCategory(c)}
          >
            <CategoryIcon type={type} index={i} />
            <span>{c}</span>
          </button>
        ))}
      </div>

      <button
        className={styles.submit}
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {t.submit}
      </button>
    </Panel>
  );
}
