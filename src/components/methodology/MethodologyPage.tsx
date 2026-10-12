import React from 'react';
import { 
  CheckCircle2, 
  GitBranch, 
  Layers, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  Cpu, 
  Box, 
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { PIPELINE_STAGES } from '../../data/mockStats';

interface MethodologyPageProps {
  highContrast: boolean;
  language: 'en' | 'hi';
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ highContrast, language }) => {
  const isHi = language === 'hi';

  const pipelineTranslations = [
    {
      title: isHi ? 'ड्रोन फोटोग्रामेट्री सर्वेक्षण' : 'Drone Photogrammetry Acquisition',
      desc: isHi 
        ? 'उच्च-परिशुद्धता ड्रोन कैमरों द्वारा 80% ओवरलैप के साथ 3D स्थलाकृतिक इमेजरी का संकलन।'
        : 'High-overlap aerial RGB capture producing sub-centimeter ground sampling distance.'
    },
    {
      title: isHi ? 'सघन बिंदु मेघ (Point Cloud)' : 'Dense Point Cloud Reconstruction',
      desc: isHi 
        ? 'स्ट्रक्चर-फ्रॉम-मोशन (SfM) अल्गोरिदम द्वारा लाखों 3D बिंदुओं में भवन समन्वय स्थापित करना।'
        : 'Structure-from-Motion (SfM) photogrammetry matching millions of sparse feature ties.'
    },
    {
      title: isHi ? 'AI भवन बाह्यरेखा निष्कर्षण' : 'AI Footprint Segmentation',
      desc: isHi 
        ? 'सतही भू-खंड बहुभुज से भवन पदचिह्न का स्वचालित पहचान एवं परिधि सीमांकन।'
        : 'Deep learning semantic boundary extraction isolating ground parcel polygon boundaries.'
    },
    {
      title: isHi ? 'ऊर्ध्वाधर आयतनिक स्लाइसिंग' : 'Volumetric Strata Slicing',
      desc: isHi 
        ? 'भूतल से ऊपर (F01–F10) तथा भूमिगत (B01–B02) तलों में सटीक ऊंचाई विभाजन।'
        : 'Procedural height extrusion partitioning above-ground and basement strata envelopes.'
    },
    {
      title: isHi ? '3D ULPIN पहचानकर्ता जनरेशन' : '3D ULPIN Vertical Synthesis',
      desc: isHi 
        ? '14-अंकीय आधार ULPIN के साथ भवन कोड (-B07) और तल कोड (-F04) का संयोजन।'
        : 'Deterministic derivation encoding state, district, tehsil, parcel, building, and floor.'
    },
    {
      title: isHi ? 'गणितीय टोपोलॉजी सत्यापन' : 'Rule-Based Topology Validation',
      desc: isHi 
        ? 'ऊर्ध्वाधर ओवरलैप, कैंटिलीवर विस्तार (>5%), एवं विधिक सीमाओं का तत्काल ऑडिट।'
        : 'Euclidean geometric containment checks catching vertical collisions and overhangs.'
    },
    {
      title: isHi ? 'DILRMP पंजीयन व विलेख' : 'DILRMP Cadastral Ledgering',
      desc: isHi 
        ? 'राज्य राजस्व प्रणाली में डिजिटल 3D विलेख, FAR और स्वामित्व का स्थायी पंजीकरण।'
        : 'State land registry ledger integration with certified 3D property deed records.'
    }
  ];

  return (
    <div id="methodology-page-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-16">
      {/* Title & Introduction */}
      <section id="methodology-intro" className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0B3D6B]/10 text-[#0B3D6B] text-xs font-semibold">
          {isHi ? 'भूमि संसाधन विभाग (DoLR) • डीआईएलआरएमपी प्रौद्योगिकी विज़न' : 'Department of Land Resources (DoLR) • DILRMP Technology Vision'}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0B3D6B]">
          {isHi ? 'कार्यप्रणाली एवं वैचारिक 3D भू-अभिलेख पाइपलाइन' : 'Methodology & Conceptual 3D Cadastre Pipeline'}
        </h2>
        <p className="text-sm sm:text-base text-slate-700 max-w-4xl leading-relaxed">
          {isHi 
            ? '3D विशिष्ट भू-खंड पहचान संख्या (3D ULPIN) भारत सरकार के भू-आधार (Bhu-Aadhaar) ढांचे को समतल 2D भू-खंड बहुभुजों से आगे बढ़ाकर त्रि-आयामी (3D) आयतनिक परतों में विस्तारित करती है। यह प्रोटोटाइप दर्शाता है कि फोटोग्रामेट्रिक सर्वेक्षण, भवन द्रव्यमान मॉडलिंग, एवं ज्यामितीय नियमों द्वारा किस प्रकार आधिकारिक 3D भू-अभिलेख इकाइयां स्थापित की जाती हैं।'
            : 'The 3D Unique Land Parcel Identification Number (3D ULPIN) extends the Government of India’s Bhu-Aadhaar framework from planar 2D land polygons into three-dimensional strata volumes. This architectural prototype models how photogrammetric surveys, AI building massing, and deterministic geometric rules establish volumetric cadastre units.'}
        </p>
      </section>

      {/* Illustrative Pipeline Disclaimer */}
      <div 
        className={`p-4 rounded border flex items-start gap-3 text-xs ${
          highContrast
            ? 'bg-neutral-900 border-yellow-400 text-yellow-300'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm">
            {isHi ? 'प्रोटोटाइप पाइपलाइन सूचना एवं प्रमाणन' : 'Illustrative / Simulated Processing Pipeline Notice'}
          </div>
          <p>
            {isHi 
              ? 'हैकाथॉन प्रोटोटाइप मानकों के अंतर्गत, नीचे दर्शाई गई 7-चरणीय पाइपलाइन वास्तविक ड्रोन लिडार (LiDAR) एवं फोटोग्रामेट्री वर्कफ़्लो का सिमुलेशन है। इस एप्लिकेशन का टोपोलॉजी सत्यापन इंजन प्रक्रियात्मक ज्यामिति पर वास्तविक गणितीय गणनाएँ (Euclidean overlap, bounding box test) निष्पादित करता है।'
              : 'In compliance with hackathon prototype constraints, the 7-stage pipeline and confidence scores below are illustrative representations simulating real-world LiDAR and photogrammetry workflows. No live drone sensors, external cloud computing clusters, or CORS feeds are contacted. The topology rule-based validation engine in this app, however, executes real mathematical verification against the seeded geometry.'}
          </p>
        </div>
      </div>

      {/* 7-Stage Pipeline Visual Flow */}
      <section id="pipeline-stages" className="space-y-6">
        <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0B3D6B] flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            {isHi ? '7-चरणीय ऊर्ध्वाधर भू-खंड निष्कर्षण एवं सत्यापन पाइपलाइन' : '7-Stage Vertical Parcel Extraction & Verification Pipeline'}
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {isHi ? 'प्रक्रियात्मक वर्कफ़्लो' : 'SIMULATED WORKFLOW'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const translated = pipelineTranslations[idx] || { title: stage.title, desc: stage.description };
            return (
              <div
                key={stage.step}
                id={`pipeline-step-${stage.step}`}
                className="bg-white border border-slate-300 rounded p-3.5 flex flex-col justify-between space-y-3 shadow-xs hover:border-[#0B3D6B] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-white bg-[#0B3D6B] w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                      {stage.step}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {stage.shortCode}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    {translated.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {translated.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{isHi ? 'दक्षता सूचकांक' : stage.metricLabel}:</span>
                    <strong className="text-slate-800 font-mono">{stage.metricValue}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">{isHi ? 'विश्वास स्तर:' : 'Confidence:'}</span>
                    <span className="font-bold font-mono text-emerald-700">
                      {stage.simulatedConfidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${stage.simulatedConfidence}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Volumetric Cadastre Vision & Benefits */}
      <section id="vision-pillars" className="space-y-6">
        <div className="border-b border-slate-300 pb-2">
          <h3 className="text-lg font-bold text-[#0B3D6B]">
            {isHi ? 'रणनीतिक विज़न: 3D आयतनिक भू-अभिलेख के लाभ' : 'Strategic Vision: Volumetric Cadastre Impact'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded bg-blue-100 text-[#0B3D6B] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              {isHi ? 'विवाद निवारण एवं स्पष्ट स्वामित्व विलेख' : 'Dispute Elimination & Clear Title'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi 
                ? 'पारंपरिक 2D अभिलेख बहुमंजिला भवनों को अविभाजित भूमि शेयर (UDS) के भरोसे छोड़ते हैं। 3D ऊर्ध्वाधर ULPIN ऊपरी व निचली निश्चित ऊंचाई सीमाओं के साथ कानूनी स्पष्टता प्रदान करता है, जिससे दोहरे बंधक व धोखाधड़ी रुकती है।'
                : 'Standard 2D records leave high-rise apartment units reliant on ambiguous undivided land share (UDS). A 3D vertical ULPIN provides legal certainty with defined upper/lower elevation surfaces, preventing duplicate mortgaging and encroachment.'}
            </p>
          </div>

          <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Box className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              {isHi ? 'भूमिगत अवसंरचना एवं बेसमेंट प्रबंधन' : 'Subterranean Cadastre Management'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi 
                ? 'भूमिगत पार्किंग, मेट्रो रेल सुरंगों, एवं नागरिक पाइपलाइन मार्गों को बिना किसी कानूनी ओवरलैप के सतही संपत्तियों के नीचे स्पष्ट रूप से सीमांकित किया जा सकता है।'
                : 'Sub-surface facilities (underground car parking, metro transit tunnels, civic utility shafts) can be cleanly delineated beneath surface property titles without legal overlap or unmapped void spaces.'}
            </p>
          </div>

          <div className="bg-white border border-slate-300 rounded p-5 shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              {isHi ? 'नगर निगम कराधान एवं स्मार्ट सिटीज' : 'Municipal Taxation & Smart Cities'}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi 
                ? 'स्वीकृत ऊर्ध्वाधर उपयोग के आधार पर संपत्ति कर निर्धारण, FAR अनुपालन ऑडिट, और शहरी स्थानीय निकायों (ULB) के लिए डिजिटल ट्विन एकीकरण को सुगम बनाता है।'
                : 'Automates floor-area-ratio (FAR) compliance audits, property tax assessments based on sanctioned vertical usage, and seamless digital twin integration for urban local bodies (ULBs).'}
            </p>
          </div>
        </div>
      </section>

      {/* Real vs Simulated Comparison Table */}
      <section id="real-vs-simulated" className="bg-white border border-slate-300 rounded p-6 shadow-xs space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-[#0B3D6B]">
          {isHi ? 'प्रोटोटाइप वास्तुकला: वास्तविक बनाम सिमुलेटेड घटक' : 'SIH Prototype Architecture: Real vs. Simulated Components'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border border-slate-200 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
              <tr>
                <th className="p-3">{isHi ? 'घटक / स्तर' : 'Component / Layer'}</th>
                <th className="p-3">{isHi ? 'प्रोटोटाइप स्थिति' : 'Status in this Prototype'}</th>
                <th className="p-3">{isHi ? 'कार्यान्वयन विवरण' : 'Implementation Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-900">{isHi ? '3D प्रक्रियात्मक ज्यामिति' : '3D Procedural Geometry'}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{isHi ? '100% वास्तविक' : '100% Real'}</span></td>
                <td className="p-3">{isHi ? 'WebGL पर रेंडर होने वाले थ्री.जेएस बॉक्स, एल-शेप, यू-शेप और सिलेंडर मेश।' : 'Procedural Three.js box, L-shape, U-shape, Plus-shape, and cylinder meshes rendered client-side on WebGL.'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">{isHi ? 'नियम-आधारित टोपोलॉजी सत्यापन' : 'Rule-Based Topology Validator'}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{isHi ? '100% वास्तविक' : '100% Real'}</span></td>
                <td className="p-3">{isHi ? 'बाउंडिंग बॉक्स ओवरलैप, कैंटिलीवर विस्तार (>5%), और जोनिंग नियमों का प्रामाणिक गणितीय सत्यापन।' : 'Authentic mathematical validation of bounding box overlap, cantilever overflow (>5%), and zoning logic.'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">{isHi ? 'ULPIN संकेतन सूत्र' : 'ULPIN Indexing Formula'}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{isHi ? 'प्रस्तावित मानक' : 'Proposed Standard'}</span></td>
                <td className="p-3">{isHi ? '14-अंकीय सतही ULPIN के साथ भवन ब्लॉक व तल कोड (उदा. 23MP0412034521-B07-F04)।' : '14-character surface ULPIN extended with building unit code and level designator (e.g. 23MP0412034521-B07-F04).'}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">{isHi ? 'ड्रोन फोटोग्रामेट्री एवं पॉइंट क्लाउड्स' : 'Drone Photogrammetry & Point Clouds'}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">{isHi ? 'सिमुलेटेड' : 'Simulated'}</span></td>
                <td className="p-3">{isHi ? 'बेंचमार्क मेट्रिक्स के साथ उदाहरणात्मक कार्यप्रवाह; बिना किसी बाहरी क्लाउड पर निर्भरता के पूर्णतः ऑफलाइन निष्पादन।' : 'Illustrated conceptual workflow with benchmark confidence metrics; runs fully offline with zero external cloud dependencies.'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

