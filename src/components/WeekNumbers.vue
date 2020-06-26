<template>
  <div class="vfc-day vfc-week-number">
    <span class="vfc-span-day"> {{ number }} </span>
  </div>
</template>

<script>
export default {
  name: 'WeekNumbers',
  props: {
    number: {
      tyoe: Number,
      required: true
    }
  }
}
</script>

<style scoped></style>
