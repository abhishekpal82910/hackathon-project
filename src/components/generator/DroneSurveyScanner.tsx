import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, Crosshair, AlertCircle, RefreshCw, ZoomIn, ZoomOut, Layers } from 'lucide-react';

interface DroneSurveyScannerProps {
  onImageSelected?: (imageUrl: string, imageName: string) => void;
  selectedImageUrl?: string;
  highContrast: boolean;
  footprintWidth: number;
  footprintDepth: number;
  language?: 'en' | 'hi';
}

const SAMPLE_DRONE_SURVEYS = [
  {
    id: 'bhopal-commercial',
    title: 'Plot 402 - Commercial Core (Arera Hills)',
    meta: 'Flight Alt: 60m AGL • GSD: 2.2 cm/px • Sensor: RGB 48MP',
    svgType: 'commercial'
  },
  {
    id: 'indore-mixed',
    title: 'Plot 118 - Mixed Use Sector (Vijay Nagar)',
    meta: 'Flight Alt: 75m AGL • GSD: 2.8 cm/px • Sensor: Dual Nadir RGB',
    svgType: 'mixed'
  },
  {
    id: 'jabalpur-institutional',
    title: 'Plot 88 - Institutional Parcel (Civic Center)',
    meta: 'Flight Alt: 50m AGL • GSD: 1.8 cm/px • Sensor: Ortho RGB',
    svgType: 'institutional'
  }
];

