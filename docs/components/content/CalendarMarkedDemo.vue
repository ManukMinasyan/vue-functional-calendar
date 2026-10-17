<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const colorMode = useColorMode()
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')

const now = new Date()
const format = day => `${day}/${now.getMonth() + 1}/${now.getFullYear()}`
const markedDates = [
  { date: format(5), class: 'demo-holiday' },
  { date: format(12), class: 'demo-birthday' },
  { date: format(19), class: 'demo-holiday' }
]
</script>

<template>
  <DemoFrame :value="value">
    <template #demo>
      <ClientOnly>
        <FunctionalCalendar
          :key="String(isDark)"
          v-model="value"
          class="marked-calendar"
          :marked-dates="markedDates"
          :is-date-picker="true"
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

<style scoped>
.marked-calendar :deep(.demo-holiday) {
  box-shadow: inset 0 0 0 2px #dc2626;
}

.marked-calendar :deep(.demo-birthday) {
  box-shadow: inset 0 0 0 2px #16a34a;
}
</style>
