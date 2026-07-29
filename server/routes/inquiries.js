import express from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/inquiries  — publik (form submit)
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, project_type, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nama dan email wajib diisi.' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO inquiries (name, email, project_type, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, project_type, status, created_at`,
      [name.trim(), email.trim().toLowerCase(), project_type, message]
    );
    res.status(201).json({ message: 'Inquiry berhasil dikirim!', inquiry: rows[0] });
  } catch (err) {
    console.error('POST inquiry error:', err);
    res.status(500).json({ error: 'Gagal mengirim inquiry.' });
  }
});

// ─────────────────────────────────────────
// GET /api/inquiries  — hanya admin
// ─────────────────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM inquiries ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// PATCH /api/inquiries/:id/status  — hanya admin
// ─────────────────────────────────────────
router.patch('/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'replied', 'closed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status tidak valid. Pilih: ${validStatuses.join(', ')}` });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Inquiry tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
