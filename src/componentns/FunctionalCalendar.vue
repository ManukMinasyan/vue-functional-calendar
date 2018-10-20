<template>
    <div class="main-container">
        <div class="input" v-if="isModal">
            <input type="text" v-model="inputStartDate" @click="showCalendar = !showCalendar" readonly>
            <input type="text" v-model="inputEndDate" @click="showCalendar = !showCalendar" readonly>
        </div>

        <div class="calendar" :class="{'modal': isModal}" v-if="showCalendar">
            <div class="wh_top_changge_buttons">
                <button @click="PreMonth(myDate,false)">
                    <div class="wh_jiantou1"></div>
                </button>
                <li @click="NextMonth(myDate,false)">
                    <div class="wh_jiantou2"></div>
                </li>
            </div>
            <div v-for="(calendar, key) in calendars.slice(0,calendarsCount)" :key="key" class="calendar-for">
                <section class="wh_container">
                    <div class="wh_content_all">
                        <div class="wh_top_changge">
                            <li class="wh_content_li">{{ calendar.dateTop }}</li>
                        </div>
                        <div class="wh_content">
                            <div class="wh_content_item" v-for="(name, key) in dayNames" :key="key">
                                <div class="wh_top_tag">
                                    {{ name }}
                                </div>
                            </div>
                        </div>
                        <div class="wh_content">
                            <div class="wh_content_item"
                                 v-for="(item,index) in calendar.list" :key="index"
                                 @click="clickDay(item,index)">
                                <div class="wh_item_date"
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
    import timeUtil from '../assets/calendar';

    export default {
        data() {
            return {
                myDate: [],
                list: [],
                dateTop: '',
                calendars: [],

                showCalendar: true,
                inputStartDate: 'yyyy/mm/dd',
                inputEndDate: 'yyyy/mm/dd',
                startDate: false,
                endDate: false
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
            }
        },
        watch: {
            isModal: {
                handler(val) {
                    this.setIsModal(val)
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

            if(this.isModal) {
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
            listRendering(date = this.myDate, chooseDay = true) {
                let vm = this;
                this.calendars.forEach(function (calendar, key) {
                    calendar.date = new Date(date.getFullYear(), date.getMonth() + key, date.getDay());
                    vm.getList(calendar.date, chooseDay, key);
                });
            },
            dateMouseOver(date) {
                if (!this.isDatePicker) {
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
                if (!this.isDatePicker) {
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
                let dateFormat = timeUtil.dateFormat(date);
                this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth');
                this.$emit('changeMonth', timeUtil.dateFormat(this.myDate));

                if (isChosedDay) {
                    this.listRendering(this.myDate, dateFormat);
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
            }
        }
    };
</script>

<style scoped>
    .calendar.modal {
        position: absolute;
        margin-top: 5px;
        will-change: transform, opacity;
        background-color: #ffffff;
        background-clip: padding-box;
        box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.25);
        transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .input input {
        font-size: inherit;
        transition: width 200ms;
        padding: 7px;
        width: 120px;
        color: #aaa;
        border: 1px solid #eee;
        text-align: center;
    }

    .input input:first-child {
        border-radius: 10px 0 0 10px;
    }

    .input input:last-child {
        border-radius: 0 10px 10px 0;
    }

    @media screen and (min-width: 460px) {
        .wh_item_date:hover {
            background-color: rgb(218, 218, 218);
            border: 0;
            border-radius: 50%;
            cursor: pointer;
        }

        .wh_item_date:hover.wh_isToday {
            background-color: rgb(218, 218, 218);
            border: 0;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    .main-container {
        width: -moz-fit-content;
        width: fit-content;
        margin: 50px 0 15px 0;
    }

    .wh_container {
        display: flex;
        max-width: 475px;
        margin: auto;
    }

    li {
        list-style-type: none;
    }

    .wh_top_changge {
        display: flex;
    }

    .wh_top_changge li {
        cursor: pointer;
        display: flex;
        color: #000000;
        font-size: 18px;
        flex: 1;
        justify-content: center;
        align-items: center;
        height: 47px;
    }

    .wh_top_changge .wh_content_li {
        cursor: auto;
        flex: 2.5;
    }

    .wh_top_changge_buttons {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px 0;
        margin-bottom: -25px;
    }

    .wh_top_changge_buttons li {
        cursor: pointer;
        display: flex;
        color: #000000;
        font-size: 18px;
    }

    .wh_top_changge_buttons .wh_content_li {
        cursor: auto;
    }

    .wh_content_all {
        font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
        "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
        background-color: #FFFFFF;
        width: 100%;
        min-height: 377px;
        overflow: hidden;
        padding-bottom: 8px;
    }

    .wh_content {
        display: flex;
        flex-wrap: wrap;
        padding: 0 3% 0 3%;
        width: 100%;
    }

    .wh_content:first-child .wh_content_item_tag,
    .wh_content:first-child .wh_content_item {
        color: #ddd;
        font-size: 16px;
    }

    .wh_content_item,
    wh_content_item_tag {
        font-size: 15px;
        width: 13.4%;
        text-align: center;
        color: #000000;
        position: relative;
    }

    .wh_content_item {
        height: 40px;
        margin-bottom: 5px;
    }

    .wh_top_tag {
        line-height: 40px;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .wh_item_date {
        width: 40px;
        height: 40px;
        line-height: 40px;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .wh_jiantou1 {
        width: 12px;
        height: 12px;
        border-top: 2px solid #0a0c19;
        border-left: 2px solid #0a0c19;
        transform: rotate(-45deg);
    }

    .wh_jiantou1:active,
    .wh_jiantou2:active {
        border-color: #ddd;
    }

    .wh_jiantou2 {
        width: 12px;
        height: 12px;
        border-top: 2px solid #0a0c19;
        border-right: 2px solid #0a0c19;
        transform: rotate(45deg);
    }

    .wh_content_item > .wh_isMark {
        margin: auto;
        background-color: rgb(102, 179, 204);
        border-width: 0px;
        border-style: solid;
        border-radius: 0px;
        opacity: 1;
        z-index: 2;
    }

    .wh_content_item .wh_other_dayhide {
        color: #bfbfbf;
    }

    .wh_content_item .wh_other_dayhide.wh_isMark {
        color: rgb(250, 250, 250);
        background-color: rgba(102, 179, 204, 0.5);
    }

    .wh_content_item .wh_want_dayhide {
        color: #bfbfbf;
    }

    .wh_content_item .wh_isToday {
        background: #ff8080;
        border-radius: 50%;
    }

    .wh_content_item .wh_chose_day {
        background-color: rgb(250, 250, 250);
        border-color: rgb(102, 179, 204);
        border-width: 2px;
        border-style: solid;
        border-radius: 50%;
        opacity: 1;
    }

    .calendar-for {
        display: inline-block;
        margin-bottom: 5px;
    }
</style>
