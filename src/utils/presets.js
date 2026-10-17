export const PRESET_KEYS = [
  'today',
  'yesterday',
  'last7Days',
  'last30Days',
  'thisMonth',
  'lastMonth'
]

const dayStart = (date, offset = 0) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset)

export const builtInRange = (key, now) => {
  const today = dayStart(now)
  const year = now.getFullYear()
  const month = now.getMonth()

  switch (key) {
    case 'today':
      return { start: today, end: today }
    case 'yesterday':
      return { start: dayStart(now, -1), end: dayStart(now, -1) }
    case 'last7Days':
      return { start: dayStart(now, -6), end: today }
    case 'last30Days':
      return { start: dayStart(now, -29), end: today }
    case 'thisMonth':
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 0)
      }
    case 'lastMonth':
      return {
        start: new Date(year, month - 1, 1),
        end: new Date(year, month, 0)
      }
    default:
      return null
  }
}

export const isValidRange = range =>
  !!range &&
  range.start instanceof Date &&
  range.end instanceof Date &&
  !isNaN(range.start) &&
  !isNaN(range.end) &&
  dayStart(range.start) <= dayStart(range.end)

export const eachDay = (start, end) => {
  const days = []
  const last = dayStart(end).getTime()
  for (let day = dayStart(start); day.getTime() <= last;) {
    days.push(day)
    day = dayStart(day, 1)
  }
  return days
}
