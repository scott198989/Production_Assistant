/**
 * ISOFlex Dashboard - Production Calculation Formulas
 *
 * All formulas from the plant's standard reference documents.
 * Each function includes JSDoc documentation explaining its purpose and parameters.
 */

/**
 * Roll Weight Calculation
 *
 * Calculates the weight of a roll of film.
 *
 * Formula: Width × Gauge × Length × 12 × Film Density ÷ 27680 = Roll Weight
 *
 * @param width - Film width in inches
 * @param gauge - Film thickness in mils
 * @param length - Length of film in feet
 * @param filmDensity - Material density in g/cc (typically 0.92 for LDPE)
 * @returns Roll weight in pounds
 */
export function calculateRollWeight(
  width: number,
  gauge: number,
  length: number,
  filmDensity: number = 0.92
): number {
  if (width <= 0 || gauge <= 0 || length <= 0 || filmDensity <= 0) {
    return 0;
  }
  return (width * gauge * length * 12 * filmDensity) / 27680;
}

/**
 * Gram Weight Calculation
 *
 * Calculates the gram weight per 100 square inches of film.
 *
 * Formula: Width × Gauge × 24 × 453.6 × Film Density ÷ 27680 = Gram Weight
 *
 * @param width - Film width in inches
 * @param gauge - Film thickness in mils
 * @param filmDensity - Material density in g/cc (typically 0.92 for LDPE)
 * @returns Gram weight in grams per 100 sq in
 */
export function calculateGramWeight(
  width: number,
  gauge: number,
  filmDensity: number = 0.92
): number {
  if (width <= 0 || gauge <= 0 || filmDensity <= 0) {
    return 0;
  }
  return (width * gauge * 24 * 453.6 * filmDensity) / 27680;
}

/**
 * Bag Weight Calculation
 *
 * Calculates the weight of a single bag/pouch.
 *
 * Formula: Width × Gauge × Length × 2 × Film Density ÷ 27680 = Bag Weight
 *
 * @param width - Bag width in inches
 * @param gauge - Film thickness in mils
 * @param length - Bag length in inches
 * @param filmDensity - Material density in g/cc (typically 0.92 for LDPE)
 * @returns Bag weight in pounds
 */
export function calculateBagWeight(
  width: number,
  gauge: number,
  length: number,
  filmDensity: number = 0.92
): number {
  if (width <= 0 || gauge <= 0 || length <= 0 || filmDensity <= 0) {
    return 0;
  }
  return (width * gauge * length * 2 * filmDensity) / 27680;
}

/**
 * Pounds Per Hour Calculation
 *
 * Calculates the production output rate in pounds per hour.
 *
 * Formula: Width × Gauge × FPM ÷ 20.3 = Pounds Per Hour
 *
 * @param width - Film width in inches (layflat width)
 * @param gauge - Film thickness in mils
 * @param fpm - Line speed in feet per minute
 * @returns Production rate in pounds per hour
 */
export function calculatePoundsPerHour(
  width: number,
  gauge: number,
  fpm: number
): number {
  if (width <= 0 || gauge <= 0 || fpm <= 0) {
    return 0;
  }
  return (width * gauge * fpm) / 20.3;
}

/**
 * Gauge Adjustment / Gram Weight Adjustment
 *
 * Calculates the new line speed (FPM) needed when changing gauge
 * to maintain the same output.
 *
 * Formula: (Current Gauge ÷ Target Gauge) × Current FPM = New FPM
 *
 * @param currentGauge - Current film thickness in mils
 * @param targetGauge - Target film thickness in mils
 * @param currentFPM - Current line speed in feet per minute
 * @returns New line speed in feet per minute
 */
export function calculateGaugeAdjustment(
  currentGauge: number,
  targetGauge: number,
  currentFPM: number
): number {
  if (currentGauge <= 0 || targetGauge <= 0 || currentFPM <= 0) {
    return 0;
  }
  return (currentGauge / targetGauge) * currentFPM;
}

/**
 * Blow Up Ratio (BUR)
 *
 * Calculates the blow up ratio of the film bubble.
 *
 * Formula: Layflat × 0.637 ÷ Die Size = BUR
 *
 * @param layflat - Layflat width in inches
 * @param dieSize - Die diameter in inches
 * @returns Blow up ratio (dimensionless)
 */
export function calculateBUR(layflat: number, dieSize: number): number {
  if (layflat <= 0 || dieSize <= 0) {
    return 0;
  }
  return (layflat * 0.637) / dieSize;
}

