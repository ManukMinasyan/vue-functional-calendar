<template>
  <div
    class="vfc-popover-container"
    ref="popoverElement"
    tabindex="0"
    @keydown="onPopoverKeydown"
    @click="onPopoverClick"
  >
    <PickerInputs
      :fConfigs="fConfigs"
      :singleSelectedDate="singleSelectedDate"
      :calendar="calendar"
    >
      <template v-slot:dateRangeInputs="props">
        <slot
          :startDate="props.startDate"
          :endDate="props.endDate"
          :isTypeable="fConfigs.isTypeable"
          name="dateRangeInputs"
        >
        </slot>
      </template>
      <template v-slot:datePickerInput="props">
        <slot
          :selectedDate="props.selectedDate"
          :isTypeable="fConfigs.isTypeable"
          name="datePickerInput"
        >
        </slot>
      </template>
    </PickerInputs>

    <div
      class="vfc-main-container"
      v-show="showCalendar"
      ref="mainContainer"
      tabindex="-1"
      :role="isModalPicker ? 'dialog' : null"
      :aria-label="isModalPicker ? fConfigs.labels.calendar : null"
      :class="{
        'vfc-modal': isModalPicker,
        'vfc-has-presets': hasPresets,
        'vfc-dark': fConfigs.isDark
      }"
    >
      <time-picker
        v-if="showTimePicker"
        ref="timePicker"
        :height="$refs.popoverElement.clientHeight"
        :hours="activeHours"
        :minutes="activeMinutes"
      ></time-picker>

      <template v-else>
        <Presets v-if="hasPresets" />
        <div class="vfc-calendars-container">
          <Arrows
            :isMultiple="false"
            :fConfigs="fConfigs"
            :allowPreDate="allowPreDate"
            :allowNextDate="allowNextDate"
          >
            <template v-slot:navigationArrowLeft>
              <slot name="navigationArrowLeft"></slot>
            </template>
            <template v-slot:navigationArrowRight>
              <slot name="navigationArrowRight"></slot>
            </template>
          </Arrows>

          <div class="vfc-calendars" ref="calendars">
            <div
              class="vfc-calendar"
              v-for="(calendarItem, key) in listCalendars"
              :key="calendarItem.key"
            >
              <month-year-picker
                ref="monthContainer"
                :class="'vfc-' + fConfigs.titlePosition"
                :changeYearStep="fConfigs.changeYearStep"
                v-show="
                  showMonthPicker === key + 1 || showYearPicker === key + 1
                "
                :calendar-key="key"
              >
              </month-year-picker>
              <div class="vfc-content">
                <Arrows
                  :isMultiple="true"
                  :fConfigs="fConfigs"
                  :allowPreDate="allowPreDate"
                  :allowNextDate="allowNextDate"
                  :calendar-key="key"
                >
                  <template v-slot:navigationArrowLeft>
                    <slot name="navigationArrowLeft"></slot>
                  </template>
                  <template v-slot:navigationArrowRight>
                    <slot name="navigationArrowRight"></slot>
                  </template>
                </Arrows>

                <transition :name="getTransition_()" appear>
                  <div
                    class="vfc-top-date"
                    :class="'vfc-' + fConfigs.titlePosition"
                    v-if="checkHiddenElement('month')"
                  >
                    <span
                      :data-focus-id="`title-month:${key}`"
                      :role="canPickMonth(key) ? 'button' : null"
                      :tabindex="canPickMonth(key) ? 0 : null"
                      :aria-expanded="
                        canPickMonth(key) ? showMonthPicker === key + 1 : null
                      "
                      @click.prevent="
                        isNotSeparatelyAndFirst(key) && openMonthPicker(key + 1)
                      "
                      @keydown.enter.space.prevent="
                        canPickMonth(key) &&
                        openPickerFromKeyboard('month', key)
                      "
                      :class="{
                        'vfc-cursor-pointer vfc-underline':
                          fConfigs.changeMonthFunction &&
                          isNotSeparatelyAndFirst(key),
                        'vfc-underline-active': showMonthPicker === key + 1
                      }"
                    >
                      {{ calendarItem.month }}</span
                    >
                    <span
                      :data-focus-id="`title-year:${key}`"
                      :role="canPickYear(key) ? 'button' : null"
                      :tabindex="canPickYear(key) ? 0 : null"
                      :aria-expanded="
                        canPickYear(key) ? showYearPicker === key + 1 : null
                      "
                      @click.prevent="
                        isNotSeparatelyAndFirst(key) && openYearPicker(key + 1)
                      "
                      @keydown.enter.space.prevent="
                        canPickYear(key) && openPickerFromKeyboard('year', key)
                      "
                      :class="{
                        'vfc-cursor-pointer vfc-underline':
                          fConfigs.changeYearFunction &&
                          isNotSeparatelyAndFirst(key),
                        'vfc-underline-active': showYearPicker === key + 1
                      }"
                    >
                      {{ calendarItem.year }}
                    </span>
                  </div>
                </transition>
                <transition :name="getTransition_()" appear>
                  <div class="vfc-dayNames" aria-hidden="true">
                    <span v-if="fConfigs.showWeekNumbers"></span>
                    <span
                      v-for="(dayName, dayKey) in fConfigs.dayNames"
                      :key="key + dayKey + 1"
                      class="vfc-day"
                    >
                      <template v-if="checkHiddenElement('dayNames')">
                        {{ dayName }}
                      </template>
                    </span>
                  </div>
                </transition>
                <transition-group
                  tag="div"
                  role="grid"
                  :aria-label="calendarItem.dateTop"
                  :name="getTransition_()"
                  appear
                >
                  <div
                    class="vfc-week"
                    role="row"
                    v-for="(week, week_key) in calendarItem.weeks"
                    :key="key + week_key + 1"
                  >
                    <WeekNumbers
                      v-if="fConfigs.showWeekNumbers"
                      :number="week.number"
                      :borderColor="borderColor"
                    />
                    <Day
                      v-for="(day, day_key) in week.days"
                      ref="day"
                      :key="key + week_key + day_key + 1"
                      :isMultipleDateRange="fConfigs.isMultipleDateRange"
                      :day="day"
                      :fConfigs="fConfigs"
                      :calendar="calendar"
                      :helpCalendar="helpCalendar"
                      :week="week"
                      :day_key="day_key"
                      :grid-key="key"
                      @dayMouseOver="dayMouseOver"
                      :alwaysUseDefaultClasses="alwaysUseDefaultClasses"
                    >
                      <template v-slot:default="props">
                        <slot :week="props.week" :day="props.day"></slot>
                      </template>
                    </Day>
                  </div>
                  <template
                    v-if="
                      calendarItem.weeks.length < 6 &&
                      !fConfigs.isLayoutExpandable
                    "
                  >
                    <!-- stabilizator -->
                    <div
                      style="height: 32.6px"
                      role="presentation"
                      aria-hidden="true"
                      v-for="moreWeekKey in 6 - calendarItem.weeks.length"
                      :key="key + moreWeekKey + 'moreWeek'"
                    >
                      &nbsp;
                    </div>
                  </template>
                </transition-group>
              </div>
            </div>
          </div>
          <Footer v-if="canClearRange || $slots['footer']">
            <template v-slot:footer>
              <div @click="cleanRange">
                <slot name="cleaner">
                  <div
                    v-if="canClearRange && fConfigs.isDateRange"
                    class="rangeCleaner"
                  >
                    <span
                      role="button"
                      tabindex="0"
                      :aria-disabled="!rangeIsSelected"
                      :class="[rangeIsSelected ? 'active' : 'disabled']"
                      @click="cleanRange"
                      @keydown.enter.space.prevent="cleanRange"
                      >{{
                        fConfigs.isMultipleDateRange
                          ? fConfigs.labels.clearRanges
                          : fConfigs.labels.clearRange
                      }}</span
                    >
                  </div>
                </slot>
              </div>
              <slot name="footer"></slot>
            </template>
            <!-- <span>&nbsp;</span> -->
          </Footer>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import helpCalendarClass from '../assets/js/helpCalendar'
import { propsAndData, createCalendarState } from '../mixins/propsAndData'
import TimePicker from '../components/TimePicker.vue'
import Arrows from '../components/Arrows.vue'
import WeekNumbers from '../components/WeekNumbers.vue'
import Day from '../components/Day.vue'
import MonthYearPicker from '../components/MonthYearPicker.vue'
import PickerInputs from '../components/PickerInputs.vue'
import Footer from '../components/Footer.vue'
import Presets from '../components/Presets.vue'

import { toRaw } from 'vue'
import { hElContains, hUniqueID } from '../utils/helpers'
import { CALENDAR_KEY } from '../utils/injectionKeys'
import {
  PRESET_KEYS,
  PRESET_DAY_KEYWORDS,
  builtInRange,
  dayStart,
  daysBetween,
  eachDay,
  isValidRange
} from '../utils/presets'
import {
  DEFAULT_DAY_NAMES,
  gregorianOptions,
  resolveLocale,
  localeDayNames,
  localeMonthNames,
  localeFirstDay
} from '../utils/locale'
// import calendarMethods from '../utils/calendarMethods'

