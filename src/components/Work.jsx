import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetchData } from '../hooks/useContent';

export default function Work() {
  const { data: dbProjects, loading } = useFetchData('projects?status=published');
  const [selectedProject, setSelectedProject] = useState(null);

  const defaultProjects = [
    {
      id: 1,
      category: 'EVENT SET DESIGN',
      title: 'FUTURE_VIBE DJ CONSOLE',
      description: 'Ultra-modern booth for X-MUSIC FEST featuring geometric panels and high-fidelity rendering for technical stage production.',
      client: 'X-MUSIC FEST',
      year: '2024',
      image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=80',
    },
    {
      id: 2,
      category: 'EXHIBITION BOOTH',
      title: 'PETFEST 2026',
      description: 'Award-winning pavilion design for Pet Care Indo, emphasizing minimal architectural aesthetics and modular sustainability.',
      client: 'PET CARE INDO',
      year: '2026',
      image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80',
    },
    {
      id: 3,
      category: 'COMMERCIAL SPACE',
      title: 'CHRONOS LUXURY RETAIL HUB',
      description: 'Bespoke luxury retail interior designed for high-end timepiece showcase, integrating custom architectural lighting and modular display pillars.',
      client: 'CHRONOS',
      year: '2025',
      image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  const projects = (dbProjects || defaultProjects).slice(0, 4);

  if (loading) {
    return (
      <section className="py-32 px-6 md:px-16 bg-surface-container-low animate-pulse" id="work">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="h-4 bg-outline-variant w-1/12"></div>
          <div className="h-10 bg-outline-variant w-1/4"></div>
          <div className="h-96 bg-outline-variant w-full"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 md:px-16 bg-surface-container-low" id="work">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-24 flex-wrap gap-6">
          <div>
            <span className="font-label-sm text-secondary mb-4 block tracking-[0.2em] text-xs">
              03 / SELECTED WORKS
            </span>
            <h2 className="font-headline-lg text-4xl md:text-5xl text-on-surface">Spatial Portfolios</h2>
          </div>
          <div className="text-right">
            <span className="font-label-sm text-on-surface-variant block mb-1 text-xs">CURATED SELECTION</span>
            <span className="font-label-mono text-[10px] tracking-widest text-secondary uppercase">
              SCALED 1:1 VISUALS
            </span>
          </div>
        </div>

        <div className="space-y-40">
          {projects.map((project, index) => {
            const layoutType = index % 3; // 0 = Left Asymmetric, 1 = Right Asymmetric, 2 = Feature Wide

            if (layoutType === 0) {
              return (
                <div key={project.id || index} className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="w-full lg:w-3/5">
                    <div
                      onClick={() => setSelectedProject(project)}
                      className="gallery-border p-4 bg-white shadow-lg relative group overflow-hidden cursor-pointer"
                    >
                      <div
                        className="aspect-[16/10] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${project.image_url}')` }}
                      ></div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-primary text-on-primary px-6 py-2 font-label-mono text-xs tracking-widest">
                          EXPAND PROJECT
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/5 lg:-ml-20 z-10 bg-surface p-8 md:p-12 border border-outline-variant shadow-xl">
                    <p className="font-label-mono text-secondary text-xs mb-4 tracking-widest uppercase">
                      {project.category}
                    </p>
                    <h3 className="font-headline-md text-2xl mb-6 text-on-surface">{project.title}</h3>
                    <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">{project.description}</p>
                    <div className="flex justify-between text-[10px] font-label-mono text-on-surface-variant border-t border-outline-variant pt-6">
                      <span>CLIENT: {project.client || 'N/A'}</span>
                      <span>YEAR: {project.year || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            } else if (layoutType === 1) {
              return (
                <div key={project.id || index} className="flex flex-col lg:flex-row-reverse gap-12 items-center">
                  <div className="w-full lg:w-3/5">
                    <div
                      onClick={() => setSelectedProject(project)}
                      className="gallery-border p-4 bg-white shadow-lg relative group overflow-hidden cursor-pointer"
                    >
                      <div
                        className="aspect-[16/10] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${project.image_url}')` }}
                      ></div>
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-primary text-on-primary px-6 py-2 font-label-mono text-xs tracking-widest">
                          EXPAND PROJECT
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-2/5 lg:-mr-20 z-10 bg-surface p-8 md:p-12 border border-outline-variant shadow-xl">
                    <p className="font-label-mono text-secondary text-xs mb-4 tracking-widest uppercase">
                      {project.category}
                    </p>
                    <h3 className="font-headline-md text-2xl mb-6 text-on-surface">{project.title}</h3>
                    <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">{project.description}</p>
                    <div className="flex justify-between text-[10px] font-label-mono text-on-surface-variant border-t border-outline-variant pt-6">
                      <span>CLIENT: {project.client || 'N/A'}</span>
                      <span>YEAR: {project.year || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={project.id || index} className="relative pt-12">
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="gallery-border p-6 bg-white shadow-2xl group cursor-pointer"
                  >
                    <div className="relative overflow-hidden aspect-[21/9] bg-cover bg-center">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${project.image_url}')` }}
                      ></div>
                    </div>
                    <div className="mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <p className="font-label-mono text-secondary text-xs mb-2 tracking-widest uppercase">
                          {project.category}
                        </p>
                        <h3 className="font-headline-md text-2xl text-on-surface">{project.title}</h3>
                      </div>
                      <div className="flex gap-12 text-right">
                        <div>
                          <span className="font-label-mono text-[10px] text-on-surface-variant block uppercase">
                            CLIENT
                          </span>
                          <span className="font-body-md font-semibold text-sm">{project.client || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-label-mono text-[10px] text-on-surface-variant block uppercase">
                            YEAR
                          </span>
                          <span className="font-body-md font-semibold text-sm">{project.year || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>

        {/* View All Projects Button */}
        <div className="mt-24 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 border border-outline-variant px-8 py-3 text-xs uppercase tracking-widest text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 font-label-mono"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            VIEW ALL PROJECTS
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>

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
            <div className="aspect-[16/9] bg-cover bg-center mb-6" style={{ backgroundImage: `url('${selectedProject.image_url}')` }}></div>
            <span className="font-label-mono text-xs text-secondary tracking-widest block mb-2 uppercase">
              {selectedProject.category}
            </span>
            <h3 className="font-headline-lg text-3xl mb-4 text-primary">{selectedProject.title}</h3>
            <p className="font-body-lg text-on-surface-variant leading-relaxed mb-6">{selectedProject.description}</p>
            <div className="flex justify-between items-center border-t border-outline-variant pt-4 font-label-mono text-xs text-on-surface-variant">
              <span>CLIENT: {selectedProject.client || 'N/A'}</span>
              <span>YEAR: {selectedProject.year || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
