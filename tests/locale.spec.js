import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import FunctionalCalendar from '../index.js'
import { getWeekNumber } from '../src/assets/js/helpCalendar.js'
import {
  mountCalendar,
  mountCalendarReady,
  dayNameTexts,
  calendarTitle,
  clickDay,
  findDay,
  findDayAny,
  eventsNamed
} from './helpers.js'

const withPlugin = options => ({
  global: { plugins: [[FunctionalCalendar, options]] }
})

const intlNames = (locale, options, dates) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone: 'UTC'
  })
  return dates.map(date => formatter.format(date))
}

const weekdays = locale =>
  intlNames(
    locale,
    { weekday: 'short' },
    [1, 2, 3, 4, 5, 6, 7].map(day => Date.UTC(2024, 0, day, 12))
  )

const months = (locale, month) =>
  intlNames(
    locale,
    { month },
    Array.from({ length: 12 }, (_, i) => Date.UTC(2024, i, 1, 12))
  )

const rotate = (names, shift) => [
  ...names.slice(shift),
  ...names.slice(0, shift)
]

const hiddenInFirstWeek = wrapper =>
  wrapper
    .findAll('.vfc-week')[0]
    .findAll('.vfc-span-day')
    .map(day => day.classes('vfc-hide'))

const press = async (element, key) => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  )
  await nextTick()
  await nextTick()
}

const monthNameCells = async props => {
  const { wrapper } = await mountCalendarReady({
    changeMonthFunction: true,
    ...props
  })
  await press(wrapper.find('.vfc-top-date [role="button"]').element, 'Enter')
  return wrapper.findAll('.vfc-months .vfc-item').map(item => item.text())
}

describe('locale names', () => {
  it('keeps the English defaults without a locale', () => {
    const { wrapper } = mountCalendar()

    expect(dayNameTexts(wrapper)).toEqual([
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
      'Su'
    ])
    expect(calendarTitle(wrapper)).toBe('October 2026')
  })

  it('starts the en-US week on Sunday', () => {
    const { wrapper } = mountCalendar({ locale: 'en-US' })

    expect(dayNameTexts(wrapper)).toEqual(rotate(weekdays('en-US'), 6))
    expect(dayNameTexts(wrapper)[0]).toBe('Sun')
    expect(hiddenInFirstWeek(wrapper)).toEqual([
      true,
      true,
      true,
      true,
      false,
      false,
      false
    ])
  })

  it('shows German names and starts the de-DE week on Monday', () => {
    const { wrapper } = mountCalendar({ locale: 'de-DE' })

    expect(dayNameTexts(wrapper)).toEqual([
      'Mo',
      'Di',
      'Mi',
      'Do',
      'Fr',
      'Sa',
      'So'
    ])
    expect(calendarTitle(wrapper)).toBe('Oktober 2026')
    expect(hiddenInFirstWeek(wrapper)).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
      false
    ])
  })

  it('shows the short month names in the month picker', async () => {
    expect(await monthNameCells({ locale: 'de-DE' })).toEqual(
      months('de-DE', 'short')
    )
    expect(months('de-DE', 'short')[2]).toBe('Mär')
  })

  it('renders ar-EG names and starts the week on Saturday', () => {
    const { wrapper } = mountCalendar({ locale: 'ar-EG' })

    expect(dayNameTexts(wrapper)).toEqual(rotate(weekdays('ar-EG'), 5))
    expect(calendarTitle(wrapper)).toBe(`${months('ar-EG', 'long')[9]} 2026`)
    expect(hiddenInFirstWeek(wrapper)).toEqual([
      true,
      true,
      true,
      true,
      true,
      false,
      false
    ])
  })

  it('renders ja-JP names', () => {
    const { wrapper } = mountCalendar({ locale: 'ja-JP' })

    expect(dayNameTexts(wrapper)).toEqual(rotate(weekdays('ja-JP'), 6))
    expect(calendarTitle(wrapper)).toBe('10月 2026')
  })

  it('ignores a malformed locale', () => {
    const { wrapper } = mountCalendar({ locale: 'not a locale' })

    expect(dayNameTexts(wrapper)[0]).toBe('Mo')
    expect(calendarTitle(wrapper)).toBe('October 2026')
    expect(findDay(wrapper, 1).getAttribute('aria-label')).toBe(
      new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(
        new Date(2026, 9, 1)
      )
    )
  })

  it('numbers the weeks to match the locale week start', () => {
    const { wrapper } = mountCalendar({
      locale: 'de-DE',
      showWeekNumbers: true
    })

    expect(
      wrapper.findAll('.vfc-week-number .vfc-span-day').map(el => el.text())
    ).toEqual(['40', '41', '42', '43', '44'])
  })
})

