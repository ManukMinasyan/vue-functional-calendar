import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import {
  mountCalendarReady,
  calendarTitle,
  eventsNamed,
  findDay,
  findDayAny,
  lastValue
} from './helpers.js'

const fullDate = (year, month, day) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'full' }).format(
    new Date(year, month, day)
  )

const press = async (element, key, init = {}) => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...init
    })
  )
  await nextTick()
  await nextTick()
}

const active = () => document.activeElement

const focusedLabel = () => active().getAttribute('aria-label')

const focusDay = (wrapper, day, calendarIndex = 0) => {
  const element = findDay(wrapper, day, calendarIndex)
  element.focus()
  return element
}

const cells = (wrapper, calendarIndex = 0) => {
  const calendar = wrapper.findAll('.vfc-calendar')[calendarIndex]
  return calendar.findAll('[role="gridcell"]').map(cell => cell.element)
}

const tabStops = (wrapper, calendarIndex = 0) =>
  cells(wrapper, calendarIndex).filter(
    cell => cell.getAttribute('tabindex') === '0'
  )

const isHidden = wrapper =>
  wrapper.find('.vfc-main-container').element.style.display === 'none'

afterEach(() => {
  vi.useRealTimers()
})

describe('grid semantics', () => {
  it('exposes each month as a named grid of rows', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    const grid = wrapper.find('[role="grid"]')

    expect(grid.attributes('aria-label')).toBe('October 2026')
    expect(grid.findAll('[role="row"]').length).toBeGreaterThan(1)
    expect(grid.find('.vfc-dayNames').attributes('role')).toBe('row')
    expect(grid.findAll('[role="columnheader"]')).toHaveLength(7)
  })

  it('labels every day cell with the full date', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    expect(findDay(wrapper, 15).getAttribute('aria-label')).toBe(
      fullDate(2026, 9, 15)
    )
    expect(findDay(wrapper, 31).getAttribute('aria-label')).toBe(
      fullDate(2026, 9, 31)
    )
  })

  it('marks the selected day with aria-selected', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    expect(findDay(wrapper, 10).getAttribute('aria-selected')).toBe('false')

    findDay(wrapper, 10).click()
    await nextTick()

    expect(findDay(wrapper, 10).getAttribute('aria-selected')).toBe('true')
    expect(findDay(wrapper, 11).getAttribute('aria-selected')).toBe('false')
  })

  it('marks every day of a selected range', async () => {
    const { wrapper } = await mountCalendarReady({ isDateRange: true })

    findDay(wrapper, 10).click()
    await nextTick()
    findDay(wrapper, 13).click()
    await nextTick()

    const selected = [9, 10, 11, 12, 13, 14].map(day =>
      findDay(wrapper, day).getAttribute('aria-selected')
    )

    expect(selected).toEqual(['false', 'true', 'true', 'true', 'true', 'false'])
  })

  it('leaves aria-selected off a calendar that cannot select', async () => {
    const { wrapper } = await mountCalendarReady()

    expect(findDay(wrapper, 10).hasAttribute('aria-selected')).toBe(false)
  })

  it('marks disabled days with aria-disabled', async () => {
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      disabledDates: ['12/10/2026'],
      limits: { min: '05/10/2026', max: '25/10/2026' },
      disabledDayNames: ['Su']
    })

    const disabled = day =>
      findDayAny(wrapper, day).getAttribute('aria-disabled')

    expect(disabled(12)).toBe('true')
    expect(disabled(3)).toBe('true')
    expect(disabled(28)).toBe('true')
    expect(disabled(11)).toBe('true')
    expect(disabled(13)).toBe('false')
  })

  it('renders the arrows as labelled buttons that keep their classes', async () => {
    const { wrapper } = await mountCalendarReady()

    const previous = wrapper.find('button[aria-label="Previous month"]')
    const next = wrapper.find('button[aria-label="Next month"]')

    expect(previous.attributes('type')).toBe('button')
    expect(next.attributes('type')).toBe('button')
    expect(previous.find('.vfc-arrow-left').exists()).toBe(true)
    expect(next.find('.vfc-arrow-right').exists()).toBe(true)

    await next.trigger('click')

    expect(calendarTitle(wrapper)).toBe('November 2026')
  })

  it('still renders custom arrow slots inside the buttons', async () => {
    const { wrapper } = await mountCalendarReady(
      {},
      {
        slots: {
          navigationArrowLeft: '<i class="custom-left"></i>',
          navigationArrowRight: '<i class="custom-right"></i>'
        }
      }
    )

    expect(
      wrapper.find('button[aria-label="Previous month"] .custom-left').exists()
    ).toBe(true)
    expect(
      wrapper.find('button[aria-label="Next month"] .custom-right').exists()
    ).toBe(true)
  })

  it('keeps focus reachable on an arrow that is at its limit', async () => {
    const { wrapper } = await mountCalendarReady({
      limits: { min: '01/10/2026', max: '31/10/2026' }
    })

    const next = wrapper.find('button[aria-label="Next month"]')

    expect(next.attributes('aria-disabled')).toBe('true')
    expect(next.attributes('disabled')).toBeUndefined()
  })
})

