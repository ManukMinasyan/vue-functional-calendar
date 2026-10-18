import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { nextTick, reactive } from 'vue'
import {
  mountCalendar,
  mountCalendarReady,
  clickDay,
  clickDays,
  findDay,
  hoverDay,
  previewState,
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

describe('date range selection rules', () => {
  it('selects a single day range when the same day is clicked twice', async () => {
    const { wrapper, events } = mountCalendar({ isDateRange: true })

    await clickDays(wrapper, [10, 10])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '10/10/2026'
    })
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([0])
  })

  it('extends a single day range to minSelDays', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, minSelDays: 3 })

    await clickDays(wrapper, [10, 10])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '12/10/2026'
    })
  })

  it('keeps a range that already reaches minSelDays', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, minSelDays: 3 })

    await clickDays(wrapper, [10, 12])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '12/10/2026'
    })
  })

  it('emits the selected days count before the minSelDays extension', async () => {
    const { wrapper, events } = mountCalendar({
      isDateRange: true,
      minSelDays: 5
    })

    await clickDays(wrapper, [10, 12])

    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([2])
  })

  it('keeps a range that stays within maxSelDays', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, maxSelDays: 3 })

    await clickDays(wrapper, [10, 12])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '12/10/2026'
    })
  })

  it('moves the start forward to maxSelDays when the range is chosen backwards', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, maxSelDays: 3 })

    await clickDays(wrapper, [20, 10])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '18/10/2026',
      end: '20/10/2026'
    })
  })

  it('starts a new range after a clamped range', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, maxSelDays: 3 })

    await clickDays(wrapper, [10, 20, 25])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '25/10/2026',
      end: ''
    })
  })
})

describe('date range with a time picker', () => {
  const options = { isDateRange: true, withTimePicker: true }

  const clickWithTime = async (wrapper, days) => {
    for (const day of days) {
      await clickDay(wrapper, day)
      await wrapper.find('.vfc-close').trigger('click')
    }
  }

  it('appends a time to both ends', async () => {
    const { wrapper } = mountCalendar(options)

    await clickWithTime(wrapper, [10, 14])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026 00:00',
      end: '14/10/2026 00:00'
    })
  })

  it('swaps the dates with their times when the second click is before the start', async () => {
    const { wrapper } = mountCalendar(options)

    await clickWithTime(wrapper, [14, 10])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026 00:00',
      end: '14/10/2026 00:00'
    })
  })

  it('starts a new range with a time on the third click', async () => {
    const { wrapper } = mountCalendar(options)

    await clickWithTime(wrapper, [10, 14, 20])

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '20/10/2026 00:00',
      end: ''
    })
  })

  it('keeps the edited start time when the end is chosen', async () => {
    const { wrapper } = mountCalendar(options)
    await clickDay(wrapper, 10)
    await wrapper
      .findAll('.vfc-time-picker__list--hours .vfc-time-picker__item')
      .find(item => item.text() === '05')
      .trigger('click')
    await wrapper.find('.vfc-close').trigger('click')

    await clickDay(wrapper, 14)

    expect(wrapper.vm.calendar.dateRange).toEqual({
      start: '10/10/2026 05:00',
      end: '14/10/2026 00:00'
    })
  })

  it('counts the days of a range chosen backwards', async () => {
    const { wrapper, events } = mountCalendar(options)

    await clickWithTime(wrapper, [14, 10])

    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([4])
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

const previewSpan = (first, last, flags = 'marked') =>
  Object.fromEntries(
    Array.from({ length: last - first + 1 }, (_, index) => [
      `${first + index}/10/2026`,
      flags
    ])
  )

describe('date range model with leading zeros', () => {
  it('marks the start, the end and the days between', async () => {
    const model = emptyModel()
    model.dateRange = { start: '08/10/2026', end: '12/10/2026' }
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      modelValue: model
    })

    expect(findDay(wrapper, 8).classList).toContain('vfc-start-marked')
    expect(findDay(wrapper, 8).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 12).classList).toContain('vfc-end-marked')
    expect(findDay(wrapper, 10).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 13).classList).not.toContain('vfc-marked')
  })

  it('previews from a start written with a leading zero', async () => {
    const model = emptyModel()
    model.dateRange = { start: '08/10/2026', end: '' }
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      modelValue: model
    })

    await hoverDay(wrapper, 11)

    expect(previewState(wrapper)).toEqual({
      '8/10/2026': 'marked left',
      '9/10/2026': 'marked',
      '10/10/2026': 'marked',
      '11/10/2026': 'right'
    })
  })
})

