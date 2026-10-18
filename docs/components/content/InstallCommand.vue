<script setup>
import { ref } from 'vue'

const command = 'npm i vue-functional-calendar'
const copied = ref(false)

const copy = async () => {
  await navigator.clipboard.writeText(command)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <UButton
    color="neutral"
    variant="outline"
    size="xl"
    class="font-mono text-sm whitespace-nowrap"
    :ui="{ trailingIcon: 'size-4 text-dimmed' }"
    :trailing-icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
    :aria-label="copied ? 'Copied install command' : `Copy ${command}`"
    @click="copy"
  >
    <span class="text-dimmed">$</span> {{ command }}
  </UButton>
</template>
