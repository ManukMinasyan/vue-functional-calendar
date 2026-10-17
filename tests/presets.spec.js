import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import FunctionalCalendar from '../index.js'
import {
  mountCalendarReady,
  clickDays,
  eventsNamed,
  lastValue,
  calendarTitle
} from './helpers.js'

const withPlugin = options => ({
  global: { plugins: [[FunctionalCalendar, options]] }
})

const setToday = (...args) => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(...args))
}

const presetButtons = wrapper => wrapper.findAll('.vfc-preset')

const presetButton = (wrapper, label) =>
  presetButtons(wrapper).find(button => button.text() === label)

const choose = async (wrapper, label) => {
  await presetButton(wrapper, label).trigger('click')
  await nextTick()
}

const isHidden = wrapper =>
  wrapper.find('.vfc-main-container').element.style.display === 'none'

afterEach(() => {
  vi.useRealTimers()
})

describe('built-in presets', () => {
  const cases = [
    ['Today', '15/10/2026', '15/10/2026'],
    ['Yesterday', '14/10/2026', '14/10/2026'],
    ['Last 7 days', '9/10/2026', '15/10/2026'],
    ['Last 30 days', '16/9/2026', '15/10/2026'],
    ['This month', '1/10/2026', '31/10/2026'],
    ['Last month', '1/9/2026', '30/9/2026']
  ]

  it.each(cases)('%s selects %s to %s', async (label, start, end) => {
    setToday(2026, 9, 15, 10, 30)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, label)

    expect(lastValue(wrapper).dateRange).toEqual({ start, end })
  })

  it('renders the six built-ins in order for presets: true', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Today',
      'Yesterday',
      'Last 7 days',
      'Last 30 days',
      'This month',
      'Last month'
    ])
  })

  it('gives the December before when the clock is in January', async () => {
    setToday(2026, 0, 10, 12)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, 'Last month')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '1/12/2025',
      end: '31/12/2025'
    })
    expect(calendarTitle(wrapper)).toBe('December 2025')
  })

  it('counts last 30 days back across a year boundary', async () => {
    setToday(2026, 0, 10, 12)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, 'Last 30 days')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '12/12/2025',
      end: '10/1/2026'
    })
  })

  it('ends the last month on the 29th in a leap year', async () => {
    setToday(2028, 2, 5, 12)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, 'Last month')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '1/2/2028',
      end: '29/2/2028'
    })
  })
})

