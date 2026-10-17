const toWeekStart = value => (typeof value === 'number' ? value : value ? 0 : 1)

const FULL_WIDTH_OFFSET = 0xfee0

const toAsciiDigits = value =>
  value.replace(/[\uFF0D-\uFF19]/g, char =>
    String.fromCharCode(char.charCodeAt(0) - FULL_WIDTH_OFFSET)
  )

Date.prototype.getWeekNumber = function (weekStartOrSundayStart) {
  const weekStart = toWeekStart(weekStartOrSundayStart)
  const sinceWeekStart = (this.getDay() - weekStart + 7) % 7
  const thursdayOffset = ((4 - weekStart + 7) % 7) - sinceWeekStart
  const thursday = new Date(
    this.getFullYear(),
    this.getMonth(),
    this.getDate() + thursdayOffset
  )
  const dayOfYear = Math.round(
    (Date.UTC(thursday.getFullYear(), thursday.getMonth(), thursday.getDate()) -
      Date.UTC(thursday.getFullYear(), 0, 1)) /
      86400000
  )
  return Math.floor(dayOfYear / 7) + 1
}

export default class helpCalendar {
  constructor(
    weekStart,
    leftAndRightDays,
    dateFormat,
    dayNames,
    fallbackDayNames = null
  ) {
    this.weekStart = toWeekStart(weekStart)
    this.leftAndRightDays = leftAndRightDays
    this.dateFormat = dateFormat
    this.dayNames = dayNames
    this.fallbackDayNames = fallbackDayNames
  }

  formatDate(date) {
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let formattedDate = this.dateFormat.replace('dd', day.toString())
    formattedDate = formattedDate.replace('mm', month.toString())
    formattedDate = formattedDate.replace('yyyy', year.toString())
    return formattedDate.split(' ')[0]
  }

  getDateFromFormat(date) {
    let format = this.dateFormat.split(' ')[0]
    date = date.split(' ')[0]
    if (format.indexOf('/') !== -1) {
      format = format.split('/')
      date = date.split('/')
    } else if (format.indexOf('-') !== -1) {
      format = format.split('-')
      date = date.split('-')
    } else if (format.indexOf('.') !== -1) {
      format = format.split('.')
      date = date.split('.')
    } else {
      throw new Error('Your date format not valid. Please read documentation.!')
    }

    let year = format.indexOf('yyyy')
    let month = format.indexOf('mm')
    let day = format.indexOf('dd')
    return new Date(date[year], date[month] - 1, date[day])
  }

  checkValidDate(val) {
    return !isNaN(this.getDateFromFormat(val).getTime())
  }

  daysSinceWeekStart(date) {
    return (date.getDay() - this.weekStart + 7) % 7
  }

  getDayName(date) {
    return this.dayNames[this.daysSinceWeekStart(date)]
  }

  isDayNameDisabled(date, disabledDayNames) {
    if (disabledDayNames.includes(this.getDayName(date))) return true
    if (!this.fallbackDayNames) return false
    return disabledDayNames.includes(
      this.fallbackDayNames[(date.getDay() + 6) % 7]
    )
  }

  getWeeksInMonth(month, year) {
    let weeks = [],
      firstDate = new Date(year, month, 1),
      lastDate = new Date(year, month + 1, 0),
      numDays = lastDate.getDate()

    let start = 1

    let end = 7 - this.daysSinceWeekStart(firstDate)

    while (start <= numDays) {
      weeks.push({
        year,
        start,
        end,
        number: new Date(year, month, start).getWeekNumber(this.weekStart),
        days: []
      })
      start = end + 1
      end = end + 7
      if (end > numDays) end = numDays
    }
    return {
      weeks,
      month: lastDate.getMonth(),
      year: lastDate.getFullYear()
    }
  }

