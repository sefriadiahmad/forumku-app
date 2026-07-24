// Redux Store Configuration
// Configured with Redux Toolkit and DevTools extension
import { configureStore } from '@reduxjs/toolkit'

// Import reducers
import authReducer from '../features/auth/authSlice'
import threadsReducer from '../features/threads/threadsSlice'
import commentsReducer from '../features/comments/commentsSlice'
import leaderboardReducer from '../features/leaderboard/leaderboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    comments: commentsReducer,
    leaderboard: leaderboardReducer,
  },
  devTools: import.meta.env.DEV,
})

export default store
