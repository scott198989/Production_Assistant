# ISOFlex Dashboard

Production floor tool for blown film extrusion operators. Desktop application with web demo capability.

## Tech Stack

- **Desktop:** Tauri v2 (Windows)
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Build:** Vite

## Development

```bash
# Install dependencies
npm install

# Run web version (development)
npm run dev

# Run desktop version (requires Rust)
npm run tauri dev
```

## Deployment

### Web Demo (Vercel)

The app can be deployed to Vercel for demonstration purposes:

1. Push to GitHub
2. Import project in Vercel
3. Deploy (auto-detected as Vite project)

**Note:** The web demo is for demonstration only. Production use should be the native desktop app.

### Desktop Build (Production)

```bash
npm run tauri build
```

Output: `src-tauri/target/release/bundle/msi/`

## Features

- Roll Weight Calculator
- Gram Weight Calculator
- Bag Weight Calculator
- Pounds Per Hour
- Gauge Adjustment
- Blow Up Ratio
- Pounds Per Die Inch
- Feet on Roll
- Resin Timeout Calculator
- Unit Converter
- Quality Monitors
