---
title: "Theming and dark mode"
description: "Style the calendar with --vfc-* tokens and switch to dark mode."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/examples/theming-and-dark-mode"
---
# Theming and dark mode

> Style the calendar with --vfc-* tokens and switch to dark mode.

## Dark mode

`isDark` adds the `vfc-dark` class and the dark token values. The calendar below is always dark. Every other demo on this site passes `isDark` from the site color mode, so toggle the site theme in the header to see them follow.

<calendar-demo :config="{"isDateRange":true,"isDark":true}">

```vue
<FunctionalCalendar v-model="value" is-date-range is-dark />
```

</calendar-demo>

To follow the site theme, bind it to your color mode.

```vue
<script setup>
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <FunctionalCalendar v-model="value" is-date-range :is-dark="isDark" />
</template>
```

## Tokens

Set a `--vfc-*` custom property on the calendar or on any ancestor. The buttons below change the tokens of a wrapper and the calendar updates at once. See the [theming guide](https://manukminasyan.github.io/vue-functional-calendar/essentials/theming) for the full token table.

<calendar-theme-demo>

```vue
<div class="my-calendar">
  <FunctionalCalendar v-model="value" is-date-range can-clear-range />
</div>

<style>
.my-calendar {
  --vfc-primary: #e11d48;
  --vfc-on-primary: #ffffff;
}
</style>
```

</calendar-theme-demo>

## Dark only values

Scope a token to `.vfc-dark` to change it in dark mode only.

```css
.vfc-dark {
  --vfc-primary: #fb7185;
  --vfc-on-primary: #1c1917;
}
```

## Try it live

The [playground](https://manukminasyan.github.io/vue-functional-calendar/playground) lets you change the primary color, the radius and the day size, and gives you the code.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