describe('selection matches clicking the same range', () => {
  const clickedAndPicked = async (props, clicks, label, prepare) => {
    setToday(2026, 9, 15, 10)
    const clicked = await mountCalendarReady(props)
    const picked = await mountCalendarReady(props)
    if (prepare) {
      await prepare(clicked.wrapper)
      await prepare(picked.wrapper)
    }
    await clickDays(clicked.wrapper, clicks)
    await choose(picked.wrapper, label)
    return { clicked, picked }
  }

  it('gives the same value and day count for a range', async () => {
    const { clicked, picked } = await clickedAndPicked(
      { isDateRange: true, presets: true },
      [9, 15],
      'Last 7 days'
    )

    expect(lastValue(picked.wrapper)).toEqual(lastValue(clicked.wrapper))
    expect(eventsNamed(picked.events, 'selectedDaysCount')).toEqual(
      eventsNamed(clicked.events, 'selectedDaysCount')
    )
    expect(eventsNamed(picked.events, 'selectedDaysCount')).toEqual([6])
  })

  it('gives the same value for a single-day range', async () => {
    const { clicked, picked } = await clickedAndPicked(
      { isDateRange: true, presets: true },
      [15, 15],
      'Today'
    )

    expect(lastValue(picked.wrapper)).toEqual(lastValue(clicked.wrapper))
    expect(eventsNamed(picked.events, 'selectedDaysCount')).toEqual(
      eventsNamed(clicked.events, 'selectedDaysCount')
    )
  })

  it('formats with a custom dateFormat', async () => {
    const { clicked, picked } = await clickedAndPicked(
      { isDateRange: true, presets: true, dateFormat: 'yyyy-mm-dd' },
      [9, 15],
      'Last 7 days'
    )

    expect(lastValue(picked.wrapper)).toEqual(lastValue(clicked.wrapper))
    expect(lastValue(picked.wrapper).dateRange).toEqual({
      start: '2026-10-9',
      end: '2026-10-15'
    })
  })

  it('appends a range to existing ranges with isMultipleDateRange', async () => {
    const { clicked, picked } = await clickedAndPicked(
      { isDateRange: true, isMultipleDateRange: true, presets: true },
      [9, 15],
      'Last 7 days',
      wrapper => clickDays(wrapper, [1, 3])
    )

    expect(lastValue(picked.wrapper)).toEqual(lastValue(clicked.wrapper))
    expect(lastValue(picked.wrapper).multipleDateRange).toEqual([
      { start: '1/10/2026', end: '3/10/2026' },
      { start: '9/10/2026', end: '15/10/2026' }
    ])
    expect(eventsNamed(picked.events, 'selectedDaysCount')).toEqual(
      eventsNamed(clicked.events, 'selectedDaysCount')
    )
  })

  it('appends the first range with isMultipleDateRange', async () => {
    const { clicked, picked } = await clickedAndPicked(
      { isDateRange: true, isMultipleDateRange: true, presets: true },
      [9, 15],
      'Last 7 days'
    )

    expect(lastValue(picked.wrapper)).toEqual(lastValue(clicked.wrapper))
  })

  it('gives the same value for a date picker', async () => {
    const { clicked, picked } = await clickedAndPicked(
      { isDatePicker: true, presets: ['today'] },
      [15],
      'Today'
    )

    expect(lastValue(picked.wrapper)).toEqual(lastValue(clicked.wrapper))
    expect(lastValue(picked.wrapper).selectedDate).toBe('15/10/2026')
  })

  it('appends the time suffix like clicking with withTimePicker', async () => {
    setToday(2026, 9, 15, 10)
    const props = { isDateRange: true, withTimePicker: true, presets: true }
    const clicked = await mountCalendarReady(props)
    const picked = await mountCalendarReady(props)
    const day = date => ({ date })
    clicked.wrapper.vm.clickDay(
      day('9/10/2026'),
      clicked.wrapper.vm.isDisabledDate
    )
    clicked.wrapper.vm.clickDay(
      day('15/10/2026'),
      clicked.wrapper.vm.isDisabledDate
    )
    await nextTick()

    await choose(picked.wrapper, 'Last 7 days')

    expect(lastValue(picked.wrapper)).toEqual(lastValue(clicked.wrapper))
    expect(lastValue(picked.wrapper).dateRange).toEqual({
      start: '9/10/2026 00:00',
      end: '15/10/2026 00:00'
    })
    expect(picked.wrapper.find('.vfc-time-picker-container').exists()).toBe(
      true
    )
  })

  it('replaces a half-open range instead of ending it', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })
    await clickDays(wrapper, [3])

    await choose(wrapper, 'Last 7 days')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '9/10/2026',
      end: '15/10/2026'
    })
  })

  it('replaces an open trailing range with isMultipleDateRange', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      isMultipleDateRange: true,
      presets: true
    })
    await clickDays(wrapper, [1, 3, 20])

    await choose(wrapper, 'Last 7 days')

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '1/10/2026', end: '3/10/2026' },
      { start: '9/10/2026', end: '15/10/2026' }
    ])
  })

  it('replaces a completed range', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })
    await clickDays(wrapper, [1, 3])

    await choose(wrapper, 'Yesterday')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '14/10/2026',
      end: '14/10/2026'
    })
  })
})

describe('date picker mode', () => {
  it('uses the start of each preset', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper, events } = await mountCalendarReady({
      isDatePicker: true,
      presets: true
    })

    await choose(wrapper, 'Last 7 days')

    expect(lastValue(wrapper).selectedDate).toBe('9/10/2026')
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([])
  })

  it('checks only the start day against the disabled dates', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      presets: true,
      disabledDates: ['12/10/2026']
    })

    expect(
      presetButton(wrapper, 'Last 7 days').attributes('aria-disabled')
    ).toBe('false')
  })
})

