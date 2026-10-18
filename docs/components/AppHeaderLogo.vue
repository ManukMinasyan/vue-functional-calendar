<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
    <span class="flex items-center gap-2.5">
        <UColorModeImage
            :light="appConfig.docus?.header?.logo?.light"
            :dark="appConfig.docus?.header?.logo?.dark"
            alt=""
            class="size-7 shrink-0"
        />
        <span class="sr-only text-base font-semibold tracking-tight text-highlighted sm:not-sr-only">
            {{ appConfig.docus?.title || 'Vue Functional Calendar' }}
        </span>
    </span>
</template>
