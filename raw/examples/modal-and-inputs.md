---
title: "Modal and typeable inputs"
description: "Open the calendar from an input, type dates, or replace the inputs."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/modal-and-inputs"
---
# Modal and typeable inputs

> Open the calendar from an input, type dates, or replace the inputs.

Set `isModal` to render inputs that open the calendar on focus. The calendar closes when focus leaves it, and Escape closes it and returns focus to the input.

## Modal date picker

Focus the input, or press ArrowDown on it. `isAutoCloseable` closes the calendar after a date is chosen.

<calendar-demo :config="{"isDatePicker":true,"isModal":true,"isAutoCloseable":true}" :height="420">

```vue
<FunctionalCalendar v-model="value" is-date-picker is-modal is-auto-closeable />
```

</calendar-demo>

## Typeable single input

Add `isTypeable` and type a date such as `5/3/2026` or `05/03/2026`. The value commits when the date is complete and valid. Typing `31/02/2026` changes nothing.

<calendar-demo :config="{"isDatePicker":true,"isModal":true,"isTypeable":true,"newCurrentDate":"2026-10-01"}" :height="420">

```vue
<FunctionalCalendar v-model="value" is-date-picker is-modal is-typeable />
```

</calendar-demo>

## Typeable range

A range gets two inputs. Each one commits on its own, so you can type only the start.

<calendar-demo :config="{"isDateRange":true,"isModal":true,"isTypeable":true,"dateFormat":"yyyy-mm-dd","newCurrentDate":"2026-10-01"}" :height="420">

```vue
<FunctionalCalendar
  v-model="value"
  is-date-range
  is-modal
  is-typeable
  date-format="yyyy-mm-dd"
/>
```

</calendar-demo>

## Multiple dates as tags

In modal mode, a multiple date picker shows its dates as removable tags. Type a date and press Enter to add it.

<calendar-demo :config="{"isMultipleDatePicker":true,"isModal":true}" :height="420">

```vue
<FunctionalCalendar v-model="value" is-multiple-date-picker is-modal />
```

</calendar-demo>

## Your own range inputs

The `dateRangeInputs` slot replaces both inputs. It receives `startDate`, `endDate` and `isTypeable`. Keep the `readonly` state so the inputs follow `isTypeable`.

<calendar-inputs-demo kind="range">

```vue
<FunctionalCalendar v-model="value" is-modal is-date-range is-typeable>
  <template #dateRangeInputs="{ startDate, endDate, isTypeable }">
    <input :value="startDate" :readonly="!isTypeable" placeholder="Check in" />
    <span aria-hidden="true">&rarr;</span>
    <input :value="endDate" :readonly="!isTypeable" placeholder="Check out" />
  </template>
</FunctionalCalendar>
```

</calendar-inputs-demo>

## Your own date input

The `datePickerInput` slot does the same for a single date and receives `selectedDate` and `isTypeable`.

<calendar-inputs-demo kind="single">

```vue
<FunctionalCalendar v-model="value" is-modal is-date-picker>
  <template #datePickerInput="{ selectedDate, isTypeable }">
    <input :value="selectedDate" :readonly="!isTypeable" placeholder="Birthday" />
  </template>
</FunctionalCalendar>
```

</calendar-inputs-demo>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
