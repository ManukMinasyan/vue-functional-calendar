---
title: "Marking and layout"
description: "Mark dates and ranges, show week numbers, and hide parts of the calendar."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/marking"
---
# Marking and layout

> Mark dates and ranges, show week numbers, and hide parts of the calendar.

## Marked dates

`markedDates` outlines the dates in the list.

<calendar-demo :config="{"isDatePicker":true,"newCurrentDate":"2026-10-01","markedDates":["6/10/2026","9/10/2026","10/10/2026","21/10/2026"]}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  :new-current-date="new Date(2026, 9, 1)"
  :marked-dates="['6/10/2026', '9/10/2026', '10/10/2026', '21/10/2026']"
/>
```

</calendar-demo>

## Marked dates with your own class

Pass objects to add a class to each day, then style that class. The class lands on the day cell.

<calendar-marked-demo>

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  :marked-dates="[
    { date: '5/10/2026', class: 'demo-holiday' },
    { date: '12/10/2026', class: 'demo-birthday' },
  ]"
/>

<style>
.demo-holiday { box-shadow: inset 0 0 0 2px #dc2626; }
.demo-birthday { box-shadow: inset 0 0 0 2px #16a34a; }
</style>
```

</calendar-marked-demo>

## Marked range

`markedDateRange` highlights a span. Leave one end `false` to mark everything after the start or before the end. Pass an array to mark several spans.

<calendar-demo :config="{"isDatePicker":true,"newCurrentDate":"2026-10-01","markedDateRange":{"start":"12/10/2026","end":"20/10/2026"}}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  :new-current-date="new Date(2026, 9, 1)"
  :marked-date-range="{ start: '12/10/2026', end: '20/10/2026' }"
/>
```

</calendar-demo>

## Week numbers

`showWeekNumbers` adds a column with the ISO week number of each row's Thursday. `borderColor` colors the column border.

<calendar-demo :config="{"isDatePicker":true,"showWeekNumbers":true,"borderColor":"#d946ef"}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  show-week-numbers
  border-color="#d946ef"
/>
```

</calendar-demo>

## Hide parts of the calendar

`hiddenElements` takes any of `dayNames`, `leftAndRightDays`, `month` and `presets`. This example hides the days of the neighbor months.

<calendar-demo :config="{"isDatePicker":true,"hiddenElements":["leftAndRightDays"]}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  :hidden-elements="['leftAndRightDays']"
/>
```

</calendar-demo>

## Title and arrow position

`titlePosition` takes `left`, `center` or `right`. `arrowsPosition` takes `space-between`, `left` or `right`.

<calendar-demo :config="{"isDatePicker":true,"titlePosition":"left","arrowsPosition":"right"}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  title-position="left"
  arrows-position="right"
/>
```

</calendar-demo>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
