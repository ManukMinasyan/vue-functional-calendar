---
title: "Slots"
description: "Replace the day cell, navigation arrows, footer and inputs of the calendar."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/slots"
---
# Slots

> Replace the day cell, navigation arrows, footer and inputs of the calendar.

Use the `v-slot` syntax from Vue 2.6.

<table>
<thead>
  <tr>
    <th>
      Slot
    </th>
    
    <th>
      Props
    </th>
    
    <th>
      Replaces
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        default
      </code>
    </td>
    
    <td>
      <code>
        week
      </code>
      
      , <code>
        day
      </code>
    </td>
    
    <td>
      The content of each day cell.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        navigationArrowLeft
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      The previous-month arrow.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        navigationArrowRight
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      The next-month arrow.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cleaner
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      The Clear Range button in the footer.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        footer
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      Extra footer content, shown next to the cleaner.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dateRangeInputs
      </code>
    </td>
    
    <td>
      <code>
        startDate
      </code>
      
      , <code>
        endDate
      </code>
      
      , <code>
        isTypeable
      </code>
    </td>
    
    <td>
      The two inputs of a modal date range.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        datePickerInput
      </code>
    </td>
    
    <td>
      <code>
        selectedDate
      </code>
      
      , <code>
        isTypeable
      </code>
    </td>
    
    <td>
      The input of a modal date picker.
    </td>
  </tr>
</tbody>
</table>

The footer renders when `can-clear-range` is on or the `footer` slot is filled.

## Day slot

`day` is the [day object](https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/events#day-object) and `week` holds the days of the row. When you fill the slot, the default `vfc-span-day` class no longer applies to the cell. Add `always-use-default-classes` to keep it.

```vue
<FunctionalCalendar v-model="calendarData" :is-date-picker="true">
    <template v-slot:default="props">
        <div class="custom-day">
            {{ props.day.day }}
            <span v-if="props.day.isToday" class="dot"></span>
        </div>
    </template>
</FunctionalCalendar>
```

## Arrows

```vue
<FunctionalCalendar v-model="calendarData">
    <template v-slot:navigationArrowLeft>
        <span>Prev</span>
    </template>
    <template v-slot:navigationArrowRight>
        <span>Next</span>
    </template>
</FunctionalCalendar>
```

## Footer

```vue
<FunctionalCalendar ref="calendar" v-model="calendarData" :is-date-range="true" :is-modal="true">
    <template v-slot:cleaner>
        <button type="button">Reset</button>
    </template>
    <template v-slot:footer>
        <button type="button" @click="$refs.calendar.showCalendar = false">Apply</button>
    </template>
</FunctionalCalendar>
```

A click anywhere in the `cleaner` slot clears the selected range.

## Inputs

These slots apply to modal calendars only. The slot props are read-only, so the examples bind them with `:value`.

```vue
<FunctionalCalendar v-model="calendarData" :is-date-range="true" :is-modal="true">
    <template v-slot:dateRangeInputs="props">
        <input :value="props.startDate" placeholder="Check in" readonly />
        <input :value="props.endDate" placeholder="Check out" readonly />
    </template>
</FunctionalCalendar>
```

```vue
<FunctionalCalendar v-model="calendarData" :is-date-picker="true" :is-modal="true">
    <template v-slot:datePickerInput="props">
        <input :value="props.selectedDate" placeholder="Pick a date" readonly />
    </template>
</FunctionalCalendar>
```


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/v2/sitemap.md) for all pages.
