import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'
import {
  mountCalendar,
  mountCalendarReady,
  clickDay,
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