describe('locale spelling', () => {
  it('reads an underscore tag such as de_DE', () => {
    const { wrapper } = mountCalendar({ locale: 'de_DE' })

    expect(calendarTitle(wrapper)).toBe('Oktober 2026')
    expect(dayNameTexts(wrapper)).toEqual([
      'Mo',
      'Di',
      'Mi',
      'Do',
      'Fr',
      'Sa',
      'So'
    ])
  })
})

describe('gregorian dates in non-gregorian locales', () => {
  const january = { newCurrentDate: new Date(2026, 0, 1) }

  it('names January in fa-IR with the Gregorian month', async () => {
    const { wrapper } = mountCalendar({ locale: 'fa-IR', ...january })

    expect(calendarTitle(wrapper)).toBe('ژانویه 2026')
    expect(await monthNameCells({ locale: 'fa-IR' })).toContain('ژانویه')
  })

  it('names January in ar-SA with the Gregorian month', () => {
    const { wrapper } = mountCalendar({ locale: 'ar-SA', ...january })

    expect(calendarTitle(wrapper)).toBe('يناير 2026')
  })

  it('writes a Gregorian year in the th-TH day label', () => {
    const { wrapper } = mountCalendar({ locale: 'th-TH', ...january })

    expect(findDay(wrapper, 14).getAttribute('aria-label')).toBe(
      'วันพุธที่ 14 มกราคม ค.ศ. 2026'
    )
  })

  it('writes the fa-IR day label with a Gregorian month and year', () => {
    const { wrapper } = mountCalendar({ locale: 'fa-IR', ...january })

    expect(findDay(wrapper, 14).getAttribute('aria-label')).toBe(
      'چهارشنبه ۱۴ ژانویهٔ ۲۰۲۶'
    )
  })
})

describe('week numbers', () => {
  const rowNumber = (wrapper, dates) => {
    const row = wrapper.findAll('.vfc-week').find(week => {
      const days = week.findAll('.vfc-span-day').map(day => day.text())
      const last = days.indexOf(dates[0])
      return last !== -1 && days[last + 1] === dates[1]
    })
    return row.find('.vfc-week-number').text()
  }

  const weekStarts = [
    ['Monday', { sundayStart: false }],
    ['Sunday', { sundayStart: true }],
    ['Saturday', { locale: 'ar-EG' }]
  ]

  it.each(weekStarts)(
    'numbers the row holding Oct 1 2026 as week 40 with a %s start',
    (_, options) => {
      const { wrapper } = mountCalendar({ showWeekNumbers: true, ...options })

      expect(rowNumber(wrapper, ['30', '1'])).toBe('40')
    }
  )

  it.each(weekStarts)(
    'numbers the Dec 2025 and Jan 2026 row the same in both views with a %s start',
    (_, options) => {
      const numbers = [new Date(2025, 11, 1), new Date(2026, 0, 1)].map(
        newCurrentDate =>
          rowNumber(
            mountCalendar({ showWeekNumbers: true, newCurrentDate, ...options })
              .wrapper,
            ['31', '1']
          )
      )

      expect(numbers).toEqual(['1', '1'])
    }
  )

  it.each(weekStarts)(
    'numbers the Dec 2020 and Jan 2021 row as week 53 in both views with a %s start',
    (_, options) => {
      const numbers = [new Date(2020, 11, 1), new Date(2021, 0, 1)].map(
        newCurrentDate =>
          rowNumber(
            mountCalendar({ showWeekNumbers: true, newCurrentDate, ...options })
              .wrapper,
            ['31', '1']
          )
      )

      expect(numbers).toEqual(['53', '53'])
    }
  )

  it.each([
    [0, new Date(2026, 9, 1), 40],
    [6, new Date(2026, 9, 1), 40],
    [0, new Date(2026, 9, 4), 41],
    [6, new Date(2026, 9, 3), 41],
    [1, new Date(2026, 9, 5), 41],
    [0, new Date(2025, 11, 28), 1],
    [6, new Date(2025, 11, 27), 1]
  ])('weekStart %i gives %s the week %i', (weekStart, date, week) => {
    expect(getWeekNumber(date, weekStart)).toBe(week)
  })
})

