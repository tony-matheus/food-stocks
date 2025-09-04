import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

// Extend dayjs with plugins
dayjs.extend(duration)
dayjs.extend(relativeTime)

/**
 * Format seconds to HH:mm:ss format
 * @param seconds - Number of seconds
 * @returns Formatted time string (e.g., "01:23:45")
 */
export function formatSecondsToTime(seconds: number): string {
  const duration = dayjs.duration(seconds, 'seconds')
  const hours = Math.floor(duration.asHours())
  const minutes = duration.minutes()
  const secs = duration.seconds()

  return dayjs().hour(hours).minute(minutes).second(secs).format('HH:mm:ss')
}

/**
 * Format seconds to human readable format
 * @param seconds - Number of seconds
 * @returns Human readable string (e.g., "1 hour 23 minutes")
 */
export function formatSecondsToHuman(seconds: number): string {
  const duration = dayjs.duration(seconds, 'seconds')
  return duration.humanize()
}

/**
 * Get current timestamp in seconds
 * @returns Current timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  return dayjs(date).fromNow()
}

/**
 * Format date to specific format
 * @param date - Date to format
 * @param format - Dayjs format string
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  return dayjs(date).format(format)
}

/**
 * Check if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date | string | number): boolean {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * Check if a date is this week
 * @param date - Date to check
 * @returns True if date is this week
 */
export function isThisWeek(date: Date | string | number): boolean {
  return dayjs(date).isSame(dayjs(), 'week')
}

/**
 * Get start of day
 * @param date - Date to get start of day for
 * @returns Start of day date
 */
export function startOfDay(date: Date | string | number = new Date()): Date {
  return dayjs(date).startOf('day').toDate()
}

/**
 * Get end of day
 * @param date - Date to get end of day for
 * @returns End of day date
 */
export function endOfDay(date: Date | string | number = new Date()): Date {
  return dayjs(date).endOf('day').toDate()
}
