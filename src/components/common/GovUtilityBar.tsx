import React from 'react';
import { Eye, Languages, Volume2 } from 'lucide-react';
import { getTranslation } from '../../utils/translations';

interface GovUtilityBarProps {
  fontSizeLevel: number; // -1: small, 0: default, 1: large
  setFontSizeLevel: (level: number) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

export const GovUtilityBar: React.FC<GovUtilityBarProps> = ({
  fontSizeLevel,
  setFontSizeLevel,
  highContrast,
  setHighContrast,
  language,
  setLanguage
}) => {
  const t = getTranslation(language);

  const announceScreenReader = () => {
    const liveRegion = document.getElementById('a11y-announcer');
    if (liveRegion) {
      liveRegion.innerText = t.screenReaderActive;
    }
  };

  const handleFontSizeChange = (newLevel: number, actionText: string) => {
    setFontSizeLevel(newLevel);
    const liveRegion = document.getElementById('a11y-announcer');
    if (liveRegion) {
      liveRegion.innerText = t.fontSizeChanged(
        newLevel > 0 ? (language === 'hi' ? 'बड़ा' : 'Large') :
        newLevel < 0 ? (language === 'hi' ? 'छोटा' : 'Small') :
        (language === 'hi' ? 'सामान्य' : 'Normal')
      );
    }
  };

  const handleLanguageToggle = (newLang: 'en' | 'hi') => {
    setLanguage(newLang);
    const liveRegion = document.getElementById('a11y-announcer');
    if (liveRegion) {
      liveRegion.innerText = newLang === 'hi' 
        ? 'भाषा हिन्दी में परिवर्तित की गई।' 
        : 'Language switched to English.';
    }
  };

  return (
    <div 
      id="gov-utility-bar"
      className={`text-[10px] border-b shrink-0 transition-colors ${
        highContrast 
          ? 'bg-black text-white border-yellow-400' 
          : 'bg-slate-200 text-slate-700 border-slate-300'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Skip to content & Screen Reader */}
        <div className="flex items-center gap-4">
          <a
            id="btn-skip-content"
            href="#main-content"
            className="font-medium hover:text-[#0B3D6B] hover:underline focus:outline-none focus:ring-1 focus:ring-[#0B3D6B]"
          >
            {t.skipContent}
          </a>
          <span className="border-l border-slate-400 pl-4 uppercase">
            <button
              id="btn-screen-reader"
              onClick={announceScreenReader}
              className="flex items-center gap-1.5 hover:text-[#0B3D6B] focus:outline-none"
              title="Screen Reader Accessibility Information"
              aria-label="Screen Reader Access"
            >
              <Volume2 className="w-3 h-3" />
              <span>{t.screenReader}</span>
            </button>
          </span>
        </div>

        {/* Right: Text sizing, High Contrast, Language */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Text Resizer: A- / A / A+ */}
          <div 
            className={`flex items-center rounded border overflow-hidden shadow-2xs ${
              highContrast 
                ? 'bg-neutral-900 border-yellow-400' 
                : 'bg-white border-slate-400'
            }`}
          >
            <button
              id="btn-font-dec"
              type="button"
              onClick={() => handleFontSizeChange(Math.max(-2, fontSizeLevel - 1), 'Text size decreased')}
              disabled={fontSizeLevel <= -2}
              className={`px-2.5 py-0.5 border-r text-[10px] font-bold tracking-wider transition-all focus:outline-none focus:ring-1 focus:ring-[#0B3D6B] cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
                highContrast
                  ? `border-yellow-400 ${fontSizeLevel < 0 ? 'bg-yellow-400 text-black' : 'text-yellow-300 hover:bg-neutral-800'}`
                  : `border-slate-300 ${fontSizeLevel < 0 ? 'bg-[#0B3D6B] text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }`}
              title="Decrease text size (A-)"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button
              id="btn-font-reset"
              type="button"
              onClick={() => handleFontSizeChange(0, 'Text size reset to default')}
              className={`px-2.5 py-0.5 border-r text-[10px] font-bold tracking-wider transition-all focus:outline-none focus:ring-1 focus:ring-[#0B3D6B] cursor-pointer ${
                highContrast
                  ? `border-yellow-400 ${fontSizeLevel === 0 ? 'bg-yellow-400 text-black' : 'text-yellow-300 hover:bg-neutral-800'}`
                  : `border-slate-300 ${fontSizeLevel === 0 ? 'bg-[#0B3D6B] text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }`}
              title="Default text size (A)"
              aria-label="Reset text size to default (100%)"
            >
              A
            </button>
            <button
              id="btn-font-inc"
              type="button"
              onClick={() => handleFontSizeChange(Math.min(2, fontSizeLevel + 1), 'Text size increased')}
              disabled={fontSizeLevel >= 2}
              className={`px-2.5 py-0.5 text-[10px] font-bold tracking-wider transition-all focus:outline-none focus:ring-1 focus:ring-[#0B3D6B] cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
                highContrast
                  ? `${fontSizeLevel > 0 ? 'bg-yellow-400 text-black' : 'text-yellow-300 hover:bg-neutral-800'}`
                  : `${fontSizeLevel > 0 ? 'bg-[#0B3D6B] text-white' : 'text-slate-700 hover:bg-slate-100'}`
              }`}
              title="Increase text size (A+)"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          <span className="text-slate-400">|</span>

          {/* High Contrast Toggle */}
          <button
            id="btn-toggle-contrast"
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-bold transition-colors ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-300'
                : 'bg-white text-slate-800 border-slate-400 hover:bg-slate-50'
            }`}
            title="Toggle High Contrast Mode"
            aria-pressed={highContrast}
          >
            <Eye className="w-3 h-3" />
            <span>{highContrast ? 'STANDARD' : 'HIGH CONTRAST'}</span>
          </button>

          <span className="text-slate-400">|</span>

          {/* Language Switcher */}
          <div 
            role="group" 
            aria-label="Language selection" 
            className={`flex items-center p-0.5 rounded border text-[10px] font-semibold transition-all shadow-2xs ${
              highContrast
                ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
                : 'bg-white border-slate-300'
            }`}
          >
            <button
              id="btn-lang-en"
              type="button"
              onClick={() => handleLanguageToggle('en')}
              aria-pressed={language === 'en'}
              className={`px-2 py-0.5 rounded-sm uppercase tracking-wider text-[9.5px] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0B3D6B] ${
                language === 'en'
                  ? highContrast
                    ? 'bg-yellow-400 text-black font-extrabold shadow-xs'
                    : 'bg-[#0B3D6B] text-white font-bold shadow-xs'
                  : highContrast
                    ? 'text-yellow-200 hover:text-white hover:bg-neutral-800'
                    : 'text-slate-600 hover:text-[#0B3D6B] hover:bg-slate-100'
              }`}
              title="Switch to English"
            >
              ENGLISH
            </button>
            <button
              id="btn-lang-hi"
              type="button"
              onClick={() => handleLanguageToggle('hi')}
              aria-pressed={language === 'hi'}
              className={`px-2 py-0.5 rounded-sm tracking-wide text-[10px] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0B3D6B] ${
                language === 'hi'
                  ? highContrast
                    ? 'bg-yellow-400 text-black font-extrabold shadow-xs'
                    : 'bg-[#0B3D6B] text-white font-bold shadow-xs'
                  : highContrast
                    ? 'text-yellow-200 hover:text-white hover:bg-neutral-800'
                    : 'text-slate-600 hover:text-[#0B3D6B] hover:bg-slate-100'
              }`}
              title="हिन्दी में बदलें"
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Screen Reader Live Region */}
      <div id="a11y-announcer" aria-live="polite" className="sr-only" />
    </div>
  );
};
