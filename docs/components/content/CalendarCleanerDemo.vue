<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const colorMode = useColorMode()
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')
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
          :is-dark="isDark"
        >
          <template #cleaner>
            <div class="flex justify-center">
              <UButton type="button" size="sm" color="neutral" variant="outline" label="Cancel" />
            </div>
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
