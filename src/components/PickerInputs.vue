<template>
  <div>
    <div
      class="vfc-multiple-input"
      :class="{ 'vfc-dark': fConfigs.isDark }"
      v-if="fConfigs.isModal && fConfigs.isDateRange"
    >
      <slot
        name="dateRangeInputs"
        :startDate="dateRangeSelectedStartDate"
        :endDate="dateRangeSelectedEndDate"
        :isTypeable="fConfigs.isTypeable"
      >
        <input
          type="text"
          title="Start Date"
          v-model="dateRangeSelectedStartDate"
          :placeholder="fConfigs.placeholder.split(' ')[0]"
          :readonly="!fConfigs.isTypeable"
          :maxlength="fConfigs.dateFormat.length"
        />
        <input
          type="text"
          title="End Date"
          v-model="dateRangeSelectedEndDate"
          :placeholder="fConfigs.placeholder.split(' ')[0]"
          :readonly="!fConfigs.isTypeable"
          :maxlength="fConfigs.dateFormat.length"
        />
      </slot>
    </div>
    <div
      :class="{ 'vfc-dark': fConfigs.isDark }"
      v-else-if="fConfigs.isModal && fConfigs.isDatePicker"
    >
      <slot
        name="datePickerInput"
        :selectedDate="singleSelectedDate"
        :isTypeable="fConfigs.isTypeable"
      >
        <input
          class="vfc-single-input"
          type="text"
          title="Date"
          :value="singleSelectedDate"
          @input="calendarRoot.singleSelectedDate = $event.target.value"
          :placeholder="fConfigs.placeholder"
          :readonly="!fConfigs.isTypeable"
          :maxlength="fConfigs.dateFormat.length"
        />
      </slot>
    </div>
    <div
      v-else-if="fConfigs.isModal && fConfigs.isMultipleDatePicker"
      class="vfc-tags-input-root"
      :class="{ 'vfc-dark': fConfigs.isDark }"
    >
      <div class="vfc-tags-input-wrapper-default vfc-tags-input">
        <span
          class="vfc-tags-input-badge vfc-tags-input-badge-pill vfc-tags-input-badge-selected-default"
          v-for="(date, index) in calendar.selectedDates"
          :key="index"
        >
          <span v-html="date.date"></span>
          <a
            href="#"
            class="vfc-tags-input-remove"
            @click.prevent="calendarRoot.removeFromSelectedDates(index)"
          ></a>
        </span>

        <input
          v-model="calendar.selectedDatesItem"
          @keydown.enter.prevent="calendarRoot.addToSelectedDates"
          type="text"
          placeholder="Add a date"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

export default {
  name: 'PickerInputs',
  inject: { calendarRoot: CALENDAR_KEY },
  props: {
    fConfigs: {
      type: Object,
      required: true
    },
    singleSelectedDate: {
      type: String,
      required: true
    },
    calendar: {
      type: Object,
      required: true
    }
  },
  computed: {
    dateRangeSelectedStartDate: {
      get() {
        return this.calendar.dateRange.start
          ? this.calendar.dateRange.start
          : ''
      },
      set(newValue) {
        const helpCalendar = this.calendarRoot.helpCalendar
        newValue = helpCalendar.mask(newValue)
        if (helpCalendar.checkValidDate(newValue)) {
          this.calendar.dateRange.start = newValue
        }
      }
    },
    dateRangeSelectedEndDate: {
      get() {
        return this.calendar.dateRange.end ? this.calendar.dateRange.end : ''
      },
      set(newValue) {
        const helpCalendar = this.calendarRoot.helpCalendar
        newValue = helpCalendar.mask(newValue)
        if (helpCalendar.checkValidDate(newValue)) {
          this.calendar.dateRange.end = newValue
        }
      }
    }
  }
}
</script>

<style scoped></style>
