import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  mountCalendar,
  clickDay,
  clickDays,
  findDay,
  findDayAny,
  calendarTitle,
  eventsNamed,
  lastValue
} from './helpers.js'

const arrow = (wrapper, direction) =>
  wrapper.find(`.vfc-separately-navigation-buttons .vfc-arrow-${direction}`)

describe('limits', () => {
  const limits = { min: '05/10/2026', max: '20/10/2026' }

  it('marks days outside the limits as disabled', () => {
    const { wrapper } = mountCalendar({ isDatePicker: true, limits })

    expect(findDay(wrapper, 3).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 3).classList).toContain('vfc-cursor-not-allowed')
    expect(findDay(wrapper, 25).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 5).classList).not.toContain('vfc-disabled')
    expect(findDay(wrapper, 20).classList).not.toContain('vfc-disabled')
  })

  it('ignores clicks outside the limits but still emits dayClicked', async () => {
    const { wrapper, events } = mountCalendar({ isDatePicker: true, limits })

    await clickDay(wrapper, 3)

    expect(eventsNamed(events, 'dayClicked')).toHaveLength(1)
    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)
    expect(lastValue(wrapper).selectedDate).toBe(false)
  })

  it('accepts clicks inside the limits', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true, limits })

    await clickDay(wrapper, 15)

    expect(lastValue(wrapper).selectedDate).toBe('15/10/2026')
  })

  it('ignores range clicks outside the limits', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, limits })

    await clickDay(wrapper, 3)
    await clickDay(wrapper, 10)

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: ''
    })
  })

  it('disables both arrows when the limits sit inside the visible month', async () => {
    const { wrapper, events } = mountCalendar({ isDatePicker: true, limits })

    expect(arrow(wrapper, 'left').classes()).toContain('vfc-disabled')
    expect(arrow(wrapper, 'right').classes()).toContain('vfc-disabled')

    await arrow(wrapper, 'right').trigger('click')

    expect(eventsNamed(events, 'changedMonth')).toHaveLength(0)
    expect(calendarTitle(wrapper)).toBe('October 2026')
  })

  it('stops navigating at the month of the max limit', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      limits: { min: '05/09/2026', max: '20/11/2026' }
    })
    expect(arrow(wrapper, 'right').classes()).not.toContain('vfc-disabled')

    await arrow(wrapper, 'right').trigger('click')
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper)).toBe('November 2026')
    expect(arrow(wrapper, 'right').classes()).toContain('vfc-disabled')

    await arrow(wrapper, 'right').trigger('click')

    expect(calendarTitle(wrapper)).toBe('November 2026')
  })

  it('stops navigating at the month of the min limit', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      limits: { min: '05/09/2026', max: '20/11/2026' }
    })

    await arrow(wrapper, 'left').trigger('click')
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper)).toBe('September 2026')
    expect(arrow(wrapper, 'left').classes()).toContain('vfc-disabled')
  })
})

