---
title: "Usage"
description: "Render a calendar, read the selected value and configure it with props or a configs object."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/v2/getting-started/usage"
---
# Usage

> Render a calendar, read the selected value and configure it with props or a configs object.

## Basic calendar

Bind the calendar with `v-model`. The bound object holds the whole calendar state.

```vue
<template>
    <FunctionalCalendar v-model="calendarData" />
</template>

<script>
import { FunctionalCalendar } from 'vue-functional-calendar'

export default {
    components: { FunctionalCalendar },
    data() {
        return {
            calendarData: {}
        }
    }
}
</script>
```

Without a selection mode, the calendar only displays dates. Turn on one mode to let users pick.

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
        is-date-picker
      </code>
    </td>
    
    <td>
      One date.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        is-multiple-date-picker
      </code>
    </td>
    
    <td>
      Any number of single dates.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        is-date-range
      </code>
    </td>
    
    <td>
      One range with a start and an end.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        is-multiple-date-range
      </code>
    </td>
    
    <td>
      Several ranges, together with <code>
        is-date-range
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

```vue
<FunctionalCalendar v-model="calendarData" :is-date-range="true" />
```

## Read the selected value

`v-model` receives an object. Which keys matter depends on the mode.

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
        date-format
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
      
      , an array of <code>
        { date, dateTime, hour, minute }
      </code>
      
       objects.
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
      
      , both strings.
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
      
      , an array of <code>
        { start, end }
      </code>
      
       objects.
    </td>
  </tr>
</tbody>
</table>

`currentDate` is a `Date` for the month on display.

```js
{
    currentDate: new Date(2026, 9, 17),
    selectedDate: false,
    selectedDateTime: false,
    selectedHour: '00',
    selectedMinute: '00',
    selectedDatesItem: '',
    selectedDates: [],
    dateRange: { start: '3/10/2026', end: '9/10/2026' },
    multipleDateRange: []
}
```

Dates follow `date-format`, which defaults to `dd/mm/yyyy hh:MM`. Values the calendar produces drop the time part unless the time picker is on, so `selectedDate` reads `17/10/2026`. Days and months have no leading zero.

## Configure with props

Pass any option as a prop. Use kebab-case in templates.

```vue
<FunctionalCalendar
    v-model="calendarData"
    :is-date-picker="true"
    :sunday-start="true"
    date-format="dd/mm/yyyy"
    @changedMonth="onChangedMonth"
    @changedYear="onChangedYear"
/>
```

## Configure with an object

The `configs` prop takes the same options as one object. This suits shared or stored settings.

```vue
<template>
    <FunctionalCalendar v-model="calendarData" :configs="calendarConfigs" />
</template>

<script>
export default {
    data() {
        return {
            calendarData: {},
            calendarConfigs: {
                sundayStart: false,
                dateFormat: 'dd/mm/yyyy',
                isDatePicker: false,
                isDateRange: true
            }
        }
    }
}
</script>
```

<warning>

When `configs` is set, the calendar skips the props merge, so every option prop passed next to `configs` is ignored. Four options are also read straight from the prop in parts of the component: `isMultipleDateRange`, `showWeekNumbers`, `isSeparately` and `changeYearStep`. Set each of these in `configs` and as a prop.

</warning>

Option precedence, lowest to highest: built-in defaults, options given to `Vue.use`, then `configs` or individual props.

## Next

Browse the full [props reference](https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/props), the [events](https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/events), the [slots](https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/slots) and some [examples](https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/examples).


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/v2/sitemap.md) for all pages.
