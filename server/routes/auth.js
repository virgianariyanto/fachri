import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password minimal 8 karakter.' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.trim().toLowerCase(), hash]
    );
    res.status(201).json({ message: 'Akun berhasil dibuat.', user: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email sudah terdaftar. Gunakan email lain.' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (!rows[0]) {
      return res.status(401).json({ error: 'Email tidak ditemukan.' });
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Password salah.' });
    }

    const token = jwt.sign(
      { id: rows[0].id, role: rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const { password_hash, ...user } = rows[0];
    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/seed-admin
// Jalankan sekali untuk membuat akun demo
// ─────────────────────────────────────────
router.post('/seed-admin', async (req, res) => {
  try {
    const exists = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@studio3d.id']
    );
    if (exists.rows.length > 0) {
      return res.json({ message: 'Admin demo sudah ada.' });
    }

    const hash = await bcrypt.hash('studio3d2024', 10);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      ['Fachri Kurniawan', 'admin@studio3d.id', hash, 'admin']
    );
    res.json({ message: '✅ Admin demo berhasil dibuat. Email: admin@studio3d.id / Pass: studio3d2024' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// PATCH /api/auth/update-email
// Body: { current_password, new_email }
// Header: Authorization: Bearer <token>
// ─────────────────────────────────────────
router.patch('/update-email', requireAuth, async (req, res) => {
  const { current_password, new_email } = req.body;

  if (!current_password || !new_email) {
    return res.status(400).json({ error: 'Password saat ini dan email baru wajib diisi.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(new_email)) {
    return res.status(400).json({ error: 'Format email tidak valid.' });
  }

  try {
    // Ambil user dari database
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1', [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User tidak ditemukan.' });

    // Verifikasi password saat ini
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Password saat ini salah.' });

    // Cek apakah email baru sudah dipakai user lain
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [new_email.trim().toLowerCase(), req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email sudah digunakan oleh akun lain.' });
    }

    // Update email
    const { rows: updated } = await pool.query(
      'UPDATE users SET email = $1 WHERE id = $2 RETURNING id, name, email, role',
      [new_email.trim().toLowerCase(), req.user.id]
    );

    res.json({ message: 'Email berhasil diperbarui.', user: updated[0] });
  } catch (err) {
    console.error('Update email error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// ─────────────────────────────────────────
// PATCH /api/auth/update-password
// Body: { current_password, new_password }
// Header: Authorization: Bearer <token>
// ─────────────────────────────────────────
router.patch('/update-password', requireAuth, async (req, res) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Password saat ini dan password baru wajib diisi.' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: 'Password baru minimal 8 karakter.' });
  }
  if (current_password === new_password) {
    return res.status(400).json({ error: 'Password baru tidak boleh sama dengan password lama.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1', [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User tidak ditemukan.' });

    // Verifikasi password saat ini
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Password saat ini salah.' });

    // Hash & simpan password baru
    const newHash = await bcrypt.hash(new_password, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [newHash, req.user.id]
    );

    res.json({ message: 'Password berhasil diperbarui. Silakan login kembali.' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

export default router;
