import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar({ onOpenInquiry }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full top-0 sticky z-50 bg-surface border-outline-variant">
      <div className="flex justify-between items-center w-full px-6 md:px-16 py-6 max-w-full">
        <a href="#home" className="font-headline-md text-2xl font-bold text-primary tracking-tighter">
          fachri
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 font-label-sm text-xs tracking-widest uppercase">
          <a className="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#work">
            PROJECTS
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#about">
            STUDIO
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#services">
            SERVICES
          </a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors duration-300" href="#contact">
            CONTACT
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Auth-aware CTA */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/admin"
                className="flex items-center gap-2 border border-outline text-on-surface px-5 py-2 font-label-sm tracking-widest hover:bg-surface-container transition-all text-xs"
              >
                <span className="material-symbols-outlined text-base">dashboard</span>
                ADMIN
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors font-label-sm tracking-widest text-xs"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                LOGOUT
              </button>
            </div>
          ) : (
            <>
              {/* <Link
                to="/login"
                className="hidden md:inline-flex items-center gap-2 border border-outline text-on-surface px-5 py-2 font-label-sm tracking-widest hover:bg-surface-container transition-all text-xs"
              >
                <span className="material-symbols-outlined text-base">lock</span>
                LOGIN
              </Link> */}
              <button
                onClick={onOpenInquiry}
                className="bg-primary text-on-primary px-8 py-2 font-label-sm tracking-widest hover:bg-secondary transition-all active:scale-95 duration-200 text-xs"
              >
                INQUIRE
              </button>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-primary focus:outline-none p-2"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant px-6 py-6 space-y-4 font-label-sm text-sm tracking-widest">
          <a
            onClick={() => setMobileMenuOpen(false)}
            className="block text-on-surface-variant hover:text-secondary transition-colors"
            href="#work"
          >
            PROJECTS
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            className="block text-on-surface-variant hover:text-secondary transition-colors"
            href="#about"
          >
            STUDIO
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            className="block text-on-surface-variant hover:text-secondary transition-colors"
            href="#services"
          >
            SERVICES
          </a>
          <a
            onClick={() => setMobileMenuOpen(false)}
            className="block text-on-surface-variant hover:text-secondary transition-colors"
            href="#contact"
          >
            CONTACT
          </a>

          {/* Mobile Auth Links */}
          <div className="pt-4 border-t border-outline-variant space-y-3">
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">dashboard</span>
                  ADMIN PANEL
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  LOGOUT
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">lock</span>
                LOGIN / ADMIN
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
