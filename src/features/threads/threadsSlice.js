// Threads Slice - placeholder
// TODO: Implement threads Redux slice
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  threads: [],
  currentThread: null,
  loading: false,
  error: null,
  filter: {
    category: 'all',
    search: '',
  },
}

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {},
})

export default threadsSlice.reducer
