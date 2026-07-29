import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const API_URL = 'http://localhost:3001/api';

const statusColors = {
  Published: 'bg-green-100 text-green-700',
  Draft: 'bg-surface-container text-on-surface-variant',
  New: 'bg-secondary-container text-on-secondary-container',
  Replied: 'bg-green-100 text-green-700',
  Closed: 'bg-outline-variant text-on-surface-variant',
};

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-surface border border-outline-variant p-6 relative group hover:border-secondary transition-colors">
      <span className="material-symbols-outlined text-secondary text-3xl mb-4 block">{icon}</span>
      <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{label}</p>
      <p className="text-4xl font-bold text-primary tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
      {sub && <p className="text-xs text-on-surface-variant mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Project Form State ──
  const [projectForm, setProjectForm] = useState({
    id: null,
    title: '',
    category: 'EVENT SET DESIGN',
    description: '',
    client: '',
    year: '',
    image_url: '',
    status: 'draft',
    sort_order: 0,
  });
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  // ── Email form state ──
  const [emailForm, setEmailForm] = useState({ current_password: '', new_email: '' });
  const [emailStatus, setEmailStatus] = useState({ loading: false, error: '', success: '' });
  const [showEmailCurrentPass, setShowEmailCurrentPass] = useState(false);

  // ── Password form state ──
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [passStatus, setPassStatus] = useState({ loading: false, error: '', success: '' });
  const [showPassFields, setShowPassFields] = useState({ current: false, new: false, confirm: false });

  // ── Landing Page Content State ──
  const [contentSubTab, setContentSubTab] = useState('hero'); // 'hero', 'about', 'services', 'workflow', 'stats', 'contact'
  const [heroForm, setHeroForm] = useState({
    badge: '',
    name_line1: '',
    name_line2: '',
    subtitle: '',
    cta_primary: '',
    cta_secondary: '',
    floating_label: '',
    image_url: '',
  });
  const [aboutForm, setAboutForm] = useState({
    section_label: '',
    headline: '',
    body: '',
    tools: '',
  });
  const [contactForm, setContactForm] = useState({
    section_label: '',
    headline: '',
    subtext: '',
    quote: '',
    whatsapp: '',
    email: '',
    linkedin: '',
    instagram: '',
  });

  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({ id: null, icon: 'star', title: '', description: '', sort_order: 0 });
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);

  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [workflowForm, setWorkflowForm] = useState({ id: null, step_number: 1, title: '', description: '', is_active: true });
  const [isWorkflowFormOpen, setIsWorkflowFormOpen] = useState(false);

  const [stats, setStats] = useState([]);
  const [statForm, setStatForm] = useState({ id: null, value: '', label: '', use_amber: true, sort_order: 0 });
  const [isStatFormOpen, setIsStatFormOpen] = useState(false);

  const [contentStatus, setContentStatus] = useState({ loading: false, error: '', success: '' });

  // ── Fetch Dashboard Data ──
  const fetchAllData = async () => {
    try {
      const token = getToken();

      // Fetch projects
      const resProjects = await fetch(`${API_URL}/projects`);
      if (resProjects.ok) {
        const data = await resProjects.json();
        setProjects(data);
      }

      // Fetch inquiries (Requires Token)
      if (token) {
        const resInquiries = await fetch(`${API_URL}/inquiries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resInquiries.ok) {
          const data = await resInquiries.json();
          setInquiries(data);
        }
      }

      // Fetch flat content
      const resContent = await fetch(`${API_URL}/content`);
      if (resContent.ok) {
        const data = await resContent.json();
        if (data.hero) setHeroForm(data.hero);
        if (data.about) {
          setAboutForm({
            ...data.about,
            tools: Array.isArray(data.about.tools) ? data.about.tools.join(', ') : '',
          });
        }
        if (data.contact) setContactForm(data.contact);
      }

      // Fetch services
      const resServices = await fetch(`${API_URL}/services`);
      if (resServices.ok) {
        const data = await resServices.json();
        setServices(data);
      }

      // Fetch workflow
      const resWorkflow = await fetch(`${API_URL}/workflow`);
      if (resWorkflow.ok) {
        const data = await resWorkflow.json();
        setWorkflowSteps(data);
      }

      // Fetch stats
      const resStats = await fetch(`${API_URL}/stats`);
      if (resStats.ok) {
        const data = await resStats.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // ── Projects CRUD ──
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const token = getToken();
    const isEdit = !!projectForm.id;
    const url = isEdit ? `${API_URL}/projects/${projectForm.id}` : `${API_URL}/projects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: projectForm.title,
          category: projectForm.category,
          description: projectForm.description,
          client: projectForm.client,
          year: projectForm.year,
          image_url: projectForm.image_url,
          status: projectForm.status,
          sort_order: parseInt(projectForm.sort_order) || 0,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Gagal menyimpan proyek.');
        return;
      }

      setIsProjectFormOpen(false);
      setProjectForm({ id: null, title: '', category: 'EVENT SET DESIGN', description: '', client: '', year: '', image_url: '', status: 'draft', sort_order: 0 });
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan.');
    }
  };

  const handleDeleteProject = async (id) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchAllData();
      } else {
        const err = await res.json();
        alert(err.error || 'Gagal menghapus proyek.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Services CRUD ──
  const handleSaveService = async (e) => {
    e.preventDefault();
    const token = getToken();
    const isEdit = !!serviceForm.id;
    const url = isEdit ? `${API_URL}/services/${serviceForm.id}` : `${API_URL}/services`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceForm),
      });

      if (res.ok) {
        setIsServiceFormOpen(false);
        setServiceForm({ id: null, icon: 'star', title: '', description: '', sort_order: 0 });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id) => {
    const token = getToken();
    if (!confirm('Hapus layanan ini?')) return;
    try {
      await fetch(`${API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Workflow Steps CRUD ──
  const handleSaveWorkflow = async (e) => {
    e.preventDefault();
    const token = getToken();
    const isEdit = !!workflowForm.id;
    const url = isEdit ? `${API_URL}/workflow/${workflowForm.id}` : `${API_URL}/workflow`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(workflowForm),
      });

      if (res.ok) {
        setIsWorkflowFormOpen(false);
        setWorkflowForm({ id: null, step_number: 1, title: '', description: '', is_active: true });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteWorkflow = async (id) => {
    const token = getToken();
    if (!confirm('Hapus langkah workflow ini?')) return;
    try {
      await fetch(`${API_URL}/workflow/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Stats CRUD ──
  const handleSaveStat = async (e) => {
    e.preventDefault();
    const token = getToken();
    const isEdit = !!statForm.id;
    const url = isEdit ? `${API_URL}/stats/${statForm.id}` : `${API_URL}/stats`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statForm),
      });

      if (res.ok) {
        setIsStatFormOpen(false);
        setStatForm({ id: null, value: '', label: '', use_amber: true, sort_order: 0 });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStat = async (id) => {
    const token = getToken();
    if (!confirm('Hapus statistik ini?')) return;
    try {
      await fetch(`${API_URL}/stats/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Flat Content Save (Hero, About, Contact) ──
  const handleSaveFlatContent = async (section, data) => {
    const token = getToken();
    setContentStatus({ loading: true, error: '', success: '' });

    try {
      const res = await fetch(`${API_URL}/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setContentStatus({ loading: false, error: '', success: json.message });
      setTimeout(() => setContentStatus((p) => ({ ...p, success: '' })), 3000);
      fetchAllData();
    } catch (err) {
      setContentStatus({ loading: false, error: err.message, success: '' });
    }
  };

  // ── Inquiry status update ──
  const handleInquiryStatus = async (id, status) => {
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'dashboard' },
    { key: 'projects', label: 'Proyek', icon: 'grid_view' },
    { key: 'inquiries', label: 'Inquiry', icon: 'mail' },
    { key: 'content', label: 'Konten', icon: 'edit_note' },
    { key: 'settings', label: 'Pengaturan', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-surface border-r border-outline-variant flex-col flex-shrink-0">
        <div className="p-6 border-b border-outline-variant">
          <Link to="/" className="font-bold tracking-tighter text-xl text-primary block" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            fachri
          </Link>
          <p className="text-xs text-on-surface-variant mt-1 uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm ${
                activeTab === tab.key
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, letterSpacing: '0.05em' }}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              {tab.label.toUpperCase()}
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-outline-variant">
          <div className="flex items-center gap-3 p-3 bg-surface-container">
            <div className="w-9 h-9 bg-primary text-on-primary flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-on-surface truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user?.name}</p>
              <p className="text-xs text-on-surface-variant truncate" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{user?.role?.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 border border-outline text-on-surface-variant hover:border-error hover:text-error transition-colors text-xs uppercase tracking-widest"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-surface border-b border-outline-variant px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {tabs.find((t) => t.key === activeTab)?.label}
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Selamat datang, {user?.name} 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors border border-outline-variant px-3 py-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span className="material-symbols-outlined text-sm">open_in_new</span>
              Lihat Portfolio
            </Link>
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center gap-1 text-xs text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-base">logout</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="grid_view" label="Total Proyek" value={projects.length} sub="Dalam database" />
                <StatCard icon="mail" label="Inquiry Masuk" value={inquiries.length} sub="Semua pesan" />
                <StatCard icon="emoji_events" label="Design Awards" value="12+" sub="Sejak 2020" />
                <StatCard icon="visibility" label="Views Hari Ini" value="842" sub="+12% dari kemarin" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent projects */}
                <div className="bg-surface border border-outline-variant p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-primary text-sm uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Proyek Terbaru
                    </h2>
                    <button onClick={() => setActiveTab('projects')} className="text-xs text-secondary hover:underline" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      LIHAT SEMUA
                    </button>
                  </div>
                  <div className="space-y-3">
                    {projects.slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-3 border-b border-outline-variant last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-on-surface" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{p.title}</p>
                          <p className="text-xs text-on-surface-variant uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.category}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 uppercase tracking-wider rounded-sm ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent inquiries */}
                <div className="bg-surface border border-outline-variant p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-primary text-sm uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Inquiry Terbaru
                    </h2>
                    <button onClick={() => setActiveTab('inquiries')} className="text-xs text-secondary hover:underline" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      LIHAT SEMUA
                    </button>
                  </div>
                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div key={inq.id} className="flex items-center justify-between py-3 border-b border-outline-variant last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-on-surface" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{inq.name}</p>
                          <p className="text-xs text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{inq.project_type}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 uppercase tracking-wider ${statusColors[inq.status === 'new' ? 'New' : inq.status === 'replied' ? 'Replied' : 'Closed']}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-on-surface-variant uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {projects.length} proyek ditemukan
                </p>
                <button
                  onClick={() => {
                    setProjectForm({ id: null, title: '', category: 'EVENT SET DESIGN', description: '', client: '', year: '', image_url: '', status: 'draft', sort_order: 0 });
                    setIsProjectFormOpen(true);
                  }}
                  className="bg-primary text-on-primary px-6 py-2 text-xs tracking-widest hover:bg-secondary transition-colors flex items-center gap-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  TAMBAH PROYEK
                </button>
              </div>

              {/* Form Add / Edit Project */}
              {isProjectFormOpen && (
                <div className="mb-8 p-6 bg-surface border border-outline-variant">
                  <h3 className="font-bold text-primary mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {projectForm.id ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                  </h3>
                  <form onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Judul Proyek</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Kategori</label>
                        <select
                          value={projectForm.category}
                          onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none focus:border-primary"
                        >
                          <option>EVENT SET DESIGN</option>
                          <option>EXHIBITION BOOTH</option>
                          <option>COMMERCIAL SPACE</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Klien</label>
                        <input
                          type="text"
                          value={projectForm.client}
                          onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Tahun</label>
                        <input
                          type="text"
                          value={projectForm.year}
                          onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Sort Order</label>
                        <input
                          type="number"
                          value={projectForm.sort_order}
                          onChange={(e) => setProjectForm({ ...projectForm, sort_order: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>URL Gambar Render (Unsplash / URL absolut)</label>
                      <input
                        type="url"
                        value={projectForm.image_url}
                        onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Deskripsi Proyek</label>
                      <textarea
                        rows="3"
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="status"
                            checked={projectForm.status === 'draft'}
                            onChange={() => setProjectForm({ ...projectForm, status: 'draft' })}
                            className="mr-2"
                          />
                          Draft
                        </label>
                        <label className="inline-flex items-center ml-4">
                          <input
                            type="radio"
                            name="status"
                            checked={projectForm.status === 'published'}
                            onChange={() => setProjectForm({ ...projectForm, status: 'published' })}
                            className="mr-2"
                          />
                          Published
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="submit" className="bg-primary text-on-primary px-6 py-2 text-xs font-semibold tracking-widest hover:bg-secondary">
                        SIMPAN
                      </button>
                      <button type="button" onClick={() => setIsProjectFormOpen(false)} className="border border-outline px-6 py-2 text-xs tracking-widest hover:bg-surface-container-low">
                        BATAL
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-surface border border-outline-variant overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-container border-b border-outline-variant">
                      {['Judul', 'Kategori', 'Klien', 'Tahun', 'Status', 'Order', 'Aksi'].map((h) => (
                        <th key={h} className="text-left text-xs uppercase tracking-widest text-on-surface-variant px-6 py-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                        <td className="px-6 py-4 font-semibold text-sm text-on-surface" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{p.title}</td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.category}</td>
                        <td className="px-6 py-4 text-sm text-on-surface" style={{ fontFamily: 'Inter, sans-serif' }}>{p.client}</td>
                        <td className="px-6 py-4 text-sm text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.year}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] px-2 py-1 uppercase tracking-wider rounded-sm ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-surface-container text-on-surface-variant'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{p.sort_order}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setProjectForm({
                                  id: p.id,
                                  title: p.title || '',
                                  category: p.category || 'EVENT SET DESIGN',
                                  description: p.description || '',
                                  client: p.client || '',
                                  year: p.year || '',
                                  image_url: p.image_url || '',
                                  status: p.status || 'draft',
                                  sort_order: p.sort_order || 0,
                                });
                                setIsProjectFormOpen(true);
                              }}
                              className="text-on-surface-variant hover:text-primary transition-colors"
                              aria-label="Edit project"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button onClick={() => setDeleteConfirm(p.id)} className="text-on-surface-variant hover:text-error transition-colors" aria-label="Delete project">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── INQUIRIES TAB ── */}
          {activeTab === 'inquiries' && (
            <div className="bg-surface border border-outline-variant overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant">
                    {['Nama', 'Email', 'Jenis Proyek', 'Pesan', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="text-left text-xs uppercase tracking-widest text-on-surface-variant px-6 py-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm text-on-surface" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{inq.name}</td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{inq.email}</td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{inq.project_type}</td>
                      <td className="px-6 py-4 text-sm text-on-surface max-w-xs truncate" title={inq.message}>{inq.message}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] px-2 py-1 uppercase tracking-wider rounded-sm ${statusColors[inq.status === 'new' ? 'New' : inq.status === 'replied' ? 'Replied' : 'Closed']}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleInquiryStatus(inq.id, 'replied')}
                            className="text-xs bg-surface-container-low hover:bg-surface-container border border-outline-variant px-2 py-1 uppercase"
                          >
                            Mark Replied
                          </button>
                          <button
                            onClick={() => handleInquiryStatus(inq.id, 'closed')}
                            className="text-xs bg-surface-container-low hover:bg-surface-container border border-outline-variant px-2 py-1 uppercase text-error"
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── KONTEN TAB (Landing Page Editor) ── */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Sub tabs */}
              <div className="flex border-b border-outline-variant pb-2 flex-wrap gap-2">
                {['hero', 'about', 'services', 'workflow', 'stats', 'contact'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setContentSubTab(sub);
                      setContentStatus({ loading: false, error: '', success: '' });
                    }}
                    className={`px-4 py-2 text-xs tracking-wider uppercase font-semibold border-b-2 transition-all ${
                      contentSubTab === sub
                        ? 'border-secondary text-secondary'
                        : 'border-transparent text-on-surface-variant hover:text-primary'
                    }`}
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              {/* Status alerts */}
              {contentStatus.error && (
                <div className="p-4 bg-error-container border-l-4 border-error text-on-error-container text-sm flex items-start gap-2">
                  <span className="material-symbols-outlined text-error">error</span>
                  <span>{contentStatus.error}</span>
                </div>
              )}
              {contentStatus.success && (
                <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 text-sm flex items-start gap-2">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  <span>{contentStatus.success}</span>
                </div>
              )}

              {/* Sub-tab forms */}
              {contentSubTab === 'hero' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveFlatContent('hero', heroForm);
                  }}
                  className="bg-surface border border-outline-variant p-8 space-y-6"
                >
                  <h3 className="font-bold text-primary text-sm uppercase tracking-widest border-b border-outline-variant pb-3">Edit Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Badge Label</label>
                      <input
                        type="text"
                        required
                        value={heroForm.badge}
                        onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Floating Project Label</label>
                      <input
                        type="text"
                        required
                        value={heroForm.floating_label}
                        onChange={(e) => setHeroForm({ ...heroForm, floating_label: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Name Line 1</label>
                      <input
                        type="text"
                        required
                        value={heroForm.name_line1}
                        onChange={(e) => setHeroForm({ ...heroForm, name_line1: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Name Line 2 (Stroked)</label>
                      <input
                        type="text"
                        required
                        value={heroForm.name_line2}
                        onChange={(e) => setHeroForm({ ...heroForm, name_line2: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Subtitle / Tagline</label>
                    <input
                      type="text"
                      required
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">URL Gambar Hero (Unsplash / URL absolut)</label>
                    <input
                      type="url"
                      value={heroForm.image_url}
                      onChange={(e) => setHeroForm({ ...heroForm, image_url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Primary CTA Button</label>
                      <input
                        type="text"
                        required
                        value={heroForm.cta_primary}
                        onChange={(e) => setHeroForm({ ...heroForm, cta_primary: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Secondary CTA Button</label>
                      <input
                        type="text"
                        required
                        value={heroForm.cta_secondary}
                        onChange={(e) => setHeroForm({ ...heroForm, cta_secondary: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-primary text-on-primary px-8 py-3 text-xs tracking-widest hover:bg-secondary transition-colors uppercase font-bold">
                    Simpan Perubahan Hero
                  </button>
                </form>
              )}

              {contentSubTab === 'about' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const toolsArray = aboutForm.tools.split(',').map(s => s.trim()).filter(Boolean);
                    handleSaveFlatContent('about', {
                      ...aboutForm,
                      tools: toolsArray
                    });
                  }}
                  className="bg-surface border border-outline-variant p-8 space-y-6"
                >
                  <h3 className="font-bold text-primary text-sm uppercase tracking-widest border-b border-outline-variant pb-3">Edit About Section</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Section Label</label>
                      <input
                        type="text"
                        required
                        value={aboutForm.section_label}
                        onChange={(e) => setAboutForm({ ...aboutForm, section_label: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Headline</label>
                      <input
                        type="text"
                        required
                        value={aboutForm.headline}
                        onChange={(e) => setAboutForm({ ...aboutForm, headline: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Body Paragraph</label>
                      <textarea
                        rows="4"
                        required
                        value={aboutForm.body}
                        onChange={(e) => setAboutForm({ ...aboutForm, body: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Core Stack Tools (comma-separated list)</label>
                      <input
                        type="text"
                        required
                        value={aboutForm.tools}
                        onChange={(e) => setAboutForm({ ...aboutForm, tools: e.target.value })}
                        placeholder="SKETCHUP, RHINO, BLENDER, LUMION, KEYSHOT"
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-primary text-on-primary px-8 py-3 text-xs tracking-widest hover:bg-secondary transition-colors uppercase font-bold">
                    Simpan Perubahan About
                  </button>
                </form>
              )}

              {contentSubTab === 'contact' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveFlatContent('contact', contactForm);
                  }}
                  className="bg-surface border border-outline-variant p-8 space-y-6"
                >
                  <h3 className="font-bold text-primary text-sm uppercase tracking-widest border-b border-outline-variant pb-3">Edit Contact Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Section Label</label>
                      <input
                        type="text"
                        required
                        value={contactForm.section_label}
                        onChange={(e) => setContactForm({ ...contactForm, section_label: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Headline</label>
                      <input
                        type="text"
                        required
                        value={contactForm.headline}
                        onChange={(e) => setContactForm({ ...contactForm, headline: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Subtext</label>
                      <input
                        type="text"
                        required
                        value={contactForm.subtext}
                        onChange={(e) => setContactForm({ ...contactForm, subtext: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Quote Statement</label>
                      <input
                        type="text"
                        required
                        value={contactForm.quote}
                        onChange={(e) => setContactForm({ ...contactForm, quote: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <h4 className="font-semibold text-xs uppercase tracking-widest text-secondary pt-4 border-t border-outline-variant">Social & Contact Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">WhatsApp Link / Api URL</label>
                      <input
                        type="text"
                        value={contactForm.whatsapp}
                        onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                        placeholder="https://wa.me/..."
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Email Link / Address</label>
                      <input
                        type="text"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="mailto:name@domain.com"
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">LinkedIn Link</label>
                      <input
                        type="text"
                        value={contactForm.linkedin}
                        onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Instagram Link</label>
                      <input
                        type="text"
                        value={contactForm.instagram}
                        onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-primary text-on-primary px-8 py-3 text-xs tracking-widest hover:bg-secondary transition-colors uppercase font-bold">
                    Simpan Perubahan Contact
                  </button>
                </form>
              )}

              {contentSubTab === 'services' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Layanan</h3>
                    <button
                      onClick={() => {
                        setServiceForm({ id: null, icon: 'star', title: '', description: '', sort_order: 0 });
                        setIsServiceFormOpen(true);
                      }}
                      className="bg-primary text-on-primary px-6 py-2 text-xs font-semibold tracking-widest hover:bg-secondary flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">add</span> TAMBAH LAYANAN
                    </button>
                  </div>

                  {isServiceFormOpen && (
                    <form onSubmit={handleSaveService} className="mb-6 p-6 bg-surface border border-outline-variant space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Nama Icon (Material Icons)</label>
                          <input
                            type="text"
                            required
                            value={serviceForm.icon}
                            onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                            placeholder="architecture, storefront, category..."
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Judul Layanan</label>
                          <input
                            type="text"
                            required
                            value={serviceForm.title}
                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Sort Order</label>
                          <input
                            type="number"
                            required
                            value={serviceForm.sort_order}
                            onChange={(e) => setServiceForm({ ...serviceForm, sort_order: parseInt(e.target.value) || 0 })}
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Deskripsi Singkat</label>
                        <textarea
                          rows="2"
                          required
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-primary text-on-primary px-5 py-2 text-xs font-semibold tracking-widest">SIMPAN</button>
                        <button type="button" onClick={() => setIsServiceFormOpen(false)} className="border border-outline px-5 py-2 text-xs tracking-widest hover:bg-surface-container-low">BATAL</button>
                      </div>
                    </form>
                  )}

                  <div className="bg-surface border border-outline-variant overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-surface-container border-b border-outline-variant">
                          {['Icon', 'Judul', 'Deskripsi', 'Order', 'Aksi'].map(h => (
                            <th key={h} className="text-left text-xs uppercase tracking-widest text-on-surface-variant px-6 py-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((item) => (
                          <tr key={item.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                            <td className="px-6 py-4 font-mono text-sm text-secondary"><span className="material-symbols-outlined">{item.icon}</span></td>
                            <td className="px-6 py-4 font-semibold text-sm text-on-surface" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.title}</td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant max-w-sm truncate">{item.description}</td>
                            <td className="px-6 py-4 text-sm text-on-surface">{item.sort_order}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setServiceForm(item);
                                    setIsServiceFormOpen(true);
                                  }}
                                  className="text-on-surface-variant hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDeleteService(item.id)} className="text-on-surface-variant hover:text-error transition-colors">
                                  <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {contentSubTab === 'workflow' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Workflow</h3>
                    <button
                      onClick={() => {
                        setWorkflowForm({ id: null, step_number: workflowSteps.length + 1, title: '', description: '', is_active: false });
                        setIsWorkflowFormOpen(true);
                      }}
                      className="bg-primary text-on-primary px-6 py-2 text-xs font-semibold tracking-widest hover:bg-secondary flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">add</span> TAMBAH LANGKAH
                    </button>
                  </div>

                  {isWorkflowFormOpen && (
                    <form onSubmit={handleSaveWorkflow} className="mb-6 p-6 bg-surface border border-outline-variant space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Langkah Ke-</label>
                          <input
                            type="number"
                            required
                            value={workflowForm.step_number}
                            onChange={(e) => setWorkflowForm({ ...workflowForm, step_number: parseInt(e.target.value) || 1 })}
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Judul Langkah</label>
                          <input
                            type="text"
                            required
                            value={workflowForm.title}
                            onChange={(e) => setWorkflowForm({ ...workflowForm, title: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Status Warna (Fill/Stroke)</label>
                          <label className="inline-flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={workflowForm.is_active}
                              onChange={(e) => setWorkflowForm({ ...workflowForm, is_active: e.target.checked })}
                              className="mr-2"
                            />
                            Gunakan Fill Warna Hitam (Aktif)
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Deskripsi Singkat</label>
                        <textarea
                          rows="2"
                          required
                          value={workflowForm.description}
                          onChange={(e) => setWorkflowForm({ ...workflowForm, description: e.target.value })}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-primary text-on-primary px-5 py-2 text-xs font-semibold tracking-widest">SIMPAN</button>
                        <button type="button" onClick={() => setIsWorkflowFormOpen(false)} className="border border-outline px-5 py-2 text-xs tracking-widest hover:bg-surface-container-low">BATAL</button>
                      </div>
                    </form>
                  )}

                  <div className="bg-surface border border-outline-variant overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-surface-container border-b border-outline-variant">
                          {['No', 'Judul', 'Deskripsi', 'Tipe Visual', 'Aksi'].map(h => (
                            <th key={h} className="text-left text-xs uppercase tracking-widest text-on-surface-variant px-6 py-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {workflowSteps.map((step) => (
                          <tr key={step.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                            <td className="px-6 py-4 font-mono text-sm text-secondary">{step.step_number}</td>
                            <td className="px-6 py-4 font-semibold text-sm text-on-surface" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{step.title}</td>
                            <td className="px-6 py-4 text-sm text-on-surface-variant max-w-sm truncate">{step.description}</td>
                            <td className="px-6 py-4 text-xs font-semibold">
                              <span className={`px-2 py-1 uppercase rounded-sm ${step.is_active ? 'bg-primary text-on-primary' : 'bg-surface border border-primary text-primary'}`}>
                                {step.is_active ? 'Filled (Active)' : 'Stroked'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setWorkflowForm(step);
                                    setIsWorkflowFormOpen(true);
                                  }}
                                  className="text-on-surface-variant hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDeleteWorkflow(step.id)} className="text-on-surface-variant hover:text-error transition-colors">
                                  <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {contentSubTab === 'stats' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Statistik</h3>
                    <button
                      onClick={() => {
                        setStatForm({ id: null, value: '', label: '', use_amber: true, sort_order: stats.length + 1 });
                        setIsStatFormOpen(true);
                      }}
                      className="bg-primary text-on-primary px-6 py-2 text-xs font-semibold tracking-widest hover:bg-secondary flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">add</span> TAMBAH STATISTIK
                    </button>
                  </div>

                  {isStatFormOpen && (
                    <form onSubmit={handleSaveStat} className="mb-6 p-6 bg-surface border border-outline-variant space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Nilai / Angka (e.g. 50+, 2026)</label>
                          <input
                            type="text"
                            required
                            value={statForm.value}
                            onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                            placeholder="50+ atau 2026"
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Label Deskripsi</label>
                          <input
                            type="text"
                            required
                            value={statForm.label}
                            onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                            placeholder="PROJECTS COMPLETED"
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Sort Order</label>
                          <input
                            type="number"
                            required
                            value={statForm.sort_order}
                            onChange={(e) => setStatForm({ ...statForm, sort_order: parseInt(e.target.value) || 0 })}
                            className="w-full bg-surface-container-low border border-outline-variant px-4 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant">Warna Teks</label>
                          <label className="inline-flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={statForm.use_amber}
                              onChange={(e) => setStatForm({ ...statForm, use_amber: e.target.checked })}
                              className="mr-2"
                            />
                            Gunakan Warna Outline Amber (Stroked)
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-primary text-on-primary px-5 py-2 text-xs font-semibold tracking-widest">SIMPAN</button>
                        <button type="button" onClick={() => setIsStatFormOpen(false)} className="border border-outline px-5 py-2 text-xs tracking-widest hover:bg-surface-container-low">BATAL</button>
                      </div>
                    </form>
                  )}

                  <div className="bg-surface border border-outline-variant overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-surface-container border-b border-outline-variant">
                          {['Nilai', 'Label', 'Visual Style', 'Order', 'Aksi'].map(h => (
                            <th key={h} className="text-left text-xs uppercase tracking-widest text-on-surface-variant px-6 py-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.map((item) => (
                          <tr key={item.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                            <td className="px-6 py-4 font-semibold text-lg text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{item.value}</td>
                            <td className="px-6 py-4 text-xs uppercase tracking-wider text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{item.label}</td>
                            <td className="px-6 py-4 text-xs">
                              <span className={`px-2 py-1 font-semibold ${item.use_amber ? 'text-secondary bg-secondary-container/20' : 'text-primary bg-surface-container-high'}`}>
                                {item.use_amber ? 'Amber Stroked' : 'Secondary Fill'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-on-surface">{item.sort_order}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setStatForm(item);
                                    setIsStatFormOpen(true);
                                  }}
                                  className="text-on-surface-variant hover:text-primary transition-colors"
                                >
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDeleteStat(item.id)} className="text-on-surface-variant hover:text-error transition-colors">
                                  <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">

              {/* Info Akun */}
              <div className="bg-surface border border-outline-variant p-8">
                <h2 className="font-bold text-primary text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Info Akun
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-surface-container-low border border-outline-variant">
                    <div className="w-12 h-12 bg-primary text-on-primary flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{user?.name}</p>
                      <p className="text-sm text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{user?.email}</p>
                      <p className="text-xs text-secondary uppercase tracking-widest mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{user?.role}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Ganti Email ── */}
              <div className="bg-surface border border-outline-variant p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl">alternate_email</span>
                  <h2 className="font-bold text-primary text-sm uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Ganti Email
                  </h2>
                </div>

                {emailStatus.error && (
                  <div className="mb-4 p-3 bg-error-container border-l-4 border-error text-on-error-container text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-lg flex-shrink-0">error</span>
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>{emailStatus.error}</span>
                  </div>
                )}
                {emailStatus.success && (
                  <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-800 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-lg flex-shrink-0">check_circle</span>
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>{emailStatus.success}</span>
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setEmailStatus({ loading: true, error: '', success: '' });
                    try {
                      const res = await fetch(`${API_URL}/auth/update-email`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${getToken()}`,
                        },
                        body: JSON.stringify(emailForm),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error);
                      setEmailStatus({ loading: false, error: '', success: data.message });
                      setEmailForm({ current_password: '', new_email: '' });
                    } catch (err) {
                      setEmailStatus({ loading: false, error: err.message, success: '' });
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      Email Baru
                    </label>
                    <input
                      type="email"
                      required
                      value={emailForm.new_email}
                      onChange={(e) => setEmailForm((p) => ({ ...p, new_email: e.target.value }))}
                      placeholder="email-baru@domain.com"
                      className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      Konfirmasi dengan Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showEmailCurrentPass ? 'text' : 'password'}
                        required
                        value={emailForm.current_password}
                        onChange={(e) => setEmailForm((p) => ({ ...p, current_password: e.target.value }))}
                        placeholder="Password saat ini"
                        className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 pr-12 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <button type="button" onClick={() => setShowEmailCurrentPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">{showEmailCurrentPass ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={emailStatus.loading}
                    className="bg-primary text-on-primary px-8 py-3 text-xs tracking-widest hover:bg-secondary transition-colors disabled:opacity-60 flex items-center gap-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {emailStatus.loading && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                    SIMPAN EMAIL BARU
                  </button>
                </form>
              </div>

              {/* ── Ganti Password ── */}
              <div className="bg-surface border border-outline-variant p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl">lock_reset</span>
                  <h2 className="font-bold text-primary text-sm uppercase tracking-widest" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Ganti Password
                  </h2>
                </div>

                {passStatus.error && (
                  <div className="mb-4 p-3 bg-error-container border-l-4 border-error text-on-error-container text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-error text-lg flex-shrink-0">error</span>
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>{passStatus.error}</span>
                  </div>
                )}
                {passStatus.success && (
                  <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-800 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-lg flex-shrink-0">check_circle</span>
                    <span style={{ fontFamily: 'Inter, sans-serif' }}>{passStatus.success}</span>
                  </div>
                )}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (passForm.new_password !== passForm.confirm_password) {
                      setPassStatus({ loading: false, error: 'Konfirmasi password tidak cocok.', success: '' });
                      return;
                    }
                    setPassStatus({ loading: true, error: '', success: '' });
                    try {
                      const res = await fetch(`${API_URL}/auth/update-password`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${getToken()}`,
                        },
                        body: JSON.stringify({
                          current_password: passForm.current_password,
                          new_password: passForm.new_password,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error);
                      setPassStatus({ loading: false, error: '', success: data.message });
                      setPassForm({ current_password: '', new_password: '', confirm_password: '' });
                      setTimeout(() => { logout(); navigate('/login'); }, 2000);
                    } catch (err) {
                      setPassStatus({ loading: false, error: err.message, success: '' });
                    }
                  }}
                  className="space-y-4"
                >
                  {[{
                    key: 'current_password', label: 'Password Saat Ini', placeholder: 'Password lama Anda', showKey: 'current'
                  }, {
                    key: 'new_password', label: 'Password Baru', placeholder: 'Min. 8 karakter', showKey: 'new'
                  }, {
                    key: 'confirm_password', label: 'Konfirmasi Password Baru', placeholder: 'Ulangi password baru', showKey: 'confirm'
                  }].map(({ key, label, placeholder, showKey }) => (
                    <div key={key}>
                      <label className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassFields[showKey] ? 'text' : 'password'}
                          required
                          value={passForm[key]}
                          onChange={(e) => setPassForm((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 pr-12 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                        <button type="button" onClick={() => setShowPassFields((p) => ({ ...p, [showKey]: !p[showKey] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">{showPassFields[showKey] ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                      {key === 'new_password' && passForm.new_password && (
                        <div className="mt-2 flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 transition-colors duration-300 ${
                              passForm.new_password.length >= i * 3
                                ? i <= 2 ? 'bg-error' : i === 3 ? 'bg-secondary' : 'bg-green-500'
                                : 'bg-outline-variant'
                            }`} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={passStatus.loading}
                    className="bg-primary text-on-primary px-8 py-3 text-xs tracking-widest hover:bg-secondary transition-colors disabled:opacity-60 flex items-center gap-2"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {passStatus.loading && <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>}
                    SIMPAN PASSWORD BARU
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-surface border border-error/30 p-8">
                <h2 className="font-bold text-error text-sm uppercase tracking-widest mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Danger Zone
                </h2>
                <p className="text-on-surface-variant text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Logout dari semua session yang aktif.
                </p>
                <button
                  onClick={handleLogout}
                  className="border border-error text-error px-8 py-3 text-xs tracking-widest hover:bg-error hover:text-on-error transition-colors flex items-center gap-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  LOGOUT SEKARANG
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant p-8 max-w-sm w-full shadow-2xl">
            <span className="material-symbols-outlined text-error text-4xl mb-4 block">warning</span>
            <h3 className="font-bold text-primary text-lg mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Hapus Proyek?</h3>
            <p className="text-on-surface-variant text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Tindakan ini tidak dapat dibatalkan. Proyek akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-outline py-3 text-xs tracking-widest hover:bg-surface-container transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                BATAL
              </button>
              <button onClick={() => handleDeleteProject(deleteConfirm)} className="flex-1 bg-error text-on-error py-3 text-xs tracking-widest hover:opacity-90 transition-opacity" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                HAPUS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
