import type { DefineComponent, Plugin } from 'vue'

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

export interface FunctionalCalendarProps {
  modelValue?: Partial<FunctionalCalendarValue>
  configs?: Record<string, unknown>
  activeHours?: number[]
  activeMinutes?: number[]
  borderColor?: string
  displayTimeInput?: boolean
  sundayStart?: boolean
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

export const FunctionalCalendar: DefineComponent<
  FunctionalCalendarProps,
  {},
  {},
  {},
  FunctionalCalendarMethods
>

declare const plugin: Plugin<[FunctionalCalendarOptions?]> &
  typeof FunctionalCalendar

export default plugin
