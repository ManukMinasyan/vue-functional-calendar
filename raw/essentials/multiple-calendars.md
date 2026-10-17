---
title: "Multiple calendars"
description: "Show several months at once."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/multiple-calendars"
---
# Multiple calendars

> Show several months at once.

Set `isMultiple` and `calendarsCount`. `calendarsCount` has no effect without `isMultiple`.

<calendar-demo :config="{"isDateRange":true,"isMultiple":true,"calendarsCount":2,"isSeparately":true,"changeMonthFunction":true,"changeYearFunction":true}">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  is-multiple
  :calendars-count="2"
  is-separately
  change-month-function
  change-year-function
/>
```

</calendar-demo>

## Linked or separate

By default the calendars move together and the first calendar owns the arrows and the month and year pickers. With `isSeparately`, each calendar has its own arrows and pickers.

## Height

Each calendar reserves six week rows so the layout does not jump when a month has five. `isLayoutExpandable` removes the reserved rows.

## Related props

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
        changeMonthStep
      </code>
    </td>
    
    <td>
      Months moved by an arrow click. Default <code>
        1
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        changeYearStep
      </code>
    </td>
    
    <td>
      Years moved in the year picker. Default <code>
        3
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        titlePosition
      </code>
      
      , <code>
        arrowsPosition
      </code>
    </td>
    
    <td>
      Where the title and arrows sit.
    </td>
  </tr>
</tbody>
</table>

The calendars wrap onto new lines when the container is narrow.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
