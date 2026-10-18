---
title: "Locale and labels"
description: "Derive names and week start from Intl, and translate every UI string."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/locale"
---
# Locale and labels

> Derive names and week start from Intl, and translate every UI string.

Pass a BCP 47 tag to `locale`. The calendar reads day names, month names and the first day of the week from `Intl`.

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

## What a locale sets

<table>
<thead>
  <tr>
    <th>
      Setting
    </th>
    
    <th>
      From the locale
    </th>
    
    <th>
      Explicit prop that wins
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Day names
    </td>
    
    <td>
      Short weekday names
    </td>
    
    <td>
      <code>
        dayNames
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Month names
    </td>
    
    <td>
      Long month names
    </td>
    
    <td>
      <code>
        monthNames
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Short month names
    </td>
    
    <td>
      Short month names
    </td>
    
    <td>
      <code>
        shortMonthNames
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      First day of the week
    </td>
    
    <td>
      Week info of the locale
    </td>
    
    <td>
      <code>
        sundayStart
      </code>
    </td>
  </tr>
</tbody>
</table>

Underscore tags such as `de_DE` work. A malformed tag is ignored and the English defaults stay. `dateFormat` is not derived from the locale.

## Names are Gregorian

Names and dates are always Gregorian, even for locales that default to another calendar, such as `fa-IR`, `ar-SA` or `th-TH`. The month is named with its Gregorian name and the year is the Gregorian year. The `aria-label` of each day uses the same names.

## Week start

The first day of the week comes from `Intl.Locale` week info. The calendar uses `getWeekInfo()` where it exists, then the `weekInfo` property. Where the engine has neither, it falls back to a table of regions that start the week on Sunday, Saturday or Friday, and uses Monday for the rest. A first day of `7` counts as Sunday.

`sundayStart` overrides all of this. `sundayStart: true` starts on Sunday, `false` on Monday.

Week numbers follow the same first day.

## Labels

`labels` covers every string the calendar writes. Pass only the ones you want to change. The rest keep their English text.

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  can-clear-range
  :presets="true"
  :labels="{
    clearRange: 'Effacer la période',
    quickRanges: 'Périodes rapides',
    presets: { today: 'Aujourd\'hui' },
  }"
/>
```

<table>
<thead>
  <tr>
    <th>
      Label
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      Used for
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        previousMonth
      </code>
      
      , <code>
        nextMonth
      </code>
    </td>
    
    <td>
      Previous month, Next month
    </td>
    
    <td>
      Arrow buttons
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previousYear
      </code>
      
      , <code>
        nextYear
      </code>
    </td>
    
    <td>
      Previous year, Next year
    </td>
    
    <td>
      Month picker arrows
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        previousYears
      </code>
      
      , <code>
        nextYears
      </code>
    </td>
    
    <td>
      Previous years, Next years
    </td>
    
    <td>
      Year picker arrows
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        calendar
      </code>
    </td>
    
    <td>
      Calendar
    </td>
    
    <td>
      Name of the modal dialog
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        close
      </code>
    </td>
    
    <td>
      Close
    </td>
    
    <td>
      Time picker close button
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        clearRange
      </code>
      
      , <code>
        clearRanges
      </code>
    </td>
    
    <td>
      Clear range, Clear ranges
    </td>
    
    <td>
      Clear button
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        startDate
      </code>
      
      , <code>
        endDate
      </code>
    </td>
    
    <td>
      Start date, End date
    </td>
    
    <td>
      Range input titles
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        date
      </code>
    </td>
    
    <td>
      Date
    </td>
    
    <td>
      Single input title
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        addDate
      </code>
    </td>
    
    <td>
      Add a date
    </td>
    
    <td>
      Tags input placeholder and name
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        removeDate
      </code>
    </td>
    
    <td>
      Remove
    </td>
    
    <td>
      Remove button of a tag, followed by its date
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hour
      </code>
      
      , <code>
        minute
      </code>
    </td>
    
    <td>
      Hour, Minute
    </td>
    
    <td>
      Time picker titles and lists
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        quickRanges
      </code>
    </td>
    
    <td>
      Quick ranges
    </td>
    
    <td>
      Name of the presets group
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        range
      </code>
    </td>
    
    <td>
      Range
    </td>
    
    <td>
      Suffix in the label of a day in a numbered range
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rangeStart
      </code>
      
      , <code>
        rangeEnd
      </code>
    </td>
    
    <td>
      range start, range end
    </td>
    
    <td>
      Suffix in the label of the first and last day of a range
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        today
      </code>
    </td>
    
    <td>
      Today
    </td>
    
    <td>
      Suffix in the label of today's date
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        week
      </code>
    </td>
    
    <td>
      Week
    </td>
    
    <td>
      Name of a week number, followed by the number
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        chooseMonth
      </code>
      
      , <code>
        chooseYear
      </code>
    </td>
    
    <td>
      Choose month, Choose year
    </td>
    
    <td>
      Name of the month picker and the year picker
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        presets.today
      </code>
    </td>
    
    <td>
      Today
    </td>
    
    <td>
      Preset button
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        presets.yesterday
      </code>
    </td>
    
    <td>
      Yesterday
    </td>
    
    <td>
      Preset button
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        presets.last7Days
      </code>
    </td>
    
    <td>
      Last 7 days
    </td>
    
    <td>
      Preset button
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        presets.last30Days
      </code>
    </td>
    
    <td>
      Last 30 days
    </td>
    
    <td>
      Preset button
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        presets.thisMonth
      </code>
    </td>
    
    <td>
      This month
    </td>
    
    <td>
      Preset button
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        presets.lastMonth
      </code>
    </td>
    
    <td>
      Last month
    </td>
    
    <td>
      Preset button
    </td>
  </tr>
</tbody>
</table>

`labels.presets` merges key by key, so you can translate one preset. Labels can come from the global options and `configs` too. The more specific source wins, and calendars never share labels.

## Locale and labels are read once

The calendar reads `locale` and `labels` when it is created, unlike the watched data props such as `markedDates`. To switch at runtime, re-key it:

```vue
<FunctionalCalendar :key="locale" :locale="locale" is-date-picker />
```

Re-keying keeps the bound value, so the selection survives the switch.

## Other places the locale shows

- Full date labels such as "Thursday, 15 October 2026" in `aria-label`.
- The label of each month grid.
- The weekday matching for `disabledDayNames`, which also accepts the English `Mo` to `Su`.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
