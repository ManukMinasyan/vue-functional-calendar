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
      :aria-current="day.isToday ? 'date' : null"
      :aria-keyshortcuts="rangeNumbers.length ? 'Delete' : null"
      :data-focus-id="`day:${gridKey}:${day.date}`"
      :class="getClassNames(day)"
      @click.self="calendarRoot.clickDay(day)"
      @keydown="onKeydown"
      @focus="calendarRoot.focusedDate = day.date"
      @mouseover="dayMouseOver"
    >
      <SlotOutlet :source="daySlot" :scope="{ week, day }">{{
        day.day
      }}</SlotOutlet>
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
        :data-number="getDaysNumber"
        aria-hidden="true"
      >
        <div v-show="toolTip && onNumber" class="toolTip">
          {{ toolTipTxt.join('&nbsp;') }}
        </div>
      </span>
    </span>
    <span v-else role="gridcell"></span>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

import { SlotOutlet, hasSlotContent } from '../utils/slots'

const NO_EDGES = Object.freeze({ starts: [], ends: [], touching: [] })

export default {
  name: 'Day',
  components: { SlotOutlet },
  inject: { calendarRoot: CALENDAR_KEY },
  props: {
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
    daySlot: {
      type: Function,
      default: undefined
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
      onNumber: false
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
    dayDate() {
      return this.calendarRoot.parsedDay(this.day.date)
    },
    dayTime() {
      return this.dayDate.getTime()
    },
    fullDateLabel() {
      return this.calendarRoot.formatFullDate(this.dayDate)
    },
    isDayNameDisabled() {
      return this.calendarRoot.isOnDisabledDayName(this.dayDate)
    },
    isRuleBlocked() {
      return this.calendarRoot.isDateRuleBlocked(this.day.date)
    },
    isBlocked() {
      return this.isDayNameDisabled || this.isRuleBlocked
    },
    rangeEdges() {
      return this.calendarRoot.rangeEdgeLookup.get(this.day.date) || NO_EDGES
    },
    rangeNumbers() {
      return this.rangeEdges.touching.map(index => index + 1)
    },
    isInsideRange() {
      const { dayTime } = this
      return (
        this.fConfigs.isMultipleDateRange &&
        this.calendarRoot.multipleRangeSpans.some(
          ([from, to]) => dayTime > from && dayTime < to
        )
      )
    },
    rangeLabelParts() {
      const { labels, isMultipleDateRange, isDateRange } = this.fConfigs

      if (isMultipleDateRange) {
        const { starts, ends, touching } = this.rangeEdges
        return touching.flatMap(index => [
          `${labels.range} ${index + 1}`,
          starts.includes(index) && labels.rangeStart,
          ends.includes(index) && labels.rangeEnd
        ])
      }
      if (!isDateRange) return []

      const { date } = this.day
      return [
        date === this.calendarRoot.startDMY && labels.rangeStart,
        date === this.calendarRoot.endDMY && labels.rangeEnd
      ]
    },
    ariaLabel() {
      if (this.day.hideLeftAndRightDays) return null

      const { labels } = this.fConfigs
      return [
        this.fullDateLabel,
        this.day.isToday && labels.today,
        ...this.rangeLabelParts
      ]
        .filter(Boolean)
        .join(', ')
    },
    isPreviewStart() {
      const { day } = this
      return (
        (day.isDateRangeStart || day.isMouseToLeft) && !day.hideLeftAndRightDays
      )
    },
    isPreviewEnd() {
      const { day } = this
      return (
        (day.isDateRangeEnd || day.isMouseToRight) && !day.hideLeftAndRightDays
      )
    },
    startActive() {
      if (!this.fConfigs.isMultipleDateRange) return this.isPreviewStart

      const ranges = this.calendar.multipleDateRange
      const lastRange = ranges[ranges.length - 1]
      if (!lastRange) return this.isInsideRange

      const { starts, ends } = this.rangeEdges
      const startIndex = starts.length ? starts[0] : -1
      const endIndex = ends.length ? ends[0] : -1

      if (startIndex === endIndex && endIndex > -1) return this.isInsideRange
      if (startIndex > -1 && ranges[startIndex].end) return true
      if (!lastRange.start && !lastRange.end) {
        return startIndex > -1 || this.isInsideRange
      }

      return this.isPreviewStart || this.isInsideRange
    },
    endActive() {
      if (!this.fConfigs.isMultipleDateRange) return this.isPreviewEnd

      const ranges = this.calendar.multipleDateRange
      const lastRange = ranges[ranges.length - 1]
      if (!lastRange) return this.isInsideRange

      const { starts, ends } = this.rangeEdges
      const startIndex = starts.length ? starts[0] : -1
      const endIndex = ends.length ? ends[0] : -1

      if (startIndex === endIndex && endIndex > -1) return this.isInsideRange
      if (endIndex > -1) return true
      if (!lastRange.start && !lastRange.end) return false

      return this.isPreviewEnd || this.isInsideRange
    },
    numberShow() {
      return this.rangeEdges.touching.length > 0
    },
    timesShow() {
      return this.rangeEdges.ends.length > 0
    },
    toolTip() {
      const { starts, ends } = this.rangeEdges
      return (
        starts.length > 1 ||
        ends.length > 1 ||
        (!!starts.length && !!ends.length)
      )
    },
    toolTipTxt() {
      const { starts, ends } = this.rangeEdges
      return [...ends, ...starts].sort((a, b) => a - b).map(index => index + 1)
    },
    getDaysNumber() {
      return this.toolTip ? '·' : this.rangeNumbers[0]
    }
  },
  methods: {
    clearRange() {
      const [removeIndex] = this.rangeEdges.ends
      if (removeIndex === undefined) return

      this.calendar.multipleDateRange.splice(removeIndex, 1)
    },
    dayMouseOver() {
      this.$emit('dayMouseOver', this.day.date)
    },
    hasSlot() {
      return hasSlotContent(this.daySlot, { week: this.week, day: this.day })
    },
    onKeydown(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.calendarRoot.clickDay(this.day)
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
      const classes = []
      const { calendarRoot, isDayNameDisabled } = this

      if (this.alwaysUseDefaultClasses || !this.hasSlot()) {
        classes.push('vfc-span-day')
      }

      if (this.isRuleBlocked) classes.push('vfc-disabled')
      if (this.isBlocked) classes.push('vfc-cursor-not-allowed')
      if (day.hide) classes.push('vfc-hide')
      if (day.isToday) classes.push('vfc-today')

      if (!day.hideLeftAndRightDays && !isDayNameDisabled) {
        if (day.isMarked) {
          classes.push('vfc-marked')
        } else if (day.isHovered) {
          classes.push('vfc-hovered')
        }
        if (calendarRoot.markedLookup.dates.has(day.date)) {
          classes.push('vfc-borderd')
        }

        this.markedRangeClasses(day.date, classes)
        classes.push('vfc-hover')
      }

      if (this.fConfigs.isMultipleDateRange) {
        const { starts, ends } = this.rangeEdges
        if (
          day.isMarked ||
          starts.length ||
          ends.length ||
          this.isInsideRange
        ) {
          classes.push('vfc-marked')
        }
        if (calendarRoot.markedLookup.dates.has(day.date)) {
          classes.push('vfc-borderd')
        }
        if (starts.length) classes.push('vfc-start-marked')
        if (ends.length) classes.push('vfc-end-marked')
      }

      const { classes: customClasses } = calendarRoot.markedLookup
      if (customClasses.has(day.date)) classes.push(customClasses.get(day.date))

      if (day.date === calendarRoot.startDMY) classes.push('vfc-start-marked')
      if (day.date === calendarRoot.endDMY) classes.push('vfc-end-marked')

      if (
        day.date === calendarRoot.selectedDMY ||
        calendarRoot.selectedDatesDMY.includes(day.date)
      ) {
        classes.push('vfc-borderd')
      }

      return classes
    },
    markedRangeClasses(date, classes) {
      const { isList, ranges } = this.calendarRoot.markedRangeLookup
      const { dayTime } = this
      const addCompleteRange = range => {
        if (range.startTime <= dayTime && range.endTime >= dayTime) {
          classes.push('vfc-marked')
        }
        if (date === range.start) {
          classes.push('vfc-start-marked')
        } else if (date === range.end) {
          classes.push('vfc-end-marked')
        }
      }

      if (isList) {
        ranges.forEach(addCompleteRange)
        return
      }

      const [range] = ranges
      if (range.start && range.end) {
        addCompleteRange(range)
        return
      }
      if (range.start && range.startTime <= dayTime) classes.push('vfc-marked')
      if (range.end && range.endTime >= dayTime) classes.push('vfc-marked')
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
    inset-inline-start: calc(50% + var(--_vfc-day-size) / 2 - 12px);
    color: var(--_vfc-on-danger);
    cursor: pointer;
    background-color: var(--_vfc-danger);
  }
  .number {
    z-index: 30;
    left: calc(50% - var(--_vfc-day-size) / 2 - 4px);
    inset-inline-start: calc(50% - var(--_vfc-day-size) / 2 - 4px);
    color: var(--_vfc-on-primary);
    background-color: var(--_vfc-primary);
    &:hover {
      background-color: var(--_vfc-primary-hover);
    }
    &::before {
      content: attr(data-number);
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

@media (forced-colors: active) {
  .vfc-day {
    .times,
    .number {
      forced-color-adjust: none;
    }
    .times {
      color: Canvas;
      background-color: CanvasText;
    }
    .number {
      color: HighlightText;
      background-color: Highlight;
    }
  }
}
</style>
