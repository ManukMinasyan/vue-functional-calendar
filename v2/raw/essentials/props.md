---
title: "Props"
description: "Every prop of the FunctionalCalendar component, with type, default and behavior."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/v2/essentials/props"
---
# Props

> Every prop of the FunctionalCalendar component, with type, default and behavior.

Props use camelCase in JavaScript and kebab-case in templates, so `isDatePicker` becomes `is-date-picker`. A prop you leave out keeps the default shown here.

## Value and configuration

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        value
      </code>
    </td>
    
    <td>
      <code>
        Object
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      The calendar state. Bind it with <code>
        v-model
      </code>
      
      . Change it from outside to preselect dates.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        configs
      </code>
    </td>
    
    <td>
      <code>
        Object
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      All options as one object. When set, the calendar skips every individual prop that has a <code>
        configs
      </code>
      
       key.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        newCurrentDate
      </code>
    </td>
    
    <td>
      <code>
        Date
      </code>
    </td>
    
    <td>
      today
    </td>
    
    <td>
      The month to show first.
    </td>
  </tr>
</tbody>
</table>

### configs

Any option in the tables below can be a key of `configs`, except `value`, `newCurrentDate`, `canClearRange`, `displayTimeInput`, `activeHours`, `activeMinutes`, `borderColor`, `alwaysUseDefaultClasses` and `configs` itself. Those keep working as props next to `configs`.

Any other prop you pass next to `configs` is ignored. Four options are also read straight from the prop in parts of the component: `isMultipleDateRange`, `showWeekNumbers`, `isSeparately` and `changeYearStep`. Set each of these in `configs` and as a prop.

```js
{
    isDateRange: true,
    sundayStart: true,
    limits: { min: '1/10/2026', max: '31/12/2026' }
}
```

## Selection modes

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        isDatePicker
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Pick one date. The result is <code>
        selectedDate
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isMultipleDatePicker
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Pick any number of dates. The result is <code>
        selectedDates
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDateRange
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Pick one range. The result is <code>
        dateRange
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isMultipleDateRange
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Pick several ranges. Use it together with <code>
        isDateRange
      </code>
      
      . The result is <code>
        multipleDateRange
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        canClearRange
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show a Clear Range button in the footer of a range calendar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        minSelDays
      </code>
    </td>
    
    <td>
      <code>
        Number
      </code>
      
       or <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Shortest range, in days. Both end days count.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        maxSelDays
      </code>
    </td>
    
    <td>
      <code>
        Number
      </code>
      
       or <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Longest range, in days. Both end days count.
    </td>
  </tr>
</tbody>
</table>

## Date format

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        dateFormat
      </code>
    </td>
    
    <td>
      <code>
        String
      </code>
    </td>
    
    <td>
      <code>
        dd/mm/yyyy hh:MM
      </code>
    </td>
    
    <td>
      The format of every date string.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        placeholder
      </code>
    </td>
    
    <td>
      <code>
        String
      </code>
      
       or <code>
        Boolean
      </code>
    </td>
    
    <td>
      the date format
    </td>
    
    <td>
      Placeholder of the date inputs in modal mode.
    </td>
  </tr>
</tbody>
</table>

Use `dd`, `mm` and `yyyy` joined by `/`, `-` or `.`. Add a time part after a space: `HH:MM`, `HH:mm`, `hh:MM` or `hh:mm`. Any other time part fails prop validation.

## Layout

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        isMultiple
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show more than one calendar. Set the number with <code>
        calendarsCount
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        calendarsCount
      </code>
    </td>
    
    <td>
      <code>
        Number
      </code>
    </td>
    
    <td>
      <code>
        1
      </code>
    </td>
    
    <td>
      How many calendars to show when <code>
        isMultiple
      </code>
      
       is on.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isSeparately
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Let each calendar change month on its own.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isModal
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show an input and open the calendar in a popover when it gains focus.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isTypeable
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Let users type dates into the modal inputs.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isAutoCloseable
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Close the modal calendar once a selection is complete.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isDark
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Use the dark theme.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isLayoutExpandable
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Fit the height to the weeks in the month. By default every calendar reserves six rows.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        titlePosition
      </code>
    </td>
    
    <td>
      <code>
        String
      </code>
    </td>
    
    <td>
      <code>
        center
      </code>
    </td>
    
    <td>
      Month and year title alignment: <code>
        left
      </code>
      
      , <code>
        center
      </code>
      
       or <code>
        right
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        arrowsPosition
      </code>
    </td>
    
    <td>
      <code>
        String
      </code>
    </td>
    
    <td>
      <code>
        space-between
      </code>
    </td>
    
    <td>
      Navigation arrow placement: <code>
        left
      </code>
      
      , <code>
        right
      </code>
      
       or <code>
        space-between
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        showWeekNumbers
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show the week number before each week.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        borderColor
      </code>
    </td>
    
    <td>
      <code>
        String
      </code>
    </td>
    
    <td>
      empty
    </td>
    
    <td>
      CSS color for the line beside the week numbers.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        transition
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      Animate month changes.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hiddenElements
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Parts to hide: <code>
        month
      </code>
      
       (the title), <code>
        dayNames
      </code>
      
       and <code>
        leftAndRightDays
      </code>
      
       (days of neighboring months).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        alwaysUseDefaultClasses
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Keep the default day class <code>
        vfc-span-day
      </code>
      
       when you fill the day slot.
    </td>
  </tr>
