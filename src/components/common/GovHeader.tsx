import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import mordLogo from '../../assets/images/mord_india_logo_1788602610853.jpg';

interface GovHeaderProps {
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const GovHeader: React.FC<GovHeaderProps> = ({ highContrast, language }) => {
  return (
    <header 
      id="gov-main-header"
      className={`border-b shrink-0 ${
        highContrast 
          ? 'bg-black text-white border-yellow-400' 
          : 'bg-white text-slate-900 border-slate-300'
      }`}
    >
      {/* Top subtle tri-color accent line */}
      <div className="h-1 w-full flex" aria-hidden="true">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Emblem & Ministry Info */}
          <div className="flex items-center gap-3.5">
            {/* National Emblem of India / Ministry of Rural Development Logo */}
            <div 
              id="gov-emblem-logo"
              className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 rounded bg-white p-0.5 border shadow-xs ${
                highContrast 
                  ? 'border-yellow-400 bg-black' 
                  : 'border-slate-300'
              }`}
              title="Ministry of Rural Development, Government of India"
              aria-label="Ministry of Rural Development, Government of India"
            >
              <img
                src={mordLogo}
                alt="State Emblem of India - Ministry of Rural Development, Government of India"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-contain ${
                  highContrast ? 'invert contrast-125' : 'mix-blend-multiply'
                }`}
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase tracking-tighter">
                {language === 'hi' ? 'भारत सरकार • Government of India' : 'Government of India'}
              </div>
              <div className="text-lg font-bold text-[#0B3D6B] leading-tight">
                {language === 'hi' ? 'ग्रामीण विकास मंत्रालय' : 'Ministry of Rural Development'}
              </div>
              <div className="text-sm font-medium text-slate-500">
                {language === 'hi' 
                  ? 'भूमि संसाधन विभाग (DoLR) • DILRMP' 
                  : 'Department of Land Resources (DoLR)'}
              </div>
            </div>
          </div>

          {/* Portal Title & Prototype Watermark */}
          <div className="text-left md:text-right">
            <div className="text-xl font-black text-[#0B3D6B] tracking-tight uppercase">
              {language === 'hi' ? '3D-ULPIN प्रणाली' : '3D-ULPIN SYSTEM'}
            </div>
            <div className="flex items-center md:justify-end gap-2 mt-1">
              <span className="text-[10px] font-bold bg-[#FF9933] text-white px-2 py-0.5 rounded tracking-wide uppercase">
                PROTOTYPE BUILD V.1.0
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline border-l border-slate-300 pl-2">
                Bhu-Aadhaar 3D
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
