import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch Women Products from API
export const fetchWomenProducts = createAsyncThunk(
  "women/fetchWomenProducts",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/category/Women"
    );
    return response.data.products;
  }
);

const womenSlice = createSlice({
  name: "women",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWomenProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWomenProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWomenProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch women products";
      });
  },
});

export default womenSlice.reducer;
