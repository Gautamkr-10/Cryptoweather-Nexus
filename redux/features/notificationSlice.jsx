import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)

      // Keep only the last 20 notifications
      if (state.notifications.length > 20) {
        state.notifications = state.notifications.slice(0, 20)
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { addNotification, markAsRead, markAllAsRead, clearNotifications } = notificationSlice.actions

export default notificationSlice.reducer

