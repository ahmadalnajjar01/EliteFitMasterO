import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  updateOptions,
  clearCart,
} from "../Slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToFavorite, removeFromFavorite } from "../Slices/favoriteSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const favoriteItems = useSelector((state) => state.favorite.favorite);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Define available options; these can be static or come from product data/API.
  const availableSizes = ["select size", "XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = [
    "select color",
    "Black",
    "White",
    "Blue",
    "Red",
    "Green",
  ];

  // Check if all items have valid size and color selections
  const validCart = cartItems.every(
    (item) =>
      item.selectedSize &&
      item.selectedSize !== "select size" &&
      item.selectedColor &&
      item.selectedColor !== "select color"
  );

  // Handler for proceeding to checkout
  const handleProceedToCheckout = () => {
    if (validCart) {
      const shippingCost = total >= 100 ? 0 : 4; // Calculate shipping cost
      const finalTotal = total + shippingCost; // Calculate final total
      navigate("/checkout", {
        state: {
          cartItems,
          total: finalTotal, // Pass the final total to the checkout page
          shippingCost,
        },
      });
    } else {
      toast.error("Please select size and color for all items", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handler for removing item from cart
  const handleRemoveFromCart = (id, name) => {
    dispatch(removeFromCart(id));
    toast.success(`${name} removed from cart`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  // Handle adding/removing item to/from favorites
  const handleFavoriteToggle = (item, isFavorite) => {
    if (isFavorite) {
      // If already a favorite, remove from favorites
      dispatch(removeFromFavorite(item.id));
      toast.info("Product removed from favorites", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      // If not a favorite, add to favorites
      dispatch(addToFavorite(item));
      toast.success("Product added to favorites", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // Handler for updating quantity
  const handleUpdateQuantity = (id, name, quantity, increment) => {
    dispatch(updateQuantity({ id, quantity }));
    toast.info(
      `${name} quantity ${
        increment ? "increased" : "decreased"
      } to ${quantity}`,
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };

  // Handler for updating options
  const handleUpdateOptions = (id, selectedSize, selectedColor) => {
    dispatch(updateOptions({ id, selectedSize, selectedColor }));
    toast.info("Product options updated", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Handler for clearing cart
  const handleClearCart = () => {
    if (cartItems.length > 0) {
      dispatch(clearCart());
      toast.info("Cart has been cleared", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="font-sans bg-[#fff] text-black min-h-screen py-12">
      <ToastContainer />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-black mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-[#181818] rounded-xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-6">
              <svg
                className="w-24 h-24 text-[#F0BB78]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <p className="text-xl text-white/70 mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-[#F0BB78] text-black font-medium rounded-lg transition-all duration-300 hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transform hover:-translate-y-1"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-[#181818] rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-[#252525] border-b border-[#F0BB78]/20">
                  <h2 className="text-lg font-semibold text-white">
                    Items ({cartItems.length})
                  </h2>
                </div>

                <div className="divide-y divide-[#252525]">
                  {cartItems.map((item) => {
                    const imageUrl = item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5000/${item.image.replace(
                          /\\/g,
                          "/"
                        )}`;

                    // Check if the item is a favorite
                    const isFavorite = favoriteItems.some(
                      (fav) => fav.id === item.id
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start gap-6 p-6 hover:bg-[#252525] transition-colors duration-200"
                      >
                        <div className="w-32 h-32 flex-shrink-0 bg-[#252525] rounded-lg p-2">
                          <img
                            src={imageUrl}
                            className="w-full h-full object-contain"
                            alt={item.name}
                          />
                        </div>

                        <div className="flex-1 w-full">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-white/60 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Dropdown for selected size */}
                          <div className="mt-2 text-sm text-white/70">
                            <label className="mr-2 font-semibold">Size:</label>
                            <select
                              value={item.selectedSize || "select size"}
                              onChange={(e) => {
                                const newSize = e.target.value;
                                handleUpdateOptions(
                                  item.id,
                                  newSize,
                                  item.selectedColor || "select color"
                                );
                              }}
                              className="border border-[#F0BB78]/20 bg-[#252525] text-white rounded px-2 py-1"
                            >
                              {availableSizes.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Dropdown for selected color */}
                          <div className="mt-2 text-sm text-white/70">
                            <label className="mr-2 font-semibold">Color:</label>
                            <select
                              value={item.selectedColor || "select color"}
                              onChange={(e) => {
                                const newColor = e.target.value;
                                handleUpdateOptions(
                                  item.id,
                                  item.selectedSize || "select size",
                                  newColor
                                );
                              }}
                              className="border border-[#F0BB78]/20 bg-[#252525] text-white rounded px-2 py-1"
                            >
                              {availableColors.map((color) => (
                                <option key={color} value={color}>
                                  {color}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              type="button"
                              className="flex items-center gap-1.5 text-sm font-medium text-white/60 hover:text-[#F0BB78] transition-colors duration-200"
                              onClick={() =>
                                handleRemoveFromCart(item.id, item.name)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                              </svg>
                              Remove
                            </button>
                            <button
                              type="button"
                              className={`flex items-center gap-1.5 text-sm font-medium ${
                                isFavorite
                                  ? "text-[#F0BB78]"
                                  : "text-white/60 hover:text-[#F0BB78]"
                              }`}
                              onClick={() =>
                                handleFavoriteToggle(item, isFavorite)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              {isFavorite ? "Saved" : "Save for Later"}
                            </button>
                          </div>
                        </div>

                        <div className="ml-auto text-right pt-2 sm:pt-0">
                          <h4 className="text-lg font-bold text-white mb-3">
                            ${(item.price * item.quantity).toFixed(2)}
                          </h4>

                          <div className="inline-flex items-center border border-[#F0BB78]/20 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              className="px-3 py-2 text-white/60 hover:bg-[#252525] transition-colors"
                              onClick={() => {
                                if (item.quantity > 1) {
                                  handleUpdateQuantity(
                                    item.id,
                                    item.name,
                                    item.quantity - 1,
                                    false
                                  );
                                }
                              }}
                              disabled={item.quantity <= 1}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M20 12H4"
                                ></path>
                              </svg>
                            </button>
                            <span className="text-sm font-semibold px-4 py-2 bg-[#252525] text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="px-3 py-2 text-white/60 hover:bg-[#252525] transition-colors"
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.id,
                                  item.name,
                                  item.quantity + 1,
                                  true
                                )
                              }
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 4v16m8-8H4"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-[#F0BB78] hover:text-white font-medium text-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                  </svg>
                  Continue Shopping
                </Link>

                <button
                  className="text-sm text-white/60 hover:text-white font-medium"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#181818] rounded-xl shadow-lg p-6 lg:sticky lg:top-8">
              <h3 className="text-xl font-bold text-white border-b border-[#F0BB78]/20 pb-4">
                Order Summary
              </h3>

              <ul className="text-white divide-y mt-4 divide-[#252525]">
                <li className="flex justify-between text-sm py-3">
                  Subtotal (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items)
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </li>
                <li className="flex justify-between text-sm py-3">
                  Shipping
                  <span
                    className={`font-semibold ${
                      total >= 100 ? "text-[#F0BB78]" : "text-white/60"
                    }`}
                  >
                    {total >= 100 ? "Free" : "4 JD"}
                  </span>
                </li>
              </ul>

              <div className="border-t border-[#F0BB78]/20 mt-4 pt-4">
                <div className="flex justify-between font-bold text-lg text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className={`block mt-6 w-full text-center font-semibold py-3 px-4 rounded-lg transition-all duration-300 ${
                  validCart
                    ? "bg-[#F0BB78] text-black hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transform hover:-translate-y-1"
                    : "bg-[#252525] text-white/60 cursor-not-allowed"
                }`}
                title={
                  validCart
                    ? "Proceed to checkout"
                    : "Please select size and color for each item to proceed"
                }
              >
                {validCart
                  ? "Proceed to Checkout"
                  : "Select size and color to proceed"}
              </button>

              {total < 100 && (
                <p className="text-sm text-white/60 mt-2">
                  Add ${(100 - total).toFixed(2)} more to unlock free shipping.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