describe('custom presets', () => {
  const quarter = {
    label: 'Q4',
    range: () => ({ start: new Date(2026, 9, 1), end: new Date(2026, 11, 31) })
  }

  it('selects the range a custom preset returns', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: [quarter]
    })

    await choose(wrapper, 'Q4')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '1/10/2026',
      end: '31/12/2026'
    })
  })

  it('disables a custom preset whose timed start falls on a disabled day', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      disabledDates: ['15/10/2026'],
      presets: [
        {
          label: 'Timed',
          range: () => ({
            start: new Date(2026, 9, 15, 10),
            end: new Date(2026, 9, 16)
          })
        }
      ]
    })

    expect(presetButton(wrapper, 'Timed').attributes('aria-disabled')).toBe(
      'true'
    )
  })

  it('allows a custom preset whose timed end falls on the max limit', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      limits: { min: '1/10/2026', max: '20/10/2026' },
      presets: [
        {
          label: 'Timed',
          range: () => ({
            start: new Date(2026, 9, 18, 9),
            end: new Date(2026, 9, 20, 18)
          })
        }
      ]
    })

    await choose(wrapper, 'Timed')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '18/10/2026',
      end: '20/10/2026'
    })
  })

  it('allows a custom preset ending later today with afterToday disabled', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      disabledDates: ['afterToday'],
      presets: [
        {
          label: 'Until tonight',
          range: () => ({
            start: new Date(2026, 9, 13, 8),
            end: new Date(2026, 9, 15, 22)
          })
        }
      ]
    })

    await choose(wrapper, 'Until tonight')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '13/10/2026',
      end: '15/10/2026'
    })
  })

  it('mixes built-in keys and custom objects in the given order', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: [quarter, 'today', 'lastMonth']
    })

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Q4',
      'Today',
      'Last month'
    ])
  })

  it('skips unknown keys and ranges that are not two ordered dates', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: [
        'nextWeek',
        { label: 'Broken', range: () => ({ start: 'x', end: 'y' }) },
        {
          label: 'Backwards',
          range: () => ({
            start: new Date(2026, 9, 5),
            end: new Date(2026, 9, 1)
          })
        },
        { label: 'No range' },
        {
          label: 'Invalid',
          range: () => ({ start: new Date(NaN), end: new Date() })
        },
        quarter
      ]
    })

    expect(presetButtons(wrapper).map(button => button.text())).toEqual(['Q4'])
  })

  it('reads times in a returned date as the same day', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: [
        {
          label: 'Late',
          range: () => ({
            start: new Date(2026, 9, 5, 23, 59),
            end: new Date(2026, 9, 6, 0, 1)
          })
        }
      ]
    })

    await choose(wrapper, 'Late')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '5/10/2026',
      end: '6/10/2026'
    })
  })
})

describe('navigation', () => {
  const march = {
    label: 'March',
    range: () => ({ start: new Date(2027, 2, 3), end: new Date(2027, 2, 9) })
  }

  it('moves the calendar to the month of the range start', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: [march]
    })
    expect(calendarTitle(wrapper)).toBe('October 2026')

    await choose(wrapper, 'March')

    expect(calendarTitle(wrapper)).toBe('March 2027')
  })

  it('keeps the calendar when the start month is already shown', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper, events } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, 'Last 7 days')

    expect(calendarTitle(wrapper)).toBe('October 2026')
    expect(eventsNamed(events, 'changedMonth')).toEqual([])
  })

  it('keeps the calendars when the start is in the second visible month', async () => {
    const november = {
      label: 'November',
      range: () => ({
        start: new Date(2026, 10, 3),
        end: new Date(2026, 10, 9)
      })
    }
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      isMultiple: true,
      calendarsCount: 2,
      presets: [november]
    })

    await choose(wrapper, 'November')

    expect(calendarTitle(wrapper, 0)).toBe('October 2026')
    expect(calendarTitle(wrapper, 1)).toBe('November 2026')
  })

  it('shows the start month first across several calendars', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      isMultiple: true,
      calendarsCount: 2,
      presets: [march]
    })

    await choose(wrapper, 'March')

    expect(calendarTitle(wrapper, 0)).toBe('March 2027')
    expect(calendarTitle(wrapper, 1)).toBe('April 2027')
  })
})