describe('roving tabindex', () => {
  it('gives one grid exactly one tab stop on today', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 12))
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    expect(tabStops(wrapper)).toEqual([findDay(wrapper, 15)])
    expect(cells(wrapper).filter(cell => cell.tabIndex === -1)).toHaveLength(
      cells(wrapper).length - 1
    )
  })

  it('prefers the selected day over today', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 12))
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    findDay(wrapper, 20).click()
    await nextTick()

    expect(tabStops(wrapper)).toEqual([findDay(wrapper, 20)])
  })

  it('falls back to the first enabled day when today is not in the month', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 12))
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      newCurrentDate: new Date(2026, 11, 1),
      disabledDates: ['1/12/2026', '2/12/2026']
    })

    expect(tabStops(wrapper)).toEqual([findDay(wrapper, 3)])
  })

  it('follows the day that was last focused', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    focusDay(wrapper, 22)
    await nextTick()

    expect(tabStops(wrapper)).toEqual([findDay(wrapper, 22)])
  })

  it('keeps one tab stop in every grid of a multiple calendar', async () => {
    const { wrapper } = await mountCalendarReady({
      isMultiple: true,
      calendarsCount: 3,
      isDatePicker: true
    })

    for (const index of [0, 1, 2]) {
      expect(tabStops(wrapper, index)).toHaveLength(1)
    }
  })

  it('never makes a day from an adjacent month the tab stop', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    const stop = tabStops(wrapper)[0]

    expect(stop.classList.contains('vfc-hide')).toBe(false)
  })
})

