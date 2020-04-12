# Installation

## NPM
```
npm i vue-functional-calendar --save
```

## Global Usage

```js
// Introduced in vue file
import FunctionalCalendar from 'vue-functional-calendar';
Vue.use(FunctionalCalendar, {
    dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
});
```

## Single Usage
````js
// Introduced in vue file
import { FunctionalCalendar } from 'vue-functional-calendar';

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

````vue
<FunctionalCalendar
      // v-model="calendarData"
      
      // v-on:changedMonth="changedMonth"
      // v-on:changedYear="changedYear"
      
      // :sundayStart="true"
      // :date-format="'dd/mm/yyyy'"
      // :is-date-range="true"
      // :is-date-picker="true"
      // :is-multiple-date-picker="true"
></FunctionalCalendar>
````

## Usage With Configs

````js
// Introduced in vue file
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

````vue
<FunctionalCalendar
      // v-model="calendarData"
      // :configs="calendarConfigs"
></FunctionalCalendar>
````