describe('limits on every navigation move', () => {
  const year2026 = { min: '1/1/2026', max: '31/12/2026' }
  const openMonthPicker = async wrapper => {
    wrapper.vm.openMonthPicker(1)
    await wrapper.vm.$nextTick()
  }

  it('keeps the month picker next-year arrow inside the limits', async () => {
    const { wrapper, events } = mountCalendar({
      limits: year2026,
      changeMonthFunction: true
    })
    await openMonthPicker(wrapper)

    await wrapper
      .find('.vfc-months-container .vfc-arrow-right')
      .trigger('click')

    expect(calendarTitle(wrapper)).toBe('October 2026')
    expect(eventsNamed(events, 'changedYear')).toHaveLength(0)
  })

  it('keeps the month picker previous-year arrow inside the limits', async () => {
    const { wrapper } = mountCalendar({
      limits: year2026,
      changeMonthFunction: true
    })
    await openMonthPicker(wrapper)

    await wrapper.find('.vfc-months-container .vfc-arrow-left').trigger('click')

    expect(calendarTitle(wrapper)).toBe('October 2026')
  })

  it('moves a year inside the limits', async () => {
    const { wrapper } = mountCalendar({
      limits: { min: '1/1/2026', max: '31/12/2027' }
    })

    wrapper.vm.NextYear()
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper)).toBe('October 2027')
  })

  it('refuses a changeMonthStep that lands past the max limit', async () => {
    const { wrapper, events } = mountCalendar({
      limits: year2026,
      changeMonthStep: 3
    })

    wrapper.vm.NextMonth()
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper)).toBe('October 2026')
    expect(eventsNamed(events, 'changedMonth')).toHaveLength(0)
  })

  it('refuses a changeMonthStep that lands before the min limit', async () => {
    const { wrapper } = mountCalendar({
      limits: { min: '1/8/2026', max: '31/12/2026' },
      changeMonthStep: 3
    })

    wrapper.vm.PreMonth()
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper)).toBe('October 2026')
  })

  it('refuses picking a month or year outside the limits', async () => {
    const { wrapper, events } = mountCalendar({ limits: year2026 })

    wrapper.vm.pickYear(2028, 0)
    wrapper.vm.pickMonth(11, 0)
    wrapper.vm.pickYear(2025, 0)
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper)).toBe('December 2026')
    expect(eventsNamed(events, 'changedYear')).toHaveLength(0)
  })

  it('refuses ChooseDate for a month outside the limits', async () => {
    const { wrapper } = mountCalendar({ limits: year2026 })

    wrapper.vm.ChooseDate('15/12/2027')
    wrapper.vm.ChooseDate('15/12/2025')
    await wrapper.vm.$nextTick()
    expect(calendarTitle(wrapper)).toBe('October 2026')

    wrapper.vm.ChooseDate('15/12/2026')
    await wrapper.vm.$nextTick()
    expect(calendarTitle(wrapper)).toBe('December 2026')
  })

  it('stops the right arrow before the last calendar passes the max limit', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      calendarsCount: 2,
      limits: year2026
    })

    for (let step = 0; step < 4; step++) {
      await arrow(wrapper, 'right').trigger('click')
    }

    expect(
      wrapper
        .findAll('.vfc-calendar')
        .map((_, index) => calendarTitle(wrapper, index))
    ).toEqual(['November 2026', 'December 2026'])
    expect(arrow(wrapper, 'right').classes()).toContain('vfc-disabled')
  })

  it('keeps both arrows of an isSeparately calendar free until its own month reaches a limit', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 2,
      limits: { min: '1/1/2026', max: '30/11/2026' }
    })

    expect(wrapper.find('.vfc-arrow-right').classes()).not.toContain(
      'vfc-disabled'
    )
  })

  it('stops the right arrow of a two-calendar range picker before a month past the max limit shows', async () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      isMultiple: true,
      calendarsCount: 2,
      newCurrentDate: new Date(2019, 5, 1),
      limits: { min: '3/6/2019', max: '3/6/2020' }
    })

    for (let step = 0; step < 14; step++) {
      await arrow(wrapper, 'right').trigger('click')
    }

    expect(calendarTitle(wrapper, 1)).toBe('June 2020')
  })

  it('stops the right arrow of an isSeparately calendar at the max limit', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 2,
      limits: year2026
    })

    wrapper.vm.NextYear(1)
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper, 1)).toBe('November 2026')
  })
})

describe('limits with several calendars', () => {
  const titles = wrapper =>
    wrapper
      .findAll('.vfc-calendar')
      .map((_, index) => calendarTitle(wrapper, index))

  it('does not render a calendar for a month past the max limit', () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      isMultiple: true,
      calendarsCount: 2,
      newCurrentDate: new Date(2026, 10, 1),
      limits: { min: '1/11/2026', max: '30/11/2026' }
    })

    expect(titles(wrapper)).toEqual(['November 2026'])
  })

  it('renders the months up to the max limit', () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      calendarsCount: 3,
      newCurrentDate: new Date(2026, 10, 1),
      limits: { min: '1/1/2026', max: '31/12/2026' }
    })

    expect(titles(wrapper)).toEqual(['November 2026', 'December 2026'])
  })

  it('shows the dropped calendar again after moving back', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      calendarsCount: 2,
      newCurrentDate: new Date(2026, 10, 1),
      limits: { min: '1/1/2026', max: '30/11/2026' }
    })

    await arrow(wrapper, 'left').trigger('click')

    expect(titles(wrapper)).toEqual(['October 2026', 'November 2026'])
  })

  it('still renders the first calendar when its month is past the max limit', () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      calendarsCount: 2,
      newCurrentDate: new Date(2027, 0, 1),
      limits: { min: '1/1/2026', max: '30/11/2026' }
    })

    expect(titles(wrapper)).toEqual(['January 2027'])
  })
})

