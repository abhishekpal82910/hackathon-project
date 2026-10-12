import { Building, BuildingLevel, BuildingWithLevels, FootprintType, UsageType } from '../types/cadastre';
import { validateBuildingLevels } from '../utils/validator';
import { deriveDetailedUlpin } from '../utils/ulpinGenerator';

interface RawBuildingDef {
  id: string;
  buildingNo: string;
  ulpin_base: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  footprint_type: FootprintType;
  footprint_params: {
    width: number;
    depth: number;
    radius?: number;
    wingWidth?: number;
    wingLength?: number;
    cutoutWidth?: number;
    cutoutDepth?: number;
  };
  floor_height_m: number;
  basement_depth_m: number;
  year_surveyed: number;
  status: 'Active' | 'Under Review' | 'Digitized';
  color_tint: string;
  accent_tint: string;
  description: string;
  edgeCaseType?: 'AREA_OVERFLOW' | 'ELEVATION_OVERLAP';
  // Extended cadastre attributes
  plot_number?: string;
  survey_reference?: string;
  district?: string;
  sub_district?: string;
  locality?: string;
  ward?: string;
  elevation_m?: number;
  property_type?: string;
  ownership_category?: string;
}

const RAW_BUILDINGS_SEED: RawBuildingDef[] = [
  {
    id: 'BLD-01',
    buildingNo: '01',
    ulpin_base: '23MP0412034521',
    name: 'Vindhyachal Revenue Bhavan',
    city: 'Bhopal',
    district: 'Bhopal',
    sub_district: 'Huzur',
    locality: 'Arera Hills',
    ward: 'Ward 44',
    state: 'Madhya Pradesh',
    lat: 23.2335,
    lng: 77.4344,
    elevation_m: 505,
    plot_number: '101/A',
    survey_reference: 'REV-MP-2023-0101',
    property_type: 'Commercial Complex',
    ownership_category: 'State Government Public Property',
    footprint_type: 'rectangular',
    footprint_params: { width: 34, depth: 24 },
    floor_height_m: 3.4,
    basement_depth_m: 3.0,
    year_surveyed: 2023,
    status: 'Digitized',
    color_tint: '#94A3B8', // Slate
    accent_tint: '#0B3D6B',
    description: 'Administrative block housing divisional land settlement and spatial records archives.'
  },
  {
    id: 'BLD-02',
    buildingNo: '02',
    ulpin_base: '23MP0921048712',
    name: 'Malwa Trade & Registry Centre',
    city: 'Indore',
    district: 'Indore',
    sub_district: 'Indore City',
    locality: 'Vijay Nagar',
    ward: 'Ward 32',
    state: 'Madhya Pradesh',
    lat: 22.7196,
    lng: 75.8577,
    elevation_m: 553,
    plot_number: '204/B',
    survey_reference: 'REV-MP-2024-0204',
    property_type: 'Commercial Complex',
    ownership_category: 'Private Freehold',
    footprint_type: 'l_shaped',
    footprint_params: { width: 38, depth: 32, wingWidth: 16, wingLength: 20 },
    floor_height_m: 3.5,
    basement_depth_m: 3.1,
    year_surveyed: 2024,
    status: 'Active',
    color_tint: '#CBD5E1', // Cool gray
    accent_tint: '#1E3A8A',
    description: 'Multi-occupancy commercial registry and sub-registrar branch offices.'
  },
  {
    id: 'BLD-03',
    buildingNo: '03',
    ulpin_base: '08RJ1923051874',
    name: 'Aravalli Vikas Sadan',
    city: 'Jaipur',
    district: 'Jaipur',
    sub_district: 'Jaipur Tehsil',
    locality: 'C-Scheme',
    ward: 'Ward 15',
    state: 'Rajasthan',
    lat: 26.9124,
    lng: 75.7873,
    elevation_m: 431,
    plot_number: '315/C',
    survey_reference: 'REV-RJ-2022-0315',
    property_type: 'Institutional / IT Park',
    ownership_category: 'Municipal Corporation',
    footprint_type: 'u_shaped',
    footprint_params: { width: 42, depth: 36, wingWidth: 12, cutoutWidth: 18, cutoutDepth: 20 },
    floor_height_m: 3.3,
    basement_depth_m: 2.9,
    year_surveyed: 2022,
    status: 'Digitized',
    color_tint: '#D1D5DB', // Warm stone
    accent_tint: '#7C2D12',
    description: 'Urban improvement trust regional hub with centralized spatial verification cell.'
  },
  {
    id: 'BLD-04',
    buildingNo: '04',
    ulpin_base: '27MH0832049102',
    name: 'Shaniwar Commercial Complex',
    city: 'Pune',
    district: 'Pune',
    sub_district: 'Haveli',
    locality: 'Shivajinagar',
    ward: 'Ward 18',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    elevation_m: 560,
    plot_number: '412/D',
    survey_reference: 'REV-MH-2023-0412',
    property_type: 'Commercial Complex',
    ownership_category: 'Private Freehold',
    footprint_type: 'plus_shaped',
    footprint_params: { width: 40, depth: 40, wingWidth: 14, wingLength: 13 },
    floor_height_m: 3.2,
    basement_depth_m: 3.0,
    year_surveyed: 2023,
    status: 'Under Review',
    color_tint: '#A8A29E', // Sandstone warm gray
    accent_tint: '#0284C7',
    description: 'High-density commercial hub currently under municipal boundary reconciliation.',
    edgeCaseType: 'AREA_OVERFLOW' // Seeded discrepancy: Floor 6 has un-sanctioned cantilever area
  },
  {
    id: 'BLD-05',
    buildingNo: '05',
    ulpin_base: '36TS0319082341',
    name: 'Charminar IT & Land Hub',
    city: 'Hyderabad',
    district: 'Hyderabad',
    sub_district: 'Charminar Mandal',
    locality: 'Madina Circle',
    ward: 'Ward 22',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    elevation_m: 542,
    plot_number: '520/IT',
    survey_reference: 'REV-TS-2024-0520',
    property_type: 'Institutional / IT Park',
    ownership_category: 'Public-Private Partnership (PPP)',
    footprint_type: 'cylindrical',
    footprint_params: { width: 32, depth: 32, radius: 16 },
    floor_height_m: 3.6,
    basement_depth_m: 3.2,
    year_surveyed: 2024,
    status: 'Active',
    color_tint: '#93C5FD', // Light sky institutional
    accent_tint: '#1E40AF',
    description: 'Modern high-rise commercial tower featuring high-precision GNSS tie-ins.'
  },
  {
    id: 'BLD-06',
    buildingNo: '06',
    ulpin_base: '24GJ0512093845',
    name: 'Sardar Patel Nagar Parishad',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    sub_district: 'Ahmedabad City',
    locality: 'Ashram Road',
    ward: 'Ward 08',
    state: 'Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    elevation_m: 53,
    plot_number: '608/A',
    survey_reference: 'REV-GJ-2022-0608',
    property_type: 'Commercial Complex',
    ownership_category: 'Municipal Corporation',
    footprint_type: 'rectangular',
    footprint_params: { width: 36, depth: 26 },
    floor_height_m: 3.2,
    basement_depth_m: 2.8,
    year_surveyed: 2022,
    status: 'Digitized',
    color_tint: '#D4D4D8', // Light zinc
    accent_tint: '#0369A1',
    description: 'Municipal administrative ward office and civic land records kiosk.'
  },
  {
    id: 'BLD-07',
    buildingNo: '07',
    ulpin_base: '09UP0129038472',
    name: 'Awadh Paryavaran Bhavan',
    city: 'Lucknow',
    district: 'Lucknow',
    sub_district: 'Lucknow Sadar',
    locality: 'Gomti Nagar',
    ward: 'Ward 14',
    state: 'Uttar Pradesh',
    lat: 26.8467,
    lng: 80.9462,
    elevation_m: 123,
    plot_number: '714/E',
    survey_reference: 'REV-UP-2023-0714',
    property_type: 'Institutional / IT Park',
    ownership_category: 'State Government Public Property',
    footprint_type: 'l_shaped',
    footprint_params: { width: 35, depth: 30, wingWidth: 15, wingLength: 18 },
    floor_height_m: 3.3,
    basement_depth_m: 3.0,
    year_surveyed: 2023,
    status: 'Active',
    color_tint: '#E2E8F0', // Platinum
    accent_tint: '#0F172A',
    description: 'Institutional headquarters overseeing state environmental clearings and parcel boundaries.'
  },
  {
    id: 'BLD-08',
    buildingNo: '08',
    ulpin_base: '21OD0634019283',
    name: 'Kalinga Revenue Complex',
    city: 'Bhubaneswar',
    district: 'Bhubaneswar',
    sub_district: 'Bhubaneswar Tehsil',
    locality: 'Saheed Nagar',
    ward: 'Ward 29',
    state: 'Odisha',
    lat: 20.2961,
    lng: 85.8245,
    elevation_m: 45,
    plot_number: '829/F',
    survey_reference: 'REV-OD-2023-0829',
    property_type: 'Commercial Complex',
    ownership_category: 'State Government Public Property',
    footprint_type: 'u_shaped',
    footprint_params: { width: 38, depth: 34, wingWidth: 12, cutoutWidth: 16, cutoutDepth: 18 },
    floor_height_m: 3.4,
    basement_depth_m: 2.9,
    year_surveyed: 2023,
    status: 'Digitized',
    color_tint: '#CBD5E1', // Cool gray
    accent_tint: '#15803D',
    description: 'Coastal zone land records integration unit with automated flood-risk tags.'
  },
  {
    id: 'BLD-09',
    buildingNo: '09',
    ulpin_base: '29KA0718029384',
    name: 'Vidhana Soudha Annex Wing',
    city: 'Bengaluru',
    district: 'Bengaluru',
    sub_district: 'Bengaluru North',
    locality: 'Ambedkar Veedhi',
    ward: 'Ward 77',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    elevation_m: 920,
    plot_number: '901/G',
    survey_reference: 'REV-KA-2024-0901',
    property_type: 'Institutional / IT Park',
    ownership_category: 'State Government Public Property',
    footprint_type: 'plus_shaped',
    footprint_params: { width: 42, depth: 42, wingWidth: 14, wingLength: 14 },
    floor_height_m: 3.6,
    basement_depth_m: 3.1,
    year_surveyed: 2024,
    status: 'Under Review',
    color_tint: '#94A3B8', // Slate blue
    accent_tint: '#B45309',
    description: 'Secretariat annex wing integrating volumetric survey with automated title registry.',
    edgeCaseType: 'ELEVATION_OVERLAP' // Seeded discrepancy: Level 3 and Level 4 coordinate overlap
  },
  {
    id: 'BLD-10',
    buildingNo: '10',
    ulpin_base: '04CH0114092837',
    name: 'Sector 17 Capitol Arcade',
    city: 'Chandigarh',
    district: 'Chandigarh',
    sub_district: 'Chandigarh',
    locality: 'Sector 17',
    ward: 'Block B',
    state: 'Chandigarh (UT)',
    lat: 30.7333,
    lng: 76.7794,
    elevation_m: 321,
    plot_number: '1017/C',
    survey_reference: 'REV-CH-2021-1017',
    property_type: 'Commercial Complex',
    ownership_category: 'Central Government Entity',
    footprint_type: 'rectangular',
    footprint_params: { width: 30, depth: 22 },
    floor_height_m: 3.1,
    basement_depth_m: 2.9,
    year_surveyed: 2021,
    status: 'Digitized',
    color_tint: '#E5E7EB', // Clean concrete
    accent_tint: '#0284C7',
    description: 'Master-planned civic complex conforming strictly to Le Corbusier modular grid lines.'
  },
  {
    id: 'BLD-11',
    buildingNo: '11',
    ulpin_base: '23MP0827019284',
    name: 'Mahakal Urban Development Tower',
    city: 'Indore',
    district: 'Indore',
    sub_district: 'Indore City',
    locality: 'AB Road',
    ward: 'Ward 40',
    state: 'Madhya Pradesh',
    lat: 22.7533,
    lng: 75.8937,
    elevation_m: 555,
    plot_number: '1140/T',
    survey_reference: 'REV-MP-2024-1140',
    property_type: 'Institutional / IT Park',
    ownership_category: 'Public-Private Partnership (PPP)',
    footprint_type: 'cylindrical',
    footprint_params: { width: 28, depth: 28, radius: 14 },
    floor_height_m: 3.4,
    basement_depth_m: 3.0,
    year_surveyed: 2024,
    status: 'Active',
    color_tint: '#BAE6FD', // Sky tint
    accent_tint: '#0369A1',
    description: 'Smart city command center tower hosting sensor network hubs and spatial digital twins.'
  },
  {
    id: 'BLD-12',
    buildingNo: '12',
    ulpin_base: '08RJ0412084920',
    name: 'Hawa Mahal Enclave Registry',
    city: 'Jaipur',
    district: 'Jaipur',
    sub_district: 'Jaipur Tehsil',
    locality: 'Badi Chaupar',
    ward: 'Ward 05',
    state: 'Rajasthan',
    lat: 26.9239,
    lng: 75.8267,
    elevation_m: 435,
    plot_number: '1205/H',
    survey_reference: 'REV-RJ-2022-1205',
    property_type: 'Commercial Complex',
    ownership_category: 'State Government Public Property',
    footprint_type: 'l_shaped',
    footprint_params: { width: 36, depth: 32, wingWidth: 14, wingLength: 18 },
    floor_height_m: 3.3,
    basement_depth_m: 2.8,
    year_surveyed: 2022,
    status: 'Digitized',
    color_tint: '#D1D5DB', // Stone
    accent_tint: '#991B1B',
    description: 'Heritage buffer zone registry monitoring vertical construction limit adherence.'
  },
  {
    id: 'BLD-13',
    buildingNo: '13',
    ulpin_base: '27MH0119048291',
    name: 'Nariman Point Finance Chamber',
    city: 'Pune',
    district: 'Pune',
    sub_district: 'Haveli',
    locality: 'FC Road',
    ward: 'Ward 12',
    state: 'Maharashtra',
    lat: 18.5314,
    lng: 73.8446,
    elevation_m: 565,
    plot_number: '1312/F',
    survey_reference: 'REV-MH-2023-1312',
    property_type: 'Commercial Complex',
    ownership_category: 'Private Freehold',
    footprint_type: 'rectangular',
    footprint_params: { width: 40, depth: 28 },
    floor_height_m: 3.5,
    basement_depth_m: 3.2,
    year_surveyed: 2023,
    status: 'Active',
    color_tint: '#CBD5E1', // Steel gray
    accent_tint: '#064E3B',
    description: 'Corporate commercial tower with subterranean multi-tier mechanical parking facilities.'
  },
  {
    id: 'BLD-14',
    buildingNo: '14',
    ulpin_base: '36TS0912048293',
    name: 'Cyberabad Land & Spatial Directorate',
    city: 'Hyderabad',
    district: 'Hyderabad',
    sub_district: 'Serilingampally',
    locality: 'HITEC City',
    ward: 'Ward 105',
    state: 'Telangana',
    lat: 17.4401,
    lng: 78.3489,
    elevation_m: 545,
    plot_number: '1405/IT',
    survey_reference: 'REV-TS-2024-1405',
    property_type: 'Institutional / IT Park',
    ownership_category: 'Private Freehold',
    footprint_type: 'u_shaped',
    footprint_params: { width: 44, depth: 36, wingWidth: 14, cutoutWidth: 18, cutoutDepth: 20 },
    floor_height_m: 3.5,
    basement_depth_m: 3.1,
    year_surveyed: 2024,
    status: 'Digitized',
    color_tint: '#94A3B8', // Tech slate
    accent_tint: '#1D4ED8',
    description: 'State GIS data center and drone survey point cloud indexing repository.'
  },
  {
    id: 'BLD-15',
    buildingNo: '15',
    ulpin_base: '24GJ0218047291',
    name: 'Sabarmati Riverfront Cadastre Block',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    sub_district: 'Sabarmati',
    locality: 'Riverfront Promenade',
    ward: 'Ward 03',
    state: 'Gujarat',
    lat: 23.0372,
    lng: 72.5802,
    elevation_m: 55,
    plot_number: '1503/R',
    survey_reference: 'REV-GJ-2023-1503',
    property_type: 'Commercial Complex',
    ownership_category: 'Municipal Corporation',
    footprint_type: 'plus_shaped',
    footprint_params: { width: 38, depth: 38, wingWidth: 13, wingLength: 13 },
    floor_height_m: 3.3,
    basement_depth_m: 2.9,
    year_surveyed: 2023,
    status: 'Active',
    color_tint: '#E2E8F0', // Platinum
    accent_tint: '#047857',
    description: 'Riverfront development authority monitoring public domain and leased strata parcels.'
  }
];

