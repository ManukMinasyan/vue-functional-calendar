<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const colorMode = useColorMode()
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')

const isWeekend = ({ date }) => {
  const [day, month, year] = date.split('/').map(Number)
  return [0, 6].includes(new Date(year, month - 1, day).getDay())
}
</script>

<template>
  <DemoFrame :value="value">
    <template #demo>
      <ClientOnly>
        <FunctionalCalendar
          :key="String(isDark)"
          v-model="value"
          :is-date-picker="true"
          :always-use-default-classes="true"
          :is-dark="isDark"
        >
          <template #default="{ day }">
            <strong v-if="isWeekend(day)" style="pointer-events: none">{{ day.day }}</strong>
            <template v-else>{{ day.day }}</template>
          </template>
          <template #navigationArrowLeft>
            <span aria-hidden="true">&larr;</span>
          </template>
          <template #navigationArrowRight>
            <span aria-hidden="true">&rarr;</span>
          </template>
          <template #footer>
            <small class="demo-muted">Weekends are bold.</small>
          </template>
        </FunctionalCalendar>
        <template #fallback>
          <div class="h-80 w-full" />
        </template>
      </ClientOnly>
    </template>
    <slot />
  </DemoFrame>
</template>

<style scoped>
.demo-muted {
  color: var(--ui-text-muted);
}
</style>
