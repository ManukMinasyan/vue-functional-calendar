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
  close: 'Close',
  clearRange: 'Clear Range',
  clearRanges: 'Clear Ranges',
  startDate: 'Start Date',
  endDate: 'End Date',
  date: 'Date',
  addDate: 'Add a date',
  hour: 'Hour',
  minute: 'Minute',
  quickRanges: 'Quick ranges',
  range: 'Range',
  presets: {
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    thisMonth: 'This month',
    lastMonth: 'Last month'
  }
}

export const resolveLocale = locale => {
  if (!locale || typeof locale !== 'string') return undefined
  try {
    return Intl.getCanonicalLocales(locale.replace(/_/g, '-'))[0]
  } catch {
    return undefined
  }
}

export const gregorianOptions = options => ({
  ...options,
  calendar: 'gregory'
})

const formatEach = (locale, options, dates) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    ...gregorianOptions(options),
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

const SUNDAY_REGIONS = new Set(
  'AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW'.split(
    ' '
  )
)

const SATURDAY_REGIONS = new Set(
  'AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'.split(' ')
)

const FRIDAY_REGIONS = new Set(['MV'])

const regionFirstDay = intlLocale => {
  const region =
    intlLocale.region ||
    (typeof intlLocale.maximize === 'function' && intlLocale.maximize().region)
  if (!region) return undefined
  if (SUNDAY_REGIONS.has(region)) return 0
  if (SATURDAY_REGIONS.has(region)) return 6
  if (FRIDAY_REGIONS.has(region)) return 5
  return 1
}

export const localeFirstDay = locale => {
  const intlLocale = new Intl.Locale(locale)
  const info =
    typeof intlLocale.getWeekInfo === 'function'
      ? intlLocale.getWeekInfo()
      : intlLocale.weekInfo
  const firstDay = info && info.firstDay
  return Number.isInteger(firstDay) ? firstDay % 7 : regionFirstDay(intlLocale)
}
