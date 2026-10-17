---
title: "Limits and availability"
description: "Disable dates, weekdays and spans, or allow a list."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/limits-and-availability"
---
# Limits and availability

> Disable dates, weekdays and spans, or allow a list.

<calendar-demo :config="{"isDatePicker":true,"newCurrentDate":"2026-10-01","limits":{"min":"8/10/2026","max":"24/10/2026"},"disabledDayNames":["We"],"disabledDates":["16/10/2026"]}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  :limits="{ min: '8/10/2026', max: '24/10/2026' }"
  :disabled-day-names="['We']"
  :disabled-dates="['16/10/2026']"
/>
```

</calendar-demo>

Dates use `dateFormat`, `dd/mm/yyyy` by default, and need no leading zero.

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Use
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        limits
      </code>
    </td>
    
    <td>
      <code>
        { min, max }
      </code>
      
      . Days outside are disabled and the arrows stop at the edge months.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabledDates
      </code>
    </td>
    
    <td>
      A list of dates, plus the keywords <code>
        beforeToday
      </code>
      
       and <code>
        afterToday
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enabledDates
      </code>
    </td>
    
    <td>
      If it has entries, only those dates (and keywords) can be picked.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabledDayNames
      </code>
    </td>
    
    <td>
      Weekday names to disable. They must match <code>
        dayNames
      </code>
      
      , <code>
        Mo
      </code>
      
       to <code>
        Su
      </code>
      
       by default.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        minSelDays
      </code>
      
      , <code>
        maxSelDays
      </code>
    </td>
    
    <td>
      Bounds for the length of a range.
    </td>
  </tr>
</tbody>
</table>

## Names and locales

With a `locale`, `disabledDayNames` still matches the English two letter names `Mo` to `Su`, as well as the localized ones.

## Reactive list

`enabledDates` is watched. Swap the list to change what is available on a calendar that is on screen. The other props are read once.

## Disabled days and keyboard

A disabled day has `aria-disabled="true"` and stays reachable with the arrow keys. Pressing Enter on it does not select it.

## Presets

A [preset](https://manukminasyan.github.io/vue-functional-calendar/essentials/presets#when-a-preset-is-disabled) is disabled when its range breaks one of these rules.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
