# 3D ULPIN & Vertical Property Mapping System
**Smart India Hackathon (SIH) Prototype • Volumetric Cadastre Demonstration**

Inspired by the **Department of Land Resources (DoLR)**, **Ministry of Rural Development (MoRD)**, and the **Digital India Land Records Modernization Programme (DILRMP)**.

---

## 1. Project Overview & Context

In India, **ULPIN (Bhu-Aadhaar)** is the official 14-character alphanumeric identifier assigned to surface land parcels based on geographic coordinates (latitude/longitude coordinates of vertices).

In dense urban environments, multiple owners possess independent property titles stacked vertically above and below a single ground parcel. This prototype demonstrates a **3D Volumetric Cadastre** system that extends the 2D surface ULPIN into vertical strata units:
- **Above-grade Floors (F01–F10):** Residential flats, commercial offices, society refuge terraces.
- **Sub-grade Basements (B01–B02):** Subterranean parking, building services, and utility corridors.

> **Disclaimer:** The vertical ULPIN schema implemented here (`{14-char Base ULPIN}-B{xx}-{Level}`) is a proposed research specification developed for demonstration and is not yet an official gazetted standard.

---

## 2. Setup & Execution Commands

### Prerequisites
- Node.js 18+ (tested up to Node 22)
- npm 9+

### Run Instructions
```bash
# 1. Install dependencies
npm install

# 2. Start local development server (binds to http://localhost:3000)
npm run dev

# 3. Production build & verification
npm run build
```

The application runs **100% offline** after dependencies are installed. There are no external runtime API calls, paid map tile keys, cloud AI services, or GNSS/CORS network feeds required.

---

## 3. Seed Generator & Database Architecture

- **15 Pilot Buildings** procedurally generated across 10 real Indian cities (Bhopal, Indore, Jaipur, Pune, Hyderabad, Ahmedabad, Lucknow, Bhubaneswar, Bengaluru, Chandigarh).
- **12 Addressable Levels per Building** (10 above-ground floors + 2 basements = **180 total strata parcel records**).
- **5 Procedural Footprint Geometries**:
  1. *Rectangular* (single prism: BLD-01, BLD-06, BLD-10, BLD-13)
  2. *L-shaped* (2 interlocking wings: BLD-02, BLD-07, BLD-12)
  3. *U-shaped* (central spine with courtyard: BLD-03, BLD-08, BLD-14)
  4. *Plus-shaped* (cross configuration: BLD-04, BLD-09, BLD-15)
  5. *Cylindrical Tower* (radial column: BLD-05, BLD-11)

---

## 4. What is Real vs. Simulated

| System Component | Implementation Status | Technical Details |
| :--- | :--- | :--- |
| **3D Parametric Rendering** | **100% Real** | Three.js / React Three Fiber rendering box, L, U, cross, and cylinder meshes in WebGL with ambient/directional lighting and OrbitControls. |
| **Rule-Based Topology Validator** | **100% Real** | Mathematical algorithm validating spatial containment (area vs. parcel base), elevation bounding box collision (`elevation_overlap`), and basement zoning laws. |
| **Cadastre Register & CSV Export** | **100% Real** | Full browser-side CSV compiler exporting all 180 strata parcel records with geographic coordinates and legal status. |
| **GIGW 3.0 Accessibility** | **100% Real** | High contrast toggle, font sizing (A− / A / A+), Screen Reader live announcements, and Skip-to-content. |
| **Drone Photogrammetry & LiDAR** | **Simulated** | Conceptual 7-stage workflow showing how RTK drone point clouds translate to LoD-2 volumetric cadastre units. |

---

## 5. Single-Building Constraint Verification

As strictly mandated by the SIH prototype prompt:
- **Only ONE building renders in the 3D viewer at any time.**
- Users transition between buildings **strictly via the Search & Select controls** (by Name, ID, or City).
- Seamless camera re-framing is applied whenever a new building is loaded.

---

## 6. Fastest SIH Demo Flow (3-Minute Hackathon Pitch)

1. **Start on Home (`Home` tab):**
   - Highlight the national dilemma: India's 14-character Bhu-Aadhaar identifies surface parcels, but high-rises create ambiguous vertical titles and multiple mortgages.
   - Point out the proposed volumetric formula: `23MP0412034521-B07-F04`.
2. **Launch 3D Explorer (`3D Cadastre Explorer` tab):**
   - Search for **"Pune"** or select **`BLD-04 (Shaniwar Commercial Complex)`**.
   - Show how the **Plus-shaped** building renders with ground datum plane at $y = 0$.
   - Toggle **"Show/Hide Underground"** to reveal Basement 1 (Parking) and Basement 2 (Utility).
   - Click on **Floor 6 (F06)** in the 3D model or direct selector.
   - Observe the detail panel below: The **Rule-Based Validator** flags Floor 6 with `⚠️ Pending` due to an unsanctioned 32% cantilever area overflow.
3. **Inspect Verified Building:**
   - Search for **"Bhopal"** (`BLD-01`).
   - Click **Floor 4 (F04)**: Notice `✓ Verified` topology badge, elevation bounds (`10.20m to 13.60m`), and title record holder.
4. **Methodology & Pipeline (`Methodology & Pipeline` tab):**
   - Walk the jury through the 7-stage pipeline (Drone Photogrammetry → Point Cloud → Slab Segmentation → 3D ULPIN).
5. **Cadastre Reports (`Cadastre Reports` tab):**
   - Click **"Export Cadastre CSV"** to demonstrate instant export of all 180 strata parcel records.

---

## 7. Known Limitations

- **Browser WebGL:** Hardware acceleration must be enabled in the browser for optimal 60 FPS rendering.
- **Data Persistence:** Relies on deterministic in-memory bundled data structures conforming to the SQLite data schema; does not persist user edits to disk in prototype mode.

