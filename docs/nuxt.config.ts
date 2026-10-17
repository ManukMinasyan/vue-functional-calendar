const baseURL = process.env.NUXT_APP_BASE_URL || '/'
const docsVersion = process.env.DOCS_VERSION || '2.x'

export default defineNuxtConfig({
    extends: 'docus',
    modules: ['@nuxt/image', '@nuxt/scripts'],
    devtools: { enabled: true },
    site: {
        name: 'Vue Functional Calendar',
        url: process.env.NUXT_SITE_URL || 'https://manukminasyan.github.io',
    },
    runtimeConfig: {
        public: {
            docsVersion,
        },
    },
    appConfig: {
        docus: {
            url: `https://manukminasyan.github.io${baseURL}`,
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
        head: {
            link: [
                {
                    rel: 'icon',
                    type: 'image/png',
                    href: baseURL + 'logo.png',
                },
            ],
        },
    },
    image: {
        provider: 'none',
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
    llms: {
        domain: `https://manukminasyan.github.io${baseURL.replace(/\/$/, '')}`,
    },
    nitro: {
        preset: 'github_pages',
    },
})
