-- ====================================================
-- MIGRATION: Dynamic Content Tables
-- Run on: fachri database
-- ====================================================

-- ============================================================
-- TABEL: site_content (Hero, About, Contact — JSONB)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  section     VARCHAR(50)  PRIMARY KEY,
  data        JSONB        NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_site_content_updated_at();

-- ============================================================
-- TABEL: services
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  icon        VARCHAR(100) NOT NULL DEFAULT 'star',
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- TABEL: workflow_steps
-- ============================================================
CREATE TABLE IF NOT EXISTS workflow_steps (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number INTEGER NOT NULL,
  title       VARCHAR(100) NOT NULL,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- TABEL: stats
-- ============================================================
CREATE TABLE IF NOT EXISTS stats (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  value       VARCHAR(20)  NOT NULL,
  label       VARCHAR(100) NOT NULL,
  use_amber   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- SEED: site_content
-- ============================================================
INSERT INTO site_content (section, data) VALUES
('hero', '{
  "badge": "JAKARTA BASED STUDIO",
  "name_line1": "FACHRI",
  "name_line2": "KURNIAWAN",
  "subtitle": "3D Exhibition & Event Designer / Branding Specialist",
  "cta_primary": "VIEW WORK",
  "cta_secondary": "HIRE ME",
  "floating_label": "X-MUSIC FEST 2024"
}'),
('about', '{
  "section_label": "01 / THE STUDIO",
  "headline": "Crafting experiences through spatial precision and technical artistry.",
  "body": "I specialize in translating brand identities into three-dimensional realities. Based in Jakarta, I work at the intersection of architecture and event design, ensuring every pixel and every millimeter is calculated for maximum impact. From massive expo booths to intimate shop-in-shop experiences, my focus is always on the synthesis of form, function, and brand storytelling.",
  "tools": ["SKETCHUP", "RHINO", "BLENDER", "LUMION", "KEYSHOT", "ADOBE SUITE"]
}'),
('contact', '{
  "section_label": "05 / CONTACT",
  "headline": "Let''s build something extraordinary.",
  "subtext": "Currently accepting commissions for late 2024 and 2025 exhibitions.",
  "quote": "Spatial design is the ultimate form of branding. It''s where the brand becomes tangible.",
  "whatsapp": "https://wa.me/?text=Hello%20Fachri",
  "email": "mailto:contact@studio3d.id",
  "linkedin": "#",
  "instagram": "#"
}')
ON CONFLICT (section) DO NOTHING;

-- ============================================================
-- SEED: services
-- ============================================================
INSERT INTO services (icon, title, description, sort_order) VALUES
('architecture', 'Exhibition Design', 'Large-scale pavilion concepts with a focus on visitor flow and technical feasibility.', 1),
('storefront',   'Commercial Space',  'Shop-in-shop and retail environments that elevate product presentation.', 2),
('theaters',     'Event Set Design',  'Immersive stages and branded environments for product launches and corporate events.', 3),
('category',     'Visual Branding',   'Integrating graphic identity into the physical space for holistic brand consistency.', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: workflow_steps
-- ============================================================
INSERT INTO workflow_steps (step_number, title, description, is_active) VALUES
(1, 'CONCEPT',   'Brainstorming spatial logic, mood-boarding and site analysis.', true),
(2, 'VISUALS',   'High-fidelity 3D modeling and photorealistic octane rendering.', false),
(3, 'TECHNICAL', 'Detailed CAD blueprints for production and construction precision.', false),
(4, 'BUILD',     'Supervising physical production and high-end finishing touches.', false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: stats
-- ============================================================
INSERT INTO stats (value, label, use_amber, sort_order) VALUES
('50+',  'PROJECTS COMPLETED', true,  1),
('12+',  'DESIGN AWARDS',      true,  2),
('2026', 'RUNNER-UP PETFEST',  false, 3)
ON CONFLICT DO NOTHING;
