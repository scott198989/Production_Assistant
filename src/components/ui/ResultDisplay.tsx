import { useCallback, useState } from "react";
import { Copy, Check } from "lucide-react";

interface ResultDisplayProps {
  label: string;
  value: number | string | null;
  unit?: string;
  precision?: number;
  size?: "default" | "large";
  formula?: string;
  showCopy?: boolean;
  className?: string;
}

export function ResultDisplay({
  label,
  value,
  unit,
  precision = 2,
  size = "default",
  formula,
  showCopy = true,
  className = "",
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const formatValue = (val: number | string | null): string => {
    if (val === null || val === "") return "—";
    if (typeof val === "string") return val;
    if (isNaN(val)) return "—";

    // Format with precision and thousands separator
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: precision,
    });
  };

  const displayValue = formatValue(value);
  const hasValue = displayValue !== "—";

  const handleCopy = useCallback(async () => {
    if (!hasValue || value === null) return;

    const textToCopy =
      typeof value === "number"
        ? value.toFixed(precision)
        : String(value);

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [value, precision, hasValue]);

  return (
    <div className={`${className}`}>
      {/* Label */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        {showCopy && hasValue && (
          <button
            onClick={handleCopy}
            className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={14} className="text-success" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </div>

      {/* Result */}
      <div className="flex items-baseline gap-2">
        <span
          className={`font-bold ${
            size === "large" ? "text-4xl" : "text-2xl"
          } ${hasValue ? "text-slate-100" : "text-slate-500"}`}
        >
          {displayValue}
        </span>
        {unit && hasValue && (
          <span className="text-lg font-medium text-slate-400">{unit}</span>
        )}
      </div>

      {/* Formula */}
      {formula && (
        <p className="mt-2 text-xs text-slate-500">
          Formula: <code className="rounded bg-slate-700 px-1.5 py-0.5">{formula}</code>
        </p>
      )}
    </div>
  );
}

export default ResultDisplay;
