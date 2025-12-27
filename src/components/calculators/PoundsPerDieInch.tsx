import { useState, useMemo } from "react";
import { Ruler, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculatePPDI, calculatePoundsPerHour } from "../../utils/formulas";
import { LINE_PROFILES } from "../../data/lineProfiles";

interface Inputs {
  poundsPerHour: number | string;
  dieSize: number | string;
  // Optional: calculate PPH from these
  width: number | string;
  gauge: number | string;
  fpm: number | string;
}

export function PoundsPerDieInch() {
  const [inputs, setInputs] = useState<Inputs>({
    poundsPerHour: "",
    dieSize: "",
    width: "",
    gauge: "",
    fpm: "",
  });

  const [useManualPPH, setUseManualPPH] = useState(true);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    if (field === "dieSize") {
      setSelectedLine(null);
    }
  };

  const handleLineSelect = (lineId: string) => {
    const line = LINE_PROFILES.find((l) => l.id === lineId);
    if (line) {
      setSelectedLine(lineId);
      setInputs((prev) => ({ ...prev, dieSize: line.dieSize }));
    }
  };

  const handleReset = () => {
    setInputs({
      poundsPerHour: "",
      dieSize: "",
      width: "",
      gauge: "",
      fpm: "",
    });
    setSelectedLine(null);
  };

  const calculations = useMemo(() => {
    const dieSize = typeof inputs.dieSize === "number" ? inputs.dieSize : parseFloat(inputs.dieSize as string);

    if (isNaN(dieSize) || dieSize <= 0) {
      return null;
    }

    let pph: number;

    if (useManualPPH) {
      pph = typeof inputs.poundsPerHour === "number" ? inputs.poundsPerHour : parseFloat(inputs.poundsPerHour as string);
      if (isNaN(pph) || pph <= 0) {
        return null;
      }
    } else {
      const width = typeof inputs.width === "number" ? inputs.width : parseFloat(inputs.width as string);
      const gauge = typeof inputs.gauge === "number" ? inputs.gauge : parseFloat(inputs.gauge as string);
      const fpm = typeof inputs.fpm === "number" ? inputs.fpm : parseFloat(inputs.fpm as string);

      if (isNaN(width) || isNaN(gauge) || isNaN(fpm)) {
        return null;
      }

      if (width <= 0 || gauge <= 0 || fpm <= 0) {
        return null;
      }

      pph = calculatePoundsPerHour(width, gauge, fpm);
    }

    const ppdi = calculatePPDI(pph, dieSize);
    const dieCircumference = dieSize * 3.14;

    return {
      pph,
      ppdi,
      dieCircumference,
    };
  }, [inputs, useManualPPH]);

  // PPDI status (typical range is 5-15 lbs/die inch/hr)
  const ppdiStatus = useMemo(() => {
    if (!calculations) return null;
    const ppdi = calculations.ppdi;
    if (ppdi < 5) return { status: "low", message: "Low output - die may be underutilized" };
    if (ppdi > 15) return { status: "high", message: "High output - check for melt fracture" };
    return { status: "normal", message: "Within typical range (5-15)" };
  }, [calculations]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Pounds Per Die Inch Calculator"
          subtitle="Calculate extruder output per die inch"
          infoTooltip="PPH ÷ Die Size ÷ π = PPDI"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setUseManualPPH(true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  useManualPPH
                    ? "bg-primary text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Enter PPH Directly
              </button>
              <button
                onClick={() => setUseManualPPH(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  !useManualPPH
                    ? "bg-primary text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Calculate from Line Data
              </button>
            </div>

            {/* Quick Line Selection */}
            <div>
              <label className="label">Quick Select Line (for die size)</label>
              <div className="flex flex-wrap gap-2">
                {LINE_PROFILES.map((line) => (
                  <button
                    key={line.id}
                    onClick={() => handleLineSelect(line.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      selectedLine === line.id
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {line.name.replace("Line ", "L")}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Grid */}
            {useManualPPH ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Pounds Per Hour"
                  value={inputs.poundsPerHour}
                  onChange={handleInputChange("poundsPerHour")}
                  unit="lbs/hr"
                  placeholder="500"
                  min={0}
                />

                <NumberInput
                  label="Die Size"
                  value={inputs.dieSize}
                  onChange={handleInputChange("dieSize")}
                  unit="in"
                  placeholder="15.75"
                  min={0}
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Width"
                  value={inputs.width}
                  onChange={handleInputChange("width")}
                  unit="in"
                  placeholder="24"
                  min={0}
                />

                <NumberInput
                  label="Gauge"
                  value={inputs.gauge}
                  onChange={handleInputChange("gauge")}
                  unit="mil"
                  placeholder="1.5"
                  min={0}
                />

                <NumberInput
                  label="Line Speed"
                  value={inputs.fpm}
                  onChange={handleInputChange("fpm")}
                  unit="FPM"
                  placeholder="250"
                  min={0}
                />

                <NumberInput
                  label="Die Size"
                  value={inputs.dieSize}
                  onChange={handleInputChange("dieSize")}
                  unit="in"
                  placeholder="15.75"
                  min={0}
                />
              </div>
            )}
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultDisplay
                label="Pounds Per Die Inch"
                value={calculations?.ppdi ?? null}
                unit="lbs/in/hr"
                precision={2}
                size="large"
              />
              <div className="space-y-2">
                {!useManualPPH && (
                  <ResultDisplay
                    label="Calculated PPH"
                    value={calculations?.pph ?? null}
                    unit="lbs/hr"
                    precision={1}
                  />
                )}
                <ResultDisplay
                  label="Die Circumference"
                  value={calculations?.dieCircumference ?? null}
                  unit="in"
                  precision={1}
                />
              </div>
            </div>
            {ppdiStatus && (
              <p className={`mt-2 text-sm ${
                ppdiStatus.status === "normal" ? "text-success" :
                ppdiStatus.status === "low" ? "text-warning" : "text-danger"
              }`}>
                {ppdiStatus.message}
              </p>
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
          <Ruler size={16} />
          Quick Reference
        </h3>
        <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-2">
          <div>
            <p className="font-medium text-slate-300">Formula:</p>
            <p className="mt-1">PPH ÷ Die Size ÷ 3.14 = PPDI</p>
          </div>
          <div>
            <p className="font-medium text-slate-300">Typical Range:</p>
            <p className="mt-1">5-15 lbs/die inch/hour</p>
            <p className="mt-1 text-xs text-slate-500">
              Higher values may cause melt fracture
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PoundsPerDieInch;
