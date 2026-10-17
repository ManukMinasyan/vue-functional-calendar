import { describe, it, expect, vi, afterEach } from 'vitest'
import { createSSRApp, h, nextTick, readonly, ref } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import FunctionalCalendar from '../index.js'
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

const isHidden = wrapper =>
  wrapper.find('.vfc-main-container').element.style.display === 'none'

const normalizeCapture = options =>
  typeof options === 'object' && options !== null
    ? !!options.capture
    : !!options

describe('modal mode', () => {
  it('starts closed and shows the calendar with the vfc-modal class once opened', async () => {
    const { wrapper } = mountCalendar({ isModal: true, isDatePicker: true })

    expect(isHidden(wrapper)).toBe(true)
    expect(wrapper.find('.vfc-main-container').classes()).toContain('vfc-modal')

    await wrapper.trigger('focusin')

    expect(isHidden(wrapper)).toBe(false)
  })

  it('emits opened and closed when the visibility changes', async () => {
    const { wrapper, events } = mountCalendar({
      isModal: true,
      isDatePicker: true
    })
    await nextTick()

    expect(eventsNamed(events, 'closed')).toHaveLength(1)

    await wrapper.trigger('focusin')
    expect(eventsNamed(events, 'opened')).toHaveLength(1)

    await wrapper.trigger('focusout')
    expect(eventsNamed(events, 'closed')).toHaveLength(2)
  })

  it('closes when focus leaves the popover', async () => {
    const { wrapper } = mountCalendar({ isModal: true, isDatePicker: true })
    await wrapper.trigger('focusin')

    await wrapper.trigger('focusout', { relatedTarget: document.body })

    expect(isHidden(wrapper)).toBe(true)
  })

  it('stays open when focus moves inside the popover', async () => {
    const { wrapper } = mountCalendar({ isModal: true, isDatePicker: true })
    await wrapper.trigger('focusin')

    await wrapper.trigger('focusout', {
      relatedTarget: wrapper.find('.vfc-main-container').element
    })

    expect(isHidden(wrapper)).toBe(false)
  })

  it('closes after a date is chosen when isAutoCloseable is set', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDatePicker: true,
      isAutoCloseable: true
    })
    await wrapper.trigger('focusin')

    await clickDay(wrapper, 10)

    expect(isHidden(wrapper)).toBe(true)
  })

  it('stays open after a date is chosen without isAutoCloseable', async () => {
    const { wrapper } = mountCalendar({ isModal: true, isDatePicker: true })
    await wrapper.trigger('focusin')

    await clickDay(wrapper, 10)

    expect(isHidden(wrapper)).toBe(false)
  })

  it('closes after the second range click when isAutoCloseable is set', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDateRange: true,
      isAutoCloseable: true
    })
    await wrapper.trigger('focusin')

    await clickDay(wrapper, 10)
    expect(isHidden(wrapper)).toBe(false)

    await clickDay(wrapper, 14)
    expect(isHidden(wrapper)).toBe(true)
  })

  it('keeps the modal open for the time picker and closes it with the picker', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDatePicker: true,
      isAutoCloseable: true,
      withTimePicker: true
    })
    await wrapper.trigger('focusin')

    await clickDay(wrapper, 10)

    expect(isHidden(wrapper)).toBe(false)
    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(true)

    await wrapper.find('.vfc-close').trigger('click')

    expect(isHidden(wrapper)).toBe(true)
  })

  it('closes after the time picker of the completed range is closed', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDateRange: true,
      isAutoCloseable: true,
      withTimePicker: true
    })
    await wrapper.trigger('focusin')

    await clickDay(wrapper, 10)
    await wrapper.find('.vfc-close').trigger('click')
    expect(isHidden(wrapper)).toBe(false)

    await clickDay(wrapper, 14)
    expect(isHidden(wrapper)).toBe(false)
    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(true)

    await wrapper.find('.vfc-close').trigger('click')
    expect(isHidden(wrapper)).toBe(true)
  })

  it('shows the grid again when the modal reopens after focus left with the time picker open', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDatePicker: true,
      withTimePicker: true
    })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)
    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(true)

    await wrapper.trigger('focusout', { relatedTarget: document.body })
    await wrapper.trigger('focusin')

    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(false)
    expect(wrapper.find('.vfc-calendar').exists()).toBe(true)
  })

  it('closes the modal when Escape closes the time picker of a completed range', async () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDateRange: true,
      isAutoCloseable: true,
      withTimePicker: true
    })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)
    await wrapper.find('.vfc-close').trigger('click')
    await clickDay(wrapper, 14)

    await wrapper.trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('.vfc-time-picker-container').exists()).toBe(false)
    expect(isHidden(wrapper)).toBe(true)
  })

  it('does not apply the vfc-modal class to a calendar that is not a picker', () => {
    const { wrapper } = mountCalendar({ isModal: true })

    expect(wrapper.find('.vfc-main-container').classes()).not.toContain(
      'vfc-modal'
    )
  })

  it('renders a read-only single input holding the selected date', async () => {
    const { wrapper } = mountCalendar({ isModal: true, isDatePicker: true })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)

    const input = wrapper.find('input.vfc-single-input')

    expect(input.element.value).toBe('10/10/2026')
    expect(input.attributes('readonly')).toBeDefined()
  })

  it('renders two inputs for a date range and fills them after selection', async () => {
    const { wrapper } = mountCalendar({ isModal: true, isDateRange: true })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)
    await clickDay(wrapper, 14)

    const inputs = wrapper.findAll('.vfc-multiple-input input')

    expect(inputs.map(input => input.element.value)).toEqual([
      '10/10/2026',
      '14/10/2026'
    ])
  })

  it('renders the tags input for a multiple date picker', () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isMultipleDatePicker: true
    })

    expect(wrapper.find('.vfc-tags-input-root').exists()).toBe(true)
  })

  it('applies vfc-dark to the main container and the input wrapper', () => {
    const { wrapper } = mountCalendar({
      isModal: true,
      isDatePicker: true,
      isDark: true
    })

    expect(wrapper.find('.vfc-main-container').classes()).toContain('vfc-dark')
    expect(wrapper.find('.vfc-dark input.vfc-single-input').exists()).toBe(true)
  })
})

