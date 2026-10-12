import { BuildingWithLevels } from '../types/cadastre';
import { SEED_BUILDINGS } from './seedData';

const LOCAL_STORAGE_KEY = 'cadastre_registered_buildings_v1';
export const DB_UPDATED_EVENT = 'cadastre_db_updated';

/**
 * Retrieves all registered buildings from localStorage
 */
function getCustomBuildings(): BuildingWithLevels[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load registered buildings from localStorage:', err);
    return [];
  }
}

/**
 * Returns all buildings: custom registered buildings first, followed by seed buildings
 */
export function getAllBuildings(): BuildingWithLevels[] {
  const custom = getCustomBuildings();
  // Filter out any duplicates if an ID matches
  const customIds = new Set(custom.map((b) => b.id));
  const seedsFiltered = SEED_BUILDINGS.filter((b) => !customIds.has(b.id));
  return [...custom, ...seedsFiltered];
}

/**
 * Finds a building by its ID or ULPIN
 */
export function getBuildingById(idOrUlpin: string): BuildingWithLevels | undefined {
  const all = getAllBuildings();
  const target = idOrUlpin.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return all.find(
    (b) =>
      b.id.toLowerCase() === idOrUlpin.toLowerCase() ||
      b.ulpin_base.toLowerCase() === idOrUlpin.toLowerCase() ||
      (b.ulpin_base && b.ulpin_base.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === target) ||
      (b.legacy_ulpin && b.legacy_ulpin.toLowerCase() === idOrUlpin.toLowerCase()) ||
      (b.legacy_ulpin && b.legacy_ulpin.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === target) ||
      b.building_id?.toLowerCase() === idOrUlpin.toLowerCase() ||
      b.registration_id?.toLowerCase() === idOrUlpin.toLowerCase()
  );
}

/**
 * Checks if a ULPIN is already registered in the cadastral database.
 * Matches against ulpin_base (with or without hyphens/spaces), legacy_ulpin, building_id, and id.
 */
export function findBuildingByUlpin(ulpin: string, excludeBuildingId?: string): BuildingWithLevels | undefined {
  if (!ulpin) return undefined;
  const all = getAllBuildings();
  const normalizedTarget = ulpin.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  if (!normalizedTarget || /^0+$/.test(normalizedTarget)) return undefined;

  return all.find((b) => {
    if (excludeBuildingId && b.id.toLowerCase() === excludeBuildingId.toLowerCase()) {
      return false;
    }
    const normalizedBase = (b.ulpin_base || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const normalizedLegacy = (b.legacy_ulpin || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const normalizedBuildingId = (b.building_id || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const normalizedId = (b.id || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    return (
      normalizedBase === normalizedTarget ||
      normalizedLegacy === normalizedTarget ||
      normalizedBuildingId === normalizedTarget ||
      normalizedId === normalizedTarget
    );
  });
}

/**
 * Saves a newly registered or edited building into localStorage
 */
export function saveBuilding(building: BuildingWithLevels): boolean {
  try {
    const duplicate = findBuildingByUlpin(building.ulpin_base);
    if (duplicate) {
      console.warn(`ULPIN ${building.ulpin_base} is already registered to ${duplicate.name} (${duplicate.id})`);
      return false;
    }

    const custom = getCustomBuildings();
    const existingIndex = custom.findIndex((b) => b.id.toLowerCase() === building.id.toLowerCase());
    if (existingIndex >= 0) {
      console.warn(`Building ID ${building.id} is already registered in custom database`);
      return false;
    } else {
      custom.unshift(building);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(custom));
    window.dispatchEvent(new CustomEvent(DB_UPDATED_EVENT, { detail: { buildingId: building.id } }));
    return true;
  } catch (err) {
    console.error('Failed to save building to localStorage:', err);
    return false;
  }
}

/**
 * Deletes a registered building from localStorage
 */
export function deleteBuilding(id: string): void {
  try {
    const custom = getCustomBuildings();
    const filtered = custom.filter((b) => b.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(DB_UPDATED_EVENT, { detail: { buildingId: id } }));
  } catch (err) {
    console.error('Failed to delete building from localStorage:', err);
  }
}

/**
 * Resets local database back to default seed state
 */
export function resetDatabase(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(DB_UPDATED_EVENT));
  } catch (err) {
    console.error('Failed to reset database:', err);
  }
}
