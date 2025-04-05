import { configureStore } from "@reduxjs/toolkit"
import cryptoReducer, { toggleFavoriteCrypto, addCrypto, removeCrypto } from "@/redux/features/cryptoSlice"

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("Crypto Slice", () => {
  let store

  beforeEach(() => {
    localStorageMock.clear()
    store = configureStore({
      reducer: {
        crypto: cryptoReducer,
      },
    })
  })

  test("should toggle favorite crypto", () => {
    // Initial state should have empty favorites
    expect(store.getState().crypto.favorites).toEqual([])

    // Add bitcoin to favorites
    store.dispatch(toggleFavoriteCrypto("bitcoin"))
    expect(store.getState().crypto.favorites).toEqual(["bitcoin"])
    expect(localStorageMock.setItem).toHaveBeenCalledWith("cryptoFavorites", JSON.stringify(["bitcoin"]))

    // Add ethereum to favorites
    store.dispatch(toggleFavoriteCrypto("ethereum"))
    expect(store.getState().crypto.favorites).toEqual(["bitcoin", "ethereum"])
    expect(localStorageMock.setItem).toHaveBeenCalledWith("cryptoFavorites", JSON.stringify(["bitcoin", "ethereum"]))

    // Remove bitcoin from favorites
    store.dispatch(toggleFavoriteCrypto("bitcoin"))
    expect(store.getState().crypto.favorites).toEqual(["ethereum"])
    expect(localStorageMock.setItem).toHaveBeenCalledWith("cryptoFavorites", JSON.stringify(["ethereum"]))
  })

  test("should add and remove cryptos", () => {
    // Initial state should have default cryptos
    expect(store.getState().crypto.cryptos.length).toEqual(3)

    // Add a new crypto
    store.dispatch(addCrypto({ id: "cardano", name: "Cardano" }))
    expect(store.getState().crypto.cryptos.length).toEqual(4)
    expect(store.getState().crypto.cryptos[3]).toEqual({ id: "cardano", name: "Cardano" })

    // Remove a crypto
    store.dispatch(removeCrypto("cardano"))
    expect(store.getState().crypto.cryptos.length).toEqual(3)
    expect(store.getState().crypto.cryptos.find((c) => c.id === "cardano")).toBeUndefined()

    // Remove a crypto that's also in favorites
    store.dispatch(toggleFavoriteCrypto("bitcoin"))
    expect(store.getState().crypto.favorites).toEqual(["bitcoin"])

    store.dispatch(removeCrypto("bitcoin"))
    expect(store.getState().crypto.cryptos.find((c) => c.id === "bitcoin")).toBeUndefined()
    expect(store.getState().crypto.favorites).toEqual([])
    expect(localStorageMock.setItem).toHaveBeenCalledWith("cryptoFavorites", JSON.stringify([]))
  })
})

