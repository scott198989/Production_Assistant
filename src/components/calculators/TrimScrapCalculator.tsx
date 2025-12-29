import { useState, useMemo } from "react";
import { RotateCcw, Info } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { calculateTrimScrap, calculateTrimWidth } from "../../utils/formulas";

interface Inputs {
  webSize: number | string;
  numberOfRolls: number | string;
  rollWidth: number | string;
  gauge: number | string;
  fpm: number | string;
  runTimeHours: number | string;
}

export function TrimScrapCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    webSize: "",
    numberOfRolls: 1,
    rollWidth: "",
    gauge: "",
    fpm: "",
    runTimeHours: 12,
  });

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleRollCountChange = (count: number) => {
    if (count >= 1 && count <= 8) {
      setInputs((prev) => ({ ...prev, numberOfRolls: count }));
    }
  };

  const handleReset = () => {
    setInputs({
      webSize: "",
      numberOfRolls: 1,
      rollWidth: "",
      gauge: "",
      fpm: "",
      runTimeHours: 12,
    });
  };

  // Calculate results
  const results = useMemo(() => {
    const webSize = typeof inputs.webSize === "number" ? inputs.webSize : parseFloat(inputs.webSize as string);
    const numberOfRolls = typeof inputs.numberOfRolls === "number" ? inputs.numberOfRolls : parseInt(inputs.numberOfRolls as string, 10);
    const rollWidth = typeof inputs.rollWidth === "number" ? inputs.rollWidth : parseFloat(inputs.rollWidth as string);
    const gauge = typeof inputs.gauge === "number" ? inputs.gauge : parseFloat(inputs.gauge as string);
    const fpm = typeof inputs.fpm === "number" ? inputs.fpm : parseFloat(inputs.fpm as string);
    const runTimeHours = typeof inputs.runTimeHours === "number" ? inputs.runTimeHours : parseFloat(inputs.runTimeHours as string);

    if (isNaN(webSize) || isNaN(numberOfRolls) || isNaN(rollWidth) || isNaN(gauge) || isNaN(fpm) || isNaN(runTimeHours)) {
      return null;
    }

    if (webSize <= 0 || numberOfRolls <= 0 || rollWidth <= 0 || gauge <= 0 || fpm <= 0 || runTimeHours <= 0) {
      return null;
    }

    const totalRollWidth = numberOfRolls * rollWidth;
    const trimWidth = calculateTrimWidth(webSize, numberOfRolls, rollWidth);

    // Check if trim is valid (web must be larger than rolls)
    if (trimWidth <= 0) {
      return {
        totalRollWidth,
        trimWidth: 0,
        trimPerSide: 0,
        trimScrapWeight: 0,
        trimPercentage: 0,
        isError: true,
        errorMessage: "Roll width exceeds web size",
      };
    }

    const trimPerSide = trimWidth / 2;
    const trimScrapWeight = calculateTrimScrap(trimWidth, gauge, fpm, runTimeHours);
    const trimPercentage = (trimWidth / webSize) * 100;

    return {
      totalRollWidth,
      trimWidth,
      trimPerSide,
      trimScrapWeight,
      trimPercentage,
      isError: false,
      errorMessage: null,
    };
  }, [inputs]);

  const rollCount = typeof inputs.numberOfRolls === "number"
    ? inputs.numberOfRolls
    : parseInt(inputs.numberOfRolls as string, 10) || 1;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Trim Scrap Calculator"
          subtitle="Calculate edge trim scrap weight"
          infoTooltip="Formula: (Trim Width × Gauge × FPM × 60 × Hours) ÷ 20.3 = Scrap Weight (lbs)"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Web Size */}
            <NumberInput
              label="Web Size"
              value={inputs.webSize}
              onChange={handleInputChange("webSize")}
              unit="in"
              placeholder="58"
              hint="Total width of the web/bubble"
            />

            {/* Roll Configuration */}
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h4 className="mb-3 text-sm font-medium text-slate-300">Roll Configuration</h4>

              {/* Number of Rolls Selector */}
              <div className="mb-4">
                <label className="label">Number of Rolls</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleRollCountChange(num)}
                      className={`h-10 w-10 rounded-lg font-medium transition-colors ${
                        rollCount === num
                          ? "bg-primary text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500">Max 4 per winder × 2 winders = 8 total</p>
              </div>

              {/* Roll Width */}
              <NumberInput
                label="Width Per Roll"
                value={inputs.rollWidth}
                onChange={handleInputChange("rollWidth")}
                unit="in"
                placeholder="24"
                hint={`Total roll width: ${rollCount} × ${inputs.rollWidth || "?"} = ${
                  inputs.rollWidth ? (rollCount * (parseFloat(inputs.rollWidth as string) || 0)).toFixed(2) : "?"
                } in`}
              />
            </div>

            {/* Line Parameters */}
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberInput
                label="Gauge"
                value={inputs.gauge}
                onChange={handleInputChange("gauge")}
                unit="mil"
                placeholder="1.5"
              />
              <NumberInput
                label="Line Speed"
                value={inputs.fpm}
                onChange={handleInputChange("fpm")}
                unit="FPM"
                placeholder="200"
              />
              <NumberInput
                label="Run Time"
                value={inputs.runTimeHours}
                onChange={handleInputChange("runTimeHours")}
                unit="hrs"
                placeholder="12"
                hint="Default: 12 hr shift"
              />
            </div>
          </div>
        </CardBody>

        {results && (
          <CardFooter>
            <div className="space-y-4">
              {results.isError ? (
                <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-center">
                  <p className="text-danger">{results.errorMessage}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Total roll width ({results.totalRollWidth.toFixed(2)}") exceeds web size
                  </p>
                </div>
              ) : (
                <>
                  {/* Trim Width Results */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-slate-800 p-3 text-center">
                      <p className="text-xs text-slate-500">Total Roll Width</p>
                      <p className="text-lg font-semibold text-slate-200">
                        {results.totalRollWidth.toFixed(2)}"
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/20 border border-primary/30 p-3 text-center">
                      <p className="text-xs text-primary">Total Trim Width</p>
                      <p className="text-xl font-bold text-slate-100">
                        {results.trimWidth.toFixed(3)}"
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-800 p-3 text-center">
                      <p className="text-xs text-slate-500">Trim Per Side</p>
                      <p className="text-lg font-semibold text-slate-200">
                        {results.trimPerSide.toFixed(3)}"
                      </p>
                    </div>
                  </div>

                  {/* Main Result - Scrap Weight */}
                  <div className="rounded-lg bg-warning/20 border-2 border-warning p-6 text-center">
                    <p className="text-sm font-medium text-warning mb-1">TRIM SCRAP WEIGHT</p>
                    <p className="text-4xl font-bold text-slate-100">
                      {results.trimScrapWeight.toFixed(1)} lbs
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      {results.trimPercentage.toFixed(1)}% of web is trim
                    </p>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <button type="button" onClick={handleReset} className="btn-ghost">
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Quick Reference */}
      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Info size={16} />
          Quick Reference
        </h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p><strong className="text-slate-300">Formula:</strong></p>
          <ul className="ml-4 space-y-1 list-disc">
            <li>Trim Width = Web Size - (# Rolls × Roll Width)</li>
            <li>Trim Scrap (lbs) = (Trim Width × Gauge × FPM × 60 × Hours) ÷ 20.3</li>
          </ul>
          <p className="mt-3"><strong className="text-slate-300">Tips:</strong></p>
          <ul className="ml-4 space-y-1 list-disc">
            <li>Use 12 hours for a full shift estimate</li>
            <li>Trim per side = Total trim ÷ 2</li>
            <li>Lower trim % = better material utilization</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TrimScrapCalculator;