/**
 * Pounds Per Die Inch (PPDI)
 *
 * Calculates the output rate per inch of die circumference.
 * Used to evaluate extruder loading.
 *
 * Formula: Pounds Per Hour ÷ Die Size ÷ 3.14 = PPDI
 *
 * @param poundsPerHour - Production rate in pounds per hour
 * @param dieSize - Die diameter in inches
 * @returns Output rate in pounds per die inch per hour
 */
export function calculatePPDI(
  poundsPerHour: number,
  dieSize: number
): number {
  if (poundsPerHour <= 0 || dieSize <= 0) {
    return 0;
  }
  return poundsPerHour / dieSize / 3.14;
}

/**
 * Feet on Roll Calculation
 *
 * Calculates actual footage on a partial roll based on weight.
 *
 * Formula: (Actual Roll Weight ÷ Target Roll Weight) × Target Feet = Actual Feet
 *
 * @param targetFeet - Target footage for a full roll
 * @param targetRollWeight - Target weight for a full roll in pounds
 * @param actualRollWeight - Actual weight of the partial roll in pounds
 * @returns Estimated footage on the partial roll
 */
export function calculateFeetOnRoll(
  targetFeet: number,
  targetRollWeight: number,
  actualRollWeight: number
): number {
  if (targetFeet <= 0 || targetRollWeight <= 0 || actualRollWeight <= 0) {
    return 0;
  }
  return (actualRollWeight / targetRollWeight) * targetFeet;
}

/**
 * New Line Setting Calculation
 *
 * Calculates new line speed when changing layflat or gauge
 * to maintain the same pounds per hour output.
 *
 * Formula: (Old L/F ÷ New L/F) × (Old Gauge ÷ New Gauge) × Old Line Speed = New Line Speed
 *
 * @param oldLayflat - Current layflat width in inches
 * @param newLayflat - Target layflat width in inches
 * @param oldGauge - Current film thickness in mils
 * @param newGauge - Target film thickness in mils
 * @param oldLineSpeed - Current line speed in FPM
 * @returns New line speed in FPM to maintain same PPH
 */
export function calculateNewLineSetting(
  oldLayflat: number,
  newLayflat: number,
  oldGauge: number,
  newGauge: number,
  oldLineSpeed: number
): number {
  if (
    oldLayflat <= 0 ||
    newLayflat <= 0 ||
    oldGauge <= 0 ||
    newGauge <= 0 ||
    oldLineSpeed <= 0
  ) {
    return 0;
  }
  return (oldLayflat / newLayflat) * (oldGauge / newGauge) * oldLineSpeed;
}

// ============================================
// Motor Calculations
// ============================================

/**
 * Maximum Screw Speed RPM
 *
 * Calculates the maximum screw RPM based on motor RPM and gearbox ratio.
 *
 * @param maxMotorRPM - Maximum motor RPM
 * @param gearboxRatio - Gearbox reduction ratio
 * @returns Maximum screw RPM
 */
export function calculateMaxScrewRPM(
  maxMotorRPM: number,
  gearboxRatio: number
): number {
  if (maxMotorRPM <= 0 || gearboxRatio <= 0) {
    return 0;
  }
  return maxMotorRPM / gearboxRatio;
}

/**
 * Maximum Screw RPM Per Hour
 *
 * Calculates total screw revolutions per hour at maximum speed.
 *
 * @param maxScrewRPM - Maximum screw RPM
 * @returns Revolutions per hour
 */
export function calculateMaxScrewRPMPerHour(maxScrewRPM: number): number {
  if (maxScrewRPM <= 0) {
    return 0;
  }
  return maxScrewRPM * 60;
}

/**
 * Maximum Output Calculation
 *
 * Calculates maximum extruder output in pounds per hour.
 *
 * @param outputPerRevolution - Output in pounds per screw revolution
 * @param maxRPMPerHour - Maximum revolutions per hour
 * @returns Maximum output in pounds per hour
 */
export function calculateMaxOutput(
  outputPerRevolution: number,
  maxRPMPerHour: number
): number {
  if (outputPerRevolution <= 0 || maxRPMPerHour <= 0) {
    return 0;
  }
  return outputPerRevolution * maxRPMPerHour;
}

// ============================================
// Resin Timeout Calculations
// ============================================

/**
 * Calculate time until hopper is empty
 *
 * @param poundsRemaining - Pounds of material remaining in hopper
 * @param poundsPerHour - Consumption rate in pounds per hour
 * @returns Hours until hopper is empty
 */
export function calculateHoursUntilEmpty(
  poundsRemaining: number,
  poundsPerHour: number
): number {
  if (poundsRemaining <= 0 || poundsPerHour <= 0) {
    return 0;
  }
  return poundsRemaining / poundsPerHour;
}

