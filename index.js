import FunctionalCalendar from './src/components/FunctionalCalendar.vue'

FunctionalCalendar.install = function (app, options = {}) {
  app.config.globalProperties.$getOptions = () => options
  app.provide('functionalCalendarOptions', options)
  app.component('FunctionalCalendar', FunctionalCalendar)
}

FunctionalCalendar.FunctionalCalendar = FunctionalCalendar

export default FunctionalCalendar
export { FunctionalCalendar }
