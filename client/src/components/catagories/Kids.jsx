import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKidsProducts } from "../../Slices/kidsSlice";
import { addToCart } from "../../Slices/cartSlice";
import { addToFavorite, removeFromFavorite } from "../../Slices/favoriteSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Kids = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local states for filtering, sorting, and pagination
  const [isFiltering, setIsFiltering] = useState(false);
  const [priceRange, setPriceRange] = useState(500);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.kids);
  const favoriteItems = useSelector((state) => state.favorite.favorite);

  useEffect(() => {
    dispatch(fetchKidsProducts());
  }, [dispatch]);

  // Filter and sort products
  const filteredProducts = [...products]
    .filter((product) => product.price <= priceRange)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const toggleFilter = () => setIsFiltering(!isFiltering);

  // Calculate discount percentage
  const getDiscountPercentage = (oldPrice, currentPrice) => {
    return Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Helper: Construct image URL with fallback
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

  // Toast event handlers
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleFavoriteToggle = (product, isFav) => {
    if (isFav) {
      dispatch(removeFromFavorite(product.id));
      toast.info(`${product.name} removed from wishlist`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      dispatch(addToFavorite(product));
      toast.success(`${product.name} added to wishlist!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="bg-[#fff] text-black min-h-screen pb-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F0BB78]/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F0BB78]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-24 pb-16">
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-black rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Kids Collection
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-black leading-tight">
            Kids Fashion
          </h1>
          <div className="mt-4 mx-auto h-1 w-24 bg-[#F0BB78] rounded-full shadow-lg"></div>
          <p className="mt-8 text-xl text-black max-w-2xl mx-auto leading-relaxed">
            Discover our fun and stylish collection for kids – perfect for every
            adventure and playground.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFilter}
              className="bg-[#262626] text-white px-4 py-2 rounded shadow-sm border border-[#F0BB78]/20 flex items-center gap-2 hover:bg-[#F0BB78]/20 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-funnel"
                viewBox="0 0 16 16"
              >
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z" />
              </svg>
              <span>Filter</span>
            </button>
            <span className="text-white/80">
              {filteredProducts.length} products
            </span>
          </div>

          <select
            className="bg-[#262626] text-white px-4 py-2 rounded shadow-sm border border-[#F0BB78]/20 outline-none cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default" className="bg-[#181818]">
              Sort By: Featured
            </option>
            <option value="price-low" className="bg-[#181818]">
              Price: Low to High
            </option>
            <option value="price-high" className="bg-[#181818]">
              Price: High to Low
            </option>
            <option value="name" className="bg-[#181818]">
              Name: A-Z
            </option>
          </select>
        </div>

        {/* Filter Panel */}
        {isFiltering && (
          <div className="bg-[#262626] p-6 rounded-lg shadow-md mb-8 border border-[#F0BB78]/20">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Filter Products
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Price Range: ${priceRange}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-[#F0BB78]/20 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>$0</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0BB78]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 112 0v4a1 1 0 11-2 0V7zm2 8a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && currentProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {currentProducts.map((product) => {
              const isFavorite = favoriteItems.some(
                (fav) => fav.id === product.id
              );
              const imageUrl = getImageUrl(product);
              const hasDiscount =
                product.oldPrice && product.oldPrice > product.price;

              return (
                <div
                  key={product.id}
                  className="bg-[#181818] text-white rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(240,187,120,0.2)] transition duration-500 group border border-[#F0BB78]/20 cursor-pointer transform hover:-translate-y-1"
                  onClick={() =>
                    navigate(`/product/${product.id}`, {
                      state: { item: product },
                    })
                  }
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                      />
                    </div>

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-[#F0BB78] text-[#000000] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {getDiscountPercentage(product.oldPrice, product.price)}
                        % OFF
                      </div>
                    )}

                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        className="bg-[#181818] text-white p-3 rounded-full shadow-lg mx-2 hover:bg-[#F0BB78]/20 transition transform hover:scale-105 duration-300"
                        title="Quick view"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`, {
                            state: { item: product },
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
                    <h3
                      className="text-sm sm:text-base font-bold truncate hover:text-[#F0BB78] transition cursor-pointer"
                      onClick={() =>
                        navigate(`/product/${product.id}`, {
                          state: { item: product },
                        })
                      }
                    >
                      {product.name}
                    </h3>
                    <p className="mt-2 text-white/80 text-xs sm:text-sm truncate">
                      {product.description}
                    </p>

                    <div className="flex items-center mt-3">
                      <h6 className="text-base sm:text-lg font-bold text-[#F0BB78]">
                        ${product.price}
                      </h6>
                      {hasDiscount && (
                        <h6 className="ml-2 text-sm text-gray-400 line-through">
                          ${product.oldPrice}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(product, isFavorite);
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
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
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-[#F0BB78] mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-white mb-1">
              No products found
            </h3>
            <p className="text-white/80">Try adjusting your filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-[#F0BB78]/20 text-white hover:bg-[#F0BB78]/20 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1
                      ? "bg-[#F0BB78] text-black"
                      : "border-[#F0BB78]/20 text-white hover:bg-[#F0BB78]/20"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-[#F0BB78]/20 text-white hover:bg-[#F0BB78]/20 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kids;
