import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  mountCalendar,
  clickDay,
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
    vi.useRealTimers()
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