describe('disabled presets', () => {
  const state = async props => {
    setToday(2026, 9, 15, 10)
    const mounted = await mountCalendarReady({
      isDateRange: true,
      presets: true,
      ...props
    })
    const disabled = presetButtons(mounted.wrapper)
      .filter(button => button.attributes('aria-disabled') === 'true')
      .map(button => button.text())
    return { ...mounted, disabled }
  }

  it('enables every preset without restrictions', async () => {
    const { disabled } = await state({})

    expect(disabled).toEqual([])
  })

  it('disables presets that leave the limits', async () => {
    const { disabled } = await state({
      limits: { min: '10/10/2026', max: '31/10/2026' }
    })

    expect(disabled).toEqual([
      'Last 7 days',
      'Last 30 days',
      'This month',
      'Last month'
    ])
  })

  it('disables presets that contain a disabled date', async () => {
    const { disabled } = await state({ disabledDates: ['12/10/2026'] })

    expect(disabled).toEqual(['Last 7 days', 'Last 30 days', 'This month'])
  })

  it('disables presets that contain a date outside enabledDates', async () => {
    const { disabled } = await state({ enabledDates: ['15/10/2026'] })

    expect(disabled).toEqual([
      'Yesterday',
      'Last 7 days',
      'Last 30 days',
      'This month',
      'Last month'
    ])
  })

  it('disables presets that contain a disabled day name', async () => {
    const { disabled } = await state({ disabledDayNames: ['Th'] })

    expect(disabled).toEqual([
      'Today',
      'Last 7 days',
      'Last 30 days',
      'This month',
      'Last month'
    ])
  })

  it('disables presets shorter than minSelDays', async () => {
    const { disabled } = await state({ minSelDays: 7 })

    expect(disabled).toEqual(['Today', 'Yesterday'])
  })

  it('disables presets longer than maxSelDays', async () => {
    const { disabled } = await state({ maxSelDays: 7 })

    expect(disabled).toEqual(['Last 30 days', 'This month', 'Last month'])
  })

  it('does nothing when a disabled preset is clicked', async () => {
    const { wrapper, events } = await state({
      limits: { min: '10/10/2026', max: '31/10/2026' }
    })

    const emittedBefore = wrapper.emitted('update:modelValue').length

    await choose(wrapper, 'Last 7 days')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(emittedBefore)
    expect(lastValue(wrapper).dateRange).toEqual({ start: '', end: '' })
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([])
  })

  it('still selects an enabled preset next to a disabled one', async () => {
    const { wrapper } = await state({
      limits: { min: '10/10/2026', max: '31/10/2026' }
    })

    await choose(wrapper, 'Today')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '15/10/2026',
      end: '15/10/2026'
    })
  })
})

describe('options', () => {
  it('renders nothing without the presets option', async () => {
    const { wrapper } = await mountCalendarReady({ isDateRange: true })

    expect(wrapper.find('.vfc-presets').exists()).toBe(false)
    expect(wrapper.find('.vfc-main-container').classes()).not.toContain(
      'vfc-has-presets'
    )
  })

  it('renders nothing for presets: false', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: false
    })

    expect(wrapper.find('.vfc-presets').exists()).toBe(false)
  })

  it('renders nothing when the calendar selects neither a date nor a range', async () => {
    const { wrapper } = await mountCalendarReady({ presets: true })

    expect(wrapper.find('.vfc-presets').exists()).toBe(false)
  })

  it('renders nothing with isMultipleDatePicker', async () => {
    const { wrapper } = await mountCalendarReady({
      isMultipleDatePicker: true,
      presets: true
    })

    expect(wrapper.find('.vfc-presets').exists()).toBe(false)
  })

  it('hides the presets with hiddenElements', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true,
      hiddenElements: ['presets']
    })

    expect(wrapper.find('.vfc-presets').exists()).toBe(false)
  })

  it('reads presets from configs', async () => {
    const { wrapper } = await mountCalendarReady({
      configs: { isDateRange: true, presets: ['today'] }
    })

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Today'
    ])
  })

  it('reads presets from the global options', async () => {
    const { wrapper } = await mountCalendarReady(
      { isDateRange: true },
      withPlugin({ presets: ['yesterday'] })
    )

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Yesterday'
    ])
  })

  it('lets the presets prop override a global option', async () => {
    const { wrapper } = await mountCalendarReady(
      { isDateRange: true, presets: ['today'] },
      withPlugin({ presets: ['yesterday'] })
    )

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Today'
    ])
  })

  it('does not render presets over the time picker', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      withTimePicker: true,
      presets: true
    })

    await choose(wrapper, 'Today')

    expect(wrapper.find('.vfc-presets').exists()).toBe(false)
    expect(wrapper.find('.vfc-main-container').classes()).not.toContain(
      'vfc-has-presets'
    )
  })
})

