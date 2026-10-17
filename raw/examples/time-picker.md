---
title: "Time picker"
description: "Add hours and minutes to a date, a range or several dates."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/time-picker"
---
# Time picker

> Add hours and minutes to a date, a range or several dates.

Set `withTimePicker`. After you choose a date, the calendar swaps to two lists, one for hours and one for minutes. Use the arrow keys inside a list and press Enter to choose. Escape returns to the calendar.

## Date with time in a modal input

`displayTimeInput` adds the time to the input text. A time in `dateFormat` (`HH:MM`, `HH:mm`, `hh:MM` or `hh:mm`) sets how it prints.

<calendar-demo :config="{"isDatePicker":true,"isModal":true,"withTimePicker":true,"displayTimeInput":true,"dateFormat":"yyyy-mm-dd hh:mm"}" :height="460">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  is-modal
  with-time-picker
  display-time-input
  date-format="yyyy-mm-dd hh:mm"
/>
```

</calendar-demo>

## Range with a time at each end

For a range, the time picker shows both ends. Click the start or the end date to choose which one you edit.

<calendar-demo :config="{"isDateRange":true,"withTimePicker":true}">

```vue
<FunctionalCalendar v-model="value" is-date-range with-time-picker />
```

</calendar-demo>

## Limit the hours and minutes

`activeHours` and `activeMinutes` list the values users can pick.

<calendar-demo :config="{"isDatePicker":true,"withTimePicker":true,"activeHours":[9,10,11,12,13,14,15,16,17],"activeMinutes":[0,15,30,45]}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  with-time-picker
  :active-hours="[9, 10, 11, 12, 13, 14, 15, 16, 17]"
  :active-minutes="[0, 15, 30, 45]"
/>
```

</calendar-demo>

## Several dates with their own times

Each date in `selectedDates` keeps its own `hour` and `minute`.

<calendar-demo :config="{"isMultipleDatePicker":true,"withTimePicker":true}">

```vue
<FunctionalCalendar v-model="value" is-multiple-date-picker with-time-picker />
```

</calendar-demo>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
