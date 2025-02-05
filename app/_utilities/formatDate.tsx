export const formatDate = (dateString: string, locale: string) => {
  const date = new Date(dateString || '')

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
