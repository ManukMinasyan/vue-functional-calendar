<template>
    <div>
        <functional-calendar class="demo-calendar" :is-date-range="true" :min-sel-days="3" :max-sel-days="5">

        </functional-calendar>
        <FunctionalCalendar class="demo-calendar"
                            ref="Calendar"
                            :hiddenElements="['']"
                            :showWeekNumbers="true"
                            :is-date-range="true"
                            :min-sel-days="3"
                            :is-dark="true"
                            :date-format="'yyyy-mm-dd'"
                            :is-multiple="true"
                            :calendars-count="1"
                            :with-time-picker="false"
                            :change-month-function="true"
                            :change-year-function="true"
                            :marked-dates="markedDates"
                            v-slot:default="props"
                            :is-auto-closeable="true"
                            :is-modal="false"
                            :change-year-step="5"
                            @choseDay="choseDay"
        >
            <span style="text-align: center">
                {{ props.day.day }}
                <span :class="{'green-point': props.day.day === 5, 'orange-point': props.day.day === 9, 'green-line': props.day.day === 11}"></span>
            </span>
        </FunctionalCalendar>

        <FunctionalCalendar class="demo-calendar"
                            ref="Calendar2"
                            :is-date-range="true"
                            :min-sel-days="3"
                            :is-dark="false"
                            :date-format="'dd/mm/yyyy'"
                            :is-multiple="true"
                            :calendars-count="1"
                            :with-time-picker="false"
                            :change-month-function="true"
                            :change-year-function="true"
                            :disabled-dates="['beforeToday', '20/12/2019']"
                            v-slot:default="props"
                            :is-auto-closeable="true"
                            :is-modal="false"
                            :change-year-step="5"
        >
            <span style="text-align: center">
            {{ props.day.day }}
            <span :class="{'green-point': props.day.day === 5, 'orange-point': props.day.day === 9, 'green-line': props.day.day === 11}"></span>
                </span>
        </FunctionalCalendar>
        <!--<functional-calendar class="demo-calendar"-->
        <!--:with-time-picker='true'-->
        <!--:is-date-picker='true'-->
        <!--:limits="{min: '13/6/2019', max: '20/7/2019'}"-->
        <!--&gt;</functional-calendar>-->


        <button @click="$refs.Calendar.ChooseDate('today')">Today</button>
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
    import {FunctionalCalendar} from '../index'
    /* eslint-disable */
    export default {
        components: {FunctionalCalendar},
        data() {
            return {
                calendarData: {},
                markedDates: [
                    "2019-12-6",
                    "2019-12-9",
                    "2019-12-10",
                    "2019-12-11",
                    "2019-12-12",
                    "2020-1-1"
                ],
                calendarConfigs: {
                    isMultipleDatePicker: true,
                    dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
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
            choseDay(day) {
                console.log(day);
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
        width: 400px;
        /*height: 400px;*/
        margin: 100px;
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

    .green-line {
        width: 20px;
        position: absolute;
        height: 2px;
        background-color: #45cc0d;
        bottom: 3px;
        left: calc(50% - 10px);
    }

    .green-point {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #45cc0d;
        bottom: 3px;
        left: calc(50% - 4px);
    }

    .orange-point {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #eb9800;
        bottom: 3px;
        left: calc(50% - 4px);
    }
</style>
