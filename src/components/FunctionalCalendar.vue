<template>
    <div class="vfc-popover-container" ref="popoverElement" tabindex="0">
        <PickerInputs
            :fConfigs="fConfigs"
            :dateRangeSelectedStartDate="dateRangeSelectedStartDate"
            :dateRangeSelectedEndDate="dateRangeSelectedEndDate"
            :singleSelectedDate="singleSelectedDate"
            :calendar="calendar"
        />

        <div
            class="vfc-main-container"
            v-show="showCalendar"
            ref="mainContainer"
            :class="{
                'vfc-modal':
                    fConfigs.isModal &&
                    (fConfigs.isDatePicker ||
                        fConfigs.isDateRange ||
                        fConfigs.isMultipleDatePicker),
                'vfc-dark': fConfigs.isDark,
            }"
        >
            <time-picker v-if="showTimePicker"></time-picker>
            <template v-else>
                <div class="vfc-calendars-container">
                    <div
                        class="vfc-separately-navigation-buttons"
                        :class="'vfc-' + fConfigs.arrowsPosition"
                        v-if="!fConfigs.isSeparately"
                    >
                        <div
                            @click="PreMonth(0)"
                            :class="{ 'vfc-cursor-pointer': allowPreDate }"
                        >
                            <slot name="navigationArrowLeft">
                                <div
                                    class="vfc-arrow-left"
                                    :class="{ 'vfc-disabled': !allowPreDate }"
                                ></div>
                            </slot>
                        </div>
                        <div
                            @click="NextMonth(0)"
                            :class="{ 'vfc-cursor-pointer': allowNextDate }"
                        >
                            <slot name="navigationArrowRight">
                                <div
                                    class="vfc-arrow-right"
                                    :class="{ 'vfc-disabled': !allowNextDate }"
                                ></div>
                            </slot>
                        </div>
                    </div>

                    <div class="vfc-calendars" ref="calendars">
                        <div
                            class="vfc-calendar"
                            v-for="(calendarItem, key) in listCalendars"
                            :key="calendarItem.key"
                        >
                            <month-year-picker
                                ref="monthContainer"
                                :class="'vfc-' + fConfigs.titlePosition"
                                v-show="
                                    showMonthPicker === key + 1 ||
                                        showYearPicker === key + 1
                                "
                                :calendar-key="key"
                            >
                            </month-year-picker>
                            <div class="vfc-content">
                                <div
                                    v-if="fConfigs.isSeparately"
                                    class="vfc-separately-navigation-buttons"
                                    :class="'vfc-' + fConfigs.arrowsPosition"
                                >
                                    <div
                                        @click="PreMonth(key)"
                                        :class="{
                                            'vfc-cursor-pointer': allowPreDate,
                                        }"
                                    >
                                        <slot name="navigationArrowLeft">
                                            <div
                                                class="vfc-arrow-left"
                                                :class="{
                                                    'vfc-disabled': !allowPreDate,
                                                }"
                                            ></div>
                                        </slot>
                                    </div>
                                    <div
                                        @click="NextMonth(key)"
                                        :class="{
                                            'vfc-cursor-pointer': allowNextDate,
                                        }"
                                    >
                                        <slot name="navigationArrowRight">
                                            <div
                                                class="vfc-arrow-right"
                                                :class="{
                                                    'vfc-disabled': !allowNextDate,
                                                }"
                                            ></div>
                                        </slot>
                                    </div>
                                </div>
                                <transition
                                    tag="div"
                                    :name="getTransition_()"
                                    appear
                                >
                                    <div
                                        class="vfc-top-date"
                                        :class="'vfc-' + fConfigs.titlePosition"
                                        v-if="checkHiddenElement('month')"
                                    >
                                        <a
                                            href="#"
                                            @click.prevent="
                                                openMonthPicker(key + 1)
                                            "
                                            :class="{
                                                'vfc-cursor-pointer vfc-underline':
                                                    fConfigs.changeMonthFunction,
                                                'vfc-underline-active':
                                                    showMonthPicker === key + 1,
                                            }"
                                        >
                                            {{ calendarItem.month }}</a
                                        >
                                        <a
                                            href="#"
                                            @click.prevent="
                                                openYearPicker(key + 1)
                                            "
                                            :class="{
                                                'vfc-cursor-pointer vfc-underline':
                                                    fConfigs.changeYearFunction,
                                                'vfc-underline-active':
                                                    showYearPicker === key + 1,
                                            }"
                                        >
                                            {{ calendarItem.year }}
                                        </a>
                                    </div>
                                </transition>
                                <transition
                                    tag="div"
                                    :name="getTransition_()"
                                    appear
                                >
                                    <div class="vfc-dayNames">
                                        <span
                                            v-if="fConfigs.showWeekNumbers"
                                        ></span>
                                        <span
                                            v-for="(dayName,
                                            dayKey) in fConfigs.dayNames"
                                            :key="key + dayKey + 1"
                                            class="vfc-day"
                                        >
                                            <template
                                                v-if="
                                                    checkHiddenElement(
                                                        'dayNames'
                                                    )
                                                "
                                            >
                                                {{ dayName }}
                                            </template>
                                        </span>
                                    </div>
                                </transition>
                                <transition-group
                                    tag="div"
                                    :name="getTransition_()"
                                    appear
                                >
                                    <div
                                        class="vfc-week"
                                        v-for="(week,
                                        week_key) in calendarItem.weeks"
                                        :key="key + week_key + 1"
                                    >
                                        <div
                                            v-if="fConfigs.showWeekNumbers"
                                            class="vfc-day vfc-week-number"
                                        >
                                            <span class="vfc-span-day">
                                                {{ week.number }}
                                            </span>
                                        </div>
                                        <div
                                            class="vfc-day"
                                            ref="day"
                                            v-for="(day, day_key) in week.days"
                                            :key="key + week_key + day_key + 1"
                                        >
                                            <div
                                                v-if="
                                                    (day.isDateRangeStart ||
                                                        day.isMouseToLeft) &&
                                                        !day.hideLeftAndRightDays
                                                "
                                                class="vfc-base-start"
                                            ></div>
                                            <div
                                                v-else-if="
                                                    (day.isDateRangeEnd ||
                                                        day.isMouseToRight) &&
                                                        !day.hideLeftAndRightDays
                                                "
                                                class="vfc-base-end"
                                            ></div>
                                            <span
                                                v-if="!day.hideLeftAndRightDays"
                                                :class="getClassNames(day)"
                                                @click="clickDay(day)"
                                                @mouseover="
                                                    dayMouseOver(
                                                        week_key,
                                                        day.date
                                                    )
                                                "
                                            >
                                                <slot :week="week" :day="day">
                                                    {{ day.day }}
                                                </slot>
                                            </span>
                                        </div>
                                    </div>
                                    <template
                                        v-if="
                                            calendarItem.weeks.length < 6 &&
                                                !fConfigs.isLayoutExpandable
                                        "
                                    >
                                        <div
                                            class="vfc-week"
                                            v-for="moreWeekKey in 6 -
                                                calendarItem.weeks.length"
                                            :key="
                                                key + moreWeekKey + 'moreWeek'
                                            "
                                        >
                                            <div
                                                class="vfc-day"
                                                ref="day"
                                                v-for="i in 7"
                                                :key="key + moreWeekKey + i"
                                            >
                                                <span class="vfc-span-day"
                                                    >&nbsp;</span
                                                >
                                            </div>
                                        </div> </template
                                    >>
                                </transition-group>
                            </div>
                        </div>
                    </div>
                    <slot name="footer"></slot>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import helpCalendarClass from "../assets/js/helpCalendar"