describe('labels', () => {
  it('translates a preset through labels.presets', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: ['today', 'yesterday'],
      labels: { presets: { today: 'Heute' } }
    })

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Heute',
      'Yesterday'
    ])
  })

  it('translates the group name', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true,
      labels: { quickRanges: 'Schnellauswahl' }
    })

    expect(wrapper.find('.vfc-presets').attributes('aria-label')).toBe(
      'Schnellauswahl'
    )
  })

  it('merges preset labels from global options, configs and props', async () => {
    const { wrapper } = await mountCalendarReady(
      {
        configs: {
          isDateRange: true,
          presets: ['today', 'yesterday', 'last7Days'],
          labels: { presets: { yesterday: 'Gestern' } }
        }
      },
      withPlugin({
        labels: { presets: { today: 'Heute', yesterday: 'Global' } }
      })
    )

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Heute',
      'Gestern',
      'Last 7 days'
    ])
  })

  it('does not leak preset labels between calendars', async () => {
    await mountCalendarReady({
      isDateRange: true,
      presets: true,
      labels: { presets: { today: 'Leak' } }
    })
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    expect(presetButton(wrapper, 'Today').exists()).toBe(true)
  })
})

describe('keyboard and structure', () => {
  it('renders real buttons that are in the tab order', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    presetButtons(wrapper).forEach(button => {
      expect(button.element.tagName).toBe('BUTTON')
      expect(button.attributes('type')).toBe('button')
      expect(button.attributes('tabindex')).toBeUndefined()
    })
  })

  it('places the presets before the grid in DOM order', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })
    const presets = wrapper.find('.vfc-presets').element
    const grid = wrapper.find('[role="grid"]').element

    expect(
      presets.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })

  it('names the group of presets', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    const group = wrapper.find('.vfc-presets')
    expect(group.attributes('role')).toBe('group')
    expect(group.attributes('aria-label')).toBe('Quick ranges')
  })

  it('selects when a button receives a click from the keyboard', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })
    const button = presetButton(wrapper, 'Yesterday').element

    button.focus()
    button.click()
    await nextTick()

    expect(lastValue(wrapper).dateRange.start).toBe('14/10/2026')
  })

  it('marks a disabled preset with aria-disabled and keeps the button focusable', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true,
      limits: { min: '15/10/2026', max: '31/10/2026' }
    })
    const button = presetButton(wrapper, 'Yesterday')

    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('disabled')).toBeUndefined()
  })
})

describe('modal calendars', () => {
  const open = async props => {
    setToday(2026, 9, 15, 10)
    const mounted = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      presets: true,
      ...props
    })
    const start = mounted.wrapper.find('input').element
    start.focus()
    await nextTick()
    return { ...mounted, start }
  }

  it('fills the inputs and stays open without isAutoCloseable', async () => {
    const { wrapper } = await open({})

    await choose(wrapper, 'Last 7 days')

    const [start, end] = wrapper.findAll('.vfc-multiple-input input')
    expect(start.element.value).toBe('9/10/2026')
    expect(end.element.value).toBe('15/10/2026')
    expect(isHidden(wrapper)).toBe(false)
  })

  it('closes and returns focus to the input with isAutoCloseable', async () => {
    const { wrapper, events, start } = await open({ isAutoCloseable: true })
    expect(isHidden(wrapper)).toBe(false)
    const closedBefore = eventsNamed(events, 'closed').length

    const button = presetButton(wrapper, 'Last 7 days').element
    button.focus()
    button.click()
    await nextTick()
    await nextTick()

    expect(isHidden(wrapper)).toBe(true)
    expect(document.activeElement).toBe(start)
    expect(eventsNamed(events, 'closed')).toHaveLength(closedBefore + 1)
  })

  it('closes a date picker with isAutoCloseable', async () => {
    const { wrapper } = await open({
      isDateRange: false,
      isDatePicker: true,
      isAutoCloseable: true
    })
    await choose(wrapper, 'Today')

    expect(isHidden(wrapper)).toBe(true)
    expect(wrapper.find('input.vfc-single-input').element.value).toBe(
      '15/10/2026'
    )
  })
})