describe('keys', () => {
  const start = async (props = {}) => {
    const mounted = await mountCalendarReady({ isDatePicker: true, ...props })
    const origin = focusDay(mounted.wrapper, 15)
    return { ...mounted, origin }
  }

  it.each([
    ['ArrowRight', 16],
    ['ArrowLeft', 14],
    ['ArrowDown', 22],
    ['ArrowUp', 8]
  ])('%s moves focus to day %i', async (key, day) => {
    const { wrapper, origin } = await start()

    await press(origin, key)

    expect(active()).toBe(findDay(wrapper, day))
  })

  it('Home moves to the first day of the week', async () => {
    const { wrapper, origin } = await start()

    await press(origin, 'Home')

    expect(active()).toBe(findDay(wrapper, 12))
  })

  it('End moves to the last day of the week', async () => {
    const { wrapper, origin } = await start()

    await press(origin, 'End')

    expect(active()).toBe(findDay(wrapper, 18))
  })

  it('Home and End follow sundayStart', async () => {
    const { wrapper, origin } = await start({ sundayStart: true })

    await press(origin, 'Home')
    expect(active()).toBe(findDay(wrapper, 11))

    await press(active(), 'End')
    expect(active()).toBe(findDay(wrapper, 17))
  })

  it('Home and End stay inside the visible month', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    await press(focusDay(wrapper, 2), 'Home')
    expect(active()).toBe(findDay(wrapper, 1))

    await press(focusDay(wrapper, 30), 'End')
    expect(active()).toBe(findDay(wrapper, 31))
    expect(calendarTitle(wrapper)).toBe('October 2026')
  })

  it('PageDown moves one month ahead and clamps the day', async () => {
    const { wrapper, events } = await mountCalendarReady({ isDatePicker: true })

    await press(focusDay(wrapper, 31), 'PageDown')

    expect(calendarTitle(wrapper)).toBe('November 2026')
    expect(focusedLabel()).toBe(fullDate(2026, 10, 30))
    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 10, 1)])
  })

  it('PageUp moves one month back', async () => {
    const { wrapper } = await start()

    await press(findDay(wrapper, 15), 'PageUp')

    expect(calendarTitle(wrapper)).toBe('September 2026')
    expect(focusedLabel()).toBe(fullDate(2026, 8, 15))
  })

  it('Shift+PageDown moves one year ahead and emits changedYear', async () => {
    const { wrapper, events } = await start()

    await press(findDay(wrapper, 15), 'PageDown', { shiftKey: true })

    expect(calendarTitle(wrapper)).toBe('October 2027')
    expect(focusedLabel()).toBe(fullDate(2027, 9, 15))
    expect(eventsNamed(events, 'changedYear')).toEqual([new Date(2027, 9, 1)])
  })

  it('Shift+PageUp moves one year back', async () => {
    const { wrapper } = await start()

    await press(findDay(wrapper, 15), 'PageUp', { shiftKey: true })

    expect(calendarTitle(wrapper)).toBe('October 2025')
    expect(focusedLabel()).toBe(fullDate(2025, 9, 15))
  })

  it('Shift+PageUp clamps February 29 in a non-leap year', async () => {
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      newCurrentDate: new Date(2028, 1, 1)
    })

    await press(focusDay(wrapper, 29), 'PageUp', { shiftKey: true })

    expect(focusedLabel()).toBe(fullDate(2027, 1, 28))
  })

  it('Enter selects the focused day through clickDay', async () => {
    const { wrapper, events, origin } = await start()

    await press(origin, 'Enter')

    expect(lastValue(wrapper).selectedDate).toBe('15/10/2026')
    expect(eventsNamed(events, 'dayClicked')).toHaveLength(1)
    expect(eventsNamed(events, 'choseDay')).toHaveLength(1)
  })

  it('Space selects the focused day', async () => {
    const { wrapper, origin } = await start()

    await press(origin, ' ')

    expect(lastValue(wrapper).selectedDate).toBe('15/10/2026')
  })

  it('ignores keys it does not handle', async () => {
    const { origin } = await start()
    const event = new KeyboardEvent('keydown', {
      key: 'a',
      bubbles: true,
      cancelable: true
    })

    origin.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(active()).toBe(origin)
  })

  it('leaves modified arrow keys to the browser', async () => {
    const { origin } = await start()

    await press(origin, 'ArrowRight', { ctrlKey: true })

    expect(active()).toBe(origin)
  })

  it('selects a range with the keyboard only', async () => {
    const { wrapper, events } = await mountCalendarReady({ isDateRange: true })

    await press(focusDay(wrapper, 10), 'Enter')
    await press(active(), 'ArrowRight')
    await press(active(), 'ArrowRight')
    await press(active(), 'ArrowRight')
    await press(active(), 'Enter')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '13/10/2026'
    })
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([3])
  })

  it('previews the range while arrowing after the start day', async () => {
    const { wrapper } = await mountCalendarReady({ isDateRange: true })

    await press(focusDay(wrapper, 10), 'Enter')
    await press(active(), 'ArrowDown')

    expect(findDay(wrapper, 12).classList.contains('vfc-marked')).toBe(true)
  })

  it('applies min and max selected days to keyboard selection', async () => {
    const { wrapper } = await mountCalendarReady({
      isDateRange: true,
      minSelDays: 4
    })

    await press(focusDay(wrapper, 10), 'Enter')
    await press(focusDay(wrapper, 11), 'Enter')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '13/10/2026'
    })
  })

  it('toggles days in a multiple date picker', async () => {
    const { wrapper } = await mountCalendarReady({ isMultipleDatePicker: true })

    await press(focusDay(wrapper, 10), 'Enter')
    await press(focusDay(wrapper, 12), 'Enter')
    await press(focusDay(wrapper, 10), 'Enter')

    expect(lastValue(wrapper).selectedDates.map(item => item.date)).toEqual([
      '12/10/2026'
    ])
  })
})

