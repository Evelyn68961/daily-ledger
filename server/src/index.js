import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { db } from './db.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const listStmt = db.prepare('SELECT id, type, amount, date, category, note FROM entries ORDER BY date DESC, created_at DESC');
const getStmt = db.prepare('SELECT id, type, amount, date, category, note FROM entries WHERE id = ?');
const insertStmt = db.prepare('INSERT INTO entries (id, type, amount, date, category, note) VALUES (?, ?, ?, ?, ?, ?)');
const deleteStmt = db.prepare('DELETE FROM entries WHERE id = ?');

app.get('/api/entries', (_req, res) => {
  res.json(listStmt.all());
});

app.post('/api/entries', (req, res) => {
  const { type, amount, date, category, note = '' } = req.body ?? {};
  if (type !== 'expense' && type !== 'income') return res.status(400).json({ error: 'invalid type' });
  if (typeof amount !== 'number') return res.status(400).json({ error: 'amount must be a number' });
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
  if (typeof category !== 'string' || !category) return res.status(400).json({ error: 'category required' });

  const id = randomUUID();
  insertStmt.run(id, type, amount, date, category, note);
  res.status(201).json(getStmt.get(id));
});

app.patch('/api/entries/:id', (req, res) => {
  const existing = getStmt.get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'not found' });

  const merged = { ...existing, ...req.body, id: existing.id };
  db.prepare('UPDATE entries SET type = ?, amount = ?, date = ?, category = ?, note = ? WHERE id = ?')
    .run(merged.type, merged.amount, merged.date, merged.category, merged.note ?? '', existing.id);
  res.json(getStmt.get(existing.id));
});

app.delete('/api/entries/:id', (req, res) => {
  const result = deleteStmt.run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`daily-ledger api listening on http://localhost:${port}`);
});
