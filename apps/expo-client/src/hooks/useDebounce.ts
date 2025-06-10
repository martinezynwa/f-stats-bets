import { useCallback, useRef, useState } from 'react'

type CallbackFunction<Args extends unknown[], Return> = (...args: Args) => Return

export const useDebounce = <Args extends unknown[], Return>(
  callback: CallbackFunction<Args, Return>,
  delay: number = 300,
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isDebouncing, setIsDebouncing] = useState(false)

  const debouncedCallback = useCallback(
    (...args: Args) => {
      setIsDebouncing(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
        setIsDebouncing(false)
      }, delay)
    },
    [callback, delay],
  )

  return { debouncedCallback, isDebouncing }
}