describe('typeable inputs', () => {
  it('writes a typed date into the single input to the model', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model
    })

    await wrapper.find('input.vfc-single-input').setValue('15/10/2026')

    expect(model.selectedDate).toBe('15/10/2026')
  })

  it('parses a typed date with a custom dateFormat', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      dateFormat: 'yyyy-mm-dd',
      modelValue: model
    })

    await wrapper.find('input.vfc-single-input').setValue('2026-10-12')

    expect(model.selectedDate).toBe('2026-10-12')
  })

  it('ignores a typed value that is not a date', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model
    })

    await wrapper.find('input.vfc-single-input').setValue('abc')

    expect(model.selectedDate).toBe(false)
  })

  it('writes typed dates into the range inputs to the model', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start, end] = wrapper.findAll('.vfc-multiple-input input')

    await start.setValue('12/10/2026')
    await end.setValue('18/10/2026')

    expect(model.dateRange).toEqual({
      start: '12/10/2026',
      end: '18/10/2026'
    })
  })

  it('accepts a typed date in January', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model
    })

    await wrapper.find('input.vfc-single-input').setValue('15/1/2027')

    expect(model.selectedDate).toBe('15/1/2027')
  })

  it('accepts typed January dates in the range inputs', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start, end] = wrapper.findAll('.vfc-multiple-input input')

    await start.setValue('5/1/2027')
    await end.setValue('18/1/2027')

    expect(model.dateRange).toEqual({
      start: '5/1/2027',
      end: '18/1/2027'
    })
  })

  it('accepts a zero-padded day and month and stores them unpadded', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model
    })

    await wrapper.find('input.vfc-single-input').setValue('15/01/2027')

    expect(model.selectedDate).toBe('15/1/2027')
  })

  it('accepts an unpadded day and month', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model
    })

    await wrapper.find('input.vfc-single-input').setValue('5/3/2027')

    expect(model.selectedDate).toBe('5/3/2027')
  })

  it('accepts zero-padded dates with a custom dateFormat', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      dateFormat: 'yyyy-mm-dd',
      modelValue: model
    })

    await wrapper.find('input.vfc-single-input').setValue('2027-01-05')

    expect(model.selectedDate).toBe('2027-1-5')
  })

  it('accepts zero-padded dates in the range inputs', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start, end] = wrapper.findAll('.vfc-multiple-input input')

    await start.setValue('05/01/2027')
    await end.setValue('18/01/2027')

    expect(model.dateRange).toEqual({ start: '5/1/2027', end: '18/1/2027' })
  })

  it('keeps the model unchanged until the year has four digits', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model
    })
    const input = wrapper.find('input.vfc-single-input')

    for (const partial of ['12/03/', '12/03/2', '12/03/20', '12/03/202']) {
      await input.setValue(partial)
      expect(model.selectedDate, partial).toBe(false)
    }

    await input.setValue('12/03/2027')

    expect(model.selectedDate).toBe('12/3/2027')
  })

  it('keeps range inputs unchanged until the year has four digits', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start] = wrapper.findAll('.vfc-multiple-input input')

    await start.setValue('12/03/2')

    expect(model.dateRange.start).toBe('')
  })

  it('leaves the inputs read-only unless isTypeable is set', () => {
    const { wrapper } = mountCalendar({ isModal: true, isDateRange: true })

    wrapper.findAll('.vfc-multiple-input input').forEach(input => {
      expect(input.attributes('readonly')).toBeDefined()
    })
  })

  it('adds a typed date to the multiple date picker on enter', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true,
      modelValue: model
    })
    const input = wrapper.find('.vfc-tags-input input')

    await input.setValue('14/10/2026')
    await input.trigger('keydown.enter')

    expect(model.selectedDates.map(date => date.date)).toEqual(['14/10/2026'])
    expect(model.selectedDatesItem).toBe('')
  })
})

