import { BuildingWithLevels } from '../types/cadastre';

export function exportLevelsToCSV(buildings: BuildingWithLevels[]): void {
  const headers = [
    'Building ID',
    'Building Name',
    'City',
    'State',
    'Base ULPIN (Surface)',
    'Vertical ULPIN (Strata)',
    'Level Code',
    'Level Number',
    'Level Type',
    'Area (sq.m)',
    'Usage Type',
    'Owner Entity Placeholder',
    'Elevation Start (m)',
    'Elevation End (m)',
    'Topology Status',
    'Last Survey Date'
  ];

  const rows: string[][] = [];

  for (const b of buildings) {
    for (const lvl of b.levels) {
      rows.push([
        `"${b.id}"`,
        `"${b.name}"`,
        `"${b.city}"`,
        `"${b.state}"`,
        `"${b.ulpin_base}"`,
        `"${lvl.vertical_ulpin}"`,
        `"${lvl.level_code}"`,
        `"${lvl.level_number}"`,
        `"${lvl.level_type}"`,
        `${lvl.area_sqm}`,
        `"${lvl.usage_type}"`,
        `"${lvl.owner_name}"`,
        `${lvl.elevation_start}`,
        `${lvl.elevation_end}`,
        `"${lvl.topology_status}"`,
        `"${lvl.last_updated}"`
      ]);
    }
  }

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `3D_ULPIN_Cadastre_Register_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
