import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
  name: 'products',
  initialState: { products: [], sortBy: 'name' },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setProducts, setSortBy } = productsSlice.actions;
export default productsSlice.reducer;