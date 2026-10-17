import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import {
  mountCalendar,
  calendarTitle,
  eventsNamed,
  clickDay,
  findDay,
  lastValue
} from './helpers.js'

const arrow = (wrapper, direction) =>
  wrapper.find(`.vfc-separately-navigation-buttons .vfc-arrow-${direction}`)

const pickerItems = wrapper =>
  wrapper.findAll('.vfc-months-container .vfc-item')

describe('arrow navigation', () => {
  it('goes to the next month and emits changedMonth', async () => {
    const { wrapper, events } = mountCalendar()

    await arrow(wrapper, 'right').trigger('click')

    expect(calendarTitle(wrapper)).toBe('November 2026')
    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 10, 1)])
  })

  it('goes to the previous month and emits changedMonth', async () => {
    const { wrapper, events } = mountCalendar()

    await arrow(wrapper, 'left').trigger('click')

    expect(calendarTitle(wrapper)).toBe('September 2026')
    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 8, 1)])
  })

  it('crosses the year boundary', async () => {
    const { wrapper } = mountCalendar({ newCurrentDate: new Date(2026, 11, 1) })

    await arrow(wrapper, 'right').trigger('click')

    expect(calendarTitle(wrapper)).toBe('January 2027')
  })

  it('moves by changeMonthStep months', async () => {
    const { wrapper, events } = mountCalendar({ changeMonthStep: 3 })

    await arrow(wrapper, 'right').trigger('click')

    expect(calendarTitle(wrapper)).toBe('January 2027')
    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2027, 0, 1)])
  })

  it('emits update:modelValue with the new currentDate', async () => {
    const { wrapper } = mountCalendar()

    await arrow(wrapper, 'right').trigger('click')

    const value = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(value.currentDate).toEqual(new Date(2026, 10, 1))
  })

  it('shows the selected day only in its own month', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })
    await clickDay(wrapper, 13)
    expect(lastValue(wrapper).selectedDate).toBe('13/10/2026')
    expect(findDay(wrapper, 13).classList).toContain('vfc-marked')

    await arrow(wrapper, 'right').trigger('click')
    expect(wrapper.findAll('.vfc-marked')).toHaveLength(0)

    await arrow(wrapper, 'left').trigger('click')
    expect(findDay(wrapper, 13).classList).toContain('vfc-marked')
  })
})

describe('changedYear on month arrows', () => {
  it('emits changedYear when NextMonth crosses into the next year', async () => {
    const { wrapper, events } = mountCalendar({
      newCurrentDate: new Date(2026, 11, 1)
    })

    await arrow(wrapper, 'right').trigger('click')

    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2027, 0, 1)])
    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2027, 0, 1)])
  })

  it('emits changedYear when PreMonth crosses into the previous year', async () => {
    const { wrapper, events } = mountCalendar({
      newCurrentDate: new Date(2026, 0, 1)
    })

    await arrow(wrapper, 'left').trigger('click')

    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2025, 11, 1)])
  })

  it('emits changedYear when a changeMonthStep move changes the year', async () => {
    const { wrapper, events } = mountCalendar({ changeMonthStep: 3 })

    await arrow(wrapper, 'right').trigger('click')

    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2027, 0, 1)])
  })

  it('emits no changedYear while the year stays the same', async () => {
    const { wrapper, events } = mountCalendar()

    await arrow(wrapper, 'right').trigger('click')
    await arrow(wrapper, 'left').trigger('click')

    expect(eventsNamed(events, 'changedYear')).toEqual([])
  })

  it('follows the first calendar when several calendars cross the year', async () => {
    const { wrapper, events } = mountCalendar({
      isMultiple: true,
      calendarsCount: 2,
      newCurrentDate: new Date(2026, 10, 1)
    })

    await arrow(wrapper, 'right').trigger('click')
    expect(eventsNamed(events, 'changedYear')).toEqual([])

    await arrow(wrapper, 'right').trigger('click')
    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2027, 0, 1)])
  })

  it('follows the moved calendar with isSeparately', async () => {
    const { wrapper, events } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 2,
      newCurrentDate: new Date(2026, 10, 1)
    })

    wrapper.vm.NextMonth(1)
    await nextTick()

    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2027, 0, 1)])
  })
})

