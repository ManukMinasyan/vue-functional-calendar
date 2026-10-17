<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const modes = [
  { label: 'Single date', value: 'single' },
  { label: 'Date range', value: 'range' },
  { label: 'Multiple dates', value: 'multiple' },
  { label: 'Multiple date ranges', value: 'ranges' }
]
const counts = [
  { label: '1 calendar', value: 1 },
  { label: '2 calendars', value: 2 },
  { label: '3 calendars', value: 3 }
]
const locales = [
  { label: 'Default (English)', value: 'default' },
  ...['en-US', 'de-DE', 'fr-FR', 'es-ES', 'ar-EG', 'ja-JP', 'fa-IR'].map(value => ({
    label: value,
    value
  }))
]

const defaults = { primary: '#264ad9', radius: 8, daySize: 36 }
const colorMode = useColorMode()
const copied = ref(false)
const value = ref(calendarModel())
const state = reactive({
  mode: 'range',
  calendarsCount: 1,
  isModal: false,
  isTypeable: false,
  withTimePicker: false,
  showWeekNumbers: false,
  presets: false,
  locale: 'default',
  ...defaults
})

const isDark = computed(() => colorMode.value === 'dark')
const isRange = computed(() => ['range', 'ranges'].includes(state.mode))
const presetsAvailable = computed(() => ['single', 'range', 'ranges'].includes(state.mode))
const typeableAvailable = computed(() => state.isModal && state.mode !== 'ranges' && state.mode !== 'multiple')
const timeAvailable = computed(() => state.mode !== 'ranges')

const props = computed(() => {
  const result = {}
  if (state.mode === 'single') result.isDatePicker = true
  if (state.mode === 'range') result.isDateRange = true
  if (state.mode === 'multiple') result.isMultipleDatePicker = true
  if (state.mode === 'ranges') {
    result.isDateRange = true
    result.isMultipleDateRange = true
  }
  if (isRange.value) result.canClearRange = true
  if (state.calendarsCount > 1) {
    result.isMultiple = true
    result.calendarsCount = state.calendarsCount
  }
  if (state.isModal) result.isModal = true
  if (state.isModal && typeableAvailable.value && state.isTypeable) result.isTypeable = true
  if (state.withTimePicker && timeAvailable.value) result.withTimePicker = true
  if (state.showWeekNumbers) result.showWeekNumbers = true
  if (state.presets && presetsAvailable.value) result.presets = true
  if (state.locale !== 'default') result.locale = state.locale
  return result
})

const tokens = computed(() => {
  const result = {}
  if (state.primary !== defaults.primary) result['--vfc-primary'] = state.primary
  if (state.radius !== defaults.radius) {
    result['--vfc-radius'] = `${state.radius}px`
    result['--vfc-radius-lg'] = `${Math.round(state.radius * 1.5)}px`
    result['--vfc-radius-sm'] = `${Math.round(state.radius * 0.75)}px`
  }
  if (state.daySize !== defaults.daySize) result['--vfc-day-size'] = `${state.daySize}px`
  return result
})

const style = computed(() => {
  if (!props.value.presets) return undefined
  return { width: `${160 + 300 * state.calendarsCount}px`, maxWidth: '100%' }
})

const key = computed(() => JSON.stringify([props.value, state.locale, isDark.value]))

const kebab = name => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
const attribute = ([name, val]) => {
  if (name === 'presets') return ':presets="true"'
  if (val === true) return kebab(name)
  if (typeof val === 'number') return `:${kebab(name)}="${val}"`
  return `${kebab(name)}="${val}"`
}

