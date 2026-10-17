---
title: "Marking"
description: "Mark dates and ranges, and show week numbers."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/marking"
---
# Marking

> Mark dates and ranges, and show week numbers.

<calendar-demo :config="{"isDatePicker":true,"newCurrentDate":"2026-10-01","markedDates":["6/10/2026","21/10/2026"],"markedDateRange":{"start":"12/10/2026","end":"16/10/2026"},"showWeekNumbers":true}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  show-week-numbers
  :marked-dates="['6/10/2026', '21/10/2026']"
  :marked-date-range="{ start: '12/10/2026', end: '16/10/2026' }"
/>
```

</calendar-demo>

## Marked dates

`markedDates` takes dates in `dateFormat`. To add your own class to a day, pass objects instead of strings.

```vue
<FunctionalCalendar
  :marked-dates="[
    { date: '5/10/2026', class: 'holiday' },
    { date: '12/10/2026', class: 'birthday' },
  ]"
/>
```

The class lands on the day cell, next to the `vfc-*` classes. The [examples](https://manukminasyan.github.io/vue-functional-calendar/examples/marking) show it live.

## Marked ranges

`markedDateRange` takes `{ start, end }`. Set one side to `false` to mark everything after the start or before the end. Pass an array of `{ start, end }` to mark several spans.

```vue
<FunctionalCalendar :marked-date-range="{ start: '12/10/2026', end: false }" />
<FunctionalCalendar :marked-date-range="[{ start: '1/10/2026', end: '3/10/2026' }, { start: '9/10/2026', end: '12/10/2026' }]" />
```

## Week numbers

`showWeekNumbers` adds a column. Each number is the ISO week of that row's Thursday, counted from the first day of the week the calendar uses. `borderColor` sets the color of the column border.

## Today

Today gets the `vfc-today` class and a small marker in the `--vfc-today` color.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
