import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { MainPanel } from "./components/layout/MainPanel";

// UI Components
import { CommandPalette } from "./components/ui/CommandPalette";
import { Toaster } from "./components/ui/Toaster";
import { BackgroundEffects } from "./components/ui/BackgroundEffects";
import { PageTransition } from "./components/ui/PageTransition";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";

// Calculators
import { RollWeight } from "./components/calculators/RollWeight";
import { GramWeight } from "./components/calculators/GramWeight";
import { BagWeight } from "./components/calculators/BagWeight";
import { PoundsPerHour } from "./components/calculators/PoundsPerHour";
import { GaugeAdjustment } from "./components/calculators/GaugeAdjustment";
import { BlowUpRatio } from "./components/calculators/BlowUpRatio";
import { PoundsPerDieInch } from "./components/calculators/PoundsPerDieInch";
import { FeetOnRoll } from "./components/calculators/FeetOnRoll";
import { LineSettings } from "./components/calculators/LineSettings";
import { MotorCalculations } from "./components/calculators/MotorCalculations";
import { TrimScrapCalculator } from "./components/calculators/TrimScrapCalculator";

// Tools
import { ResinTimeout } from "./components/calculators/ResinTimeout";
import { BladePosition } from "./components/calculators/BladePosition";
import { UnitConverter } from "./components/calculators/UnitConverter";

// Quality Monitors
import { TreaterMonitor } from "./components/quality/TreaterMonitor";
import { OpacityMonitor } from "./components/quality/OpacityMonitor";
import { GlossMonitor } from "./components/quality/GlossMonitor";
import { HazeMonitor } from "./components/quality/HazeMonitor";

// Placeholder for features not yet built
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
  "/calculators/trim-scrap": { title: "Trim Scrap", subtitle: "Calculate edge trim scrap weight" },
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Background Effects */}
      <BackgroundEffects variant="default" />

      {/* Sidebar - handles its own mobile/desktop rendering */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`relative z-10 flex flex-1 flex-col overflow-hidden ${isMobile ? "w-full" : ""}`}>
        {/* Header - hide on mobile as Sidebar provides mobile header */}
        {!isMobile && <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />}

        {/* Main Panel with Routes */}
        <MainPanel>
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                {/* Dashboard */}
                <Route path="/" element={<Dashboard />} />

                {/* Calculators */}
                <Route path="/calculators/roll-weight" element={<RollWeight />} />
                <Route path="/calculators/gram-weight" element={<GramWeight />} />
                <Route path="/calculators/bag-weight" element={<BagWeight />} />
                <Route path="/calculators/pph" element={<PoundsPerHour />} />
                <Route path="/calculators/gauge-adjustment" element={<GaugeAdjustment />} />
                <Route path="/calculators/bur" element={<BlowUpRatio />} />
                <Route path="/calculators/ppdi" element={<PoundsPerDieInch />} />
                <Route path="/calculators/feet-on-roll" element={<FeetOnRoll />} />
                <Route path="/calculators/line-settings" element={<LineSettings />} />
                <Route path="/calculators/motor" element={<MotorCalculations />} />
                <Route path="/calculators/trim-scrap" element={<TrimScrapCalculator />} />

                {/* Tools */}
                <Route path="/tools/resin-timeout" element={<ResinTimeout />} />
                <Route path="/tools/blade-position" element={<BladePosition />} />
                <Route path="/tools/unit-converter" element={<UnitConverter />} />

                {/* Quality */}
                <Route path="/quality/treater" element={<TreaterMonitor />} />
                <Route path="/quality/opacity" element={<OpacityMonitor />} />
                <Route path="/quality/gloss" element={<GlossMonitor />} />
                <Route path="/quality/haze" element={<HazeMonitor />} />

                {/* Troubleshooting - Coming Soon */}
                <Route path="/troubleshooting/defects" element={<ComingSoon title="Defect Troubleshooter" />} />

                {/* Settings */}
                <Route path="/settings" element={<Settings />} />

                {/* Catch-all */}
                <Route path="*" element={<ComingSoon title="Page Not Found" />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </MainPanel>
      </div>

      {/* Command Palette - Global */}
      <CommandPalette />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
