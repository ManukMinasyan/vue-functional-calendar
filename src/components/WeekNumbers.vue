<template>
  <div
    class="vfc-day vfc-week-number"
    :style="{ borderRightColor: borderColor }"
  >
    <span class="vfc-span-day">{{ number }}</span>
  </div>
</template>

<script>
export default {
  name: 'WeekNumbers',
  props: {
    number: {
      tyoe: Number,
      required: true
    },
    borderColor: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
