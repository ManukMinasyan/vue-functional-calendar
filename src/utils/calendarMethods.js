import { hElContains, hUniqueID } from './helpers'

export default {
  initCalendar() {
    this.setCalendarData()
    this.listRendering()
    this.markChooseDays()
    this.checkLimits(this.calendar.currentDate)
  },
  updateCalendar() {
    this.setExistingCalendarData()
    this.listRendering()
    this.markChooseDays()
  },
  setCalendarData() {
    let date = this.calendar.currentDate
    date = new Date(date.getFullYear(), date.getMonth() - 1)

    this.listCalendars = []

    for (let i = 0; i < this.fConfigs.calendarsCount; i++) {
      date = new Date(date.getFullYear(), date.getMonth() + 1)

      let calendar = {
        key: i + hUniqueID(),
        date: date,
        dateTop: `${
          this.fConfigs.monthNames[date.getMonth()]
        } ${date.getFullYear()}`,
        month: this.fConfigs.monthNames[date.getMonth()],
        year: date.getFullYear(),
        weeks: this.helpCalendar.getFinalizedWeeks(
          date.getMonth(),
          date.getFullYear()
        )
      }

      this.listCalendars.push(calendar)

      if (!this.fConfigs.isMultiple) {
        break
      }
    }
  },
  setExistingCalendarData() {
    for (let i = 0; i < this.listCalendars.length; i++) {
      let calendar = this.listCalendars[i]
      let date = calendar.date

      this.$set(this.listCalendars, i, {
        key: calendar.key,
        date: date,
        dateTop: `${
          this.fConfigs.monthNames[date.getMonth()]
        } ${date.getFullYear()}`,
        month: this.fConfigs.monthNames[date.getMonth()],
        year: date.getFullYear(),
        weeks: this.helpCalendar.getFinalizedWeeks(
          date.getMonth(),
          date.getFullYear()
        )
      })

      if (!this.fConfigs.isMultiple) {
        break
      }
    }
  },
  setConfigs() {
    let globalOptions
    if (typeof this.$getOptions !== 'undefined') {
      // Global Options
      globalOptions = this.$getOptions()
      Object.keys(globalOptions).forEach(objectKey => {
        if (typeof this.fConfigs[objectKey] !== 'undefined') {
          this.$set(this.fConfigs, objectKey, globalOptions[objectKey])
        }
      })
    }

    if (typeof this.configs !== 'undefined') {
      Object.keys(this.fConfigs).forEach(objectKey => {
        if (typeof this.configs[objectKey] !== 'undefined') {
          // Get From Configs
          this.$set(this.fConfigs, objectKey, this.configs[objectKey])
        }
      })
    } else {
      Object.keys(this.$props).forEach(objectKey => {
        if (
          typeof this.fConfigs[objectKey] !== 'undefined' &&
          typeof this.$props[objectKey] !== 'undefined'
        ) {
          this.$set(this.fConfigs, objectKey, this.$props[objectKey])
        }
      })
    }

    // Is Modal
    if (this.fConfigs.isModal) this.showCalendar = false

    // Placeholder
    if (!this.fConfigs.placeholder)
      this.fConfigs.placeholder = this.fConfigs.dateFormat

    if (typeof this.newCurrentDate !== 'undefined') {
      this.calendar.currentDate = this.newCurrentDate
    }

    // Sunday Start
    if (this.fConfigs.sundayStart) {
      let dayNames = [...this.fConfigs.dayNames]
      let sundayName = dayNames[dayNames.length - 1]
      dayNames.splice(dayNames.length - 1, 1)
      dayNames.unshift(sundayName)
      this.fConfigs.dayNames = dayNames
    }
  },
  listRendering() {
    // Each Calendars
    this.listCalendars.forEach(calendar => {
      // Set Calendar Weeks
      calendar.weeks.forEach(week => {
        let finalizedDays = []

        week.days.forEach(day => {
          let date = new Date(day.year, day.month, day.day)
          let now = new Date()

          let isToday = false

          date.setHours(0, 0, 0, 0)
          now.setHours(0, 0, 0, 0)

          if (date.getTime() === now.getTime()) {
            isToday = true
          }

          let checkMarked
          // With Custom Classes
          if (typeof this.fConfigs.markedDates[0] === 'object') {
            checkMarked = this.fConfigs.markedDates.find(markDate => {
              return markDate.date === this.helpCalendar.formatDate(date)
            })
          } else {
            // Without Classes
            checkMarked = this.fConfigs.markedDates.find(markDate => {
              return markDate === this.helpCalendar.formatDate(date)
            })
          }

          if (
            this.calendar.dateRange.start === this.helpCalendar.formatDate(date)
          ) {
            checkMarked = true
          }

          let isMarked = false
          if (typeof checkMarked !== 'undefined') {
            isMarked = true
          }

          finalizedDays.push({
            day: day.day,
            date: this.helpCalendar.formatDate(date),
            hide: day.hide,
            isMouseToLeft: false,
            isMouseToRight: false,
            isHovered: false,
            isDateRangeStart: this.checkDateRangeStart(
              this.helpCalendar.formatDate(date)
            ),
            isDateRangeEnd: this.checkDateRangeEnd(
              this.helpCalendar.formatDate(date)
            ),
            hideLeftAndRightDays: day.hideLeftAndRightDays,
            isToday: isToday,
            isMarked: isMarked
          })
        })

        week.days = finalizedDays
      })
    })
  },
  clickDay(item, isDisabledDate) {
    this.$emit('dayClicked', item)

    if (
      !this.fConfigs.isDateRange &&
      !this.fConfigs.isDatePicker &&
      !this.fConfigs.isMultipleDatePicker
    ) {
      return false
    }

    //Disabled Dates - Start

    // Disable days of week if set in configuration
    let dateDay = this.helpCalendar.getDateFromFormat(item.date).getDay() - 1
    if (dateDay === -1) {
      dateDay = 6
    }

    let dayOfWeekString = this.fConfigs.dayNames[dateDay]
    if (
      this.fConfigs.disabledDayNames.includes(dayOfWeekString) ||
      isDisabledDate(item.date)
    ) {
      return false
    }

    //Disabled Dates - End

    // Limits
    if (this.fConfigs.limits) {
      let min = this.helpCalendar
        .getDateFromFormat(this.fConfigs.limits.min)
        .getTime()
      let max = this.helpCalendar
        .getDateFromFormat(this.fConfigs.limits.max)
        .getTime()
      let date = this.helpCalendar.getDateFromFormat(item.date).getTime()

      if (date < min || date > max) {
        return false
      }
    }

    // Date Range
    if (this.fConfigs.isDateRange) {
      let clickDate = this.helpCalendar.getDateFromFormat(item.date).getTime()

      let startDate = ''
      if (this.calendar.dateRange.start) {
        startDate = this.helpCalendar.getDateFromFormat(
          this.calendar.dateRange.start
        )
      }

      // Two dates is not empty
      if (
        this.calendar.dateRange.start !== '' &&
        this.calendar.dateRange.end !== ''
      ) {
        this.calendar.dateRange.start = item.date
        this.calendar.dateRange.end = ''
        // Not date selected
      } else if (
        this.calendar.dateRange.start === '' &&
        this.calendar.dateRange.end === ''
      ) {
        this.calendar.dateRange.start = item.date
        // Start Date not empty, chose date > start date
      } else if (
        this.calendar.dateRange.end === '' &&
        clickDate > startDate.getTime()
      ) {
        this.calendar.dateRange.end = item.date
        // Start date not empty, chose date <= start date (also same date range select)
      } else if (
        this.calendar.dateRange.start !== '' &&
        clickDate <= startDate.getTime()
      ) {
        this.calendar.dateRange.end = this.calendar.dateRange.start
        this.calendar.dateRange.start = item.date
      }

      //Get number of days between date range dates
      if (
        this.calendar.dateRange.start !== '' &&
        this.calendar.dateRange.end !== ''
      ) {
        let oneDay = 24 * 60 * 60 * 1000
        let firstDate = this.helpCalendar.getDateFromFormat(
          this.calendar.dateRange.start
        )
        let secondDate = this.helpCalendar.getDateFromFormat(
          this.calendar.dateRange.end
        )
        let diffDays = Math.round(
          Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
        )
        let itemTime = this.helpCalendar.getDateFromFormat(item.date).getTime()

        this.$emit('selectedDaysCount', diffDays)

        // Is Auto Closeable
        if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
          this.showCalendar = false
        }

        // Minimum Selected Days
        let minSelDays = this.fConfigs.minSelDays

        if (
          minSelDays &&
          itemTime >= startDate.getTime() &&
          diffDays < minSelDays
        ) {
          startDate.setDate(startDate.getDate() + (minSelDays - 1))
          this.calendar.dateRange.end = this.helpCalendar
            .formatDate(startDate)
            .toString()
        }

        if (
          minSelDays &&
          itemTime < startDate.getTime() &&
          diffDays < minSelDays
        ) {
          startDate.setDate(startDate.getDate() - (minSelDays - 1))
          this.calendar.dateRange.start = this.helpCalendar
            .formatDate(startDate)
            .toString()
        }

        // Maximum Selected Days
        let maxSelDays = this.fConfigs.maxSelDays

        if (
          maxSelDays &&
          itemTime >= startDate.getTime() &&
          diffDays >= maxSelDays
        ) {
          startDate.setDate(startDate.getDate() + (maxSelDays - 1))
          this.calendar.dateRange.end = this.helpCalendar.formatDate(startDate)
        }

        if (
          maxSelDays &&
          itemTime < startDate.getTime() &&
          diffDays >= maxSelDays
        ) {
          startDate.setDate(startDate.getDate() - (maxSelDays - 1))
          this.calendar.dateRange.start = this.helpCalendar.formatDate(
            startDate
          )
        }
      }

      this.$emit('input', this.calendar)
    } else if (this.fConfigs.isDatePicker) {
      this.calendar.selectedDate = item.date
      this.$emit('input', this.calendar)

      // Is Auto Closeable
      if (this.fConfigs.isModal && this.fConfigs.isAutoCloseable) {
        this.showCalendar = false
      }
    } else if (this.fConfigs.isMultipleDatePicker) {
      if (
        this.calendar.hasOwnProperty('selectedDates') &&
        this.calendar.selectedDates.find(date => date.date === item.date)
      ) {
        let dateIndex = this.calendar.selectedDates.findIndex(
          date => date.date === item.date
        )
        this.calendar.selectedDates.splice(dateIndex, 1)
      } else {
        let date = Object.assign({}, this.defaultDateFormat)
        date.date = item.date

        if (!this.calendar.hasOwnProperty('selectedDates')) {
          this.calendar.selectedDates = []
        }

        this.calendar.selectedDates.push(date)
      }

      this.$emit('input', this.calendar)
    }

    this.markChooseDays()

    // Time Picker
    if (this.fConfigs.withTimePicker) {
      if (this.fConfigs.isDateRange || this.fConfigs.isDatePicker) {
        this.openTimePicker()
      }

      if (
        this.calendar.selectedDates.find(date => date.date === item.date) &&
        this.fConfigs.isMultipleDatePicker
      ) {
        this.openTimePicker()
      }
    }

    this.$emit('choseDay', item)
  },
  markChooseDays() {
    let startDate = this.calendar.dateRange.start
    let endDate = this.calendar.dateRange.end

    this.listCalendars.forEach(calendar => {
      calendar.weeks.forEach(week => {
        week.days.forEach(day => {
          day.isMarked = false

          // Date Picker
          if (this.fConfigs.isDatePicker) {
            if (this.calendar.selectedDate === day.date) day.isMarked = true
          } else if (this.fConfigs.isMultipleDatePicker) {
            if (
              this.calendar.hasOwnProperty('selectedDates') &&
              this.calendar.selectedDates.find(date => date.date === day.date)
            )
              day.isMarked = true
          } else {
            day.isMouseToLeft = false
            day.isMouseToRight = false

            // Date Range
            if (startDate === day.date) {
              day.isMouseToLeft = !!endDate
              day.isMarked = true
            }

            if (endDate === day.date) {
              day.isMouseToRight = !!endDate
              day.isMarked = true
            }

            if (startDate && startDate === endDate) {
              day.isMouseToLeft = false
              day.isMouseToRight = false
            }
            console.log(this.calendar.dateRange.start)
            if (startDate && endDate) {
              if (
                this.helpCalendar.getDateFromFormat(day.date).getTime() >
                  this.helpCalendar.getDateFromFormat(startDate) &&
                this.helpCalendar.getDateFromFormat(day.date) <
                  this.helpCalendar.getDateFromFormat(endDate)
              ) {
                day.isMarked = true
              }
            }
          }

          if (this.fConfigs.markedDates.includes(day.date)) day.isMarked = true
        })
      })
    })
  },
  dayMouseOver(date) {
    if (!this.fConfigs.isDateRange) {
      return false
    }

    // Limits
    if (this.fConfigs.limits) {
      let limitMin = this.helpCalendar
        .getDateFromFormat(this.fConfigs.limits.min)
        .getTime()
      let limitMax = this.helpCalendar
        .getDateFromFormat(this.fConfigs.limits.max)
        .getTime()
      let limitDate = this.helpCalendar.getDateFromFormat(date).getTime()

      if (limitDate < limitMin || limitDate > limitMax) {
        return false
      }
    }

    if (
      (this.calendar.dateRange.start === '' ||
        this.calendar.dateRange.end === '') &&
      (this.calendar.dateRange.start !== '' ||
        this.calendar.dateRange.end !== '')
    ) {
      for (let e = 0; e < this.listCalendars.length; e++) {
        let calendar = this.listCalendars[e]

        for (let f = 0; f < calendar.weeks.length; f++) {
          let week = calendar.weeks[f]

          for (let i = 0; i < week.days.length; i++) {
            let item = week.days[i]

            this.listCalendars[e].weeks[f].days[i].isHovered = false

            if (
              item.date !== this.calendar.dateRange.start &&
              !this.fConfigs.markedDates.includes(item.date)
            ) {
              this.listCalendars[e].weeks[f].days[i].isMarked = false
            }

            if (this.calendar.dateRange.start) {
              let itemDate = this.helpCalendar
                .getDateFromFormat(item.date)
                .getTime()

              let thisDate = this.helpCalendar.getDateFromFormat(date).getTime()
              let startDate = this.helpCalendar.getDateFromFormat(
                this.calendar.dateRange.start
              )

              this.listCalendars[e].weeks[f].days[i].isMouseToLeft =
                (itemDate === startDate.getTime() &&
                  thisDate > startDate.getTime()) ||
                (itemDate === thisDate && thisDate < startDate.getTime())
              this.listCalendars[e].weeks[f].days[i].isMouseToRight =
                (itemDate === startDate.getTime() &&
                  thisDate < startDate.getTime()) ||
                (itemDate === thisDate && thisDate > startDate.getTime())

              let dateDay =
                this.helpCalendar.getDateFromFormat(item.date).getDay() - 1
              if (dateDay === -1) {
                dateDay = 6
              }

              let dayOfWeekString = this.fConfigs.dayNames[dateDay]
              if (
                !this.fConfigs.disabledDayNames.includes(dayOfWeekString) &&
                ((itemDate > startDate.getTime() && itemDate < thisDate) ||
                  (itemDate < startDate.getTime() && itemDate > thisDate))
              ) {
                this.listCalendars[e].weeks[f].days[i].isMarked = true
              }

              if (!this.calendar.dateRange.end && itemDate === thisDate) {
                this.listCalendars[e].weeks[f].days[i].isHovered = true
              }

              if (
                this.checkSelDates(
                  'min',
                  this.calendar.dateRange.start,
                  item.date,
                  date
                )
              ) {
                this.listCalendars[e].weeks[f].days[i].isMarked = true

                let minDateToRight, minDateToLeft
                minDateToLeft = new Date(startDate.getTime())
                minDateToRight = new Date(startDate.getTime())
                minDateToLeft.setDate(
                  minDateToLeft.getDate() - this.fConfigs.minSelDays + 1
                )
                minDateToRight.setDate(
                  minDateToRight.getDate() + this.fConfigs.minSelDays - 1
                )

                if (
                  thisDate >= minDateToLeft.getTime() &&
                  this.helpCalendar.formatDate(minDateToLeft) === item.date
                ) {
                  this.listCalendars[e].weeks[f].days[i].isMarked = false
                  this.listCalendars[e].weeks[f].days[i].isMouseToLeft = true
                  this.listCalendars[e].weeks[f].days[i].isHovered = true
                } else if (
                  thisDate <= minDateToRight.getTime() &&
                  this.helpCalendar.formatDate(minDateToRight) === item.date
                ) {
                  this.listCalendars[e].weeks[f].days[i].isMarked = false
                  this.listCalendars[e].weeks[f].days[i].isMouseToRight = true
                  this.listCalendars[e].weeks[f].days[i].isHovered = true
                }
              }

              if (
                this.checkSelDates(
                  'max',
                  this.calendar.dateRange.start,
                  item.date,
                  date
                )
              ) {
                this.listCalendars[e].weeks[f].days[i].isMarked = false
                this.listCalendars[e].weeks[f].days[i].isHovered = false
                this.listCalendars[e].weeks[f].days[i].isMouseToLeft = false
                this.listCalendars[e].weeks[f].days[i].isMouseToRight = false

                let maxDateToLeft, maxDateToRight
                maxDateToLeft = new Date(startDate.getTime())
                maxDateToRight = new Date(startDate.getTime())
                maxDateToLeft.setDate(
                  maxDateToLeft.getDate() - this.fConfigs.maxSelDays + 1
                )
                maxDateToRight.setDate(
                  maxDateToRight.getDate() + this.fConfigs.maxSelDays - 1
                )

                if (thisDate <= maxDateToLeft.getTime()) {
                  if (
                    this.helpCalendar.formatDate(maxDateToLeft) === item.date
                  ) {
                    this.listCalendars[e].weeks[f].days[i].isHovered = true
                    this.listCalendars[e].weeks[f].days[i].isMouseToLeft = true
                  }
                }

                if (thisDate >= maxDateToRight.getTime()) {
                  if (
                    this.helpCalendar.formatDate(maxDateToRight) === item.date
                  ) {
                    this.listCalendars[e].weeks[f].days[i].isHovered = true
                    this.listCalendars[e].weeks[f].days[i].isMouseToRight = true
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  /**
   * @return {boolean}
   */
  PreMonth(calendarKey = null) {
    if (!this.allowPreDate) return false

    this.transitionPrefix = 'right'

    calendarKey = calendarKey !== null ? calendarKey : 0

    let currentCalendar = this.listCalendars[calendarKey]
    currentCalendar.date = new Date(
      currentCalendar.date.getFullYear(),
      currentCalendar.date.getMonth() - 1
    )
    currentCalendar.key -= hUniqueID()
    this.updateCalendar()

    if (!this.fConfigs.isSeparately) {
      this.calendar.currentDate = currentCalendar.date
      this.initCalendar()
    }

    this.$emit('changedMonth', currentCalendar.date)
  },
  /**
   * @return {boolean}
   */
  NextMonth(calendarKey = null) {
    if (!this.allowNextDate) return false

    this.transitionPrefix = 'left'

    calendarKey = calendarKey !== null ? calendarKey : 0

    let currentCalendar = this.listCalendars[calendarKey]
    currentCalendar.date = new Date(
      currentCalendar.date.getFullYear(),
      currentCalendar.date.getMonth() + 1
    )
    currentCalendar.key += hUniqueID()
    this.updateCalendar()

    if (!this.fConfigs.isSeparately) {
      this.calendar.currentDate = currentCalendar.date
      this.initCalendar()
    }

    this.$emit('changedMonth', currentCalendar.date)
  },
  /**
   * @return {boolean}
   */
  PreYear(calendarKey = null) {
    if (!this.allowPreDate) return false

    let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1

    calendarKey = calendarKey !== null ? calendarKey : 0

    let currentCalendar = this.listCalendars[calendarKey]
    currentCalendar.date = new Date(
      currentCalendar.date.getFullYear() - step,
      currentCalendar.date.getMonth()
    )
    this.updateCalendar()

    if (!this.fConfigs.isSeparately) {
      this.calendar.currentDate = currentCalendar.date
      this.initCalendar()
    }

    this.$emit('changedYear', currentCalendar.date)
  },
  /**
   * @return {boolean}
   */
  NextYear(calendarKey = null) {
    if (!this.allowNextDate) return false

    let step = this.showYearPicker ? this.fConfigs.changeYearStep : 1

    calendarKey = calendarKey !== null ? calendarKey : 0

    let currentCalendar = this.listCalendars[calendarKey]
    currentCalendar.date = new Date(
      currentCalendar.date.getFullYear() + step,
      currentCalendar.date.getMonth()
    )
    this.updateCalendar()

    if (!this.fConfigs.isSeparately) {
      this.calendar.currentDate = currentCalendar.date
      this.initCalendar()
    }

    this.$emit('changedYear', currentCalendar.date)
  },
  ChooseDate(date) {
    let newDate = this.helpCalendar.getDateFromFormat(date)

    if (date === 'today') {
      newDate = new Date()
    }

    this.listCalendars[0].date = this.calendar.currentDate = newDate

    this.updateCalendar()
    this.initCalendar()
  },
  openMonthPicker(key) {
    if (this.fConfigs.changeMonthFunction) {
      this.showMonthPicker = key === this.showMonthPicker ? false : key
      this.showYearPicker = false
    }
  },
  openYearPicker(key) {
    if (this.fConfigs.changeYearFunction) {
      this.showYearPicker = key === this.showYearPicker ? false : key
      this.showMonthPicker = false
    }
  },
  openTimePicker() {
    this.showTimePicker = true
  },
  pickMonth(key, calendarKey) {
    this.showMonthPicker = false

    let currentCalendar = this.listCalendars[calendarKey]
    let date = currentCalendar.date
    currentCalendar.date = new Date(date.getFullYear(), key + 1, 0)
    currentCalendar.key += hUniqueID()
    this.updateCalendar()
  },
  pickYear(year, calendarKey) {
    this.showYearPicker = false

    let currentCalendar = this.listCalendars[calendarKey]
    let date = currentCalendar.date
    currentCalendar.date = new Date(year, date.getMonth() + 1, 0)
    currentCalendar.key += hUniqueID()
    this.updateCalendar()
  },
  getYearList(date) {
    let years = []
    let year = date.getFullYear() - 4
    for (let i = 0; i < 12; i++) {
      let finalYear = year + i

      years.push({
        year: finalYear
      })
    }
    return years
  },
  /**
   * Add date to selectedDates list
   * @param index
   */
  addToSelectedDates() {
    if (this.helpCalendar.checkValidDate(this.calendar.selectedDatesItem)) {
      let date = Object.assign({}, this.defaultDateFormat)
      date.date = this.calendar.selectedDatesItem
      this.calendar.selectedDates.push(date)
      this.calendar.selectedDatesItem = ''
      this.markChooseDays()
    }
  },
  /**
   * Remove date from selectedDates list
   * @param index
   */
  removeFromSelectedDates(index) {
    this.calendar.selectedDates.splice(index, 1)
    this.markChooseDays()
  },

  checkDateRangeEnd(date) {
    if (Array.isArray(this.fConfigs.markedDateRange)) {
      return (
        this.fConfigs.markedDateRange.findIndex(range => {
          return range.end === date
        }) !== -1
      )
    }

    return date === this.fConfigs.markedDateRange.end
  },
  checkSelDates(type, startDate, itemDate, hoverDate) {
    let startTime = this.helpCalendar.getDateFromFormat(startDate).getTime()
    let itemTime = this.helpCalendar.getDateFromFormat(itemDate).getTime()
    let hoverTime = this.helpCalendar.getDateFromFormat(hoverDate).getTime()

    let days =
      type === 'min' ? this.fConfigs.minSelDays : this.fConfigs.maxSelDays - 2
    let minTime = days * 1000 * 60 * 60 * 24
    let rightTime = startTime + minTime
    let leftTime = startTime - minTime

    let result
    if (hoverTime > startTime) {
      if (type === 'min')
        result =
          itemTime < rightTime &&
          itemTime > startTime &&
          this.fConfigs.minSelDays
      else
        result =
          itemTime > rightTime &&
          itemTime > startTime &&
          this.fConfigs.maxSelDays
    } else if (hoverTime < startTime) {
      if (type === 'min')
        result =
          itemTime > leftTime &&
          itemTime < startTime &&
          this.fConfigs.minSelDays
      else
        result =
          itemTime < leftTime &&
          itemTime < startTime &&
          this.fConfigs.maxSelDays
    }

    return result
  },
  checkLimits(value) {
    if (this.fConfigs.limits) {
      let min = new Date(
        this.helpCalendar.getDateFromFormat(this.fConfigs.limits.min)
      )
      min.setDate(1)
      min.setHours(0, 0, 0, 0)
      let max = new Date(
        this.helpCalendar.getDateFromFormat(this.fConfigs.limits.max)
      )
      max.setDate(1)
      max.setHours(0, 0, 0, 0)

      this.allowPreDate = true
      this.allowNextDate = true

      let current = new Date(value)
      current.setDate(1)
      current.setHours(0, 0, 0, 0)

      if (current <= min) {
        this.allowPreDate = false
      }

      if (current >= max) {
        this.allowNextDate = false
      }
    }
  },
  getTransition_() {
    if (!this.fConfigs.transition) return ''

    let name = ''
    if (this.transitionPrefix === 'left') {
      name = 'vfc-calendar-slide-left'
    } else if (this.transitionPrefix === 'right') {
      name = 'vfc-calendar-slide-right'
    }
    return name
  },
  checkHiddenElement(elementName) {
    return !this.fConfigs.hiddenElements.includes(elementName)
  },
  onFocusIn() {
    if (this.fConfigs.isModal) {
      this.showCalendar = true
    }
  },
  onFocusOut(e) {
    if (
      this.fConfigs.isModal &&
      !hElContains(this.popoverElement, e.relatedTarget)
    ) {
      this.showCalendar = false
    }
  },

  hideMonthYearPicker(e) {
    if (this.showMonthPicker || this.showYearPicker) {
      let key = this.showMonthPicker
        ? this.showMonthPicker - 1
        : this.showYearPicker - 1

      let element1 = this.$refs.calendars.querySelector(
        `.vfc-calendars .vfc-calendar:nth-child(${key +
          1}) .vfc-top-date a:nth-child(1)`
      )
      let element2 = this.$refs.calendars.querySelector(
        `.vfc-calendars .vfc-calendar:nth-child(${key +
          1}) .vfc-top-date a:nth-child(2)`
      )

      if (
        !this.$refs.monthContainer[key].$el.contains(e.target) &&
        !element1.contains(e.target) &&
        !element2.contains(e.target)
      ) {
        return (this.showMonthPicker = this.showYearPicker = false)
      }
    }
  },

  checkDateRangeStart(date) {
    if (Array.isArray(this.fConfigs.markedDateRange)) {
      return (
        this.fConfigs.markedDateRange.findIndex(range => {
          return range.start === date
        }) !== -1
      )
    }

    return date === this.fConfigs.markedDateRange.start
  },
  cleanRange() {
    this.calendar.dateRange.end = ''
    this.calendar.dateRange.start = ''
  }
}
