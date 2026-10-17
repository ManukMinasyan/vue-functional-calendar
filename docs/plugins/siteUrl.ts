import { joinURL, withoutTrailingSlash } from 'ufo'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const { baseURL } = config.app
    const siteUrl = withoutTrailingSlash(joinURL(useSiteConfig().url, baseURL))

    updateSiteConfig({ url: siteUrl })

    if (config.public.agentDiscovery) {
        config.public.agentDiscovery.siteUrl = siteUrl
    }
})
