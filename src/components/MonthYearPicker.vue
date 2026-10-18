<template>
  <div class="vfc-months-container" role="group" :aria-label="pickerLabel">
    <div class="vfc-content vfc-content-MY-picker">
      <div class="vfc-navigation-buttons">
        <button
          type="button"
          :aria-label="previousLabel"
          @click="changePicker('left')"
        >
          <div class="vfc-arrow-left"></div>
        </button>
        <button
          type="button"
          :class="['vfc-top-date', delta !== 0 && 'vfc-top-date-has-delta']"
          :aria-disabled="delta === 0"
          @click="delta = 0"
        >
          <span class="vfc-popover-caret"></span>
          {{ calendarRoot.listCalendars[calendarKey].date.getFullYear() }}
        </button>
        <button
          type="button"
          :aria-label="nextLabel"
          @click="changePicker('right')"
        >
          <div class="vfc-arrow-right"></div>
        </button>
      </div>
      <div class="vfc-months">
        <template v-if="calendarRoot.showMonthPicker">
          <div
            class="vfc-item"
            :data-focus-id="`picker:${calendarKey}`"
            role="button"
            tabindex="0"
            v-for="(month, key) in calendarRoot.fConfigs.shortMonthNames"
            :key="key"
            :class="{
              'vfc-selected':
                calendarRoot.listCalendars[calendarKey].date.getMonth() === key
            }"
            :aria-pressed="
              calendarRoot.listCalendars[calendarKey].date.getMonth() === key
            "
            @click="calendarRoot.pickMonth(key, calendarKey)"
            @keydown.enter.space.prevent="
              calendarRoot.pickMonth(key, calendarKey)
            "
          >
            {{ month }}
          </div>
        </template>
        <template v-else-if="calendarRoot.showYearPicker">
          <div
            class="vfc-item"
            :data-focus-id="`picker:${calendarKey}`"
            role="button"
            tabindex="0"
            v-for="(year, key) in calendarRoot.getYearList(
              calendarRoot.listCalendars[calendarKey].date,
              delta
            )"
            :key="key"
            :class="{
              'vfc-selected':
                calendarRoot.listCalendars[calendarKey].date.getFullYear() ===
                year.year
            }"
            :aria-pressed="
              calendarRoot.listCalendars[calendarKey].date.getFullYear() ===
              year.year
            "
            @click="calendarRoot.pickYear(year.year, calendarKey)"
            @keydown.enter.space.prevent="
              calendarRoot.pickYear(year.year, calendarKey)
            "
          >
            {{ year.year }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

export default {
  name: 'MonthYearPicker',
  inject: { calendarRoot: CALENDAR_KEY },
  props: {
    calendarKey: {
      type: Number,
      default: 0
    },
    changeYearStep: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      delta: 0
    }
  },
  computed: {
    pickerLabel() {
      const { labels } = this.calendarRoot.fConfigs
      return this.calendarRoot.showMonthPicker
        ? labels.chooseMonth
        : labels.chooseYear
    },
    previousLabel() {
      const { labels } = this.calendarRoot.fConfigs
      return this.calendarRoot.showMonthPicker
        ? labels.previousYear
        : labels.previousYears
    },
    nextLabel() {
      const { labels } = this.calendarRoot.fConfigs
      return this.calendarRoot.showMonthPicker
        ? labels.nextYear
        : labels.nextYears
    }
  },
  watch: {
    delta(newDelta) {
      if (newDelta < -new Date().getFullYear()) this.delta = 0
    }
  },
  methods: {
    changePicker(to) {
      if (this.calendarRoot.showMonthPicker) {
        if (to === 'right') this.calendarRoot.NextYear(this.calendarKey)
        else this.calendarRoot.PreYear(this.calendarKey)
        return
      }

      if (to === 'right') this.delta += this.changeYearStep
      else this.delta -= this.changeYearStep
    }
  }
}
</script>

<style scoped></style>
