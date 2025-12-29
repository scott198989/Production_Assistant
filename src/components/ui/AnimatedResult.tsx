import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedResultProps {
  value: number | string;
  unit?: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "default" | "primary" | "success" | "warning" | "danger";
  decimals?: number;
}

export function AnimatedResult({
  value,
  unit,
  label,
  size = "lg",
  color = "default",
  decimals = 1,
}: AnimatedResultProps) {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef<number | string>(value);

  // Format the value
  const formatValue = (val: number | string): string => {
    if (typeof val === "string") return val;
    if (isNaN(val)) return "—";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  useEffect(() => {
    const newFormatted = formatValue(value);
    const prevFormatted = formatValue(prevValue.current);

    if (newFormatted !== prevFormatted && prevValue.current !== "") {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

    setDisplayValue(newFormatted);
    prevValue.current = value;
  }, [value, decimals]);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  const colorClasses = {
    default: "text-slate-900 dark:text-slate-100",
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  return (
    <div className="text-center">
      {label && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
          {label}
        </p>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={displayValue}
          initial={isAnimating ? { opacity: 0, y: -10, scale: 0.95 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`font-bold tabular-nums ${sizeClasses[size]} ${colorClasses[color]}`}
        >
          <motion.span
            animate={isAnimating ? {
              color: ["inherit", "rgb(37, 99, 235)", "inherit"],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {displayValue}
          </motion.span>
          {unit && (
            <span className="ml-1 text-lg font-medium text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default AnimatedResult;
