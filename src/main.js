import Vue from 'vue'
import FunctionalCalendar from './componentns/FunctionalCalendar'


Vue.config.productionTip = false;


new Vue({
    el: '#app',
    components: { FunctionalCalendar },
    data: {
        calendar: {},
        arr: ['2018/10/20','2018/10/28', '2018/10/16']
    },
    template: "<functional-calendar "+
        // 'v-model="calendar"'+
        // v-on:choseDay="clickDay"
        // v-on:changeMonth="changeDate"
        // v-on:isToday="clickToday"
        // :sundayStart="true"
        // ':is-date-picker="true"'+
        // ':is-multiple="true"'+
        // ':calendars-count="4"'+
        // ':markDate="arr"'+ // arr=['2018/4/1','2018/4/3'] Mark April 1st and April 3rd Simple Mark

        // ":agoDayHide='1539714127'"+ //Do not click before a date. Timestamp 10 digits
        // ":futureDayHide='1539714127'"+ //Do not click after a date Timestamp 10 digits
        "></functional-calendar>"
})
