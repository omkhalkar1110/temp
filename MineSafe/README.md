# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
# 3rd-Vision

## Google Maps Platform Integration

This project uses the official **Google Maps JavaScript API** for real-time mining fleet, telemetry, and hazard monitoring.

### Prerequisites & Google Cloud Setup
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create your Google Cloud project.
3. Enable the **Maps JavaScript API** under **APIs & Services > Library**.
4. Generate an API key under **APIs & Services > Credentials**.
5. (Recommended) Apply API restrictions to the key: restrict it to **Maps JavaScript API** and set HTTP referrers according to your deployment domains.

### Environment Variable Setup
Create a `.env` file in the project root (copied from `.env.example`) and configure:

```env
VITE_GOOGLE_MAPS_API_KEY=MY_REAL_KEY
```

> **Note:** The application uses Vite, so the frontend key must be prefixed with `VITE_` (`VITE_GOOGLE_MAPS_API_KEY`). If the key is not provided, the application gracefully alerts the developer without crashing other dashboard operations.

## Dual-Engine Cadastral GIS Map

The project includes an interactive, production-ready **Cadastral GIS Map component** (`/src/components/cadastral/` and route `/cadastral`):

- **Primary / Fallback Engine**: OpenGIS Leaflet (`leaflet`). Fully interactive without requiring any Google Cloud billing account or API key. Provides high-resolution Esri World Imagery and CartoDB Voyager basemaps.
- **Secondary Engine**: Google Maps Platform (`@vis.gl/react-google-maps`). Activates automatically whenever `VITE_GOOGLE_MAPS_API_KEY` is present and valid.
- **Resilience**: Wrapped in a React `MapErrorBoundary` ensuring automatic, zero-downtime fallback to OpenGIS Leaflet upon any network failure, quota issue, or invalid API key.
- **Features**:
  - Statutory Cadastral Parcel Polygons (Possessed / Acquired `#10B981`, In Progress `#3B82F6`, Court Stay / Disputed `#EF4444`, Selected `#F59E0B`).
  - Corridor Right-of-Way 60m buffer polygon and scenario alignment alternatives (Route A Greenfield Bypass vs. Route B Brownfield Widening).
  - Real-time parcel hover tooltips and selection inspector drawer (Survey No., Landowner, Hectares/Gunthas, ₹ Compensation Award, DBT status, Court stay details).
  - Floating controls for basemap switching, layer toggling, Google Maps traffic flow, and manual engine switching.
  - Frosted dark glass legend with live parcel counts and engine status badge.

