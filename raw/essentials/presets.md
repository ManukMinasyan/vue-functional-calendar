---
title: "Presets"
description: "Quick ranges for date ranges and date pickers."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/presets"
---
# Presets

> Quick ranges for date ranges and date pickers.

`presets` adds a column of buttons that select a range in one click.

<calendar-demo :config="{"isDateRange":true,"canClearRange":true,"presets":true}">

```vue
<FunctionalCalendar v-model="value" is-date-range can-clear-range :presets="true" />
```

</calendar-demo>

## Where they show

Presets render on calendars with `isDateRange` or `isDatePicker`. They do not render for `isMultipleDatePicker`, over the time picker, or when `hiddenElements` contains `presets`. On a date picker, each preset selects its start date. With `isMultipleDateRange`, a preset adds a range.

## Built-in presets

`presets: true` shows all six, in this order:

<table>
<thead>
  <tr>
    <th>
      Key
    </th>
    
    <th>
      Range
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        today
      </code>
    </td>
    
    <td>
      Today
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        yesterday
      </code>
    </td>
    
    <td>
      Yesterday
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        last7Days
      </code>
    </td>
    
    <td>
      The last 7 days, including today
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        last30Days
      </code>
    </td>
    
    <td>
      The last 30 days, including today
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        thisMonth
      </code>
    </td>
    
    <td>
      The 1st to the last day of this month
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        lastMonth
      </code>
    </td>
    
    <td>
      The 1st to the last day of last month
    </td>
  </tr>
</tbody>
</table>

Pass a list of keys to choose and order them. Unknown keys are skipped.

## Width

The presets sit beside the grid when the calendar is at least about 430px wide, and above it when it is narrower. A calendar sizes to its content, and WebKit measures that content smaller than Chromium does. Give the calendar a width, such as `style="width: 460px; max-width: 100%"`, to get the same layout in every browser.

```vue
<FunctionalCalendar is-date-range :presets="['today', 'last7Days', 'thisMonth']" />
```

## Custom ranges

A custom preset is an object with a `label` and a `range` function that returns `{ start, end }` as `Date` objects. Mix them with keys in any order.

```vue
<script setup>
const presets = [
  'today',
  {
    label: 'Next 14 days',
    range: () => {
      const start = new Date()
      const end = new Date()
      end.setDate(end.getDate() + 13)
      return { start, end }
    },
  },
]
</script>

<template>
  <FunctionalCalendar v-model="value" is-date-range :presets="presets" />
</template>
```

The calendar calls `range` each time it needs the preset, so "today" stays correct after midnight. Only the day of a returned date counts, not its time. A preset is skipped if `range` throws, returns something that is not two valid dates, or returns an end before the start.

<calendar-presets-demo>



</calendar-presets-demo>

## When a preset is disabled

A preset is disabled when its whole range does not fit the rules of the calendar:

- it is shorter than `minSelDays` or longer than `maxSelDays` (ranges only),
- it starts before `limits.min` or ends after `limits.max`,
- it contains a date in `disabledDates`, including `beforeToday` and `afterToday`,
- it contains a day of week from `disabledDayNames`,
- it contains a date outside `enabledDates`.

A disabled preset keeps `aria-disabled="true"`, stays focusable, and does nothing when clicked. For a date picker, only the start date is checked.

## Events

A preset emits `update:modelValue` once, with the final value. It emits no `dayClicked` and no `choseDay`, because no day was clicked. If the start month is not on screen, the calendar moves there and emits `changedMonth`, and `changedYear` if the year changes. `selectedDaysCount` still fires for a range.

In a modal with `isAutoCloseable`, picking a preset closes the calendar and returns focus to the input.

## Labels and names

`labels.presets` translates the buttons, one key at a time. `labels.quickRanges` names the group for screen readers.

```vue
<FunctionalCalendar
  is-date-range
  :presets="true"
  :labels="{ quickRanges: 'Schnellauswahl', presets: { today: 'Heute' } }"
/>
```

## States

The button of the preset that matches the current selection has `aria-pressed="true"`. The time part of the selection is ignored in that check.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
