<template>
    <div class="vfc-popover-container" ref="popoverElement" tabindex="0">
        <div class="vfc-multiple-input" :class="{'vfc-dark': fConfigs.isDark}"
             v-if="fConfigs.isModal && fConfigs.isDateRange">
            <slot name="dateRangeInputs" :startDate="dateRangeSelectedStartDate" :endDate="dateRangeSelectedEndDate"
                  :isTypeable="fConfigs.isTypeable">
                <input type="text" title="Start Date"
                       v-model="dateRangeSelectedStartDate"
                       :placeholder="fConfigs.placeholder"
                       :readonly="!fConfigs.isTypeable"
                       :maxlength="fConfigs.dateFormat.length">
                <input type="text" title="End Date"
                       v-model="dateRangeSelectedEndDate"
                       :placeholder="fConfigs.placeholder"
                       :readonly="!fConfigs.isTypeable"
                       :maxlength="fConfigs.dateFormat.length">
            </slot>
        </div>
        <div :class="{'vfc-dark': fConfigs.isDark}" v-else-if="fConfigs.isModal && fConfigs.isDatePicker">
            <slot name="datePickerInput" :selectedDate="singleSelectedDate" :isTypeable="fConfigs.isTypeable">
                <input class="vfc-single-input" type="text" title="Date"
                       v-model="singleSelectedDate"
                       :placeholder="fConfigs.placeholder"
                       :readonly="!fConfigs.isTypeable"
                       :maxlength="fConfigs.dateFormat.length">
            </slot>
        </div>
        <div v-else-if="fConfigs.isModal && fConfigs.isMultipleDatePicker" class="vfc-tags-input-root"
             :class="{'vfc-dark': fConfigs.isDark}">
            <div class="vfc-tags-input-wrapper-default vfc-tags-input">
                <span
                        class="vfc-tags-input-badge vfc-tags-input-badge-pill vfc-tags-input-badge-selected-default"
                        v-for="(date, index) in calendar.selectedDates"
                        :key="index"
                >
                  <span v-html="date.date"></span>
                  <a href="#" class="vfc-tags-input-remove" @click.prevent="removeFromSelectedDates(index)"></a>
                </span>

                <input v-model="calendar.selectedDatesItem"
                       @keydown.enter.prevent="addToSelectedDates"
                       type="text"
                       placeholder="Add a date"
                >
            </div>
        </div>

        <div class="vfc-main-container" v-show="showCalendar"
             ref="mainContainer"
             :class="{'vfc-modal': fConfigs.isModal && (fConfigs.isDatePicker || fConfigs.isDateRange || fConfigs.isMultipleDatePicker), 'vfc-dark': fConfigs.isDark}">
            <time-picker v-if="showTimePicker"></time-picker>
            <template v-else>
                <div class="vfc-calendars-container">
                    <div class="vfc-separately-navigation-buttons" :class="'vfc-' + fConfigs.arrowsPosition"
                         v-if="!fConfigs.isSeparately">
                        <div @click="PreMonth(0)" :class="{'vfc-cursor-pointer': allowPreDate}">
                            <slot name="navigationArrowLeft">
                                <div class="vfc-arrow-left" :class="{'vfc-disabled': !allowPreDate}"></div>
                            </slot>
                        </div>
                        <div @click="NextMonth(0)" :class="{'vfc-cursor-pointer': allowNextDate}">
                            <slot name="navigationArrowRight">
                                <div class="vfc-arrow-right" :class="{'vfc-disabled': !allowNextDate}"></div>
                            </slot>
                        </div>
                    </div>
                    <div class="vfc-calendars" ref="calendars">
                        <div class="vfc-calendar" v-for="(calendarItem, key) in listCalendars"
                             :key="calendarItem.key">
                            <month-year-picker ref="monthContainer"
                                               :class="'vfc-' + fConfigs.titlePosition"
                                               v-show="showMonthPicker === key+1 || showYearPicker === key+1"
                                               :calendar-key="key">
                            </month-year-picker>
                            <div class="vfc-content">
                                <div v-if="fConfigs.isSeparately" class="vfc-separately-navigation-buttons"
                                     :class="'vfc-' + fConfigs.arrowsPosition">
                                    <div @click="PreMonth(key)" :class="{'vfc-cursor-pointer': allowPreDate}">
                                        <slot name="navigationArrowLeft">
                                            <div class="vfc-arrow-left" :class="{'vfc-disabled': !allowPreDate}"></div>
                                        </slot>
                                    </div>
                                    <div @click="NextMonth(key)" :class="{'vfc-cursor-pointer': allowNextDate}">
                                        <slot name="navigationArrowRight">
                                            <div class="vfc-arrow-right"
                                                 :class="{'vfc-disabled': !allowNextDate}"></div>
                                        </slot>
                                    </div>
                                </div>
                                <transition
                                        tag="div"
                                        :name='getTransition_()' appear>
                                    <div class="vfc-top-date"
                                         :class="'vfc-' + fConfigs.titlePosition"
                                         v-if="checkHiddenElement('month')">
                                        <a href="#" @click.prevent="openMonthPicker(key+1)"
                                           :class="{'vfc-cursor-pointer vfc-underline':fConfigs.changeMonthFunction, 'vfc-underline-active':showMonthPicker === key+1}">
                                            {{ calendarItem.month }}</a>
                                        <a href="#" @click.prevent="openYearPicker(key+1)"
                                           :class="{'vfc-cursor-pointer vfc-underline':fConfigs.changeYearFunction,  'vfc-underline-active':showYearPicker === key+1}">
                                            {{ calendarItem.year }}
                                        </a>
                                    </div>
                                </transition>
                                <transition
                                        tag="div"
                                        :name='getTransition_()' appear>
                                    <div class="vfc-dayNames">
                                        <span v-if="fConfigs.showWeekNumbers"></span>
                                        <span v-for="(dayName, dayKey) in fConfigs.dayNames" :key="key + dayKey + 1"
                                              class="vfc-day">
                                            <template v-if="checkHiddenElement('dayNames')">
                                                {{ dayName }}
                                            </template>
                                        </span>

                                    </div>
                                </transition>
                                <transition-group
                                        tag='div'
                                        :name='getTransition_()' appear>
                                    <div class="vfc-week" v-for="(week, week_key) in calendarItem.weeks"
                                         :key="key + week_key + 1">
                                        <div v-if="fConfigs.showWeekNumbers" class="vfc-day vfc-week-number">
                                            <span class="vfc-span-day">
                                                {{ week.number }}
                                            </span>
                                        </div>
                                        <div class="vfc-day" ref="day" v-for="(day, day_key) in week.days"
                                             :key="key + week_key + day_key + 1">
                                            <div v-if="(day.isDateRangeStart || day.isMouseToLeft) && !day.hideLeftAndRightDays"
                                                 class="vfc-base-start">
                                            </div>
                                            <div v-else-if="(day.isDateRangeEnd || day.isMouseToRight) && !day.hideLeftAndRightDays"
                                                 class="vfc-base-end">
                                            </div>
                                            <span v-if="!day.hideLeftAndRightDays"
                                                  :class="getClassNames(day)"
                                                  @click="clickDay(day)"
                                                  @mouseover="dayMouseOver(week_key, day.date)">
                                                <slot :week="week" :day="day">
                                                    {{ day.day }}
                                                </slot>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="vfc-week"
                                         v-if="calendarItem.weeks.length < 6 && !fConfigs.isLayoutExpandable"
                                         v-for="moreWeekKey in (6-calendarItem.weeks.length)"
                                         :key="key + moreWeekKey + 'moreWeek'">
                                        <div v-if="fConfigs.showWeekNumbers" class="vfc-day vfc-week-number">
                                            <span class="vfc-span-day">
                                            </span>
                                        </div>
                                        <div class="vfc-day" ref="day" v-for="i in 7"
                                             :key="key + moreWeekKey + i">
                                            <span class="vfc-span-day">&nbsp;</span>
                                        </div>
                                    </div>
                                </transition-group>
                            </div>
                        </div>
                    </div>
                    <slot name="footer"></slot>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
  import helpCalendarClass from '../assets/js/helpCalendar'
  import { propsAndData } from '../mixins/propsAndData'
  import TimePicker from '../components/TimePicker'
  import MonthYearPicker from '../components/MonthYearPicker'
  import { hElContains, hUniqueID } from '../utils/helpers'

  export default {
    name: 'FunctionalCalendar',
    components: { MonthYearPicker, TimePicker },
    mixins: [propsAndData],
    computed: {
      helpCalendar () {
        return new helpCalendarClass(
          this.fConfigs.sundayStart,
          this.checkHiddenElement('leftAndRightDays'),
          this.fConfigs.dateFormat,
          this.fConfigs.dayNames,
        )
      },
      singleSelectedDate: {
        get () {
          return this.calendar.selectedDate ? this.calendar.selectedDate : ''
        },
        set (newValue) {
          newValue = this.helpCalendar.mask(newValue)
          if (this.helpCalendar.getDateFromFormat(newValue).getMonth()) {
            this.calendar.selectedDate = newValue
          }
        },
      },
      dateRangeSelectedStartDate: {
        get () {
          return this.calendar.dateRange.start.date ? this.calendar.dateRange.start.date : ''
        },
        set (newValue) {
          newValue = this.helpCalendar.mask(newValue)
          if (this.helpCalendar.getDateFromFormat(newValue).getMonth()) {
            this.calendar.dateRange.start.date = newValue
          }
        },
      },
      dateRangeSelectedEndDate: {
        get () {
          return this.calendar.dateRange.end.date ? this.calendar.dateRange.end.date : ''
        },
        set (newValue) {
          newValue = this.helpCalendar.mask(newValue)
          if (this.helpCalendar.getDateFromFormat(newValue).getMonth()) {
            this.calendar.dateRange.end.date = newValue
          }
        },
      },
    },
    created () {
      this.setConfigs()
      this.initCalendar()
    },
    mounted () {
      this.popoverElement = this.$refs.popoverElement
      // Event
      this.popoverElement.addEventListener('focusin', this.onFocusIn)
      this.popoverElement.addEventListener('focusout', this.onFocusOut)
      window.addEventListener('click', this.hideMonthYearPicker)

      // Reacts to external selected dates
      this.$watch('value', function (value) {
        if (typeof value === 'object' && (value.hasOwnProperty('dateRange') || value.hasOwnProperty('selectedDate'))) {
          this.calendar = value
        }
      }, { immediate: true, deep: true })

      this.$watch('showCalendar', function (value) {
        if (value)
          this.$emit('opened')
        else
          this.$emit('closed')
      }, { immediate: true, deep: true })

    },
    beforeDestroy: function () {
      window.removeEventListener('focusin', this.onFocusIn)
      window.removeEventListener('focusout', this.onFocusOut)
      window.removeEventListener('click', this.hideMonthYearPicker)
    },
    watch: {
      'fConfigs': {
        handler () {
          this.markChooseDays()
        },
        deep: true,
        immediate: true
      },
      'calendar': {
        handler () {
          this.markChooseDays()
        },
        deep: true,
        immediate: true
      },
      'calendar.currentDate': {
        handler (value) {
          this.$emit('input', this.calendar)
          this.checkLimits(value)
        },
      },
    },
    methods: {
      initCalendar () {
        this.setCalendarData()
        this.listRendering()
        this.markChooseDays()
        this.checkLimits(this.calendar.currentDate)
      },
      updateCalendar () {
        this.setExistingCalendarData()
        this.listRendering()
        this.markChooseDays()
      },
      setCalendarData () {
        let date = this.calendar.currentDate
        date = new Date(date.getFullYear(), date.getMonth() - 1)

        this.listCalendars = []

        for (let i = 0; i < this.fConfigs.calendarsCount; i++) {
          date = new Date(date.getFullYear(), date.getMonth() + 1)

          let calendar = {
            key: i + hUniqueID(),
            date: date,
            dateTop: `${this.fConfigs.monthNames[date.getMonth()]} ${date.getFullYear()}`,
            month: this.fConfigs.monthNames[date.getMonth()],
            year: date.getFullYear(),
            weeks: this.helpCalendar.getFinalizedWeeks(date.getMonth(), date.getFullYear()),
          }

          this.listCalendars.push(calendar)

          if (!this.fConfigs.isMultiple) {
            break
          }
        }
      },
      setExistingCalendarData () {
        for (let i = 0; i < this.listCalendars.length; i++) {
          let calendar = this.listCalendars[i]
          let date = calendar.date

          this.$set(this.listCalendars, i, {
            key: calendar.key,
            date: date,
            dateTop: `${this.fConfigs.monthNames[date.getMonth()]} ${date.getFullYear()}`,
            month: this.fConfigs.monthNames[date.getMonth()],
            year: date.getFullYear(),
            weeks: this.helpCalendar.getFinalizedWeeks(date.getMonth(), date.getFullYear()),
          })

          if (!this.fConfigs.isMultiple) {
            break
          }
        }
      },
      setConfigs () {
        let vm = this
        let globalOptions
        if (typeof vm.$getOptions !== 'undefined') {
          // Global Options
          globalOptions = vm.$getOptions()
          Object.keys(globalOptions).forEach(function (objectKey) {
            if (typeof (vm.fConfigs[objectKey]) !== 'undefined') {
              vm.$set(vm.fConfigs, objectKey, globalOptions[objectKey])
            }
          })
        }

        if (typeof (vm.configs) !== 'undefined') {
          Object.keys(vm.fConfigs).forEach(function (objectKey) {
            if (typeof (vm.configs[objectKey]) !== 'undefined') {
              // Get From Configs
              vm.$set(vm.fConfigs, objectKey, vm.configs[objectKey])
            }
          })
        } else {
          Object.keys(vm.$props).forEach(function (objectKey) {
            if (typeof (vm.fConfigs[objectKey]) !== 'undefined' &&
              typeof (vm.$props[objectKey]) !== 'undefined') {
              vm.$set(vm.fConfigs, objectKey, vm.$props[objectKey])
            }
          })
        }

        // Is Modal
        if (vm.fConfigs.isModal) vm.showCalendar = false

        // Placeholder
        if (!vm.fConfigs.placeholder) vm.fConfigs.placeholder = vm.fConfigs.dateFormat

        if (typeof vm.newCurrentDate !== 'undefined') {
          vm.calendar.currentDate = vm.newCurrentDate
        }

        // Sunday Start
        if (vm.fConfigs.sundayStart) {
          let dayNames = vm.fConfigs.dayNames
          let sundayName = dayNames[dayNames.length - 1]
          dayNames.splice(dayNames.length - 1, 1)
          dayNames.unshift(sundayName)
        }
      },
      listRendering () {
        let vm = this

        // Each Calendars
        vm.listCalendars.forEach(function (calendar) {
          // Set Calendar Weeks
          calendar.weeks.forEach(function (week) {

            let finalizedDays = []

            week.days.forEach(function (day) {
              let date = new Date(day.year, day.month, day.day)
              let now = new Date()

              let isToday = false

              date.setHours(0, 0, 0, 0)
              now.setHours(0, 0, 0, 0)

              if (date.getTime() === now.getTime()) {
                isToday = true
              }

              let checkMarked
              // With Custom Classes
              if (typeof vm.fConfigs.markedDates[0] === 'object') {
                checkMarked = vm.fConfigs.markedDates.find(function (markDate) {
                  return markDate.date === vm.helpCalendar.formatDate(date)
                })
              } else {
                // Without Classes
                checkMarked = vm.fConfigs.markedDates.find(function (markDate) {
                  return markDate === vm.helpCalendar.formatDate(date)
                })
              }

              if (vm.calendar.dateRange.start.date === vm.helpCalendar.formatDate(date)) {
                checkMarked = true
              }

              let isMarked = false
              if (typeof checkMarked !== 'undefined') {
                isMarked = true
              }

              finalizedDays.push({
                day: day.day,
                date: vm.helpCalendar.formatDate(date),
                hide: day.hide,
                isMouseToLeft: false,
                isMouseToRight: false,
                isHovered: false,
                isDateRangeStart: vm.checkDateRangeStart(vm.helpCalendar.formatDate(date)),
                isDateRangeEnd: vm.checkDateRangeEnd(vm.helpCalendar.formatDate(date)),
                hideLeftAndRightDays: day.hideLeftAndRightDays,
                isToday: isToday,
                isMarked: isMarked,
              })
            })

            week.days = finalizedDays
          })
        })

      },
      clickDay (item) {
        this.$emit('dayClicked', item)

        if (!this.fConfigs.isDateRange && !this.fConfigs.isDatePicker && !this.fConfigs.isMultipleDatePicker) {
          return false
        }

        //Disabled Dates - Start

        // Disable days of week if set in configuration
        let dateDay = this.helpCalendar.getDateFromFormat(item.date).getDay() - 1
        if (dateDay === -1) {
          dateDay = 6
        }

        let dayOfWeekString = this.fConfigs.dayNames[dateDay]
        if (this.fConfigs.disabledDayNames.includes(dayOfWeekString) || this.isDisabledDate(item.date)) {
          return false
        }

        //Disabled Dates - End

        // Limits
        if (this.fConfigs.limits) {
          let min = this.helpCalendar.getDateFromFormat(this.fConfigs.limits.min).getTime()
          let max = this.helpCalendar.getDateFromFormat(this.fConfigs.limits.max).getTime()
          let date = this.helpCalendar.getDateFromFormat(item.date).getTime()

          if (date < min || date > max) {
            return false
          }
        }

        // Date Range
        if (this.fConfigs.isDateRange) {

          let clickDate = this.helpCalendar.getDateFromFormat(item.date).getTime()

          let startDate = false
          if (this.calendar.dateRange.start.date) {
            startDate = this.helpCalendar.getDateFromFormat(this.calendar.dateRange.start.date)
          }

          // Two dates is not empty
          if (this.calendar.dateRange.start.date !== false && this.calendar.dateRange.end.date !== false) {
            this.calendar.dateRange.start.date = item.date
            this.calendar.dateRange.end.date = false
            // Not date selected
          } else if (this.calendar.dateRange.start.date === false && this.calendar.dateRange.end.date === false) {
            this.calendar.dateRange.start.date = item.date
            // Start Date not empty, chose date > start date
          } else if (this.calendar.dateRange.end.date === false && (clickDate > startDate.getTime())) {
            this.calendar.dateRange.end.date = item.date
            // Start date not empty, chose date <= start date (also same date range select)
          } else if (this.calendar.dateRange.start.date !== false && (clickDate <= startDate.getTime())) {
            this.calendar.dateRange.end.date = this.calendar.dateRange.start.date
            this.calendar.dateRange.start.date = item.date
          }

          //Get number of days between date range dates
          if (this.calendar.dateRange.start.date !== false && this.calendar.dateRange.end.date !== false) {
            let oneDay = 24 * 60 * 60 * 1000
            let firstDate = this.helpCalendar.getDateFromFormat(this.calendar.dateRange.start.date)
            let secondDate = this.helpCalendar.getDateFromFormat(this.calendar.dateRange.end.date)
            let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)))
            let itemTime = this.helpCalendar.getDateFromFormat(item.date).getTime()

            this.$emit('selectedDaysCount', diffDays)

            // Is Auto Closeable
            if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
              this.showCalendar = false
            }

            // Minimum Selected Days
            let minSelDays = this.fConfigs.minSelDays

            if (minSelDays && itemTime >= startDate.getTime() && diffDays < minSelDays) {
              startDate.setDate(startDate.getDate() + (minSelDays - 1))
              this.calendar.dateRange.end.date = this.helpCalendar.formatDate(startDate)
            }

            if (minSelDays && itemTime < startDate.getTime() && diffDays < minSelDays) {
              startDate.setDate(startDate.getDate() - (minSelDays - 1))
              this.calendar.dateRange.start.date = this.helpCalendar.formatDate(startDate)
            }

            // Maximum Selected Days
            let maxSelDays = this.fConfigs.maxSelDays

            if (maxSelDays && itemTime >= startDate.getTime() && diffDays >= maxSelDays) {
              startDate.setDate(startDate.getDate() + (maxSelDays - 1))
              this.calendar.dateRange.end.date = this.helpCalendar.formatDate(startDate)
            }

            if (maxSelDays && itemTime < startDate.getTime() && diffDays >= maxSelDays) {
              startDate.setDate(startDate.getDate() - (maxSelDays - 1))
              this.calendar.dateRange.start.date = this.helpCalendar.formatDate(startDate)
            }
          }

          this.$emit('input', this.calendar)
        } else if (this.fConfigs.isDatePicker) {
          this.calendar.selectedDate = item.date
          this.$emit('input', this.calendar)

          // Is Auto Closeable
          if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
            this.showCalendar = false
          }
        } else if (this.fConfigs.isMultipleDatePicker) {
          if (this.calendar.hasOwnProperty('selectedDates') &&
            this.calendar.selectedDates.find(date => date.date === item.date)) {
            let dateIndex = this.calendar.selectedDates.findIndex(date => date.date === item.date)
            this.calendar.selectedDates.splice(dateIndex, 1)
          } else {
            let date = Object.assign({}, this.defaultDateFormat)
            date.date = item.date

            if (!this.calendar.hasOwnProperty('selectedDates')) {
              this.calendar.selectedDates = []
            }

            this.calendar.selectedDates.push(date)
          }

          this.$emit('input', this.calendar)
        }

        this.markChooseDays()

        // Time Picker
        if (this.fConfigs.withTimePicker) {
          if (this.fConfigs.isDateRange || this.fConfigs.isDatePicker) {
            this.openTimePicker()
          }

          if (this.calendar.selectedDates.find(date => date.date === item.date) && this.fConfigs.isMultipleDatePicker) {
            this.openTimePicker()
          }
        }

        this.$emit('choseDay', item)
      },
      markChooseDays () {
        let vm = this
        let startDate = vm.calendar.dateRange.start.date
        let endDate = vm.calendar.dateRange.end.date

        this.listCalendars.forEach((calendar) => {
          calendar.weeks.forEach((week) => {
            week.days.forEach((day) => {

              day.isMarked = false

              // Date Picker
              if (vm.fConfigs.isDatePicker) {
                if (this.calendar.selectedDate === day.date)
                  day.isMarked = true
              } else if (vm.fConfigs.isMultipleDatePicker) {
                if (vm.calendar.hasOwnProperty('selectedDates') &&
                  vm.calendar.selectedDates.find(date => date.date === day.date))
                  day.isMarked = true
              } else {
                day.isMouseToLeft = false
                day.isMouseToRight = false

                // Date Range
                if (startDate === day.date) {
                  day.isMouseToLeft = !!endDate
                  day.isMarked = true
                }

                if (endDate === day.date) {
                  day.isMouseToRight = !!endDate
                  day.isMarked = true
                }

                if (startDate && startDate === endDate) {
                  day.isMouseToLeft = false
                  day.isMouseToRight = false
                }

                if (startDate && endDate) {
                  if (this.helpCalendar.getDateFromFormat(day.date).getTime() >
                    this.helpCalendar.getDateFromFormat(startDate)
                    && this.helpCalendar.getDateFromFormat(day.date) < this.helpCalendar.getDateFromFormat(endDate)) {
                    day.isMarked = true
                  }
                }
              }

              if (this.fConfigs.markedDates.includes(day.date))
                day.isMarked = true
            })
          })
        })
      },
      dayMouseOver (week_key, date) {
        if (!this.fConfigs.isDateRange) {
          return false
        }

        // Limits
        if (this.fConfigs.limits) {
          let limitMin = this.helpCalendar.getDateFromFormat(this.fConfigs.limits.min).getTime()
          let limitMax = this.helpCalendar.getDateFromFormat(this.fConfigs.limits.max).getTime()
          let limitDate = this.helpCalendar.getDateFromFormat(date).getTime()

          if (limitDate < limitMin || limitDate > limitMax) {
            return false
          }
        }

        if ((this.calendar.dateRange.start.date === false || this.calendar.dateRange.end.date === false)
          && (this.calendar.dateRange.start.date !== false || this.calendar.dateRange.end.date !== false)) {

          for (let e = 0; e < this.listCalendars.length; e++) {
            let calendar = this.listCalendars[e]

            for (let f = 0; f < calendar.weeks.length; f++) {
              let week = calendar.weeks[f]

              for (let i = 0; i < week.days.length; i++) {

                let item = week.days[i]

                this.listCalendars[e].weeks[f].days[i].isHovered = false

                if (item.date !== this.calendar.dateRange.start.date &&
                  !this.fConfigs.markedDates.includes(item.date)) {
                  this.listCalendars[e].weeks[f].days[i].isMarked = false
                }

                if (this.calendar.dateRange.start.date) {
                  let itemDate = this.helpCalendar.getDateFromFormat(item.date).getTime()
                  let thisDate = this.helpCalendar.getDateFromFormat(date).getTime()
                  let startDate = this.helpCalendar.getDateFromFormat(this.calendar.dateRange.start.date)

                  this.listCalendars[e].weeks[f].days[i].isMouseToLeft = (itemDate === startDate.getTime() && thisDate >
                    startDate.getTime()) || (itemDate === thisDate && thisDate < startDate.getTime())
                  this.listCalendars[e].weeks[f].days[i].isMouseToRight = (itemDate === startDate.getTime() &&
                    thisDate < startDate.getTime()) || (itemDate === thisDate && thisDate > startDate.getTime())

                  let dateDay = this.helpCalendar.getDateFromFormat(item.date).getDay() - 1
                  if (dateDay === -1) {
                    dateDay = 6
                  }

                  let dayOfWeekString = this.fConfigs.dayNames[dateDay]
                  if (!this.fConfigs.disabledDayNames.includes(dayOfWeekString) &&
                    ((itemDate > startDate.getTime() && itemDate < thisDate)
                      ||
                      (itemDate < startDate.getTime() && itemDate > thisDate))
                  ) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = true
                  }

                  if (!this.calendar.dateRange.end.date && itemDate === thisDate) {
                    this.listCalendars[e].weeks[f].days[i].isHovered = true
                  }

                  if (this.checkSelDates('min', this.calendar.dateRange.start.date, item.date, date)) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = true

                    let minDateToRight, minDateToLeft
                    minDateToLeft = new Date(startDate.getTime())
                    minDateToRight = new Date(startDate.getTime())
                    minDateToLeft.setDate(minDateToLeft.getDate() - this.fConfigs.minSelDays + 1)
                    minDateToRight.setDate(minDateToRight.getDate() + this.fConfigs.minSelDays - 1)

                    if (thisDate >= minDateToLeft.getTime() && this.helpCalendar.formatDate(minDateToLeft) ===
                      item.date) {
                      this.listCalendars[e].weeks[f].days[i].isMarked = false
                      this.listCalendars[e].weeks[f].days[i].isMouseToLeft = true
                      this.listCalendars[e].weeks[f].days[i].isHovered = true
                    } else if (thisDate <= minDateToRight.getTime() && this.helpCalendar.formatDate(minDateToRight) ===
                      item.date) {
                      this.listCalendars[e].weeks[f].days[i].isMarked = false
                      this.listCalendars[e].weeks[f].days[i].isMouseToRight = true
                      this.listCalendars[e].weeks[f].days[i].isHovered = true
                    }
                  }

                  if (this.checkSelDates('max', this.calendar.dateRange.start.date, item.date, date)) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = false
                    this.listCalendars[e].weeks[f].days[i].isHovered = false
                    this.listCalendars[e].weeks[f].days[i].isMouseToLeft = false
                    this.listCalendars[e].weeks[f].days[i].isMouseToRight = false

                    let maxDateToLeft, maxDateToRight
                    maxDateToLeft = new Date(startDate.getTime())
                    maxDateToRight = new Date(startDate.getTime())
                    maxDateToLeft.setDate(maxDateToLeft.getDate() - this.fConfigs.maxSelDays + 1)
                    maxDateToRight.setDate(maxDateToRight.getDate() + this.fConfigs.maxSelDays - 1)

                    if (thisDate <= maxDateToLeft.getTime()) {
                      if (this.helpCalendar.formatDate(maxDateToLeft) === item.date) {
                        this.listCalendars[e].weeks[f].days[i].isHovered = true
                        this.listCalendars[e].weeks[f].days[i].isMouseToLeft = true
                      }
                    }

                    if (thisDate >= maxDateToRight.getTime()) {
                      if (this.helpCalendar.formatDate(maxDateToRight) === item.date) {
                        this.listCalendars[e].weeks[f].days[i].isHovered = true
                        this.listCalendars[e].weeks[f].days[i].isMouseToRight = true
                      }
                    }
                  }
                }
              }

            }
          }
        }
      },
      /**
       * @return {boolean}
       */
      PreMonth (calendarKey = null) {
        if (!this.allowPreDate)
          return false

        this.transitionPrefix = 'right'

        calendarKey = calendarKey !== null ? calendarKey : 0

        let currentCalendar = this.listCalendars[calendarKey]
        currentCalendar.date = new Date(currentCalendar.date.getFullYear(), currentCalendar.date.getMonth() - 1)
        currentCalendar.key -= hUniqueID()
        this.updateCalendar()

        if (!this.fConfigs.isSeparately) {
          this.calendar.currentDate = currentCalendar.date
          this.initCalendar()
        }

        this.$emit('changedMonth', currentCalendar.date)
      },
      /**
       * @return {boolean}
       */
      NextMonth (calendarKey = null) {
        if (!this.allowNextDate)
          return false

        this.transitionPrefix = 'left'

        calendarKey = calendarKey !== null ? calendarKey : 0

        let currentCalendar = this.listCalendars[calendarKey]
        currentCalendar.date = new Date(currentCalendar.date.getFullYear(), currentCalendar.date.getMonth() + 1)
        currentCalendar.key += hUniqueID()
        this.updateCalendar()

        if (!this.fConfigs.isSeparately) {
          this.calendar.currentDate = currentCalendar.date
          this.initCalendar()
        }

        this.$emit('changedMonth', currentCalendar.date)
      },
      /**
       * @return {boolean}
       */
      PreYear (calendarKey = null) {
        if (!this.allowPreDate)
          return false

        let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1

        calendarKey = calendarKey !== null ? calendarKey : 0

        let currentCalendar = this.listCalendars[calendarKey]
        currentCalendar.date = new Date(currentCalendar.date.getFullYear() - step, currentCalendar.date.getMonth())
        this.updateCalendar()

        if (!this.fConfigs.isSeparately) {
          this.calendar.currentDate = currentCalendar.date
          this.initCalendar()
        }

        this.$emit('changedYear', currentCalendar.date)

      },
      /**
       * @return {boolean}
       */
      NextYear (calendarKey = null) {
        if (!this.allowNextDate)
          return false

        let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1

        calendarKey = calendarKey !== null ? calendarKey : 0

        let currentCalendar = this.listCalendars[calendarKey]
        currentCalendar.date = new Date(currentCalendar.date.getFullYear() + step, currentCalendar.date.getMonth())
        this.updateCalendar()

        if (!this.fConfigs.isSeparately) {
          this.calendar.currentDate = currentCalendar.date
          this.initCalendar()
        }

        this.$emit('changedYear', currentCalendar.date)
      },
      ChooseDate (date) {
        let newDate = this.helpCalendar.getDateFromFormat(date)

        if (date === 'today') {
          newDate = new Date()
        }

        this.listCalendars[0].date = this.calendar.currentDate = newDate

        this.updateCalendar()
        this.initCalendar()
      },
      openMonthPicker (key) {
        if (this.fConfigs.changeMonthFunction) {
          this.showMonthPicker = (key === this.showMonthPicker) ? false : key
          this.showYearPicker = false
        }
      },
      openYearPicker (key) {
        if (this.fConfigs.changeYearFunction) {
          this.showYearPicker = (key === this.showYearPicker) ? false : key
          this.showMonthPicker = false
        }
      },
      openTimePicker () {
        this.showTimePicker = true
      },
      pickMonth (key, calendarKey) {
        this.showMonthPicker = false

        let currentCalendar = this.listCalendars[calendarKey]
        let date = currentCalendar.date
        currentCalendar.date = new Date(date.getFullYear(), key + 1, 0)
        currentCalendar.key += hUniqueID()
        this.updateCalendar()
      },
      pickYear (year, calendarKey) {
        this.showYearPicker = false

        let currentCalendar = this.listCalendars[calendarKey]
        let date = currentCalendar.date
        currentCalendar.date = new Date(year, date.getMonth() + 1, 0)
        currentCalendar.key += hUniqueID()
        this.updateCalendar()
      },
      getYearList (date) {
        let years = []
        let year = date.getFullYear() - 4
        for (let i = 0; i < 12; i++) {
          let finalYear = year + i

          years.push({
            year: finalYear,
          })
        }
        return years
      },
      /**
       * Add date to selectedDates list
       * @param index
       */
      addToSelectedDates () {
        if (this.helpCalendar.checkValidDate(this.calendar.selectedDatesItem)) {
          let date = Object.assign({}, this.defaultDateFormat)
          date.date = this.calendar.selectedDatesItem
          this.calendar.selectedDates.push(date)
          this.calendar.selectedDatesItem = ''
          this.markChooseDays()
        }
      },
      /**
       * Remove date from selectedDates list
       * @param index
       */
      removeFromSelectedDates (index) {
        this.calendar.selectedDates.splice(index, 1)
        this.markChooseDays()
      },
      getClassNames (day) {
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
          let min = this.helpCalendar.getDateFromFormat(this.fConfigs.limits.min).getTime()
          let max = this.helpCalendar.getDateFromFormat(this.fConfigs.limits.max).getTime()

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

        if (!day.hideLeftAndRightDays && !this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {

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
              if (this.helpCalendar.getDateFromFormat(range.start) <= this.helpCalendar.getDateFromFormat(day.date)
                && this.helpCalendar.getDateFromFormat(range.end) >= this.helpCalendar.getDateFromFormat(day.date)) {
                classes.push('vfc-marked')
              }

              if (day.date === range.start) {
                classes.push('vfc-start-marked')
              } else if (day.date === range.end) {
                classes.push('vfc-end-marked')
              }
            })
          } else if (this.fConfigs.markedDateRange.start && this.fConfigs.markedDateRange.end) {
            // Date Range Marked
            if (this.helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.start) <=
              this.helpCalendar.getDateFromFormat(day.date)
              && this.helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.end) >=
              this.helpCalendar.getDateFromFormat(day.date)) {
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
              if (this.helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.start) <=
                this.helpCalendar.getDateFromFormat(day.date))
                classes.push('vfc-marked')
            }

            // Only Before End Marked
            if (this.fConfigs.markedDateRange.end) {
              if (this.helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.end) >=
                this.helpCalendar.getDateFromFormat(day.date))
                classes.push('vfc-marked')
            }
          }

          classes.push('vfc-hover')
        }

        // Date Mark With Custom Classes
        if (typeof this.fConfigs.markedDates === 'object') {
          let checkMarked = this.fConfigs.markedDates.find(function (markDate) {
            return markDate.date === day.date
          })

          if (typeof checkMarked !== 'undefined') {
            classes.push(checkMarked.class)
          }
        }

        if (day.date === this.calendar.dateRange.start.date) {
          classes.push('vfc-start-marked')
        }

        if (day.date === this.calendar.dateRange.end.date) {
          classes.push('vfc-end-marked')
        }

        if (day.date === this.calendar.selectedDate || (this.calendar.hasOwnProperty('selectedDates') &&
          this.calendar.selectedDates.find(sDate => sDate.date === day.date))) {
          classes.push('vfc-borderd')
        }

        return classes
      },
      checkDateRangeStart (date) {
        if (Array.isArray(this.fConfigs.markedDateRange)) {
          return this.fConfigs.markedDateRange.findIndex(range => {
            return range.start === date
          }) !== -1
        }

        return date === this.fConfigs.markedDateRange.start
      },
      checkDateRangeEnd (date) {
        if (Array.isArray(this.fConfigs.markedDateRange)) {
          return this.fConfigs.markedDateRange.findIndex(range => {
            return range.end === date
          }) !== -1
        }

        return date === this.fConfigs.markedDateRange.end
      },
      checkSelDates (type, startDate, itemDate, hoverDate) {
        let startTime = this.helpCalendar.getDateFromFormat(startDate).getTime()
        let itemTime = this.helpCalendar.getDateFromFormat(itemDate).getTime()
        let hoverTime = this.helpCalendar.getDateFromFormat(hoverDate).getTime()

        let days = type === 'min' ? this.fConfigs.minSelDays : this.fConfigs.maxSelDays - 2
        let minTime = days * 1000 * 60 * 60 * 24
        let rightTime = startTime + minTime
        let leftTime = startTime - minTime

        let result
        if (hoverTime > startTime) {
          if (type === 'min')
            result = itemTime < rightTime && itemTime > startTime && this.fConfigs.minSelDays
          else
            result = itemTime > rightTime && itemTime > startTime && this.fConfigs.maxSelDays
        } else if (hoverTime < startTime) {
          if (type === 'min')
            result = itemTime > leftTime && itemTime < startTime && this.fConfigs.minSelDays
          else
            result = itemTime < leftTime && itemTime < startTime && this.fConfigs.maxSelDays
        }

        return result
      },
      checkLimits (value) {
        if (this.fConfigs.limits) {
          let min = new Date(this.helpCalendar.getDateFromFormat(this.fConfigs.limits.min))
          min.setDate(1)
          min.setHours(0, 0, 0, 0)
          let max = new Date(this.helpCalendar.getDateFromFormat(this.fConfigs.limits.max))
          max.setDate(1)
          max.setHours(0, 0, 0, 0)

          this.allowPreDate = true
          this.allowNextDate = true

          let current = new Date(value)
          current.setDate(1)
          current.setHours(0, 0, 0, 0)

          if (current <= min) {
            this.allowPreDate = false
          }

          if (current >= max) {
            this.allowNextDate = false
          }
        }
      },
      getTransition_ () {
        if (!this.fConfigs.transition)
          return ''

        let name = ''
        if (this.transitionPrefix === 'left') {
          name = 'vfc-calendar-slide-left'
        } else if (this.transitionPrefix === 'right') {
          name = 'vfc-calendar-slide-right'
        }
        return name
      },
      checkHiddenElement (elementName) {
        return !this.fConfigs.hiddenElements.includes(elementName)
      },
      onFocusIn () {
        if (this.fConfigs.isModal) {
          this.showCalendar = true
        }
      },
      onFocusOut (e) {
        if (this.fConfigs.isModal && !hElContains(this.popoverElement, e.relatedTarget)) {
          this.showCalendar = false
        }
      },
      isDisabledDate (date) {
        let today = new Date()
        today.setHours(0, 0, 0, 0)
        let dateObj = this.helpCalendar.getDateFromFormat(date)

        return this.fConfigs.disabledDates.includes(date) ||
          (this.fConfigs.disabledDates.includes('beforeToday') && dateObj.getTime() < today.getTime()) ||
          (this.fConfigs.disabledDates.includes('afterToday') && dateObj.getTime() > today.getTime())
      },
      hideMonthYearPicker (e) {
        if (this.showMonthPicker || this.showYearPicker) {
          let key = this.showMonthPicker ? this.showMonthPicker - 1 : this.showYearPicker - 1

          let element1 = this.$refs.calendars.querySelector(
            `.vfc-calendars .vfc-calendar:nth-child(${key + 1}) .vfc-top-date a:nth-child(1)`)
          let element2 = this.$refs.calendars.querySelector(
            `.vfc-calendars .vfc-calendar:nth-child(${key + 1}) .vfc-top-date a:nth-child(2)`)

          if (!this.$refs.monthContainer[key].$el.contains(e.target) && !element1.contains(e.target) &&
            !element2.contains(e.target)) {
            return this.showMonthPicker = this.showYearPicker = false
          }
        }
      },
      hasSlot (name = 'default') {
        return !!this.$slots[name] || !!this.$scopedSlots[name]
      },
    },
  }
</script>

<style lang="scss">
    @import "../assets/scss/calendar.scss";
</style>
