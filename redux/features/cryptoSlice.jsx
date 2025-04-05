import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/utils"

// Async thunk for fetching crypto data
export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      {
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      },
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Transform the data into a more usable format
    const cryptoData = {}
    data.forEach((crypto) => {
      cryptoData[crypto.id] = {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        current_price: crypto.current_price,
        market_cap: crypto.market_cap,
        total_volume: crypto.total_volume,
        price_change_percentage_24h: crypto.price_change_percentage_24h,
        circulating_supply: crypto.circulating_supply,
        image: crypto.image,
      }
    })

    return {
      cryptos: data.slice(0, 3).map((crypto) => ({ id: crypto.id, name: crypto.name })),
      cryptoData,
    }
  } catch (error) {
    console.error("Error fetching crypto data:", error)

    // Return fallback data if API fails
    const fallbackData = {
      bitcoin: {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        current_price: 50000 + Math.random() * 5000,
        market_cap: 950000000000,
        total_volume: 30000000000,
        price_change_percentage_24h: Math.random() * 10 - 5,
        circulating_supply: 19000000,
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      },
      ethereum: {
        id: "ethereum",
        name: "Ethereum",
        symbol: "eth",
        current_price: 3000 + Math.random() * 300,
        market_cap: 350000000000,
        total_volume: 15000000000,
        price_change_percentage_24h: Math.random() * 10 - 5,
        circulating_supply: 120000000,
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      },
      ripple: {
        id: "ripple",
        name: "XRP",
        symbol: "xrp",
        current_price: 0.5 + Math.random() * 0.1,
        market_cap: 25000000000,
        total_volume: 1000000000,
        price_change_percentage_24h: Math.random() * 10 - 5,
        circulating_supply: 45000000000,
        image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      },
    }

    return {
      cryptos: [
        { id: "bitcoin", name: "Bitcoin" },
        { id: "ethereum", name: "Ethereum" },
        { id: "ripple", name: "XRP" },
      ],
      cryptoData: fallbackData,
    }
  }
})

// Async thunk for fetching crypto details
export const fetchCryptoDetails = createAsyncThunk("crypto/fetchCryptoDetails", async (id, { rejectWithValue }) => {
  try {
    // Fetch detailed information about a specific cryptocurrency
    const detailsResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
      {
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      },
    )

    if (!detailsResponse.ok) {
      throw new Error(`API responded with status: ${detailsResponse.status}`)
    }

    const detailsData = await detailsResponse.json()

    // Fetch historical price data
    const historyResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`,
      {
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(5000),
      },
    )

    if (!historyResponse.ok) {
      throw new Error(`API responded with status: ${historyResponse.status}`)
    }

    const historyData = await historyResponse.json()

    return {
      id: detailsData.id,
      name: detailsData.name,
      symbol: detailsData.symbol,
      description: detailsData.description.en,
      image: detailsData.image.large,
      currentPrice: detailsData.market_data.current_price.usd,
      marketCap: detailsData.market_data.market_cap.usd,
      totalVolume: detailsData.market_data.total_volume.usd,
      priceChangePercentage24h: detailsData.market_data.price_change_percentage_24h,
      circulatingSupply: detailsData.market_data.circulating_supply,
      priceHistory: historyData.prices,
    }
  } catch (error) {
    console.error("Error fetching crypto details:", error)

    // Generate fallback data based on the crypto ID
    const fallbackData = {
      id: id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      symbol: id.substring(0, 3),
      description: "Data temporarily unavailable. Please check back later.",
      image: null,
      currentPrice: id === "bitcoin" ? 50000 : id === "ethereum" ? 3000 : 1,
      marketCap: id === "bitcoin" ? 950000000000 : id === "ethereum" ? 350000000000 : 10000000000,
      totalVolume: id === "bitcoin" ? 30000000000 : id === "ethereum" ? 15000000000 : 500000000,
      priceChangePercentage24h: Math.random() * 10 - 5,
      circulatingSupply: id === "bitcoin" ? 19000000 : id === "ethereum" ? 120000000 : 50000000000,
    }

    // Generate mock price history
    const today = new Date()
    const priceHistory = []

    let basePrice = fallbackData.currentPrice * 0.9

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() - (6 - i))

      // Create a somewhat realistic price pattern
      basePrice = basePrice * (1 + (Math.random() * 0.06 - 0.03))

      priceHistory.push([date.getTime(), basePrice])
    }

    fallbackData.priceHistory = priceHistory

    return fallbackData
  }
})

const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    cryptos: [
      { id: "bitcoin", name: "Bitcoin" },
      { id: "ethereum", name: "Ethereum" },
      { id: "ripple", name: "XRP" },
    ],
    cryptoData: {},
    selectedCrypto: null,
    loading: false,
    error: null,
    favorites: loadFromLocalStorage("cryptoFavorites", []),
    lastUpdated: null,
  },
  reducers: {
    toggleFavoriteCrypto: (state, action) => {
      const cryptoId = action.payload
      if (state.favorites.includes(cryptoId)) {
        state.favorites = state.favorites.filter((id) => id !== cryptoId)
      } else {
        state.favorites.push(cryptoId)
      }
      // Persist to localStorage
      saveToLocalStorage("cryptoFavorites", state.favorites)
    },
    addCrypto: (state, action) => {
      const crypto = action.payload
      if (!state.cryptos.some((c) => c.id === crypto.id)) {
        state.cryptos.push(crypto)
      }
    },
    removeCrypto: (state, action) => {
      const cryptoId = action.payload
      state.cryptos = state.cryptos.filter((c) => c.id !== cryptoId)
      // Also remove from favorites if present
      if (state.favorites.includes(cryptoId)) {
        state.favorites = state.favorites.filter((id) => id !== cryptoId)
        saveToLocalStorage("cryptoFavorites", state.favorites)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        // Only set global loading state on initial load, not on refresh
        if (Object.keys(state.cryptoData).length === 0) {
          state.loading = true
        }
        state.error = null
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false
        state.cryptoData = action.payload.cryptoData
        // Only update cryptos if we got data
        if (action.payload.cryptos.length > 0) {
          state.cryptos = action.payload.cryptos
        }
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.loading = false
        state.selectedCrypto = action.payload
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { toggleFavoriteCrypto, addCrypto, removeCrypto } = cryptoSlice.actions

export default cryptoSlice.reducer

