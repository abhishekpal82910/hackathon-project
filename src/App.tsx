import React, { useState, useEffect } from 'react';
import { GovUtilityBar } from './components/common/GovUtilityBar';
import { GovHeader } from './components/common/GovHeader';
import { GovNavbar, NavTabId } from './components/common/GovNavbar';
import { GovFooter } from './components/common/GovFooter';
import { HomePage } from './components/home/HomePage';
import { ExplorerPage } from './components/explorer/ExplorerPage';
import { MethodologyPage } from './components/methodology/MethodologyPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { GenerateUlpinPage } from './components/generator/GenerateUlpinPage';
import { BackToTopButton } from './components/common/BackToTopButton';
import { ToastProvider } from './components/common/ToastNotice';
import { getAllBuildings, DB_UPDATED_EVENT } from './data/propertyDatabase';
import { BuildingWithLevels } from './types/cadastre';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('home');
  const [currentBuildingId, setCurrentBuildingId] = useState<string>('BLD-01');
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1, 0, 1
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [buildings, setBuildings] = useState<BuildingWithLevels[]>(() => getAllBuildings());

  // Subscribe to local cadastral database updates
  useEffect(() => {
    const handleDbUpdate = () => {
      setBuildings(getAllBuildings());
    };
    window.addEventListener(DB_UPDATED_EVENT, handleDbUpdate);
    return () => window.removeEventListener(DB_UPDATED_EVENT, handleDbUpdate);
  }, []);

  // Handle navigation from Home or Reports with optional building selection
  const handleNavigate = (tab: NavTabId, buildingId?: string) => {
    if (buildingId) {
      setCurrentBuildingId(buildingId);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamically compute root font-size scaling for GIGW A- / A / A+
  useEffect(() => {
    const sizeName = 
      fontSizeLevel <= -2 ? 'xsmall' :
      fontSizeLevel === -1 ? 'small' : 
      fontSizeLevel === 1 ? 'large' : 
      fontSizeLevel >= 2 ? 'xlarge' : 'normal';

    document.documentElement.setAttribute('data-font-size', sizeName);
  }, [fontSizeLevel]);

  // Sync high contrast attribute to document element for scrollbar and accessibility styling
  useEffect(() => {
    document.documentElement.setAttribute('data-high-contrast', highContrast ? 'true' : 'false');
  }, [highContrast]);

  return (
    <ToastProvider highContrast={highContrast}>
      <div 
        id="app-container" 
        className={`min-h-screen flex flex-col font-sans transition-colors ${
          highContrast ? 'bg-black text-white' : 'bg-[#F8FAFC] text-slate-900'
        }`}
      >
        {/* 1. GIGW Utility Bar */}
        <GovUtilityBar
          fontSizeLevel={fontSizeLevel}
          setFontSizeLevel={setFontSizeLevel}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          language={language}
          setLanguage={setLanguage}
        />

        {/* 2. Official Government Header */}
        <GovHeader highContrast={highContrast} language={language} />

        {/* 3. Primary Solid Navy Navigation Bar */}
        <GovNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          highContrast={highContrast}
          language={language}
        />

        {/* 4. Main Accessible Content Area */}
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {activeTab === 'home' && (
            <HomePage
              onNavigate={handleNavigate}
              highContrast={highContrast}
              language={language}
            />
          )}

          {activeTab === 'explorer' && (
            <ExplorerPage
              buildings={buildings}
              currentBuildingId={currentBuildingId}
              onSelectBuilding={setCurrentBuildingId}
              highContrast={highContrast}
              language={language}
            />
          )}

          {activeTab === 'generate-ulpin' && (
            <GenerateUlpinPage
              onNavigateToExplorer={(id) => handleNavigate('explorer', id)}
              highContrast={highContrast}
              language={language}
            />
          )}

          {activeTab === 'methodology' && (
            <MethodologyPage
              highContrast={highContrast}
              language={language}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              buildings={buildings}
              onOpenInExplorer={(id) => handleNavigate('explorer', id)}
              highContrast={highContrast}
              language={language}
            />
          )}
        </main>

        {/* 5. GIGW Standard Footer */}
        <GovFooter highContrast={highContrast} language={language} />

        {/* 6. Floating Back to Top Button */}
        <BackToTopButton highContrast={highContrast} language={language} />
      </div>
    </ToastProvider>
  );
}
