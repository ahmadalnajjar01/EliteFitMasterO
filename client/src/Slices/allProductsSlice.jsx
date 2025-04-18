import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// الدالة المسؤولة عن جلب جميع المنتجات
export const fetchAllProducts = createAsyncThunk(
  "allProducts/fetchAllProducts",
  async () => {
    const response = await axios.get("http://localhost:5000/api/products");
    return response.data; // نتوقع مصفوفة من المنتجات
  }
);

const allProductsSlice = createSlice({
  name: "allProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default allProductsSlice.reducer;
