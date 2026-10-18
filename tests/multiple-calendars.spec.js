import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { hUniqueID } from '../src/utils/helpers.js'
import {
  mountCalendar,
  clickDay,
  calendarTitle,
  eventsNamed,
  lastValue,
  mountParent
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

describe('pickers without isSeparately', () => {
  const december = {
    isMultiple: true,
    calendarsCount: 2,
    newCurrentDate: new Date(2026, 11, 1)
  }

  it('keeps the calendars consecutive when a month is picked across a year boundary', async () => {
    const { wrapper } = mountCalendar(december)

    wrapper.vm.pickMonth(2, 0)
    await nextTick()

    expect(titles(wrapper)).toEqual(['March 2026', 'April 2026'])
  })

  it('keeps the calendars consecutive when a year is picked', async () => {
    const { wrapper } = mountCalendar(december)

    wrapper.vm.pickYear(2030, 0)
    await nextTick()

    expect(titles(wrapper)).toEqual(['December 2030', 'January 2031'])
  })

  it('moves currentDate and emits the model when a month is picked', async () => {
    const { wrapper } = mountCalendar(december)

    wrapper.vm.pickMonth(2, 0)
    await nextTick()

    expect(wrapper.vm.calendar.currentDate).toEqual(new Date(2026, 2, 1))
    expect(lastValue(wrapper).currentDate).toBe(
      new Date(2026, 2, 1).toISOString()
    )
  })

  it('moves currentDate when a year is picked and emits changedYear once', async () => {
    const { wrapper, events } = mountCalendar(december)

    wrapper.vm.pickYear(2030, 0)
    await nextTick()

    expect(wrapper.vm.calendar.currentDate).toEqual(new Date(2030, 11, 1))
    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2030, 11, 1)])
  })
})

describe('unique ids', () => {
  it('keeps grid keys distinct after back and forward', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 2
    })

    wrapper.vm.PreMonth(0)
    wrapper.vm.PreMonth(1)
    wrapper.vm.NextMonth(1)
    wrapper.vm.NextMonth(0)
    await nextTick()

    expect(new Set(wrapper.vm.listCalendars.map(c => c.key)).size).toBe(2)
  })

  it('changes a grid key on every navigation', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 2 })
    const keys = []

    keys.push(wrapper.vm.listCalendars[0].key)
    wrapper.vm.NextMonth()
    await nextTick()
    keys.push(wrapper.vm.listCalendars[0].key)
    wrapper.vm.PreMonth()
    await nextTick()
    keys.push(wrapper.vm.listCalendars[0].key)

    expect(new Set(keys).size).toBe(3)
  })

  it('never repeats within the same millisecond', () => {
    const ids = Array.from({ length: 1000 }, () => hUniqueID())

    expect(new Set(ids).size).toBe(1000)
  })
})

describe('calendarsCount that changes after mount', () => {
  it('shows fewer calendars when calendarsCount drops', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 3 })

    await wrapper.setProps({ calendarsCount: 1 })

    expect(titles(wrapper)).toEqual(['October 2026'])
  })

  it('shows more calendars when calendarsCount grows', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 1 })

    await wrapper.setProps({ calendarsCount: 3 })

    expect(titles(wrapper)).toEqual([
      'October 2026',
      'November 2026',
      'December 2026'
    ])
  })

  it('keeps the first month when calendarsCount changes after navigating', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 2 })
    await arrow(wrapper, 'right').trigger('click')

    await wrapper.setProps({ calendarsCount: 3 })

    expect(titles(wrapper)).toEqual([
      'November 2026',
      'December 2026',
      'January 2027'
    ])
  })

  it('follows a calendarsCount that changes inside configs', async () => {
    const { wrapper, state } = mountParent({
      configs: { isMultiple: true, calendarsCount: 2 }
    })

    state.configs.calendarsCount = 3
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.vfc-calendar')).toHaveLength(3)
  })
})