describe('limits after picking a month', () => {
  it('re-checks the arrows for the picked month', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      limits: { min: '1/10/2026', max: '31/12/2027' }
    })
    expect(arrow(wrapper, 'left').classes()).toContain('vfc-disabled')

    wrapper.vm.pickMonth(11, 0)
    await wrapper.vm.$nextTick()

    expect(calendarTitle(wrapper)).toBe('December 2026')
    expect(wrapper.vm.calendar.currentDate.getMonth()).toBe(11)
    expect(arrow(wrapper, 'left').classes()).not.toContain('vfc-disabled')
  })
})

describe('disabledDates', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('disables listed dates and ignores clicks on them', async () => {
    const { wrapper, events } = mountCalendar({
      isDatePicker: true,
      disabledDates: ['10/10/2026']
    })

    expect(findDay(wrapper, 10).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 11).classList).not.toContain('vfc-disabled')

    await clickDay(wrapper, 10)

    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)
    expect(lastValue(wrapper).selectedDate).toBe(false)
  })

  it('disables every day before today with beforeToday', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 9))
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      disabledDates: ['beforeToday']
    })

    expect(findDay(wrapper, 14).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 15).classList).not.toContain('vfc-disabled')
    expect(findDay(wrapper, 16).classList).not.toContain('vfc-disabled')
  })

  it('disables every day after today with afterToday', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 9))
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      disabledDates: ['afterToday']
    })

    expect(findDay(wrapper, 14).classList).not.toContain('vfc-disabled')
    expect(findDay(wrapper, 15).classList).not.toContain('vfc-disabled')
    expect(findDay(wrapper, 16).classList).toContain('vfc-disabled')
  })
})

describe('enabledDates', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('disables every date that is not listed', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      enabledDates: ['12/10/2026']
    })

    expect(findDay(wrapper, 12).classList).not.toContain('vfc-disabled')
    expect(findDay(wrapper, 13).classList).toContain('vfc-disabled')

    await clickDay(wrapper, 10)
    expect(lastValue(wrapper).selectedDate).toBe(false)

    await clickDay(wrapper, 12)
    expect(lastValue(wrapper).selectedDate).toBe('12/10/2026')
  })

  it('follows later changes to the enabledDates prop', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      enabledDates: ['12/10/2026']
    })

    await wrapper.setProps({ enabledDates: ['13/10/2026'] })

    expect(findDay(wrapper, 12).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 13).classList).not.toContain('vfc-disabled')
  })

  it('allows only days after today with the afterToday token', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 9))
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      enabledDates: ['afterToday']
    })

    expect(findDay(wrapper, 15).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 16).classList).not.toContain('vfc-disabled')
  })
})

describe.each([
  ['Monday', false],
  ['Sunday', true]
])('disabledDayNames with a %s week start', (_, sundayStart) => {
  const options = {
    isDatePicker: true,
    disabledDayNames: ['Su'],
    sundayStart
  }

  it('hides and blocks only Sundays', () => {
    const { wrapper } = mountCalendar(options)

    ;[4, 11, 18].forEach(day => {
      expect(findDayAny(wrapper, day).classList).toContain('vfc-hide')
    })
    ;[3, 5, 10].forEach(day => {
      expect(findDayAny(wrapper, day).classList).not.toContain('vfc-hide')
    })
  })

  it('ignores clicks on Sundays and accepts the other days', async () => {
    const { wrapper, events } = mountCalendar(options)

    findDayAny(wrapper, 11).click()
    await wrapper.vm.$nextTick()
    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)

    await clickDay(wrapper, 10)
    expect(lastValue(wrapper).selectedDate).toBe('10/10/2026')
  })
})

describe('disabledDayNames', () => {
  const options = { isDatePicker: true, disabledDayNames: ['Sa', 'Su'] }

  it('hides and blocks the listed weekdays', () => {
    const { wrapper } = mountCalendar(options)

    ;[3, 4].forEach(day => {
      const element = findDayAny(wrapper, day)
      expect(element.classList).toContain('vfc-hide')
      expect(element.classList).toContain('vfc-cursor-not-allowed')
    })
    expect(findDay(wrapper, 5).classList).not.toContain(
      'vfc-cursor-not-allowed'
    )
  })

  it('ignores clicks on a disabled weekday', async () => {
    const { wrapper, events } = mountCalendar(options)

    findDayAny(wrapper, 10).click()
    await wrapper.vm.$nextTick()

    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)
  })

  it('accepts clicks on the other weekdays', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDay(wrapper, 12)

    expect(lastValue(wrapper).selectedDate).toBe('12/10/2026')
  })
})

