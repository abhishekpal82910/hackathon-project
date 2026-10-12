import React from 'react';
import { Box, Layers, MapPin } from 'lucide-react';

interface SkeletonProps {
  className?: string;
  highContrast?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', highContrast = false }) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded ${
        highContrast ? 'bg-neutral-800' : 'bg-slate-200'
      } ${className}`}
    />
  );
};

// 3D Canvas Viewport Skeleton for massing geometry loading
export const Viewer3DSkeleton: React.FC<{
  buildingName?: string;
  highContrast?: boolean;
  language?: 'en' | 'hi';
}> = ({
  buildingName = 'Cadastral Parcel',
  highContrast = false,
  language = 'en'
}) => {
  const isHi = language === 'hi';

  return (
    <div
      id="viewer3d-skeleton"
      aria-label="Loading 3D Model"
      className={`relative w-full h-[440px] sm:h-[500px] border flex flex-col justify-between p-4 overflow-hidden select-none transition-colors ${
        highContrast
          ? 'bg-neutral-950 border-yellow-400 text-yellow-300'
          : 'bg-slate-900 border-slate-700 text-slate-200'
      }`}
    >
      {/* Top HUD Skeleton */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-bold">
            {isHi ? '3D ज्यामिति रेंडरिंग...' : 'Synthesizing 3D Volumetric Mesh...'}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
          <div className="h-5 w-16 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Central 3D Massing Wireframe Simulation */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-4">
        {/* Isometric Faux Stacked Strata Slices */}
        <div className="w-48 sm:w-64 space-y-1.5 transform -skew-x-12 rotate-3 opacity-80">
          {/* Roof */}
          <div className="h-3 bg-amber-400/40 rounded border border-amber-400/60 animate-pulse" />
          {/* Above ground floors (F10 to F01) */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`f-${i}`}
              className="h-4 bg-sky-500/20 rounded border border-sky-400/30 animate-pulse flex items-center justify-between px-2"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="w-8 h-1.5 bg-sky-300/40 rounded" />
              <div className="w-4 h-1.5 bg-sky-300/30 rounded" />
            </div>
          ))}
          {/* Ground Plane line */}
          <div className="h-1 bg-emerald-500/60 rounded my-1 shadow-sm shadow-emerald-500/50" />
          {/* Basements (B01, B02) */}
          {[...Array(2)].map((_, i) => (
            <div
              key={`b-${i}`}
              className="h-4 bg-slate-600/30 rounded border border-slate-500/30 animate-pulse flex items-center justify-between px-2"
              style={{ animationDelay: `${(i + 6) * 120}ms` }}
            >
              <div className="w-8 h-1.5 bg-slate-400/30 rounded" />
              <div className="w-4 h-1.5 bg-slate-400/20 rounded" />
            </div>
          ))}
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none animate-pulse" />

        <div className="mt-6 flex flex-col items-center gap-1.5 z-10 text-center">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400 animate-bounce" />
            <span className="text-xs font-mono font-semibold tracking-wide text-white">
              {buildingName}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isHi ? 'गणितीय निर्देशांक व ऊर्ध्वाधर सीमाएं लोड हो रही हैं' : 'Constructing 10 Floors + 2 Subterranean Basements'}
          </span>
        </div>
      </div>

      {/* Bottom Controls Bar Skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 z-10 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-16 h-3 bg-white/10 rounded animate-pulse" />
          <div className="w-20 h-3 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="w-24 h-3 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
};

// Sidebar Building Summary Card Skeleton
export const BuildingCardSkeleton: React.FC<{ highContrast?: boolean }> = ({ highContrast = false }) => {
  return (
    <div
      className={`p-3.5 border shadow-xs space-y-3 ${
        highContrast ? 'bg-neutral-900 border-yellow-400' : 'bg-white border-slate-300'
      }`}
    >
      <div className="flex justify-between items-center border-b pb-2 border-slate-200">
        <Skeleton className="h-3 w-28" highContrast={highContrast} />
        <Skeleton className="h-4 w-16" highContrast={highContrast} />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-2.5 w-20" highContrast={highContrast} />
        <Skeleton className="h-5 w-44" highContrast={highContrast} />
        <Skeleton className="h-3.5 w-36" highContrast={highContrast} />
        <Skeleton className="h-3 w-48" highContrast={highContrast} />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
        <Skeleton className="h-12 w-full" highContrast={highContrast} />
        <Skeleton className="h-12 w-full" highContrast={highContrast} />
        <Skeleton className="h-12 w-full" highContrast={highContrast} />
        <Skeleton className="h-12 w-full" highContrast={highContrast} />
      </div>

      <Skeleton className="h-8 w-full" highContrast={highContrast} />
    </div>
  );
};

// Cadastre Register Table Skeleton
export const TableSkeleton: React.FC<{
  rows?: number;
  highContrast?: boolean;
}> = ({ rows = 6, highContrast = false }) => {
  return (
    <div
      className={`border overflow-hidden ${
        highContrast ? 'bg-black border-yellow-400' : 'bg-white border-slate-300'
      }`}
    >
      {/* Header bar */}
      <div className="p-3 bg-[#0B3D6B] flex items-center justify-between">
        <div className="h-3 w-32 bg-white/20 rounded animate-pulse" />
        <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
      </div>

      <div className="divide-y divide-slate-200 p-2 space-y-2">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-1">
            <Skeleton className="w-5 h-5 rounded shrink-0" highContrast={highContrast} />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3.5 w-1/3" highContrast={highContrast} />
              <Skeleton className="h-2.5 w-1/4" highContrast={highContrast} />
            </div>
            <Skeleton className="h-3 w-24 hidden sm:block" highContrast={highContrast} />
            <Skeleton className="h-4 w-32 hidden md:block" highContrast={highContrast} />
            <Skeleton className="h-4 w-16" highContrast={highContrast} />
            <Skeleton className="h-6 w-16 rounded" highContrast={highContrast} />
          </div>
        ))}
      </div>
    </div>
  );
};
