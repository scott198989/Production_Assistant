import { useState, useMemo } from "react";
import { Scissors, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { StatusBadge } from "../ui/StatusBadge";
import type { SpecStatus } from "../../types";

interface BladeInputs {
  currentLayflat: number | string;
  targetLayflat: number | string;
  minLayflat: number | string;
  maxLayflat: number | string;
  bladeCount: number;
  bladePositions: (number | string)[];
}

export function BladePosition() {
  const [inputs, setInputs] = useState<BladeInputs>({
    currentLayflat: "",
    targetLayflat: "",
    minLayflat: "",
    maxLayflat: "",
    bladeCount: 2,
    bladePositions: ["", ""],
  });

  const handleInputChange = (field: keyof BladeInputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleBladeCountChange = (count: number) => {
    setInputs((prev) => ({
      ...prev,
      bladeCount: count,
      bladePositions: Array(count).fill(""),
    }));
  };

  const handleBladePositionChange = (index: number) => (value: number | string) => {
    setInputs((prev) => {
      const newPositions = [...prev.bladePositions];
      newPositions[index] = value;
      return { ...prev, bladePositions: newPositions };
    });
  };

  const handleReset = () => {
    setInputs({
      currentLayflat: "",
      targetLayflat: "",
      minLayflat: "",
      maxLayflat: "",
      bladeCount: 2,
      bladePositions: ["", ""],
    });
  };

  const calculations = useMemo(() => {
    const currentLayflat = typeof inputs.currentLayflat === "number" ? inputs.currentLayflat : parseFloat(inputs.currentLayflat as string);
    const targetLayflat = typeof inputs.targetLayflat === "number" ? inputs.targetLayflat : parseFloat(inputs.targetLayflat as string);

    if (isNaN(currentLayflat) || isNaN(targetLayflat)) {
      return null;
    }

    if (currentLayflat <= 0 || targetLayflat <= 0) {
      return null;
    }

    const totalAdjustment = targetLayflat - currentLayflat;
    const perBladeAdjustment = totalAdjustment / inputs.bladeCount;
    const direction = totalAdjustment > 0 ? "out" : totalAdjustment < 0 ? "in" : "none";

    // Calculate new blade positions
    const newPositions = inputs.bladePositions.map((pos) => {
      const currentPos = typeof pos === "number" ? pos : parseFloat(pos as string);
      if (isNaN(currentPos)) return null;
      return currentPos + perBladeAdjustment;
    });

    return {
      totalAdjustment,
      perBladeAdjustment,
      direction,
      newPositions,
      resultingLayflat: targetLayflat,
    };
  }, [inputs]);

  // Determine if target is in spec
  const specStatus = useMemo((): SpecStatus | null => {
    const targetLayflat = typeof inputs.targetLayflat === "number" ? inputs.targetLayflat : parseFloat(inputs.targetLayflat as string);
    const minLayflat = typeof inputs.minLayflat === "number" ? inputs.minLayflat : parseFloat(inputs.minLayflat as string);
    const maxLayflat = typeof inputs.maxLayflat === "number" ? inputs.maxLayflat : parseFloat(inputs.maxLayflat as string);

    if (isNaN(targetLayflat)) return null;
    if (isNaN(minLayflat) || isNaN(maxLayflat)) return null;

    if (targetLayflat < minLayflat || targetLayflat > maxLayflat) {
      return "out_of_spec";
    }

    // Warning if within 5% of limits
    const range = maxLayflat - minLayflat;
    const warningMargin = range * 0.1;
    if (targetLayflat < minLayflat + warningMargin || targetLayflat > maxLayflat - warningMargin) {
      return "warning";
    }

    return "in_spec";
  }, [inputs.targetLayflat, inputs.minLayflat, inputs.maxLayflat]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Blade Position Calculator"
          subtitle="Calculate blade adjustments for target layflat"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Layflat Settings */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Layflat Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Current Layflat"
                  value={inputs.currentLayflat}
                  onChange={handleInputChange("currentLayflat")}
                  unit="in"
                  placeholder="24.0"
                  min={0}
                />

                <NumberInput
                  label="Target Layflat"
                  value={inputs.targetLayflat}
                  onChange={handleInputChange("targetLayflat")}
                  unit="in"
                  placeholder="24.5"
                  min={0}
                />

                <NumberInput
                  label="Min Acceptable"
                  value={inputs.minLayflat}
                  onChange={handleInputChange("minLayflat")}
                  unit="in"
                  placeholder="24.0"
                  min={0}
                  hint="Lower spec limit"
                />

                <NumberInput
                  label="Max Acceptable"
                  value={inputs.maxLayflat}
                  onChange={handleInputChange("maxLayflat")}
                  unit="in"
                  placeholder="25.0"
                  min={0}
                  hint="Upper spec limit"
                />
              </div>
            </div>

            {/* Blade Count */}
            <div>
              <label className="label">Number of Blades</label>
              <div className="flex gap-2">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleBladeCountChange(count)}
                    className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                      inputs.bladeCount === count
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {count} Blades
                  </button>
                ))}
              </div>
            </div>

            {/* Current Blade Positions */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Current Blade Positions (Optional)</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {inputs.bladePositions.map((pos, index) => (
                  <NumberInput
                    key={index}
                    label={`Blade ${index + 1}`}
                    value={pos}
                    onChange={handleBladePositionChange(index)}
                    unit="in"
                    placeholder="0.0"
                  />
                ))}
              </div>
            </div>
          </div>
        </CardBody>

        <CardFooter>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              {/* Adjustment Results */}
              {calculations && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-slate-700 px-4 py-3">
                      <p className="text-xs text-slate-400">Total Adjustment</p>
                      <p className="text-2xl font-bold text-slate-100">
                        {calculations.totalAdjustment >= 0 ? "+" : ""}
                        {calculations.totalAdjustment.toFixed(3)}"
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-700 px-4 py-3">
                      <p className="text-xs text-slate-400">Per Blade</p>
                      <p className="text-2xl font-bold text-slate-100">
                        {calculations.perBladeAdjustment >= 0 ? "+" : ""}
                        {calculations.perBladeAdjustment.toFixed(3)}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-3">
                      {calculations.direction === "out" ? (
                        <>
                          <ArrowRight className="text-success" size={24} />
                          <span className="font-medium text-success">Move Out</span>
                        </>
                      ) : calculations.direction === "in" ? (
                        <>
                          <ArrowLeft className="text-warning" size={24} />
                          <span className="font-medium text-warning">Move In</span>
                        </>
                      ) : (
                        <span className="font-medium text-slate-400">No Change</span>
                      )}
                    </div>
                  </div>

                  {/* New Positions */}
                  {calculations.newPositions.some((p) => p !== null) && (
                    <div className="rounded-lg bg-slate-700/50 p-4">
                      <p className="mb-2 text-sm font-medium text-slate-300">New Blade Positions:</p>
                      <div className="flex flex-wrap gap-4">
                        {calculations.newPositions.map((pos, index) => (
                          pos !== null && (
                            <div key={index} className="text-center">
                              <p className="text-xs text-slate-400">Blade {index + 1}</p>
                              <p className="text-lg font-semibold text-slate-200">
                                {pos.toFixed(3)}"
                              </p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Spec Status */}
                  {specStatus && (
                    <div className="flex items-center gap-3">
                      <StatusBadge status={specStatus} />
                      <span className="text-sm text-slate-400">
                        Target layflat: {calculations.resultingLayflat.toFixed(3)}"
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            <button onClick={handleReset} className="btn-ghost" title="Reset all inputs">
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </CardFooter>
      </Card>

      {/* Quick Reference */}
      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Scissors size={16} />
          Quick Reference
        </h3>
        <div className="text-sm text-slate-400">
          <p>Per-blade adjustment = (Target - Current) ÷ Number of Blades</p>
          <p className="mt-2 text-xs text-slate-500">
            Adjustments are evenly distributed across all blades. Move blades OUT to increase layflat, IN to decrease.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BladePosition;
