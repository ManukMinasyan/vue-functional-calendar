import { createApp } from 'vue'
import FunctionalCalendar from '../index'
import Demo from './Demo.vue'

createApp(Demo)
  .use(FunctionalCalendar, { showWeekNumbers: false })
  .mount('#app')
