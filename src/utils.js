/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param {number} value - The number to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - The clamped value.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Ensures that a given value is not less than zero.
 *
 * @param {number} value - The input value to be evaluated.
 * @returns {number} The input value if it is greater than or equal to zero, otherwise 0.
 */
export function minZero(value) {
  return Math.max(0, value);
}


/**
 * Checks if any key from an array of keys exists in a given map.
 *
 * @param {Map} map - The map to check for the keys.
 * @param {Array} keys - The array of keys to check in the map.
 * @returns {boolean} - True if any key exists in the map, otherwise false.
 */
export function checkMapHasAnyKey(map, keys) {
  return keys.some(key => map.has(key));
}
