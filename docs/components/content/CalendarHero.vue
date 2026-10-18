<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const DAY = 86400000

const modes = [
  {
    value: 'range',
    label: 'Range',
    icon: 'i-lucide-calendar-range',
    width: 460,
    props: { isDateRange: true, presets: true, canClearRange: true },
    attrs: 'is-date-range presets can-clear-range'
  },
  {
    value: 'date',
    label: 'Date',
    icon: 'i-lucide-calendar-check',
    width: 320,
    props: { isDatePicker: true },
    attrs: 'is-date-picker'
  },
  {
    value: 'multiple',
    label: 'Multiple',
    icon: 'i-lucide-calendar-plus',
    width: 320,
    props: { isMultipleDatePicker: true },
    attrs: 'is-multiple-date-picker'
  },
  {
    value: 'months',
    label: 'Two months',
    icon: 'i-lucide-columns-2',
    width: 600,
    props: { isDateRange: true, isMultiple: true, calendarsCount: 2 },
    attrs: 'is-date-range is-multiple :calendars-count="2"'
  },
  {
    value: 'time',
    label: 'Time',
    icon: 'i-lucide-clock',
    width: 320,
    props: { isDatePicker: true, withTimePicker: true },
    attrs: 'is-date-picker with-time-picker'
  }
]

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const modeValue = ref('range')
const mode = computed(() => modes.find(item => item.value === modeValue.value))
const value = ref(calendarModel())

const switchMode = next => {
  modeValue.value = next
  value.value = calendarModel()
}

const dayFormat = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
})
const parse = date => {
  const [day, month, year] = String(date).split(' ')[0].split('/').map(Number)
  return new Date(year, month - 1, day)
}
const format = date => dayFormat.format(parse(date))
const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

const summary = computed(() => {
  const model = value.value

  if (modeValue.value === 'range' || modeValue.value === 'months') {
    const { start, end } = model.dateRange || {}
    if (!start)
      return mode.value.props.presets
        ? 'Pick a start date, or choose a preset.'
        : 'Pick a start date.'
    if (!end) return `${format(start)} to ... pick an end date.`
    const days = Math.round((parse(end) - parse(start)) / DAY) + 1
    return `${format(start)} to ${format(end)}, ${plural(days, 'day')}`
  }

  if (modeValue.value === 'multiple') {
    const dates = model.selectedDates || []
    if (!dates.length) return 'Pick as many dates as you like.'
    return `${plural(dates.length, 'date')}: ${dates.map(item => format(item.date)).join(', ')}`
  }

  if (!model.selectedDate)
    return modeValue.value === 'time'
      ? 'Pick a date, then a time.'
      : 'Pick a date.'
  if (modeValue.value === 'time') {
    return `${format(model.selectedDate)} at ${model.selectedHour}:${model.selectedMinute}`
  }
  return format(model.selectedDate)
})
</script>

<template>
  <div
    class="calendar-hero w-full overflow-hidden rounded-2xl border border-default bg-default shadow-xl shadow-black/5 dark:shadow-black/40"
  >
    <div class="border-b border-default p-2">
      <UTabs
        :model-value="modeValue"
        :items="modes"
        :content="false"
        variant="pill"
        size="sm"
        color="neutral"
        :ui="{
          list: 'overflow-x-auto',
          trigger: 'flex-1 min-w-max',
          leadingIcon: 'max-sm:!hidden'
        }"
        @update:model-value="switchMode"
      />
    </div>

    <div
      class="calendar-hero__stage flex min-h-[29rem] items-center justify-center bg-elevated/50 bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] [background-size:16px_16px] px-4 py-8"
    >
      <ClientOnly>
        <FunctionalCalendar
          :key="`${modeValue}-${isDark}`"
          v-model="value"
          v-bind="mode.props"
          :style="{ width: `${mode.width}px`, maxWidth: '100%' }"
          :is-dark="isDark"
        />
        <template #fallback>
          <div
            class="h-96 w-full max-w-[28.75rem] rounded-xl border border-default bg-default"
          />
        </template>
      </ClientOnly>
    </div>

    <div class="flex flex-col gap-2 border-t border-default px-4 py-3">
      <p
        class="calendar-hero__value min-h-5 text-sm text-highlighted"
        aria-live="polite"
      >
        {{ summary }}
      </p>
      <code class="calendar-hero__code font-mono text-xs text-muted">
        <span class="text-highlighted">&lt;FunctionalCalendar</span>
        v-model="value"
        <template v-for="attr in mode.attrs.split(' ')" :key="attr">
          {{ ' '
          }}<span class="whitespace-nowrap text-primary">{{ attr }}</span>
        </template>
        {{ ' ' }}<span class="text-highlighted">/&gt;</span>
      </code>
    </div>
  </div>
</template>
