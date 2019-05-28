<template>
    <div class="vfc-time-picker-container">
        <div class="vfc-close" @click="close()"></div>
        <div class="vfc-modal-time-mechanic">
            <div id="time-line" class="vfc-modal-time-line">
                <span>{{ $parent.calendar.selectedDateTime }}</span>
            </div>
            <div class="vfc-time-picker">
                <div class="vfc-time-picker__list vfc-time-picker__list--hours" ref="hourList">
                    <div class="vfc-time-picker__item" :class="{'vfc-time-picker__item--selected': ($parent.calendar.selectedHour === (i < 10 ? '0'+(i-1) : i))}" v-for="i in 23" @click="changeHour(i < 10 ? '0'+(i-1) : i)">{{ i < 10 ? '0'+(i-1) : i}}</div>
                </div>
                <div class="vfc-time-picker__list vfc-time-picker__list--minutes" ref="minuteList">
                    <div class="vfc-time-picker__item" :class="{'vfc-time-picker__item--selected': ($parent.calendar.selectedMinute === (i < 10 ? '0'+(i-1) : i))}" v-for="i in 59" @click="changeMinute(i < 10 ? '0'+(i-1) : i)">{{ i < 10 ? '0'+(i-1) : i}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TimePicker",
        mounted () {
            this.setSelectedDateTime();
            this.setStyles();
        },
        methods: {
            close() {
                this.$parent.showTimePicker = false;
            },
            changeHour(hour) {
                this.$parent.calendar.selectedHour = hour;
                this.setSelectedDateTime();
            },
            changeMinute(minute)
            {
                this.$parent.calendar.selectedMinute = minute;
                this.setSelectedDateTime();
            },
            setSelectedDateTime() {
                this.$parent.calendar.selectedDateTime = this.$parent.calendar.selectedDate + " " + this.$parent.calendar.selectedHour + ':' + this.$parent.calendar.selectedMinute;
            },
            setStyles() {
                let container = this.$parent.$refs.mainContainer;

                const selectedHour = this.$refs.hourList.querySelector('.vfc-time-picker__item--selected');
                const selectedMinute = this.$refs.minuteList.querySelector('.vfc-time-picker__item--selected');
                this.$refs.hourList.scrollTop = selectedHour ? selectedHour.offsetTop - container.clientHeight/2 : 0;
                this.$refs.minuteList.scrollTop = selectedMinute ? selectedMinute.offsetTop - container.clientHeight/2 : 0;

                let timeLine = document.getElementById('time-line');
                document.getElementsByClassName('vfc-time-picker__list')[0].style.height = container.clientHeight - timeLine.clientHeight + 'px';
                document.getElementsByClassName('vfc-time-picker__list')[1].style.height = container.clientHeight - timeLine.clientHeight + 'px';
            }
        }
    }
</script>

<style scoped>

</style>