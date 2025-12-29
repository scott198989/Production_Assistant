import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

// Types
export interface CalculationRecord {
  id: string;
  calculatorId: string;
  calculatorName: string;
  inputs: Record<string, number | string>;
  result: number | string;
  resultLabel: string;
  timestamp: Date;
}

export interface FavoriteCalculator {
  id: string;
  name: string;
  path: string;
  icon: string;
}

interface CalculatorContextType {
  // Last values per calculator
  getLastValues: (calculatorId: string) => Record<string, number | string> | null;
  saveLastValues: (calculatorId: string, values: Record<string, number | string>) => void;

  // Calculation history
  history: CalculationRecord[];
  addToHistory: (record: Omit<CalculationRecord, "id" | "timestamp">) => void;
  clearHistory: () => void;

  // Favorites
  favorites: FavoriteCalculator[];
  addFavorite: (calculator: FavoriteCalculator) => void;
  removeFavorite: (calculatorId: string) => void;
  isFavorite: (calculatorId: string) => boolean;

  // Unit preference
  useMetric: boolean;
  toggleUnits: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LAST_VALUES: "isoflex_last_values",
  HISTORY: "isoflex_history",
  FAVORITES: "isoflex_favorites",
  USE_METRIC: "isoflex_use_metric",
};

const MAX_HISTORY_ITEMS = 10;

export function CalculatorProvider({ children }: { children: ReactNode }) {
  // State
  const [lastValuesMap, setLastValuesMap] = useState<Record<string, Record<string, number | string>>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_VALUES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: CalculationRecord) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<FavoriteCalculator[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [useMetric, setUseMetric] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USE_METRIC);
      return stored === "true";
    } catch {
      return false;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAST_VALUES, JSON.stringify(lastValuesMap));
  }, [lastValuesMap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USE_METRIC, String(useMetric));
  }, [useMetric]);

  // Last values functions
  const getLastValues = useCallback((calculatorId: string) => {
    return lastValuesMap[calculatorId] || null;
  }, [lastValuesMap]);

  const saveLastValues = useCallback((calculatorId: string, values: Record<string, number | string>) => {
    setLastValuesMap(prev => ({
      ...prev,
      [calculatorId]: values,
    }));
  }, []);

  // History functions
  const addToHistory = useCallback((record: Omit<CalculationRecord, "id" | "timestamp">) => {
    const newRecord: CalculationRecord = {
      ...record,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    setHistory(prev => {
      const updated = [newRecord, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Favorites functions
  const addFavorite = useCallback((calculator: FavoriteCalculator) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === calculator.id)) return prev;
      return [...prev, calculator];
    });
  }, []);

  const removeFavorite = useCallback((calculatorId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== calculatorId));
  }, []);

  const isFavorite = useCallback((calculatorId: string) => {
    return favorites.some(f => f.id === calculatorId);
  }, [favorites]);

  // Unit toggle
  const toggleUnits = useCallback(() => {
    setUseMetric(prev => !prev);
  }, []);

  return (
    <CalculatorContext.Provider
      value={{
        getLastValues,
        saveLastValues,
        history,
        addToHistory,
        clearHistory,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        useMetric,
        toggleUnits,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}
