import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  Sparkles,
  Command,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { GlassCard, GlassCardBody } from "@/components/ui/GlassCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";

interface QuickAccessCard {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange" | "cyan" | "pink";
}

const quickAccessCards: QuickAccessCard[] = [
  {
    id: "roll-weight",
    title: "Roll Weight",
    description: "Calculate roll weight from dimensions",
    path: "/calculators/roll-weight",
    icon: <Scale size={24} />,
    color: "blue",
  },
  {
    id: "pph",
    title: "Pounds Per Hour",
    description: "Calculate production output rate",
    path: "/calculators/pph",
    icon: <TrendingUp size={24} />,
    color: "green",
  },
  {
    id: "resin-timeout",
    title: "Resin Timeout",
    description: "Calculate changeover timing",
    path: "/tools/resin-timeout",
    icon: <Timer size={24} />,
    color: "purple",
  },
  {
    id: "gauge-adjustment",
    title: "Gauge Adjustment",
    description: "Calculate FPM for gauge change",
    path: "/calculators/gauge-adjustment",
    icon: <Gauge size={24} />,
    color: "orange",
  },
  {
    id: "bur",
    title: "Blow Up Ratio",
    description: "Calculate bubble BUR",
    path: "/calculators/bur",
    icon: <Activity size={24} />,
    color: "cyan",
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert between common units",
    path: "/tools/unit-converter",
    icon: <ArrowRightLeft size={24} />,
    color: "pink",
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
      {/* Welcome Section with gradient text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-400"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold">
              <span className="gradient-text">Welcome to ISOFlex</span>
            </h2>
            <p className="mt-0.5 text-slate-400">
              Production floor tools for blown film extrusion operators
            </p>
          </div>
        </div>

        {/* Command palette hint */}
        <motion.div
          className="mt-4 flex items-center gap-2 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span>Quick tip: Press</span>
          <kbd className="inline-flex items-center gap-1 rounded border border-slate-600 bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-400">
            <Command size={12} />K
          </kbd>
          <span>to search anywhere</span>
        </motion.div>
      </motion.div>

      {/* Quick Access - Spotlight Cards */}
      <section>
        <motion.h3
          className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Quick Access
        </motion.h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickAccessCards.map((card, index) => (
            <SpotlightCard
              key={card.id}
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.path}
              color={card.color}
              delay={0.1 * index}
            />
          ))}
        </div>
      </section>

      {/* All Tools Grid with Glass Cards */}
      <StaggerContainer className="grid gap-6 lg:grid-cols-2" delay={0.3}>
        {/* Calculators */}
        <StaggerItem>
          <GlassCard className="h-full">
            <GlassCardBody>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-200">
                <Scale size={20} className="text-primary" />
                Calculators
              </h3>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {allCalculators.map((calc) => (
                  <Link
                    key={calc.path}
                    to={calc.path}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-all hover:bg-slate-700/50 hover:text-slate-100"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50 text-slate-500 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                      {calc.icon}
                    </span>
                    {calc.title}
                  </Link>
                ))}
              </div>
            </GlassCardBody>
          </GlassCard>
        </StaggerItem>

        {/* Tools */}
        <StaggerItem>
          <GlassCard className="h-full">
            <GlassCardBody>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-200">
                <Zap size={20} className="text-purple-400" />
                Tools & Monitors
              </h3>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {allTools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-all hover:bg-slate-700/50 hover:text-slate-100"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50 text-slate-500 transition-colors group-hover:bg-purple-500/20 group-hover:text-purple-400">
                      {tool.icon}
                    </span>
                    {tool.title}
                  </Link>
                ))}
              </div>
            </GlassCardBody>
          </GlassCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Version Info with animation */}
      <motion.div
        className="pt-4 text-center text-xs text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="inline-flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
          ISOFlex Dashboard v0.1.0 • Phase 1 Build
        </span>
      </motion.div>
    </div>
  );
}

export default Dashboard;
