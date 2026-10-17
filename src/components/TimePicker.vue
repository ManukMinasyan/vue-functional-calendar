<template>
  <div class="vfc-time-picker-container">
    <div class="vfc-close" @click="close()"></div>
    <div class="vfc-modal-time-mechanic">
      <div id="time-line" class="vfc-modal-time-line">
        <span>
          <template v-if="calendarRoot.fConfigs.isDateRange">
            <span
              @click="startDateActive = true"
              :class="{ 'vfc-active': startDateActive }"
              >{{ calendarRoot.calendar.dateRange.start }}</span
            >
            <template v-if="calendarRoot.calendar.dateRange.end">
              <span>-</span>
              <span
                @click="startDateActive = false"
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
        <div>Hour</div>
        <div>Minute</div>
      </div>
      <div class="vfc-time-picker">
        <div
          class="vfc-time-picker__list vfc-time-picker__list--hours"
          ref="hourList"
        >
          <div
            class="vfc-time-picker__item"
            :class="{
              'vfc-time-picker__item--selected': checkHourActiveClass(i)
            }"
            v-for="i in hours"
            :key="i"
            @click="changeHour(formatTime(i))"
          >
            {{ formatTime(i) }}
          </div>
        </div>
        <div
          class="vfc-time-picker__list vfc-time-picker__list--minutes"
          ref="minuteList"
        >
          <div
            class="vfc-time-picker__item"
            :class="{
              'vfc-time-picker__item--selected': checkMinuteActiveClass(i)
            }"
            v-for="i in minutes"
            :key="i"
            @click="changeMinute(formatTime(i))"
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
    }
  },
  created() {
    let selectedDates = this.calendarRoot.calendar.selectedDates
    this.currentSelectedDate = selectedDates[selectedDates.length - 1]
  },
  mounted() {
    let startDate = this.calendarRoot.calendar.dateRange.start.split(' ')[0]
    let endDate = this.calendarRoot.calendar.dateRange.end.split(' ')[0]
    if (
      startDate &&
      this.calendarRoot.helpCalendar.getDateFromFormat(startDate) <
        this.calendarRoot.helpCalendar.getDateFromFormat(endDate)
    ) {
      this.startDateActive = false
    } else {
      this.startDateActive = true
    }

    this.setSelectedDateTime()
    this.setStyles()
  },
  methods: {
    formatTime(i) {
      return i < 10 ? '0' + i : i
    },
    close() {
      this.calendarRoot.showTimePicker = false
    },
    addMinuteHour(what, val, to) {
      let res = ''
      res += val.split(' ')[0]
      if (what == 'hour') {
        res += ' ' + to + ':'
        res += val.split(' ')[1].split(':')[1]
      } else {
        res += ' ' + val.split(' ')[1].split(':')[0] + ':'
        res += to
      }
      return res
    },
    changeHour(hour) {
      if (this.calendarRoot.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          this.calendarRoot.calendar.dateRange.start = this.addMinuteHour(
            'hour',
            this.calendarRoot.calendar.dateRange.start,
            hour
          )
        } else {
          this.calendarRoot.calendar.dateRange.end = this.addMinuteHour(
            'hour',
            this.calendarRoot.calendar.dateRange.end,
            hour
          )
        }
      } else if (this.calendarRoot.fConfigs.isMultipleDatePicker) {
        let currentDate = this.calendarRoot.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        )
        currentDate.hour = hour
      } else {
        this.calendarRoot.calendar.selectedHour = hour
      }

      this.setSelectedDateTime()
      this.setScrollPosition()
    },
    changeMinute(minute) {
      if (this.calendarRoot.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          this.calendarRoot.calendar.dateRange.start = this.addMinuteHour(
            'minute',
            this.calendarRoot.calendar.dateRange.start,
            minute
          )
        } else {
          this.calendarRoot.calendar.dateRange.end = this.addMinuteHour(
            'minute',
            this.calendarRoot.calendar.dateRange.end,
            minute
          )
        }
      } else if (this.calendarRoot.fConfigs.isMultipleDatePicker) {
        let currentDate = this.calendarRoot.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        )
        currentDate.minute = minute
      } else {
        this.calendarRoot.calendar.selectedMinute = minute
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
        let currentDate = this.calendarRoot.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        )
        currentDate.dateTime =
          currentDate.date + ' ' + currentDate.hour + ':' + currentDate.minute
      }
    },
    checkStartDate() {
      return this.startDateActive
    },
    checkHourActiveClass(i) {
      let hour
      if (this.calendarRoot.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          hour = this.calendarRoot.calendar.dateRange.start
            .split(' ')[1]
            .split(':')[0]
        } else {
          hour = this.calendarRoot.calendar.dateRange.end
            .split(' ')[1]
            .split(':')[0]
        }
      } else if (this.calendarRoot.fConfigs.isMultipleDatePicker) {
        hour = this.calendarRoot.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        ).hour
      } else {
        hour = this.calendarRoot.calendar.selectedHour
      }

      if (this.hours.length && !this.hours.some(el => el == hour)) {
        hour = this.hours[0]
      }

      return hour == this.formatTime(i)
    },
    checkMinuteActiveClass(i) {
      let minute
      if (this.calendarRoot.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          minute = this.calendarRoot.calendar.dateRange.start.split(':')[1]
        } else {
          minute = this.calendarRoot.calendar.dateRange.end.split(':')[1]
        }
      } else if (this.calendarRoot.fConfigs.isMultipleDatePicker) {
        minute = this.calendarRoot.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        ).minute
      } else {
        minute = this.calendarRoot.calendar.selectedMinute
      }

      if (this.minutes.length && !this.minutes.some(el => el == minute)) {
        minute = this.minutes[0]
      }

      return minute == this.formatTime(i)
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
    padding: 0 var(--vfc-space-2);
    > div {
      flex: 1;
      font-size: var(--vfc-font-size-xs);
      font-weight: var(--vfc-font-weight-strong);
      color: var(--vfc-text-muted);
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      word-break: break-all;
    }
  }
}
</style>
