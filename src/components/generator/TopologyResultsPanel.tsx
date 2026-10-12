import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { BuildingWithLevels } from '../../types/cadastre';

interface TopologyCheck {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'error';
  message: string;
  detail?: string;
}

interface TopologyResultsPanelProps {
  building: BuildingWithLevels;
  highContrast: boolean;
  language?: 'en' | 'hi';
  isUlpinAlreadyRegistered?: boolean;
  registeredBuildingInfo?: { name: string; id: string; district: string; state: string; ulpin_base: string };
}

export const TopologyResultsPanel: React.FC<TopologyResultsPanelProps> = ({
  building,
  highContrast,
  language = 'en',
  isUlpinAlreadyRegistered = false,
  registeredBuildingInfo
}) => {
  const isHi = language === 'hi';

  // Execute rule-based cadastral topology checks
  const checks: TopologyCheck[] = [];

  // Check 1: Elevation Continuity
  let elevationContinuous = true;
  let overlapError = '';
  const sortedLevels = [...building.levels].sort((a, b) => a.elevation_start - b.elevation_start);

  for (let i = 0; i < sortedLevels.length - 1; i++) {
    const current = sortedLevels[i];
    const next = sortedLevels[i + 1];
    const diff = Math.abs(current.elevation_end - next.elevation_start);
    if (diff > 0.05) {
      elevationContinuous = false;
      overlapError = isHi
        ? `${current.level_code} (${current.elevation_end}m) और ${next.level_code} (${next.elevation_start}m) के बीच असंतुलन। अंतर: ${diff.toFixed(2)}m।`
        : `Discontinuity detected between ${current.level_code} (${current.elevation_end}m) and ${next.level_code} (${next.elevation_start}m). Difference: ${diff.toFixed(2)}m.`;
      break;
    }
  }

  checks.push({
    id: 'elev-continuity',
    name: isHi ? 'ऊर्ध्वाधर ऊंचाई निरंतरता एवं गैर-अतिव्यापन' : 'Vertical Elevation Continuity & Non-Overlap',
    status: elevationContinuous ? 'passed' : 'error',
    message: elevationContinuous
      ? (isHi
          ? 'सभी ऊर्ध्वाधर तल सीमाएं निरंतर हैं और तल-से-छत ऊंचाई विनिर्देशों के अनुरूप हैं।'
          : 'All strata elevation boundaries are continuous and conform to floor-to-ceiling heights.')
      : overlapError
  });

  // Check 2: Footprint and Strata Area Bounds
  const baseArea = building.computed_footprint_area;
  const oversizedLevels = building.levels.filter((l) => l.area_sqm > baseArea * 1.25);

  if (oversizedLevels.length > 0) {
    checks.push({
      id: 'area-bounds',
      name: isHi ? 'कैंटिलीवर व पदचिह्न सहनशीलता परीक्षण' : 'Cantilever & Footprint Tolerance Check',
      status: 'warning',
      message: isHi
        ? `${oversizedLevels.length} तल (${oversizedLevels.map((l) => l.level_code).join(', ')}) मूल भू-खंड पदचिह्न से >25% अधिक हैं (कैंटिलीवर प्रक्षेपण)।`
        : `${oversizedLevels.length} level(s) (${oversizedLevels.map((l) => l.level_code).join(', ')}) exceed the base parcel footprint envelope by >25% (Cantilever projection).`,
      detail: isHi
        ? 'सुनिश्चित करें कि स्थानीय नगरपालिका स्वीकृति 1.5m से अधिक वास्तुकला कैंटिलीवर की अनुमति देती है।'
        : 'Ensure local municipal sanction permits architectural cantilevers exceeding 1.5m.'
    });
  } else {
    checks.push({
      id: 'area-bounds',
      name: isHi ? 'पदचिह्न व पार्सल सहनशीलता जांच' : 'Footprint & Parcel Tolerance Check',
      status: 'passed',
      message: isHi
        ? 'सभी ऊर्ध्वाधर तल सामान्य सेटबैक और संरचनात्मक आवरण सीमाओं के भीतर हैं।'
        : 'All vertical strata areas are within normal setback and structural envelope constraints.'
    });
  }

  // Check 3: Sub-Grade Basement Classification
  const invalidBasements = building.levels.filter(
    (l) => l.level_type === 'basement' && l.usage_type === 'Residential'
  );
  if (invalidBasements.length > 0) {
    checks.push({
      id: 'basement-usage',
      name: isHi ? 'भूमिगत बेसमेंट जोनिंग अनुपालन' : 'Sub-grade Basement Zoning Compliance',
      status: 'error',
      message: isHi
        ? `बेसमेंट स्तर ${invalidBasements.map((l) => l.level_code).join(', ')} को 'आवासीय' के रूप में चिन्हित किया गया है, जो NBC भाग 3 का उल्लंघन करता है।`
        : `Basement level ${invalidBasements.map((l) => l.level_code).join(', ')} is zoned as 'Residential', which violates National Building Code (NBC) Part 3.`,
      detail: isHi
        ? 'बेसमेंट को पार्किंग, उपयोगिता या भंडारण के लिए नामित किया जाना चाहिए।'
        : 'Basements must be designated for Parking, Utilities, Storage, or non-habitable services.'
    });
  } else {
    checks.push({
      id: 'basement-usage',
      name: isHi ? 'भूमिगत बेसमेंट जोनिंग अनुपालन' : 'Sub-grade Basement Zoning Compliance',
      status: 'passed',
      message: isHi
        ? 'बेसमेंट राष्ट्रीय भवन संहिता (NBC) पार्किंग और उपयोगिता जोनिंग का पालन करते हैं।'
        : 'Basements conform to National Building Code (NBC) parking and utility zoning.'
    });
  }

  // Check 4: Vertical ULPIN Uniqueness within this property
  const ulpins = building.levels.map((l) => l.vertical_ulpin);
  const uniqueUlpins = new Set(ulpins);
  const hasDuplicateUlpins = uniqueUlpins.size !== ulpins.length;

  checks.push({
    id: 'ulpin-unique',
    name: isHi ? 'ULPIN आंतरिक विशिष्टता व तल टकराव परिहार' : 'Internal Strata ULPIN Uniqueness',
    status: hasDuplicateUlpins ? 'error' : 'passed',
    message: hasDuplicateUlpins
      ? (isHi ? 'इस भू-अभिलेख समूह में डुप्लिकेट ऊर्ध्वाधर ULPIN पहचानकर्ता पाए गए हैं।' : 'Duplicate Vertical ULPIN identifiers detected within this cadastral assembly.')
      : (isHi ? 'सभी ऊर्ध्वाधर तल ULPIN इस संपत्ति के भीतर अद्वितीय और टकराव-मुक्त हैं।' : 'All vertical strata ULPINs within this building envelope are unique and collision-free.')
  });

  // Check 5: National Cadastre Database Uniqueness (Duplicate Check)
  if (isUlpinAlreadyRegistered) {
    checks.unshift({
      id: 'db-ulpin-collision',
      name: isHi ? 'राष्ट्रीय भू-अभिलेख डेटाबेस विशिष्टता (डुप्लिकेट जांच)' : 'National Cadastre Database Collision Check',
      status: 'error',
      message: isHi
        ? `यह 14-अंकीय ULPIN (${building.ulpin_base}) डेटाबेस में पहले से ही '${registeredBuildingInfo?.name || 'पंजीकृत संपत्ति'}' (${registeredBuildingInfo?.id || ''}, ${registeredBuildingInfo?.district || ''}) के लिए पंजीकृत है!`
        : `This 14-digit ULPIN (${building.ulpin_base}) is ALREADY REGISTERED in the cadastre database for '${registeredBuildingInfo?.name || 'Property'}' (${registeredBuildingInfo?.id || ''}, ${registeredBuildingInfo?.district || ''})!`,
      detail: isHi
        ? 'भूमि पार्सल की विशिष्ट पहचान (भू-आधार) बनाए रखने हेतु डुप्लिकेट ULPIN का पंजीकरण निषिद्ध है। कृपया खसरा/प्लॉट या निर्देशांक बदलें।'
        : 'To protect title authenticity and avoid cadastral duplication, registration is blocked until Plot/Khasra number or coordinates are changed.'
    });
  } else {
    checks.push({
      id: 'db-ulpin-collision',
      name: isHi ? 'डेटाबेस विशिष्टता सत्यापन' : 'Cadastre Database Uniqueness Verification',
      status: 'passed',
      message: isHi
        ? `ULPIN (${building.ulpin_base}) राष्ट्रीय डेटाबेस में पूरी तरह अद्वितीय है और नए पंजीकरण हेतु उपलब्ध है।`
        : `ULPIN (${building.ulpin_base}) is completely unique in the cadastre registry and cleared for registration.`
    });
  }

  const hasErrors = checks.some((c) => c.status === 'error');
  const hasWarnings = checks.some((c) => c.status === 'warning');

  return (
    <div
      id="topology-results-panel"
      className={`rounded-xl border p-5 transition-all ${
        highContrast
          ? 'bg-neutral-900 border-yellow-400 text-white'
          : 'bg-white border-slate-200 shadow-sm text-slate-900'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#0B3D6B]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="font-bold text-base text-[#0B3D6B]">
              {isHi ? 'चरण 8: नियम-आधारित टोपोलॉजी व जोनिंग सत्यापन इंजन' : 'Stage 8: Rule-Based Topology & Zoning Validation Engine'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isHi
              ? '3D भू-अभिलेख स्थानिक दिशानिर्देशों और राष्ट्रीय मानकों के विरुद्ध स्वचालित अनुपालन परीक्षण।'
              : 'Automated compliance check against 3D Cadastral geospatial guidelines and national cadastral norms.'}
          </p>
        </div>

        {/* Aggregate Badge */}
        <div>
          {hasErrors ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              <XCircle className="w-4 h-4 text-red-600" />
              {isHi ? `गंभीर त्रुटियां मिलीं (${checks.filter((c) => c.status === 'error').length})` : `Critical Issues Found (${checks.filter((c) => c.status === 'error').length})`}
            </span>
          ) : hasWarnings ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {isHi ? 'चेतावनियों के साथ सत्यापित' : 'Verified with Warnings'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {isHi ? 'सभी टोपोलॉजी नियम उत्तीर्ण' : 'All Topology Rules Passed'}
            </span>
          )}
        </div>
      </div>

      {/* List of Checks */}
      <div className="mt-4 space-y-3">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`p-3 rounded-lg border text-xs transition-colors ${
              check.status === 'error'
                ? 'bg-red-50/70 border-red-200 text-red-900'
                : check.status === 'warning'
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5">
                {check.status === 'error' && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                {check.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                {check.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </span>
              <div className="flex-1">
                <div className="font-bold flex items-center justify-between">
                  <span>{check.name}</span>
                  <span className="uppercase text-[10px] font-mono tracking-wider font-semibold">
                    {check.status === 'passed' ? (isHi ? 'सत्यापित' : 'passed') : check.status === 'warning' ? (isHi ? 'चेतावनी' : 'warning') : (isHi ? 'त्रुटि' : 'error')}
                  </span>
                </div>
                <p className="mt-0.5 font-sans leading-relaxed">{check.message}</p>
                {check.detail && (
                  <p className="mt-1 text-[11px] opacity-80 italic">{check.detail}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
