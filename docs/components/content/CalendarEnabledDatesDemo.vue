<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const colorMode = useColorMode()
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')

const now = new Date()
const day = offset => {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}
const sets = {
  'Next 3 days': [day(1), day(2), day(3)],
  'Next week': [day(7), day(8), day(9), day(10)]
}
const names = Object.keys(sets)
const current = ref(names[0])
const enabledDates = computed(() => sets[current.value])
</script>

<template>
  <DemoFrame :value="value">
    <template #demo>
      <div class="flex flex-col items-center gap-4">
        <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Enabled dates">
          <UButton
            v-for="name in names"
            :key="name"
            size="sm"
            :variant="name === current ? 'solid' : 'outline'"
            :color="name === current ? 'primary' : 'neutral'"
            :aria-pressed="name === current"
            :label="name"
            @click="current = name"
          />
        </div>
        <ClientOnly>
          <FunctionalCalendar
            :key="String(isDark)"
            v-model="value"
            :is-date-picker="true"
            :enabled-dates="enabledDates"
            :is-dark="isDark"
          />
          <template #fallback>
            <div class="h-80 w-full" />
          </template>
        </ClientOnly>
      </div>
    </template>
    <slot />
  </DemoFrame>
</template>