</tbody>
</table>

## Navigation

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        changeMonthFunction
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Open a month picker when users click the month title.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        changeYearFunction
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Open a year picker when users click the year title.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        changeMonthStep
      </code>
    </td>
    
    <td>
      <code>
        Number
      </code>
    </td>
    
    <td>
      <code>
        1
      </code>
    </td>
    
    <td>
      Months to move on each arrow click.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        changeYearStep
      </code>
    </td>
    
    <td>
      <code>
        Number
      </code>
    </td>
    
    <td>
      <code>
        3
      </code>
    </td>
    
    <td>
      Years to move on each arrow click inside the year picker.
    </td>
  </tr>
</tbody>
</table>

## Availability and marking

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        limits
      </code>
    </td>
    
    <td>
      <code>
        Object
      </code>
      
       or <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      An <code>
        { min, max }
      </code>
      
       pair of date strings. Days outside it are disabled and the arrows stop at its months.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabledDates
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Date strings that users cannot pick. Also accepts <code>
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
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      When not empty, only these dates can be picked. Accepts the same keywords.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabledDayNames
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Weekdays users cannot pick, by name from <code>
        dayNames
      </code>
      
      , for example <code>
        ['Sa', 'Su']
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        markedDates
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Date strings to highlight. Or objects like <code>
        { date: '24/4/2026', class: 'my-class' }
      </code>
      
       to add a CSS class.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        markedDateRange
      </code>
    </td>
    
    <td>
      <code>
        Object
      </code>
      
       or <code>
        Array
      </code>
    </td>
    
    <td>
      start and end unset
    </td>
    
    <td>
      A <code>
        { start, end }
      </code>
      
       span to highlight, or an array of spans.
    </td>
  </tr>
</tbody>
</table>

## Names

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        dayNames
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        Mo
      </code>
      
       to <code>
        Su
      </code>
    </td>
    
    <td>
      Seven day names, Monday first.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        monthNames
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        January
      </code>
      
       to <code>
        December
      </code>
    </td>
    
    <td>
      Twelve month names, used in the title.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        shortMonthNames
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        Jan
      </code>
      
       to <code>
        Dec
      </code>
    </td>
    
    <td>
      Twelve short names, used in the month picker.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sundayStart
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Start the week on Sunday. Keep <code>
        dayNames
      </code>
      
       Monday first. The calendar moves the last name to the front.
    </td>
  </tr>
</tbody>
</table>

## Time picker

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Type
    </th>
    
    <th>
      Default
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
        withTimePicker
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Open the time picker after a day click.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        displayTimeInput
      </code>
    </td>
    
    <td>
      <code>
        Boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show the selected time in the single date input of a modal calendar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeHours
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
       to <code>
        23
      </code>
    </td>
    
    <td>
      Hours users can choose.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeMinutes
      </code>
    </td>
    
    <td>
      <code>
        Array
      </code>
    </td>
    
    <td>
      <code>
        0
      </code>
      
       to <code>
        59
      </code>
    </td>
    
    <td>
      Minutes users can choose.
    </td>
  </tr>
</tbody>
</table>

## Example

```vue
<FunctionalCalendar
    v-model="calendarData"
    :is-date-range="true"
    :is-multiple="true"
    :calendars-count="2"
    :limits="{ min: '1/10/2026', max: '31/12/2026' }"
    :disabled-day-names="['Sa', 'Su']"
    :min-sel-days="2"
    :max-sel-days="14"
    :can-clear-range="true"
/>
```


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/v2/sitemap.md) for all pages.
