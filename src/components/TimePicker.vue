<template>
  <div class="vfc-time-picker-container">
    <div
      class="vfc-close"
      role="button"
      tabindex="0"
      :aria-label="calendarRoot.fConfigs.labels.close"
      @click="close()"
      @keydown.enter.space.prevent="close()"
    ></div>
    <div class="vfc-modal-time-mechanic">
      <div class="vfc-modal-time-line">
        <span>
          <template v-if="calendarRoot.fConfigs.isDateRange">
            <span
              role="button"
              tabindex="0"
              :aria-pressed="startDateActive"
              @click="startDateActive = true"
              @keydown.enter.space.prevent="startDateActive = true"
              :class="{ 'vfc-active': startDateActive }"
              >{{ calendarRoot.calendar.dateRange.start }}</span
            >
            <template v-if="calendarRoot.calendar.dateRange.end">
              <span>-</span>
              <span
                role="button"
                tabindex="0"
                :aria-pressed="!startDateActive"
                @click="startDateActive = false"
                @keydown.enter.space.prevent="startDateActive = false"
                :class="{ 'vfc-active': !startDateActive }"
                >{{ calendarRoot.calendar.dateRange.end }}</span
              >
            </template>
          </template>
          <template v-else-if="calendarRoot.fConfigs.isMultipleDatePicker">{{
            getCurrentDateTime
          }}</template>
          <template v-else>{{
            calendarRoot.calendar.selectedDateTime
          }}</template>
        </span>
      </div>
      <div class="titles">
        <div>{{ calendarRoot.fConfigs.labels.hour }}</div>
        <div>{{ calendarRoot.fConfigs.labels.minute }}</div>
      </div>
      <div class="vfc-time-picker">
        <div
          class="vfc-time-picker__list vfc-time-picker__list--hours"
          ref="hourList"
          role="listbox"
          :aria-label="calendarRoot.fConfigs.labels.hour"
          @keydown="onListKeydown($event, 'hour')"
        >
          <div
            class="vfc-time-picker__item"
            :class="{
              'vfc-time-picker__item--selected': isActiveTime('hour', i)
            }"
            v-for="(i, index) in hours"
            :key="i"
            role="option"
            :tabindex="tabStop('hour', index) ? 0 : -1"
            :aria-selected="isActiveTime('hour', i)"
            @click="changeTime('hour', formatTime(i))"
          >
            {{ formatTime(i) }}
          </div>
        </div>
        <div
          class="vfc-time-picker__list vfc-time-picker__list--minutes"
          ref="minuteList"
          role="listbox"
          :aria-label="calendarRoot.fConfigs.labels.minute"
          @keydown="onListKeydown($event, 'minute')"
        >
          <div
            class="vfc-time-picker__item"
            :class="{
              'vfc-time-picker__item--selected': isActiveTime('minute', i)
            }"
            v-for="(i, index) in minutes"
            :key="i"
            role="option"
            :tabindex="tabStop('minute', index) ? 0 : -1"
            :aria-selected="isActiveTime('minute', i)"
            @click="changeTime('minute', formatTime(i))"
          >
            {{ formatTime(i) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

const SELECTED_KEYS = { hour: 'selectedHour', minute: 'selectedMinute' }

export default {
  name: 'TimePicker',
  inject: { calendarRoot: CALENDAR_KEY },
  data() {
    return {
      startDateActive: true,
      currentSelectedDate: ''
    }
  },
  props: {
    height: {
      type: Number,
      required: true
    },
    hours: {
      type: Array,
      default: function () {
        return [...Array(24).keys()]
      },
      required: false
    },
    minutes: {
      type: Array,
      default: function () {
        return [...Array(60).keys()]
      },
      required: false
    }
  },
  watch: {
    startDateActive: function () {
      this.setScrollPosition()
    }
  },
  computed: {
    getCurrentDate() {
      return this.currentSelectedDate.date
    },
    getCurrentDateTime() {
      return this.currentSelectedDate.dateTime
    },
    currentEntry() {
      return this.calendarRoot.calendar.selectedDates.find(
        date => date.date === this.getCurrentDate
      )
    }
  },
  created() {
    let selectedDates = this.calendarRoot.calendar.selectedDates
    this.currentSelectedDate = selectedDates[selectedDates.length - 1]
  },
  mounted() {
    const { startDMY, endDMY, helpCalendar } = this.calendarRoot
    this.startDateActive = !(
      startDMY &&
      helpCalendar.getDateFromFormat(startDMY) <
        helpCalendar.getDateFromFormat(endDMY)
    )

    this.setSelectedDateTime()
    this.setStyles()
  },
  methods: {
    formatTime(i) {
      return i < 10 ? '0' + i : i
    },
    close() {
      this.calendarRoot.closeTimePicker()
    },
    unitValues(unit) {
      return unit === 'hour' ? this.hours : this.minutes
    },
    tabStop(kind, index) {
      const selected = this.unitValues(kind).findIndex(value =>
        this.isActiveTime(kind, value)
      )
      return index === (selected === -1 ? 0 : selected)
    },
    onListKeydown(event, kind) {
      const list = event.currentTarget
      const items = [...list.querySelectorAll('[role="option"]')]
      const current = items.indexOf(document.activeElement)
      if (current === -1) return

      const moves = {
        ArrowDown: Math.min(current + 1, items.length - 1),
        ArrowUp: Math.max(current - 1, 0),
        Home: 0,
        End: items.length - 1
      }

      if (event.key in moves) {
        event.preventDefault()
        items[moves[event.key]].focus()
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        this.changeTime(kind, this.formatTime(this.unitValues(kind)[current]))
      }
    },
    timeOf(value) {
      const [hour, minute] = (value.split(' ')[1] || '').split(':')
      return { hour: hour || '00', minute: minute || '00' }
    },
    addMinuteHour(what, val, to) {
      const { hour, minute } = this.timeOf(val)
      const time = what == 'hour' ? `${to}:${minute}` : `${hour}:${to}`
      return `${val.split(' ')[0]} ${time}`
    },
    changeTime(unit, value) {
      const { fConfigs, calendar } = this.calendarRoot

      if (fConfigs.isDateRange) {
        const edge = this.startDateActive ? 'start' : 'end'
        calendar.dateRange[edge] = this.addMinuteHour(
          unit,
          calendar.dateRange[edge],
          value
        )
      } else if (fConfigs.isMultipleDatePicker) {
        this.currentEntry[unit] = value
      } else {
        calendar[SELECTED_KEYS[unit]] = value
      }

      this.setSelectedDateTime()
      this.setScrollPosition()
    },
    setSelectedDateTime() {
      if (this.calendarRoot.fConfigs.isDatePicker) {
        this.calendarRoot.calendar.selectedDateTime =
          this.calendarRoot.calendar.selectedDate +
          ' ' +
          this.calendarRoot.calendar.selectedHour +
          ':' +
          this.calendarRoot.calendar.selectedMinute
      } else if (this.calendarRoot.fConfigs.isMultipleDatePicker) {
        const entry = this.currentEntry
        entry.dateTime = entry.date + ' ' + entry.hour + ':' + entry.minute
      }
    },
    activeRangeEdge() {
      const { dateRange } = this.calendarRoot.calendar
      return this.startDateActive ? dateRange.start : dateRange.end
    },
    isActiveTime(unit, i) {
      const { fConfigs, calendar } = this.calendarRoot
      const values = this.unitValues(unit)
      let current

      if (fConfigs.isDateRange) {
        current = this.timeOf(this.activeRangeEdge())[unit]
      } else if (fConfigs.isMultipleDatePicker) {
        current = this.currentEntry[unit]
      } else {
        current = calendar[SELECTED_KEYS[unit]]
      }

      if (values.length && !values.some(el => el == current)) {
        current = values[0]
      }

      return current == this.formatTime(i)
    },
    setStyles() {
      this.setScrollPosition()

      const timeLineHeight = +this.height - 35 - 85
      this.$refs.hourList.style.height = `${timeLineHeight}px`
      this.$refs.minuteList.style.height = `${timeLineHeight}px`
    },
    setScrollPosition() {
      let container = this.calendarRoot.$refs.mainContainer

      this.$nextTick(function () {
        const selectedHour = this.$refs.hourList.querySelector(
          '.vfc-time-picker__item--selected'
        )
        const selectedMinute = this.$refs.minuteList.querySelector(
          '.vfc-time-picker__item--selected'
        )

        this.$refs.hourList.scrollTop = selectedHour
          ? selectedHour.offsetTop - container.clientHeight / 2
          : 0
        this.$refs.minuteList.scrollTop = selectedMinute
          ? selectedMinute.offsetTop - container.clientHeight / 2
          : 0
      })
    }
  }
}
</script>

<style scoped lang="scss">
.vfc-time-picker-container {
  min-width: 250px;
  .vfc-modal-time-line {
    > span {
      > span:not(:nth-child(2)):not(.vfc-active):hover {
        cursor: pointer;
      }
    }
  }
  .titles {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 var(--_vfc-space-2);
    > div {
      flex: 1;
      font-size: var(--_vfc-font-size-xs);
      font-weight: var(--_vfc-font-weight-strong);
      color: var(--_vfc-text-muted);
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      word-break: break-all;
    }
  }
}
</style>
