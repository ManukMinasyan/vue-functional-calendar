---
title: "Events"
description: "Every event and its payload."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/events"
---
# Events

> Every event and its payload.

<table>
<thead>
  <tr>
    <th>
      Event
    </th>
    
    <th>
      Payload
    </th>
    
    <th>
      When
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        update:modelValue
      </code>
    </td>
    
    <td>
      The calendar state object
    </td>
    
    <td>
      After a selection or a preset, and when the displayed month changes
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        opened
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      The calendar becomes visible
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closed
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      The calendar is hidden
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dayClicked
      </code>
    </td>
    
    <td>
      The day object
    </td>
    
    <td>
      Any click or Enter on a day, even a disabled one
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        choseDay
      </code>
    </td>
    
    <td>
      The day object
    </td>
    
    <td>
      A day was selected
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        selectedDaysCount
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      A range has both ends. The payload is the difference in days
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dayMouseOver
      </code>
    </td>
    
    <td>
      A date string
    </td>
    
    <td>
      The pointer or the keyboard focus moves over a day
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        changedMonth
      </code>
    </td>
    
    <td>
      <code>
        Date
      </code>
    </td>
    
    <td>
      The first visible month changed
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        changedYear
      </code>
    </td>
    
    <td>
      <code>
        Date
      </code>
    </td>
    
    <td>
      The year changed
    </td>
  </tr>
</tbody>
</table>

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  @day-clicked="day => console.log('clicked', day.date)"
  @chose-day="day => console.log('chose', day.date)"
  @selected-days-count="count => console.log(count, 'days')"
  @changed-month="date => console.log(date.getMonth() + 1)"
/>
```

Event names are camelCase in the component. In a template, `@day-clicked` and `@dayClicked` both work.

## update:modelValue

The payload is the calendar's own state object, the same reference each time. Typed dates, the time picker and the clear button change that object in place without emitting. To react to every change, watch the bound value deeply.

```js
watch(value, next => save(next), { deep: true })
```

A preset emits it once, with the final state. See [the bound value](https://manukminasyan.github.io/vue-functional-calendar/getting-started/usage#the-bound-value) for the keys.

## opened and closed

The calendar emits one of them when it mounts, with its initial state. An inline calendar is open, so it emits `opened`. A modal calendar emits `closed`. After that they fire when the modal opens or closes.

## The day object

`dayClicked` and `choseDay` receive this object. With a range and the time picker on, `date` has the suffix ` 00:00`.

<table>
<thead>
  <tr>
    <th>
      Key
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        day
      </code>
    </td>
    
    <td>
      <code>
        number
      </code>
    </td>
    
    <td>
      Day of the month
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        date
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      The date in <code>
        dateFormat
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hide
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      A day of a neighbor month, or a disabled weekday
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isToday
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      Today
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isMarked
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      Part of the selection or marked
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDateRangeStart
      </code>
      
      , <code>
        isDateRangeEnd
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      Start or end of <code>
        markedDateRange
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isMouseToLeft
      </code>
      
      , <code>
        isMouseToRight
      </code>
      
      , <code>
        isHovered
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      Range preview state
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hideLeftAndRightDays
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      A hidden neighbor day
    </td>
  </tr>
</tbody>
</table>

## Not emitted by presets

A preset emits `update:modelValue` once and no `dayClicked` or `choseDay`. See [presets](https://manukminasyan.github.io/vue-functional-calendar/essentials/presets#events).


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
