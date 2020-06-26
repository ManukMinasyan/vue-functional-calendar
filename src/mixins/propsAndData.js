export const propsAndData = {
  props: {
    configs: {
      type: Object,
      default: () => {}
    },
    sundayStart: {
      type: Boolean,
      default: () => undefined
    },
    placeholder: {
      type: [String, Boolean],
      default: () => undefined
    },
    dateFormat: {
      type: String
    },
    isMultiple: {
      type: Boolean,
      default: () => undefined
    },
    isSeparately: {
      type: Boolean,
      default: () => undefined
    },
    isDatePicker: {
      type: Boolean,
      default: () => undefined
    },
    isMultipleDatePicker: {
      type: Boolean,
      default: () => undefined
    },
    isDateRange: {
      type: Boolean,
      default: () => undefined
    },
    withTimePicker: {
      type: Boolean,
      default: () => undefined
    },
    calendarsCount: {
      type: Number
    },
    isModal: {
      type: Boolean,
      default: () => undefined
    },
    isTypeable: {
      type: Boolean,
      default: () => undefined
    },
    changeMonthFunction: {
      type: Boolean,
      default: () => undefined
    },
    changeYearFunction: {
      type: Boolean,
      default: () => undefined
    },
    changeYearStep: {
      type: Number,
      default: () => 12
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
    limits: {
      type: [Object, Boolean],
      default: () => undefined
    },
    minSelDays: {
      type: [Number, Boolean],
      default: () => undefined
    },
    maxSelDays: {
      type: [Number, Boolean],
      default: () => undefined
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
      default: () => undefined
    },
    value: {
      type: Object
    },
    transition: {
      type: Boolean,
      default: () => undefined
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
          start: {
            date: false,
            dateTime: false,
            hour: '00',
            minute: '00'
          },
          end: {
            date: false,
            dateTime: false,
            hour: '00',
            minute: '00'
          }
        }
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
        dateFormat: 'dd/mm/yyyy',

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
        changeYearStep: 12,

        markedDates: [],
        markedDateRange: {
          start: false,
          end: false
        },

        limits: false,
        minSelDays: false,
        maxSelDays: false,

        disabledDates: [],
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
