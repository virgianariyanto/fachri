import React from 'react';
import { useFetchData } from '../hooks/useContent';

export default function Contact({ onOpenInquiry }) {
  const { data, loading } = useFetchData('content');

  const contact = data?.contact || {
    section_label: "05 / CONTACT",
    headline: "Let's build something extraordinary.",
    subtext: "Currently accepting commissions for late 2024 and 2025 exhibitions.",
    quote: "Spatial design is the ultimate form of branding. It's where the brand becomes tangible.",
    whatsapp: "https://wa.me/?text=Hello%20Fachri,%20I%20would%20like%20to%20discuss%20a%203D%20Exhibition%20Project",
    email: "mailto:contact@studio3d.id",
    linkedin: "#",
    instagram: "#"
  };

  const channels = [
    { name: 'WHATSAPP', href: contact.whatsapp },
    { name: 'EMAIL', href: contact.email },
    { name: 'LINKEDIN', href: contact.linkedin },
    { name: 'INSTAGRAM', href: contact.instagram },
  ];

  if (loading) {
    return (
      <section className="py-32 px-6 md:px-16 bg-surface animate-pulse" id="contact">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-6">
            <div className="h-4 bg-outline-variant w-1/4"></div>
            <div className="h-16 bg-outline-variant w-3/4"></div>
            <div className="h-8 bg-outline-variant w-1/2"></div>
            <div className="h-24 bg-outline-variant w-full"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-outline-variant"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 md:px-16 bg-surface" id="contact">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div>
          <span className="font-label-sm text-secondary mb-8 block tracking-[0.2em] text-xs uppercase">
            {contact.section_label}
          </span>
          <h2 className="font-headline-lg text-4xl sm:text-5xl md:text-6xl mb-12 leading-[1.1] text-on-surface">
            {contact.headline}
          </h2>
          <p className="font-body-lg text-on-surface-variant mb-12 text-lg">
            {contact.subtext}
          </p>
          <div className="p-8 border border-outline bg-surface-container-low italic text-on-surface-variant border-l-4 border-l-secondary">
            "{contact.quote}"
          </div>
          <div className="mt-8">
            <button
              onClick={onOpenInquiry}
              className="bg-primary text-on-primary px-10 py-4 font-label-sm tracking-widest hover:bg-secondary transition-all active:scale-95 text-xs uppercase"
            >
              SEND DIRECT COMMISSION INQUIRY
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {channels.map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-10 border-b border-outline-variant hover:border-secondary transition-colors"
            >
              <span className="font-headline-md text-2xl md:text-3xl text-on-surface group-hover:text-secondary transition-colors">
                {channel.name}
              </span>
              <span className="material-symbols-outlined text-outline group-hover:text-secondary transform transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 text-2xl">
                arrow_outward
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
