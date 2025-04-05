import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunk for fetching news data
export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async () => {
  try {
    // In a real app, you would use a proper news API
    // For this demo, we'll simulate news data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock news data
    const mockNews = [
      {
        id: "1",
        title: "Bitcoin Surges Past $60,000 as Institutional Adoption Grows",
        description:
          "Bitcoin has reached a new all-time high as major financial institutions continue to invest in the cryptocurrency.",
        url: "https://example.com/news/1",
        publishedAt: "2023-04-15T08:30:00Z",
        source: "Crypto News",
      },
      {
        id: "2",
        title: "Ethereum 2.0 Upgrade Set to Launch Next Month",
        description:
          "The long-awaited Ethereum 2.0 upgrade is scheduled to go live next month, promising improved scalability and reduced energy consumption.",
        url: "https://example.com/news/2",
        publishedAt: "2023-04-14T14:45:00Z",
        source: "Blockchain Times",
      },
      {
        id: "3",
        title: "Major Bank Announces Cryptocurrency Custody Service",
        description:
          "One of the world's largest banks has announced plans to offer cryptocurrency custody services to institutional clients.",
        url: "https://example.com/news/3",
        publishedAt: "2023-04-13T10:15:00Z",
        source: "Financial Post",
      },
      {
        id: "4",
        title: "New Regulatory Framework for Cryptocurrencies Proposed",
        description:
          "Lawmakers have introduced a new bill that aims to provide clear regulatory guidelines for cryptocurrencies and blockchain technology.",
        url: "https://example.com/news/4",
        publishedAt: "2023-04-12T16:20:00Z",
        source: "Regulatory Watch",
      },
      {
        id: "5",
        title: "NFT Market Continues to Expand with Record-Breaking Sales",
        description:
          "The market for non-fungible tokens (NFTs) is experiencing unprecedented growth, with several digital artworks selling for millions of dollars.",
        url: "https://example.com/news/5",
        publishedAt: "2023-04-11T09:50:00Z",
        source: "Digital Art Daily",
      },
      {
        id: "6",
        title: "Severe Weather Patterns Linked to Climate Change, Study Finds",
        description:
          "A new study has found strong evidence linking recent extreme weather events to ongoing climate change.",
        url: "https://example.com/news/6",
        publishedAt: "2023-04-10T11:25:00Z",
        source: "Weather Network",
      },
    ]

    return mockNews
  } catch (error) {
    console.error("Error fetching news data:", error)
    throw error
  }
})

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false
        state.news = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default newsSlice.reducer