import { propsAndData } from "../mixins/propsAndData"
import TimePicker from "../components/TimePicker"
import MonthYearPicker from "../components/MonthYearPicker"
import PickerInputs from "../components/PickerInputs"
import calendarMethods from "../utils/calendarMethods"

export default {
    name: "FunctionalCalendar",
    components: { MonthYearPicker, TimePicker, PickerInputs },
    mixins: [propsAndData],
    computed: {
        helpCalendar() {
            return new helpCalendarClass(
                this.fConfigs.sundayStart,
                this.checkHiddenElement("leftAndRightDays"),
                this.fConfigs.dateFormat,
                this.fConfigs.dayNames
            )
        },
        singleSelectedDate: {
            get() {
                return this.calendar.selectedDate
                    ? this.calendar.selectedDate
                    : ""
            },
            set(newValue) {
                newValue = this.helpCalendar.mask(newValue)
                if (this.helpCalendar.getDateFromFormat(newValue).getMonth()) {
                    this.calendar.selectedDate = newValue
                }
            },
        },
        dateRangeSelectedStartDate: {
            get() {
                return this.calendar.dateRange.start.date
                    ? this.calendar.dateRange.start.date
                    : ""
            },
            set(newValue) {
                newValue = this.helpCalendar.mask(newValue)
                if (this.helpCalendar.getDateFromFormat(newValue).getMonth()) {
                    this.calendar.dateRange.start.date = newValue
                }
            },
        },
        dateRangeSelectedEndDate: {
            get() {
                return this.calendar.dateRange.end.date
                    ? this.calendar.dateRange.end.date
                    : ""
            },
            set(newValue) {
                newValue = this.helpCalendar.mask(newValue)
                if (this.helpCalendar.getDateFromFormat(newValue).getMonth()) {
                    this.calendar.dateRange.end.date = newValue
                }
            },
        },
    },
    created() {
        this.setConfigs()
        this.initCalendar()
    },
    mounted() {
        this.popoverElement = this.$refs.popoverElement
        // Event
        this.popoverElement.addEventListener("focusin", this.onFocusIn)
        this.popoverElement.addEventListener("focusout", this.onFocusOut)
        window.addEventListener("click", this.hideMonthYearPicker)

        // Reacts to external selected dates
        this.$watch(
            "value",
            function(value) {
                if (
                    typeof value === "object" &&
                    (value.hasOwnProperty("dateRange") ||
                        value.hasOwnProperty("selectedDate"))
                ) {
                    this.calendar = value
                }
            },
            { immediate: true, deep: true }
        )

        this.$watch(
            "showCalendar",
            function(value) {
                if (value) this.$emit("opened")
                else this.$emit("closed")
            },
            { immediate: true, deep: true }
        )
    },
    beforeDestroy: function() {
        window.removeEventListener("focusin", this.onFocusIn)
        window.removeEventListener("focusout", this.onFocusOut)
        window.removeEventListener("click", this.hideMonthYearPicker)
    },
    watch: {
        fConfigs: {
            handler() {
                this.markChooseDays()
            },
            deep: true,
            immediate: true,
        },
        calendar: {
            handler() {
                this.markChooseDays()
            },
            deep: true,
            immediate: true,
        },
        "calendar.currentDate": {
            handler(value) {
                this.$emit("input", this.calendar)
                this.checkLimits(value)
            },
        },
    },
    methods: {
        ...calendarMethods,
    },
}
</script>

<style lang="scss">
@import "../assets/scss/calendar.scss";
</style>
