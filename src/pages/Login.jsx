import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email dan password wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-16 overflow-hidden">
        {/* Blueprint dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Large ghost text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="text-[18vw] font-bold tracking-tighter leading-none select-none"
            style={{ color: 'rgba(255,255,255,0.04)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            STUDIO
          </span>
        </div>

        <div className="relative z-10">
          <a href="/" className="text-on-primary font-bold tracking-tighter text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            fachri
          </a>
        </div>

        <div className="relative z-10">
          <h1
            className="text-on-primary text-5xl font-bold leading-[1.1] tracking-tighter mb-6"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Selamat<br />datang<br />kembali.
          </h1>
          <p className="text-on-primary opacity-60 leading-relaxed max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            Kelola portofolio, proyek, dan permintaan klien dari satu panel admin terintegrasi.
          </p>
        </div>

        <div className="relative z-10">
          <div className="border border-white/20 p-6">
            <p className="text-on-primary/60 text-xs uppercase tracking-widest mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              DEMO CREDENTIALS
            </p>
            <p className="text-on-primary font-mono text-sm">admin@studio3d.id</p>
            <p className="text-on-primary/70 font-mono text-sm">studio3d2024</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <a href="/" className="font-bold tracking-tighter text-2xl text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              fachri
            </a>
          </div>

          <div className="mb-10">
            <span
              className="text-xs uppercase tracking-[0.2em] text-secondary mb-3 block"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              01 / PORTAL ADMIN
            </span>
            <h2
              className="text-3xl font-bold text-primary tracking-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Masuk ke akun Anda
            </h2>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error-container border-l-4 border-error text-on-error-container text-sm flex items-start gap-3">
              <span className="material-symbols-outlined text-error text-xl mt-0.5 flex-shrink-0">error</span>
              <span style={{ fontFamily: 'Inter, sans-serif' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@studio3d.id"
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 pr-12 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary py-4 font-bold tracking-widest hover:bg-secondary transition-all active:scale-[0.99] duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs uppercase flex items-center justify-center gap-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  MEMPROSES...
                </>
              ) : (
                'MASUK KE DASHBOARD'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="text-secondary font-medium hover:underline underline-offset-4"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-outline-variant text-center">
            <Link
              to="/"
              className="text-on-surface-variant text-xs uppercase tracking-widest hover:text-primary transition-colors inline-flex items-center gap-2"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Kembali ke Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
