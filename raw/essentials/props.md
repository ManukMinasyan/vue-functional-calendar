---
title: "Props"
description: "Every prop, with its type and default."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/props"
---
# Props

> Every prop, with its type and default.

The calendar has 48 props. The calendar reads them when it is created, except `modelValue` and the data props `markedDates`, `markedDateRange`, `disabledDates`, `enabledDates`, `disabledDayNames`, `limits`, `calendarsCount` and `isDark`, which it watches. The same keys inside `configs` are watched too. Re-key the component to apply a change to any other prop.

## Where options come from

From lowest to highest priority:

1. Defaults.
2. Global options from `app.use(FunctionalCalendar, options)`. Only the options that `configs` also accepts apply.
3. The `configs` object, or the props if you do not pass `configs`. When `configs` is present, the props that it can hold are ignored.

`configs` holds every option on this page except `modelValue`, `configs`, `activeHours`, `activeMinutes`, `borderColor`, `displayTimeInput`, `canClearRange`, `newCurrentDate` and `alwaysUseDefaultClasses`. Those nine are always props.

An explicit `dayNames`, `monthNames`, `shortMonthNames` or `sundayStart` wins over a `locale`.

## Value

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
        modelValue
      </code>
    </td>
    
    <td>
      <code>
        object
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      The calendar state. Bind it with <code>
        v-model
      </code>
      
      . See <a href="https://manukminasyan.github.io/vue-functional-calendar/getting-started/usage#the-bound-value">
        the bound value
      </a>
      
      . Watched.
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
        object
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      Settings as one object, instead of props.
    </td>
  </tr>
</tbody>
</table>

## Selection mode

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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Select one date.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Select any number of dates.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Select a range.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      With <code>
        isDateRange
      </code>
      
      , select several ranges.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show the clear button of a range.
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
        number
      </code>
      
       or <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Shortest range, in days.
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
        number
      </code>
      
       or <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Longest range, in days.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        presets
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
      
       or <code>
        array
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Quick ranges. <code>
        true
      </code>
      
       shows all six built-ins. A list holds keys and <code>
        { label, range }
      </code>
      
       objects. See <a href="https://manukminasyan.github.io/vue-functional-calendar/essentials/presets">
        presets
      </a>
      
      .
    </td>
  </tr>
</tbody>
</table>

## Calendars and navigation

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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show several calendars.
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
        number
      </code>
    </td>
    
    <td>
      <code>
        1
      </code>
    </td>
    
    <td>
      How many calendars, with <code>
        isMultiple
      </code>
      
      . Watched.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Give each calendar its own arrows and pickers.
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
      now
    </td>
    
    <td>
      The month to show first.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        changeMonthFunction
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Click the month to pick another.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Click the year to pick another.
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
        number
      </code>
    </td>
    
    <td>
      <code>
        1
      </code>
    </td>
    
    <td>
      Months moved by an arrow.
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
        number
      </code>
    </td>
    
    <td>
      <code>
        3
      </code>
    </td>
    
    <td>
      Years moved in the year picker.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
    
    <td>
      Slide between months.
    </td>
  </tr>
</tbody>
</table>

## Dates and limits

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
        string
      </code>
    </td>
    
    <td>
      <code>
        'dd/mm/yyyy hh:MM'
      </code>
    </td>
    
    <td>
      Tokens <code>
        dd
      </code>
      
      , <code>
        mm
      </code>
      
       and <code>
        yyyy
      </code>
      
       with a <code>
        /
      </code>
      
      , <code>
        -
      </code>
      
       or <code>
        .
      </code>
      
       separator, then an optional time (<code>
        HH:MM
      </code>
      
      , <code>
        HH:mm
      </code>
      
      , <code>
        hh:MM
      </code>
      
       or <code>
        hh:mm
      </code>
      
      ).
    </td>
  </tr>
  
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
      
       or <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Dates outside are disabled. Watched.
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
        string[]
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Disabled dates, plus <code>
        beforeToday
      </code>
      
       and <code>
        afterToday
      </code>
      
      . Watched.
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
        string[]
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      If not empty, only these dates (and the keywords) are enabled. Watched.
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
        string[]
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Weekday names to disable, from <code>
        dayNames
      </code>
      
      . Watched.
    </td>
  </tr>
</tbody>
</table>

