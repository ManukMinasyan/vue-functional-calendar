<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const themes = {
  Default: {},
  Rose: { '--vfc-primary': '#e11d48', '--vfc-on-primary': '#ffffff' },
  Emerald: { '--vfc-primary': '#059669', '--vfc-on-primary': '#ffffff' },
  Amber: { '--vfc-primary': '#f59e0b', '--vfc-on-primary': '#1c1917' },
  Compact: {
    '--vfc-radius': '0px',
    '--vfc-radius-lg': '0px',
    '--vfc-radius-sm': '0px',
    '--vfc-day-size': '30px'
  }
}

const colorMode = useColorMode()
const value = ref(calendarModel())
const theme = ref('Rose')
const isDark = computed(() => colorMode.value === 'dark')
const tokens = computed(() => themes[theme.value])
const css = computed(() => {
  const lines = Object.entries(tokens.value).map(([name, token]) => `  ${name}: ${token};`)
  return lines.length ? `.my-calendar {\n${lines.join('\n')}\n}` : '/* no overrides */'
})
</script>

<template>
  <DemoFrame :value="css" label="Applied tokens">
    <template #demo>
      <div class="flex flex-col items-center gap-4">
        <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Theme">
          <UButton
            v-for="(_, name) in themes"
            :key="name"
            size="sm"
            :variant="name === theme ? 'solid' : 'outline'"
            :color="name === theme ? 'primary' : 'neutral'"
            :aria-pressed="name === theme"
            :label="name"
            @click="theme = name"
          />
        </div>
        <div :style="tokens">
          <ClientOnly>
            <FunctionalCalendar
              :key="String(isDark)"
              v-model="value"
              :is-date-range="true"
              :can-clear-range="true"
              :is-dark="isDark"
            />
            <template #fallback>
              <div class="h-80 w-full" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </template>
    <slot />
  </DemoFrame>
</template>