describe('date range model edited in place', () => {
  it.each(['start', 'end'])('treats a %s set to null as empty', async side => {
    const model = reactive(emptyModel())
    model.dateRange = { start: '08/10/2026', end: '12/10/2026' }
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      modelValue: model
    })

    model.dateRange[side] = null

    expect(wrapper.vm[`${side}DMY`]).toBe('')
    await nextTick()
    expect(wrapper.vm[`${side}DMY`]).toBe('')
  })
})

describe('range hover preview', () => {
  it('previews a range to the right of the start', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 14)

    expect(previewState(wrapper)).toEqual({
      ...previewSpan(10, 14),
      '10/10/2026': 'marked left',
      '14/10/2026': 'right'
    })
  })

  it('previews a range to the left of the start', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 6)

    expect(previewState(wrapper)).toEqual({
      ...previewSpan(6, 10),
      '6/10/2026': 'left',
      '10/10/2026': 'marked right'
    })
  })

  it('previews nothing but the start when the hovered day is the start', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 10)

    expect(previewState(wrapper)).toEqual({ '10/10/2026': 'marked' })
  })

  it('replaces the previous preview on every hover', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 20)
    await hoverDay(wrapper, 12)

    expect(previewState(wrapper)).toEqual({
      '10/10/2026': 'marked left',
      '11/10/2026': 'marked',
      '12/10/2026': 'right'
    })
  })

  it('leaves a finished range as it is', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true })
    await clickDays(wrapper, [10, 14])
    const before = previewState(wrapper)

    await hoverDay(wrapper, 20)

    expect(previewState(wrapper)).toEqual(before)
    expect(before).toEqual({
      ...previewSpan(10, 14),
      '10/10/2026': 'marked left',
      '14/10/2026': 'marked right'
    })
  })

  it('paints no preview while only an end is set', async () => {
    const model = emptyModel()
    model.dateRange = { start: '', end: '10/10/2026' }
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      modelValue: model
    })

    await hoverDay(wrapper, 14)

    expect(previewState(wrapper)).toEqual({ '10/10/2026': 'right' })
  })

  it('previews a range that carries a time on its start', async () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      withTimePicker: true
    })
    await clickDay(wrapper, 10)

    wrapper.vm.dayMouseOver('14/10/2026')

    expect(previewState(wrapper)).toEqual({
      ...previewSpan(10, 14),
      '10/10/2026': 'marked left',
      '14/10/2026': 'right'
    })
  })

  it('previews a range across two calendars', async () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      isMultiple: true,
      calendarsCount: 2
    })
    await clickDay(wrapper, 28)

    await hoverDay(wrapper, 5, 1)

    expect(previewState(wrapper)).toEqual({
      '28/10/2026': 'marked left',
      '29/10/2026': 'marked',
      '30/10/2026': 'marked',
      '31/10/2026': 'marked',
      '1/11/2026': 'marked',
      '2/11/2026': 'marked',
      '3/11/2026': 'marked',
      '4/11/2026': 'marked',
      '5/11/2026': 'right'
    })
  })

  it('does not mark a disabled weekday inside the preview', async () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      disabledDayNames: ['Tu']
    })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 16)

    expect(previewState(wrapper)).toEqual({
      '10/10/2026': 'marked left',
      '11/10/2026': 'marked',
      '12/10/2026': 'marked',
      '14/10/2026': 'marked',
      '15/10/2026': 'marked',
      '16/10/2026': 'right'
    })
  })

  it('keeps listed marked dates marked outside the preview', async () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      markedDates: ['3/10/2026', '20/10/2026', '12/10/2026']
    })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 14)

    expect(previewState(wrapper)).toEqual({
      ...previewSpan(10, 14),
      '3/10/2026': 'marked',
      '10/10/2026': 'marked left',
      '14/10/2026': 'right',
      '20/10/2026': 'marked'
    })
  })

  it('ignores a hover outside the limits', async () => {
    const { wrapper } = mountCalendar({
      isDateRange: true,
      limits: { min: '5/10/2026', max: '20/10/2026' }
    })
    await clickDay(wrapper, 10)
    await hoverDay(wrapper, 14)
    const before = previewState(wrapper)

    await hoverDay(wrapper, 25)
    await hoverDay(wrapper, 2)

    expect(previewState(wrapper)).toEqual(before)
  })

  it('emits dayMouseOver for a hover outside the limits', async () => {
    const { wrapper, events } = mountCalendar({
      isDateRange: true,
      limits: { min: '5/10/2026', max: '20/10/2026' }
    })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 25)

    expect(eventsNamed(events, 'dayMouseOver')).toEqual(['25/10/2026'])
  })
})

