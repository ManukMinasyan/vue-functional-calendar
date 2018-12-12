<template>
    <div :class="{ 'styles-conditional-class': fConfigs.applyStylesheet }" class="main-container">
        <div class="multiple-input" v-if="fConfigs.isModal && fConfigs.isDateRange">
            <input type="text" v-model="inputStartDate" @click="showCalendar = !showCalendar" readonly>
            <input type="text" v-model="inputEndDate" @click="showCalendar = !showCalendar" readonly>
        </div>
        <div v-else-if="fConfigs.isModal && fConfigs.isDatePicker">
            <input class="single-input" type="text" v-model="inputSelectedDate" @click="showCalendar = !showCalendar"
                   readonly>
        </div>

        <div class="functional-calendar" :class="{'functional-modal': fConfigs.isModal}" v-if="showCalendar">
            <div class="date-popover" v-if="showChangeMonth && fConfigs.changeMonthFunction">
                <div class="picker">
                    <div class="flexbox header">
                        <span class="prev">
                            <li @click="PreYear(myDate,false)">
                                <div class="wh_jiantou1"></div>
                            </li>
                        </span>
                        <div class="year"
                             @click="showChangeYearFunction"
                             :class="{pointer: !showChangeYear && fConfigs.changeYearFunction}"
                        >
                            {{ this.myDate.getFullYear() }}
                        </div>
                        <span class="next">
                            <li @click="NextYear(myDate,false)">
                                <div class="wh_jiantou2"></div>
                            </li>
                        </span>
                    </div>
                    <div class="flexbox monthItem" v-if="showChangeYear && fConfigs.changeYearFunction">
                        <div class="item"
                             v-for="i in 12"
                             :key="i"
                             @click="changeYear(i)"
                             :class="{selected: myDate.getFullYear()-8+i===myDate.getFullYear()}"
                        >
                            {{ myDate.getFullYear()-8+i }}
                        </div>
                    </div>
                    <div class="flexbox monthItem" v-else>
                        <div class="item"
                             v-for="(month, key) in fConfigs.monthNames"
                             :key="key"
                             @click="changeMonth(key)"
                             :class="{selected: myDate.getMonth()===key}"
                        >
                            {{ month }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="wh_top_changge_buttons" v-if="showMainCalendar">
                <li @click="PreMonth(myDate,false)">
                    <div class="wh_jiantou1"></div>
                </li>
                <li @click="NextMonth(myDate,false)">
                    <div class="wh_jiantou2"></div>
                </li>
            </div>

            <div class="calendar-for"
                 v-for="(calendar, key) in calendars.slice(0,fConfigs.calendarsCount)"
                 :key="key"
                 v-if="showMainCalendar">
                <section class="wh_container">

                    <div class="wh_content_all">
                        <div class="wh_top_changge">

                            <li class="wh_content_li"
                                :class="{changeMonthClass: fConfigs.changeMonthFunction}"
                                @click="showChangeMonthFunction">
                                {{ calendar.dateTop }}
                            </li>

                        </div>

                        <div class="wh_content">
                            <div class="wh_content_item" v-for="(name, key) in fConfigs.dayNames" :key="key">
                                <div class="wh_top_tag">
                                    {{ name }}
                                </div>
                            </div>
                        </div>
                        <div class="wh_content" v-if="true">
                            <div class="wh_content_item"
                                 v-for="(item,index) in calendar.list"
                                 :key="index+'day'"
                                 @click="clickDay(item,index)">

                                <div class="wh_item_date"
                                     :key="index+'day1'"
                                     @mouseover="dateMouseOver(item.date)"
                                     :class="[getClassNames(item),setClass(item)]">
                                    {{item.id}}
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>


        </div>
    </div>
</template>

<script>
    import timeUtil from '../assets/js/calendar';

    export default {
        data() {
            return {
                myDate: [],
                list: [],
                dateTop: '',
                calendars: [],

                showCalendar: true,
                showMainCalendar: true,
                showChangeMonth: false,
                showChangeYear: false,

                inputSelectedDate: 'yyyy/mm/dd',
                selectedDate: '',
                inputStartDate: 'yyyy/mm/dd',
                inputEndDate: 'yyyy/mm/dd',
                startDate: false,
                endDate: false,

                fConfigs: {
                    sundayStart: false,
                    isDatePicker: false,
                    isDateRange: false,
                    isMultiple: false,
                    calendarsCount: 1,
                    isModal: false,
                    changeMonthFunction: false,
                    changeYearFunction: false,
                    markDate: [],
                    markDateMore: [],
                    agoDayHide: 0,
                    futureDayHide: 2554387200,
                    applyStylesheet: true,
                    dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    disabledDayNames: [],
                    disableMarkDates: false
                }
            };
        },
        props: {
            configs: {
                type: Object,
                default: () => {
                }
            },
            sundayStart: {
                type: Boolean,
                default: () => false
            },
            isModal: {
                type: Boolean,
                default: () => false
            },
            isMultiple: {
                type: Boolean,
                default: () => false
            },
            isDatePicker: {
                type: Boolean,
                default: () => false
            },
            isDateRange: {
                type: Boolean,
                default: () => false
            },
            calendarsCount: {
                type: Number,
                default: () => 1
            },
            dayNames: {
                type: Array,
                default: () => []
            },
            monthNames: {
                type: Array,
                default: () => []
            },
            changeMonthFunction: {
                type: Boolean,
                default: false
            },
            changeYearFunction: {
                type: Boolean,
                default: false
            },
            applyStylesheet: {
                type: Boolean,
                default: true
            },
            newDate: {
                default: () => new Date()
            },
            markDate: {
                type: Array,
                default: () => []
            },
            markDateMore: {
                type: Array,
                default: () => []
            },
            agoDayHide: {
                type: Number,
                default: 0
            },
            futureDayHide: {
                type: Number,
                default: 2554387200
            }
        },
        watch: {
            selectedDate: {
                handler(val) {
                    this.inputSelectedDate = val ? val : 'yyyy/mm/dd';
                }
            },
            startDate: {
                handler(val) {
                    this.inputStartDate = val ? val : 'yyyy/mm/dd';
                }
            },
            endDate: {
                handler(val) {
                    this.inputEndDate = val ? val : 'yyyy/mm/dd';
                }
            },
            markDate: {
                handler() {
                    this.listRendering(this.myDate);
                },
                deep: true
            },
            markDateMore: {
                handler() {
                    this.fConfigs.markDateMore = this.data;
                    this.listRendering(this.myDate);
                },
                deep: true
            },
            agoDayHide: {
                handler(val) {
                    this.agoDayHide = parseInt(val);
                    this.listRendering(this.myDate);
                },
                deep: true
            },
            futureDayHide: {
                handler(val) {
                    this.futureDayHide = parseInt(val);
                    this.listRendering(this.myDate);
                },
                deep: true
            },
            sundayStart: {
                handler() {
                    this.intStart();
                    this.listRendering(this.myDate);
                }, deep: true
            }
        },
        created() {
            this.myDate = new Date();

            this.setConfigs();
            this.intStart();

            if (this.fConfigs.isModal) {
                window.addEventListener('click', (e) => {
                    if (!this.$el.contains(e.target)) {
                        this.showCalendar = false
                    }
                });
            }
        },
        mounted() {
            this.listRendering(this.myDate);
        },
        methods: {
            intStart() {
                timeUtil.sundayStart = this.fConfigs.sundayStart;

                for (let i = 0; i < this.fConfigs.calendarsCount; i++) {
                    let calendar = {date: new Date(), dateTop: '', list: []};
                    this.calendars.push(calendar);

                    if (!this.fConfigs.isMultiple) {
                        break;
                    }
                }


            },
            listRendering(date = false, chooseDay = true) {
                let vm = this;
                this.calendars.forEach(function (calendar, key) {
                    calendar.date = new Date(date.getFullYear(), date.getMonth() + key);
                    vm.getList(calendar.date, chooseDay, key);
                });
            },
            dateMouseOver(date) {
                if (!this.fConfigs.isDateRange) {
                    return false;
                }

                if (
                    (this.startDate === false || this.endDate === false)
                    &&
                    (this.startDate !== false || this.endDate !== false)
                ) {
                    for (let e = 0; e < this.calendars.length; e++) {
                        let calendar = this.calendars[e];

                        for (let f = 0; f < calendar.list.length; f++) {
                            let item = calendar.list[f];

                            this.calendars[e].list[f].isMark = false;

                            let itemDate = new Date(item.date).getTime();
                            let thisDate = new Date(date).getTime();
                            let startDate = new Date(this.startDate).getTime();

                            if (
                                (itemDate > startDate && itemDate < thisDate)
                                ||
                                (itemDate < startDate && itemDate > thisDate)
                            ) {
                                this.calendars[e].list[f].isMark = true;
                            }

                        }
                    }
                }

            },
            setClass(data) {
                let obj = {};
                obj[data.markClassName] = data.markClassName;
                return obj;
            },
            getClassNames(item) {
                const classNames = [];

                if (item.isMark && item.chooseDay !== true) {
                    classNames.push('wh_isMark');
                } else if (item.chooseDay === true) {
                    classNames.push('wh_chose_day');
                } else if (item.isToday === true) {
                    classNames.push('wh_isToday');
                }

                if (item.otherMonth !== 'nowMonth') {
                    classNames.push('wh_other_dayhide');
                }

                if (item.dayHide) {
                    classNames.push('wh_want_dayhide');
                }

                if (this.fConfigs.isDatePicker || this.fConfigs.isDateRange) {
                    classNames.push('cursor-pointer');
                }

                // Disable marked dates
                if (this.fConfigs.disableMarkDates && this.fConfigs.markDate.includes(item.date)) {
                    classNames.push('cursor-disallowed');
                    classNames.push('wh_isMark_disabled');
                }

                // Disable days of week if set in configuration
                let dayOfWeekString = this.fConfigs.dayNames[new Date(item.date).getDay()];

                if (this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {
                    classNames.push('cursor-disallowed');
                    classNames.push('wh_other_dayhide');
                }

                return classNames;
            },
            clickDay: function (item) {

                // Disable days of week if set in configuration
                let dayOfWeekString = this.fConfigs.dayNames[new Date(item.date).getDay()];

                if (this.fConfigs.disabledDayNames.includes(dayOfWeekString)) {
                    return false;
                }

                // Disable days if they are marked.
                if (this.fConfigs.disableMarkDates && this.fConfigs.markDate.includes(item.date)) {
                    return false;
                }
                
                if (!this.fConfigs.isDateRange && !this.fConfigs.isDatePicker) {
                    return false;
                }

                if (item.otherMonth === 'nowMonth' && !item.dayHide) {
                    this.listRendering(this.myDate, item.date);
                }
                if (item.otherMonth !== 'nowMonth') {
                    item.otherMonth === 'preMonth'
                        ? this.PreMonth(item.date)
                        : this.NextMonth(item.date);
                }

                if (this.fConfigs.isDateRange) {
                    let clickDate = new Date(item.date).getTime();
                    let startDate = new Date(this.startDate).getTime();

                    // Two dates is not empty
                    if (this.startDate !== false && this.endDate !== false) {
                        this.startDate = item.date;
                        this.endDate = false;
                        // Not date selected
                    } else if (this.startDate === false && this.endDate === false) {
                        this.startDate = item.date;
                        // Start Date not empty, chose date > start date
                    } else if (this.endDate === false && (clickDate > startDate)) {
                        this.endDate = item.date;
                        // Start date not empty, chose date < start date
                    } else if (this.startDate !== false && (clickDate < startDate)) {
                        this.endDate = this.startDate;
                        this.startDate = item.date;
                    }

                    //Get number of days between date range dates
                    if(this.startDate !== false && this.endDate !== false) {
                        let oneDay = 24*60*60*1000;
                        let firstDate = new Date(this.startDate);
                        let secondDate = new Date(this.endDate);
                        let diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

                        this.$emit('selectedDaysCount', diffDays);
                    }

                    this.$emit('input', {
                        startDate: this.startDate,
                        endDate: this.endDate
                    });
                } else if (this.fConfigs.isDatePicker) {
                    this.selectedDate = item.date;

                    this.$emit('input', {
                        selectedDate: item.date
                    });
                }

                this.markChooseDays();
            },
            ChoseMonth: function (date, isChosedDay = true) {
                date = timeUtil.dateFormat(date);
                this.myDate = new Date(date);
                this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
                if (isChosedDay) {
                    this.listRendering(this.myDate, date);
                } else {
                    this.listRendering(this.myDate);
                }
            },
            PreMonth: function (date = this.myDate, isChosedDay = true) {
                date = timeUtil.dateFormat(date);
                this.myDate = timeUtil.getOtherMonth(this.myDate, 'preMonth');
                this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));
                if (isChosedDay) {
                    this.listRendering(this.myDate, date);
                } else {
                    this.listRendering(this.myDate);
                }
            },
            NextMonth: function (date = this.myDate, isChosedDay = true) {
                date = timeUtil.dateFormat(date);
                this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth');
                this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));

                if (isChosedDay) {
                    this.listRendering(this.myDate, date);
                } else {
                    this.listRendering(this.myDate);
                }
            },
            forMatArgs: function () {
                let markDate = this.fConfigs.markDate;
                let markDateMore = this.fConfigs.markDateMore;
                markDate = markDate.map((k) => {
                    return timeUtil.dateFormat(k);
                });
                markDateMore = markDateMore.map((k) => {
                    k.date = timeUtil.dateFormat(k.date);
                    return k;
                });
                return [markDate, markDateMore];
            },
            markChooseDays() {

                let endDate = this.endDate;

                for (let e = 0; e < this.calendars.length; e++) {
                    let calendar = this.calendars[e];

                    for (let f = 0; f < calendar.list.length; f++) {
                        let item = calendar.list[f];

                        this.calendars[e].list[f].isMark = false;

                        if (new Date(item.date).getTime() >= new Date(this.startDate).getTime() &&
                            new Date(item.date).getTime() <= new Date(endDate).getTime()) {
                            this.calendars[e].list[f].isMark = true;
                        }
                    }
                }
            },
            getList: function (date, chooseDay, calendar_index) {
                const [markDate, markDateMore] = this.forMatArgs();
                this.calendars[calendar_index].dateTop = `${this.fConfigs.monthNames[date.getMonth()]} ${date.getFullYear()}`;
                let arr = timeUtil.getMonthList(date);

                for (let i = 0; i < arr.length; i++) {
                    let markClassName = '';
                    let k = arr[i];

                    k.chooseDay = false;
                    const nowTime = k.date;
                    const t = new Date(nowTime).getTime() / 1000;
                    //Look at the class of each day
                    for (const c of markDateMore) {
                        if (c.date === nowTime) {
                            markClassName = c.className || '';
                        }
                    }
                    //Mark selected some days setting class
                    k.markClassName = markClassName;
                    k.isMark = markDate.indexOf(nowTime) > -1;
                    //Unable to select a day
                    k.dayHide = t < this.fConfigs.agoDayHide || t > this.fConfigs.futureDayHide;
                    if (k.isToday) {
                        this.$emit('isToday', nowTime);
                    }
                    let flag = !k.dayHide && k.otherMonth === 'nowMonth';


                    if (
                        chooseDay && flag &&
                        (
                            (chooseDay === nowTime) || (this.endDate === false && (nowTime === this.startDate || nowTime === this.endDate))
                        )
                    ) {
                        this.$emit('choseDay', nowTime);
                        k.chooseDay = true
                    }
                }

                this.calendars[calendar_index].list = arr;
            },
            showChangeMonthFunction() {
                if (this.fConfigs.changeMonthFunction) {
                    this.showChangeMonth = !this.showChangeMonth;
                    this.showMainCalendar = !this.showMainCalendar
                }
            },
            showChangeYearFunction() {
                if (this.fConfigs.changeYearFunction && !this.showChangeYear) {
                    this.showChangeYear = true;
                }
            },
            PreYear() {
                let date = new Date(this.myDate.getFullYear() - 1, this.myDate.getMonth());
                this.ChoseMonth(date);
                this.listRendering(this.myDate);
            },
            NextYear() {
                let date = new Date(this.myDate.getFullYear() + 1, this.myDate.getMonth());
                this.ChoseMonth(date);
                this.listRendering(this.myDate);
            },
            changeYear(key) {
                this.showChangeYear = false;

                let year = this.myDate.getFullYear() - 8 + key;
                let date = new Date(year, this.myDate.getMonth());
                this.ChoseMonth(date);
                this.listRendering(this.myDate);
            },
            changeMonth(month_key) {
                this.showChangeMonth = !this.showChangeMonth;
                this.showMainCalendar = true;

                if (month_key !== null) {
                    let date = new Date(this.myDate.getFullYear(), month_key);
                    this.ChoseMonth(date);
                    this.listRendering(this.myDate);
                }
            },
            setConfigs() {
                if (typeof (this.configs) !== "undefined") {
                    let vm = this;
                    Object.keys(this.configs).map(function (objectKey) {
                        if (typeof (vm.fConfigs[objectKey]) !== "undefined") {
                            vm.$set(vm.fConfigs, objectKey,  vm.configs[objectKey]);
                        }
                    });
                } else {
                    this.fConfigs.sundayStart = this.sundayStart;

                    this.fConfigs.isDatePicker = this.isDatePicker;
                    this.fConfigs.isDateRange = this.isDateRange;

                    this.fConfigs.isMultiple = this.isMultiple;
                    this.fConfigs.calendarsCount = this.calendarsCount;

                    this.fConfigs.changeMonthFunction = this.changeMonthFunction;
                    this.fConfigs.changeYearFunction = this.changeYearFunction;

                    this.fConfigs.dayNames = this.dayNames.length ? this.dayNames : this.fConfigs.dayNames;
                    this.fConfigs.monthNames = this.monthNames.length ? this.monthNames : this.fConfigs.monthNames;

                    this.fConfigs.markDate = this.markDate;
                    this.fConfigs.markDateMore = this.markDateMore;
                    this.fConfigs.agoDayHide = this.agoDayHide;
                    this.fConfigs.futureDayHide = this.futureDayHide;

                    this.fConfigs.isModal = this.isModal;

                    this.fConfigs.applyStylesheet = this.applyStylesheet;

                    this.fConfigs.disabledDayNames = this.disabledDayNames;
                    this.fConfigs.disableMarkDates = this.disableMarkDates;
                }


                // Is Modal
                if (this.fConfigs.isModal) this.showCalendar = false;
            }
        }
    };
</script>

<style scoped lang="scss">
    .styles-conditional-class {
        &.main-container {
            width: -moz-fit-content;
            width: fit-content;
            margin: 50px 0 15px 0;
        }

        @import "../assets/scss/styles";
    }

    .shift-in-enter-active {
        animation: shift-in 1s;
    }

    .shift-in-leave-active {
        animation: shift-in 1s reverse;
    }

    @keyframes shift-in {
        0% {
            transform: translateX(10px);
            opacity: 0.5;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
</style>