describe('locale aria labels', () => {
  it.each(['en-US', 'de-DE', 'fr-FR', 'ja-JP', 'ar-EG'])(
    'writes the day label in %s',
    locale => {
      const { wrapper } = mountCalendar({ locale })

      expect(findDay(wrapper, 14).getAttribute('aria-label')).toBe(
        new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(
          new Date(2026, 9, 14)
        )
      )
    }
  )

  it('labels the grid with the localized month', () => {
    const { wrapper } = mountCalendar({ locale: 'de-DE' })

    expect(wrapper.find('[role="grid"]').attributes('aria-label')).toBe(
      'Oktober 2026'
    )
    expect(findDay(wrapper, 14).getAttribute('aria-label')).toBe(
      'Mittwoch, 14. Oktober 2026'
    )
  })
})

describe('locale week start in keyboard navigation', () => {
  const homeAndEnd = async props => {
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      ...props
    })
    const origin = findDay(wrapper, 7)
    origin.focus()
    await press(origin, 'Home')
    const home = document.activeElement
    await press(home, 'End')
    return [home, document.activeElement, wrapper]
  }

  it('moves to Monday and Sunday for de-DE', async () => {
    const [home, end, wrapper] = await homeAndEnd({ locale: 'de-DE' })

    expect(home).toBe(findDay(wrapper, 5))
    expect(end).toBe(findDay(wrapper, 11))
  })

  it('moves to Sunday and Saturday for en-US', async () => {
    const [home, end, wrapper] = await homeAndEnd({ locale: 'en-US' })

    expect(home).toBe(findDay(wrapper, 4))
    expect(end).toBe(findDay(wrapper, 10))
  })

  it('moves to Saturday and Friday for ar-EG', async () => {
    const [home, end, wrapper] = await homeAndEnd({ locale: 'ar-EG' })

    expect(home).toBe(findDay(wrapper, 3))
    expect(end).toBe(findDay(wrapper, 9))
  })
})

