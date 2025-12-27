import { useState, useMemo } from "react";
import { RotateCcw, TrendingUp, TrendingDown, Zap, AlertTriangle, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { StatusBadge } from "../ui/StatusBadge";
import { RangeIndicator } from "../ui/RangeIndicator";
import type { SpecStatus } from "../../types";

interface TreaterInputs {
  // Treater machine setting (e.g., 3.8)
  treaterSetting: number | string;
  // Order specs for dyne level
  minDyne: number | string;
  maxDyne: number | string;
  targetDyne: number | string;
  // Actual test result
  testResult: number | string;
}

interface Reading {
  dyneValue: number;
  treaterSetting: number;
  timestamp: Date;
}

export function TreaterMonitor() {
  const [inputs, setInputs] = useState<TreaterInputs>({
    treaterSetting: "",
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
    const treaterSetting = typeof inputs.treaterSetting === "number"
      ? inputs.treaterSetting
      : parseFloat(inputs.treaterSetting as string);

    if (!isNaN(dyneValue) && !isNaN(treaterSetting)) {
      setReadings((prev) => [
        { dyneValue, treaterSetting, timestamp: new Date() },
        ...prev.slice(0, 9), // Keep last 10 readings
      ]);
    }
  };

  const handleReset = () => {
    setInputs({
      treaterSetting: "",
      minDyne: 38,
      maxDyne: 44,
      targetDyne: 40,
      testResult: "",
    });
    setReadings([]);
  };

  const analysis = useMemo(() => {
    const treaterSetting = typeof inputs.treaterSetting === "number"
      ? inputs.treaterSetting
      : parseFloat(inputs.treaterSetting as string);
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

    if (isNaN(treaterSetting) || isNaN(testResult) || isNaN(minDyne) || isNaN(maxDyne) || isNaN(targetDyne)) {
      return null;
    }

    if (treaterSetting <= 0) {
      return null;
    }

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

    // Calculate the ratio: dyne per treater setting unit
    // This tells us how much dyne change we get per setting change
    const dynePerSetting = testResult / treaterSetting;

    // Calculate the setting adjustment needed to reach target
    // If test shows 46 dyne at 3.8 setting, and target is 40:
    // Adjustment = (testResult - targetDyne) / dynePerSetting
    const settingAdjustment = dyneDeviation / dynePerSetting;

    // New recommended setting
    const newSetting = treaterSetting - settingAdjustment;

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
      treaterSetting,
      testResult,
      minDyne,
      maxDyne,
      targetDyne,
      status,
      dyneDeviation,
      dynePerSetting,
      settingAdjustment,
      newSetting,
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
            {/* Current Treater Setting */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
                <Zap size={16} />
                Current Treater Setting
              </h3>
              <NumberInput
                label="Treater Power Setting"
                value={inputs.treaterSetting}
                onChange={handleInputChange("treaterSetting")}
                placeholder="3.8"
                hint="Current dial/display setting on treater"
              />
            </div>

            {/* Order Specs */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Order Dyne Specifications</h3>
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
                  disabled={inputs.testResult === "" || inputs.treaterSetting === ""}
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
                                <span className="text-lg font-bold text-blue-400">TURN DOWN</span>
                              </>
                            ) : (
                              <>
                                <ArrowUp className="text-orange-400" size={24} />
                                <span className="text-lg font-bold text-orange-400">TURN UP</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="rounded bg-slate-800 p-3">
                          <p className="text-xs text-slate-400 mb-1">Adjustment Amount</p>
                          <p className="text-2xl font-bold text-slate-100">
                            {Math.abs(analysis.settingAdjustment).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* New Setting */}
                      <div className="mt-3 rounded bg-slate-800 p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Current Setting</p>
                            <p className="text-xl font-medium text-slate-300">{analysis.treaterSetting.toFixed(1)}</p>
                          </div>
                          <div className="text-2xl text-slate-500">→</div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">New Setting</p>
                            <p className="text-2xl font-bold text-success">{analysis.newSetting.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-slate-400">
                        Based on ratio of {analysis.dynePerSetting.toFixed(1)} dyne per setting unit.
                        Adjust treater to {analysis.newSetting.toFixed(1)} to achieve target of {analysis.targetDyne} dyne.
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
                        Test result of {analysis.testResult} dyne is within target range.
                        Current setting of {analysis.treaterSetting.toFixed(1)} is good.
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
                        title={`Setting: ${reading.treaterSetting}`}
                      >
                        {reading.dyneValue.toFixed(0)} dyne @ {reading.treaterSetting}
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
      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Zap size={16} />
          How It Works
        </h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p><strong className="text-slate-300">1. Enter current treater setting:</strong> The power dial/display value on your treater</p>
          <p><strong className="text-slate-300">2. Enter order specs:</strong> Min, target, and max dyne from the job order</p>
          <p><strong className="text-slate-300">3. Enter test result:</strong> The actual dyne level from your test</p>
          <div className="pt-2 border-t border-slate-700 mt-3">
            <p className="font-medium text-slate-300 mb-1">The Result:</p>
            <p className="text-slate-500">
              The calculator determines the <strong className="text-warning">ratio between your treater setting and dyne output</strong>,
              then calculates exactly how much to adjust the treater to hit your target.
            </p>
          </div>
        </div>
      </div>

      {/* Example */}
      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-300">Example</h3>
        <div className="text-sm text-slate-400 space-y-1">
          <p>Treater setting: <strong className="text-slate-300">3.8</strong></p>
          <p>Order specs: <strong className="text-slate-300">38/44/40</strong> (min/max/target)</p>
          <p>Test result: <strong className="text-slate-300">46 dyne</strong></p>
          <p className="pt-2 text-slate-500">
            → Ratio: 46 ÷ 3.8 = 12.1 dyne per setting<br />
            → Need to reduce by 6 dyne (46 - 40)<br />
            → Adjustment: 6 ÷ 12.1 = 0.5<br />
            → <strong className="text-success">Turn treater DOWN to 3.3</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TreaterMonitor;
