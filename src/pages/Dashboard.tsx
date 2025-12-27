import { Link } from "react-router-dom";
import {
  Scale,
  Package,
  TrendingUp,
  Gauge,
  Activity,
  Ruler,
  Timer,
  Scissors,
  ArrowRightLeft,
  Zap,
} from "lucide-react";

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

const quickAccessCards: QuickAccessCard[] = [
  {
    id: "roll-weight",
    title: "Roll Weight",
    description: "Calculate roll weight from dimensions",
    path: "/calculators/roll-weight",
    icon: <Scale size={24} />,
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "pph",
    title: "Pounds Per Hour",
    description: "Calculate production output rate",
    path: "/calculators/pph",
    icon: <TrendingUp size={24} />,
    color: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    id: "resin-timeout",
    title: "Resin Timeout",
    description: "Calculate changeover timing",
    path: "/tools/resin-timeout",
    icon: <Timer size={24} />,
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "gauge-adjustment",
    title: "Gauge Adjustment",
    description: "Calculate FPM for gauge change",
    path: "/calculators/gauge-adjustment",
    icon: <Gauge size={24} />,
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    id: "bur",
    title: "Blow Up Ratio",
    description: "Calculate bubble BUR",
    path: "/calculators/bur",
    icon: <Activity size={24} />,
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert between common units",
    path: "/tools/unit-converter",
    icon: <ArrowRightLeft size={24} />,
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
];

const allCalculators = [
  { title: "Roll Weight", path: "/calculators/roll-weight", icon: <Scale size={18} /> },
  { title: "Gram Weight", path: "/calculators/gram-weight", icon: <Package size={18} /> },
  { title: "Bag Weight", path: "/calculators/bag-weight", icon: <Package size={18} /> },
  { title: "Pounds Per Hour", path: "/calculators/pph", icon: <TrendingUp size={18} /> },
  { title: "Gauge Adjustment", path: "/calculators/gauge-adjustment", icon: <Gauge size={18} /> },
  { title: "Blow Up Ratio", path: "/calculators/bur", icon: <Activity size={18} /> },
  { title: "Pounds Per Die Inch", path: "/calculators/ppdi", icon: <Ruler size={18} /> },
  { title: "Feet on Roll", path: "/calculators/feet-on-roll", icon: <Ruler size={18} /> },
];

const allTools = [
  { title: "Resin Timeout", path: "/tools/resin-timeout", icon: <Timer size={18} /> },
  { title: "Blade Position", path: "/tools/blade-position", icon: <Scissors size={18} /> },
  { title: "Unit Converter", path: "/tools/unit-converter", icon: <ArrowRightLeft size={18} /> },
  { title: "Treater Monitor", path: "/quality/treater", icon: <Zap size={18} /> },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100">
          Welcome to ISOFlex Dashboard
        </h2>
        <p className="mt-1 text-slate-400">
          Production floor tools for blown film extrusion operators
        </p>
      </div>

      {/* Quick Access */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-200">
          Quick Access
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccessCards.map((card) => (
            <Link
              key={card.id}
              to={card.path}
              className={`group rounded-xl border p-5 transition-all hover:scale-[1.02] hover:shadow-lg ${card.color}`}
            >
              <div className="mb-3">{card.icon}</div>
              <h4 className="font-semibold text-slate-100 group-hover:text-white">
                {card.title}
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* All Tools Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calculators */}
        <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-200">
            Calculators
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {allCalculators.map((calc) => (
              <Link
                key={calc.path}
                to={calc.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100"
              >
                <span className="text-slate-500">{calc.icon}</span>
                {calc.title}
              </Link>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-200">
            Tools & Monitors
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {allTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100"
              >
                <span className="text-slate-500">{tool.icon}</span>
                {tool.title}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Version Info */}
      <div className="pt-4 text-center text-xs text-slate-600">
        ISOFlex Dashboard v0.1.0 • Phase 1 Build
      </div>
    </div>
  );
}

export default Dashboard;
