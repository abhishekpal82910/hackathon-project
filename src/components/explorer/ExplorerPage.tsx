import React, { useState, useRef, useEffect } from 'react';
import { 
  BuildingWithLevels, 
  BuildingLevel 
} from '../../types/cadastre';
import { Viewer3D } from './Viewer3D';
import { SearchBar } from './SearchBar';
import { LevelDetailPanel } from './LevelDetailPanel';
import { CopyUlpinButton } from '../common/CopyUlpinButton';
import { Viewer3DSkeleton } from '../common/SkeletonLoader';
import { 
  Box, 
  Eye, 
  EyeOff, 
  MapPin, 
  Maximize, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface ExplorerPageProps {
  buildings: BuildingWithLevels[];
  currentBuildingId: string;
  onSelectBuilding: (id: string) => void;
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const ExplorerPage: React.FC<ExplorerPageProps> = ({
  buildings,
  currentBuildingId,
  onSelectBuilding,
  highContrast,
  language
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [showUnderground, setShowUnderground] = useState<boolean>(true);
  const [cameraTrigger, setCameraTrigger] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const detailPanelRef = useRef<HTMLDivElement>(null);

  // Find the active building
  const building = buildings.find((b) => b.id === currentBuildingId) || buildings[0];

  // Whenever building changes, reset level selection, trigger camera reset and brief transition state
  useEffect(() => {
    setIsLoading(true);
    setSelectedLevelId(null);
    setCameraTrigger((prev) => prev + 1);
    const timer = setTimeout(() => setIsLoading(false), 220);
    return () => clearTimeout(timer);
  }, [currentBuildingId]);

  // Handle selecting a level (from 3D mesh click or button)
  const handleSelectLevel = (level: BuildingLevel) => {
    setSelectedLevelId(level.id);

    // Prompt requirement: Scroll the details panel into view after selection
    setTimeout(() => {
      detailPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }, 80);
  };

  const selectedLevel = building.levels.find((l) => l.id === selectedLevelId) || null;

  return (
    <div id="explorer-page-root" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
      {/* High Density Main Split Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Sidebar: Property Search & Building Summary */}
        <aside className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
          {/* 1. Find Property / Building Card */}
          <div className="bg-white border border-slate-300 shadow-xs p-3.5">
            <label 
              htmlFor="input-search-property"
              className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-wider"
            >
              {language === 'hi' ? 'संपत्ति / भवन खोजें' : 'Find Property / Building'}
            </label>
            <SearchBar
              buildings={buildings}
              currentBuildingId={currentBuildingId}
              onSelectBuilding={onSelectBuilding}
              highContrast={highContrast}
              language={language}
            />
          </div>

          {/* 2. Building Summary Card */}
          <div className="bg-white border border-slate-300 shadow-xs p-3.5 flex-1 space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'hi' ? 'भवन सारांश' : 'BUILDING SUMMARY'}
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 800);
                  }}
                  title={language === 'hi' ? '3D मॉडल पुनः लोड करें' : 'Reload 3D Model (Test Skeleton Loader)'}
                  className="p-1 rounded text-slate-400 hover:text-[#0B3D6B] hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0B3D6B]' : ''}`} />
                </button>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  building.levels.some(l => l.topology_status === 'Pending')
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {building.levels.some(l => l.topology_status === 'Pending') 
                    ? (language === 'hi' ? 'ऑडिट प्रतीक्षित' : 'AUDIT PENDING') 
                    : (language === 'hi' ? 'सत्यापित' : 'VERIFIED')}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">
                  {language === 'hi' ? 'मूल ULPIN (भू-आधार)' : 'Base ULPIN (Bhu-Aadhaar)'}
                </div>
                <div className="flex items-center justify-between gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-200 hover:border-slate-300 transition-colors">
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#0B3D6B] select-all">
                    {building.ulpin_base}
                  </span>
                  <CopyUlpinButton
                    ulpin={building.ulpin_base}
                    label="Base ULPIN"
                    variant="badge"
                    size="xs"
                    showText={false}
                    highContrast={highContrast}
                  />
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-600 shrink-0" />
                  <span>{building.name}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {building.city}, {building.state} • {building.lat.toFixed(4)}°N, {building.lng.toFixed(4)}°E
                </div>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div className="bg-slate-50 p-2 border border-slate-200">
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">
                    {language === 'hi' ? 'ऊपरी तल' : 'Floors'}
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? '10 (ऊपर)' : '10 (Above)'}
                  </div>
                </div>
                <div className="bg-slate-50 p-2 border border-slate-200">
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">
                    {language === 'hi' ? 'बेसमेंट' : 'Basements'}
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {language === 'hi' ? '02 (नीचे)' : '02 (Below)'}
                  </div>
                </div>
                <div className="bg-slate-50 p-2 border border-slate-200">
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">
                    {language === 'hi' ? 'पदचिह्न' : 'Footprint'}
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-900">{building.computed_footprint_area} m²</div>
                </div>
                <div className="bg-slate-50 p-2 border border-slate-200">
                  <div className="text-[9px] text-slate-500 uppercase font-semibold">
                    {language === 'hi' ? 'सर्वे वर्ष' : 'Survey Yr'}
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-900">{building.year_surveyed}</div>
                </div>
              </div>

              {/* Geometry Footprint Type */}
              <div className="flex items-center justify-between text-[11px] px-2 py-1 bg-slate-50 border border-slate-200">
                <span className="text-slate-500 uppercase text-[9px] font-semibold">
                  {language === 'hi' ? 'आकार:' : 'Shape:'}
                </span>
                <span className="font-bold capitalize text-slate-800">{building.footprint_type.replace('_', ' ')}</span>
              </div>

              {/* Underground Visibility Toggle Buttons */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[9px] text-slate-500 uppercase font-bold mb-1.5 tracking-wider">
                  {language === 'hi' ? 'भूमिगत दृश्यता' : 'Underground Visibility'}
                </div>
                <div className="flex gap-2">
                  <button
                    id="btn-underground-show"
                    onClick={() => setShowUnderground(true)}
                    className={`flex-1 text-[10px] py-1 font-bold border transition-all cursor-pointer hover:shadow-xs active:scale-95 ${
                      showUnderground
                        ? 'bg-[#0B3D6B] text-white border-[#0B3D6B]'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {language === 'hi' ? 'दिखाएँ' : 'SHOW'}
                  </button>
                  <button
                    id="btn-underground-hide"
                    onClick={() => setShowUnderground(false)}
                    className={`flex-1 text-[10px] py-1 font-bold border transition-all cursor-pointer hover:shadow-xs active:scale-95 ${
                      !showUnderground
                        ? 'bg-[#0B3D6B] text-white border-[#0B3D6B]'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {language === 'hi' ? 'छिपाएँ' : 'HIDE'}
                  </button>
                </div>
              </div>

              {/* Reset Camera Framing */}
              <button
                id="btn-reset-camera"
                onClick={() => setCameraTrigger((prev) => prev + 1)}
                className="w-full mt-1 flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold border border-slate-300 bg-white hover:bg-slate-100 hover:border-[#0B3D6B]/40 hover:text-[#0B3D6B] text-slate-700 transition-all cursor-pointer uppercase tracking-wider active:scale-98"
                title={language === 'hi' ? '3D कैमरा रीसेट करें' : 'Reset 3D camera'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'hi' ? '3D दृश्य रीसेट करें' : 'Reset 3D View Orientation'}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Central / Right Area: 3D Viewer + Level Selector + Level Detail Panel */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* 3D Viewer Canvas */}
          <div className="relative">
            {isLoading ? (
              <Viewer3DSkeleton
                buildingName={building.name}
                highContrast={highContrast}
                language={language}
              />
            ) : (
              <Viewer3D
                building={building}
                selectedLevelId={selectedLevelId}
                onSelectLevel={handleSelectLevel}
                showUnderground={showUnderground}
                cameraTrigger={cameraTrigger}
              />
            )}
          </div>

          {/* Direct Level Strata Selector Bar */}
          <div className="bg-white border border-slate-300 shadow-xs p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              {language === 'hi' ? 'तल चयनकर्ता (10 तल + 2 बेसमेंट):' : 'Strata Selector (10 Floors + 2 Basements):'}
            </span>
            <div className="flex flex-wrap gap-1">
              {building.levels.map((lvl) => {
                const isSelected = selectedLevelId === lvl.id;
                const isBasement = lvl.level_type === 'basement';
                const isPending = lvl.topology_status === 'Pending';

                return (
                  <button
                    key={lvl.id}
                    id={`btn-select-level-${lvl.level_code}`}
                    onClick={() => handleSelectLevel(lvl)}
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold border transition-all duration-150 focus:outline-none cursor-pointer hover:shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#0B3D6B] text-white border-[#0B3D6B] ring-1 ring-yellow-400'
                        : isPending
                        ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200 hover:border-amber-400'
                        : isBasement
                        ? 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300 hover:border-slate-400'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-blue-50 hover:border-[#0B3D6B]/50 hover:text-[#0B3D6B]'
                    }`}
                  >
                    {lvl.level_code} {isPending && '⚠️'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Detail Panel BELOW Viewer (Strict prompt rule: "never a modal/overlay") */}
          <div ref={detailPanelRef}>
            <LevelDetailPanel
              selectedLevel={selectedLevel}
              building={building}
              highContrast={highContrast}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
