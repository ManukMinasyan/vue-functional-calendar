<<<<<<< HEAD
import Vue from 'vue';
import FunctionalCalendar from '../index';
import Demo from './Demo';

Vue.use(FunctionalCalendar, {dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']});
=======
import Vue from "vue";
import FunctionalCalendar from "../index";
import Demo from "./Demo";
Vue.use(FunctionalCalendar, {
  dayNames: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
});
>>>>>>> c3d947c02d49b17d50f1fc268c051c365bb5be7e
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  template: "<Demo/>",
  components: { Demo }
});
