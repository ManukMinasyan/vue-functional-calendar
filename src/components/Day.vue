<template>
  <div class="vfc-day" role="presentation">
    <div v-if="startActive" class="vfc-base-start" aria-hidden="true"></div>
    <div v-if="endActive" class="vfc-base-end" aria-hidden="true"></div>
    <span
      v-if="!day.hideLeftAndRightDays"
      ref="cell"
      role="gridcell"
      :tabindex="isRoving ? 0 : -1"
      :aria-selected="isSelectable ? isSelected : null"
      :aria-disabled="isBlocked"
      :aria-label="ariaLabel"
      :aria-keyshortcuts="rangeNumbers.length ? 'Delete' : null"
      :data-focus-id="`day:${gridKey}:${day.date}`"
      :class="getClassNames(day)"
      @click.self="calendarRoot.clickDay(day, isDisabledDate)"
      @keydown="onKeydown"
      @focus="calendarRoot.focusedDate = day.date"
      @mouseover="dayMouseOver"
    >
      <slot :week="week" :day="day">{{ day.day }}</slot>
      <span
        v-if="timesShow"
        @click="clearRange"
        class="times"
        aria-hidden="true"
        >&times;</span
      >
      <span
        v-if="numberShow"
        @mouseover="toolTip && (onNumber = true)"
        @mouseleave="onNumber = false"
        class="number"
        aria-hidden="true"
        >{{ getDaysNumber }}
        <div v-show="toolTip && onNumber" class="toolTip">
          {{ toolTipTxt().join('&nbsp;') }}
        </div>
      </span>
    </span>
    <span v-else role="gridcell" aria-hidden="true"></span>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

import { hasSlotContent } from '../utils/slots'

