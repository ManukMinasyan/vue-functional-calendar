---
title: "Time picker"
description: "Add hours and minutes to a date or a range."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/time-picker"
---
# Time picker

> Add hours and minutes to a date or a range.

Set `withTimePicker`. After you choose a date, the calendar swaps to an hour list and a minute list.

<calendar-demo :config="{"isDatePicker":true,"withTimePicker":true,"displayTimeInput":true}">

```vue
<FunctionalCalendar v-model="value" is-date-picker with-time-picker />
```

</calendar-demo>

The time picker does not open with `isMultipleDateRange`, and those ranges hold plain dates without a time.

## Where the time lives

<table>
<thead>
  <tr>
    <th>
      Mode
    </th>
    
    <th>
      Time in the value
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
        selectedHour
      </code>
      
      , <code>
        selectedMinute
      </code>
      
       and <code>
        selectedDateTime
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Range
    </td>
    
    <td>
      The time is part of <code>
        dateRange.start
      </code>
      
       and <code>
        dateRange.end
      </code>
      
      , as <code>
        d/m/yyyy hh:mm
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Multiple dates
    </td>
    
    <td>
      <code>
        hour
      </code>
      
       and <code>
        minute
      </code>
      
       on each entry of <code>
        selectedDates
      </code>
    </td>
  </tr>
</tbody>
</table>

## Keyboard

Each list is a listbox. Use ArrowUp and ArrowDown to move, Home and End to jump to the ends, and Enter or Space to choose a value. The close button and the Escape key return to the calendar.

## Props

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
        displayTimeInput
      </code>
    </td>
    
    <td>
      Add the time to the text of a single date input.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dateFormat
      </code>
    </td>
    
    <td>
      A time part such as <code>
        hh:mm
      </code>
      
      . The valid forms are <code>
        HH:MM
      </code>
      
      , <code>
        HH:mm
      </code>
      
      , <code>
        hh:MM
      </code>
      
       and <code>
        hh:mm
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeHours
      </code>
    </td>
    
    <td>
      Hours users can pick, from <code>
        0
      </code>
      
       to <code>
        23
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeMinutes
      </code>
    </td>
    
    <td>
      Minutes users can pick, from <code>
        0
      </code>
      
       to <code>
        59
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

For a range, click the start or the end date at the top of the picker to choose which one you edit.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
