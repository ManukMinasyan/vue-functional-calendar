// Import vue component
import FunctionalCalendar from './src/components/FunctionalCalendar.vue'

// The default export is both the component (UMD builds expose it as window.FunctionalCalendar)
// and the plugin for Vue.use()
FunctionalCalendar.install = function(Vue, options = []) {
  Vue.prototype.$getOptions = function() {
    return options
  }

  Vue.component('FunctionalCalendar', FunctionalCalendar)
}

FunctionalCalendar.FunctionalCalendar = FunctionalCalendar

// Export component for use as a module (npm / webpack / etc.)
export default FunctionalCalendar
export { FunctionalCalendar }
