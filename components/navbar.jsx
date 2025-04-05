"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, X } from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { notifications } = useSelector((state) => state.notifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const navLinks = [{ name: "Dashboard", href: "/" }]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                CryptoWeather Nexus
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href
                      ? "text-white bg-gray-800"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="relative">
                <button className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-gray-800 border-gray-700 text-white">
                <div className="p-2 border-b border-gray-700">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 border-b border-gray-700 cursor-default">
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 ${notification.type === "price_alert" ? "bg-green-500" : "bg-blue-500"}`}
                          />
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-400">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No notifications</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="relative mr-2">
                <button className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-gray-800 border-gray-700 text-white">
                <div className="p-2 border-b border-gray-700">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 border-b border-gray-700 cursor-default">
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 ${notification.type === "price_alert" ? "bg-green-500" : "bg-blue-500"}`}
                          />
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-400">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400">No notifications</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href ? "text-white bg-gray-800" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

