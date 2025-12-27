import { useState, useMemo } from "react";
import { Package, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculateGramWeight } from "../../utils/formulas";
import { MATERIALS, DEFAULT_FILM_DENSITY } from "../../data/materialPresets";

interface Inputs {
  width: number | string;
  gauge: number | string;
  density: number | string;
}

export function GramWeight() {
  const [inputs, setInputs] = useState<Inputs>({
    width: "",
    gauge: "",
    density: DEFAULT_FILM_DENSITY,
  });

  const [selectedMaterial, setSelectedMaterial] = useState<string>("ldpe");

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
    setInputs({
      width: "",
      gauge: "",
      density: DEFAULT_FILM_DENSITY,
    });
    setSelectedMaterial("ldpe");
  };

  const result = useMemo(() => {
    const width = typeof inputs.width === "number" ? inputs.width : parseFloat(inputs.width as string);
    const gauge = typeof inputs.gauge === "number" ? inputs.gauge : parseFloat(inputs.gauge as string);
    const density = typeof inputs.density === "number" ? inputs.density : parseFloat(inputs.density as string);

    if (isNaN(width) || isNaN(gauge) || isNaN(density)) {
      return null;
    }

    if (width <= 0 || gauge <= 0 || density <= 0) {
      return null;
    }

    return calculateGramWeight(width, gauge, density);
  }, [inputs]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Gram Weight Calculator"
          subtitle="Calculate gram weight per 100 square inches"
          infoTooltip="Width × Gauge × 24 × 453.6 × Density ÷ 27680"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Material Selection */}
            <div>
              <label className="label">Material</label>
              <div className="flex flex-wrap gap-2">
                {MATERIALS.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => handleMaterialChange(material.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      selectedMaterial === material.id
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {material.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberInput
                label="Width"
                value={inputs.width}
                onChange={handleInputChange("width")}
                unit="in"
                placeholder="24"
                min={0}
                hint="Layflat width in inches"
              />

              <NumberInput
                label="Gauge"
                value={inputs.gauge}
                onChange={handleInputChange("gauge")}
                unit="mil"
                placeholder="1.5"
                min={0}
                hint="Film thickness in mils"
              />

              <NumberInput
                label="Film Density"
                value={inputs.density}
                onChange={handleInputChange("density")}
                unit="g/cc"
                placeholder="0.92"
                min={0}
                hint="Material density"
                className="sm:col-span-2"
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <ResultDisplay
              label="Gram Weight"
              value={result}
              unit="g/100 sq in"
              precision={2}
              size="large"
              formula="W × G × 24 × 453.6 × D ÷ 27680"
            />
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
          <Package size={16} />
          Quick Reference
        </h3>
        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-300">Formula:</p>
          <p className="mt-1">Width × Gauge × 24 × 453.6 × Density ÷ 27680</p>
          <p className="mt-2 text-xs text-slate-500">
            Result is grams per 100 square inches of film
          </p>
        </div>
      </div>
    </div>
  );
}

export default GramWeight;
