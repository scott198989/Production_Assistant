import { motion } from "framer-motion";

interface Preset {
  label: string;
  value: number;
}

interface QuickPresetsProps {
  presets: Preset[];
  onSelect: (value: number) => void;
  currentValue?: number | string;
  label?: string;
}

export function QuickPresets({ presets, onSelect, currentValue, label }: QuickPresetsProps) {
  const numericCurrent = typeof currentValue === "string" ? parseFloat(currentValue) : currentValue;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {label && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">{label}</span>
      )}
      {presets.map((preset) => {
        const isActive = numericCurrent === preset.value;
        return (
          <motion.button
            key={preset.value}
            type="button"
            onClick={() => onSelect(preset.value)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {preset.label}
          </motion.button>
        );
      })}
    </div>
  );
}

// Common preset configurations
export const GAUGE_PRESETS: Preset[] = [
  { label: "1.0", value: 1.0 },
  { label: "1.25", value: 1.25 },
  { label: "1.5", value: 1.5 },
  { label: "2.0", value: 2.0 },
  { label: "2.5", value: 2.5 },
  { label: "3.0", value: 3.0 },
];

export const FPM_PRESETS: Preset[] = [
  { label: "150", value: 150 },
  { label: "200", value: 200 },
  { label: "250", value: 250 },
  { label: "300", value: 300 },
  { label: "350", value: 350 },
];

export const WIDTH_PRESETS: Preset[] = [
  { label: "12\"", value: 12 },
  { label: "18\"", value: 18 },
  { label: "24\"", value: 24 },
  { label: "36\"", value: 36 },
  { label: "48\"", value: 48 },
];

export const WEB_SIZE_PRESETS: Preset[] = [
  { label: "40\"", value: 40 },
  { label: "48\"", value: 48 },
  { label: "52\"", value: 52 },
  { label: "58\"", value: 58 },
  { label: "60\"", value: 60 },
];

export const RUN_TIME_PRESETS: Preset[] = [
  { label: "4 hr", value: 4 },
  { label: "8 hr", value: 8 },
  { label: "12 hr", value: 12 },
];

export const LENGTH_PRESETS: Preset[] = [
  { label: "2500", value: 2500 },
  { label: "5000", value: 5000 },
  { label: "7500", value: 7500 },
  { label: "10000", value: 10000 },
];

export default QuickPresets;
