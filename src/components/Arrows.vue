<template>
  <div>
    <div
      class="vfc-separately-navigation-buttons"
      :class="'vfc-' + fConfigs.arrowsPosition"
      v-if="oneArrows || manyArrows"
    >
      <div
        @click="calendarRoot.PreMonth(oneArrows ? 0 : calendarKey)"
        :class="{ 'vfc-cursor-pointer': allowPreDate }"
      >
        <slot name="navigationArrowLeft">
          <div
            class="vfc-arrow-left"
            :class="{ 'vfc-disabled': !allowPreDate }"
          ></div>
        </slot>
      </div>
      <div
        @click="calendarRoot.NextMonth(oneArrows ? 0 : calendarKey)"
        :class="{ 'vfc-cursor-pointer': allowNextDate }"
      >
        <slot name="navigationArrowRight">
          <div
            class="vfc-arrow-right"
            :class="{ 'vfc-disabled': !allowNextDate }"
          ></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

export default {
  name: 'Arrows',
  inject: { calendarRoot: CALENDAR_KEY },
  props: {
    fConfigs: {
      type: Object,
      required: true
    },
    allowPreDate: {
      type: Boolean,
      required: true
    },
    allowNextDate: {
      type: Boolean,
      required: true
    },
    calendarKey: {
      type: Number,
      default: 0
    },
    isMultiple: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    oneArrows() {
      return !this.fConfigs.isSeparately && !this.isMultiple
    },
    manyArrows() {
      return this.fConfigs.isSeparately && this.isMultiple
    }
  }
}
</script>
