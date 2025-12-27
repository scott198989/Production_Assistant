import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  Activity,
  Ruler,
  Package,
  TrendingUp,
  Cog,
  Search,
  Command as CommandIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  category: string;
  keywords?: string[];
}

const commandItems: CommandItem[] = [
  // Navigation
  { id: "home", label: "Dashboard", path: "/", icon: <Home size={18} />, category: "Navigation" },
  { id: "settings", label: "Settings", path: "/settings", icon: <Settings size={18} />, category: "Navigation" },

  // Calculators
  { id: "roll-weight", label: "Roll Weight Calculator", path: "/calculators/roll-weight", icon: <Scale size={18} />, category: "Calculators", keywords: ["weight", "roll", "calculate"] },
  { id: "gram-weight", label: "Gram Weight Calculator", path: "/calculators/gram-weight", icon: <Package size={18} />, category: "Calculators", keywords: ["gram", "weight"] },
  { id: "bag-weight", label: "Bag Weight Calculator", path: "/calculators/bag-weight", icon: <Package size={18} />, category: "Calculators", keywords: ["bag", "weight"] },
  { id: "pph", label: "Pounds Per Hour", path: "/calculators/pph", icon: <TrendingUp size={18} />, category: "Calculators", keywords: ["pounds", "hour", "rate", "output"] },
  { id: "gauge", label: "Gauge Adjustment", path: "/calculators/gauge-adjustment", icon: <Gauge size={18} />, category: "Calculators", keywords: ["gauge", "fpm", "thickness"] },
  { id: "bur", label: "Blow Up Ratio", path: "/calculators/bur", icon: <Activity size={18} />, category: "Calculators", keywords: ["bur", "bubble", "ratio"] },
  { id: "ppdi", label: "Pounds Per Die Inch", path: "/calculators/ppdi", icon: <Ruler size={18} />, category: "Calculators", keywords: ["die", "inch", "loading"] },
  { id: "feet-roll", label: "Feet on Roll", path: "/calculators/feet-on-roll", icon: <Ruler size={18} />, category: "Calculators", keywords: ["feet", "footage", "roll"] },
  { id: "line-settings", label: "Line Settings", path: "/calculators/line-settings", icon: <Cog size={18} />, category: "Calculators", keywords: ["line", "speed", "settings"] },
  { id: "motor", label: "Motor Calculations", path: "/calculators/motor", icon: <Cog size={18} />, category: "Calculators", keywords: ["motor", "screw", "rpm"] },

  // Tools
  { id: "resin", label: "Resin Timeout", path: "/tools/resin-timeout", icon: <Timer size={18} />, category: "Tools", keywords: ["resin", "timeout", "changeover", "material"] },
  { id: "blade", label: "Blade Position", path: "/tools/blade-position", icon: <Scissors size={18} />, category: "Tools", keywords: ["blade", "position", "cut"] },
  { id: "converter", label: "Unit Converter", path: "/tools/unit-converter", icon: <ArrowRightLeft size={18} />, category: "Tools", keywords: ["unit", "convert", "conversion"] },

  // Quality
  { id: "treater", label: "Treater Monitor", path: "/quality/treater", icon: <Zap size={18} />, category: "Quality", keywords: ["treater", "corona", "dyne"] },
  { id: "opacity", label: "Opacity Monitor", path: "/quality/opacity", icon: <Eye size={18} />, category: "Quality", keywords: ["opacity", "transparent"] },
  { id: "gloss", label: "Gloss Monitor", path: "/quality/gloss", icon: <Sparkles size={18} />, category: "Quality", keywords: ["gloss", "shine"] },
  { id: "haze", label: "Haze Monitor", path: "/quality/haze", icon: <Droplets size={18} />, category: "Quality", keywords: ["haze", "clarity"] },

  // Troubleshooting
  { id: "defects", label: "Defect Troubleshooter", path: "/troubleshooting/defects", icon: <AlertTriangle size={18} />, category: "Troubleshooting", keywords: ["defect", "problem", "issue"] },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle command palette with keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  const groupedItems = commandItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category]?.push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg",
          "bg-slate-800/50 border border-slate-700/50",
          "text-sm text-slate-400 hover:text-slate-300",
          "hover:bg-slate-700/50 hover:border-slate-600/50",
          "transition-all duration-200"
        )}
      >
        <Search size={14} />
        <span>Search...</span>
        <kbd className="ml-2 inline-flex h-5 items-center gap-1 rounded border border-slate-600 bg-slate-700 px-1.5 font-mono text-[10px] font-medium text-slate-400">
          <CommandIcon size={10} />K
        </kbd>
      </button>

      {/* Command palette dialog */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
            >
              <Command
                className={cn(
                  "overflow-hidden rounded-xl",
                  "bg-slate-800/95 backdrop-blur-xl",
                  "border border-slate-700/50",
                  "shadow-2xl shadow-black/40"
                )}
              >
                {/* Search input */}
                <div className="flex items-center gap-3 border-b border-slate-700/50 px-4">
                  <Search className="h-4 w-4 text-slate-500" />
                  <Command.Input
                    placeholder="Search calculators, tools, and more..."
                    className={cn(
                      "flex-1 bg-transparent py-4",
                      "text-slate-100 placeholder:text-slate-500",
                      "outline-none"
                    )}
                    autoFocus
                  />
                  <kbd className="inline-flex h-5 items-center rounded border border-slate-600 bg-slate-700 px-1.5 font-mono text-[10px] text-slate-400">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <Command.List className="max-h-[400px] overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-slate-500">
                    No results found.
                  </Command.Empty>

                  {Object.entries(groupedItems).map(([category, items]) => (
                    <Command.Group
                      key={category}
                      heading={category}
                      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-slate-500"
                    >
                      {items.map((item) => (
                        <Command.Item
                          key={item.id}
                          value={`${item.label} ${item.keywords?.join(" ") || ""}`}
                          onSelect={() => handleSelect(item.path)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
                            "text-slate-300",
                            "data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary",
                            "transition-colors"
                          )}
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-700/50 px-4 py-2 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-600 bg-slate-700 px-1">↵</kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-slate-600 bg-slate-700 px-1">↑↓</kbd>
                      to navigate
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-slate-600 bg-slate-700 px-1">esc</kbd>
                    to close
                  </span>
                </div>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default CommandPalette;
