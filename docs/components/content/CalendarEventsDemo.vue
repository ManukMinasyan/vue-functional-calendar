<script setup>
import { computed, ref } from 'vue'
import { FunctionalCalendar } from 'vue-functional-calendar'

const colorMode = useColorMode()
const value = ref(calendarModel())
const clicked = ref('')
const isDark = computed(() => colorMode.value === 'dark')

const now = new Date()
const format = day => `${day}/${now.getMonth() + 1}/${now.getFullYear()}`
const events = [
  { id: 1, title: 'Design review', date: format(8), tone: 'blue' },
  { id: 2, title: 'Release', date: format(15), tone: 'green' },
  { id: 3, title: 'Retro', date: format(15), tone: 'amber' },
  { id: 4, title: 'Planning', date: format(22), tone: 'blue' }
]
const eventsOn = date => events.filter(event => event.date === date)
</script>

<template>
  <DemoFrame :value="clicked || '(click a day)'" label="Last dayClicked payload">
    <template #demo>
      <ClientOnly>
        <FunctionalCalendar
          :key="String(isDark)"
          v-model="value"
          class="events-calendar"
          title-position="left"
          arrows-position="right"
          :is-dark="isDark"
          @day-clicked="clicked = JSON.stringify($event, null, 2)"
        >
          <template #default="{ day }">
            <div class="events-day">
              <span class="events-day__number">{{ day.day }}</span>
              <span
                v-for="event in eventsOn(day.date)"
                :key="event.id"
                class="events-day__event"
                :data-tone="event.tone"
              >{{ event.title }}</span>
            </div>
          </template>
        </FunctionalCalendar>
        <template #fallback>
          <div class="h-96 w-full" />
        </template>
      </ClientOnly>
    </template>
    <slot />
  </DemoFrame>
</template>

<style scoped>
.events-calendar {
  width: 100%;
  max-width: 760px;
}

.events-calendar :deep(.vfc-week) {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.events-calendar :deep(.vfc-week .vfc-day) {
  min-height: 84px;
  border: 1px solid var(--ui-border);
  margin: -1px 0 0 -1px;
}

.events-day {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: stretch;
  padding: 4px;
  text-align: left;
}

.events-day__number {
  font-weight: 600;
}

.events-day__event {
  padding: 1px 6px;
  overflow: hidden;
  font-size: 11px;
  line-height: 18px;
  color: #fff;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 4px;
  background: #2563eb;
}

.events-day__event[data-tone='green'] {
  background: #15803d;
}

.events-day__event[data-tone='amber'] {
  color: #1c1917;
  background: #f59e0b;
}
</style>
