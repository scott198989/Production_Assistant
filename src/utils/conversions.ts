/**
 * ISOFlex Dashboard - Unit Conversions
 *
 * Common unit conversions used in film extrusion operations.
 */

// ============================================
// Thickness Conversions
// ============================================

/**
 * Convert mils to microns
 * 1 mil = 25.4 microns
 *
 * @param mils - Thickness in mils
 * @returns Thickness in microns
 */
export function milsToMicrons(mils: number): number {
  return mils * 25.4;
}

/**
 * Convert microns to mils
 * 1 micron = 0.0393701 mils
 *
 * @param microns - Thickness in microns
 * @returns Thickness in mils
 */
export function micronsToMils(microns: number): number {
  return microns / 25.4;
}

// ============================================
// Length Conversions
// ============================================

/**
 * Convert millimeters to inches
 * 1 inch = 25.4 mm
 *
 * @param mm - Length in millimeters
 * @returns Length in inches
 */
export function mmToInches(mm: number): number {
  return mm / 25.4;
}

/**
 * Convert inches to millimeters
 * 1 inch = 25.4 mm
 *
 * @param inches - Length in inches
 * @returns Length in millimeters
 */
export function inchesToMm(inches: number): number {
  return inches * 25.4;
}

/**
 * Convert feet to meters
 * 1 foot = 0.3048 meters
 *
 * @param feet - Length in feet
 * @returns Length in meters
 */
export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

/**
 * Convert meters to feet
 * 1 meter = 3.28084 feet
 *
 * @param meters - Length in meters
 * @returns Length in feet
 */
export function metersToFeet(meters: number): number {
  return meters / 0.3048;
}

// ============================================
// Temperature Conversions
// ============================================

/**
 * Convert Fahrenheit to Celsius
 *
 * @param fahrenheit - Temperature in Fahrenheit
 * @returns Temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9);
}

/**
 * Convert Celsius to Fahrenheit
 *
 * @param celsius - Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

// ============================================
// Weight Conversions
// ============================================

/**
 * Convert pounds to kilograms
 * 1 pound = 0.453592 kg
 *
 * @param pounds - Weight in pounds
 * @returns Weight in kilograms
 */
export function poundsToKilograms(pounds: number): number {
  return pounds * 0.453592;
}

/**
 * Convert kilograms to pounds
 * 1 kg = 2.20462 pounds
 *
 * @param kilograms - Weight in kilograms
 * @returns Weight in pounds
 */
export function kilogramsToPounds(kilograms: number): number {
  return kilograms / 0.453592;
}

/**
 * Convert grams to ounces
 * 1 ounce = 28.3495 grams
 *
 * @param grams - Weight in grams
 * @returns Weight in ounces
 */
export function gramsToOunces(grams: number): number {
  return grams / 28.3495;
}

/**
 * Convert ounces to grams
 * 1 ounce = 28.3495 grams
 *
 * @param ounces - Weight in ounces
 * @returns Weight in grams
 */
export function ouncesToGrams(ounces: number): number {
  return ounces * 28.3495;
}

// ============================================
// Speed Conversions
// ============================================

/**
 * Convert feet per minute to meters per minute
 *
 * @param fpm - Speed in feet per minute
 * @returns Speed in meters per minute
 */
export function fpmToMpm(fpm: number): number {
  return fpm * 0.3048;
}

/**
 * Convert meters per minute to feet per minute
 *
 * @param mpm - Speed in meters per minute
 * @returns Speed in feet per minute
 */
export function mpmToFpm(mpm: number): number {
  return mpm / 0.3048;
}

// ============================================
// Conversion Type Definition
// ============================================

export type ConversionType =
  | "mils_microns"
  | "inches_mm"
  | "fahrenheit_celsius"
  | "pounds_kg";

export interface ConversionConfig {
  id: ConversionType;
  name: string;
  fromUnit: string;
  toUnit: string;
  convert: (value: number) => number;
  reverse: (value: number) => number;
}

export const CONVERSIONS: ConversionConfig[] = [
  {
    id: "mils_microns",
    name: "Thickness",
    fromUnit: "mils",
    toUnit: "microns",
    convert: milsToMicrons,
    reverse: micronsToMils,
  },
  {
    id: "inches_mm",
    name: "Length",
    fromUnit: "inches",
    toUnit: "mm",
    convert: inchesToMm,
    reverse: mmToInches,
  },
  {
    id: "fahrenheit_celsius",
    name: "Temperature",
    fromUnit: "°F",
    toUnit: "°C",
    convert: fahrenheitToCelsius,
    reverse: celsiusToFahrenheit,
  },
  {
    id: "pounds_kg",
    name: "Weight",
    fromUnit: "lbs",
    toUnit: "kg",
    convert: poundsToKilograms,
    reverse: kilogramsToPounds,
  },
];

export default {
  milsToMicrons,
  micronsToMils,
  mmToInches,
  inchesToMm,
  feetToMeters,
  metersToFeet,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  poundsToKilograms,
  kilogramsToPounds,
  gramsToOunces,
  ouncesToGrams,
  fpmToMpm,
  mpmToFpm,
  CONVERSIONS,
};
