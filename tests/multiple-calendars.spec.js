import { describe, it, expect } from 'vitest'
import { hUniqueID } from '../src/utils/helpers.js'
import {
  mountCalendar,
  clickDay,
  calendarTitle,
  eventsNamed,
  lastValue
} from './helpers.js'

const arrow = (wrapper, direction, calendarIndex) => {
  const scope =
    calendarIndex === undefined
      ? wrapper
      : wrapper.findAll('.vfc-calendar')[calendarIndex]
  return scope.find(
    `.vfc-separately-navigation-buttons .vfc-arrow-${direction}`
  )
}

const titles = wrapper =>
  wrapper
    .findAll('.vfc-calendar')
    .map((_, index) => calendarTitle(wrapper, index))

describe('multiple calendars', () => {
  it('renders calendarsCount consecutive months', () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 3 })

    expect(titles(wrapper)).toEqual([
      'October 2026',
      'November 2026',
      'December 2026'
    ])
  })

  it('renders a single calendar without isMultiple', () => {
    const { wrapper } = mountCalendar({ calendarsCount: 3 })

    expect(wrapper.findAll('.vfc-calendar')).toHaveLength(1)
  })

  it('rolls over to the next year', () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      calendarsCount: 3,
      newCurrentDate: new Date(2026, 11, 1)
    })

    expect(titles(wrapper)).toEqual([
      'December 2026',
      'January 2027',
      'February 2027'
    ])
  })

  it('selects a range that spans two calendars', async () => {
    const { wrapper, events } = mountCalendar({
      isDateRange: true,
      isMultiple: true,
      calendarsCount: 2
    })

    await clickDay(wrapper, 28)
    await clickDay(wrapper, 3, 1)

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '28/10/2026',
      end: '3/11/2026'
    })
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([6])
  })
})

describe('navigation without isSeparately', () => {
  it('renders one pair of arrows', () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 3 })

    expect(wrapper.findAll('.vfc-separately-navigation-buttons')).toHaveLength(
      1
    )
  })

  it('moves every calendar together', async () => {
    const { wrapper, events } = mountCalendar({
      isMultiple: true,
      calendarsCount: 3
    })

    await arrow(wrapper, 'right').trigger('click')

    expect(titles(wrapper)).toEqual([
      'November 2026',
      'December 2026',
      'January 2027'
    ])
    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 10, 1)])
  })

  it('moves back with the left arrow', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 3 })

    await arrow(wrapper, 'left').trigger('click')

    expect(titles(wrapper)).toEqual([
      'September 2026',
      'October 2026',
      'November 2026'
    ])
  })
})

describe('navigation with isSeparately', () => {
  const options = { isMultiple: true, isSeparately: true, calendarsCount: 3 }

  it('renders a pair of arrows per calendar', () => {
    const { wrapper } = mountCalendar(options)

    expect(wrapper.findAll('.vfc-separately-navigation-buttons')).toHaveLength(
      3
    )
  })

  it('moves only the calendar whose arrow was clicked', async () => {
    const { wrapper } = mountCalendar(options)

    await arrow(wrapper, 'right', 0).trigger('click')

    expect(titles(wrapper)).toEqual([
      'November 2026',
      'November 2026',
      'December 2026'
    ])
  })

  it('moves the last calendar back on its own', async () => {
    const { wrapper } = mountCalendar(options)

    await arrow(wrapper, 'left', 2).trigger('click')

    expect(titles(wrapper)).toEqual([
      'October 2026',
      'November 2026',
      'November 2026'
    ])
  })

  it('lets every calendar open its own month picker', () => {
    const { wrapper } = mountCalendar({ ...options, changeMonthFunction: true })

    wrapper
      .findAll('.vfc-calendar')[1]
      .find('div.vfc-top-date span')
      .element.click()

    expect(wrapper.vm.showMonthPicker).toBe(2)
  })
})

describe('month picker without isSeparately', () => {
  it('only opens from the first calendar title', () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      calendarsCount: 2,
      changeMonthFunction: true
    })
    const [first, second] = wrapper
      .findAll('.vfc-calendar')
      .map(calendar => calendar.find('div.vfc-top-date span').element)

    second.click()
    expect(wrapper.vm.showMonthPicker).toBe(false)

    first.click()
    expect(wrapper.vm.showMonthPicker).toBe(1)
  })
})

describe('unique ids', () => {
  it('never repeats within the same millisecond', () => {
    const ids = Array.from({ length: 1000 }, () => hUniqueID())

    expect(new Set(ids).size).toBe(1000)
  })
})
