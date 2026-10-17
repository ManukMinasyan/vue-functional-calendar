import { describe, it, expect } from 'vitest'
import {
  mountCalendar,
  dayElements,
  dayNameTexts,
  calendarTitle,
  findDay,
  findDayAny
} from './helpers.js'

describe('showWeekNumbers', () => {
  it('renders one week number per week row', () => {
    const { wrapper } = mountCalendar({ showWeekNumbers: true })

    const numbers = wrapper
      .findAll('.vfc-week-number')
      .map(cell => Number(cell.text()))
    expect(numbers).toHaveLength(5)
    numbers.forEach((number, index) => {
      expect(number).toBe(numbers[0] + index)
    })
  })

  it('adds an empty cell to the day name row for the number column', () => {
    const { wrapper } = mountCalendar({ showWeekNumbers: true })

    expect(wrapper.find('.vfc-dayNames').element.children).toHaveLength(8)
  })

  it('applies borderColor to the week number cells', () => {
    const { wrapper } = mountCalendar({
      showWeekNumbers: true,
      borderColor: 'rgb(255, 0, 255)'
    })

    expect(
      wrapper.find('.vfc-week-number').element.style.borderRightColor
    ).toBe('rgb(255, 0, 255)')
  })

  it('renders no week numbers by default', () => {
    const { wrapper } = mountCalendar()

    expect(wrapper.find('.vfc-week-number').exists()).toBe(false)
  })
})

describe('week start', () => {
  it('starts on Monday by default', () => {
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
    const firstWeek = wrapper.findAll('.vfc-week')[0]
    const visible = firstWeek
      .findAll('.vfc-span-day')
      .map(day => day.classes('vfc-hide'))
    expect(visible).toEqual([true, true, true, false, false, false, false])
  })

  it('starts on Sunday with sundayStart', () => {
    const { wrapper } = mountCalendar({ sundayStart: true })

    expect(dayNameTexts(wrapper)).toEqual([
      'Su',
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa'
    ])
    const firstWeek = wrapper.findAll('.vfc-week')[0]
    const visible = firstWeek
      .findAll('.vfc-span-day')
      .map(day => day.classes('vfc-hide'))
    expect(visible).toEqual([true, true, true, true, false, false, false])
  })
})

describe('names', () => {
  it('uses custom dayNames in the header', () => {
    const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
    const { wrapper } = mountCalendar({ dayNames })

    expect(dayNameTexts(wrapper)).toEqual(dayNames)
  })

  it('uses custom monthNames in the title', () => {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ]
    const { wrapper } = mountCalendar({ monthNames })

    expect(calendarTitle(wrapper)).toBe('Octubre 2026')
  })

  it('uses custom shortMonthNames in the month picker', async () => {
    const shortMonthNames = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic'
    ]
    const { wrapper } = mountCalendar({
      shortMonthNames,
      changeMonthFunction: true
    })
    wrapper.vm.openMonthPicker(1)
    await wrapper.vm.$nextTick()

    expect(
      wrapper.findAll('.vfc-months .vfc-item').map(item => item.text())
    ).toEqual(shortMonthNames)
  })
})

describe('hiddenElements', () => {
  it('hides the month title', () => {
    const { wrapper } = mountCalendar({ hiddenElements: ['month'] })

    expect(wrapper.find('div.vfc-top-date').exists()).toBe(false)
  })

  it('blanks the day names', () => {
    const { wrapper } = mountCalendar({ hiddenElements: ['dayNames'] })

    expect(dayNameTexts(wrapper)).toEqual(['', '', '', '', '', '', ''])
  })

  it('removes the days of neighbouring months', () => {
    const { wrapper } = mountCalendar({ hiddenElements: ['leftAndRightDays'] })

    expect(dayElements(wrapper)).toHaveLength(31)
    expect(findDayAny(wrapper, 30).textContent.trim()).toBe('30')
  })

  it('shows the days of neighbouring months by default', () => {
    const { wrapper } = mountCalendar()

    expect(dayElements(wrapper)).toHaveLength(35)
  })
})

describe('positions', () => {
  it('centres the title and spreads the arrows by default', () => {
    const { wrapper } = mountCalendar()

    expect(wrapper.find('div.vfc-top-date').classes()).toContain('vfc-center')
    expect(
      wrapper.find('.vfc-separately-navigation-buttons').classes()
    ).toContain('vfc-space-between')
  })

  it('applies titlePosition to the title', () => {
    const { wrapper } = mountCalendar({ titlePosition: 'left' })

    expect(wrapper.find('div.vfc-top-date').classes()).toContain('vfc-left')
  })

  it('applies arrowsPosition to the arrows', () => {
    const { wrapper } = mountCalendar({ arrowsPosition: 'right' })

    expect(
      wrapper.find('.vfc-separately-navigation-buttons').classes()
    ).toContain('vfc-right')
  })
})

describe('appearance', () => {
  it('applies vfc-dark with isDark', () => {
    const { wrapper } = mountCalendar({ isDark: true })

    expect(wrapper.find('.vfc-main-container').classes()).toContain('vfc-dark')
  })

  it('has no vfc-dark class by default', () => {
    const { wrapper } = mountCalendar()

    expect(wrapper.find('.vfc-main-container').classes()).not.toContain(
      'vfc-dark'
    )
  })

  it('pads short months to six rows unless isLayoutExpandable is set', () => {
    const padded = mountCalendar().wrapper
    const expandable = mountCalendar({ isLayoutExpandable: true }).wrapper

    expect(padded.findAll('.vfc-week')).toHaveLength(5)
    expect(padded.findAll('div[style*="height: 32.6px"]')).toHaveLength(1)
    expect(expandable.findAll('div[style*="height: 32.6px"]')).toHaveLength(0)
  })

  it('renders day cells for the visible month with vfc-span-day', () => {
    const { wrapper } = mountCalendar()

    expect(findDay(wrapper, 1).classList).toContain('vfc-span-day')
  })
})
