// Leaderboard Slice - placeholder
// TODO: Implement leaderboard Redux slice
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  leaderboard: [],
  loading: false,
  error: null,
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
})

export default leaderboardSlice.reducer
