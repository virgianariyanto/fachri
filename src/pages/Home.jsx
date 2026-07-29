import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Work from '../components/Work';
import Workflow from '../components/Workflow';
import Stats from '../components/Stats';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import InquiryModal from '../components/InquiryModal';

export default function Home() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.gallery-border, section > div');
    animatedElements.forEach((el) => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      <Navbar onOpenInquiry={() => setIsInquiryOpen(true)} />
      <main>
        <Hero onOpenInquiry={() => setIsInquiryOpen(true)} />
        <About />
        <Services />
        <Work />
        <Workflow />
        <Stats />
        <Contact onOpenInquiry={() => setIsInquiryOpen(true)} />
      </main>
      <Footer />
      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />
    </div>
  );
}
