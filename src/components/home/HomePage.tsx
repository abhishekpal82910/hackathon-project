import React from 'react';
import { 
  Box, 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  Database, 
  FileSpreadsheet, 
  Layers, 
  MapPin, 
  Shield, 
  TrendingUp,
  Sparkles 
} from 'lucide-react';
import { CADASTRE_OVERVIEW_STATS } from '../../data/mockStats';
import { ALL_BUILDING_OPTIONS } from '../../data/seedData';
import { NavTabId } from '../common/GovNavbar';
import { getTranslation } from '../../utils/translations';

interface HomePageProps {
  onNavigate: (tab: NavTabId, buildingId?: string) => void;
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, highContrast, language }) => {
  const t = getTranslation(language);

  return (
    <div id="home-page-root" className="space-y-8 pb-12">
      {/* Government Hero Banner */}
      <section 
        id="hero-section"
        className={`border-b py-10 sm:py-14 transition-colors ${
          highContrast 
            ? 'bg-neutral-950 text-white border-yellow-400' 
            : 'bg-gradient-to-b from-[#F0F4F8] to-[#E2E8F0] border-slate-300 text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B3D6B]/10 text-[#0B3D6B] border border-[#0B3D6B]/20 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
                {t.heroBadge}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0B3D6B] leading-tight">
                {t.heroTitle}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
                {t.heroDesc}
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  id="btn-hero-generate-ulpin"
                  onClick={() => onNavigate('generate-ulpin')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded font-bold text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    highContrast
                      ? 'bg-amber-400 text-black hover:bg-amber-300'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-900/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{t.heroCtaGenerate}</span>
                </button>

                <button
                  id="btn-hero-launch-explorer"
                  onClick={() => onNavigate('explorer')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded font-semibold text-sm shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    highContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400'
                      : 'bg-[#0B3D6B] text-white hover:bg-[#082B4D] focus:ring-[#0B3D6B]'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  <span>{t.heroCtaExplorer}</span>
                </button>

                <button
                  id="btn-hero-methodology"
                  onClick={() => onNavigate('methodology')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded font-semibold text-sm border transition-colors focus:outline-none ${
                    highContrast
                      ? 'border-yellow-400 text-yellow-300 hover:bg-neutral-900'
                      : 'border-slate-400 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{language === 'hi' ? '7-चरणीय पाइपलाइन देखें' : 'View 7-Stage Pipeline'}</span>
                </button>

                <button
                  id="btn-hero-reports"
                  onClick={() => onNavigate('reports')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded font-semibold text-sm border transition-colors focus:outline-none ${
                    highContrast
                      ? 'border-yellow-400 text-yellow-300 hover:bg-neutral-900'
                      : 'border-slate-400 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'hi' ? 'भू-अभिलेख पंजीयन (15 पायलट)' : 'Cadastre Register (15 Pilots)'}</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'गणितीय प्रक्रियात्मक 3D ज्यामिति' : 'Deterministic Procedural Geometry'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'नियम-आधारित टोपोलॉजी सत्यापन' : 'Rule-Based Topology Validator'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? '100% स्टैंडअलोन निष्पादन' : '100% Offline Standalone Execution'}</span>
                </div>
              </div>
            </div>

            {/* Right Card: Schema Formula */}
            <div className="lg:col-span-4">
              <div 
                className={`p-5 rounded border shadow-xs space-y-3 ${
                  highContrast 
                    ? 'bg-neutral-900 border-yellow-400 text-white' 
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {language === 'hi' ? 'प्रस्तावित आयतनिक संकेतन' : 'Proposed Volumetric Notation'}
                  </span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">ISO 19152 LADM</span>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-600 font-medium">
                    {language === 'hi' ? 'भू-आधार 3D ऊर्ध्वाधर पहचानकर्ता सूत्र:' : 'Bhu-Aadhaar 3D Vertical Identifier Formula:'}
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#0B3D6B] bg-slate-100 p-2.5 rounded border border-slate-200 text-center tracking-tight">
                    <span className="text-slate-900">23MP0412034521</span>
                    <span className="text-blue-600">-B07</span>
                    <span className="text-amber-600">-F04</span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-600 pt-1">
                  <p>• <strong className="text-slate-800">{language === 'hi' ? '14-अंकीय आधार:' : '14-Char Base:'}</strong> {language === 'hi' ? 'सतही भू-खंड पहचान संख्या (DoLR ULPIN मानक)' : 'Surface Cadastral Parcel ID (DoLR ULPIN standard).'}</p>
                  <p>• <strong className="text-blue-700">{language === 'hi' ? 'भवन इकाई:' : 'Building Unit:'}</strong> <code className="bg-slate-100 px-1 py-0.5">B01..B15</code> {language === 'hi' ? 'विशिष्ट भवन ब्लॉक' : 'discrete building mass.'}</p>
                  <p>• <strong className="text-amber-700">{language === 'hi' ? 'तल परत:' : 'Level Strata:'}</strong> <code className="bg-slate-100 px-1 py-0.5">F01..F10</code> ({language === 'hi' ? 'भूतल से ऊपर' : 'Above Grade'}), <code className="bg-slate-100 px-1 py-0.5">B01..B02</code> ({language === 'hi' ? 'भूमिगत बेसमेंट' : 'Sub-grade Basement'}).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics Grid */}
      <section id="statistics-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-300 rounded bg-white shadow-xs overflow-hidden">
          <div className="bg-[#0B3D6B] text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
            <span>{language === 'hi' ? 'पायलट बेंचमार्क संकेतक (DILRMP भू-अभिलेख आधुनिकीकरण)' : 'PILOT BENCHMARK INDICATORS (DILRMP CADASTRE MODERNIZATION)'}</span>
            <span className="text-[11px] text-slate-200">{language === 'hi' ? 'पंजीयन रिकॉर्ड से सिंक्रनाइज़्ड' : 'Synchronized with Seed Registry'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-200">
            <div className="p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'डिजिटलीकृत भू-खंड' : 'Parcels Digitized'}</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#0B3D6B] mt-1">{CADASTRE_OVERVIEW_STATS.parcelsDigitized}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'hi' ? 'सतही भू-अभिलेख' : 'Surface Cadastre'}</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'मानचित्रित भवन' : 'Buildings Mapped'}</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#0B3D6B] mt-1">{CADASTRE_OVERVIEW_STATS.buildingsMapped}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">{language === 'hi' ? '100% प्रक्रियात्मक' : '100% Procedural'}</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'ऊर्ध्वाधर तल' : 'Vertical Strata'}</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#0B3D6B] mt-1">{CADASTRE_OVERVIEW_STATS.verticalLevelsResolved}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'hi' ? '12 तल / भवन' : '12 Levels / Building'}</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'नगर क्षेत्र' : 'Jurisdictions'}</div>
              <div className="text-lg sm:text-xl font-extrabold text-[#0B3D6B] mt-1">{CADASTRE_OVERVIEW_STATS.statesCovered}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'hi' ? '10 प्रमुख शहर' : '10 Real Cities'}</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'विवाद निवारण' : 'Dispute Reduction'}</div>
              <div className="text-lg sm:text-xl font-extrabold text-emerald-700 mt-1">{CADASTRE_OVERVIEW_STATS.disputeReductionRate}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'hi' ? 'अनुमानित प्रभाव' : 'Projected Impact'}</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">{language === 'hi' ? 'ऊंचाई सटीकता (RMS)' : 'Elevation RMS'}</div>
              <div className="text-lg sm:text-xl font-extrabold text-blue-700 mt-1">{CADASTRE_OVERVIEW_STATS.surveyAccuracyCm}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{language === 'hi' ? 'सर्वेक्षण परिशुद्धता' : 'Survey Precision'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Primer: 2D Surface vs 3D Volumetric Cadastre */}
      <section id="primer-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-lg font-bold text-[#0B3D6B]">
              {language === 'hi' 
                ? 'ऊर्ध्वाधर भू-अभिलेख की आवश्यकता क्यों? पारंपरिक 2D भू-अभिलेखों की सीमाएं' 
                : 'Why Vertical Cadastre? The Limitations of Traditional 2D Land Records'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {language === 'hi'
                ? 'भारतीय महानगरों में समतल भू-खंड बहुभुजों से आगे बढ़कर 3D स्थानिक विन्यास में अभिलेखन अनिवार्य है।'
                : 'Urban transformation in Indian metropolises requires moving beyond flat parcel polygons to 3D spatial envelopes.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Left: Traditional 2D */}
            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                {language === 'hi' ? 'पारंपरिक 2D भू-अभिलेख (केवल सतही प्लॉट)' : 'Conventional 2D Cadastre (Surface Parcel Only)'}
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>{language === 'hi' ? 'एकल सतही ULPIN:' : 'Single Surface ULPIN:'}</strong> {language === 'hi' ? 'सभी 10 मंजिलों और बेसमेंटों का केवल एक ही भू-खंड पहचान संख्या में समा जाना।' : 'All 10 floors and subterranean basements collapse into one ground parcel ID.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>{language === 'hi' ? 'अस्पष्ट स्वामित्व विभाजन:' : 'Ambiguous Strata Ownership:'}</strong> {language === 'hi' ? 'मंजिल-वार बिक्री, बंधक एवं अविभाजित शेयर (UDS) में दोहरे पंजीकरण व धोखाधड़ी का जोखिम।' : 'Floor-wise sales, mortgages, and undivided shares of land (UDS) are prone to fraudulent multiple registries.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span><strong>{language === 'hi' ? 'भूमिगत संरचनाओं की अनदेखी:' : 'Sub-grade Blindness:'}</strong> {language === 'hi' ? 'भूमिगत पार्किंग और मेट्रो मार्ग जैसे बुनियादी ढांचों के कानूनी अधिकारों का स्पष्ट सीमांकन न होना।' : 'Underground parking and municipal infrastructure easements lack spatial legal delineation.'}</span>
                </li>
              </ul>
            </div>

            {/* Right: Proposed 3D */}
            <div className="p-4 bg-emerald-50 rounded border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                {language === 'hi' ? 'प्रस्तावित 3D ULPIN प्रणाली (आयतनिक तल पंजीयन)' : 'Proposed 3D ULPIN System (Volumetric Strata Registry)'}
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span><strong>{language === 'hi' ? 'अद्वितीय ऊर्ध्वाधर ULPIN:' : 'Unique Vertical ULPIN:'}</strong> {language === 'hi' ? 'प्रत्येक तल (F01–F10) एवं बेसमेंट (B01–B02) को अपना अलग स्थायी पहचानकर्ता मिलता है।' : 'Every individual floor (F01–F10) and basement (B01–B02) receives a unique immutable identifier.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span><strong>{language === 'hi' ? 'स्थानिक ऊंचाई विस्तार:' : 'Spatial Elevation Envelope:'}</strong> {language === 'hi' ? 'निश्चित ऊंचाई सीमाएँ (जैसे 10.2 मी से 13.6 मी) 3D यूक्लिडियन स्पेस में अधिकार तय करती हैं।' : 'Definite height ranges (e.g. 10.2m to 13.6m) legally bound each title in 3D Euclidean space.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span><strong>{language === 'hi' ? 'स्वचालित टोपोलॉजी सत्यापन:' : 'Automated Topology Validation:'}</strong> {language === 'hi' ? 'ऊर्ध्वाधर ओवरलैप या कैंटिलीवर अतिक्रमण का तत्काल नियम-आधारित पता लगाना।' : 'Immediate rule-based detection of cantilever encroachments or elevation overlaps.'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 15 Seeded Buildings Directory Preview */}
      <section id="pilots-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-lg font-bold text-[#0B3D6B]">
                {language === 'hi' ? '15 पूर्व-दर्ज पायलट भवन (10 भारतीय शहर)' : '15 Seeded Pilot Buildings (10 Indian Cities)'}
              </h3>
              <p className="text-xs text-slate-600">
                {language === 'hi' ? '3D भू-अभिलेख अन्वेषक में सीधे खोलने हेतु नीचे दिए गए किसी भी भवन पर क्लिक करें।' : 'Select any seeded building below to open directly in the 3D Cadastre Explorer.'}
              </p>
            </div>
            <button
              id="btn-explore-all-pilots"
              onClick={() => onNavigate('explorer')}
              className="text-xs font-semibold text-[#0B3D6B] hover:underline flex items-center gap-1"
            >
              <span>{language === 'hi' ? '3D दर्शक में देखें' : 'Explore in 3D Viewer'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALL_BUILDING_OPTIONS.slice(0, 9).map((b) => (
              <button
                key={b.id}
                id={`btn-home-building-${b.id}`}
                onClick={() => onNavigate('explorer', b.id)}
                className="text-left p-3 rounded border border-slate-200 hover:border-[#0B3D6B] hover:bg-slate-50 transition-all group focus:outline-none focus:ring-1 focus:ring-[#0B3D6B]"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-mono font-semibold text-[#0B3D6B]">{b.id}</span>
                  <span className="capitalize px-1.5 py-0.5 rounded bg-slate-100 text-[10px]">
                    {b.footprint_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-semibold text-sm text-slate-900 group-hover:text-[#0B3D6B] truncate">
                  {b.name}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{b.city}, {b.state}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  {language === 'hi' ? 'मूल ULPIN:' : 'Base:'} {b.ulpin_base}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 text-center sm:text-right">
            <button
              id="btn-view-full-cadastre-register"
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-[#0B3D6B] underline hover:text-[#002244]"
            >
              {language === 'hi' 
                ? 'सभी 15 भवनों का पूर्ण भू-अभिलेख पंजीयन देखें (180 कुल तल रिकॉर्ड) →' 
                : 'View Full 15-Building Cadastre Register (180 Total Strata Records) →'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

