---
title: "Accessibility"
description: "Grid semantics, labels and focus management."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/accessibility"
---
# Accessibility

> Grid semantics, labels and focus management.

The calendar follows the ARIA date grid pattern. Screen readers get names, states and a single tab stop per month. The [keyboard page](https://manukminasyan.github.io/vue-functional-calendar/essentials/keyboard) lists every key.

## Grid semantics

<table>
<thead>
  <tr>
    <th>
      Part
    </th>
    
    <th>
      Markup
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Month
    </td>
    
    <td>
      <code>
        role="grid"
      </code>
      
      , named by the month and year, such as "October 2026"
    </td>
  </tr>
  
  <tr>
    <td>
      Week
    </td>
    
    <td>
      <code>
        role="row"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Day
    </td>
    
    <td>
      <code>
        role="gridcell"
      </code>
      
       with a full date as <code>
        aria-label
      </code>
      
      , such as "Thursday, 15 October 2026"
    </td>
  </tr>
  
  <tr>
    <td>
      Week number
    </td>
    
    <td>
      <code>
        role="rowheader"
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Day name row
    </td>
    
    <td>
      <code>
        aria-hidden="true"
      </code>
      
      , because each day already has a full date label
    </td>
  </tr>
  
  <tr>
    <td>
      Filler rows
    </td>
    
    <td>
      <code>
        role="presentation"
      </code>
      
       and <code>
        aria-hidden="true"
      </code>
    </td>
  </tr>
</tbody>
</table>

Day labels and the month name use the calendar's own names and the locale you set, always in the Gregorian calendar. Custom `monthNames` appear in the labels.

## Day states

- `aria-selected` is set on days when the calendar selects something. It is absent on a display-only calendar.
- `aria-disabled="true"` marks days blocked by `limits`, `disabledDates`, `enabledDates` or `disabledDayNames`.
- A day in a numbered range has its range number added to the label, such as "Thursday, 15 October 2026, Range 2". The word comes from `labels.range`.
- Days in a multiple date range carry `aria-keyshortcuts="Delete"`.

## Roving focus

Each month has one tab stop, so Tab crosses the grid in one step. The stop sits on the day you last focused, then on the selected day, then on today, then on the first enabled day. The other days have `tabindex="-1"` and are reached with the arrow keys.

Focus stays on the same day when the calendar re-renders, for example after a month change. If that day leaves the screen, focus goes to the tab stop of the same month.

## Controls

<table>
<thead>
  <tr>
    <th>
      Control
    </th>
    
    <th>
      Markup
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Arrows
    </td>
    
    <td>
      <code>
        <button>
      </code>
      
       with the label from <code>
        labels.previousMonth
      </code>
      
       or <code>
        labels.nextMonth
      </code>
      
      , and <code>
        aria-disabled
      </code>
      
       at a limit
    </td>
  </tr>
  
  <tr>
    <td>
      Month and year titles
    </td>
    
    <td>
      <code>
        role="button"
      </code>
      
      , <code>
        tabindex="0"
      </code>
      
       and <code>
        aria-expanded
      </code>
      
      , when the pickers are on
    </td>
  </tr>
  
  <tr>
    <td>
      Picker items
    </td>
    
    <td>
      <code>
        role="button"
      </code>
      
       with <code>
        aria-pressed
      </code>
      
       on the current one
    </td>
  </tr>
  
  <tr>
    <td>
      Presets
    </td>
    
    <td>
      A <code>
        role="group"
      </code>
      
       named by <code>
        labels.quickRanges
      </code>
      
      , holding buttons with <code>
        aria-pressed
      </code>
      
       and <code>
        aria-disabled
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Clear button
    </td>
    
    <td>
      <code>
        role="button"
      </code>
      
       with <code>
        aria-disabled
      </code>
      
       when there is nothing to clear
    </td>
  </tr>
  
  <tr>
    <td>
      Time picker
    </td>
    
    <td>
      Two <code>
        role="listbox"
      </code>
      
       lists named by <code>
        labels.hour
      </code>
      
       and <code>
        labels.minute
      </code>
      
      , with <code>
        role="option"
      </code>
      
       items and <code>
        aria-selected
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Time picker close
    </td>
    
    <td>
      <code>
        role="button"
      </code>
      
       labeled by <code>
        labels.close
      </code>
    </td>
  </tr>
</tbody>
</table>

Arrow slots with your own button or link keep their own focus and semantics.

## Modal calendars

In modal mode, the calendar is a `role="dialog"` named by `labels.calendar`. Its inputs have `aria-haspopup="dialog"` and an `aria-expanded` that tracks the dialog, and a `title` from `labels.date`, `labels.startDate` or `labels.endDate`.

Focus follows these rules:

- Focusing an input, or pressing ArrowDown or Alt+ArrowDown on it, opens the calendar.
- Escape closes the calendar and returns focus to the input that opened it.
- Selecting a day with the keyboard in an auto-closing calendar returns focus to the input.
- Focus leaving the calendar and its inputs closes it.
- Escape inside a month or year picker, or the time picker, closes only that layer.

## Focus ring

Focused controls show a 2px outline in `--vfc-focus`. It defaults to the primary color, so change it if your primary color has low contrast on your background.

## Translate it

Every string a screen reader hears comes from `labels` or from `locale`. See [locale and labels](https://manukminasyan.github.io/vue-functional-calendar/essentials/locale).


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