describe('month picker', () => {
  it('opens from the month title when changeMonthFunction is set', () => {
    const { wrapper } = mountCalendar({ changeMonthFunction: true })

    wrapper.find('div.vfc-top-date span').element.click()

    expect(wrapper.vm.showMonthPicker).toBe(1)
  })

  it('does not open without changeMonthFunction', () => {
    const { wrapper } = mountCalendar()

    wrapper.find('div.vfc-top-date span').element.click()

    expect(wrapper.vm.showMonthPicker).toBe(false)
  })

  it('marks the clickable title with vfc-cursor-pointer and vfc-underline', () => {
    const { wrapper } = mountCalendar({
      changeMonthFunction: true,
      changeYearFunction: true
    })

    const [month, year] = wrapper.findAll('div.vfc-top-date span')
    expect(month.classes()).toEqual(
      expect.arrayContaining(['vfc-cursor-pointer', 'vfc-underline'])
    )
    expect(year.classes()).toEqual(
      expect.arrayContaining(['vfc-cursor-pointer', 'vfc-underline'])
    )
  })

  it('lists the twelve short month names and highlights the current one', async () => {
    const { wrapper } = mountCalendar({ changeMonthFunction: true })
    wrapper.vm.openMonthPicker(1)
    await nextTick()

    expect(pickerItems(wrapper).map(item => item.text())).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ])
    expect(
      pickerItems(wrapper)
        .filter(item => item.classes('vfc-selected'))
        .map(item => item.text())
    ).toEqual(['Oct'])
  })

  it('jumps to the picked month, closes the picker and emits changedMonth', async () => {
    const { wrapper, events } = mountCalendar({ changeMonthFunction: true })
    wrapper.vm.openMonthPicker(1)
    await nextTick()

    await pickerItems(wrapper)[2].trigger('click')

    expect(calendarTitle(wrapper)).toBe('March 2026')
    expect(wrapper.vm.showMonthPicker).toBe(false)
    expect(eventsNamed(events, 'changedMonth')).toHaveLength(1)
    expect(eventsNamed(events, 'changedMonth')[0].getMonth()).toBe(2)
  })

  it('changes the year from the picker arrows', async () => {
    const { wrapper, events } = mountCalendar({ changeMonthFunction: true })
    wrapper.vm.openMonthPicker(1)
    await nextTick()

    await wrapper
      .find('.vfc-months-container .vfc-arrow-right')
      .trigger('click')

    expect(calendarTitle(wrapper)).toBe('October 2027')
    expect(eventsNamed(events, 'changedYear')).toHaveLength(1)
  })

  it('closes when the page is clicked elsewhere', async () => {
    const { wrapper } = mountCalendar({ changeMonthFunction: true })
    wrapper.vm.openMonthPicker(1)
    await nextTick()

    document.body.click()
    await nextTick()
    await nextTick()

    expect(wrapper.vm.showMonthPicker).toBe(false)
  })

  it('stays open when the picker itself is clicked', async () => {
    const { wrapper } = mountCalendar({ changeMonthFunction: true })
    wrapper.vm.openMonthPicker(1)
    await nextTick()

    wrapper.find('.vfc-months-container .vfc-months').element.click()
    await nextTick()
    await nextTick()

    expect(wrapper.vm.showMonthPicker).toBe(1)
  })
})

