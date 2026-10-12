import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Compass, 
  Copy,
  Check,
  Download,
  Hash, 
  Layers, 
  Maximize2, 
  ShieldCheck, 
  User, 
  Building as BuildingIcon 
} from 'lucide-react';
import { BuildingLevel, BuildingWithLevels } from '../../types/cadastre';
import { CopyUlpinButton } from '../common/CopyUlpinButton';
import { showToast } from '../common/ToastNotice';

interface LevelDetailPanelProps {
  selectedLevel: BuildingLevel | null;
  building: BuildingWithLevels;
  highContrast: boolean;
  language?: 'en' | 'hi';
}

export const LevelDetailPanel: React.FC<LevelDetailPanelProps> = ({
  selectedLevel,
  building,
  highContrast,
  language = 'en'
}) => {
  const [certGenerated, setCertGenerated] = useState<boolean>(false);

  const handleGenerateCertificate = () => {
    setCertGenerated(true);
    showToast({
      type: 'success',
      title: language === 'hi' ? '3D प्रमाण पत्र तैयार' : '3D Certificate Generated',
      message: `${selectedLevel?.vertical_ulpin} • ${selectedLevel?.owner_name}`,
      duration: 3500
    });
    setTimeout(() => setCertGenerated(false), 3500);
  };

  if (!selectedLevel) {
    return (
      <div 
        id="level-detail-panel"
        className={`p-4 sm:p-5 border text-center transition-all shadow-xs ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-white border-slate-300 text-slate-600'
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          <Layers className="w-5 h-5 text-slate-400" />
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              {language === 'hi' 
                ? 'कोई तल चयनित नहीं • संवादात्मक 3D तल निरीक्षण' 
                : 'No Level Selected • Interactive 3D Strata Inspection'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {language === 'hi'
                ? '3D मॉडल में किसी भी तल (F01–F10) या भूमिगत बेसमेंट (B01–B02) पर क्लिक करें या नीचे दिए गए बटन से चयन करें।'
                : 'Click any above-ground floor (F01–F10) or subterranean basement (B01–B02) in the 3D model or direct selector to inspect its strata parcel metrics.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isBasement = selectedLevel.level_type === 'basement';
  const isPending = selectedLevel.topology_status === 'Pending';

  return (
    <div
      id="level-detail-panel"
      className={`border shadow-xs flex flex-col transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-white'
          : 'bg-white border-slate-300 text-slate-900'
      }`}
    >
      {/* Header bar */}
      <div
        className={`px-4 py-2 border-b flex flex-wrap justify-between items-center gap-2 shrink-0 ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400'
            : isPending
            ? 'bg-amber-50 border-amber-200'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-[#0B3D6B] uppercase tracking-wider">
            {language === 'hi'
              ? `तल विवरण: ${isBasement ? `बेसमेंट ${selectedLevel.level_number}` : `तल ${selectedLevel.level_number}`} (${selectedLevel.level_code})`
              : `LEVEL DETAIL PANEL: ${isBasement ? `BASEMENT ${selectedLevel.level_number}` : `FLOOR ${selectedLevel.level_number}`} (${selectedLevel.level_code})`}
          </h4>
          <span className="text-slate-400 text-[10px] hidden sm:inline">•</span>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">{building.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <CopyUlpinButton
            ulpin={selectedLevel.vertical_ulpin}
            label="Strata ULPIN"
            variant="button"
            size="xs"
            highContrast={highContrast}
          />
        </div>
      </div>

      {/* 4-Column High-Density Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 text-xs">
        {/* Col 1: Owner Information */}
        <div className="border-b sm:border-b-0 sm:border-r border-slate-200 p-3 flex flex-col justify-between">
          <div>
            <div className="text-[9px] text-slate-500 uppercase mb-1 font-bold tracking-wider">
              {language === 'hi' ? 'स्वामित्व जानकारी' : 'Owner Information'}
            </div>
            <div className="font-bold text-slate-900 text-xs">{selectedLevel.owner_name}</div>
            <div className="text-slate-500 text-[10px] font-mono mt-0.5">
              {language === 'hi' ? 'विलेख अभिलेख:' : 'Title Record:'} #{selectedLevel.id.toUpperCase()}
            </div>
          </div>
          <div className="mt-2.5">
            <span className={`inline-block px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-wide border ${
              isPending 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-green-100 text-green-800 border-green-300'
            }`}>
              {isPending 
                ? (language === 'hi' ? 'सत्यापन प्रतीक्षित विलेख' : 'TITLE PENDING AUDIT')
                : (language === 'hi' ? 'पंजीकृत तल विलेख' : 'STRATA TITLE RECORDED')}
            </span>
          </div>
        </div>

        {/* Col 2: Spatial Metrics */}
        <div className="border-b sm:border-b-0 lg:border-r border-slate-200 p-3 space-y-1">
          <div className="text-[9px] text-slate-500 uppercase mb-1 font-bold tracking-wider">
            {language === 'hi' ? 'स्थानिक माप (Spatial)' : 'Spatial Metrics'}
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'निर्मित क्षेत्रफल:' : 'Enclosed Area:'}</span>
            <span className="font-bold font-mono text-slate-900">{selectedLevel.area_sqm.toFixed(1)} m²</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'न्यूनतम ऊंचाई:' : 'Min Elevation:'}</span>
            <span className="font-bold font-mono text-slate-900">{selectedLevel.elevation_start >= 0 ? `+${selectedLevel.elevation_start.toFixed(2)}m` : `${selectedLevel.elevation_start.toFixed(2)}m`}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'अधिकतम ऊंचाई:' : 'Max Elevation:'}</span>
            <span className="font-bold font-mono text-slate-900">{selectedLevel.elevation_end >= 0 ? `+${selectedLevel.elevation_end.toFixed(2)}m` : `${selectedLevel.elevation_end.toFixed(2)}m`}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'स्पष्ट ऊंचाई अंतराल:' : 'Clear Height:'}</span>
            <span className="font-bold font-mono text-slate-900">{(selectedLevel.elevation_end - selectedLevel.elevation_start).toFixed(2)}m</span>
          </div>
        </div>

        {/* Col 3: Usage & Utility */}
        <div className="border-b sm:border-b-0 sm:border-r border-slate-200 p-3 space-y-1">
          <div className="text-[9px] text-slate-500 uppercase mb-1 font-bold tracking-wider">
            {language === 'hi' ? 'उपयोग एवं वर्गीकरण' : 'Usage & Utility'}
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'स्वीकृत उपयोग:' : 'Sanctioned Usage:'}</span>
            <span className="font-bold text-slate-900 capitalize">
              {language === 'hi' 
                ? (selectedLevel.usage_type === 'Commercial' ? 'वाणिज्यिक' :
                   selectedLevel.usage_type === 'Residential' ? 'आवासीय' :
                   selectedLevel.usage_type === 'Parking' ? 'पार्किंग' : selectedLevel.usage_type)
                : selectedLevel.usage_type}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'तल श्रेणी:' : 'Classification:'}</span>
            <span className="font-bold text-slate-900 capitalize">
              {language === 'hi' ? (isBasement ? 'भूमिगत बेसमेंट' : 'भूतल से ऊपर तल') : selectedLevel.level_type}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'सर्वेक्षण ऑडिट तिथि:' : 'Survey Audit Date:'}</span>
            <span className="font-mono text-slate-800">{selectedLevel.last_updated}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600">{language === 'hi' ? 'मूल ULPIN:' : 'Base ULPIN:'}</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] text-slate-700">{building.ulpin_base}</span>
              <CopyUlpinButton
                ulpin={building.ulpin_base}
                label="Base ULPIN"
                variant="icon"
                size="xs"
                highContrast={highContrast}
              />
            </div>
          </div>
        </div>

        {/* Col 4: Topology Status */}
        <div className={`p-3 flex flex-col justify-between ${isPending ? 'bg-amber-50/50' : 'bg-slate-50'}`}>
          <div>
            <div className="text-[9px] text-slate-500 uppercase mb-1 font-bold tracking-wider flex items-center justify-between">
              <span>{language === 'hi' ? 'टोपोलॉजी स्थिति' : 'Topology Status'}</span>
              <span className={`font-bold px-1 rounded text-[9px] ${
                isPending ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isPending 
                  ? (language === 'hi' ? 'प्रतीक्षित' : 'PENDING')
                  : (language === 'hi' ? 'सत्यापित' : 'VERIFIED')}
              </span>
            </div>
            <div className="text-[10px] text-slate-700 leading-tight mb-2">
              {language === 'hi' 
                ? (isPending ? 'ऊर्ध्वाधर विस्तार ऑडिट सत्यापन प्रतीक्षित है।' : 'ऊर्ध्वाधर टोपोलॉजी एवं ऊंचाई सत्यापन सफल।')
                : (selectedLevel.validation_remarks[0] || 'Passed vertical topology verification.')}
            </div>
          </div>

          <div>
            {certGenerated && (
              <div className="mb-1.5 p-1 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 text-[9.5px] font-semibold flex items-center gap-1 animate-in fade-in duration-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{language === 'hi' ? 'आधिकारिक 3D प्रमाण पत्र तैयार है!' : 'Official 3D Certificate Generated!'}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleGenerateCertificate}
              className="w-full bg-white border border-[#0B3D6B] text-[#0B3D6B] hover:bg-[#0B3D6B] hover:text-white font-bold py-1 text-[10px] transition-all duration-150 uppercase tracking-wider cursor-pointer shadow-xs active:scale-95"
            >
              {language === 'hi' ? 'आधिकारिक प्रमाण पत्र बनाएं' : 'GENERATE CERTIFICATE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
