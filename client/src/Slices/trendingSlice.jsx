import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🔄 جلب المنتجات من API
export const fetchTrendingItems = createAsyncThunk(
  "trending/fetchTrendingItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Failed to fetch");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const trendingSlice = createSlice({
  name: "trending",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTrendingItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default trendingSlice.reducer;
