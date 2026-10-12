import React from 'react';
import { BuildingWithLevels, BuildingLevel } from '../../types/cadastre';
import { LevelMesh } from './LevelMesh';

interface ProceduralBuildingProps {
  building: BuildingWithLevels;
  selectedLevelId: string | null;
  onSelectLevel: (level: BuildingLevel) => void;
  showUnderground: boolean;
}

export const ProceduralBuilding: React.FC<ProceduralBuildingProps> = ({
  building,
  selectedLevelId,
  onSelectLevel,
  showUnderground
}) => {
  const { footprint_params } = building;
  const w = footprint_params.width;
  const d = footprint_params.depth;

  return (
    <group name={`building-${building.id}`}>
      {/* Cadastral Base Parcel Surface Footprint outline on y=0 */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w + 4, d + 4]} />
        <meshBasicMaterial color="#0B3D6B" wireframe transparent opacity={0.35} />
      </mesh>

      {/* Render all 12 discrete levels */}
      {building.levels.map((lvl) => (
        <LevelMesh
          key={lvl.id}
          level={lvl}
          building={building}
          isSelected={selectedLevelId === lvl.id}
          onSelect={onSelectLevel}
          showUnderground={showUnderground}
        />
      ))}
    </group>
  );
};
