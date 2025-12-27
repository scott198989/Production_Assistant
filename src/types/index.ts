/**
 * ISOFlex Dashboard Type Definitions
 */

// ============================================
// Production Line Configuration
// ============================================

export interface LineProfile {
  id: string;
  name: string;
  dieNumber: number;
  dieSize: number; // inches
  layerCount: number;
  layerLabels: string[]; // ['A', 'B', 'C', 'D', 'E']
  defaultMaterial: string;
  typicalSpeedRange: {
    min: number;
    max: number;
  };
}

export interface LayerConfig {
  id: string; // 'A', 'B', 'C', etc.
  blendPercentage: number; // % of total line output (layers sum to 100%)
  hoppers: HopperConfig[]; // 6 hoppers: Main + A1-A5
}

export interface HopperConfig {
  id: string; // 'main', 'A1', 'A2', 'A3', 'A4', 'A5'
  type: "main" | "additive";
  materialName: string;
  poundsRemaining: number; // Default: 50 for main, 25 for additive
  usagePercentage: number; // Within layer (hoppers sum to 100% per layer)
}

// ============================================
// Material Configuration
// ============================================

export interface Material {
  id: string;
  name: string;
  density: number; // g/cc
  typicalGaugeRange: {
    min: number;
    max: number;
  };
  meltTempRange: {
    min: number;
    max: number;
  };
}

// ============================================
// Calculator Types
// ============================================

export interface CalculatorInput {
  value: number | string;
  isValid: boolean;
  errorMessage?: string;
}

export interface CalculatorResult {
  value: number;
  unit: string;
  displayValue: string;
  formula?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// ============================================
// Quality Monitor Types
// ============================================

export type SpecStatus = "in_spec" | "warning" | "out_of_spec";

export interface QualityReading {
  current: number;
  target: number;
  min: number;
  max: number;
  status: SpecStatus;
}

// ============================================
// Resin Timeout Types
// ============================================

export interface ResinTimeoutResult {
  totalPPH: number;
  changeoverTime: Date;
  timeRemaining: string;
  hopperSchedule: HopperScheduleItem[];
}

export interface HopperScheduleItem {
  layerId: string;
  hopperId: string;
  shutoffTime: Date;
  poundsRemaining: number;
  pph: number;
  hoursUntilEmpty: number;
}

// ============================================
// App State / Persistence
// ============================================

export interface AppState {
  preferences: {
    defaultLine: string | null;
    defaultMaterial: string | null;
    pinnedCalculators: string[];
    theme: "dark" | "light";
  };
  calculatorHistory: {
    [calculatorId: string]: {
      lastInputs: Record<string, number | string>;
      lastUsed: string; // ISO date
    };
  };
  customLineProfiles: LineProfile[];
  customMaterials: Material[];
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  children?: NavItem[];
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  isExpanded?: boolean;
}
