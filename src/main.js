import Vue from 'vue'
import FunctionalCalendar from './componentns/FunctionalCalendar'


Vue.config.productionTip = false;


new Vue({
    el: '#app',
    components: { FunctionalCalendar },
    data: {
        calendar: {}
    },
    template: "<functional-calendar ref='calendar' "+
        // 'v-model="calendar"'+
        // v-on:choseDay="clickDay"
        // v-on:changeMonth="changeDate"
        // v-on:isToday="clickToday"
        ':sundayStart="true"'+
        ':is-date-picker="true"'+
        ':is-multiple="true"'+
        ':calendars-count="2"'+
        // ':is-modal="true"'+
        // ':markDate="arr"'+ // arr=['2018/4/1','2018/4/3'] Mark April 1st and April 3rd Simple Mark

        // ':day-names="dayNames"'+
        // ':month-names="monthNames"'+

        // ":agoDayHide='1539714127'"+ //Do not click before a date. Timestamp 10 digits
        // ":futureDayHide='1539714127'"+ //Do not click after a date Timestamp 10 digits
        "></functional-calendar>"
})
