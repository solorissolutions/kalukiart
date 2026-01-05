"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);

      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      setProgress(Math.min((y / max) * 100, 100));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-umbra/20 z-50">
        <div className="h-full bg-ochre transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <header className="sticky top-0 z-40 bg-bone/95 backdrop-blur-sm border-b border-umbra/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-display text-2xl text-charcoal">
            Kaluki
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#gallery" className="text-charcoal hover:text-ochre transition-colors">Gallery</a>
            <a href="#studio-diary" className="text-charcoal hover:text-ochre transition-colors">Studio Diary</a>
            <a href="#about" className="text-charcoal hover:text-ochre transition-colors">About</a>
            <a href="#contact" className="text-charcoal hover:text-ochre transition-colors">Contact</a>
          </div>

          <button
            className="md:hidden text-charcoal hover:text-ochre transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {isOpen && (
          <div className="md:hidden bg-bone border-t border-umbra/10">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#gallery" className="text-charcoal hover:text-ochre transition-colors" onClick={() => setIsOpen(false)}>
                Gallery
              </a>
              <a href="#studio-diary" className="text-charcoal hover:text-ochre transition-colors" onClick={() => setIsOpen(false)}>
                Studio Diary
              </a>
              <a href="#about" className="text-charcoal hover:text-ochre transition-colors" onClick={() => setIsOpen(false)}>
                About
              </a>
              <a href="#contact" className="text-charcoal hover:text-ochre transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
