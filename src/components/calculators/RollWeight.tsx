import { useState, useMemo, useEffect } from "react";
import { Scale, RotateCcw, ArrowLeftRight, Plus, X, Copy, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { AnimatedResult } from "../ui/AnimatedResult";
import { QuickPresets, GAUGE_PRESETS, WIDTH_PRESETS, LENGTH_PRESETS } from "../ui/QuickPresets";
import { FavoriteButton } from "../ui/FavoriteButton";
import { CalculationHistory } from "../ui/CalculationHistory";
import { calculateRollWeight } from "../../utils/formulas";
import { MATERIALS, DEFAULT_FILM_DENSITY } from "../../data/materialPresets";
import { useCalculator } from "../../contexts/CalculatorContext";

const CALCULATOR_ID = "roll-weight";
const CALCULATOR_NAME = "Roll Weight";

interface Inputs {
  width: number | string;
  gauge: number | string;
  length: number | string;
  density: number | string;
}

interface ComparisonScenario {
  id: string;
  name: string;
  inputs: Inputs;
  result: number | null;
}

const DEFAULT_INPUTS: Inputs = {
  width: "",
  gauge: "",
  length: "",
  density: DEFAULT_FILM_DENSITY,
};

// Calculate result from inputs
function calculateResult(inputs: Inputs): number | null {
  const width = typeof inputs.width === "number" ? inputs.width : parseFloat(inputs.width as string);
  const gauge = typeof inputs.gauge === "number" ? inputs.gauge : parseFloat(inputs.gauge as string);
  const length = typeof inputs.length === "number" ? inputs.length : parseFloat(inputs.length as string);
  const density = typeof inputs.density === "number" ? inputs.density : parseFloat(inputs.density as string);

  if (isNaN(width) || isNaN(gauge) || isNaN(length) || isNaN(density)) {
    return null;
  }
  if (width <= 0 || gauge <= 0 || length <= 0 || density <= 0) {
    return null;
  }
  return calculateRollWeight(width, gauge, length, density);
}

export function RollWeight() {
  const { getLastValues, saveLastValues, addToHistory } = useCalculator();

  // Comparison mode state
  const [comparisonMode, setComparisonMode] = useState(false);
  const [scenarios, setScenarios] = useState<ComparisonScenario[]>([]);

  // Initialize with last values or defaults
  const [inputs, setInputs] = useState<Inputs>(() => {
    const lastValues = getLastValues(CALCULATOR_ID);
    if (lastValues) {
      return {
        width: lastValues.width ?? "",
        gauge: lastValues.gauge ?? "",
        length: lastValues.length ?? "",
        density: lastValues.density ?? DEFAULT_FILM_DENSITY,
      };
    }
    return {
      width: "",
      gauge: "",
      length: "",
      density: DEFAULT_FILM_DENSITY,
    };
  });

  const [selectedMaterial, setSelectedMaterial] = useState<string>("ldpe");

  // Save values when they change
  useEffect(() => {
    saveLastValues(CALCULATOR_ID, { ...inputs });
  }, [inputs, saveLastValues]);

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleMaterialChange = (materialId: string) => {
    const material = MATERIALS.find((m) => m.id === materialId);
    if (material) {
      setSelectedMaterial(materialId);
      setInputs((prev) => ({ ...prev, density: material.density }));
    }
  };

  const handleReset = () => {
    setInputs({ ...DEFAULT_INPUTS });
    setSelectedMaterial("ldpe");
  };

  // Calculate result using the extracted function
  const result = useMemo(() => calculateResult(inputs), [inputs]);

  // Comparison mode handlers
  const toggleComparisonMode = () => {
    if (!comparisonMode) {
      // Enter comparison mode with current inputs as first scenario
      setScenarios([
        {
          id: crypto.randomUUID(),
          name: "Current",
          inputs: { ...inputs },
          result: calculateResult(inputs),
        },
      ]);
    }
    setComparisonMode(!comparisonMode);
  };

  const addScenario = () => {
    if (scenarios.length >= 4) return;
    setScenarios((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `Scenario ${prev.length + 1}`,
        inputs: { ...DEFAULT_INPUTS },
        result: null,
      },
    ]);
  };

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const duplicateScenario = (id: string) => {
    if (scenarios.length >= 4) return;
    const scenario = scenarios.find((s) => s.id === id);
    if (!scenario) return;
    setScenarios((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: `${scenario.name} (copy)`,
        inputs: { ...scenario.inputs },
        result: scenario.result,
      },
    ]);
  };

  const updateScenarioInput = (
    scenarioId: string,
    field: keyof Inputs,
    value: number | string
  ) => {
    setScenarios((prev) =>
      prev.map((s) => {
        if (s.id !== scenarioId) return s;
        const newInputs = { ...s.inputs, [field]: value };
        return { ...s, inputs: newInputs, result: calculateResult(newInputs) };
      })
    );
  };

  const clearAllScenarios = () => {
    setScenarios([
      {
        id: crypto.randomUUID(),
        name: "Scenario 1",
        inputs: { ...DEFAULT_INPUTS },
        result: null,
      },
    ]);
  };

  // Add to history when result changes and is valid
  const prevResultRef = useMemo(() => ({ current: null as number | null }), []);
  useEffect(() => {
    if (result !== null && result !== prevResultRef.current && result > 0) {
      addToHistory({
        calculatorId: CALCULATOR_ID,
        calculatorName: CALCULATOR_NAME,
        inputs: { ...inputs },
        result: `${result.toFixed(2)} lbs`,
        resultLabel: "Roll Weight",
      });
      prevResultRef.current = result;
    }
  }, [result, inputs, addToHistory, prevResultRef]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <div className="flex items-start justify-between px-6 pt-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Roll Weight Calculator</h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Calculate the weight of a roll of film</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleComparisonMode}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                comparisonMode
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
              title="Compare multiple scenarios"
            >
              <ArrowLeftRight size={14} />
              <span className="hidden sm:inline">{comparisonMode ? "Exit" : "Compare"}</span>
            </button>
            <FavoriteButton
              calculator={{
                id: CALCULATOR_ID,
                name: CALCULATOR_NAME,
                path: "/calculators/roll-weight",
                icon: "Scale",
              }}
            />
          </div>
        </div>
        <div className="border-b border-slate-200 dark:border-slate-700 mx-6 mt-4" />

        {/* Normal Calculator View */}
        <AnimatePresence mode="wait">
          {!comparisonMode ? (
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardBody>
                <div className="space-y-6">
                  {/* Material Selection */}
                  <div>
                    <label className="label">Material</label>
                    <div className="flex flex-wrap gap-2">
                      {MATERIALS.map((material) => (
                        <button
                          type="button"
                          key={material.id}
                          onClick={() => handleMaterialChange(material.id)}
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            selectedMaterial === material.id
                              ? "bg-primary text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                          }`}
                        >
                          {material.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <NumberInput
                        label="Width"
                        value={inputs.width}
                        onChange={handleInputChange("width")}
                        unit="in"
                        placeholder="24"
                        min={0}
                        hint="Layflat width in inches"
                      />
                      <div className="mt-2">
                        <QuickPresets
                          presets={WIDTH_PRESETS}
                          onSelect={handleInputChange("width")}
                          currentValue={inputs.width}
                        />
                      </div>
                    </div>

                    <div>
                      <NumberInput
                        label="Gauge"
                        value={inputs.gauge}
                        onChange={handleInputChange("gauge")}
                        unit="mil"
                        placeholder="1.5"
                        min={0}
                        hint="Film thickness in mils"
                      />
                      <div className="mt-2">
                        <QuickPresets
                          presets={GAUGE_PRESETS}
                          onSelect={handleInputChange("gauge")}
                          currentValue={inputs.gauge}
                        />
                      </div>
                    </div>

                    <div>
                      <NumberInput
                        label="Length"
                        value={inputs.length}
                        onChange={handleInputChange("length")}
                        unit="ft"
                        placeholder="5000"
                        min={0}
                        hint="Roll length in feet"
                      />
                      <div className="mt-2">
                        <QuickPresets
                          presets={LENGTH_PRESETS}
                          onSelect={handleInputChange("length")}
                          currentValue={inputs.length}
                        />
                      </div>
                    </div>

                    <NumberInput
                      label="Film Density"
                      value={inputs.density}
                      onChange={handleInputChange("density")}
                      unit="g/cc"
                      placeholder="0.92"
                      min={0}
                      hint="Material density (auto-filled by material)"
                    />
                  </div>
                </div>
              </CardBody>

              <CardFooter>
                <div className="flex items-center justify-between">
                  {/* Result */}
                  <div className="flex-1">
                    {result !== null ? (
                      <AnimatedResult
                        value={result}
                        unit="lbs"
                        label="Roll Weight"
                        size="xl"
                        decimals={2}
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Roll Weight</p>
                        <p className="text-2xl font-bold text-slate-400 dark:text-slate-600">—</p>
                      </div>
                    )}
                  </div>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-ghost"
                    title="Reset all inputs"
                  >
                    <RotateCcw size={18} />
                    Reset
                  </button>
                </div>
              </CardFooter>
            </motion.div>
          ) : (
            /* Comparison Mode View */
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardBody>
                <div className="space-y-4">
                  {/* Comparison Header */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Compare up to 4 scenarios side by side
                    </p>
                    {scenarios.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllScenarios}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={12} />
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Scenarios Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {scenarios.map((scenario) => (
                      <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4"
                      >
                        {/* Scenario Header */}
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {scenario.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => duplicateScenario(scenario.id)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                              title="Duplicate"
                              disabled={scenarios.length >= 4}
                            >
                              <Copy size={12} />
                            </button>
                            {scenarios.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeScenario(scenario.id)}
                                className="rounded p-1 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                title="Remove"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Scenario Result */}
                        <div className="mb-3 rounded-lg bg-primary/10 p-2 text-center">
                          <div className="text-xl font-bold text-primary">
                            {scenario.result !== null ? `${scenario.result.toFixed(2)} lbs` : "—"}
                          </div>
                        </div>

                        {/* Compact Inputs */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <label className="w-16 text-slate-500 dark:text-slate-400">Width</label>
                            <input
                              type="number"
                              value={scenario.inputs.width}
                              onChange={(e) => updateScenarioInput(scenario.id, "width", e.target.value)}
                              className="flex-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-slate-900 dark:text-slate-100"
                              placeholder="24"
                            />
                            <span className="text-slate-400">in</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="w-16 text-slate-500 dark:text-slate-400">Gauge</label>
                            <input
                              type="number"
                              value={scenario.inputs.gauge}
                              onChange={(e) => updateScenarioInput(scenario.id, "gauge", e.target.value)}
                              className="flex-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-slate-900 dark:text-slate-100"
                              placeholder="1.5"
                            />
                            <span className="text-slate-400">mil</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="w-16 text-slate-500 dark:text-slate-400">Length</label>
                            <input
                              type="number"
                              value={scenario.inputs.length}
                              onChange={(e) => updateScenarioInput(scenario.id, "length", e.target.value)}
                              className="flex-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-slate-900 dark:text-slate-100"
                              placeholder="5000"
                            />
                            <span className="text-slate-400">ft</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="w-16 text-slate-500 dark:text-slate-400">Density</label>
                            <input
                              type="number"
                              value={scenario.inputs.density}
                              onChange={(e) => updateScenarioInput(scenario.id, "density", e.target.value)}
                              className="flex-1 rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-slate-900 dark:text-slate-100"
                              placeholder="0.92"
                              step="0.01"
                            />
                            <span className="text-slate-400">g/cc</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Add Scenario Button */}
                    {scenarios.length < 4 && (
                      <motion.button
                        type="button"
                        onClick={addScenario}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        <Plus size={24} />
                        <span className="text-sm font-medium">Add Scenario</span>
                      </motion.button>
                    )}
                  </div>

                  {/* Comparison Summary */}
                  {scenarios.length > 1 && scenarios.some((s) => s.result !== null) && (
                    <ComparisonSummary scenarios={scenarios} />
                  )}
                </div>
              </CardBody>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Calculation History */}
      <CalculationHistory calculatorId={CALCULATOR_ID} maxItems={5} />

      {/* Quick Reference */}
      <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Scale size={16} />
          Quick Reference
        </h3>
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">Common Densities:</p>
            <ul className="mt-1 space-y-0.5">
              <li>LDPE/LLDPE: 0.92 g/cc</li>
              <li>HDPE: 0.95 g/cc</li>
              <li>PP: 0.90 g/cc</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">Formula:</p>
            <p className="mt-1">
              Width × Gauge × Length × 12 × Density ÷ 27680
            </p>
            <p className="mt-2 text-xs text-slate-500">
              All measurements in inches, mils, and feet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Comparison Summary Component
function ComparisonSummary({ scenarios }: { scenarios: ComparisonScenario[] }) {
  const results = scenarios.map((s) => s.result).filter((r): r is number => r !== null);

  if (results.length < 2) return null;

  const min = Math.min(...results);
  const max = Math.max(...results);
  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  const diff = max - min;
  const diffPercent = min > 0 ? ((diff / min) * 100).toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4"
    >
      <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Comparison Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Minimum</div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {min.toFixed(2)} lbs
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Maximum</div>
          <div className="text-lg font-semibold text-red-600 dark:text-red-400">
            {max.toFixed(2)} lbs
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Average</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {avg.toFixed(2)} lbs
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Difference</div>
          <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
            {diff.toFixed(2)} <span className="text-sm">({diffPercent}%)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RollWeight;