describe('crossing months', () => {
  it('moves into the next month from the last day', async () => {
    const { wrapper, events } = await mountCalendarReady({ isDatePicker: true })

    await press(focusDay(wrapper, 31), 'ArrowRight')

    expect(calendarTitle(wrapper)).toBe('November 2026')
    expect(focusedLabel()).toBe(fullDate(2026, 10, 1))
    expect(eventsNamed(events, 'changedMonth')).toEqual([new Date(2026, 10, 1)])
  })

  it('moves into the previous month from the first day', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    await press(focusDay(wrapper, 1), 'ArrowLeft')

    expect(calendarTitle(wrapper)).toBe('September 2026')
    expect(focusedLabel()).toBe(fullDate(2026, 8, 30))
  })

  it('carries a week move across the month edge', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    await press(focusDay(wrapper, 28), 'ArrowDown')

    expect(calendarTitle(wrapper)).toBe('November 2026')
    expect(focusedLabel()).toBe(fullDate(2026, 10, 4))
  })

  it('emits update:modelValue with the new currentDate', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    await press(focusDay(wrapper, 31), 'ArrowRight')

    expect(lastValue(wrapper).currentDate).toBe(
      new Date(2026, 10, 1).toISOString()
    )
  })

  it('keeps the new month tabbable after the move', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    await press(focusDay(wrapper, 31), 'ArrowRight')

    expect(tabStops(wrapper)).toEqual([active()])
  })

  it('does not leave the months allowed by limits', async () => {
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      limits: { min: '01/10/2026', max: '31/10/2026' }
    })

    await press(focusDay(wrapper, 31), 'ArrowRight')

    expect(calendarTitle(wrapper)).toBe('October 2026')
    expect(active()).toBe(findDay(wrapper, 31))
  })
})

describe('multiple calendars', () => {
  const mountThree = props =>
    mountCalendarReady({
      isMultiple: true,
      calendarsCount: 3,
      isDatePicker: true,
      ...props
    })

  it('moves focus across the boundary without changing the view', async () => {
    const { wrapper, events } = await mountThree()

    await press(focusDay(wrapper, 31, 0), 'ArrowRight')

    expect(active()).toBe(findDay(wrapper, 1, 1))
    expect(calendarTitle(wrapper, 0)).toBe('October 2026')
    expect(eventsNamed(events, 'changedMonth')).toHaveLength(0)
  })

  it('moves back across the boundary', async () => {
    const { wrapper } = await mountThree()

    await press(focusDay(wrapper, 1, 1), 'ArrowLeft')

    expect(active()).toBe(findDay(wrapper, 31, 0))
  })

  it('advances every grid past the last visible month', async () => {
    const { wrapper } = await mountThree()

    await press(focusDay(wrapper, 31, 2), 'ArrowRight')

    expect(calendarTitle(wrapper, 0)).toBe('November 2026')
    expect(calendarTitle(wrapper, 2)).toBe('January 2027')
    expect(focusedLabel()).toBe(fullDate(2027, 0, 1))
    expect(wrapper.findAll('.vfc-calendar')[2].element.contains(active())).toBe(
      true
    )
  })

  it('moves every grid back before the first visible month', async () => {
    const { wrapper } = await mountThree()

    await press(focusDay(wrapper, 1, 0), 'ArrowLeft')

    expect(calendarTitle(wrapper, 0)).toBe('September 2026')
    expect(focusedLabel()).toBe(fullDate(2026, 8, 30))
  })

  it('PageDown lands in the following grid', async () => {
    const { wrapper } = await mountThree()

    await press(focusDay(wrapper, 15, 0), 'PageDown')

    expect(active()).toBe(findDay(wrapper, 15, 1))
    expect(calendarTitle(wrapper, 0)).toBe('October 2026')
  })

  it('navigates each grid on its own with isSeparately', async () => {
    const { wrapper } = await mountThree({ isSeparately: true })

    await press(focusDay(wrapper, 31, 0), 'ArrowRight')

    expect(calendarTitle(wrapper, 0)).toBe('November 2026')
    expect(calendarTitle(wrapper, 1)).toBe('November 2026')
    expect(calendarTitle(wrapper, 2)).toBe('December 2026')
    expect(focusedLabel()).toBe(fullDate(2026, 10, 1))
    expect(wrapper.findAll('.vfc-calendar')[0].element.contains(active())).toBe(
      true
    )
  })

  it('keeps one tab stop per grid after moving', async () => {
    const { wrapper } = await mountThree()

    await press(focusDay(wrapper, 31, 0), 'ArrowRight')

    for (const index of [0, 1, 2]) {
      expect(tabStops(wrapper, index)).toHaveLength(1)
    }
  })
})

