import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Local storage helpers for favorites
export const saveToLocalStorage = (key, data) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error saving to localStorage: ${error}`)
    }
  }
}

export const loadFromLocalStorage = (key, defaultValue = null) => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error loading from localStorage: ${error}`)
      return defaultValue
    }
  }
  return defaultValue
}

// Data refresh utility
export const withRefreshInterval = (fetchFunction, interval = 60000) => {
  let intervalId = null

  const start = (dispatch) => {
    if (intervalId) clearInterval(intervalId)

    // Initial fetch
    dispatch(fetchFunction())

    // Set up interval
    intervalId = setInterval(() => {
      dispatch(fetchFunction())
    }, interval)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }

  return start
}

