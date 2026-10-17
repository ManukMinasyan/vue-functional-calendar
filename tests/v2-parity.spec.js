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
  for (const day of scenario.days) {
    await clickDay(wrapper, day)
  }
  const emitted = wrapper.emitted('update:modelValue')
  const value = emitted ? JSON.parse(JSON.stringify(emitted.at(-1)[0])) : null
  if (value) delete value.currentDate
  wrapper.unmount()
  return { value, events }
}

describe('vue 2.10.0 oracle parity', () => {
  it.each(Object.entries(oracle.scenarios))(
    'replays %s with the same value and events',
    async (name, scenario) => {
      const { value, events } = await replay(scenario)

      expect(value).toEqual(scenario.value)
      expect(events).toEqual(scenario.events)
    }
  )
})
