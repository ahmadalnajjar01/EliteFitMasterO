import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunk to Fetch Kids' Products
export const fetchKidsProducts = createAsyncThunk(
  "kids/fetchKidsProducts",
  async () => {
    const response = await axios.get("http://localhost:5000/api/category/Kids");
    return response.data.products; // Ensure API returns `{ success: true, products: [...] }`
  }
);

const kidsSlice = createSlice({
  name: "kids",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKidsProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKidsProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchKidsProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch kids' products";
      });
  },
});

export default kidsSlice.reducer;
