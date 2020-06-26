<template>
  <div class="vfc-popover-container" ref="popoverElement" tabindex="0">
    <PickerInputs
      :fConfigs="fConfigs"
      :singleSelectedDate="singleSelectedDate"
      :calendar="calendar"
    >
      <template v-slot:dateRangeInputs="test">
        <slot
          :startDate="test.startDate"
          :endDate="test.endDate"
          :isTypeable="fConfigs.isTypeable"
          name="dateRangeInputs"
        >
        </slot>
      </template>
      <template v-slot:datePickerInput>
        <slot
          :startDate="test.startDate"
          :endDate="test.endDate"
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
      :class="{
        'vfc-modal':
          fConfigs.isModal &&
          (fConfigs.isDatePicker ||
            fConfigs.isDateRange ||
            fConfigs.isMultipleDatePicker),
        'vfc-dark': fConfigs.isDark
      }"
    >
      <time-picker v-if="showTimePicker"></time-picker>
      <template v-else>
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

                <transition tag="div" :name="getTransition_()" appear>
                  <div
                    class="vfc-top-date"
                    :class="'vfc-' + fConfigs.titlePosition"
                    v-if="checkHiddenElement('month')"
                  >
                    <a
                      href="#"
                      @click.prevent="openMonthPicker(key + 1)"
                      :class="{
                        'vfc-cursor-pointer vfc-underline':
                          fConfigs.changeMonthFunction,
                        'vfc-underline-active': showMonthPicker === key + 1
                      }"
                    >
                      {{ calendarItem.month }}</a
                    >
                    <a
                      href="#"
                      @click.prevent="openYearPicker(key + 1)"
                      :class="{
                        'vfc-cursor-pointer vfc-underline':
                          fConfigs.changeYearFunction,
                        'vfc-underline-active': showYearPicker === key + 1
                      }"
                    >
                      {{ calendarItem.year }}
                    </a>
                  </div>
                </transition>
                <transition tag="div" :name="getTransition_()" appear>
                  <div class="vfc-dayNames">
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
                <transition-group tag="div" :name="getTransition_()" appear>
                  <div
                    class="vfc-week"
                    v-for="(week, week_key) in calendarItem.weeks"
                    :key="key + week_key + 1"
                  >
                    <WeekNumbers v-if="showWeekNumbers" :number="week.number" />
                    <Day
                      v-for="(day, day_key) in week.days"
                      ref="day"
                      :key="key + week_key + day_key + 1"
                      :day="day"
                      :fConfigs="fConfigs"
                      :calendar="calendar"
                      :helpCalendar="helpCalendar"
                      :week="week"
                      :day_key="day_key"
                      @dayMouseOver="dayMouseOver"
                      @hasSlot="hasSlot"
                    />
                  </div>
                  <template
                    v-if="
                      calendarItem.weeks.length < 6 &&
                        !fConfigs.isLayoutExpandable
                    "
                  >
                    <div
                      class="vfc-week"
                      v-for="moreWeekKey in 6 - calendarItem.weeks.length"
                      :key="key + moreWeekKey + 'moreWeek'"
                    >
                      <div
                        class="vfc-day"
                        ref="day"
                        v-for="i in 7"
                        :key="key + moreWeekKey + i"
                      >
                        <span class="vfc-span-day">&nbsp;</span>
                      </div>
                    </div>
                  </template>
                </transition-group>
              </div>
            </div>
          </div>
          <Footer>
            <template v-slot:footer>
              <slot name="footer"></slot>
            </template>
          </Footer>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import helpCalendarClass from '../assets/js/helpCalendar';
import { propsAndData } from '../mixins/propsAndData';
import TimePicker from '../components/TimePicker';
import Arrows from '../components/Arrows';
import WeekNumbers from '../components/WeekNumbers';
import Day from '../components/Day';
import MonthYearPicker from '../components/MonthYearPicker';
import PickerInputs from '../components/PickerInputs';
import Footer from '../components/Footer';
import calendarMethods from '../utils/calendarMethods';

export default {
  name: 'FunctionalCalendar',
  components: {
    MonthYearPicker,
    TimePicker,
    PickerInputs,
    Arrows,
    Footer,
    Day,
    WeekNumbers
  },
  mixins: [propsAndData],
  computed: {
    helpCalendar() {
      return new helpCalendarClass(
        this.fConfigs.sundayStart,
        this.checkHiddenElement('leftAndRightDays'),
        this.fConfigs.dateFormat,
        this.fConfigs.dayNames
      );
    },
    singleSelectedDate: {
      get() {
        return this.calendar.selectedDate ? this.calendar.selectedDate : '';
      },
      set(newValue) {
        newValue = this.helpCalendar.mask(newValue);
        if (this.helpCalendar.getDateFromFormat(newValue).getMonth()) {
          this.calendar.selectedDate = newValue;
        }
      }
    }
  },
  created() {
    this.setConfigs();
    this.initCalendar();
  },
  mounted() {
    this.popoverElement = this.$refs.popoverElement;
    // Event
    this.popoverElement.addEventListener('focusin', this.onFocusIn);
    this.popoverElement.addEventListener('focusout', this.onFocusOut);
    window.addEventListener('click', this.hideMonthYearPicker);

    // Reacts to external selected dates
    this.$watch(
      'value',
      function(value) {
        if (
          typeof value === 'object' &&
          (value.hasOwnProperty('dateRange') ||
            value.hasOwnProperty('selectedDate'))
        ) {
          this.calendar = value;
        }
      },
      { immediate: true, deep: true }
    );

    this.$watch(
      'showCalendar',
      function(value) {
        if (value) this.$emit('opened');
        else this.$emit('closed');
      },
      { immediate: true, deep: true }
    );
  },
  beforeDestroy: function() {
    window.removeEventListener('focusin', this.onFocusIn);
    window.removeEventListener('focusout', this.onFocusOut);
    window.removeEventListener('click', this.hideMonthYearPicker);
  },
  watch: {
    fConfigs: {
      handler() {
        this.markChooseDays();
      },
      deep: true,
      immediate: true
    },
    calendar: {
      handler() {
        this.markChooseDays();
      },
      deep: true,
      immediate: true
    },
    'calendar.currentDate': {
      handler(value) {
        this.$emit('input', this.calendar);
        this.checkLimits(value);
      }
    }
  },
  methods: {
    ...calendarMethods
  }
};
</script>

<style lang="scss">
@import '../assets/scss/calendar.scss';
</style>