export default {
  name: 'FunctionalCalendar',
  components: {
    MonthYearPicker,
    TimePicker,
    PickerInputs,
    Arrows,
    Footer,
    Presets,
    Day,
    WeekNumbers
  },
  mixins: [propsAndData],
  provide() {
    return { [CALENDAR_KEY]: this }
  },
  emits: [
    'update:modelValue',
    'opened',
    'closed',
    'dayClicked',
    'choseDay',
    'selectedDaysCount',
    'dayMouseOver',
    'changedMonth',
    'changedYear'
  ],
  computed: {
    startDMY() {
      //start only with Day Month and Year
      if (this.calendar.dateRange.start) {
        return this.calendar.dateRange.start.split(' ')[0]
      }
      return ''
    },
    endDMY() {
      //end only with Day Month and Year
      if (this.calendar.dateRange.end) {
        return this.calendar.dateRange.end.split(' ')[0]
      }
      return ''
    },
    isModalPicker() {
      return (
        this.fConfigs.isModal &&
        (this.fConfigs.isDatePicker ||
          this.fConfigs.isDateRange ||
          this.fConfigs.isMultipleDatePicker)
      )
    },
    activeLocale() {
      return resolveLocale(this.fConfigs.locale)
    },
    fullDateFormatter() {
      return new Intl.DateTimeFormat(
        this.activeLocale,
        gregorianOptions({ dateStyle: 'full' })
      )
    },
    rovingDates() {
      return this.listCalendars.map(calendarItem => {
        const days = calendarItem.weeks
          .flatMap(week => week.days)
          .filter(day => this.isDayInMonth(day, calendarItem))
        const roving =
          days.find(day => day.date === this.focusedDate) ||
          days.find(day => this.isDateSelected(day.date)) ||
          days.find(day => day.isToday) ||
          days.find(day => !this.isDateBlocked(day.date)) ||
          days[0]

        return roving ? roving.date : ''
      })
    },
    hasPresets() {
      return this.presetItems.length > 0 && !this.showTimePicker
    },
    presetItems() {
      const { presets, isDateRange, isDatePicker } = this.fConfigs
      if (!presets || !(isDateRange || isDatePicker)) return []
      if (!this.checkHiddenElement('presets')) return []

      const entries = presets === true ? PRESET_KEYS : presets
      if (!Array.isArray(entries)) return []

      return entries
        .map(entry => this.resolvePreset(entry, this.presetNow))
        .filter(Boolean)
    },
    rangeIsSelected() {
      if (!this.fConfigs.isMultipleDateRange)
        return !!(this.calendar.dateRange.end && this.calendar.dateRange.start)
      return this.calendar.multipleDateRange.length > 0
    },
    helpCalendar() {
      return new helpCalendarClass(
        this.weekStart,
        this.checkHiddenElement('leftAndRightDays'),
        this.fConfigs.dateFormat,
        this.fConfigs.dayNames,
        this.activeLocale ? DEFAULT_DAY_NAMES : null
      )
    },
    singleSelectedDate: {
      get() {
        let res = ''
        if (this.displayTimeInput) {
          const validFormats = [
            'HH:MM',
            'HH:mm',
            'hh:MM',
            'hh:mm',
            'MM:HH',
            'mm:HH',
            'MM:hh',
            'mm:hh'
          ]
          let format = this.fConfigs.dateFormat
          if (this.dateFormat) {
            format = this.dateFormat
          }
          if (validFormats.indexOf(format.split(' ')[1]) > 3) {
            res +=
              ' ' +
              [this.calendar.selectedHour, this.calendar.selectedMinute]
                .reverse()
                .join(':')
          } else {
            res +=
              ' ' +
              [this.calendar.selectedHour, this.calendar.selectedMinute].join(
                ':'
              )
          }
        }

        return this.calendar.selectedDate
          ? this.calendar.selectedDate + res
          : ''
      },
      set(newValue) {
        const date = this.helpCalendar.parseTypedDate(newValue)
        if (date) {
          this.calendar.selectedDate = date
        }
      }
    }
  },
  created() {
    this.setConfigs()
    this.initCalendar()
  },
  mounted() {
    //show time placeholder
    if (this.displayTimeInput) {
      const timeFormat = this.fConfigs.placeholder.split(' ')[1]
      if (!timeFormat) {
        this.fConfigs.placeholder += ' hh:mm'
      }
    }

    this.popoverElement = this.$refs.popoverElement
    // Event
    this.popoverElement.addEventListener('focusin', this.onFocusIn)
    this.popoverElement.addEventListener('focusout', this.onFocusOut)
    window.addEventListener('click', this.hideMonthYearPicker, {
      capture: true
    })

    // Reacts to external selected dates
    this.$watch(
      'modelValue',
      function (value) {
        if (!value || typeof value !== 'object') return
        if (toRaw(value) !== toRaw(this.calendar)) this.focusedDate = ''

        if (this.isMultipleDateRangeOnly(value)) {
          this.copyMultipleDateRange(value.multipleDateRange)
          return
        }

        this.adoptModel(value)
      },
      { immediate: true, deep: true }
    )

    this.$watch(
      'showCalendar',
      function (value) {
        if (value) {
          this.presetNow = new Date()
          this.$emit('opened')
        } else {
          this.focusedDate = ''
          this.$emit('closed')
        }
      },
      { immediate: true, deep: true }
    )
  },
  beforeUpdate() {
    this.patching = true
    this.focusToken = this.captureFocus()
  },
  updated() {
    this.patching = false
    const token = this.focusToken
    this.focusToken = null
    if (token) this.restoreFocus(token)
  },
  beforeUnmount() {
    this.popoverElement.removeEventListener('focusin', this.onFocusIn)
    this.popoverElement.removeEventListener('focusout', this.onFocusOut)
    window.removeEventListener('click', this.hideMonthYearPicker, {
      capture: true
    })
  },
  watch: {
    enabledDates: {
      handler() {
        this.fConfigs.enabledDates = this.enabledDates
      },
      deep: true
    },
    'configs.enabledDates': {
      handler() {
        this.fConfigs.enabledDates = this.configs.enabledDates
      },
      deep: true
    },
    fConfigs: {
      handler() {
        this.markChooseDays()
      },
      deep: true,
      immediate: true
    },
    calendar: {
      handler() {
        this.markChooseDays()
      },
      deep: true,
      immediate: true
    },
    'calendar.currentDate': {
      handler(value) {
        this.$emit('update:modelValue', this.calendar)
        this.checkLimits(value)
      }
    }
  },
  methods: {
    isMultipleDateRangeOnly(value) {
      return (
        Object.prototype.hasOwnProperty.call(value, 'multipleDateRange') &&
        !Object.prototype.hasOwnProperty.call(value, 'dateRange') &&
        !Object.prototype.hasOwnProperty.call(value, 'selectedDate')
      )
    },
    copyMultipleDateRange(ranges) {
      const lastElement = ranges[ranges.length - 1]
      if (
        lastElement &&
        ((lastElement.start && !lastElement.end) ||
          (!lastElement.start && lastElement.end))
      ) {
        throw new Error('Invalid Data Range')
      }
      this.calendar.multipleDateRange = ranges.map(range => ({ ...range }))
    },
    adoptModel(value) {
      const defaults = createCalendarState()
      defaults.currentDate = this.calendar.currentDate
      Object.keys(defaults).forEach(key => {
        if (value[key] == null) value[key] = defaults[key]
      })
      value.dateRange.start = value.dateRange.start || ''
      value.dateRange.end = value.dateRange.end || ''
      this.calendar = value
    },
    initCalendar() {
      this.setCalendarData()
      this.listRendering()
      this.markChooseDays()
      this.checkLimits(this.calendar.currentDate)
    },
    updateCalendar() {
      this.setExistingCalendarData()
      this.listRendering()
      this.markChooseDays()
    },
    isNotSeparatelyAndFirst(key) {
      return this.fConfigs.isSeparately || key == 0
    },
    setCalendarData() {
      let date = this.calendar.currentDate
      date = new Date(date.getFullYear(), date.getMonth() - 1)

      this.listCalendars = []

      for (let i = 0; i < this.fConfigs.calendarsCount; i++) {
        date = new Date(date.getFullYear(), date.getMonth() + 1)

        let calendar = {
          key: i + hUniqueID(),
          date: date,
          dateTop: `${
            this.fConfigs.monthNames[date.getMonth()]
          } ${date.getFullYear()}`,
          month: this.fConfigs.monthNames[date.getMonth()],
          year: date.getFullYear(),
          weeks: this.helpCalendar.getFinalizedWeeks(
            date.getMonth(),
            date.getFullYear()
          )
        }

        this.listCalendars.push(calendar)

        if (!this.fConfigs.isMultiple) {
          break
        }
      }
    },
    setExistingCalendarData() {
      for (let i = 0; i < this.listCalendars.length; i++) {
        let calendar = this.listCalendars[i]
        let date = calendar.date

        this.listCalendars[i] = {
          key: calendar.key,
          date: date,
          dateTop: `${
            this.fConfigs.monthNames[date.getMonth()]
          } ${date.getFullYear()}`,
          month: this.fConfigs.monthNames[date.getMonth()],
          year: date.getFullYear(),
          weeks: this.helpCalendar.getFinalizedWeeks(
            date.getMonth(),
            date.getFullYear()
          )
        }

        if (!this.fConfigs.isMultiple) {
          break
        }
      }
    },
    setConfigs() {
      const explicit = new Set()
      const apply = (key, value) => {
        this.fConfigs[key] = key === 'labels' ? this.mergeLabels(value) : value
        if (typeof value !== 'undefined') explicit.add(key)
      }

      if (typeof this.$getOptions !== 'undefined') {
        // Global Options
        const globalOptions = this.$getOptions()
        Object.keys(globalOptions).forEach(objectKey => {
          if (typeof this.fConfigs[objectKey] !== 'undefined') {
            apply(objectKey, globalOptions[objectKey])
          }
        })
      }

      if (typeof this.configs !== 'undefined') {
        Object.keys(this.fConfigs).forEach(objectKey => {
          if (typeof this.configs[objectKey] !== 'undefined') {
            // Get From Configs
            apply(objectKey, this.configs[objectKey])
          }
        })
      } else {
        Object.keys(this.$props).forEach(objectKey => {
          if (
            typeof this.fConfigs[objectKey] !== 'undefined' &&
            typeof this.$props[objectKey] !== 'undefined'
          ) {
            apply(objectKey, this.$props[objectKey])
          }
        })
      }

      this.applyLocale(explicit)
      this.customMonthNames = explicit.has('monthNames')
      this.customDayNames = explicit.has('dayNames')

      // Is Modal
      if (this.fConfigs.isModal) this.showCalendar = false

      // Placeholder
      if (!this.fConfigs.placeholder)
        this.fConfigs.placeholder = this.fConfigs.dateFormat

      if (typeof this.newCurrentDate !== 'undefined') {
        this.calendar.currentDate = this.newCurrentDate
      }

      // Week Start
      const shift = (this.weekStart + 6) % 7
      if (shift) {
        const dayNames = this.fConfigs.dayNames
        this.fConfigs.dayNames = [
          ...dayNames.slice(shift),
          ...dayNames.slice(0, shift)
        ]
      }
    },
    mergeLabels(labels) {
      const current = this.fConfigs.labels
      return {
        ...current,
        ...labels,
        presets: { ...current.presets, ...(labels && labels.presets) }
      }
    },
    applyLocale(explicit) {
      const locale = this.activeLocale
      const derivedFirstDay = locale ? localeFirstDay(locale) : undefined

      if (locale) {
        const derived = {
          dayNames: localeDayNames(locale),
          monthNames: localeMonthNames(locale, 'long'),
          shortMonthNames: localeMonthNames(locale, 'short')
        }
        Object.keys(derived).forEach(key => {
          if (!explicit.has(key)) this.fConfigs[key] = derived[key]
        })
      }

      if (explicit.has('sundayStart')) {
        this.weekStart = this.fConfigs.sundayStart ? 0 : 1
      } else if (typeof derivedFirstDay !== 'undefined') {
        this.weekStart = derivedFirstDay
      }
    },
    listRendering() {
      // Each Calendars
      this.listCalendars.forEach(calendar => {
        // Set Calendar Weeks
        calendar.weeks.forEach(week => {
          let finalizedDays = []

          week.days.forEach(day => {
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
            if (typeof this.fConfigs.markedDates[0] === 'object') {
              checkMarked = this.fConfigs.markedDates.find(markDate => {
                return markDate.date === this.helpCalendar.formatDate(date)
              })
            } else {
              // Without Classes
              checkMarked = this.fConfigs.markedDates.find(markDate => {
                return markDate === this.helpCalendar.formatDate(date)
              })
            }

            if (this.startDMY === this.helpCalendar.formatDate(date)) {
              checkMarked = true
            }

            let isMarked = false
            if (typeof checkMarked !== 'undefined') {
              isMarked = true
            }

            finalizedDays.push({
              day: day.day,
              date: this.helpCalendar.formatDate(date),
              hide: day.hide,
              isMouseToLeft: false,
              isMouseToRight: false,
              isHovered: false,
              isDateRangeStart: this.checkDateRangeStart(
                this.helpCalendar.formatDate(date)
              ),
              isDateRangeEnd: this.checkDateRangeEnd(
                this.helpCalendar.formatDate(date)
              ),
              hideLeftAndRightDays: day.hideLeftAndRightDays,
              isToday,
              isMarked
            })
          })

          week.days = finalizedDays
        })
      })
    },
    clickDay(item, isDisabledDate) {
      item.date = this.withTimeSuffix(item.date)
      this.$emit('dayClicked', item)

      if (
        !this.fConfigs.isDateRange &&
        !this.fConfigs.isDatePicker &&
        !this.fConfigs.isMultipleDatePicker
      ) {
        return false
      }

      //Disabled Dates - Start

      // Disable days of week if set in configuration
      if (
        this.helpCalendar.isDayNameDisabled(
          this.helpCalendar.getDateFromFormat(item.date),
          this.fConfigs.disabledDayNames
        ) ||
        isDisabledDate(item.date)
      ) {
        return false
      }

      //Disabled Dates - End

      // Limits
      if (this.fConfigs.limits) {
        let min = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.min)
          .getTime()
        let max = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.max)
          .getTime()
        let date = this.helpCalendar.getDateFromFormat(item.date).getTime()

        if (date < min || date > max) {
          return false
        }
      }

      this.selectDate(item.date)
      this.$emit('choseDay', item)
    },
    selectDate(date) {
      // Date Multiple Range
      if (this.fConfigs.isMultipleDateRange) {
        let clickDate = this.helpCalendar
          .getDateFromFormat(date.split(' ')[0])
          .getTime()
        let rangesLength = this.calendar.multipleDateRange.length
        let lastRange = this.calendar.multipleDateRange[rangesLength - 1]
        let startDate = ''
        // if (lastRange) {
        //   // if (lastRange.start && lastRange.end)
        // } else

        if (!lastRange) {
          this.calendar.multipleDateRange.push({ end: '', start: '' })
          rangesLength = this.calendar.multipleDateRange.length
          lastRange = this.calendar.multipleDateRange[rangesLength - 1]
        }

        if (lastRange.start) {
          startDate = this.helpCalendar.getDateFromFormat(lastRange.start)
        }

        // Two dates is not empty
        if (lastRange.start !== '' && lastRange.end !== '') {
          this.calendar.multipleDateRange.push({ end: '', start: date })
          // lastRange.start = date
          // lastRange.end = ''
          // Not date selected
        } else if (lastRange.start === '' && lastRange.end === '') {
          lastRange.start = date
          // Start Date not empty, chose date > start date
        } else if (lastRange.end === '' && clickDate > startDate.getTime()) {
          lastRange.end = date
          // Start date not empty, chose date <= start date (also same date range select)
        } else if (lastRange.start !== '' && clickDate <= startDate.getTime()) {
          this.$nextTick(() => {
            if (this.calendar.withTimePicker) {
              this.$refs['timePicker'].startDateActive = true
            }
          })
          lastRange.end = lastRange.start
          lastRange.start = date
        }

        //Get number of days between date range dates
        if (lastRange.start !== '' && lastRange.end !== '') {
          let oneDay = 24 * 60 * 60 * 1000
          let firstDate = this.helpCalendar.getDateFromFormat(lastRange.start)
          let secondDate = this.helpCalendar.getDateFromFormat(lastRange.end)
          let diffDays = Math.round(
            Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
          )
          let itemTime = this.helpCalendar.getDateFromFormat(date).getTime()

          this.$emit('selectedDaysCount', diffDays)

          // Is Auto Closeable
          if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
            this.showCalendar = false
          }

          // Minimum Selected Days
          let minSelDays = this.fConfigs.minSelDays

          if (
            minSelDays &&
            itemTime >= startDate.getTime() &&
            diffDays < minSelDays
          ) {
            startDate.setDate(startDate.getDate() + (minSelDays - 1))
            lastRange.end = this.helpCalendar.formatDate(startDate)
          }

          if (
            minSelDays &&
            itemTime < startDate.getTime() &&
            diffDays < minSelDays
          ) {
            startDate.setDate(startDate.getDate() - (minSelDays - 1))
            lastRange.start = this.helpCalendar.formatDate(startDate)
          }

          // Maximum Selected Days
          let maxSelDays = this.fConfigs.maxSelDays

          if (
            maxSelDays &&
            itemTime >= startDate.getTime() &&
            diffDays >= maxSelDays
          ) {
            startDate.setDate(startDate.getDate() + (maxSelDays - 1))
            lastRange.end = this.helpCalendar.formatDate(startDate)
          }

          if (
            maxSelDays &&
            itemTime < startDate.getTime() &&
            diffDays >= maxSelDays
          ) {
            startDate.setDate(startDate.getDate() - (maxSelDays - 1))
            lastRange.start = this.helpCalendar.formatDate(startDate)
          }
        }

        this.emitModel()
      } // Date Range
      else if (this.fConfigs.isDateRange) {
        let clickDate = this.helpCalendar
          .getDateFromFormat(date.split(' ')[0])
          .getTime()

        let startDate = ''
        if (this.calendar.dateRange.start) {
          startDate = this.helpCalendar.getDateFromFormat(
            this.calendar.dateRange.start
          )
        }

        // Two dates is not empty
        if (
          this.calendar.dateRange.start !== '' &&
          this.calendar.dateRange.end !== ''
        ) {
          this.calendar.dateRange.start = date
          this.calendar.dateRange.end = ''
          // Not date selected
        } else if (
          this.calendar.dateRange.start === '' &&
          this.calendar.dateRange.end === ''
        ) {
          this.calendar.dateRange.start = date
          // Start Date not empty, chose date > start date
        } else if (
          this.calendar.dateRange.end === '' &&
          clickDate > startDate.getTime()
        ) {
          this.calendar.dateRange.end = date
          // Start date not empty, chose date <= start date (also same date range select)
        } else if (
          this.calendar.dateRange.start !== '' &&
          clickDate <= startDate.getTime()
        ) {
          this.$nextTick(() => {
            if (this.calendar.dateRange && this.calendar.withTimePicker) {
              this.$refs['timePicker'].startDateActive = true
            }
          })
          this.calendar.dateRange.end = this.calendar.dateRange.start
          this.calendar.dateRange.start = date
        }

        //Get number of days between date range dates
        if (
          this.calendar.dateRange.start !== '' &&
          this.calendar.dateRange.end !== ''
        ) {
          let oneDay = 24 * 60 * 60 * 1000
          let firstDate = this.helpCalendar.getDateFromFormat(
            this.calendar.dateRange.start
          )
          let secondDate = this.helpCalendar.getDateFromFormat(
            this.calendar.dateRange.end
          )
          let diffDays = Math.round(
            Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
          )
          let itemTime = this.helpCalendar.getDateFromFormat(date).getTime()

          this.$emit('selectedDaysCount', diffDays)

          // Is Auto Closeable
          if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
            this.showCalendar = false
          }

          // Minimum Selected Days
          let minSelDays = this.fConfigs.minSelDays

          if (
            minSelDays &&
            itemTime >= startDate.getTime() &&
            diffDays < minSelDays
          ) {
            startDate.setDate(startDate.getDate() + (minSelDays - 1))
            this.calendar.dateRange.end =
              this.helpCalendar.formatDate(startDate)
          }

          if (
            minSelDays &&
            itemTime < startDate.getTime() &&
            diffDays < minSelDays
          ) {
            startDate.setDate(startDate.getDate() - (minSelDays - 1))
            this.calendar.dateRange.start =
              this.helpCalendar.formatDate(startDate)
          }

          // Maximum Selected Days
          let maxSelDays = this.fConfigs.maxSelDays

          if (
            maxSelDays &&
            itemTime >= startDate.getTime() &&
            diffDays >= maxSelDays
          ) {
            startDate.setDate(startDate.getDate() + (maxSelDays - 1))
            this.calendar.dateRange.end =
              this.helpCalendar.formatDate(startDate)
          }

          if (
            maxSelDays &&
            itemTime < startDate.getTime() &&
            diffDays >= maxSelDays
          ) {
            startDate.setDate(startDate.getDate() - (maxSelDays - 1))
            this.calendar.dateRange.start =
              this.helpCalendar.formatDate(startDate)
          }
        }

        this.emitModel()
      } else if (this.fConfigs.isDatePicker) {
        this.calendar.selectedDate = date
        this.emitModel()

        // Is Auto Closeable
        if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
          this.showCalendar = false
        }
      } else if (this.fConfigs.isMultipleDatePicker) {
        if (
          this.calendar.hasOwnProperty('selectedDates') &&
          this.calendar.selectedDates.find(entry => entry.date === date)
        ) {
          let dateIndex = this.calendar.selectedDates.findIndex(
            entry => entry.date === date
          )
          this.calendar.selectedDates.splice(dateIndex, 1)
        } else {
          let selected = Object.assign({}, this.defaultDateFormat)
          selected.date = date

          if (!this.calendar.hasOwnProperty('selectedDates')) {
            this.calendar.selectedDates = []
          }

          this.calendar.selectedDates.push(selected)
        }

        this.emitModel()
      }

      this.markChooseDays()

      // Time Picker
      if (this.fConfigs.withTimePicker) {
        if (this.fConfigs.isDateRange || this.fConfigs.isDatePicker) {
          this.openTimePicker()
        }

        if (
          this.calendar.selectedDates.find(entry => entry.date === date) &&
          this.fConfigs.isMultipleDatePicker
        ) {
          this.openTimePicker()
        }
      }
    },
    resolvePreset(entry, now) {
      const isKey = typeof entry === 'string'
      const label = isKey ? this.fConfigs.labels.presets[entry] : entry?.label
      let range = null
      try {
        range = isKey
          ? builtInRange(entry, now)
          : typeof entry?.range === 'function' && entry.range()
      } catch {
        return null
      }
      if (!label || !isValidRange(range)) return null

      const days = { start: dayStart(range.start), end: dayStart(range.end) }

      return {
        entry,
        label,
        ...days,
        disabled: this.isPresetBlocked(days)
      }
    },
    isRangePreset() {
      return this.fConfigs.isMultipleDateRange || this.fConfigs.isDateRange
    },
    isPresetBlocked({ start, end }) {
      const isRange = this.isRangePreset()
      const last = isRange ? end : start
      const length = daysBetween(start, last) + 1
      const { minSelDays, maxSelDays } = this.fConfigs

      if (
        isRange &&
        ((minSelDays && length < minSelDays) ||
          (maxSelDays && length > maxSelDays))
      ) {
        return true
      }

      return (
        this.isPresetOutsideLimits(start, last) ||
        this.hasDisabledDateIn(start, last) ||
        this.hasDisabledDayNameIn(start, last) ||
        this.hasUnavailableDateIn(start, last, length)
      )
    },
    isPresetOutsideLimits(start, last) {
      const { limits } = this.fConfigs
      if (!limits) return false

      return (
        start < this.helpCalendar.getDateFromFormat(limits.min) ||
        last > this.helpCalendar.getDateFromFormat(limits.max)
      )
    },
    hasDisabledDateIn(start, last) {
      const { disabledDates } = this.fConfigs
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (disabledDates.includes('beforeToday') && start < today) return true
      if (disabledDates.includes('afterToday') && last > today) return true

      return disabledDates.some(entry => {
        const date = this.helpCalendar.getDateFromFormat(entry)
        return (
          date >= start &&
          date <= last &&
          this.helpCalendar.formatDate(date) === entry
        )
      })
    },
    hasDisabledDayNameIn(start, last) {
      const { disabledDayNames } = this.fConfigs
      if (!disabledDayNames.length) return false

      const weekEnd = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + 6
      )
      return eachDay(start, last < weekEnd ? last : weekEnd).some(day =>
        this.helpCalendar.isDayNameDisabled(day, disabledDayNames)
      )
    },
    hasUnavailableDateIn(start, last, length) {
      const { enabledDates } = this.fConfigs
      if (!enabledDates.length) return false

      const hasKeyword = enabledDates.some(entry =>
        PRESET_DAY_KEYWORDS.includes(entry)
      )
      if (!hasKeyword && length > enabledDates.length) return true

      return eachDay(start, last).some(
        day => !this.isEnabledDate(this.helpCalendar.formatDate(day))
      )
    },
    isPresetSelected(preset) {
      const { calendar } = this
      const start = this.helpCalendar.formatDate(preset.start)

      if (!this.isRangePreset()) return calendar.selectedDate === start

      const end = this.helpCalendar.formatDate(preset.end)
      const matches = range =>
        range.start.split(' ')[0] === start && range.end.split(' ')[0] === end
      return this.fConfigs.isMultipleDateRange
        ? calendar.multipleDateRange.some(matches)
        : matches(calendar.dateRange)
    },
    applyPreset(preset) {
      this.presetNow = new Date()
      const current = this.resolvePreset(preset.entry, this.presetNow)
      if (!current || current.disabled) return

      const dateOf = date =>
        this.withTimeSuffix(this.helpCalendar.formatDate(date))
      const isShown = this.isMonthShown(current.start)

      this.batchingModel = true
      try {
        if (this.isRangePreset()) {
          this.discardOpenRange()
          this.selectDate(dateOf(current.start))
          this.selectDate(dateOf(current.end))
        } else {
          this.selectDate(dateOf(current.start))
        }
      } finally {
        this.batchingModel = false
      }

      if (isShown) {
        this.$emit('update:modelValue', this.calendar)
      } else {
        this.revealMonth(current.start)
      }
      this.returnFocusIfClosed()
    },
    withTimeSuffix(date) {
      return this.fConfigs.withTimePicker && this.fConfigs.isDateRange
        ? `${date} 00:00`
        : date
    },
    emitModel() {
      if (!this.batchingModel) this.$emit('update:modelValue', this.calendar)
    },
    discardOpenRange() {
      this.clearHover()
      if (!this.fConfigs.isMultipleDateRange) {
        this.cleanRange()
        return
      }

      const ranges = this.calendar.multipleDateRange
      const last = ranges[ranges.length - 1]
      if (last && !(last.start && last.end)) ranges.pop()
    },
    clearHover() {
      this.listCalendars.forEach(calendar =>
        calendar.weeks.forEach(week =>
          week.days.forEach(day => (day.isHovered = false))
        )
      )
    },
    isMonthShown(date) {
      return this.listCalendars.some(
        item =>
          item.date.getFullYear() === date.getFullYear() &&
          item.date.getMonth() === date.getMonth()
      )
    },
    revealMonth(date) {
      const previous = this.listCalendars[0].date
      this.transitionPrefix = date > previous ? 'left' : 'right'
      this.ChooseDate(this.helpCalendar.formatDate(date))

      const first = this.listCalendars[0].date
      this.$emit('changedMonth', first)
      if (first.getFullYear() !== previous.getFullYear()) {
        this.$emit('changedYear', first)
      }
    },
    markChooseDays() {
      let startDate = this.startDMY
      let endDate = this.endDMY
      this.listCalendars.forEach(calendar => {
        calendar.weeks.forEach(week => {
          week.days.forEach(day => {
            day.isMarked = false
            day.date = day.date.split(' ')[0]
            // Date Picker
            if (this.fConfigs.isDatePicker) {
              if (this.calendar.selectedDate === day.date) day.isMarked = true
            } else if (this.fConfigs.isMultipleDatePicker) {
              if (
                this.calendar.hasOwnProperty('selectedDates') &&
                this.calendar.selectedDates.find(date => date.date === day.date)
              )
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
              //Multiple Range
              if (this.calendar.multipleDateRange) {
                if (
                  ~this.calendar.multipleDateRange
                    .map(range => range.start.split(' ')[0])
                    .indexOf(day.date)
                ) {
                  day.isMouseToLeft = !!endDate
                  day.isMarked = true
                }
                if (
                  ~this.calendar.multipleDateRange
                    .map(range => range.end.split(' ')[0])
                    .indexOf(day.date)
                ) {
                  day.isMouseToRight = !!endDate
                  day.isMarked = true
                }
                this.calendar.multipleDateRange.forEach(range => {
                  if (range.start && range.start === range.end) {
                    day.isMouseToLeft = false
                    day.isMouseToRight = false
                  }
                  if (range.start && range.end) {
                    if (
                      this.helpCalendar.getDateFromFormat(day.date).getTime() >
                        this.helpCalendar.getDateFromFormat(range.start) &&
                      this.helpCalendar.getDateFromFormat(day.date) <
                        this.helpCalendar.getDateFromFormat(range.end)
                    ) {
                      day.isMarked = true
                    }
                  }
                })
              }

              if (startDate && startDate === endDate) {
                day.isMouseToLeft = false
                day.isMouseToRight = false
              }
              if (startDate && endDate) {
                if (
                  this.helpCalendar.getDateFromFormat(day.date).getTime() >
                    this.helpCalendar.getDateFromFormat(startDate) &&
                  this.helpCalendar.getDateFromFormat(day.date) <
                    this.helpCalendar.getDateFromFormat(endDate)
                ) {
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
    dayMouseOver(date) {
      this.$emit('dayMouseOver', date)

      if (!this.fConfigs.isDateRange) {
        return false
      }

      // Limits
      if (this.fConfigs.limits) {
        let limitMin = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.min)
          .getTime()
        let limitMax = this.helpCalendar
          .getDateFromFormat(this.fConfigs.limits.max)
          .getTime()
        let limitDate = this.helpCalendar.getDateFromFormat(date).getTime()

        if (limitDate < limitMin || limitDate > limitMax) {
          return false
        }
      }

      //Multiple Range

      if (
        (this.calendar.dateRange.start === '' ||
          this.calendar.dateRange.end === '') &&
        (this.calendar.dateRange.start !== '' ||
          this.calendar.dateRange.end !== '')
      ) {
        for (let e = 0; e < this.listCalendars.length; e++) {
          let calendar = this.listCalendars[e]

          for (let f = 0; f < calendar.weeks.length; f++) {
            let week = calendar.weeks[f]

            for (let i = 0; i < week.days.length; i++) {
              let item = week.days[i]

              this.listCalendars[e].weeks[f].days[i].isHovered = false
              if (
                item.date !== this.startDMY &&
                !this.fConfigs.markedDates.includes(item.date)
              ) {
                this.listCalendars[e].weeks[f].days[i].isMarked = false
              }

              if (this.calendar.dateRange.start) {
                let itemDate = this.helpCalendar
                  .getDateFromFormat(item.date)
                  .getTime()

                let thisDate = this.helpCalendar
                  .getDateFromFormat(date)
                  .getTime()
                let startDate = this.helpCalendar.getDateFromFormat(
                  this.calendar.dateRange.start
                )

                this.listCalendars[e].weeks[f].days[i].isMouseToLeft =
                  (itemDate === startDate.getTime() &&
                    thisDate > startDate.getTime()) ||
                  (itemDate === thisDate && thisDate < startDate.getTime())
                this.listCalendars[e].weeks[f].days[i].isMouseToRight =
                  (itemDate === startDate.getTime() &&
                    thisDate < startDate.getTime()) ||
                  (itemDate === thisDate && thisDate > startDate.getTime())

                if (
                  !this.helpCalendar.isDayNameDisabled(
                    this.helpCalendar.getDateFromFormat(item.date),
                    this.fConfigs.disabledDayNames
                  ) &&
                  ((itemDate > startDate.getTime() && itemDate < thisDate) ||
                    (itemDate < startDate.getTime() && itemDate > thisDate))
                ) {
                  this.listCalendars[e].weeks[f].days[i].isMarked = true
                }

                if (!this.calendar.dateRange.end && itemDate === thisDate) {
                  this.listCalendars[e].weeks[f].days[i].isHovered = false
                }

                if (
                  this.checkSelDates(
                    'min',
                    this.calendar.dateRange.start,
                    item.date,
                    date
                  )
                ) {
                  this.listCalendars[e].weeks[f].days[i].isMarked = true

                  let minDateToRight, minDateToLeft
                  minDateToLeft = new Date(startDate.getTime())
                  minDateToRight = new Date(startDate.getTime())
                  minDateToLeft.setDate(
                    minDateToLeft.getDate() - this.fConfigs.minSelDays + 1
                  )
                  minDateToRight.setDate(
                    minDateToRight.getDate() + this.fConfigs.minSelDays - 1
                  )

                  if (
                    thisDate >= minDateToLeft.getTime() &&
                    this.helpCalendar.formatDate(minDateToLeft) === item.date
                  ) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = false
                    this.listCalendars[e].weeks[f].days[i].isMouseToLeft = true
                    this.listCalendars[e].weeks[f].days[i].isHovered = true
                  } else if (
                    thisDate <= minDateToRight.getTime() &&
                    this.helpCalendar.formatDate(minDateToRight) === item.date
                  ) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = false
                    this.listCalendars[e].weeks[f].days[i].isMouseToRight = true
                    this.listCalendars[e].weeks[f].days[i].isHovered = true
                  }
                }

                if (
                  this.checkSelDates(
                    'max',
                    this.calendar.dateRange.start,
                    item.date,
                    date
                  )
                ) {
                  this.listCalendars[e].weeks[f].days[i].isMarked = false
                  this.listCalendars[e].weeks[f].days[i].isHovered = false
                  this.listCalendars[e].weeks[f].days[i].isMouseToLeft = false
                  this.listCalendars[e].weeks[f].days[i].isMouseToRight = false

                  let maxDateToLeft, maxDateToRight
                  maxDateToLeft = new Date(startDate.getTime())
                  maxDateToRight = new Date(startDate.getTime())
                  maxDateToLeft.setDate(
                    maxDateToLeft.getDate() - this.fConfigs.maxSelDays + 1
                  )
                  maxDateToRight.setDate(
                    maxDateToRight.getDate() + this.fConfigs.maxSelDays - 1
                  )

                  if (thisDate <= maxDateToLeft.getTime()) {
                    if (
                      this.helpCalendar.formatDate(maxDateToLeft) === item.date
                    ) {
                      this.listCalendars[e].weeks[f].days[i].isHovered = true
                      this.listCalendars[e].weeks[f].days[i].isMouseToLeft =
                        true
                    }
                  }

                  if (thisDate >= maxDateToRight.getTime()) {
                    if (
                      this.helpCalendar.formatDate(maxDateToRight) === item.date
                    ) {
                      this.listCalendars[e].weeks[f].days[i].isHovered = true
                      this.listCalendars[e].weeks[f].days[i].isMouseToRight =
                        true
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (this.calendar.multipleDateRange) {
        let range =
          this.calendar.multipleDateRange[
            this.calendar.multipleDateRange.length - 1
          ]
        if (!range) return
        // this.calendar.multipleDateRange.forEach((range, index) => {
        if (
          (range.start === '' || range.end === '') &&
          (range.start !== '' || range.end !== '')
        ) {
          for (let e = 0; e < this.listCalendars.length; e++) {
            let calendar = this.listCalendars[e]

            for (let f = 0; f < calendar.weeks.length; f++) {
              let week = calendar.weeks[f]

              for (let i = 0; i < week.days.length; i++) {
                let item = week.days[i]

                this.listCalendars[e].weeks[f].days[i].isHovered = false
                if (
                  item.date !== this.startDMY &&
                  !this.fConfigs.markedDates.includes(item.date)
                ) {
                  this.listCalendars[e].weeks[f].days[i].isMarked = false
                }

                if (range.start) {
                  let itemDate = this.helpCalendar
                    .getDateFromFormat(item.date)
                    .getTime()

                  let thisDate = this.helpCalendar
                    .getDateFromFormat(date)
                    .getTime()
                  let startDate = this.helpCalendar.getDateFromFormat(
                    range.start
                  )

                  this.listCalendars[e].weeks[f].days[i].isMouseToLeft =
                    (itemDate === startDate.getTime() &&
                      thisDate > startDate.getTime()) ||
                    (itemDate === thisDate && thisDate < startDate.getTime())
                  this.listCalendars[e].weeks[f].days[i].isMouseToRight =
                    (itemDate === startDate.getTime() &&
                      thisDate < startDate.getTime()) ||
                    (itemDate === thisDate && thisDate > startDate.getTime())

                  if (
                    !this.helpCalendar.isDayNameDisabled(
                      this.helpCalendar.getDateFromFormat(item.date),
                      this.fConfigs.disabledDayNames
                    ) &&
                    ((itemDate > startDate.getTime() && itemDate < thisDate) ||
                      (itemDate < startDate.getTime() && itemDate > thisDate))
                  ) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = true
                  }

                  if (!range.end && itemDate === thisDate) {
                    this.listCalendars[e].weeks[f].days[i].isHovered = false
                  }

                  if (this.checkSelDates('min', range.start, item.date, date)) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = true

                    let minDateToRight, minDateToLeft
                    minDateToLeft = new Date(startDate.getTime())
                    minDateToRight = new Date(startDate.getTime())
                    minDateToLeft.setDate(
                      minDateToLeft.getDate() - this.fConfigs.minSelDays + 1
                    )
                    minDateToRight.setDate(
                      minDateToRight.getDate() + this.fConfigs.minSelDays - 1
                    )

                    if (
                      thisDate >= minDateToLeft.getTime() &&
                      this.helpCalendar.formatDate(minDateToLeft) === item.date
                    ) {
                      this.listCalendars[e].weeks[f].days[i].isMarked = false
                      this.listCalendars[e].weeks[f].days[i].isMouseToLeft =
                        true
                      this.listCalendars[e].weeks[f].days[i].isHovered = true
                    } else if (
                      thisDate <= minDateToRight.getTime() &&
                      this.helpCalendar.formatDate(minDateToRight) === item.date
                    ) {
                      this.listCalendars[e].weeks[f].days[i].isMarked = false
                      this.listCalendars[e].weeks[f].days[i].isMouseToRight =
                        true
                      this.listCalendars[e].weeks[f].days[i].isHovered = true
                    }
                  }

                  if (this.checkSelDates('max', range.start, item.date, date)) {
                    this.listCalendars[e].weeks[f].days[i].isMarked = false
                    this.listCalendars[e].weeks[f].days[i].isHovered = false
                    this.listCalendars[e].weeks[f].days[i].isMouseToLeft = false
                    this.listCalendars[e].weeks[f].days[i].isMouseToRight =
                      false

                    let maxDateToLeft, maxDateToRight
                    maxDateToLeft = new Date(startDate.getTime())
                    maxDateToRight = new Date(startDate.getTime())
                    maxDateToLeft.setDate(
                      maxDateToLeft.getDate() - this.fConfigs.maxSelDays + 1
                    )
                    maxDateToRight.setDate(
                      maxDateToRight.getDate() + this.fConfigs.maxSelDays - 1
                    )

                    if (thisDate <= maxDateToLeft.getTime()) {
                      if (
                        this.helpCalendar.formatDate(maxDateToLeft) ===
                        item.date
                      ) {
                        this.listCalendars[e].weeks[f].days[i].isHovered = true
                        this.listCalendars[e].weeks[f].days[i].isMouseToLeft =
                          true
                      }
                    }

                    if (thisDate >= maxDateToRight.getTime()) {
                      if (
                        this.helpCalendar.formatDate(maxDateToRight) ===
                        item.date
                      ) {
                        this.listCalendars[e].weeks[f].days[i].isHovered = true
                        this.listCalendars[e].weeks[f].days[i].isMouseToRight =
                          true
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // })
      }
    },
    /**
     * @return {boolean}
     */
    PreMonth(calendarKey = null) {
      if (!this.allowPreDate) return false

      this.transitionPrefix = 'right'

      let step = this.fConfigs.changeMonthStep

      calendarKey = calendarKey !== null ? calendarKey : 0

      let currentCalendar = this.listCalendars[calendarKey]
      currentCalendar.date = new Date(
        currentCalendar.date.getFullYear(),
        currentCalendar.date.getMonth() - step
      )
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
    NextMonth(calendarKey = null) {
      if (!this.allowNextDate) return false

      this.transitionPrefix = 'left'

      let step = this.fConfigs.changeMonthStep

      calendarKey = calendarKey !== null ? calendarKey : 0

      let currentCalendar = this.listCalendars[calendarKey]
      currentCalendar.date = new Date(
        currentCalendar.date.getFullYear(),
        currentCalendar.date.getMonth() + step
      )
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
    PreYear(calendarKey = null) {
      if (!this.allowPreDate) return false

      let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1

      calendarKey = calendarKey !== null ? calendarKey : 0

      let currentCalendar = this.listCalendars[calendarKey]
      currentCalendar.date = new Date(
        currentCalendar.date.getFullYear() - step,
        currentCalendar.date.getMonth()
      )
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
    NextYear(calendarKey = null) {
      if (!this.allowNextDate) return false

      let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1

      calendarKey = calendarKey !== null ? calendarKey : 0

      let currentCalendar = this.listCalendars[calendarKey]
      currentCalendar.date = new Date(
        currentCalendar.date.getFullYear() + step,
        currentCalendar.date.getMonth()
      )
      this.updateCalendar()

      if (!this.fConfigs.isSeparately) {
        this.calendar.currentDate = currentCalendar.date
        this.initCalendar()
      }

      this.$emit('changedYear', currentCalendar.date)
    },
    ChooseDate(date) {
      let newDate = this.helpCalendar.getDateFromFormat(date)

      if (date === 'today') {
        newDate = new Date()
      }

      this.listCalendars[0].date = this.calendar.currentDate = newDate

      this.updateCalendar()
      this.initCalendar()
    },
    openMonthPicker(key) {
      if (this.fConfigs.changeMonthFunction) {
        this.showMonthPicker = key === this.showMonthPicker ? false : key
        this.showYearPicker = false
      }
    },
    openYearPicker(key) {
      if (this.fConfigs.changeYearFunction) {
        this.showYearPicker = key === this.showYearPicker ? false : key
        this.showMonthPicker = false
      }
    },
    openTimePicker() {
      this.showTimePicker = true
    },
    pickMonth(key, calendarKey) {
      this.showMonthPicker = false
      if (!this.fConfigs.isSeparately) {
        this.listCalendars.forEach((currentCalendar, index) => {
          let date = currentCalendar.date
          currentCalendar.date = new Date(
            date.getFullYear(),
            key + 1 + index,
            0
          )
          currentCalendar.key += hUniqueID()
        })
      } else {
        let currentCalendar = this.listCalendars[calendarKey]
        let date = currentCalendar.date
        currentCalendar.date = new Date(date.getFullYear(), key + 1, 0)
        currentCalendar.key += hUniqueID()
      }

      let currentCalendar = this.listCalendars[calendarKey]
      this.$emit('changedMonth', currentCalendar.date)
      this.updateCalendar()
    },
    pickYear(year, calendarKey) {
      this.showYearPicker = false
      if (!this.fConfigs.isSeparately) {
        this.listCalendars.forEach(currentCalendar => {
          let date = currentCalendar.date
          currentCalendar.date = new Date(year, date.getMonth() + 1, 0)
          currentCalendar.key += hUniqueID()
          this.$emit('changedYear', currentCalendar.date)
        })
      } else {
        let currentCalendar = this.listCalendars[calendarKey]
        let date = currentCalendar.date
        currentCalendar.date = new Date(year, date.getMonth() + 1, 0)
        currentCalendar.key += hUniqueID()
        this.$emit('changedYear', currentCalendar.date)
      }
      this.updateCalendar()
    },
    getYearList(date, delta) {
      let years = []
      let year = date.getFullYear() - 4 + delta
      for (let i = 0; i < 12; i++) {
        let finalYear = year + i

        years.push({
          year: finalYear
        })
      }
      return years
    },
    /**
     * Add date to selectedDates list
     * @param index
     */
    addToSelectedDates() {
      const typed = this.helpCalendar.parseTypedDate(
        this.calendar.selectedDatesItem
      )
      if (typed) {
        let date = Object.assign({}, this.defaultDateFormat)
        date.date = typed
        this.calendar.selectedDates.push(date)
        this.calendar.selectedDatesItem = ''
        this.markChooseDays()
      }
    },
    /**
     * Remove date from selectedDates list
     * @param index
     */
    removeFromSelectedDates(index) {
      this.calendar.selectedDates.splice(index, 1)
      this.markChooseDays()
    },

    checkDateRangeEnd(date) {
      if (Array.isArray(this.fConfigs.markedDateRange)) {
        return (
          this.fConfigs.markedDateRange.findIndex(range => {
            return range.end === date
          }) !== -1
        )
      }

      return date === this.fConfigs.markedDateRange.end
    },
    checkSelDates(type, startDate, itemDate, hoverDate) {
      let startTime = this.helpCalendar.getDateFromFormat(startDate).getTime()
      let itemTime = this.helpCalendar.getDateFromFormat(itemDate).getTime()
      let hoverTime = this.helpCalendar.getDateFromFormat(hoverDate).getTime()

      let days =
        type === 'min' ? this.fConfigs.minSelDays : this.fConfigs.maxSelDays - 2
      let minTime = days * 1000 * 60 * 60 * 24
      let rightTime = startTime + minTime
      let leftTime = startTime - minTime

      let result
      if (hoverTime > startTime) {
        if (type === 'min')
          result =
            itemTime < rightTime &&
            itemTime > startTime &&
            this.fConfigs.minSelDays
        else
          result =
            itemTime > rightTime &&
            itemTime > startTime &&
            this.fConfigs.maxSelDays
      } else if (hoverTime < startTime) {
        if (type === 'min')
          result =
            itemTime > leftTime &&
            itemTime < startTime &&
            this.fConfigs.minSelDays
        else
          result =
            itemTime < leftTime &&
            itemTime < startTime &&
            this.fConfigs.maxSelDays
      }

      return result
    },
    checkLimits(value) {
      if (this.fConfigs.limits) {
        let min = new Date(
          this.helpCalendar.getDateFromFormat(this.fConfigs.limits.min)
        )
        min.setDate(1)
        min.setHours(0, 0, 0, 0)
        let max = new Date(
          this.helpCalendar.getDateFromFormat(this.fConfigs.limits.max)
        )
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
    getTransition_() {
      if (!this.fConfigs.transition) return ''

      let name = ''
      if (this.transitionPrefix === 'left') {
        name = 'vfc-calendar-slide-left'
      } else if (this.transitionPrefix === 'right') {
        name = 'vfc-calendar-slide-right'
      }
      return name
    },
    checkHiddenElement(elementName) {
      return !this.fConfigs.hiddenElements.includes(elementName)
    },
    formatFullDate(date) {
      const customWeekday = this.customDayNames && !this.activeLocale
      if (!this.customMonthNames && !customWeekday) {
        return this.fullDateFormatter.format(date)
      }

      return this.fullDateFormatter
        .formatToParts(date)
        .map(part => {
          if (part.type === 'month' && this.customMonthNames) {
            return this.fConfigs.monthNames[date.getMonth()]
          }
          if (part.type === 'weekday' && customWeekday) {
            return this.helpCalendar.getDayName(date)
          }
          return part.value
        })
        .join('')
    },
    captureFocus() {
      const main = this.$refs.mainContainer
      const active = document.activeElement
      if (!main || active === main || !main.contains(active)) return null

      const holder = active.closest('[data-focus-id]')
      return holder ? holder.dataset.focusId : 'other:0'
    },
    restoreFocus(token) {
      const main = this.$refs.mainContainer
      if (!this.showCalendar || !main || main.contains(document.activeElement))
        return

      const [type, grid] = token.split(':')
      const exact = [
        'day',
        'arrow-prev',
        'arrow-next',
        'title-month',
        'title-year'
      ]
      const grids = main.querySelectorAll('.vfc-calendar')
      const target =
        (exact.includes(type) &&
          main.querySelector(`[data-focus-id="${token}"]`)) ||
        (grids[grid] &&
          grids[grid].querySelector('[role="gridcell"][tabindex="0"]')) ||
        main.querySelector('.vfc-time-picker__item[tabindex="0"]') ||
        main

      target.focus()
    },
    removeRangeAt(date) {
      const ranges = this.calendar.multipleDateRange
      const index = ranges.findIndex(range =>
        range.end
          ? this.isDateInRange(date, range.start, range.end)
          : range.start.split(' ')[0] === date
      )
      if (index !== -1) ranges.splice(index, 1)
    },
    isDisabledDate(date) {
      const datesCollection = this.fConfigs.disabledDates

      return (
        this.isDateIncludedInDatesCollection(date, datesCollection) ||
        !this.isEnabledDate(date)
      )
    },
    isEnabledDate(date) {
      const datesCollection = this.fConfigs.enabledDates

      return (
        !datesCollection.length ||
        this.isDateIncludedInDatesCollection(date, datesCollection)
      )
    },
    isDateIncludedInDatesCollection(date, datesCollection) {
      let today = new Date()
      today.setHours(0, 0, 0, 0)
      let dateObj = this.helpCalendar.getDateFromFormat(date)

      return (
        datesCollection.includes(date) ||
        (datesCollection.includes('beforeToday') &&
          dateObj.getTime() < today.getTime()) ||
        (datesCollection.includes('afterToday') &&
          dateObj.getTime() > today.getTime())
      )
    },
    isDateBlocked(date) {
      const dateObj = this.helpCalendar.getDateFromFormat(date)

      if (
        this.helpCalendar.isDayNameDisabled(
          dateObj,
          this.fConfigs.disabledDayNames
        ) ||
        this.isDisabledDate(date)
      ) {
        return true
      }

      const { limits } = this.fConfigs
      if (!limits) return false

      const time = dateObj.getTime()
      return (
        time < this.helpCalendar.getDateFromFormat(limits.min).getTime() ||
        time > this.helpCalendar.getDateFromFormat(limits.max).getTime()
      )
    },
    isDateSelected(date) {
      const { fConfigs, calendar } = this

      if (fConfigs.isMultipleDateRange) {
        return calendar.multipleDateRange.some(range =>
          this.isDateInRange(date, range.start, range.end)
        )
      }
      if (fConfigs.isDateRange) {
        return this.isDateInRange(
          date,
          calendar.dateRange.start,
          calendar.dateRange.end
        )
      }
      if (fConfigs.isDatePicker) return calendar.selectedDate === date
      if (fConfigs.isMultipleDatePicker) {
        return (calendar.selectedDates || []).some(item => item.date === date)
      }
      return false
    },
    isDateInRange(date, start, end) {
      if (!start) return false

      const time = this.helpCalendar.getDateFromFormat(date).getTime()
      const startTime = this.helpCalendar.getDateFromFormat(start).getTime()
      if (!end) return time === startTime

      return (
        time >= startTime &&
        time <= this.helpCalendar.getDateFromFormat(end).getTime()
      )
    },
    isDayInMonth(day, calendarItem) {
      if (day.hideLeftAndRightDays || !calendarItem) return false

      const date = this.helpCalendar.getDateFromFormat(day.date)
      return (
        date.getMonth() === calendarItem.date.getMonth() &&
        date.getFullYear() === calendarItem.date.getFullYear()
      )
    },
    onDayKeydown(event, day, gridKey) {
      if (event.altKey || event.ctrlKey || event.metaKey) return

      const target = this.keyboardTarget(
        event.key,
        event.shiftKey,
        this.helpCalendar.getDateFromFormat(day.date)
      )
      if (!target) return

      event.preventDefault()
      const movesByYear = event.shiftKey && event.key.startsWith('Page')
      this.focusDate(
        target,
        gridKey,
        movesByYear ? 'changedYear' : 'changedMonth'
      )
    },
    keyboardTarget(key, shift, from) {
      const year = from.getFullYear()
      const month = from.getMonth()
      const date = from.getDate()

      switch (key) {
        case 'ArrowLeft':
          return new Date(year, month, date - 1)
        case 'ArrowRight':
          return new Date(year, month, date + 1)
        case 'ArrowUp':
          return new Date(year, month, date - 7)
        case 'ArrowDown':
          return new Date(year, month, date + 7)
        case 'Home':
          return this.weekEdge(from, 0)
        case 'End':
          return this.weekEdge(from, 6)
        case 'PageUp':
          return this.addMonths(from, shift ? -12 : -1)
        case 'PageDown':
          return this.addMonths(from, shift ? 12 : 1)
        default:
          return null
      }
    },
    weekEdge(from, offset) {
      const year = from.getFullYear()
      const month = from.getMonth()
      const sinceWeekStart = this.helpCalendar.daysSinceWeekStart(from)
      const edge = new Date(
        year,
        month,
        from.getDate() - sinceWeekStart + offset
      )

      if (edge.getMonth() === month) return edge

      return offset ? new Date(year, month + 1, 0) : new Date(year, month, 1)
    },
    addMonths(from, count) {
      const first = new Date(from.getFullYear(), from.getMonth() + count, 1)
      const lastDay = new Date(
        first.getFullYear(),
        first.getMonth() + 1,
        0
      ).getDate()

      return new Date(
        first.getFullYear(),
        first.getMonth(),
        Math.min(from.getDate(), lastDay)
      )
    },
    focusDate(target, gridKey, changeEvent) {
      const date = this.helpCalendar.formatDate(target)
      const focus = () => {
        if (this.focusDay(date, gridKey)) this.dayMouseOver(date)
      }

      if (this.findDay(date, gridKey)) {
        focus()
        return
      }
      if (this.revealDate(target, gridKey, changeEvent)) {
        this.$nextTick(focus)
      }
    },
    findDay(date, gridKey) {
      const separately = this.fConfigs.isSeparately

      return (this.$refs.day || []).find(
        item =>
          item.isInMonth &&
          item.day.date === date &&
          (!separately || item.gridKey === gridKey)
      )
    },
    focusDay(date, gridKey) {
      const item = this.findDay(date, gridKey)
      if (!item) return false

      item.$refs.cell.focus()
      return true
    },
    focusRovingDay(gridKey = 0) {
      return this.focusDay(this.rovingDates[gridKey], gridKey)
    },
    isMonthAllowed(month) {
      const { limits } = this.fConfigs
      if (!limits) return true

      const index = date => date.getFullYear() * 12 + date.getMonth()
      const min = this.helpCalendar.getDateFromFormat(limits.min)
      const max = this.helpCalendar.getDateFromFormat(limits.max)

      return index(month) >= index(min) && index(month) <= index(max)
    },
    revealDate(target, gridKey, changeEvent) {
      const month = new Date(target.getFullYear(), target.getMonth(), 1)
      if (!this.isMonthAllowed(month)) return false

      const separately = this.fConfigs.isSeparately
      const grid = this.listCalendars[separately ? gridKey : 0]
      const forward = month > grid.date
      const start =
        forward && !separately
          ? new Date(
              month.getFullYear(),
              month.getMonth() - (this.listCalendars.length - 1),
              1
            )
          : month

      this.transitionPrefix = forward ? 'left' : 'right'
      grid.date = start
      grid.key += hUniqueID()
      this.updateCalendar()

      if (!separately) {
        this.calendar.currentDate = start
        this.initCalendar()
      }

      this.$emit(changeEvent, start)
      return true
    },
    canPickMonth(key) {
      return (
        this.fConfigs.changeMonthFunction && this.isNotSeparatelyAndFirst(key)
      )
    },
    canPickYear(key) {
      return (
        this.fConfigs.changeYearFunction && this.isNotSeparatelyAndFirst(key)
      )
    },
    openPickerFromKeyboard(kind, key) {
      if (kind === 'month') this.openMonthPicker(key + 1)
      else this.openYearPicker(key + 1)

      this.$nextTick(() => {
        const picker = this.$refs.calendars.querySelectorAll(
          '.vfc-months-container'
        )[key]
        const item = picker.querySelector('.vfc-item.vfc-selected')
        if (item) item.focus()
      })
    },
    isOutsideCalendar(element) {
      return (
        element.tagName === 'INPUT' &&
        !hElContains(this.$refs.mainContainer, element)
      )
    },
    onPopoverClick(e) {
      if (this.fConfigs.isModal && this.isOutsideCalendar(e.target)) {
        this.showCalendar = true
      }
    },
    onPopoverKeydown(e) {
      if (e.key === 'Escape') {
        this.onEscape(e)
        return
      }

      if (
        !this.fConfigs.isModal ||
        e.key !== 'ArrowDown' ||
        e.isComposing ||
        e.defaultPrevented ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        !this.isOutsideCalendar(e.target)
      ) {
        return
      }

      e.preventDefault()
      this.popoverOpener = e.target
      this.showCalendar = true
      this.$nextTick(() => this.focusRovingDay(0))
    },
    onEscape(e) {
      const pickerKey = this.showMonthPicker || this.showYearPicker
      if (pickerKey) {
        e.preventDefault()
        e.stopPropagation()
        const grid =
          this.$refs.calendars.querySelectorAll('.vfc-calendar')[pickerKey - 1]
        const title = grid.querySelector(
          '.vfc-top-date [role="button"][aria-expanded="true"]'
        )
        this.showMonthPicker = this.showYearPicker = false
        if (title) title.focus()
        return
      }

      if (this.showTimePicker) {
        e.preventDefault()
        e.stopPropagation()
        this.showTimePicker = false
        return
      }

      if (!this.fConfigs.isModal || !this.showCalendar) return

      e.preventDefault()
      e.stopPropagation()
      this.showCalendar = false
      this.focusOpener()
    },
    returnFocusIfClosed() {
      if (this.fConfigs.isModal && !this.showCalendar) this.focusOpener()
    },
    focusOpener() {
      const opener =
        this.popoverOpener && this.popoverOpener.isConnected
          ? this.popoverOpener
          : this.popoverElement.querySelector('input')
      if (!opener) return

      this.restoringFocus = true
      opener.focus()
      this.restoringFocus = false
    },
    onFocusIn(e) {
      if (!this.fConfigs.isModal || this.restoringFocus) return

      if (!this.showCalendar && this.isOutsideCalendar(e.target)) {
        this.popoverOpener = e.target
      }
      this.showCalendar = true
    },
    onFocusOut(e) {
      if (
        this.fConfigs.isModal &&
        !this.patching &&
        !hElContains(this.popoverElement, e.relatedTarget)
      ) {
        return (this.showCalendar =
          this.showMonthPicker =
          this.showYearPicker =
            false)
      }
    },

    hideMonthYearPicker(e) {
      this.$nextTick(() => {
        if (this.showMonthPicker || this.showYearPicker) {
          let key = this.showMonthPicker
            ? this.showMonthPicker - 1
            : this.showYearPicker - 1

          const MYactive = this.$refs.calendars.querySelectorAll(
            `.vfc-content-MY-picker`
          )[key]
          if (MYactive.contains(e.target)) {
            return
          }
          return (this.showMonthPicker = this.showYearPicker = false)
        }
      })
    },

    checkDateRangeStart(date) {
      if (Array.isArray(this.fConfigs.markedDateRange)) {
        return (
          this.fConfigs.markedDateRange.findIndex(range => {
            return range.start === date
          }) !== -1
        )
      }

      return date === this.fConfigs.markedDateRange.start
    },
    cleanRange() {
      if (!this.fConfigs.isMultipleDateRange) {
        this.calendar.dateRange.end = ''
        this.calendar.dateRange.start = ''
        return
      }
      this.calendar.multipleDateRange = []
      // this.calendar.multipleDateRange.push({
      //   start: '',
      //   end: ''
      // })
    }
  }
}
</script>

<style lang="scss">
@use '../assets/scss/calendar.scss';
.rangeCleaner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  span {
    padding: var(--_vfc-space-1) var(--_vfc-space-3);
    font-size: var(--_vfc-font-size-sm);
    font-weight: var(--_vfc-font-weight-medium);
    line-height: 24px;
    border: 1px solid var(--_vfc-border-strong);
    border-radius: var(--_vfc-radius);
    &.active {
      color: var(--_vfc-text);
      cursor: pointer;
      &:hover {
        background-color: var(--_vfc-hover);
      }
    }
    &.disabled {
      color: var(--_vfc-text-disabled);
      border-color: var(--_vfc-border);
    }
    &:focus-visible {
      outline: 2px solid var(--_vfc-focus);
      outline-offset: 2px;
    }
  }
}
</style>
