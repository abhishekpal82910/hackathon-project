import React, { useState, useMemo } from 'react';
import { 
  BuildingWithLevels, 
  BuildingLevel, 
  TopologyStatus 
} from '../../types/cadastre';
import { exportLevelsToCSV } from '../../utils/exportCsv';
import { 
  Download, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  FileSpreadsheet,
  Building as BuildingIcon,
  RefreshCw
} from 'lucide-react';
import { NavTabId } from '../common/GovNavbar';
import { CopyUlpinButton } from '../common/CopyUlpinButton';
import { TableSkeleton } from '../common/SkeletonLoader';
import { showToast } from '../common/ToastNotice';

interface ReportsPageProps {
  buildings: BuildingWithLevels[];
  onOpenInExplorer: (buildingId: string) => void;
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  buildings,
  onOpenInExplorer,
  highContrast,
  language
}) => {
  const isHi = language === 'hi';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [expandedBuildingId, setExpandedBuildingId] = useState<string | null>(null);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);

  const handleExportCSV = () => {
    exportLevelsToCSV(buildings);
    showToast({
      type: 'success',
      title: isHi ? 'CSV निर्यात सफल' : 'Cadastre CSV Exported',
      message: isHi ? '180 तल भू-अभिलेख रिकॉर्ड सफलतापूर्वक डाउनलोड किए गए' : '180 strata parcel records exported successfully as CSV',
      duration: 3500
    });
  };

  const handleRefreshData = () => {
    setIsTableLoading(true);
    setTimeout(() => {
      setIsTableLoading(false);
      showToast({
        type: 'info',
        title: isHi ? 'डेटा रीफ्रेश किया गया' : 'Cadastre Index Refreshed',
        message: isHi ? '15 पायलट भवनों का डेटा अद्यतन है।' : '15 pilot building records synced.',
        duration: 2500
      });
    }, 700);
  };

  // Compute aggregate metrics
  const totalBuildings = buildings.length;
  const totalLevels = buildings.reduce((acc, b) => acc + b.levels.length, 0);
  const verifiedLevels = buildings.reduce(
    (acc, b) => acc + b.levels.filter((l) => l.topology_status === 'Verified').length,
    0
  );
  const pendingLevels = totalLevels - verifiedLevels;

  // Extract unique cities
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(buildings.map((b) => b.city))).sort();
  }, [buildings]);

  // Filtered buildings
  const filteredBuildings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return buildings.filter((b) => {
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.ulpin_base.toLowerCase().includes(q);

      const matchCity = selectedCity === 'ALL' || b.city === selectedCity;

      let matchStatus = true;
      if (statusFilter === 'VERIFIED') {
        matchStatus = b.levels.every((l) => l.topology_status === 'Verified');
      } else if (statusFilter === 'PENDING') {
        matchStatus = b.levels.some((l) => l.topology_status === 'Pending');
      }

      return matchSearch && matchCity && matchStatus;
    });
  }, [buildings, searchTerm, selectedCity, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedBuildingId(expandedBuildingId === id ? null : id);
  };

  return (
    <div id="reports-page-root" className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-4 pb-12">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-300 pb-3">
        <div>
          <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
            {isHi ? 'भूमि संसाधन विभाग (DoLR) भू-अभिलेख पंजिका' : 'DoLR Cadastral Registry'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B3D6B]">
            {isHi ? 'आयतनिक भू-अभिलेख पंजिका एवं स्थिति रिपोर्ट' : 'Volumetric Cadastre Register & Status Reports'}
          </h2>
          <p className="text-[11px] text-slate-600 mt-0.5">
            {isHi 
              ? 'नियम-ऑडिट टेलीमेट्री के साथ सभी 15 पायलट भवनों और 180 ऊर्ध्वाधर भू-खंडों की आधिकारिक सारणीकृत अनुक्रमणिका।' 
              : 'Official tabulated index of all 15 pilot buildings and 180 vertical strata parcels with rule-audit telemetry.'}
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          id="btn-export-csv"
          type="button"
          onClick={handleExportCSV}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs transition-all shadow-xs cursor-pointer hover:shadow-md active:scale-95 ${
            highContrast
              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
              : 'bg-emerald-700 text-white hover:bg-emerald-800'
          }`}
          title={isHi ? 'भू-अभिलेख डेटा को CSV फ़ाइल के रूप में डाउनलोड करें' : 'Download Cadastre Data as CSV file'}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isHi ? 'भू-अभिलेख CSV निर्यात करें (180 तल रिकॉर्ड)' : 'Export Cadastre CSV (180 Strata Records)'}</span>
        </button>
      </div>

      {/* High Density Metric Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-white border border-slate-300 shadow-xs">
          <div className="text-slate-500 font-bold text-[10px] uppercase">
            {isHi ? 'पायलट भवन' : 'Pilot Buildings'}
          </div>
          <div className="text-lg font-bold text-[#0B3D6B] font-mono mt-0.5">{totalBuildings}</div>
          <div className="text-[9px] text-slate-400">
            {isHi ? '10 भारतीय शहरों में' : 'Across 10 Indian cities'}
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-300 shadow-xs">
          <div className="text-slate-500 font-bold text-[10px] uppercase">
            {isHi ? 'कुल पंजीकृत तल' : 'Total Addressable Levels'}
          </div>
          <div className="text-lg font-bold text-[#0B3D6B] font-mono mt-0.5">{totalLevels}</div>
          <div className="text-[9px] text-slate-400">
            {isHi ? 'प्रत्येक में 10 तल + 2 बेसमेंट' : '10 Floors + 2 Basements each'}
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-300 shadow-xs">
          <div className="text-slate-500 font-bold text-[10px] uppercase">
            {isHi ? 'सत्यापित ऊर्ध्वाधर तल' : 'Verified Strata Enclosures'}
          </div>
          <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">{verifiedLevels}</div>
          <div className="text-[9px] text-emerald-600 font-semibold">
            {((verifiedLevels / totalLevels) * 100).toFixed(1)}% {isHi ? 'टोपोलॉजी उत्तीर्ण' : 'Passing Topology'}
          </div>
        </div>

        <div className="p-2.5 bg-white border border-slate-300 shadow-xs">
          <div className="text-slate-500 font-bold text-[10px] uppercase">
            {isHi ? 'लंबित ऑडिट / विसंगतियां' : 'Pending Audit / Edge Cases'}
          </div>
          <div className="text-lg font-bold text-amber-700 font-mono mt-0.5">{pendingLevels}</div>
          <div className="text-[9px] text-amber-600 font-semibold">
            {isHi ? 'BLD-04 व BLD-09 में विसंगतियां' : 'BLD-04 & BLD-09 Injected Edges'}
          </div>
        </div>
      </div>

      {/* High Density Filter and Search Bar */}
      <div className="bg-white p-2.5 border border-slate-300 shadow-xs flex flex-col md:flex-row gap-2.5 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            id="input-reports-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isHi ? 'भवन नाम, आईडी, शहर, या ULPIN द्वारा खोजें...' : 'Search by name, ID, city, or ULPIN...'}
            className="w-full pl-8 pr-2.5 py-1 text-xs border border-slate-300 focus:outline-none focus:border-[#0B3D6B]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* City Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-semibold text-[10px] uppercase">
              {isHi ? 'शहर:' : 'City:'}
            </span>
            <select
              id="select-reports-city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="py-1 px-2 border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:outline-none"
            >
              <option value="ALL">{isHi ? 'सभी शहर' : 'All Cities'} ({buildings.length})</option>
              {uniqueCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-semibold text-[10px] uppercase">
              {isHi ? 'स्थिति:' : 'Status:'}
            </span>
            <select
              id="select-reports-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1 px-2 border border-slate-300 bg-slate-50 text-xs text-slate-800 focus:outline-none hover:border-[#0B3D6B]/50 transition-colors"
            >
              <option value="ALL">{isHi ? 'सभी भवन' : 'All Buildings'}</option>
              <option value="VERIFIED">{isHi ? 'केवल 100% सत्यापित' : '100% Verified Only'}</option>
              <option value="PENDING">{isHi ? 'लंबित विसंगतियां सहित' : 'With Pending Discrepancies'}</option>
            </select>
          </div>

          {/* Quick Refresh / Re-index Button */}
          <button
            type="button"
            onClick={handleRefreshData}
            title={isHi ? 'डेटा पुनः लोड करें' : 'Refresh and Re-index (Test Skeleton Loader)'}
            className="flex items-center gap-1 py-1 px-2 text-[10px] font-bold border border-slate-300 bg-white hover:bg-slate-100 hover:text-[#0B3D6B] hover:border-[#0B3D6B]/50 rounded transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isTableLoading ? 'animate-spin text-[#0B3D6B]' : ''}`} />
            <span>{isHi ? 'रीफ्रेश' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Buildings Table */}
      <div className="bg-white border border-slate-300 shadow-xs overflow-hidden">
        {isTableLoading ? (
          <TableSkeleton rows={7} highContrast={highContrast} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#0B3D6B] text-white uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-2 w-8"></th>
                <th className="p-2">{isHi ? 'भवन आईडी व नाम' : 'Building ID & Name'}</th>
                <th className="p-2">{isHi ? 'स्थान' : 'Location'}</th>
                <th className="p-2">{isHi ? 'मूल सतही ULPIN' : 'Base Surface ULPIN'}</th>
                <th className="p-2">{isHi ? 'पदचिह्न' : 'Footprint'}</th>
                <th className="p-2">{isHi ? 'क्षेत्रफल (m²)' : 'Area (m²)'}</th>
                <th className="p-2">{isHi ? 'तल टोपोलॉजी' : 'Strata Topology'}</th>
                <th className="p-2 text-right">{isHi ? '3D कार्रवाई' : '3D Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBuildings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">
                    {isHi ? 'खोज और फ़िल्टर मानदंडों से मेल खाने वाला कोई भवन नहीं मिला।' : 'No buildings match your current search and filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredBuildings.map((b) => {
                  const isExpanded = expandedBuildingId === b.id;
                  const hasPending = b.levels.some((l) => l.topology_status === 'Pending');

                  return (
                    <React.Fragment key={b.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="p-2 text-center">
                          <button
                            id={`btn-expand-bldg-${b.id}`}
                            onClick={() => toggleExpand(b.id)}
                            className="text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer"
                            title={isExpanded ? (isHi ? '12 तल समेटें' : 'Collapse 12 Levels') : (isHi ? '12 तल विस्तार करें' : 'Expand 12 Levels')}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-[#0B3D6B]" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="p-2">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="font-mono text-[10px] px-1 py-0.2 bg-slate-100 text-slate-700 border border-slate-200">
                              {b.id}
                            </span>
                            <span>{b.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {isHi ? `सर्वेक्षण ${b.year_surveyed} • 10 तल + 2 बेसमेंट` : `Surveyed ${b.year_surveyed} • 10F + 2B`}
                          </div>
                        </td>
                        <td className="p-2 text-slate-700">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>{b.city}, {b.state}</span>
                          </div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            {b.lat.toFixed(4)}°N, {b.lng.toFixed(4)}°E
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-semibold text-slate-800 select-all">{b.ulpin_base}</span>
                            <CopyUlpinButton
                              ulpin={b.ulpin_base}
                              label="Base ULPIN"
                              variant="icon"
                              size="xs"
                              highContrast={highContrast}
                            />
                          </div>
                        </td>
                        <td className="p-2 capitalize text-slate-700">
                          <span className="px-1 py-0.2 bg-slate-100 border border-slate-200 text-[10px]">
                            {b.footprint_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-2 font-mono text-slate-800">
                          {b.computed_footprint_area} m²
                        </td>
                        <td className="p-2">
                          {hasPending ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              {isHi ? 'ऑडिट प्रतीक्षित' : 'Pending Audit'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {isHi ? '12 सत्यापित' : '12 Verified'}
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-right">
                          <button
                            id={`btn-table-open-${b.id}`}
                            onClick={() => onOpenInExplorer(b.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0B3D6B] hover:bg-[#072744] hover:shadow-xs text-white text-[10px] font-bold transition-all cursor-pointer rounded-xs active:scale-95"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isHi ? '3D देखें' : 'View 3D'}</span>
                          </button>
                        </td>
                      </tr>

                      {/* Expandable sub-table of 12 levels */}
                      {isExpanded && (
                        <tr className="bg-slate-50">
                          <td colSpan={8} className="p-3 border-t border-b border-slate-200">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="text-[10px] font-bold uppercase text-slate-500">
                                  {isHi ? 'ऊर्ध्वाधर स्तर विवरण (12 पंजीकृत इकाइयां):' : 'Strata Breakdown (12 Addressable Units):'}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                  <span>{isHi ? 'मूल भू-अभिलेख:' : 'Base Cadastre:'} {b.ulpin_base}</span>
                                  <CopyUlpinButton
                                    ulpin={b.ulpin_base}
                                    label="Base ULPIN"
                                    variant="icon"
                                    size="xs"
                                    highContrast={highContrast}
                                  />
                                </span>
                              </div>

                              <div className="overflow-x-auto border border-slate-200 bg-white">
                                <table className="w-full text-[10px] text-left">
                                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[9px]">
                                    <tr>
                                      <th className="p-1.5">{isHi ? 'तल कोड' : 'Level Code'}</th>
                                      <th className="p-1.5">{isHi ? 'ऊर्ध्वाधर ULPIN (प्रस्तावित)' : 'Vertical ULPIN (Proposed)'}</th>
                                      <th className="p-1.5">{isHi ? 'वर्गीकरण' : 'Classification'}</th>
                                      <th className="p-1.5">{isHi ? 'आंतरिक क्षेत्रफल' : 'Enclosed Area'}</th>
                                      <th className="p-1.5">{isHi ? 'स्वीकृत उपयोग' : 'Sanctioned Usage'}</th>
                                      <th className="p-1.5">{isHi ? 'ऊंचाई सीमा' : 'Elevation Range'}</th>
                                      <th className="p-1.5">{isHi ? 'टोपोलॉजी स्थिति' : 'Topology Status'}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {b.levels.map((lvl) => (
                                      <tr key={lvl.id} className="hover:bg-slate-50">
                                        <td className="p-1.5 font-mono font-bold text-[#0B3D6B]">
                                          {lvl.level_code} ({lvl.level_number})
                                        </td>
                                        <td className="p-1.5 font-mono select-all font-semibold text-slate-900">
                                          <div className="flex items-center gap-1">
                                            <span>{lvl.vertical_ulpin}</span>
                                            <CopyUlpinButton
                                              ulpin={lvl.vertical_ulpin}
                                              label="Strata ULPIN"
                                              variant="icon"
                                              size="xs"
                                              highContrast={highContrast}
                                            />
                                          </div>
                                        </td>
                                        <td className="p-1.5 capitalize text-slate-600">
                                          {lvl.level_type === 'basement' ? (isHi ? 'बेसमेंट' : 'basement') : (isHi ? 'तल' : 'floor')}
                                        </td>
                                        <td className="p-1.5 font-mono text-slate-800">
                                          {lvl.area_sqm} m²
                                        </td>
                                        <td className="p-1.5 text-slate-700">
                                          {lvl.usage_type}
                                        </td>
                                        <td className="p-1.5 font-mono text-slate-600">
                                          {lvl.elevation_start}m {isHi ? 'से' : 'to'} {lvl.elevation_end}m
                                        </td>
                                        <td className="p-1.5">
                                          {lvl.topology_status === 'Verified' ? (
                                            <span className="text-emerald-700 font-bold">{isHi ? '✓ सत्यापित' : '✓ Verified'}</span>
                                          ) : (
                                            <span className="text-amber-800 font-bold" title={lvl.validation_remarks.join(' ')}>
                                              ⚠️ {isHi ? 'प्रतीक्षित' : 'Pending'} ({lvl.validation_remarks[0]?.slice(0, 30)}...)
                                            </span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};
