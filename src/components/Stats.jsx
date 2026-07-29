import React from 'react';
import { useFetchData } from '../hooks/useContent';

export default function Stats() {
  const { data: dbStats, loading } = useFetchData('stats');

  const defaultStats = [
    { value: '50+', label: 'PROJECTS COMPLETED', use_amber: true },
    { value: '12+', label: 'DESIGN AWARDS', use_amber: true },
    { value: '2026', label: 'RUNNER-UP PETFEST', use_amber: false },
  ];

  const stats = dbStats || defaultStats;

  if (loading) {
    return (
      <section className="py-24 bg-surface animate-pulse">
        <div className="px-6 md:px-16 max-w-7xl mx-auto border-b border-outline-variant pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-12 bg-outline-variant w-1/2"></div>
                <div className="h-4 bg-outline-variant w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-surface">
      <div className="px-6 md:px-16 max-w-7xl mx-auto border-b border-outline-variant pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {stats.map((item, idx) => (
            <div key={item.id || idx} className="flex flex-col items-center md:items-start">
              <span
                className={`font-headline-xl text-6xl md:text-7xl mb-4 block ${
                  item.use_amber ? 'text-stroke-amber' : 'text-secondary'
                }`}
              >
                {item.value}
              </span>
              <span className="font-label-sm text-on-surface-variant tracking-[0.2em] text-center md:text-left text-xs uppercase">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
