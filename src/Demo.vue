<template>
    <div>
        <functional-calendar class="demo-calendar"
                             v-model="calendarData2"
                             :sunday-start="true"
                             :is-modal="true"
                             :date-format="'dd.mm.yyyy'"
                             :change-month-function="true"
                             :is-typeable="true"
                             :change-year-function="true"
                             :is-date-picker="false"
                             :is-date-range="true"
                             :is-multiple="false"
                             :calendars-count="2"
                             :marked-date-range="{start: '22.4.2019', end: '24.4.2019'}"
                             :hidden-elements="['leftAndRightDays']"
        ></functional-calendar>

        <!--<functional-calendar class="demo-calendar2"-->
                             <!--v-model="calendarData"-->
                             <!--:sunday-start="true"-->
                             <!--:is-modal="false"-->
                             <!--:date-format="'dd.mm.yyyy'"-->
                             <!--:change-month-function="true"-->
                             <!--:change-year-function="true"-->
                             <!--:is-date-range="true"-->
                             <!--:is-multiple="false"-->
                             <!--:calendars-count="2"-->
                             <!--:marked-date-range="{start: '22.4.2019', end: '24.4.2019'}"-->
                             <!--:left-and-right-days="true"-->
        <!--&gt;</functional-calendar>-->


        <!--:disabledDates="['27.4.2019','29.4.2019']"-->
        <!--:disabledDayNames="['Su']"-->
        <blockquote>
          <pre>
            <code>
                 :marked-dates="[{date: '13/12/2018', class: 'class'}, {date: '15/12/2018', class: 'class-2'}]" // Mark Dates With Custom Classes
                 :marked-date-range="{start: '12/12/2018', end: '20/12/2018'}" // Marked Range 12/12/2018 - 20/12/2018
                 :marked-date-range="{start: '12/12/2018', end: false}" // Marked after 12/12/2018
                 :marked-date-range="{start: false, end: '12/12/2018'}" // Marked before 12/12/2018
            </code>
          </pre>
        </blockquote>
    </div>
</template>

<script>
    /* eslint-disable */
    import FunctionalCalendar from './components/FunctionalCalendar';

    export default {
        components: {
            FunctionalCalendar
        },
        data() {
            return {
                calendarData: {},
                calendarData2: {
                    dateRange: {
                        start: '19.4.2019',
                        end: '25.4.2019'
                    }
                },
                calendar: {
                    dateRange: {

                    }
                }
            }
        },
        methods: {
            get(val) {
                console.log(val);
            },
            opened() {
                console.log('open')
            },
            closed() {
                console.log('close')
            },
            changedMonth(value) {
                console.log(value);
            },
            preYear() {
                this.$refs.calendar.ChooseDate('10/10/2020');
            },
            nextYear() {
                this.$refs.calendar.NextYear();
            },
            preMonth() {
                this.$refs.calendar.PreMonth();
            },
            nextMonth() {
                this.$refs.calendar.NextMonth();
            }
        }
    }
</script>

<style>
    html, body {
        background-color: #fec928;
        padding: 0;
        margin: 0;
    }

    .demo-calendar {
        width: 30%
    }

    .demo-calendar2 {
        width: 635px
    }

    pre {
        font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
        margin-bottom: 10px;
        overflow: auto;
        width: auto;
        padding: 5px;
        background-color: #eee;
        padding-bottom: 20px !ie 7;
        max-height: 600px;
    }
</style>
