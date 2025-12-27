/**
 * Die Sizes Reference Table
 *
 * Maps die numbers to their sizes in inches (and mm where applicable)
 */

export interface DieSize {
  inches: number;
  mm?: number;
}

export const DIE_SIZES: Record<number, DieSize> = {
  15: { inches: 15.0 },
  210: { inches: 15.7 },
  212: { inches: 19.7 },
  214: { inches: 19.7 },
  216: { inches: 24 },
  217: { inches: 15 },
  218: { inches: 12.4 },
  219: { inches: 15.75, mm: 400 },
  220: { inches: 15.75 }, // 220T
  221: { inches: 20, mm: 400 },
  222: { inches: 15.75 },
  223: { inches: 19.7 },
  224: { inches: 17.7, mm: 450 },
};

/**
 * Get die size in inches by die number
 */
export function getDieSizeInches(dieNumber: number): number | undefined {
  return DIE_SIZES[dieNumber]?.inches;
}

/**
 * Get die size in mm by die number (if available)
 */
export function getDieSizeMm(dieNumber: number): number | undefined {
  return DIE_SIZES[dieNumber]?.mm;
}

/**
 * Get all die numbers as an array
 */
export function getDieNumbers(): number[] {
  return Object.keys(DIE_SIZES).map(Number).sort((a, b) => a - b);
}

export default DIE_SIZES;
