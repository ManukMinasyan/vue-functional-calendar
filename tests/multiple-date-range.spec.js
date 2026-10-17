import { describe, it, expect } from 'vitest'
import { h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import FunctionalCalendar from '../index.js'
import {
  FIXED_DATE,
  mountCalendar,
  mountCalendarReady,
  clickDay,
  clickDays,
  findDay,
  eventsNamed,
  lastValue
} from './helpers.js'

const options = { isDateRange: true, isMultipleDateRange: true }

describe('multiple date ranges', () => {
  it('collects each completed range in multipleDateRange', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDays(wrapper, [3, 5, 10, 12])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '3/10/2026', end: '5/10/2026' },
      { start: '10/10/2026', end: '12/10/2026' }
    ])
  })

  it('leaves the single dateRange empty', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDays(wrapper, [3, 5])

    expect(lastValue(wrapper).dateRange).toEqual({ start: '', end: '' })
  })

  it('keeps an unfinished range with only a start', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDays(wrapper, [3, 5, 10])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '3/10/2026', end: '5/10/2026' },
      { start: '10/10/2026', end: '' }
    ])
  })

  it('swaps a range chosen backwards', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDays(wrapper, [12, 10])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '10/10/2026', end: '12/10/2026' }
    ])
  })

  it('emits selectedDaysCount as ranges complete, as 2.x does', async () => {
    const { wrapper, events } = mountCalendar(options)

    await clickDays(wrapper, [3, 5, 10, 14])

    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([2, 2, 4])
  })

  it('marks the days inside each range', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDays(wrapper, [3, 6, 10, 12])

    expect(findDay(wrapper, 3).classList).toContain('vfc-start-marked')
    expect(findDay(wrapper, 6).classList).toContain('vfc-end-marked')
    expect(findDay(wrapper, 4).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 11).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 8).classList).not.toContain('vfc-marked')
  })

  it('shows a remove button only on the end day of a range', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDays(wrapper, [3, 5, 10, 12])

    const buttons = wrapper.findAll('.vfc-day .times')
    expect(buttons).toHaveLength(2)
    buttons.forEach(button => {
      expect(button.element.parentElement.classList).toContain('vfc-end-marked')
    })
  })

  it('removes a range when its end day button is clicked', async () => {
    const { wrapper } = mountCalendar(options)
    await clickDays(wrapper, [3, 5, 10, 12])

    await wrapper.findAll('.vfc-day .times')[0].trigger('click')

    expect(wrapper.vm.calendar.multipleDateRange).toEqual([
      { start: '10/10/2026', end: '12/10/2026' }
    ])
  })

  it('numbers the range markers', async () => {
    const { wrapper } = mountCalendar(options)

    await clickDays(wrapper, [3, 5, 10, 12])

    const markers = wrapper.findAll('.vfc-day .number').map(node =>
      [...node.element.childNodes]
        .filter(child => child.nodeType === Node.TEXT_NODE)
        .map(child => child.textContent)
        .join('')
        .trim()
    )
    expect(markers).toEqual(['0', '-1', '1', '1'])
  })

  it('shows ranges passed through the model', async () => {
    const model = {
      currentDate: new Date(2026, 9, 1),
      selectedDate: false,
      selectedDateTime: false,
      selectedHour: '00',
      selectedMinute: '00',
      selectedDatesItem: '',
      selectedDates: [],
      dateRange: { start: '', end: '' },
      multipleDateRange: [{ start: '6/10/2026', end: '9/10/2026' }]
    }
    const { wrapper } = await mountCalendarReady({
      ...options,
      modelValue: model
    })

    expect(findDay(wrapper, 6).classList).toContain('vfc-start-marked')
    expect(findDay(wrapper, 9).classList).toContain('vfc-end-marked')
    expect(findDay(wrapper, 7).classList).toContain('vfc-marked')
  })

  it('draws ranges on two calendars with different date formats', async () => {
    const modelWith = range => ({
      currentDate: new Date(2026, 9, 1),
      selectedDate: false,
      selectedDateTime: false,
      selectedHour: '00',
      selectedMinute: '00',
      selectedDatesItem: '',
      selectedDates: [],
      dateRange: { start: '', end: '' },
      multipleDateRange: [range]
    })
    const { wrapper: monthFirst } = await mountCalendarReady({
      ...options,
      dateFormat: 'mm/dd/yyyy',
      modelValue: modelWith({ start: '9/30/2026', end: '10/2/2026' })
    })
    const { wrapper: dayFirst } = await mountCalendarReady({
      ...options,
      modelValue: modelWith({ start: '29/9/2026', end: '2/10/2026' })
    })

    const band = (wrapper, day) =>
      findDay(wrapper, day).parentElement.querySelector('.vfc-base-start')
    expect(band(monthFirst, 1)).not.toBeNull()
    expect(band(dayFirst, 1)).not.toBeNull()
  })

  it('installs no helpers on String or Date prototypes', async () => {
    await mountCalendarReady(options)

    expect(String.prototype.inRange).toBeUndefined()
    expect(Date.prototype.getWeekNumber).toBeUndefined()
  })

  it('throws on a model whose last range has only one end', async () => {
    const { wrapper } = mountCalendar(options)
    let thrown
    const original = wrapper.vm.$.appContext.config.errorHandler
    wrapper.vm.$.appContext.config.errorHandler = err => {
      thrown = err
    }

    await wrapper.setProps({
      modelValue: { multipleDateRange: [{ start: '3/10/2026', end: '' }] }
    })
    wrapper.vm.$.appContext.config.errorHandler = original

    expect(thrown?.message).toBe('Invalid Data Range')
  })

  it('keeps working when a parent binds a multipleDateRange-only model one way', async () => {
    const errors = []
    const model = reactive({ multipleDateRange: [] })
    const wrapper = mount(
      {
        render: () =>
          h(FunctionalCalendar, {
            ...options,
            newCurrentDate: FIXED_DATE,
            modelValue: model
          })
      },
      {
        attachTo: document.body,
        global: { config: { errorHandler: error => errors.push(error) } }
      }
    )
    await nextTick()

    await clickDay(wrapper, 3)
    await clickDay(wrapper, 5)
    await clickDay(wrapper, 10)

    expect(errors).toEqual([])
    expect(model.multipleDateRange).toEqual([])
    expect(findDay(wrapper, 3).classList).toContain('vfc-start-marked')
    expect(findDay(wrapper, 4).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 5).classList).toContain('vfc-end-marked')
    expect(findDay(wrapper, 10).classList).toContain('vfc-start-marked')
    const emitted = wrapper
      .findComponent(FunctionalCalendar)
      .emitted('update:modelValue')
    expect(emitted.at(-1)[0].multipleDateRange).toEqual([
      { start: '3/10/2026', end: '5/10/2026' },
      { start: '10/10/2026', end: '' }
    ])
  })

  it('clears every range with the Clear Ranges button', async () => {
    const { wrapper } = mountCalendar({ ...options, canClearRange: true })
    await clickDay(wrapper, 3)
    await clickDay(wrapper, 5)
    const button = wrapper.find('.rangeCleaner span')
    expect(button.text()).toBe('Clear Ranges')
    expect(button.classes()).toContain('active')

    await button.trigger('click')

    expect(wrapper.vm.calendar.multipleDateRange).toEqual([])
    expect(button.classes()).toContain('disabled')
  })
})