const FORMATS = [
  ['dd/mm/yyyy', (d, m, y) => `${d}/${m}/${y}`],
  ['mm/dd/yyyy', (d, m, y) => `${m}/${d}/${y}`],
  ['yyyy-mm-dd', (d, m, y) => `${y}-${m}-${d}`],
  ['dd.mm.yyyy', (d, m, y) => `${d}.${m}.${y}`]
].flatMap(([format, build]) => [
  [format, build],
  [`${format} hh:mm`, build]
])

describe.each(FORMATS)('typed dates with dateFormat %s', (format, build) => {
  const mountTyped = () => {
    const model = emptyModel()
    return mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      dateFormat: format,
      modelValue: model
    }).then(({ wrapper }) => ({
      model,
      input: wrapper.find('input.vfc-single-input')
    }))
  }

  it('stores a zero-padded date unpadded', async () => {
    const { model, input } = await mountTyped()

    await input.setValue(build('05', '01', '2027'))

    expect(model.selectedDate).toBe(build('5', '1', '2027'))
  })

  it.each([
    ['31', '02', '2027'],
    ['29', '2', '2027'],
    ['32', '01', '2027'],
    ['00', '05', '2027'],
    ['15', '13', '2027'],
    ['15', '00', '2027'],
    ['15', '05', '0099']
  ])('rejects %s/%s/%s', async (day, month, year) => {
    const { model, input } = await mountTyped()

    await input.setValue(build(day, month, year))

    expect(model.selectedDate).toBe(false)
  })

  it('accepts February 29 in a leap year', async () => {
    const { model, input } = await mountTyped()

    await input.setValue(build('29', '02', '2028'))

    expect(model.selectedDate).toBe(build('29', '2', '2028'))
  })

  it('does not commit while a part is still empty', async () => {
    const { model, input } = await mountTyped()
    const [first] = build('12', '11', '2027').split(/[/.-]/)
    const separator = build('1', '1', '2027').match(/[/.-]/)[0]

    await input.setValue(`${first}${separator}`)
    await input.setValue(
      build('12', '11', '2027').split(separator).slice(0, 2).join(separator) +
        separator
    )

    expect(model.selectedDate).toBe(false)
  })

  const yearLast = build('1', '1', '2027').endsWith('2027')

  it.skipIf(!yearLast)('never shows a fifth year digit', async () => {
    const { input } = await mountTyped()

    await input.setValue(`${build('05', '01', '2027')}7`)

    expect(input.element.value).toBe(build('5', '1', '2027'))
  })

  it.skipIf(yearLast)(
    'rolls a fifth year digit into the next part',
    async () => {
      const { model, input } = await mountTyped()

      await input.setValue('20277')

      expect(input.element.value).toBe('2027-7')
      expect(model.selectedDate).toBe(false)
    }
  )
})

