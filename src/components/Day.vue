<template>
  <div class="vfc-day">
    <div v-if="startActive" class="vfc-base-start"></div>
    <div v-if="endActive" class="vfc-base-end"></div>
    <span
      v-if="!day.hideLeftAndRightDays"
      :class="getClassNames(day)"
      @click.self="$parent.$parent.clickDay(day, isDisabledDate)"
      @mouseover="dayMouseOver"
    >
      <slot :week="week" :day="day">{{ day.day }}</slot>
      <span v-if="timesShow" @click="clearRange" class="times">&times;</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'Day',
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
    }
  },
  data() {
    return {
      isLast: false
    }
  },
  computed: {
    startActive() {
      if (!this.fConfigs.isMultipleDateRange)
        return (
          (this.day.isDateRangeStart || this.day.isMouseToLeft) &&
          !this.day.hideLeftAndRightDays
        )

      const lastElement = this.calendar.multipleDateRange[
        this.calendar.multipleDateRange.length - 1
      ]
      if (!lastElement) return false
      const lastHasDayStart = ~this.calendar.multipleDateRange
        .map(range => range.start)
        .indexOf(this.day.date)
      const lastHasDayEnd = ~this.calendar.multipleDateRange
        .map(range => range.end)
        .indexOf(this.day.date)

      if (lastHasDayStart === lastHasDayEnd && lastHasDayEnd) return false

      if (
        lastHasDayStart &&
        ~lastHasDayStart > -1 &&
        this.calendar.multipleDateRange[~lastHasDayStart].end
      )
        return lastHasDayStart

      if (!lastElement.start && !lastElement.end) {
        return lastHasDayStart
      }
      console.log('lastElement')

      return (
        (this.day.isDateRangeStart || this.day.isMouseToLeft) &&
        !this.day.hideLeftAndRightDays
      )
    },
    endActive() {
      if (!this.fConfigs.isMultipleDateRange)
        return (
          (this.day.isDateRangeEnd || this.day.isMouseToRight) &&
          !this.day.hideLeftAndRightDays
        )

      const lastElement = this.calendar.multipleDateRange[
        this.calendar.multipleDateRange.length - 1
      ]
      if (!lastElement) return false

      const lastHasDayStart = ~this.calendar.multipleDateRange
        .map(range => range.start)
        .indexOf(this.day.date)
      const lastHasDayEnd = ~this.calendar.multipleDateRange
        .map(range => range.end)
        .indexOf(this.day.date)

      if (lastHasDayStart === lastHasDayEnd && lastHasDayEnd) return false
      if (lastHasDayEnd) return lastHasDayEnd

      if (!lastElement.start && !lastElement.end) {
        if (lastElement.start === lastElement.end) return false
        return lastHasDayEnd
      }
      return (
        (this.day.isDateRangeEnd || this.day.isMouseToRight) &&
        !this.day.hideLeftAndRightDays
      )
    },
    timesShow() {
      let res = false
      res = this.calendar.multipleDateRange
        ? ~this.calendar.multipleDateRange
            .map(range => range.end)
            .indexOf(this.day.date)
        : -1
      // console.log(res)
      return this.isLast && this.fConfigs.isMultipleDateRange && res
    }
  },
  watch: {
    day: {
      handler() {
        this.isLast = true
      },
      deep: true
    }
  },
  methods: {
    inRangeInit() {
      //!!!!\\
      const helpCalendar = this.helpCalendar
      String.prototype.inRange = function(arr) {
        let res = false
        arr.forEach(el => {
          const start = +helpCalendar.getDateFromFormat(el.start.split(' ')[0])
          const end = +helpCalendar.getDateFromFormat(el.end.split(' ')[0])
          const current = +helpCalendar.getDateFromFormat(this.split(' ')[0])
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
      this.isLast = false
    },
    dayMouseOver() {
      this.$emit('dayMouseOver', this.day.date)
    },
    hasSlot(name = 'default') {
      return (
        !!this.$parent.$parent.$slots[name] ||
        !!this.$parent.$parent.$scopedSlots[name]
      )
    },
    isDisabledDate(date) {
      let today = new Date()
      today.setHours(0, 0, 0, 0)
      let dateObj = this.helpCalendar.getDateFromFormat(date)

      return (
        this.fConfigs.disabledDates.includes(date) ||
        (this.fConfigs.disabledDates.includes('beforeToday') &&
          dateObj.getTime() < today.getTime()) ||
        (this.fConfigs.disabledDates.includes('afterToday') &&
          dateObj.getTime() > today.getTime())
      )
    },
    getClassNames(day) {
      let classes = []

      if (!this.hasSlot('default')) {
        classes.push('vfc-span-day')
      }

      // Disable days of week if set in configuration
      let dateDay = this.helpCalendar.getDateFromFormat(day.date).getDay() - 1
      if (dateDay === -1) {
        dateDay = 6
      }
      let dayOfWeekString = this.fConfigs.dayNames[dateDay]
      if (this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {
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
      if (
        !day.hideLeftAndRightDays &&
        !this.fConfigs.disabledDayNames.includes(dayOfWeekString)
      ) {
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
  .times {
    position: absolute;
    top: -5px;
    right: 10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    width: 15px;
    z-index: 3;
    height: 15px;
    line-height: 15px;
    &:hover {
      cursor: pointer;
      background-color: rgb(199, 0, 0);
    }
  }
}
</style>
