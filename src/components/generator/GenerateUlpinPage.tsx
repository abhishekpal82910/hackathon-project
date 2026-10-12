import React, { useState, useEffect, useMemo } from 'react';
import {
  Building,
  BuildingWithLevels,
  BuildingLevel,
  FootprintType,
  FootprintParams,
  UsageType
} from '../../types/cadastre';
import {
  STATE_CODES,
  validateCoordinatesIndia,
  generateBaseUlpin,
  deriveDetailedUlpin,
  UlpinBreakdown,
  generateBuildingId,
  generateRegistrationId,
  computeFootprintArea,
  generateDefaultLevels
} from '../../utils/ulpinGenerator';
import { saveBuilding, findBuildingByUlpin, getAllBuildings } from '../../data/propertyDatabase';
import { DroneSurveyScanner } from './DroneSurveyScanner';
import { GeneratorViewer3D } from './GeneratorViewer3D';
import { VerticalStructureEditor } from './VerticalStructureEditor';
import { TopologyResultsPanel } from './TopologyResultsPanel';
import {
  Sparkles,
  Save,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Building2,
  MapPin,
  Compass,
  Layers,
  FileCheck,
  Info,
  RefreshCw,
  Sliders,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  RotateCcw,
  FileText,
  Database,
  Search,
  X,
  ArrowRight,
  Zap
} from 'lucide-react';

interface GenerateUlpinPageProps {
  onNavigateToExplorer: (buildingId: string) => void;
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const GenerateUlpinPage: React.FC<GenerateUlpinPageProps> = ({
  onNavigateToExplorer,
  highContrast,
  language
}) => {
  const isHi = language === 'hi';

  // Stage 1: Property Information (Initialized empty with placeholders)
  const [propertyName, setPropertyName] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [plotNumber, setPlotNumber] = useState<string>('');
  const [surveyRef, setSurveyRef] = useState<string>('');
  const [ownershipCategory, setOwnershipCategory] = useState<string>('');
  const [surveyYear, setSurveyYear] = useState<number | ''>('');

  // Stage 2: Location Information (Initialized empty with placeholders)
  const [selectedState, setSelectedState] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [subDistrict, setSubDistrict] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [ward, setWard] = useState<string>('');
  const [lat, setLat] = useState<number | ''>('');
  const [lng, setLng] = useState<number | ''>('');
  const [elevationM, setElevationM] = useState<number | ''>('');

  // Stage 3: Drone Survey Image Reference
  const [droneImageName, setDroneImageName] = useState<string>('plot402_orthophoto_survey.tiff');
  const [droneImageUrl, setDroneImageUrl] = useState<string>('sample:bhopal-commercial');

  // Stage 4: Building Information & Geometry
  const [footprintType, setFootprintType] = useState<FootprintType>('l_shaped');
  const [footprintParams, setFootprintParams] = useState<FootprintParams>({
    width: 32,
    depth: 26,
    wingWidth: 16,
    wingLength: 14,
    cutoutWidth: 12,
    cutoutDepth: 10,
    radius: 15
  });
  const [floorHeightM, setFloorHeightM] = useState<number>(3.5);
  const [basementDepthM, setBasementDepthM] = useState<number>(6.5);
  const [totalFloors, setTotalFloors] = useState<number>(8);
  const [totalBasements, setTotalBasements] = useState<number>(2);
  const [colorTint, setColorTint] = useState<string>('#3B82F6');
  const [accentTint, setAccentTint] = useState<string>('#1E40AF');

  // Stage 5: Strata Levels
  const [levels, setLevels] = useState<BuildingLevel[]>([]);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);

