import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Calculator,
  Scale,
  Gauge,
  Timer,
  Scissors,
  ArrowRightLeft,
  Zap,
  Eye,
  Sparkles,
  Droplets,
  AlertTriangle,
  Settings,
  Home,
  ChevronDown,
  ChevronRight,
  Activity,
  Ruler,
  Package,
  TrendingUp,
  Cog,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    id: "calculators",
    label: "Calculators",
    icon: <Calculator size={18} />,
    items: [
      {
        id: "roll-weight",
        label: "Roll Weight",
        path: "/calculators/roll-weight",
        icon: <Scale size={18} />,
      },
      {
        id: "gram-weight",
        label: "Gram Weight",
        path: "/calculators/gram-weight",
        icon: <Package size={18} />,
      },
      {
        id: "bag-weight",
        label: "Bag Weight",
        path: "/calculators/bag-weight",
        icon: <Package size={18} />,
      },
      {
        id: "pounds-per-hour",
        label: "Pounds Per Hour",
        path: "/calculators/pph",
        icon: <TrendingUp size={18} />,
      },
      {
        id: "gauge-adjustment",
        label: "Gauge Adjustment",
        path: "/calculators/gauge-adjustment",
        icon: <Gauge size={18} />,
      },
      {
        id: "blow-up-ratio",
        label: "Blow Up Ratio",
        path: "/calculators/bur",
        icon: <Activity size={18} />,
      },
      {
        id: "ppdi",
        label: "Pounds Per Die Inch",
        path: "/calculators/ppdi",
        icon: <Ruler size={18} />,
      },
      {
        id: "feet-on-roll",
        label: "Feet on Roll",
        path: "/calculators/feet-on-roll",
        icon: <Ruler size={18} />,
      },
      {
        id: "line-settings",
        label: "Line Settings",
        path: "/calculators/line-settings",
        icon: <Cog size={18} />,
      },
      {
        id: "motor-calculations",
        label: "Motor Calculations",
        path: "/calculators/motor",
        icon: <Cog size={18} />,
      },
      {
        id: "trim-scrap",
        label: "Trim Scrap",
        path: "/calculators/trim-scrap",
        icon: <Scissors size={18} />,
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: <Cog size={18} />,
    items: [
      {
        id: "resin-timeout",
        label: "Resin Timeout",
        path: "/tools/resin-timeout",
        icon: <Timer size={18} />,
      },
      {
        id: "blade-position",
        label: "Blade Position",
        path: "/tools/blade-position",
        icon: <Scissors size={18} />,
      },
      {
        id: "unit-converter",
        label: "Unit Converter",
        path: "/tools/unit-converter",
        icon: <ArrowRightLeft size={18} />,
      },
    ],
  },
  {
    id: "quality",
    label: "Quality",
    icon: <Eye size={18} />,
    items: [
      {
        id: "treater-monitor",
        label: "Treater Monitor",
        path: "/quality/treater",
        icon: <Zap size={18} />,
      },
      {
        id: "opacity-monitor",
        label: "Opacity",
        path: "/quality/opacity",
        icon: <Eye size={18} />,
      },
      {
        id: "gloss-monitor",
        label: "Gloss",
        path: "/quality/gloss",
        icon: <Sparkles size={18} />,
      },
      {
        id: "haze-monitor",
        label: "Haze",
        path: "/quality/haze",
        icon: <Droplets size={18} />,
      },
    ],
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    icon: <AlertTriangle size={18} />,
    items: [
      {
        id: "defect-troubleshooter",
        label: "Defect Troubleshooter",
        path: "/troubleshooting/defects",
        icon: <AlertTriangle size={18} />,
      },
    ],
  },
];

// Mobile bottom nav items - key sections only
const mobileNavItems = [
  { id: "home", label: "Home", path: "/", icon: <Home size={20} /> },
  { id: "calcs", label: "Calcs", path: "/calculators/roll-weight", icon: <Calculator size={20} /> },
  { id: "resin", label: "Resin", path: "/tools/resin-timeout", icon: <Timer size={20} /> },
  { id: "tools", label: "Tools", path: "/tools/unit-converter", icon: <Cog size={20} /> },
  { id: "settings", label: "Settings", path: "/settings", icon: <Settings size={20} /> },
];

export function Sidebar() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    calculators: true,
    tools: true,
    quality: false,
    troubleshooting: false,
  });

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const isActiveSection = (section: NavSection) => {
    return section.items.some((item) => location.pathname.startsWith(item.path));
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <>
        {/* Mobile Header Bar */}
        <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-slate-700 bg-slate-800 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-100">ISOFlex</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Slide-out Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Panel */}
            <div className="fixed bottom-16 left-0 right-0 top-14 z-50 overflow-y-auto bg-slate-800">
              <nav className="p-4">
                {/* Home Link */}
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `mb-2 flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                    }`
                  }
                >
                  <Home size={20} />
                  Dashboard
                </NavLink>

                {/* Sections */}
                {navSections.map((section) => (
                  <div key={section.id} className="mb-2">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                        isActiveSection(section)
                          ? "text-slate-100"
                          : "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {section.icon}
                        {section.label}
                      </div>
                      {expandedSections[section.id] ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>

                    {expandedSections[section.id] && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-slate-700 pl-4">
                        {section.items.map((item) => (
                          <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-colors ${
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                              }`
                            }
                          >
                            {item.icon}
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Settings */}
                <div className="mt-4 border-t border-slate-700 pt-4">
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                      }`
                    }
                  >
                    <Settings size={20} />
                    Settings
                  </NavLink>
                </div>
              </nav>
            </div>
          </>
        )}

        {/* Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700 bg-slate-800 pb-safe">
          <div className="flex h-16 items-center justify-around">
            {mobileNavItems.map((item) => {
              const isActive = item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path.split("/").slice(0, 2).join("/"));

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
                    isActive ? "text-primary" : "text-slate-400"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </>
    );
  }

  // Desktop Layout
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-700 bg-slate-800">
      {/* Logo / App Title */}
      <div className="flex h-16 items-center border-b border-slate-700 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100">ISOFlex</h1>
            <p className="text-xs text-slate-400">Production Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* Home Link */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
            }`
          }
        >
          <Home size={18} />
          Dashboard
        </NavLink>

        {/* Sections */}
        {navSections.map((section) => (
          <div key={section.id} className="mb-2">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActiveSection(section)
                  ? "text-slate-100"
                  : "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {section.icon}
                {section.label}
              </div>
              {expandedSections[section.id] ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {/* Section Items */}
            {expandedSections[section.id] && (
              <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-700 pl-3">
                {section.items.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="border-t border-slate-700 p-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
            }`
          }
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
