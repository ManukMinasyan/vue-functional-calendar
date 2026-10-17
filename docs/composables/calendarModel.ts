export function calendarModel(currentDate: Date = new Date(), overrides: Record<string, unknown> = {}) {
    return {
        currentDate,
        selectedDate: false,
        selectedDateTime: false,
        selectedHour: '00',
        selectedMinute: '00',
        selectedDatesItem: '',
        selectedDates: [],
        dateRange: { start: '', end: '' },
        multipleDateRange: [],
        ...overrides,
    }
}
