import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromFavorite } from "../Slices/favoriteSlice";
import { addToCart } from "../Slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Favorite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favoriteItems = useSelector((state) => state.favorite.favorite);

  // Helper function to construct the image URL with fallback
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

  // Handle add to cart with toast notification
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

  // Handle remove from favorites with toast notification
  const handleRemoveFromFavorite = (id, name) => {
    dispatch(removeFromFavorite(id));
    toast.info(`${name} removed from favorites`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "toast-info-container",
      bodyClassName: "toast-info-body",
    });
  };

  // Handle navigation with toast notification
  const handleNavigation = (path, message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Navigate after a short delay to allow the toast to be visible
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <div className="font-sans bg-white min-h-screen p-6">
      {/* Toast Container */}
      <ToastContainer />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black">
            My Favorites{" "}
            <span className="text-[#F0BB78]">({favoriteItems.length})</span>
          </h2>

          {favoriteItems.length > 0 && (
            <button
              onClick={() =>
                handleNavigation("/products", "Continuing to shop...")
              }
              className="bg-[#252525] hover:bg-[#303030] text-white px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              Continue Shopping
            </button>
          )}
        </div>

        {favoriteItems.length === 0 ? (
          <div className="bg-[#181818] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-12 text-center">
            <div className="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="#F0BB78"
                viewBox="0 0 16 16"
              >
                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Your favorites list is empty
              </h3>
              <p className="mt-2 text-[#F0BB78]/70">
                Explore our products and add items to your favorites
              </p>
              <button
                onClick={() =>
                  handleNavigation("/shop", "Taking you to our shop...")
                }
                className="mt-6 bg-[#F0BB78] text-black hover:bg-[#F0BB78]/90 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#181818] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all border border-[#252525] flex flex-col group"
              >
                <div
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => {
                    toast.info(`Viewing ${item.name} details...`, {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                    });
                    navigate(`/product/${item.id}`, { state: { item } });
                  }}
                >
                  <img
                    src={getImageUrl(item)}
                    alt={item.name}
                    className="w-full object-cover object-top aspect-[4/5] group-hover:scale-110 transition-transform duration-1000 ease-out"
                    style={{ filter: "brightness(0.8) contrast(1.1)" }}
                  />

                  {item.oldPrice && (
                    <div className="absolute top-3 left-3 bg-[#F0BB78] text-black text-xs font-bold px-2 py-1 rounded-full shadow-[0_0_20px_rgba(240,187,120,0.4)]">
                      {Math.round(
                        ((item.oldPrice - item.price) / item.oldPrice) * 100
                      )}
                      % OFF
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h5 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[#F0BB78] transition-colors duration-500">
                      {item.name}
                    </h5>
                    <p className="mt-1 text-white/60 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <h6 className="text-xl font-bold text-[#F0BB78]">
                        ${item.price}
                      </h6>
                      {item.oldPrice && (
                        <h6 className="text-sm text-white/50">
                          <strike>${item.oldPrice}</strike>
                        </h6>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="bg-[#F0BB78] hover:bg-[#F0BB78]/90 text-black text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-1"
                      onClick={() => handleAddToCart(item)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5V3a2.5 2.5 0 0 1 2.5-2.5zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                        <path
                          fillRule="evenodd"
                          d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                        />
                      </svg>
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      className="bg-[#252525] hover:bg-[#303030] text-[#F0BB78] text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-1"
                      onClick={() =>
                        handleRemoveFromFavorite(item.id, item.name)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 3a5 5 0 0 1 2.959 9.584l-.709.735-5.292-5.487 5.292-5.488.709.736A5 5 0 0 1 8 3zm8 5a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-4.5 0a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 .5-.5z"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorite;
