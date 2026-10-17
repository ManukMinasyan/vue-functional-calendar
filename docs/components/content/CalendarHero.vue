<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const colorMode = useColorMode()
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')
const range = computed(() => {
  const { start, end } = value.value.dateRange || {}
  if (start && end) return `${start} to ${end}`
  return start ? `${start} to ...` : 'Pick a range or choose a preset.'
})
</script>

<template>
  <div class="calendar-hero mx-auto -mt-16 mb-16 flex w-full max-w-[28.75rem] flex-col items-center gap-3">
    <div class="rounded-2xl shadow-xl ring-1 ring-default">
      <ClientOnly>
        <FunctionalCalendar
          :key="String(isDark)"
          v-model="value"
          :is-date-range="true"
          :can-clear-range="true"
          :presets="true"
          style="width: 460px; max-width: 100%"
          :is-dark="isDark"
        />
        <template #fallback>
          <div class="h-96 w-80" />
        </template>
      </ClientOnly>
    </div>
    <p class="calendar-hero__value text-sm text-muted" aria-live="polite">{{ range }}</p>
  </div>
</template>
