
# CryptoWeather Nexus

CryptoWeather Nexus is an innovative project that combines cryptocurrency market analysis with real-time weather data to provide unique insights and predictions. This tool is designed for analysts, traders, and enthusiasts who want to explore correlations between market trends and environmental factors.


## Features

- Integration of cryptocurrency market data (e.g., Bitcoin, Ethereum).
- Real-time weather data collection.
- Advanced analytics and visualization tools.
- Customizable dashboards for user-specific insights.
- Support for multiple cryptocurrencies and global weather locations.
- Real-Time Notifications.


## Screenshots

![Homepage](![Screenshot 2025-04-06 100802](https://github.com/user-attachments/assets/17a96db2-e581-4e8c-a836-b704bcd2c427)
)


## Installation

Follow these steps to install CryptoWeather Nexus:

1. Clone the repository:

```bash
git clone https://github.com/your-repo/CryptoWeatherNexus.git
```
2. Navigate to the project directory:

```bash
cd CryptoWeatherNexus
```
3. Install dependencies:

```bash
npm install
```
4. Start the application:

```bash
npm start
```    
## Tech Stack

- Next.js 13+ – App Router with SSR/SSG support
- React (Hooks) – State and effect management
- Redux Toolkit + Thunk – Global state & async middleware
- Tailwind CSS – Utility-first, responsive styling
- CoinCap WebSocket – Real-time crypto updates
- OpenWeatherMap API – Weather data
- CoinGecko API – Cryptocurrency market data
- NewsData.io API – Crypto-related news




## Usage/Examples

1. Launch the application.
2. Configure your settings (e.g., select cryptocurrencies and weather locations).
3. View analytics on the dashboard.
4. Export reports or share insights with your team.

Example command for advanced users:
```bash
node app.js --crypto BTC --location "New York"
```
## Configuration
- CryptoWeather Nexus supports various configuration options:
- Cryptocurrencies: Specify which currencies to track.
- Locations: Define geographic areas for weather data collection.
- API Keys: Input your API keys for external services (e.g., OpenWeatherMap).

Example configuration file (config.json):
```javascript
{
  "cryptocurrencies": ["BTC", "ETH"],
  "locations": ["New York", "San Francisco"],
  "apiKeys": {
    "weather": "your-weather-api-key",
    "crypto": "your-crypto-api-key"
  }
}

```


## Documentation

* **Challenge 1:** CoinCap socket data flooding
    * **Resolution:** Throttled updates + client-side caching
* **Challenge 2:** NewsData rate limits
    * **Resolution:** Added error boundaries & retry logic
* **Challenge 3:** Error fetchiing weather data.
    * **Resolution:** Added fallback mechanism (fetchWeatherData)
    


## Acknowledgements

 - [Next.js Documentation](https://nextjs.org/docs)
 - [Tailwind CSS Docs](https://tailwindcss.com/docs)
 - [CoinCap WebSocket Docs](https://docs.coincap.io/)
 - [OpenWeatherMap API](https://openweathermap.org/api)
 - [CoinGecko API](https://www.coingecko.com/en/api)
 - [NewsData.io](https://newsdata.io/)

