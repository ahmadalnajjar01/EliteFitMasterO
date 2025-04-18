// api/products.js
export const searchProducts = async (query, getState) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Get the current Redux state through getState parameter
  const state = getState();

  // Combine products from all slices
  const allProducts = [
    ...(state.allProducts?.items || []),
    ...(state.men?.items || []),
    ...(state.women?.items || []),
    ...(state.kids?.items || []),
    ...(state.trending?.items || []),
  ];
console.log("All Products:", allProducts);

  // Filter products based on search query
  return allProducts.filter(
    (product) =>
      product.name?.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.toLowerCase().includes(query.toLowerCase())
  );
};
