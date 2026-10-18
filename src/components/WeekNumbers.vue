<template>
  <div
    class="vfc-day vfc-week-number"
    role="rowheader"
    :aria-label="`${calendarRoot.fConfigs.labels.week} ${number}`"
    :style="{ borderInlineEndColor: borderColor }"
  >
    <span class="vfc-span-day">{{ number }}</span>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

export default {
  name: 'WeekNumbers',
  inject: { calendarRoot: CALENDAR_KEY },
  props: {
    number: {
      type: Number,
      required: true
    },
    borderColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
