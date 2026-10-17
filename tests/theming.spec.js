import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import FunctionalCalendar from '../index.js'
import { FIXED_DATE } from './helpers.js'

const sourceFiles = dir =>
  readdirSync(join(process.cwd(), dir)).map(name =>
    join(process.cwd(), dir, name)
  )

const stylesheetSources = () =>
  [...sourceFiles('src/assets/scss'), ...sourceFiles('src/components')].map(
    file => readFileSync(file, 'utf8')
  )

describe('theme tokens', () => {
  it('never declares a public --vfc property in the library styles', () => {
    const declarations = stylesheetSources().flatMap(
      source => source.match(/--vfc-[\w-]+\s*:/g) || []
    )

    expect(declarations).toEqual([])
  })

  it('reads every public --vfc property through a private alias', () => {
    const tokens = readFileSync(
      join(process.cwd(), 'src/assets/scss/tokens.scss'),
      'utf8'
    )

    expect(tokens).toMatch(/--_vfc-primary:\s*var\(--vfc-primary,/)
    expect(tokens).toMatch(/--_vfc-bg:\s*var\(--vfc-bg,/)
  })

  it('renders inside an ancestor that sets a token', () => {
    const wrapper = mount(
      {
        render: () =>
          h(
            'div',
            { id: 'theme', style: '--vfc-primary: rgb(255, 0, 0)' },
            h(FunctionalCalendar, { newCurrentDate: FIXED_DATE, isDark: true })
          )
      },
      { attachTo: document.body }
    )

    const themed = wrapper.find('#theme')

    expect(themed.attributes('style')).toContain('--vfc-primary')
    expect(themed.find('.vfc-main-container.vfc-dark').exists()).toBe(true)
  })
})
