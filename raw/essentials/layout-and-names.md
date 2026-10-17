---
title: "Layout and names"
description: "Hide parts, move the title and arrows, and rename days and months."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/layout-and-names"
---
# Layout and names

> Hide parts, move the title and arrows, and rename days and months.

<calendar-demo :config="{"isDatePicker":true,"titlePosition":"left","arrowsPosition":"right","hiddenElements":["leftAndRightDays"],"dayNames":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-picker
  title-position="left"
  arrows-position="right"
  :hidden-elements="['leftAndRightDays']"
  :day-names="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
/>
```

</calendar-demo>

## Layout props

<table>
<thead>
  <tr>
    <th>
      Prop
    </th>
    
    <th>
      Values
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        titlePosition
      </code>
    </td>
    
    <td>
      <code>
        left
      </code>
      
      , <code>
        center
      </code>
      
       (default), <code>
        right
      </code>
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
        space-between
      </code>
      
       (default), <code>
        left
      </code>
      
      , <code>
        right
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        hiddenElements
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
      
      , <code>
        presets
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        isLayoutExpandable
      </code>
    </td>
    
    <td>
      Drop the reserved rows of short months
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
        false
      </code>
      
       turns off the slide between months
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        sundayStart
      </code>
    </td>
    
    <td>
      Start the week on Sunday
    </td>
  </tr>
</tbody>
</table>

`hiddenElements: ['month']` hides the whole title row, so the month and year pickers go with it.

## Names

`dayNames` starts on Monday, whatever the week start. The calendar rotates the list to match the week start, so list Monday first. `monthNames` and `shortMonthNames` start on January. `shortMonthNames` appear in the month picker.

```vue
<FunctionalCalendar
  :day-names="['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']"
  :month-names="['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']"
/>
```

To derive names from the browser instead, use [`locale`](https://manukminasyan.github.io/vue-functional-calendar/essentials/locale). Explicit names win over a locale.

## Your own markup

Slots replace the day, arrows, footer and inputs, see [slots](https://manukminasyan.github.io/vue-functional-calendar/essentials/slots). The `vfc-*` class names are stable, so your CSS from 2.x keeps working.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
