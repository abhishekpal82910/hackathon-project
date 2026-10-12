import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Building, MapPin, X, ChevronDown, Check } from 'lucide-react';
import { BuildingWithLevels } from '../../types/cadastre';

interface SearchBarProps {
  buildings: BuildingWithLevels[];
  currentBuildingId: string;
  onSelectBuilding: (buildingId: string) => void;
  highContrast: boolean;
  language?: 'en' | 'hi';
}

export const SearchBar: React.FC<SearchBarProps> = ({
  buildings,
  currentBuildingId,
  onSelectBuilding,
  highContrast,
  language = 'en'
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter matching buildings by name, id, city, or ULPIN
  const filteredBuildings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return buildings;
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.ulpin_base.toLowerCase().includes(q) ||
        b.state.toLowerCase().includes(q)
    );
  }, [buildings, searchTerm]);

  return (
    <div id="building-search-shell" className="w-full space-y-2.5">
      {/* Search Input Box */}
      <div className="relative">
        <input
          id="input-building-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={language === 'hi' ? 'नाम, आईडी, शहर अथवा ULPIN द्वारा खोजें...' : 'Search by name, ID, city, or ULPIN...'}
          className={`w-full border border-slate-300 p-1.5 text-xs pr-7 focus:outline-none focus:border-[#0B3D6B] focus:ring-1 focus:ring-[#0B3D6B] ${
            highContrast
              ? 'bg-black text-white border-yellow-400 focus:ring-yellow-400'
              : 'bg-white text-slate-900 border-slate-300'
          }`}
          aria-label={language === 'hi' ? 'संपत्ति अथवा भवन खोजें' : 'Find Property or Building'}
        />
        <div className="absolute right-2 top-1.5 text-slate-400 pointer-events-none">
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="pointer-events-auto text-slate-400 hover:text-slate-600"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </div>
      </div>

      {/* Buildings Instant List */}
      <div>
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase mb-1">
          <span>Search Results ({filteredBuildings.length} Found)</span>
          <span className="text-slate-400">Select to View</span>
        </div>

        <div className="space-y-1 max-h-44 overflow-y-auto border border-slate-200 bg-slate-50/50 p-1 divide-y divide-slate-100">
          {filteredBuildings.length === 0 ? (
            <div className="p-3 text-[11px] text-slate-500 text-center">
              No matching cadastral parcel for "{searchTerm}"
            </div>
          ) : (
            filteredBuildings.map((b) => {
              const isSelected = b.id === currentBuildingId;
              return (
                <button
                  key={b.id}
                  id={`search-result-item-${b.id}`}
                  onClick={() => onSelectBuilding(b.id)}
                  className={`w-full text-left p-1.5 text-xs transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-l-4 border-[#0B3D6B] font-bold text-slate-900 shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700 border-l-4 border-transparent'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate text-xs font-semibold">
                      {b.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {b.id} • {b.city}, {b.state}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#0B3D6B] shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
