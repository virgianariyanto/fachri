import React from 'react';

export default function Footer() {
  const links = ['DRIBBBLE', 'BEHANCE', 'INSTAGRAM', 'LINKEDIN'];

  return (
    <footer className="w-full relative bg-surface border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-16 py-16 w-full max-w-full">
        <div className="flex flex-col justify-between h-full">
          <a href="#home" className="font-headline-md text-2xl text-primary font-bold">
            fachri
          </a>
          <p className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant mt-10">
            &copy;2026 fachri ARCHITECTURAL VISUALIZATION
          </p>
        </div>

        <div className="flex flex-col md:items-end justify-between">
          <div className="flex flex-wrap gap-6 md:gap-12">
            {links.map((item) => (
              <a
                key={item}
                href="#"
                className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-secondary border-b border-transparent hover:border-secondary transition-all opacity-80 hover:opacity-100"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="font-label-sm text-xs text-on-surface-variant opacity-50 mt-10">
            JAKARTA, INDONESIA &mdash; WORLDWIDE SERVICE
          </p>
        </div>
      </div>
    </footer>
  );
}
