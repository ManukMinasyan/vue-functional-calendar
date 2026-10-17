---
title: "Theming"
description: "Style the calendar with --vfc-* custom properties, in light and dark."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/essentials/theming"
---
# Theming

> Style the calendar with --vfc-* custom properties, in light and dark.

The calendar reads its colors, sizes and fonts from `--vfc-*` custom properties. Set one on the calendar, on any ancestor, or on `:root`. Pick a theme below and watch the tokens change.

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

## Where to set tokens

```css
:root {
  --vfc-radius: 4px;
}

.booking-form {
  --vfc-primary: #0d9488;
  --vfc-on-primary: #ffffff;
}
```

You can also set them on one calendar with a `style` or `class` attribute. Both land on the root element of the component.

```vue
<FunctionalCalendar style="--vfc-primary: #0d9488; --vfc-on-primary: #fff" is-date-picker />
```

A token on `:root` applies in light and dark. To change a value in dark mode only, scope it to `.vfc-dark`:

```css
.vfc-dark {
  --vfc-primary: #2dd4bf;
  --vfc-on-primary: #042f2e;
}
```

## Dark mode

`isDark` adds the `vfc-dark` class to the calendar and its input. The dark block changes colors and shadows only. Radius, spacing, fonts, `--vfc-day-size`, `--vfc-header-height` and `--vfc-transition` keep their values. `--vfc-today` and `--vfc-focus` default to `--vfc-primary`, so they follow the dark primary.

To follow your site theme, bind `isDark`:

```vue
<FunctionalCalendar :is-dark="colorMode.value === 'dark'" is-date-picker />
```

Props are read once, so re-key the calendar if the theme can change while it is mounted: `:key="isDark"`.

## Color tokens

<table>
<thead>
  <tr>
    <th>
      Token
    </th>
    
    <th>
      Light
    </th>
    
    <th>
      Dark
    </th>
    
    <th>
      Used for
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        --vfc-primary
      </code>
    </td>
    
    <td>
      <code>
        hsl(228 70% 50%)
      </code>
    </td>
    
    <td>
      <code>
        hsl(228 88% 68%)
      </code>
    </td>
    
    <td>
      Selected days, active controls
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-on-primary
      </code>
    </td>
    
    <td>
      <code>
        hsl(0 0% 100%)
      </code>
    </td>
    
    <td>
      <code>
        hsl(228 40% 8%)
      </code>
    </td>
    
    <td>
      Text on the primary color
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-bg
      </code>
    </td>
    
    <td>
      <code>
        hsl(0 0% 100%)
      </code>
    </td>
    
    <td>
      <code>
        hsl(228 24% 9%)
      </code>
    </td>
    
    <td>
      Calendar background
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-bg-raised
      </code>
    </td>
    
    <td>
      <code>
        --vfc-bg
      </code>
    </td>
    
    <td>
      <code>
        #1c1f27
      </code>
    </td>
    
    <td>
      Pickers and presets
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-text
      </code>
    </td>
    
    <td>
      <code>
        hsl(228 32% 12%)
      </code>
    </td>
    
    <td>
      <code>
        hsl(228 20% 96%)
      </code>
    </td>
    
    <td>
      Main text
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-text-muted
      </code>
    </td>
    
    <td>
      <code>
        #60636d
      </code>
    </td>
    
    <td>
      <code>
        #abacb1
      </code>
    </td>
    
    <td>
      Day names, neighbor month days
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-text-disabled
      </code>
    </td>
    
    <td>
      <code>
        #b4b5ba
      </code>
    </td>
    
    <td>
      <code>
        #595c62
      </code>
    </td>
    
    <td>
      Disabled days
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-border
      </code>
    </td>
    
    <td>
      <code>
        #e3e3e5
      </code>
    </td>
    
    <td>
      <code>
        #2c2f36
      </code>
    </td>
    
    <td>
      Dividers and outlines
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-border-strong
      </code>
    </td>
    
    <td>
      <code>
        #7e8189
      </code>
    </td>
    
    <td>
      <code>
        #82848a
      </code>
    </td>
    
    <td>
      Input and button borders
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-hover
      </code>
    </td>
    
    <td>
      <code>
        #f1f1f2
      </code>
    </td>
    
    <td>
      <code>
        #23262e
      </code>
    </td>
    
    <td>
      Hover background
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-primary-hover
      </code>
    </td>
    
    <td>
      <code>
        #2443c0
      </code>
    </td>
    
    <td>
      <code>
        #7a92f5
      </code>
    </td>
    
    <td>
      Hover on primary parts
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-range-mix
      </code>
    </td>
    
    <td>
      <code>
        12%
      </code>
    </td>
    
    <td>
      <code>
        26%
      </code>
    </td>
    
    <td>
      Share of primary in the range colors
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-range
      </code>
    </td>
    
    <td>
      <code>
        #e5e9fa
      </code>
    </td>
    
    <td>
      <code>
        #273154
      </code>
    </td>
    
    <td>
      Range fill
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-range-strong
      </code>
    </td>
    
    <td>
      <code>
        #dbe1f9
      </code>
    </td>
    
    <td>
      <code>
        #303c6b
      </code>
    </td>
    
    <td>
      Range ends and hover
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-today
      </code>
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
    </td>
    
    <td>
      Today marker
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-focus
      </code>
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
    </td>
    
    <td>
      Focus ring
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-danger
      </code>
    </td>
    
    <td>
      <code>
        hsl(0 70% 42%)
      </code>
    </td>
    
    <td>
      <code>
        hsl(0 84% 68%)
      </code>
    </td>
    
    <td>
      Remove badge on a range
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-on-danger
      </code>
    </td>
    
    <td>
      <code>
        hsl(0 0% 100%)
      </code>
    </td>
    
    <td>
      <code>
        hsl(228 40% 8%)
      </code>
    </td>
    
    <td>
      Text on the danger color
    </td>
  </tr>