describe('year picker', () => {
  it('opens from the year title when changeYearFunction is set', () => {
    const { wrapper } = mountCalendar({ changeYearFunction: true })

    wrapper.findAll('div.vfc-top-date span')[1].element.click()

    expect(wrapper.vm.showYearPicker).toBe(1)
  })

  it('does not open without changeYearFunction', () => {
    const { wrapper } = mountCalendar()

    wrapper.findAll('div.vfc-top-date span')[1].element.click()

    expect(wrapper.vm.showYearPicker).toBe(false)
  })

  it('lists twelve years around the current one', async () => {
    const { wrapper } = mountCalendar({ changeYearFunction: true })
    wrapper.vm.openYearPicker(1)
    await nextTick()

    const years = pickerItems(wrapper).map(item => item.text())
    expect(years).toHaveLength(12)
    expect(years[0]).toBe('2022')
    expect(years[11]).toBe('2033')
    expect(
      pickerItems(wrapper)
        .filter(item => item.classes('vfc-selected'))
        .map(item => item.text())
    ).toEqual(['2026'])
  })

  it('jumps to the picked year and emits changedYear', async () => {
    const { wrapper, events } = mountCalendar({ changeYearFunction: true })
    wrapper.vm.openYearPicker(1)
    await nextTick()

    await pickerItems(wrapper)
      .find(item => item.text() === '2030')
      .trigger('click')

    expect(calendarTitle(wrapper)).toBe('October 2030')
    expect(wrapper.vm.showYearPicker).toBe(false)
    expect(eventsNamed(events, 'changedYear')).toHaveLength(1)
    expect(eventsNamed(events, 'changedYear')[0].getFullYear()).toBe(2030)
  })

  it('pages the year list by changeYearStep', async () => {
    const { wrapper } = mountCalendar({
      changeYearFunction: true,
      changeYearStep: 5
    })
    wrapper.vm.openYearPicker(1)
    await nextTick()

    await wrapper
      .find('.vfc-months-container .vfc-arrow-right')
      .trigger('click')

    expect(pickerItems(wrapper)[0].text()).toBe('2027')
  })

  it('pages the year list back and resets on the year heading click', async () => {
    const { wrapper } = mountCalendar({ changeYearFunction: true })
    wrapper.vm.openYearPicker(1)
    await nextTick()

    await wrapper.find('.vfc-months-container .vfc-arrow-left').trigger('click')
    expect(pickerItems(wrapper)[0].text()).toBe('2019')

    await wrapper.find('.vfc-months-container h2').trigger('click')
    expect(pickerItems(wrapper)[0].text()).toBe('2022')
  })

  it('opens only one picker at a time', async () => {
    const { wrapper } = mountCalendar({
      changeMonthFunction: true,
      changeYearFunction: true
    })

    wrapper.vm.openMonthPicker(1)
    wrapper.vm.openYearPicker(1)

    expect(wrapper.vm.showMonthPicker).toBe(false)
    expect(wrapper.vm.showYearPicker).toBe(1)
  })
})

describe('ChooseDate', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves the calendar to a date in the dateFormat', async () => {
    const { wrapper } = mountCalendar()

    wrapper.vm.ChooseDate('15/12/2027')
    await nextTick()

    expect(calendarTitle(wrapper)).toBe('December 2027')
  })

  it('moves the calendar to today', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2028, 1, 10, 9))
    const { wrapper } = mountCalendar()

    wrapper.vm.ChooseDate('today')
    await nextTick()

    expect(calendarTitle(wrapper)).toBe('February 2028')
  })
})

const titles = wrapper =>
  wrapper
    .findAll('.vfc-calendar')
    .map((_, index) => calendarTitle(wrapper, index))

describe('programmatic month and year moves', () => {
  it('moves the year with NextYear and PreYear and emits changedYear only', async () => {
    const { wrapper, events } = mountCalendar()

    wrapper.vm.NextYear()
    await nextTick()
    expect(calendarTitle(wrapper)).toBe('October 2027')

    wrapper.vm.PreYear()
    wrapper.vm.PreYear()
    await nextTick()
    expect(calendarTitle(wrapper)).toBe('October 2025')

    expect(eventsNamed(events, 'changedYear')).toEqual([
      new Date(2027, 9, 1),
      new Date(2026, 9, 1),
      new Date(2025, 9, 1)
    ])
    expect(eventsNamed(events, 'changedMonth')).toEqual([])
  })

  it('moves one year at a time outside the year picker whatever changeYearStep is', async () => {
    const { wrapper } = mountCalendar({ changeYearStep: 5 })

    wrapper.vm.NextYear()
    await nextTick()

    expect(calendarTitle(wrapper)).toBe('October 2027')
  })

  it('moves every calendar together on a year move without isSeparately', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      calendarsCount: 2,
      newCurrentDate: new Date(2026, 11, 1)
    })

    wrapper.vm.NextYear()
    await nextTick()

    expect(titles(wrapper)).toEqual(['December 2027', 'January 2028'])
    expect(wrapper.vm.calendar.currentDate).toEqual(new Date(2027, 11, 1))
  })

  it('moves only one calendar and keeps currentDate with isSeparately', async () => {
    const { wrapper, events } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 2
    })

    wrapper.vm.NextYear(1)
    wrapper.vm.PreMonth(0)
    await nextTick()

    expect(titles(wrapper)).toEqual(['September 2026', 'November 2027'])
    expect(wrapper.vm.calendar.currentDate).toEqual(new Date(2026, 9, 1))
    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2027, 10, 1)])
    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 8, 1)])
  })

  it('emits changedMonth once per move and the new currentDate once', async () => {
    const { wrapper, events } = mountCalendar()
    await nextTick()
    const before = wrapper.emitted('update:modelValue').length

    wrapper.vm.NextMonth()
    await nextTick()

    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 10, 1)])
    expect(wrapper.emitted('update:modelValue')).toHaveLength(before + 1)
  })

  it('lays every calendar out from the first one on a non-separate move', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 3 })

    wrapper.vm.NextMonth()
    wrapper.vm.NextMonth()
    wrapper.vm.PreMonth()
    await nextTick()

    expect(titles(wrapper)).toEqual([
      'November 2026',
      'December 2026',
      'January 2027'
    ])
  })

  it('keeps the other calendars where they are on an isSeparately month move', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 3,
      changeMonthStep: 2
    })

    wrapper.vm.NextMonth(1)
    await nextTick()

    expect(titles(wrapper)).toEqual([
      'October 2026',
      'January 2027',
      'December 2026'
    ])
  })

  it('moves to a date with ChooseDate and lays out every calendar from it', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 3
    })

    wrapper.vm.NextMonth(2)
    wrapper.vm.ChooseDate('15/12/2026')
    await nextTick()

    expect(titles(wrapper)).toEqual([
      'December 2026',
      'January 2027',
      'February 2027'
    ])
    expect(wrapper.vm.calendar.currentDate).toEqual(new Date(2026, 11, 15))
  })

  it('moves a single calendar to a date outside the current year with ChooseDate', async () => {
    const { wrapper } = mountCalendar()

    wrapper.vm.ChooseDate('05/03/2025')
    await nextTick()

    expect(calendarTitle(wrapper)).toBe('March 2025')
    expect(wrapper.emitted('update:modelValue').at(-1)[0].currentDate).toEqual(
      new Date(2025, 2, 5)
    )
  })
})

