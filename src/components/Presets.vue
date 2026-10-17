<template>
  <div
    class="vfc-presets"
    role="group"
    :aria-label="calendarRoot.fConfigs.labels.quickRanges"
  >
    <button
      v-for="(preset, index) in calendarRoot.presetItems"
      :key="index"
      type="button"
      class="vfc-preset"
      :aria-disabled="preset.disabled"
      @click="calendarRoot.applyPreset(preset)"
    >
      {{ preset.label }}
    </button>
  </div>
</template>

<script>
import { CALENDAR_KEY } from '../utils/injectionKeys'

export default {
  name: 'Presets',
  inject: { calendarRoot: CALENDAR_KEY }
}
</script>