describe('typed input filtering', () => {
  it('drops characters the format cannot hold', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model
    })
    const input = wrapper.find('input.vfc-single-input')

    await input.setValue('15/01/2027abc')

    expect(input.element.value).toBe('15/1/2027')
    expect(model.selectedDate).toBe('15/1/2027')
  })

  it('caps the year in both range inputs', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start, end] = wrapper.findAll('.vfc-multiple-input input')

    await start.setValue('05/01/20277')
    await end.setValue('18/01/20277')

    expect([start.element.value, end.element.value]).toEqual([
      '5/1/2027',
      '18/1/2027'
    ])
    expect(model.dateRange).toEqual({ start: '5/1/2027', end: '18/1/2027' })
  })

  it('rejects an impossible date in a range input', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start] = wrapper.findAll('.vfc-multiple-input input')

    await start.setValue('31/02/2027')

    expect(model.dateRange.start).toBe('')
  })
})

describe('typing at the caret', () => {
  const mountTypeable = async (props = {}) => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDatePicker: true,
      isTypeable: true,
      modelValue: model,
      ...props
    })
    return { model, input: wrapper.find('input.vfc-single-input').element }
  }

  const edit = async (
    input,
    value,
    caret,
    inputType = 'insertText',
    data = null
  ) => {
    input.value = value
    input.setSelectionRange(caret, caret)
    input.dispatchEvent(
      new InputEvent('input', { inputType, data, bubbles: true })
    )
    await nextTick()
  }

  it('drops a digit typed into a full month without touching other parts', async () => {
    const { input } = await mountTypeable()

    await edit(input, '5/112/2027', 5)

    expect(input.value).toBe('5/11/2027')
    expect(input.selectionStart).toBe(4)
  })

  it('drops a third day digit typed mid-string', async () => {
    const { input } = await mountTypeable()

    await edit(input, '151/01/20', 3)

    expect(input.value).toBe('15/01/20')
    expect(input.selectionStart).toBe(2)
  })

  it('drops a fifth year digit typed at the end', async () => {
    const { model, input } = await mountTypeable()

    await edit(input, '12/03/20277', 11)

    expect(model.selectedDate).toBe('12/3/2027')
    expect(input.value).toBe('12/3/2027')
  })

  it('moves a digit that overflows the last typed part into the next part', async () => {
    const { input } = await mountTypeable()

    await edit(input, '151', 3)

    expect(input.value).toBe('15/1')
    expect(input.selectionStart).toBe(4)
  })

  it('removes a typed letter and keeps the caret in place', async () => {
    const { input } = await mountTypeable()

    await edit(input, '15a/01', 3)

    expect(input.value).toBe('15/01')
    expect(input.selectionStart).toBe(2)
  })

  it.each(['-', '.', ' '])(
    'turns a typed %j into the format separator',
    async char => {
      const { input } = await mountTypeable()

      await edit(input, `15${char}`, 3)

      expect(input.value).toBe('15/')
      expect(input.selectionStart).toBe(3)
    }
  )

  it('rejects a second separator in a row', async () => {
    const { input } = await mountTypeable()

    await edit(input, '15//', 4)

    expect(input.value).toBe('15/')
  })

  it('leaves deletions alone', async () => {
    const { input } = await mountTypeable()

    await edit(input, '5//2027', 2, 'deleteContentBackward')

    expect(input.value).toBe('5//2027')
    expect(input.selectionStart).toBe(2)
  })

  it('keeps a time suffix while editing the date', async () => {
    const { input } = await mountTypeable({ dateFormat: 'dd/mm/yyyy hh:mm' })

    await edit(input, '5/112/20 10:30', 5)

    expect(input.value).toBe('5/11/20 10:30')
    expect(input.selectionStart).toBe(4)
  })

  it.each([['15-01-2027'], ['15.01.2027'], ['15 01 2027'], ['15/01/2027']])(
    'normalises a pasted %s',
    async pasted => {
      const { model, input } = await mountTypeable()

      await edit(input, pasted, pasted.length, 'insertFromPaste')

      expect(model.selectedDate).toBe('15/1/2027')
      expect(input.value).toBe('15/1/2027')
    }
  )

  it('treats a multi-character insertText as a paste', async () => {
    const { model, input } = await mountTypeable()

    await edit(input, '15-01-2027', 10, 'insertText', '15-01-2027')

    expect(model.selectedDate).toBe('15/1/2027')
  })

  it('normalises pasted separators in a range input', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start] = wrapper.findAll('.vfc-multiple-input input')

    await edit(start.element, '05.01.2027', 10, 'insertFromPaste')

    expect(model.dateRange.start).toBe('5/1/2027')
  })

  it('normalises pasted separators into a year-first format', async () => {
    const { model, input } = await mountTypeable({ dateFormat: 'yyyy-mm-dd' })

    await edit(input, '2027/01/05', 10, 'insertFromPaste')

    expect(model.selectedDate).toBe('2027-1-5')
  })

  const withSelectedTime = {
    dateFormat: 'dd/mm/yyyy hh:mm',
    displayTimeInput: true,
    modelValue: {
      ...emptyModel(),
      selectedDate: '15/1/2027',
      selectedHour: '10',
      selectedMinute: '30'
    }
  }

  it('reorders a pasted ISO date into the format', async () => {
    const { model, input } = await mountTypeable()

    await edit(input, '2027-01-15', 10, 'insertFromPaste')

    expect(model.selectedDate).toBe('15/1/2027')
    expect(input.value).toBe('15/1/2027')
  })

  it('keeps pasted text that is not a date as given', async () => {
    const { model, input } = await mountTypeable()

    await edit(input, '15 Jan 2027', 11, 'insertFromPaste')

    expect(input.value).toBe('15 Jan 2027')
    expect(model.selectedDate).toBe(false)
  })

  it('commits an autofilled date', async () => {
    const { model, input } = await mountTypeable()

    input.value = '2027-01-15'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()

    expect(model.selectedDate).toBe('15/1/2027')
  })

  it('leaves the input alone while an IME composes', async () => {
    const { model, input } = await mountTypeable()

    input.value = '１５/０１/２０２７'
    input.dispatchEvent(
      new InputEvent('input', {
        inputType: 'insertCompositionText',
        isComposing: true,
        bubbles: true
      })
    )
    await nextTick()

    expect(input.value).toBe('１５/０１/２０２７')
    expect(model.selectedDate).toBe(false)
  })

  it('converts full-width digits once the composition ends', async () => {
    const { model, input } = await mountTypeable()

    input.value = '１５/０１/２０２７'
    input.dispatchEvent(
      new CompositionEvent('compositionend', { bubbles: true })
    )
    await nextTick()

    expect(model.selectedDate).toBe('15/1/2027')
  })

  it('converts full-width digits in a range input once the composition ends', async () => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isDateRange: true,
      isTypeable: true,
      modelValue: model
    })
    const [start] = wrapper.findAll('.vfc-multiple-input input')

    start.element.value = '０５/０１/２０２７'
    start.element.dispatchEvent(
      new CompositionEvent('compositionend', { bubbles: true })
    )
    await nextTick()

    expect(model.dateRange.start).toBe('5/1/2027')
  })

  it('leaves digits typed into the time alone', async () => {
    const { input } = await mountTypeable(withSelectedTime)

    await edit(input, '15/1/2027 10:3', 14)

    expect(input.value).toBe('15/1/2027 10:3')
    expect(input.selectionStart).toBe(14)
  })

  it('keeps a space typed after a complete date', async () => {
    const { input } = await mountTypeable(withSelectedTime)

    await edit(input, '15/1/2027 ', 10)

    expect(input.value).toBe('15/1/2027 ')
  })

  it('leaves room for the time in the input length', async () => {
    const { input } = await mountTypeable({
      dateFormat: 'dd/mm/yyyy',
      displayTimeInput: true,
      withTimePicker: true
    })

    expect(input.maxLength).toBe('dd/mm/yyyy hh:mm'.length)
  })
})

