import { useId, useCallback, ChangeEvent, FocusEvent } from "react";
import { Minus, Plus, X } from "lucide-react";

interface NumberInputProps {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  showSteppers?: boolean;
  showClear?: boolean;
  className?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  unit,
  placeholder = "0",
  min,
  max,
  step = 1,
  required = false,
  disabled = false,
  error,
  hint,
  showSteppers = false,
  showClear = false,
  className = "",
}: NumberInputProps) {
  const id = useId();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty string for clearing
      if (inputValue === "") {
        onChange("");
        return;
      }

      // Allow negative sign at start
      if (inputValue === "-") {
        onChange("-");
        return;
      }

      // Allow decimal point
      if (inputValue === "." || inputValue === "-.") {
        onChange(inputValue);
        return;
      }

      // Parse as number
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    },
    [onChange]
  );

  const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
    // Select all text on focus for easy replacement
    e.target.select();
  }, []);

  const handleIncrement = useCallback(() => {
    const numValue = typeof value === "number" ? value : parseFloat(value as string) || 0;
    const newValue = numValue + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  }, [value, step, max, onChange]);

  const handleDecrement = useCallback(() => {
    const numValue = typeof value === "number" ? value : parseFloat(value as string) || 0;
    const newValue = numValue - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  }, [value, step, min, onChange]);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  const displayValue = value === "" ? "" : String(value);
  const hasValue = displayValue !== "";
  const hasError = !!error;

  return (
    <div className={`${className}`}>
      {/* Label */}
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative flex">
        {/* Decrement Button */}
        {showSteppers && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && (parseFloat(displayValue) || 0) <= min)}
            className="flex h-touch w-12 items-center justify-center rounded-l-lg border border-r-0 border-slate-600 bg-slate-700 text-slate-300 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            tabIndex={-1}
          >
            <Minus size={18} />
          </button>
        )}

        {/* Input */}
        <div className="relative flex-1">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={`input-base ${showSteppers ? "rounded-none" : ""} ${
              hasError
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : ""
            } ${unit ? "pr-16" : ""} ${showClear && hasValue ? "pr-10" : ""}`}
          />

          {/* Unit Indicator */}
          {unit && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
              {unit}
            </span>
          )}

          {/* Clear Button */}
          {showClear && hasValue && !unit && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
              tabIndex={-1}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Increment Button */}
        {showSteppers && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && (parseFloat(displayValue) || 0) >= max)}
            className="flex h-touch w-12 items-center justify-center rounded-r-lg border border-l-0 border-slate-600 bg-slate-700 text-slate-300 transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            tabIndex={-1}
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* Error / Hint */}
      {(hasError || hint) && (
        <p
          className={`mt-1.5 text-sm ${
            hasError ? "text-danger" : "text-slate-500"
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}

export default NumberInput;