/**
 * Calculates deterministic footprint area in square meters based on shape primitives
 */
function calculateFootprintArea(type: FootprintType, params: RawBuildingDef['footprint_params']): number {
  switch (type) {
    case 'rectangular':
      return params.width * params.depth;
    case 'cylindrical': {
      const r = params.radius ?? params.width / 2;
      return Math.PI * r * r;
    }
    case 'l_shaped': {
      // Main box + perpendicular wing
      const w = params.width;
      const d = params.depth;
      const ww = params.wingWidth ?? w * 0.45;
      const wl = params.wingLength ?? d * 0.55;
      return (w * ww) + ((d - ww) * wl);
    }
    case 'u_shaped': {
      // Base spine + 2 arms minus central courtyard
      const w = params.width;
      const d = params.depth;
      const total = w * d;
      const cutoutW = params.cutoutWidth ?? w * 0.4;
      const cutoutD = params.cutoutDepth ?? d * 0.5;
      return total - (cutoutW * cutoutD);
    }
    case 'plus_shaped': {
      // Central box + 4 symmetrical wings
      const w = params.width;
      const d = params.depth;
      const ww = params.wingWidth ?? w * 0.35;
      const wingLength = (w - ww) / 2;
      // Cross area = (w * ww) + (d * ww) - (ww * ww)
      return (w * ww) + (d * ww) - (ww * ww);
    }
    default:
      return params.width * params.depth;
  }
}

