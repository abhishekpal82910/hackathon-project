/**
 * Official Bilingual Localization (English & Hindi) for
 * 3D ULPIN & Vertical Property Mapping System (DoLR / MoRD, GoI)
 */

export type AppLanguage = 'en' | 'hi';

export interface Translations {
  // Utility & A11y
  skipContent: string;
  screenReader: string;
  screenReaderActive: string;
  fontSizeChanged: (lvl: string) => string;
  highContrastStandard: string;
  highContrastActive: string;
  english: string;
  hindi: string;

  // Header
  govIndia: string;
  ministryRuralDev: string;
  deptLandResources: string;
  systemTitle: string;
  systemSubtitle: string;

  // Navbar
  navHome: string;
  navExplorer: string;
  navGenerate: string;
  navMethodology: string;
  navReports: string;

  // Footer
  prototypeNotice: string;
  prototypeDesc: string;
  gigwAligned: string;
  privacyPolicy: string;
  termsConditions: string;
  copyright: string;
  contentOwned: string;
  lastUpdated: string;

  // Home Page
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  heroCtaExplorer: string;
  heroCtaGenerate: string;
  heroCtaReports: string;
  statsProperties: string;
  statsStrata: string;
  statsVolumetric: string;
  statsVerified: string;
  featuresTitle: string;
  featuresSubtitle: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Title: string;
  feat4Desc: string;
  samplesTitle: string;
  samplesSubtitle: string;
  viewBuilding: string;

  // Explorer Page
  searchPlaceholder: string;
  cadastreOverview: string;
  baseUlpin: string;
  floorsAbove: string;
  basementsBelow: string;
  footprintArea: string;
  surveyYear: string;
  shape: string;
  undergroundVis: string;
  show: string;
  hide: string;
  resetView: string;
  verified: string;
  pending: string;
  strataLevelSelector: string;
  selectPrompt: string;
  rotateNotice: string;

  // Level Detail Panel
  levelDetailsTitle: string;
  levelDetailsSubtitle: string;
  verticalUlpin: string;
  copyUlpin: string;
  copied: string;
  volumetricSpace: string;
  heightSpan: string;
  floorArea: string;
  ownershipCategory: string;
  primaryUsage: string;
  estimatedTax: string;
  topologyCheck: string;
  topologyPassed: string;
  subUnitsTitle: string;
  downloadCert: string;

  // Generator Page
  genPageTitle: string;
  genPageSubtitle: string;
  stage1Title: string;
  stage1Desc: string;
  stage2Title: string;
  stage2Desc: string;
  stage3Title: string;
  stage3Desc: string;
  stage4Title: string;
  stage4Desc: string;
  stage5Title: string;
  stage5Desc: string;
  stage6Title: string;
  stage6Desc: string;
  propertyName: string;
  propertyType: string;
  plotNumber: string;
  surveyRef: string;
  ownership: string;
  state: string;
  district: string;
  tehsil: string;
  locality: string;
  ward: string;
  latitude: string;
  longitude: string;
  elevation: string;
  aboveFloors: string;
  belowFloors: string;
  registerBtn: string;
  savingBtn: string;
  regSuccessTitle: string;
  regSuccessDesc: string;
  openInExplorerBtn: string;

  // Methodology Page
  methodTitle: string;
  methodSubtitle: string;
  methodIntro: string;
  pipelineTitle: string;
  pipelineNotice: string;
  pipelineNoticeDesc: string;

  // Reports Page
  reportsTitle: string;
  reportsSubtitle: string;
  totalBuildings: string;
  totalStrataLevels: string;
  verifiedParcels: string;
  pendingParcels: string;
  exportCsvBtn: string;
  searchFilterPlaceholder: string;
  allCities: string;
  filterAll: string;
  filterVerified: string;
  filterPending: string;
  colBuildingName: string;
  colBaseUlpin: string;
  colLocation: string;
  colFloors: string;
  colFootprint: string;
  colStatus: string;
  colActions: string;
}

