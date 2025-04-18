// Slices/searchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  results: [],
  isSearching: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    setIsSearching: (state, action) => {
      state.isSearching = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.results = [];
      state.isSearching = false;
    },
  },
});

export const { setSearchQuery, setSearchResults, setIsSearching, clearSearch } =
  searchSlice.actions;
export default searchSlice.reducer;
