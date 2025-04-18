import { configureStore } from "@reduxjs/toolkit";
import trendingReducer from "./Slices/trendingSlice";
import cartReducer from "./Slices/cartSlice";
import favoriteReducer from "./Slices/favoriteSlice"; // ✅ تأكد من صحة المسار
import menReducer from "./Slices/menSlice";
import kidsReducer from "./Slices/kidsSlice";
import womenReducer from "./Slices/womenSlice";
// import saleReducer from "./Slices/saleSlice";
import allProductsReducer from "./Slices/allProductsSlice";
import searchReducer from "./Slices/searchSlice";

const store = configureStore({
  reducer: {
    allProducts: allProductsReducer,
    // sale: saleReducer,
    search: searchReducer,
    women: womenReducer,
    kids: kidsReducer,
    men: menReducer,
    trending: trendingReducer,
    cart: cartReducer,
    favorite: favoriteReducer, // ✅ تحقق أنه مضاف هنا
  },
});

export default store;
