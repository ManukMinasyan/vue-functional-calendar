<template>
    <div :class="{'vfc-styles-conditional-class': fConfigs.applyStylesheet}">
        <div class="vfc-multiple-input" :class="{'vfc-dark': fConfigs.isDark}"
             v-if="fConfigs.isModal && fConfigs.isDateRange">
            <input type="text" title="Start Date"
                   v-model="input.dateRange.start.date"
                   :placeholder="fConfigs.placeholder"
                   :readonly="!fConfigs.isTypeable"
                   :maxlength="fConfigs.dateFormat.length"
                   @click="showCalendar = !showCalendar">
            <input type="text" title="End Date"
                   v-model="input.dateRange.end.date"
                   :placeholder="fConfigs.placeholder"
                   :readonly="!fConfigs.isTypeable"
                   :maxlength="fConfigs.dateFormat.length"
                   @click="showCalendar = !showCalendar">
        </div>
        <div :class="{'vfc-dark': fConfigs.isDark}" v-else-if="fConfigs.isModal && fConfigs.isDatePicker">
            <input class="vfc-single-input" type="text" title="Date"
                   v-model="input.selectedDate"
                   :placeholder="fConfigs.placeholder"
                   :readonly="!fConfigs.isTypeable"
                   :maxlength="fConfigs.dateFormat.length"
                   @click="showCalendar = !showCalendar">
        </div>

        <div class="vfc-main-container" v-show="showCalendar"
             ref="mainContainer"
             :class="{'vfc-modal': fConfigs.isModal && (fConfigs.isDatePicker || fConfigs.isDateRange), 'vfc-dark': fConfigs.isDark}">
            <time-picker v-if="showTimePicker"></time-picker>
            <template v-else>
                <div class="vfc-calendars-container">
                    <div class="vfc-navigation-buttons" ref="navigationButtons"
                         v-if="checkHiddenElement('navigationArrows') && !fConfigs.isSeparately">
                        <div @click="PreMonth()" :class="{'vfc-cursor-pointer': allowPreDate}">
                            <div class="vfc-arrow-left" :class="{'vfc-disabled': !allowPreDate}"></div>
                        </div>
                        <div @click="NextMonth()" :class="{'vfc-cursor-pointer': allowNextDate}">
                            <div class="vfc-arrow-right" :class="{'vfc-disabled': !allowNextDate}"></div>
                        </div>
                    </div>
                    <div class="vfc-calendars" :key="calendarsKey" ref="calendars">
                        <div class="vfc-calendar" v-for="(calendarItem, key) in listCalendars" :key="calendarItem.key">
                            <month-year-picker ref="monthContainer"
                                               v-show="showMonthPicker === key+1 || showYearPicker === key+1"
                                               :calendar-key="key">
                            </month-year-picker>
                            <div class="vfc-content">
                                <div class="vfc-separately-navigation-buttons" v-if="fConfigs.isSeparately">
                                    <div @click="PreMonth(key)" :class="{'vfc-cursor-pointer': allowPreDate}">
                                        <div class="vfc-arrow-left" :class="{'vfc-disabled': !allowPreDate}"></div>
                                    </div>
                                    <div @click="NextMonth(key)" :class="{'vfc-cursor-pointer': allowNextDate}">
                                        <div class="vfc-arrow-right" :class="{'vfc-disabled': !allowNextDate}"></div>
                                    </div>
                                </div>
                                <h2 class="vfc-top-date"
                                    v-if="checkHiddenElement('month')">
                                    <a href="#" @click.prevent="openMonthPicker(key+1)"
                                       :class="{'vfc-cursor-pointer vfc-underline':fConfigs.changeMonthFunction, 'vfc-underline-active':showMonthPicker === key+1}">
                                        {{ calendarItem.month }}</a>
                                    <a href="#" @click.prevent="openYearPicker(key+1)"
                                       :class="{'vfc-cursor-pointer vfc-underline':fConfigs.changeYearFunction,  'vfc-underline-active':showYearPicker === key+1}">
                                        {{ calendarItem.year }}
                                    </a>
                                </h2>
                                <section class="vfc-dayNames">
                                    <span v-for="(dayName, key) in fConfigs.dayNames" :key="key">
                                        <template v-if="fConfigs.showWeekNumbers">
                                            {{ ++key }}.
                                        </template>
                                        <template v-if="checkHiddenElement('dayNames')">
                                            {{ dayName }}
                                        </template>
                                    </span>
                                </section>
                                <transition-group
                                        tag='div'
                                        :name='getTransition_()' appear>
                                    <div class="vfc-week" v-for="(week, week_key) in calendarItem.weeks"
                                         :key="week_key+0">
                                        <div class="vfc-day" ref="day" v-for="(day, day_key) in week.days"
                                             :key="day_key">
                                            <div v-if="(day.isDateRangeStart || day.isMouseToLeft) && !day.hideLeftAndRightDays"
                                                 class="vfc-base-start">
                                            </div>
                                            <div v-else-if="(day.isDateRangeEnd || day.isMouseToRight) && !day.hideLeftAndRightDays"
                                                 class="vfc-base-end">
                                            </div>
                                            <span v-if="!day.hideLeftAndRightDays"
                                                  data-date="" :key="day_key"
                                                  class="vfc-span-day"
                                                  :class="getClassNames(day)"
                                                  @click="clickDay(day)"
                                                  @mouseover="dayMouseOver(week_key, day.date)">
                                                <slot :week="week" :day="day">
                                                    {{ day.day }}
                                                </slot>
                                        </span>
                                        </div>
                                    </div>
                                </transition-group>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import helpCalendar from '../assets/js/calendar'
    import {propsAndData} from "../mixins/propsAndData";
    import TimePicker from "./TimePicker";
    import MonthYearPicker from "./MonthYearPicker";

    export default {
        name: "FunctionalCalendar",
        components: {MonthYearPicker, TimePicker},
        mixins: [propsAndData],
        created() {
            this.setConfigs();
            this.initCalendar();

            if (this.fConfigs.isModal && !this.fConfigs.withTimePicker) {
                // Event
                window.addEventListener('click', (e) => {
                    if (!this.$el.contains(e.target)) {
                        this.showCalendar = false
                    }
                });
            }


            window.addEventListener('click', (e) => {
                if (this.showMonthPicker || this.showYearPicker) {
                    let key = this.showMonthPicker ? this.showMonthPicker - 1 : this.showYearPicker - 1;

                    let element1 = this.$refs.calendars.querySelector(`.vfc-calendars .vfc-calendar:nth-child(${key + 1}) .vfc-top-date a:nth-child(1)`);
                    let element2 = this.$refs.calendars.querySelector(`.vfc-calendars .vfc-calendar:nth-child(${key + 1}) .vfc-top-date a:nth-child(2)`);

                    if (!this.$refs.monthContainer[key].$el.contains(e.target) && !element1.contains(e.target) && !element2.contains(e.target)) {
                        this.showMonthPicker = this.showYearPicker = false
                    }
                }
            });

        },
        mounted() {
            // Reacts to external selected dates
            this.$watch('value', function (value) {
                if (this.fConfigs.isDateRange) {
                    this.calendar.dateRange.start.date = value.dateRange.start.date || false;
                    this.calendar.dateRange.end.date = value.dateRange.end.date || false
                } else {
                    this.calendar.selectedDate = value.selectedDate || false
                }
            }, {deep: true});

            this.$watch('showCalendar', function (value) {
                if (value)
                    this.$emit('opened');
                else
                    this.$emit('closed');
            }, {immediate: true, deep: true});

            this.setCalendarStyles();
        },
        computed: {
            yearList() {
                let years = [];
                let year = this.calendar.currentDate.getFullYear() - 4;
                for (let i = 0; i < 12; i++) {
                    let finalYear = year + i;

                    years.push({
                        year: finalYear
                    });
                }
                return years;
            }
        },
        watch: {
            'calendar.selectedDate': {
                handler(val) {
                    this.input.selectedDate = val || '';
                    this.markChooseDays();
                }
            },
            'calendar.currentDate': {
                handler(value) {
                    this.$emit('input', this.calendar);
                    this.checkLimits(value);
                }
            },
            'calendar.dateRange.start.date': {
                handler(val) {
                    this.input.dateRange.start.date = val || '';
                    this.markChooseDays();
                }
            },
            'calendar.dateRange.end.date': {
                handler(val) {
                    this.input.dateRange.end.date = val || '';
                    this.markChooseDays();
                }
            },
            'input.selectedDate': {
                handler(val) {
                    this.input.selectedDate = val = helpCalendar.mask(val);
                    if (helpCalendar.getDateFromFormat(val).getMonth()) {
                        this.calendar.selectedDate = val;
                        this.markChooseDays();
                    }

                    // Typeable
                    if (helpCalendar.checkValidDate(val) && this.fConfigs.isTypeable) {
                        this.ChooseDate(val);
                    }
                }
            },
            'input.dateRange.start.date': {
                handler(val) {
                    this.input.dateRange.start.date = val = helpCalendar.mask(val);
                    if (helpCalendar.getDateFromFormat(val).getMonth()) {
                        this.calendar.dateRange.start.date = val;
                        this.markChooseDays();
                    }

                    // Typeable
                    if (helpCalendar.checkValidDate(val) && this.fConfigs.isTypeable) {
                        this.ChooseDate(val);
                    }
                }
            },
            'input.dateRange.end.date': {
                handler(val) {
                    this.input.dateRange.end.date = val = helpCalendar.mask(val);
                    if (helpCalendar.getDateFromFormat(val).getMonth()) {
                        this.calendar.dateRange.end.date = val;
                        this.markChooseDays();
                    }

                    // Typeable
                    if (helpCalendar.checkValidDate(val) && this.fConfigs.isTypeable) {
                        this.ChooseDate(val);
                    }
                }
            }
        },
        ready: function () {
            window.addEventListener('resize', this.setCalendarStyles)
        },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.setCalendarStyles)
        },
        methods: {
            initCalendar() {
                // Set Help Calendar Configs
                helpCalendar.configs.sundayStart = this.fConfigs.sundayStart;
                helpCalendar.configs.leftAndRightDays = this.checkHiddenElement('leftAndRightDays');
                helpCalendar.configs.dateFormat = this.fConfigs.dateFormat;
                helpCalendar.configs.dayNames = this.fConfigs.dayNames;
                helpCalendar.configs.monthNames = this.fConfigs.monthNames;

                this.setCalendarData();
                this.listRendering();
                this.markChooseDays();
                this.checkLimits(this.calendar.currentDate);
            },
            updateCalendar() {
                this.setExistingCalendarData();
                this.listRendering();
                this.markChooseDays();
            },
            setCalendarData() {
                let date = this.calendar.currentDate;
                date = new Date(date.getFullYear(), date.getMonth() - 1);

                this.listCalendars = [];

                for (let i = 0; i < this.fConfigs.calendarsCount; i++) {
                    date = new Date(date.getFullYear(), date.getMonth() + 1);

                    let calendar = {
                        key: i,
                        date: date,
                        dateTop: `${this.fConfigs.monthNames[date.getMonth()]} ${date.getFullYear()}`,
                        month: this.fConfigs.monthNames[date.getMonth()],
                        year: date.getFullYear(),
                        weeks: helpCalendar.getFinalizedWeeks(date.getMonth(), date.getFullYear())
                    };

                    this.listCalendars.push(calendar);

                    if (!this.fConfigs.isMultiple) {
                        break;
                    }
                }
            },
            setExistingCalendarData() {
                for (let i = 0; i < this.listCalendars.length; i++) {
                    let calendar = this.listCalendars[i];
                    let date = calendar.date;

                    this.$set(this.listCalendars, i, {
                        key: calendar.key,
                        date: date,
                        dateTop: `${this.fConfigs.monthNames[date.getMonth()]} ${date.getFullYear()}`,
                        month: this.fConfigs.monthNames[date.getMonth()],
                        year: date.getFullYear(),
                        weeks: helpCalendar.getFinalizedWeeks(date.getMonth(), date.getFullYear())
                    });

                    if (!this.fConfigs.isMultiple) {
                        break;
                    }
                }
            },
            setConfigs() {
                let vm = this;
                let globalOptions;
                if (typeof vm.$getOptions !== "undefined") {
                    // Global Options
                    globalOptions = vm.$getOptions();
                    Object.keys(globalOptions).map(function (objectKey) {
                        if (typeof (vm.fConfigs[objectKey]) !== "undefined") {
                            vm.$set(vm.fConfigs, objectKey, globalOptions[objectKey]);
                        }
                    });
                }

                if (typeof (vm.configs) !== "undefined") {
                    Object.keys(vm.fConfigs).map(function (objectKey) {
                        if (typeof (vm.configs[objectKey]) !== "undefined") {
                            // Get From Configs
                            vm.$set(vm.fConfigs, objectKey, vm.configs[objectKey]);
                        }
                    });
                } else {
                    Object.keys(vm.$props).map(function (objectKey) {
                        if (typeof (vm.fConfigs[objectKey]) !== "undefined" &&
                            typeof (vm.$props[objectKey]) !== "undefined") {
                            vm.$set(vm.fConfigs, objectKey, vm.$props[objectKey]);
                        }
                    });
                }


                // Is Modal
                if (vm.fConfigs.isModal) vm.showCalendar = false;

                // Placeholder
                if (!vm.fConfigs.placeholder) vm.fConfigs.placeholder = vm.fConfigs.dateFormat;

                if (typeof vm.newCurrentDate !== "undefined") {
                    vm.calendar.currentDate = vm.newCurrentDate;
                }

                // Sunday Start
                if (vm.fConfigs.sundayStart) {
                    let dayNames = vm.fConfigs.dayNames;
                    let sundayName = dayNames[dayNames.length - 1];
                    dayNames.splice(dayNames.length - 1, 1);
                    dayNames.unshift(sundayName);
                }
            },
            listRendering() {
                let vm = this;

                // Each Calendars
                vm.listCalendars.forEach(function (calendar) {
                    // Set Calendar Weeks
                    calendar.weeks.forEach(function (week) {

                        let finalizedDays = [];

                        week.days.forEach(function (day) {
                            let date = new Date(day.year, day.month, day.day);
                            let now = new Date();

                            let isToday = false;

                            date.setHours(0, 0, 0, 0);
                            now.setHours(0, 0, 0, 0);

                            if (date.getTime() === now.getTime()) {
                                isToday = true;
                            }

                            let checkMarked;
                            // With Custom Classes
                            if (typeof vm.fConfigs.markedDates[0] === "object") {
                                checkMarked = vm.fConfigs.markedDates.find(function (markDate) {
                                    return markDate.date === helpCalendar.formatDate(date)
                                });
                            } else {
                                // Without Classes
                                checkMarked = vm.fConfigs.markedDates.find(function (markDate) {
                                    return markDate === helpCalendar.formatDate(date)
                                });
                            }

                            if (vm.calendar.dateRange.start.date === helpCalendar.formatDate(date)) {
                                checkMarked = true;
                            }

                            let isMarked = false;
                            if (typeof checkMarked !== "undefined") {
                                isMarked = true;
                            }

                            finalizedDays.push({
                                day: day.day,
                                date: helpCalendar.formatDate(date),
                                hide: day.hide,
                                isMouseToLeft: false,
                                isMouseToRight: false,
                                isHovered: false,
                                isDateRangeStart: vm.checkDateRangeStart(helpCalendar.formatDate(date)),
                                isDateRangeEnd: vm.checkDateRangeEnd(helpCalendar.formatDate(date)),
                                hideLeftAndRightDays: day.hideLeftAndRightDays,
                                isToday: isToday,
                                isMarked: isMarked
                            });
                        });

                        week.days = finalizedDays;
                    });
                });

            },
            clickDay(item) {
                if (!this.fConfigs.isDateRange && !this.fConfigs.isDatePicker && !this.fConfigs.isMultipleDatePicker) {
                    return false;
                }

                // Disable days of week if set in configuration
                let dateDay = helpCalendar.getDateFromFormat(item.date).getDay() - 1;
                if (dateDay === -1) {
                    dateDay = 6;
                }

                let dayOfWeekString = this.fConfigs.dayNames[dateDay];
                if (this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {
                    return false;
                }

                // Disabled dates
                if (this.fConfigs.disabledDates.includes(item.date)) {
                    return false;
                }

                // Limits
                if (this.fConfigs.limits) {
                    let min = helpCalendar.getDateFromFormat(this.fConfigs.limits.min).getTime();
                    let max = helpCalendar.getDateFromFormat(this.fConfigs.limits.max).getTime();
                    let date = helpCalendar.getDateFromFormat(item.date).getTime();

                    if (date < min || date > max) {
                        return false;
                    }
                }

                // Date Range
                if (this.fConfigs.isDateRange) {

                    let clickDate = helpCalendar.getDateFromFormat(item.date).getTime();

                    let startDate = false;
                    if (this.calendar.dateRange.start.date) {
                        startDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.start.date);
                    }

                    // Two dates is not empty
                    if (this.calendar.dateRange.start.date !== false && this.calendar.dateRange.end.date !== false) {
                        this.calendar.dateRange.start.date = item.date;
                        this.calendar.dateRange.end.date = false;
                        // Not date selected
                    } else if (this.calendar.dateRange.start.date === false && this.calendar.dateRange.end.date === false) {
                        this.calendar.dateRange.start.date = item.date;
                        // Start Date not empty, chose date > start date
                    } else if (this.calendar.dateRange.end.date === false && (clickDate > startDate.getTime())) {
                        this.calendar.dateRange.end.date = item.date;
                        // Start date not empty, chose date <= start date (also same date range select)
                    } else if (this.calendar.dateRange.start.date !== false && (clickDate <= startDate.getTime())) {
                        this.calendar.dateRange.end.date = this.calendar.dateRange.start.date;
                        this.calendar.dateRange.start.date = item.date;
                    }

                    //Get number of days between date range dates
                    if (this.calendar.dateRange.start.date !== false && this.calendar.dateRange.end.date !== false) {
                        let oneDay = 24 * 60 * 60 * 1000;
                        let firstDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.start.date);
                        let secondDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.end.date);
                        let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                        let itemTime = helpCalendar.getDateFromFormat(item.date).getTime();

                        this.$emit('selectedDaysCount', diffDays);

                        // Is Auto Closeable
                        if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
                            this.showCalendar = false;
                        }


                        // Minimum Selected Days
                        let minSelDays = this.fConfigs.minSelDays;

                        if (minSelDays && itemTime >= startDate.getTime() && diffDays < minSelDays) {
                            startDate.setDate(startDate.getDate() + (minSelDays - 1));
                            this.calendar.dateRange.end.date = helpCalendar.formatDate(startDate);
                        }

                        if (minSelDays && itemTime < startDate.getTime() && diffDays < minSelDays) {
                            startDate.setDate(startDate.getDate() - (minSelDays - 1));
                            this.calendar.dateRange.start.date = helpCalendar.formatDate(startDate);
                        }

                        // Maximum Selected Days
                        let maxSelDays = this.fConfigs.maxSelDays;

                        if (maxSelDays && itemTime >= startDate.getTime() && diffDays > maxSelDays) {
                            startDate.setDate(startDate.getDate() + (maxSelDays - 1));
                            this.calendar.dateRange.end.date = helpCalendar.formatDate(startDate);
                        }

                        if (maxSelDays && itemTime < startDate.getTime() && diffDays > maxSelDays) {
                            startDate.setDate(startDate.getDate() - (maxSelDays - 1));
                            this.calendar.dateRange.start.date = helpCalendar.formatDate(startDate);
                        }
                    }

                    this.$emit('input', this.calendar);
                } else if (this.fConfigs.isDatePicker) {
                    this.calendar.selectedDate = item.date;
                    this.$emit('input', this.calendar);

                    // Is Auto Closeable
                    if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
                        this.showCalendar = false;
                    }
                } else if (this.fConfigs.isMultipleDatePicker) {
                    if (this.calendar.selectedDates.find(date => date.date === item.date)) {
                        let dateIndex = this.calendar.selectedDates.findIndex(date => date.date === item.date);
                        this.calendar.selectedDates.splice(dateIndex, 1);
                    } else {
                        let date = Object.assign({}, this.defaultDateFormat);
                        date.date = item.date;
                        this.calendar.selectedDates.push(date);
                    }

                    this.$emit('input', this.calendar);
                }

                this.markChooseDays();

                // Time Picker
                if (this.fConfigs.withTimePicker) {
                    if (this.fConfigs.isDateRange || this.fConfigs.isDatePicker) {
                        this.openTimePicker();
                    }

                    if (this.calendar.selectedDates.find(date => date.date === item.date) && this.fConfigs.isMultipleDatePicker) {
                        this.openTimePicker();
                    }
                }

                this.$emit('choseDay', item);
            },
            markChooseDays() {
                let vm = this;
                let startDate = vm.calendar.dateRange.start.date;
                let endDate = vm.calendar.dateRange.end.date;

                this.listCalendars.forEach((calendar) => {
                    calendar.weeks.forEach((week) => {
                        week.days.forEach((day) => {

                            day.isMarked = false;

                            // Date Picker
                            if (vm.fConfigs.isDatePicker) {
                                if (this.calendar.selectedDate === day.date)
                                    day.isMarked = true;
                            } else if (vm.fConfigs.isMultipleDatePicker) {
                                if (vm.calendar.selectedDates.find(date => date.date === day.date))
                                    day.isMarked = true;
                            } else {
                                day.isMouseToLeft = false;
                                day.isMouseToRight = false;

                                // Date Range
                                if (startDate === day.date) {
                                    day.isMouseToLeft = !!endDate;
                                    day.isMarked = true;
                                }

                                if (endDate === day.date) {
                                    day.isMouseToRight = !!endDate;
                                    day.isMarked = true;
                                }

                                if (startDate && startDate === endDate) {
                                    day.isMouseToLeft = false;
                                    day.isMouseToRight = false;
                                }

                                if (startDate && endDate) {
                                    if (helpCalendar.getDateFromFormat(day.date).getTime() > helpCalendar.getDateFromFormat(startDate)
                                        && helpCalendar.getDateFromFormat(day.date) < helpCalendar.getDateFromFormat(endDate)) {
                                        day.isMarked = true;
                                    }
                                }
                            }

                            if (this.fConfigs.markedDates.includes(day.date))
                                day.isMarked = true;
                        })
                    })
                })
            },
            dayMouseOver(week_key, date) {
                if (!this.fConfigs.isDateRange) {
                    return false;
                }

                // Limits
                if (this.fConfigs.limits) {
                    let limitMin = helpCalendar.getDateFromFormat(this.fConfigs.limits.min).getTime();
                    let limitMax = helpCalendar.getDateFromFormat(this.fConfigs.limits.max).getTime();
                    let limitDate = helpCalendar.getDateFromFormat(date).getTime();

                    if (limitDate < limitMin || limitDate > limitMax) {
                        return false;
                    }
                }

                if ((this.calendar.dateRange.start.date === false || this.calendar.dateRange.end.date === false)
                    && (this.calendar.dateRange.start.date !== false || this.calendar.dateRange.end.date !== false)) {

                    for (let e = 0; e < this.listCalendars.length; e++) {
                        let calendar = this.listCalendars[e];

                        for (let f = 0; f < calendar.weeks.length; f++) {
                            let week = calendar.weeks[f];

                            for (let i = 0; i < week.days.length; i++) {

                                let item = week.days[i];

                                this.listCalendars[e].weeks[f].days[i].isHovered = false;

                                if (item.date !== this.calendar.dateRange.start.date && !this.fConfigs.markedDates.includes(item.date)) {
                                    this.listCalendars[e].weeks[f].days[i].isMarked = false;
                                }

                                if (this.calendar.dateRange.start.date) {
                                    let itemDate = helpCalendar.getDateFromFormat(item.date).getTime();
                                    let thisDate = helpCalendar.getDateFromFormat(date).getTime();
                                    let startDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.start.date).getTime();

                                    this.listCalendars[e].weeks[f].days[i].isMouseToLeft = (itemDate === startDate && thisDate > startDate) || (itemDate === thisDate && thisDate < startDate);
                                    this.listCalendars[e].weeks[f].days[i].isMouseToRight = (itemDate === startDate && thisDate < startDate) || (itemDate === thisDate && thisDate > startDate);

                                    let dateDay = helpCalendar.getDateFromFormat(item.date).getDay() - 1;
                                    if (dateDay === -1) {
                                        dateDay = 6;
                                    }

                                    let dayOfWeekString = this.fConfigs.dayNames[dateDay];
                                    if (!this.fConfigs.disabledDayNames.includes(dayOfWeekString) &&
                                        ((itemDate > startDate && itemDate < thisDate)
                                            ||
                                            (itemDate < startDate && itemDate > thisDate))
                                    ) {
                                        this.listCalendars[e].weeks[f].days[i].isMarked = true;
                                    }

                                    if (this.checkSelDates('min', this.calendar.dateRange.start.date, item.date, date)) {
                                        this.listCalendars[e].weeks[f].days[i].isMarked = true;
                                    }

                                    if (this.checkSelDates('max', this.calendar.dateRange.start.date, item.date, date)) {
                                        this.listCalendars[e].weeks[f].days[i].isMarked = false;
                                    }

                                    if (!this.calendar.dateRange.end.date && itemDate === thisDate) {
                                        this.listCalendars[e].weeks[f].days[i].isHovered = true;

                                    }
                                }
                            }

                        }
                    }
                }
            },
            /**
             * @return {boolean}
             */
            PreMonth(calendarKey = null) {
                if (!this.allowPreDate)
                    return false;

                this.transitionPrefix = 'right';

                if (calendarKey !== null) {
                    let currentCalendar = this.listCalendars[calendarKey];
                    currentCalendar.date = new Date(currentCalendar.date.getFullYear(), currentCalendar.date.getMonth() - 1);
                    currentCalendar.key -= 1;
                    this.updateCalendar();
                } else {
                    this.calendarsKey -= 1;
                    this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() - 1);
                    this.initCalendar();
                }

                this.$emit('changedMonth', this.calendar.currentDate);
            },
            /**
             * @return {boolean}
             */
            NextMonth(calendarKey = null) {
                if (!this.allowNextDate)
                    return false;

                this.transitionPrefix = 'left';

                if (calendarKey !== null) {
                    let currentCalendar = this.listCalendars[calendarKey];
                    currentCalendar.date = new Date(currentCalendar.date.getFullYear(), currentCalendar.date.getMonth() + 1);
                    currentCalendar.key += 1;
                    this.updateCalendar();
                } else {
                    this.calendarsKey += 1;
                    this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() + 1);
                    this.initCalendar();
                }

                this.$emit('changedMonth', this.calendar.currentDate);
            },
            /**
             * @return {boolean}
             */
            PreYear(calendarKey = null) {
                if (!this.allowPreDate)
                    return false;

                let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1;

                if (calendarKey !== null) {
                    let currentCalendar = this.listCalendars[calendarKey];
                    currentCalendar.date = new Date(currentCalendar.date.getFullYear() - step, currentCalendar.date.getMonth());
                    this.updateCalendar();
                    this.$emit('changedYear', currentCalendar.date);
                } else {
                    this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear() - step, this.calendar.currentDate.getMonth());
                    this.initCalendar();
                    this.$emit('changedYear', this.calendar.currentDate);
                }
            },
            /**
             * @return {boolean}
             */
            NextYear(calendarKey = null) {
                if (!this.allowNextDate)
                    return false;

                let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1;

                if (calendarKey !== null) {
                    let currentCalendar = this.listCalendars[calendarKey];
                    currentCalendar.date = new Date(currentCalendar.date.getFullYear() + step, currentCalendar.date.getMonth());
                    this.updateCalendar();
                    this.$emit('changedYear', currentCalendar.date);
                } else {
                    this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear() + step, this.calendar.currentDate.getMonth());
                    this.initCalendar();
                    this.$emit('changedYear', this.calendar.currentDate);
                }
            },
            ChooseDate(date) {
                let newDate = helpCalendar.getDateFromFormat(date);

                if (date === 'today') {
                    newDate = new Date();
                }

                this.calendar.currentDate = newDate;
                this.initCalendar();
            },
            openMonthPicker(key) {
                if (this.fConfigs.changeMonthFunction) {
                    this.showMonthPicker = (key === this.showMonthPicker) ? false : key;
                    this.showYearPicker = false;
                }
            },
            openYearPicker(key) {
                if (this.fConfigs.changeYearFunction) {
                    this.showYearPicker = (key === this.showYearPicker) ? false : key;
                    this.showMonthPicker = false;
                }
            },
            openTimePicker() {
                this.showTimePicker = true;
            },
            pickMonth(calendarKey = null, key) {
                this.showMonthPicker = false;

                if (calendarKey !== null) {
                    let currentCalendar = this.listCalendars[calendarKey];
                    let date = currentCalendar.date;
                    currentCalendar.date = new Date(date.getFullYear(), key + 1, 0);
                    this.updateCalendar();
                } else {
                    let date = this.calendar.currentDate;
                    this.calendar.currentDate = new Date(date.getFullYear(), key + 1, 0);
                    this.initCalendar();
                }

            },
            pickYear(calendarKey = null, year) {
                this.showYearPicker = false;

                if (calendarKey !== null) {
                    let currentCalendar = this.listCalendars[calendarKey];
                    let date = currentCalendar.date;
                    currentCalendar.date = new Date(year, date.getMonth() + 1, 0);
                    this.updateCalendar();
                } else {
                    let date = this.calendar.currentDate;
                    this.calendar.currentDate = new Date(year, date.getMonth() + 1, 0);
                    this.initCalendar();
                }
            },
            getClassNames(day) {
                let classes = [];

                // Disable days of week if set in configuration
                let dateDay = helpCalendar.getDateFromFormat(day.date).getDay() - 1;
                if (dateDay === -1) {
                    dateDay = 6;
                }
                let dayOfWeekString = this.fConfigs.dayNames[dateDay];
                if (this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {
                    day.hide = true;
                    classes.push('vfc-cursor-not-allowed');
                }

                let date = helpCalendar.getDateFromFormat(day.date);
                let today = new Date();
                today.setHours(0, 0, 0, 0);


                // Disabled dates
                if (this.fConfigs.disabledDates.includes(day.date) ||
                    (this.fConfigs.disabledDates.includes('beforeToday') && date.getTime() < today.getTime()) ||
                    (this.fConfigs.disabledDates.includes('afterToday') && date.getTime() > today.getTime())
                ) {
                    classes.push('vfc-disabled');
                    classes.push('vfc-cursor-not-allowed');
                }

                if (this.fConfigs.limits) {
                    let min = helpCalendar.getDateFromFormat(this.fConfigs.limits.min).getTime();
                    let max = helpCalendar.getDateFromFormat(this.fConfigs.limits.max).getTime();

                    if (date.getTime() < min || date.getTime() > max) {
                        classes.push('vfc-disabled');
                        classes.push('vfc-cursor-not-allowed');
                    }
                }

                if (day.hide) {
                    classes.push('vfc-hide');
                }

                // Today date
                if (day.isToday) {
                    classes.push('vfc-today');
                }

                if (!day.hideLeftAndRightDays && !this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {

                    // Mark Date
                    if (day.isMarked) {
                        classes.push('vfc-marked');
                    } else if (day.isHovered) {
                        classes.push('vfc-hovered');
                    }

                    if (this.fConfigs.markedDates.includes(day.date)) {
                        classes.push('vfc-borderd');
                    }

                    // Date Range Marked
                    if (this.fConfigs.markedDateRange.start && this.fConfigs.markedDateRange.end) {
                        if (helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.start) <= helpCalendar.getDateFromFormat(day.date)
                            && helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.end) >= helpCalendar.getDateFromFormat(day.date)) {
                            classes.push('vfc-marked');
                        }

                        if (day.date === this.fConfigs.markedDateRange.start) {
                            classes.push('vfc-start-marked');
                        } else if (day.date === this.fConfigs.markedDateRange.end) {
                            classes.push('vfc-end-marked');
                        }
                    } else {

                        // Only After Start Marked
                        if (this.fConfigs.markedDateRange.start) {
                            if (helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.start) <= helpCalendar.getDateFromFormat(day.date))
                                classes.push('vfc-marked');
                        }

                        // Only Before End Marked
                        if (this.fConfigs.markedDateRange.end) {
                            if (helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.end) >= helpCalendar.getDateFromFormat(day.date))
                                classes.push('vfc-marked');
                        }
                    }

                    classes.push('vfc-hover');
                }


                // Date Mark With Custom Classes
                if (typeof this.fConfigs.markedDates === "object") {
                    let checkMarked = this.fConfigs.markedDates.find(function (markDate) {
                        return markDate.date === day.date;
                    });

                    if (typeof checkMarked !== "undefined") {
                        classes.push(checkMarked.class);
                    }
                }

                if (day.date === this.calendar.dateRange.start.date) {
                    classes.push('vfc-start-marked');
                }

                if (day.date === this.calendar.dateRange.end.date) {
                    classes.push('vfc-end-marked');
                }

                if (day.date === this.calendar.selectedDate || this.calendar.selectedDates.find(date => date.date === day.date)) {
                    classes.push('vfc-borderd')
                }

                return classes;
            },
            checkDateRangeStart(date) {
                return date === this.fConfigs.markedDateRange.start;
            },
            checkDateRangeEnd(date) {
                return date === this.fConfigs.markedDateRange.end;
            },
            checkSelDates(type, startDate, itemDate, hoverDate) {
                let startTime = helpCalendar.getDateFromFormat(startDate).getTime();
                let itemTime = helpCalendar.getDateFromFormat(itemDate).getTime();
                let hoverTime = helpCalendar.getDateFromFormat(hoverDate).getTime();

                let days = type === 'min' ? this.fConfigs.minSelDays : this.fConfigs.maxSelDays - 1;
                let minTime = days * 1000 * 60 * 60 * 24;
                let rightTime = startTime + minTime;
                let leftTime = startTime - minTime;

                let result;
                if (hoverTime > startTime) {
                    if (type === 'min')
                        result = itemTime < rightTime && itemTime > startTime;
                    else
                        result = itemTime > rightTime && itemTime > startTime;
                } else if (hoverTime < startTime) {
                    if (type === 'min')
                        result = itemTime > leftTime && itemTime < startTime;
                    else
                        result = itemTime < leftTime && itemTime < startTime;
                }

                return days && result;
            },
            checkLimits(value) {
                if (this.fConfigs.limits) {
                    let min = new Date(helpCalendar.getDateFromFormat(this.fConfigs.limits.min));
                    min.setDate(1);
                    min.setHours(0, 0, 0, 0);
                    let max = new Date(helpCalendar.getDateFromFormat(this.fConfigs.limits.max));
                    max.setDate(1);
                    max.setHours(0, 0, 0, 0);

                    this.allowPreDate = true;
                    this.allowNextDate = true;

                    let current = new Date(value);
                    current.setDate(1);
                    current.setHours(0, 0, 0, 0);

                    if (current <= min) {
                        this.allowPreDate = false;
                    }

                    if (current >= max) {
                        this.allowNextDate = false;
                    }
                }
            },
            getTransition_() {
                if (!this.fConfigs.transition)
                    return '';

                let name = '';
                if (this.transitionPrefix === 'left') {
                    name = 'vfc-calendar-slide-left';
                } else if (this.transitionPrefix === 'right') {
                    name = 'vfc-calendar-slide-right';
                }
                return name;
            },
            setCalendarStyles() {
                let day = this.$refs.day[0];
                let container = this.$refs.mainContainer;

                container.style.display = "";
                let height = container.clientHeight + (day.clientHeight + (day.clientHeight / 2.5));
                container.style.height = height + "px";

                if (this.fConfigs.isModal) {
                    container.style.display = "none"
                }
            },
            checkHiddenElement(elementName) {
                return !this.fConfigs.hiddenElements.includes(elementName);
            }
        }
    }
</script>

<style lang="scss">
    .vfc-styles-conditional-class {
        @import "../assets/scss/calendar.scss";
    }
</style>
