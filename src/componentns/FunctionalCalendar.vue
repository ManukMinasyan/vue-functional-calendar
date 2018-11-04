<template>
    <div :class="{ 'styles-conditional-class': applyStylesheet }" class="main-container">
        <div class="multiple-input" v-if="isModal && isDateRange">
            <input type="text" v-model="inputStartDate" @click="showCalendar = !showCalendar" readonly>
            <input type="text" v-model="inputEndDate" @click="showCalendar = !showCalendar" readonly>
        </div>
        <div v-else-if="isModal && isDatePicker">
            <input class="single-input" type="text" v-model="inputSelectedDate" @click="showCalendar = !showCalendar"
                   readonly>
        </div>

        <div class="functional-calendar" :class="{'functional-modal': isModal}" v-if="showCalendar">
            <div class="date-popover" v-if="showChangeMonth && changeMonthFunction">
                <div class="picker">
                    <div class="flexbox header">
                        <span class="prev">
                            <li @click="PreYear(myDate,false)">
                                <div class="wh_jiantou1"></div>
                            </li>
                        </span>
                        <div class="year"
                             @click="showChangeYearFunction"
                             :class="{pointer: !showChangeYear && changeYearFunction}"
                        >
                            {{ this.myDate.getFullYear() }}
                        </div>
                        <span class="next">
                            <li @click="NextYear(myDate,false)">
                                <div class="wh_jiantou2"></div>
                            </li>
                        </span>
                    </div>
                    <div class="flexbox monthItem" v-if="showChangeYear && changeYearFunction">
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
                             v-for="(month, key) in monthNames"
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
                 v-for="(calendar, key) in calendars.slice(0,calendarsCount)"
                 :key="key"
                 v-if="showMainCalendar">
                <section class="wh_container">

                    <div class="wh_content_all">
                        <div class="wh_top_changge">

                            <li class="wh_content_li"
                                :class="{changeMonthClass: changeMonthFunction}"
                                @click="showChangeMonthFunction">
                                {{ calendar.dateTop }}
                            </li>

                        </div>

                        <div class="wh_content">
                            <div class="wh_content_item" v-for="(name, key) in dayNames" :key="key">
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

                                <div class="wh_item_date" :key="index+'day1'"
                                     @mouseover="dateMouseOver(item.date)"
                                     v-bind:class="[getClassNames(item),setClass(item)]">
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
            };
        },
        props: {
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
            dayNames: {
                type: Array,
                default: () => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            },
            monthNames: {
                type: Array,
                default: () => [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ]
            },
            changeMonthFunction: {
                type: Boolean,
                default: false
            },
            changeYearFunction: {
                type: Boolean,
                default: false
            },
            sundayStart: {
                type: Boolean,
                default: () => false
            },
            agoDayHide: {
                type: Number,
                default: 0
            },
            futureDayHide: {
                type: Number,
                default: 2554387200
            },
            applyStylesheet: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            isModal: {
                handler(val) {
                    this.setIsModal(val)
                }
            },
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
            this.intStart();
            this.myDate = new Date();


            let self = this;

            if (this.isModal) {
                window.addEventListener('click', function (e) {
                    // close dropdown when clicked outside
                    if (!self.$el.contains(e.target)) {
                        self.showCalendar = false
                    }
                });
            }

            this.setIsModal(this.isModal);
        },
        mounted() {
            this.listRendering(this.myDate);
        },
        methods: {
            intStart() {
                timeUtil.sundayStart = this.sundayStart;

                for (let i = 0; i < this.calendarsCount; i++) {
                    let calendar = {date: new Date(), dateTop: '', list: []};
                    this.calendars.push(calendar);

                    if (!this.isMultiple) {
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
                if (!this.isDateRange) {
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


                return classNames;
            },
            clickDay: function (item) {
                if (!this.isDateRange && !this.isDatePicker) {
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

                if (this.isDateRange) {
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

                    this.$emit('input', {
                        startDate: this.startDate,
                        endDate: this.endDate
                    });
                } else if (this.isDatePicker) {
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
                let markDate = this.markDate;
                let markDateMore = this.markDateMore;
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
                this.calendars[calendar_index].dateTop = `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
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
                    k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
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
            setIsModal(val = false) {
                if (val) {
                    this.showCalendar = false;
                }
            },
            showChangeMonthFunction() {
                if (this.changeMonthFunction) {
                    this.showChangeMonth = !this.showChangeMonth;
                    this.showMainCalendar = !this.showMainCalendar
                }
            },
            showChangeYearFunction() {
                if (this.changeYearFunction) {
                    this.showChangeYear = !this.showChangeYear;
                }
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
