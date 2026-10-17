---
title: "Selection modes"
description: "Choose what users pick, and read the value back."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/selection-modes"
---
# Selection modes

> Choose what users pick, and read the value back.

Four props decide what a click does. With none of them set, the calendar only displays dates and still emits `dayClicked`.

<calendar-demo :config="{"isDateRange":true,"isMultipleDateRange":true,"canClearRange":true}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  is-multiple-date-range
  can-clear-range
/>
```

</calendar-demo>

## The four modes

<table>
<thead>
  <tr>
    <th>
      Mode
    </th>
    
    <th>
      Props
    </th>
    
    <th>
      Read from the value
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Single date
    </td>
    
    <td>
      <code>
        isDatePicker
      </code>
    </td>
    
    <td>
      <code>
        selectedDate
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Multiple dates
    </td>
    
    <td>
      <code>
        isMultipleDatePicker
      </code>
    </td>
    
    <td>
      <code>
        selectedDates
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Range
    </td>
    
    <td>
      <code>
        isDateRange
      </code>
    </td>
    
    <td>
      <code>
        dateRange.start
      </code>
      
       and <code>
        dateRange.end
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Several ranges
    </td>
    
    <td>
      <code>
        isDateRange
      </code>
      
       and <code>
        isMultipleDateRange
      </code>
    </td>
    
    <td>
      <code>
        multipleDateRange
      </code>
    </td>
  </tr>
</tbody>
</table>

## Range rules

- The first click sets the start and the second sets the end.
- Clicking a date on or before the start makes it the new start, and the old start becomes the end.
- A click after a complete range starts a new one.
- `selectedDaysCount` fires when both ends are set. Its payload is the difference in days, so the 1st to the 3rd gives `2`.
- `minSelDays` and `maxSelDays` stretch or cut a range to fit.
- `canClearRange` adds a clear button.

With several ranges, each completed range is added to `multipleDateRange`, and each range end shows its number. Focus a range day and press Delete or Backspace to remove that range, or click the small cross on its end.

## Multiple dates

Clicking a selected date removes it. Each entry in `selectedDates` is `{ date, dateTime, hour, minute }`.

See [examples](https://manukminasyan.github.io/vue-functional-calendar/examples/selection-modes) for every mode, and [the bound value](https://manukminasyan.github.io/vue-functional-calendar/getting-started/usage#the-bound-value) for the object shape.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
