import Vue from "vue";
import FunctionalCalendar from "../index";
import Demo from "./Demo";
Vue.use(FunctionalCalendar, {
  showWeekNumbers: false,
  dayNames: ["Mo.", "Tu", "We", "Th", "Fr", "Sa", "Su"]
});
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  template: "<Demo/>",
  components: { Demo }
});