describe('disabled days', () => {
  const mountDisabled = () =>
    mountCalendarReady({
      isDatePicker: true,
      disabledDates: ['12/10/2026']
    })

  it('can receive focus from the arrow keys', async () => {
    const { wrapper } = await mountDisabled()

    await press(focusDay(wrapper, 11), 'ArrowRight')

    expect(active()).toBe(findDay(wrapper, 12))
    expect(active().getAttribute('aria-disabled')).toBe('true')
  })

  it('does nothing on Enter and Space', async () => {
    const { wrapper, events } = await mountDisabled()

    await press(focusDay(wrapper, 12), 'Enter')
    await press(active(), ' ')

    expect(lastValue(wrapper).selectedDate).toBe(false)
    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)
  })

  it('matches a click on the same day', async () => {
    const clicked = await mountDisabled()
    findDay(clicked.wrapper, 12).click()
    await nextTick()

    const typed = await mountDisabled()
    await press(focusDay(typed.wrapper, 12), 'Enter')

    expect(eventsNamed(typed.events, 'dayClicked')).toEqual(
      eventsNamed(clicked.events, 'dayClicked')
    )
    expect(eventsNamed(typed.events, 'choseDay')).toEqual(
      eventsNamed(clicked.events, 'choseDay')
    )
  })

  it('honours limits and disabled day names the same way', async () => {
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      limits: { min: '05/10/2026', max: '25/10/2026' },
      disabledDayNames: ['Su']
    })

    await press(focusDay(wrapper, 3), 'Enter')
    await press(findDayAny(wrapper, 4), 'Enter')
    await press(focusDay(wrapper, 28), 'Enter')

    expect(lastValue(wrapper).selectedDate).toBe(false)
  })

  it('still gives a grid with only disabled days one tab stop', async () => {
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      enabledDates: ['01/11/2026']
    })

    expect(tabStops(wrapper)).toHaveLength(1)
  })
})

describe('modal mode', () => {
  const mountModal = (props = {}) =>
    mountCalendarReady({ isModal: true, isDateRange: true, ...props })

  it('flags the inputs as dialog triggers and tracks the open state', async () => {
    const { wrapper } = await mountModal()
    const inputs = wrapper.findAll('.vfc-multiple-input input')

    inputs.forEach(input => {
      expect(input.attributes('aria-haspopup')).toBe('dialog')
      expect(input.attributes('aria-expanded')).toBe('false')
    })

    await wrapper.trigger('focusin')

    inputs.forEach(input => {
      expect(input.attributes('aria-expanded')).toBe('true')
    })
    expect(wrapper.find('.vfc-main-container').attributes('role')).toBe(
      'dialog'
    )
  })

  it('does not give an inline calendar the dialog role', async () => {
    const { wrapper } = await mountCalendarReady({ isDateRange: true })

    expect(wrapper.find('.vfc-main-container').attributes('role')).toBe(
      undefined
    )
  })

  it('opens on ArrowDown from the input and focuses the roving day', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 12))
    const { wrapper } = await mountModal()
    const input = wrapper.find('.vfc-multiple-input input').element
    input.focus()
    await press(input, 'Escape')
    expect(isHidden(wrapper)).toBe(true)

    await press(input, 'ArrowDown')

    expect(isHidden(wrapper)).toBe(false)
    expect(active()).toBe(findDay(wrapper, 15))
  })

  it('opens on Enter from the input and focuses the roving day', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 12))
    const { wrapper } = await mountModal()
    const input = wrapper.find('.vfc-multiple-input input').element
    input.focus()
    await press(input, 'Escape')

    await press(input, 'Enter')

    expect(active()).toBe(findDay(wrapper, 15))
  })

  it('closes on Escape and returns focus to the input that opened it', async () => {
    const { wrapper } = await mountModal()
    const [, end] = wrapper.findAll('.vfc-multiple-input input')
    end.element.focus()
    await nextTick()
    expect(isHidden(wrapper)).toBe(false)

    await press(focusDay(wrapper, 12), 'Escape')

    expect(isHidden(wrapper)).toBe(true)
    expect(active()).toBe(end.element)
  })

  it('stays closed after Escape returns focus to the input', async () => {
    const { wrapper } = await mountModal()
    const input = wrapper.find('.vfc-multiple-input input').element
    input.focus()
    await nextTick()

    await press(focusDay(wrapper, 12), 'Escape')
    await nextTick()

    expect(isHidden(wrapper)).toBe(true)
    expect(wrapper.find('input').attributes('aria-expanded')).toBe('false')
  })

  it('reopens when the focused input is clicked again', async () => {
    const { wrapper } = await mountModal()
    const input = wrapper.find('.vfc-multiple-input input')
    input.element.focus()
    await press(focusDay(wrapper, 12), 'Escape')

    await input.trigger('click')

    expect(isHidden(wrapper)).toBe(false)
  })

  it('emits closed on Escape', async () => {
    const { wrapper, events } = await mountModal()
    wrapper.find('.vfc-multiple-input input').element.focus()
    await nextTick()

    await press(focusDay(wrapper, 12), 'Escape')

    expect(eventsNamed(events, 'closed')).toHaveLength(2)
  })

  it('picks a range from the keyboard and closes with Escape', async () => {
    const { wrapper } = await mountModal()
    const input = wrapper.find('.vfc-multiple-input input').element
    input.focus()
    await nextTick()

    await press(focusDay(wrapper, 12), 'Enter')
    await press(active(), 'ArrowRight')
    await press(active(), 'Enter')
    await press(active(), 'Escape')

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '12/10/2026',
      end: '13/10/2026'
    })
    expect(isHidden(wrapper)).toBe(true)
    expect(active()).toBe(input)
  })

  it('returns focus to the input when keyboard selection auto-closes', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isAutoCloseable: true
    })
    const input = wrapper.find('input.vfc-single-input').element
    input.focus()
    await nextTick()

    await press(focusDay(wrapper, 12), 'Enter')

    expect(isHidden(wrapper)).toBe(true)
    expect(active()).toBe(input)
  })

  it('ignores Escape on an inline calendar', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true
    })

    focusDay(wrapper, 12).dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect(isHidden(wrapper)).toBe(false)
  })

  it('does not hijack Enter in the tags input', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true
    })
    const input = wrapper.find('.vfc-tags-input input')
    await input.setValue('14/10/2026')

    await input.trigger('keydown', { key: 'Enter' })

    expect(active()).not.toBe(findDay(wrapper, 14))
    expect(wrapper.find('.vfc-tags-input-badge').exists()).toBe(true)
  })
})

