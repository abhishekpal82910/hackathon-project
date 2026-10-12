import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopButtonProps {
  highContrast?: boolean;
  language?: 'en' | 'hi';
}

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  highContrast = false,
  language = 'en'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled beyond 260px
      if (window.scrollY > 260) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  const tooltipText = language === 'hi' ? 'पृष्ठ के शीर्ष पर जाएं' : 'Back to top of page';
  const labelText = language === 'hi' ? 'शीर्ष' : 'Top';

  return (
    <button
      id="btn-back-to-top"
      type="button"
      onClick={scrollToTop}
      aria-label={tooltipText}
      title={tooltipText}
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 group flex items-center gap-1.5 px-3 py-2 rounded-full shadow-md border transition-all duration-200 cursor-pointer active:scale-90 hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 ${
        highContrast
          ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-neutral-900 hover:text-yellow-200 hover:border-yellow-300 ring-2 ring-yellow-400/50'
          : 'bg-[#0B3D6B] text-white border-[#082B4D] hover:bg-[#072744] hover:border-blue-400 hover:shadow-blue-900/20 ring-2 ring-white/30'
      }`}
    >
      <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
        {labelText}
      </span>
    </button>
  );
};
