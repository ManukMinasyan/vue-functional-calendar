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
          :title="fConfigs.labels.startDate"
          :aria-label="fConfigs.labels.startDate"
          role="combobox"
          aria-haspopup="dialog"
          :aria-controls="calendarRoot.dialogId || null"
          :aria-expanded="calendarRoot.showCalendar"
          :value="dateRangeSelectedStartDate"
          @input="typeRangeDate($event, 'start')"
          @compositionend="typeRangeDate($event, 'start')"
          :placeholder="fConfigs.placeholder.split(' ')[0]"
          :readonly="!fConfigs.isTypeable"
          :maxlength="maxLength"
        />
        <input
          type="text"
          :title="fConfigs.labels.endDate"
          :aria-label="fConfigs.labels.endDate"
          role="combobox"
          aria-haspopup="dialog"
          :aria-controls="calendarRoot.dialogId || null"
          :aria-expanded="calendarRoot.showCalendar"
          :value="dateRangeSelectedEndDate"
          @input="typeRangeDate($event, 'end')"
          @compositionend="typeRangeDate($event, 'end')"
          :placeholder="fConfigs.placeholder.split(' ')[0]"
          :readonly="!fConfigs.isTypeable"
          :maxlength="maxLength"
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
          :title="fConfigs.labels.date"
          :aria-label="fConfigs.labels.date"
          role="combobox"
          aria-haspopup="dialog"
          :aria-controls="calendarRoot.dialogId || null"
          :aria-expanded="calendarRoot.showCalendar"
          :value="singleSelectedDate"
          @input="typeSingleDate"
          @compositionend="typeSingleDate"
          :placeholder="fConfigs.placeholder"
          :readonly="!fConfigs.isTypeable"
          :maxlength="maxLength"
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
          <span>{{ date.date }}</span>
          <button
            type="button"
            class="vfc-tags-input-remove"
            :aria-label="`${fConfigs.labels.removeDate} ${date.date}`"
            @click="removeDate(index)"
          ></button>
        </span>

        <input
          ref="tagsInput"
          v-model="calendar.selectedDatesItem"
          @keydown.enter.prevent="calendarRoot.addToSelectedDates"
          type="text"
          :aria-label="fConfigs.labels.addDate"
          role="combobox"
          aria-haspopup="dialog"
          :aria-controls="calendarRoot.dialogId || null"
          :aria-expanded="calendarRoot.showCalendar"
          :placeholder="fConfigs.labels.addDate"
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
    dateRangeSelectedStartDate() {
      return this.calendar.dateRange.start ? this.calendar.dateRange.start : ''
    },
    dateRangeSelectedEndDate() {
      return this.calendar.dateRange.end ? this.calendar.dateRange.end : ''
    },
    maxLength() {
      const dateLength = this.fConfigs.dateFormat.split(' ')[0].length
      return this.calendarRoot.displayTimeInput
        ? dateLength + ' hh:mm'.length
        : dateLength
    }
  },
  methods: {
    removeDate(index) {
      this.calendarRoot.removeFromSelectedDates(index)
      this.$nextTick(() => {
        const input = this.$refs.tagsInput
        if (input) input.focus()
      })
    },
    cleanTypedInput(event) {
      const input = event.target
      const cleaned = this.calendarRoot.helpCalendar.cleanTypedInput(
        input.value,
        input.selectionStart,
        event.inputType,
        event.data
      )
      if (cleaned.value === input.value) return input.value

      input.value = cleaned.value
      input.setSelectionRange(cleaned.caret, cleaned.caret)
      return input.value
    },
    typeSingleDate(event) {
      if (event.isComposing) return

      this.calendarRoot.singleSelectedDate = this.cleanTypedInput(event)
    },
    typeRangeDate(event, edge) {
      if (event.isComposing) return

      const date = this.calendarRoot.helpCalendar.parseTypedDate(
        this.cleanTypedInput(event)
      )
      if (date) this.calendar.dateRange[edge] = date
    }
  }
}
</script>

<style scoped></style>