describe('month and year pickers with several calendars', () => {
  it('moves only the picked calendar with isSeparately', async () => {
    const { wrapper, events } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 2
    })

    wrapper.vm.pickMonth(2, 1)
    await nextTick()
    expect(titles(wrapper)).toEqual(['October 2026', 'March 2026'])

    wrapper.vm.pickYear(2030, 0)
    await nextTick()
    expect(titles(wrapper)).toEqual(['October 2030', 'March 2026'])

    expect(eventsNamed(events, 'changedMonth')).toHaveLength(1)
    expect(eventsNamed(events, 'changedYear')).toHaveLength(1)
    expect(wrapper.vm.showMonthPicker).toBe(false)
    expect(wrapper.vm.showYearPicker).toBe(false)
  })

  it('moves every calendar to the picked month inside the same year', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 2 })

    wrapper.vm.pickMonth(2, 0)
    await nextTick()

    expect(titles(wrapper)).toEqual(['March 2026', 'April 2026'])
  })

  it('moves every calendar to the picked year inside the same month span', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 2 })

    wrapper.vm.pickYear(2030, 0)
    await nextTick()

    expect(titles(wrapper)).toEqual(['October 2030', 'November 2030'])
  })
})

describe('grid builds per navigation', () => {
  it.each([
    ['PreMonth', vm => vm.PreMonth()],
    ['NextMonth', vm => vm.NextMonth()],
    ['PreYear', vm => vm.PreYear()],
    ['NextYear', vm => vm.NextYear()],
    ['ChooseDate', vm => vm.ChooseDate('15/12/2027')],
    ['pickMonth', vm => vm.pickMonth(3, 0)],
    ['pickYear', vm => vm.pickYear(2030, 0)]
  ])('builds the grids once for %s', async (_, move) => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 2 })
    await nextTick()
    const build = vi.spyOn(wrapper.vm.helpCalendar, 'getFinalizedWeeks')

    move(wrapper.vm)
    await nextTick()

    expect(build).toHaveBeenCalledTimes(2)
  })

  it('builds the grids once for a keyboard move into another month', async () => {
    const { wrapper } = mountCalendar({ isMultiple: true, calendarsCount: 2 })
    await nextTick()
    const build = vi.spyOn(wrapper.vm.helpCalendar, 'getFinalizedWeeks')

    wrapper.vm.revealDate(new Date(2027, 2, 1), 0, 'changedMonth')
    await nextTick()

    expect(build).toHaveBeenCalledTimes(2)
  })

  it('builds the grids once for a move with isSeparately', async () => {
    const { wrapper } = mountCalendar({
      isMultiple: true,
      isSeparately: true,
      calendarsCount: 2
    })
    await nextTick()
    const build = vi.spyOn(wrapper.vm.helpCalendar, 'getFinalizedWeeks')

    wrapper.vm.NextMonth(1)
    await nextTick()

    expect(build).toHaveBeenCalledTimes(2)
  })
})
