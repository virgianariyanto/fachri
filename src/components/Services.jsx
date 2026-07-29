import React from 'react';
import { useFetchData } from '../hooks/useContent';

export default function Services() {
  const { data: services, loading } = useFetchData('services');

  const defaultServices = [
    {
      icon: 'architecture',
      title: 'Exhibition Design',
      description: 'Large-scale pavilion concepts with a focus on visitor flow and technical feasibility.',
    },
    {
      icon: 'storefront',
      title: 'Commercial Space',
      description: 'Shop-in-shop and retail environments that elevate product presentation.',
    },
    {
      icon: 'theaters',
      title: 'Event Set Design',
      description: 'Immersive stages and branded environments for product launches and corporate events.',
    },
    {
      icon: 'category',
      title: 'Visual Branding',
      description: 'Integrating graphic identity into the physical space for holistic brand consistency.',
    },
  ];

  const items = services || defaultServices;

  if (loading) {
    return (
      <section className="py-32 px-6 md:px-16 bg-surface animate-pulse" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 bg-outline-variant w-1/12 mb-4"></div>
          <div className="h-10 bg-outline-variant w-1/4 mb-20"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-outline-variant border border-outline-variant"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 md:px-16 bg-surface" id="services">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="font-label-sm text-secondary mb-4 block tracking-[0.2em] text-xs">
            02 / SERVICES
          </span>
          <h2 className="font-headline-lg text-4xl md:text-5xl text-on-surface">Spatial Solutions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-outline-variant">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-10 border-r border-b border-outline-variant hover:bg-surface-container transition-colors group"
            >
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-8 block group-hover:text-secondary transition-colors">
                {item.icon}
              </span>
              <h3 className="font-headline-md text-xl mb-6 text-on-surface">{item.title}</h3>
              <p className="text-on-surface-variant font-body-md text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
