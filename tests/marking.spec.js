import { describe, it, expect } from 'vitest'
import { mountCalendar, findDay, clickDay, lastValue } from './helpers.js'

const classesOf = (wrapper, day) => [...findDay(wrapper, day).classList]

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
