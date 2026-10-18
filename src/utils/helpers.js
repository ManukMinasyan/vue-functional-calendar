export const hElContains = (el, child) =>
  !!el && !!child && (el === child || el.contains(child))

let uniqueId = 0

export const hUniqueID = () => ++uniqueId
