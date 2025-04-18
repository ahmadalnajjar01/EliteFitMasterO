import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrendingItems } from "../../Slices/trendingSlice";
import { addToCart } from "../../Slices/cartSlice";
import { addToFavorite, removeFromFavorite } from "../../Slices/favoriteSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Trending = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const { items, loading, error } = useSelector((state) => state.trending);
  const favoriteItems = useSelector((state) => state.favorite.favorite);

  useEffect(() => {
    dispatch(fetchTrendingItems());
  }, [dispatch]);

  // عرض أول 8 منتجات فقط، أو جميع المنتجات إن تم الضغط على "عرض المزيد"
  const displayedItems = showAll ? items : items.slice(0, 8);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  // إنشاء رابط الصورة مع التحقق إذا كانت تحتوي على مسار كامل أم لا
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

  const getDiscountPercentage = (oldPrice, price) => {
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    dispatch(addToCart(item));
       toast.success("Product added to cart", {
         position: "top-right",
         duration: 3000,
         style: {
           background: "#4CAF50",
           color: "white",
         },
       });
  };

  const handleFavoriteToggle = (e, item, isFavorite) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorite(item.id));
      toast.info("Product delete from favorites");
    } else {
      dispatch(addToFavorite(item));
      toast.success("Product added to favorites", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#FF6B6B",
          color: "white",
        },
      });
    }
  };

  return (
    <section className="py-24 bg-[#fff] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F0BB78]/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F0BB78]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-black rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm">
            Collections
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-black leading-tight">
            Trending
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-[#F0BB78] rounded-full shadow-lg"></div>
          <p className="mt-8 text-xl black max-w-2xl mx-auto leading-relaxed">
            Explore the latest trending products from our exclusive collection.{" "}
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0BB78]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-center text-red-500">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedItems.map((item) => {
            const isFavorite = favoriteItems.some((fav) => fav.id === item.id);
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
                <div className="relative overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700"
                    />
                  </div>
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-[#F0BB78] text-[#000000] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      {getDiscountPercentage(item.oldPrice, item.price)}% OFF
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      className="bg-[#181818] text-white p-3 rounded-full shadow-lg mx-2 hover:bg-[#F0BB78]/20 transition transform hover:scale-105 duration-300"
                      title="Quick view"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item.id}`, { state: { item } });
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
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 shadow-sm ${
                        isFavorite
                          ? "bg-[#F0BB78]/20 text-[#F0BB78]"
                          : "bg-[#262626] text-gray-300 hover:bg-[#F0BB78]/20 hover:text-[#F0BB78]"
                      }`}
                      title={
                        isFavorite ? "Remove from wishlist" : "Add to wishlist"
                      }
                      onClick={(e) => handleFavoriteToggle(e, item, isFavorite)}
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

        {items.length > 8 && (
          <div className="text-center mt-10">
            <button
              className="px-8 py-3 bg-[#F0BB78] hover:bg-[#F0BB78]/90 text-[#000000] rounded-md shadow-md hover:shadow-lg transition duration-300 font-medium"
              onClick={toggleShowAll}
            >
              {showAll ? "View Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Trending;