describe('week start source', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const firstDayOf = firstDay => {
    vi.spyOn(Intl.Locale.prototype, 'weekInfo', 'get').mockReturnValue({
      firstDay
    })
  }

  it('reads Intl.Locale getWeekInfo when the engine has it', () => {
    Intl.Locale.prototype.getWeekInfo = () => ({ firstDay: 3 })
    try {
      const { wrapper } = mountCalendar({ locale: 'de-DE' })

      expect(dayNameTexts(wrapper)[0]).toBe(weekdays('de-DE')[2])
    } finally {
      delete Intl.Locale.prototype.getWeekInfo
    }
  })

  it('reads the weekInfo property when getWeekInfo is missing', () => {
    expect(typeof Intl.Locale.prototype.getWeekInfo).not.toBe('function')
    firstDayOf(6)

    const { wrapper } = mountCalendar({ locale: 'de-DE' })

    expect(dayNameTexts(wrapper)[0]).toBe(weekdays('de-DE')[5])
  })

  describe('without getWeekInfo or weekInfo', () => {
    const firstDayName = locale => {
      const { wrapper } = mountCalendar({ locale })
      return dayNameTexts(wrapper)[0]
    }

    const withoutWeekInfo = () =>
      vi
        .spyOn(Intl.Locale.prototype, 'weekInfo', 'get')
        .mockReturnValue(undefined)

    it('starts the en-US week on Sunday', () => {
      withoutWeekInfo()

      expect(firstDayName('en-US')).toBe(weekdays('en-US')[6])
      expect(firstDayName('en')).toBe(weekdays('en')[6])
    })

    it('starts de-DE on Monday and ar-EG on Saturday', () => {
      withoutWeekInfo()

      expect(firstDayName('de-DE')).toBe(weekdays('de-DE')[0])
      expect(firstDayName('ar-EG')).toBe(weekdays('ar-EG')[5])
    })

    it.each([
      ['is-IS', 6],
      ['ar-AE', 0],
      ['dv-MV', 4],
      ['ar-SA', 6],
      ['fa-IR', 5],
      ['en-GB', 0]
    ])('follows CLDR 48 for %s', (locale, index) => {
      withoutWeekInfo()

      expect(firstDayName(locale)).toBe(weekdays(locale)[index])
    })

    it('lets an explicit sundayStart win', () => {
      withoutWeekInfo()

      const { wrapper } = mountCalendar({ locale: 'de-DE', sundayStart: true })

      expect(dayNameTexts(wrapper)[0]).toBe(weekdays('de-DE')[6])
    })
  })

  it('maps a Sunday first day reported as 7', () => {
    firstDayOf(7)

    const { wrapper } = mountCalendar({ locale: 'de-DE' })

    expect(dayNameTexts(wrapper)[0]).toBe(weekdays('de-DE')[6])
  })
})

