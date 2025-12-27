import { useState, useMemo } from "react";
import { RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { StatusBadge } from "../ui/StatusBadge";
import { RangeIndicator } from "../ui/RangeIndicator";
import type { SpecStatus } from "../../types";

interface QualityMonitorProps {
  title: string;
  subtitle: string;
  unit: string;
  defaultTarget?: number;
  defaultMin?: number;
  defaultMax?: number;
  adjustmentGuidance?: {
    low: string;
    high: string;
  };
}

interface Inputs {
  current: number | string;
  target: number | string;
  min: number | string;
  max: number | string;
}

interface Reading {
  value: number;
  timestamp: Date;
}

export function QualityMonitor({
  title,
  subtitle,
  unit,
  defaultTarget = 50,
  defaultMin = 40,
  defaultMax = 60,
  adjustmentGuidance,
}: QualityMonitorProps) {
  const [inputs, setInputs] = useState<Inputs>({
    current: "",
    target: defaultTarget,
    min: defaultMin,
    max: defaultMax,
  });

  const [readings, setReadings] = useState<Reading[]>([]);

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddReading = () => {
    const currentValue = typeof inputs.current === "number"
      ? inputs.current
      : parseFloat(inputs.current as string);

    if (!isNaN(currentValue)) {
      setReadings((prev) => [
        { value: currentValue, timestamp: new Date() },
        ...prev.slice(0, 9), // Keep last 10 readings
      ]);
    }
  };

  const handleReset = () => {
    setInputs({
      current: "",
      target: defaultTarget,
      min: defaultMin,
      max: defaultMax,
    });
    setReadings([]);
  };

  const analysis = useMemo(() => {
    const current = typeof inputs.current === "number" ? inputs.current : parseFloat(inputs.current as string);
    const target = typeof inputs.target === "number" ? inputs.target : parseFloat(inputs.target as string);
    const min = typeof inputs.min === "number" ? inputs.min : parseFloat(inputs.min as string);
    const max = typeof inputs.max === "number" ? inputs.max : parseFloat(inputs.max as string);

    if (isNaN(current) || isNaN(target) || isNaN(min) || isNaN(max)) {
      return null;
    }

    // Determine status
    let status: SpecStatus = "in_spec";
    if (current < min || current > max) {
      status = "out_of_spec";
    } else {
      const range = max - min;
      const warningMargin = range * 0.1;
      if (current < min + warningMargin || current > max - warningMargin) {
        status = "warning";
      }
    }

    // Calculate deviation from target
    const deviation = current - target;
    const percentDeviation = (deviation / target) * 100;

    // Trend from readings
    let trend: "up" | "down" | "stable" | null = null;
    if (readings.length >= 2) {
      const recent = readings.slice(0, 3);
      const avgRecent = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
      const older = readings.slice(3, 6);
      if (older.length > 0) {
        const avgOlder = older.reduce((sum, r) => sum + r.value, 0) / older.length;
        if (avgRecent > avgOlder + 1) trend = "up";
        else if (avgRecent < avgOlder - 1) trend = "down";
        else trend = "stable";
      }
    }

    return {
      current,
      target,
      min,
      max,
      status,
      deviation,
      percentDeviation,
      trend,
      isLow: current < target,
      isHigh: current > target,
    };
  }, [inputs, readings]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title={title}
          subtitle={subtitle}
        />

        <CardBody>
          <div className="space-y-6">
            {/* Spec Limits */}
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberInput
                label="Min Acceptable"
                value={inputs.min}
                onChange={handleInputChange("min")}
                unit={unit}
                min={0}
              />
              <NumberInput
                label="Target"
                value={inputs.target}
                onChange={handleInputChange("target")}
                unit={unit}
                min={0}
              />
              <NumberInput
                label="Max Acceptable"
                value={inputs.max}
                onChange={handleInputChange("max")}
                unit={unit}
                min={0}
              />
            </div>

            {/* Current Reading */}
            <div className="flex gap-4">
              <div className="flex-1">
                <NumberInput
                  label="Current Reading"
                  value={inputs.current}
                  onChange={handleInputChange("current")}
                  unit={unit}
                  placeholder="Enter reading"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddReading}
                  className="btn-secondary"
                  disabled={inputs.current === ""}
                >
                  Log Reading
                </button>
              </div>
            </div>

            {/* Range Indicator */}
            {analysis && (
              <RangeIndicator
                current={analysis.current}
                min={analysis.min}
                target={analysis.target}
                max={analysis.max}
                unit={unit}
              />
            )}
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              {/* Status */}
              {analysis && (
                <div className="flex items-center gap-4">
                  <StatusBadge status={analysis.status} size="large" />

                  {/* Trend */}
                  {analysis.trend && (
                    <div className="flex items-center gap-2 text-sm">
                      {analysis.trend === "up" && (
                        <>
                          <TrendingUp size={18} className="text-warning" />
                          <span className="text-slate-400">Trending up</span>
                        </>
                      )}
                      {analysis.trend === "down" && (
                        <>
                          <TrendingDown size={18} className="text-warning" />
                          <span className="text-slate-400">Trending down</span>
                        </>
                      )}
                      {analysis.trend === "stable" && (
                        <>
                          <Minus size={18} className="text-success" />
                          <span className="text-slate-400">Stable</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Deviation */}
              {analysis && (
                <div className="text-sm text-slate-400">
                  <span>Deviation from target: </span>
                  <span className={analysis.deviation === 0 ? "text-success" : "text-warning"}>
                    {analysis.deviation >= 0 ? "+" : ""}
                    {analysis.deviation.toFixed(1)} {unit} ({analysis.percentDeviation.toFixed(1)}%)
                  </span>
                </div>
              )}

              {/* Adjustment Guidance */}
              {analysis && adjustmentGuidance && analysis.status !== "in_spec" && (
                <div className="rounded-lg bg-slate-700/50 p-3">
                  <p className="text-sm font-medium text-slate-300">Adjustment Needed:</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {analysis.isLow ? adjustmentGuidance.low : adjustmentGuidance.high}
                  </p>
                </div>
              )}

              {/* Reading History */}
              {readings.length > 0 && (
                <div className="rounded-lg bg-slate-700/50 p-3">
                  <p className="mb-2 text-sm font-medium text-slate-300">Recent Readings:</p>
                  <div className="flex flex-wrap gap-2">
                    {readings.slice(0, 5).map((reading, index) => (
                      <span
                        key={index}
                        className="rounded bg-slate-600 px-2 py-1 text-sm text-slate-300"
                      >
                        {reading.value.toFixed(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleReset} className="btn-ghost" title="Reset all">
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default QualityMonitor;
