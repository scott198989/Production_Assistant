import { motion } from "framer-motion";
import { useCalculator } from "../../contexts/CalculatorContext";

interface UnitToggleProps {
  className?: string;
}

export function UnitToggle({ className = "" }: UnitToggleProps) {
  const { useMetric, toggleUnits } = useCalculator();

  return (
    <button
      onClick={toggleUnits}
      className={`flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 ${className}`}
    >
      <motion.span
        className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
          !useMetric
            ? "bg-primary text-white"
            : "text-slate-500 dark:text-slate-400"
        }`}
        whileHover={useMetric ? { scale: 1.02 } : {}}
        whileTap={useMetric ? { scale: 0.98 } : {}}
      >
        Imperial
      </motion.span>
      <motion.span
        className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
          useMetric
            ? "bg-primary text-white"
            : "text-slate-500 dark:text-slate-400"
        }`}
        whileHover={!useMetric ? { scale: 1.02 } : {}}
        whileTap={!useMetric ? { scale: 0.98 } : {}}
      >
        Metric
      </motion.span>
    </button>
  );
}

// Unit conversion utilities
export const convertUnits = {
  // Length
  inchesToMm: (inches: number) => inches * 25.4,
  mmToInches: (mm: number) => mm / 25.4,
  feetToMeters: (feet: number) => feet * 0.3048,
  metersToFeet: (meters: number) => meters / 0.3048,

  // Weight
  lbsToKg: (lbs: number) => lbs * 0.453592,
  kgToLbs: (kg: number) => kg / 0.453592,

  // Speed
  fpmToMpm: (fpm: number) => fpm * 0.3048, // feet per minute to meters per minute
  mpmToFpm: (mpm: number) => mpm / 0.3048,

  // Thickness
  milsToMicrons: (mils: number) => mils * 25.4,
  micronsToMils: (microns: number) => microns / 25.4,
};

export const getUnitLabel = (type: "length" | "thickness" | "speed" | "weight", useMetric: boolean): string => {
  const labels = {
    length: useMetric ? "mm" : "in",
    thickness: useMetric ? "μm" : "mil",
    speed: useMetric ? "m/min" : "FPM",
    weight: useMetric ? "kg" : "lbs",
  };
  return labels[type];
};

export default UnitToggle;
