/**
 * Check Element Contains
 * @param el
 * @param child
 * @returns {boolean|*}
 */
export const hElContains = (el, child) =>
  !!el && !!child && (el === child || el.contains(child))

/**
 * Generate unique ID
 * @returns {number}
 */
export const hUniqueID = () => new Date().getUTCMilliseconds()

let instanceCounter = 0

/**
 * Generate a per-instance id
 * @returns {number}
 */
export const hNextInstanceId = () => ++instanceCounter