describe('precedence', () => {
  const propDayNames = ['1', '2', '3', '4', '5', '6', '7']
  const globalDayNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  it('lets an explicit dayNames prop override the locale names', () => {
    const { wrapper } = mountCalendar({
      locale: 'de-DE',
      dayNames: propDayNames
    })

    expect(dayNameTexts(wrapper)).toEqual(propDayNames)
    expect(calendarTitle(wrapper)).toBe('Oktober 2026')
  })

  it('lets explicit monthNames override the locale and keeps the other derived names', async () => {
    const monthNames = Array.from({ length: 12 }, (_, i) => `M${i}`)
    const { wrapper } = mountCalendar({ locale: 'de-DE', monthNames })

    expect(calendarTitle(wrapper)).toBe('M9 2026')
    expect(dayNameTexts(wrapper)[0]).toBe('Mo')
  })

  it('rotates explicit dayNames to the locale week start', () => {
    const { wrapper } = mountCalendar({
      locale: 'en-US',
      dayNames: propDayNames
    })

    expect(dayNameTexts(wrapper)).toEqual(['7', '1', '2', '3', '4', '5', '6'])
  })

  it('lets an explicit sundayStart override the locale week start', () => {
    const monday = mountCalendar({ locale: 'en-US', sundayStart: false })
    expect(dayNameTexts(monday.wrapper)[0]).toBe(weekdays('en-US')[0])

    const sunday = mountCalendar({ locale: 'de-DE', sundayStart: true })
    expect(dayNameTexts(sunday.wrapper)[0]).toBe(weekdays('de-DE')[6])
  })

  it('reads the locale from configs', () => {
    const { wrapper } = mountCalendar({ configs: { locale: 'de-DE' } })

    expect(calendarTitle(wrapper)).toBe('Oktober 2026')
    expect(dayNameTexts(wrapper)[0]).toBe('Mo')
  })

  it('reads the locale from the global options', () => {
    const { wrapper } = mountCalendar({}, withPlugin({ locale: 'de-DE' }))

    expect(calendarTitle(wrapper)).toBe('Oktober 2026')
  })

  it('lets the locale prop override a global locale', () => {
    const { wrapper } = mountCalendar(
      { locale: 'fr-FR' },
      withPlugin({ locale: 'de-DE' })
    )

    expect(calendarTitle(wrapper)).toBe('octobre 2026')
  })

  it('lets configs override a global locale', () => {
    const { wrapper } = mountCalendar(
      { configs: { locale: 'fr-FR' } },
      withPlugin({ locale: 'de-DE' })
    )

    expect(calendarTitle(wrapper)).toBe('octobre 2026')
  })

  it('skips the locale prop when configs sets a locale', () => {
    const { wrapper } = mountCalendar({
      locale: 'de-DE',
      configs: { locale: 'fr-FR' }
    })

    expect(calendarTitle(wrapper)).toBe('octobre 2026')
  })

  it('lets a global dayNames option override a prop locale', () => {
    const { wrapper } = mountCalendar(
      { locale: 'de-DE' },
      withPlugin({ dayNames: globalDayNames })
    )

    expect(dayNameTexts(wrapper)).toEqual(globalDayNames)
    expect(calendarTitle(wrapper)).toBe('Oktober 2026')
  })

  it('lets configs dayNames override a global dayNames and the locale', () => {
    const { wrapper } = mountCalendar(
      { configs: { dayNames: propDayNames, locale: 'de-DE' } },
      withPlugin({ dayNames: globalDayNames })
    )

    expect(dayNameTexts(wrapper)).toEqual(propDayNames)
  })

  it('keeps the dateFormat of a locale calendar unchanged', async () => {
    const { wrapper } = mountCalendar({ locale: 'de-DE', isDatePicker: true })

    await clickDay(wrapper, 14)

    expect(wrapper.emitted('update:modelValue').at(-1)[0].selectedDate).toBe(
      '14/10/2026'
    )
  })
})

describe('disabledDayNames with a locale', () => {
  const options = {
    locale: 'de-DE',
    isDatePicker: true,
    disabledDayNames: ['Sa', 'Su']
  }

  it('matches the English two-letter names against German names', () => {
    const { wrapper } = mountCalendar(options)

    ;[3, 4, 10, 11].forEach(day => {
      expect(findDayAny(wrapper, day).classList).toContain('vfc-hide')
    })
    ;[2, 5, 9, 12].forEach(day => {
      expect(findDayAny(wrapper, day).classList).not.toContain('vfc-hide')
    })
  })

  it('still matches the active names', () => {
    const { wrapper } = mountCalendar({ ...options, disabledDayNames: ['So'] })

    ;[4, 11].forEach(day => {
      expect(findDayAny(wrapper, day).classList).toContain('vfc-hide')
    })
    expect(findDayAny(wrapper, 3).classList).not.toContain('vfc-hide')
  })

  it('blocks clicks on the disabled weekdays', async () => {
    const { wrapper, events } = mountCalendar(options)

    findDayAny(wrapper, 10).click()
    await nextTick()
    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)

    await clickDay(wrapper, 9)
    expect(wrapper.emitted('update:modelValue').at(-1)[0].selectedDate).toBe(
      '9/10/2026'
    )
  })

  it('marks the aria-disabled state', () => {
    const { wrapper } = mountCalendar(options)

    expect(findDayAny(wrapper, 10).getAttribute('aria-disabled')).toBe('true')
    expect(findDayAny(wrapper, 9).getAttribute('aria-disabled')).toBe('false')
  })

  it('works with a Sunday-first locale', () => {
    const { wrapper } = mountCalendar({ ...options, locale: 'en-US' })

    ;[3, 4, 10, 11].forEach(day => {
      expect(findDayAny(wrapper, day).classList).toContain('vfc-hide')
    })
  })
})

