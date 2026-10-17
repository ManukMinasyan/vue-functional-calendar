import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FunctionalCalendar, { FunctionalCalendar as Named } from '../index.js'
import { mountCalendar, dayNameTexts, clickDay, FIXED_DATE } from './helpers.js'

const globalDayNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const propDayNames = ['1', '2', '3', '4', '5', '6', '7']

const withPlugin = options => ({
  global: { plugins: [[FunctionalCalendar, options]] }
})

describe('plugin install', () => {
  it('exports the component as default and as a named export', () => {
    expect(Named).toBe(FunctionalCalendar)
    expect(typeof FunctionalCalendar.install).toBe('function')
    expect(FunctionalCalendar.name).toBe('FunctionalCalendar')
  })

  it('registers FunctionalCalendar globally', () => {
    const wrapper = mount(
      {
        props: ['date'],
        template: '<FunctionalCalendar :new-current-date="date" />'
      },
      { props: { date: FIXED_DATE }, ...withPlugin({}) }
    )

    expect(wrapper.find('.vfc-main-container').exists()).toBe(true)
  })

  it('exposes the options on globalProperties and through provide', () => {
    const options = { dayNames: globalDayNames }
    const { wrapper } = mountCalendar({}, withPlugin(options))

    expect(wrapper.vm.$getOptions()).toBe(options)
    expect(wrapper.vm.$.appContext.provides.functionalCalendarOptions).toBe(
      options
    )
  })
})

describe('global options', () => {
  it('applies global dayNames to a calendar without its own', () => {
    const { wrapper } = mountCalendar(
      {},
      withPlugin({ dayNames: globalDayNames })
    )

    expect(dayNameTexts(wrapper)).toEqual(globalDayNames)
  })

  it('applies other global options such as isDark and dateFormat', async () => {
    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      withPlugin({ isDark: true, dateFormat: 'yyyy-mm-dd' })
    )

    expect(wrapper.find('.vfc-main-container').classes()).toContain('vfc-dark')

    await clickDay(wrapper, 10)

    expect(wrapper.emitted('update:modelValue').at(-1)[0].selectedDate).toBe(
      '2026-10-10'
    )
  })

  it('lets a prop override a global option', () => {
    const { wrapper } = mountCalendar(
      { dayNames: propDayNames },
      withPlugin({ dayNames: globalDayNames })
    )

    expect(dayNameTexts(wrapper)).toEqual(propDayNames)
  })

  it('does not change the defaults of a calendar mounted without the plugin', () => {
    const { wrapper } = mountCalendar()

    expect(dayNameTexts(wrapper)).toEqual([
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
      'Su'
    ])
  })
})

describe('configs prop with multiple date ranges', () => {
  const options = {
    configs: { isDateRange: true, isMultipleDateRange: true },
    canClearRange: true
  }

  it('labels the cleaner for several ranges', () => {
    const { wrapper } = mountCalendar(options)

    expect(wrapper.find('.rangeCleaner span').text()).toBe('Clear Ranges')
  })

  it('clears every range', async () => {
    const { wrapper } = mountCalendar(options)
    await clickDay(wrapper, 3)
    await clickDay(wrapper, 5)
    expect(wrapper.vm.calendar.multipleDateRange).toHaveLength(1)

    await wrapper.find('.rangeCleaner span').trigger('click')

    expect(wrapper.vm.calendar.multipleDateRange).toEqual([])
  })
})

describe('configs prop', () => {
  it('reads settings from configs', () => {
    const { wrapper } = mountCalendar({
      configs: { dayNames: propDayNames, isDark: true }
    })

    expect(dayNameTexts(wrapper)).toEqual(propDayNames)
    expect(wrapper.find('.vfc-main-container').classes()).toContain('vfc-dark')
  })

  it('lets configs override global options', () => {
    const { wrapper } = mountCalendar(
      { configs: { dayNames: propDayNames } },
      withPlugin({ dayNames: globalDayNames })
    )

    expect(dayNameTexts(wrapper)).toEqual(propDayNames)
  })

  it('keeps global options that configs does not set', () => {
    const { wrapper } = mountCalendar(
      { configs: { isDark: true } },
      withPlugin({ dayNames: globalDayNames })
    )

    expect(dayNameTexts(wrapper)).toEqual(globalDayNames)
  })

  it('selects days according to configs', async () => {
    const { wrapper } = mountCalendar({
      configs: { isDatePicker: true, dateFormat: 'yyyy-mm-dd' }
    })

    await clickDay(wrapper, 10)

    expect(wrapper.emitted('update:modelValue').at(-1)[0].selectedDate).toBe(
      '2026-10-10'
    )
  })
})