describe('events', () => {
  it('emits no dayClicked or choseDay for a range preset', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper, events } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, 'Last 7 days')

    expect(eventsNamed(events, 'dayClicked')).toEqual([])
    expect(eventsNamed(events, 'choseDay')).toEqual([])
  })

  it('emits no dayClicked or choseDay for a date picker preset', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper, events } = await mountCalendarReady({
      isDatePicker: true,
      presets: true
    })

    await choose(wrapper, 'Today')

    expect(eventsNamed(events, 'dayClicked')).toEqual([])
    expect(eventsNamed(events, 'choseDay')).toEqual([])
  })

  it('still emits dayClicked and choseDay with the real day when clicking', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper, events } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await clickDays(wrapper, [9, 15])

    expect(eventsNamed(events, 'dayClicked')).toHaveLength(2)
    expect(eventsNamed(events, 'choseDay')).toHaveLength(2)
    expect(eventsNamed(events, 'choseDay')[0]).toMatchObject({
      date: '9/10/2026',
      day: 9
    })
  })

  it('emits one update:modelValue per range preset', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })
    const before = wrapper.emitted('update:modelValue').length

    await choose(wrapper, 'Last 7 days')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(before + 1)
    expect(lastValue(wrapper).dateRange).toEqual({
      start: '9/10/2026',
      end: '15/10/2026'
    })
  })

  it('emits one update:modelValue per multiple range preset', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      isMultipleDateRange: true,
      presets: true
    })
    const before = wrapper.emitted('update:modelValue').length

    await choose(wrapper, 'Last 7 days')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(before + 1)
  })

  it('emits one update:modelValue when the preset moves the calendar', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: [
        {
          label: 'March',
          range: () => ({
            start: new Date(2027, 2, 3),
            end: new Date(2027, 2, 9)
          })
        }
      ]
    })
    const before = wrapper.emitted('update:modelValue').length

    await choose(wrapper, 'March')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toHaveLength(before + 1)
    expect(lastValue(wrapper).dateRange).toEqual({
      start: '3/3/2027',
      end: '9/3/2027'
    })
  })

  it('emits changedMonth and changedYear when the preset changes the year', async () => {
    const { wrapper, events } = await mountCalendarReady({
      isDateRange: true,
      presets: [
        {
          label: 'March',
          range: () => ({
            start: new Date(2027, 2, 3),
            end: new Date(2027, 2, 9)
          })
        }
      ]
    })

    await choose(wrapper, 'March')

    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2027, 2, 1)])
    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2027, 2, 1)])
  })

  it('emits changedMonth without changedYear inside the same year', async () => {
    const { wrapper, events } = await mountCalendarReady({
      isDateRange: true,
      presets: [
        {
          label: 'December',
          range: () => ({
            start: new Date(2026, 11, 3),
            end: new Date(2026, 11, 9)
          })
        }
      ]
    })

    await choose(wrapper, 'December')

    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 11, 1)])
    expect(eventsNamed(events, 'changedYear')).toEqual([])
  })

  it('emits no navigation events when the start month is visible', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper, events } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, 'Last 7 days')

    expect(eventsNamed(events, 'changedMonth')).toEqual([])
    expect(eventsNamed(events, 'changedYear')).toEqual([])
  })
})

describe('clock', () => {
  const fixedDay = {
    label: 'Fixed',
    range: () => ({ start: new Date(2026, 9, 15), end: new Date(2026, 9, 15) })
  }

  const mountBeforeMidnight = async props => {
    setToday(2026, 9, 15, 23, 59)
    return mountCalendarReady({
      isDateRange: true,
      disabledDates: ['beforeToday'],
      presets: ['today', fixedDay],
      ...props
    })
  }

  it('does nothing when midnight made the preset blocked, keeping the selection', async () => {
    const { wrapper } = await mountBeforeMidnight()
    await clickDays(wrapper, [20, 22])
    expect(presetButton(wrapper, 'Fixed').attributes('aria-disabled')).toBe(
      'false'
    )
    const emitted = wrapper.emitted('update:modelValue').length
    vi.setSystemTime(new Date(2026, 9, 16, 0, 1))

    wrapper.vm.applyPreset(wrapper.vm.presetItems[1])
    await nextTick()

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '20/10/2026',
      end: '22/10/2026'
    })
    expect(wrapper.emitted('update:modelValue')).toHaveLength(emitted)
  })

  it('applies a built-in preset against the new day after midnight', async () => {
    const { wrapper } = await mountBeforeMidnight()
    vi.setSystemTime(new Date(2026, 9, 16, 0, 1))

    wrapper.vm.applyPreset(wrapper.vm.presetItems[0])
    await nextTick()

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '16/10/2026',
      end: '16/10/2026'
    })
  })

  it('refreshes the preset list when a modal calendar opens', async () => {
    const { wrapper } = await mountBeforeMidnight({ isModal: true })
    expect(presetButton(wrapper, 'Fixed').attributes('aria-disabled')).toBe(
      'false'
    )
    vi.setSystemTime(new Date(2026, 9, 16, 0, 1))

    await wrapper.trigger('focusin')
    await nextTick()

    expect(presetButton(wrapper, 'Fixed').attributes('aria-disabled')).toBe(
      'true'
    )
  })

  it('skips a custom preset whose range throws', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: [
        {
          label: 'Boom',
          range: () => {
            throw new Error('no range')
          }
        },
        'today'
      ]
    })

    expect(presetButtons(wrapper).map(button => button.text())).toEqual([
      'Today'
    ])
  })
})

