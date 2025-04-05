import WeatherSection from "@/components/dashboard/weather-section"
import CryptoSection from "@/components/dashboard/crypto-section"
import NewsSection from "@/components/dashboard/news-section"
import FavoritesSection from "@/components/dashboard/favorites-section"
import NotificationListener from "@/components/notification-listener"
import DataRefreshManager from "@/components/data-refresh-manager"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <NotificationListener />
      <DataRefreshManager />

      <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        CryptoWeather Nexus
      </h1>

      {/* Favorites Section */}
      <FavoritesSection />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <WeatherSection />
        <CryptoSection />
        <NewsSection />
      </div>
    </div>
  )
}

