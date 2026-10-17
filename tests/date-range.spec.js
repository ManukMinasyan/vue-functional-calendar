import { describe, it, expect } from 'vitest'
import {
  mountCalendar,
  mountCalendarReady,
  clickDay,
  clickDays,
  findDay,
  eventsNamed,
  lastValue
} from './helpers.js'

const emptyModel = () => ({
  currentDate: new Date(2026, 9, 1),
  selectedDate: false,
  selectedDateTime: false,
  selectedHour: '00',
  selectedMinute: '00',
  selectedDatesItem: '',
  selectedDates: [],
  dateRange: { start: '', end: '' },
  multipleDateRange: []
})

describe('date range', () => {
  it('sets start on the first click and end on the second', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })

    await clickDay(wrapper, 10)
    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: ''
    })

    await clickDay(wrapper, 14)
    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '14/10/2026'
    })
  })

  it('swaps the dates when the second click is before the start', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })

    await clickDays(wrapper, [14, 10])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '14/10/2026'
    })
  })

  it('starts a new range on the third click', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })

    await clickDays(wrapper, [10, 14, 20])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '20/10/2026',
      end: ''
    })
  })

  it('emits selectedDaysCount only when both ends are set', async () => {
    const { wrapper, events } = mountCalendar({ isDateRange: true })

    await clickDay(wrapper, 10)
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([])

    await clickDay(wrapper, 14)
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([4])
  })

  it('counts the days across a month boundary', async () => {
    const { wrapper, events } = mountCalendar({
      isDateRange: true,
      isMultiple: true,
      calendarsCount: 2
    })

    await clickDay(wrapper, 28)
    await clickDay(wrapper, 3, 1)

    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([6])
    expect(lastValue(wrapper).dateRange).toEqual({
      start: '28/10/2026',
      end: '3/11/2026'
    })
  })

  it('extends a short range to minSelDays', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, minSelDays: 5 })

    await clickDays(wrapper, [10, 12])

    expect(lastValue(wrapper).dateRange.end).toBe('14/10/2026')
  })

  it('moves the start back to reach minSelDays when the range is chosen backwards', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, minSelDays: 5 })

    await clickDays(wrapper, [12, 10])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '8/10/2026',
      end: '12/10/2026'
    })
  })

  it('clamps a long range to maxSelDays', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, maxSelDays: 3 })

    await clickDays(wrapper, [10, 20])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '12/10/2026'
    })
  })

  it('marks the days between start and end', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })

    await clickDays(wrapper, [10, 14])

    expect(findDay(wrapper, 10).classList).toContain('vfc-start-marked')
    expect(findDay(wrapper, 14).classList).toContain('vfc-end-marked')
    ;[11, 12, 13].forEach(day => {
      expect(findDay(wrapper, day).classList).toContain('vfc-marked')
    })
    expect(findDay(wrapper, 15).classList).not.toContain('vfc-marked')
    expect(findDay(wrapper, 9).classList).not.toContain('vfc-marked')
  })

  it('emits dayMouseOver with the hovered date', async () => {
    const { wrapper, events } = mountCalendar({ isDateRange: true })

    findDay(wrapper, 12).dispatchEvent(
      new MouseEvent('mouseover', { bubbles: true })
    )

    expect(eventsNamed(events, 'dayMouseOver')).toEqual(['12/10/2026'])
  })

  it('previews the range between the start and the hovered day', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })
    await clickDay(wrapper, 10)

    findDay(wrapper, 14).dispatchEvent(
      new MouseEvent('mouseover', { bubbles: true })
    )
    await wrapper.vm.$nextTick()

    ;[11, 12, 13].forEach(day => {
      expect(findDay(wrapper, day).classList).toContain('vfc-marked')
    })
    expect(findDay(wrapper, 16).classList).not.toContain('vfc-marked')
  })

  it('shows a range passed through the model', async () => {
    const model = emptyModel()
    model.dateRange = { start: '10/10/2026', end: '13/10/2026' }
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      modelValue: model
    })

    expect(findDay(wrapper, 10).classList).toContain('vfc-start-marked')
    expect(findDay(wrapper, 13).classList).toContain('vfc-end-marked')
    expect(findDay(wrapper, 11).classList).toContain('vfc-marked')
  })
})

describe('clearing a range', () => {
  it('renders no clear button without canClearRange', () => {
    const { wrapper } = mountCalendar({ isDateRange: true })

    expect(wrapper.find('.rangeCleaner').exists()).toBe(false)
  })

  it('labels the clear button without a plural suffix for a single range', () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      canClearRange: true,
      isMultipleDateRange: false
    })

    expect(wrapper.find('.rangeCleaner span').text()).toBe('Clear Range')
  })

  it('labels the clear button without a suffix when isMultipleDateRange is unset', () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      canClearRange: true
    })

    expect(wrapper.find('.rangeCleaner span').text()).toBe('Clear Range')
  })

  it('labels the clear button with a plural suffix for multiple ranges', () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      canClearRange: true,
      isMultipleDateRange: true
    })

    expect(wrapper.find('.rangeCleaner span').text()).toBe('Clear Ranges')
  })

  it('shows the button as disabled until a range is selected', async () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      canClearRange: true
    })
    const button = wrapper.find('.rangeCleaner span')

    expect(button.classes()).toContain('disabled')

    await clickDays(wrapper, [10, 14])

    expect(button.classes()).toContain('active')
    expect(button.classes()).not.toContain('disabled')
  })

  it('clears start and end when the button is clicked', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      canClearRange: true,
      modelValue: model
    })
    await clickDays(wrapper, [10, 14])

    await wrapper.find('.rangeCleaner span').trigger('click')

    expect(model.dateRange).toEqual({ start: '', end: '' })
    expect(findDay(wrapper, 12).classList).not.toContain('vfc-marked')
  })
})
