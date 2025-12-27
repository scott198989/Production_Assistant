import { useState, useMemo } from "react";
import { Cog, RotateCcw, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculateNewLineSetting, calculatePoundsPerHour } from "../../utils/formulas";

interface Inputs {
  oldLayflat: number | string;
  newLayflat: number | string;
  oldGauge: number | string;
  newGauge: number | string;
  oldLineSpeed: number | string;
}

export function LineSettings() {
  const [inputs, setInputs] = useState<Inputs>({
    oldLayflat: "",
    newLayflat: "",
    oldGauge: "",
    newGauge: "",
    oldLineSpeed: "",
  });

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({
      oldLayflat: "",
      newLayflat: "",
      oldGauge: "",
      newGauge: "",
      oldLineSpeed: "",
    });
  };

  const calculations = useMemo(() => {
    const oldLayflat = typeof inputs.oldLayflat === "number" ? inputs.oldLayflat : parseFloat(inputs.oldLayflat as string);
    const newLayflat = typeof inputs.newLayflat === "number" ? inputs.newLayflat : parseFloat(inputs.newLayflat as string);
    const oldGauge = typeof inputs.oldGauge === "number" ? inputs.oldGauge : parseFloat(inputs.oldGauge as string);
    const newGauge = typeof inputs.newGauge === "number" ? inputs.newGauge : parseFloat(inputs.newGauge as string);
    const oldLineSpeed = typeof inputs.oldLineSpeed === "number" ? inputs.oldLineSpeed : parseFloat(inputs.oldLineSpeed as string);

    if (isNaN(oldLayflat) || isNaN(newLayflat) || isNaN(oldGauge) || isNaN(newGauge) || isNaN(oldLineSpeed)) {
      return null;
    }

    if (oldLayflat <= 0 || newLayflat <= 0 || oldGauge <= 0 || newGauge <= 0 || oldLineSpeed <= 0) {
      return null;
    }

    const newLineSpeed = calculateNewLineSetting(oldLayflat, newLayflat, oldGauge, newGauge, oldLineSpeed);
    const speedChange = newLineSpeed - oldLineSpeed;
    const percentChange = ((newLineSpeed - oldLineSpeed) / oldLineSpeed) * 100;

    // Calculate PPH for both settings
    const oldPPH = calculatePoundsPerHour(oldLayflat, oldGauge, oldLineSpeed);
    const newPPH = calculatePoundsPerHour(newLayflat, newGauge, newLineSpeed);

    return {
      newLineSpeed,
      speedChange,
      percentChange,
      oldPPH,
      newPPH,
    };
  }, [inputs]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Line Settings Calculator"
          subtitle="Calculate new line speed when changing layflat or gauge"
          infoTooltip="(Old LF ÷ New LF) × (Old Gauge ÷ New Gauge) × Old Speed = New Speed"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Current Settings */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Current Settings</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <NumberInput
                  label="Current Layflat"
                  value={inputs.oldLayflat}
                  onChange={handleInputChange("oldLayflat")}
                  unit="in"
                  placeholder="24"
                  min={0}
                />

                <NumberInput
                  label="Current Gauge"
                  value={inputs.oldGauge}
                  onChange={handleInputChange("oldGauge")}
                  unit="mil"
                  placeholder="1.5"
                  min={0}
                />

                <NumberInput
                  label="Current Speed"
                  value={inputs.oldLineSpeed}
                  onChange={handleInputChange("oldLineSpeed")}
                  unit="FPM"
                  placeholder="250"
                  min={0}
                />
              </div>
            </div>

            {/* New Settings */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">New Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="New Layflat"
                  value={inputs.newLayflat}
                  onChange={handleInputChange("newLayflat")}
                  unit="in"
                  placeholder="30"
                  min={0}
                />

                <NumberInput
                  label="New Gauge"
                  value={inputs.newGauge}
                  onChange={handleInputChange("newGauge")}
                  unit="mil"
                  placeholder="1.25"
                  min={0}
                />
              </div>
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultDisplay
                label="New Line Speed"
                value={calculations?.newLineSpeed ?? null}
                unit="FPM"
                precision={1}
                size="large"
              />
              <div className="space-y-2">
                <ResultDisplay
                  label="Speed Change"
                  value={calculations?.speedChange ?? null}
                  unit="FPM"
                  precision={1}
                />
                <ResultDisplay
                  label="Percent Change"
                  value={calculations?.percentChange ?? null}
                  unit="%"
                  precision={1}
                />
              </div>
            </div>

            {calculations && (
              <div className="mt-4 flex items-center gap-4 rounded-lg bg-slate-700/50 p-3">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Old PPH</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {calculations.oldPPH.toFixed(1)}
                  </p>
                </div>
                <ArrowRight className="text-slate-500" size={20} />
                <div className="text-center">
                  <p className="text-xs text-slate-400">New PPH</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {calculations.newPPH.toFixed(1)}
                  </p>
                </div>
                <p className="ml-auto text-xs text-success">
                  Output maintained at ~{calculations.oldPPH.toFixed(0)} lbs/hr
                </p>
              </div>
            )}
          </div>

          <button onClick={handleReset} className="btn-ghost" title="Reset all inputs">
            <RotateCcw size={18} />
            Reset
          </button>
        </CardFooter>
      </Card>

      {/* Quick Reference */}
      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Cog size={16} />
          Quick Reference
        </h3>
        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-300">Formula:</p>
          <p className="mt-1">(Old Layflat ÷ New Layflat) × (Old Gauge ÷ New Gauge) × Old Speed = New Speed</p>
          <p className="mt-2 text-xs text-slate-500">
            This maintains the same pounds per hour output when changing product specs
          </p>
        </div>
      </div>
    </div>
  );
}

export default LineSettings;