describe('blocked check cost and parity', () => {
  const range = (start, end) => ({ start, end })

  const bruteForce = (wrapper, { start, end }, isRange = true) => {
    const { minSelDays, maxSelDays } = wrapper.vm.fConfigs
    const days = []
    const last = isRange ? end : start
    for (let day = new Date(start); day <= last;) {
      days.push(new Date(day))
      day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
    }
    return (
      days.some(day =>
        wrapper.vm.isDateBlocked(wrapper.vm.helpCalendar.formatDate(day))
      ) ||
      !!(isRange && minSelDays && days.length < minSelDays) ||
      !!(isRange && maxSelDays && days.length > maxSelDays)
    )
  }

  const samples = [
    range(new Date(2026, 9, 15), new Date(2026, 9, 15)),
    range(new Date(2026, 9, 9), new Date(2026, 9, 15)),
    range(new Date(2026, 8, 16), new Date(2026, 9, 15)),
    range(new Date(2026, 9, 1), new Date(2026, 9, 31)),
    range(new Date(2026, 9, 12), new Date(2026, 9, 18)),
    range(new Date(2026, 9, 18), new Date(2026, 9, 18)),
    range(new Date(2026, 9, 20), new Date(2026, 9, 21))
  ]

  const configs = {
    none: {},
    limits: { limits: { min: '10/10/2026', max: '20/10/2026' } },
    disabledDates: { disabledDates: ['12/10/2026', '3/9/2026'] },
    disabledKeywords: { disabledDates: ['beforeToday'] },
    disabledAfter: { disabledDates: ['afterToday'] },
    enabledDates: { enabledDates: ['15/10/2026', '14/10/2026'] },
    enabledKeyword: { enabledDates: ['beforeToday'] },
    enabledMixed: { enabledDates: ['afterToday', '15/10/2026'] },
    dayNames: { disabledDayNames: ['Th'] },
    unknownDayName: { disabledDayNames: ['Xx'] },
    minMax: { minSelDays: 3, maxSelDays: 20 },
    padded: { disabledDates: ['09/10/2026'] }
  }

  it.each(Object.entries(configs))(
    'matches a day-by-day check for %s',
    async (name, props) => {
      setToday(2026, 9, 15, 10)
      const { wrapper } = await mountCalendarReady({
        isDateRange: true,
        presets: true,
        ...props
      })

      samples.forEach(sample => {
        expect(wrapper.vm.isPresetBlocked(sample)).toBe(
          bruteForce(wrapper, sample)
        )
      })
    }
  )

  it('matches a day-by-day check for a date picker', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      presets: true,
      disabledDates: ['9/10/2026']
    })

    samples.forEach(sample => {
      expect(wrapper.vm.isPresetBlocked(sample)).toBe(
        bruteForce(wrapper, sample, false)
      )
    })
  })

  it('evaluates a 25 year range without per-day rules in under 10ms', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      limits: { min: '1/1/2000', max: '31/12/2040' },
      presets: true
    })
    const decades = range(new Date(2005, 0, 1), new Date(2030, 0, 1))

    const startedAt = performance.now()
    const blocked = wrapper.vm.isPresetBlocked(decades)
    const elapsed = performance.now() - startedAt

    expect(blocked).toBe(false)
    expect(elapsed).toBeLessThan(10)
  })

  it('blocks a 25 year range from the endpoints and the length alone', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      limits: { min: '1/1/2010', max: '31/12/2040' },
      maxSelDays: 400,
      presets: true
    })

    expect(
      wrapper.vm.isPresetBlocked(
        range(new Date(2005, 0, 1), new Date(2008, 0, 1))
      )
    ).toBe(true)
    expect(
      wrapper.vm.isPresetBlocked(
        range(new Date(2011, 0, 1), new Date(2030, 0, 1))
      )
    ).toBe(true)
  })

  it('blocks any week-long range when a day name is disabled', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      disabledDayNames: ['Su'],
      presets: true
    })

    expect(
      wrapper.vm.isPresetBlocked(
        range(new Date(2026, 9, 5), new Date(2026, 9, 11))
      )
    ).toBe(true)
    expect(
      wrapper.vm.isPresetBlocked(
        range(new Date(2026, 9, 5), new Date(2026, 9, 10))
      )
    ).toBe(false)
  })
})

