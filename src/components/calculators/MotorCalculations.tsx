import { useState, useMemo } from "react";
import { Cog, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculateMaxScrewRPM, calculateMaxScrewRPMPerHour, calculateMaxOutput } from "../../utils/formulas";

interface Inputs {
  maxMotorRPM: number | string;
  gearboxRatio: number | string;
  outputPerRevolution: number | string;
}

export function MotorCalculations() {
  const [inputs, setInputs] = useState<Inputs>({
    maxMotorRPM: "",
    gearboxRatio: "",
    outputPerRevolution: "",
  });

  const handleInputChange = (field: keyof Inputs) => (value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({
      maxMotorRPM: "",
      gearboxRatio: "",
      outputPerRevolution: "",
    });
  };

  const calculations = useMemo(() => {
    const maxMotorRPM = typeof inputs.maxMotorRPM === "number" ? inputs.maxMotorRPM : parseFloat(inputs.maxMotorRPM as string);
    const gearboxRatio = typeof inputs.gearboxRatio === "number" ? inputs.gearboxRatio : parseFloat(inputs.gearboxRatio as string);
    const outputPerRevolution = typeof inputs.outputPerRevolution === "number" ? inputs.outputPerRevolution : parseFloat(inputs.outputPerRevolution as string);

    const results: {
      maxScrewRPM: number | null;
      maxRPMPerHour: number | null;
      maxOutput: number | null;
    } = {
      maxScrewRPM: null,
      maxRPMPerHour: null,
      maxOutput: null,
    };

    // Calculate max screw RPM if we have motor RPM and gearbox ratio
    if (!isNaN(maxMotorRPM) && !isNaN(gearboxRatio) && maxMotorRPM > 0 && gearboxRatio > 0) {
      results.maxScrewRPM = calculateMaxScrewRPM(maxMotorRPM, gearboxRatio);
      results.maxRPMPerHour = calculateMaxScrewRPMPerHour(results.maxScrewRPM);

      // Calculate max output if we also have output per revolution
      if (!isNaN(outputPerRevolution) && outputPerRevolution > 0) {
        results.maxOutput = calculateMaxOutput(outputPerRevolution, results.maxRPMPerHour);
      }
    }

    return results;
  }, [inputs]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Motor Calculations"
          subtitle="Calculate extruder motor and screw parameters"
          infoTooltip="Max Screw RPM = Motor RPM ÷ Gearbox Ratio"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Motor & Gearbox */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Motor & Gearbox</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Max Motor RPM"
                  value={inputs.maxMotorRPM}
                  onChange={handleInputChange("maxMotorRPM")}
                  unit="RPM"
                  placeholder="1750"
                  min={0}
                  hint="Motor nameplate RPM"
                />

                <NumberInput
                  label="Gearbox Ratio"
                  value={inputs.gearboxRatio}
                  onChange={handleInputChange("gearboxRatio")}
                  unit=":1"
                  placeholder="17.5"
                  min={0}
                  hint="Reduction ratio"
                />
              </div>
            </div>

            {/* Output Calculation */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-slate-300">Output Calculation (Optional)</h3>
              <NumberInput
                label="Output Per Screw Revolution"
                value={inputs.outputPerRevolution}
                onChange={handleInputChange("outputPerRevolution")}
                unit="lbs/rev"
                placeholder="0.15"
                min={0}
                hint="Pounds per screw revolution"
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultDisplay
                label="Max Screw RPM"
                value={calculations.maxScrewRPM}
                unit="RPM"
                precision={1}
                size="large"
              />
              <ResultDisplay
                label="Revolutions/Hour"
                value={calculations.maxRPMPerHour}
                unit="rev/hr"
                precision={0}
              />
              <ResultDisplay
                label="Max Output"
                value={calculations.maxOutput}
                unit="lbs/hr"
                precision={0}
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
          <Cog size={16} />
          Formulas
        </h3>
        <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-2">
          <div>
            <p className="font-medium text-slate-300">Max Screw RPM:</p>
            <p className="mt-1">Motor RPM ÷ Gearbox Ratio</p>
          </div>
          <div>
            <p className="font-medium text-slate-300">Revolutions Per Hour:</p>
            <p className="mt-1">Max Screw RPM × 60</p>
          </div>
          <div className="sm:col-span-2">
            <p className="font-medium text-slate-300">Max Output:</p>
            <p className="mt-1">Output Per Revolution × Revolutions Per Hour</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotorCalculations;