export const DroneSurveyScanner: React.FC<DroneSurveyScannerProps> = ({
  onImageSelected,
  selectedImageUrl,
  highContrast,
  footprintWidth,
  footprintDepth,
  language = 'en'
}) => {
  const isHi = language === 'hi';
  const [activeSample, setActiveSample] = useState<string>('bhopal-commercial');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showCadastralGrid, setShowCadastralGrid] = useState<boolean>(true);
  const [showParcelBounds, setShowParcelBounds] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomImage(result);
        if (onImageSelected) {
          onImageSelected(result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    setActiveSample(sampleId);
    setCustomImage(null);
    const sample = SAMPLE_DRONE_SURVEYS.find((s) => s.id === sampleId);
    if (onImageSelected && sample) {
      onImageSelected(`sample:${sample.id}`, sample.title);
    }
  };

  return (
    <div
      id="drone-survey-scanner-container"
      className={`rounded-xl border p-5 transition-all ${
        highContrast
          ? 'bg-neutral-900 border-yellow-400 text-white'
          : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}
    >
      {/* Header with Title and Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B]">
              <Camera className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base text-[#0B3D6B]">
              {isHi ? 'चरण 3: ड्रोन / हवाई सर्वेक्षण चित्र संदर्भ' : 'Stage 3: Drone / Aerial Survey Imagery Reference'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isHi
              ? 'राष्ट्रीय CORS नेटवर्क डेटम के अनुसार कैलिब्रेटेड ऑर्थोफ़ोटो संरेखण संदर्भ।'
              : 'Visual orthophoto alignment reference calibrated against national CORS network datum.'}
          </p>
        </div>

        {/* Prototype Mandatory Disclosure Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>{isHi ? 'प्रोटोटाइप सूचना:' : 'Prototype Notice:'}</strong>{' '}
            {isHi
              ? 'ड्रोन छवि का उपयोग दृश्य सर्वेक्षण संदर्भ के रूप में किया जाता है। भवन माप इस प्रोटोटाइप में उपयोगकर्ता द्वारा पुष्टि किए जाते हैं।'
              : 'Drone image is used as a visual survey reference. Building measurements are user-confirmed in this prototype.'}
          </span>
        </div>
      </div>

      {/* Preset Selector & Upload Action */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">
            {isHi ? 'ड्रोन डेटासेट नमूने:' : 'Sample Drone Datasets:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_DRONE_SURVEYS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                id={`sample-drone-btn-${sample.id}`}
                onClick={() => handleSelectSample(sample.id)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                  activeSample === sample.id && !customImage
                    ? 'bg-[#0B3D6B] text-white border-[#0B3D6B] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {sample.title.split(' - ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp,image/tiff"
            className="hidden"
          />
          <button
            type="button"
            id="upload-custom-drone-btn"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-[#0B3D6B]" />
            {isHi ? 'हवाई ऑर्थोफ़ोटो अपलोड करें' : 'Upload Aerial Orthophoto'}
          </button>
        </div>
      </div>

      {/* Interactive Orthophoto Viewport in Light Cadastral Theme */}
      <div 
        id="drone-survey-viewport"
        className="mt-4 relative rounded-lg border border-slate-300 overflow-hidden bg-slate-100 min-h-[280px] h-[300px] xs:h-[340px] sm:h-[380px] md:h-[400px] flex items-center justify-center select-none group shadow-xs w-full"
      >
        {/* Custom Image or Procedural Orthophoto Canvas */}
        {customImage ? (
          <img
            id="drone-survey-custom-img"
            src={customImage}
            alt="Uploaded drone survey orthophoto"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          />
        ) : (
          <div
            id="drone-survey-map-wrapper"
            className="w-full h-full relative overflow-hidden flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Procedural High-Resolution Orthophoto Texture Simulation (Light Cadastral Theme) */}
            <svg
              id="drone-survey-cadastral-svg-map"
              className="w-full h-full object-contain"
              viewBox="0 0 800 450"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="groundGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="50%" stopColor="#EEF2F6" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </linearGradient>
                <pattern id="surveyGridLight" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(11, 61, 107, 0.12)" strokeWidth="1" />
                </pattern>
                <pattern id="subGridLight" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(100, 116, 139, 0.08)" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Background Ground Terrain */}
              <rect id="drone-map-ground-terrain" width="800" height="450" fill="url(#groundGradLight)" />
              <rect id="drone-map-subgrid" width="800" height="450" fill="url(#subGridLight)" />
              {showCadastralGrid && (
                <rect 
                  id="drone-map-cadastral-grid" 
                  width="800" 
                  height="450" 
                  fill="url(#surveyGridLight)" 
                />
              )}

              {/* Adjacent Parcels & Street Network */}
              <path d="M 0 120 L 800 120" stroke="#94A3B8" strokeWidth="16" />
              <path d="M 0 120 L 800 120" stroke="#E2E8F0" strokeWidth="12" />
              <path d="M 0 120 L 800 120" stroke="#D97706" strokeWidth="1.5" strokeDasharray="10 6" />
              <path d="M 220 0 L 220 450" stroke="#94A3B8" strokeWidth="14" />
              <path d="M 220 0 L 220 450" stroke="#E2E8F0" strokeWidth="10" />
              <path d="M 220 0 L 220 450" stroke="#D97706" strokeWidth="1.5" strokeDasharray="8 6" />

              {/* Surrounding Cadastral Plot Boundaries */}
              <rect x="30" y="20" width="160" height="80" fill="#E2E8F0" opacity="0.85" stroke="#94A3B8" strokeWidth="1.5" />
              <text x="110" y="65" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PARCEL 401</text>

              <rect x="250" y="20" width="220" height="80" fill="#E2E8F0" opacity="0.85" stroke="#94A3B8" strokeWidth="1.5" />
              <text x="360" y="65" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PARCEL 403 (VACANT)</text>

              <rect x="30" y="160" width="160" height="250" fill="#E2E8F0" opacity="0.85" stroke="#94A3B8" strokeWidth="1.5" />
              <text x="110" y="290" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">PARCEL 400 (SUB-STATION)</text>

              {/* PRIMARY SURVEY PARCEL (PARCEL 402) */}
              <g transform="translate(260, 160)">
                {/* Parcel Boundary Envelope */}
                {showParcelBounds && (
                  <rect
                    x="0"
                    y="0"
                    width="460"
                    height="260"
                    fill="rgba(11, 61, 107, 0.08)"
                    stroke="#0284C7"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                )}

                {/* Target Building Footprint Projection */}
                <g transform="translate(60, 40)">
                  <rect
                    x="0"
                    y="0"
                    width={Math.min(340, Math.max(120, footprintWidth * 7))}
                    height={Math.min(180, Math.max(80, footprintDepth * 5.5))}
                    fill="rgba(245, 158, 11, 0.28)"
                    stroke="#D97706"
                    strokeWidth="2"
                    rx="3"
                  />

                  {/* Center Crosshair Marker */}
                  <circle
                    cx={Math.min(340, Math.max(120, footprintWidth * 7)) / 2}
                    cy={Math.min(180, Math.max(80, footprintDepth * 5.5)) / 2}
                    r="6"
                    fill="#DC2626"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <line
                    x1={Math.min(340, Math.max(120, footprintWidth * 7)) / 2 - 14}
                    y1={Math.min(180, Math.max(80, footprintDepth * 5.5)) / 2}
                    x2={Math.min(340, Math.max(120, footprintWidth * 7)) / 2 + 14}
                    y2={Math.min(180, Math.max(80, footprintDepth * 5.5)) / 2}
                    stroke="#DC2626"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={Math.min(340, Math.max(120, footprintWidth * 7)) / 2}
                    y1={Math.min(180, Math.max(80, footprintDepth * 5.5)) / 2 - 14}
                    x2={Math.min(340, Math.max(120, footprintWidth * 7)) / 2}
                    y2={Math.min(180, Math.max(80, footprintDepth * 5.5)) / 2 + 14}
                    stroke="#DC2626"
                    strokeWidth="1.5"
                  />

                  {/* Dimension Annotations */}
                  <text
                    x={Math.min(340, Math.max(120, footprintWidth * 7)) / 2}
                    y="-10"
                    fill="#92400E"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    Width: {footprintWidth}m
                  </text>
                  <text
                    x="-12"
                    y={Math.min(180, Math.max(80, footprintDepth * 5.5)) / 2}
                    fill="#92400E"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(-90, -12, ${Math.min(180, Math.max(80, footprintDepth * 5.5)) / 2})`}
                    fontFamily="monospace"
                  >
                    Depth: {footprintDepth}m
                  </text>
                </g>

                {/* Parcel Tag */}
                <text x="14" y="24" fill="#0369A1" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  TARGET PARCEL BOUNDARY • DGPS CALIBRATED
                </text>
              </g>
            </svg>
          </div>
        )}

        {/* HUD Telemetry Overlay (Light Theme) */}
        <div 
          id="drone-survey-hud-overlay"
          className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-md px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-[11px] font-mono text-slate-800 shadow-sm pointer-events-none space-y-0.5 sm:space-y-1 z-10 max-w-[calc(100%-80px)] sm:max-w-xs"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <span className="font-bold text-slate-900 truncate">ORTHOPHOTO: 2.5cm GSD</span>
          </div>
          <div className="text-slate-600 hidden sm:block">
            Sensor: Nadir Aerial RGB • CORS Ref: IND-MP-BHP-09
          </div>
          <div className="text-[#0B3D6B] font-semibold hidden sm:block">
            Status: Orthorectified (NAD83 / WGS84 GeoTIFF)
          </div>
        </div>

        {/* Viewport Control Actions (Light Theme) */}
        <div 
          id="drone-survey-controls-toolbar"
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1 bg-white/95 backdrop-blur-xs border border-slate-300 rounded-md p-0.5 sm:p-1 shadow-sm z-10"
        >
          <button
            type="button"
            id="drone-zoom-in-btn"
            title="Zoom In"
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            className="p-1 sm:p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            id="drone-zoom-out-btn"
            title="Zoom Out"
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            className="p-1 sm:p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            id="drone-toggle-grid-btn"
            title="Toggle Grid"
            onClick={() => setShowCadastralGrid((g) => !g)}
            className={`p-1 sm:p-1.5 rounded transition-colors cursor-pointer ${
              showCadastralGrid ? 'bg-[#0B3D6B] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            id="drone-toggle-parcel-btn"
            title="Toggle Parcel Bounds"
            onClick={() => setShowParcelBounds((b) => !b)}
            className={`p-1 sm:p-1.5 rounded transition-colors cursor-pointer ${
              showParcelBounds ? 'bg-[#0B3D6B] text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            id="drone-reset-view-btn"
            title="Reset View"
            onClick={() => {
              setZoomLevel(1);
              setShowCadastralGrid(true);
              setShowParcelBounds(true);
            }}
            className="p-1 sm:p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Scale Bar Indicator (Light Theme) */}
        <div 
          id="drone-survey-scale-bar"
          className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/90 backdrop-blur-xs border border-slate-300 rounded px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-mono text-slate-700 shadow-xs pointer-events-none flex items-center gap-1.5 sm:gap-2 z-10"
        >
          <span className="font-semibold text-slate-600 hidden xs:inline">Scale:</span>
          <div className="w-10 sm:w-16 h-1.5 bg-slate-800 border border-slate-600 relative">
            <span className="absolute -top-3.5 right-0 text-[8px] sm:text-[9px] font-bold text-slate-800">20m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