describe('hover state', () => {
  it('clears the hover tails of an abandoned half-open range', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      minSelDays: 5,
      presets: true
    })
    await clickDays(wrapper, [10])
    wrapper.vm.dayMouseOver('11/10/2026')
    const hoveredDays = () =>
      wrapper.vm.listCalendars
        .flatMap(item => item.weeks)
        .flatMap(week => week.days)
        .filter(day => day.isHovered)
    expect(hoveredDays().length).toBeGreaterThan(0)

    await choose(wrapper, 'Last 7 days')

    expect(hoveredDays()).toEqual([])
    expect(lastValue(wrapper).dateRange).toEqual({
      start: '9/10/2026',
      end: '15/10/2026'
    })
  })
})

describe('pressed state', () => {
  const pressed = wrapper =>
    presetButtons(wrapper)
      .filter(button => button.attributes('aria-pressed') === 'true')
      .map(button => button.text())

  it('presses nothing before a selection', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    expect(pressed(wrapper)).toEqual([])
    expect(presetButtons(wrapper)[0].attributes('aria-pressed')).toBe('false')
  })

  it('presses the preset that matches the range', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await choose(wrapper, 'Last 7 days')

    expect(pressed(wrapper)).toEqual(['Last 7 days'])
  })

  it('moves the pressed state when another preset is chosen', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })
    await choose(wrapper, 'Last 7 days')

    await choose(wrapper, 'Yesterday')

    expect(pressed(wrapper)).toEqual(['Yesterday'])
  })

  it('presses nothing after a different range is clicked', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })
    await choose(wrapper, 'Last 7 days')

    await clickDays(wrapper, [1, 3])

    expect(pressed(wrapper)).toEqual([])
  })

  it('presses the preset equal to a range chosen by clicking', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      presets: true
    })

    await clickDays(wrapper, [9, 15])

    expect(pressed(wrapper)).toEqual(['Last 7 days'])
  })

  it('presses the preset that matches any of several ranges', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      isMultipleDateRange: true,
      presets: true
    })
    await clickDays(wrapper, [1, 3])

    await choose(wrapper, 'Last 7 days')

    expect(pressed(wrapper)).toEqual(['Last 7 days'])
  })

  it('presses the preset that matches the selected date', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      presets: true
    })

    await choose(wrapper, 'Last 7 days')

    expect(pressed(wrapper)).toEqual(['Last 7 days'])
  })

  it('ignores the time part of the selection', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      withTimePicker: true,
      presets: true
    })

    await choose(wrapper, 'Today')
    wrapper.vm.showTimePicker = false
    await nextTick()

    expect(pressed(wrapper)).toEqual(['Today'])
  })
})

describe('focus on mouse down', () => {
  it('keeps focus where it is so a modal does not close before the click', async () => {
    setToday(2026, 9, 15, 10)
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isAutoCloseable: true,
      presets: true
    })
    const input = wrapper.find('input').element
    input.focus()
    await nextTick()
    const button = presetButton(wrapper, 'Last 7 days').element

    const mousedown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true
    })
    button.dispatchEvent(mousedown)

    expect(mousedown.defaultPrevented).toBe(true)
    expect(isHidden(wrapper)).toBe(false)
    expect(document.activeElement).toBe(input)

    button.click()
    await nextTick()

    expect(isHidden(wrapper)).toBe(true)
    expect(document.activeElement).toBe(input)
  })
})
