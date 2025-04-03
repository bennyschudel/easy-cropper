/**
 * Creates a DOM event with the specified name, value, and options.
 *
 * @param {string} name - The name of the event.
 * @param {*} value - The value to be attached to the event.
 * @param {Object} [options] - Optional settings for the event.
 * @param {boolean} [options.bubbles=true] -  A boolean indicating whether the event bubbles up through the DOM or not.
 * @param {boolean} [options.cancelable=true] - A boolean indicating whether the event is cancelable.
 * @param {boolean} [options.composed=true] - A boolean indicating whether the event will trigger listeners outside of a shadow root.
 * @returns {Event} -  The newly created event.
 */
export function createEvent(
  name,
  value,
  {
    bubbles = true,
    cancelable = true,
    clone = false,
    composed = true,
  } = {},
) {
  const event = new Event(name, {
    bubbles,
    cancelable,
    composed,
  });

  event.value = clone ? window.structuredClone(value) : value;

  return event;
}
