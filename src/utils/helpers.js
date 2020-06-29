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
