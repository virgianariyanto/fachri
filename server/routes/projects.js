import express from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────
// GET /api/projects  — publik
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status } = req.query; // ?status=published
    let query = 'SELECT * FROM projects';
    const params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    query += ' ORDER BY sort_order ASC, created_at DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('GET projects error:', err);
    res.status(500).json({ error: 'Gagal mengambil data proyek.' });
  }
});

// ─────────────────────────────────────────
// GET /api/projects/:id  — publik
// ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// POST /api/projects  — hanya admin
// ─────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { title, category, description, client, year, image_url, status, sort_order } = req.body;

  if (!title) return res.status(400).json({ error: 'Judul proyek wajib diisi.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO projects (title, category, description, client, year, image_url, status, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, category, description, client, year, image_url, status || 'draft', sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST project error:', err);
    res.status(500).json({ error: 'Gagal menambah proyek.' });
  }
});

// ─────────────────────────────────────────
// PUT /api/projects/:id  — hanya admin
// ─────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  const { title, category, description, client, year, image_url, status, sort_order } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE projects
       SET title=$1, category=$2, description=$3, client=$4, year=$5,
           image_url=$6, status=$7, sort_order=$8
       WHERE id = $9
       RETURNING *`,
      [title, category, description, client, year, image_url, status, sort_order, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// DELETE /api/projects/:id  — hanya admin
// ─────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM projects WHERE id = $1',
      [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
    res.json({ message: 'Proyek berhasil dihapus.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
