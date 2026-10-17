import { describe, it, expect } from 'vitest'
import { h, Comment } from 'vue'
import { mount } from '@vue/test-utils'
import FunctionalCalendar from '../index.js'
import {
  mountCalendar,
  mountCalendarReady,
  clickDay,
  FIXED_DATE
} from './helpers.js'

const daySpans = wrapper =>
  wrapper.findAll('.vfc-calendar .vfc-day > span').map(span => span.element)

describe('provide key', () => {
  it('does not shadow a calendar key provided by the app', () => {
    const Probe = {
      inject: ['calendar'],
      render() {
        return h('i', { class: 'probe' }, String(this.calendar))
      }
    }

    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      {
        global: { provide: { calendar: 'from-app' } },
        slots: { default: () => h(Probe) }
      }
    )

    expect(wrapper.find('.probe').text()).toBe('from-app')
  })
})

describe('default day slot', () => {
  it('renders the slot per displayed day, with one extra call per day to detect it', () => {
    const received = []
    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      {
        slots: {
          default: props => {
            received.push(props)
            return h('b', { class: 'custom-day' }, String(props.day.day))
          }
        }
      }
    )

    const rendered = wrapper.findAll('.custom-day')
    expect(rendered).toHaveLength(35)
    expect(received).toHaveLength(70)
    expect(rendered[3].text()).toBe('1')
    const first = received.find(props => props.day.day === 1 && !props.day.hide)
    expect(first.day.date).toBe('1/10/2026')
    expect(typeof first.week.number).toBe('number')
    expect(first.week.days).toContain(first.day)
  })

  it('drops the vfc-span-day class from every day when a slot is given', () => {
    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      { slots: { default: () => h('b', 'x') } }
    )

    expect(daySpans(wrapper)).toHaveLength(35)
    daySpans(wrapper).forEach(span => {
      expect(span.classList).not.toContain('vfc-span-day')
    })
  })

  it('treats a conditional slot as present on every day', () => {
    const wrapper = mount(
      {
        components: { FunctionalCalendar },
        props: ['date'],
        template: `<FunctionalCalendar :new-current-date="date" :marked-dates="['12/10/2026']">
          <template #default="{ day }"><b v-if="day.isMarked">*</b></template>
        </FunctionalCalendar>`
      },
      { props: { date: FIXED_DATE }, attachTo: document.body }
    )

    expect(wrapper.findAll('b')).toHaveLength(1)
    expect(daySpans(wrapper)).toHaveLength(35)
    daySpans(wrapper).forEach(span => {
      expect(span.classList).not.toContain('vfc-span-day')
    })
  })

  it('keeps the vfc-span-day class when alwaysUseDefaultClasses is set', () => {
    const { wrapper } = mountCalendar(
      { isDatePicker: true, alwaysUseDefaultClasses: true },
      { slots: { default: () => h('b', 'x') } }
    )

    expect(wrapper.findAll('.vfc-span-day').length).toBeGreaterThan(0)
  })

  it('keeps the vfc-span-day class when the slot renders only comments', () => {
    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      { slots: { default: () => [h(Comment, 'stray comment')] } }
    )

    expect(daySpans(wrapper)).toHaveLength(35)
    daySpans(wrapper).forEach(span => {
      expect(span.classList).toContain('vfc-span-day')
    })
  })

  it('keeps the vfc-span-day class for an html comment inside the component tag', () => {
    const wrapper = mount(
      {
        components: { FunctionalCalendar },
        props: ['date'],
        template:
          '<FunctionalCalendar :new-current-date="date" :is-date-picker="true"><!-- stray --></FunctionalCalendar>'
      },
      { props: { date: FIXED_DATE } }
    )

    expect(daySpans(wrapper)).toHaveLength(35)
    expect(wrapper.findAll('.vfc-span-day')).toHaveLength(35)
  })

  it('drops the vfc-span-day class when a comment sits next to real content', () => {
    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      { slots: { default: () => [h(Comment, 'note'), h('b', 'x')] } }
    )

    expect(wrapper.findAll('.vfc-span-day')).toHaveLength(0)
  })

  it('keeps the vfc-span-day class when the default slot is conditionally not provided', () => {
    const wrapper = mount(
      {
        components: { FunctionalCalendar },
        props: ['date'],
        template: `<FunctionalCalendar :new-current-date="date" :is-date-picker="true">
          <template v-if="false" #default="{ day }">{{ day.day }}</template>
        </FunctionalCalendar>`
      },
      { props: { date: FIXED_DATE } }
    )

    expect(wrapper.findAll('.vfc-span-day')).toHaveLength(35)
  })

  it('still selects a day through a custom slot', async () => {
    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      {
        slots: {
          default: props =>
            h('b', { class: 'custom-day' }, String(props.day.day))
        }
      }
    )

    wrapper.findAll('.vfc-span-day, .vfc-day > span')[10].element.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('choseDay')).toHaveLength(1)
  })
})

