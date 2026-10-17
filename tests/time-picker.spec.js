import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import FunctionalCalendar from '../index.js'
import {
  mountCalendar,
  clickDay,
  findDay,
  eventsNamed,
  lastValue
} from './helpers.js'

const items = (wrapper, list) =>
  wrapper.findAll(`.vfc-time-picker__list--${list} .vfc-time-picker__item`)

const selectedText = (wrapper, list) =>
  items(wrapper, list)
    .filter(item => item.classes('vfc-time-picker__item--selected'))
    .map(item => item.text())

const pick = async (wrapper, list, text) => {
  await items(wrapper, list)
    .find(item => item.text() === text)
    .trigger('click')
}

describe('time picker list height', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const listHeights = wrapper =>
    wrapper
      .findAll('.vfc-time-picker__list')
      .map(list => list.element.style.height)

  it('sizes the lists when the calendar is not attached to the document', async () => {
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(400)
    const wrapper = mount(FunctionalCalendar, {
      props: {
        isDatePicker: true,
        withTimePicker: true,
        newCurrentDate: new Date(2026, 9, 1)
      }
    })

    await clickDay(wrapper, 10)

    expect(listHeights(wrapper)).toEqual(['280px', '280px'])
    wrapper.unmount()
  })

  it('sizes the lists of each calendar on a page separately', async () => {
    let second
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(
      function () {
        return this === second?.element ? 300 : 400
      }
    )
    const options = {
      attachTo: document.body,
      props: {
        isDatePicker: true,
        withTimePicker: true,
        newCurrentDate: new Date(2026, 9, 1)
      }
    }
    const first = mount(FunctionalCalendar, options)
    second = mount(FunctionalCalendar, options)

    await clickDay(first, 10)
    await clickDay(second, 10)

    expect(listHeights(first)).toEqual(['280px', '280px'])
    expect(listHeights(second)).toEqual(['180px', '180px'])
    first.unmount()
    second.unmount()
  })
})

describe('time picker with a date picker', () => {
  it('opens in place of the calendar after a day is chosen', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      withTimePicker: true
    })
    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(false)

    await clickDay(wrapper, 10)

    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(true)
    expect(wrapper.find('.vfc-calendars-container').exists()).toBe(false)
  })

  it('lists 24 hours and 60 minutes by default', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      withTimePicker: true
    })
    await clickDay(wrapper, 10)

    expect(items(wrapper, 'hours')).toHaveLength(24)
    expect(items(wrapper, 'minutes')).toHaveLength(60)
    expect(items(wrapper, 'hours')[9].text()).toBe('09')
  })

  it('starts on 00:00 and shows the date time in the header', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      withTimePicker: true
    })
    await clickDay(wrapper, 10)

    expect(selectedText(wrapper, 'hours')).toEqual(['00'])
    expect(selectedText(wrapper, 'minutes')).toEqual(['00'])
    expect(wrapper.find('.vfc-modal-time-line').text()).toBe('10/10/2026 00:00')
  })

  it('updates selectedHour, selectedMinute and selectedDateTime', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      withTimePicker: true
    })
    await clickDay(wrapper, 10)

    await pick(wrapper, 'hours', '13')
    await pick(wrapper, 'minutes', '45')

    expect(selectedText(wrapper, 'hours')).toEqual(['13'])
    expect(selectedText(wrapper, 'minutes')).toEqual(['45'])
    expect(lastValue(wrapper)).toMatchObject({
      selectedDate: '10/10/2026',
      selectedHour: 13,
      selectedMinute: 45,
      selectedDateTime: '10/10/2026 13:45'
    })
  })

  it('limits the lists to activeHours and activeMinutes', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      withTimePicker: true,
      activeHours: [9, 10, 11],
      activeMinutes: [0, 15, 30, 45]
    })
    await clickDay(wrapper, 10)

    expect(items(wrapper, 'hours').map(item => item.text())).toEqual([
      '09',
      '10',
      '11'
    ])
    expect(items(wrapper, 'minutes').map(item => item.text())).toEqual([
      '00',
      '15',
      '30',
      '45'
    ])
    expect(selectedText(wrapper, 'hours')).toEqual(['09'])
  })

  it('returns to the calendar when the close control is clicked', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      withTimePicker: true
    })
    await clickDay(wrapper, 10)
    await pick(wrapper, 'hours', '07')

    await wrapper.find('.vfc-close').trigger('click')

    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(false)
    expect(findDay(wrapper, 10).classList).toContain('vfc-marked')
    expect(lastValue(wrapper).selectedDateTime).toBe('10/10/2026 07:00')
  })
})

