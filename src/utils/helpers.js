/**
 * Check Element Contains
 * @param el
 * @param child
 * @returns {boolean|*}
 */
export const hElContains = (el, child) =>
  !!el && !!child && (el === child || el.contains(child))

let uniqueId = 0

/**
 * Generate unique ID
 * @returns {number}
 */
export const hUniqueID = () => ++uniqueId
