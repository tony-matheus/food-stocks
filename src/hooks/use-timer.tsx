import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'timer-state'

// Fast time formatter without dayjs overhead
const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const getSavedTime = (saveToStorage: boolean) => {
  if (!saveToStorage) return 0

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? parseInt(saved, 10) : 0
  } catch {
    return 0
  }
}

/**
 * @param triggerEvery - The time in milliseconds to trigger the timer
 * @returns The time in milliseconds and reset function
 */
export const useTimer = ({
  triggerEvery = 60_000,
  onTrigger = () => {},
  paused = false,
  saveToStorage = false,
}: {
  triggerEvery?: number
  onTrigger?: (time?: number) => void
  paused?: boolean
  saveToStorage?: boolean
} = {}) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [time, setTime] = useState(getSavedTime(saveToStorage))

  const clear = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const reset = () => {
    clear()
    setTime(0)
    if (saveToStorage) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  useEffect(() => {
    if (saveToStorage) {
      localStorage.setItem(STORAGE_KEY, time.toString())
    }
  }, [time, saveToStorage])

  useEffect(() => {
    if (paused) {
      clear()
      return
    } else {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (paused) {
            return prev
          }
          const shouldTrigger = prev * 1000 === triggerEvery
          if (shouldTrigger) {
            onTrigger(prev)
          }
          const newTime = shouldTrigger ? 0 : prev + 1
          document.title = formatTime(triggerEvery / 1000 - newTime)
          return newTime
        })
      }, 1000)

      return clear
    }
  }, [paused, onTrigger, triggerEvery])

  return { time, timeToTrigger: triggerEvery / 1000 - time, reset }
}
