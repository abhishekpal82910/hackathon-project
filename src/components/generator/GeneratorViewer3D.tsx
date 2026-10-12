import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Eye, EyeOff, RotateCcw, Box } from 'lucide-react';
import { BuildingWithLevels, BuildingLevel } from '../../types/cadastre';
import { ProceduralBuilding } from '../explorer/ProceduralBuilding';

interface GeneratorViewer3DProps {
  building: BuildingWithLevels;
  selectedLevelId: string | null;
  onSelectLevel: (level: BuildingLevel) => void;
  highContrast: boolean;
  language?: 'en' | 'hi';
}

/**
 * Camera manager for procedural generator viewport that mirrors 3D Cadastre Explorer
 */
const CameraManager: React.FC<{
  cameraTrigger: number;
  buildingId: string;
  zoomAction: number;
}> = ({ cameraTrigger, buildingId, zoomAction }) => {
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
      maxPolarAngle={Math.PI / 2 + 0.3} // Allow viewing slightly below ground datum
      target={[0, 15, 0]}
    />
  );
};

export const GeneratorViewer3D: React.FC<GeneratorViewer3DProps> = ({
  building,
  selectedLevelId,
  onSelectLevel,
  highContrast,
  language = 'en'
}) => {
  const isHi = language === 'hi';
  const [showUnderground, setShowUnderground] = useState<boolean>(true);
  const [cameraTrigger, setCameraTrigger] = useState<number>(0);
  const [zoomAction, setZoomAction] = useState<number>(0);

  const handleResetCamera = () => {
    setCameraTrigger((prev) => prev + 1);
  };

  const handleZoomIn = () => {
    setZoomAction((prev) => (prev > 0 ? prev + 1 : 1));
  };

  const handleZoomOut = () => {
    setZoomAction((prev) => (prev < 0 ? prev - 1 : -1));
  };

  const selectedLevel = building.levels.find((lvl) => lvl.id === selectedLevelId);

  return (
    <div
      id="generator-3d-viewport-card"
      className={`rounded-xl border overflow-hidden transition-all ${
        highContrast
          ? 'bg-neutral-900 border-yellow-400 text-white'
          : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}
    >
      {/* Viewport Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#0B3D6B]/10 text-[#0B3D6B]">
            <Box className="w-4 h-4" />
          </span>
          <h4 className="font-bold text-sm text-[#0B3D6B]">
            {isHi ? 'चरण 7: कार्यविधि 3D भू-अभिलेख मासिंग' : 'Stage 7: Procedural 3D Cadastral Massing'}
          </h4>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-[#0B3D6B] font-mono font-medium">
            {building.footprint_type.toUpperCase()} • {building.total_floors}{isHi ? 'तल' : 'F'} / {building.total_basements}{isHi ? 'बेसमेंट' : 'B'}
          </span>
        </div>

        {/* Viewport Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="toggle-generator-basements-btn"
            onClick={() => setShowUnderground((prev) => !prev)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border transition-colors cursor-pointer ${
              showUnderground
                ? 'bg-blue-50 text-[#0B3D6B] border-blue-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {showUnderground ? <Eye className="w-3.5 h-3.5 text-[#0B3D6B]" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>
              {isHi
                ? (showUnderground ? 'बेसमेंट: चालू' : 'बेसमेंट: बंद')
                : (showUnderground ? 'Basement: ON' : 'Basement: OFF')}
            </span>
          </button>

          <button
            type="button"
            id="reset-generator-camera-btn"
            onClick={handleResetCamera}
            title={isHi ? 'कैमरा रीसेट करें' : 'Reset Perspective'}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isHi ? 'कैमरा रीसेट' : 'Reset Camera'}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Container matching 3D Cadastre Explorer */}
      <div 
        id="generator-3d-canvas-container"
        className="relative w-full h-[420px] sm:h-[480px] bg-slate-200 border-b border-slate-300 overflow-hidden shadow-xs"
      >
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
              <mesh position={[0, -(building.basement_depth_m ? building.basement_depth_m / 2 : 3.2), 0]}>
                <boxGeometry
                  args={[
                    building.footprint_params.width + 6,
                    building.basement_depth_m || 6.4,
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

          {/* Building Geometry with Interactive Floor Selection */}
          <ProceduralBuilding
            building={building}
            selectedLevelId={selectedLevelId}
            onSelectLevel={onSelectLevel}
            showUnderground={showUnderground}
          />
        </Canvas>

        {/* High Density Top-Left Telemetry Box (Identical to 3D Cadastre Explorer) */}
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

        {/* Selected Level Badge Floating Inspection Card */}
        {selectedLevel ? (
          <div className="absolute top-20 left-3 bg-white/95 backdrop-blur-xs border border-slate-400 rounded-md p-2.5 text-xs text-slate-900 max-w-xs shadow-md animate-fadeIn z-10">
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200">
              <span className="font-bold text-[#0B3D6B] font-mono">
                {selectedLevel.level_code} ({selectedLevel.level_type.toUpperCase()})
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-[#0B3D6B] border border-blue-200 font-mono font-semibold">
                {selectedLevel.usage_type}
              </span>
            </div>
            <div className="mt-1.5 space-y-0.5 text-slate-700 font-mono text-[11px]">
              <div className="text-amber-700 font-semibold truncate" title={selectedLevel.vertical_ulpin}>
                {selectedLevel.vertical_ulpin}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Elevation:</span>
                <span className="font-semibold text-slate-900">{selectedLevel.elevation_range_m}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Strata Area:</span>
                <span className="font-semibold text-slate-900">{selectedLevel.area_sqm} sq.m</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute top-20 left-3 bg-white/80 backdrop-blur-xs border border-slate-300 rounded px-2.5 py-1 text-[10px] text-slate-600 font-mono pointer-events-none">
            Click any 3D floor or basement slab to inspect strata metadata
          </div>
        )}

        {/* High Density Bottom-Right Canvas Controls */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
          <button
            id="btn-generator-viewer-zoom-in"
            onClick={handleZoomIn}
            className="w-7 h-7 bg-white border border-slate-400 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs shadow-xs focus:outline-none cursor-pointer"
            title="Zoom in (+)"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            id="btn-generator-viewer-zoom-out"
            onClick={handleZoomOut}
            className="w-7 h-7 bg-white border border-slate-400 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-xs shadow-xs focus:outline-none cursor-pointer"
            title="Zoom out (-)"
            aria-label="Zoom out"
          >
            -
          </button>
        </div>

        {/* Navigation Helper Hint */}
        <div className="absolute bottom-3 left-3 pointer-events-none text-[9px] text-slate-600 bg-white/85 backdrop-blur-xs px-2 py-0.5 border border-slate-300 shadow-xs">
          Orbit: Left Click+Drag • Pan: Right Click • Zoom: Scroll/Buttons
        </div>
      </div>
    </div>
  );
};
