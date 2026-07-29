import React from 'react';
import { useFetchData } from '../hooks/useContent';

export default function About() {
  const { data, loading } = useFetchData('content');

  const about = data?.about || {
    section_label: "01 / THE STUDIO",
    headline: "Crafting experiences through spatial precision and technical artistry.",
    body: "I specialize in translating brand identities into three-dimensional realities. Based in Jakarta, I work at the intersection of architecture and event design, ensuring every pixel and every millimeter is calculated for maximum impact. From massive expo booths to intimate shop-in-shop experiences, my focus is always on the synthesis of form, function, and brand storytelling.",
    tools: ["SKETCHUP", "RHINO", "BLENDER", "LUMION", "KEYSHOT", "ADOBE SUITE"]
  };

  if (loading) {
    return (
      <section className="py-24 md:py-32 bg-surface-container-lowest animate-pulse" id="about">
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-2/3 space-y-6">
              <div className="h-4 bg-outline-variant w-1/4"></div>
              <div className="h-10 bg-outline-variant w-3/4"></div>
              <div className="h-[1px] bg-outline-variant w-full"></div>
              <div className="h-24 bg-outline-variant w-full"></div>
            </div>
            <div className="lg:w-1/3 h-64 bg-outline-variant"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 bg-surface-container-lowest" id="about">
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="lg:w-2/3">
            <span className="font-label-sm text-secondary mb-8 block tracking-[0.2em] text-xs uppercase">
              {about.section_label}
            </span>
            <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface mb-10 leading-tight">
              {about.headline}
            </h2>
            <div className="h-[1px] w-full bg-outline-variant mb-10"></div>
            <p className="font-body-lg text-on-surface-variant max-w-2xl leading-relaxed text-lg">
              {about.body}
            </p>
          </div>

          <div className="lg:w-1/3 bg-surface border border-outline-variant p-10 shadow-sm relative">
            <div className="absolute -top-4 -right-4 bg-secondary text-on-secondary px-4 py-1 font-label-mono text-[10px] tracking-widest">
              CORE_STACK
            </div>
            <h3 className="font-label-sm text-on-surface-variant mb-10 tracking-widest border-b border-outline-variant pb-4 text-xs">
              TOOLBOX_CORE
            </h3>
            <ul className="space-y-6 font-label-mono text-sm tracking-tighter">
              {about.tools && about.tools.map((tool, idx) => {
                const num = String(idx + 1).padStart(2, '0');
                return (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="text-secondary opacity-50">{num}</span>
                    <span className="font-medium text-on-surface uppercase">{tool}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