  getLeftMonthDays(month, year) {
    let weeks = this.getWeeksInMonth(month, year)
    let firstWeek = weeks.weeks[0]
    let weekDaysCount = firstWeek.end - firstWeek.start + 1

    let days = []
    let finalYear = 0
    let finalMonth = 0

    if (weekDaysCount !== 7) {
      let weeksLeftMonth = this.getWeeksInMonth(month - 1, year)

      let leftMonthLastWeek =
        weeksLeftMonth.weeks[weeksLeftMonth.weeks.length - 1]

      for (let i = leftMonthLastWeek.start; i <= leftMonthLastWeek.end; i++) {
        days.push(i)
      }

      finalMonth = weeksLeftMonth.month
      finalYear = weeksLeftMonth.year
    }

    return { days: days.reverse(), month: finalMonth, year: finalYear }
  }

  getRightMonthDays(month, year) {
    let weeks = this.getWeeksInMonth(month, year)
    let lastWeek = weeks.weeks[weeks.weeks.length - 1]

    let weekDaysCount = lastWeek.end - lastWeek.start + 1

    let days = []
    let finalYear = 0
    let finalMonth = 0

    if (weekDaysCount !== 7) {
      let weeksRightMonth = this.getWeeksInMonth(month + 1, year)
      let rightMonthFirstWeek = weeksRightMonth.weeks[0]

      for (
        let i = rightMonthFirstWeek.start;
        i <= rightMonthFirstWeek.end;
        i++
      ) {
        days.push(i)
      }

      finalMonth = weeksRightMonth.month
      finalYear = weeksRightMonth.year
    }

    return { days, month: finalMonth, year: finalYear }
  }

  getFinalizedWeeks(month, year) {
    let monthWeeks = this.getWeeksInMonth(month, year)
    let leftMonthDays = this.getLeftMonthDays(month, year)
    let rightMonthDays = this.getRightMonthDays(month, year)

    // Push Current Month Week days
    monthWeeks.weeks.forEach(week => {
      for (let i = week.start; i <= week.end; i++) {
        week.days.push({
          day: i,
          month: monthWeeks.month,
          year: monthWeeks.year,
          hide: false,
          hideLeftAndRightDays: false
        })
      }
    })

    // Left month days
    if (leftMonthDays.days.length) {
      leftMonthDays.days.forEach(day => {
        let hideLeftAndRightDays = false

        if (!this.leftAndRightDays) {
          day = ''
          hideLeftAndRightDays = true
        }

        monthWeeks.weeks[0].days.unshift({
          day,
          month: leftMonthDays.month,
          year: leftMonthDays.year,
          hide: true,
          hideLeftAndRightDays: hideLeftAndRightDays
        })
      })
    }

    // Right month days
    if (rightMonthDays.days.length) {
      rightMonthDays.days.forEach(day => {
        let hideLeftAndRightDays = false

        if (!this.leftAndRightDays) {
          day = ''
          hideLeftAndRightDays = true
        }

        monthWeeks.weeks[monthWeeks.weeks.length - 1].days.push({
          day,
          month: rightMonthDays.month,
          year: rightMonthDays.year,
          hide: true,
          hideLeftAndRightDays: hideLeftAndRightDays
        })
      })
    }

    // Remove Week Year
    monthWeeks.weeks.forEach(week => {
      delete week.year
    })

    return monthWeeks.weeks
  }

  getFormatParts() {
    const format = this.dateFormat.split(' ')[0]
    const separator = ['/', '-', '.'].find(char => format.includes(char))
    return { separator, tokens: format.split(separator) }
  }

  mask(value) {
    const { separator, tokens } = this.getFormatParts()
    const maxLengths = tokens.map(token => (token === 'yyyy' ? 4 : 2))
    const parts = ['']

    for (const char of value.split(' ')[0]) {
      const last = parts.length - 1

      if (/\d/.test(char)) {
        if (parts[last].length < maxLengths[last]) {
          parts[last] += char
          continue
        }
        if (parts.length === maxLengths.length) break
        parts.push(char)
        continue
      }

      const canSeparate = parts[last] && parts.length < maxLengths.length
      if (char !== separator || !canSeparate) break
      parts.push('')
    }

    return parts.join(separator)
  }

