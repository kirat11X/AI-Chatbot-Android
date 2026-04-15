const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
})

const messageTimeFormatter = new Intl.DateTimeFormat('en', {
  hour: 'numeric',
  minute: '2-digit',
})

export function formatRelativeTime(input: string) {
  const timestamp = new Date(input).getTime()
  const diffInMinutes = Math.round((timestamp - Date.now()) / (1000 * 60))

  if (Math.abs(diffInMinutes) < 60) {
    return relativeTimeFormatter.format(diffInMinutes, 'minute')
  }

  const diffInHours = Math.round(diffInMinutes / 60)
  if (Math.abs(diffInHours) < 24) {
    return relativeTimeFormatter.format(diffInHours, 'hour')
  }

  const diffInDays = Math.round(diffInHours / 24)
  return relativeTimeFormatter.format(diffInDays, 'day')
}

export function formatMessageTime(input: string) {
  return messageTimeFormatter.format(new Date(input))
}
