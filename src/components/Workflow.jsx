import React from 'react';
import { useFetchData } from '../hooks/useContent';

export default function Workflow() {
  const { data: dbSteps, loading } = useFetchData('workflow');

  const defaultSteps = [
    {
      step_number: 1,
      title: 'CONCEPT',
      description: 'Brainstorming spatial logic, mood-boarding and site analysis.',
      is_active: true,
    },
    {
      step_number: 2,
      title: 'VISUALS',
      description: 'High-fidelity 3D modeling and photorealistic octane rendering.',
      is_active: false,
    },
    {
      step_number: 3,
      title: 'TECHNICAL',
      description: 'Detailed CAD blueprints for production and construction precision.',
      is_active: false,
    },
    {
      step_number: 4,
      title: 'BUILD',
      description: 'Supervising physical production and high-end finishing touches.',
      is_active: false,
    },
  ];

  const steps = dbSteps || defaultSteps;

  if (loading) {
    return (
      <section className="py-32 bg-surface blueprint-pattern border-y border-outline-variant animate-pulse" id="workflow">
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <div className="h-4 bg-outline-variant w-1/12 mb-4"></div>
          <div className="h-10 bg-outline-variant w-1/4 mb-24"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-outline-variant border border-outline-variant"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-surface blueprint-pattern border-y border-outline-variant" id="workflow">
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        <span className="font-label-sm text-secondary mb-4 block tracking-[0.2em] text-xs">
          04 / WORKFLOW
        </span>
        <h2 className="font-headline-lg text-4xl md:text-5xl text-on-surface mb-24">The Delivery System</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6">
          {steps.map((step, idx) => {
            const num = String(step.step_number || idx + 1).padStart(2, '0');
            return (
              <div
                key={step.id || idx}
                className="relative p-8 border border-outline bg-white hover:border-secondary transition-all shadow-sm hover:shadow-md"
              >
                <span
                  className={`absolute -top-4 -left-4 w-10 h-10 flex items-center justify-center font-label-mono font-bold text-sm ${
                    step.is_active
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface border border-primary text-primary'
                  }`}
                >
                  {num}
                </span>
                <h4 className="font-headline-md text-lg mb-4 mt-4 uppercase tracking-wider text-on-surface">
                  {step.title}
                </h4>
                <p className="text-on-surface-variant text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
