---
title: "Changelog"
description: "Release notes for Vue Functional Calendar."
canonical_url: "https://manukminasyan.github.io/vue-functional-calendar/community/changelog"
---
# Changelog

> Release notes for Vue Functional Calendar.

All notable changes to this project are documented here.

## 3.1.0 (unreleased) - 2026-10-18

The `3.0.0` release on npm was a Vue 2 build. 3.1.0 is the first Vue 3 release. Vue 2 apps stay on `^2.10.0`. See [MIGRATION.md](https://manukminasyan.github.io/vue-functional-calendar/getting-started/migration).

### Added

- A Vue 3 build with ESM, CJS and UMD bundles, an `exports` map and type declarations.
- `vue-functional-calendar/style.css`, the stylesheet as a separate import.
- Theming with `--vfc-*` custom properties, and a dark mode through `isDark`.
- Keyboard navigation and an ARIA date grid, with focus management for modal calendars.
- The `locale` prop, which derives day names, month names and the first day of the week from `Intl`.
- The `labels` prop, which translates every UI string.
- The `presets` prop, with six built-in quick ranges and custom ranges.
- A documentation site with live examples and a playground.

### Changed

- `value` and `input` became `modelValue` and `update:modelValue`. Templates that use `v-model` need no change.
- The plugin installs with `app.use(FunctionalCalendar, options)`.
- `vue` is a peer dependency, `^3.3.0`. The package has no runtime dependencies.
- The SCSS `!default` variables are replaced by `--vfc-*` tokens.
- The default look is redesigned. The `vfc-*` class names are unchanged.
- Deep imports from `src/` no longer resolve. Import from `vue-functional-calendar`.
- The slide transition classes follow Vue 3: `.vfc-calendar-slide-*-enter` is now `-enter-from`. See [MIGRATION.md](MIGRATION).

### Fixed

- The badges of multiple date ranges count from 1, as the day labels do. The first range showed 0 at its start and -1 at its end.
- Week numbers with `sundayStart` follow ISO numbering of each row's Thursday. They were one lower.
- Typed dates are validated. `31/02/2026` is rejected, padded dates such as `05/03/2026` are accepted, and a value commits only when the date is complete.
- A pasted or autofilled ISO date is reordered to `dateFormat`, and pasted text that is not a date stays as pasted.
- Typing with an input method editor no longer breaks the composition, and full-width digits are converted when it ends.
- Text typed after the date in a `displayTimeInput` field is kept, and the input is long enough to hold the time.
- ArrowDown no longer opens the calendar while an IME composes, or when the input already handled the key.
- A navigation arrow slot that renders a focusable component is no longer wrapped in a second button.
- A model that is `null`, `{}`, readonly, frozen or missing keys such as `dateRange` no longer breaks the calendar. A plain object keeps being your object and gets the missing keys filled in. Assigning a new `{}` object clears the selection (#75, #117, #132).
- A parent that binds a model holding only `multipleDateRange` can pick ranges without an `Invalid Data Range` error. That model is read, never written to.
- A preloaded `v-model` survives `newCurrentDate`, and a server render shows the bound selection.
- `disabledDates`, `enabledDates` and `markedDates` accept dates with a leading zero, such as `05/10/2026` or `2026-10-05`. They were ignored (#153, #40).
- A `dateRange` in the model and a `markedDateRange` written with leading zeros, such as `08/10/2026`, mark their start, end and days. They were ignored.
- A `multipleDateRange` written with leading zeros, such as `06/10/2026`, marks its start, end and days and shows its end button. A parent that sets `dateRange.start` or `dateRange.end` to `null` no longer makes the calendar throw.
- Delete removes a multiple date range whose open start is written with a leading zero, and a preset shows as pressed when the selected date or range is written with leading zeros.
- In a `isMultipleDateRange` calendar the range band no longer covers the numbers of the days inside a range.
- The `minSelDays` and `maxSelDays` hover preview counts whole calendar days, so it no longer shows one day too many or too few when the range crosses a daylight saving change.
- An empty `{}` v-model receives typed dates, time picker changes and cleared values.
- The calendar no longer adds `inRange` to `String.prototype` or `getWeekNumber` to `Date.prototype`, and two multi-range calendars with different `dateFormat` values on one page each draw their ranges with their own format.
- Side-by-side calendars could get the same internal key and reuse the wrong grid after navigation. Each grid now gets a unique key.
- A `locale` on an engine without `Intl.Locale` no longer throws while mounting. The first day of the week falls back to the default.
- `minSelDays` and `maxSelDays` keep the times of a range with `withTimePicker`, and the time picker no longer throws on a range edge without a time.
- The `minSelDays` extension of a range stops at `limits` and before disabled days instead of running past them.
- `disabledDates` and `enabledDates` apply to range clicks with `withTimePicker`. A disabled date was selectable and an enabled one was rejected.
- A rejected click on a `withTimePicker` range no longer rewrites the day, so a disabled date stays disabled and a second click cannot select it.
- A modal with `isAutoCloseable` and `withTimePicker` stays open for the time picker and closes when the time picker is closed (#103, #49).
- A modal that loses focus with the time picker open reopens on the day grid instead of the time picker.
- With `isMultipleDateRange` and `minSelDays`, starting the next range no longer rewrites the range that was just finished.
- `withTimePicker` with `isMultipleDateRange` no longer opens a time picker that edited the empty `dateRange`. The combination is unsupported and the ranges hold plain dates.
- An invalid initial `multipleDateRange` model raises `Invalid Data Range` through the app error handler, which Vue rethrows in development when none is set. With a handler, or in production, the calendar still renders and follows later valid models.
- Picking a month or year with several calendars keeps them consecutive, updates `currentDate`, emits the model and re-checks `limits`. It emits `changedMonth` when the month of the first visible calendar changes and `changedYear` when its year changes, each with the first visible month as its date, so a view that `limits` clamp reports what is on screen and an unchanged view reports nothing.
- Every navigation move stays inside `limits`: the year arrows, `changeMonthStep`, `changeYearStep`, the month and year pickers and `ChooseDate` no longer overshoot, and the right arrow of a multi-calendar picker disables before a month past `max` shows. `ChooseDate` returns `false` when the month is outside `limits`.
- A multi-calendar picker no longer shows a month after `limits.max`. The view starts early enough that the last calendar is the `max` month, and keeps all `calendarsCount` calendars unless the limits span fewer months (#114).
- With `isSeparately`, each calendar disables its own arrows at `limits` by its own month. They followed the first calendar before.
- The previous and next month arrows emit `changedYear` when the visible year changes, as the year arrows do. A keyboard move across a year boundary emits `changedYear` too.
- `markedDates`, `markedDateRange`, `disabledDates`, `enabledDates`, `disabledDayNames`, `limits`, `calendarsCount` and `isDark` follow later changes, as props and inside `configs`. A list that arrives after mount, a replaced list and an edited reactive list all update the calendar, and an equal object created again changes nothing. With `isSeparately`, a `limits` or `calendarsCount` change keeps the month of each grid (#2, #65, #78, #97, #101, #109, #142).
- The tags input of `isMultipleDatePicker` removes a date with a labelled `<button>` (`labels.removeDate`) instead of an unnamed link, shows the date as text instead of HTML, names its input with `labels.addDate`, and returns focus to the input after a removal.
- The inputs of a modal calendar are `role="combobox"` with `aria-controls` pointing at the dialog and an `aria-label` from `labels`. A plain textbox with `aria-expanded` and a name from `title` alone failed axe.
- A screen reader announces the visible months when they change, through a visually hidden `aria-live="polite"` region. The calendar's root no longer takes focus with a nameless `tabindex="0"`.
- Today has `aria-current="date"` and "Today" in its label. The first and last day of a range end their label with "range start" or "range end", and the number badge of a multiple date range is drawn from a `data-number` attribute so the label of a range day contains its visible text. New labels: `today`, `rangeStart`, `rangeEnd`.
- Week numbers are named "Week 42" for a screen reader (`labels.week`), the start and end toggles of the time picker report `aria-pressed`, and the time line no longer carries a fixed `id="time-line"` that duplicated across calendars.
- The month and year picker is a named `role="group"` (`labels.chooseMonth`, `labels.chooseYear`), its year is a `<button class="vfc-top-date">` instead of an `<h2>`, and it closes when focus moves out of it, so Tab no longer walks into the grid hidden beneath it.
- In a right to left page ArrowLeft and ArrowRight move to the day on that side, the navigation chevrons mirror under `dir="rtl"`, and the range bands, their rounded ends, the week number divider and the range badges sit on the correct side. Left to right rendering is unchanged.
- The type declarations compile on Vue 3.3 and 3.4. They imported `EmitsToProps` and `PublicProps`, which exist from Vue 3.5.
- `PreMonth`, `NextMonth`, `PreYear`, `NextYear` and `ChooseDate` are typed as returning `boolean`, and `configs` and the plugin options reject the options that are always props, such as `displayTimeInput` and `newCurrentDate`, which were ignored there.
- `package.json` is importable through the `exports` map, and jsDelivr serves the UMD build.
- `placeholder: true` no longer throws while rendering the inputs. A placeholder that is not a string falls back to the `dateFormat`.
- In forced colors modes (Windows high contrast) the selected days, range ends, days inside a range, today, the selected preset, month, year and time, and the range badges stay visible. They were drawn with a background colour only and disappeared.
- With `isSeparately`, a calendar added when `calendarsCount` grows stays inside `limits` instead of showing a month after `limits.max`.
- In forced colors modes the close and remove crosses stay visible, and a disabled today keeps its line-through next to the underline.

## 2.10.0 - 2026-10-17

The last Vue 2 line. It ships a built bundle and types.

### Added

- TypeScript declarations in `index.d.ts`.
- `unpkg` and `jsdelivr` entries that point at the UMD build.

### Changed

- `vue` moved to `peerDependencies`, and `core-js` moved to `devDependencies`, because the polyfills are inlined at build time.
- The build uses Dart Sass instead of `node-sass`, which no longer installs on current Node.
- The package builds before it is published.

### Fixed

- `main` pointed at `index.js`, which imports the raw `.vue` sources, so every consumer had to compile the SCSS. It now points at the built bundle, so Vite projects without Sass work (#169).
- TypeScript reported TS7016 for the missing declarations (#169).


## Sitemap

See the full [sitemap](https://manukminasyan.github.io/vue-functional-calendar/sitemap.md) for all pages.
