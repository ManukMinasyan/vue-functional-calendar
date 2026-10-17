<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
    <UColorModeImage
        v-if="appConfig.docus?.header?.logo?.dark || appConfig.docus?.header?.logo?.light"
        :light="appConfig.docus?.header?.logo?.light || appConfig.docus?.header?.logo?.dark"
        :dark="appConfig.docus?.header?.logo?.dark || appConfig.docus?.header?.logo?.light"
        :alt="appConfig.docus?.header?.logo?.alt || appConfig.docus?.title"
        class="h-8 w-auto shrink-0"
    />
    <span v-else class="text-lg font-semibold">
        {{ appConfig.docus?.title || 'Vue Functional Calendar' }}
    </span>
</template>