describe('multiple date picker input', () => {
  const addDate = async text => {
    const model = emptyModel()
    const { wrapper } = await mountCalendarReady({
      isModal: true,
      isMultipleDatePicker: true,
      modelValue: model
    })
    const input = wrapper.find('.vfc-tags-input input')
    await input.setValue(text)
    await input.trigger('keydown.enter')
    return model
  }

  it('stores a zero-padded date unpadded', async () => {
    const model = await addDate('05/01/2027')

    expect(model.selectedDates.map(date => date.date)).toEqual(['5/1/2027'])
    expect(model.selectedDatesItem).toBe('')
  })

  it.each(['31/02/2027', '29/2/2027', '00/05/2027', '15/1/2'])(
    'rejects %s',
    async text => {
      const model = await addDate(text)

      expect(model.selectedDates).toEqual([])
      expect(model.selectedDatesItem).toBe(text)
    }
  )
})

describe('listener cleanup', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const recordListeners = mountOptions => {
    const spies = [
      vi.spyOn(EventTarget.prototype, 'addEventListener'),
      vi.spyOn(window, 'addEventListener')
    ]
    const removers = [
      vi.spyOn(EventTarget.prototype, 'removeEventListener'),
      vi.spyOn(window, 'removeEventListener')
    ]
    const mounted = mountCalendar(mountOptions)
    const vm = mounted.wrapper.vm
    const owned = [vm.onFocusIn, vm.onFocusOut, vm.hideMonthYearPicker]
    const collect = list =>
      list.flatMap(spy =>
        spy.mock.calls.map((args, index) => ({
          target: spy.mock.contexts[index],
          type: args[0],
          listener: args[1],
          capture: normalizeCapture(args[2])
        }))
      )
    return {
      ...mounted,
      owned,
      added: () => collect(spies),
      removed: () => collect(removers)
    }
  }

  it('removes every listener it added to the popover and window on unmount', () => {
    const { wrapper, owned, added, removed } = recordListeners({
      isModal: true,
      isDatePicker: true
    })
    const ownListeners = added().filter(call => owned.includes(call.listener))
    expect(ownListeners.map(call => call.type).sort()).toEqual([
      'click',
      'focusin',
      'focusout'
    ])

    wrapper.unmount()

    ownListeners.forEach(call => {
      const wasRemoved = removed().some(
        removal =>
          removal.target === call.target &&
          removal.type === call.type &&
          removal.listener === call.listener &&
          removal.capture === call.capture
      )
      expect(wasRemoved, `${call.type} listener removed`).toBe(true)
    })
  })

  it('stops reacting to focus once unmounted', () => {
    const { wrapper } = mountCalendar({ isModal: true, isDatePicker: true })
    const popover = wrapper.element
    const vm = wrapper.vm
    wrapper.unmount()

    popover.dispatchEvent(new FocusEvent('focusin'))

    expect(vm.showCalendar).toBe(false)
  })
})

