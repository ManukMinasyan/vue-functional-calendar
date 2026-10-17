<script setup lang="ts">
const { versions, currentVersion, currentTitle, loadVersions } = useVersions()

onMounted(() => loadVersions())

function switchVersion(version: { version: string; path: string }): void {
    if (version.version !== currentVersion) {
        window.location.href = version.path
    }
}
</script>

<template>
    <div v-if="versions.length > 1" class="relative" @click.stop>
        <UPopover>
            <UButton
                variant="ghost"
                size="sm"
                :label="currentTitle"
                trailing-icon="i-lucide-chevron-down"
            />
            <template #content>
                <div class="p-1">
                    <button
                        v-for="version in versions"
                        :key="version.version"
                        class="w-full px-3 py-2 text-left text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                        :class="{ 'font-medium text-primary': version.version === currentVersion }"
                        @click="switchVersion(version)"
                    >
                        {{ version.title }}
                    </button>
                </div>
            </template>
        </UPopover>
    </div>
    <UBadge v-else-if="currentVersion" variant="subtle" color="neutral">{{ currentVersion }}</UBadge>
</template>
