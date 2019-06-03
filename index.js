// Import vue component
import FunctionalCalendarComponent from './components/FunctionalCalendar';

// Declaring an installation function performed by Vue.use ()

// Creating a module value for Vue.use ()
const FunctionalCalendarPlugin = {
    install(Vue, options) {
        Vue.prototype.$getOptions = function () {
            return options;
        };

        Vue.component('FunctionalCalendar', FunctionalCalendarComponent);
    }
};

// Automatic installation when vue is found (for example, in the browser using the <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(FunctionalCalendarPlugin);
}

// Export component for use as a module (npm / webpack / etc.)
export default FunctionalCalendarPlugin;