/**
 * Procedurally generates the 12 levels (10 floors + 2 basements) for each building
 */
function generateBuildingLevels(buildingDef: RawBuildingDef, footprintArea: number, building: Building): BuildingLevel[] {
  const levelsRaw: Omit<BuildingLevel, 'topology_status' | 'validation_remarks'>[] = [];
  const bldgNum = buildingDef.buildingNo;
  const baseUlpin = buildingDef.ulpin_base;

  // 1. Basements (B2 and B1): from deepest to sub-grade
  // Basement 2 (Deepest)
  const b2Depth = buildingDef.basement_depth_m;
  const b1Depth = buildingDef.basement_depth_m;

  const b2Start = -(b1Depth + b2Depth);
  const b2End = -b1Depth;
  const b2Code = 'B02';
  levelsRaw.push({
    id: `LVL-${buildingDef.id}-B02`,
    building_id: buildingDef.id,
    level_type: 'basement',
    level_number: 'B2',
    level_code: b2Code,
    vertical_ulpin: `${baseUlpin}-B${bldgNum}-${b2Code}`,
    area_sqm: Number((footprintArea * 0.98).toFixed(1)),
    usage_type: 'Utility',
    owner_name: `Common Area Entity / Society Service Core #${buildingDef.id}`,
    elevation_range_m: `${b2Start.toFixed(2)},${b2End.toFixed(2)}`,
    elevation_start: Number(b2Start.toFixed(2)),
    elevation_end: Number(b2End.toFixed(2)),
    last_updated: `${buildingDef.year_surveyed}-08-14`
  });

  // Basement 1 (Sub-grade Upper)
  const b1Start = -b1Depth;
  const b1End = 0.0;
  const b1Code = 'B01';
  levelsRaw.push({
    id: `LVL-${buildingDef.id}-B01`,
    building_id: buildingDef.id,
    level_type: 'basement',
    level_number: 'B1',
    level_code: b1Code,
    vertical_ulpin: `${baseUlpin}-B${bldgNum}-${b1Code}`,
    area_sqm: Number((footprintArea * 0.96).toFixed(1)),
    usage_type: 'Parking',
    owner_name: `Allotted Strata Parking Association #${buildingDef.id}`,
    elevation_range_m: `${b1Start.toFixed(2)},${b1End.toFixed(2)}`,
    elevation_start: Number(b1Start.toFixed(2)),
    elevation_end: Number(b1End.toFixed(2)),
    last_updated: `${buildingDef.year_surveyed}-09-20`
  });

  // 2. Above-ground Floors: F01 to F10
  const floorHeight = buildingDef.floor_height_m;
  for (let f = 1; f <= 10; f++) {
    const floorCode = f < 10 ? `F0${f}` : `F${f}`;
    let elevStart = Number(((f - 1) * floorHeight).toFixed(2));
    let elevEnd = Number((f * floorHeight).toFixed(2));

    // Determine usage
    let usage: UsageType = 'Residential';
    if (f === 1) {
      usage = 'Commercial'; // Ground floor reception/commercial
    } else if (f === 2) {
      usage = 'Commercial';
    } else if (f === 5) {
      usage = 'Common Area'; // Mid-level refuge or club terrace
    } else if (f === 10) {
      usage = 'Commercial'; // Penthouse / executive terrace
    } else {
      usage = f % 2 === 0 ? 'Residential' : 'Commercial';
    }

    // Determine area
    let floorArea = footprintArea * (1.0 - (f * 0.012)); // Subtle set-back on higher levels

    // Edge Case Injections for Demo Validation
    if (buildingDef.edgeCaseType === 'AREA_OVERFLOW' && f === 6) {
      // Deliberate 32% overflow cantilever violation
      floorArea = footprintArea * 1.32;
    }

    if (buildingDef.edgeCaseType === 'ELEVATION_OVERLAP' && f === 4) {
      // Overlap with floor 3
      elevStart = Number((elevStart - (floorHeight * 0.35)).toFixed(2));
    }

    levelsRaw.push({
      id: `LVL-${buildingDef.id}-${floorCode}`,
      building_id: buildingDef.id,
      level_type: 'floor',
      level_number: `${f}`,
      level_code: floorCode,
      vertical_ulpin: `${baseUlpin}-B${bldgNum}-${floorCode}`,
      area_sqm: Number(floorArea.toFixed(1)),
      usage_type: usage,
      owner_name: `Title Record Holder #${buildingDef.id}-F${f}`,
      elevation_range_m: `${elevStart.toFixed(2)},${elevEnd.toFixed(2)}`,
      elevation_start: elevStart,
      elevation_end: elevEnd,
      last_updated: `${buildingDef.year_surveyed}-${f < 10 ? '0' + f : f}-10`
    });
  }

  // Run through real topology validator to compute status and validation remarks
  return validateBuildingLevels(building, levelsRaw);
}

