import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('type declarations', () => {
  it('ships the same declarations for ESM and CJS consumers', () => {
    expect(read('../index.d.cts')).toBe(read('../index.d.ts'))
  })

  it('types the named export with install, like the default export', () => {
    const declarations = read('../index.d.ts')

    expect(declarations).toContain(
      'export const FunctionalCalendar: FunctionalCalendarPlugin'
    )
    expect(declarations).toContain(
      'declare const plugin: FunctionalCalendarPlugin'
    )
    expect(declarations).toMatch(/FunctionalCalendarPlugin = [\s\S]*install\(/)
  })

  it('types the names props in both declaration files', () => {
    ;['../index.d.ts', '../index.d.cts'].forEach(path => {
      expect(read(path)).toContain('dayNames?: string[]')
      expect(read(path)).toContain('monthNames?: string[]')
      expect(read(path)).toContain('shortMonthNames?: string[]')
    })
  })

  it('points each export condition at its own declaration file', () => {
    const { exports, files } = JSON.parse(read('../package.json'))

    expect(exports['.'].import.types).toBe('./index.d.ts')
    expect(exports['.'].require.types).toBe('./index.d.cts')
    expect(files).toEqual(expect.arrayContaining(['index.d.ts', 'index.d.cts']))
  })

  it('imports only types that exist in Vue 3.3', () => {
    const declarations = read('../index.d.ts')

    expect(declarations).not.toMatch(/\bEmitsToProps\b/)
    expect(declarations).not.toMatch(/\bPublicProps\b/)
  })

  it('types the navigation methods as returning a boolean', () => {
    const declarations = read('../index.d.ts')

    ;['PreMonth', 'NextMonth', 'PreYear', 'NextYear', 'ChooseDate'].forEach(
      method => {
        expect(declarations).toMatch(
          new RegExp(`${method}\\([^)]*\\): boolean`)
        )
      }
    )
  })

  it('shares one configurable options type between configs and the plugin', () => {
    const declarations = read('../index.d.ts')

    expect(declarations).toContain(
      'configs?: FunctionalCalendarConfigurableOptions'
    )
    expect(declarations).toContain(
      'options?: FunctionalCalendarConfigurableOptions'
    )
  })

  it('leaves the props that configs ignores out of the configurable options', () => {
    const declarations = read('../index.d.ts')
    const [, omitted] = declarations.match(
      /FunctionalCalendarConfigurableOptions = Partial<\s*Omit<\s*FunctionalCalendarProps,([^>]*)>/
    )
    const keys = [...omitted.matchAll(/'(\w+)'/g)].map(match => match[1])

    expect(keys.sort()).toEqual(
      [
        'activeHours',
        'activeMinutes',
        'alwaysUseDefaultClasses',
        'borderColor',
        'canClearRange',
        'configs',
        'displayTimeInput',
        'modelValue',
        'newCurrentDate'
      ].sort()
    )
  })

  it('lets jsDelivr serve the UMD build and exposes package.json', () => {
    const { jsdelivr, exports } = JSON.parse(read('../package.json'))

    expect(jsdelivr).toBe('./dist/vue-functional-calendar.umd.js')
    expect(exports['./package.json']).toBe('./package.json')
  })
})
