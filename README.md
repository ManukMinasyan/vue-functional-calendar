# VueJS Functional Calendar (Date Picker, Date Range) [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Lightweight,%20high%20performance%20calendar%20component%20based%20on%20Vue.js&url=https://github.com/ManukMinasyan/vue-functional-calendar&via=github&hashtags=vue,calendar,design,developers)

[![Build Status](https://travis-ci.org/ManukMinasyan/vue-functional-calendar.svg?branch=master)](https://travis-ci.org/ManukMinasyan/vue-functional-calendar)
[![Version](https://img.shields.io/npm/v/vue-functional-calendar.svg)](https://www.npmjs.com/package/vue-functional-calendar)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![Downloads](https://img.shields.io/npm/dm/vue-functional-calendar.svg)](https://www.npmjs.com/package/vue-functional-calendar)
![gzip size](https://img.shields.io/badge/gzip%20size-5.73%20kB-44cc11.svg)
___

## Demo

Demo: https://y3jnxov469.codesandbox.io/

[![Edit VueJS Functional Calendar Component](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/980jov4m4p?fontsize=14&hidenavigation=1)

<img src="https://manukminasyan.github.io/vue-functional-calendar/public/demo.png"/>

___

* Lightweight, high-performance calendar component based on Vue.js
* Small memory usage, good performance, good style, and high scalability
* Native js development, no third-party library introduced
* Date Picker, Date Range, Multiple Calendars, Modal Calendar

___

## Browser Support
![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |


___

## Install

```
npm i vue-functional-calendar --save
```
___

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
    }
}
````

### Template Usage
````html
<FunctionalCalendar
      // v-model="calendarData"
      
      // v-on:changedMonth="changedMonth"
      // v-on:changedYear="changedYear"
      
      // :sundayStart="true"
      // :date-format="'dd/mm/yyyy'"
      // :is-date-range="true"
      // :is-date-picker="true"      
       :...:
></FunctionalCalendar>
````
___

## Usage With Configs
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
                dateFormat: 'dd/mm/yyyy',
                isDatePicker: false,
                isDateRange: false
            }
        }
    },
}
````

### Template Usage   
````html
<FunctionalCalendar
      // v-model="calendarData"
      // :configs="calendarConfigs"
></FunctionalCalendar>
````
___

### A note on markDates
The `markedDates` property **must** be in JavaScript Date format, e.g, no leading zeroes on month and days. 

✅ Correct: 1/12/2019
❎ Incorrect: 01/12/2019
___

## Available props
| Prop                          | Type            | Default     | Example     | Description                              |
|-------------------------------|-----------------|-------------|-------------|------------------------------------------|             
| sundayStart                   | Boolean         | false       | true        | Week start sunday                       |
| newCurrentDate                   | Date         | new Date()       | new Date(2019,10,11)        | Calendar Current Date                       |
| limits                   | [Object, Boolean]         | false       | {min: '31/10/2019', max: '31/12/2019'}        | Set calendar show, and marked dates limits.                       |
| placeholder                   | [String, Boolean]         | false       | 'yyyy/mm/dd'        | Date input placeholder                       |
| dateFormat                   | String         | 'dd/mm/yyyy'       | 'yyyy/mm/dd'        | Date formatting string                       |
| leftAndRightDays                   | Boolean         | true       | false        | Show or hide left and right days, prev or next months                       |
| isDatePicker                   | Boolean         | false       | true        | Enable or disable date picker                     |
| isDateRange                   | Boolean         | false       | true        | Enable or disable date range                     |
| isMultiple                   | Boolean         | false       | true        | Enable multiple calendar function                     |
| calendarsCount                   | Number         | 1       | 3        | Count of calendars, working only is prop isMultiple                    |
| isModal                   | Boolean         | false       | true        | Enable modal calendar function                    |
| isTypeable                   | Boolean         | false       | true        | Enable manually date typing function, working only with prop isModal                     |
| changeMonthFunction                   | Boolean         | false       | true        | Enable changed month with list, function                   |
| changeYearFunction                   | Boolean         | false       | true        | Enable changed year with list, function                   |
| applyStylesheet                   | Boolean         | true       | false        | Disable default styles                   |
| markedDates                   | Array         | []       | ['10/12/2018', '12/12/2018'] OR [{date: '10/1/2019', class: 'marked-class'},{date: '12/1/2019', class: 'marked-class-2'}]        | Marked dates array                   |
| markedDateRange                   | Object         | {start: false, end: false}       | {start: '12/12/2018', end: '20/12/2018'}        | Marked date with range                   |
| disabledDayNames                   | Array         | []     | ['Su','We']        | Disabled Days Of Week                   |
| disabledDates                   | Array         | []     | ['24/12/2018','27/12/2018']        | Disabled Dates                   |
| dayNames                   | Array         | ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']       | ['Monday', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Sunday']        | Week Day Names                   |
| monthNames                   | Array         | ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]       | ["Jan.", "Feb.", "Mar", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]        | Month names                   |
| transition                    | Boolean         | true      | false | Calendar animations               |
___

### Events

| Event          | Output       | Description                                                        |
| :------------- | :------------- | :-----------------------------------------------------------: 
| changedMonth |Date | Month page has been changed
| changedYear |Date | Year page has been changed
| selectedDaysCount |Number | Get number of days between date range dates
| opened | | The picker is opened
| closed | | The picker is closed
##### Add the ref attribute to the Calendar tab, exposing three methods to switch the month directly
````javascript
For example: <FunctionalCalendar ref="Calendar"></FunctionalCalendar>

    ✅ this.$refs.Calendar.PreMonth();  //Call method implementation to go to previous month
    ✅ this.$refs.Calendar.NextMonth(); //Call method implementation to go to next month
    ✅ this.$refs.Calendar.PreYear(); //Call method implementation to go to previous year
    ✅ this.$refs.Calendar.NextYear(); //Call method implementation to go to next year
    ✅ this.$refs.Calendar.ChooseDate('2018-12-12'); //Call method implementation to go to a date
````
___

## Other
* The following Demo.vue has a demo for reference.
