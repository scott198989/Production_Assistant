import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Copy, ArrowLeftRight, Trash2 } from "lucide-react";

export interface Scenario {
  id: string;
  name: string;
  inputs: Record<string, number | string>;
  result: number | null;
  resultLabel: string;
}

interface ComparisonModeProps {
  isEnabled: boolean;
  onToggle: () => void;
  scenarios: Scenario[];
  onAddScenario: () => void;
  onRemoveScenario: (id: string) => void;
  onDuplicateScenario: (id: string) => void;
  onClearAll: () => void;
  maxScenarios?: number;
  renderInputs: (
    scenario: Scenario,
    onChange: (field: string, value: number | string) => void
  ) => React.ReactNode;
  formatResult?: (result: number | null) => string;
}

export function ComparisonMode({
  isEnabled,
  onToggle,
  scenarios,
  onAddScenario,
  onRemoveScenario,
  onDuplicateScenario,
  onClearAll,
  maxScenarios = 4,
  renderInputs,
  formatResult = (r) => r?.toFixed(2) ?? "-",
}: ComparisonModeProps) {
  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isEnabled
              ? "bg-primary text-white"
              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
          }`}
        >
          <ArrowLeftRight size={16} />
          {isEnabled ? "Exit Comparison" : "Compare Scenarios"}
        </button>

        {isEnabled && scenarios.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Comparison Grid */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4"
                >
                  {/* Scenario Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {scenario.name || `Scenario ${index + 1}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onDuplicateScenario(scenario.id)}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Duplicate scenario"
                      >
                        <Copy size={14} />
                      </button>
                      {scenarios.length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemoveScenario(scenario.id)}
                          className="rounded p-1 text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          title="Remove scenario"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Scenario Result */}
                  <div className="mb-4 rounded-lg bg-primary/10 p-3 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {formatResult(scenario.result)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {scenario.resultLabel}
                    </div>
                  </div>

                  {/* Scenario Inputs - rendered by parent */}
                  <div className="space-y-3 text-sm">
                    {renderInputs(scenario, () => {
                      // This is handled by parent
                    })}
                  </div>
                </motion.div>
              ))}

              {/* Add Scenario Button */}
              {scenarios.length < maxScenarios && (
                <motion.button
                  type="button"
                  onClick={onAddScenario}
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
            {scenarios.length > 1 && scenarios.every((s) => s.result !== null) && (
              <ComparisonSummary scenarios={scenarios} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ComparisonSummary({ scenarios }: { scenarios: Scenario[] }) {
  const results = scenarios.map((s) => s.result).filter((r): r is number => r !== null);
  const min = Math.min(...results);
  const max = Math.max(...results);
  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  const diff = max - min;
  const diffPercent = min > 0 ? ((diff / min) * 100).toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4"
    >
      <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Comparison Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Minimum</div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            {min.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Maximum</div>
          <div className="text-lg font-semibold text-red-600 dark:text-red-400">
            {max.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Average</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {avg.toFixed(2)}
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

// Hook for managing comparison scenarios
export function useComparisonMode<T extends Record<string, number | string>>(
  initialInputs: T,
  calculateResult: (inputs: T) => number | null,
  resultLabel: string
) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const createScenario = (inputs: T = initialInputs, name?: string): Scenario => ({
    id: crypto.randomUUID(),
    name: name || "",
    inputs: { ...inputs },
    result: calculateResult(inputs),
    resultLabel,
  });

  const toggleComparison = () => {
    if (!isEnabled) {
      // Starting comparison mode - create first scenario from current inputs
      setScenarios([createScenario(initialInputs, "Current")]);
    }
    setIsEnabled(!isEnabled);
  };

  const addScenario = () => {
    setScenarios((prev) => [
      ...prev,
      createScenario(initialInputs, `Scenario ${prev.length + 1}`),
    ]);
  };

  const removeScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const duplicateScenario = (id: string) => {
    setScenarios((prev) => {
      const scenario = prev.find((s) => s.id === id);
      if (!scenario) return prev;
      return [
        ...prev,
        createScenario(scenario.inputs as T, `${scenario.name} (copy)`),
      ];
    });
  };

  const updateScenarioInput = (id: string, field: string, value: number | string) => {
    setScenarios((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const newInputs = { ...s.inputs, [field]: value };
        return {
          ...s,
          inputs: newInputs,
          result: calculateResult(newInputs as T),
        };
      })
    );
  };

  const clearAll = () => {
    setScenarios([createScenario(initialInputs, "Scenario 1")]);
  };

  return {
    isEnabled,
    scenarios,
    toggleComparison,
    addScenario,
    removeScenario,
    duplicateScenario,
    updateScenarioInput,
    clearAll,
  };
}

export default ComparisonMode;