describe('range hover preview with minSelDays and maxSelDays', () => {
  it('shows the minimum length to the right with the far end hovered', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, minSelDays: 3 })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 11)

    expect(previewState(wrapper)).toEqual({
      '10/10/2026': 'marked left',
      '11/10/2026': 'marked right',
      '12/10/2026': 'hovered right'
    })
  })

  it('shows the minimum length to the left with the far end hovered', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, minSelDays: 3 })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 8)

    expect(previewState(wrapper)).toEqual({
      '8/10/2026': 'hovered left',
      '9/10/2026': 'marked',
      '10/10/2026': 'marked right'
    })
  })

  it('shows the hovered day when it already reaches the minimum', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, minSelDays: 3 })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 14)

    expect(previewState(wrapper)).toEqual({
      ...previewSpan(10, 14),
      '10/10/2026': 'marked left',
      '14/10/2026': 'right'
    })
  })

  it('cuts the preview at the maximum length to the right', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, maxSelDays: 4 })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 20)

    expect(previewState(wrapper)).toEqual({
      '10/10/2026': 'marked left',
      '11/10/2026': 'marked',
      '12/10/2026': 'marked',
      '13/10/2026': 'hovered right'
    })
  })

  it('cuts the preview at the maximum length to the left', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, maxSelDays: 4 })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 2)

    expect(previewState(wrapper)).toEqual({
      '7/10/2026': 'hovered left',
      '8/10/2026': 'marked',
      '9/10/2026': 'marked',
      '10/10/2026': 'marked right'
    })
  })

  it('shows the hovered day when it is inside the maximum', async () => {
    const { wrapper } = mountCalendar({ isDateRange: true, maxSelDays: 4 })
    await clickDay(wrapper, 10)

    await hoverDay(wrapper, 12)

    expect(previewState(wrapper)).toEqual({
      '10/10/2026': 'marked left',
      '11/10/2026': 'marked',
      '12/10/2026': 'right'
    })
  })
})

describe('range hover preview across a daylight saving change', () => {
  const originalTimeZone = process.env.TZ

  beforeAll(() => {
    process.env.TZ = 'America/New_York'
  })

  afterAll(() => {
    if (originalTimeZone === undefined) {
      delete process.env.TZ
    } else {
      process.env.TZ = originalTimeZone
    }
  })

  const mountMarch = () =>
    mountCalendar({
      isDateRange: true,
      minSelDays: 5,
      newCurrentDate: new Date(2026, 2, 1)
    })

  it('runs in a time zone that changes its clocks on 8 March 2026', () => {
    expect(new Date(2026, 2, 7, 12).getTimezoneOffset()).toBe(300)
    expect(new Date(2026, 2, 9, 12).getTimezoneOffset()).toBe(240)
  })

  it('previews the minimum length that the second click commits', async () => {
    const preview = mountMarch()
    await clickDay(preview.wrapper, 5)
    await hoverDay(preview.wrapper, 6)

    const committed = mountMarch()
    await clickDays(committed.wrapper, [5, 6])

    expect(previewState(preview.wrapper)).toEqual({
      '5/3/2026': 'marked left',
      '6/3/2026': 'marked right',
      '7/3/2026': 'marked',
      '8/3/2026': 'marked',
      '9/3/2026': 'hovered right'
    })
    expect(lastValue(committed.wrapper).dateRange).toEqual({
      start: '5/3/2026',
      end: '9/3/2026'
    })
  })

  it('previews the minimum length to the left across the change', async () => {
    const { wrapper } = mountMarch()
    await clickDay(wrapper, 12)

    await hoverDay(wrapper, 11)

    expect(previewState(wrapper)).toEqual({
      '8/3/2026': 'hovered left',
      '9/3/2026': 'marked',
      '10/3/2026': 'marked',
      '11/3/2026': 'marked left',
      '12/3/2026': 'marked right'
    })
  })
})
