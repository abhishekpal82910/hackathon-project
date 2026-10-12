import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingWithLevels, BuildingLevel } from '../../types/cadastre';
import { ProceduralBuilding } from './ProceduralBuilding';

interface Viewer3DProps {
  building: BuildingWithLevels;
  selectedLevelId: string | null;
  onSelectLevel: (level: BuildingLevel) => void;
  showUnderground: boolean;
  cameraTrigger: number; // Increment to force camera reset
}

/**
 * Camera controller that handles smooth re-framing and reset when building changes
 */
const CameraManager: React.FC<{ 
  cameraTrigger: number; 
  buildingId: string;
  zoomAction: number; // +1 zoom in, -1 zoom out
}> = ({
  cameraTrigger,
  buildingId,
  zoomAction
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    // Reset camera position smoothly to standard isometric perspective
    camera.position.set(48, 38, 52);
    camera.lookAt(0, 15, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 15, 0);
      controlsRef.current.update();
    }
  }, [camera, cameraTrigger, buildingId]);

  useEffect(() => {
    if (!zoomAction) return;
    const factor = zoomAction > 0 ? 0.85 : 1.18;
    camera.position.x *= factor;
    camera.position.y *= factor;
    camera.position.z *= factor;
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  }, [camera, zoomAction]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={10}
      maxDistance={150}
      maxPolarAngle={Math.PI / 2 + 0.3} // Allow looking slightly below ground datum
      target={[0, 15, 0]}
    />
  );
};

export const Viewer3D: React.FC<Viewer3DProps> = ({
  building,
  selectedLevelId,
  onSelectLevel,
  showUnderground,
  cameraTrigger
}) => {
  const [zoomAction, setZoomAction] = React.useState<number>(0);

  const handleZoomIn = () => {
    setZoomAction((prev) => (prev > 0 ? prev + 1 : 1));
  };

  const handleZoomOut = () => {
    setZoomAction((prev) => (prev < 0 ? prev - 1 : -1));
  };

  return (
    <div 
      id="viewer-3d-canvas-container"
      className="relative w-full h-[440px] sm:h-[500px] bg-slate-200 border border-slate-300 overflow-hidden shadow-xs"
    >
      {/* 3D Scene Canvas */}
      <Canvas
        shadows
        camera={{ position: [48, 38, 52], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#EDF2F7']} />
        
        {/* Architectural Environment Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[40, 60, 30]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={10}
          shadow-camera-far={180}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />
        <directionalLight position={[-30, 20, -20]} intensity={0.4} />

        <CameraManager 
          cameraTrigger={cameraTrigger} 
          buildingId={building.id} 
          zoomAction={zoomAction}
        />

        {/* Surface Ground Datum at y = 0 */}
        <group position={[0, 0, 0]}>
          {/* Ground Grid Helper */}
          <gridHelper args={[100, 50, '#0B3D6B', '#94A3B8']} position={[0, 0, 0]} />

          {/* Datum Plane Circle */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <circleGeometry args={[45, 64]} />
            <meshStandardMaterial
              color="#F1F5F9"
              roughness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Subterranean Excavation Cavity representation when underground is visible */}
          {showUnderground && (
            <mesh position={[0, -3.2, 0]}>
              <boxGeometry
                args={[
                  building.footprint_params.width + 6,
                  6.4,
                  building.footprint_params.depth + 6
                ]}
              />
              <meshStandardMaterial
                color="#475569"
                wireframe
                transparent
                opacity={0.25}
              />
            </mesh>
          )}
        </group>

        {/* Building Geometry (Only one building at a time) */}
        <ProceduralBuilding
          building={building}
          selectedLevelId={selectedLevelId}
          onSelectLevel={onSelectLevel}
          showUnderground={showUnderground}
        />
      </Canvas>

      {/* High Density Top-Left Telemetry Box */}
      <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-1 text-[10px] font-mono">
        <div className="bg-white/90 backdrop-blur-xs border border-slate-400 px-2.5 py-1 text-slate-800 shadow-xs">
          CAM: 45.2° | ELEV: 15m | FOV: 42° | DATUM: y=0.0m
        </div>
        <div className="bg-white/90 backdrop-blur-xs border border-slate-300 px-2 py-0.5 text-slate-700 shadow-xs flex items-center gap-2 text-[9px]">
          <span className="w-2 h-2 rounded-xs bg-[#0B3D6B]" />
          <span>Selected</span>
          <span className="w-2 h-2 rounded-xs bg-[#F59E0B]" />
          <span>Pending Audit</span>
          <span className="w-2 h-2 rounded-xs bg-emerald-600" />
          <span>Verified</span>
        </div>
      </div>

      {/* High Density Bottom-Right Canvas Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
        <button
          id="btn-viewer-zoom-in"
          onClick={handleZoomIn}
          className="w-7 h-7 bg-white border border-slate-400 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs shadow-xs focus:outline-none"
          title="Zoom in (+)"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          id="btn-viewer-zoom-out"
          onClick={handleZoomOut}
          className="w-7 h-7 bg-white border border-slate-400 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs shadow-xs focus:outline-none"
          title="Zoom out (-)"
          aria-label="Zoom out"
        >
          -
        </button>
      </div>

      {/* Navigation Helper Hint */}
      <div className="absolute bottom-3 left-3 pointer-events-none text-[9px] text-slate-600 bg-white/80 backdrop-blur-xs px-2 py-0.5 border border-slate-300">
        Orbit: Left Click+Drag • Pan: Right Click • Zoom: Scroll/Buttons
      </div>
    </div>
  );
};
