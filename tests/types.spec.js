import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('type declarations', () => {
  it('ships the same declarations for ESM and CJS consumers', () => {
    expect(read('../index.d.cts')).toBe(read('../index.d.ts'))
  })

  it('points each export condition at its own declaration file', () => {
    const { exports, files } = JSON.parse(read('../package.json'))

    expect(exports['.'].import.types).toBe('./index.d.ts')
    expect(exports['.'].require.types).toBe('./index.d.cts')
    expect(files).toEqual(expect.arrayContaining(['index.d.ts', 'index.d.cts']))
  })
})
