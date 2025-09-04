import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'timer-state'

const getSavedTime = () => {
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
}: {
  triggerEvery?: number
  onTrigger?: (time?: number) => void
  paused?: boolean
} = {}) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [time, setTime] = useState(getSavedTime())

  const clear = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const reset = () => {
    clear()
    setTime(0)
    localStorage.removeItem(STORAGE_KEY)
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, time.toString())
  }, [time])

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
          console.log('prev', prev)
          console.log('triggerEvery', triggerEvery)
          const shouldTrigger = prev * 1000 === triggerEvery
          if (shouldTrigger) {
            onTrigger(prev)
          }
          return shouldTrigger ? 0 : prev + 1
        })
      }, 1000)

      return clear
    }
  }, [paused])

  return { time, timeToTrigger: triggerEvery / 1000 - time, reset }
}
