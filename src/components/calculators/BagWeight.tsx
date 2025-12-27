import { useState, useMemo } from "react";
import { Package, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { ResultDisplay } from "../ui/ResultDisplay";
import { calculateBagWeight } from "../../utils/formulas";
import { MATERIALS, DEFAULT_FILM_DENSITY } from "../../data/materialPresets";

interface Inputs {
  width: number | string;
  gauge: number | string;
  length: number | string;
  density: number | string;
}

export function BagWeight() {
  const [inputs, setInputs] = useState<Inputs>({
    width: "",
    gauge: "",
    length: "",
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
      length: "",
      density: DEFAULT_FILM_DENSITY,
    });
    setSelectedMaterial("ldpe");
  };

  const result = useMemo(() => {
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

    return calculateBagWeight(width, gauge, length, density);
  }, [inputs]);

  // Convert to grams for convenience
  const resultGrams = result !== null ? result * 453.592 : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Bag Weight Calculator"
          subtitle="Calculate weight of a single bag"
          infoTooltip="Width × Gauge × Length × 2 × Density ÷ 27680"
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
                label="Bag Width"
                value={inputs.width}
                onChange={handleInputChange("width")}
                unit="in"
                placeholder="12"
                min={0}
                hint="Width of bag in inches"
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
                label="Bag Length"
                value={inputs.length}
                onChange={handleInputChange("length")}
                unit="in"
                placeholder="18"
                min={0}
                hint="Length of bag in inches"
              />

              <NumberInput
                label="Film Density"
                value={inputs.density}
                onChange={handleInputChange("density")}
                unit="g/cc"
                placeholder="0.92"
                min={0}
                hint="Material density"
              />
            </div>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <div className="flex-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultDisplay
                label="Bag Weight"
                value={result}
                unit="lbs"
                precision={4}
                size="large"
              />
              <ResultDisplay
                label="Bag Weight"
                value={resultGrams}
                unit="grams"
                precision={2}
                size="default"
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
          <Package size={16} />
          Quick Reference
        </h3>
        <div className="text-sm text-slate-400">
          <p className="font-medium text-slate-300">Formula:</p>
          <p className="mt-1">Width × Gauge × Length × 2 × Density ÷ 27680</p>
          <p className="mt-2 text-xs text-slate-500">
            The ×2 factor accounts for both sides of the bag
          </p>
        </div>
      </div>
    </div>
  );
}

export default BagWeight;
