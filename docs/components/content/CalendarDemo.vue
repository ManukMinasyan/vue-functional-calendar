<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const props = defineProps({
  config: { type: Object, default: () => ({}) },
  height: { type: Number, default: 0 },
  initial: { type: Object, default: () => ({}) },
  showValue: { type: Boolean, default: true }
})

const colorMode = useColorMode()
const start = props.config.newCurrentDate
  ? new Date(`${props.config.newCurrentDate}T12:00:00`)
  : new Date()
const value = ref(calendarModel(start, JSON.parse(JSON.stringify(props.initial))))
const isDark = computed(() => props.config.isDark ?? colorMode.value === 'dark')
const style = computed(() => {
  if (!props.config.presets) return undefined
  const count = props.config.isMultiple ? props.config.calendarsCount || 1 : 1
  return { width: `${160 + 300 * count}px`, maxWidth: '100%' }
})
const calendarProps = computed(() => {
  const { newCurrentDate, ...rest } = props.config
  return newCurrentDate
    ? { ...rest, newCurrentDate: new Date(`${newCurrentDate}T12:00:00`) }
    : rest
})
</script>

<template>
  <DemoFrame :value="showValue ? value : null" :height="height">
    <template #demo>
      <ClientOnly>
        <FunctionalCalendar
          :key="String(isDark)"
          v-model="value"
          v-bind="calendarProps"
          :style="style"
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