describe('dates written with a leading zero', () => {
  const pickerOptions = { isDatePicker: true }

  afterEach(() => {
    vi.useRealTimers()
  })

  it('disables a listed date in the padded and the unpadded form', async () => {
    const { wrapper, events } = mountCalendar({
      ...pickerOptions,
      disabledDates: ['07/10/2026', '9/10/2026']
    })

    expect(findDay(wrapper, 7).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 9).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 8).classList).not.toContain('vfc-disabled')

    await clickDay(wrapper, 7)

    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)
  })

  it('enables only the listed dates in either form', async () => {
    const { wrapper } = mountCalendar({
      ...pickerOptions,
      enabledDates: ['07/10/2026', '9/10/2026']
    })

    expect(findDay(wrapper, 7).classList).not.toContain('vfc-disabled')
    expect(findDay(wrapper, 9).classList).not.toContain('vfc-disabled')
    expect(findDay(wrapper, 8).classList).toContain('vfc-disabled')

    await clickDay(wrapper, 7)

    expect(lastValue(wrapper).selectedDate).toBe('7/10/2026')
  })

  it('disables listed dates of a year-first dateFormat', () => {
    const { wrapper } = mountCalendar({
      ...pickerOptions,
      dateFormat: 'yyyy-mm-dd',
      disabledDates: ['2026-10-05', '2026-10-6']
    })

    expect(findDay(wrapper, 5).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 6).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 7).classList).not.toContain('vfc-disabled')
  })

  it('keeps the before and after today keywords next to padded dates', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 9))
    const { wrapper } = mountCalendar({
      ...pickerOptions,
      disabledDates: ['beforeToday', '20/10/2026']
    })

    expect(findDay(wrapper, 14).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 20).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 16).classList).not.toContain('vfc-disabled')
  })

  it('ignores a listed date that does not exist', () => {
    const { wrapper } = mountCalendar({
      ...pickerOptions,
      newCurrentDate: new Date(2026, 2, 1),
      disabledDates: ['31/02/2026']
    })

    expect(findDay(wrapper, 3).classList).not.toContain('vfc-disabled')
  })

  it('treats a padded disabled date as blocking a preset range', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 10))
    const { wrapper } = mountCalendar({
      isDateRange: true,
      presets: true,
      disabledDates: ['12/10/2026', '09/10/2026']
    })
    await wrapper.vm.$nextTick()

    const blocked = (start, end) =>
      wrapper.vm.isPresetBlocked({
        start: new Date(2026, 9, start),
        end: new Date(2026, 9, end)
      })

    expect(blocked(8, 10)).toBe(true)
    expect(blocked(11, 13)).toBe(true)
    expect(blocked(13, 15)).toBe(false)
  })
})

describe('blocked day classes', () => {
  const classesOf = (wrapper, day) => [...findDayAny(wrapper, day).classList]

  it('marks a disabled weekday as hidden and not allowed, but not disabled', () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      disabledDayNames: ['Mo']
    })

    expect(classesOf(wrapper, 5)).toEqual(
      expect.arrayContaining(['vfc-hide', 'vfc-cursor-not-allowed'])
    )
    expect(classesOf(wrapper, 5)).not.toContain('vfc-disabled')
  })

  it('marks a disabled date as disabled and not allowed', () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      disabledDates: ['6/10/2026']
    })

    expect(classesOf(wrapper, 6)).toEqual(
      expect.arrayContaining(['vfc-disabled', 'vfc-cursor-not-allowed'])
    )
    expect(classesOf(wrapper, 6)).not.toContain('vfc-hide')
  })

  it('marks a disabled date on a disabled weekday as disabled too', () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      disabledDayNames: ['Mo'],
      disabledDates: ['5/10/2026']
    })

    expect(classesOf(wrapper, 5)).toEqual(
      expect.arrayContaining([
        'vfc-hide',
        'vfc-disabled',
        'vfc-cursor-not-allowed'
      ])
    )
  })

  it('reports a disabled weekday as hidden in the dayClicked payload', async () => {
    const { wrapper, events } = mountCalendar({
      isDatePicker: true,
      disabledDayNames: ['Mo']
    })

    findDayAny(wrapper, 5).click()
    findDayAny(wrapper, 6).click()
    findDayAny(wrapper, 29).click()
    await wrapper.vm.$nextTick()

    expect(eventsNamed(events, 'dayClicked').map(day => day.hide)).toEqual([
      true,
      false,
      true
    ])
  })

  it('exposes the blocked state of a day through aria-disabled', () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      disabledDayNames: ['Mo'],
      disabledDates: ['6/10/2026'],
      limits: { min: '2/10/2026', max: '20/10/2026' }
    })

    const blocked = day =>
      findDayAny(wrapper, day).getAttribute('aria-disabled')
    expect(blocked(5)).toBe('true')
    expect(blocked(6)).toBe('true')
    expect(blocked(1)).toBe('true')
    expect(blocked(21)).toBe('true')
    expect(blocked(7)).toBe('false')
  })
})

