---
title: "Slots"
description: "Replace parts of the calendar with your own markup."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/slots"
---
# Slots

> Replace parts of the calendar with your own markup.

<calendar-slots-demo>

```vue
<FunctionalCalendar v-model="value" is-date-picker always-use-default-classes>
  <template #default="{ day }">
    <strong v-if="isWeekend(day)" style="pointer-events: none">{{ day.day }}</strong>
    <template v-else>{{ day.day }}</template>
  </template>
  <template #navigationArrowLeft>&larr;</template>
  <template #navigationArrowRight>&rarr;</template>
  <template #footer><small>Weekends are bold.</small></template>
</FunctionalCalendar>
```

</calendar-slots-demo>

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
        { week, day }
      </code>
    </td>
    
    <td>
      The content of a day cell
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
      The previous month arrow
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
      The next month arrow
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
      The clear button of a range
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
      Adds content below the calendar
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
        { startDate, endDate, isTypeable }
      </code>
    </td>
    
    <td>
      The two inputs of a modal range
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
        { selectedDate, isTypeable }
      </code>
    </td>
    
    <td>
      The input of a modal date picker
    </td>
  </tr>
</tbody>
</table>

## The day slot

`day` is the [day object](https://manukminasyan.github.io/vue-functional-calendar/essentials/events#the-day-object). `week` has `number`, `start`, `end` and `days`.

A day slot removes the default `vfc-span-day` class from the cell. Pass `alwaysUseDefaultClasses` to keep it, along with its selection and range styling. Without it, you style the cell yourself.

The cell selects only when the click lands on the cell itself, as in 2.x. Set `pointer-events: none` on the elements inside your slot so clicks reach the cell.

## Arrows

An arrow slot that contains a button or a link keeps its own focus. Any other content is wrapped with `role="button"` and `tabindex="0"`, and responds to Enter and Space. The label comes from `labels.previousMonth` and `labels.nextMonth`.

## Cleaner and footer

The footer row renders when `canClearRange` is on or you set the `footer` slot. The `cleaner` slot replaces the default clear button inside that row, and clicking inside it clears the range. The default clear button needs `isDateRange` as well.

## Inputs

The input slots only render in modal mode. Keep `:readonly="!isTypeable"` on your inputs so they follow the `isTypeable` prop. See the [examples](https://manukminasyan.github.io/vue-functional-calendar/examples/modal-and-inputs#your-own-range-inputs).


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
