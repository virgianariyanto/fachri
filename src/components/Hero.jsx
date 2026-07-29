import React from 'react';
import { useFetchData } from '../hooks/useContent';

export default function Hero({ onOpenInquiry }) {
  const { data, loading } = useFetchData('content');

  // Fallbacks if backend is loading or fails
  const hero = data?.hero || {
    badge: "JAKARTA BASED STUDIO",
    name_line1: "FACHRI",
    name_line2: "KURNIAWAN",
    subtitle: "3D Exhibition & Event Designer / Branding Specialist",
    cta_primary: "VIEW WORK",
    cta_secondary: "HIRE ME",
    floating_label: "X-MUSIC FEST 2024",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  };

  if (loading) {
    return (
      <section className="relative min-h-[90vh] w-full flex items-center bg-surface pt-12 pb-24" id="home">
        <div className="container mx-auto px-6 md:px-16 relative">
          <div className="animate-pulse space-y-6 max-w-xl">
            <div className="h-4 bg-outline-variant w-1/4"></div>
            <div className="h-16 bg-outline-variant w-3/4"></div>
            <div className="h-16 bg-outline-variant w-1/2"></div>
            <div className="h-8 bg-outline-variant w-full"></div>
            <div className="flex gap-4">
              <div className="h-12 bg-outline-variant w-32"></div>
              <div className="h-12 bg-outline-variant w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[90vh] w-full flex items-center bg-surface overflow-hidden pt-12 pb-24" id="home">
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          {/* Background Layered Text */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden -z-10 opacity-[0.03]">
            <span className="font-headline-xl text-[20vw] leading-none whitespace-nowrap font-bold tracking-tighter">
              ARCHITECTURAL
            </span>
          </div>

          {/* Left Content: Impactful Typography */}
          <div className="lg:col-span-7 z-20 pt-12 lg:pt-0">
            <p className="font-label-mono text-xs text-secondary mb-8 tracking-[0.4em] uppercase">
              {hero.badge}
            </p>
            <h1 className="font-headline-xl text-6xl sm:text-7xl md:text-[120px] leading-[0.85] mb-12 text-on-surface tracking-tighter uppercase">
              {hero.name_line1}<br />
              <span className="text-stroke-amber ml-6 sm:ml-12 md:ml-24">{hero.name_line2}</span>
            </h1>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-12">
              <p className="font-headline-md text-on-surface-variant max-w-xs italic border-l-2 border-secondary pl-6 text-lg">
                {hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  className="bg-primary text-on-primary px-10 py-4 font-label-sm tracking-widest hover:bg-secondary transition-all active:scale-95 text-xs text-center"
                  href="#work"
                >
                  {hero.cta_primary}
                </a>
                <button
                  onClick={onOpenInquiry}
                  className="border border-outline text-on-surface px-10 py-4 font-label-sm tracking-widest hover:bg-surface-container transition-all active:scale-95 text-xs uppercase"
                >
                  {hero.cta_secondary}
                </button>
              </div>
            </div>
          </div>

          {/* Right Content: Overlapping Image Gallery */}
          <div className="lg:col-span-5 relative mt-20 lg:mt-0">
            <div className="relative z-10">
              <div className="gallery-border p-3 bg-white shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-700">
                <div
                  className="aspect-[4/5] bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${hero.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}')`,
                  }}
                  alt="Spatial 3D Design Render"
                ></div>
              </div>
            </div>

            {/* Secondary Overlapping Element */}
            <div className="absolute -top-12 -right-8 w-2/3 aspect-square bg-surface-container-highest -z-10 blueprint-pattern opacity-40"></div>

            {/* Floating Label */}
            <div className="absolute bottom-12 -left-12 z-30 bg-primary text-on-primary p-6 hidden md:block shadow-xl">
              <span className="font-label-mono text-[10px] tracking-[0.3em] uppercase block mb-2 opacity-60">
                CURRENT_PROJECT
              </span>
              <span className="font-label-sm tracking-widest text-xs uppercase">{hero.floating_label}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
