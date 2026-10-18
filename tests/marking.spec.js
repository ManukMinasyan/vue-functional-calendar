import { describe, it, expect, vi } from 'vitest'
import {
  mountCalendar,
  findDay,
  findDayAny,
  clickDay,
  lastValue
} from './helpers.js'

const classesOf = (wrapper, day) => [...findDay(wrapper, day).classList]
const classesOfAny = (wrapper, day) => [...findDayAny(wrapper, day).classList]

describe('markedDates', () => {
  it('marks and outlines listed dates', () => {
    const { wrapper } = mountCalendar({
      markedDates: ['5/10/2026', '9/10/2026']
    })

    expect(classesOf(wrapper, 5)).toEqual(
      expect.arrayContaining(['vfc-marked', 'vfc-borderd'])
    )
    expect(classesOf(wrapper, 9)).toContain('vfc-marked')
    expect(classesOf(wrapper, 6)).not.toContain('vfc-marked')
  })

  it('adds the custom class of an object entry', () => {
    const { wrapper } = mountCalendar({
      markedDates: [
        { date: '6/10/2026', class: 'holiday' },
        { date: '7/10/2026', class: 'birthday' }
      ]
    })

    expect(classesOf(wrapper, 6)).toContain('holiday')
    expect(classesOf(wrapper, 7)).toContain('birthday')
    expect(classesOf(wrapper, 8)).not.toContain('holiday')
  })

  it('keeps an object entry a class only, without the marked look', () => {
    const { wrapper } = mountCalendar({
      markedDates: [{ date: '6/10/2026', class: 'holiday' }, '8/10/2026']
    })

    expect(classesOf(wrapper, 6)).not.toContain('vfc-marked')
    expect(classesOf(wrapper, 6)).not.toContain('vfc-borderd')
    expect(classesOf(wrapper, 8)).toEqual(
      expect.arrayContaining(['vfc-marked', 'vfc-borderd'])
    )
  })

  it('uses the class of the first entry when a date is listed twice', () => {
    const { wrapper } = mountCalendar({
      markedDates: [
        { date: '6/10/2026', class: 'first' },
        { date: '6/10/2026', class: 'second' }
      ]
    })

    expect(classesOf(wrapper, 6)).toContain('first')
    expect(classesOf(wrapper, 6)).not.toContain('second')
  })

  it('outlines listed dates in a multiple date range calendar', () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      isMultipleDateRange: true,
      markedDates: ['5/10/2026']
    })

    expect(classesOf(wrapper, 5)).toContain('vfc-borderd')
    expect(classesOf(wrapper, 6)).not.toContain('vfc-borderd')
  })

  it('leaves a listed date on a disabled weekday unmarked', () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      disabledDayNames: ['Mo'],
      markedDates: ['5/10/2026', '6/10/2026']
    })

    expect(classesOfAny(wrapper, 5)).not.toContain('vfc-marked')
    expect(classesOfAny(wrapper, 5)).not.toContain('vfc-borderd')
    expect(classesOf(wrapper, 6)).toContain('vfc-marked')
  })

  it('formats listed dates with the dateFormat', () => {
    const { wrapper } = mountCalendar({
      dateFormat: 'yyyy-mm-dd',
      markedDates: ['2026-10-5']
    })

    expect(classesOf(wrapper, 5)).toContain('vfc-marked')
  })

  it('keeps marked dates marked next to a picked date', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      markedDates: ['5/10/2026']
    })

    await clickDay(wrapper, 7)

    expect(lastValue(wrapper).selectedDate).toBe('7/10/2026')
    expect(classesOf(wrapper, 7)).toContain('vfc-marked')
    expect(classesOf(wrapper, 5)).toContain('vfc-marked')
    expect(classesOf(wrapper, 5)).toContain('vfc-borderd')
  })
})

