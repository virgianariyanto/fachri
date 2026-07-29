import express from 'express';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ==========================================
// 1. FLAT SITE CONTENT (Hero, About, Contact)
// ==========================================

// GET /api/content — Get all landing page site contents
router.get('/content', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT section, data FROM site_content');
    const contentMap = {};
    rows.forEach(row => {
      contentMap[row.section] = row.data;
    });
    res.json(contentMap);
  } catch (err) {
    console.error('Error fetching site content:', err);
    res.status(500).json({ error: 'Gagal mengambil data konten situs.' });
  }
});

// PUT /api/content/:section — Update a specific section content
router.put('/content/:section', requireAuth, async (req, res) => {
  const { section } = req.params;
  const data = req.body;

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Data konten tidak valid.' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO site_content (section, data)
       VALUES ($1, $2)
       ON CONFLICT (section)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       RETURNING *`,
      [section, JSON.stringify(data)]
    );
    res.json({ message: `Section '${section}' berhasil diperbarui.`, content: rows[0].data });
  } catch (err) {
    console.error(`Error updating site content section ${section}:`, err);
    res.status(500).json({ error: 'Gagal memperbarui data konten situs.' });
  }
});


// ==========================================
// 2. SERVICES
// ==========================================

// GET /api/services — Get all services ordered by sort_order
router.get('/services', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY sort_order ASC, id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ error: 'Gagal mengambil data layanan.' });
  }
});

// POST /api/services — Create a service card
router.post('/services', requireAuth, async (req, res) => {
  const { icon, title, description, sort_order } = req.body;
  if (!title) return res.status(400).json({ error: 'Judul layanan wajib diisi.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO services (icon, title, description, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [icon || 'star', title, description || '', sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).json({ error: 'Gagal menambahkan layanan.' });
  }
});

// PUT /api/services/:id — Update a service card
router.put('/services/:id', requireAuth, async (req, res) => {
  const { icon, title, description, sort_order } = req.body;
  if (!title) return res.status(400).json({ error: 'Judul layanan wajib diisi.' });

  try {
    const { rows } = await pool.query(
      `UPDATE services
       SET icon = $1, title = $2, description = $3, sort_order = $4
       WHERE id = $5
       RETURNING *`,
      [icon, title, description, sort_order || 0, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Layanan tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating service:', err);
    res.status(500).json({ error: 'Gagal memperbarui layanan.' });
  }
});

// DELETE /api/services/:id — Delete a service card
router.delete('/services/:id', requireAuth, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM services WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Layanan tidak ditemukan.' });
    res.json({ message: 'Layanan berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ error: 'Gagal menghapus layanan.' });
  }
});


// ==========================================
// 3. WORKFLOW STEPS
// ==========================================

// GET /api/workflow — Get all workflow steps
router.get('/workflow', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM workflow_steps ORDER BY step_number ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching workflow steps:', err);
    res.status(500).json({ error: 'Gagal mengambil data alur kerja.' });
  }
});

// POST /api/workflow — Create workflow step
router.post('/workflow', requireAuth, async (req, res) => {
  const { step_number, title, description, is_active } = req.body;
  if (!step_number || !title) return res.status(400).json({ error: 'Nomor langkah dan judul wajib diisi.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO workflow_steps (step_number, title, description, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [step_number, title, description || '', is_active === undefined ? true : is_active]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating workflow step:', err);
    res.status(500).json({ error: 'Gagal menambahkan langkah alur kerja.' });
  }
});

// PUT /api/workflow/:id — Update a workflow step
router.put('/workflow/:id', requireAuth, async (req, res) => {
  const { step_number, title, description, is_active } = req.body;
  if (!step_number || !title) return res.status(400).json({ error: 'Nomor langkah dan judul wajib diisi.' });

  try {
    const { rows } = await pool.query(
      `UPDATE workflow_steps
       SET step_number = $1, title = $2, description = $3, is_active = $4
       WHERE id = $5
       RETURNING *`,
      [step_number, title, description, is_active, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Langkah alur kerja tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating workflow step:', err);
    res.status(500).json({ error: 'Gagal memperbarui langkah alur kerja.' });
  }
});

// DELETE /api/workflow/:id — Delete a workflow step
router.delete('/workflow/:id', requireAuth, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM workflow_steps WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Langkah alur kerja tidak ditemukan.' });
    res.json({ message: 'Langkah alur kerja berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting workflow step:', err);
    res.status(500).json({ error: 'Gagal menghapus langkah alur kerja.' });
  }
});


// ==========================================
// 4. STATS
// ==========================================

// GET /api/stats — Get all stats
router.get('/stats', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM stats ORDER BY sort_order ASC, id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Gagal mengambil data statistik.' });
  }
});

// POST /api/stats — Create stats row
router.post('/stats', requireAuth, async (req, res) => {
  const { value, label, use_amber, sort_order } = req.body;
  if (!value || !label) return res.status(400).json({ error: 'Angka/nilai dan label statistik wajib diisi.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO stats (value, label, use_amber, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [value, label, use_amber === undefined ? true : use_amber, sort_order || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating stat:', err);
    res.status(500).json({ error: 'Gagal menambahkan statistik.' });
  }
});

// PUT /api/stats/:id — Update stats row
router.put('/stats/:id', requireAuth, async (req, res) => {
  const { value, label, use_amber, sort_order } = req.body;
  if (!value || !label) return res.status(400).json({ error: 'Angka/nilai dan label statistik wajib diisi.' });

  try {
    const { rows } = await pool.query(
      `UPDATE stats
       SET value = $1, label = $2, use_amber = $3, sort_order = $4
       WHERE id = $5
       RETURNING *`,
      [value, label, use_amber, sort_order || 0, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Statistik tidak ditemukan.' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating stat:', err);
    res.status(500).json({ error: 'Gagal memperbarui statistik.' });
  }
});

// DELETE /api/stats/:id — Delete stats row
router.delete('/stats/:id', requireAuth, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM stats WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Statistik tidak ditemukan.' });
    res.json({ message: 'Statistik berhasil dihapus.' });
  } catch (err) {
    console.error('Error deleting stat:', err);
    res.status(500).json({ error: 'Gagal menghapus statistik.' });
  }
});

export default router;
