import Vue from "vue";
import FunctionalCalendar from "../index";
import Demo from "./Demo";
Vue.use(FunctionalCalendar, {
  showWeekNumbers: true,
  dayNames: ["Երկ.", "Tu", "We", "Th", "Fr", "Sa", "Su"]
});
Vue.config.productionTip = false;

new Vue({
  el: "#app",
  template: "<Demo/>",
  components: { Demo }
});