/**
 * Calculate hopper PPH from total line PPH
 *
 * @param totalPPH - Total line output in pounds per hour
 * @param layerBlendPercent - Layer's percentage of total output (0-100)
 * @param hopperUsagePercent - Hopper's percentage within layer (0-100)
 * @returns Hopper consumption rate in pounds per hour
 */
export function calculateHopperPPH(
  totalPPH: number,
  layerBlendPercent: number,
  hopperUsagePercent: number
): number {
  if (totalPPH <= 0 || layerBlendPercent <= 0 || hopperUsagePercent <= 0) {
    return 0;
  }
  return totalPPH * (layerBlendPercent / 100) * (hopperUsagePercent / 100);
}

/**
 * Format hours as human-readable time string
 *
 * @param hours - Time in decimal hours
 * @returns Formatted string like "2 hours 30 minutes"
 */
export function formatHoursAsTime(hours: number): string {
  if (hours <= 0) {
    return "0 minutes";
  }

  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) {
    return `${m} minute${m !== 1 ? "s" : ""}`;
  }

  if (m === 0) {
    return `${h} hour${h !== 1 ? "s" : ""}`;
  }

  return `${h} hour${h !== 1 ? "s" : ""} ${m} minute${m !== 1 ? "s" : ""}`;
}

/**
 * Calculate shutoff time to synchronize hopper empty times
 *
 * @param currentTime - Current Date
 * @param hoursUntilEmpty - Hours until this hopper empties
 * @param targetHoursUntilEmpty - Hours until target changeover (first hopper to empty)
 * @returns Date when this hopper should be shut off to empty at same time
 */
export function calculateShutoffTime(
  currentTime: Date,
  hoursUntilEmpty: number,
  targetHoursUntilEmpty: number
): Date {
  // If this hopper empties before target, it will need to keep running (no shutoff needed)
  if (hoursUntilEmpty <= targetHoursUntilEmpty) {
    return new Date(currentTime.getTime() + targetHoursUntilEmpty * 60 * 60 * 1000);
  }

  // Calculate how long before target time to shut off
  const hoursToShutoff = hoursUntilEmpty - targetHoursUntilEmpty;
  const shutoffTime = new Date(
    currentTime.getTime() + hoursToShutoff * 60 * 60 * 1000
  );

  return shutoffTime;
}

// ============================================
// Trim Scrap Calculations
// ============================================

/**
 * Trim Scrap Weight Calculation
 *
 * Calculates the weight of edge trim scrap produced during a run.
 *
 * Formula: (Trim Width × Gauge × FPM × Run Time in Hours) ÷ 20.3 = Trim Scrap (lbs)
 *
 * @param trimWidth - Total trim width in inches (web size - total roll width)
 * @param gauge - Film thickness in mils
 * @param fpm - Line speed in feet per minute
 * @param runTimeHours - Run time in hours (e.g., 12 for a full shift)
 * @returns Trim scrap weight in pounds
 */
export function calculateTrimScrap(
  trimWidth: number,
  gauge: number,
  fpm: number,
  runTimeHours: number
): number {
  if (trimWidth <= 0 || gauge <= 0 || fpm <= 0 || runTimeHours <= 0) {
    return 0;
  }
  // FPM × 60 = feet per hour, then multiply by run time hours
  return (trimWidth * gauge * fpm * 60 * runTimeHours) / 20.3;
}

/**
 * Calculate trim width from web size and rolls
 *
 * @param webSize - Total web/bubble width in inches
 * @param numberOfRolls - Number of rolls being wound
 * @param rollWidth - Width of each roll in inches
 * @returns Total trim width in inches
 */
export function calculateTrimWidth(
  webSize: number,
  numberOfRolls: number,
  rollWidth: number
): number {
  if (webSize <= 0 || numberOfRolls <= 0 || rollWidth <= 0) {
    return 0;
  }
  const totalRollWidth = numberOfRolls * rollWidth;
  const trimWidth = webSize - totalRollWidth;
  return trimWidth > 0 ? trimWidth : 0;
}

export default {
  calculateRollWeight,
  calculateGramWeight,
  calculateBagWeight,
  calculatePoundsPerHour,
  calculateGaugeAdjustment,
  calculateBUR,
  calculatePPDI,
  calculateFeetOnRoll,
  calculateNewLineSetting,
  calculateMaxScrewRPM,
  calculateMaxScrewRPMPerHour,
  calculateMaxOutput,
  calculateHoursUntilEmpty,
  calculateHopperPPH,
  formatHoursAsTime,
  calculateShutoffTime,
  calculateTrimScrap,
  calculateTrimWidth,
};