describe('empty model', () => {
  const mountWithEmptyModel = async props => {
    const model = ref({})
    const wrapper = mount(
      {
        render: () =>
          h(FunctionalCalendar, {
            ...props,
            modelValue: model.value,
            'onUpdate:modelValue': value => (model.value = value)
          })
      },
      { attachTo: document.body }
    )
    await nextTick()
    return { model, wrapper }
  }

  it('writes a typed date to an empty model', async () => {
    const { model, wrapper } = await mountWithEmptyModel({
      isModal: true,
      isDatePicker: true,
      isTypeable: true
    })

    await wrapper.find('input.vfc-single-input').setValue('15/01/2027')

    expect(model.value.selectedDate).toBe('15/1/2027')
  })

  it('writes a date added in the tags input to an empty model', async () => {
    const { model, wrapper } = await mountWithEmptyModel({
      isModal: true,
      isMultipleDatePicker: true
    })
    const input = wrapper.find('.vfc-tags-input input')

    await input.setValue('05/01/2027')
    await input.trigger('keydown.enter')

    expect(model.value.selectedDates.map(date => date.date)).toEqual([
      '5/1/2027'
    ])
  })
})

describe('model intake', () => {
  const mountWithErrors = async props => {
    const errors = []
    const mounted = mountCalendar(props, {
      global: { config: { errorHandler: error => errors.push(error) } }
    })
    await nextTick()
    return { ...mounted, errors }
  }

  const isMarked = (wrapper, text) =>
    findDay(wrapper, text).classList.contains('vfc-marked')

  it('clears the selection when the model is reset to an empty object', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      modelValue: emptyModel()
    })
    await clickDay(wrapper, 10)
    expect(isMarked(wrapper, 10)).toBe(true)

    await wrapper.setProps({ modelValue: {} })

    expect(isMarked(wrapper, 10)).toBe(false)
  })

  it('clears the selection when the model is reset to a full empty model', async () => {
    const { wrapper } = mountCalendar({
      isDatePicker: true,
      modelValue: emptyModel()
    })
    await clickDay(wrapper, 10)

    await wrapper.setProps({ modelValue: emptyModel() })

    expect(isMarked(wrapper, 10)).toBe(false)
  })

  it('stays usable when the model is null', async () => {
    const { wrapper, errors } = await mountWithErrors({
      isDatePicker: true,
      modelValue: null
    })

    await clickDay(wrapper, 10)

    expect(errors).toEqual([])
    expect(lastValue(wrapper).selectedDate).toBe('10/10/2026')
  })

  it('mounts with a model that has no dateRange', async () => {
    const { wrapper, errors } = await mountWithErrors({
      isDatePicker: true,
      modelValue: { selectedDate: '10/10/2026' }
    })

    expect(errors).toEqual([])
    expect(isMarked(wrapper, 10)).toBe(true)
  })

  it('mounts with a dateRange whose start and end are false', async () => {
    const { wrapper, errors } = await mountWithErrors({
      isDateRange: true,
      modelValue: { ...emptyModel(), dateRange: { start: false, end: false } }
    })

    expect(errors).toEqual([])
    expect(wrapper.find('.vfc-calendar').exists()).toBe(true)
  })
})

