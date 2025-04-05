"use client"

import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { addNotification } from "@/redux/features/notificationSlice"
import { useToast } from "@/components/ui/use-toast"

export default function NotificationListener() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const wsRef = useRef(null)

  // Function to simulate weather alerts
  const simulateWeatherAlert = () => {
    const cities = ["New York", "London", "Tokyo"]
    const alerts = [
      "Heavy rain expected",
      "Temperature dropping rapidly",
      "Strong winds advisory",
      "Heat wave warning",
      "Thunderstorm approaching",
    ]

    const randomCity = cities[Math.floor(Math.random() * cities.length)]
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)]

    const notification = {
      id: Date.now().toString(),
      type: "weather_alert",
      title: `Weather Alert: ${randomCity}`,
      message: randomAlert,
      timestamp: new Date().toISOString(),
      read: false,
    }

    dispatch(addNotification(notification))

    toast({
      title: notification.title,
      description: notification.message,
      variant: "default",
    })
  }

  useEffect(() => {
    // Connect to CoinCap WebSocket for real-time price updates
    wsRef.current = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum")

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established")
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Check if we have bitcoin or ethereum price updates
        if (data.bitcoin || data.ethereum) {
          const crypto = data.bitcoin ? "Bitcoin" : "Ethereum"
          const price = data.bitcoin || data.ethereum

          // Only create notification for significant price changes (simulated)
          if (Math.random() > 0.7) {
            const priceChange = Math.random() > 0.5 ? "increased" : "decreased"

            const notification = {
              id: Date.now().toString(),
              type: "price_alert",
              title: `${crypto} Price Alert`,
              message: `${crypto} price has ${priceChange} to $${Number.parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              timestamp: new Date().toISOString(),
              read: false,
            }

            dispatch(addNotification(notification))

            toast({
              title: notification.title,
              description: notification.message,
              variant: "default",
            })
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed")
    }

    // Simulate weather alerts every 30-60 seconds
    const weatherInterval = setInterval(
      () => {
        if (Math.random() > 0.7) {
          simulateWeatherAlert()
        }
      },
      30000 + Math.random() * 30000,
    )

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      clearInterval(weatherInterval)
    }
  }, [dispatch, toast])

  return null
}

