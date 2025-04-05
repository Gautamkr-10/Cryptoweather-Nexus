"use client"

import { useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Star, TrendingUp, TrendingDown, Cloud, CloudRain, Sun, CloudLightning } from "lucide-react"

export default function FavoritesSection() {
  const { favorites: weatherFavorites, weatherData } = useSelector((state) => state.weather)
  const { favorites: cryptoFavorites, cryptoData } = useSelector((state) => state.crypto)

  const hasFavorites = weatherFavorites.length > 0 || cryptoFavorites.length > 0

  const getWeatherIcon = (condition) => {
    if (!condition) return <Cloud className="h-6 w-6 text-gray-400" />

    condition = condition.toLowerCase()

    if (condition.includes("rain") || condition.includes("drizzle")) {
      return <CloudRain className="h-6 w-6 text-blue-400" />
    } else if (condition.includes("clear")) {
      return <Sun className="h-6 w-6 text-yellow-400" />
    } else if (condition.includes("thunder")) {
      return <CloudLightning className="h-6 w-6 text-purple-400" />
    } else {
      return <Cloud className="h-6 w-6 text-gray-400" />
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (!hasFavorites) return null

  return (
    <Card className="bg-gray-800 border-gray-700 mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-400 fill-yellow-400" />
          Favorites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {weatherFavorites.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Weather</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {weatherFavorites.map((city) => {
                    const data = weatherData[city]
                    return (
                      <Link
                        href={`/weather/${encodeURIComponent(city)}`}
                        key={city}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium">{city}</h3>
                          {data && <p className="text-lg font-bold">{Math.round(data.temp)}°C</p>}
                        </div>
                        {data ? getWeatherIcon(data.condition) : <Cloud className="h-6 w-6 text-gray-400" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {cryptoFavorites.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Crypto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cryptoFavorites.map((cryptoId) => {
                    const data = cryptoData[cryptoId]
                    if (!data) return null

                    return (
                      <Link
                        href={`/crypto/${cryptoId}`}
                        key={cryptoId}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          {data.image && (
                            <img src={data.image || "/placeholder.svg"} alt={data.name} className="w-6 h-6 mr-2" />
                          )}
                          <div>
                            <h3 className="font-medium">{data.name}</h3>
                            <p className="text-sm text-gray-400">{data.symbol?.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(data.current_price || 0)}</p>
                          <div
                            className={`flex items-center justify-end text-xs ${
                              data.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {data.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(data.price_change_percentage_24h || 0).toFixed(2)}%
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="weather" className="space-y-4">
            {weatherFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {weatherFavorites.map((city) => {
                  const data = weatherData[city]
                  return (
                    <Link
                      href={`/weather/${encodeURIComponent(city)}`}
                      key={city}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{city}</h3>
                        {data && (
                          <>
                            <p className="text-lg font-bold">{Math.round(data.temp)}°C</p>
                            <p className="text-xs text-gray-400">{data.condition}</p>
                          </>
                        )}
                      </div>
                      {data ? getWeatherIcon(data.condition) : <Cloud className="h-6 w-6 text-gray-400" />}
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-4">No favorite weather locations yet</p>
            )}
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4">
            {cryptoFavorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {cryptoFavorites.map((cryptoId) => {
                  const data = cryptoData[cryptoId]
                  if (!data) return null

                  return (
                    <Link
                      href={`/crypto/${cryptoId}`}
                      key={cryptoId}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        {data.image && (
                          <img src={data.image || "/placeholder.svg"} alt={data.name} className="w-6 h-6 mr-2" />
                        )}
                        <div>
                          <h3 className="font-medium">{data.name}</h3>
                          <p className="text-sm text-gray-400">{data.symbol?.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(data.current_price || 0)}</p>
                        <div
                          className={`flex items-center justify-end text-xs ${
                            data.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {data.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {Math.abs(data.price_change_percentage_24h || 0).toFixed(2)}%
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-4">No favorite cryptocurrencies yet</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

