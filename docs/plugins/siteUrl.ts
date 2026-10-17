import { joinURL, withoutTrailingSlash } from 'ufo'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    const route = useRoute()
    const { baseURL } = config.app
    const origin = withoutTrailingSlash(useSiteConfig().url)
    const siteUrl = origin.endsWith(withoutTrailingSlash(baseURL))
        ? origin
        : withoutTrailingSlash(joinURL(origin, baseURL))

    if (config.public.agentDiscovery) {
        config.public.agentDiscovery.siteUrl = siteUrl
    }

    useSeoMeta(
        { ogUrl: () => withoutTrailingSlash(joinURL(siteUrl, route.path)) },
        { tagPriority: 'critical' },
    )
})
