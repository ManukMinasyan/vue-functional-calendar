---
canonical_url: "https://manukminasyan.github.io"
---
<u-page-hero :ui="{"container":"lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] xl:gap-16 py-16 sm:py-24 lg:py-28","title":"text-4xl sm:text-6xl","description":"max-w-xl"}" orientation="horizontal">
<template v-slot:headline="">
<u-button size="sm" to="https://manukminasyan.github.io/vue-functional-calendar/community/changelog" trailing-icon="i-lucide-arrow-right" color="neutral" variant="subtle" className="rounded-full">

3.1 is out, built for Vue 3

</u-button>
</template>

<template v-slot:title="">

Vue Functional <span className="text-primary">

Calendar

</span>
</template>

<template v-slot:description="">

A lightweight calendar and datepicker for Vue 3. Pick single dates, ranges with presets, several months or a time, with keyboard support, dark mode and Intl locales built in. No runtime dependencies.

</template>

<template v-slot:links="">
<u-button size="xl" to="https://manukminasyan.github.io/vue-functional-calendar/getting-started/installation" trailing-icon="i-lucide-arrow-right">

Get started

</u-button>

<install-command>



</install-command>
</template>

<calendar-hero>



</calendar-hero>
</u-page-hero>

<u-page-section>
<template v-slot:title="">

Why Vue Functional Calendar?

</template>

<template v-slot:links="">
<u-button size="lg" to="https://manukminasyan.github.io/vue-functional-calendar/examples/selection-modes" trailing-icon="i-lucide-arrow-right" color="neutral" variant="outline">

Browse the examples

</u-button>
</template>

<template v-slot:features="">
<u-page-feature icon="i-lucide-calendar-days">
<template v-slot:title="">

Date picker

</template>

<template v-slot:description="">

Pick one date or several, inline or in a modal behind a typeable input.

</template>
</u-page-feature>

<u-page-feature icon="i-lucide-calendar-range">
<template v-slot:title="">

Ranges and presets

</template>

<template v-slot:description="">

Select one range or many, with minimum and maximum lengths and one-click presets.

</template>
</u-page-feature>

<u-page-feature icon="i-lucide-columns-2">
<template v-slot:title="">

Multiple calendars

</template>

<template v-slot:description="">

Show two or more months side by side, linked or independent.

</template>
</u-page-feature>

<u-page-feature icon="i-lucide-clock">
<template v-slot:title="">

Time picker

</template>

<template v-slot:description="">

Add hours and minutes to a single date, a range or several dates.

</template>
</u-page-feature>

<u-page-feature icon="i-lucide-palette">
<template v-slot:title="">

Theming and dark mode

</template>

<template v-slot:description="">

Restyle everything with --vfc-* custom properties, in light and dark.

</template>
</u-page-feature>

<u-page-feature icon="i-lucide-keyboard">
<template v-slot:title="">

Keyboard and ARIA

</template>

<template v-slot:description="">

Arrow-key navigation, a labeled date grid and managed focus.

</template>
</u-page-feature>

<u-page-feature icon="i-lucide-languages">
<template v-slot:title="">

Intl locales

</template>

<template v-slot:description="">

Day names, month names and week start from the browser, plus labels for every string.

</template>
</u-page-feature>

<u-page-feature icon="i-lucide-puzzle">
<template v-slot:title="">

Slots

</template>

<template v-slot:description="">

Replace the day cell, arrows, footer, clear button and inputs.

</template>
</u-page-feature>
</template>
</u-page-section>

<u-page-section orientation="horizontal">
<template v-slot:title="">

Up and running in a minute

</template>

<template v-slot:description="">

Import the component and its stylesheet, bind a model, and pick a mode with one prop. Every string, color and slot is yours to change later.

</template>

<template v-slot:links="">
<u-button size="lg" to="https://manukminasyan.github.io/vue-functional-calendar/getting-started/usage" trailing-icon="i-lucide-arrow-right">

Read the usage guide

</u-button>

<u-button size="lg" to="https://manukminasyan.github.io/vue-functional-calendar/essentials/props" color="neutral" variant="ghost">

All props

</u-button>
</template>

```vue [App.vue]
<script setup>
import { ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'
import 'vue-functional-calendar/style.css'

const calendar = ref({})
</script>

<template>
  <FunctionalCalendar
    v-model="calendar"
    is-date-range
    presets
    can-clear-range
  />
</template>
```

</u-page-section>

## Resources for Agents

- [API catalog: every service document this site publishes](https://manukminasyan.github.io/vue-functional-calendar/.well-known/api-catalog)
- [Sitemap (XML)](https://manukminasyan.github.io/vue-functional-calendar/sitemap.xml)
- [Sitemap (Markdown): every page on the site](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md)
- [MCP server card: MCP endpoint at https://manukminasyan.github.io/vue-functional-calendar/mcp](https://manukminasyan.github.io/vue-functional-calendar/.well-known/mcp/server-card.json)
- [MCP endpoint (streamable HTTP)](https://manukminasyan.github.io/vue-functional-calendar/mcp)
- [llms.txt: index of the documentation for LLMs](https://manukminasyan.github.io/vue-functional-calendar/llms.txt)
- [llms-full.txt: the full documentation as a single file](https://manukminasyan.github.io/vue-functional-calendar/llms-full.txt)
- [OpenAPI document: every route this site serves to agents](https://manukminasyan.github.io/vue-functional-calendar/openapi.json)


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
