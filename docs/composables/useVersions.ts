interface Version {
    version: string
    title: string
    path: string
    branch: string
    isLatest: boolean
}

const versions = ref<Version[]>([])
const isLoaded = ref(false)
const isLoading = ref(false)

export function useVersions() {
    const config = useRuntimeConfig()
    const currentVersion = config.public.docsVersion || '2.x'

    async function loadVersions() {
        if (isLoaded.value || isLoading.value) return
        isLoading.value = true

        try {
            const res = await fetch('/vue-functional-calendar/versions.json')
            if (res.ok) {
                versions.value = await res.json()
            }
        } catch (e) {
            console.warn('Failed to load versions.json:', e)
        } finally {
            isLoaded.value = true
            isLoading.value = false
        }
    }

    const latestVersion = computed(() =>
        versions.value.find(v => v.isLatest)
    )

    const currentVersionInfo = computed(() =>
        versions.value.find(v => v.version === currentVersion)
    )

    const isOldVersion = computed(() => {
        if (!isLoaded.value) return false
        return currentVersionInfo.value?.isLatest === false
    })

    const currentTitle = computed(() =>
        currentVersionInfo.value?.title || currentVersion
    )

    return {
        versions,
        currentVersion,
        currentTitle,
        latestVersion,
        isOldVersion,
        isLoaded,
        loadVersions,
    }
}
