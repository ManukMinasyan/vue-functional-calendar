<template>
  <div
    class="vfc-popover-container"
    ref="popoverElement"
    tabindex="-1"
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
          :dialogId="dialogId"
          name="dateRangeInputs"
        >
        </slot>
      </template>
      <template v-slot:datePickerInput="props">
        <slot
          :selectedDate="props.selectedDate"
          :isTypeable="fConfigs.isTypeable"
          :dialogId="dialogId"
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
      :id="isModalPicker && dialogId ? dialogId : null"
      :role="isModalPicker ? 'dialog' : null"
      :aria-label="isModalPicker ? fConfigs.labels.calendar : null"
      :class="{
        'vfc-modal': isModalPicker,
        'vfc-has-presets': hasPresets,
        'vfc-dark': fConfigs.isDark
      }"
    >
      <div class="vfc-sr-only" aria-live="polite" aria-atomic="true">
        {{ visibleMonths }}
      </div>
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
                  :allowPreDate="allowPreFor(key)"
                  :allowNextDate="allowNextFor(key)"
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
                      :day="day"
                      :fConfigs="fConfigs"
                      :calendar="calendar"
                      :helpCalendar="helpCalendar"
                      :week="week"
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

import { isReadonly, toRaw } from 'vue'
import { hElContains, hUniqueID } from '../utils/helpers'
import { CALENDAR_KEY } from '../utils/injectionKeys'

const listKeys = ['selectedDates', 'multipleDateRange']
const reactiveKeys = [
  'markedDates',
  'markedDateRange',
  'disabledDates',
  'enabledDates',
  'disabledDayNames',
  'limits',
  'calendarsCount',
  'isDark'
]
const rebuildKeys = ['limits', 'calendarsCount']
const relayoutKeys = ['disabledDayNames', 'markedDateRange']
const signature = value => JSON.stringify(value) ?? 'undefined'
const monthIndex = date => date.getFullYear() * 12 + date.getMonth()

const hasModelKey = (value, key) => {
  const entry = value[key]
  if (entry == null) return false
  if (key === 'dateRange') return typeof entry === 'object'
  if (listKeys.includes(key)) return Array.isArray(entry)
  return true
}

const isMultipleDateRangeOnly = value =>
  hasModelKey(value, 'multipleDateRange') &&
  !hasModelKey(value, 'dateRange') &&
  !hasModelKey(value, 'selectedDate')

const isAdoptable = value =>
  Object.prototype.toString.call(toRaw(value)) === '[object Object]' &&
  !isReadonly(value) &&
  Object.isExtensible(toRaw(value))

const isOpenRange = range =>
  (range.start === '' || range.end === '') &&
  (range.start !== '' || range.end !== '')

const buildDatesLookup = (entries, helpCalendar) => ({
  dates: new Set(entries.map(entry => helpCalendar.normalizeDate(entry))),
  beforeToday: entries.includes('beforeToday'),
  afterToday: entries.includes('afterToday'),
  isEmpty: !entries.length
})

