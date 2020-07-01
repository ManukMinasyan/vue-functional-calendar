<template>
  <div class="vfc-time-picker-container">
    <div class="vfc-close" @click="close()"></div>
    <div class="vfc-modal-time-mechanic">
      <div id="time-line" class="vfc-modal-time-line">
        <span>
          <template v-if="$parent.fConfigs.isDateRange">
            <span
              @click="startDateActive = true"
              :class="{ 'vfc-active': startDateActive }"
              >{{ $parent.calendar.dateRange.start }}</span
            >
            <template v-if="$parent.calendar.dateRange.end">
              <span>-</span>
              <span
                @click="startDateActive = false"
                :class="{ 'vfc-active': !startDateActive }"
                >{{ $parent.calendar.dateRange.end }}</span
              >
            </template>
          </template>
          <template v-else-if="$parent.fConfigs.isMultipleDatePicker">{{
            getCurrentDateTime
          }}</template>
          <template v-else>{{ $parent.calendar.selectedDateTime }}</template>
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
            v-for="i in 24"
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
            v-for="i in 60"
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
export default {
  name: 'TimePicker',
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
    }
  },
  watch: {
    startDateActive: function() {
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
    let selectedDates = this.$parent.calendar.selectedDates
    this.currentSelectedDate = selectedDates[selectedDates.length - 1]
  },
  mounted() {
    let startDate = this.$parent.calendar.dateRange.start.split(' ')[0]
    let endDate = this.$parent.calendar.dateRange.end.split(' ')[0]
    if (
      startDate &&
      this.$parent.helpCalendar.getDateFromFormat(startDate) <
        this.$parent.helpCalendar.getDateFromFormat(endDate)
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
      return i <= 10 ? '0' + (i - 1) : i - 1
    },
    close() {
      this.$parent.showTimePicker = false
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
      if (this.$parent.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          this.$parent.calendar.dateRange.start = this.addMinuteHour(
            'hour',
            this.$parent.calendar.dateRange.start,
            hour
          )
        } else {
          this.$parent.calendar.dateRange.end = this.addMinuteHour(
            'hour',
            this.$parent.calendar.dateRange.end,
            hour
          )
        }
      } else if (this.$parent.fConfigs.isMultipleDatePicker) {
        let currentDate = this.$parent.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        )
        currentDate.hour = hour
      } else {
        this.$parent.calendar.selectedHour = hour
      }

      this.setSelectedDateTime()
      this.setScrollPosition()
    },
    changeMinute(minute) {
      if (this.$parent.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          this.$parent.calendar.dateRange.start = this.addMinuteHour(
            'minute',
            this.$parent.calendar.dateRange.start,
            minute
          )
        } else {
          this.$parent.calendar.dateRange.end = this.addMinuteHour(
            'minute',
            this.$parent.calendar.dateRange.end,
            minute
          )
        }
      } else if (this.$parent.fConfigs.isMultipleDatePicker) {
        let currentDate = this.$parent.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        )
        currentDate.minute = minute
      } else {
        this.$parent.calendar.selectedMinute = minute
      }

      this.setSelectedDateTime()
      this.setScrollPosition()
    },
    setSelectedDateTime() {
      if (this.$parent.fConfigs.isDatePicker) {
        this.$parent.calendar.selectedDateTime =
          this.$parent.calendar.selectedDate +
          ' ' +
          this.$parent.calendar.selectedHour +
          ':' +
          this.$parent.calendar.selectedMinute
      } else if (this.$parent.fConfigs.isMultipleDatePicker) {
        let currentDate = this.$parent.calendar.selectedDates.find(
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
      if (this.$parent.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          hour = this.$parent.calendar.dateRange.start
            .split(' ')[1]
            .split(':')[0]
        } else {
          hour = this.$parent.calendar.dateRange.end.split(' ')[1].split(':')[0]
        }
      } else if (this.$parent.fConfigs.isMultipleDatePicker) {
        hour = this.$parent.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        ).hour
      } else {
        hour = this.$parent.calendar.selectedHour
      }
      return hour == this.formatTime(i)
    },
    checkMinuteActiveClass(i) {
      let minute
      if (this.$parent.fConfigs.isDateRange) {
        if (this.checkStartDate()) {
          minute = this.$parent.calendar.dateRange.start.split(':')[1]
        } else {
          minute = this.$parent.calendar.dateRange.end.split(':')[1]
        }
      } else if (this.$parent.fConfigs.isMultipleDatePicker) {
        minute = this.$parent.calendar.selectedDates.find(
          date => date.date === this.getCurrentDate
        ).minute
      } else {
        minute = this.$parent.calendar.selectedMinute
      }

      return minute == this.formatTime(i)
    },
    setStyles() {
      //let container = this.$parent.$refs.mainContainer

      this.setScrollPosition()

      let timeLineHeight = +this.height - 35 - 85 // - paddings - titles height
      document.getElementsByClassName('vfc-time-picker__list')[0].style.height =
        timeLineHeight + 'px'
      document.getElementsByClassName('vfc-time-picker__list')[1].style.height =
        timeLineHeight + 'px'
    },
    setScrollPosition() {
      let container = this.$parent.$refs.mainContainer

      this.$nextTick(function() {
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
    padding: 10px 0;
    > div {
      flex: 1;
      text-align: center;
      color: #66b3cc;
      word-break: break-all;
      font-size: 25px;
    }
  }
  .vfc-time-picker {
    padding-bottom: 20px;
  }
}
</style>
