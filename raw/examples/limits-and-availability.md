---
title: "Limits and availability"
description: "Block dates, weekdays and spans, or allow only a list of dates."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/limits-and-availability"
---
# Limits and availability

> Block dates, weekdays and spans, or allow only a list of dates.

Dates use the `dateFormat` of the calendar, `dd/mm/yyyy` by default. Day and month may carry a leading zero.

## Limit to a span

`limits` takes a `min` and a `max`. Days outside are disabled, and the arrows stop at the edge months.

<calendar-demo :config="{"isDatePicker":true,"newCurrentDate":"2026-10-01","limits":{"min":"8/10/2026","max":"24/10/2026"}}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  :new-current-date="new Date(2026, 9, 1)"
  :limits="{ min: '8/10/2026', max: '24/10/2026' }"
/>
```

</calendar-demo>

## Minimum and maximum range length

`minSelDays` and `maxSelDays` bound the length of a range. A range that is too short is stretched to the minimum, and one that is too long is cut at the maximum.

<calendar-demo :config="{"isDateRange":true,"minSelDays":3,"maxSelDays":6}">

```vue
<FunctionalCalendar v-model="value" is-date-range :min-sel-days="3" :max-sel-days="6" />
```

</calendar-demo>

## Disable weekdays

`disabledDayNames` takes the names from `dayNames`, `Mo` to `Su` by default.

<calendar-demo :config="{"isDatePicker":true,"disabledDayNames":["Sa","Su"]}">

```vue
<FunctionalCalendar v-model="value" is-date-picker :disabled-day-names="['Sa', 'Su']" />
```

</calendar-demo>

## Disable dates

`disabledDates` takes dates and two keywords, `beforeToday` and `afterToday`.

<calendar-demo :config="{"isDatePicker":true,"disabledDates":["beforeToday","30/10/2026"]}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  :disabled-dates="['beforeToday', '30/10/2026']"
/>
```

</calendar-demo>

## Allow only some dates

`enabledDates` is the one prop the calendar watches, so you can change the list while it is on screen.

<calendar-enabled-dates-demo>

```vue
<FunctionalCalendar v-model="value" is-date-picker :enabled-dates="enabledDates" />
```

</calendar-enabled-dates-demo>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
