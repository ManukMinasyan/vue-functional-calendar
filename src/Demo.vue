<template>
    <div>
        <functional-calendar class="demo-calendar"
                             :is-date-range="true"
                             :is-multiple="true"
                             :is-modal="true"
                             :calendars-count="2"
                             ref="calendar"
        ></functional-calendar>
        <button @click="preYear">Pre Year</button>
        <button @click="nextYear">Next Year</button>
        <button @click="preMonth">Pre Month</button>
        <button @click="nextMonth">Next Month</button>
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
    body {
        background-color: #fec928;
    }

    .demo-calendar {
        margin: 80px 50px;
        width: 575px
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
