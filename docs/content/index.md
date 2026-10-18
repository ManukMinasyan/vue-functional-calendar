---
seo:
  title: Vue Functional Calendar for Vue 3
  description: Lightweight calendar and datepicker component for Vue 3. Date picker, date range with presets, multiple calendars, time picker, keyboard support, dark mode and Intl locales.
  ogImage: https://manukminasyan.github.io/vue-functional-calendar/img/calendar-preview.png
---

::u-page-hero
---
orientation: horizontal
ui:
  container: 'lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] xl:gap-16 py-16 sm:py-24 lg:py-28'
  title: 'text-4xl sm:text-6xl'
  description: 'max-w-xl'
---
#headline
  :::u-button
  ---
  color: neutral
  variant: subtle
  size: sm
  to: /community/changelog
  trailing-icon: i-lucide-arrow-right
  class: rounded-full
  ---
  3.1 is out, built for Vue 3
  :::

#title
Vue Functional [Calendar]{.text-primary}

#description
A lightweight calendar and datepicker for Vue 3. Pick single dates, ranges with presets, several months or a time, with keyboard support, dark mode and Intl locales built in. No runtime dependencies.

#links
  :::u-button
  ---
  size: xl
  to: /getting-started/installation
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::install-command
  :::

#default
  :::calendar-hero
  :::
::

::u-page-section
#title
Why Vue Functional Calendar?

#links
  :::u-button
  ---
  color: neutral
  variant: outline
  size: lg
  to: /examples/selection-modes
  trailing-icon: i-lucide-arrow-right
  ---
  Browse the examples
  :::

#features
  :::u-page-feature
  ---
  icon: i-lucide-calendar-days
  ---
  #title
  Date picker

  #description
  Pick one date or several, inline or in a modal behind a typeable input.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-calendar-range
  ---
  #title
  Ranges and presets

  #description
  Select one range or many, with minimum and maximum lengths and one-click presets.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-columns-2
  ---
  #title
  Multiple calendars

  #description
  Show two or more months side by side, linked or independent.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-clock
  ---
  #title
  Time picker

  #description
  Add hours and minutes to a single date, a range or several dates.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  Theming and dark mode

  #description
  Restyle everything with --vfc-* custom properties, in light and dark.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-keyboard
  ---
  #title
  Keyboard and ARIA

  #description
  Arrow-key navigation, a labeled date grid and managed focus.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-languages
  ---
  #title
  Intl locales

  #description
  Day names, month names and week start from the browser, plus labels for every string.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-puzzle
  ---
  #title
  Slots

  #description
  Replace the day cell, arrows, footer, clear button and inputs.
  :::

::

::u-page-section
---
orientation: horizontal
---
#title
Up and running in a minute

#description
Import the component and its stylesheet, bind a model, and pick a mode with one prop. Every string, color and slot is yours to change later.

#links
  :::u-button
  ---
  size: lg
  to: /getting-started/usage
  trailing-icon: i-lucide-arrow-right
  ---
  Read the usage guide
  :::

  :::u-button
  ---
  color: neutral
  variant: ghost
  size: lg
  to: /essentials/props
  ---
  All props
  :::

#default
```vue [App.vue]
<script setup>
import { ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'
import 'vue-functional-calendar/style.css'

const calendar = ref({})
</script>

<template>
  <FunctionalCalendar
    v-model="calendar"
    is-date-range
    presets
    can-clear-range
  />
</template>
```
::
