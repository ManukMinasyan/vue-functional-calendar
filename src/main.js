import Vue from 'vue';
import FunctionalCalendar from '../index';
import Demo from './Demo';
Vue.use(FunctionalCalendar);
Vue.config.productionTip = false;

new Vue({
    el: '#app',
    template: '<Demo/>',
    components: {Demo}
});
