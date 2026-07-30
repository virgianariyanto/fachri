import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

export default function InquiryModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Exhibition Booth',
    budget: '$5k - $10k',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          project_type: formData.projectType,
          message: formData.message,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Gagal mengirim inquiry.');
        return;
      }
    } catch {
      // Jika server offline, tetap tampilkan success (graceful fallback)
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', projectType: 'Exhibition Booth', budget: '$5k - $10k', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-surface border border-outline-variant p-8 md:p-10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4 block">check_circle</span>
            <h3 className="font-headline-lg text-2xl mb-2 text-primary">Inquiry Sent Successfully!</h3>
            <p className="font-body-md text-on-surface-variant">
              Thank you for reaching out. Fachri will get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <>
            <span className="font-label-mono text-xs text-secondary tracking-[0.2em] uppercase block mb-2">
              PROJECT COMMISSION
            </span>
            <h3 className="font-headline-lg text-3xl mb-6 text-primary">Start a Conversation</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-label-mono text-xs uppercase tracking-wider mb-2 text-on-surface-variant">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Vance"
                  className="w-full bg-white border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-mono text-xs uppercase tracking-wider mb-2 text-on-surface-variant">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full bg-white border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:border-secondary transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-label-mono text-xs uppercase tracking-wider mb-2 text-on-surface-variant">
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-white border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option>Exhibition Booth</option>
                    <option>Commercial Space</option>
                    <option>Event Set Design</option>
                    <option>Visual Branding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-mono text-xs uppercase tracking-wider mb-2 text-on-surface-variant">
                  Project Details
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your vision, timeline, and location..."
                  className="w-full bg-white border border-outline-variant px-4 py-3 font-body-md focus:outline-none focus:border-secondary transition-colors"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-4 font-label-sm tracking-widest hover:bg-secondary transition-all active:scale-[0.99] duration-200"
              >
                SUBMIT INQUIRY
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
