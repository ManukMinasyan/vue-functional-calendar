<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const locales = ['en-US', 'de-DE', 'fr-FR', 'ar-EG', 'ja-JP', 'fa-IR']

const colorMode = useColorMode()
const locale = ref('de-DE')
const value = ref(calendarModel())
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <DemoFrame :value="value">
    <template #demo>
      <div class="flex w-full flex-col items-center gap-4">
        <div class="flex flex-wrap justify-center gap-2" role="group" aria-label="Locale">
          <UButton
            v-for="item in locales"
            :key="item"
            size="sm"
            :variant="item === locale ? 'solid' : 'outline'"
            :color="item === locale ? 'primary' : 'neutral'"
            :aria-pressed="item === locale"
            :label="item"
            @click="locale = item"
          />
        </div>
        <ClientOnly>
          <FunctionalCalendar
            :key="`${locale}:${isDark}`"
            v-model="value"
            :locale="locale"
            :is-date-picker="true"
            :show-week-numbers="true"
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
