// Import vue component
import component from './src/components/FunctionalCalendar';

// Declaring an installation function performed by Vue.use ()
export function install(Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component('FunctionalCalendar', component);
}

// Creating a module value for Vue.use ()
const plugin = {
    install
};

// Automatic installation when vue is found (for example, in the browser using the <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}

// Export component for use as a module (npm / webpack / etc.)
export default component;
