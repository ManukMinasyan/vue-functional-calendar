# Changelog

All notable changes to this project are documented here.

## 3.1.0 (unreleased) - 2026-10-18

The `3.0.0` release on npm was a Vue 2 build. 3.1.0 is the first Vue 3 release. Vue 2 apps stay on `^2.10.0`. See [MIGRATION.md](MIGRATION.md).

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

### Fixed

- Week numbers with `sundayStart` follow ISO numbering of each row's Thursday. They were one lower.
- Typed dates are validated. `31/02/2026` is rejected, padded dates such as `05/03/2026` are accepted, and a value commits only when the date is complete.
- A pasted or autofilled ISO date is reordered to `dateFormat`, and pasted text that is not a date stays as pasted.
- Typing with an input method editor no longer breaks the composition, and full-width digits are converted when it ends.
- Text typed after the date in a `displayTimeInput` field is kept, and the input is long enough to hold the time.
- ArrowDown no longer opens the calendar while an IME composes, or when the input already handled the key.
- A navigation arrow slot that renders a focusable component is no longer wrapped in a second button.
- A model that is `null`, `{}` or missing keys such as `dateRange` no longer breaks the calendar. The calendar fills in the missing keys on your object, and resetting the model to `{}` clears the selection (#75, #117, #132).
- A parent that binds a model holding only `multipleDateRange` can pick ranges without an `Invalid Data Range` error.
- An empty `{}` v-model receives typed dates, time picker changes and cleared values.
- The calendar no longer adds `inRange` to `String.prototype` or `getWeekNumber` to `Date.prototype`, and two multi-range calendars with different `dateFormat` values on one page each draw their ranges with their own format.
- A `locale` on an engine without `Intl.Locale` no longer throws while mounting. The first day of the week falls back to the default.
- `minSelDays` and `maxSelDays` keep the times of a range with `withTimePicker`, and the time picker no longer throws on a range edge without a time.

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
