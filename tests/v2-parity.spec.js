import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FunctionalCalendar from '../index.js'
import oracle from './fixtures/v2-oracle.json'

const clickDay = async (wrapper, text) => {
  const target = [...wrapper.element.querySelectorAll('.vfc-day .vfc-span-day')]
    .filter(el => el.textContent.trim() === text)
    .find(el => !el.classList.contains('vfc-hide'))
  target?.click()
  await nextTick()
  return !!target
}

const absentClicks = {
  disabledDayNames: ['10'],
  rangeTime: ['14']
}

const replay = async scenario => {
  const events = []
  const wrapper = mount(FunctionalCalendar, {
    attachTo: document.body,
    props: {
      newCurrentDate: new Date(2026, 9, 1),
      ...scenario.props,
      onChoseDay: item => events.push(['choseDay', item.date]),
      onSelectedDaysCount: count => events.push(['selectedDaysCount', count])
    }
  })
  const absent = []
  for (const day of scenario.days) {
    if (!(await clickDay(wrapper, day))) {
      absent.push(day)
    }
  }
  const hiddenDayExists = [...wrapper.element.querySelectorAll('.vfc-span-day')]
    .filter(el => absent.includes(el.textContent.trim()))
    .some(el => el.classList.contains('vfc-hide'))
  const timePickerOpen = !!wrapper.element.querySelector(
    '.vfc-time-picker-container'
  )
  const emitted = wrapper.emitted('update:modelValue')
  const value = emitted ? JSON.parse(JSON.stringify(emitted.at(-1)[0])) : null
  if (value) delete value.currentDate
  wrapper.unmount()
  return { value, events, absent, hiddenDayExists, timePickerOpen }
}

describe('vue 2.10.0 oracle parity', () => {
  it.each(Object.entries(oracle.scenarios))(
    'replays %s with the same value and events',
    async (name, scenario) => {
      const { value, events, absent } = await replay(scenario)

      expect(value).toEqual(scenario.value)
      expect(events).toEqual(scenario.events)
      expect(absent).toEqual(absentClicks[name] ?? [])
    }
  )

  it('finds a disabled day in the grid, so a blocked click is not a missing element', async () => {
    const { absent, hiddenDayExists } = await replay(
      oracle.scenarios.disabledDayNames
    )

    expect(absent).toEqual(['10'])
    expect(hiddenDayExists).toBe(true)
  })

  it('has no second day to click once the time picker replaces the grid', async () => {
    const { absent, timePickerOpen } = await replay(oracle.scenarios.rangeTime)

    expect(absent).toEqual(['14'])
    expect(timePickerOpen).toBe(true)
  })
})
