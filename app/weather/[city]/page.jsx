"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchWeatherHistory } from "@/redux/features/weatherSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CityDetails({ params }) {
  const { city } = params
  const dispatch = useDispatch()
  const { weatherHistory, loading, error } = useSelector((state) => state.weather)

  useEffect(() => {
    dispatch(fetchWeatherHistory(decodeURIComponent(city)))
  }, [dispatch, city])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </div>
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[300px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
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
              <h2 className="text-xl font-bold mb-2">Unable to load weather data</h2>
              <p className="text-gray-400 mb-4">
                We're having trouble fetching the latest information for {decodeURIComponent(city)}.
              </p>
              <p className="text-gray-400">Please try again later or check another location.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formattedData = weatherHistory.map((item) => ({
    date: new Date(item.dt * 1000).toLocaleDateString(),
    temp: item.temp,
    humidity: item.humidity,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold">{decodeURIComponent(city)} Weather History</h1>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Temperature History (°C)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "0.5rem" }}
                  labelStyle={{ color: "#F9FAFB" }}
                />
                <Line type="monotone" dataKey="temp" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Humidity History (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "0.5rem" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Line type="monotone" dataKey="humidity" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>Weather Data Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Temp (°C)</th>
                    <th className="text-left py-3 px-4">Humidity (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-3 px-4">{item.date}</td>
                      <td className="py-3 px-4">{item.temp}</td>
                      <td className="py-3 px-4">{item.humidity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

