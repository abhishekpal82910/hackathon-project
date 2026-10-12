import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Building, BuildingLevel } from '../../types/cadastre';

interface LevelMeshProps {
  level: BuildingLevel;
  building: Building;
  isSelected: boolean;
  onSelect: (level: BuildingLevel) => void;
  showUnderground: boolean;
}

export const LevelMesh: React.FC<LevelMeshProps> = ({
  level,
  building,
  isSelected,
  onSelect,
  showUnderground
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // If basement and underground levels are toggled off, do not render
  if (level.level_type === 'basement' && !showUnderground) {
    return null;
  }

  const height = Math.max(0.2, level.elevation_end - level.elevation_start);
  const slabGap = 0.08; // 8cm visual reveal between floor plates
  const slabHeight = Math.max(0.15, height - slabGap);
  const yCenter = (level.elevation_start + level.elevation_end) / 2;

  const isBasement = level.level_type === 'basement';
  const { footprint_type, footprint_params } = building;
  const w = footprint_params.width;
  const d = footprint_params.depth;

  // Determine material colors
  // Highlight > Hover > Pending (warning) > Default
  const isPending = level.topology_status === 'Pending';

  let fillColor = building.color_tint;
  let opacity = 1.0;
  let transparent = false;

  if (isBasement) {
    fillColor = '#64748B'; // Slate subterranean
    opacity = 0.85;
    transparent = true;
  }

  if (isPending) {
    fillColor = '#F59E0B'; // Amber alert
  }

  if (isHovered) {
    fillColor = '#38BDF8'; // Sky blue hover
  }

  if (isSelected) {
    fillColor = '#0284C7'; // Deep azure active highlight
    opacity = 1.0;
  }

  const edgeColor = isSelected ? '#FFFFFF' : isHovered ? '#0B3D6B' : '#334155';

  // Render geometry according to footprint_type
  const renderGeometry = () => {
    switch (footprint_type) {
      case 'cylindrical': {
        const radius = footprint_params.radius ?? w / 2;
        return (
          <mesh
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onSelect(level);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setIsHovered(true);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            <cylinderGeometry args={[radius, radius, slabHeight, 36]} />
            <meshStandardMaterial
              color={fillColor}
              roughness={0.4}
              metalness={0.1}
              transparent={transparent}
              opacity={opacity}
            />
          </mesh>
        );
      }

      case 'l_shaped': {
        const wingW = footprint_params.wingWidth ?? w * 0.45;
        const wingL = footprint_params.wingLength ?? d * 0.55;

        // Base box along X
        const b1W = w;
        const b1D = wingW;
        const b1Z = -d / 2 + wingW / 2;

        // Perpendicular wing along Z
        const b2W = wingW;
        const b2D = d - wingW;
        const b2X = -w / 2 + wingW / 2;
        const b2Z = wingW / 2;

        return (
          <group
            onClick={(e) => {
              e.stopPropagation();
              onSelect(level);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setIsHovered(true);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            {/* Box 1 */}
            <mesh position={[0, 0, b1Z]} castShadow receiveShadow>
              <boxGeometry args={[b1W, slabHeight, b1D]} />
              <meshStandardMaterial
                color={fillColor}
                roughness={0.4}
                metalness={0.1}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Box 2 */}
            <mesh position={[b2X, 0, b2Z]} castShadow receiveShadow>
              <boxGeometry args={[b2W, slabHeight, b2D]} />
              <meshStandardMaterial
                color={fillColor}
                roughness={0.4}
                metalness={0.1}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );
      }

      case 'u_shaped': {
        const wingW = footprint_params.wingWidth ?? w * 0.32;
        const cutoutD = footprint_params.cutoutDepth ?? d * 0.55;
        const spineD = d - cutoutD;

        const spineZ = -d / 2 + spineD / 2;
        const armZ = spineZ + spineD / 2 + cutoutD / 2;
        const leftArmX = -w / 2 + wingW / 2;
        const rightArmX = w / 2 - wingW / 2;

        return (
          <group
            onClick={(e) => {
              e.stopPropagation();
              onSelect(level);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setIsHovered(true);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            {/* Back spine */}
            <mesh position={[0, 0, spineZ]} castShadow receiveShadow>
              <boxGeometry args={[w, slabHeight, spineD]} />
              <meshStandardMaterial
                color={fillColor}
                roughness={0.4}
                metalness={0.1}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Left Arm */}
            <mesh position={[leftArmX, 0, armZ]} castShadow receiveShadow>
              <boxGeometry args={[wingW, slabHeight, cutoutD]} />
              <meshStandardMaterial
                color={fillColor}
                roughness={0.4}
                metalness={0.1}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Right Arm */}
            <mesh position={[rightArmX, 0, armZ]} castShadow receiveShadow>
              <boxGeometry args={[wingW, slabHeight, cutoutD]} />
              <meshStandardMaterial
                color={fillColor}
                roughness={0.4}
                metalness={0.1}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );
      }

      case 'plus_shaped': {
        const wingW = footprint_params.wingWidth ?? w * 0.36;
        return (
          <group
            onClick={(e) => {
              e.stopPropagation();
              onSelect(level);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setIsHovered(true);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            {/* Cross Box 1 (Horizontal) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[w, slabHeight, wingW]} />
              <meshStandardMaterial
                color={fillColor}
                roughness={0.4}
                metalness={0.1}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
            {/* Cross Box 2 (Vertical) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[wingW, slabHeight, d]} />
              <meshStandardMaterial
                color={fillColor}
                roughness={0.4}
                metalness={0.1}
                transparent={transparent}
                opacity={opacity}
              />
            </mesh>
          </group>
        );
      }

      case 'rectangular':
      default:
        return (
          <mesh
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onSelect(level);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setIsHovered(true);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setIsHovered(false);
            }}
          >
            <boxGeometry args={[w, slabHeight, d]} />
            <meshStandardMaterial
              color={fillColor}
              roughness={0.4}
              metalness={0.1}
              transparent={transparent}
              opacity={opacity}
            />
          </mesh>
        );
    }
  };

  // Label tag positioning to the right side of the building
  const labelX = (footprint_params.width / 2) + 2.5;

  return (
    <group position={[0, yCenter, 0]}>
      {renderGeometry()}

      {/* Interactive Level Label */}
      {(isSelected || isHovered) && (
        <Html position={[labelX, 0, 0]} distanceFactor={35} center>
          <div
            className={`pointer-events-none px-2 py-1 rounded text-xs font-mono font-bold shadow-md border whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#0B3D6B] text-white border-white ring-2 ring-yellow-400'
                : 'bg-white text-slate-800 border-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                level.topology_status === 'Pending'
                  ? 'bg-amber-500 animate-ping'
                  : isBasement
                  ? 'bg-purple-500'
                  : 'bg-emerald-500'
              }`}
            />
            <span>
              {isBasement ? `Basement ${level.level_number}` : `Floor ${level.level_number}`}
            </span>
            <span className="text-[10px] opacity-80">
              ({level.level_code})
            </span>
          </div>
        </Html>
      )}
    </group>
  );
};
