import { useState, useMemo } from "react";
import { RotateCcw, TrendingUp, TrendingDown, Zap, AlertTriangle, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { StatusBadge } from "../ui/StatusBadge";
import { RangeIndicator } from "../ui/RangeIndicator";
import type { SpecStatus } from "../../types";

interface TreaterInputs {
  // Treater power inputs
  wattage: number | string;        // Actual watts displayed on treater
  lineSpeed: number | string;      // Line speed in FPM
  filmWidth: number | string;      // Total film width being treated (inches)
  // Order specs for dyne level
  minDyne: number | string;
  maxDyne: number | string;
  targetDyne: number | string;
  // Actual test result
  testResult: number | string;
}

interface Reading {
  dyneValue: number;
  wattage: number;
  lineSpeed: number;
  wattDensity: number;
  timestamp: Date;
}

export function TreaterMonitor() {
  const [inputs, setInputs] = useState<TreaterInputs>({
    wattage: "",
    lineSpeed: "",
    filmWidth: "",
    minDyne: 38,
    maxDyne: 44,
    targetDyne: 40,
    testResult: "",
  });

  const [readings, setReadings] = useState<Reading[]>([]);

  const handleInputChange = (field: keyof TreaterInputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddReading = () => {
    const dyneValue = typeof inputs.testResult === "number"
      ? inputs.testResult
      : parseFloat(inputs.testResult as string);
    const wattage = typeof inputs.wattage === "number"
      ? inputs.wattage
      : parseFloat(inputs.wattage as string);
    const lineSpeed = typeof inputs.lineSpeed === "number"
      ? inputs.lineSpeed
      : parseFloat(inputs.lineSpeed as string);
    const filmWidth = typeof inputs.filmWidth === "number"
      ? inputs.filmWidth
      : parseFloat(inputs.filmWidth as string);

    if (!isNaN(dyneValue) && !isNaN(wattage) && !isNaN(lineSpeed) && !isNaN(filmWidth) && filmWidth > 0 && lineSpeed > 0) {
      const wattDensity = wattage / (filmWidth * lineSpeed);
      setReadings((prev) => [
        { dyneValue, wattage, lineSpeed, wattDensity, timestamp: new Date() },
        ...prev.slice(0, 9), // Keep last 10 readings
      ]);
    }
  };

  const handleReset = () => {
    setInputs({
      wattage: "",
      lineSpeed: "",
      filmWidth: "",
      minDyne: 38,
      maxDyne: 44,
      targetDyne: 40,
      testResult: "",
    });
    setReadings([]);
  };

  const analysis = useMemo(() => {
    const wattage = typeof inputs.wattage === "number"
      ? inputs.wattage
      : parseFloat(inputs.wattage as string);
    const lineSpeed = typeof inputs.lineSpeed === "number"
      ? inputs.lineSpeed
      : parseFloat(inputs.lineSpeed as string);
    const filmWidth = typeof inputs.filmWidth === "number"
      ? inputs.filmWidth
      : parseFloat(inputs.filmWidth as string);
    const testResult = typeof inputs.testResult === "number"
      ? inputs.testResult
      : parseFloat(inputs.testResult as string);
    const minDyne = typeof inputs.minDyne === "number"
      ? inputs.minDyne
      : parseFloat(inputs.minDyne as string);
    const maxDyne = typeof inputs.maxDyne === "number"
      ? inputs.maxDyne
      : parseFloat(inputs.maxDyne as string);
    const targetDyne = typeof inputs.targetDyne === "number"
      ? inputs.targetDyne
      : parseFloat(inputs.targetDyne as string);

    if (isNaN(wattage) || isNaN(lineSpeed) || isNaN(filmWidth) || isNaN(testResult) || isNaN(minDyne) || isNaN(maxDyne) || isNaN(targetDyne)) {
      return null;
    }

    if (wattage <= 0 || lineSpeed <= 0 || filmWidth <= 0) {
      return null;
    }

    // Calculate Watt Density (watts per inch per FPM)
    // This is the key metric that determines treatment level
    const wattDensity = wattage / (filmWidth * lineSpeed);

    // Determine status based on test result vs specs
    let status: SpecStatus = "in_spec";
    if (testResult < minDyne || testResult > maxDyne) {
      status = "out_of_spec";
    } else {
      const range = maxDyne - minDyne;
      const warningMargin = range * 0.15;
      if (testResult < minDyne + warningMargin || testResult > maxDyne - warningMargin) {
        status = "warning";
      }
    }

    // Calculate dyne deviation from target
    const dyneDeviation = testResult - targetDyne;

    // Calculate the ratio: dyne per watt density unit
    // This tells us how much dyne change we get per watt density change
    const dynePerWattDensity = testResult / wattDensity;

    // Calculate the watt density adjustment needed to reach target
    const wattDensityAdjustment = dyneDeviation / dynePerWattDensity;
    const targetWattDensity = wattDensity - wattDensityAdjustment;

    // Calculate new wattage needed at current line speed
    const newWattage = targetWattDensity * filmWidth * lineSpeed;
    const wattageAdjustment = wattage - newWattage;

    // Calculate what line speed would need to be at current wattage
    const newLineSpeed = wattage / (targetWattDensity * filmWidth);

    // Trend from readings
    let trend: "up" | "down" | "stable" | null = null;
    if (readings.length >= 2) {
      const recent = readings.slice(0, 3);
      const avgRecent = recent.reduce((sum, r) => sum + r.dyneValue, 0) / recent.length;
      const older = readings.slice(3, 6);
      if (older.length > 0) {
        const avgOlder = older.reduce((sum, r) => sum + r.dyneValue, 0) / older.length;
        if (avgRecent > avgOlder + 1) trend = "up";
        else if (avgRecent < avgOlder - 1) trend = "down";
        else trend = "stable";
      }
    }

    return {
      wattage,
      lineSpeed,
      filmWidth,
      wattDensity,
      testResult,
      minDyne,
      maxDyne,
      targetDyne,
      status,
      dyneDeviation,
      dynePerWattDensity,
      targetWattDensity,
      newWattage,
      wattageAdjustment,
      newLineSpeed,
      needsAdjustment: Math.abs(dyneDeviation) > 0.5,
      adjustDirection: dyneDeviation > 0 ? "down" : "up",
      trend,
    };
  }, [inputs, readings]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Corona Treater Adjustment"
          subtitle="Calculate treater adjustments based on dyne test results"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Treater Power Inputs */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                <Zap size={16} />
                Treater Settings
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <NumberInput
                  label="Wattage"
                  value={inputs.wattage}
                  onChange={handleInputChange("wattage")}
                  unit="W"
                  placeholder="3500"
                  hint="Current watts displayed"
                />
                <NumberInput
                  label="Line Speed"
                  value={inputs.lineSpeed}
                  onChange={handleInputChange("lineSpeed")}
                  unit="FPM"
                  placeholder="300"
                  hint="Current line speed"
                />
                <NumberInput
                  label="Film Width"
                  value={inputs.filmWidth}
                  onChange={handleInputChange("filmWidth")}
                  unit="in"
                  placeholder="48"
                  hint="Total treated width"
                />
              </div>
              {/* Watt Density Display */}
              {analysis && (
                <div className="mt-3 rounded bg-slate-800 dark:bg-slate-900 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Watt Density:</span>
                    <span className="text-lg font-bold text-primary">
                      {(analysis.wattDensity * 1000).toFixed(2)} <span className="text-sm font-normal">mW/in²/FPM</span>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Key metric: Higher = more treatment
                  </p>
                </div>
              )}
            </div>

            {/* Order Specs */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Order Dyne Specifications</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <NumberInput
                  label="Minimum"
                  value={inputs.minDyne}
                  onChange={handleInputChange("minDyne")}
                  unit="dyne"
                />
                <NumberInput
                  label="Target"
                  value={inputs.targetDyne}
                  onChange={handleInputChange("targetDyne")}
                  unit="dyne"
                />
                <NumberInput
                  label="Maximum"
                  value={inputs.maxDyne}
                  onChange={handleInputChange("maxDyne")}
                  unit="dyne"
                />
              </div>
            </div>

            {/* Test Result */}
            <div className="flex gap-4">
              <div className="flex-1">
                <NumberInput
                  label="Actual Test Result"
                  value={inputs.testResult}
                  onChange={handleInputChange("testResult")}
                  unit="dyne"
                  placeholder="46"
                  hint="Dyne level from your test"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddReading}
                  className="btn-secondary"
                  disabled={inputs.testResult === "" || inputs.wattage === "" || inputs.lineSpeed === "" || inputs.filmWidth === ""}
                >
                  Log Reading
                </button>
              </div>
            </div>

            {/* Range Indicator */}
            {analysis && (
              <RangeIndicator
                current={analysis.testResult}
                min={analysis.minDyne}
                target={analysis.targetDyne}
                max={analysis.maxDyne}
                unit="dyne"
              />
            )}
          </div>
        </CardBody>

        {analysis && (
          <CardFooter>
            <div className="space-y-4">
              {/* Status Badge */}
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
                  </div>
                )}
              </div>

              {/* Deviation Info */}
              <div className="text-sm text-slate-400">
                <span>Test result vs target: </span>
                <span className={Math.abs(analysis.dyneDeviation) < 1 ? "text-success" : "text-warning"}>
                  {analysis.dyneDeviation >= 0 ? "+" : ""}
                  {analysis.dyneDeviation.toFixed(1)} dyne
                </span>
              </div>

              {/* ADJUSTMENT RECOMMENDATION - The main feature */}
              {analysis.needsAdjustment ? (
                <div className={`rounded-lg p-4 ${
                  analysis.status === "out_of_spec"
                    ? "bg-danger/20 border border-danger/30"
                    : "bg-warning/20 border border-warning/30"
                }`}>
                  <div className="flex items-start gap-3">
                    {analysis.status === "out_of_spec" ? (
                      <AlertTriangle className="text-danger flex-shrink-0 mt-0.5" size={20} />
                    ) : (
                      <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={20} />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${
                        analysis.status === "out_of_spec" ? "text-danger" : "text-warning"
                      }`}>
                        Treater Adjustment Needed
                      </p>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {/* Direction */}
                        <div className="rounded bg-slate-800 p-3">
                          <p className="text-xs text-slate-400 mb-1">Direction</p>
                          <div className="flex items-center gap-2">
                            {analysis.adjustDirection === "down" ? (
                              <>
                                <ArrowDown className="text-blue-400" size={24} />
                                <span className="text-lg font-bold text-blue-400">REDUCE POWER</span>
                              </>
                            ) : (
                              <>
                                <ArrowUp className="text-orange-400" size={24} />
                                <span className="text-lg font-bold text-orange-400">INCREASE POWER</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Wattage Change */}
                        <div className="rounded bg-slate-800 p-3">
                          <p className="text-xs text-slate-400 mb-1">Wattage Change</p>
                          <p className="text-2xl font-bold text-slate-100">
                            {analysis.wattageAdjustment > 0 ? "-" : "+"}{Math.abs(analysis.wattageAdjustment).toFixed(0)} W
                          </p>
                        </div>
                      </div>

                      {/* Option 1: Adjust Wattage */}
                      <div className="mt-3 rounded bg-slate-800 p-3">
                        <p className="text-xs text-slate-400 mb-2">Option 1: Adjust Wattage (keep speed at {analysis.lineSpeed} FPM)</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Current</p>
                            <p className="text-xl font-medium text-slate-300">{analysis.wattage.toFixed(0)} W</p>
                          </div>
                          <div className="text-2xl text-slate-500">→</div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Target</p>
                            <p className="text-2xl font-bold text-success">{analysis.newWattage.toFixed(0)} W</p>
                          </div>
                        </div>
                      </div>

                      {/* Option 2: Adjust Line Speed */}
                      <div className="mt-3 rounded bg-slate-800 p-3">
                        <p className="text-xs text-slate-400 mb-2">Option 2: Adjust Line Speed (keep wattage at {analysis.wattage} W)</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Current</p>
                            <p className="text-xl font-medium text-slate-300">{analysis.lineSpeed.toFixed(0)} FPM</p>
                          </div>
                          <div className="text-2xl text-slate-500">→</div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Target</p>
                            <p className="text-2xl font-bold text-success">{analysis.newLineSpeed.toFixed(0)} FPM</p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        Target watt density: {(analysis.targetWattDensity * 1000).toFixed(2)} mW/in²/FPM
                        (currently {(analysis.wattDensity * 1000).toFixed(2)})
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-success/20 border border-success/30 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-success" size={20} />
                    <div>
                      <p className="font-medium text-success">No Adjustment Needed</p>
                      <p className="text-sm text-slate-400">
                        Test result of {analysis.testResult} dyne is within target range at {analysis.wattage}W / {analysis.lineSpeed} FPM.
                      </p>
                    </div>
                  </div>
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
                        title={`${reading.wattage}W @ ${reading.lineSpeed} FPM`}
                      >
                        {reading.dyneValue.toFixed(0)} dyne ({(reading.wattDensity * 1000).toFixed(1)} mW)
                      </span>
                    ))}
                  </div>
                </div>
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
      <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Zap size={16} />
          How It Works
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p><strong className="text-slate-800 dark:text-slate-300">1. Enter treater settings:</strong> Current wattage, line speed, and film width</p>
          <p><strong className="text-slate-800 dark:text-slate-300">2. Enter order specs:</strong> Min, target, and max dyne from the job order</p>
          <p><strong className="text-slate-800 dark:text-slate-300">3. Enter test result:</strong> The actual dyne level from your dyne pen test</p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 mt-3">
            <p className="font-medium text-slate-800 dark:text-slate-300 mb-1">Why Wattage + Line Speed Matter:</p>
            <p className="text-slate-500">
              Treatment level depends on <strong className="text-warning">watt density</strong> (watts per inch per FPM).
              Running faster needs more watts. The calculator shows you whether to adjust power OR speed to hit your target.
            </p>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Example</h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <p>Wattage: <strong className="text-slate-800 dark:text-slate-300">4000 W</strong> | Line Speed: <strong className="text-slate-800 dark:text-slate-300">300 FPM</strong> | Width: <strong className="text-slate-800 dark:text-slate-300">48 in</strong></p>
          <p>Order specs: <strong className="text-slate-800 dark:text-slate-300">38/44/40</strong> (min/max/target dyne)</p>
          <p>Test result: <strong className="text-slate-800 dark:text-slate-300">46 dyne</strong> (too high)</p>
          <p className="pt-2 text-slate-500">
            → Current watt density: 4000 ÷ (48 × 300) = 0.278 mW/in²/FPM<br />
            → Need to reduce dyne by 6 (46 → 40)<br />
            → <strong className="text-success">Option 1:</strong> Reduce to ~3480 W at same speed<br />
            → <strong className="text-success">Option 2:</strong> Increase to ~345 FPM at same watts
          </p>
        </div>
      </div>
    </div>
  );
}

export default TreaterMonitor;
