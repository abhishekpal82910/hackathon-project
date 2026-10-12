import { PipelineStage } from '../types/cadastre';

export interface CadastreStats {
  parcelsDigitized: string;
  buildingsMapped: string;
  verticalLevelsResolved: string;
  statesCovered: string;
  disputeReductionRate: string;
  surveyAccuracyCm: string;
}

export const CADASTRE_OVERVIEW_STATS: CadastreStats = {
  parcelsDigitized: '3,842,910',
  buildingsMapped: '15 Pilots',
  verticalLevelsResolved: '180 Strata Levels',
  statesCovered: '9 States & 1 UT',
  disputeReductionRate: '78.4%',
  surveyAccuracyCm: '± 2.5 cm'
};

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 1,
    shortCode: 'UAV-IMG',
    title: 'Drone Nadir & Oblique Photogrammetry',
    description: 'High-resolution aerial capture with 80% forward/side overlap and RTK-calibrated ground control points (GCPs).',
    simulatedConfidence: 99.4,
    status: 'Completed',
    metricLabel: 'Ground Sample Distance',
    metricValue: '1.2 cm/pixel'
  },
  {
    step: 2,
    shortCode: 'PT-CLD',
    title: 'Dense 3D Point Cloud Generation',
    description: 'Structure-from-Motion (SfM) multi-view stereo processing creating georeferenced dense LiDAR/point cloud.',
    simulatedConfidence: 98.1,
    status: 'Completed',
    metricLabel: 'Point Density',
    metricValue: '450 pts/m²'
  },
  {
    step: 3,
    shortCode: 'BLD-EXT',
    title: 'Volumetric Building Massing Extraction',
    description: 'AI mesh boundary classification isolating ground surface parcel vertices and vertical exterior facade envelopes.',
    simulatedConfidence: 97.6,
    status: 'Optimal',
    metricLabel: 'LoD-2 Facade Fit',
    metricValue: '99.1%'
  },
  {
    step: 4,
    shortCode: 'FLR-SEG',
    title: 'Slab Detection & Floor Segmentation',
    description: 'Detects floor plate horizontals, window band rhythms, slab heights, and sub-surface foundation datum boundaries.',
    simulatedConfidence: 95.8,
    status: 'Optimal',
    metricLabel: 'Elevation Stacking RMS',
    metricValue: '± 0.04 m'
  },
  {
    step: 5,
    shortCode: 'VRT-DEL',
    title: 'Vertical Strata Parcel Delineation',
    description: 'Splits multi-unit volumes into discrete spatial units with defined usage partitions (parking, common, residential).',
    simulatedConfidence: 96.2,
    status: 'Completed',
    metricLabel: 'Strata Enclosures',
    metricValue: '12 / 12 Levels'
  },
  {
    step: 6,
    shortCode: 'TOP-VAL',
    title: 'Topological Stacking & Clearance Validation',
    description: 'Automated 3D cadastre rules: verifies zero elevation overlap, non-overflowing footprint boundaries, and zoning alignment.',
    simulatedConfidence: 94.3,
    status: 'Verified',
    metricLabel: 'Rule Engine Passes',
    metricValue: '4 Rules Checked'
  },
  {
    step: 7,
    shortCode: 'ULPIN-GEN',
    title: 'Volumetric 3D ULPIN Assignment',
    description: 'Attaches a tamper-evident vertical identifier {Base 14-char ULPIN}-B{xx}-{Level} with digital title records.',
    simulatedConfidence: 100.0,
    status: 'Verified',
    metricLabel: 'Standard Protocol',
    metricValue: 'DoLR Bhu-Aadhaar 3D'
  }
];
