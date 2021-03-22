const undefinedGenerator = () => undefined

export const propsAndData = {
  props: {
    borderColor: {
      type: String,
      default: ''
    },
    displayTimeInput: {
      type: Boolean,
      default: false
    },
    configs: {
      type: Object,
      default: () => {}
    },
    sundayStart: {
      type: Boolean,
      default: undefinedGenerator
    },
    placeholder: {
      type: [String, Boolean],
      default: undefinedGenerator
    },
    dateFormat: {
      type: String,
      validator(format) {
        let timeFormat = format.split(' ')[1]
        if (!timeFormat) {
          return true
        }
        const validFormats = ['HH:MM', 'HH:mm', 'hh:MM', 'hh:mm']
        return !!~validFormats.indexOf(timeFormat)
      }
    },
    canClearRange: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: undefinedGenerator
    },
    isSeparately: {
      type: Boolean,
      default: undefinedGenerator
    },
    isDatePicker: {
      type: Boolean,
      default: undefinedGenerator
    },
    isMultipleDatePicker: {
      type: Boolean,
      default: undefinedGenerator
    },
    isMultipleDateRange: {
      type: Boolean,
      default: undefinedGenerator
    },
    isDateRange: {
      type: Boolean,
      default: undefinedGenerator
    },
    withTimePicker: {
      type: Boolean,
      default: undefinedGenerator
    },
    calendarsCount: {
      type: Number
    },
    isModal: {
      type: Boolean,
      default: undefinedGenerator
    },
    isTypeable: {
      type: Boolean,
      default: undefinedGenerator
    },
    changeMonthFunction: {
      type: Boolean,
      default: undefinedGenerator
    },
    changeYearFunction: {
      type: Boolean,
      default: undefinedGenerator
    },
    changeYearStep: {
      type: Number,
      default: () => 3
    },
    changeMonthStep: {
      type: Number,
      default: () => 1
    },
    newCurrentDate: {
      type: Date
    },
    markedDates: {
      type: Array,
      default: () => []
    },
    markedDateRange: {
      type: [Object, Array]
    },
    disabledDayNames: {
      type: Array
    },
    disabledDates: {
      type: Array
    },
    enabledDates: {
      type: Array
    },
    limits: {
      type: [Object, Boolean],
      default: undefinedGenerator
    },
    minSelDays: {
      type: [Number, Boolean],
      default: undefinedGenerator
    },
    maxSelDays: {
      type: [Number, Boolean],
      default: undefinedGenerator
    },
    dayNames: {
      type: Array
    },
    monthNames: {
      type: Array
    },
    shortMonthNames: {
      type: Array
    },
    showWeekNumbers: {
      type: Boolean,
      default: undefinedGenerator
    },
    value: {
      type: Object
    },
    transition: {
      type: Boolean,
      default: undefinedGenerator
    },
    hiddenElements: {
      type: Array
    },
    isAutoCloseable: {
      type: Boolean,
      default: undefined
    },
    isDark: {
      type: Boolean,
      default: undefined
    },
    isLayoutExpandable: {
      type: Boolean,
      default: undefined
    },
    titlePosition: {
      type: String,
      default: 'center'
    },
    arrowsPosition: {
      type: String,
      default: 'space-between'
    },
    alwaysUseDefaultClasses: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popoverElement: '',
      defaultDateFormat: {
        date: false,
        dateTime: false,
        hour: '00',
        minute: '00'
      },
      hoveredObject: null,
      calendar: {
        currentDate: new Date(),
        selectedDate: false,
        selectedDateTime: false,
        selectedHour: '00',
        selectedMinute: '00',
        selectedDatesItem: '',
        selectedDates: [],
        dateRange: {
          start: '',
          end: ''
        },
        multipleDateRange: []
      },
      transitionPrefix: 'left',
      showCalendar: true,
      showMonthPicker: false,
      showYearPicker: false,
      showTimePicker: false,
      allowPreDate: true,
      allowNextDate: true,
      listCalendars: [],
      fConfigs: {
        sundayStart: false,
        placeholder: false,
        dateFormat: 'dd/mm/yyyy hh:MM',
        isMultipleDateRange: false,
        isDatePicker: false,
        isMultipleDatePicker: false,
        isDateRange: false,
        withTimePicker: false,
        isMultiple: false,
        calendarsCount: 1,
        isSeparately: false,

        isModal: false,
        isTypeable: false,

        changeMonthFunction: false,
        changeYearFunction: false,
        changeYearStep: 3,

        changeMonthStep: 1,

        markedDates: [],
        markedDateRange: {
          start: false,
          end: false
        },

        limits: false,
        minSelDays: false,
        maxSelDays: false,

        disabledDates: [],
        enabledDates: [],
        disabledDayNames: [],

        dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        monthNames: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        shortMonthNames: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],

        showWeekNumbers: false,
        transition: true,
        hiddenElements: [],
        isAutoCloseable: false,
        isDark: false,
        isLayoutExpandable: false,

        titlePosition: 'center',
        arrowsPosition: 'space-between'
      }
    }
  }
}
