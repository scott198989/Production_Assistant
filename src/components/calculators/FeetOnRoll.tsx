import { useState, useMemo } from "react";
import { Ruler, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculateFeetOnRoll } from "../../utils/formulas";

interface Inputs {
  targetFeet: number | string;
  targetRollWeight: number | string;
  actualRollWeight: number | string;
}

export function FeetOnRoll() {
  const [inputs, setInputs] = useState<Inputs>({
    targetFeet: "",
    targetRollWeight: "",
    actualRollWeight: "",
  });

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({
      targetFeet: "",
      targetRollWeight: "",
      actualRollWeight: "",
    });
  };

  const calculations = useMemo(() => {
    const targetFeet = typeof inputs.targetFeet === "number" ? inputs.targetFeet : parseFloat(inputs.targetFeet as string);
    const targetRollWeight = typeof inputs.targetRollWeight === "number" ? inputs.targetRollWeight : parseFloat(inputs.targetRollWeight as string);
    const actualRollWeight = typeof inputs.actualRollWeight === "number" ? inputs.actualRollWeight : parseFloat(inputs.actualRollWeight as string);

    if (isNaN(targetFeet) || isNaN(targetRollWeight) || isNaN(actualRollWeight)) {
      return null;
    }

    if (targetFeet <= 0 || targetRollWeight <= 0 || actualRollWeight <= 0) {
      return null;
    }

    const actualFeet = calculateFeetOnRoll(targetFeet, targetRollWeight, actualRollWeight);
    const percentOfFull = (actualRollWeight / targetRollWeight) * 100;
    const feetRemaining = targetFeet - actualFeet;

    return {
      actualFeet,
      percentOfFull,
      feetRemaining: feetRemaining > 0 ? feetRemaining : 0,
      isOverfull: actualRollWeight > targetRollWeight,
    };
  }, [inputs]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Feet on Roll Calculator"
          subtitle="Estimate footage on a partial roll by weight"
          infoTooltip="(Actual Weight ÷ Target Weight) × Target Feet = Actual Feet"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Reference Roll (Full Roll) */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Full Roll Specifications</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Target Footage"
                  value={inputs.targetFeet}
                  onChange={handleInputChange("targetFeet")}
                  unit="ft"
                  placeholder="5000"
                  min={0}
                  hint="Full roll footage"
                />

                <NumberInput
                  label="Target Roll Weight"
                  value={inputs.targetRollWeight}
                  onChange={handleInputChange("targetRollWeight")}
                  unit="lbs"
                  placeholder="150"
                  min={0}
                  hint="Full roll weight"
                />
              </div>
            </div>

            {/* Actual Roll */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Partial Roll</h3>
              <NumberInput
                label="Actual Roll Weight"
                value={inputs.actualRollWeight}
                onChange={handleInputChange("actualRollWeight")}
                unit="lbs"
                placeholder="75"
                min={0}
                hint="Weigh the partial roll"
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultDisplay
                label="Estimated Footage"
                value={calculations?.actualFeet ?? null}
                unit="ft"
                precision={0}
                size="large"
              />
              <ResultDisplay
                label="Percent of Full"
                value={calculations?.percentOfFull ?? null}
                unit="%"
                precision={1}
              />
              <ResultDisplay
                label="Feet Used"
                value={calculations?.feetRemaining ?? null}
                unit="ft"
                precision={0}
              />
            </div>

            {calculations?.isOverfull && (
              <p className="mt-2 text-sm text-warning">
                Roll weight exceeds target - may be wound heavier than spec
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
        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-300">Formula:</p>
          <p className="mt-1">(Actual Weight ÷ Target Weight) × Target Feet = Actual Feet</p>
          <p className="mt-2 text-xs text-slate-500">
            This assumes consistent gauge and width throughout the roll
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeetOnRoll;
