import { describe, it, expect } from 'vitest'
import {
  mountCalendar,
  mountCalendarReady,
  clickDays,
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

describe('multiple date picker', () => {
  it('collects every clicked day in selectedDates', async () => {
    const { wrapper } = mountCalendar({ isMultipleDatePicker: true })

    await clickDays(wrapper, [3, 7, 12])

    expect(lastValue(wrapper).selectedDates).toEqual([
      { date: '3/10/2026', dateTime: false, hour: '00', minute: '00' },
      { date: '7/10/2026', dateTime: false, hour: '00', minute: '00' },
      { date: '12/10/2026', dateTime: false, hour: '00', minute: '00' }
    ])
  })

  it('removes a day from selectedDates when it is clicked again', async () => {
    const { wrapper } = mountCalendar({ isMultipleDatePicker: true })

    await clickDays(wrapper, [3, 7, 3])

    expect(lastValue(wrapper).selectedDates.map(item => item.date)).toEqual([
      '7/10/2026'
    ])
  })

  it('marks every selected day', async () => {
    const { wrapper } = mountCalendar({ isMultipleDatePicker: true })

    await clickDays(wrapper, [3, 7])

    expect(findDay(wrapper, 3).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 7).classList).toContain('vfc-marked')
    expect(findDay(wrapper, 4).classList).not.toContain('vfc-marked')
  })

  it('unmarks a day after it is toggled off', async () => {
    const { wrapper } = mountCalendar({ isMultipleDatePicker: true })

    await clickDays(wrapper, [3, 3])

    expect(findDay(wrapper, 3).classList).not.toContain('vfc-marked')
  })

  it('emits choseDay for each click', async () => {
    const { wrapper, events } = mountCalendar({ isMultipleDatePicker: true })

    await clickDays(wrapper, [3, 7])

    expect(eventsNamed(events, 'choseDay').map(item => item.date)).toEqual([
      '3/10/2026',
      '7/10/2026'
    ])
  })

  it('renders one tag per selected date in modal mode', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isMultipleDatePicker: true
    })
    await wrapper.trigger('focusin')

    await clickDays(wrapper, [3, 7])

    expect(
      wrapper.findAll('.vfc-tags-input-badge').map(tag => tag.text())
    ).toEqual(['3/10/2026', '7/10/2026'])
  })

  it('removes a date when its tag remove link is clicked', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true,
      modelValue: model
    })
    await wrapper.trigger('focusin')
    await clickDays(wrapper, [3, 7, 12])

    await wrapper.findAll('.vfc-tags-input-remove')[1].trigger('click')

    expect(model.selectedDates.map(item => item.date)).toEqual([
      '3/10/2026',
      '12/10/2026'
    ])
    expect(wrapper.findAll('.vfc-tags-input-badge')).toHaveLength(2)
  })

  it('removes a date with a labelled button instead of a link', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true
    })
    await wrapper.trigger('focusin')
    await clickDays(wrapper, [3, 7])

    const buttons = wrapper.findAll('.vfc-tags-input-remove')

    expect(buttons.map(button => button.element.tagName)).toEqual([
      'BUTTON',
      'BUTTON'
    ])
    expect(buttons.map(button => button.attributes('type'))).toEqual([
      'button',
      'button'
    ])
    expect(buttons.map(button => button.attributes('aria-label'))).toEqual([
      'Remove 3/10/2026',
      'Remove 7/10/2026'
    ])
  })

  it('translates the remove button label', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true,
      labels: { removeDate: 'Entfernen' }
    })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 3)

    expect(
      wrapper.find('.vfc-tags-input-remove').attributes('aria-label')
    ).toBe('Entfernen 3/10/2026')
  })

  it('renders a tag date as text', async () => {
    const model = emptyModel()
    model.selectedDates = [
      { date: '<b>9</b>', dateTime: false, hour: '00', minute: '00' }
    ]
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true,
      modelValue: model
    })

    const badge = wrapper.find('.vfc-tags-input-badge')

    expect(badge.find('b').exists()).toBe(false)
    expect(badge.text()).toBe('<b>9</b>')
  })

  it('names the tags input', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true
    })

    expect(wrapper.find('.vfc-tags-input input').attributes('aria-label')).toBe(
      'Add a date'
    )
  })

  it('returns focus to the tags input after a date is removed', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true
    })
    await wrapper.trigger('focusin')
    await clickDays(wrapper, [3, 7])
    const remove = wrapper.find('.vfc-tags-input-remove')
    remove.element.focus()

    await remove.trigger('click')

    expect(document.activeElement).toBe(
      wrapper.find('.vfc-tags-input input').element
    )
  })

  it('unmarks the calendar day when its tag is removed', async () => {
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true
    })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 7)

    await wrapper.find('.vfc-tags-input-remove').trigger('click')

    expect(findDay(wrapper, 7).classList).not.toContain('vfc-marked')
  })

  it('shows dates passed in through the model', async () => {
    const model = emptyModel()
    model.selectedDates = [
      { date: '9/10/2026', dateTime: false, hour: '00', minute: '00' }
    ]
    const { wrapper } = await mountCalendarReady({
      isMultipleDatePicker: true,
      modelValue: model
    })

    expect(findDay(wrapper, 9).classList).toContain('vfc-marked')
  })
})

describe('multiple date picker model with leading zeros', () => {
  const entry = date => ({ date, dateTime: false, hour: '00', minute: '00' })

  it('marks the selected days and exposes them as selected', async () => {
    const model = emptyModel()
    model.selectedDates = [entry('08/10/2026'), entry('12/10/2026')]
    const { wrapper } = await mountCalendarReady({
      isMultipleDatePicker: true,
      modelValue: model
    })

    ;[8, 12].forEach(day => {
      expect(findDay(wrapper, day).classList).toContain('vfc-marked')
      expect(findDay(wrapper, day).classList).toContain('vfc-borderd')
      expect(findDay(wrapper, day).getAttribute('aria-selected')).toBe('true')
    })
    expect(findDay(wrapper, 9).getAttribute('aria-selected')).toBe('false')
  })

  it('removes a padded entry when its day is clicked', async () => {
    const model = emptyModel()
    model.selectedDates = [entry('08/10/2026')]
    const { wrapper } = await mountCalendarReady({
      isMultipleDatePicker: true,
      modelValue: model
    })

    await clickDay(wrapper, 8)

    expect(lastValue(wrapper).selectedDates).toEqual([])
    expect(findDay(wrapper, 8).classList).not.toContain('vfc-marked')
  })
})
