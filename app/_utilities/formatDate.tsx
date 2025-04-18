export const formatDate = (dateString: string, locale: string) => {
  if (!dateString) return { formattedDate: '', year: '' }

  const date = new Date(dateString)

  // Format the date
  const dateLocale = date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
  })

  // Reverse the date only if the locale is 'en'
  const formattedDate = locale === 'en' ? dateLocale.split(' ').reverse().join(' ') : dateLocale

  // Get the year
  const year = date.getFullYear()

  return { formattedDate, year }
}

// Helper to format a date range with proper year display
export const formatDateRange = (beginDate: string, endDate: string, locale: string) => {
  const begin = formatDate(beginDate, locale)
  const end = formatDate(endDate, locale)

  const showBeginYear = begin.year && end.year && begin.year !== end.year

  // Format the date range as a complete string
  const display = `${begin.formattedDate} ${showBeginYear ? begin.year : ''} - ${end.formattedDate} ${end.year}`

  return {
    begin,
    end,
    display,
  }
}