  parseTypedDate(value) {
    const { separator, tokens } = this.getFormatParts()
    const parts = this.mask(value).split(separator)
    if (parts.length !== tokens.length || parts.some(part => !part)) return ''

    const partOf = token => parts[tokens.indexOf(token)]
    if (partOf('yyyy').length !== 4) return ''

    const year = Number(partOf('yyyy'))
    const month = Number(partOf('mm'))
    const day = Number(partOf('dd'))
    const date = new Date(year, month - 1, day)

    const roundTrips =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day

    return roundTrips ? this.formatDate(date) : ''
  }

  cleanTypedInput(rawValue, caret, inputType, data) {
    if (typeof inputType === 'string' && inputType.startsWith('delete')) {
      return { value: rawValue, caret }
    }

    const { separator, tokens } = this.getFormatParts()
    const value = toAsciiDigits(rawValue)
    const [head, time] = this.splitTime(value)
    const isTyping =
      inputType === 'insertText' && (data == null || data.length === 1)
    const isSeparator = char => /[-./ ]/.test(char)

    if (!isTyping || caret < 1) return this.cleanInsertedText(value, caret)
    if (caret > head.length) return { value, caret }

    const maxLengths = tokens.map(token => (token === 'yyyy' ? 4 : 2))
    const typed = head[caret - 1]
    const drop = () => ({
      value: head.slice(0, caret - 1) + head.slice(caret) + time,
      caret: caret - 1
    })

    if (isSeparator(typed)) {
      const text = head.slice(0, caret - 1) + separator + head.slice(caret)
      const parts = text.split(separator)
      const emptyPart = parts.slice(0, -1).some(part => !part)
      if (parts.length > tokens.length || emptyPart) return drop()

      return { value: text + time, caret }
    }

    if (!/\d/.test(typed)) return drop()

    const parts = head.split(separator)
    let offset = 0
    const index = parts.findIndex(part => {
      offset += part.length + 1
      return caret <= offset - 1
    })
    if (parts[index].length <= maxLengths[index]) return { value, caret }

    const atEnd = caret === head.length && index === parts.length - 1
    if (!atEnd || parts.length === tokens.length) return drop()

    return {
      value: `${head.slice(0, caret - 1)}${separator}${typed}${time}`,
      caret: caret + 1
    }
  }

  splitTime(value) {
    const { tokens } = this.getFormatParts()
    let end = value.indexOf(' ')

    while (end !== -1) {
      const parts = value.slice(0, end).split(/[-./ ]/)
      if (parts.length === tokens.length && parts.every(Boolean)) break
      end = value.indexOf(' ', end + 1)
    }

    return end === -1 ? [value, ''] : [value.slice(0, end), value.slice(end)]
  }

  cleanInsertedText(value, caret) {
    const { separator } = this.getFormatParts()
    const [head, time] = this.splitTime(value)
    const normalized = head.replace(/[-./ ]/g, separator)

    for (const candidate of [normalized, this.reorderIsoDate(head)]) {
      const masked = this.mask(candidate)
      if (this.parseTypedDate(masked)) {
        return { value: masked + time, caret: masked.length }
      }
    }

    const masked = this.mask(normalized)
    const withoutSeparators = text => text.replace(/[-./ ]/g, '')
    if (withoutSeparators(masked) === withoutSeparators(head)) {
      return { value: masked + time, caret: masked.length }
    }

    return { value, caret }
  }

  reorderIsoDate(value) {
    const { separator, tokens } = this.getFormatParts()
    const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/)
    if (!iso) return value

    const [, yyyy, mm, dd] = iso
    return tokens.map(token => ({ yyyy, mm, dd })[token]).join(separator)
  }
}
