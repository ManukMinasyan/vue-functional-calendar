import { afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { h, nextTick, reactive, toRaw } from 'vue'
import FunctionalCalendar from '../index.js'

enableAutoUnmount(afterEach)

export const FIXED_DATE = new Date(2026, 9, 1)

const EVENT_NAMES = [
  'opened',
  'closed',
  'dayClicked',
  'choseDay',
  'selectedDaysCount',
  'dayMouseOver',
  'changedMonth',
  'changedYear'
]

const snapshot = payload => {
  if (payload instanceof Date) {
    return new Date(payload.getTime())
  }
  if (payload && typeof payload === 'object') {
    return { ...toRaw(payload) }
  }
  return payload
}

export const mountCalendar = (props = {}, options = {}) => {
  const events = []
  const listeners = Object.fromEntries(
    EVENT_NAMES.map(name => [
      `on${name[0].toUpperCase()}${name.slice(1)}`,
      payload => events.push([name, snapshot(payload)])
    ])
  )
  const wrapper = mount(FunctionalCalendar, {
    attachTo: document.body,
    props: { newCurrentDate: FIXED_DATE, ...listeners, ...props },
    ...options
  })
  return { wrapper, events }
}

export const mountParent = (state, calendarProps = {}) => {
  const reactiveState = reactive(state)
  const wrapper = mount(
    {
      render: () =>
        h(FunctionalCalendar, {
          newCurrentDate: FIXED_DATE,
          ...calendarProps,
          ...reactiveState
        })
    },
    { attachTo: document.body }
  )
  return {
    wrapper,
    state: reactiveState,
    calendar: wrapper.findComponent(FunctionalCalendar).vm
  }
}

export const mountCalendarReady = async (props = {}, options = {}) => {
  const mounted = mountCalendar(props, options)
  await nextTick()
  return mounted
}

export const eventsNamed = (events, name) =>
  events
    .filter(([eventName]) => eventName === name)
    .map(([, payload]) => payload)

export const dayElements = (wrapper, calendarIndex = 0) => {
  const calendar = wrapper.findAll('.vfc-calendar')[calendarIndex]
  return calendar.findAll('.vfc-day .vfc-span-day').map(day => day.element)
}

const ownText = el =>
  [...el.childNodes]
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent)
    .join('')
    .trim()

export const findDay = (wrapper, text, calendarIndex = 0) =>
  dayElements(wrapper, calendarIndex).find(
    el => ownText(el) === String(text) && !el.classList.contains('vfc-hide')
  )

export const findDayAny = (wrapper, text, calendarIndex = 0) =>
  dayElements(wrapper, calendarIndex).find(el => ownText(el) === String(text))

export const clickDay = async (wrapper, text, calendarIndex = 0) => {
  findDay(wrapper, text, calendarIndex).click()
  await nextTick()
}

export const clickDays = async (wrapper, texts) => {
  for (const text of texts) {
    await clickDay(wrapper, text)
  }
}

export const hoverDay = async (wrapper, day, calendarIndex = 0) => {
  findDay(wrapper, day, calendarIndex).dispatchEvent(
    new MouseEvent('mouseover', { bubbles: true })
  )
  await wrapper.vm.$nextTick()
}

export const previewState = wrapper =>
  Object.fromEntries(
    wrapper.vm.listCalendars
      .flatMap(item => item.weeks)
      .flatMap(week => week.days)
      .map(day => [
        day.date,
        [
          day.isMarked && 'marked',
          day.isHovered && 'hovered',
          day.isMouseToLeft && 'left',
          day.isMouseToRight && 'right'
        ]
          .filter(Boolean)
          .join(' ')
      ])
      .filter(([, flags]) => flags)
  )

export const lastValue = wrapper => {
  const emitted = wrapper.emitted('update:modelValue')
  return emitted ? JSON.parse(JSON.stringify(emitted.at(-1)[0])) : undefined
}

export const calendarTitle = (wrapper, calendarIndex = 0) => {
  const calendar = wrapper.findAll('.vfc-calendar')[calendarIndex]
  return calendar
    .findAll('div.vfc-top-date span')
    .map(span => span.text())
    .join(' ')
}

export const dayNameTexts = wrapper =>
  wrapper
    .find('.vfc-dayNames')
    .findAll('.vfc-day')
    .map(el => el.text())
