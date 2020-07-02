// Import vue component
import FunctionalCalendar from './src/components/FunctionalCalendar'

// Creating a module value for Vue.use ()
const FunctionalCalendarPlugin = {
  install(Vue, options = []) {
    Vue.prototype.$getOptions = function() {
      return options
    }

    Vue.component('FunctionalCalendar', FunctionalCalendar)
  },
  FunctionalCalendar
}

// Export component for use as a module (npm / webpack / etc.)
export default FunctionalCalendarPlugin
export { FunctionalCalendar }