describe('footer and cleaner slots', () => {
  it('renders the footer slot', () => {
    const { wrapper } = mountCalendar(
      { isDatePicker: true },
      { slots: { footer: () => h('p', { class: 'my-footer' }, 'Footer text') } }
    )

    expect(wrapper.find('.footerCon .my-footer').text()).toBe('Footer text')
  })

  it('renders no footer without canClearRange or a footer slot', () => {
    const { wrapper } = mountCalendar({ isDatePicker: true })

    expect(wrapper.find('.footerCon').exists()).toBe(false)
  })

  it('replaces the default clear button with the cleaner slot', () => {
    const { wrapper } = mountCalendar(
      { isDateRange: true, canClearRange: true },
      {
        slots: { cleaner: () => h('button', { class: 'my-cleaner' }, 'Reset') }
      }
    )

    expect(wrapper.find('.my-cleaner').text()).toBe('Reset')
    expect(wrapper.find('.rangeCleaner').exists()).toBe(false)
  })

  it('clears the range when the cleaner slot is clicked', async () => {
    const model = {
      currentDate: new Date(2026, 9, 1),
      selectedDate: false,
      selectedDateTime: false,
      selectedHour: '00',
      selectedMinute: '00',
      selectedDatesItem: '',
      selectedDates: [],
      dateRange: { start: '', end: '' },
      multipleDateRange: []
    }
    const { wrapper } = await mountCalendarReady(
      { isDateRange: true, canClearRange: true, modelValue: model },
      {
        slots: { cleaner: () => h('button', { class: 'my-cleaner' }, 'Reset') }
      }
    )
    await clickDay(wrapper, 10)
    await clickDay(wrapper, 14)
    expect(model.dateRange.end).toBe('14/10/2026')

    await wrapper.find('.my-cleaner').trigger('click')

    expect(model.dateRange).toEqual({ start: '', end: '' })
  })
})

describe('arrow slots', () => {
  it('replaces the default arrows with the navigation slots', () => {
    const { wrapper } = mountCalendar(
      {},
      {
        slots: {
          navigationArrowLeft: () => h('i', { class: 'my-left' }, 'prev'),
          navigationArrowRight: () => h('i', { class: 'my-right' }, 'next')
        }
      }
    )

    expect(wrapper.find('.my-left').text()).toBe('prev')
    expect(wrapper.find('.my-right').text()).toBe('next')
    expect(
      wrapper
        .find('.vfc-separately-navigation-buttons .vfc-arrow-left')
        .exists()
    ).toBe(false)
    expect(
      wrapper
        .find('.vfc-separately-navigation-buttons .vfc-arrow-right')
        .exists()
    ).toBe(false)
  })

  it('navigates when the custom arrows are clicked', async () => {
    const { wrapper, events } = mountCalendar(
      {},
      {
        slots: {
          navigationArrowRight: () => h('i', { class: 'my-right' }, 'next')
        }
      }
    )

    await wrapper.find('.my-right').trigger('click')

    expect(events.filter(([name]) => name === 'changedMonth')).toHaveLength(1)
  })
})

describe('modal input slots', () => {
  it('passes selectedDate and isTypeable to the datePickerInput slot', async () => {
    const received = []
    const { wrapper } = mountCalendar(
      { isModal: true, isDatePicker: true, isTypeable: true },
      {
        slots: {
          datePickerInput: props => {
            received.push({ ...props })
            return h('em', { class: 'my-input' }, props.selectedDate)
          }
        }
      }
    )
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)

    expect(wrapper.find('.my-input').text()).toBe('10/10/2026')
    expect(received.at(-1)).toEqual({
      selectedDate: '10/10/2026',
      isTypeable: true
    })
  })

  it('passes startDate, endDate and isTypeable to the dateRangeInputs slot', async () => {
    const received = []
    const { wrapper } = mountCalendar(
      { isModal: true, isDateRange: true },
      {
        slots: {
          dateRangeInputs: props => {
            received.push({ ...props })
            return h(
              'em',
              { class: 'my-range' },
              `${props.startDate}|${props.endDate}`
            )
          }
        }
      }
    )
    await wrapper.trigger('focusin')
    await clickDay(wrapper, 10)
    await clickDay(wrapper, 14)

    expect(wrapper.find('.my-range').text()).toBe('10/10/2026|14/10/2026')
    expect(received.at(-1)).toEqual({
      startDate: '10/10/2026',
      endDate: '14/10/2026',
      isTypeable: false
    })
  })
})
