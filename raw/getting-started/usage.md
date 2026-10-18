---
title: "Usage"
description: "Render a calendar, read the bound value and configure it."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/getting-started/usage"
---
# Usage

> Render a calendar, read the bound value and configure it.

## A first calendar

Bind the calendar with `v-model`. Without a selection mode it only displays dates, so turn one on.

<calendar-demo :config="{"isDatePicker":true}">

```vue
<script setup>
import { ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'
import 'vue-functional-calendar/style.css'

const value = ref({})
</script>

<template>
  <FunctionalCalendar v-model="value" is-date-picker />
</template>
```

</calendar-demo>

## Selection modes

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      What users pick
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        isDatePicker
      </code>
    </td>
    
    <td>
      One date.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isMultipleDatePicker
      </code>
    </td>
    
    <td>
      Any number of single dates.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDateRange
      </code>
    </td>
    
    <td>
      One range with a start and an end.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDateRange
      </code>
      
       with <code>
        isMultipleDateRange
      </code>
    </td>
    
    <td>
      Several ranges.
    </td>
  </tr>
</tbody>
</table>

## The bound value

The calendar keeps its whole state in one object. Which keys matter depends on the mode.

<table>
<thead>
  <tr>
    <th>
      Mode
    </th>
    
    <th>
      Where the value lives
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Date picker
    </td>
    
    <td>
      <code>
        selectedDate
      </code>
      
      , a string in <code>
        dateFormat
      </code>
      
      . With the time picker, also <code>
        selectedDateTime
      </code>
      
      , <code>
        selectedHour
      </code>
      
       and <code>
        selectedMinute
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Multiple date picker
    </td>
    
    <td>
      <code>
        selectedDates
      </code>
      
      , a list of <code>
        { date, dateTime, hour, minute }
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Date range
    </td>
    
    <td>
      <code>
        dateRange.start
      </code>
      
       and <code>
        dateRange.end
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Multiple date range
    </td>
    
    <td>
      <code>
        multipleDateRange
      </code>
      
      , a list of <code>
        { start, end }
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`currentDate` is a `Date` in the month on display. `selectedDatesItem` is the text in the tags input.

The calendar edits the object it receives and emits that same object. Typed dates, time picker changes and the clear button update it in place, without an `update:modelValue` event. A bound plain object that lacks calendar keys, such as `{}`, stays your object: the calendar fills in the missing keys when it mounts. Assigning a new `{}` object later clears the selection. A readonly or frozen object, a non-plain value, and an object holding only `multipleDateRange` are read into the calendar's own state and are never written to. If you want every key from the start, begin with a full model:

```js
const value = ref({
  currentDate: new Date(),
  selectedDate: false,
  selectedDateTime: false,
  selectedHour: '00',
  selectedMinute: '00',
  selectedDatesItem: '',
  selectedDates: [],
  dateRange: { start: '', end: '' },
  multipleDateRange: [],
})
```

Date strings use `dateFormat`, which is `dd/mm/yyyy hh:MM` by default. Day and month are not padded, so you read `5/3/2026`.

## Listen to events

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  @choseDay="day => console.log(day.date)"
  @selectedDaysCount="count => console.log(count)"
  @changedMonth="date => console.log(date)"
/>
```

See [events](https://manukminasyan.github.io/vue-functional-calendar/essentials/events) for every payload.

## Configure with props or `configs`

Pass props one by one, or group them in a `configs` object. When you pass `configs`, the calendar reads its settings from there and ignores the matching props.

```vue
<FunctionalCalendar
  v-model="value"
  :configs="{ isDateRange: true, dateFormat: 'yyyy-mm-dd', showWeekNumbers: true }"
/>
```

## Props are read once

The calendar reads most props when it is created. Changing `isDateRange` or `locale` afterwards has no effect. Re-key the component to rebuild it.

```vue
<FunctionalCalendar :key="locale" :locale="locale" is-date-picker v-model="value" />
```

`modelValue` and the data props are watched, so changing those works on a live calendar. The data props are `markedDates`, `markedDateRange`, `disabledDates`, `enabledDates`, `disabledDayNames`, `limits`, `calendarsCount` and `isDark`. The same keys inside `configs` are watched too.

## Call methods

Use a template ref to move the calendar from code.

```vue
<script setup>
const calendar = ref(null)
</script>

<template>
  <FunctionalCalendar ref="calendar" v-model="value" />
  <button @click="calendar.PreMonth()">Previous</button>
  <button @click="calendar.NextMonth()">Next</button>
  <button @click="calendar.ChooseDate('today')">Today</button>
</template>
```

`PreMonth`, `NextMonth`, `PreYear` and `NextYear` take an optional calendar index. `ChooseDate` takes a date in `dateFormat` or the word `today`, and moves the calendar there. It refuses a month outside `limits`.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
