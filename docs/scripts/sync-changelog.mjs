import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(new URL('../../CHANGELOG.md', import.meta.url))
const target = fileURLToPath(
    new URL('../content/5.community/2.changelog.md', import.meta.url),
)
const body = readFileSync(source, 'utf8')
    .replace(/^# .*\n+/, '')
    .replaceAll('](MIGRATION.md)', '](/getting-started/migration)')

writeFileSync(
    target,
    `---
title: Changelog
description: Release notes for Vue Functional Calendar.
navigation:
  icon: i-lucide-history
---

${body}`,
)
