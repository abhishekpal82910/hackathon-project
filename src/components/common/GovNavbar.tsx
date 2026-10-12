import React, { useState } from 'react';
import { Box, FileText, GitBranch, Home, Menu, X, Sparkles } from 'lucide-react';

export type NavTabId = 'home' | 'explorer' | 'generate-ulpin' | 'methodology' | 'reports';

interface GovNavbarProps {
  activeTab: NavTabId;
  setActiveTab: (tab: NavTabId) => void;
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const GovNavbar: React.FC<GovNavbarProps> = ({
  activeTab,
  setActiveTab,
  highContrast,
  language
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { id: NavTabId; labelEn: string; labelHi: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'home',
      labelEn: 'Home',
      labelHi: 'मुख्य पृष्ठ',
      icon: <Home className="w-4 h-4" />
    },
    {
      id: 'explorer',
      labelEn: '3D Cadastre Explorer',
      labelHi: '3D भू-अभिलेख अन्वेषक',
      icon: <Box className="w-4 h-4" />
    },
    {
      id: 'generate-ulpin',
      labelEn: 'Generate ULPIN',
      labelHi: 'ULPIN उत्पन्न करें',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: 'NEW'
    },
    {
      id: 'methodology',
      labelEn: 'Methodology & Pipeline',
      labelHi: 'प्रक्रिया एवं कार्यप्रणाली',
      icon: <GitBranch className="w-4 h-4" />
    },
    {
      id: 'reports',
      labelEn: 'Cadastre Reports',
      labelHi: 'भू-अभिलेख विवरण',
      icon: <FileText className="w-4 h-4" />
    }
  ];

  const currentItem = navItems.find((item) => item.id === activeTab);

  const handleSelectTab = (id: NavTabId) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      id="gov-main-nav"
      aria-label="Primary Navigation"
      className={`border-b shrink-0 transition-colors shadow-xs ${
        highContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-[#0B3D6B] border-[#072744] text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Screen Header with Menu Toggle Button */}
        <div className="sm:hidden flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">
              {currentItem ? (language === 'hi' ? currentItem.labelHi : currentItem.labelEn) : 'Navigation'}
            </span>
          </div>
          <button
            id="btn-mobile-nav-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={isMobileMenuOpen ? 'Hide navigation menu' : 'Expand navigation menu'}
            className={`p-1.5 rounded border flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors outline-none focus:outline-none focus:ring-0 cursor-pointer ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            {isMobileMenuOpen ? (
              <>
                <X className="w-4 h-4" />
                <span className="text-[11px]">Close</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4" />
                <span className="text-[11px]">Menu</span>
              </>
            )}
          </button>
        </div>

        {/* Desktop Navbar List (Always visible on sm and larger) */}
        <ul className="hidden sm:flex flex-wrap items-center gap-4 sm:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="relative">
                <button
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 py-2 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all outline-none focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:rounded-xs cursor-pointer ${
                    isActive
                      ? highContrast
                        ? 'bg-yellow-400 text-black font-bold px-2.5'
                        : 'border-b-2 border-[#138808] text-white'
                      : highContrast
                        ? 'text-yellow-300 opacity-70 hover:opacity-100 border-b-2 border-transparent'
                        : 'text-white/80 hover:text-white border-b-2 border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-black rounded-full bg-amber-400 text-slate-900 tracking-normal uppercase">
                      {language === 'hi' ? 'नया' : item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Mobile Dropdown Menu (Toggled on mobile/Android devices) */}
        {isMobileMenuOpen && (
          <ul
            id="mobile-nav-menu"
            className="sm:hidden flex flex-col gap-1 pb-3 pt-1 border-t border-white/15"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    id={`mobile-nav-tab-${item.id}`}
                    onClick={() => handleSelectTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold tracking-wider uppercase transition-all text-left outline-none focus:outline-none focus:ring-0 cursor-pointer ${
                      isActive
                        ? highContrast
                          ? 'bg-yellow-400 text-black font-bold'
                          : 'bg-white/20 text-white font-bold border-l-4 border-[#138808]'
                        : highContrast
                          ? 'text-yellow-300 hover:bg-neutral-800'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-amber-400 text-slate-900 tracking-normal uppercase">
                        {language === 'hi' ? 'नया' : item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
};
