"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCryptoData, toggleFavoriteCrypto } from "@/redux/features/cryptoSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function CryptoSection() {
  const dispatch = useDispatch()
  const { cryptos, cryptoData, loading, favorites } = useSelector((state) => state.crypto)

  useEffect(() => {
    dispatch(fetchCryptoData())
  }, [dispatch])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatMarketCap = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }
    return formatCurrency(value)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Cryptocurrency</CardTitle>
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
                    <Skeleton className="h-10 w-20" />
                  </div>
                ))
            : cryptos.map((crypto) => {
                const data = cryptoData[crypto.id]
                const isFavorite = favorites.includes(crypto.id)

                if (!data) return null

                return (
                  <Link
                    href={`/crypto/${crypto.id}`}
                    key={crypto.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      {data.image && (
                        <img src={data.image || "/placeholder.svg"} alt={data.name} className="w-8 h-8 mr-3" />
                      )}
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium">{data.name}</h3>
                          <button
                            className="ml-2 focus:outline-none"
                            onClick={(e) => {
                              e.preventDefault()
                              dispatch(toggleFavoriteCrypto(crypto.id))
                            }}
                          >
                            <Star
                              className={`h-4 w-4 ${isFavorite ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                            />
                          </button>
                        </div>
                        <p className="text-sm text-gray-400">{data.symbol?.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(data.current_price || 0)}</p>
                      <div
                        className={`flex items-center justify-end text-sm ${
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
                      <p className="text-xs text-gray-400 mt-1">MCap: {formatMarketCap(data.market_cap || 0)}</p>
                    </div>
                  </Link>
                )
              })}
        </div>
      </CardContent>
    </Card>
  )
}

