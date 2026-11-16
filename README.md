# 📡 Agro Radar

**Global Agricultural Decision-Support System powered by NASA POWER & Meteorological Telemetry**

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026%20Challenge-blue?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/2026/challenges/adapting-farms-with-nasa-data/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

**Agro Radar** is a global agricultural decision-support web application built by **Team Three Stars (Equipo Tres Estrellas)** for the **2026 NASA International Space Apps Challenge** (*Adapting Farms with NASA Data*).

Designed for farmers anywhere in the world—including those without access to expensive IoT soil probes or complex desktop software—Agro Radar translates satellite agroclimatology, multi-depth soil moisture profiles, and crop history into clear, actionable guidance on **when to sow**, **when to harvest**, and **how to rotate crops**[cite: 2, 6].

---

## ✨ Key Features

* **🌍 Global Satellite & Weather Fusion:** Operates at any GPS coordinate worldwide with zero hardware required, combining **NASA POWER** agroclimatology baselines with real-time soil moisture and weather forecasts (**Open-Meteo**).
* **📡 Dual Measurement Modes:**
  * **Approximate Measurement Mode:** Automated retrieval of surface (`0–1 cm` / `0–5 cm`) and root-zone (`9–27 cm` / `0–100 cm`) soil wetness via remote sensing and meteorological models.
  * **Instrument Measurement Mode:** Manual input support for farmers using physical soil moisture sensors or gravimetric field measurements, overriding remote surface estimates while retaining NASA POWER climate context.
* **🌱 Sowing Diagnostics:** Evaluates surface germination moisture alongside sub-surface water reserves to prevent premature planting into dry soil profiles.
* **🚜 Harvesting Diagnostics:** Inverts agronomic thresholds by analyzing surface ground firmness, ambient relative humidity, and short-term precipitation probability to prevent soil compaction, machinery bogging, and high-moisture grain harvesting.
* **🔄 Crop Soil Depletion & Rotation Engine ("Field Memory"):** Calculates estimated water and nutrient depletion from the previous harvest (*Soybean, Corn, Wheat/Soybean double-crop, Cotton, Sunflower, Alfalfa/Pasture*) and recommends optimal restorative crop rotations[cite: 3, 6].
* **🚦 Traffic-Light UI & Hands-Free Voice Readout:** Abstracts technical telemetry into high-contrast **Green / Yellow / Red** decision cards paired with native bilingual (**English / Spanish**) Text-to-Speech (`Web Speech API`) for field accessibility.
* **📍 Auto-Geolocation + Interactive Map Fallback:** Automatically detects field coordinates via browser GPS (`navigator.geolocation`) with reverse geocoding and an interactive **Leaflet** map selector when GPS accuracy is unavailable[cite: 6].

---

## 🛰️ Use of NASA Data & Scientific Architecture

Agro Radar directly integrates the **NASA POWER (Prediction Of Worldwide Energy Resources) Agroclimatology API** (`community=AG`) and fuses it with real-time multi-depth soil and weather telemetry[cite: 6]:

| Data Source | Parameters Used | Depth / Resolution | Role in Agro Radar |
| :--- | :--- | :--- | :--- |
| **NASA POWER API** (`power.larc.nasa.gov`)[cite: 6] | `GWETTOP`, `GWETROOT`, `PRECTOTCORR`, `RH2M`[cite: 6] | `0–5 cm` & `0–100 cm` (Daily agroclimatology)[cite: 6] | Establishes root-zone water reserves, historical climate context, and post-harvest soil depletion baselines[cite: 6]. |
| **Open-Meteo API** (`api.open-meteo.com`)[cite: 6, 9] | `soil_moisture_0_to_1cm`, `soil_moisture_9_to_27cm`, `relative_humidity_2m`, `precipitation_probability`[cite: 6, 9] | `0–1 cm` & `9–27 cm` (Hourly real-time)[cite: 6] | Powers immediate operational sowing & harvesting traffic-light alerts[cite: 6]. |

---

## 🏗️ Software Architecture (MVC)

The codebase is strictly modularized under the **Model–View–Controller (MVC)** pattern to separate agronomic business logic and API orchestration from stateless UI rendering[cite: 3, 6]:

```text
rotadorCultivos/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── Controller/
│   │   ├── ApiGeo.js              # Reverse geocoding & coordinate location resolver
│   │   ├── apiNasa.js             # NASA POWER Agroclimatology API client
│   │   └── useLoteController.js   # Custom React hook orchestrating GPS, APIs, state & Web Speech audio
│   ├── Model/
│   │   ├── rotacionModel.js       # Crop depletion coefficients, Kc values & rotation recommendation rules
│   │   ├── sueloModel.js          # Multi-depth soil moisture evaluation for Sowing & Harvesting modes
│   │   └── textosIdioma.js        # Bilingual (ES/EN) localization dictionary
│   ├── View/
│   │   ├── LoteView.jsx           # Main field evaluation dashboard & traffic-light decision card
│   │   ├── landingView.jsx        # Mode selection landing screen (Approximate vs. Instrument)
│   │   ├── layoutApp.jsx          # Persistent header, language switcher & team footer layout
│   │   ├── mapaSelector.jsx       # Interactive Leaflet field coordinate picker
│   │   └── rotacionView.jsx       # Soil depletion bar & restorative crop rotation UI
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.jsx                    # Connects useLoteController with View components
│   ├── index.css                  # Global styles
│   └── main.jsx                   # React DOM entry point
├── index.html
├── jsconfig.json
├── package.json
└── vite.config.js
