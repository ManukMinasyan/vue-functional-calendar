<template>
    <div>
        <functional-calendar class="demo-custom-calendar 1"
                             :change-month-function="true"
                             :change-year-function="true"
                             :sundayStart="false"
                             :showWeekNumbers="false"
                             title-position="left"
                             arrows-position="right"
        >
            <template v-slot:default="props">
                <div class="custom-day-container">
                    <div class="custom-day">
                        {{ props.day.day }}
                        <div class="events">
                            <div class="event-item" :class="event.class"
                                 v-for="event in getEventsByDate(props.day.date)" :key="event.id">
                                {{ event.title }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </functional-calendar>

<!--        <button @click="markedDates2.push('22/3/2020')">Add date</button>-->

        <FunctionalCalendar class="demo-calendar 2"
                            ref="Calendar"
                            :sundayStart="true"
                            :hiddenElements="['']"
                            :showWeekNumbers="true"
                            :is-date-range="true"
                            :min-sel-days="3"
                            :is-dark="true"
                            :date-format="'yyyy-mm-dd'"
                            :is-multiple="true"
                            :calendars-count="2"
                            :isSeparately="true"
                            :with-time-picker="false"
                            :change-month-function="true"
                            :change-year-function="true"
                            :marked-dates="markedDates"
                            :is-auto-closeable="true"
                            :is-modal="false"
                            :change-year-step="5"
                            @choseDay="choseDay"
                            title-position="left"
                            arrows-position="right"
        >
        </FunctionalCalendar>

        <button @click="$refs.Calendar.ChooseDate('2020-10-15')">Choose Date 2020-10-15</button>

        <!--<FunctionalCalendar class="demo-calendar 3"-->
        <!--ref="Calendar2"-->
        <!--:is-date-range="true"-->
        <!--:min-sel-days="3"-->
        <!--:is-dark="false"-->
        <!--:date-format="'dd/mm/yyyy'"-->
        <!--:is-multiple="true"-->
        <!--:calendars-count="1"-->
        <!--:with-time-picker="false"-->
        <!--:change-month-function="true"-->
        <!--:change-year-function="true"-->
        <!--:disabled-dates="['beforeToday', '20/12/2019']"-->
        <!--v-slot:default="props"-->
        <!--:is-auto-closeable="true"-->
        <!--:is-modal="false"-->
        <!--:change-year-step="5"-->
        <!--&gt;-->
        <!--<span style="text-align: center">-->
        <!--{{ props.day.day }}-->
        <!--<span :class="{'green-point': props.day.day === 5, 'orange-point': props.day.day === 9, 'green-line': props.day.day === 11}"></span>-->
        <!--</span>-->
        <!--</FunctionalCalendar>-->
        <!--<functional-calendar class="demo-calendar"-->
        <!--:with-time-picker='true'-->
        <!--:is-date-picker='true'-->
        <!--:limits="{min: '13/6/2019', max: '20/7/2019'}"-->
        <!--&gt;</functional-calendar>-->


        <!--<button @click="$refs.Calendar.ChooseDate('today')">Today</button>-->
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
                events: [
                    {
                        id: 1,
                        title: "Meeting with new client",
                        date: "18/4/2020",
                        class: "has-background-color1"
                    },
                    {
                        id: 2,
                        title: "Meeting with new client",
                        date: "24/4/2020",
                        class: "has-background-color2"
                    },
                    {
                        id: 3,
                        title: "Meeting with new client 2",
                        date: "24/4/2020",
                        class: "has-background-color3"
                    },
                    {
                        id: 4,
                        title: "Meeting with new client 3",
                        date: "24/4/2020",
                        class: "has-background-color4"
                    }
                ],
                calendarData: {},
                markedDates: [
                    "2019-12-6",
                    "2019-12-9",
                    "2019-12-10",
                    "2019-12-11",
                    "2019-12-12",
                    "2020-1-1"
                ],
                markedDates2: [],
                calendarConfigs: {
                    isMultipleDatePicker: true,
                    dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
                }
            }
        },
        methods: {
            getEventsByDate(date) {
                return this.events.filter(event => event.date === date)
            },
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

<style lang="scss">
    $color1: rgba(38, 109, 211, 1);
    $color2: rgba(52, 64, 85, 1);
    $color3: rgba(136, 128, 152, 1);
    $color4: rgba(207, 179, 205, 1);
    $color5: rgba(223, 194, 242, 1);
    $color6: rgb(208, 217, 208);

    html, body {
        background-color: #fec928;
        padding: 0;
        margin: 0;
    }

    .demo-calendar {
        width: 400px;
        margin: 100px;
    }
    .demo-custom-calendar {
        width: 800px;
        margin: 100px;

        .vfc-main-container {
            .vfc-calendars-container {
                .vfc-calendars {
                    .vfc-calendar {
                        div {
                            &.vfc-content {
                                margin: 0;
                                .vfc-week {
                                    display: grid;
                                    grid-template-columns: repeat(7, 1fr);

                                    &:nth-child(1n+2) {
                                        .vfc-day {
                                            border-top: none;
                                        }
                                    }

                                    .vfc-day {
                                        border-left: 1px solid $color3;
                                        border-bottom: 1px solid $color3;
                                        border-top: 1px solid $color3;
                                        margin-top: 0 !important;

                                        &:nth-child(7n) {
                                            border-right: 1px solid $color3;
                                            box-sizing: border-box;
                                        }

                                        .custom-day-container {
                                            margin: 0 5px;

                                            .custom-day {
                                                .events {
                                                    display: grid;
                                                    height: 80px;
                                                    padding: 5px;

                                                    overflow-x: hidden;
                                                    overflow-y: auto;
                                                    /* width */
                                                    &::-webkit-scrollbar {
                                                        width: 2px;
                                                    }

                                                    /* Track */
                                                    &::-webkit-scrollbar-track {
                                                        background: $color5;
                                                    }

                                                    /* Handle */
                                                    &::-webkit-scrollbar-thumb {
                                                        background: $color3;
                                                    }

                                                    /* Handle on hover */
                                                    &::-webkit-scrollbar-thumb:hover {
                                                        background: $color3;
                                                    }

                                                    .event-item {
                                                        position: relative;
                                                        border: 0;
                                                        width: 100%;
                                                        border-radius: 5px;
                                                        background-color: transparent;
                                                        color: #FFFFFF;
                                                        font-size: 15px;
                                                        margin: 3px 0;

                                                        &.has-background-color1 {
                                                            background-color: $color1;
                                                        }

                                                        &.has-background-color2 {
                                                            background-color: $color2;
                                                        }

                                                        &.has-background-color3 {
                                                            background-color: $color3;
                                                        }

                                                        &.has-background-color4 {
                                                            background-color: $color4;
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        .vfc-today {
                                            .custom-day-container {
                                                .custom-day {
                                                    color: #ff8498;
                                                    font-weight: bold;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
        padding-bottom: 20px;
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
