<template>
    <div class="vfc-time-picker-container">
        <div class="vfc-close" @click="close()"></div>
        <div class="vfc-modal-time-mechanic">
            <div id="time-line" class="vfc-modal-time-line">
                <span>
                    <template v-if="$parent.fConfigs.isDateRange">
                        <span @click="startDateActive = true" :class="{'vfc-active': startDateActive}">{{ $parent.calendar.dateRange.start.dateTime}}</span><template
                            v-if="$parent.calendar.dateRange.end.date"> -<span @click="startDateActive = false"
                                                                               :class="{'vfc-active': !startDateActive}">{{ this.$parent.calendar.dateRange.end.dateTime }}</span></template>
                    </template>
                    <template v-else-if="$parent.fConfigs.isMultipleDatePicker">
                        {{ getCurrentDateTime }}
                    </template>
                    <template v-else>
                        {{ $parent.calendar.selectedDateTime }}
                    </template>
                </span>
            </div>
            <div class="vfc-time-picker">
                <div class="vfc-time-picker__list vfc-time-picker__list--hours" ref="hourList">
                    <div class="vfc-time-picker__item"
                         :class="{'vfc-time-picker__item--selected': checkHourActiveClass(i)}" v-for="i in 23"
                         @click="changeHour(i < 10 ? '0'+(i-1) : i)">{{ i < 10 ? '0'+(i-1) : i}}
                    </div>
                </div>
                <div class="vfc-time-picker__list vfc-time-picker__list--minutes" ref="minuteList">
                    <div class="vfc-time-picker__item"
                         :class="{'vfc-time-picker__item--selected': checkMinuteActiveClass(i)}"
                         v-for="i in 59" @click="changeMinute(i < 10 ? '0'+(i-1) : i)">{{ i < 10 ? '0'+(i-1) : i}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TimePicker",
        data() {
            return {
                startDateActive: true,
                currentSelectedDate: ''
            }
        },
        watch: {
            'startDateActive': function () {
                this.setScrollPosition();
            }
        },
        computed: {
            getCurrentDate() {
                return this.currentSelectedDate.date;
            },
            getCurrentDateTime() {
                return this.currentSelectedDate.dateTime;
            }
        },
        created() {
            let selectedDates = this.$parent.calendar.selectedDates;
            this.currentSelectedDate = selectedDates[selectedDates.length - 1];
        },
        mounted(){
            let startDate = this.$parent.calendar.dateRange.start.date;
            let endDate = this.$parent.calendar.dateRange.end.date;

            if (startDate && startDate < endDate) {
                this.startDateActive = false;
            } else {
                this.startDateActive = true;
            }

            this.setSelectedDateTime();
            this.setStyles();
        },
        methods: {
            close() {
                this.$parent.showTimePicker = false;
            },
            changeHour(hour) {
                if (this.$parent.fConfigs.isDateRange) {
                    if (this.checkStartDate()) {
                        this.$parent.calendar.dateRange.start.hour = hour;
                    } else {
                        this.$parent.calendar.dateRange.end.hour = hour;
                    }
                } else if (this.$parent.fConfigs.isMultipleDatePicker) {
                    let currentDate = this.$parent.calendar.selectedDates.find(date => date.date ===this.getCurrentDate);
                    currentDate.hour = hour;
                } else {
                    this.$parent.calendar.selectedHour = hour;
                }

                this.setSelectedDateTime();
                this.setScrollPosition();
            },
            changeMinute(minute) {
                if (this.$parent.fConfigs.isDateRange) {
                    if (this.checkStartDate()) {
                        this.$parent.calendar.dateRange.start.minute = minute;
                    } else {
                        this.$parent.calendar.dateRange.end.minute = minute;
                    }
                }else if(this.$parent.fConfigs.isMultipleDatePicker){
                    let currentDate = this.$parent.calendar.selectedDates.find(date => date.date === this.getCurrentDate);
                    currentDate.minute = minute;
                } else {
                    this.$parent.calendar.selectedMinute = minute;
                }

                this.setSelectedDateTime();
                this.setScrollPosition();
            },
            setSelectedDateTime() {
                if(this.$parent.fConfigs.isDatePicker) {
                    this.$parent.calendar.selectedDateTime = this.$parent.calendar.selectedDate + " " + this.$parent.calendar.selectedHour + ':' + this.$parent.calendar.selectedMinute;
                }else if(this.$parent.fConfigs.isDateRange) {
                    this.$parent.calendar.dateRange.start.dateTime = this.$parent.calendar.dateRange.start.date + " " + this.$parent.calendar.dateRange.start.hour + ':' + this.$parent.calendar.dateRange.start.minute;
                    this.$parent.calendar.dateRange.end.dateTime = this.$parent.calendar.dateRange.end.date + " " + this.$parent.calendar.dateRange.end.hour + ':' + this.$parent.calendar.dateRange.end.minute;
                }else if(this.$parent.fConfigs.isMultipleDatePicker) {
                    let currentDate = this.$parent.calendar.selectedDates.find(date => date.date === this.getCurrentDate);
                    currentDate.dateTime = currentDate.date + " " + currentDate.hour + ":" + currentDate.minute;
                }
            },
            checkStartDate() {
                return this.startDateActive;
            },
            checkHourActiveClass(i) {
                let hour;
                if (this.$parent.fConfigs.isDateRange) {
                    if (this.checkStartDate()) {
                        hour = this.$parent.calendar.dateRange.start.hour;
                    } else {
                        hour = this.$parent.calendar.dateRange.end.hour;
                    }
                }else if (this.$parent.fConfigs.isMultipleDatePicker) {
                    hour = this.$parent.calendar.selectedDates.find(date => date.date === this.getCurrentDate).hour;
                } else {
                    hour = this.$parent.calendar.selectedHour;
                }

                return hour === (i < 10 ? '0' + (i - 1) : i);
            },
            checkMinuteActiveClass(i) {
                let minute;
                if (this.$parent.fConfigs.isDateRange) {
                    if (this.checkStartDate()) {
                        minute = this.$parent.calendar.dateRange.start.minute;
                    } else {
                        minute = this.$parent.calendar.dateRange.end.minute;
                    }
                } else if(this.$parent.fConfigs.isMultipleDatePicker){
                    minute = this.$parent.calendar.selectedDates.find(date => date.date === this.getCurrentDate).minute;
                }else {
                    minute = this.$parent.calendar.selectedMinute;
                }

                return minute === (i < 10 ? '0' + (i - 1) : i);
            },
            setStyles() {
                let container = this.$parent.$refs.mainContainer;

                this.setScrollPosition();

                let timeLine = document.getElementById('time-line');
                document.getElementsByClassName('vfc-time-picker__list')[0].style.height = container.clientHeight - timeLine.clientHeight + 'px';
                document.getElementsByClassName('vfc-time-picker__list')[1].style.height = container.clientHeight - timeLine.clientHeight + 'px';
            },
            setScrollPosition() {
                let container = this.$parent.$refs.mainContainer;

                this.$nextTick(function () {
                    const selectedHour = this.$refs.hourList.querySelector('.vfc-time-picker__item--selected');
                    const selectedMinute = this.$refs.minuteList.querySelector('.vfc-time-picker__item--selected');

                    this.$refs.hourList.scrollTop = selectedHour ? selectedHour.offsetTop - container.clientHeight / 2 : 0;
                    this.$refs.minuteList.scrollTop = selectedMinute ? selectedMinute.offsetTop - container.clientHeight / 2 : 0;
                });
            }
        }
    }
</script>

<style scoped>

</style>