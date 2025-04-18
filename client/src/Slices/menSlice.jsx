import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async Thunk to Fetch Men's Products
export const fetchMenProducts = createAsyncThunk(
  "men/fetchMenProducts",
  async () => {
    const response = await axios.get("http://localhost:5000/api/category/Men");
    return response.data.products; // Ensure API response includes `{ success: true, products: [...] }`
  }
);

const menSlice = createSlice({
  name: "men",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch men's products";
      });
  },
});

export default menSlice.reducer;