  // Status & Registration Feedback
  const [copiedUlpin, setCopiedUlpin] = useState<boolean>(false);
  const [copiedFormatted, setCopiedFormatted] = useState<boolean>(false);
  const [registeredBuilding, setRegisteredBuilding] = useState<BuildingWithLevels | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isDuplicateBlockedModalOpen, setIsDuplicateBlockedModalOpen] = useState<boolean>(false);

  // Duplicate Testing & Stored Database Parcels
  const [allDbBuildings, setAllDbBuildings] = useState<BuildingWithLevels[]>(() => getAllBuildings());
  const [selectedTestBuildingId, setSelectedTestBuildingId] = useState<string>('BLD-01');
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState<boolean>(false);
  const [dbSearchTerm, setDbSearchTerm] = useState<string>('');

  // Sync DB buildings when updated via registration or deletion
  useEffect(() => {
    const handleDbUpdate = () => {
      setAllDbBuildings(getAllBuildings());
    };
    window.addEventListener('cadastre_db_updated', handleDbUpdate);
    return () => window.removeEventListener('cadastre_db_updated', handleDbUpdate);
  }, []);

  // Compute Footprint Area
  const computedArea = useMemo(() => {
    return computeFootprintArea(footprintType, footprintParams);
  }, [footprintType, footprintParams]);

  // Validate Coordinates
  const coordValidation = useMemo(() => {
    if (lat === '' || lng === '') {
      return {
        valid: false,
        message: isHi
          ? 'अक्षांश एवं देशांतर निर्देशांक दर्ज करें'
          : 'Enter Latitude & Longitude coordinates'
      };
    }
    return validateCoordinatesIndia(Number(lat), Number(lng));
  }, [lat, lng, isHi]);

  // Derived Base ULPIN and Official Breakdown - Dynamically reacts to ALL Stage 1 & Stage 2 inputs in real time
  const ulpinDetails = useMemo(() => {
    return deriveDetailedUlpin({
      state: selectedState,
      district,
      subDistrict,
      locality,
      ward,
      plotNumber,
      propertyName,
      propertyType,
      ownershipCategory,
      surveyRef,
      surveyYear,
      lat,
      lng,
      elevationM
    });
  }, [
    selectedState,
    district,
    subDistrict,
    locality,
    ward,
    plotNumber,
    propertyName,
    propertyType,
    ownershipCategory,
    surveyRef,
    surveyYear,
    lat,
    lng,
    elevationM
  ]);

  const baseUlpin = ulpinDetails.ulpin;
  const isAllZeroUlpin = !baseUlpin || /^0+$/.test(baseUlpin);

  // Real-time lookup: check if this 14-digit ULPIN is already registered in the cadastral database
  const existingRegisteredBuilding = useMemo(() => {
    if (isAllZeroUlpin) return undefined;
    return findBuildingByUlpin(baseUlpin);
  }, [baseUlpin, isAllZeroUlpin]);

  const isUlpinAlreadyRegistered = Boolean(existingRegisteredBuilding);

  const filteredBuildings = useMemo(() => {
    if (!dbSearchTerm.trim()) return allDbBuildings;
    const term = dbSearchTerm.toLowerCase();
    return allDbBuildings.filter((b) => {
      return (
        b.name.toLowerCase().includes(term) ||
        b.id.toLowerCase().includes(term) ||
        b.ulpin_base.toLowerCase().includes(term) ||
        (b.legacy_ulpin && b.legacy_ulpin.toLowerCase().includes(term)) ||
        (b.plot_number && b.plot_number.toLowerCase().includes(term)) ||
        (b.district && b.district.toLowerCase().includes(term)) ||
        b.city.toLowerCase().includes(term) ||
        b.state.toLowerCase().includes(term)
      );
    });
  }, [allDbBuildings, dbSearchTerm]);

  const hasRequiredFields = useMemo(() => {
    return Boolean(
      propertyName.trim() &&
      plotNumber.trim() &&
      selectedState &&
      district.trim() &&
      lat !== '' &&
      lng !== '' &&
      coordValidation.valid
    );
  }, [propertyName, plotNumber, selectedState, district, lat, lng, coordValidation.valid]);

  const buildingId = useMemo(() => {
    return generateBuildingId(baseUlpin, 1);
  }, [baseUlpin]);

  // Initialize and regenerate levels whenever macro geometry changes, or update vertical ULPINs when buildingId changes
  useEffect(() => {
    setLevels((prevLevels) => {
      // If floor count matches and user has existing levels, update building_id and vertical_ulpin seamlessly in real time
      if (prevLevels.length > 0 && prevLevels.length === (totalFloors + totalBasements)) {
        return prevLevels.map((lvl) => ({
          ...lvl,
          building_id: buildingId,
          vertical_ulpin: `${buildingId}-${lvl.level_code}`
        }));
      }

      const newLevels = generateDefaultLevels(
        buildingId,
        totalFloors,
        totalBasements,
        floorHeightM,
        basementDepthM,
        computedArea,
        propertyType.includes('Commercial') ? 'Commercial' : 'Residential'
      );
      return newLevels;
    });
  }, [buildingId, totalFloors, totalBasements, floorHeightM, basementDepthM, computedArea, propertyType]);

  // Construct current working building object
  const currentBuilding: BuildingWithLevels = useMemo(() => {
    return {
      id: buildingId,
      ulpin_base: baseUlpin,
      building_id: buildingId,
      name: propertyName.trim() || (isHi ? 'प्रस्तावित भू-अभिलेख संपत्ति' : 'Proposed Cadastre Property'),
      city: district.trim() || (isHi ? 'अघोषित जिला' : 'Unassigned District'),
      state: selectedState || (isHi ? 'अघोषित राज्य' : 'Unassigned State'),
      lat: typeof lat === 'number' ? lat : 23.2332,
      lng: typeof lng === 'number' ? lng : 77.4344,
      footprint_type: footprintType,
      footprint_params: footprintParams,
      floor_height_m: floorHeightM,
      basement_depth_m: basementDepthM,
      total_floors: totalFloors,
      total_basements: totalBasements,
      year_surveyed: typeof surveyYear === 'number' ? surveyYear : new Date().getFullYear(),
      status: 'Digitized',
      color_tint: colorTint,
      accent_tint: accentTint,
      computed_footprint_area: computedArea,
      description: `3D Cadastral Property registration in ${locality || 'Local Area'}, ${district || 'District'} (${selectedState || 'State'}). Verified with Bhu-Aadhaar ULPIN framework and drone survey reference.`,
      property_type: propertyType || 'Commercial Complex',
      plot_number: plotNumber || '',
      survey_reference: surveyRef || '',
      ownership_category: ownershipCategory || 'Private Freehold',
      district: district || '',
      sub_district: subDistrict || '',
      locality: locality || '',
      ward: ward || '',
      elevation_m: typeof elevationM === 'number' ? elevationM : 500,
      parcel_area_sqm: Math.round(computedArea * 1.35),
      crs: 'EPSG:7755 (WGS84 / India Zone 1)',
      drone_image_url: droneImageUrl,
      drone_image_name: droneImageName,
      is_custom_registered: true,
      levels
    };
  }, [
    buildingId,
    baseUlpin,
    propertyName,
    district,
    selectedState,
    lat,
    lng,
    footprintType,
    footprintParams,
    floorHeightM,
    basementDepthM,
    totalFloors,
    totalBasements,
    surveyYear,
    colorTint,
    accentTint,
    computedArea,
    locality,
    propertyType,
    plotNumber,
    surveyRef,
    ownershipCategory,
    subDistrict,
    ward,
    elevationM,
    droneImageUrl,
    droneImageName,
    levels,
    isHi
  ]);

  // Handlers for vertical structure editor
  const handleUpdateLevel = (index: number, updated: Partial<BuildingLevel>) => {
    setLevels((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleAddFloor = () => {
    const currentMaxFloor = levels
      .filter((l) => l.level_type === 'floor')
      .reduce((max, l) => Math.max(max, parseInt(l.level_number) || 0), 0);
    const newFloorNo = currentMaxFloor + 1;
    const levelCode = `F${newFloorNo.toString().padStart(2, '0')}`;
    const startElev = (newFloorNo - 1) * floorHeightM;
    const endElev = newFloorNo * floorHeightM;

    const newLevel: BuildingLevel = {
      id: `${buildingId}-${levelCode}`,
      building_id: buildingId,
      level_type: 'floor',
      level_number: `${newFloorNo}`,
      level_code: levelCode,
      vertical_ulpin: `${buildingId}-${levelCode}`,
      area_sqm: Math.round(computedArea * 0.95),
      usage_type: 'Commercial',
      owner_name: `Allotment Record Unit ${newFloorNo}01`,
      elevation_range_m: `${startElev.toFixed(2)},${endElev.toFixed(2)}`,
      elevation_start: parseFloat(startElev.toFixed(2)),
      elevation_end: parseFloat(endElev.toFixed(2)),
      topology_status: 'Verified',
      validation_remarks: ['Vertical envelope conforms to approved zoning limit'],
      last_updated: new Date().toISOString().split('T')[0]
    };

    setLevels((prev) => [...prev, newLevel]);
    setTotalFloors((f) => f + 1);
  };

  const handleRemoveFloor = (index: number) => {
    setLevels((prev) => {
      const copy = prev.filter((_, idx) => idx !== index);
      const floorCount = copy.filter((l) => l.level_type === 'floor').length;
      setTotalFloors(floorCount);
      return copy;
    });
  };

  // Quick Preset Selector
  const applyPreset = (preset: 'commercial' | 'residential' | 'tower') => {
    if (preset === 'commercial') {
      setPropertyName('Narmada Commercial Complex');
      setPropertyType('Commercial Complex');
      setPlotNumber('402/B');
      setOwnershipCategory('Private Freehold');
      setSurveyRef('REV-MP-2026-8812');
      setSurveyYear(2026);
      setSelectedState('Madhya Pradesh');
      setDistrict('Bhopal');
      setSubDistrict('Huzur');
      setLocality('Arera Hills');
      setWard('Ward No. 44');
      setElevationM(505);
      setLat(23.2332);
      setLng(77.4344);
      setFootprintType('l_shaped');
      setFootprintParams({ width: 34, depth: 28, wingWidth: 18, wingLength: 15 });
      setTotalFloors(7);
      setTotalBasements(2);
      setColorTint('#3B82F6');
    } else if (preset === 'residential') {
      setPropertyName('Aura Heights Luxury Apartments');
      setPropertyType('Multi-Storey Residential');
      setPlotNumber('108/A');
      setOwnershipCategory('Private Freehold');
      setSurveyRef('REV-MH-2026-4421');
      setSurveyYear(2026);
      setSelectedState('Maharashtra');
      setDistrict('Pune');
      setSubDistrict('Haveli');
      setLocality('Koregaon Park');
      setWard('Ward No. 12');
      setElevationM(560);
      setLat(18.5362);
      setLng(73.8958);
      setFootprintType('u_shaped');
      setFootprintParams({ width: 36, depth: 24, cutoutWidth: 14, cutoutDepth: 12 });
      setTotalFloors(10);
      setTotalBasements(1);
      setColorTint('#10B981');
    } else {
      setPropertyName('Madhya Pradesh IT Innovation Hub');
      setPropertyType('Institutional / IT Park');
      setPlotNumber('501/IT');
      setOwnershipCategory('Public-Private Partnership (PPP)');
      setSurveyRef('REV-MP-2026-9901');
      setSurveyYear(2026);
      setSelectedState('Madhya Pradesh');
      setDistrict('Indore');
      setSubDistrict('Indore City');
      setLocality('Super Corridor');
      setWard('Ward No. 28');
      setElevationM(553);
      setLat(22.7533);
      setLng(75.8937);
      setFootprintType('plus_shaped');
      setFootprintParams({ width: 32, depth: 32, wingWidth: 12 });
      setTotalFloors(12);
      setTotalBasements(2);
      setColorTint('#8B5CF6');
    }
  };

  const handleResetForm = () => {
    setPropertyName('');
    setPropertyType('');
    setPlotNumber('');
    setOwnershipCategory('');
    setSurveyRef('');
    setSurveyYear('');
    setSelectedState('');
    setDistrict('');
    setSubDistrict('');
    setLocality('');
    setWard('');
    setLat('');
    setLng('');
    setElevationM('');
  };

  /**
   * Loads the exact cadastral records of an existing database building
   * into all form fields so the user can test duplicate detection in real time.
   */
  const handleLoadStoredBuilding = (buildingToLoad: BuildingWithLevels) => {
    setPropertyName(buildingToLoad.name);
    setPropertyType(buildingToLoad.property_type || 'Commercial Complex');
    setPlotNumber(buildingToLoad.plot_number || '101/A');
    setOwnershipCategory(buildingToLoad.ownership_category || 'State Government Public Property');
    setSurveyRef(buildingToLoad.survey_reference || '');
    setSurveyYear(buildingToLoad.year_surveyed || 2023);
    setSelectedState(buildingToLoad.state);
    setDistrict(buildingToLoad.district || buildingToLoad.city);
    setSubDistrict(buildingToLoad.sub_district || 'Huzur');
    setLocality(buildingToLoad.locality || 'Civil Lines');
    setWard(buildingToLoad.ward || 'Ward 01');
    setLat(buildingToLoad.lat);
    setLng(buildingToLoad.lng);
    setElevationM(buildingToLoad.elevation_m || 500);

    if (buildingToLoad.footprint_type) {
      setFootprintType(buildingToLoad.footprint_type);
    }
    if (buildingToLoad.footprint_params) {
      setFootprintParams({
        width: buildingToLoad.footprint_params.width || 34,
        depth: buildingToLoad.footprint_params.depth || 24,
        radius: buildingToLoad.footprint_params.radius || 15,
        wingWidth: buildingToLoad.footprint_params.wingWidth || 15,
        wingLength: buildingToLoad.footprint_params.wingLength || 18,
        cutoutWidth: buildingToLoad.footprint_params.cutoutWidth || 16,
        cutoutDepth: buildingToLoad.footprint_params.cutoutDepth || 18
      });
    }
    if (buildingToLoad.floor_height_m) setFloorHeightM(buildingToLoad.floor_height_m);
    if (buildingToLoad.basement_depth_m) setBasementDepthM(buildingToLoad.basement_depth_m);
    if (buildingToLoad.total_floors) setTotalFloors(buildingToLoad.total_floors);
    if (buildingToLoad.total_basements) setTotalBasements(buildingToLoad.total_basements);
    if (buildingToLoad.color_tint) setColorTint(buildingToLoad.color_tint);
    if (buildingToLoad.accent_tint) setAccentTint(buildingToLoad.accent_tint);
  };

  // Copy ULPIN
  const handleCopyUlpin = () => {
    navigator.clipboard.writeText(baseUlpin);
    setCopiedUlpin(true);
    setTimeout(() => setCopiedUlpin(false), 2000);
  };

  const handleCopyFormattedUlpin = () => {
    navigator.clipboard.writeText(ulpinDetails.formattedUlpin);
    setCopiedFormatted(true);
    setTimeout(() => setCopiedFormatted(false), 2000);
  };

  // Save / Register Property
  const handleRegisterProperty = () => {
    if (!hasRequiredFields) {
      return;
    }

    // If this ULPIN is already registered to another parcel in the database, prevent duplicate registration
    if (isUlpinAlreadyRegistered && existingRegisteredBuilding) {
      setIsDuplicateBlockedModalOpen(true);
      return;
    }

    const registrationId = generateRegistrationId();
    const finalBuilding: BuildingWithLevels = {
      ...currentBuilding,
      registration_id: registrationId,
      created_at: new Date().toISOString()
    };

    const saved = saveBuilding(finalBuilding);
    if (!saved) {
      setIsDuplicateBlockedModalOpen(true);
      return;
    }

    setRegisteredBuilding(finalBuilding);
    setIsSuccessModalOpen(true);
  };

  return (
    <div id="generate-ulpin-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header & Intro */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-[#0B3D6B]">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {isHi ? 'राष्ट्रीय भू-अभिलेख सुविधा' : 'National Cadastre Feature'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {isHi ? 'भू-आधार 14-अंकीय मानक' : 'Bhu-Aadhaar 14-Digit Standard'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 font-serif">
            {isHi ? 'ULPIN जनरेटर एवं 3D संपत्ति निर्माता' : 'Generate ULPIN & 3D Property Generator'}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {isHi
              ? 'एक निर्धारक विशिष्ट भूखंड पहचान संख्या (ULPIN) तैयार करें, पैरामीट्रिक 3D मासिंग परिभाषित करें, बहु-स्तरीय तल कॉन्फ़िगर करें, और नियम-आधारित भू-अभिलेख टोपोलॉजी सत्यापन निष्पादित करें।'
              : 'Synthesize a deterministic Unique Land Parcel Identification Number (ULPIN), define parametric 3D massing, configure multi-strata levels, and execute rule-based cadastral topology validation.'}
          </p>
        </div>

        {/* Action Controls & Preset Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-xs font-medium text-slate-500 mr-1">
            {isHi ? 'प्रीसेट लोड करें:' : 'Load Presets:'}
          </div>
          <button
            type="button"
            id="preset-commercial-btn"
            onClick={() => applyPreset('commercial')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            {isHi ? 'व्यावसायिक परिसर' : 'Commercial Complex'}
          </button>
          <button
            type="button"
            id="preset-residential-btn"
            onClick={() => applyPreset('residential')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            {isHi ? 'आवासीय टॉवर' : 'Residential Tower'}
          </button>
          <button
            type="button"
            id="preset-it-park-btn"
            onClick={() => applyPreset('tower')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            {isHi ? 'आईटी इनोवेशन हब' : 'IT Innovation Hub'}
          </button>
          <button
            type="button"
            id="reset-form-btn"
            onClick={handleResetForm}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
            title="Reset all inputs back to empty placeholders"
          >
            <RotateCcw className="w-3 h-3" />
            {isHi ? 'फ़ॉर्म खाली करें' : 'Clear Form'}
          </button>
        </div>
      </div>

      {/* Testing & Duplicate Prevention Panel */}
      <div
        id="duplicate-prevention-testing-panel"
        className={`rounded-2xl border p-4 transition-all shadow-sm ${
          isUlpinAlreadyRegistered
            ? 'bg-amber-50/80 border-amber-300'
            : 'bg-slate-50/90 border-slate-200'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`p-1.5 rounded-lg ${isUlpinAlreadyRegistered ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-[#0B3D6B]'}`}>
                <Database className="w-4 h-4" />
              </span>
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                {isHi ? 'डेटाबेस परीक्षण: डुप्लिकेट ULPIN परिहार प्रणाली' : 'Database Testing: Duplicate ULPIN Prevention Engine'}
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  {allDbBuildings.length} {isHi ? 'पंजीकृत भू-खंड' : 'Parcels in Database'}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl">
              {isHi
                ? 'अपने डेटाबेस में पहले से संग्रहीत किसी भी संपत्ति को चुनें और फ़ॉर्म में लोड करके देखें कि डुप्लिकेट पंजीकरण कैसे स्वचालित रूप से अवरुद्ध होता है।'
                : 'Select any property already stored in your database and load it into the form to verify that duplicate registration is automatically detected and blocked.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              id="test-building-selector"
              value={selectedTestBuildingId}
              onChange={(e) => setSelectedTestBuildingId(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-[#0B3D6B] focus:border-[#0B3D6B] shadow-2xs max-w-[260px] sm:max-w-xs cursor-pointer"
            >
              {allDbBuildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id}: {b.name} ({b.district || b.city}, {b.state})
                </option>
              ))}
            </select>

            <button
              type="button"
              id="load-stored-property-btn"
              onClick={() => {
                const targetBuilding = allDbBuildings.find((b) => b.id === selectedTestBuildingId);
                if (targetBuilding) {
                  handleLoadStoredBuilding(targetBuilding);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B3D6B] hover:bg-[#082C4D] text-white font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {isHi ? 'संग्रहीत संपत्ति लोड करें' : 'Load Stored Property'}
            </button>

            <button
              type="button"
              id="open-reference-table-btn"
              onClick={() => setIsReferenceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              {isHi ? 'पंजीकृत मान तालिका' : 'View Stored Values Table'}
            </button>
          </div>
        </div>

        {/* Real-time Conflict Alert Status */}
        {isUlpinAlreadyRegistered && existingRegisteredBuilding && (
          <div
            id="realtime-duplicate-alert"
            className="mt-3 p-3.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn"
          >
            <div className="flex items-start sm:items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="font-bold text-amber-900">
                  {isHi
                    ? `⚠️ टकराव का पता चला: ULPIN ${baseUlpin} पहले से पंजीकृत है!`
                    : `⚠️ Cadastral Conflict Detected: ULPIN ${baseUlpin} is ALREADY REGISTERED!`}
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  {isHi
                    ? `यह ULPIN "${existingRegisteredBuilding.name}" (${existingRegisteredBuilding.id}, ${existingRegisteredBuilding.district || existingRegisteredBuilding.city}, ${existingRegisteredBuilding.state}) को आवंटित है। पंजीकरण अवरुद्ध है।`
                    : `This ULPIN is currently allocated to "${existingRegisteredBuilding.name}" (${existingRegisteredBuilding.id}, ${existingRegisteredBuilding.district || existingRegisteredBuilding.city}, ${existingRegisteredBuilding.state}). Registration is blocked.`}
                </p>
              </div>
            </div>

            <div className="sm:self-center shrink-0 bg-white/80 border border-amber-300 px-3 py-1.5 rounded-lg text-[11px] font-medium text-amber-900">
              <span className="font-semibold text-amber-950">{isHi ? 'हल करने के लिए:' : 'To Resolve Conflict:'}</span>{' '}
              {isHi
                ? 'चरण 1 में खसरा/प्लॉट नंबर बदलें (उदा. 101/A से 101/B) या निर्देशांक थोड़ा बदलें।'
                : 'Modify Khasra / Plot in Stage 1 (e.g. 101/A to 101/B) or coordinates.'}
            </div>
          </div>
        )}

        {!isUlpinAlreadyRegistered && hasRequiredFields && (
          <div
            id="realtime-available-alert"
            className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              {isHi
                ? `✓ ULPIN ${baseUlpin} डेटाबेस में उपलब्ध है (कोई डुप्लिकेट नहीं)। आप इस संपत्ति को पंजीकृत कर सकते हैं।`
                : `✓ ULPIN ${baseUlpin} is unallocated and unique in database. This parcel is eligible for registration.`}
            </span>
          </div>
        )}
      </div>

      {/* Mobile Section Fast Navigation (visible on mobile / tablet < lg) */}
      <div 
        id="mobile-generator-nav"
        className="lg:hidden flex flex-wrap items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs gap-2"
      >
        <span className="text-xs font-semibold text-slate-700 pl-1 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#0B3D6B]" />
          {isHi ? 'त्वरित मानचित्र दृश्य:' : 'Quick Map Views:'}
        </span>
        <div className="flex items-center gap-1.5">
          <a
            href="#stage-3-drone-survey"
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 text-[#0B3D6B] border border-blue-200 whitespace-nowrap hover:bg-blue-100 transition-colors"
          >
            {isHi ? '🗺️ ड्रोन सर्वेक्षण मानचित्र (चरण 3)' : '🗺️ Drone Survey Map (Stage 3)'}
          </a>
          <a
            href="#stage-7-3d-massing"
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 whitespace-nowrap hover:bg-indigo-100 transition-colors"
          >
            {isHi ? '🏢 3D मासिंग (चरण 7)' : '🏢 3D Massing (Stage 7)'}
          </a>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Stages (Stages 1, 2, 3, 4) - Col 7 */}
        <div className="lg:col-span-7 space-y-6">
          {/* STAGE 1: Property Information */}
          <div
            id="stage-1-property-info"
            className={`rounded-xl border p-5 transition-all ${
              highContrast
                ? 'bg-neutral-900 border-yellow-400 text-white'
                : 'bg-white border-slate-200 shadow-sm text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <span className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B]">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-[#0B3D6B]">
                  {isHi ? 'चरण 1: संपत्ति एवं पंजीयन मेटाडेटा' : 'Stage 1: Property & Registry Metadata'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHi
                    ? 'कानूनी भू-अभिलेख पहचान और भूमि रजिस्ट्री रिकॉर्ड विवरण'
                    : 'Legal cadastral identification and land registry record details'}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'संपत्ति का नाम / समूह' : 'Property Name / Assembly'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="property-name-input"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B] focus:border-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. नर्मदा व्यावसायिक परिसर' : 'e.g. Narmada Commercial Complex'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'संपत्ति वर्गीकरण' : 'Property Classification'}
                </label>
                <select
                  id="property-type-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                >
                  <option value="">
                    {isHi ? '-- संपत्ति वर्गीकरण चुनें --' : '-- Select Property Classification --'}
                  </option>
                  <option value="Commercial Complex">
                    {isHi ? 'व्यावसायिक परिसर' : 'Commercial Complex'}
                  </option>
                  <option value="Multi-Storey Residential">
                    {isHi ? 'बहु-मंजिला आवासीय' : 'Multi-Storey Residential'}
                  </option>
                  <option value="Mixed Use (Commercial + Residential)">
                    {isHi ? 'मिश्रित उपयोग (व्यावसायिक + आवासीय)' : 'Mixed Use (Commercial + Residential)'}
                  </option>
                  <option value="Institutional / IT Park">
                    {isHi ? 'संस्थागत / आईटी पार्क' : 'Institutional / IT Park'}
                  </option>
                  <option value="Government Administrative Office">
                    {isHi ? 'सरकारी प्रशासनिक कार्यालय' : 'Government Administrative Office'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'प्लॉट / खसरा संख्या' : 'Plot / Khasra Number'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="plot-number-input"
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. 402/B या खसरा 119' : 'e.g. 402/B or Kh-119'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'स्वामित्व श्रेणी' : 'Ownership Category'}
                </label>
                <select
                  id="ownership-category-select"
                  value={ownershipCategory}
                  onChange={(e) => setOwnershipCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                >
                  <option value="">
                    {isHi ? '-- स्वामित्व श्रेणी चुनें --' : '-- Select Ownership Category --'}
                  </option>
                  <option value="Private Freehold">
                    {isHi ? 'निजी फ्रीहोल्ड' : 'Private Freehold'}
                  </option>
                  <option value="State Revenue Leasehold">
                    {isHi ? 'राज्य राजस्व पट्टा' : 'State Revenue Leasehold'}
                  </option>
                  <option value="Municipal Corporation">
                    {isHi ? 'नगर निगम' : 'Municipal Corporation'}
                  </option>
                  <option value="Public-Private Partnership (PPP)">
                    {isHi ? 'सार्वजनिक-निजी भागीदारी (PPP)' : 'Public-Private Partnership (PPP)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'सर्वेक्षण संदर्भ / केस फ़ाइल' : 'Survey Reference / Case File'}
                </label>
                <input
                  type="text"
                  id="survey-ref-input"
                  value={surveyRef}
                  onChange={(e) => setSurveyRef(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. REV-MP-2026-8812' : 'e.g. REV-MP-2026-8812'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'सर्वेक्षण वर्ष' : 'Survey Year'}
                </label>
                <input
                  type="number"
                  id="survey-year-input"
                  min={1990}
                  max={2030}
                  value={surveyYear}
                  onChange={(e) => setSurveyYear(e.target.value === '' ? '' : parseInt(e.target.value) || '')}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. 2026' : 'e.g. 2026'}
                />
              </div>
            </div>
          </div>

          {/* STAGE 2: Location & Parcel Information */}
          <div
            id="stage-2-location-info"
            className={`rounded-xl border p-5 transition-all ${
              highContrast
                ? 'bg-neutral-900 border-yellow-400 text-white'
                : 'bg-white border-slate-200 shadow-sm text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <span className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B]">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-[#0B3D6B]">
                  {isHi ? 'चरण 2: प्रशासनिक पदानुक्रम एवं निर्देशांक' : 'Stage 2: Administrative Hierarchy & Coordinates'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHi
                    ? 'भारतीय राष्ट्रीय भूगणितीय डेटम के अनुसार सत्यापित स्थानिक सीमा परिभाषाएं'
                    : 'Spatial boundary definitions verified against Indian national geodetic datum'}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'राज्य' : 'State'} <span className="text-red-500">*</span>
                </label>
                <select
                  id="state-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                >
                  <option value="">
                    {isHi ? '-- राज्य चुनें --' : '-- Select State --'}
                  </option>
                  {Object.keys(STATE_CODES).map((st) => (
                    <option key={st} value={st}>
                      {st} ({STATE_CODES[st].alpha})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'जिला' : 'District'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="district-input"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. भोपाल' : 'e.g. Bhopal'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'तहसील / उप-जिला' : 'Tehsil / Sub-District'}
                </label>
                <input
                  type="text"
                  id="subdistrict-input"
                  value={subDistrict}
                  onChange={(e) => setSubDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. हुजूर' : 'e.g. Huzur'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'क्षेत्र / कॉलोनी' : 'Locality / Colony'}
                </label>
                <input
                  type="text"
                  id="locality-input"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. अरेरा कॉलोनी' : 'e.g. Arera Colony'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'वार्ड संख्या' : 'Ward Number'}
                </label>
                <input
                  type="text"
                  id="ward-input"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. वार्ड 45' : 'e.g. Ward 45'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'भू-तल ऊंचाई डेटम (m)' : 'Ground Elevation Datum (m)'}
                </label>
                <input
                  type="number"
                  id="elevation-input"
                  value={elevationM}
                  onChange={(e) => setElevationM(e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. 505' : 'e.g. 505'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'अक्षांश (° N)' : 'Latitude (° N)'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  id="latitude-input"
                  value={lat}
                  onChange={(e) => setLat(e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 font-mono focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. 23.2332' : 'e.g. 23.2332'}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'देशांतर (° E)' : 'Longitude (° E)'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  id="longitude-input"
                  value={lng}
                  onChange={(e) => setLng(e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                  className="w-full px-3 py-2 text-xs rounded-md border border-slate-300 font-mono focus:ring-1 focus:ring-[#0B3D6B]"
                  placeholder={isHi ? 'उदा. 77.4344' : 'e.g. 77.4344'}
                />
              </div>

              {/* Status Indicator */}
              <div className="flex flex-col justify-end">
                <div
                  className={`px-3 py-2 rounded-md border text-[11px] font-mono flex items-center gap-1.5 ${
                    lat === '' || lng === ''
                      ? 'bg-slate-50 text-slate-600 border-slate-200'
                      : coordValidation.valid
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-red-50 text-red-900 border-red-200'
                  }`}
                >
                  {lat === '' || lng === '' ? (
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  ) : coordValidation.valid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                  )}
                  <span className="truncate">
                    {lat === '' || lng === ''
                      ? (isHi ? 'निर्देशांक दर्ज करें (उदा. 23.2332, 77.4344)' : 'Enter coordinates (e.g. 23.2332, 77.4344)')
                      : coordValidation.valid
                      ? (isHi ? 'निर्देशांक स्थिति: मान्य भारतीय क्षेत्र' : 'Coordinate status: Valid Indian territory')
                      : coordValidation.message}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 3: Drone / Aerial Image Reference */}
          <div id="stage-3-drone-survey" className="scroll-mt-6">
            <DroneSurveyScanner
              onImageSelected={(url, name) => {
                setDroneImageUrl(url);
                setDroneImageName(name);
              }}
              selectedImageUrl={droneImageUrl}
              highContrast={highContrast}
              footprintWidth={footprintParams.width}
              footprintDepth={footprintParams.depth}
              language={language}
            />
          </div>

          {/* STAGE 4: Building Information & Parametric Geometry */}
          <div
            id="stage-4-building-geometry"
            className={`rounded-xl border p-5 transition-all ${
              highContrast
                ? 'bg-neutral-900 border-yellow-400 text-white'
                : 'bg-white border-slate-200 shadow-sm text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <span className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B]">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-[#0B3D6B]">
                  {isHi ? 'चरण 4: भवन जानकारी एवं पैरामीट्रिक ज्यामिति' : 'Stage 4: Building Information & Parametric Geometry'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHi
                    ? 'वास्तुकला पदचिह्न आकार, आयाम और तल ऊंचाई कॉन्फ़िगर करें'
                    : 'Configure architectural footprint shape, dimensions, and floor elevations'}
                </p>
              </div>
            </div>

            {/* Shape Selector */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                {isHi ? 'भू-अभिलेख पदचिह्न ज्यामिति प्रकार' : 'Cadastral Footprint Geometry Archetype'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {(['rectangular', 'l_shaped', 'u_shaped', 'plus_shaped', 'cylindrical'] as FootprintType[]).map((shape) => {
                  const shapeLabels: Record<FootprintType, { en: string; hi: string }> = {
                    rectangular: { en: 'rectangular', hi: 'आयताकार' },
                    l_shaped: { en: 'L shaped', hi: 'L-आकार' },
                    u_shaped: { en: 'U shaped', hi: 'U-आकार' },
                    plus_shaped: { en: 'plus shaped', hi: 'प्लस (+)' },
                    cylindrical: { en: 'cylindrical', hi: 'बेलनाकार' }
                  };
                  return (
                    <button
                      key={shape}
                      type="button"
                      id={`shape-btn-${shape}`}
                      onClick={() => setFootprintType(shape)}
                      className={`py-2 px-2.5 rounded-lg border font-medium capitalize text-center transition-all cursor-pointer ${
                        footprintType === shape
                          ? 'bg-[#0B3D6B] text-white border-[#0B3D6B] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {isHi ? shapeLabels[shape].hi : shapeLabels[shape].en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimensions Grid */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'चौड़ाई (m)' : 'Width (m)'}
                </label>
                <input
                  type="number"
                  min={10}
                  max={120}
                  value={footprintParams.width}
                  onChange={(e) =>
                    setFootprintParams((prev) => ({
                      ...prev,
                      width: Math.max(10, parseInt(e.target.value) || 20)
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'गहराई (m)' : 'Depth (m)'}
                </label>
                <input
                  type="number"
                  min={10}
                  max={120}
                  value={footprintParams.depth}
                  onChange={(e) =>
                    setFootprintParams((prev) => ({
                      ...prev,
                      depth: Math.max(10, parseInt(e.target.value) || 20)
                    }))
                  }
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'तल ऊंचाई (m)' : 'Floor Height (m)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={2.6}
                  max={6.0}
                  value={floorHeightM}
                  onChange={(e) => setFloorHeightM(parseFloat(e.target.value) || 3.2)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'बेसमेंट गहराई (m)' : 'Basement Depth (m)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={2.8}
                  max={15.0}
                  value={basementDepthM}
                  onChange={(e) => setBasementDepthM(parseFloat(e.target.value) || 3.5)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'तल (भू-तल से ऊपर)' : 'Floors (Above Ground)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={35}
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isHi ? 'बेसमेंट (भू-तल से नीचे)' : 'Basements (Sub-Grade)'}
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={totalBasements}
                  onChange={(e) => setTotalBasements(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 font-mono"
                />
              </div>

              <div className="col-span-2 flex items-center justify-between p-2.5 rounded bg-blue-50/70 border border-blue-200">
                <div>
                  <span className="text-[11px] text-blue-900 font-semibold block">
                    {isHi ? 'परिकलित पदचिह्न क्षेत्रफल:' : 'Calculated Footprint Area:'}
                  </span>
                  <span className="text-base font-bold text-[#0B3D6B] font-mono">
                    {computedArea.toLocaleString()} {isHi ? 'वर्ग मीटर' : 'sq.m'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-blue-900 font-semibold block">
                    {isHi ? 'कुल ऊंचाई:' : 'Total Height:'}
                  </span>
                  <span className="text-sm font-bold text-[#0B3D6B] font-mono">
                    +{(totalFloors * floorHeightM).toFixed(1)}m / -{basementDepthM.toFixed(1)}m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 5: Vertical Strata Editor */}
          <VerticalStructureEditor
            levels={levels}
            onUpdateLevel={handleUpdateLevel}
            onAddFloor={handleAddFloor}
            onRemoveFloor={handleRemoveFloor}
            baseFootprintArea={computedArea}
            highContrast={highContrast}
            selectedLevelId={selectedLevelId}
            onSelectLevel={(lvl) => setSelectedLevelId(lvl.id)}
            language={language}
          />
        </div>

        {/* RIGHT COLUMN: Real-Time Derivations, 3D Massing & Topology (Stages 6, 7, 8) - Col 5 */}
        <div className="lg:col-span-5 space-y-6">
          {/* STAGE 6: Deterministic Prototype ULPIN Generator */}
          <div
            id="stage-6-ulpin-generator"
            className={`rounded-xl border p-5 transition-all shadow-sm ${
              highContrast
                ? 'bg-neutral-900 border-yellow-400 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header with Live Sync Telemetry Beacon */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B]">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-[#0B3D6B]">
                    {isHi ? 'चरण 6: आधिकारिक 14-अंकीय ULPIN व्युत्पत्ति (भू-आधार)' : 'Stage 6: Official 14-Digit ULPIN Derivation (Bhu-Aadhaar)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHi
                      ? 'भूमि संसाधन विभाग (DoLR) एवं NIC द्वारा परिभाषित राष्ट्रीय मानक'
                      : 'National standard defined by Department of Land Resources (DoLR) & NIC'}
                  </p>
                </div>
              </div>

              {/* Real-time synchronization and database uniqueness status beacon */}
              {isUlpinAlreadyRegistered ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-bold shadow-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{isHi ? 'डेटाबेस में पहले से मौजूद (डुप्लिकेट ULPIN)' : 'Already in Cadastre (Duplicate ULPIN)'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{isHi ? 'अद्वितीय एवं पंजीकरण हेतु उपलब्ध' : 'Unique & Available for Registration'}</span>
                </div>
              )}
            </div>

            {/* Main ULPIN Output Display Box */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-[#0B3D6B]/25 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mb-2">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-[#0B3D6B]">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isHi ? 'आधिकारिक 14-अंकीय भू-खंड ULPIN मानक' : 'Official 14-Digit Parcel ULPIN Standard'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="copy-formatted-ulpin-btn"
                    onClick={handleCopyFormattedUlpin}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    title="Copy segmented ULPIN (SS-DD-TTT-VVV-PPPP)"
                  >
                    {copiedFormatted ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedFormatted
                      ? (isHi ? 'प्रारूपित कॉपी हुआ!' : 'Copied Formatted!')
                      : (isHi ? 'प्रारूपित कॉपी करें' : 'Copy Formatted')}
                  </button>
                  <button
                    type="button"
                    id="copy-base-ulpin-btn"
                    onClick={handleCopyUlpin}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded border border-[#0B3D6B] bg-[#0B3D6B] text-white hover:bg-[#0B3D6B]/90 transition-colors shadow-2xs cursor-pointer"
                    title="Copy 14-digit raw ULPIN"
                  >
                    {copiedUlpin ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                    {copiedUlpin
                      ? (isHi ? '14-अंक कॉपी हुए!' : 'Copied 14-Digit!')
                      : (isHi ? '14-अंक कॉपी करें' : 'Copy 14-Digit')}
                  </button>
                </div>
              </div>

              {/* Formatted 5-Segment Visual Hero Block */}
              <div className="mt-1 p-2.5 rounded-lg bg-white border border-slate-200 shadow-inner flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 font-mono font-bold text-center select-all">
                {/* Segment 1: State */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-sans font-normal uppercase text-[9px]">
                    {isHi ? 'राज्य' : 'State'}
                  </span>
                  <span className="px-2 py-1 rounded bg-blue-100/80 text-blue-900 text-lg sm:text-xl border border-blue-200">
                    {ulpinDetails.stateCode}
                  </span>
                </div>
                <span className="text-slate-300 text-xl font-light self-end pb-1.5">-</span>

                {/* Segment 2: District */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-sans font-normal uppercase text-[9px]">
                    {isHi ? 'जिला' : 'District'}
                  </span>
                  <span className="px-2 py-1 rounded bg-indigo-100/80 text-indigo-900 text-lg sm:text-xl border border-indigo-200">
                    {ulpinDetails.districtCode}
                  </span>
                </div>
                <span className="text-slate-300 text-xl font-light self-end pb-1.5">-</span>

                {/* Segment 3: Tehsil */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-sans font-normal uppercase text-[9px]">
                    {isHi ? 'तहसील' : 'Tehsil'}
                  </span>
                  <span className="px-2 py-1 rounded bg-amber-100/80 text-amber-900 text-lg sm:text-xl border border-amber-200">
                    {ulpinDetails.tehsilCode}
                  </span>
                </div>
                <span className="text-slate-300 text-xl font-light self-end pb-1.5">-</span>

                {/* Segment 4: Village / Colony */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-sans font-normal uppercase text-[9px]">
                    {isHi ? 'कॉलोनी/वार्ड' : 'Colony/Ward'}
                  </span>
                  <span className="px-2 py-1 rounded bg-emerald-100/80 text-emerald-900 text-lg sm:text-xl border border-emerald-200">
                    {ulpinDetails.villageCode}
                  </span>
                </div>
                <span className="text-slate-300 text-xl font-light self-end pb-1.5">-</span>

                {/* Segment 5: Khasra / Plot */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-400 font-sans font-normal uppercase text-[9px]">
                    {isHi ? 'खसरा / प्लॉट' : 'Khasra / Plot'}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-purple-100/80 text-purple-900 text-lg sm:text-xl border border-purple-200">
                    {ulpinDetails.khasraCode}
                  </span>
                </div>
              </div>

              {/* Raw 14-Digit Compact Value Display */}
              <div className="mt-2.5 flex items-center justify-between text-xs px-2 py-1.5 rounded bg-slate-100/80 border border-slate-200 text-slate-700 font-mono">
                <span className="text-slate-500 font-sans font-medium text-[11px]">
                  {isHi ? 'मूल 14-अंकीय भू-आधार:' : 'Raw 14-Digit Bhu-Aadhaar:'}
                </span>
                <span className="font-bold text-[#0B3D6B] tracking-wider text-sm">{baseUlpin}</span>
              </div>

              {/* Cadastre Database Duplicate Collision Alert Banner */}
              {isUlpinAlreadyRegistered && existingRegisteredBuilding ? (
                <div
                  id="ulpin-already-registered-alert"
                  className="mt-3 p-3.5 rounded-xl border-2 border-amber-400 bg-amber-50/95 text-amber-950 shadow-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-200/70 text-amber-800 mt-0.5 shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1 text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                          {isHi ? 'यह ULPIN डेटाबेस में पहले से पंजीकृत है!' : 'This ULPIN is Already Registered in Database!'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                          {isHi ? 'पंजीकृत भू-खंड' : 'Already Registered'}
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed text-xs">
                        {isHi ? (
                          <>
                            14-अंकीय भू-आधार{' '}
                            <strong className="font-mono text-[#0B3D6B] font-bold bg-amber-100/80 px-1 py-0.5 rounded">
                              {baseUlpin}
                            </strong>{' '}
                            पहले से ही राष्ट्रीय कैडस्ट्रे में{' '}
                            <strong className="text-slate-900 font-bold">{existingRegisteredBuilding.name}</strong>{' '}
                            ({existingRegisteredBuilding.city || existingRegisteredBuilding.district}, {existingRegisteredBuilding.state} • आईडी:{' '}
                            <span className="font-mono">{existingRegisteredBuilding.id}</span>) के रूप में पंजीकृत है।
                          </>
                        ) : (
                          <>
                            The 14-digit Bhu-Aadhaar{' '}
                            <strong className="font-mono text-[#0B3D6B] font-bold bg-amber-100/80 px-1 py-0.5 rounded">
                              {baseUlpin}
                            </strong>{' '}
                            is already registered to{' '}
                            <strong className="text-slate-900 font-bold">{existingRegisteredBuilding.name}</strong>{' '}
                            ({existingRegisteredBuilding.city || existingRegisteredBuilding.district}, {existingRegisteredBuilding.state} • ID:{' '}
                            <span className="font-mono">{existingRegisteredBuilding.id}</span>).
                          </>
                        )}
                      </p>
                      <div className="p-2 rounded-lg bg-white/90 border border-amber-200 text-[11px] text-amber-900">
                        <strong>{isHi ? 'नियम व समाधान:' : 'Rule & Resolution:'}</strong>{' '}
                        {isHi
                          ? 'समान ULPIN वाले दो अलग-अलग पार्सल नहीं हो सकते ताकि स्वामित्व विवाद न हो। नया पार्सल पंजीकृत करने के लिए चरण 1 में खसरा/प्लॉट नंबर अथवा चरण 2 में निर्देशांक समायोजित करें।'
                          : 'Duplicate ULPINs are blocked so that land parcels maintain absolute unique identity. Modify the Khasra/Plot number in Stage 1 or coordinates in Stage 2 to derive a fresh unallocated ULPIN.'}
                      </div>
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          id="view-existing-property-btn"
                          onClick={() => onNavigateToExplorer(existingRegisteredBuilding.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B3D6B] hover:bg-[#082C4D] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {isHi
                            ? `'${existingRegisteredBuilding.name}' को 3D एक्सप्लोरर में देखें`
                            : `View '${existingRegisteredBuilding.name}' in 3D Explorer`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isHi
                      ? 'ULPIN डेटाबेस में अद्वितीय है और नए भू-खंड पंजीकरण हेतु उपलब्ध है।'
                      : 'ULPIN is unique in the cadastre database and ready for registration.'}
                  </span>
                </div>
              )}

              {/* 5 Official Segments Live Correspondence Cards */}
              <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                {/* State Card */}
                <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-blue-700 font-semibold font-sans">
                    <span>{isHi ? '1. राज्य (2D)' : '1. State (2D)'}</span>
                    <span className="text-[9px] bg-blue-200 px-1 rounded">D1-D2</span>
                  </div>
                  <div className="text-base font-bold text-blue-900 my-0.5">{ulpinDetails.stateCode}</div>
                  <div className="text-[10px] text-slate-600 truncate font-sans" title={selectedState}>
                    {selectedState || (isHi ? 'राज्य चुनें' : 'Select State')}
                  </div>
                </div>

                {/* District Card */}
                <div className="p-2 rounded-lg bg-indigo-50/80 border border-indigo-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-indigo-700 font-semibold font-sans">
                    <span>{isHi ? '2. जिला (2D)' : '2. Dist (2D)'}</span>
                    <span className="text-[9px] bg-indigo-200 px-1 rounded">D3-D4</span>
                  </div>
                  <div className="text-base font-bold text-indigo-900 my-0.5">{ulpinDetails.districtCode}</div>
                  <div className="text-[10px] text-slate-600 truncate font-sans" title={district}>
                    {district || (isHi ? 'जिला दर्ज करें' : 'Enter District')}
                  </div>
                </div>

                {/* Tehsil Card */}
                <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-amber-700 font-semibold font-sans">
                    <span>{isHi ? '3. तहसील (3D)' : '3. Tehsil (3D)'}</span>
                    <span className="text-[9px] bg-amber-200 px-1 rounded">D5-D7</span>
                  </div>
                  <div className="text-base font-bold text-amber-900 my-0.5">{ulpinDetails.tehsilCode}</div>
                  <div className="text-[10px] text-slate-600 truncate font-sans" title={subDistrict}>
                    {subDistrict || (isHi ? 'तहसील दर्ज करें' : 'Enter Tehsil')}
                  </div>
                </div>

                {/* Village / Colony Card */}
                <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-emerald-700 font-semibold font-sans">
                    <span>{isHi ? '4. कॉलोनी (3D)' : '4. Colony (3D)'}</span>
                    <span className="text-[9px] bg-emerald-200 px-1 rounded">D8-D10</span>
                  </div>
                  <div className="text-base font-bold text-emerald-900 my-0.5">{ulpinDetails.villageCode}</div>
                  <div className="text-[10px] text-slate-600 truncate font-sans" title={locality ? `${locality}, Ward ${ward}` : ''}>
                    {locality || (isHi ? 'कॉलोनी दर्ज करें' : 'Enter Locality')}
                  </div>
                </div>

                {/* Khasra / Plot Card */}
                <div className="p-2 rounded-lg bg-purple-50/80 border border-purple-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] text-purple-700 font-semibold font-sans">
                    <span>{isHi ? '5. खसरा (4D)' : '5. Khasra (4D)'}</span>
                    <span className="text-[9px] bg-purple-200 px-1 rounded">D11-D14</span>
                  </div>
                  <div className="text-base font-bold text-purple-900 my-0.5">{ulpinDetails.khasraCode}</div>
                  <div className="text-[10px] text-slate-600 truncate font-sans" title={plotNumber ? `Kh-${plotNumber} | Ref-${surveyRef}` : ''}>
                    {plotNumber || (isHi ? 'खसरा/प्लॉट दर्ज करें' : 'Enter Plot/Kh')}
                  </div>
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-[11px] text-slate-500 font-mono flex flex-wrap items-center justify-between gap-2">
                <span>
                  {isHi ? 'भवन आईडी:' : 'Building ID:'}{' '}
                  <strong className="text-slate-800 font-bold">{buildingId}</strong>
                </span>
                <span>
                  {isHi ? 'ऊर्ध्वाधर इकाइयां:' : 'Strata Units:'}{' '}
                  <strong className="text-[#0B3D6B] font-bold">
                    {isHi ? `${levels.length} ऊर्ध्वाधर तल` : `${levels.length} Vertical Levels`}
                  </strong>
                </span>
              </div>
            </div>

            {/* Sample Vertical ULPINs List */}
            <div className="mt-4">
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                {isHi
                  ? '3D स्तरों के लिए प्रस्तावित ऊर्ध्वाधर ULPIN (प्रथम 3 इकाइयों का पूर्वावलोकन):'
                  : 'Proposed Vertical ULPINs for 3D Strata (First 3 Units Preview):'}
              </span>
              <div className="space-y-1 font-mono text-xs">
                {levels.slice(0, 3).map((lvl) => (
                  <div
                    key={lvl.id}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-[#0B3D6B]">{lvl.vertical_ulpin}</span>
                    <span className="text-[10px] text-slate-500 font-sans bg-white px-2 py-0.5 rounded border border-slate-200">
                      {lvl.level_code} • {lvl.usage_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STAGE 7: Procedural 3D Cadastral Massing Viewport */}
          <div id="stage-7-3d-massing" className="scroll-mt-6">
            <GeneratorViewer3D
              building={currentBuilding}
              selectedLevelId={selectedLevelId}
              onSelectLevel={(lvl) => setSelectedLevelId(lvl.id)}
              highContrast={highContrast}
              language={language}
            />
          </div>

          {/* STAGE 8: Topology Validation Engine & Registration Action */}
          <TopologyResultsPanel
            building={currentBuilding}
            highContrast={highContrast}
            language={language}
            isUlpinAlreadyRegistered={isUlpinAlreadyRegistered}
            registeredBuildingInfo={
              existingRegisteredBuilding
                ? {
                    name: existingRegisteredBuilding.name,
                    id: existingRegisteredBuilding.id,
                    district: existingRegisteredBuilding.city || existingRegisteredBuilding.district || '',
                    state: existingRegisteredBuilding.state || '',
                    ulpin_base: existingRegisteredBuilding.ulpin_base
                  }
                : undefined
            }
          />

          {/* Final Registration Action Area */}
          <div className="pt-2">
            {isUlpinAlreadyRegistered && existingRegisteredBuilding && (
              <div
                id="registration-blocked-callout"
                className="mb-3 p-3 rounded-xl border border-red-200 bg-red-50 text-red-900 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    {isHi
                      ? 'पंजीकरण अवरुद्ध: डुप्लिकेट ULPIN पाया गया'
                      : 'Registration Blocked: Duplicate ULPIN Detected'}
                  </span>
                </div>
                <p className="mt-1 text-slate-700 leading-relaxed text-[11px]">
                  {isHi
                    ? `ULPIN ${baseUlpin} पहले से ही '${existingRegisteredBuilding.name}' (आईडी: ${existingRegisteredBuilding.id}) के रूप में डेटाबेस में सुरक्षित है। एक ही ULPIN दोबारा पंजीकृत नहीं किया जा सकता। कृपया चरण 1 में खसरा/प्लॉट नंबर या चरण 2 में निर्देशांक बदलें।`
                    : `ULPIN ${baseUlpin} is already registered as '${existingRegisteredBuilding.name}' (ID: ${existingRegisteredBuilding.id}). Duplicate ULPINs cannot be registered. Please modify the Khasra/Plot number in Stage 1 or coordinates in Stage 2 to generate a distinct parcel.`}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigateToExplorer(existingRegisteredBuilding.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0B3D6B] hover:underline cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {isHi
                      ? `'${existingRegisteredBuilding.name}' को 3D एक्सप्लोरर में देखें`
                      : `View '${existingRegisteredBuilding.name}' in 3D Explorer`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDuplicateBlockedModalOpen(true)}
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer"
                  >
                    {isHi ? 'विवरण देखें' : 'View Collision Details'}
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              id="register-cadastre-property-btn"
              onClick={handleRegisterProperty}
              disabled={!hasRequiredFields || isUlpinAlreadyRegistered}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md ${
                !hasRequiredFields || isUlpinAlreadyRegistered
                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-[#0B3D6B] hover:bg-[#082C4D] text-white hover:shadow-lg cursor-pointer'
              }`}
            >
              {isUlpinAlreadyRegistered ? (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  {isHi
                    ? 'ULPIN पहले से पंजीकृत है (पंजीकरण अवरुद्ध)'
                    : 'ULPIN Already Registered in Database (Cannot Register Duplicate)'}
                </>
              ) : !hasRequiredFields ? (
                <>
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  {isHi
                    ? 'अनिवार्य फ़ील्ड भरें (नाम, खसरा, राज्य, जिला, अक्षांश, देशांतर)'
                    : 'Complete Required Fields to Register (Name, Plot, State, District, Lat, Lng)'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isHi
                    ? 'भू-अभिलेख संपत्ति पंजीकृत करें एवं 3D एक्सप्लोरर में देखें'
                    : 'Register Cadastre Property & View in 3D Explorer'}
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              {isUlpinAlreadyRegistered
                ? (isHi
                    ? 'अद्वितीय ULPIN उत्पन्न करने के लिए कृपया खसरा संख्या या अक्षांश/देशांतर बदलें।'
                    : 'Change the Khasra number or latitude/longitude above to unlock registration.')
                : !hasRequiredFields
                ? (isHi
                    ? 'पंजीकरण सक्षम करने के लिए चरण 1 और 2 में अनिवार्य विवरण दर्ज करें।'
                    : 'Fill in the required information in Stage 1 and Stage 2 to enable property registration.')
                : (isHi
                    ? 'स्थानीय स्थायी मेमोरी में संपत्ति सहेजता है। 3D एक्सप्लोरर और कैडस्ट्रे रिपोर्ट में तुरंत खोजने योग्य।'
                    : 'Saves property to local persistent storage. Instantly searchable in 3D Explorer and Cadastre Reports.')}
            </p>
          </div>
        </div>
      </div>

      {/* Registration Success Modal */}
      {isSuccessModalOpen && registeredBuilding && (
        <div
          id="registration-success-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0B3D6B]">
                  {isHi ? 'भू-अभिलेख संपत्ति सफलतापूर्वक पंजीकृत!' : 'Cadastral Property Successfully Registered!'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHi
                    ? 'भू-आधार राष्ट्रीय 3D कैडस्ट्रे प्रोटोटाइप के तहत पंजीकृत'
                    : 'Registered under Bhu-Aadhaar National 3D Cadastre Prototype'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{isHi ? 'पंजीकरण आईडी:' : 'Registration ID:'}</span>
                <span className="font-bold text-slate-900">{registeredBuilding.registration_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHi ? 'मूल भू-खंड ULPIN:' : 'Base Parcel ULPIN:'}</span>
                <span className="font-bold text-[#0B3D6B]">{registeredBuilding.ulpin_base}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHi ? 'भवन असेंबली आईडी:' : 'Building Assembly ID:'}</span>
                <span className="font-bold text-slate-900">{registeredBuilding.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHi ? 'संपत्ति का नाम:' : 'Property Name:'}</span>
                <span className="font-sans font-semibold text-slate-900">{registeredBuilding.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHi ? 'स्थान:' : 'Location:'}</span>
                <span className="font-sans text-slate-900">
                  {registeredBuilding.district}, {registeredBuilding.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isHi ? 'कुल पंजीकृत तल:' : 'Total Strata Registered:'}</span>
                <span className="font-bold text-emerald-700">
                  {isHi
                    ? `${registeredBuilding.levels.length} ऊर्ध्वाधर इकाइयां`
                    : `${registeredBuilding.levels.length} Vertical Units`}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                id="view-in-explorer-action-btn"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  onNavigateToExplorer(registeredBuilding.id);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0B3D6B] hover:bg-[#082C4D] text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                {isHi ? '3D कैडस्ट्रे एक्सप्लोरर में खोलें' : 'Open in 3D Cadastre Explorer'}
              </button>
              <button
                type="button"
                id="close-success-modal-btn"
                onClick={() => setIsSuccessModalOpen(false)}
                className="py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                {isHi ? 'संपादन जारी रखें' : 'Keep Editing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate ULPIN Registration Blocked Modal */}
      {isDuplicateBlockedModalOpen && existingRegisteredBuilding && (
        <div
          id="duplicate-ulpin-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-amber-300 shadow-2xl max-w-lg w-full p-6 text-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isHi ? 'ULPIN पहले से डेटाबेस में पंजीकृत है' : 'ULPIN Already Registered in Database'}
                </h3>
                <p className="text-xs text-amber-800 font-medium">
                  {isHi
                    ? 'राष्ट्रीय भू-अभिलेख डुप्लिकेट परिहार प्रणाली'
                    : 'National Cadastre Duplicate Prevention Engine'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'भारतीय भू-आधार (ULPIN) प्रणाली में प्रत्येक भू-खंड का पहचानकर्ता विशिष्ट होना अनिवार्य है। दो अलग-अलग संपत्तियों को समान ULPIN आवंटित नहीं किया जा सकता।'
                : "Under India's Bhu-Aadhaar (ULPIN) architecture, every land parcel identifier must be universally unique to prevent ownership disputes and title collisions."}
            </p>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">{isHi ? 'ULPIN पहचानकर्ता:' : 'Colliding ULPIN:'}</span>
                <span className="font-bold text-[#0B3D6B]">{baseUlpin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">{isHi ? 'वर्तमान पंजीकृत संपत्ति:' : 'Already Registered To:'}</span>
                <span className="font-sans font-bold text-slate-900">{existingRegisteredBuilding.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">{isHi ? 'भवन असेंबली आईडी:' : 'Registered Building ID:'}</span>
                <span className="font-bold text-slate-800">{existingRegisteredBuilding.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">{isHi ? 'स्थान:' : 'Location:'}</span>
                <span className="font-sans text-slate-900">
                  {existingRegisteredBuilding.city || existingRegisteredBuilding.district}, {existingRegisteredBuilding.state}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">{isHi ? 'पंजीकृत तल:' : 'Strata Units:'}</span>
                <span className="font-bold text-slate-900">
                  {existingRegisteredBuilding.levels.length} {isHi ? 'इकाइयां' : 'Units'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
              <span className="font-bold text-slate-800">
                {isHi ? 'नया भू-खंड पंजीकृत करने हेतु:' : 'To register your property:'}
              </span>{' '}
              {isHi
                ? 'चरण 1 में खसरा/प्लॉट नंबर बदलें (जैसे 402/C, 501, 102/1) अथवा चरण 2 में निर्देशांक समायोजित करें ताकि एक नया व अप्रयुक्त ULPIN उत्पन्न हो सके।'
                : 'Modify the Khasra/Plot number in Stage 1 (e.g., 402/C, 501, 102/1) or adjust the coordinates in Stage 2 to derive a fresh, unassigned ULPIN.'}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                id="modal-view-in-explorer-btn"
                onClick={() => {
                  setIsDuplicateBlockedModalOpen(false);
                  onNavigateToExplorer(existingRegisteredBuilding.id);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0B3D6B] hover:bg-[#082C4D] text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                {isHi ? `'${existingRegisteredBuilding.name}' को 3D एक्सप्लोरर में देखें` : `View '${existingRegisteredBuilding.name}' in 3D Explorer`}
              </button>
              <button
                type="button"
                id="close-duplicate-modal-btn"
                onClick={() => setIsDuplicateBlockedModalOpen(false)}
                className="py-2.5 px-4 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                {isHi ? 'वापस जाएं एवं इनपुट बदलें' : 'Back & Modify Inputs'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reference Stored Database Parcels Modal */}
      {isReferenceModalOpen && (
        <div
          id="stored-parcels-reference-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#0B3D6B]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isHi ? 'डेटाबेस में संग्रहीत भू-खंड मान (परीक्षण संदर्भ तालिका)' : 'Stored Database Parcels (Example Values Reference)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHi
                      ? 'ये संपत्तियां वर्तमान में आपके कैडस्ट्रे डेटाबेस में पंजीकृत हैं। किसी भी पंक्ति पर "फ़ॉर्म में भरें" दबाएं।'
                      : 'These properties are currently recorded in your database. Click "Test Duplicate" to populate form and verify duplicate blocking.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                id="close-reference-modal-btn"
                onClick={() => setIsReferenceModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Search Bar */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="search-stored-parcels-input"
                  value={dbSearchTerm}
                  onChange={(e) => setDbSearchTerm(e.target.value)}
                  placeholder={isHi ? 'नाम, शहर, राज्य, खसरा या ULPIN द्वारा खोजें...' : 'Search by name, city, state, Khasra, or ULPIN...'}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B3D6B]"
                />
              </div>
              <span className="text-xs text-slate-500 font-mono shrink-0">
                {filteredBuildings.length} {isHi ? 'परिणाम' : 'parcels'}
              </span>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">{isHi ? 'संपत्ति का नाम' : 'Property Name'}</th>
                    <th className="py-2.5 px-3">14-Digit ULPIN</th>
                    <th className="py-2.5 px-3">{isHi ? 'राज्य / शहर / तहसील' : 'State / City / Tehsil'}</th>
                    <th className="py-2.5 px-3">{isHi ? 'खसरा / प्लॉट' : 'Plot / Khasra'}</th>
                    <th className="py-2.5 px-3">{isHi ? 'निर्देशांक (Lat, Lng)' : 'Coordinates'}</th>
                    <th className="py-2.5 px-3 text-right">{isHi ? 'परीक्षण' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredBuildings.map((b) => (
                    <tr key={b.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{b.id}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{b.name}</div>
                        <div className="text-[10px] text-slate-500">{b.property_type || 'Commercial Complex'}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0B3D6B] tracking-wider">{b.ulpin_base}</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {b.locality ? `${b.locality}, ` : ''}{b.district || b.city}, {b.state}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{b.plot_number || '101/A'}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                        {b.lat.toFixed(4)}, {b.lng.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          type="button"
                          id={`fill-form-btn-${b.id}`}
                          onClick={() => {
                            handleLoadStoredBuilding(b);
                            setSelectedTestBuildingId(b.id);
                            setIsReferenceModalOpen(false);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#0B3D6B] hover:bg-[#082C4D] text-white font-medium text-[11px] transition-colors cursor-pointer shadow-2xs"
                        >
                          <Zap className="w-3 h-3 text-amber-300" />
                          {isHi ? 'फ़ॉर्म में भरें' : 'Test Duplicate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredBuildings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        {isHi ? 'कोई संपत्ति नहीं मिली।' : 'No properties matched your search term.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer Note */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600">
              <span>
                {isHi
                  ? '💡 टिप: किसी भी पंक्ति पर "फ़ॉर्म में भरें" दबाएं। ULPIN टकराव दिखेगा और पंजीकरण अवरुद्ध होगा। खसरा बदलने पर पंजीकरण पुनः सक्षम होगा।'
                  : '💡 Tip: Click "Test Duplicate" on any row. The duplicate warning triggers and registration is blocked. Changing the Khasra re-enables registration.'}
              </span>
              <button
                type="button"
                onClick={() => setIsReferenceModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium cursor-pointer shrink-0"
              >
                {isHi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