describe('range clamps', () => {
  const minFive = { isDateRange: true, minSelDays: 5 }

  it('stops the minSelDays extension at the max limit', async () => {
    const { wrapper } = mountCalendar({
      ...minFive,
      limits: { min: '1/10/2026', max: '12/10/2026' }
    })

    await clickDays(wrapper, [10, 11])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '12/10/2026'
    })
  })

  it('stops the minSelDays extension at the min limit when chosen backwards', async () => {
    const { wrapper } = mountCalendar({
      ...minFive,
      limits: { min: '9/10/2026', max: '30/10/2026' }
    })

    await clickDays(wrapper, [12, 11])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '9/10/2026',
      end: '12/10/2026'
    })
  })

  it('stops the minSelDays extension before a disabled day', async () => {
    const { wrapper } = mountCalendar({
      ...minFive,
      disabledDates: ['13/10/2026']
    })

    await clickDays(wrapper, [10, 11])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '12/10/2026'
    })
  })

  it('stops the minSelDays extension before a disabled day name', async () => {
    const { wrapper } = mountCalendar({
      ...minFive,
      disabledDayNames: ['Mo']
    })

    await clickDays(wrapper, [10, 11])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '11/10/2026'
    })
  })

  it('keeps a range chosen across a disabled day when it already reaches minSelDays', async () => {
    const { wrapper } = mountCalendar({
      ...minFive,
      disabledDates: ['12/10/2026']
    })

    await clickDays(wrapper, [10, 15])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '15/10/2026'
    })
  })
})

describe('availability with a time picker range', () => {
  const options = { isDateRange: true, withTimePicker: true }

  it('ignores a click on a disabled date', async () => {
    const { wrapper } = mountCalendar({
      ...options,
      disabledDates: ['10/10/2026']
    })

    await clickDay(wrapper, 10)

    expect(wrapper.vm.calendar.dateRange.start).toBe('')
    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(false)
  })

  it('keeps a disabled date disabled after it is clicked twice', async () => {
    const { wrapper } = mountCalendar({
      ...options,
      disabledDates: ['10/10/2026']
    })

    await clickDays(wrapper, [10, 10])

    expect(wrapper.vm.calendar.dateRange.start).toBe('')
    expect(findDay(wrapper, 10).classList).toContain('vfc-disabled')
    expect(findDay(wrapper, 10).getAttribute('aria-disabled')).toBe('true')
  })

  it('emits dayClicked with the time suffix for a rejected click', async () => {
    const { wrapper, events } = mountCalendar({
      ...options,
      disabledDates: ['10/10/2026']
    })

    await clickDay(wrapper, 10)

    expect(eventsNamed(events, 'dayClicked')[0].date).toBe('10/10/2026 00:00')
  })

  it('accepts a click on an enabled date', async () => {
    const { wrapper } = mountCalendar({
      ...options,
      enabledDates: ['10/10/2026', '12/10/2026']
    })

    await clickDay(wrapper, 10)

    expect(wrapper.vm.calendar.dateRange.start).toBe('10/10/2026 00:00')
  })

  it('ignores a click on a date that is not enabled', async () => {
    const { wrapper } = mountCalendar({
      ...options,
      enabledDates: ['10/10/2026', '12/10/2026']
    })

    await clickDay(wrapper, 11)

    expect(wrapper.vm.calendar.dateRange.start).toBe('')
  })
})
