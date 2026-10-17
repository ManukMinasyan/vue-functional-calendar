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
})
