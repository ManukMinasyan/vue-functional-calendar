---
title: "Keyboard"
description: "Every key the calendar handles."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/keyboard"
---
# Keyboard

> Every key the calendar handles.

Everything works without a mouse. Tab into the grid, move with the arrow keys, and press Enter to select. Try it on the demo: the modal input opens with ArrowDown.

<calendar-demo :config="{"isDateRange":true,"isModal":true,"isTypeable":true,"changeMonthFunction":true,"changeYearFunction":true,"presets":true}" :height="460">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  is-modal
  is-typeable
  change-month-function
  change-year-function
  :presets="true"
/>
```

</calendar-demo>

## The grid

Each month is a grid with one tab stop. Tab moves into the grid, and the arrow keys move between days. The tab stop sits on the focused day, then the selected day, then today, then the first enabled day.

<table>
<thead>
  <tr>
    <th>
      Key
    </th>
    
    <th>
      Action
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      ArrowLeft, ArrowRight
    </td>
    
    <td>
      Previous or next day. In a right to left page they swap: ArrowRight goes to the previous day, the one on the right
    </td>
  </tr>
  
  <tr>
    <td>
      ArrowUp, ArrowDown
    </td>
    
    <td>
      Same weekday, previous or next week
    </td>
  </tr>
  
  <tr>
    <td>
      Home, End
    </td>
    
    <td>
      First or last day of the week, kept inside the month
    </td>
  </tr>
  
  <tr>
    <td>
      PageUp, PageDown
    </td>
    
    <td>
      Previous or next month, same day or the last day of a shorter month
    </td>
  </tr>
  
  <tr>
    <td>
      Shift+PageUp, Shift+PageDown
    </td>
    
    <td>
      Previous or next year
    </td>
  </tr>
  
  <tr>
    <td>
      Enter, Space
    </td>
    
    <td>
      Select the day
    </td>
  </tr>
  
  <tr>
    <td>
      Delete, Backspace
    </td>
    
    <td>
      On a day of a multiple date range, remove that range
    </td>
  </tr>
</tbody>
</table>

Moving past the edge of the visible months scrolls the calendar and emits `changedMonth`, and `changedYear` too when the year changes. The Shift variants emit `changedYear` only. Moves stop at the months that `limits` allows. Home and End follow the week start of the calendar, so Home lands on Sunday for `en-US` and on Monday for `de-DE`.

Disabled days are focusable but cannot be selected. Moving over a day also fires `dayMouseOver`, so a range preview follows the keyboard.

## Title, arrows and pickers

The arrows are buttons. The month and year titles are buttons when `changeMonthFunction` or `changeYearFunction` is on. Enter or Space on a title opens its picker and moves focus to the selected item. Escape closes the picker and returns focus to the title. Items in a picker are buttons too. Moving focus out of the picker, for example with Tab, closes it.

Custom arrow slots that contain a button or a link keep their own focus. Other slot content gets `role="button"` and responds to Enter and Space.

## Modal inputs

<table>
<thead>
  <tr>
    <th>
      Key
    </th>
    
    <th>
      Where
    </th>
    
    <th>
      Action
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Focus, or ArrowDown, or Alt+ArrowDown
    </td>
    
    <td>
      Input
    </td>
    
    <td>
      Open the calendar. The arrow keys also move focus to the day with the tab stop
    </td>
  </tr>
  
  <tr>
    <td>
      Escape
    </td>
    
    <td>
      Calendar
    </td>
    
    <td>
      Close it and return focus to the input
    </td>
  </tr>
  
  <tr>
    <td>
      Tab out
    </td>
    
    <td>
      Calendar
    </td>
    
    <td>
      Close it
    </td>
  </tr>
</tbody>
</table>

Enter in the single and range inputs is never intercepted, so a surrounding form submits. In the tags input of the multiple date picker, Enter adds the typed date.

Selecting a day with the keyboard in a modal that closes after selection (`isAutoCloseable`) returns focus to the input.

## Time picker

Each list is a listbox with one tab stop. ArrowUp, ArrowDown, Home and End move, Enter and Space choose. Escape returns to the calendar.

## Presets

Presets are buttons in the tab order. Enter or Space on one applies it.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
