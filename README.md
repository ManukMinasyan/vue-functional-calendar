<p align="center"><img src="https://raw.githubusercontent.com/ManukMinasyan/vue-functional-calendar/3.x/public/logo.png" width="200" alt="Vue Functional Calendar" /></p>

<h1 align="center">Vue Functional Calendar</h1>
<p align="center">Lightweight calendar and datepicker for Vue 3</p>

[![Version](https://img.shields.io/npm/v/vue-functional-calendar.svg)](https://www.npmjs.com/package/vue-functional-calendar)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)
[![Downloads](https://img.shields.io/npm/dt/vue-functional-calendar.svg)](https://www.npmjs.com/package/vue-functional-calendar)
[![Open Collective](https://img.shields.io/opencollective/all/vue-functional-calendar.svg?style=flat)](https://opencollective.com/vue-functional-calendar#category-CONTRIBUTE)

<h2 align="center">Sponsors</h2>
<p align="center">
<a href="https://getcopy.ai">
<img src="https://www.getcopy.ai/logo-light.svg" width="240" alt="GetCopy" />
</a>
</p>

## Documentation

Live examples, a playground and the full reference are at **https://manukminasyan.github.io/vue-functional-calendar/**.

Date picker, date range with presets, multiple calendars, time picker, modal and typeable inputs, theming with dark mode, keyboard support and Intl locales. No runtime dependencies.

## Install

```bash
npm install vue-functional-calendar
```

This is the Vue 3 build and needs Vue `^3.3.0`. Vue 2 users install `vue-functional-calendar@^2.10.0`.

## Usage

Import the component and its stylesheet.

```vue
<script setup>
import { ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'
import 'vue-functional-calendar/style.css'

const value = ref({})
</script>

<template>
  <FunctionalCalendar v-model="value" is-date-range can-clear-range />
</template>
```

`value.dateRange` holds the `start` and `end` of the range.

## Upgrading from 2.x

Read [MIGRATION.md](MIGRATION.md). Templates that use `v-model` need no change, and the stylesheet is now a separate import.

## License

[MIT](LICENSE)