describe('model intake with unusual values', () => {
  const mountModel = async (modelValue, props = { isDatePicker: true }) => {
    const errors = []
    const mounted = mountCalendar(
      { ...props, modelValue },
      { global: { config: { errorHandler: error => errors.push(error) } } }
    )
    await nextTick()
    return { ...mounted, errors }
  }

  const isMarked = (wrapper, text) =>
    findDay(wrapper, text).classList.contains('vfc-marked')

  it('shows the selection of a readonly model without writing to it', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { wrapper, errors } = await mountModel(
      readonly({ selectedDate: '10/10/2026' })
    )

    await clickDay(wrapper, 12)

    expect(errors).toEqual([])
    expect(warn).not.toHaveBeenCalled()
    expect(lastValue(wrapper).selectedDate).toBe('12/10/2026')
    warn.mockRestore()
  })

  it('works with a readonly empty model', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { wrapper, errors } = await mountModel(readonly({}))

    await clickDay(wrapper, 12)

    expect(errors).toEqual([])
    expect(warn).not.toHaveBeenCalled()
    expect(isMarked(wrapper, 12)).toBe(true)
    warn.mockRestore()
  })

  it('works with a frozen model and leaves it untouched', async () => {
    const model = Object.freeze({ selectedDate: '10/10/2026' })
    const { wrapper, errors } = await mountModel(model)

    expect(isMarked(wrapper, 10)).toBe(true)
    await clickDay(wrapper, 12)

    expect(errors).toEqual([])
    expect(isMarked(wrapper, 12)).toBe(true)
    expect(model).toEqual({ selectedDate: '10/10/2026' })
  })

  it('works with a frozen empty model', async () => {
    const { wrapper, errors } = await mountModel(Object.freeze({}))

    await clickDay(wrapper, 12)

    expect(errors).toEqual([])
    expect(isMarked(wrapper, 12)).toBe(true)
  })

  it('does not adopt a Date as the model', async () => {
    const model = new Date()
    const { wrapper, errors } = await mountModel(model)

    await clickDay(wrapper, 12)

    expect(errors).toEqual([])
    expect(isMarked(wrapper, 12)).toBe(true)
    expect(Object.keys(model)).toEqual([])
  })

  it.each([false, '', 0, null])(
    'mounts with a dateRange of %j',
    async dateRange => {
      const { wrapper, errors } = await mountModel(
        { selectedDate: '10/10/2026', dateRange },
        { isDatePicker: true }
      )

      expect(errors).toEqual([])
      expect(isMarked(wrapper, 10)).toBe(true)
    }
  )

  it('mounts with a null multipleDateRange', async () => {
    const { wrapper, errors } = await mountModel(
      { multipleDateRange: null },
      { isDateRange: true, isMultipleDateRange: true }
    )

    await clickDay(wrapper, 3)
    await clickDay(wrapper, 5)

    expect(errors).toEqual([])
    expect(lastValue(wrapper).multipleDateRange).toEqual([
      { start: '3/10/2026', end: '5/10/2026' }
    ])
  })
})

