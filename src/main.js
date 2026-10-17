import { createApp } from 'vue'
import FunctionalCalendar from '../index'
import Demo from './Demo.vue'

createApp(Demo)
  .use(FunctionalCalendar, {
    showWeekNumbers: false,
    dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  })
  .mount('#app')
