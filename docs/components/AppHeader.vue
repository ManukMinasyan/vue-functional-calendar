<script setup lang="ts">
import { useDocusI18n } from '#imports'

const appConfig = useAppConfig()
const site = useSiteConfig()

const { localePath, isEnabled, locales } = useDocusI18n()
const { currentVersion, isOldVersion, loadVersions } = useVersions()

onMounted(() => loadVersions())

</script>

<template>
  <div class="sticky top-0 z-50">
    <!-- Version Warning Banner -->
    <div
      v-if="isOldVersion"
      class="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-4 py-2 text-center text-sm border-b border-amber-200 dark:border-amber-800"
    >
      You are viewing documentation for Vue Functional Calendar {{ currentVersion }}.
      <a
        href="/vue-functional-calendar/"
        class="underline font-medium hover:text-amber-900 dark:hover:text-amber-100"
      >
        View the latest version &rarr;
      </a>
    </div>

    <!-- Original Docus Header -->
    <UHeader
      :ui="{ center: 'flex-1' }"
      :to="localePath('/')"
      :title="appConfig.header?.title || site.name"
    >
      <AppHeaderCenter />

      <template #title>
        <AppHeaderLogo class="h-6 w-auto shrink-0" />
      </template>

      <template #right>
        <AppVersionSwitcher />
        <AppHeaderCTA />

        <template v-if="isEnabled && locales.length > 1">
          <ClientOnly>
            <LanguageSelect />

            <template #fallback>
              <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
            </template>
          </ClientOnly>

          <USeparator
            orientation="vertical"
            class="h-8"
          />
        </template>

        <UContentSearchButton class="lg:hidden" />

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-simple-icons-github"
          :to="appConfig.github.url"
          target="_blank"
          aria-label="Vue Functional Calendar on GitHub"
        />

        <ClientOnly>
          <UColorModeButton />

          <template #fallback>
            <div class="h-8 w-8 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md" />
          </template>
        </ClientOnly>

      </template>

      <template #toggle="{ open, toggle }">
        <IconMenuToggle
          :open="open"
          class="lg:hidden"
          @click="toggle"
        />
      </template>

      <template #body>
        <AppHeaderBody />
      </template>
    </UHeader>
  </div>
</template>