describe('labels', () => {
  it('keeps the English labels by default', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      canClearRange: true
    })

    expect(wrapper.find('button[aria-label="Previous month"]').exists()).toBe(
      true
    )
    expect(wrapper.find('button[aria-label="Next month"]').exists()).toBe(true)
    expect(wrapper.find('[role="dialog"]').attributes('aria-label')).toBe(
      'Calendar'
    )
    expect(wrapper.find('.rangeCleaner span').text()).toBe('Clear Range')
    expect(
      wrapper
        .findAll('.vfc-multiple-input input')
        .map(i => i.attributes('title'))
    ).toEqual(['Start Date', 'End Date'])
  })

  it('merges a partial labels prop over the defaults', () => {
    const { wrapper } = mountCalendar({
      labels: { previousMonth: 'Vorheriger Monat' }
    })

    expect(wrapper.find('button[aria-label="Vorheriger Monat"]').exists()).toBe(
      true
    )
    expect(wrapper.find('button[aria-label="Next month"]').exists()).toBe(true)
  })

  it('translates the footer, dialog and input labels', async () => {
    const labels = {
      calendar: 'Kalender',
      clearRange: 'Zeitraum löschen',
      clearRanges: 'Zeiträume löschen',
      startDate: 'Startdatum',
      endDate: 'Enddatum'
    }
    const single = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      canClearRange: true,
      labels
    })

    expect(
      single.wrapper.find('[role="dialog"]').attributes('aria-label')
    ).toBe('Kalender')
    expect(single.wrapper.find('.rangeCleaner span').text()).toBe(
      'Zeitraum löschen'
    )
    expect(
      single.wrapper
        .findAll('.vfc-multiple-input input')
        .map(i => i.attributes('title'))
    ).toEqual(['Startdatum', 'Enddatum'])

    const multiple = await mountCalendarReady({
      isDateRange: true,
      isMultipleDateRange: true,
      canClearRange: true,
      labels
    })
    expect(multiple.wrapper.find('.rangeCleaner span').text()).toBe(
      'Zeiträume löschen'
    )
  })

  it('translates the month and year picker arrows', async () => {
    const { wrapper } = await mountCalendarReady({
      changeMonthFunction: true,
      changeYearFunction: true,
      labels: { previousYear: 'Vorheriges Jahr', nextYears: 'Weitere Jahre' }
    })

    await press(wrapper.find('.vfc-top-date [role="button"]').element, 'Enter')
    expect(wrapper.find('button[aria-label="Vorheriges Jahr"]').exists()).toBe(
      true
    )
    expect(wrapper.find('button[aria-label="Next year"]').exists()).toBe(true)
  })

  it('translates the time picker titles', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      withTimePicker: true,
      labels: { hour: 'Stunde', minute: 'Minute ' }
    })

    await clickDay(wrapper, 10)

    expect(wrapper.find('.titles').text()).toContain('Stunde')
  })

  it('reads labels from configs and global options, configs on top', () => {
    const { wrapper } = mountCalendar(
      { configs: { labels: { nextMonth: 'Naechster' } } },
      withPlugin({ labels: { previousMonth: 'Zurueck', nextMonth: 'Global' } })
    )

    expect(wrapper.find('button[aria-label="Zurueck"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Naechster"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Global"]').exists()).toBe(false)
  })

  it('lets the labels prop override a global labels option', () => {
    const { wrapper } = mountCalendar(
      { labels: { nextMonth: 'Prop' } },
      withPlugin({ labels: { nextMonth: 'Global' } })
    )

    expect(wrapper.find('button[aria-label="Prop"]').exists()).toBe(true)
  })

  it('does not leak labels between calendars', () => {
    mountCalendar({ labels: { nextMonth: 'Leak' } })
    const { wrapper } = mountCalendar()

    expect(wrapper.find('button[aria-label="Next month"]').exists()).toBe(true)
  })
})
