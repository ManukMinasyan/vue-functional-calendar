import { fileURLToPath } from 'node:url'

const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const siteOrigin = process.env.NUXT_SITE_URL || 'https://manukminasyan.github.io'
const docsVersion = process.env.DOCS_VERSION || '3.x'
const librarySource = fileURLToPath(new URL('../index.js', import.meta.url))

export default defineNuxtConfig({
    extends: 'docus',
    modules: ['@nuxt/image', '@nuxt/scripts'],
    devtools: { enabled: true },
    ignore: ['plans/**'],
    site: {
        name: 'Vue Functional Calendar',
        url: siteOrigin,
    },
    runtimeConfig: {
        public: {
            docsVersion,
        },
    },
    appConfig: {
        header: {
            logo: {
                favicon: `${baseURL}favicon.svg`,
            },
        },
        docus: {
            url: `${siteOrigin}${baseURL}`,
            image: `${baseURL}img/calendar-preview.png`,
            header: {
                logo: {
                    light: `${baseURL}logo.png`,
                    dark: `${baseURL}logo.png`,
                },
            },
        },
        seo: {
            ogImage: `${baseURL}img/calendar-preview.png`,
        },
    },
    app: {
        baseURL,
        buildAssetsDir: 'assets',
    },
    image: {
        provider: 'none',
    },
    vite: {
        resolve: {
            alias: { 'vue-functional-calendar': librarySource },
            dedupe: ['vue'],
        },
        server: {
            fs: { allow: ['..'] },
        },
    },
    content: {
        build: {
            markdown: {
                highlight: {
                    langs: ['vue', 'js', 'ts', 'bash', 'json', 'css', 'html'],
                },
            },
        },
    },
    robots: { robotsTxt: false },
    llms: {
        domain: siteOrigin,
    },
    nitro: {
        preset: 'github_pages',
    },
})