describe('multiple date range selection rules', () => {
  it('selects a single day range when the same day is clicked twice', async () => {
    const { wrapper, events } = mountCalendar(options)

    await clickDays(wrapper, [10, 10])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '10/10/2026', end: '10/10/2026' }
    ])
    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([0])
  })

  it('extends a short range to minSelDays', async () => {
    const { wrapper } = mountCalendar({ ...options, minSelDays: 5 })

    await clickDays(wrapper, [10, 12])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '10/10/2026', end: '14/10/2026' }
    ])
  })

  it('moves the start back to reach minSelDays when the range is chosen backwards', async () => {
    const { wrapper } = mountCalendar({ ...options, minSelDays: 5 })

    await clickDays(wrapper, [12, 10])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '8/10/2026', end: '12/10/2026' }
    ])
  })

  it('emits the selected days count before the minSelDays extension', async () => {
    const { wrapper, events } = mountCalendar({ ...options, minSelDays: 5 })

    await clickDays(wrapper, [10, 12])

    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([2])
  })

  it('clamps a long range to maxSelDays', async () => {
    const { wrapper } = mountCalendar({ ...options, maxSelDays: 3 })

    await clickDays(wrapper, [10, 20])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '10/10/2026', end: '12/10/2026' }
    ])
  })

  it('moves the start forward to maxSelDays when the range is chosen backwards', async () => {
    const { wrapper } = mountCalendar({ ...options, maxSelDays: 3 })

    await clickDays(wrapper, [20, 10])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '18/10/2026', end: '20/10/2026' }
    ])
  })

  it('clamps only the range being completed', async () => {
    const { wrapper } = mountCalendar({ ...options, maxSelDays: 3 })

    await clickDays(wrapper, [3, 5, 10, 20])

    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '3/10/2026', end: '5/10/2026' },
      { start: '10/10/2026', end: '12/10/2026' }
    ])
  })
})
