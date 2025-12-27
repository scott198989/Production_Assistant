import { Routes, Route, useLocation } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { MainPanel } from "./components/layout/MainPanel";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { RollWeight } from "./components/calculators/RollWeight";
import { ComingSoon } from "./pages/ComingSoon";

// Page title mapping
const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Dashboard", subtitle: "Production Overview" },
  "/calculators/roll-weight": { title: "Roll Weight", subtitle: "Calculate roll weight from dimensions" },
  "/calculators/gram-weight": { title: "Gram Weight", subtitle: "Calculate gram weight per 100 sq in" },
  "/calculators/bag-weight": { title: "Bag Weight", subtitle: "Calculate weight of a single bag" },
  "/calculators/pph": { title: "Pounds Per Hour", subtitle: "Calculate production output rate" },
  "/calculators/gauge-adjustment": { title: "Gauge Adjustment", subtitle: "Calculate FPM for gauge change" },
  "/calculators/bur": { title: "Blow Up Ratio", subtitle: "Calculate bubble BUR" },
  "/calculators/ppdi": { title: "Pounds Per Die Inch", subtitle: "Calculate extruder loading" },
  "/calculators/feet-on-roll": { title: "Feet on Roll", subtitle: "Estimate footage on partial rolls" },
  "/calculators/line-settings": { title: "Line Settings", subtitle: "Calculate new line speed for changes" },
  "/calculators/motor": { title: "Motor Calculations", subtitle: "Calculate motor and screw parameters" },
  "/tools/resin-timeout": { title: "Resin Timeout", subtitle: "Calculate material changeover timing" },
  "/tools/blade-position": { title: "Blade Position", subtitle: "Calculate blade adjustments" },
  "/tools/unit-converter": { title: "Unit Converter", subtitle: "Convert between common units" },
  "/quality/treater": { title: "Treater Monitor", subtitle: "Monitor corona treater output" },
  "/quality/opacity": { title: "Opacity Monitor", subtitle: "Track film opacity readings" },
  "/quality/gloss": { title: "Gloss Monitor", subtitle: "Track film gloss readings" },
  "/quality/haze": { title: "Haze Monitor", subtitle: "Track film haze readings" },
  "/troubleshooting/defects": { title: "Defect Troubleshooter", subtitle: "Diagnose common film defects" },
  "/settings": { title: "Settings", subtitle: "Configure app preferences" },
};

function App() {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: "ISOFlex Dashboard" };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />

        {/* Main Panel with Routes */}
        <MainPanel>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Calculators */}
            <Route path="/calculators/roll-weight" element={<RollWeight />} />
            <Route path="/calculators/gram-weight" element={<ComingSoon title="Gram Weight Calculator" />} />
            <Route path="/calculators/bag-weight" element={<ComingSoon title="Bag Weight Calculator" />} />
            <Route path="/calculators/pph" element={<ComingSoon title="Pounds Per Hour Calculator" />} />
            <Route path="/calculators/gauge-adjustment" element={<ComingSoon title="Gauge Adjustment Calculator" />} />
            <Route path="/calculators/bur" element={<ComingSoon title="Blow Up Ratio Calculator" />} />
            <Route path="/calculators/ppdi" element={<ComingSoon title="Pounds Per Die Inch Calculator" />} />
            <Route path="/calculators/feet-on-roll" element={<ComingSoon title="Feet on Roll Calculator" />} />
            <Route path="/calculators/line-settings" element={<ComingSoon title="Line Settings Calculator" />} />
            <Route path="/calculators/motor" element={<ComingSoon title="Motor Calculations" />} />

            {/* Tools */}
            <Route path="/tools/resin-timeout" element={<ComingSoon title="Resin Timeout Calculator" />} />
            <Route path="/tools/blade-position" element={<ComingSoon title="Blade Position Calculator" />} />
            <Route path="/tools/unit-converter" element={<ComingSoon title="Unit Converter" />} />

            {/* Quality */}
            <Route path="/quality/treater" element={<ComingSoon title="Treater Monitor" />} />
            <Route path="/quality/opacity" element={<ComingSoon title="Opacity Monitor" />} />
            <Route path="/quality/gloss" element={<ComingSoon title="Gloss Monitor" />} />
            <Route path="/quality/haze" element={<ComingSoon title="Haze Monitor" />} />

            {/* Troubleshooting */}
            <Route path="/troubleshooting/defects" element={<ComingSoon title="Defect Troubleshooter" />} />

            {/* Settings */}
            <Route path="/settings" element={<ComingSoon title="Settings" />} />

            {/* Catch-all */}
            <Route path="*" element={<ComingSoon title="Page Not Found" />} />
          </Routes>
        </MainPanel>
      </div>
    </div>
  );
}

export default App;