## Marking

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
        markedDates
      </code>
    </td>
    
    <td>
      <code>
        string[]
      </code>
      
       or <code>
        { date, class }[]
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Dates to mark. Objects add a class to the day. Watched.
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
        { start, end }
      </code>
      
       or an array of them
    </td>
    
    <td>
      <code>
        { start: false, end: false }
      </code>
    </td>
    
    <td>
      Ranges to mark. <code>
        false
      </code>
      
       leaves a side open. Watched.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Add a week number column.
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
        string
      </code>
    </td>
    
    <td>
      <code>
        ''
      </code>
    </td>
    
    <td>
      Border color of the week number column.
    </td>
  </tr>
</tbody>
</table>

## Time

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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show the time picker after a date is chosen.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Add the time to a single date input.
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
        number[]
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
      Hours users can pick.
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
        number[]
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
      Minutes users can pick.
    </td>
  </tr>
</tbody>
</table>

## Modal and inputs

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
        isModal
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Show inputs that open the calendar.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Let users type into the inputs.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Close after a date or a range is chosen.
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
        string
      </code>
      
       or <code>
        boolean
      </code>
    </td>
    
    <td>
      the <code>
        dateFormat
      </code>
    </td>
    
    <td>
      Input placeholder. Range inputs use the date part.
    </td>
  </tr>
</tbody>
</table>

## Names and locale

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
        locale
      </code>
    </td>
    
    <td>
      <code>
        string
      </code>
    </td>
    
    <td>
      none
    </td>
    
    <td>
      BCP 47 tag for names and week start. See <a href="https://manukminasyan.github.io/vue-functional-calendar/essentials/locale">
        locale
      </a>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        labels
      </code>
    </td>
    
    <td>
      <code>
        object
      </code>
    </td>
    
    <td>
      English
    </td>
    
    <td>
      Partial UI strings, merged over the defaults. <code>
        labels.presets
      </code>
      
       merges key by key.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dayNames
      </code>
    </td>
    
    <td>
      <code>
        string[]
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
      Seven names, Monday first.
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
        string[]
      </code>
    </td>
    
    <td>
      English
    </td>
    
    <td>
      Twelve long names.
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
        string[]
      </code>
    </td>
    
    <td>
      English
    </td>
    
    <td>
      Twelve short names, shown in the month picker.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Start the week on Sunday.
    </td>
  </tr>
</tbody>
</table>

## Appearance

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
        isDark
      </code>
    </td>
    
    <td>
      <code>
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Use the dark tokens. Watched.
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
        'left'
      </code>
      
      , <code>
        'center'
      </code>
      
       or <code>
        'right'
      </code>
    </td>
    
    <td>
      <code>
        'center'
      </code>
    </td>
    
    <td>
      Title alignment.
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
        'space-between'
      </code>
      
      , <code>
        'left'
      </code>
      
       or <code>
        'right'
      </code>
    </td>
    
    <td>
      <code>
        'space-between'
      </code>
    </td>
    
    <td>
      Arrow placement.
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
        string[]
      </code>
    </td>
    
    <td>
      <code>
        []
      </code>
    </td>
    
    <td>
      Any of <code>
        dayNames
      </code>
      
      , <code>
        leftAndRightDays
      </code>
      
      , <code>
        month
      </code>
      
       and <code>
        presets
      </code>
      
      .
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Drop the reserved rows of short months.
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
        boolean
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      Keep the default day classes when you use the day slot.
    </td>
  </tr>
</tbody>
</table>

## Methods

Call these through a template ref.

<table>
<thead>
  <tr>
    <th>
      Method
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
        PreMonth(calendarKey?)
      </code>
      
      , <code>
        NextMonth(calendarKey?)
      </code>
    </td>
    
    <td>
      Move by <code>
        changeMonthStep
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        PreYear(calendarKey?)
      </code>
      
      , <code>
        NextYear(calendarKey?)
      </code>
    </td>
    
    <td>
      Move by one year.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ChooseDate(date)
      </code>
    </td>
    
    <td>
      Move to a date in <code>
        dateFormat
      </code>
      
      , or to <code>
        'today'
      </code>
      
      . Returns <code>
        false
      </code>
      
       and stays put when the month is outside <code>
        limits
      </code>
      
      . With several calendars, the view may start earlier so every calendar stays inside <code>
        max
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
