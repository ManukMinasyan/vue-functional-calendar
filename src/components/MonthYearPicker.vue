<template>
  <div class="vfc-months-container">
    <div class="vfc-content vfc-content-MY-picker">
      <div class="vfc-navigation-buttons">
        <div @click="changePicker('left')">
          <div class="vfc-arrow-left"></div>
        </div>
        <h2
          :class="['vfc-top-date', delta !== 0 && 'vfc-top-date-has-delta']"
          @click="delta = 0"
        >
          <span class="vfc-popover-caret"></span>
          {{ $parent.listCalendars[calendarKey].date.getFullYear() }}
        </h2>
        <div @click="changePicker('right')">
          <div class="vfc-arrow-right"></div>
        </div>
      </div>
      <div class="vfc-months">
        <template v-if="$parent.showMonthPicker">
          <div
            class="vfc-item"
            v-for="(month, key) in $parent.fConfigs.shortMonthNames"
            :key="key"
            :class="{
              'vfc-selected':
                $parent.listCalendars[calendarKey].date.getMonth() === key
            }"
            @click="$parent.pickMonth(key, calendarKey)"
          >
            {{ month }}
          </div>
        </template>
        <template v-else-if="$parent.showYearPicker">
          <div
            class="vfc-item"
            v-for="(year, key) in $parent.getYearList(
              $parent.listCalendars[calendarKey].date,
              delta
            )"
            :key="key"
            :class="{
              'vfc-selected':
                $parent.listCalendars[calendarKey].date.getFullYear() ===
                year.year
            }"
            @click="$parent.pickYear(year.year, calendarKey)"
          >
            {{ year.year }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthYearPicker',
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
  watch: {
    delta(newDelta) {
      if (newDelta < -new Date().getFullYear()) this.delta = 0
    }
  },
  methods: {
    changePicker(to) {
      if (this.$parent.showMonthPicker) {
        if (to === 'right') this.$parent.NextYear(this.calendarKey)
        else this.$parent.PreYear(this.calendarKey)
        return
      }

      if (to === 'right') this.delta += this.changeYearStep
      else this.delta -= this.changeYearStep
    }
  }
}
</script>

<style scoped></style>
