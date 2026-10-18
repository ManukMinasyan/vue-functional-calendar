import type {
  App,
  DefineComponent,
  EmitsToProps,
  PublicProps,
  SlotsType
} from 'vue'

export interface FunctionalCalendarDateRange {
  start: string
  end: string
}

export interface FunctionalCalendarSelectedDate {
  date: string | false
  dateTime: string | false
  hour: string
  minute: string
}

export interface FunctionalCalendarValue {
  currentDate: Date
  selectedDate: string | false
  selectedDateTime: string | false
  selectedHour: string
  selectedMinute: string
  selectedDatesItem: string
  selectedDates: FunctionalCalendarSelectedDate[]
  dateRange: FunctionalCalendarDateRange
  multipleDateRange: FunctionalCalendarDateRange[]
}

export type FunctionalCalendarPresetKey =
  | 'today'
  | 'yesterday'
  | 'last7Days'
  | 'last30Days'
  | 'thisMonth'
  | 'lastMonth'

export interface FunctionalCalendarCustomPreset {
  label: string
  range: () => { start: Date; end: Date }
}

export type FunctionalCalendarPreset =
  | FunctionalCalendarPresetKey
  | FunctionalCalendarCustomPreset

export interface FunctionalCalendarLabels {
  previousMonth: string
  nextMonth: string
  previousYear: string
  nextYear: string
  previousYears: string
  nextYears: string
  calendar: string
  close: string
  clearRange: string
  clearRanges: string
  startDate: string
  endDate: string
  date: string
  addDate: string
  removeDate: string
  hour: string
  minute: string
  quickRanges: string
  range: string
  rangeStart: string
  rangeEnd: string
  today: string
  week: string
  chooseMonth: string
  chooseYear: string
  presets: Record<FunctionalCalendarPresetKey, string>
}

export interface FunctionalCalendarProps {
  modelValue?: Partial<FunctionalCalendarValue>
  configs?: Record<string, unknown>
  activeHours?: number[]
  activeMinutes?: number[]
  borderColor?: string
  displayTimeInput?: boolean
  sundayStart?: boolean
  locale?: string
  labels?: Partial<
    Omit<FunctionalCalendarLabels, 'presets'> & {
      presets: Partial<FunctionalCalendarLabels['presets']>
    }
  >
  presets?: boolean | FunctionalCalendarPreset[]
  placeholder?: string | boolean
  dateFormat?: string
  canClearRange?: boolean
  isMultiple?: boolean
  isSeparately?: boolean
  isDatePicker?: boolean
  isMultipleDatePicker?: boolean
  isMultipleDateRange?: boolean
  isDateRange?: boolean
  withTimePicker?: boolean
  calendarsCount?: number
  isModal?: boolean
  isTypeable?: boolean
  changeMonthFunction?: boolean
  changeYearFunction?: boolean
  changeYearStep?: number
  changeMonthStep?: number
  newCurrentDate?: Date
  markedDates?: Array<string | { date: string; class: string }>
  markedDateRange?:
    | { start: string | false; end: string | false }
    | FunctionalCalendarDateRange[]
  disabledDayNames?: string[]
  disabledDates?: string[]
  enabledDates?: string[]
  limits?: { min: string; max: string } | boolean
  minSelDays?: number | boolean
  maxSelDays?: number | boolean
  dayNames?: string[]
  monthNames?: string[]
  shortMonthNames?: string[]
  showWeekNumbers?: boolean
  transition?: boolean
  hiddenElements?: string[]
  isAutoCloseable?: boolean
  isDark?: boolean
  isLayoutExpandable?: boolean
  titlePosition?: 'left' | 'center' | 'right'
  arrowsPosition?: 'space-between' | 'left' | 'right'
  alwaysUseDefaultClasses?: boolean
}

export type FunctionalCalendarMethods = {
  PreMonth(calendarKey?: number | null): void
  NextMonth(calendarKey?: number | null): void
  PreYear(calendarKey?: number | null): void
  NextYear(calendarKey?: number | null): void
  ChooseDate(date: string): void
}

export type FunctionalCalendarOptions = Partial<
  Omit<FunctionalCalendarProps, 'modelValue' | 'configs'>
>

export interface FunctionalCalendarDay {
  day: number
  date: string
  hide: boolean
  isMouseToLeft: boolean
  isMouseToRight: boolean
  isHovered: boolean
  isDateRangeStart: boolean
  isDateRangeEnd: boolean
  hideLeftAndRightDays: boolean
  isToday: boolean
  isMarked: boolean
}

export interface FunctionalCalendarWeek {
  year: number
  start: number
  end: number
  number: number
  days: FunctionalCalendarDay[]
}

export type FunctionalCalendarEmits = {
  'update:modelValue': (value: FunctionalCalendarValue) => void
  opened: () => void
  closed: () => void
  dayClicked: (day: FunctionalCalendarDay) => void
  choseDay: (day: FunctionalCalendarDay) => void
  selectedDaysCount: (count: number) => void
  dayMouseOver: (date: string) => void
  changedMonth: (date: Date) => void
  changedYear: (date: Date) => void
}

export type FunctionalCalendarSlots = SlotsType<{
  default: (props: {
    week: FunctionalCalendarWeek
    day: FunctionalCalendarDay
  }) => any
  navigationArrowLeft: () => any
  navigationArrowRight: () => any
  cleaner: () => any
  footer: () => any
  dateRangeInputs: (props: {
    startDate: string
    endDate: string
    isTypeable: boolean
  }) => any
  datePickerInput: (props: { selectedDate: string; isTypeable: boolean }) => any
}>

export type FunctionalCalendarComponent = DefineComponent<
  FunctionalCalendarProps,
  {},
  {},
  {},
  FunctionalCalendarMethods,
  {},
  {},
  FunctionalCalendarEmits,
  string,
  PublicProps,
  Readonly<FunctionalCalendarProps> & EmitsToProps<FunctionalCalendarEmits>,
  {},
  FunctionalCalendarSlots
>

export type FunctionalCalendarPlugin = FunctionalCalendarComponent & {
  install(app: App, options?: FunctionalCalendarOptions): void
  FunctionalCalendar: FunctionalCalendarPlugin
}

export const FunctionalCalendar: FunctionalCalendarPlugin

declare const plugin: FunctionalCalendarPlugin

export default plugin
