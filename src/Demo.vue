<template>
    <div>
        <button @click="prevMonth">Prev Month</button>
        <button @click="nextMonth">Next Month</button>



        <functional-calendar ref='calendar'
                             v-on:choseDay="clickDay"
                             v-model="calendar"
                             :configs="configs"
        ></functional-calendar>

        <functional-calendar
                             v-on:choseDay="clickDay"
                             v-model="calendar"
                             :sundayStart="true"
                             :is-date-picker="true"
                             :is-date-range="true"
                             :markDate="arr"
                             :is-multiple="true"
                             :calendars-count="3"
                             :is-modal="true"

                             :change-month-function="true"
                             :change-year-function="true"
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
                configs: {
                    sundayStart: true,

                    isDatePicker: false,
                    isDateRange: true,

                    isMultiple: true,
                    calendarsCount: 3,

                    isModal: false,

                    changeMonthFunction: true,
                    changeYearFunction: true,

                    applyStylesheet: true,

                    dayNames: ['Su','Mo','Tu','We','Th','Fr','Sa'],

                    monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"]
                },
                arr: ['2018/10/10', '2018-10-11']
            }
        },
        methods: {
            clickDay(date) {
                console.log(date);
            },
            prevMonth() {
                this.$refs.calendar.PreMonth();
            },
            nextMonth() {
                this.$refs.calendar.NextMonth();
            }
        }
    }
</script>

<style>
    body {
        background-color: #fec928;
    }
</style>
