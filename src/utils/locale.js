const MONDAY = Date.UTC(2024, 0, 1, 12)
const DAY = 86400000

export const DEFAULT_DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export const DEFAULT_LABELS = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  previousYears: 'Previous years',
  nextYears: 'Next years',
  calendar: 'Calendar',
  clearRange: 'Clear Range',
  clearRanges: 'Clear Ranges',
  startDate: 'Start Date',
  endDate: 'End Date',
  date: 'Date',
  addDate: 'Add a date',
  hour: 'Hour',
  minute: 'Minute'
}

export const resolveLocale = locale => {
  if (!locale || typeof locale !== 'string') return undefined
  try {
    return Intl.getCanonicalLocales(locale)[0]
  } catch {
    return undefined
  }
}

const formatEach = (locale, options, dates) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: 'UTC'
  })
  return dates.map(date => formatter.format(date))
}

export const localeDayNames = locale =>
  formatEach(
    locale,
    { weekday: 'short' },
    Array.from({ length: 7 }, (_, i) => MONDAY + i * DAY)
  )

export const localeMonthNames = (locale, month) =>
  formatEach(
    locale,
    { month },
    Array.from({ length: 12 }, (_, i) => Date.UTC(2024, i, 1, 12))
  )

export const localeFirstDay = locale => {
  const intlLocale = new Intl.Locale(locale)
  const info =
    typeof intlLocale.getWeekInfo === 'function'
      ? intlLocale.getWeekInfo()
      : intlLocale.weekInfo
  const firstDay = info && info.firstDay
  return Number.isInteger(firstDay) ? firstDay % 7 : undefined
}