// Generate the final static repository of all 15 buildings
export const SEED_BUILDINGS: BuildingWithLevels[] = RAW_BUILDINGS_SEED.map((raw) => {
  const footprintArea = Number(calculateFootprintArea(raw.footprint_type, raw.footprint_params).toFixed(1));

  // Compute exact 14-digit mathematical ULPIN matching the generator
  const derived = deriveDetailedUlpin({
    state: raw.state,
    district: raw.district || raw.city,
    subDistrict: raw.sub_district || 'Huzur',
    locality: raw.locality || 'Civil Lines',
    ward: raw.ward || 'Ward 01',
    plotNumber: raw.plot_number || `${raw.buildingNo}/A`,
    propertyName: raw.name,
    propertyType: raw.property_type || 'Commercial Complex',
    ownershipCategory: raw.ownership_category || 'State Government Public Property',
    surveyRef: raw.survey_reference || `REV-${raw.state.slice(0, 2).toUpperCase()}-2023-${raw.buildingNo}`,
    surveyYear: raw.year_surveyed,
    lat: raw.lat,
    lng: raw.lng,
    elevationM: raw.elevation_m || 500
  });

  const baseBuilding: Building = {
    id: raw.id,
    ulpin_base: derived.ulpin,
    legacy_ulpin: raw.ulpin_base,
    name: raw.name,
    city: raw.city,
    district: raw.district || raw.city,
    sub_district: raw.sub_district || 'Huzur',
    locality: raw.locality || 'Civil Lines',
    ward: raw.ward || 'Ward 01',
    state: raw.state,
    plot_number: raw.plot_number || `${raw.buildingNo}/A`,
    survey_reference: raw.survey_reference || `REV-${raw.state.slice(0, 2).toUpperCase()}-2023-${raw.buildingNo}`,
    property_type: raw.property_type || 'Commercial Complex',
    ownership_category: raw.ownership_category || 'State Government Public Property',
    elevation_m: raw.elevation_m || 500,
    parcel_area_sqm: Math.round(footprintArea * 1.35),
    crs: 'EPSG:7755 (WGS84 / India Zone 1)',
    lat: raw.lat,
    lng: raw.lng,
    footprint_type: raw.footprint_type,
    footprint_params: raw.footprint_params,
    floor_height_m: raw.floor_height_m,
    basement_depth_m: raw.basement_depth_m,
    total_floors: 10,
    total_basements: 2,
    year_surveyed: raw.year_surveyed,
    status: raw.status,
    color_tint: raw.color_tint,
    accent_tint: raw.accent_tint,
    computed_footprint_area: footprintArea,
    description: raw.description
  };

  const levels = generateBuildingLevels(raw, footprintArea, baseBuilding);

  return {
    ...baseBuilding,
    levels
  };
});

export const ALL_BUILDING_OPTIONS = SEED_BUILDINGS.map((b) => ({
  id: b.id,
  name: b.name,
  city: b.city,
  state: b.state,
  ulpin_base: b.ulpin_base,
  footprint_type: b.footprint_type,
  totalLevels: b.levels.length
}));
