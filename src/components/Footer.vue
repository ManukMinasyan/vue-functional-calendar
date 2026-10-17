<template>
  <div class="footerCon">
    <slot name="cleaner"></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped lang="scss">
.footerCon {
  display: flex;
  justify-content: space-between;
  margin: var(--vfc-space-4) 0 0;
}
</style>
