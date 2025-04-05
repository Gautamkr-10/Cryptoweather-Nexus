"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { refreshAllWeatherData } from "@/redux/features/weatherSlice"
import { fetchNewsData } from "@/redux/features/newsSlice"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function DataRefreshManager() {
  const dispatch = useDispatch()
  const weatherLastUpdated = useSelector((state) => state.weather.lastUpdated)
  const cryptoLastUpdated = useSelector((state) => state.crypto.lastUpdated)
  const weatherError = useSelector((state) => state.weather.error)
  const cryptoError = useSelector((state) => state.crypto.error)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const weatherIntervalRef = useRef(null)
  const cryptoIntervalRef = useRef(null)
  const newsIntervalRef = useRef(null)

  // Format time since last update
  const getTimeSinceUpdate = (lastUpdated) => {
    if (!lastUpdated) return "Never"

    const lastUpdateTime = new Date(lastUpdated)
    const now = new Date()
    const diffSeconds = Math.floor((now - lastUpdateTime) / 1000)

    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  // Manual refresh handler
  const handleManualRefresh = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await Promise.all([
        dispatch(refreshAllWeatherData()).unwrap(),
        dispatch(fetchCryptoData()).unwrap(),
        dispatch(fetchNewsData()).unwrap(),
      ])
    } catch (error) {
      console.error("Error during manual refresh:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Initial data fetch
    dispatch(refreshAllWeatherData())
    dispatch(fetchCryptoData())
    dispatch(fetchNewsData())

    // Set up periodic refresh (every 60 seconds)
    weatherIntervalRef.current = setInterval(() => {
      dispatch(refreshAllWeatherData())
    }, 60000)

    cryptoIntervalRef.current = setInterval(() => {
      dispatch(fetchCryptoData())
    }, 60000)

    newsIntervalRef.current = setInterval(() => {
      dispatch(fetchNewsData())
    }, 120000) // News can refresh less frequently

    // Cleanup on unmount
    return () => {
      if (weatherIntervalRef.current) clearInterval(weatherIntervalRef.current)
      if (cryptoIntervalRef.current) clearInterval(cryptoIntervalRef.current)
      if (newsIntervalRef.current) clearInterval(newsIntervalRef.current)
    }
  }, [dispatch])

  return (
    <div className="fixed bottom-4 right-4 z-50 text-xs bg-gray-800 p-2 rounded-md border border-gray-700 opacity-70 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">Data Status</span>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
          title="Refresh data"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>
      <div className="flex items-center">
        <span className="mr-2">Weather:</span>
        <span className={weatherError ? "text-red-400" : "text-gray-400"}>
          {weatherError ? (
            <span className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" /> Error
            </span>
          ) : (
            getTimeSinceUpdate(weatherLastUpdated)
          )}
        </span>
      </div>
      <div className="flex items-center">
        <span className="mr-2">Crypto:</span>
        <span className={cryptoError ? "text-red-400" : "text-gray-400"}>
          {cryptoError ? (
            <span className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" /> Error
            </span>
          ) : (
            getTimeSinceUpdate(cryptoLastUpdated)
          )}
        </span>
      </div>
    </div>
  )
}