</tbody>
</table>

## Shadow tokens

<table>
<thead>
  <tr>
    <th>
      Token
    </th>
    
    <th>
      Light
    </th>
    
    <th>
      Dark
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        --vfc-shadow-sm
      </code>
    </td>
    
    <td>
      <code>
        0 1px 2px hsl(228 40% 10% / 0.08)
      </code>
    </td>
    
    <td>
      <code>
        0 1px 2px hsl(228 50% 2% / 0.4)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-shadow-md
      </code>
    </td>
    
    <td>
      <code>
        0 4px 12px hsl(228 40% 10% / 0.1), 0 1px 3px hsl(228 40% 10% / 0.08)
      </code>
    </td>
    
    <td>
      <code>
        0 4px 12px hsl(228 50% 2% / 0.5), 0 1px 3px hsl(228 50% 2% / 0.4)
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-shadow-lg
      </code>
    </td>
    
    <td>
      <code>
        0 16px 32px hsl(228 40% 10% / 0.12), 0 4px 8px hsl(228 40% 10% / 0.08)
      </code>
    </td>
    
    <td>
      <code>
        0 16px 32px hsl(228 50% 2% / 0.6), 0 4px 8px hsl(228 50% 2% / 0.5)
      </code>
    </td>
  </tr>
</tbody>
</table>

## Shape, spacing and type tokens

These are the same in light and dark.

<table>
<thead>
  <tr>
    <th>
      Token
    </th>
    
    <th>
      Default
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        --vfc-radius-sm
      </code>
      
      , <code>
        --vfc-radius
      </code>
      
      , <code>
        --vfc-radius-lg
      </code>
    </td>
    
    <td>
      <code>
        6px
      </code>
      
      , <code>
        8px
      </code>
      
      , <code>
        12px
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-space-1
      </code>
      
       to <code>
        --vfc-space-5
      </code>
    </td>
    
    <td>
      <code>
        4px
      </code>
      
      , <code>
        8px
      </code>
      
      , <code>
        12px
      </code>
      
      , <code>
        16px
      </code>
      
      , <code>
        24px
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-font
      </code>
    </td>
    
    <td>
      <code>
        ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-font-size-xs
      </code>
      
      , <code>
        -sm
      </code>
      
      , <code>
        -md
      </code>
    </td>
    
    <td>
      <code>
        12px
      </code>
      
      , <code>
        14px
      </code>
      
      , <code>
        16px
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-font-weight
      </code>
      
      , <code>
        -medium
      </code>
      
      , <code>
        -strong
      </code>
    </td>
    
    <td>
      <code>
        400
      </code>
      
      , <code>
        500
      </code>
      
      , <code>
        600
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-day-size
      </code>
    </td>
    
    <td>
      <code>
        36px
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-header-height
      </code>
    </td>
    
    <td>
      <code>
        40px
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-transition
      </code>
    </td>
    
    <td>
      <code>
        150ms ease
      </code>
    </td>
  </tr>
</tbody>
</table>

## Derived colors

Where the browser supports `color-mix()`, eight tokens derive from three base colors, so changing `--vfc-primary`, `--vfc-bg` or `--vfc-text` recolors the whole calendar.

<table>
<thead>
  <tr>
    <th>
      Token
    </th>
    
    <th>
      Derived as
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        --vfc-text-muted
      </code>
    </td>
    
    <td>
      <code>
        --vfc-text
      </code>
      
       68% over <code>
        --vfc-bg
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-text-disabled
      </code>
    </td>
    
    <td>
      <code>
        --vfc-text
      </code>
      
       32% over <code>
        --vfc-bg
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-border
      </code>
    </td>
    
    <td>
      <code>
        --vfc-text
      </code>
      
       12% over <code>
        --vfc-bg
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-border-strong
      </code>
    </td>
    
    <td>
      <code>
        --vfc-text
      </code>
      
       55% over <code>
        --vfc-bg
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-hover
      </code>
    </td>
    
    <td>
      <code>
        --vfc-text
      </code>
      
       7% over <code>
        --vfc-bg
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-primary-hover
      </code>
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
      
       86% over <code>
        --vfc-text
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-range
      </code>
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
      
       at <code>
        --vfc-range-mix
      </code>
      
       over <code>
        --vfc-bg
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        --vfc-range-strong
      </code>
    </td>
    
    <td>
      <code>
        --vfc-primary
      </code>
      
       at 1.4 times <code>
        --vfc-range-mix
      </code>
      
       over <code>
        --vfc-bg
      </code>
    </td>
  </tr>
</tbody>
</table>

In dark mode, `--vfc-bg-raised` also derives, as `--vfc-text` 5% over `--vfc-bg`.

## Browsers without color-mix

Safari below 16.2 and other browsers without `color-mix()` use the fixed values from the tables above. They match the default colors only. If you change `--vfc-primary`, `--vfc-bg` or `--vfc-text`, override the derived tokens together:

```css
.my-calendar {
  --vfc-primary: #0d9488;
  --vfc-primary-hover: #0f766e;
  --vfc-range: #ccfbf1;
  --vfc-range-strong: #99f6e4;
  --vfc-text-muted: #5b6770;
  --vfc-text-disabled: #b3bcc2;
  --vfc-border: #e2e8ec;
  --vfc-border-strong: #7b8a94;
  --vfc-hover: #f0f4f6;
}
```

Add `--vfc-bg-raised` under `.vfc-dark` as well. `--vfc-range-mix` has no effect in these browsers.

## Class overrides

The `vfc-*` class names are the same as in 2.x, so CSS overrides written for 2.x keep working. Tokens and class rules mix freely.


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
