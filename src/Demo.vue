<template>
    <div>
        <functional-calendar ref='calendar'
                             v-on:choseDay="clickDay"
                             v-model="calendar"
                             :sundayStart="true"
                             :is-date-picker="true"
                             :is-date-range="true"
                             :markDate="arr"
                             :is-multiple="false"
                             :calendars-count="3"
                             :is-modal="false"

                             :change-month-function="true"
                             :change-year-function="false"
        ></functional-calendar>

        <functional-calendar ref='calendar'
                             v-on:choseDay="clickDay"
                             v-model="calendar"
                             :sundayStart="true"
                             :is-date-picker="true"
                             :is-date-range="true"
                             :markDate="arr"
                             :is-multiple="false"
                             :calendars-count="3"
                             :is-modal="false"

                             :change-month-function="false"
                             :change-year-function="false"
        ></functional-calendar>

        <!--Available Functions-->
        <!--// v-model="calendar"-->

        <!--// :day-names="dayNames" //dayNames=['Su','Mo','Tu','We','Th','Fr','Sa']-->
        <!--// :month-names="monthNames" //monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]-->

        <!--// v-on:choseDay="clickDay"-->
        <!--// v-on:changeMonth="changeDate"-->
        <!--// v-on:isToday="clickToday"-->

        <!--// :sundayStart="true"-->

        <!--// :is-date-range="true"-->
        <!--// :is-date-picker="true"-->
        <!--// :is-modal="false"-->

        <!--// :is-multiple="true"-->
        <!--// :calendars-count="3"-->

        <!--// :markDate=arr // arr=['2018/10/20','2018/10/28', '2018/10/16']-->
        <!--// :agoDayHide='1514937600' //Do not click before a date. Timestamp 10 digits-->
        <!--// :futureDayHide='1525104000' //Do not click after a date Timestamp 10 digits-->
    </div>
</template>

<script>
    import FunctionalCalendar from './componentns/FunctionalCalendar';

    export default {
        components: {
            FunctionalCalendar
        },
        data() {
            return {
                calendar: {},
                arr: ['2018/10/10', '2018-10-11']
            }
        },
        methods: {
            clickDay(date) {
                console.log(date);
            }
        }
    }
</script>

<style>
    body {
        background-color: #fec928;
    }
</style>