describe('model intake at creation', () => {
  it('keeps a preloaded range when newCurrentDate is set', async () => {
    const model = ref({
      dateRange: { start: '05/10/2026', end: '20/10/2026' }
    })
    const wrapper = mount(
      {
        render: () =>
          h(FunctionalCalendar, {
            isDateRange: true,
            newCurrentDate: new Date(2026, 9, 1),
            modelValue: model.value,
            'onUpdate:modelValue': value => (model.value = value)
          })
      },
      { attachTo: document.body }
    )
    await nextTick()
    await nextTick()

    expect(wrapper.findAll('.vfc-marked').length).toBeGreaterThan(0)
    expect(model.value.dateRange).toEqual({
      start: '05/10/2026',
      end: '20/10/2026'
    })
  })

  it('renders the bound selection on the server', async () => {
    const app = createSSRApp(FunctionalCalendar, {
      isDatePicker: true,
      newCurrentDate: new Date(2026, 9, 1),
      modelValue: { selectedDate: '10/10/2026' }
    })

    const html = await renderToString(app)

    expect(html).toContain('aria-selected="true"')
  })
})

describe('range model sync', () => {
  it('emits the chosen range as the model value', async () => {
    const { wrapper } = mountCalendar({ isModal: true, isDateRange: true })
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)
    await clickDay(wrapper, 14)

    expect(lastValue(wrapper).dateRange).toEqual({
      start: '10/10/2026',
      end: '14/10/2026'
    })
  })
})
