import type { LineProfile } from "../types";

/**
 * Production Line Profiles
 *
 * Lines with their layer configurations:
 * - Line 210: 5 layers (A, B, C, D, E)
 * - Line 212: 5 layers (A, B, C, D, E)
 * - Line 15: 5 layers (A, B, C, D, E)
 * - Line 216: 1 layer (A - Mono)
 * - Line 217: 3 layers (A, B, C)
 * - Line 221: 5 layers (A, B, C, D, E)
 * - Line 222: 5 layers (A, B, C, D, E)
 * - Line 223: 7 layers (A, B, C, D, E, F, G)
 * - Line 224: 5 layers (A, B, C, D, E)
 */

export const LINE_PROFILES: LineProfile[] = [
  {
    id: "line-210",
    name: "Line 210",
    dieNumber: 210,
    dieSize: 15.7,
    layerCount: 5,
    layerLabels: ["A", "B", "C", "D", "E"],
    defaultMaterial: "LDPE",
    typicalSpeedRange: { min: 150, max: 350 },
  },
  {
    id: "line-212",
    name: "Line 212",
    dieNumber: 212,
    dieSize: 19.7,
    layerCount: 5,
    layerLabels: ["A", "B", "C", "D", "E"],
    defaultMaterial: "LDPE",
    typicalSpeedRange: { min: 150, max: 400 },
  },
  {
    id: "line-15",
    name: "Line 15",
    dieNumber: 15,
    dieSize: 15.0,
    layerCount: 5,
    layerLabels: ["A", "B", "C", "D", "E"],
    defaultMaterial: "LLDPE",
    typicalSpeedRange: { min: 100, max: 300 },
  },
  {
    id: "line-216",
    name: "Line 216 (Mono)",
    dieNumber: 216,
    dieSize: 24,
    layerCount: 1,
    layerLabels: ["A"],
    defaultMaterial: "LDPE",
    typicalSpeedRange: { min: 150, max: 350 },
  },
  {
    id: "line-217",
    name: "Line 217",
    dieNumber: 217,
    dieSize: 15,
    layerCount: 3,
    layerLabels: ["A", "B", "C"],
    defaultMaterial: "LLDPE",
    typicalSpeedRange: { min: 150, max: 350 },
  },
  {
    id: "line-221",
    name: "Line 221",
    dieNumber: 221,
    dieSize: 20,
    layerCount: 5,
    layerLabels: ["A", "B", "C", "D", "E"],
    defaultMaterial: "LLDPE",
    typicalSpeedRange: { min: 200, max: 400 },
  },
  {
    id: "line-222",
    name: "Line 222",
    dieNumber: 222,
    dieSize: 15.75,
    layerCount: 5,
    layerLabels: ["A", "B", "C", "D", "E"],
    defaultMaterial: "LDPE",
    typicalSpeedRange: { min: 150, max: 380 },
  },
  {
    id: "line-223",
    name: "Line 223",
    dieNumber: 223,
    dieSize: 19.7,
    layerCount: 7,
    layerLabels: ["A", "B", "C", "D", "E", "F", "G"],
    defaultMaterial: "LLDPE",
    typicalSpeedRange: { min: 150, max: 400 },
  },
  {
    id: "line-224",
    name: "Line 224",
    dieNumber: 224,
    dieSize: 17.7,
    layerCount: 5,
    layerLabels: ["A", "B", "C", "D", "E"],
    defaultMaterial: "LDPE",
    typicalSpeedRange: { min: 150, max: 380 },
  },
];

/**
 * Get a line profile by ID
 */
export function getLineById(id: string): LineProfile | undefined {
  return LINE_PROFILES.find((line) => line.id === id);
}

/**
 * Get a line profile by die number
 */
export function getLineByDieNumber(dieNumber: number): LineProfile | undefined {
  return LINE_PROFILES.find((line) => line.dieNumber === dieNumber);
}

export default LINE_PROFILES;
