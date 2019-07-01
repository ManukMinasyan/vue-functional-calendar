export const propsAndData = {
    props: {
        configs: {
            type: Object,
            default: () => {
            }
        },
        sundayStart: {
            type: Boolean,
            default: () => false
        },
        placeholder: {
            type: [String, Boolean],
            default: () => false
        },
        dateFormat: {
            type: String
        },
        isMultiple: {
            type: Boolean,
            default: () => false
        },
        isSeparately: {
            type: Boolean,
            default: () => false
        },
        isDatePicker: {
            type: Boolean,
            default: () => false
        },
        isMultipleDatePicker: {
            type: Boolean,
            default: () => false
        },
        isDateRange: {
            type: Boolean,
            default: () => false
        },
        withTimePicker: {
            type: Boolean,
            default: () => false
        },
        calendarsCount: {
            type: Number
        },
        isModal: {
            type: Boolean,
            default: () => false
        },
        isTypeable: {
            type: Boolean,
            default: () => false
        },
        changeMonthFunction: {
            type: Boolean,
            default: () => false
        },
        changeYearFunction: {
            type: Boolean,
            default: () => false
        },
        applyStylesheet: {
            type: Boolean,
            default: () => true
        },
        newCurrentDate: {
            type: Date
        },
        markedDates: {
            type: Array,
            default: () => []
        },
        markedDateRange: {
            type: Object
        },
        disabledDayNames: {
            type: Array
        },
        disabledDates: {
            type: Array
        },
        limits: {
            type: [Object, Boolean],
            default: () => false
        },
        dayNames: {
            type: Array,
        },
        monthNames: {
            type: Array
        },
        value: {
            type: Object
        },
        transition: {
            type: Boolean,
            default: () => true
        },
        hiddenElements: {
            type: Array
        },
        isAutoCloseable: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            defaultDateFormat: {
                date: false,
                dateTime: false,
                hour: '00',
                minute: '00',
            },
            calendar: {
                currentDate: new Date(),
                selectedDate: false,
                selectedDateTime: false,
                selectedHour: '00',
                selectedMinute: '00',
                selectedDates: [],
                dateRange: {
                    start: {
                        date: false,
                        dateTime: false,
                        hour: '00',
                        minute: '00',
                    },
                    end: {
                        date: false,
                        dateTime: false,
                        hour: '00',
                        minute: '00',
                    }
                }
            },
            input: {
                selectedDate: '',
                dateRange: {
                    start: {
                        date: '',
                        dateTime: '',
                        hour: '',
                        minute: ''
                    },
                    end: {
                        date: '',
                        dateTime: '',
                        hour: '',
                        minute: ''
                    }
                }
            },
            calendarsKey: 0,
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

                applyStylesheet: true,

                markedDates: [],
                markedDateRange: {
                    start: false,
                    end: false
                },

                limits: false,

                disabledDates: [],
                disabledDayNames: [],

                dayNames: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

                transition: true,
                hiddenElements: [],
                isAutoCloseable: false,
            }
        }
    }
};
