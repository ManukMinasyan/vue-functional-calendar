---
title: "Locale and labels"
description: "Names, week start and every UI string, from the browser's Intl data."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/locale"
---
# Locale and labels

> Names, week start and every UI string, from the browser's Intl data.

## Switch the locale

The `locale` prop derives day names, month names and the first day of the week from `Intl`. Names are always Gregorian, also for locales such as `fa-IR` or `ar-SA`. Props are not reactive, so the demo re-keys the calendar when you pick a locale.

<calendar-locale-demo>

```vue
<script setup>
const locale = ref('de-DE')
</script>

<template>
  <FunctionalCalendar
    :key="locale"
    v-model="value"
    :locale="locale"
    is-date-picker
    show-week-numbers
  />
</template>
```

</calendar-locale-demo>

## Translate the interface

`labels` covers every UI string. A partial object merges over the English defaults, including `labels.presets`.

<calendar-demo :config="{"isDateRange":true,"canClearRange":true,"presets":["today","last7Days"],"locale":"fr-FR","labels":{"previousMonth":"Mois précédent","nextMonth":"Mois suivant","clearRange":"Effacer la période","quickRanges":"Périodes rapides","presets":{"today":"Aujourd'hui","last7Days":"7 derniers jours"}}}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  can-clear-range
  locale="fr-FR"
  :presets="['today', 'last7Days']"
  :labels="{
    previousMonth: 'Mois précédent',
    nextMonth: 'Mois suivant',
    clearRange: 'Effacer la période',
    quickRanges: 'Périodes rapides',
    presets: { today: 'Aujourd\'hui', last7Days: '7 derniers jours' },
  }"
/>
```

</calendar-demo>

## Override the week start

`sundayStart` beats the locale. Use it to force Sunday or Monday.

<calendar-demo :config="{"isDatePicker":true,"locale":"de-DE","sundayStart":true}">

```vue
<FunctionalCalendar v-model="value" is-date-picker locale="de-DE" sundayStart />
```

</calendar-demo>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
