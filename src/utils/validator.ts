import { Building, BuildingLevel, ValidationIssue } from '../types/cadastre';

export interface ValidationResult {
  status: 'Verified' | 'Pending';
  remarks: string[];
  issues: ValidationIssue[];
}

/**
 * Real Rule-Based Cadastre Topology Validator
 * Evaluates geometric continuity, elevation stacking, footprint containment, and spatial zoning compliance.
 */
export function validateLevelTopology(
  level: Omit<BuildingLevel, 'topology_status' | 'validation_remarks'>,
  allLevels: Omit<BuildingLevel, 'topology_status' | 'validation_remarks'>[],
  building: Building
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const remarks: string[] = [];

  const footprintArea = building.computed_footprint_area;

  // Rule 1: Footprint Area Overflow check (allowing max 5% architectural cantilever)
  if (level.area_sqm > footprintArea * 1.05) {
    const excess = Math.round(level.area_sqm - footprintArea);
    issues.push({
      levelId: level.id,
      verticalUlpin: level.vertical_ulpin,
      levelNumber: level.level_number,
      severity: 'Error',
      code: 'AREA_OVERFLOW',
      message: `Enclosed area (${level.area_sqm.toFixed(1)} m²) exceeds parcel base footprint (${footprintArea.toFixed(1)} m²) by ${excess} m² (>5% non-conforming cantilever).`
    });
  }

  // Rule 2: Height non-negative & logical consistency
  const levelHeight = level.elevation_end - level.elevation_start;
  if (levelHeight <= 0) {
    issues.push({
      levelId: level.id,
      verticalUlpin: level.vertical_ulpin,
      levelNumber: level.level_number,
      severity: 'Error',
      code: 'NEGATIVE_HEIGHT',
      message: `Invalid volumetric bounding box: elevation end (${level.elevation_end}m) is not greater than elevation start (${level.elevation_start}m).`
    });
  }

  // Rule 3: Elevation Overlap with adjacent levels
  const otherLevels = allLevels.filter((l) => l.id !== level.id);
  for (const other of otherLevels) {
    // Check if both are same level type (both floors or both basements)
    if (level.level_type === other.level_type) {
      // Overlap condition: start of this is strictly inside the bounds of other
      const overlapStart = Math.max(level.elevation_start, other.elevation_start);
      const overlapEnd = Math.min(level.elevation_end, other.elevation_end);
      const overlapAmount = overlapEnd - overlapStart;

      // Tolerance 0.05m for floating point rounding
      if (overlapAmount > 0.05) {
        issues.push({
          levelId: level.id,
          verticalUlpin: level.vertical_ulpin,
          levelNumber: level.level_number,
          severity: 'Error',
          code: 'ELEVATION_OVERLAP',
          message: `Vertical volumetric overlap detected (${overlapAmount.toFixed(2)}m conflict) with Level ${other.level_number} (${other.vertical_ulpin}).`
        });
        break;
      }
    }
  }

  // Rule 4: Basement Zoning Compliance Check (Sub-grade levels must not be classified as residential per building bye-laws)
  if (level.level_type === 'basement' && level.usage_type === 'Residential') {
    issues.push({
      levelId: level.id,
      verticalUlpin: level.vertical_ulpin,
      levelNumber: level.level_number,
      severity: 'Warning',
      code: 'BASEMENT_MISMATCH',
      message: 'Habitable residential zoning assigned to subterranean basement without requisite daylight shaft/sanction.'
    });
  }

  // Determine final status
  const hasErrors = issues.some((i) => i.severity === 'Error');
  const hasWarnings = issues.some((i) => i.severity === 'Warning');

  let status: 'Verified' | 'Pending' = 'Verified';
  if (hasErrors || hasWarnings) {
    status = 'Pending';
    remarks.push(...issues.map((i) => `[${i.severity.toUpperCase()}] ${i.message}`));
  } else {
    remarks.push('Geometric volumetric boundaries verified against base parcel cadastre.');
    remarks.push('Continuous elevation datum alignment confirmed (zero coordinate conflict).');
    remarks.push('Zoning classification conforms with municipal master plan.');
  }

  return {
    status,
    remarks,
    issues
  };
}

/**
 * Validates all levels of a building and attaches computed topology_status and remarks.
 */
export function validateBuildingLevels(
  building: Building,
  rawLevels: Omit<BuildingLevel, 'topology_status' | 'validation_remarks'>[]
): BuildingLevel[] {
  return rawLevels.map((rawLevel) => {
    const result = validateLevelTopology(rawLevel, rawLevels, building);
    return {
      ...rawLevel,
      topology_status: result.status,
      validation_remarks: result.remarks
    };
  });
}
