import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../Slices/allProductsSlice";
import { addToCart } from "../../Slices/cartSlice";
import { addToFavorite, removeFromFavorite } from "../../Slices/favoriteSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const {
    items: allProducts,
    loading,
    error,
  } = useSelector((state) => state.allProducts);
  const favoriteItems = useSelector((state) => state.favorite.favorite);

  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    occasion: "",
    price: { min: "", max: "" },
    status: "",
    isNewArrival: "",
    onSale: "",
    searchQuery: "",
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // Fetch categories and occasions
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/categories/get-all-categories"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchOccasions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/occasion/get-all"
        );
        const data = await response.json();
        setOccasions(data.data);
      } catch (error) {
        console.error("Error fetching occasions:", error);
      }
    };

    fetchCategories();
    fetchOccasions();
  }, []);

  // Apply filters whenever allProducts or filters change
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
  }, [allProducts, filters]);

  // Filter products based on selected filters
  const applyFilters = () => {
    let filtered = [...allProducts];

    // Filter by category - Use String() to ensure consistent comparison
    if (filters.category) {
      filtered = filtered.filter(
        (product) => String(product.categoryId) === String(filters.category)
      );
    }

    // Filter by occasion - Use String() to ensure consistent comparison
    if (filters.occasion) {
      filtered = filtered.filter(
        (product) => String(product.occasionId) === String(filters.occasion)
      );
    }

    // Filter by price range
    if (filters.price.min) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(filters.price.min)
      );
    }
    if (filters.price.max) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(filters.price.max)
      );
    }

    // Filter by status (active/inactive)
    if (filters.status !== "") {
      const statusBool = filters.status === "active";
      filtered = filtered.filter((product) => product.status === statusBool);
    }

    // Filter by new arrivals
    if (filters.isNewArrival !== "") {
      const isNewBool = filters.isNewArrival === "true";
      filtered = filtered.filter(
        (product) => product.isNewArrival === isNewBool
      );
    }

    // Filter by sale items
    if (filters.onSale !== "") {
      const onSaleBool = filters.onSale === "true";
      filtered = filtered.filter((product) => product.onSale === onSaleBool);
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "min" || name === "max") {
      setFilters({
        ...filters,
        price: {
          ...filters.price,
          [name]: value,
        },
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: "",
      occasion: "",
      price: { min: "", max: "" },
      status: "",
      isNewArrival: "",
      onSale: "",
      searchQuery: "",
    });
  };

  // Pagination logic
  const products = filteredProducts.length > 0 ? filteredProducts : allProducts;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of products when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to get the proper image URL
  const getImageUrl = (product) => {
    if (product.image) {
      if (product.image.startsWith("http")) {
        return product.image;
      } else if (product.image.includes("uploads")) {
        return `http://localhost:5000/${product.image.replace(/\\/g, "/")}`;
      } else {
        return `http://localhost:5000/uploads/${product.image.replace(
          /\\/g,
          "/"
        )}`;
      }
    }
    return "https://via.placeholder.com/300";
  };

  // Helper to calculate discount percentage (if applicable)
  const getDiscountPercentage = (oldPrice, price) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  // Add to cart handler
  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    toast.success("تمت الإضافة إلى السلة!");
  };

  // Favorite toggle handler
  const handleFavoriteToggle = (e, item, isFavorite) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorite(item.id));
      toast.info("تمت الإزالة من المفضلة.");
    } else {
      dispatch(addToFavorite(item));
      toast.success("تمت الإضافة إلى المفضلة!");
    }
  };

  // Toggle filter sidebar on mobile
  const toggleFilterSidebar = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Add debugging logs
  useEffect(() => {
    if (filters.category || filters.occasion) {
      console.log("Selected Category:", filters.category);
      console.log("Selected Occasion:", filters.occasion);
      console.log("Filtered Products:", filteredProducts);

      // Log a sample product to check its structure
      if (allProducts.length > 0) {
        console.log("Sample Product:", allProducts[0]);
      }
    }
  }, [filters.category, filters.occasion, filteredProducts, allProducts]);

  return (
    <section className="py-24 bg-[#fff] relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F0BB78]/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F0BB78]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      {/* Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Page Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-black rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Our Collection
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-black leading-tight">
            All Products
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-[#F0BB78] rounded-full shadow-lg"></div>
          <p className="mt-8 text-xl black max-w-2xl mx-auto leading-relaxed">
            Explore our complete range of curated products.
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={toggleFilterSidebar}
            className="w-full flex items-center justify-center gap-2 bg-[#181818] text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#262626] transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${
              isFilterOpen ? "block" : "hidden"
            } lg:block bg-[#181818] text-white p-6 rounded-lg shadow-lg h-fit sticky top-24`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-[#F0BB78] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Search Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
              >
                <option value="">All Categories</option>
                {/* EXCLUDE "Sale" and "New Arrivals" from the options */}
                {categories
                  .filter(
                    (cat) => cat.name !== "Sale" && cat.name !== "New Arrivals"
                  )
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Occasion Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Occasion</label>
              <select
                name="occasion"
                value={filters.occasion}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
              >
                <option value="">All Occasions</option>
                {occasions.map((occasion) => (
                  <option key={occasion.id} value={occasion.id}>
                    {occasion.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <input
                    type="number"
                    name="min"
                    value={filters.price.min}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
                  />
                </div>
                <div className="w-1/2">
                  <input
                    type="number"
                    name="max"
                    value={filters.price.max}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
              >
                <option value="">All Products</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* New Arrivals Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                New Arrivals
              </label>
              <select
                name="isNewArrival"
                value={filters.isNewArrival}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
              >
                <option value="">All Products</option>
                <option value="true">New Arrivals Only</option>
                <option value="false">Regular Products Only</option>
              </select>
            </div>

            {/* On Sale Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">On Sale</label>
              <select
                name="onSale"
                value={filters.onSale}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-[#262626] border border-[#363636] rounded-md focus:outline-none focus:ring-1 focus:ring-[#F0BB78] text-white"
              >
                <option value="">All Products</option>
                <option value="true">Sale Items Only</option>
                <option value="false">Regular Price Only</option>
              </select>
            </div>

            {/* Results summary */}
            <div className="mt-8 pt-4 border-t border-[#363636]">
              <p className="text-sm text-gray-400">
                Showing {products.length} products
              </p>
            </div>
          </div>

          {/* Products Display */}
          <div className="lg:w-3/4">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0BB78]"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-center text-red-500">{error}</p>
              </div>
            )}

            {/* Filter Results Summary */}
            {!loading && products.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {filters.category && (
                  <span className="inline-flex items-center bg-[#262626] text-white px-3 py-1 rounded-full text-sm">
                    Category:{" "}
                    {categories.find(
                      (c) => String(c.id) === String(filters.category)
                    )?.name || "Selected"}
                    <button
                      onClick={() => setFilters({ ...filters, category: "" })}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.occasion && (
                  <span className="inline-flex items-center bg-[#262626] text-white px-3 py-1 rounded-full text-sm">
                    Occasion:{" "}
                    {occasions.find(
                      (o) => String(o.id) === String(filters.occasion)
                    )?.name || "Selected"}
                    <button
                      onClick={() => setFilters({ ...filters, occasion: "" })}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.price.min || filters.price.max) && (
                  <span className="inline-flex items-center bg-[#262626] text-white px-3 py-1 rounded-full text-sm">
                    Price: {filters.price.min ? `$${filters.price.min}` : "$0"}{" "}
                    - {filters.price.max ? `$${filters.price.max}` : "any"}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, price: { min: "", max: "" } })
                      }
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.isNewArrival && (
                  <span className="inline-flex items-center bg-[#262626] text-white px-3 py-1 rounded-full text-sm">
                    {filters.isNewArrival === "true"
                      ? "New Arrivals"
                      : "Not New Arrivals"}
                    <button
                      onClick={() =>
                        setFilters({ ...filters, isNewArrival: "" })
                      }
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.onSale && (
                  <span className="inline-flex items-center bg-[#262626] text-white px-3 py-1 rounded-full text-sm">
                    {filters.onSale === "true" ? "On Sale" : "Not On Sale"}
                    <button
                      onClick={() => setFilters({ ...filters, onSale: "" })}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((item) => {
                const isFavorite = favoriteItems.some(
                  (fav) => fav.id === item.id
                );
                const imageUrl = getImageUrl(item);
                const hasDiscount = item.oldPrice && item.oldPrice > item.price;

                return (
                  <div
                    key={item.id}
                    className="bg-[#181818] text-white rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(240,187,120,0.2)] transition duration-500 group border border-[#F0BB78]/20 cursor-pointer transform hover:-translate-y-1"
                    onClick={() =>
                      navigate(`/product/${item.id}`, { state: { item } })
                    }
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                        />
                      </div>
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-[#F0BB78] text-[#000000] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {getDiscountPercentage(item.oldPrice, item.price)}%
                          OFF
                        </div>
                      )}
                      {/* Tags */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {item.isNewArrival && (
                          <div className="bg-[#181818] text-[#F0BB78] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            NEW
                          </div>
                        )}
                      </div>
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          className="bg-[#181818] text-white p-3 rounded-full shadow-lg mx-2 hover:bg-[#F0BB78]/20 transition transform hover:scale-105 duration-300"
                          title="Quick view"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${item.id}`, {
                              state: { item },
                            });
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h5
                        className="text-sm sm:text-base font-bold truncate hover:text-[#F0BB78] transition cursor-pointer"
                        onClick={() =>
                          navigate(`/product/${item.id}`, { state: { item } })
                        }
                      >
                        {item.name}
                      </h5>
                      <p className="mt-2 text-white/80 text-xs sm:text-sm truncate">
                        {item.description}
                      </p>
                      <div className="flex items-center mt-3">
                        <h6 className="text-base sm:text-lg font-bold text-[#F0BB78]">
                          ${item.price}
                        </h6>
                        {hasDiscount && (
                          <h6 className="ml-2 text-sm text-gray-400 line-through">
                            ${item.oldPrice}
                          </h6>
                        )}
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm ${
                            isFavorite
                              ? "bg-[#F0BB78]/20 text-[#F0BB78]"
                              : "bg-[#262626] text-gray-300 hover:bg-[#F0BB78]/20 hover:text-[#F0BB78]"
                          }`}
                          title={
                            isFavorite
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                          onClick={(e) =>
                            handleFavoriteToggle(e, item, isFavorite)
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18px"
                            height="18px"
                            fill="currentColor"
                            viewBox="0 0 64 64"
                          >
                            <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4Z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="flex-1 bg-[#F0BB78] hover:bg-[#F0BB78]/90 text-[#000000] text-sm font-medium py-3 px-4 rounded transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                          onClick={(e) => handleAddToCart(e, item)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-bag-plus"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                            />
                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                          </svg>
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Products Found */}
            {!loading && products.length === 0 && (
              <div className="bg-[#262626] border border-[#363636] rounded-lg p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold mt-4">No products found</h3>
                <p className="text-gray-400 mt-2">
                  We couldn't find any products matching your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 bg-[#F0BB78] hover:bg-[#F0BB78]/90 text-[#000000] px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && products.length > productsPerPage && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-1">
                  {/* Previous button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-[#262626] text-gray-500 cursor-not-allowed"
                        : "bg-[#262626] text-white hover:bg-[#363636]"
                    } transition duration-300`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show limited page numbers with ellipsis
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === page
                                ? "bg-[#F0BB78] text-black font-medium"
                                : "bg-[#262626] text-white hover:bg-[#363636]"
                            } transition duration-300`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-3 py-2 text-gray-400 select-none"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}

                  {/* Next button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-[#262626] text-gray-500 cursor-not-allowed"
                        : "bg-[#262626] text-white hover:bg-[#363636]"
                    } transition duration-300`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProducts;