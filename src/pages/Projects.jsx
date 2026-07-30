import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InquiryModal from '../components/InquiryModal';
import { useFetchData } from '../hooks/useContent';

export default function Projects() {
  const { data: dbProjects, loading, error } = useFetchData('projects?status=published');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Trigger animation on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const defaultProjects = [
    {
      id: 1,
      category: 'EVENT SET DESIGN',
      title: 'FUTURE_VIBE DJ CONSOLE',
      description: 'Ultra-modern booth for X-MUSIC FEST featuring geometric panels and high-fidelity rendering.',
      client: 'X-MUSIC FEST',
      year: '2024',
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
    },
    {
      id: 2,
      category: 'EXHIBITION BOOTH',
      title: 'PETFEST 2026',
      description: 'Award-winning pavilion design for Pet Care Indo, emphasizing minimal architectural aesthetics.',
      client: 'PET CARE INDO',
      year: '2026',
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
    },
    {
      id: 3,
      category: 'COMMERCIAL SPACE',
      title: 'CHRONOS LUXURY RETAIL HUB',
      description: 'Bespoke luxury retail interior designed for high-end timepiece showcase.',
      client: 'CHRONOS',
      year: '2025',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  const projects = dbProjects || defaultProjects;

  // Filter Categories
  const categories = ['ALL', ...new Set(projects.map(p => p.category?.toUpperCase()).filter(Boolean))];
  const filteredProjects = activeCategory === 'ALL'
    ? projects
    : projects.filter(p => p.category?.toUpperCase() === activeCategory);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container flex flex-col">
      <Navbar onOpenInquiry={() => setIsInquiryOpen(true)} />
      
      <main className="flex-1 py-24 px-6 md:px-16 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 border-b border-outline-variant pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label-mono text-secondary text-xs tracking-widest block mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                INDEX // 01
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tighter" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                ALL WORKS
              </h1>
              <p className="text-on-surface-variant text-sm mt-2 max-w-md">
                Full index of spatial, exhibition, and event design portfolios.
              </p>
            </div>
            <div className="text-left md:text-right font-label-mono text-[10px] tracking-widest text-on-surface-variant uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              TOTAL PROJECTS: {filteredProjects.length}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-all duration-300 font-label-mono ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary border-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary'
                }`}
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-surface border border-outline-variant p-4 space-y-4 animate-pulse">
                  <div className="aspect-[16/10] bg-surface-container"></div>
                  <div className="h-4 bg-surface-container w-1/3"></div>
                  <div className="h-6 bg-surface-container w-2/3"></div>
                  <div className="h-4 bg-surface-container w-full"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-20 bg-surface border border-error/20 p-8">
              <span className="material-symbols-outlined text-error text-5xl mb-4">error</span>
              <p className="text-on-surface font-semibold">Failed to load projects list.</p>
              <p className="text-on-surface-variant text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Grid Layout */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-surface border border-outline-variant p-4 group cursor-pointer hover:border-secondary transition-colors duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="aspect-[16/10] overflow-hidden bg-surface-container mb-6 relative">
                      {project.image_url ? (
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{ backgroundImage: `url('${project.image_url}')` }}
                        ></div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl">image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-primary text-on-primary px-5 py-2 font-label-mono text-[10px] tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          EXPAND VIEW
                        </span>
                      </div>
                    </div>

                    <span className="font-label-mono text-secondary text-[10px] tracking-widest block mb-2 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {project.category}
                    </span>
                    <h3 className="font-headline-md text-xl font-bold text-on-surface mb-3 tracking-tight group-hover:text-secondary transition-colors" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {project.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs leading-relaxed mb-6 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex justify-between text-[9px] font-label-mono text-on-surface-variant border-t border-outline-variant pt-4 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <span>CLIENT: {project.client || 'N/A'}</span>
                    <span>YEAR: {project.year || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="text-center py-20 bg-surface border border-outline-variant p-8">
              <span className="material-symbols-outlined text-on-surface-variant text-5xl mb-4">folder_open</span>
              <p className="text-on-surface font-semibold">No projects found in this category.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />

      {/* Lightbox Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-5xl bg-surface border border-outline-variant p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-on-surface hover:text-secondary text-3xl font-bold z-10"
              aria-label="Close lightbox"
            >
              &times;
            </button>
            {selectedProject.image_url ? (
              <div className="aspect-[16/9] bg-cover bg-center mb-6" style={{ backgroundImage: `url('${selectedProject.image_url}')` }}></div>
            ) : (
              <div className="aspect-[16/9] bg-surface-container border border-outline-variant flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">image</span>
              </div>
            )}
            <span className="font-label-mono text-xs text-secondary tracking-widest block mb-2 uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {selectedProject.category}
            </span>
            <h3 className="font-headline-lg text-3xl mb-4 text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{selectedProject.title}</h3>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-6 text-sm">{selectedProject.description}</p>
            <div className="flex justify-between items-center border-t border-outline-variant pt-4 font-label-mono text-xs text-on-surface-variant" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              <span>CLIENT: {selectedProject.client || 'N/A'}</span>
              <span>YEAR: {selectedProject.year || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
