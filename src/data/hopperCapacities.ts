/**
 * Hopper Capacity Configuration
 *
 * Defines the capacity (in lbs) for each hopper position by layer and line.
 *
 * Hopper naming convention:
 * - Main hopper: "M" (e.g., AM = Layer A Main)
 * - Additive hoppers: 1, 2, 3, 4 (e.g., A1, A2, A3, A4)
 */

export interface HopperCapacity {
  main: number;     // Main hopper (M)
  add1: number;     // Additive 1
  add2: number;     // Additive 2
  add3: number;     // Additive 3
  add4: number;     // Additive 4
}

export interface LayerHopperConfig {
  [layerId: string]: HopperCapacity;
}

export interface LineHopperConfig {
  lineId: string;
  capacities: LayerHopperConfig;
}

// Default capacities for most 5-layer lines (210, 212, 15, 221, 222, 224)
const DEFAULT_5_LAYER_CAPACITIES: LayerHopperConfig = {
  A: { main: 70, add1: 55, add2: 55, add3: 55, add4: 55 },
  B: { main: 70, add1: 55, add2: 55, add3: 55, add4: 55 },
  C: { main: 100, add1: 70, add2: 55, add3: 70, add4: 55 },
  D: { main: 70, add1: 55, add2: 55, add3: 55, add4: 55 },
  E: { main: 70, add1: 55, add2: 55, add3: 55, add4: 55 },
};

// Line 216 (Mono) - Keep as placeholder for now
const LINE_216_CAPACITIES: LayerHopperConfig = {
  A: { main: 50, add1: 25, add2: 25, add3: 25, add4: 25 },
};

// Line 217 (3-layer) - Keep as placeholder for now
const LINE_217_CAPACITIES: LayerHopperConfig = {
  A: { main: 50, add1: 25, add2: 25, add3: 25, add4: 25 },
  B: { main: 50, add1: 25, add2: 25, add3: 25, add4: 25 },
  C: { main: 50, add1: 25, add2: 25, add3: 25, add4: 25 },
};

// Line 223 (7-layer) - Smaller hoppers
const LINE_223_CAPACITIES: LayerHopperConfig = {
  A: { main: 10, add1: 10, add2: 5, add3: 5, add4: 5 },
  B: { main: 10, add1: 10, add2: 5, add3: 5, add4: 5 },
  C: { main: 10, add1: 10, add2: 5, add3: 5, add4: 5 },
  D: { main: 10, add1: 10, add2: 5, add3: 5, add4: 5 },
  E: { main: 10, add1: 10, add2: 5, add3: 5, add4: 5 },
  F: { main: 10, add1: 10, add2: 5, add3: 5, add4: 5 },
  G: { main: 10, add1: 10, add2: 5, add3: 5, add4: 5 },
};

// Line-specific configurations
export const LINE_HOPPER_CONFIGS: Record<string, LayerHopperConfig> = {
  "line-210": DEFAULT_5_LAYER_CAPACITIES,
  "line-212": DEFAULT_5_LAYER_CAPACITIES,
  "line-15": DEFAULT_5_LAYER_CAPACITIES,
  "line-216": LINE_216_CAPACITIES,
  "line-217": LINE_217_CAPACITIES,
  "line-221": DEFAULT_5_LAYER_CAPACITIES,
  "line-222": DEFAULT_5_LAYER_CAPACITIES,
  "line-223": LINE_223_CAPACITIES,
  "line-224": DEFAULT_5_LAYER_CAPACITIES,
};

/**
 * Get hopper capacity for a specific line, layer, and hopper position
 */
export function getHopperCapacity(
  lineId: string,
  layerId: string,
  hopperType: "main" | "add1" | "add2" | "add3" | "add4"
): number {
  const lineConfig = LINE_HOPPER_CONFIGS[lineId];
  if (!lineConfig) {
    // Fallback to default capacities
    return hopperType === "main" ? 70 : 55;
  }

  const layerConfig = lineConfig[layerId];
  if (!layerConfig) {
    // Fallback to default capacities
    return hopperType === "main" ? 70 : 55;
  }

  return layerConfig[hopperType];
}

/**
 * Get all hopper capacities for a specific line and layer
 */
export function getLayerHopperCapacities(
  lineId: string,
  layerId: string
): HopperCapacity {
  const lineConfig = LINE_HOPPER_CONFIGS[lineId];
  if (!lineConfig) {
    return { main: 70, add1: 55, add2: 55, add3: 55, add4: 55 };
  }

  const layerConfig = lineConfig[layerId];
  if (!layerConfig) {
    return { main: 70, add1: 55, add2: 55, add3: 55, add4: 55 };
  }

  return layerConfig;
}

/**
 * Check if a line uses the default hopper configuration
 */
export function usesDefaultConfig(lineId: string): boolean {
  return !["line-216", "line-217", "line-223"].includes(lineId);
}

export default LINE_HOPPER_CONFIGS;
