# Smart Building 3D — WebGL Digital Twin & Real-Time IoT Platform

[![Framework](https://img.shields.io/badge/Frontend-React%2019-blue.svg?style=flat-square)](https://react.dev/)
[![3D Engine](https://img.shields.io/badge/3D%20Engine-Three.js%20%2F%20R3F-black.svg?style=flat-square)](https://r3f.docs.pmnd.rs/)
[![Cloud DB](https://img.shields.io/badge/Cloud%20DB-Supabase%20Realtime-3ECF8E.svg?style=flat-square)](https://supabase.com/)
[![Telemetry](https://img.shields.io/badge/Charts-Recharts-teal.svg?style=flat-square)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

An interactive, browser-based **3D Digital Twin** application for smart facility monitoring, spatial sensor telemetry visualization, and energy efficiency analytics. Powered by **React Three Fiber (Three.js)** and **Supabase Realtime**, the platform translates physical sensor streams into an intuitive virtual building interface.

---

## 🌟 Key Features

- **Interactive 3D Spatial Twin:** Orbit, pan, zoom, and inspect rooms and building zones rendered with Three.js WebGL shaders and realistic lighting.
- **Real-Time IoT State Synchronization:** Subscribes to Supabase Realtime event channels to display live human presence, environmental parameters, and actuator statuses.
- **Interactive Telemetry Dashboards:** Integrated analytical charts (Recharts) displaying historical consumption, temperature trends, and peak activity zones.
- **Zone Inspection & Spatial Alerts:** Visual color-coded alerts overlaid directly onto 3D building components when sensor thresholds or security tripwires are triggered.

---

## 🛠️ Architecture & Tech Stack

```text
[ Physical IoT Nodes / ESP32 Sensors ]
                │
                ▼ (MQTT / HTTP REST API)
    [ Supabase Cloud Database ]
                │ (Realtime WebSockets Subscription)
                ▼
  [ React Three Fiber 3D Dashboard ]
        ├── Three.js WebGL Scene (`@react-three/fiber`, `@react-three/drei`)
        ├── Live Telemetry Widgets (Recharts)
        └── Interactive Zone Selector & Anomaly Highlights
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn`

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/HmzaHch/SMART_BUILDING.git
cd SMART_BUILDING
```

Install packages:
```bash
npm install
```

### 3. Launch Development Server
```bash
npm start
```
The application will launch automatically at [http://localhost:3000](http://localhost:3000).

### 4. Production Build
```bash
npm run build
```
Generates an optimized static bundle in the `build/` folder ready for deployment on Vercel, Netlify, or AWS S3/CloudFront.

---

## 👨‍💻 Author

**Hamza HACHOUM**  
*State Engineer in Applied Sciences and Technology (Embedded Systems & IoT)*  
*ISIMG, University of Gabès*  
- **LinkedIn:** [hamza-hachoum-186319227](https://www.linkedin.com/in/hamza-hachoum-186319227)  
- **GitHub:** [@HmzaHch](https://github.com/HmzaHch)  
- **Email:** hamza.hachoum@gmail.com
