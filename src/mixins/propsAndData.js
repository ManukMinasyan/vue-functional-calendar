import { DEFAULT_LABELS } from '../utils/locale'

export const createCalendarState = () => ({
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
})

export const propsAndData = {
  props: {
    activeHours: {
      type: Array,
      required: false
    },
    activeMinutes: {
      type: Array,
      required: false
    },
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
      default: undefined
    },
    locale: {
      type: String,
      default: undefined
    },
    labels: {
      type: Object,
      default: undefined
    },
    presets: {
      type: [Boolean, Array],
      default: undefined
    },
    placeholder: {
      type: [String, Boolean],
      default: undefined
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
      default: undefined
    },
    isSeparately: {
      type: Boolean,
      default: undefined
    },
    isDatePicker: {
      type: Boolean,
      default: undefined
    },
    isMultipleDatePicker: {
      type: Boolean,
      default: undefined
    },
    isMultipleDateRange: {
      type: Boolean,
      default: undefined
    },
    isDateRange: {
      type: Boolean,
      default: undefined
    },
    withTimePicker: {
      type: Boolean,
      default: undefined
    },
    calendarsCount: {
      type: Number
    },
    isModal: {
      type: Boolean,
      default: undefined
    },
    isTypeable: {
      type: Boolean,
      default: undefined
    },
    changeMonthFunction: {
      type: Boolean,
      default: undefined
    },
    changeYearFunction: {
      type: Boolean,
      default: undefined
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
      type: Array,
      default: () => []
    },
    enabledDates: {
      type: Array,
      default: () => []
    },
    limits: {
      type: [Object, Boolean],
      default: undefined
    },
    minSelDays: {
      type: [Number, Boolean],
      default: undefined
    },
    maxSelDays: {
      type: [Number, Boolean],
      default: undefined
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
      default: undefined
    },
    modelValue: {
      type: Object
    },
    transition: {
      type: Boolean,
      default: undefined
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
      dialogId: '',
      popoverElement: '',
      popoverOpener: null,
      restoringFocus: false,
      focusedDate: '',
      patching: false,
      focusToken: null,
      customDayNames: false,
      customMonthNames: false,
      defaultDateFormat: {
        date: false,
        dateTime: false,
        hour: '00',
        minute: '00'
      },
      presetNow: new Date(),
      batchingModel: false,
      calendar: createCalendarState(),
      transitionPrefix: 'left',
      showCalendar: true,
      showMonthPicker: false,
      showYearPicker: false,
      showTimePicker: false,
      allowPreDate: true,
      allowNextDate: true,
      listCalendars: [],
      weekStart: 1,
      fConfigs: {
        sundayStart: false,
        locale: '',
        labels: { ...DEFAULT_LABELS },
        presets: false,
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
