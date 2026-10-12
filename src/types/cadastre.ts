export type FootprintType = 'rectangular' | 'l_shaped' | 'u_shaped' | 'plus_shaped' | 'cylindrical';

export type LevelType = 'floor' | 'basement';

export type UsageType = 'Residential' | 'Commercial' | 'Common Area' | 'Parking' | 'Utility' | 'Institutional';

export type TopologyStatus = 'Verified' | 'Pending';

export interface FootprintParams {
  width: number;       // meters
  depth: number;       // meters
  radius?: number;      // meters (for cylindrical)
  wingWidth?: number;   // meters (for L, U, Plus)
  wingLength?: number;  // meters
  cutoutWidth?: number; // meters (for U)
  cutoutDepth?: number;
}

export interface Building {
  id: string;
  ulpin_base: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  footprint_type: FootprintType;
  footprint_params: FootprintParams;
  floor_height_m: number;
  basement_depth_m: number;
  total_floors: number;      // 10
  total_basements: number;   // 2
  year_surveyed: number;
  status: 'Active' | 'Under Review' | 'Digitized';
  color_tint: string;        // Hex string for procedural facade tint
  accent_tint: string;       // Secondary trim color
  computed_footprint_area: number; // sq.m
  description?: string;
  // Extended Cadastre & Registration Metadata
  building_id?: string;
  legacy_ulpin?: string;
  property_type?: string;
  plot_number?: string;
  survey_reference?: string;
  ownership_category?: string;
  district?: string;
  sub_district?: string;
  locality?: string;
  ward?: string;
  elevation_m?: number;
  parcel_area_sqm?: number;
  crs?: string;
  drone_image_url?: string;
  drone_image_name?: string;
  registration_id?: string;
  is_custom_registered?: boolean;
  created_at?: string;
}

export interface BuildingLevel {
  id: string;
  building_id: string;
  level_type: LevelType;
  level_number: string;      // "1"–"10" or "B1", "B2"
  level_code: string;        // "F01"–"F10", "B01"–"B02"
  vertical_ulpin: string;    // e.g. "23MP0412034521-B01-F04"
  area_sqm: number;
  usage_type: UsageType;
  owner_name: string;        // e.g. "Owner Record #4B"
  elevation_range_m: string; // e.g. "9.60,12.80"
  elevation_start: number;   // meters from datum y=0
  elevation_end: number;     // meters from datum y=0
  topology_status: TopologyStatus;
  validation_remarks: string[];
  last_updated: string;
}

export interface BuildingWithLevels extends Building {
  levels: BuildingLevel[];
}

export interface PipelineStage {
  step: number;
  title: string;
  shortCode: string;
  description: string;
  simulatedConfidence: number; // 0–100%
  status: 'Completed' | 'Optimal' | 'Verified';
  metricLabel: string;
  metricValue: string;
}

export interface ValidationIssue {
  levelId: string;
  verticalUlpin: string;
  levelNumber: string;
  severity: 'Warning' | 'Error';
  message: string;
  code: 'AREA_OVERFLOW' | 'ELEVATION_OVERLAP' | 'BASEMENT_MISMATCH' | 'NEGATIVE_HEIGHT';
}