const copyModelKey = entry => {
  if (Array.isArray(entry)) return entry.map(item => ({ ...item }))
  if (entry instanceof Date) return new Date(entry)
  return typeof entry === 'object' ? { ...entry } : entry
}
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
  inject: {
    globalOptions: {
      from: 'functionalCalendarOptions',
      default: () => ({})
    }
  },
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
      return this.dateOnly(this.calendar.dateRange.start)
    },
    endDMY() {
      return this.dateOnly(this.calendar.dateRange.end)
    },
    multipleRangeDates() {
      return this.calendar.multipleDateRange.map(range => ({
        start: this.dateOnly(range.start),
        end: this.dateOnly(range.end)
      }))
    },
    markedRangeLookup() {
      const { markedDateRange } = this.fConfigs
      const normalize = value =>
        value ? this.helpCalendar.normalizeDate(value) : value
      const ranges = Array.isArray(markedDateRange)
        ? markedDateRange
        : [markedDateRange]

      return {
        isList: Array.isArray(markedDateRange),
        ranges: ranges.map(range => ({
          start: normalize(range.start),
          end: normalize(range.end)
        }))
      }
    },
    markedLookup() {
      const dates = new Set()
      const classes = new Map()

      this.fConfigs.markedDates.forEach(entry => {
        if (entry === null || typeof entry !== 'object') {
          dates.add(this.helpCalendar.normalizeDate(entry))
          return
        }

        const date = this.helpCalendar.normalizeDate(entry.date)
        if (!classes.has(date)) classes.set(date, entry.class)
      })

      return { dates, classes }
    },
    disabledLookup() {
      return buildDatesLookup(this.fConfigs.disabledDates, this.helpCalendar)
    },
    enabledLookup() {
      return buildDatesLookup(this.fConfigs.enabledDates, this.helpCalendar)
    },
    parsedDay() {
      const { helpCalendar } = this
      const days = new Map()

      return date => {
        if (!days.has(date))
          days.set(date, helpCalendar.getDateFromFormat(date))
        return days.get(date)
      }
    },
    limitTimes() {
      const { limits } = this.fConfigs
      if (!limits) return null

      return {
        min: this.helpCalendar.getDateFromFormat(limits.min).getTime(),
        max: this.helpCalendar.getDateFromFormat(limits.max).getTime()
      }
    },
    limitMonths() {
      const times = this.limitTimes
      if (!times) return null

      return {
        min: monthIndex(new Date(times.min)),
        max: monthIndex(new Date(times.max))
      }
    },
    usesTimePicker() {
      const { withTimePicker, isMultipleDateRange } = this.fConfigs
      return withTimePicker && !isMultipleDateRange
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
    visibleMonths() {
      return this.listCalendars.map(item => item.dateTop).join(', ')
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
    const defaults = Object.fromEntries(
      reactiveKeys.map(key => [key, toRaw(this.fConfigs[key])])
    )
    this.setConfigs()
    let invalidModel = null
    try {
      this.applyModel(this.modelValue)
    } catch (error) {
      invalidModel = error
    }
    if (typeof this.newCurrentDate !== 'undefined') {
      this.calendar.currentDate = this.newCurrentDate
    }
    this.initCalendar()
    this.$watch('modelValue', this.applyModel, { deep: true })
    this.watchReactiveKeys(defaults)
    if (invalidModel) throw invalidModel
  },
  mounted() {
    if (this.displayTimeInput) {
      const timeFormat = this.fConfigs.placeholder.split(' ')[1]
      if (!timeFormat) {
        this.fConfigs.placeholder += ' hh:mm'
      }
    }

    this.dialogId = `vfc-dialog-${hUniqueID()}`
    this.$refs.popoverElement.addEventListener('focusin', this.onFocusIn)
    this.$refs.popoverElement.addEventListener('focusout', this.onFocusOut)
    window.addEventListener('click', this.hideMonthYearPicker, {
      capture: true
    })

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
      { immediate: true }
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
    this.$refs.popoverElement.removeEventListener('focusin', this.onFocusIn)
    this.$refs.popoverElement.removeEventListener('focusout', this.onFocusOut)
    window.removeEventListener('click', this.hideMonthYearPicker, {
      capture: true
    })
  },
  watch: {
    fConfigs: {
      handler() {
        this.markChooseDays()
      },
      deep: true,
      immediate: true
    },
    calendar: {
      handler() {
        if (this.markedSignature !== this.selectionSignature()) {
          this.markChooseDays()
        }
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
    dateOnly(value) {
      return value ? this.helpCalendar.normalizeDate(value.split(' ')[0]) : ''
    },
    applyModel(value) {
      if (!value || typeof value !== 'object') return
      if (toRaw(value) !== toRaw(this.calendar)) this.focusedDate = ''

      if (isMultipleDateRangeOnly(value)) {
        this.copyMultipleDateRange(value.multipleDateRange)
        return
      }

      if (isAdoptable(value)) {
        this.adoptModel(value)
        return
      }

      this.copyModel(value)
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
      const defaults = this.freshState()
      Object.keys(defaults).forEach(key => {
        if (!hasModelKey(value, key)) value[key] = defaults[key]
      })
      value.dateRange.start = value.dateRange.start || ''
      value.dateRange.end = value.dateRange.end || ''
      this.calendar = value
    },
    copyModel(value) {
      const state = this.freshState()
      Object.keys(state).forEach(key => {
        if (hasModelKey(value, key)) state[key] = copyModelKey(value[key])
      })
      state.dateRange.start = state.dateRange.start || ''
      state.dateRange.end = state.dateRange.end || ''
      this.calendar = state
    },
    freshState() {
      const state = createCalendarState()
      state.currentDate = this.calendar.currentDate
      return state
    },
    initCalendar(keepGrids = false) {
      const { currentDate } = this.calendar
      const start = this.clampViewStart(currentDate)
      if (monthIndex(start) !== monthIndex(currentDate)) {
        this.calendar.currentDate = start
      }

      this.setCalendarData(keepGrids ? this.listCalendars : [])
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
    setCalendarData(previous = []) {
      let date = this.calendar.currentDate
      date = new Date(date.getFullYear(), date.getMonth() - 1)

      this.listCalendars = []

      for (let i = 0; i < this.visibleCount(); i++) {
        const kept = previous[i]
        const next = kept
          ? kept.date
          : new Date(date.getFullYear(), date.getMonth() + 1)
        date = previous.length ? this.clampToLimits(next) : next

        this.listCalendars.push(
          this.buildGrid(date, kept ? kept.key : hUniqueID())
        )

        if (!this.fConfigs.isMultiple) {
          break
        }
      }
    },
    buildGrid(date, key) {
      const month = this.fConfigs.monthNames[date.getMonth()]
      const year = date.getFullYear()

      return {
        key,
        date,
        dateTop: `${month} ${year}`,
        month,
        year,
        weeks: this.helpCalendar.getFinalizedWeeks(date.getMonth(), year)
      }
    },
    setExistingCalendarData() {
      for (let i = 0; i < this.listCalendars.length; i++) {
        const { date, key } = this.listCalendars[i]
        this.listCalendars[i] = this.buildGrid(date, key)

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

      Object.keys(this.globalOptions).forEach(objectKey => {
        if (typeof this.fConfigs[objectKey] !== 'undefined') {
          apply(objectKey, this.globalOptions[objectKey])
        }
      })

      if (typeof this.configs !== 'undefined') {
        Object.keys(this.fConfigs).forEach(objectKey => {
          if (typeof this.configs[objectKey] !== 'undefined') {
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

      if (this.fConfigs.isModal) this.showCalendar = false

      if (
        typeof this.fConfigs.placeholder !== 'string' ||
        !this.fConfigs.placeholder
      )
        this.fConfigs.placeholder = this.fConfigs.dateFormat

      const shift = (this.weekStart + 6) % 7
      if (shift) {
        const dayNames = this.fConfigs.dayNames
        this.fConfigs.dayNames = [
          ...dayNames.slice(shift),
          ...dayNames.slice(0, shift)
        ]
      }
    },
    configSource(key) {
      return typeof this.configs !== 'undefined'
        ? this.configs[key]
        : this.$props[key]
    },
    watchReactiveKeys(defaults) {
      reactiveKeys.forEach(key => {
        let applied = signature(this.configSource(key))

        this.$watch(
          () => this.configSource(key),
          () => {
            const next = signature(this.configSource(key))
            if (next === applied) return

            applied = next
            this.applyReactiveKey(key, defaults[key])
          },
          { deep: true }
        )
      })
    },
    applyReactiveKey(key, fallback) {
      const value = this.configSource(key)

      this.fConfigs[key] = value ?? this.globalOptions[key] ?? fallback

      if (rebuildKeys.includes(key)) {
        this.initCalendar(this.fConfigs.isSeparately)
        return
      }
      if (relayoutKeys.includes(key)) this.updateCalendar()
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
      const { helpCalendar } = this
      const { disabledDayNames } = this.fConfigs
      const today = dayStart(new Date()).getTime()

      this.listCalendars.forEach(calendar => {
        calendar.weeks.forEach(week => {
          week.days = week.days.map(day => {
            const date = new Date(day.year, day.month, day.day)
            const formatted = helpCalendar.formatDate(date)

            return {
              day: day.day,
              date: formatted,
              hide:
                day.hide ||
                helpCalendar.isDayNameDisabled(date, disabledDayNames),
              isMouseToLeft: false,
              isMouseToRight: false,
              isHovered: false,
              isDateRangeStart: this.matchesMarkedRangeEdge(formatted, 'start'),
              isDateRangeEnd: this.matchesMarkedRangeEdge(formatted, 'end'),
              hideLeftAndRightDays: day.hideLeftAndRightDays,
              isToday: date.getTime() === today,
              isMarked: false
            }
          })
        })
      })
    },
    clickDay(item, isDisabledDate) {
      const day = item.date
      const clicked = { ...item, date: this.withTimeSuffix(day) }
      this.$emit('dayClicked', clicked)

      if (
        !this.fConfigs.isDateRange &&
        !this.fConfigs.isDatePicker &&
        !this.fConfigs.isMultipleDatePicker
      ) {
        return false
      }

      if (
        this.helpCalendar.isDayNameDisabled(
          this.helpCalendar.getDateFromFormat(day),
          this.fConfigs.disabledDayNames
        ) ||
        isDisabledDate(day)
      ) {
        return false
      }

      if (this.isOutsideLimits(day)) {
        return false
      }

      this.selectDate(clicked.date)
      this.markChooseDays()
      this.$emit('choseDay', item)
    },
    selectDate(date) {
      if (this.fConfigs.isMultipleDateRange) {
        const ranges = this.calendar.multipleDateRange
        const lastRange = ranges[ranges.length - 1]

        if (!lastRange) {
          ranges.push({ end: '', start: date })
        } else if (lastRange.start !== '' && lastRange.end !== '') {
          ranges.push({ end: '', start: date })
          this.announceRange(lastRange)
        } else {
          this.applyRangeClick(lastRange, date)
        }

        this.emitModel()
      } else if (this.fConfigs.isDateRange) {
        this.applyRangeClick(this.calendar.dateRange, date)
        this.emitModel()
      } else if (this.fConfigs.isDatePicker) {
        this.calendar.selectedDate = date
        this.emitModel()

        if (!this.usesTimePicker) this.autoCloseModal()
      } else if (this.fConfigs.isMultipleDatePicker) {
        const dateIndex = this.calendar.selectedDates.findIndex(
          entry => entry.date === date
        )
        if (dateIndex !== -1) {
          this.calendar.selectedDates.splice(dateIndex, 1)
        } else {
          let selected = Object.assign({}, this.defaultDateFormat)
          selected.date = date

          this.calendar.selectedDates.push(selected)
        }

        this.emitModel()
      }

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
    applyRangeClick(range, date) {
      const { helpCalendar } = this
      const clickTime = helpCalendar.getDateFromFormat(date).getTime()
      const startDate = range.start
        ? helpCalendar.getDateFromFormat(range.start)
        : ''

      if (range.start !== '' && range.end !== '') {
        range.start = date
        range.end = ''
      } else if (range.start === '' && range.end === '') {
        range.start = date
      } else if (range.end === '' && clickTime > startDate.getTime()) {
        range.end = date
      } else if (range.start !== '' && clickTime <= startDate.getTime()) {
        range.end = range.start
        range.start = date
      }

      if (range.start === '' || range.end === '') return

      this.clampRange(range, date, startDate, this.announceRange(range))
    },
    announceRange(range) {
      const { helpCalendar } = this
      const diffDays = Math.abs(
        daysBetween(
          helpCalendar.getDateFromFormat(range.start),
          helpCalendar.getDateFromFormat(range.end)
        )
      )

      this.$emit('selectedDaysCount', diffDays)

      if (!this.usesTimePicker) this.autoCloseModal()

      return diffDays
    },
    clampRange(range, date, startDate, diffDays) {
      const { helpCalendar } = this
      const itemTime = helpCalendar.getDateFromFormat(date).getTime()
      const { minSelDays, maxSelDays } = this.fConfigs
      const isShort = minSelDays && diffDays < minSelDays
      const isLong = !isShort && maxSelDays && diffDays >= maxSelDays

      if (!isShort && !isLong) return

      const step = itemTime >= startDate.getTime() ? 1 : -1
      const edgeKey = step === 1 ? 'end' : 'start'
      let edge = dayStart(
        startDate,
        step * ((isShort ? minSelDays : maxSelDays) - 1)
      )

      if (isShort) {
        edge = this.lastOpenDay(
          helpCalendar.getDateFromFormat(range[edgeKey]),
          edge,
          step
        )
      }

      range[edgeKey] = this.withTimeSuffix(helpCalendar.formatDate(edge))
    },
    lastOpenDay(from, target, step) {
      let day = from

      while (daysBetween(day, target) * step > 0) {
        const next = dayStart(day, step)
        if (this.isDateBlocked(this.helpCalendar.formatDate(next))) break
        day = next
      }

      return day
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
      return (
        this.isTimeOutsideLimits(start.getTime()) ||
        this.isTimeOutsideLimits(last.getTime())
      )
    },
    hasDisabledDateIn(start, last) {
      const { dates, beforeToday, afterToday } = this.disabledLookup
      const today = dayStart(new Date())

      if (beforeToday && start < today) return true
      if (afterToday && last > today) return true

      return [...dates].some(entry => {
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

      if (!this.isRangePreset()) {
        return this.helpCalendar.normalizeDate(calendar.selectedDate) === start
      }

      const end = this.helpCalendar.formatDate(preset.end)
      const matches = range =>
        this.dateOnly(range.start) === start && this.dateOnly(range.end) === end
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
      return this.usesTimePicker && this.fConfigs.isDateRange
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
      if (!this.ChooseDate(this.helpCalendar.formatDate(date))) return

      const first = this.listCalendars[0].date
      this.$emit('changedMonth', first)
      if (first.getFullYear() !== previous.getFullYear()) {
        this.$emit('changedYear', first)
      }
    },
    selectionSignature() {
      const { selectedDate, selectedDates, dateRange, multipleDateRange } =
        this.calendar

      return JSON.stringify([
        selectedDate,
        selectedDates,
        dateRange,
        multipleDateRange
      ])
    },
    markChooseDays() {
      this.markedSignature = this.selectionSignature()
      let startDate = this.startDMY
      let endDate = this.endDMY
      const markedDates = this.markedLookup.dates
      this.listCalendars.forEach(calendar => {
        calendar.weeks.forEach(week => {
          week.days.forEach(day => {
            day.isMarked = false
            day.date = day.date.split(' ')[0]
            if (this.fConfigs.isDatePicker) {
              if (this.calendar.selectedDate === day.date) day.isMarked = true
            } else if (this.fConfigs.isMultipleDatePicker) {
              if (
                this.calendar.selectedDates.some(date => date.date === day.date)
              )
                day.isMarked = true
            } else {
              day.isMouseToLeft = false
              day.isMouseToRight = false
              if (startDate === day.date) {
                day.isMouseToLeft = !!endDate
                day.isMarked = true
              }

              if (endDate === day.date) {
                day.isMouseToRight = !!endDate
                day.isMarked = true
              }
              if (this.calendar.multipleDateRange) {
                const ranges = this.multipleRangeDates
                if (ranges.some(range => range.start === day.date)) {
                  day.isMouseToLeft = !!endDate
                  day.isMarked = true
                }
                if (ranges.some(range => range.end === day.date)) {
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
            if (markedDates.has(day.date)) day.isMarked = true
          })
        })
      })
    },
    dayMouseOver(date) {
      this.$emit('dayMouseOver', date)

      if (!this.fConfigs.isDateRange) {
        return false
      }

      if (this.isOutsideLimits(date)) {
        return false
      }

      const { dateRange, multipleDateRange } = this.calendar
      if (isOpenRange(dateRange)) {
        this.paintHover(dateRange, date)
      }

      if (!multipleDateRange) return

      const lastRange = multipleDateRange[multipleDateRange.length - 1]
      if (lastRange && isOpenRange(lastRange)) {
        this.paintHover(lastRange, date)
      }
    },
    paintHover(range, hoverDate) {
      const markedDates = this.markedLookup.dates
      const preview = range.start ? this.hoverPreview(range, hoverDate) : null

      this.listCalendars.forEach(calendar => {
        calendar.weeks.forEach(week => {
          week.days.forEach(day => {
            day.isHovered = false
            if (day.date !== this.startDMY && !markedDates.has(day.date)) {
              day.isMarked = false
            }
            if (preview) this.paintHoverDay(day, preview)
          })
        })
      })
    },
    hoverPreview(range, hoverDate) {
      const { minSelDays, maxSelDays } = this.fConfigs
      const start = this.parsedDay(range.start)

      return {
        start,
        hoverOffset: daysBetween(start, this.parsedDay(hoverDate)),
        minLeft: 1 - minSelDays,
        minRight: minSelDays - 1,
        maxLeft: 1 - maxSelDays,
        maxRight: maxSelDays - 1
      }
    },
    paintHoverDay(day, preview) {
      const { hoverOffset } = preview
      const itemDate = this.parsedDay(day.date)
      const itemOffset = daysBetween(preview.start, itemDate)
      const isHoverBefore = hoverOffset < 0
      const isHoverAfter = hoverOffset > 0

      day.isMouseToLeft =
        (itemOffset === 0 && isHoverAfter) ||
        (itemOffset === hoverOffset && isHoverBefore)
      day.isMouseToRight =
        (itemOffset === 0 && isHoverBefore) ||
        (itemOffset === hoverOffset && isHoverAfter)

      const isBetween =
        (itemOffset > 0 && itemOffset < hoverOffset) ||
        (itemOffset < 0 && itemOffset > hoverOffset)
      if (isBetween && !this.isOnDisabledDayName(itemDate)) {
        day.isMarked = true
      }

      if (this.checkSelDates('min', itemOffset, hoverOffset)) {
        day.isMarked = true

        if (hoverOffset >= preview.minLeft && preview.minLeft === itemOffset) {
          day.isMarked = false
          day.isMouseToLeft = true
          day.isHovered = true
        } else if (
          hoverOffset <= preview.minRight &&
          preview.minRight === itemOffset
        ) {
          day.isMarked = false
          day.isMouseToRight = true
          day.isHovered = true
        }
      }

      if (this.checkSelDates('max', itemOffset, hoverOffset)) {
        day.isMarked = false
        day.isHovered = false
        day.isMouseToLeft = false
        day.isMouseToRight = false

        if (hoverOffset <= preview.maxLeft && preview.maxLeft === itemOffset) {
          day.isHovered = true
          day.isMouseToLeft = true
        }

        if (
          hoverOffset >= preview.maxRight &&
          preview.maxRight === itemOffset
        ) {
          day.isHovered = true
          day.isMouseToRight = true
        }
      }
    },
    isOnDisabledDayName(date) {
      const { disabledDayNames } = this.fConfigs

      return (
        disabledDayNames.length > 0 &&
        this.helpCalendar.isDayNameDisabled(date, disabledDayNames)
      )
    },
    /**
     * @return {boolean}
     */
    PreMonth(calendarKey = null) {
      if (!this.allowPreFor(calendarKey)) return false

      return this.changeMonth(
        calendarKey,
        -this.fConfigs.changeMonthStep,
        'right'
      )
    },
    /**
     * @return {boolean}
     */
    NextMonth(calendarKey = null) {
      if (!this.allowNextFor(calendarKey)) return false

      return this.changeMonth(
        calendarKey,
        this.fConfigs.changeMonthStep,
        'left'
      )
    },
    /**
     * @return {boolean}
     */
    PreYear(calendarKey = null) {
      if (!this.allowPreFor(calendarKey)) return false

      return this.changeYear(calendarKey, -this.yearStep())
    },
    /**
     * @return {boolean}
     */
    NextYear(calendarKey = null) {
      if (!this.allowNextFor(calendarKey)) return false

      return this.changeYear(calendarKey, this.yearStep())
    },
    yearStep() {
      return this.showYearPicker ? this.fConfigs.changeYearStep : 1
    },
    changeMonth(calendarKey, months, transition) {
      const previous =
        this.listCalendars[calendarKey !== null ? calendarKey : 0].date
      const target = this.moveMonths(calendarKey, months)
      if (!target) return false

      this.transitionPrefix = transition
      this.$emit('changedMonth', target)
      if (target.getFullYear() !== previous.getFullYear()) {
        this.$emit('changedYear', target)
      }
      return true
    },
    changeYear(calendarKey, years) {
      const target = this.moveMonths(calendarKey, years * 12, false)
      if (!target) return false

      this.$emit('changedYear', target)
      return true
    },
    allowPreFor(calendarKey) {
      if (!this.fConfigs.isSeparately) return this.allowPreDate

      const { date } = this.gridAt(calendarKey)
      return this.isWithinMin(
        new Date(date.getFullYear(), date.getMonth() - 1, 1)
      )
    },
    allowNextFor(calendarKey) {
      if (!this.fConfigs.isSeparately) return this.allowNextDate

      const { date } = this.gridAt(calendarKey)
      return this.isWithinMax(
        new Date(date.getFullYear(), date.getMonth() + 1, 1)
      )
    },
    gridAt(calendarKey) {
      return this.listCalendars[calendarKey !== null ? calendarKey : 0]
    },
    moveMonths(calendarKey, months, rekey = true) {
      const grid = this.gridAt(calendarKey)
      const target = new Date(
        grid.date.getFullYear(),
        grid.date.getMonth() + months,
        1
      )
      const allowed =
        months > 0
          ? this.isWithinMax(this.forwardEdge(target))
          : this.isWithinMin(target)
      if (!allowed) return null

      this.showMonth(grid, target, rekey)
      return target
    },
    forwardEdge(first) {
      if (this.fConfigs.isSeparately) return first

      return new Date(
        first.getFullYear(),
        first.getMonth() + this.visibleCount() - 1,
        1
      )
    },
    visibleCount() {
      if (!this.fConfigs.isMultiple) return 1

      const { calendarsCount } = this.fConfigs
      const { limitMonths } = this
      if (!limitMonths) return calendarsCount

      const span = limitMonths.max - limitMonths.min + 1
      return Number.isNaN(span)
        ? calendarsCount
        : Math.max(1, Math.min(calendarsCount, span))
    },
    clampToLimits(date) {
      const { limitMonths } = this
      if (!limitMonths) return date

      const { min, max } = limitMonths
      if (Number.isNaN(min + max)) return date

      const index = Math.min(Math.max(monthIndex(date), min), max)
      return new Date(Math.floor(index / 12), index % 12, 1)
    },
    clampViewStart(first) {
      const { limitMonths } = this
      if (!limitMonths) return first

      const { min, max } = limitMonths
      const last = this.visibleCount() - 1
      const index = monthIndex(first)
      if (Number.isNaN(max + min) || index + last <= max) return first

      const start = Math.min(index, Math.max(max - last, min))
      return new Date(Math.floor(start / 12), start % 12, 1)
    },
    showMonth(grid, date, rekey = true) {
      if (this.fConfigs.isSeparately) {
        grid.date = date
        if (rekey) grid.key = hUniqueID()
        this.updateCalendar()
        return
      }

      this.calendar.currentDate = date
      this.initCalendar()
    },
    ChooseDate(date) {
      let newDate = this.helpCalendar.getDateFromFormat(date)

      if (date === 'today') {
        newDate = new Date()
      }

      if (!this.isMonthAllowed(newDate)) return false

      this.calendar.currentDate = newDate
      this.initCalendar()
      return true
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
      if (this.usesTimePicker) this.showTimePicker = true
    },
    closeTimePicker() {
      this.showTimePicker = false

      if (this.isSelectionComplete()) {
        this.autoCloseModal()
        this.returnFocusIfClosed()
      }
    },
    isSelectionComplete() {
      const { fConfigs, calendar } = this

      if (fConfigs.isMultipleDateRange) {
        const last = calendar.multipleDateRange.slice(-1)[0]
        return !!last && !!last.start && !!last.end
      }

      if (fConfigs.isDateRange) {
        return !!calendar.dateRange.start && !!calendar.dateRange.end
      }

      return !!fConfigs.isDatePicker
    },
    autoCloseModal() {
      if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
        this.showCalendar = false
      }
    },
    pickMonth(key, calendarKey) {
      this.showMonthPicker = false
      const { date } = this.pickerGrid(calendarKey)
      this.showPicked(calendarKey, new Date(date.getFullYear(), key, 1))
    },
    pickYear(year, calendarKey) {
      this.showYearPicker = false
      const { date } = this.pickerGrid(calendarKey)
      this.showPicked(calendarKey, new Date(year, date.getMonth(), 1))
    },
    showPicked(calendarKey, target) {
      if (!this.isMonthAllowed(target)) return

      const { date: previous } = this.pickerGrid(calendarKey)
      this.showMonth(this.pickerGrid(calendarKey), target)
      const { date } = this.pickerGrid(calendarKey)

      if (date.getMonth() !== previous.getMonth()) {
        this.$emit('changedMonth', new Date(date))
      }
      if (date.getFullYear() !== previous.getFullYear()) {
        this.$emit('changedYear', new Date(date))
      }
    },
    pickerGrid(calendarKey) {
      return this.listCalendars[this.fConfigs.isSeparately ? calendarKey : 0]
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
    addToSelectedDates() {
      const typed = this.helpCalendar.parseTypedDate(
        this.calendar.selectedDatesItem
      )
      if (typed) {
        let date = Object.assign({}, this.defaultDateFormat)
        date.date = typed
        this.calendar.selectedDates.push(date)
        this.calendar.selectedDatesItem = ''
      }
    },
    removeFromSelectedDates(index) {
      this.calendar.selectedDates.splice(index, 1)
    },

    matchesMarkedRangeEdge(date, edge) {
      return this.markedRangeLookup.ranges.some(range => range[edge] === date)
    },
    checkSelDates(type, itemOffset, hoverOffset) {
      const { minSelDays, maxSelDays } = this.fConfigs
      const isMin = type === 'min'
      const days = isMin ? minSelDays : maxSelDays - 2
      const selDays = isMin ? minSelDays : maxSelDays

      if (hoverOffset > 0) {
        return (
          (isMin ? itemOffset < days : itemOffset > days) &&
          itemOffset > 0 &&
          selDays
        )
      }
      if (hoverOffset < 0) {
        return (
          (isMin ? itemOffset > -days : itemOffset < -days) &&
          itemOffset < 0 &&
          selDays
        )
      }
    },
    checkLimits(value) {
      const { limitMonths } = this
      this.allowPreDate = true
      this.allowNextDate = true
      if (!limitMonths) return

      const current = new Date(value.getFullYear(), value.getMonth(), 1)
      if (monthIndex(current) <= limitMonths.min) this.allowPreDate = false
      if (monthIndex(this.forwardEdge(current)) >= limitMonths.max) {
        this.allowNextDate = false
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
          : this.dateOnly(range.start) === date
      )
      if (index !== -1) ranges.splice(index, 1)
    },
    isDisabledDate(date) {
      return (
        this.isDateInLookup(date, this.disabledLookup) ||
        !this.isEnabledDate(date)
      )
    },
    isEnabledDate(date) {
      const lookup = this.enabledLookup

      return lookup.isEmpty || this.isDateInLookup(date, lookup)
    },
    isDateInLookup(date, lookup) {
      if (lookup.dates.has(date)) return true
      if (!lookup.beforeToday && !lookup.afterToday) return false

      const time = this.helpCalendar.getDateFromFormat(date).getTime()
      const today = dayStart(new Date()).getTime()

      return (
        (lookup.beforeToday && time < today) ||
        (lookup.afterToday && time > today)
      )
    },
    isOutsideLimits(date) {
      return (
        !!this.limitTimes &&
        this.isTimeOutsideLimits(
          this.helpCalendar.getDateFromFormat(date).getTime()
        )
      )
    },
    isTimeOutsideLimits(time) {
      const range = this.limitTimes
      return !!range && (time < range.min || time > range.max)
    },
    isDateRuleBlocked(date) {
      return this.isDisabledDate(date) || this.isOutsideLimits(date)
    },
    isDateBlocked(date) {
      return (
        this.helpCalendar.isDayNameDisabled(
          this.helpCalendar.getDateFromFormat(date),
          this.fConfigs.disabledDayNames
        ) || this.isDateRuleBlocked(date)
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
        return calendar.selectedDates.some(item => item.date === date)
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
        this.helpCalendar.getDateFromFormat(day.date),
        getComputedStyle(event.currentTarget).direction === 'rtl'
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
    keyboardTarget(key, shift, from, rtl = false) {
      const year = from.getFullYear()
      const month = from.getMonth()
      const date = from.getDate()

      switch (key) {
        case 'ArrowLeft':
          return new Date(year, month, date + (rtl ? 1 : -1))
        case 'ArrowRight':
          return new Date(year, month, date + (rtl ? -1 : 1))
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
      return this.isWithinMin(month) && this.isWithinMax(month)
    },
    isWithinMin(month) {
      const { limitMonths } = this
      return !limitMonths || monthIndex(month) >= limitMonths.min
    },
    isWithinMax(month) {
      const { limitMonths } = this
      return !limitMonths || monthIndex(month) <= limitMonths.max
    },
    revealDate(target, gridKey, changeEvent) {
      const month = new Date(target.getFullYear(), target.getMonth(), 1)
      const separately = this.fConfigs.isSeparately
      const grid = this.listCalendars[separately ? gridKey : 0]
      const forward = month > grid.date
      if (!(forward ? this.isWithinMax(month) : this.isWithinMin(month))) {
        return false
      }

      const start =
        forward && !separately
          ? new Date(
              month.getFullYear(),
              month.getMonth() - (this.listCalendars.length - 1),
              1
            )
          : month

      const previousYear = grid.date.getFullYear()
      this.transitionPrefix = forward ? 'left' : 'right'
      this.showMonth(grid, start)

      this.$emit(changeEvent, start)
      if (
        changeEvent !== 'changedYear' &&
        start.getFullYear() !== previousYear
      ) {
        this.$emit('changedYear', start)
      }
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
        this.closeTimePicker()
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
          : this.$refs.popoverElement.querySelector('input')
      if (!opener) return

      this.restoringFocus = true
      opener.focus()
      this.restoringFocus = false
    },
    closePickerOnOutsideFocus(target) {
      const key = this.showMonthPicker || this.showYearPicker
      if (!key) return

      const grid =
        this.$refs.calendars.querySelectorAll('.vfc-calendar')[key - 1]
      const keep = [
        grid.querySelector('.vfc-months-container'),
        grid.querySelector('.vfc-top-date [aria-expanded="true"]')
      ]
      if (keep.some(element => hElContains(element, target))) return
      if (hElContains(target, keep[0])) return

      this.showMonthPicker = this.showYearPicker = false
    },
    onFocusIn(e) {
      this.closePickerOnOutsideFocus(e.target)
      if (!this.fConfigs.isModal || this.restoringFocus) return

      if (!this.showCalendar && this.isOutsideCalendar(e.target)) {
        this.popoverOpener = e.target
      }
      this.showCalendar = true
    },
    onFocusOut(e) {
      if (
        !this.patching &&
        e.relatedTarget &&
        !hElContains(this.$refs.popoverElement, e.relatedTarget)
      ) {
        this.showMonthPicker = this.showYearPicker = false
      }
      if (
        this.fConfigs.isModal &&
        !this.patching &&
        !hElContains(this.$refs.popoverElement, e.relatedTarget)
      ) {
        return (this.showCalendar =
          this.showMonthPicker =
          this.showYearPicker =
          this.showTimePicker =
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

    cleanRange() {
      if (!this.fConfigs.isMultipleDateRange) {
        this.calendar.dateRange.end = ''
        this.calendar.dateRange.start = ''
        return
      }
      this.calendar.multipleDateRange = []
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
