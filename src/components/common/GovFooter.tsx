import React from 'react';
import { AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface GovFooterProps {
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const GovFooter: React.FC<GovFooterProps> = ({ highContrast, language }) => {
  return (
    <footer
      id="gov-footer"
      className={`border-t shrink-0 transition-colors mt-auto ${
        highContrast
          ? 'bg-black text-white border-yellow-400'
          : 'bg-white text-slate-600 border-slate-300'
      }`}
    >
      {/* Disclaimer Banner */}
      <div className={`${highContrast ? 'bg-neutral-900 border-b border-yellow-400/40 text-yellow-300' : 'bg-slate-100 border-b border-slate-200 text-slate-600'} px-4 py-1.5 text-[10px]`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p>
              <strong className="font-semibold text-slate-800">Smart India Hackathon (SIH) Prototype:</strong>{' '}
              {language === 'hi'
                ? 'यह 3D यूएलपीआईएन प्रणाली एक संकल्पनात्मक शोध प्रोटोटाइप है। ऊर्ध्वाधर प्रारूप प्रस्तावित है।'
                : 'Offline demonstration prototype for SIH. Vertical ULPIN indexing schema is a proposed research extension of Bhu-Aadhaar.'}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 shrink-0">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>GIGW 3.0 Aligned</span>
          </div>
        </div>
      </div>

      {/* Main High-Density Footer Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 gap-2">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-800 cursor-pointer">Terms & Conditions</span>
          <span>•</span>
          <span>Copyright © {new Date().getFullYear()} Department of Land Resources (DoLR)</span>
        </div>
        <div className="font-medium italic text-slate-600 text-center">
          Content owned by Ministry of Rural Development, Government of India
        </div>
        <div className="font-mono">
          Last Updated: 24 Oct 2024
        </div>
      </div>
    </footer>
  );
};