describe('month and year pickers', () => {
  const mountPicker = () =>
    mountCalendarReady({
      isDatePicker: true,
      changeMonthFunction: true,
      changeYearFunction: true
    })

  const titleButtons = wrapper =>
    wrapper.findAll('.vfc-top-date [role="button"]').map(el => el.element)

  it('makes the month and year titles keyboard buttons', async () => {
    const { wrapper } = await mountPicker()

    const [month, year] = titleButtons(wrapper)

    expect(month.getAttribute('tabindex')).toBe('0')
    expect(month.getAttribute('aria-expanded')).toBe('false')
    expect(year.getAttribute('tabindex')).toBe('0')
  })

  it('leaves the titles out of the tab order when the pickers are off', async () => {
    const { wrapper } = await mountCalendarReady({ isDatePicker: true })

    expect(titleButtons(wrapper)).toHaveLength(0)
  })

  it('opens the month picker on Enter and focuses the selected month', async () => {
    const { wrapper } = await mountPicker()

    await press(titleButtons(wrapper)[0], 'Enter')

    expect(active().textContent.trim()).toBe('Oct')
    expect(active().getAttribute('aria-pressed')).toBe('true')
  })

  it('picks a month with Enter and returns focus to the grid', async () => {
    const { wrapper } = await mountPicker()
    await press(titleButtons(wrapper)[0], 'Enter')

    const march = wrapper
      .findAll('.vfc-months .vfc-item')
      .find(item => item.text() === 'Mar')
    await press(march.element, 'Enter')

    expect(calendarTitle(wrapper)).toBe('March 2026')
    expect(active().getAttribute('role')).toBe('gridcell')
  })

  it('closes the picker on Escape and focuses the title again', async () => {
    const { wrapper } = await mountPicker()
    const [month] = titleButtons(wrapper)
    await press(month, 'Enter')

    await press(active(), 'Escape')

    expect(active()).toBe(month)
    expect(month.getAttribute('aria-expanded')).toBe('false')
  })

  it('labels the picker arrows', async () => {
    const { wrapper } = await mountPicker()
    await press(titleButtons(wrapper)[0], 'Enter')

    const picker = wrapper.find('.vfc-months-container')

    expect(picker.find('button[aria-label="Previous year"]').exists()).toBe(
      true
    )
    expect(picker.find('button[aria-label="Next year"]').exists()).toBe(true)
  })
})
