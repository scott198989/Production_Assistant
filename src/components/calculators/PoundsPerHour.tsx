import { useState, useMemo } from "react";
import { TrendingUp, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculatePoundsPerHour } from "../../utils/formulas";

interface Inputs {
  width: number | string;
  gauge: number | string;
  fpm: number | string;
}

export function PoundsPerHour() {
  const [inputs, setInputs] = useState<Inputs>({
    width: "",
    gauge: "",
    fpm: "",
  });

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({
      width: "",
      gauge: "",
      fpm: "",
    });
  };

  const result = useMemo(() => {
    const width = typeof inputs.width === "number" ? inputs.width : parseFloat(inputs.width as string);
    const gauge = typeof inputs.gauge === "number" ? inputs.gauge : parseFloat(inputs.gauge as string);
    const fpm = typeof inputs.fpm === "number" ? inputs.fpm : parseFloat(inputs.fpm as string);

    if (isNaN(width) || isNaN(gauge) || isNaN(fpm)) {
      return null;
    }

    if (width <= 0 || gauge <= 0 || fpm <= 0) {
      return null;
    }

    return calculatePoundsPerHour(width, gauge, fpm);
  }, [inputs]);

  // Calculate per-shift output (assuming 8 hour shift)
  const perShift = result !== null ? result * 8 : null;
  // Calculate per-day output (24 hours)
  const perDay = result !== null ? result * 24 : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Pounds Per Hour Calculator"
          subtitle="Calculate production output rate"
          infoTooltip="Width × Gauge × FPM ÷ 20.3"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Input Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberInput
                label="Width"
                value={inputs.width}
                onChange={handleInputChange("width")}
                unit="in"
                placeholder="24"
                min={0}
                hint="Layflat width"
              />

              <NumberInput
                label="Gauge"
                value={inputs.gauge}
                onChange={handleInputChange("gauge")}
                unit="mil"
                placeholder="1.5"
                min={0}
                hint="Film thickness"
              />

              <NumberInput
                label="Line Speed"
                value={inputs.fpm}
                onChange={handleInputChange("fpm")}
                unit="FPM"
                placeholder="250"
                min={0}
                hint="Feet per minute"
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultDisplay
                label="Per Hour"
                value={result}
                unit="lbs/hr"
                precision={1}
                size="large"
              />
              <ResultDisplay
                label="Per 8hr Shift"
                value={perShift}
                unit="lbs"
                precision={0}
                size="default"
              />
              <ResultDisplay
                label="Per Day (24hr)"
                value={perDay}
                unit="lbs"
                precision={0}
                size="default"
              />
            </div>
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
          <TrendingUp size={16} />
          Quick Reference
        </h3>
        <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-2">
          <div>
            <p className="font-medium text-slate-300">Formula:</p>
            <p className="mt-1">Width × Gauge × FPM ÷ 20.3</p>
          </div>
          <div>
            <p className="font-medium text-slate-300">Note:</p>
            <p className="mt-1">
              This assumes standard LDPE density (0.92 g/cc)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoundsPerHour;
