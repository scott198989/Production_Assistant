import { useState } from "react";
import { ArrowRightLeft, RotateCcw } from "lucide-react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { CONVERSIONS, type ConversionType } from "../../utils/conversions";

interface ConversionState {
  fromValue: number | string;
  toValue: number | string;
}

export function UnitConverter() {
  const [activeConversion, setActiveConversion] = useState<ConversionType>("mils_microns");
  const [values, setValues] = useState<ConversionState>({
    fromValue: "",
    toValue: "",
  });

  const currentConversion = CONVERSIONS.find((c) => c.id === activeConversion)!;

  const handleFromChange = (value: number | string) => {
    const numValue = typeof value === "number" ? value : parseFloat(value as string);
    if (value === "" || isNaN(numValue)) {
      setValues({ fromValue: value, toValue: "" });
    } else {
      const converted = currentConversion.convert(numValue);
      setValues({ fromValue: value, toValue: converted });
    }
  };

  const handleToChange = (value: number | string) => {
    const numValue = typeof value === "number" ? value : parseFloat(value as string);
    if (value === "" || isNaN(numValue)) {
      setValues({ fromValue: "", toValue: value });
    } else {
      const converted = currentConversion.reverse(numValue);
      setValues({ fromValue: converted, toValue: value });
    }
  };

  const handleSwap = () => {
    setValues((prev) => ({
      fromValue: prev.toValue,
      toValue: prev.fromValue,
    }));
  };

  const handleConversionChange = (type: ConversionType) => {
    setActiveConversion(type);
    setValues({ fromValue: "", toValue: "" });
  };

  const handleReset = () => {
    setValues({ fromValue: "", toValue: "" });
  };

  // Format display value
  const formatValue = (value: number | string): string => {
    if (value === "" || value === null) return "";
    const num = typeof value === "number" ? value : parseFloat(value as string);
    if (isNaN(num)) return "";
    // Use appropriate precision based on value magnitude
    if (Math.abs(num) < 0.01) return num.toExponential(2);
    if (Math.abs(num) < 1) return num.toFixed(4);
    if (Math.abs(num) < 100) return num.toFixed(2);
    return num.toFixed(1);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader
          title="Unit Converter"
          subtitle="Convert between common production units"
        />

        <CardBody>
          <div className="space-y-6">
            {/* Conversion Type Selection */}
            <div>
              <label className="label">Conversion Type</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CONVERSIONS.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleConversionChange(conv.id)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      activeConversion === conv.id
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    <div>{conv.name}</div>
                    <div className="mt-0.5 text-xs opacity-70">
                      {conv.fromUnit} ↔ {conv.toUnit}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Inputs */}
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <NumberInput
                  label={currentConversion.fromUnit}
                  value={typeof values.fromValue === "number" ? formatValue(values.fromValue) : values.fromValue}
                  onChange={handleFromChange}
                  placeholder="0"
                />
              </div>

              <button
                onClick={handleSwap}
                className="mb-1 flex h-touch w-12 items-center justify-center rounded-lg bg-slate-700 text-slate-300 transition-colors hover:bg-slate-600"
                title="Swap values"
              >
                <ArrowRightLeft size={20} />
              </button>

              <div className="flex-1">
                <NumberInput
                  label={currentConversion.toUnit}
                  value={typeof values.toValue === "number" ? formatValue(values.toValue) : values.toValue}
                  onChange={handleToChange}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end">
              <button onClick={handleReset} className="btn-ghost">
                <RotateCcw size={18} />
                Clear
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Reference Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Thickness */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-slate-300">Thickness</h3>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>1 mil = 25.4 microns</li>
            <li>1 mil = 0.001 inches</li>
            <li>100 gauge = 1 mil</li>
          </ul>
        </div>

        {/* Length */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-slate-300">Length</h3>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>1 inch = 25.4 mm</li>
            <li>1 foot = 0.3048 m</li>
            <li>1 meter = 39.37 inches</li>
          </ul>
        </div>

        {/* Temperature */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-slate-300">Temperature</h3>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>°C = (°F - 32) × 5/9</li>
            <li>°F = °C × 9/5 + 32</li>
            <li>Water boils: 212°F / 100°C</li>
          </ul>
        </div>

        {/* Weight */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <h3 className="mb-2 text-sm font-medium text-slate-300">Weight</h3>
          <ul className="space-y-1 text-sm text-slate-400">
            <li>1 lb = 0.4536 kg</li>
            <li>1 kg = 2.205 lbs</li>
            <li>1 oz = 28.35 grams</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UnitConverter;
