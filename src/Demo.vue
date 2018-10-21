<template>
    <div>
        <functional-calendar ref='calendar'
        :sundayStart="true"
        ></functional-calendar>

        <!--Available Functions-->
        <!--:is-date-picker="true"-->
        <!--:is-multiple="true"-->
        <!--:calendars-count="2"-->
        <!--:is-modal="true"-->
        <!--:markDate="arr"-->

        <!--:day-names="dayNames"-->
        <!--:month-names="monthNames"-->

        <!--:agoDayHide='1539714127'-->
        <!--:futureDayHide='1539714127'-->
    </div>
</template>

<script>
    import FunctionalCalendar from './componentns/FunctionalCalendar';

    export default {
        components: {
            FunctionalCalendar
        }
    }
</script>
