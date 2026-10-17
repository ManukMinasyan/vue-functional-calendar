<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: [Object, String], default: null },
  height: { type: Number, default: 0 },
  label: { type: String, default: 'Bound value' }
})

const slots = useSlots()
const bound = computed(() =>
  typeof props.value === 'string'
    ? props.value
    : JSON.stringify(props.value, null, 2)
)
const floats = computed(() => props.height > 0)
</script>

<template>
  <div class="demo-frame my-6 rounded-lg border border-default bg-default shadow-xs" :class="{ 'overflow-hidden': !floats }">
    <div
      class="demo-frame__stage relative flex justify-center bg-elevated/50 p-6"
      :class="floats ? 'z-10 focus-within:z-20 min-h-28 rounded-t-lg' : 'overflow-x-auto'"
    >
      <slot name="demo" />
    </div>
    <div v-if="value !== null" class="border-t border-default">
      <div class="px-4 pt-2 text-xs font-medium uppercase tracking-wide text-muted">{{ label }}</div>
      <ClientOnly>
        <pre
          class="demo-frame__value m-0 max-h-48 overflow-auto bg-transparent px-4 pb-3 pt-1 font-mono text-xs leading-5 text-toned"
          :aria-label="label"
        >{{ bound }}</pre>
        <template #fallback>
          <pre class="demo-frame__value m-0 h-24 px-4" aria-hidden="true" />
        </template>
      </ClientOnly>
    </div>
    <div v-if="slots.default" class="demo-frame__code border-t border-default [&_pre]:!my-0 [&>div]:!my-0 [&_.group]:!my-0 [&_.group]:!rounded-none [&_.group]:!border-0">
      <slot />
    </div>
  </div>
</template>
