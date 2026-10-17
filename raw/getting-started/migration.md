---
title: "Migrate from 2.x"
description: "Move a Vue 2 app on Vue Functional Calendar 2.x to the Vue 3 build."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/getting-started/migration"
---
# Migrate from 2.x

> Move a Vue 2 app on Vue Functional Calendar 2.x to the Vue 3 build.

3.x is a Vue 3 build of the same component. Every 2.x prop, event, slot, `vfc-*` class and value shape is still there. Most apps change a few lines.

The `3.0.0` release on npm was a Vue 2 build, so a `^3.0.0` range may resolve to it. Vue 2 apps pin `^2.10.0`:

```bash
npm install vue-functional-calendar@^2.10.0
```

## Steps

1. Upgrade to Vue `^3.3.0`.
2. Install the package: `npm install vue-functional-calendar@^3.1.0`.
3. Import the stylesheet once: `import 'vue-functional-calendar/style.css'`.
4. Register the plugin with `app.use`.
5. Rename `value` and `input` if you use them without `v-model`.
6. Replace SCSS variable overrides with `--vfc-*` tokens.

## `v-model`

`value` and `input` became `modelValue` and `update:modelValue`. A template that uses `v-model` needs no change.

```vue
<!-- 2.x and 3.x -->
<FunctionalCalendar v-model="calendarData" is-date-range />

<!-- 2.x, without v-model -->
<FunctionalCalendar :value="calendarData" @input="calendarData = $event" />

<!-- 3.x, without v-model -->
<FunctionalCalendar
  :model-value="calendarData"
  @update:model-value="calendarData = $event"
/>
```

The value object has the same shape: `currentDate`, `selectedDate`, `selectedDateTime`, `selectedHour`, `selectedMinute`, `selectedDatesItem`, `selectedDates`, `dateRange` and `multipleDateRange`.

## Styles

The CSS is a separate file. Import it once.

```js
import 'vue-functional-calendar/style.css'
```

Your 2.x CSS overrides keep working, because the `vfc-*` class names are unchanged. The default look changed, so check your overrides against it.

## Registration

Vue 2 used `Vue.use`. Vue 3 uses `app.use`, and the options still become global defaults.

```js
// 2.x
Vue.use(FunctionalCalendar, { showWeekNumbers: true })

// 3.x
app.use(FunctionalCalendar, { showWeekNumbers: true })
```

Both `import FunctionalCalendar from 'vue-functional-calendar'` and `import { FunctionalCalendar } from 'vue-functional-calendar'` still work.

## SCSS variables

The SCSS `!default` variables are gone. Custom properties replace them. Set a token on the calendar or on any ancestor, with plain CSS and no Sass.

```css
.my-calendar {
  --vfc-primary: #e11d48;
  --vfc-on-primary: #ffffff;
}
```

The 2.x variables named colors, not roles, so the mapping below is by use. The old and new values do not match one to one.

<table>
<thead>
  <tr>
    <th>
      2.x variable
    </th>
    
    <th>
      What it colored
    </th>
    
    <th>
      3.x token
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        $pictionBlue
      </code>
      
      , <code>
        $royalblue
      </code>
    </td>
    
    <td>
      Selected and marked days, time line, selected picker items
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $white
      </code>
    </td>
    
    <td>
      Backgrounds, text on selected days
    </td>
    
    <td>
      <code>
        --vfc-bg
      </code>
      
      , <code>
        --vfc-on-primary
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $black
      </code>
      
      , <code>
        $ebony
      </code>
      
      , <code>
        $mineShaft
      </code>
    </td>
    
    <td>
      Text and arrows
    </td>
    
    <td>
      <code>
        --vfc-text
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $mirage
      </code>
      
      , <code>
        $licorice
      </code>
    </td>
    
    <td>
      Dark mode background
    </td>
    
    <td>
      <code>
        --vfc-bg
      </code>
      
       under <code>
        .vfc-dark
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $astronaut
      </code>
    </td>
    
    <td>
      Dark mode range fill and borders
    </td>
    
    <td>
      <code>
        --vfc-range
      </code>
      
      , <code>
        --vfc-border
      </code>
      
       under <code>
        .vfc-dark
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $lightskyblue
      </code>
    </td>
    
    <td>
      Range fill
    </td>
    
    <td>
      <code>
        --vfc-range
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $steelblue
      </code>
    </td>
    
    <td>
      Day hover in dark mode
    </td>
    
    <td>
      <code>
        --vfc-primary-hover
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $lightred
      </code>
      
      , <code>
        $keppel
      </code>
    </td>
    
    <td>
      Today
    </td>
    
    <td>
      <code>
        --vfc-today
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $gainsboro
      </code>
      
      , <code>
        $silver_chalice
      </code>
      
      , <code>
        $boulder
      </code>
      
      , <code>
        $tundora
      </code>
      
      , <code>
        $trout
      </code>
    </td>
    
    <td>
      Secondary text, neighbor month days
    </td>
    
    <td>
      <code>
        --vfc-text-muted
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $gallery
      </code>
      
      , <code>
        $alto
      </code>
      
      , <code>
        $lightgrey
      </code>
      
      , <code>
        $silver
      </code>
    </td>
    
    <td>
      Borders and scrollbars
    </td>
    
    <td>
      <code>
        --vfc-border
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        $porcelain
      </code>
      
      , <code>
        $lightgreyHover
      </code>
    </td>
    
    <td>
      Hover backgrounds
    </td>
    
    <td>
      <code>
        --vfc-hover
      </code>
    </td>
  </tr>
</tbody>
</table>

`$powderblue` and `$charade` were never used. The full token list is in the [theming guide](https://manukminasyan.github.io/vue-functional-calendar/essentials/theming).

## Behavior changes

- Week numbers with `sundayStart` follow ISO numbering of each row's Thursday. 2.x showed numbers one lower.
- A typed date is validated. `31/02/2026` is rejected, and a value commits only when day, month and a four digit year are complete. Padded dates such as `05/03/2026` are accepted.
- Enter in the single and range inputs is never intercepted, so a surrounding form submits. The tags input of the multiple date picker still adds a valid typed date on Enter.

## Imports

3.x has an `exports` map with two entries, `vue-functional-calendar` and `vue-functional-calendar/style.css`. Deep imports from `src/` no longer resolve. Use the package entry.

```js
// 2.x
import FunctionalCalendar from 'vue-functional-calendar/src/components/FunctionalCalendar.vue'

// 3.x
import { FunctionalCalendar } from 'vue-functional-calendar'
```

## Props are still not reactive

As in 2.x, the calendar reads its props once, when it is created. Re-key the component to apply a change:

```vue
<FunctionalCalendar :key="locale" :locale="locale" is-date-picker />
```

`modelValue` and `enabledDates` are watched.

## New in 3.1

- Theming with `--vfc-*` tokens and a dark mode.
- Keyboard navigation and a grid with ARIA roles.
- The `locale` prop and the `labels` prop.
- The `presets` prop for quick ranges.

See the [changelog](https://manukminasyan.github.io/vue-functional-calendar/community/changelog) for the full list.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
