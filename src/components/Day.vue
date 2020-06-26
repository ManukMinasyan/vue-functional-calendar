<template>
  <div class="vfc-day">
    <div
      v-if="
        (day.isDateRangeStart || day.isMouseToLeft) && !day.hideLeftAndRightDays
      "
      class="vfc-base-start"
    ></div>
    <div
      v-else-if="
        (day.isDateRangeEnd || day.isMouseToRight) && !day.hideLeftAndRightDays
      "
      class="vfc-base-end"
    ></div>
    <span
      v-if="!day.hideLeftAndRightDays"
      :class="getClassNames(day)"
      @click="$parent.$parent.clickDay(day, isDisabledDate)"
      @mouseover="dayMouseOver"
    >
      <slot :week="week" :day="day">
        {{ day.day }}
      </slot>
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
  methods: {
    dayMouseOver() {
      this.$emit('dayMouseOver', this.day);
    },
    hasSlot(name = 'default') {
      return (
        !!this.$parent.$parent.$slots[name] ||
        !!this.$parent.$parent.$scopedSlots[name]
      );
    },
    isDisabledDate(date) {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      // console.log(date);
      let dateObj = this.helpCalendar.getDateFromFormat(date);

      return (
        this.fConfigs.disabledDates.includes(date) ||
        (this.fConfigs.disabledDates.includes('beforeToday') &&
          dateObj.getTime() < today.getTime()) ||
        (this.fConfigs.disabledDates.includes('afterToday') &&
          dateObj.getTime() > today.getTime())
      );
    },
    getClassNames(day) {
      let classes = [];

      if (!this.hasSlot('default')) {
        classes.push('vfc-span-day');
      }

      // Disable days of week if set in configuration
      let dateDay = this.helpCalendar.getDateFromFormat(day.date).getDay() - 1;
      if (dateDay === -1) {
        dateDay = 6;
      }
      let dayOfWeekString = this.fConfigs.dayNames[dateDay];
      if (this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {
        day.hide = true;
        classes.push('vfc-cursor-not-allowed');
      }

      let date = this.helpCalendar.getDateFromFormat(day.date);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      // Disabled dates
      if (this.isDisabledDate(day.date)) {
        classes.push('vfc-disabled');
        classes.push('vfc-cursor-not-allowed');
      }

      if (this.fConfigs.limits) {
        let min = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.min)
          .getTime();
        let max = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.max)
          .getTime();

        if (date.getTime() < min || date.getTime() > max) {
          classes.push('vfc-disabled');
          classes.push('vfc-cursor-not-allowed');
        }
      }

      if (day.hide) {
        classes.push('vfc-hide');
      }

      // Today date
      if (day.isToday) {
        classes.push('vfc-today');
      }
      if (
        !day.hideLeftAndRightDays &&
        !this.fConfigs.disabledDayNames.includes(dayOfWeekString)
      ) {
        // Mark Date
        if (day.isMarked) {
          classes.push('vfc-marked');
        } else if (day.isHovered) {
          classes.push('vfc-hovered');
        }
        if (this.fConfigs.markedDates.includes(day.date)) {
          classes.push('vfc-borderd');
        }

        if (Array.isArray(this.fConfigs.markedDateRange)) {
          this.fConfigs.markedDateRange.forEach(range => {
            if (
              this.helpCalendar.getDateFromFormat(range.start) <=
                this.helpCalendar.getDateFromFormat(day.date) &&
              this.helpCalendar.getDateFromFormat(range.end) >=
                this.helpCalendar.getDateFromFormat(day.date)
            ) {
              classes.push('vfc-marked');
            }

            if (day.date === range.start) {
              classes.push('vfc-start-marked');
            } else if (day.date === range.end) {
              classes.push('vfc-end-marked');
            }
          });
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
            classes.push('vfc-marked');
          }

          if (day.date === this.fConfigs.markedDateRange.start) {
            classes.push('vfc-start-marked');
          } else if (day.date === this.fConfigs.markedDateRange.end) {
            classes.push('vfc-end-marked');
          }
        } else {
          // Only After Start Marked
          if (this.fConfigs.markedDateRange.start) {
            if (
              this.helpCalendar.getDateFromFormat(
                this.fConfigs.markedDateRange.start
              ) <= this.helpCalendar.getDateFromFormat(day.date)
            )
              classes.push('vfc-marked');
          }

          // Only Before End Marked
          if (this.fConfigs.markedDateRange.end) {
            if (
              this.helpCalendar.getDateFromFormat(
                this.fConfigs.markedDateRange.end
              ) >= this.helpCalendar.getDateFromFormat(day.date)
            )
              classes.push('vfc-marked');
          }
        }

        classes.push('vfc-hover');
      }

      // Date Mark With Custom Classes
      if (typeof this.fConfigs.markedDates === 'object') {
        let checkMarked = this.fConfigs.markedDates.find(function(markDate) {
          return markDate.date === day.date;
        });

        if (typeof checkMarked !== 'undefined') {
          classes.push(checkMarked.class);
        }
      }

      if (day.date === this.calendar.dateRange.start.date) {
        classes.push('vfc-start-marked');
      }

      if (day.date === this.calendar.dateRange.end.date) {
        classes.push('vfc-end-marked');
      }

      if (
        day.date === this.calendar.selectedDate ||
        (this.calendar.hasOwnProperty('selectedDates') &&
          this.calendar.selectedDates.find(sDate => sDate.date === day.date))
      ) {
        classes.push('vfc-borderd');
      }

      return classes;
    }
  }
};
</script>

<style scoped></style>
