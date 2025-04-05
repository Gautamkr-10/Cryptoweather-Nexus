import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/redux/provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CryptoWeather Nexus",
  description: "Dashboard combining weather data, cryptocurrency information, and real-time notifications",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'