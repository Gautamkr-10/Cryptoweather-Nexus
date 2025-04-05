"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCryptoDetails } from "@/redux/features/cryptoSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Globe } from "lucide-react"
import Link from "next/link"

export default function CryptoDetails({ params }) {
  const { id } = params
  const dispatch = useDispatch()
  const { selectedCrypto, loading, error } = useSelector((state) => state.crypto)

  useEffect(() => {
    dispatch(fetchCryptoDetails(id))
  }, [dispatch, id])

  if (loading || !selectedCrypto) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  // Handle error state with fallback UI
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-bold mb-2">Unable to load cryptocurrency data</h2>
              <p className="text-gray-400 mb-4">We're having trouble fetching the latest information for {id}.</p>
              <p className="text-gray-400">Please try again later or check another cryptocurrency.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const priceData =
    selectedCrypto.priceHistory?.map((item) => ({
      date: new Date(item[0]).toLocaleDateString(),
      price: item[1],
    })) || []

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatLargeNumber = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }
    return formatCurrency(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center">
          {selectedCrypto.image && (
            <img
              src={selectedCrypto.image || "/placeholder.svg"}
              alt={selectedCrypto.name}
              className="w-10 h-10 mr-3"
            />
          )}
          {selectedCrypto.name} ({selectedCrypto.symbol?.toUpperCase()})
        </h1>

        <div className="flex items-center text-2xl font-bold">
          {formatCurrency(selectedCrypto.currentPrice || 0)}
          <span
            className={`ml-2 text-sm px-2 py-1 rounded flex items-center ${
              selectedCrypto.priceChangePercentage24h >= 0
                ? "text-green-500 bg-green-500/10"
                : "text-red-500 bg-red-500/10"
            }`}
          >
            {selectedCrypto.priceChangePercentage24h >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(selectedCrypto.priceChangePercentage24h || 0).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Market Cap</p>
                  <p className="text-xl font-semibold">{formatLargeNumber(selectedCrypto.marketCap || 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">24h Volume</p>
                  <p className="text-xl font-semibold">{formatLargeNumber(selectedCrypto.totalVolume || 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Globe className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Circulating Supply</p>
                  <p className="text-xl font-semibold">
                    {new Intl.NumberFormat("en-US").format(selectedCrypto.circulatingSupply || 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis
                  stroke="#9CA3AF"
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [`${formatCurrency(value)}`, "Price"]}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "0.5rem" }}
                  labelStyle={{ color: "#F9FAFB" }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>About {selectedCrypto.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            {selectedCrypto.description ? (
              <div dangerouslySetInnerHTML={{ __html: selectedCrypto.description }} />
            ) : (
              <p>No description available for this cryptocurrency.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

