<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const colorMode = useColorMode()
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')

const next14Days = () => {
  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + 13)
  return { start, end }
}

const thisQuarter = () => {
  const now = new Date()
  const first = Math.floor(now.getMonth() / 3) * 3
  return {
    start: new Date(now.getFullYear(), first, 1),
    end: new Date(now.getFullYear(), first + 3, 0)
  }
}

const presets = [
  'today',
  'last7Days',
  'thisMonth',
  { label: 'Next 14 days', range: next14Days },
  { label: 'This quarter', range: thisQuarter }
]
</script>

<template>
  <DemoFrame :value="value">
    <template #demo>
      <ClientOnly>
        <FunctionalCalendar
          :key="String(isDark)"
          v-model="value"
          :is-date-range="true"
          :can-clear-range="true"
          :presets="presets"
          style="width: 460px; max-width: 100%"
          :is-dark="isDark"
        />
        <template #fallback>
          <div class="h-80 w-full" />
        </template>
      </ClientOnly>
    </template>
    <slot />
  </DemoFrame>
</template>
