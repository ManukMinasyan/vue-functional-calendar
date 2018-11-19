# VueJS Functional Calendar (Date Picker, Date Range)

[![Build Status](https://travis-ci.org/ManukMinasyan/vue-functional-calendar.svg?branch=master)](https://travis-ci.org/ManukMinasyan/vue-functional-calendar)
[![Version](https://img.shields.io/npm/v/vue-functional-calendar.svg)](https://www.npmjs.com/package/vue-functional-calendar)
[![Downloads](https://img.shields.io/npm/dm/vue-functional-calendar.svg)](https://www.npmjs.com/package/vue-functional-calendar)

## Demo

Demo: https://y3jnxov469.codesandbox.io/

[![Edit VueJS Functional Calendar Component](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3jnxov469?hidenavigation=1)

<img src="https://manukminasyan.github.io/vue-functional-calendar/public/demo.png"/>

#
* Lightweight, high performance calendar component based on Vue.js
* Small memory usage, good performance, good style, and high scalability
* Native js development, no third-party library introduced
* Date Picker, Date Range, Multiple Calendars, Modal Calendar

## Why

* Many clicks on Github pop-up calendar to select components for a certain time, but did not find a component that simply displays the calendar and can click to get time.
* A small number of calendar components take up too much memory, which is obviously not reasonable for a simple function like a calendar.

## Install

```
npm i vue-functional-calendar --save
```

## Usage

### Import Component
```javascript
// Introduced in vue file
import FunctionalCalendar from 'vue-functional-calendar';
````

### Component Settings
````javascript
export default {
    components: {
        FunctionalCalendar
    },
    data() {
        return {
            calendarData: {}
        }
    },
    clickDay(data) {
      console.log(data); // Get Clicked Day
    },
    changeDate(data) {
      console.log(data); //Click left and right to switch months
    },
    clickToday(data) {
      console.log(data); //Jumped to this month
    },
    getSelectedDaysCount(data){
        console.log(data); // Get Selected Days Count
    }
}
````

### Template Usage
````html
<FunctionalCalendar
      // v-model="calendarData"
      
      // v-on:choseDay="clickDay"
      // v-on:changeMonth="changeDate"
      // v-on:isToday="clickToday"
      // v-on:selectedDaysCount="getSelectedDaysCount" // Works only with a date range.
      
      // :sundayStart="true"
      
      // :is-date-range="true"
      // :is-date-picker="true"
      // :is-modal="false"
      
      // :is-multiple="true"
      // :calendars-count="3"
      
      // :change-month-function="true"
      // :change-year-function="true"
      
      // :mark-date="['2018/10/20','2018/10/28', '2018/10/16']"
      // :mark-date-more="arr"
      // :agoDayHide="1514937600" //Do not click before a date. Timestamp 10 digits
      // :futureDayHide="1525104000" //Do not click after a date Timestamp 10 digits
      
      // :day-names="dayNames" //dayNames=['Su','Mo','Tu','We','Th','Fr','Sa']
      // :month-names="monthNames" //monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]
      
      // :apply-stylesheet="true"  
></FunctionalCalendar>
````

### Multiple tag examples
The className of the April 1 tag is mark 1 and some markup styles are made according to the class.
````javascript
arr=[{date:'2018/4/1',className:"mark1"}, {date:'2018/4/13',className:"mark2"}];
``````

## Usage With Configs
### Template Usage   
````html
<FunctionalCalendar
      // v-model="calendarData"
      
      // :configs="calendarConfigs"
      
      // v-on:choseDay="clickDay"
      // v-on:changeMonth="changeDate"
      // v-on:isToday="clickToday"
      // v-on:selectedDaysCount="getSelectedDaysCount" // Works only with a date range.
></FunctionalCalendar>
````
### Component Settings
````javascript
export default {
    components: {
        FunctionalCalendar
    },
    data() {
        return {
            calendarData: {},
            calendarConfigs: {
                sundayStart: false,
                isDatePicker: false,
                isDateRange: false,
                isMultiple: false,
                calendarsCount: 3,
                changeMonthFunction: false,
                changeYearFunction: false,
                markDate: ['2018/10/20','2018/10/28', '2018/10/16'],
                markDateMore: [{date:'2018/11/20',className:"mark1"}, {date:'2018/11/21',className:"mark2"}],
                agoDayHide: 0,
                futureDayHide: 2554387200,
                dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                isModal: false,
                applyStylesheet: true
            }
        }
    },
}
````

### API

| Attributes           | Description                                                        | Whether it must pass |
| :------------- | :----------------------------------------------------------- | :----: 
| choseDay       | Check the method called on a certain day to return the selected date YY-MM-DD                    |    No    |
| changeMonth    | Switch the method called by the month, return the date to switch to a certain month YY-MM-DD            |   No  
| isToday        | When switching the month, if you cut to the current month, call this method and return to the current month today. | No
| selectedDaysCount | Get number of days between date range dates | No
##### Add the ref attribute to the Calendar tab, exposing three methods to switch the month directly
````javascript
For example: <FunctionalCalendar ref="Calendar"></FunctionalCalendar>

    ✅ this.$refs.Calendar.PreMonth();  //Call method implementation to go to last month
    ✅ this.$refs.Calendar.NextMonth(); //Call method implementation to go to next month
    ✅ this.$refs.Calendar.ChoseMonth('2018-12-12'); //Call method implementation to go to a month
    ✅ this.$refs.Calendar.ChoseMonth('2018-12-12',false); //Jump to December 12, 18, but do not select the day
    //The second parameter false means that the date is not selected
````

## Other
* The following Demo.vue has a demo for reference.
* If there are other issues or versions, functionally incompatible mail communication manuk.minasyan1@gmail.com

To develop this package, I used the component vue-calendar-component.
