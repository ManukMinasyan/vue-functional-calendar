---
title: "Events"
description: "Events emitted by the FunctionalCalendar component and what each one passes."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/events"
---
# Events

> Events emitted by the FunctionalCalendar component and what each one passes.

Listen with `@name` in the template. Event names are camelCase, so write `@dayClicked` or `v-on:dayClicked`. In-DOM templates fold attribute names to lowercase and miss them, so use string templates or single-file components.

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
      Fires when
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        input
      </code>
    </td>
    
    <td>
      calendar object
    </td>
    
    <td>
      The selection or the displayed month changes. This powers <code>
        v-model
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dayClicked
      </code>
    </td>
    
    <td>
      day object
    </td>
    
    <td>
      A user clicks any day, even a disabled one or in a calendar with no selection mode.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        choseDay
      </code>
    </td>
    
    <td>
      day object
    </td>
    
    <td>
      A click changed the selection. It does not fire for disabled days, days outside <code>
        limits
      </code>
      
       or calendars with no selection mode.
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
        Number
      </code>
    </td>
    
    <td>
      A range is complete. The payload is the number of days between start and end, not counting the first day.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dayMouseOver
      </code>
    </td>
    
    <td>
      <code>
        String
      </code>
    </td>
    
    <td>
      The pointer enters a day. The payload is the day's date.
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
      The month changes through the arrows or the month picker.
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
      The year changes through the arrows or the year picker.
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
      The calendar becomes visible.
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
      The calendar hides. Only modal calendars hide.
    </td>
  </tr>
</tbody>
</table>

`opened` and `closed` also fire once on mount with the initial state. An inline calendar emits `opened`, and a modal calendar emits `closed`.

## Day object

`dayClicked` and `choseDay` pass an object like this:

```js
{
    day: 17,
    date: '17/10/2026',
    hide: false,
    isMouseToLeft: false,
    isMouseToRight: false,
    isHovered: false,
    isDateRangeStart: false,
    isDateRangeEnd: false,
    hideLeftAndRightDays: false,
    isToday: false,
    isMarked: false
}
```

With `with-time-picker` on a date range, `date` carries a time suffix such as `17/10/2026 00:00`.

## Example

```vue
<template>
    <FunctionalCalendar
        v-model="calendarData"
        :is-date-range="true"
        @selectedDaysCount="days = $event"
        @changedMonth="onChangedMonth"
    />
</template>

<script>
import { FunctionalCalendar } from 'vue-functional-calendar'

export default {
    components: { FunctionalCalendar },
    data() {
        return {
            calendarData: {},
            days: 0
        }
    },
    methods: {
        onChangedMonth(date) {
            console.log(date.getMonth() + 1)
        }
    }
}
</script>
```


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/v2/sitemap.md) for all pages.
