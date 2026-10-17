---
title: "Slots"
description: "Replace the day cell, the arrows, the footer and the clear button."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/slots"
---
# Slots

> Replace the day cell, the arrows, the footer and the clear button.

## Day, arrows and footer

The default slot receives `{ week, day }` and replaces the content of a day. Setting a day slot drops the default day classes, so add `alwaysUseDefaultClasses` to keep the selection styling. The arrow and footer slots replace their parts.

The day cell selects only when the click lands on the cell itself. Set `pointer-events: none` on elements inside your slot so clicks reach the cell.

<calendar-slots-demo>

```vue
<FunctionalCalendar v-model="value" is-date-picker always-use-default-classes>
  <template #default="{ day }">
    <strong v-if="isWeekend(day)" style="pointer-events: none">{{ day.day }}</strong>
    <template v-else>{{ day.day }}</template>
  </template>
  <template #navigationArrowLeft>&larr;</template>
  <template #navigationArrowRight>&rarr;</template>
  <template #footer>
    <small>Weekends are bold.</small>
  </template>
</FunctionalCalendar>
```

</calendar-slots-demo>

## An events calendar

Without `alwaysUseDefaultClasses`, a day slot is yours to lay out. This one renders events inside each day and listens to `dayClicked`.

<calendar-events-demo>

```vue
<FunctionalCalendar
  v-model="value"
  title-position="left"
  arrows-position="right"
  @day-clicked="onDayClicked"
>
  <template #default="{ day }">
    <div class="day">
      <span>{{ day.day }}</span>
      <span v-for="event in eventsOn(day.date)" :key="event.id" class="event">
        {{ event.title }}
      </span>
    </div>
  </template>
</FunctionalCalendar>

<style>
.day { pointer-events: none; }
</style>
```

</calendar-events-demo>

## Clear button

The `cleaner` slot replaces the clear button of a range. Clicking inside it clears the range.

<calendar-cleaner-demo>

```vue
<FunctionalCalendar v-model="value" is-date-range can-clear-range>
  <template #cleaner>
    <div style="display: flex; justify-content: center">
      <button type="button">Cancel</button>
    </div>
  </template>
</FunctionalCalendar>
```

</calendar-cleaner-demo>


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
