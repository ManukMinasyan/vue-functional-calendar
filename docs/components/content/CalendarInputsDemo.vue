<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const props = defineProps({
  kind: { type: String, default: 'range' }
})

const colorMode = useColorMode()
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <DemoFrame :value="value" :height="420">
    <template #demo>
      <ClientOnly>
        <FunctionalCalendar
          v-if="props.kind === 'range'"
          :key="String(isDark)"
          v-model="value"
          :is-modal="true"
          :is-date-range="true"
          :is-typeable="true"
          :is-dark="isDark"
        >
          <template #dateRangeInputs="{ startDate, endDate, isTypeable }">
            <input
              class="demo-input"
              type="text"
              title="Check in"
              placeholder="Check in"
              :value="startDate"
              :readonly="!isTypeable"
            />
            <span aria-hidden="true">&rarr;</span>
            <input
              class="demo-input"
              type="text"
              title="Check out"
              placeholder="Check out"
              :value="endDate"
              :readonly="!isTypeable"
            />
          </template>
        </FunctionalCalendar>
        <FunctionalCalendar
          v-else
          :key="String(isDark)"
          v-model="value"
          :is-modal="true"
          :is-date-picker="true"
          :is-dark="isDark"
        >
          <template #datePickerInput="{ selectedDate, isTypeable }">
            <input
              class="demo-input"
              type="text"
              title="Birthday"
              placeholder="Birthday"
              :value="selectedDate"
              :readonly="!isTypeable"
            />
          </template>
        </FunctionalCalendar>
        <template #fallback>
          <div class="h-20 w-full" />
        </template>
      </ClientOnly>
    </template>
    <slot />
  </DemoFrame>
</template>

<style scoped>
.demo-input {
  width: 9rem;
  padding: 0.5rem 0.75rem;
  color: var(--ui-text-highlighted);
  background: var(--ui-bg);
  border: 1px solid var(--ui-border-accented);
  border-radius: 0.5rem;
}
</style>
