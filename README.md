# Alaya Realty — Institutional Real Estate Advisory Platform

An institutional-grade real estate advisory and investment platform engineered for private wealth, family offices, and high-net-worth investors navigating high-growth corridors in Central India (Indore, MP).

---

## 🏛️ Architecture & Key Modules

| Route | Page | Purpose |
|---|---|---|
| `/` | `index.html` | Flagship Home: Executive hero, featured opportunities, market ticker, and 6-pillar framework preview. |
| `/properties.html` | `properties.html` | Curated Marketplace: Dynamic asset filtering (Plotted, Commercial, Industrial, Residential), search, and sort. |
| `/veda-park.html` | `veda-park.html` | Veda Park Plotted Asset Dossier: Interactive 88-plot availability visualizer, live ROI appreciation calculator, and site visit scheduling. |
| `/advisory.html` | `advisory.html` | 6-Pillar Due Diligence Framework: 30-year forensic title checks, market intelligence, cash-flow modeling, and engagement models. |
| `/insights.html` | `insights.html` | Research & Perspectives Hub: Category-filtered quarterly investment theses and market outlooks. |
| `/article-industrial.html` | `article-industrial.html` | Research Article: *"How to Evaluate an Industrial Land Investment"* with infrastructure checklist and financial underwriting sensitivity table. |
| `/about.html` | `about.html` | About Us & Leadership: Fiduciary convictions, senior-led advantage, and principal profiles (Arjun Singh, Elena Rostova). |
| `/contact.html` | `contact.html` | Indore HQ & Mandates: Direct partner consultation scheduling, office coordinates, and instant WhatsApp concierge. |

---

## 🛠️ Technology Stack & Design System

- **Framework**: Vite Multi-Page Application (Fast HMR, optimized static assets)
- **Styling**: Tailwind CSS & Vanilla CSS Design System conforming to `Alaya Sovereign Editorial` tokens:
  - **Colors**: Paper Light (`#FDF9EB`), Paper Dark (`#E6E1D1`), Forest Deep (`#081F18`), Metallic Gold (`#A68B5B`), Ink Primary (`#010306`)
  - **Typography**: `EB Garamond` (Editorial Headlines & Displays), `Hanken Grotesk` (Body & Mono Data)
- **Interactive Engines**:
  - Global `showToast()` notification system
  - Direct Partner Consultation Modal accessible on all pages
  - Live 88-plot grid selector with instant valuation and orientation details
  - Interactive ROI and holding period appreciation calculator

---

## 🚀 Running Locally

To install dependencies and start the development server on `http://localhost:7999`:

```bash
npm install
npm run dev
```

The application is configured to run at `http://localhost:7999`.

To build for production:

```bash
npm run build
```