export default {
  name: 'Day',
  inject: { calendarRoot: CALENDAR_KEY },
  props: {
    day_key: {
      type: Number,
      required: true
    },
    week: {
      type: Object,
      required: true
    },
    day: {
      type: Object,
      required: true
    },
    helpCalendar: {
      type: Object,
      required: true
    },
    fConfigs: {
      type: Object,
      required: true
    },
    calendar: {
      type: Object,
      required: true
    },
    alwaysUseDefaultClasses: {
      type: Boolean,
      default: false
    },
    gridKey: {
      type: Number,
      default: 0
    }
  },
  emits: ['dayMouseOver'],
  data() {
    return {
      toolTip: false,
      onNumber: false
      // toolTipTxt
    }
  },
  computed: {
    isInMonth() {
      return this.calendarRoot.isDayInMonth(
        this.day,
        this.calendarRoot.listCalendars[this.gridKey]
      )
    },
    isRoving() {
      return (
        this.isInMonth &&
        this.calendarRoot.rovingDates[this.gridKey] === this.day.date
      )
    },
    isSelectable() {
      const { isDatePicker, isDateRange, isMultipleDatePicker } = this.fConfigs
      return isDatePicker || isDateRange || isMultipleDatePicker
    },
    isSelected() {
      return this.calendarRoot.isDateSelected(this.day.date)
    },
    isBlocked() {
      return this.calendarRoot.isDateBlocked(this.day.date)
    },
    rangeNumbers() {
      const ranges = this.calendar.multipleDateRange
      if (!this.fConfigs.isMultipleDateRange || !ranges) return []

      const date = this.day.date
      return ranges
        .map((range, index) =>
          range.start.split(' ')[0] === date || range.end.split(' ')[0] === date
            ? index + 1
            : 0
        )
        .filter(Boolean)
    },
    ariaLabel() {
      if (this.day.hideLeftAndRightDays) return null

      const label = this.calendarRoot.formatFullDate(
        this.helpCalendar.getDateFromFormat(this.day.date)
      )
      if (!this.rangeNumbers.length) return label

      return `${label}, ${this.fConfigs.labels.range} ${this.rangeNumbers.join(', ')}`
    },
    startActive() {
      if (!this.fConfigs.isMultipleDateRange)
        return (
          (this.day.isDateRangeStart || this.day.isMouseToLeft) &&
          !this.day.hideLeftAndRightDays
        )

      if (!''.inRange) this.inRangeInit()

      const inAnyRange = this.day.date.inRange(this.calendar.multipleDateRange)

      const lastElement =
        this.calendar.multipleDateRange[
          this.calendar.multipleDateRange.length - 1
        ]
      if (!lastElement) return inAnyRange
      const lastHasDayStart = ~this.calendar.multipleDateRange
        .map(range => range.start)
        .indexOf(this.day.date)
      const lastHasDayEnd = ~this.calendar.multipleDateRange
        .map(range => range.end)
        .indexOf(this.day.date)

      if (lastHasDayStart === lastHasDayEnd && lastHasDayEnd) return inAnyRange

      if (
        lastHasDayStart &&
        ~lastHasDayStart > -1 &&
        this.calendar.multipleDateRange[~lastHasDayStart].end
      )
        return lastHasDayStart || inAnyRange

      if (!lastElement.start && !lastElement.end) {
        return lastHasDayStart || inAnyRange
      }
      // console.log('lastElement')

      return (
        ((this.day.isDateRangeStart || this.day.isMouseToLeft) &&
          !this.day.hideLeftAndRightDays) ||
        inAnyRange
      )
    },
    endActive() {
      if (!this.fConfigs.isMultipleDateRange)
        return (
          (this.day.isDateRangeEnd || this.day.isMouseToRight) &&
          !this.day.hideLeftAndRightDays
        )

      if (!''.inRange) this.inRangeInit()

      const inAnyRange = this.day.date.inRange(this.calendar.multipleDateRange)

      const lastElement =
        this.calendar.multipleDateRange[
          this.calendar.multipleDateRange.length - 1
        ]
      if (!lastElement) return inAnyRange

      const lastHasDayStart = ~this.calendar.multipleDateRange
        .map(range => range.start)
        .indexOf(this.day.date)
      const lastHasDayEnd = ~this.calendar.multipleDateRange
        .map(range => range.end)
        .indexOf(this.day.date)

      if (lastHasDayStart === lastHasDayEnd && lastHasDayEnd) return inAnyRange

      if (lastHasDayEnd) return true

      if (!lastElement.start && !lastElement.end) {
        if (lastElement.start === lastElement.end) return false
        return lastHasDayEnd
      }
      return (
        ((this.day.isDateRangeEnd || this.day.isMouseToRight) &&
          !this.day.hideLeftAndRightDays) ||
        inAnyRange
      )
    },
    numberShow() {
      if (!this.fConfigs.isMultipleDateRange) return false

      let endPos = this.calendar.multipleDateRange
        .map(range => range.end)
        .indexOf(this.day.date)

      return !!(
        ~endPos ||
        ~this.calendar.multipleDateRange
          .map(range => range.start)
          .indexOf(this.day.date)
      )
    },
    timesShow() {
      let res = this.calendar.multipleDateRange
        ? ~this.calendar.multipleDateRange
            .map(range => range.end)
            .indexOf(this.day.date)
        : -1
      return this.fConfigs.isMultipleDateRange && res
    },
    getDaysNumber() {
      const endPosFirst = this.calendar.multipleDateRange
        .map(range => range.end)
        .indexOf(this.day.date)
      const startPosFirst = this.calendar.multipleDateRange
        .map(range => range.start)
        .indexOf(this.day.date)
      const endPosLast = this.calendar.multipleDateRange
        .map(range => range.end)
        .lastIndexOf(this.day.date)
      const startPosLast = this.calendar.multipleDateRange
        .map(range => range.start)
        .lastIndexOf(this.day.date)

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.toolTip =
        endPosFirst !== endPosLast ||
        startPosFirst !== startPosLast ||
        (endPosFirst > -1 && startPosFirst > -1) ||
        (startPosFirst > -1 && endPosFirst > -1)

      if (this.toolTip) {
        return '·'
      }

      return (endPosFirst > -1 ? Number(endPosFirst) : 0) || startPosFirst
    }
  },
  methods: {
    toolTipTxt() {
      const numbers = []
      const endArr = this.calendar.multipleDateRange.map(range => range.end)
      const startArr = this.calendar.multipleDateRange.map(range => range.start)
      let endIndex = 0
      let startIndex = 0
      let ind = endArr.indexOf(this.day.date, endIndex)
      while (~endArr.indexOf(this.day.date, endIndex)) {
        ind = endArr.indexOf(this.day.date, endIndex)

        numbers.push(ind)
        endIndex = ind + 1
      }
      ind = startArr.indexOf(this.day.date, startIndex)
      while (~startArr.indexOf(this.day.date, startIndex)) {
        ind = startArr.indexOf(this.day.date, startIndex)

        numbers.push(ind)
        startIndex = ind + 1
      }
      return numbers.sort((a, b) => a - b)
    },
    inRangeInit() {
      //!!!!\\
      const helpCalendar = this.helpCalendar
      String.prototype.inRange = function (arr) {
        let res = false
        arr.forEach(el => {
          const start = +helpCalendar.getDateFromFormat(el.start.split(' ')[0])
          const end = +helpCalendar.getDateFromFormat(el.end.split(' ')[0])
          const current = +helpCalendar.getDateFromFormat(this.split(' ')[0])
          if (start === end) return
          if (start && end) res = res || (start < current && current < end)
        })
        return res
      }
      //!!!!\\
    },

    clearRange() {
      //$emit
      const removeIndex = this.calendar.multipleDateRange.findIndex(
        range => range.end === this.day.date
      )
      this.calendar.multipleDateRange.splice(removeIndex, 1)
    },
    dayMouseOver() {
      this.$emit('dayMouseOver', this.day.date)
    },
    hasSlot(name = 'default') {
      const props = name === 'default' ? { week: this.week, day: this.day } : {}
      return hasSlotContent(this.calendarRoot.$slots[name], props)
    },
    isDisabledDate(date) {
      return this.calendarRoot.isDisabledDate(date)
    },
    onKeydown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.calendarRoot.clickDay(this.day, this.isDisabledDate)
        this.calendarRoot.returnFocusIfClosed()
        return
      }
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        this.fConfigs.isMultipleDateRange
      ) {
        event.preventDefault()
        this.calendarRoot.removeRangeAt(this.day.date)
        return
      }
      this.calendarRoot.onDayKeydown(event, this.day, this.gridKey)
    },
    getClassNames(day) {
      let classes = []

      if (!this.hasSlot('default') || this.alwaysUseDefaultClasses) {
        classes.push('vfc-span-day')
      }

      // Disable days of week if set in configuration
      const isDayNameDisabled = this.helpCalendar.isDayNameDisabled(
        this.helpCalendar.getDateFromFormat(day.date),
        this.fConfigs.disabledDayNames
      )
      if (isDayNameDisabled) {
        day.hide = true
        classes.push('vfc-cursor-not-allowed')
      }

      let date = this.helpCalendar.getDateFromFormat(day.date)
      let today = new Date()
      today.setHours(0, 0, 0, 0)
      // Disabled dates
      if (this.isDisabledDate(day.date)) {
        classes.push('vfc-disabled')
        classes.push('vfc-cursor-not-allowed')
      }

      if (this.fConfigs.limits) {
        let min = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.min)
          .getTime()
        let max = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.max)
          .getTime()

        if (date.getTime() < min || date.getTime() > max) {
          classes.push('vfc-disabled')
          classes.push('vfc-cursor-not-allowed')
        }
      }

      if (day.hide) {
        classes.push('vfc-hide')
      }

      // Today date
      if (day.isToday) {
        classes.push('vfc-today')
      }
      if (!day.hideLeftAndRightDays && !isDayNameDisabled) {
        // Mark Date
        if (day.isMarked) {
          classes.push('vfc-marked')
        } else if (day.isHovered) {
          classes.push('vfc-hovered')
        }
        if (this.fConfigs.markedDates.includes(day.date)) {
          classes.push('vfc-borderd')
        }

        if (Array.isArray(this.fConfigs.markedDateRange)) {
          this.fConfigs.markedDateRange.forEach(range => {
            if (
              this.helpCalendar.getDateFromFormat(range.start) <=
                this.helpCalendar.getDateFromFormat(day.date) &&
              this.helpCalendar.getDateFromFormat(range.end) >=
                this.helpCalendar.getDateFromFormat(day.date)
            ) {
              classes.push('vfc-marked')
            }
            if (day.date === range.start) {
              classes.push('vfc-start-marked')
            } else if (day.date === range.end) {
              classes.push('vfc-end-marked')
            }
          })
        } else if (
          this.fConfigs.markedDateRange.start &&
          this.fConfigs.markedDateRange.end
        ) {
          // Date Range Marked

          if (
            this.helpCalendar.getDateFromFormat(
              this.fConfigs.markedDateRange.start
            ) <= this.helpCalendar.getDateFromFormat(day.date) &&
            this.helpCalendar.getDateFromFormat(
              this.fConfigs.markedDateRange.end
            ) >= this.helpCalendar.getDateFromFormat(day.date)
          ) {
            classes.push('vfc-marked')
          }
          if (day.date === this.fConfigs.markedDateRange.start) {
            classes.push('vfc-start-marked')
          } else if (day.date === this.fConfigs.markedDateRange.end) {
            classes.push('vfc-end-marked')
          }
        } else {
          // Only After Start Marked
          if (this.fConfigs.markedDateRange.start) {
            if (
              this.helpCalendar.getDateFromFormat(
                this.fConfigs.markedDateRange.start
              ) <= this.helpCalendar.getDateFromFormat(day.date)
            )
              classes.push('vfc-marked')
          }

          // Only Before End Marked
          if (this.fConfigs.markedDateRange.end) {
            if (
              this.helpCalendar.getDateFromFormat(
                this.fConfigs.markedDateRange.end
              ) >= this.helpCalendar.getDateFromFormat(day.date)
            )
              classes.push('vfc-marked')
          }
        }

        classes.push('vfc-hover')
      }
      //Date Multiple Range
      if (this.fConfigs.isMultipleDateRange) {
        if (!''.inRange) this.inRangeInit()
        // console.log(day.date.inRange(this.calendar.multipleDateRange))
        if (
          day.isMarked ||
          ~this.calendar.multipleDateRange
            .map(range => range.start.split(' ')[0])
            .indexOf(day.date) ||
          ~this.calendar.multipleDateRange
            .map(range => range.end.split(' ')[0])
            .indexOf(day.date) ||
          day.date.inRange(this.calendar.multipleDateRange)
        ) {
          classes.push('vfc-marked')
        }
        // } else if (day.isHovered) {
        // classes.push('vfc-hovered')
        // }
        if (this.fConfigs.markedDates.includes(day.date)) {
          classes.push('vfc-borderd')
        }
        // console.log(
        //   ~this.calendar.multipleDateRange
        //     .map(range => range.start)
        //     .indexOf(day.date)
        // )
        if (
          ~this.calendar.multipleDateRange
            .map(range => range.start.split(' ')[0])
            .indexOf(day.date)
        ) {
          classes.push('vfc-start-marked')
        }

        if (
          ~this.calendar.multipleDateRange
            .map(range => range.end.split(' ')[0])
            .indexOf(day.date)
        ) {
          classes.push('vfc-end-marked')
        }
      }
      // Date Mark With Custom Classes
      if (typeof this.fConfigs.markedDates === 'object') {
        let checkMarked = this.fConfigs.markedDates.find(markDate => {
          return markDate.date === day.date
        })

        if (typeof checkMarked !== 'undefined') {
          classes.push(checkMarked.class)
        }
      }

      if (day.date === this.calendar.dateRange.start.split(' ')[0]) {
        classes.push('vfc-start-marked')
      }

      if (day.date === this.calendar.dateRange.end.split(' ')[0]) {
        classes.push('vfc-end-marked')
      }

      if (
        day.date === this.calendar.selectedDate ||
        (this.calendar.hasOwnProperty('selectedDates') &&
          this.calendar.selectedDates.find(sDate => sDate.date === day.date))
      ) {
        classes.push('vfc-borderd')
      }

      return classes
    }
  }
}
</script>

