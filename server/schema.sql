-- ====================================================
-- Schema untuk project Fachri Portfolio
-- Database: fachri
-- PostgreSQL 18.4
-- ====================================================

-- Ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABEL: users (Admin accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role        VARCHAR(20)   NOT NULL DEFAULT 'admin',
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL: projects (Portfolio)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(200)  NOT NULL,
  category    VARCHAR(100),
  description TEXT,
  client      VARCHAR(100),
  year        VARCHAR(10),
  image_url   TEXT,
  status      VARCHAR(20)   NOT NULL DEFAULT 'draft',
  sort_order  INTEGER       DEFAULT 0,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABEL: inquiries (Pesan dari klien via form)
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(255)  NOT NULL,
  project_type VARCHAR(100),
  message      TEXT,
  status       VARCHAR(20)   NOT NULL DEFAULT 'new',
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- FUNCTION: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEED: Sample projects data
-- ============================================================
INSERT INTO projects (title, category, description, client, year, image_url, status, sort_order)
VALUES
  (
    'FUTURE_VIBE DJ CONSOLE',
    'EVENT SET DESIGN',
    'Ultra-modern booth for X-MUSIC FEST featuring geometric panels and high-fidelity rendering.',
    'X-MUSIC FEST', '2024',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
    'published', 1
  ),
  (
    'PETFEST 2026',
    'EXHIBITION BOOTH',
    'Award-winning pavilion design for Pet Care Indo, emphasizing minimal architectural aesthetics.',
    'PET CARE INDO', '2026',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
    'published', 2
  ),
  (
    'CHRONOS LUXURY RETAIL HUB',
    'COMMERCIAL SPACE',
    'Bespoke luxury retail interior for high-end timepiece showcase with custom architectural lighting.',
    'CHRONOS', '2025',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    'draft', 3
  );
