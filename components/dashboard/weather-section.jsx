"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchWeatherData, toggleFavoriteCity } from "@/redux/features/weatherSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Cloud, CloudRain, Sun, CloudLightning } from "lucide-react"
import Link from "next/link"

export default function WeatherSection() {
  const dispatch = useDispatch()
  const { cities, weatherData, loading, favorites } = useSelector((state) => state.weather)

  useEffect(() => {
    // Add a small delay between API calls to avoid rate limiting
    const fetchData = async () => {
      for (const city of cities) {
        try {
          await dispatch(fetchWeatherData(city)).unwrap()
          // Add a small delay between requests
          await new Promise((resolve) => setTimeout(resolve, 300))
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error)
          // Continue with other cities even if one fails
        }
      }
    }

    fetchData()
  }, [dispatch, cities])

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="h-8 w-8 text-gray-400" />

    condition = condition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="h-8 w-8 text-blue-400" />
    } else if (condition.includes("clear")) {
      return <Sun className="h-8 w-8 text-yellow-400" />
    } else if (condition.includes("thunder")) {
      return <CloudLightning className="h-8 w-8 text-purple-400" />
    } else {
      return <Cloud className="h-8 w-8 text-gray-400" />
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading
            ? Array(3)
                .fill()
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                ))
            : cities.map((city) => {
                const data = weatherData[city]
                const isFavorite = favorites.includes(city)

                return (
                  <Link
                    href={`/weather/${encodeURIComponent(city)}`}
                    key={city}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium">{city}</h3>
                        <button
                          className="ml-2 focus:outline-none"
                          onClick={(e) => {
                            e.preventDefault()
                            dispatch(toggleFavoriteCity(city))
                          }}
                        >
                          <Star
                            className={`h-4 w-4 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center mt-1">
                        {data ? (
                          <>
                            <p className="text-2xl font-bold">{Math.round(data.temp)}°C</p>
                            <p className="ml-3 text-gray-400">{data.condition}</p>
                          </>
                        ) : (
                          <p className="text-gray-400">Loading...</p>
                        )}
                      </div>
                      {data && (
                        <div className="mt-2 text-sm text-gray-400">
                          Humidity: {data.humidity}% | Wind: {data.windSpeed} m/s
                        </div>
                      )}
                    </div>
                    <div>{data ? getWeatherIcon(data.condition) : <Cloud className="h-8 w-8 text-gray-400" />}</div>
                  </Link>
                )
              })}
        </div>
      </CardContent>
    </Card>
  )
}

