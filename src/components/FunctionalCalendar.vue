<template>
    <div :class="{'vfc-styles-conditional-class': fConfigs.applyStylesheet }">
        <div class="vfc-multiple-input" v-if="fConfigs.isModal && fConfigs.isDateRange">
            <input type="text" title="Start Date"
                   v-model="input.dateRange.start"
                   :placeholder="fConfigs.placeholder"
                   :readonly="!fConfigs.isTypeable"
                   :maxlength="fConfigs.dateFormat.length"
                   @click="showCalendar = !showCalendar">
            <input type="text" title="End Date"
                   v-model="input.dateRange.end"
                   :placeholder="fConfigs.placeholder"
                   :readonly="!fConfigs.isTypeable"
                   :maxlength="fConfigs.dateFormat.length"
                   @click="showCalendar = !showCalendar">
        </div>
        <div v-else-if="fConfigs.isModal && fConfigs.isDatePicker">
            <input class="vfc-single-input" type="text" title="Date"
                   v-model="input.selectedDate"
                   :placeholder="fConfigs.placeholder"
                   :readonly="!fConfigs.isTypeable"
                   :maxlength="fConfigs.dateFormat.length"
                   @click="showCalendar = !showCalendar">
        </div>

        <div class="vfc-main-container" v-if="showCalendar"
             :class="{'vfc-modal': fConfigs.isModal && (fConfigs.isDatePicker || fConfigs.isDateRange)}">
            <template v-if="showMonthPicker">
                <div class="vfc-months">
                    <div class="vfc-navigation-buttons" v-if="true">
                        <div @click="PreYear">
                            <div class="vfc-arrow-left"></div>
                        </div>
                        <h2 class="vfc-top-date"
                            @click="openYearPicker"
                            :class="{'vfc-underline': !showYearPicker && fConfigs.changeYearFunction}">{{
                            calendar.currentDate.getFullYear() }}</h2>
                        <div @click="NextYear">
                            <div class="vfc-arrow-right"></div>
                        </div>
                    </div>
                    <template v-if="!showYearPicker">
                        <div class="vfc-item" v-for="(month,key) in fConfigs.monthNames"
                             :key="key"
                             :class="{'vfc-selected': calendar.currentDate.getMonth()===key}"
                             @click="pickMonth(key)">
                            {{ month }}
                        </div>
                    </template>
                    <template v-else>
                        <div class="vfc-item"
                             v-for="(year,key) in yearList"
                             :key="key"
                             :class="{'vfc-selected': year.selected}"
                             @click="pickYear(year.year)">
                            {{ year.year }}
                        </div>
                    </template>
                </div>
            </template>
            <template v-else>
                <div class="vfc-navigation-buttons" v-if="true">
                    <div @click="PreMonth" :class="{'vfc-cursor-pointer': allowPreDate}">
                        <div class="vfc-arrow-left" :class="{'vfc-disabled': !allowPreDate}"></div>
                    </div>
                    <div @click="NextMonth" :class="{'vfc-cursor-pointer': allowNextDate}">
                        <div class="vfc-arrow-right" :class="{'vfc-disabled': !allowNextDate}"></div>
                    </div>
                </div>
                <div class="vfc-calendars" :key="calendarsKey">
                    <div class="vfc-calendar" v-for="(calendar, key) in listCalendars" :key="key">
                        <div class="vfc-content">
                            <h2 class="vfc-top-date"
                                :class="{'vfc-cursor-pointer':changeMonthFunction}"
                                @click="openMonthPicker(key)">
                                {{ calendar.dateTop }}
                            </h2>
                            <section class="vfc-dayNames">
                                <span v-for="(dayName, key) in fConfigs.dayNames" :key="key">
                                    {{ dayName }}
                                </span>
                            </section>
                            <transition-group
                                    tag='div'
                                    class='c-title-anchor'
                                    :name='getTransition_()' appear>
                                <div class="vfc-week" v-for="(week, week_key) in calendar.weeks" :key="week_key+0">
                                    <div class="vfc-day" v-for="(day, day_key) in week.days" :key="day_key">
                                        <span :data-date="day.day" :key="day_key"
                                              :class="getClassNames(day)"
                                              @click="clickDay(day)"
                                              @mouseover="dateMouseOver(week_key, day.date)">
                                        </span>
                                    </div>
                                </div>
                            </transition-group>
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

    export default {
        name: "FunctionalCalendar",
        mixins: [propsAndData],
        created() {
            this.setConfigs();
            this.initCalendar();

            if (this.fConfigs.isModal) {
                // Event
                window.addEventListener('click', (e) => {
                    if (!this.$el.contains(e.target)) {
                        this.showCalendar = false
                    }
                });
            }
        },
        mounted() {
            // Reacts to external selected dates
            this.$watch('value', function (value) {
                if (this.fConfigs.isDateRange) {
                    this.calendar.dateRange.start = value.dateRange.start || false;
                    this.calendar.dateRange.end = value.dateRange.end || false
                } else {
                    this.calendar.selectedDate = value.selectedDate || false
                }
            }, {deep: true});

            this.$watch('showCalendar', function (value) {
                if (value)
                    this.$emit('opened');
                else
                    this.$emit('closed');
            }, {immediate: true, deep: true})
        },
        computed: {
            yearList() {
                let years = [];
                let year = this.calendar.currentDate.getFullYear() - 4;
                for (let i = 0; i < 12; i++) {
                    let finalYear = year + i;

                    let selected = false;

                    if (finalYear === this.calendar.currentDate.getFullYear()) {
                        selected = true;
                    }

                    years.push({
                        year: finalYear,
                        selected: selected
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
                    if (this.fConfigs.limits) {
                        let min = helpCalendar.getDateFromFormat(this.fConfigs.limits.min).getTime();
                        let max = helpCalendar.getDateFromFormat(this.fConfigs.limits.max).getTime();

                        let current = value.getTime();
                        this.allowPreDate = true;
                        this.allowNextDate = true;

                        if (current <= min) {
                            this.allowPreDate = false;
                        }

                        if (current >= max) {
                            this.allowNextDate = false;
                        }
                    }
                }
            },
            'calendar.dateRange.start': {
                handler(val) {
                    this.input.dateRange.start = val || '';
                    this.markChooseDays();
                }
            },
            'calendar.dateRange.end': {
                handler(val) {
                    this.input.dateRange.end = val || '';
                    this.markChooseDays();
                }
            },
            'input.selectedDate': {
                handler(val) {
                    this.input.selectedDate = val = helpCalendar.mask(val);
                    if (helpCalendar.getDateFromFormat(val).getMonth()) {
                        this.calendar.selectedDate = val;
                        this.pickYear(helpCalendar.getDateFromFormat(val).getFullYear());
                        this.pickMonth(helpCalendar.getDateFromFormat(val).getMonth());
                        this.markChooseDays();
                    }
                }
            },
            'input.dateRange.start': {
                handler(val) {
                    this.input.dateRange.start = val = helpCalendar.mask(val);
                    if (helpCalendar.getDateFromFormat(val).getMonth()) {
                        this.calendar.dateRange.start = val;
                        // this.pickYear(helpCalendar.getDateFromFormat(val).getFullYear());
                        // this.pickMonth(helpCalendar.getDateFromFormat(val).getMonth());
                        this.markChooseDays();
                    }
                }
            },
            'input.dateRange.end': {
                handler(val) {
                    this.input.dateRange.end = val = helpCalendar.mask(val);
                    if (helpCalendar.getDateFromFormat(val).getMonth()) {
                        this.calendar.dateRange.end = val;
                        // this.pickYear(helpCalendar.getDateFromFormat(val).getFullYear());
                        // this.pickMonth(helpCalendar.getDateFromFormat(val).getMonth());
                        this.markChooseDays();
                    }
                }
            }
        },
        methods: {
            initCalendar() {
                // Set Help Calendar Configs
                helpCalendar.configs.sundayStart = this.fConfigs.sundayStart;
                helpCalendar.configs.leftAndRightDays = this.fConfigs.leftAndRightDays;
                helpCalendar.configs.dateFormat = this.fConfigs.dateFormat;
                helpCalendar.configs.dayNames = this.fConfigs.dayNames;
                helpCalendar.configs.monthNames = this.fConfigs.monthNames;


                // Sunday Start
                if (this.fConfigs.sundayStart) {
                    let dayNames = this.fConfigs.dayNames;
                    let sundayName = dayNames[dayNames.length - 1];
                    dayNames.splice(dayNames.length - 1, 1);
                    dayNames.unshift(sundayName);
                }

                this.setCalendarData();
                this.listRendering();
                this.markChooseDays();
            },
            setCalendarData() {
                let date = this.calendar.currentDate;
                this.listCalendars = [];
                date = new Date(date.getFullYear(), date.getMonth() - 1);
                for (let i = 0; i < this.fConfigs.calendarsCount; i++) {
                    date = new Date(date.getFullYear(), date.getMonth() + 1);

                    let calendar = {
                        date: date,
                        dateTop: `${this.fConfigs.monthNames[date.getMonth()]} ${date.getFullYear()}`,
                        weeks: helpCalendar.getFinalizedWeeks(date.getMonth(), date.getFullYear())
                    };

                    this.listCalendars.push(calendar);

                    if (!this.fConfigs.isMultiple) {
                        break;
                    }
                }
            },
            setConfigs() {
                let vm = this;
                if (typeof (this.configs) !== "undefined") {
                    Object.keys(this.configs).map(function (objectKey) {
                        if (typeof (vm.fConfigs[objectKey]) !== "undefined") {
                            vm.$set(vm.fConfigs, objectKey, vm.configs[objectKey]);
                        }
                    });
                } else {
                    Object.keys(this.$props).map(function (objectKey) {
                        if (typeof (vm.fConfigs[objectKey]) !== "undefined") {
                            vm.$set(vm.fConfigs, objectKey, vm.$props[objectKey]);
                        }
                    });
                }

                // Is Modal
                if (this.fConfigs.isModal) this.showCalendar = false;

                // Placeholder
                if (!this.fConfigs.placeholder) this.fConfigs.placeholder = this.fConfigs.dateFormat;


                // Limits
                if (this.fConfigs.limits) {
                    this.calendar.currentDate = helpCalendar.getDateFromFormat(this.fConfigs.limits.min);
                } else {
                    // New Date
                    this.calendar.currentDate = this.newCurrentDate;
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

                            if (vm.calendar.dateRange.start === helpCalendar.formatDate(date)) {
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
                if (!this.fConfigs.isDateRange && !this.fConfigs.isDatePicker) {
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

                if (this.fConfigs.isDateRange) {

                    let clickDate = helpCalendar.getDateFromFormat(item.date).getTime();

                    let startDate = false;
                    if (this.calendar.dateRange.start) {
                        startDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.start).getTime();
                    }

                    // Two dates is not empty
                    if (this.calendar.dateRange.start !== false && this.calendar.dateRange.end !== false) {
                        this.calendar.dateRange.start = item.date;
                        this.calendar.dateRange.end = false;
                        // Not date selected
                    } else if (this.calendar.dateRange.start === false && this.calendar.dateRange.end === false) {
                        this.calendar.dateRange.start = item.date;
                        // Start Date not empty, chose date > start date
                    } else if (this.calendar.dateRange.end === false && (clickDate > startDate)) {
                        this.calendar.dateRange.end = item.date;
                        // Start date not empty, chose date < start date
                    } else if (this.calendar.dateRange.start !== false && (clickDate < startDate)) {
                        this.calendar.dateRange.end = this.calendar.dateRange.start;
                        this.calendar.dateRange.start = item.date;
                    }


                    //Get number of days between date range dates
                    if (this.calendar.dateRange.start !== false && this.calendar.dateRange.end !== false) {
                        let oneDay = 24 * 60 * 60 * 1000;
                        let firstDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.start);
                        let secondDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.end);
                        let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));

                        this.$emit('selectedDaysCount', diffDays);
                    }

                    this.$emit('input', {
                        dateRange: this.calendar
                    });
                } else if (this.fConfigs.isDatePicker) {
                    this.calendar.selectedDate = item.date;
                    this.$emit('input', this.calendar);
                }

                this.markChooseDays();
            },
            markChooseDays() {
                let vm = this;
                let startDate = vm.calendar.dateRange.start;
                let endDate = vm.calendar.dateRange.end;

                this.listCalendars.forEach((calendar) => {
                    calendar.weeks.forEach((week) => {
                        week.days.forEach((day) => {

                            day.isMarked = false;

                            // Date Picker
                            if (vm.fConfigs.isDatePicker) {
                                if (this.calendar.selectedDate === day.date)
                                    day.isMarked = true;
                            } else {
                                // Date Range
                                if (startDate === day.date)
                                    day.isMarked = true;

                                if (endDate === day.date)
                                    day.isMarked = true;

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
            dateMouseOver(week_key, date) {
                if (!this.fConfigs.isDateRange) {
                    return false;
                }

                if ((this.calendar.dateRange.start === false || this.calendar.dateRange.end === false)
                    && (this.calendar.dateRange.start !== false || this.calendar.dateRange.end !== false)) {
                    for (let e = 0; e < this.listCalendars.length; e++) {
                        let calendar = this.listCalendars[e];

                        for (let f = 0; f < calendar.weeks.length; f++) {
                            let week = calendar.weeks[f];

                            for (let i = 0; i < week.days.length; i++) {

                                let item = week.days[i];

                                if (item.date !== this.calendar.dateRange.start && !this.fConfigs.markedDates.includes(item.date)) {
                                    this.listCalendars[e].weeks[f].days[i].isMarked = false;
                                }

                                if (this.calendar.dateRange.start) {
                                    let itemDate = helpCalendar.getDateFromFormat(item.date).getTime();
                                    let thisDate = helpCalendar.getDateFromFormat(date).getTime();
                                    let startDate = helpCalendar.getDateFromFormat(this.calendar.dateRange.start).getTime();

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

                                }
                            }

                        }
                    }
                }
            },
            /**
             * @return {boolean}
             */
            PreMonth() {
                if (!this.allowPreDate)
                    return false;

                this.transitionPrefix = 'right';

                this.calendarsKey -= 1;

                this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() - 1);
                this.initCalendar();
                this.$emit('changedMonth', this.calendar.currentDate);
            },
            /**
             * @return {boolean}
             */
            NextMonth() {
                if (!this.allowNextDate)
                    return false;

                this.transitionPrefix = 'left';

                this.calendarsKey += 1;

                this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear(), this.calendar.currentDate.getMonth() + 1);
                this.initCalendar();
                this.$emit('changedMonth', this.calendar.currentDate);
            },
            /**
             * @return {boolean}
             */
            PreYear() {
                if (!this.allowPreDate)
                    return false;

                this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear() - 1, this.calendar.currentDate.getMonth());
                this.initCalendar();
                this.$emit('changedYear', this.calendar.currentDate);
            },
            /**
             * @return {boolean}
             */
            NextYear() {
                if (!this.allowNextDate)
                    return false;

                this.calendar.currentDate = new Date(this.calendar.currentDate.getFullYear() + 1, this.calendar.currentDate.getMonth());
                this.initCalendar();
                this.$emit('changedYear', this.calendar.currentDate);
            },
            ChooseDate(date) {
                this.calendar.currentDate = helpCalendar.getDateFromFormat(date);
                this.initCalendar();
            },
            openMonthPicker() {
                if (this.fConfigs.changeMonthFunction)
                    this.showMonthPicker = true;
            },
            openYearPicker() {
                if (this.fConfigs.changeYearFunction)
                    this.showYearPicker = true;
            },
            pickMonth(key) {
                this.showMonthPicker = false;
                let date = this.calendar.currentDate;
                this.calendar.currentDate = new Date(date.getFullYear(), key + 1, 0);
                this.initCalendar();
            },
            pickYear(year) {
                this.showYearPicker = false;
                let date = this.calendar.currentDate;
                this.calendar.currentDate = new Date(year, date.getMonth(), 0);
                this.initCalendar();
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

                // Disabled dates
                if (this.fConfigs.disabledDates.includes(day.date)) {
                    classes.push('vfc-disabled');
                    classes.push('vfc-cursor-not-allowed');
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
                    }

                    // Date Range Marked
                    if (this.fConfigs.markedDateRange.start && this.fConfigs.markedDateRange.end) {
                        if (helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.start) <= helpCalendar.getDateFromFormat(day.date)
                            && helpCalendar.getDateFromFormat(this.fConfigs.markedDateRange.end) >= helpCalendar.getDateFromFormat(day.date)) {
                            classes.push('vfc-marked');
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

                if(day.date === this.calendar.dateRange.start || day.date === this.calendar.dateRange.end || day.date === this.calendar.selectedDate){
                    classes.push('borderd');
                }

                return classes;
            },
            getTransition_() {
                if(!this.fConfigs.transition)
                    return '';

                let name = '';
                if(this.transitionPrefix === 'left'){
                    name = 'vfc-calendar-slide-left';
                }else if(this.transitionPrefix === 'right') {
                    name = 'vfc-calendar-slide-right';
                }
                return name;
            },
        }
    }
</script>

<style scoped lang="scss">
    .vfc-styles-conditional-class {
        @import "../assets/scss/calendar.scss";
    }
</style>