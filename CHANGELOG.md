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