export const translations: Record<AppLanguage, Translations> = {
  en: {
    // Utility & A11y
    skipContent: 'Skip to main content',
    screenReader: 'SCREEN READER ACCESS',
    screenReaderActive: 'Screen Reader Assistance active. You are viewing the 3D ULPIN & Vertical Property Mapping System portal.',
    fontSizeChanged: (lvl: string) => `Text size changed: ${lvl}`,
    highContrastStandard: 'STANDARD',
    highContrastActive: 'HIGH CONTRAST',
    english: 'ENGLISH',
    hindi: 'हिन्दी',

    // Header
    govIndia: 'Government of India',
    ministryRuralDev: 'Ministry of Rural Development',
    deptLandResources: 'Department of Land Resources (DoLR)',
    systemTitle: '3D-ULPIN SYSTEM',
    systemSubtitle: 'National Geospatial Cadastre & Vertical Land Records Portal',

    // Navbar
    navHome: 'Home',
    navExplorer: '3D Cadastre Explorer',
    navGenerate: 'Generate 3D ULPIN',
    navMethodology: 'Methodology & Standards',
    navReports: 'Volumetric Registry Reports',

    // Footer
    prototypeNotice: 'Smart India Hackathon (SIH) Prototype:',
    prototypeDesc: 'Offline demonstration prototype for SIH. Vertical ULPIN indexing schema is a proposed research extension of Bhu-Aadhaar.',
    gigwAligned: 'GIGW 3.0 Aligned',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    copyright: `Copyright © ${new Date().getFullYear()} Department of Land Resources (DoLR)`,
    contentOwned: 'Content owned by Ministry of Rural Development, Government of India',
    lastUpdated: 'Last Updated: 24 Oct 2024',

    // Home Page
    heroBadge: 'National Geospatial Cadastre Initiative • GIGW 3.0 Aligned',
    heroTitle: '3D ULPIN & Vertical Property Mapping System',
    heroDesc: 'Extending India’s 14-character Unique Land Parcel Identification Number (ULPIN / Bhu-Aadhaar) into the third dimension. Unambiguously delineating vertical ownership rights, commercial strata, and subterranean basements to eliminate title disputes, bolster municipal revenue, and enable volumetric urban planning.',
    heroCtaExplorer: 'Launch 3D Explorer',
    heroCtaGenerate: 'Generate 3D ULPIN',
    heroCtaReports: 'View Registry Reports',
    statsProperties: 'Total Properties Mapped',
    statsStrata: 'Vertical Strata Parcels',
    statsVolumetric: 'Volumetric Space Registered',
    statsVerified: 'Cadastral Topology Verified',
    featuresTitle: 'Foundational Architectural Capabilities',
    featuresSubtitle: 'Engineered for seamless integration with Digital India Land Records Modernization Programme (DILRMP)',
    feat1Title: 'Volumetric Strata Mapping',
    feat1Desc: 'Extends 2D planar polygons into 3D volumetric bounding prisms, resolving multi-owner commercial and residential strata titles.',
    feat2Title: 'Subterranean Basements',
    feat2Desc: 'Precise indexing of underground parking, metro integration tunnels, and basements with negative elevation datum indexing.',
    feat3Title: 'Real-Time Cadastral Topology',
    feat3Desc: 'Continuous spatial validation preventing vertical overlaps, negative clearances, and boundary containment conflicts.',
    feat4Title: 'Bhu-Aadhaar 14-Digit Standard',
    feat4Desc: 'Seamlessly incorporates DoLR cadastral hierarchy [State, District, Tehsil, Colony/Ward, Khasra/Plot] into vertical identifiers.',
    samplesTitle: 'Explore Seeded Cadastral Buildings',
    samplesSubtitle: 'Interactive 3D architectural models demonstrating distinct vertical zoning archetypes across Indian municipal corporations',
    viewBuilding: 'Inspect in 3D Explorer',

    // Explorer Page
    searchPlaceholder: 'Search by ULPIN, Building Name, or City...',
    cadastreOverview: 'Cadastral Parcel Overview',
    baseUlpin: 'Base ULPIN (Bhu-Aadhaar)',
    floorsAbove: 'Floors Above Ground',
    basementsBelow: 'Basements Below',
    footprintArea: 'Footprint Area',
    surveyYear: 'Survey Year',
    shape: 'Shape',
    undergroundVis: 'Underground Visibility',
    show: 'SHOW',
    hide: 'HIDE',
    resetView: 'Reset 3D View Orientation',
    verified: 'VERIFIED',
    pending: 'AUDIT PENDING',
    strataLevelSelector: 'Vertical Strata Selector',
    selectPrompt: 'Click on any floor mesh in the 3D model or select a level below to inspect cadastral deed attributes.',
    rotateNotice: 'Drag to rotate • Scroll to zoom • Right-click to pan',

    // Level Detail Panel
    levelDetailsTitle: 'Volumetric Strata Deed Record',
    levelDetailsSubtitle: 'Official Cadastral Property Deed Certificate',
    verticalUlpin: 'Official Vertical ULPIN',
    copyUlpin: 'Copy ULPIN',
    copied: 'Copied!',
    volumetricSpace: 'Volumetric Space',
    heightSpan: 'Elevation Span',
    floorArea: 'Carpet / Floor Area',
    ownershipCategory: 'Ownership Category',
    primaryUsage: 'Primary Usage Classification',
    estimatedTax: 'Annual Municipal Property Tax',
    topologyCheck: 'Cadastral Topology Validation',
    topologyPassed: 'No Spatial Collisions Detected',
    subUnitsTitle: 'Internal Units & Sub-Parcels',
    downloadCert: 'Download Official 3D Deed Certificate',

    // Generator Page
    genPageTitle: '3D ULPIN & Strata Generator',
    genPageSubtitle: 'Register new volumetric parcels and derive official 14-digit Bhu-Aadhaar spatial identifiers',
    stage1Title: 'Stage 1: Property Identification & Cadastral Attributes',
    stage1Desc: 'Enter title records, Khasra/Plot identifier, and survey references',
    stage2Title: 'Stage 2: Geographic & Municipal Location',
    stage2Desc: 'State, District, Tehsil, Colony/Ward, and Centroid Coordinates',
    stage3Title: 'Stage 3: Vertical Structure & Floor Levels',
    stage3Desc: 'Configure above-ground floors and subterranean basement strata',
    stage4Title: 'Stage 4: Footprint Geometry & Dimensions',
    stage4Desc: 'Define spatial polygon envelope and plot dimensions',
    stage5Title: 'Stage 5: Real-Time Cadastral Topology Validation',
    stage5Desc: 'Automated geometric audit for volumetric overlaps and boundary violations',
    stage6Title: 'Stage 6: Official 14-Digit ULPIN Derivation (Bhu-Aadhaar)',
    stage6Desc: 'National standard defined by Department of Land Resources (DoLR) & NIC',
    propertyName: 'Property / Building Name',
    propertyType: 'Property Type',
    plotNumber: 'Plot / Khasra Number',
    surveyRef: 'Cadastral Survey Reference',
    ownership: 'Ownership Category',
    state: 'State / UT',
    district: 'District',
    tehsil: 'Tehsil / Sub-District',
    locality: 'Colony / Locality',
    ward: 'Municipal Ward',
    latitude: 'Centroid Latitude (°N)',
    longitude: 'Centroid Longitude (°E)',
    elevation: 'Ground Elevation (m MSL)',
    aboveFloors: 'Above-Ground Floors',
    belowFloors: 'Subterranean Basements',
    registerBtn: 'Register Property & Save to Cadastre',
    savingBtn: 'Registering Parcel to Cadastre...',
    regSuccessTitle: '3D Parcel Successfully Registered!',
    regSuccessDesc: 'The property and all vertical strata units have been cataloged in the local cadastre database.',
    openInExplorerBtn: 'Open in 3D Cadastre Explorer',

    // Methodology Page
    methodTitle: 'Methodology & Conceptual 3D Cadastre Pipeline',
    methodSubtitle: 'Department of Land Resources (DoLR) • DILRMP Technology Vision',
    methodIntro: 'The 3D Unique Land Parcel Identification Number (3D ULPIN) extends the Government of India’s Bhu-Aadhaar framework from planar 2D land polygons into three-dimensional strata volumes. This architectural prototype models how photogrammetric surveys, AI building massing, and deterministic geometric rules establish volumetric cadastre units.',
    pipelineTitle: '7-Stage Vertical Parcel Extraction & Verification Pipeline',
    pipelineNotice: 'Illustrative / Simulated Processing Pipeline Notice',
    pipelineNoticeDesc: 'In compliance with hackathon prototype constraints, the 7-stage pipeline and confidence scores below are illustrative representations simulating real-world LiDAR and photogrammetry workflows. The topology rule-based validation engine in this app, however, executes real mathematical verification against the seeded geometry.',

    // Reports Page
    reportsTitle: 'Volumetric Cadastre Registry & Audit Reports',
    reportsSubtitle: 'Official Cadastral Strata Inventory for Municipal Corporations and Revenue Departments',
    totalBuildings: 'Registered Properties',
    totalStrataLevels: 'Volumetric Strata Units',
    verifiedParcels: 'Verified Cadastral Units',
    pendingParcels: 'Pending Verification Audits',
    exportCsvBtn: 'Export Full Registry to CSV',
    searchFilterPlaceholder: 'Filter by building, ULPIN, or city...',
    allCities: 'All Municipalities / Cities',
    filterAll: 'All Statuses',
    filterVerified: 'Verified Only',
    filterPending: 'Pending Audit',
    colBuildingName: 'Building / Property Name',
    colBaseUlpin: 'Base ULPIN (Bhu-Aadhaar)',
    colLocation: 'Location & Municipality',
    colFloors: 'Levels (Above / Below)',
    colFootprint: 'Footprint Area',
    colStatus: 'Topology Status',
    colActions: 'Actions'
  },

  hi: {
    // Utility & A11y
    skipContent: 'मुख्य सामग्री पर जाएं',
    screenReader: 'स्क्रीन रीडर सहायता',
    screenReaderActive: 'स्क्रीन रीडर सहायता सक्रिय है। आप 3D यूएलपीआईएन एवं ऊर्ध्वाधर संपत्ति मानचित्रण पोर्टल पर हैं।',
    fontSizeChanged: (lvl: string) => `फ़ॉन्ट आकार बदला गया: ${lvl}`,
    highContrastStandard: 'सामान्य दृश्य',
    highContrastActive: 'उच्च कंट्रास्ट',
    english: 'ENGLISH',
    hindi: 'हिन्दी',

    // Header
    govIndia: 'भारत सरकार',
    ministryRuralDev: 'ग्रामीण विकास मंत्रालय',
    deptLandResources: 'भूमि संसाधन विभाग (DoLR)',
    systemTitle: '3D-यूएलपीआईएन प्रणाली',
    systemSubtitle: 'राष्ट्रीय भू-स्थानिक भू-अभिलेख एवं ऊर्ध्वाधर संपत्ति मानचित्रण पोर्टल',

    // Navbar
    navHome: 'मुख्य पृष्ठ',
    navExplorer: '3D भू-अभिलेख अन्वेषक',
    navGenerate: '3D यूएलपीआईएन जनरेटर',
    navMethodology: 'कार्यप्रणाली व मानक',
    navReports: 'आयतनिक पंजीयन रिपोर्ट',

    // Footer
    prototypeNotice: 'स्मार्ट इंडिया हैकाथॉन (SIH) संकल्पनात्मक प्रोटोटाइप:',
    prototypeDesc: 'एसआईएच हेतु ऑफलाइन प्रदर्शन प्रोटोटाइप। ऊर्ध्वाधर यूएलपीआईएन अनुक्रमण रूपरेखा भू-आधार का एक प्रस्तावित अनुसंधान विस्तार है।',
    gigwAligned: 'जीआईजीडब्ल्यू 3.0 संगत',
    privacyPolicy: 'गोपनीयता नीति',
    termsConditions: 'नियम एवं शर्तें',
    copyright: `कॉपीराइट © ${new Date().getFullYear()} भूमि संसाधन विभाग (DoLR)`,
    contentOwned: 'सामग्री प्रबंधन: ग्रामीण विकास मंत्रालय, भारत सरकार',
    lastUpdated: 'अंतिम अद्यतन: 24 अक्टूबर 2024',

    // Home Page
    heroBadge: 'राष्ट्रीय भू-स्थानिक भू-अभिलेख पहल • जीआईजीडब्ल्यू 3.0 संगत',
    heroTitle: '3D यूएलपीआईएन एवं ऊर्ध्वाधर संपत्ति मानचित्रण प्रणाली',
    heroDesc: 'भारत के 14-अंकीय विशिष्ट भू-खंड पहचान संख्या (यूएलपीआईएन / भू-आधार) को तीसरे आयाम में विस्तारित करना। ऊर्ध्वाधर स्वामित्व अधिकारों, बहुमंजिला वाणिज्यिक परतों और भूमिगत बेसमेंटों का स्पष्ट सीमांकन जिससे संपत्ति विवाद समाप्त हों, नगर निगम राजस्व सुदृढ़ हो और त्रि-आयामी नगर नियोजन संभव हो सके।',
    heroCtaExplorer: '3D अन्वेषक खोलें',
    heroCtaGenerate: 'नया 3D यूएलपीआईएन बनाएं',
    heroCtaReports: 'पंजीयन रिपोर्ट देखें',
    statsProperties: 'कुल पंजीकृत संपत्तियां',
    statsStrata: 'ऊर्ध्वाधर तल भू-खंड',
    statsVolumetric: 'पंजीकृत आयतनिक क्षेत्रफल',
    statsVerified: 'सत्यापित भू-अभिलेख टोपोलॉजी',
    featuresTitle: 'प्रमुख वास्तुकला एवं तकनीकी क्षमताएं',
    featuresSubtitle: 'डिजिटल इंडिया लैंड रिकॉर्ड्स आधुनिकीकरण कार्यक्रम (DILRMP) के साथ निर्बाध एकीकरण हेतु निर्मित',
    feat1Title: 'आयतनिक परत मानचित्रण',
    feat1Desc: '2D समतलीय बहुभुजों को 3D आयतनिक प्रिज्म में विस्तारित करता है, जिससे बहु-स्वामित्व वाणिज्यिक और आवासीय फ्लैटों के कानूनी शीर्षक सुरक्षित होते हैं।',
    feat2Title: 'भूमिगत बेसमेंट सीमांकन',
    feat2Desc: 'ऋणात्मक ऊंचाई डेटम अनुक्रमण के साथ भूमिगत पार्किंग, मेट्रो कनेक्टिविटी और बेसमेंट तल इकाइयों का सटीक डिजिटल दस्तावेजीकरण।',
    feat3Title: 'वास्तविक समय भू-अभिलेख टोपोलॉजी',
    feat3Desc: 'स्वचालित ज्यामितीय सत्यापन जो ऊर्ध्वाधर ओवरलैप, अपर्याप्त ऊंचाई अंतराल और संपत्ति सीमा अतिक्रमण को तुरंत रोकता है।',
    feat4Title: 'भू-आधार 14-अंकीय राष्ट्रीय मानक',
    feat4Desc: 'भूमि संसाधन विभाग के पदानुक्रम [राज्य, जिला, तहसील, कॉलोनी/वार्ड, खसरा/प्लॉट] को प्रत्येक ऊर्ध्वाधर पहचानकर्ता में समाहित करता है।',
    samplesTitle: 'पूर्व-दर्ज भू-स्थानिक भवनों का अन्वेषण करें',
    samplesSubtitle: 'भारतीय नगर निगमों के विभिन्न ऊर्ध्वाधर ज़ोनिंग प्रतिरूपों को दर्शाते संवादात्मक 3D त्रि-आयामी मॉडल',
    viewBuilding: '3D अन्वेषक में देखें',

    // Explorer Page
    searchPlaceholder: 'यूएलपीआईएन, भवन नाम, अथवा शहर द्वारा खोजें...',
    cadastreOverview: 'भू-खंड अभिलेख विवरण',
    baseUlpin: 'मूल भू-आधार यूएलपीआईएन',
    floorsAbove: 'भूतल से ऊपर तल',
    basementsBelow: 'भूमिगत तल (बेसमेंट)',
    footprintArea: 'भू-आच्छादन क्षेत्रफल',
    surveyYear: 'सर्वेक्षण वर्ष',
    shape: 'आकृति',
    undergroundVis: 'भूमिगत तल दृश्यता',
    show: 'देखें',
    hide: 'छिपाएं',
    resetView: '3D दृश्य पुनर्विन्यास',
    verified: 'सत्यापित',
    pending: 'सत्यापन प्रतीक्षित',
    strataLevelSelector: 'ऊर्ध्वाधर तल चयनकर्ता',
    selectPrompt: '3D मॉडल में किसी भी तल पर क्लिक करें या नीचे दिए गए तलों में से किसी को चुनकर आधिकारिक अभिलेख देखें।',
    rotateNotice: 'घुमाने हेतु ड्रैग करें • ज़ूम हेतु स्क्रॉल करें • पैन हेतु दायाँ क्लिक करें',

    // Level Detail Panel
    levelDetailsTitle: 'आयतनिक तल विलेख अभिलेख',
    levelDetailsSubtitle: 'आधिकारिक भू-अभिलेख संपत्ति विलेख प्रमाण पत्र',
    verticalUlpin: 'आधिकारिक ऊर्ध्वाधर यूएलपीआईएन',
    copyUlpin: 'यूएलपीआईएन कॉपी करें',
    copied: 'कॉपी हो गया!',
    volumetricSpace: 'आयतनिक स्थान (वॉल्यूम)',
    heightSpan: 'ऊंचाई विस्तार',
    floorArea: 'निर्मित / कार्पेट क्षेत्रफल',
    ownershipCategory: 'स्वामित्व श्रेणी',
    primaryUsage: 'प्राथमिक उपयोग वर्गीकरण',
    estimatedTax: 'अनुमानित वार्षिक नगर निगम कर',
    topologyCheck: 'भू-अभिलेख टोपोलॉजी सत्यापन',
    topologyPassed: 'कोई स्थानिक टकराव नहीं पाया गया',
    subUnitsTitle: 'आंतरिक इकाइयाँ व उप-खंड',
    downloadCert: 'आधिकारिक 3D विलेख प्रमाण पत्र डाउनलोड करें',

    // Generator Page
    genPageTitle: '3D यूएलपीआईएन एवं तल जनरेटर',
    genPageSubtitle: 'नई आयतनिक संपत्तियां पंजीकृत करें एवं आधिकारिक 14-अंकीय भू-आधार पहचानकर्ता प्राप्त करें',
    stage1Title: 'चरण 1: संपत्ति पहचान एवं भू-अभिलेख विशेषताएँ',
    stage1Desc: 'स्वामित्व अभिलेख, खसरा/प्लॉट संख्या एवं सर्वेक्षण संदर्भ दर्ज करें',
    stage2Title: 'चरण 2: भौगोलिक एवं नगर निगम अवस्थिति',
    stage2Desc: 'राज्य, जिला, तहसील, कॉलोनी/वार्ड एवं निर्देशांक विवरण',
    stage3Title: 'चरण 3: ऊर्ध्वाधर संरचना एवं तल विन्यास',
    stage3Desc: 'भूतल से ऊपर के तल एवं भूमिगत बेसमेंट परतों का विन्यास करें',
    stage4Title: 'चरण 4: भू-आच्छादन ज्यामिति एवं माप',
    stage4Desc: 'स्थानिक बहुभुज सीमा एवं प्लॉट आयाम निर्धारित करें',
    stage5Title: 'चरण 5: वास्तविक समय भू-अभिलेख टोपोलॉजी सत्यापन',
    stage5Desc: 'आयतनिक ओवरलैप एवं सीमा उल्लंघन हेतु स्वचालित ज्यामितीय ऑडिट',
    stage6Title: 'चरण 6: आधिकारिक 14-अंकीय यूएलपीआईएन व्युत्पत्ति (भू-आधार)',
    stage6Desc: 'भूमि संसाधन विभाग (DoLR) एवं एनआईसी द्वारा निर्धारित राष्ट्रीय मानक',
    propertyName: 'संपत्ति / भवन का नाम',
    propertyType: 'संपत्ति का प्रकार',
    plotNumber: 'प्लॉट / खसरा संख्या',
    surveyRef: 'भू-अभिलेख सर्वेक्षण संदर्भ',
    ownership: 'स्वामित्व श्रेणी',
    state: 'राज्य / केंद्र शासित प्रदेश',
    district: 'जिला',
    tehsil: 'तहसील / उप-जिला',
    locality: 'कॉलोनी / क्षेत्र',
    ward: 'नगर निगम वार्ड',
    latitude: 'केंद्र अक्षांश (°N)',
    longitude: 'केंद्र देशांतर (°E)',
    elevation: 'भूमि तल ऊंचाई (मीटर)',
    aboveFloors: 'भूतल से ऊपर तल संख्या',
    belowFloors: 'भूमिगत बेसमेंट संख्या',
    registerBtn: 'संपत्ति पंजीकृत करें एवं भू-अभिलेख में सहेजें',
    savingBtn: 'भू-अभिलेख में पंजीकरण प्रगति पर है...',
    regSuccessTitle: '3D संपत्ति सफलतापूर्वक पंजीकृत हो गई!',
    regSuccessDesc: 'यह संपत्ति और सभी ऊर्ध्वाधर इकाइयाँ स्थानीय भू-अभिलेख डेटाबेस में दर्ज हो गई हैं।',
    openInExplorerBtn: '3D भू-अभिलेख अन्वेषक में खोलें',

    // Methodology Page
    methodTitle: 'कार्यप्रणाली व संकल्पनात्मक 3D भू-अभिलेख पाइपलाइन',
    methodSubtitle: 'भूमि संसाधन विभाग (DoLR) • DILRMP तकनीकी दृष्टिकोण',
    methodIntro: '3D विशिष्ट भू-खंड पहचान संख्या (3D ULPIN) भारत सरकार के भू-आधार ढांचे को समतल 2D भूमि बहुभुज से त्रि-आयामी परतों में विस्तारित करती है। यह प्रोटोटाइप दर्शाता है कि फोटोग्रामेट्रिक सर्वेक्षण, एआई भवन मैसिंग, और ज्यामितीय नियम कैसे आयतनिक भू-अभिलेख इकाइयाँ स्थापित करते हैं।',
    pipelineTitle: '7-चरणीय ऊर्ध्वाधर भू-खंड निष्कर्षण एवं सत्यापन पाइपलाइन',
    pipelineNotice: 'प्रोटोटाइप अनुकरण पाइपलाइन सूचना',
    pipelineNoticeDesc: 'हैकाथॉन प्रोटोटाइप मानकों के अनुपालन में, नीचे दिए गए 7-चरणीय पाइपलाइन और विश्वास स्कोर वास्तविक दुनिया के LiDAR और फोटोग्रामेट्री वर्कफ़्लो का अनुकरण करते हैं। इस पोर्टल का टोपोलॉजी इंजन वास्तविक ज्यामितीय सत्यापन करता है।',

    // Reports Page
    reportsTitle: 'आयतनिक भू-अभिलेख पंजीयन एवं ऑडिट रिपोर्ट',
    reportsSubtitle: 'नगर निगमों एवं राजस्व विभागों हेतु आधिकारिक त्रि-आयामी संपत्ति सूची',
    totalBuildings: 'कुल पंजीकृत संपत्तियां',
    totalStrataLevels: 'आयतनिक तल इकाइयाँ',
    verifiedParcels: 'सत्यापित भू-अभिलेख इकाइयाँ',
    pendingParcels: 'सत्यापन प्रतीक्षित इकाइयाँ',
    exportCsvBtn: 'पूर्ण पंजीयन CSV डाउनलोड करें',
    searchFilterPlaceholder: 'भवन, यूएलपीआईएन अथवा शहर द्वारा फ़िल्टर करें...',
    allCities: 'सभी नगर निगम / शहर',
    filterAll: 'सभी स्थितियाँ',
    filterVerified: 'केवल सत्यापित',
    filterPending: 'सत्यापन प्रतीक्षित',
    colBuildingName: 'भवन / संपत्ति का नाम',
    colBaseUlpin: 'मूल भू-आधार (ULPIN)',
    colLocation: 'स्थान व नगर पालिका',
    colFloors: 'तल (ऊपर / नीचे)',
    colFootprint: 'भू-आच्छादन क्षेत्रफल',
    colStatus: 'टोपोलॉजी स्थिति',
    colActions: 'कार्यवाही'
  }
};

export function getTranslation(lang: AppLanguage): Translations {
  return translations[lang] || translations.en;
}