describe('time picker with a date range', () => {
  const rangeOptions = { isDateRange: true, withTimePicker: true }

  it('opens after the first click with the start time', async () => {
    const { wrapper } = mountCalendar(rangeOptions)

    await clickDay(wrapper, 10)

    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(true)
    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026 00:00',
      end: ''
    })
  })

  it('edits the start time while the start date is active', async () => {
    const { wrapper } = mountCalendar(rangeOptions)
    await clickDay(wrapper, 10)

    await pick(wrapper, 'hours', '05')
    await pick(wrapper, 'minutes', '30')

    expect(wrapper.vm.calendar.dateRange.start).toBe('10/10/2026 05:30')
  })

  it('edits the end time once the range is complete', async () => {
    const { wrapper, events } = mountCalendar(rangeOptions)
    await clickDay(wrapper, 10)
    await pick(wrapper, 'hours', '05')
    await wrapper.find('.vfc-close').trigger('click')

    await clickDay(wrapper, 14)

    expect(eventsNamed(events, 'selectedDaysCount')).toEqual([4])
    const spans = wrapper.findAll('.vfc-modal-time-line > span > span')
    expect(spans.map(span => span.text())).toEqual([
      '10/10/2026 05:00',
      '-',
      '14/10/2026 00:00'
    ])
    expect(spans[2].classes()).toContain('vfc-active')

    await pick(wrapper, 'hours', '18')
    expect(wrapper.vm.calendar.dateRange).toEqual({
      start: '10/10/2026 05:00',
      end: '14/10/2026 18:00'
    })

    await spans[0].trigger('click')
    await nextTick()

    expect(
      wrapper.findAll('.vfc-modal-time-line > span > span')[0].classes()
    ).toContain('vfc-active')
    expect(selectedText(wrapper, 'hours')).toEqual(['05'])
  })
})

describe('time picker with multiple dates', () => {
  it('stores a time on each selected date', async () => {
    const { wrapper } = mountCalendar({
      isMultipleDatePicker: true,
      withTimePicker: true
    })
    await clickDay(wrapper, 3)
    await pick(wrapper, 'hours', '08')
    await wrapper.find('.vfc-close').trigger('click')
    await clickDay(wrapper, 7)
    await pick(wrapper, 'hours', '09')
    await pick(wrapper, 'minutes', '15')

    expect(lastValue(wrapper).selectedDates).toEqual([
      {
        date: '3/10/2026',
        dateTime: '3/10/2026 08:00',
        hour: '08',
        minute: '00'
      },
      {
        date: '7/10/2026',
        dateTime: '7/10/2026 09:15',
        hour: '09',
        minute: 15
      }
    ])
  })
})

describe('time in the input', () => {
  it('appends hh:mm to the placeholder when displayTimeInput is set', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDatePicker: true,
      displayTimeInput: true,
      dateFormat: 'yyyy-mm-dd'
    })
    await nextTick()

    expect(
      wrapper.find('input.vfc-single-input').attributes('placeholder')
    ).toBe('yyyy-mm-dd hh:mm')
  })

  it('shows the selected time next to the date', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDatePicker: true,
      displayTimeInput: true
    })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)

    expect(wrapper.find('input.vfc-single-input').element.value).toBe(
      '10/10/2026 00:00'
    )
  })
})
