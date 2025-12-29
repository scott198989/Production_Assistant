import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useCalculator, CalculationRecord } from "../../contexts/CalculatorContext";

interface CalculationHistoryProps {
  calculatorId?: string; // If provided, only show history for this calculator
  maxItems?: number;
  onSelect?: (record: CalculationRecord) => void;
}

export function CalculationHistory({ calculatorId, maxItems = 5, onSelect }: CalculationHistoryProps) {
  const { history, clearHistory } = useCalculator();
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter history if calculatorId is provided
  const filteredHistory = calculatorId
    ? history.filter(h => h.calculatorId === calculatorId)
    : history;

  const displayedHistory = filteredHistory.slice(0, maxItems);

  if (displayedHistory.length === 0) {
    return null;
  }

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History size={16} />
          <span>Recent Calculations ({displayedHistory.length})</span>
        </div>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* History List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-slate-200 dark:border-slate-700">
              {displayedHistory.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect?.(record)}
                  className={`flex items-center justify-between px-4 py-2.5 border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0 ${
                    onSelect ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {record.calculatorName}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {record.resultLabel}: <span className="font-medium text-slate-700 dark:text-slate-200">{record.result}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={12} />
                    {formatTime(record.timestamp)}
                  </div>
                </motion.div>
              ))}

              {/* Clear History Button */}
              {history.length > 0 && (
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearHistory();
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-danger transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear History
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CalculationHistory;
