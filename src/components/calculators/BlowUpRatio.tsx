import { useState, useMemo } from "react";
import { Activity, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculateBUR } from "../../utils/formulas";
import { LINE_PROFILES } from "../../data/lineProfiles";

interface Inputs {
  layflat: number | string;
  dieSize: number | string;
}

export function BlowUpRatio() {
  const [inputs, setInputs] = useState<Inputs>({
    layflat: "",
    dieSize: "",
  });

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
      layflat: "",
      dieSize: "",
    });
    setSelectedLine(null);
  };

  const result = useMemo(() => {
    const layflat = typeof inputs.layflat === "number" ? inputs.layflat : parseFloat(inputs.layflat as string);
    const dieSize = typeof inputs.dieSize === "number" ? inputs.dieSize : parseFloat(inputs.dieSize as string);

    if (isNaN(layflat) || isNaN(dieSize)) {
      return null;
    }

    if (layflat <= 0 || dieSize <= 0) {
      return null;
    }

    return calculateBUR(layflat, dieSize);
  }, [inputs]);

  // Determine if BUR is in typical range (usually 1.5 to 4.0)
  const burStatus = useMemo(() => {
    if (result === null) return null;
    if (result < 1.5) return { status: "low", message: "Below typical range (1.5-4.0)" };
    if (result > 4.0) return { status: "high", message: "Above typical range (1.5-4.0)" };
    return { status: "normal", message: "Within typical range" };
  }, [result]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Blow Up Ratio Calculator"
          subtitle="Calculate bubble blow up ratio"
          infoTooltip="Layflat × 0.637 ÷ Die Size = BUR"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Quick Line Selection */}
            <div>
              <label className="label">Quick Select Line</label>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                label="Layflat Width"
                value={inputs.layflat}
                onChange={handleInputChange("layflat")}
                unit="in"
                placeholder="24"
                min={0}
                hint="Measured layflat width"
              />

              <NumberInput
                label="Die Size"
                value={inputs.dieSize}
                onChange={handleInputChange("dieSize")}
                unit="in"
                placeholder="15.75"
                min={0}
                hint="Die diameter in inches"
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <ResultDisplay
              label="Blow Up Ratio"
              value={result}
              unit=":1"
              precision={2}
              size="large"
              formula="Layflat × 0.637 ÷ Die Size"
            />
            {burStatus && (
              <p className={`mt-2 text-sm ${
                burStatus.status === "normal" ? "text-success" :
                burStatus.status === "low" ? "text-warning" : "text-warning"
              }`}>
                {burStatus.message}
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
          <Activity size={16} />
          Quick Reference
        </h3>
        <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-2">
          <div>
            <p className="font-medium text-slate-300">Formula:</p>
            <p className="mt-1">Layflat × 0.637 ÷ Die Size</p>
            <p className="mt-2 text-xs text-slate-500">
              0.637 = 2/π (converts layflat to diameter)
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-300">Typical BUR Ranges:</p>
            <ul className="mt-1 space-y-0.5">
              <li>LDPE: 2.0 - 4.0</li>
              <li>LLDPE: 2.0 - 3.5</li>
              <li>HDPE: 2.5 - 4.0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlowUpRatio;
