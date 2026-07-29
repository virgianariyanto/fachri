import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama wajib diisi.';
    if (!formData.email.trim()) errs.email = 'Email wajib diisi.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Format email tidak valid.';
    if (!formData.password) errs.password = 'Password wajib diisi.';
    else if (formData.password.length < 8) errs.password = 'Password minimal 8 karakter.';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Konfirmasi password tidak cocok.';
    return errs;
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
    setGlobalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register(formData.name.trim(), formData.email.trim(), formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="text-[18vw] font-bold tracking-tighter leading-none select-none"
            style={{ color: 'rgba(255,255,255,0.04)', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            NEW
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
            Mulai<br />perjalanan<br />Anda.
          </h1>
          <p className="text-on-primary opacity-60 leading-relaxed max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            Buat akun untuk mengelola dan memperbarui konten portfolio Fachri Kurniawan.
          </p>
        </div>

        <div className="relative z-10 border border-white/20 p-6">
          <p className="text-on-primary/60 text-xs uppercase tracking-widest mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            BENEFIT AKUN
          </p>
          {['Kelola proyek portfolio', 'Lihat statistik pengunjung', 'Balas inquiry klien', 'Update info kontak'].map((b) => (
            <div key={b} className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
              <span className="text-on-primary/80 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <a href="/" className="font-bold tracking-tighter text-2xl text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              fachri
            </a>
          </div>

          {success ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">check_circle</span>
              <h2 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Akun Berhasil Dibuat!
              </h2>
              <p className="text-on-surface-variant mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Mengarahkan ke halaman login...
              </p>
              <div className="h-1 w-full bg-outline-variant mt-6 overflow-hidden">
                <div className="h-full bg-secondary animate-[grow_2.5s_linear_forwards]" style={{ width: '0%', animation: 'grow 2.5s linear forwards' }} />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <span
                  className="text-xs uppercase tracking-[0.2em] text-secondary mb-3 block"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  02 / BUAT AKUN BARU
                </span>
                <h2
                  className="text-3xl font-bold text-primary tracking-tight"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  Daftar sebagai Admin
                </h2>
              </div>

              {globalError && (
                <div className="mb-6 p-4 bg-error-container border-l-4 border-error text-on-error-container text-sm flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-xl mt-0.5 flex-shrink-0">error</span>
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>{globalError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="reg-name" className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Nama Lengkap
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Fachri Kurniawan"
                    className={`w-full bg-surface-container-low border px-4 py-3 text-on-surface focus:outline-none transition-colors text-sm ${errors.name ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  {errors.name && <p className="text-error text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="reg-email" className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Email Address
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@studio3d.id"
                    className={`w-full bg-surface-container-low border px-4 py-3 text-on-surface focus:outline-none transition-colors text-sm ${errors.email ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  {errors.email && <p className="text-error text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="reg-password" className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 karakter"
                      className={`w-full bg-surface-container-low border px-4 py-3 pr-12 text-on-surface focus:outline-none transition-colors text-sm ${errors.password ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" aria-label="Toggle password">
                      <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {errors.password && <p className="text-error text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.password}</p>}
                  {/* Password strength bar */}
                  {formData.password && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 transition-colors duration-300 ${
                            formData.password.length >= i * 3
                              ? i <= 2 ? 'bg-error' : i === 3 ? 'bg-secondary' : 'bg-green-500'
                              : 'bg-outline-variant'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="reg-confirm" className="block text-xs uppercase tracking-wider mb-2 text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Konfirmasi Password
                  </label>
                  <input
                    id="reg-confirm"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ulangi password"
                    className={`w-full bg-surface-container-low border px-4 py-3 text-on-surface focus:outline-none transition-colors text-sm ${errors.confirmPassword ? 'border-error' : 'border-outline-variant focus:border-primary'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  {errors.confirmPassword && (
                    <p className="text-error text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  id="register-submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary py-4 font-bold tracking-widest hover:bg-secondary transition-all active:scale-[0.99] duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs uppercase flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      MENDAFTARKAN...
                    </>
                  ) : 'BUAT AKUN SEKARANG'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-on-surface-variant text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Sudah punya akun?{' '}
                  <Link to="/login" className="text-secondary font-medium hover:underline underline-offset-4">
                    Masuk di sini
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
