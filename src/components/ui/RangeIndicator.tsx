import { useMemo } from "react";
import type { SpecStatus } from "../../types";

interface RangeIndicatorProps {
  current: number;
  min: number;
  target: number;
  max: number;
  unit?: string;
  showLabels?: boolean;
  className?: string;
}

export function RangeIndicator({
  current,
  min,
  target,
  max,
  unit = "",
  showLabels = true,
  className = "",
}: RangeIndicatorProps) {
  const { position, status } = useMemo(() => {
    // Calculate position as percentage (0-100)
    const range = max - min;
    const rawPosition = ((current - min) / range) * 100;
    const position = Math.max(0, Math.min(100, rawPosition));

    // Determine status
    let status: SpecStatus = "in_spec";
    if (current < min || current > max) {
      status = "out_of_spec";
    } else {
      // Warning if within 10% of limits
      const warningMargin = range * 0.1;
      if (current < min + warningMargin || current > max - warningMargin) {
        status = "warning";
      }
    }

    return { position, status };
  }, [current, min, max]);

  const targetPosition = useMemo(() => {
    const range = max - min;
    return ((target - min) / range) * 100;
  }, [target, min, max]);

  return (
    <div className={className}>
      {/* Current Value Display */}
      <div className="mb-2 flex items-baseline justify-between">
        <span className={`text-2xl font-bold ${
          status === "in_spec" ? "text-success" :
          status === "warning" ? "text-warning" : "text-danger"
        }`}>
          {current.toFixed(1)}
          {unit && <span className="ml-1 text-sm font-normal">{unit}</span>}
        </span>
        <span className="text-sm text-slate-400">
          Target: {target.toFixed(1)}{unit}
        </span>
      </div>

      {/* Range Bar */}
      <div className="relative h-8 rounded-lg bg-slate-700 overflow-hidden">
        {/* Gradient zones */}
        <div className="absolute inset-0 flex">
          {/* Red zone (below min) */}
          <div className="w-[10%] bg-danger/30" />
          {/* Warning zone (low) */}
          <div className="w-[10%] bg-warning/30" />
          {/* Green zone (in spec) */}
          <div className="flex-1 bg-success/30" />
          {/* Warning zone (high) */}
          <div className="w-[10%] bg-warning/30" />
          {/* Red zone (above max) */}
          <div className="w-[10%] bg-danger/30" />
        </div>

        {/* Target marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/50"
          style={{ left: `${targetPosition}%` }}
        />

        {/* Current position indicator */}
        <div
          className="absolute top-1 bottom-1 w-3 rounded transition-all duration-300"
          style={{
            left: `calc(${position}% - 6px)`,
            backgroundColor: status === "in_spec" ? "#22c55e" :
              status === "warning" ? "#eab308" : "#ef4444",
          }}
        />
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{min.toFixed(1)}</span>
          <span>Min</span>
          <span className="text-slate-400">Target</span>
          <span>Max</span>
          <span>{max.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}

export default RangeIndicator;