describe('markedDateRange', () => {
  it('marks every day of a start and end range', () => {
    const { wrapper } = mountCalendar({
      markedDateRange: { start: '5/10/2026', end: '8/10/2026' }
    })

    ;[5, 6, 7, 8].forEach(day => {
      expect(classesOf(wrapper, day)).toContain('vfc-marked')
    })
    expect(classesOf(wrapper, 5)).toContain('vfc-start-marked')
    expect(classesOf(wrapper, 8)).toContain('vfc-end-marked')
    expect(classesOf(wrapper, 4)).not.toContain('vfc-marked')
    expect(classesOf(wrapper, 9)).not.toContain('vfc-marked')
  })

  it('marks several ranges given as an array', () => {
    const { wrapper } = mountCalendar({
      markedDateRange: [
        { start: '2/10/2026', end: '3/10/2026' },
        { start: '20/10/2026', end: '22/10/2026' }
      ]
    })

    expect(classesOf(wrapper, 2)).toContain('vfc-start-marked')
    expect(classesOf(wrapper, 3)).toContain('vfc-end-marked')
    expect(classesOf(wrapper, 21)).toContain('vfc-marked')
    expect(classesOf(wrapper, 22)).toContain('vfc-end-marked')
    expect(classesOf(wrapper, 10)).not.toContain('vfc-marked')
  })

  it('marks everything from the start when only start is given', () => {
    const { wrapper } = mountCalendar({
      markedDateRange: { start: '20/10/2026' }
    })

    expect(classesOf(wrapper, 19)).not.toContain('vfc-marked')
    expect(classesOf(wrapper, 20)).toContain('vfc-marked')
    expect(classesOf(wrapper, 28)).toContain('vfc-marked')
  })

  it('marks everything up to the end when only end is given', () => {
    const { wrapper } = mountCalendar({
      markedDateRange: { end: '5/10/2026' }
    })

    expect(classesOf(wrapper, 5)).toContain('vfc-marked')
    expect(classesOf(wrapper, 2)).toContain('vfc-marked')
    expect(classesOf(wrapper, 6)).not.toContain('vfc-marked')
  })
})

describe('marking work per click', () => {
  it.each([
    ['date picker', { isDatePicker: true }],
    ['date range', { isDateRange: true }],
    ['multiple date range', { isDateRange: true, isMultipleDateRange: true }],
    ['multiple date picker', { isMultipleDatePicker: true }]
  ])('recomputes the marks once for a %s click', async (_, props) => {
    const { wrapper } = mountCalendar(props)
    const markChooseDays = vi.spyOn(wrapper.vm, 'markChooseDays')

    await clickDay(wrapper, 10)

    expect(markChooseDays).toHaveBeenCalledTimes(1)
  })

  it('recomputes the marks once when a typed date joins the multiple date picker', async () => {
    const { wrapper } = mountCalendar({
      isMultipleDatePicker: true,
      isTypeable: true
    })
    const markChooseDays = vi.spyOn(wrapper.vm, 'markChooseDays')

    wrapper.vm.calendar.selectedDatesItem = '12/10/2026'
    wrapper.vm.addToSelectedDates()
    await wrapper.vm.$nextTick()

    expect(markChooseDays).toHaveBeenCalledTimes(1)
    expect(findDay(wrapper, 12).classList).toContain('vfc-marked')
  })

  it('recomputes the marks once when a picked date is removed from the list', async () => {
    const { wrapper } = mountCalendar({ isMultipleDatePicker: true })
    await clickDay(wrapper, 12)
    const markChooseDays = vi.spyOn(wrapper.vm, 'markChooseDays')

    wrapper.vm.removeFromSelectedDates(0)
    await wrapper.vm.$nextTick()

    expect(markChooseDays).toHaveBeenCalledTimes(1)
    expect(findDay(wrapper, 12).classList).not.toContain('vfc-marked')
  })

  it('marks the clicked day as soon as the click is handled', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })

    findDay(wrapper, 10).click()
    await wrapper.vm.$nextTick()

    expect(findDay(wrapper, 10).classList).toContain('vfc-marked')
  })
})