const snippet = computed(() => {
  const attrs = Object.entries(props.value).map(attribute)
  const hasTokens = Object.keys(tokens.value).length > 0
  const lines = ['v-model="value"', ...(hasTokens ? ['class="my-calendar"'] : []), ...attrs]
  const component = `  <FunctionalCalendar\n${lines.map(line => `    ${line}`).join('\n')}\n  />`
  const style = hasTokens
    ? `\n\n<style>\n.my-calendar {\n${Object.entries(tokens.value)
        .map(([name, token]) => `  ${name}: ${token};`)
        .join('\n')}\n}\n</style>`
    : ''

  return `<script setup>
import { ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'
import 'vue-functional-calendar/style.css'

const value = ref({})
<\/script>

<template>
${component}
</template>${style}`
})

watch(key, () => {
  value.value = calendarModel()
})

const copy = async () => {
  await navigator.clipboard.writeText(snippet.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}

const reset = () => Object.assign(state, defaults)
</script>

<template>
  <div class="playground my-6 grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
    <form class="flex flex-col gap-4 rounded-lg border border-default bg-default p-4" aria-label="Calendar options" @submit.prevent>
      <UFormField label="Mode">
        <USelect v-model="state.mode" :items="modes" class="w-full" aria-label="Mode" data-testid="mode" />
      </UFormField>
      <UFormField label="Calendars">
        <USelect v-model="state.calendarsCount" :items="counts" class="w-full" aria-label="Calendars" data-testid="count" />
      </UFormField>
      <UFormField label="Locale">
        <USelect v-model="state.locale" :items="locales" class="w-full" aria-label="Locale" data-testid="locale" />
      </UFormField>
      <div class="flex flex-col gap-3">
        <USwitch v-model="state.isModal" label="Modal (isModal)" data-testid="modal" />
        <USwitch v-model="state.isTypeable" :disabled="!typeableAvailable" label="Typeable input (isTypeable)" data-testid="typeable" />
        <USwitch v-model="state.withTimePicker" :disabled="!timeAvailable" label="Time picker (withTimePicker)" data-testid="time" />
        <USwitch v-model="state.showWeekNumbers" label="Week numbers (showWeekNumbers)" data-testid="weeks" />
        <USwitch v-model="state.presets" :disabled="!presetsAvailable" label="Presets (presets)" data-testid="presets" />
      </div>
      <div class="flex flex-col gap-4 border-t border-default pt-4">
        <UFormField label="Primary color (--vfc-primary)">
          <input v-model="state.primary" type="color" class="h-9 w-full cursor-pointer rounded-md border border-default bg-default p-1" aria-label="Primary color" data-testid="primary">
        </UFormField>
        <UFormField :label="`Radius (--vfc-radius): ${state.radius}px`">
          <USlider v-model="state.radius" :min="0" :max="16" aria-label="Radius" />
        </UFormField>
        <UFormField :label="`Day size (--vfc-day-size): ${state.daySize}px`">
          <USlider v-model="state.daySize" :min="28" :max="44" :step="4" aria-label="Day size" />
        </UFormField>
        <UButton type="button" variant="outline" color="neutral" label="Reset theme" @click="reset" />
      </div>
    </form>

    <div class="flex min-w-0 flex-col gap-4">
      <DemoFrame :value="value" :height="state.isModal ? 1 : 0">
        <template #demo>
          <div :style="tokens" class="w-full flex justify-center">
            <ClientOnly>
              <FunctionalCalendar :key="key" v-model="value" v-bind="props" :style="style" :is-dark="isDark" />
              <template #fallback>
                <div class="h-80 w-full" />
              </template>
            </ClientOnly>
          </div>
        </template>
      </DemoFrame>

      <div class="overflow-hidden rounded-lg border border-default bg-default">
        <div class="flex items-center justify-between border-b border-default px-4 py-2">
          <span class="text-xs font-medium uppercase tracking-wide text-muted">Generated code</span>
          <UButton size="xs" variant="ghost" color="neutral" :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" :label="copied ? 'Copied' : 'Copy'" @click="copy" />
        </div>
        <pre class="playground__snippet m-0 overflow-auto p-4 font-mono text-xs leading-5 text-toned" aria-label="Generated code">{{ snippet }}</pre>
      </div>
    </div>
  </div>
</template>
