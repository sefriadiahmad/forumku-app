// Comments Slice - placeholder
// TODO: Implement comments Redux slice
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  comments: [],
  loading: false,
  error: null,
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
})

export default commentsSlice.reducer
