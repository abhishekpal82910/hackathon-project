import React from 'react';
import { BuildingLevel, UsageType } from '../../types/cadastre';
import { Layers, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface VerticalStructureEditorProps {
  levels: BuildingLevel[];
  onUpdateLevel: (index: number, updated: Partial<BuildingLevel>) => void;
  onAddFloor: () => void;
  onRemoveFloor: (index: number) => void;
  baseFootprintArea: number;
  highContrast: boolean;
  selectedLevelId: string | null;
  onSelectLevel: (level: BuildingLevel) => void;
  language?: 'en' | 'hi';
}

const USAGE_OPTIONS: { value: UsageType; labelEn: string; labelHi: string }[] = [
  { value: 'Residential', labelEn: 'Residential', labelHi: 'आवासीय' },
  { value: 'Commercial', labelEn: 'Commercial', labelHi: 'व्यावसायिक' },
  { value: 'Common Area', labelEn: 'Common Area', labelHi: 'साझा क्षेत्र' },
  { value: 'Parking', labelEn: 'Parking', labelHi: 'पार्किंग' },
  { value: 'Utility', labelEn: 'Utility', labelHi: 'उपयोगिता' },
  { value: 'Institutional', labelEn: 'Institutional', labelHi: 'संस्थागत' }
];

export const VerticalStructureEditor: React.FC<VerticalStructureEditorProps> = ({
  levels,
  onUpdateLevel,
  onAddFloor,
  onRemoveFloor,
  baseFootprintArea,
  highContrast,
  selectedLevelId,
  onSelectLevel,
  language = 'en'
}) => {
  const isHi = language === 'hi';

  return (
    <div
      id="vertical-structure-editor-card"
      className={`rounded-xl border p-5 transition-all ${
        highContrast
          ? 'bg-neutral-900 border-yellow-400 text-white'
          : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B]">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base text-[#0B3D6B]">
              {isHi ? 'चरण 5: ऊर्ध्वाधर तल व इकाई संरचना संपादक' : 'Stage 5: Vertical Strata & Unit Structure Editor'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isHi
              ? 'ऊर्ध्वाधर भू-खंड तल आवंटन, इकाई उपयोग वर्गीकरण कॉन्फ़िगर करें और ऊंचाई निरंतरता सत्यापित करें।'
              : 'Configure vertical parcel strata allocations, unit usage classifications, and verify elevation continuity.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="add-floor-strata-btn"
            onClick={onAddFloor}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#0B3D6B] hover:bg-[#082C4D] text-white transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {isHi ? '+ तल स्तर जोड़ें' : 'Add Floor Level'}
          </button>
        </div>
      </div>

      {/* Levels Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">{isHi ? 'तल कोड' : 'Level Code'}</th>
              <th className="py-2.5 px-3">{isHi ? 'प्रकार' : 'Type'}</th>
              <th className="py-2.5 px-3">{isHi ? 'उपयोग वर्गीकरण' : 'Usage Classification'}</th>
              <th className="py-2.5 px-3">{isHi ? 'क्षेत्रफल (sq.m)' : 'Area (sq.m)'}</th>
              <th className="py-2.5 px-3">{isHi ? 'ऊंचाई सीमा' : 'Elevation Range'}</th>
              <th className="py-2.5 px-3">{isHi ? 'ऊर्ध्वाधर ULPIN' : 'Vertical ULPIN'}</th>
              <th className="py-2.5 px-3">{isHi ? 'आवंटन / स्वामी' : 'Allotment / Owner'}</th>
              <th className="py-2.5 px-3 text-right">{isHi ? 'कार्रवाई' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {levels.map((level, idx) => {
              const isSelected = selectedLevelId === level.id;
              const isBasement = level.level_type === 'basement';
              const isAreaWarning = level.area_sqm > baseFootprintArea * 1.15;

              return (
                <tr
                  key={level.id || idx}
                  onClick={() => onSelectLevel(level)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-amber-50/80 font-medium'
                      : isBasement
                      ? 'bg-slate-50/40 hover:bg-slate-100/60'
                      : 'hover:bg-blue-50/40'
                  }`}
                >
                  {/* Code */}
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                        isBasement
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-[#0B3D6B]'
                      }`}
                    >
                      {level.level_code}
                    </span>
                  </td>

                  {/* Level Type */}
                  <td className="py-2.5 px-3 text-slate-600 capitalize">
                    {level.level_type === 'basement' ? (isHi ? 'बेसमेंट' : 'basement') : (isHi ? 'तल' : 'floor')}
                  </td>

                  {/* Usage dropdown */}
                  <td className="py-2.5 px-3 font-sans" onClick={(e) => e.stopPropagation()}>
                    <select
                      id={`level-usage-select-${level.level_code}`}
                      value={level.usage_type}
                      onChange={(e) =>
                        onUpdateLevel(idx, { usage_type: e.target.value as UsageType })
                      }
                      className="px-2 py-1 text-xs rounded border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-[#0B3D6B]"
                    >
                      {USAGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {isHi ? opt.labelHi : opt.labelEn}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Area */}
                  <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        id={`level-area-input-${level.level_code}`}
                        min={10}
                        max={10000}
                        value={level.area_sqm}
                        onChange={(e) =>
                          onUpdateLevel(idx, { area_sqm: parseInt(e.target.value) || 10 })
                        }
                        className={`w-20 px-1.5 py-0.5 text-xs rounded border ${
                          isAreaWarning
                            ? 'border-amber-500 bg-amber-50 text-amber-900'
                            : 'border-slate-300 bg-white'
                        }`}
                      />
                      {isAreaWarning && (
                        <span title={isHi ? 'तल क्षेत्रफल पदचिह्न सीमा से अधिक है' : 'Level area exceeds footprint envelope (cantilever warning)'}>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Elevation */}
                  <td className="py-2.5 px-3 text-slate-600">
                    {level.elevation_range_m}m
                  </td>

                  {/* Vertical ULPIN */}
                  <td className="py-2.5 px-3 text-[#0B3D6B] font-semibold text-[11px] truncate max-w-[190px]">
                    {level.vertical_ulpin}
                  </td>

                  {/* Owner / Allotment */}
                  <td className="py-2.5 px-3 font-sans" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      id={`level-owner-input-${level.level_code}`}
                      value={level.owner_name}
                      onChange={(e) => onUpdateLevel(idx, { owner_name: e.target.value })}
                      className="w-36 px-1.5 py-0.5 text-xs rounded border border-slate-300 bg-white text-slate-700"
                    />
                  </td>

                  {/* Delete Action (only allow removing upper floors) */}
                  <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {level.level_type === 'floor' && levels.filter((l) => l.level_type === 'floor').length > 1 && (
                      <button
                        type="button"
                        id={`remove-level-btn-${level.level_code}`}
                        onClick={() => onRemoveFloor(idx)}
                        title={isHi ? 'तल हटाएं' : 'Remove level'}
                        className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div>
          {isHi ? (
            <>कुल ऊर्ध्वाधर तल: <strong className="text-slate-800">{levels.length}</strong> ({levels.filter((l) => l.level_type === 'floor').length} तल, {levels.filter((l) => l.level_type === 'basement').length} बेसमेंट)</>
          ) : (
            <>Total strata levels: <strong className="text-slate-800">{levels.length}</strong> ({levels.filter((l) => l.level_type === 'floor').length} Floors, {levels.filter((l) => l.level_type === 'basement').length} Basements)</>
          )}
        </div>
        <div>
          {isHi ? (
            <>कुल निर्मित क्षेत्रफल: <strong className="text-slate-800">{levels.reduce((sum, l) => sum + l.area_sqm, 0).toLocaleString()} sq.m</strong></>
          ) : (
            <>Cumulative Built-up Area: <strong className="text-slate-800">{levels.reduce((sum, l) => sum + l.area_sqm, 0).toLocaleString()} sq.m</strong></>
          )}
        </div>
      </div>
    </div>
  );
};