<style scoped lang="scss">
.vfc-day {
  position: relative;
  .times,
  .number {
    position: absolute;
    top: calc(var(--_vfc-space-1) * -1);
    z-index: 20;
    width: 16px;
    height: 16px;
    font-size: var(--_vfc-font-size-xs);
    font-weight: var(--_vfc-font-weight-strong);
    line-height: 16px;
    text-align: center;
    border-radius: 50%;
  }
  .times {
    left: calc(50% + var(--_vfc-day-size) / 2 - 12px);
    color: var(--_vfc-on-danger);
    cursor: pointer;
    background-color: var(--_vfc-danger);
  }
  .number {
    z-index: 30;
    left: calc(50% - var(--_vfc-day-size) / 2 - 4px);
    color: var(--_vfc-on-primary);
    background-color: var(--_vfc-primary);
    &:hover {
      background-color: var(--_vfc-primary-hover);
    }
  }
  .toolTip {
    position: absolute;
    top: calc(var(--_vfc-space-5) * -1);
    left: 0;
    z-index: 200;
    max-width: 108px;
    padding: var(--_vfc-space-1) var(--_vfc-space-2);
    color: var(--_vfc-bg);
    word-wrap: break-word;
    background-color: var(--_vfc-text);
    border-radius: var(--_vfc-radius-sm);
    box-shadow: var(--_vfc-shadow-md);
  }
}
</style>
