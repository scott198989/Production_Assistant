import { useState, useMemo } from "react";
import { Gauge, RotateCcw, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculateGaugeAdjustment, calculatePoundsPerHour } from "../../utils/formulas";

interface Inputs {
  currentGauge: number | string;
  targetGauge: number | string;
  currentFPM: number | string;
  width: number | string;
}

export function GaugeAdjustment() {
  const [inputs, setInputs] = useState<Inputs>({
    currentGauge: "",
    targetGauge: "",
    currentFPM: "",
    width: "",
  });

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({
      currentGauge: "",
      targetGauge: "",
      currentFPM: "",
      width: "",
    });
  };

  const calculations = useMemo(() => {
    const currentGauge = typeof inputs.currentGauge === "number" ? inputs.currentGauge : parseFloat(inputs.currentGauge as string);
    const targetGauge = typeof inputs.targetGauge === "number" ? inputs.targetGauge : parseFloat(inputs.targetGauge as string);
    const currentFPM = typeof inputs.currentFPM === "number" ? inputs.currentFPM : parseFloat(inputs.currentFPM as string);
    const width = typeof inputs.width === "number" ? inputs.width : parseFloat(inputs.width as string);

    if (isNaN(currentGauge) || isNaN(targetGauge) || isNaN(currentFPM)) {
      return null;
    }

    if (currentGauge <= 0 || targetGauge <= 0 || currentFPM <= 0) {
      return null;
    }

    const newFPM = calculateGaugeAdjustment(currentGauge, targetGauge, currentFPM);
    const fpmChange = newFPM - currentFPM;
    const percentChange = ((newFPM - currentFPM) / currentFPM) * 100;

    // Calculate PPH if width is provided
    let currentPPH = null;
    let newPPH = null;
    if (!isNaN(width) && width > 0) {
      currentPPH = calculatePoundsPerHour(width, currentGauge, currentFPM);
      newPPH = calculatePoundsPerHour(width, targetGauge, newFPM);
    }

    return {
      newFPM,
      fpmChange,
      percentChange,
      currentPPH,
      newPPH,
    };
  }, [inputs]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Gauge Adjustment Calculator"
          subtitle="Calculate new FPM when changing gauge"
          infoTooltip="(Current Gauge ÷ Target Gauge) × Current FPM = New FPM"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Current Settings */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Current Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Current Gauge"
                  value={inputs.currentGauge}
                  onChange={handleInputChange("currentGauge")}
                  unit="mil"
                  placeholder="2.0"
                  min={0}
                />

                <NumberInput
                  label="Current Line Speed"
                  value={inputs.currentFPM}
                  onChange={handleInputChange("currentFPM")}
                  unit="FPM"
                  placeholder="250"
                  min={0}
                />
              </div>
            </div>

            {/* Target Settings */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Target Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Target Gauge"
                  value={inputs.targetGauge}
                  onChange={handleInputChange("targetGauge")}
                  unit="mil"
                  placeholder="1.5"
                  min={0}
                />

                <NumberInput
                  label="Width (optional)"
                  value={inputs.width}
                  onChange={handleInputChange("width")}
                  unit="in"
                  placeholder="24"
                  min={0}
                  hint="For PPH calculation"
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
                value={calculations?.newFPM ?? null}
                unit="FPM"
                precision={1}
                size="large"
              />
              <div className="space-y-2">
                <ResultDisplay
                  label="Speed Change"
                  value={calculations?.fpmChange ?? null}
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

            {calculations && calculations.currentPPH !== null && calculations.newPPH !== null && (
              <div className="mt-4 flex items-center gap-4 rounded-lg bg-slate-700/50 p-3">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Current PPH</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {calculations.currentPPH.toFixed(1)}
                  </p>
                </div>
                <ArrowRight className="text-slate-500" size={20} />
                <div className="text-center">
                  <p className="text-xs text-slate-400">New PPH</p>
                  <p className="text-lg font-semibold text-slate-200">
                    {calculations.newPPH.toFixed(1)}
                  </p>
                </div>
                <p className="ml-auto text-xs text-slate-500">
                  Output maintained
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
          <Gauge size={16} />
          Quick Reference
        </h3>
        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-300">Formula:</p>
          <p className="mt-1">(Current Gauge ÷ Target Gauge) × Current FPM = New FPM</p>
          <p className="mt-2 text-xs text-slate-500">
            Adjusting line speed maintains the same pounds per hour output when changing gauge
          </p>
        </div>
      </div>
    </div>
  );
}

export default GaugeAdjustment;
