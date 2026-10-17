---
title: "Selection modes"
description: "Pick one date, a range, several dates or several ranges."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/selection-modes"
---
# Selection modes

> Pick one date, a range, several dates or several ranges.

Every example is live. Click a day and read the bound value under the calendar. The code under each value is what runs above it.

## Single date

Set `isDatePicker`, then read `selectedDate`.

<calendar-demo :config="{"isDatePicker":true}">

```vue
<FunctionalCalendar v-model="value" is-date-picker />
```

</calendar-demo>

## Date range

Set `isDateRange`. The first click sets the start, the second sets the end. Hover shows the range before you commit.

<calendar-demo :config="{"isDateRange":true,"canClearRange":true}">

```vue
<FunctionalCalendar v-model="value" is-date-range can-clear-range />
```

</calendar-demo>

## Multiple dates

Set `isMultipleDatePicker`. Click a selected day again to remove it.

<calendar-demo :config="{"isMultipleDatePicker":true}">

```vue
<FunctionalCalendar v-model="value" is-multiple-date-picker />
```

</calendar-demo>

## Multiple date ranges

Add `isMultipleDateRange` to a range picker to collect several ranges. Focus a range day and press Delete or Backspace to remove that range.

<calendar-demo :config="{"isDateRange":true,"isMultipleDateRange":true,"canClearRange":true}" :initial="{"multipleDateRange":[{"start":"3/10/2026","end":"9/10/2026"}]}">

```vue
<script setup>
const value = ref({
  multipleDateRange: [{ start: '3/10/2026', end: '9/10/2026' }]
})
</script>

<template>
  <FunctionalCalendar
    v-model="value"
    is-date-range
    is-multiple-date-range
    can-clear-range
  />
</template>
```

</calendar-demo>

## Pick the month and year

Turn on `changeMonthFunction` and `changeYearFunction` to click the title and jump. `changeYearStep` sets how far the year list pages.

<calendar-demo :config="{"isDatePicker":true,"changeMonthFunction":true,"changeYearFunction":true}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  change-month-function
  change-year-function
/>
```

</calendar-demo>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
