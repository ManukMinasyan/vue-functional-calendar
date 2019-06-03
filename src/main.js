import Vue from 'vue';
import FunctionalCalendar from './components/FunctionalCalendar';
import Demo from './Demo';

Vue.use(FunctionalCalendar, {
    dayNames: ['Mo1', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
});

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<Demo/>',
    components: {Demo}
});
