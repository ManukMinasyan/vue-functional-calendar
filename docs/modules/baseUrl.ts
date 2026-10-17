import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
    meta: { name: 'base-url' },
    setup(_options, nuxt) {
        nuxt.hook('nitro:init', (nitro) => {
            nitro.hooks.hook('prerender:done', async () => {
                const origin = (nuxt.options.site as { url?: string }).url
                const baseURL = nuxt.options.app.baseURL
                const segment = baseURL.split('/')[1]
                const publicDir = nitro.options.output.publicDir
                const pattern = new RegExp(`${origin}/(?!${segment}/)`, 'g')
                const files = [
                    'llms.txt',
                    'llms-full.txt',
                    ...(await readdir(join(publicDir, 'raw'), { recursive: true }))
                        .filter((file) => file.endsWith('.md'))
                        .map((file) => join('raw', file)),
                ]

                for (const file of files) {
                    const path = join(publicDir, file)
                    const text = await readFile(path, 'utf8')

                    await writeFile(path, text.replace(pattern, `${origin}${baseURL}`))
                }
            })
        })
    },
})
