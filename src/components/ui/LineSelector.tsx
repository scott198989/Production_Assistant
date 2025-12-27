import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { LINE_PROFILES } from "../../data/lineProfiles";
import type { LineProfile } from "../../types";

interface LineSelectorProps {
  value?: string;
  onChange?: (lineId: string) => void;
  className?: string;
}

export function LineSelector({
  value,
  onChange,
  className = "",
}: LineSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState<LineProfile | null>(
    value ? LINE_PROFILES.find((l) => l.id === value) || null : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (line: LineProfile) => {
    setSelectedLine(line);
    setIsOpen(false);
    onChange?.(line.id);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center gap-2 rounded-lg border border-slate-600 bg-slate-700 px-3 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-600"
      >
        <span className="text-slate-400">Line:</span>
        <span>{selectedLine ? selectedLine.name : "Select Line"}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-slate-600 bg-slate-800 py-1 shadow-xl">
          <div className="max-h-72 overflow-y-auto">
            {LINE_PROFILES.map((line) => (
              <button
                key={line.id}
                onClick={() => handleSelect(line)}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-slate-700 ${
                  selectedLine?.id === line.id
                    ? "bg-primary/10 text-primary"
                    : "text-slate-300"
                }`}
              >
                <div>
                  <div className="font-medium">{line.name}</div>
                  <div className="text-xs text-slate-500">
                    {line.layerCount} layer{line.layerCount > 1 ? "s" : ""} •
                    Die {line.dieNumber}
                  </div>
                </div>
                {selectedLine?.id === line.id && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LineSelector;
