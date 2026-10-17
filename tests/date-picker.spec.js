import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import {
  mountCalendar,
  mountCalendarReady,
  clickDay,
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

describe('date picker', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('selects the clicked day and formats it with the default dateFormat', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })

    await clickDay(wrapper, 10)

    expect(lastValue(wrapper).selectedDate).toBe('10/10/2026')
  })

  it.each([
    ['yyyy-mm-dd', '2026-10-10'],
    ['mm/dd/yyyy', '10/10/2026'],
    ['dd.mm.yyyy', '10.10.2026'],
    ['yyyy-mm-dd hh:mm', '2026-10-10 00:00']
  ])(
    'formats the selected date with dateFormat %s',
    async (format, expected) => {
      const { wrapper } = mountCalendar({
        isDatePicker: true,
        dateFormat: format
      })

      await clickDay(wrapper, 10)

      expect(lastValue(wrapper).selectedDate.split(' ')[0]).toBe(
        expected.split(' ')[0]
      )
    }
  )

  it('does not pad single digit days', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })

    await clickDay(wrapper, 5)

    expect(lastValue(wrapper).selectedDate).toBe('5/10/2026')
  })

  it('replaces the selection when another day is clicked', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })

    await clickDay(wrapper, 10)
    await clickDay(wrapper, 20)

    expect(lastValue(wrapper).selectedDate).toBe('20/10/2026')
    expect(findDay(wrapper, 10).classList).not.toContain('vfc-marked')
    expect(findDay(wrapper, 20).classList).toContain('vfc-marked')
  })

  it('emits dayClicked and then choseDay with the day item', async () => {
    const { wrapper, events } = mountCalendar({ isDatePicker: true })

    await clickDay(wrapper, 10)

    expect(events.map(([name]) => name)).toContain('dayClicked')
    expect(eventsNamed(events, 'choseDay')).toHaveLength(1)
    expect(eventsNamed(events, 'choseDay')[0]).toMatchObject({
      day: 10,
      date: '10/10/2026'
    })
  })

  it('emits update:modelValue with the full value shape', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })

    await clickDay(wrapper, 10)

    const value = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(Object.keys(value).sort()).toEqual(
      [
        'currentDate',
        'selectedDate',
        'selectedDateTime',
        'selectedHour',
        'selectedMinute',
        'selectedDatesItem',
        'selectedDates',
        'dateRange',
        'multipleDateRange'
      ].sort()
    )
    expect(value.currentDate).toEqual(new Date(2026, 9, 1))
  })

  it('emits dayClicked but no selection for a calendar without a picker mode', async () => {
    const { wrapper, events } = mountCalendar()

    await clickDay(wrapper, 10)

    expect(eventsNamed(events, 'dayClicked')).toHaveLength(1)
    expect(eventsNamed(events, 'choseDay')).toHaveLength(0)
    expect(lastValue(wrapper).selectedDate).toBe(false)
  })

  it('does not select the greyed days of the neighbouring months', async () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })
    const greyed = wrapper
      .findAll('.vfc-span-day.vfc-hide')
      .filter(day => day.text() === '30')

    expect(greyed).toHaveLength(1)
    expect(greyed[0].classes()).toContain('vfc-hide')
  })

  it('marks today with vfc-today using the system clock', () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 9, 15, 10))
    const { wrapper } = mountCalendar({ isDatePicker: true })

    expect(findDay(wrapper, 15).classList).toContain('vfc-today')
    expect(findDay(wrapper, 14).classList).not.toContain('vfc-today')
  })

  it('shows a selection passed through the model', async () => {
    const model = { ...emptyModel(), selectedDate: '12/10/2026' }
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      modelValue: model
    })

    expect(findDay(wrapper, 12).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 12).classList).toContain('vfc-borderd')
  })

  it('follows later changes to the model', async () => {
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      modelValue: emptyModel()
    })

    await wrapper.setProps({
      modelValue: { ...emptyModel(), selectedDate: '21/10/2026' }
    })
    await nextTick()

    expect(findDay(wrapper, 21).classList).toContain('vfc-marked')
  })

  it('writes the selection into the bound model object', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isDatePicker: true,
      modelValue: model
    })

    await clickDay(wrapper, 10)

    expect(model.selectedDate).toBe('10/10/2026')
  })

  it('opens on the month of newCurrentDate', () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      newCurrentDate: new Date(2027, 1, 14)
    })

    expect(wrapper.find('div.vfc-top-date').text()).toContain('February')
    expect(wrapper.find('div.vfc-top-date').text()).toContain('2027')
  })
})
