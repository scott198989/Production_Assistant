import type { Material } from "../types";

/**
 * Material Presets
 *
 * Common film materials with their properties:
 * - density (g/cc) - used in weight calculations
 * - typicalGaugeRange - common gauge range in mils
 * - meltTempRange - typical melt temperature range in Fahrenheit
 */

export const MATERIALS: Material[] = [
  {
    id: "ldpe",
    name: "LDPE",
    density: 0.92,
    typicalGaugeRange: { min: 0.5, max: 6 },
    meltTempRange: { min: 350, max: 450 },
  },
  {
    id: "lldpe",
    name: "LLDPE",
    density: 0.92,
    typicalGaugeRange: { min: 0.5, max: 4 },
    meltTempRange: { min: 380, max: 480 },
  },
  {
    id: "hdpe",
    name: "HDPE",
    density: 0.95,
    typicalGaugeRange: { min: 0.5, max: 4 },
    meltTempRange: { min: 400, max: 520 },
  },
  {
    id: "pp",
    name: "Polypropylene",
    density: 0.9,
    typicalGaugeRange: { min: 0.6, max: 3 },
    meltTempRange: { min: 420, max: 520 },
  },
  {
    id: "eva",
    name: "EVA",
    density: 0.93,
    typicalGaugeRange: { min: 1, max: 6 },
    meltTempRange: { min: 320, max: 400 },
  },
  {
    id: "nylon",
    name: "Nylon",
    density: 1.14,
    typicalGaugeRange: { min: 0.5, max: 3 },
    meltTempRange: { min: 450, max: 550 },
  },
];

/**
 * Default film density (g/cc) - used when material not specified
 * LDPE is the most common material
 */
export const DEFAULT_FILM_DENSITY = 0.92;

/**
 * Get material by ID
 */
export function getMaterialById(id: string): Material | undefined {
  return MATERIALS.find((m) => m.id === id);
}

/**
 * Get material density by ID, or default if not found
 */
export function getMaterialDensity(id?: string): number {
  if (!id) return DEFAULT_FILM_DENSITY;
  return getMaterialById(id)?.density ?? DEFAULT_FILM_DENSITY;
}

export default MATERIALS;
