import { useEffect, useState } from 'react'

/**
 * Returns `value` after it has stayed unchanged for `delayMs` milliseconds.
 * Useful for search-as-you-type without firing on every keystroke.
 */
export function useDebounceValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
