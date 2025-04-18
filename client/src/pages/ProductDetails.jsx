import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { addToCart } from "../Slices/cartSlice";
import { addToFavorite } from "../Slices/favoriteSlice";

const ProductDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const item = location.state?.item;

  // State for selected options
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  // States for product images
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // States for handling reviews
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // State for report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [commentToReport, setCommentToReport] = useState(null);

  // Sample data for sizes and colors
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Blue", "Red", "Green"];

  // Sample additional images
  const sampleAdditionalImages = [
    // "/api/placeholder/100/100",
    // "/api/placeholder/100/100",
    // "/api/placeholder/100/100",
    // "/api/placeholder/100/100",
  ];

  useEffect(() => {
    if (item) {
      // Build product image URL
      const imageUrl = item.image.startsWith("http")
        ? item.image
        : `http://localhost:5000/${item.image.replace(/\\/g, "/")}`;
      setMainImage(imageUrl);
      fetchReviews();

      // Scroll to top when component mounts
      window.scrollTo(0, 0);
    }
  }, [item]);

  if (!item) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-xl max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black mt-6">
            Product Not Found
          </h2>
          <p className="mt-3 text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Add product to cart with selected options
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...item,
        selectedSize,
        selectedColor,
        quantity,
      })
    );
    toast.success("Product added to cart", {
      position: "top-right",
      duration: 3000,
      style: {
        background: "#000000",
        color: "#FFFFFF",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderLeft: "4px solid #F0BB78",
      },
      iconTheme: {
        primary: "#F0BB78",
        secondary: "#FFFFFF",
      },
    });
  };

  // Add product to favorites
  const handleAddToFavorite = () => {
    dispatch(addToFavorite(item));
    toast.success("Product added to favorites", {
      position: "top-right",
      duration: 3000,
      style: {
        background: "#000000",
        color: "#FFFFFF",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderLeft: "4px solid #F0BB78",
      },
      iconTheme: {
        primary: "#F0BB78",
        secondary: "#FFFFFF",
      },
    });
  };

  // Handle image upload for review
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        toast.error("Image size must be less than 5MB", {
          position: "top-right",
          style: {
            background: "#000000",
            color: "#FFFFFF",
            borderLeft: "4px solid #ff4b4b",
          },
        });
        return;
      }

      setReviewImage(file);
      toast.success("Image uploaded successfully", {
        position: "top-right",
        duration: 2000,
        style: {
          background: "#000000",
          color: "#FFFFFF",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderLeft: "4px solid #F0BB78",
        },
        iconTheme: {
          primary: "#F0BB78",
          secondary: "#FFFFFF",
        },
      });
    }
  };

  // Fetch reviews for the product
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(
        `http://localhost:5000/api/comments/${item.id}`
      );
      const data = await response.json();
      if (response.ok) {
        setReviews(data.comments);
      } else {
        toast.error("Failed to load reviews", {
          position: "top-right",
          style: {
            background: "#000000",
            color: "#FFFFFF",
            borderLeft: "4px solid #ff4b4b",
          },
        });
        console.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching reviews", {
        position: "top-right",
        style: {
          background: "#000000",
          color: "#FFFFFF",
          borderLeft: "4px solid #ff4b4b",
        },
      });
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Submit a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText.trim()) {
      toast.error("Please write a review", {
        position: "top-right",
        style: {
          background: "#000000",
          color: "#FFFFFF",
          borderLeft: "4px solid #ff4b4b",
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", reviewText);

    if (reviewImage) {
      formData.append("image", reviewImage);
    }
    formData.append("productId", item.id);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to submit a review", {
          position: "top-right",
          style: {
            background: "#000000",
            color: "#FFFFFF",
            borderLeft: "4px solid #ff4b4b",
          },
        });
        // Could redirect to login page here
        return;
      }

      const response = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      // Clear form and refresh reviews
      setReviewText("");
      setRating(5);
      setReviewImage(null);

      // Notify user and refresh reviews
      toast.success("Review submitted successfully", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#000000",
          color: "#FFFFFF",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderLeft: "4px solid #F0BB78",
        },
        iconTheme: {
          primary: "#F0BB78",
          secondary: "#FFFFFF",
        },
      });

      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to submit review", {
        position: "top-right",
        style: {
          background: "#000000",
          color: "#FFFFFF",
          borderLeft: "4px solid #ff4b4b",
        },
      });
      console.error("Error submitting review:", error);
    }
  };

  // Open report modal
  const openReportModal = (commentId) => {
    setCommentToReport(commentId);
    setReportReason("");
    setShowReportModal(true);
  };

  // Close report modal
  const closeReportModal = () => {
    setShowReportModal(false);
    setCommentToReport(null);
    setReportReason("");
  };

  // Submit report
  const submitReport = async () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for the report", {
        position: "top-right",
        style: {
          background: "#000000",
          color: "#FFFFFF",
          borderLeft: "4px solid #ff4b4b",
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Please login to report comments");
      }

      const response = await fetch(
        "http://localhost:5000/api/comment-reports/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            commentId: Number(commentToReport),
            reason: reportReason,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.reload();
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(data.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully", {
        position: "top-right",
        duration: 3000,
        style: {
          background: "#000000",
          color: "#FFFFFF",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          borderLeft: "4px solid #F0BB78",
        },
        iconTheme: {
          primary: "#F0BB78",
          secondary: "#FFFFFF",
        },
      });

      closeReportModal();
      return data;
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        style: {
          background: "#000000",
          color: "#FFFFFF",
          borderLeft: "4px solid #ff4b4b",
        },
      });
      console.error("Reporting error:", {
        error: error.message,
        commentId: commentToReport,
        time: new Date().toISOString(),
      });
      return { error: error.message };
    }
  };

  // Decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Increase quantity
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Change main image
  const changeMainImage = (image) => {
    setMainImage(image);
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Rating count by star
  const getRatingCount = (star) => {
    return reviews.filter((review) => review.rating === star).length;
  };

  // Percentage of each rating
  const getRatingPercentage = (star) => {
    if (!reviews.length) return 0;
    return (getRatingCount(star) / reviews.length) * 100;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="font-sans bg-gray-50">
      <Toaster />

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Image Gallery */}
            <div className="p-6 lg:p-8 bg-gray-50">
              <div className="aspect-square bg-white rounded-xl border border-gray-100 overflow-hidden shadow-md mb-6">
                <img
                  src={mainImage}
                  className="w-full h-full object-contain p-4"
                  alt={item.name}
                />
              </div>

              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => changeMainImage(mainImage)}
                  className="w-20 h-20 rounded-lg border-2 border-black overflow-hidden flex-shrink-0 transition-all duration-300 transform hover:scale-105"
                >
                  <img
                    src={mainImage}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />
                </button>
                {sampleAdditionalImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => changeMainImage(img)}
                    className="w-20 h-20 rounded-lg border hover:border-black overflow-hidden flex-shrink-0 transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`${item.name} view ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 lg:p-10">
              <div className="flex items-center space-x-2 mb-4">
                {item.oldPrice && (
                  <div className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                    {Math.round(
                      ((item.oldPrice - item.price) / item.oldPrice) * 100
                    )}
                    % OFF
                  </div>
                )}
                <div className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                  NEW ARRIVAL
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
                {item.firstName || item.name}
              </h1>

              <div className="flex items-center space-x-3 mb-4">
                <div className="flex text-amber-400">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          i < Math.round(calculateAverageRating())
                            ? "text-F0BB78"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                </div>
                <span className="text-sm text-gray-600">
                  {calculateAverageRating()} | {reviews.length} Reviews
                </span>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-black">
                  {formatPrice(item.price)}
                </span>
                {item.oldPrice && (
                  <span className="text-xl text-gray-500 line-through ml-3">
                    {formatPrice(item.oldPrice)}
                  </span>
                )}
              </div>

              <div className="border-t border-b border-gray-200 py-6 space-y-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-black uppercase mb-3">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`h-10 min-w-10 px-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          selectedSize === size
                            ? "bg-black text-white shadow-md"
                            : "border border-gray-300 hover:border-black text-black hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-black uppercase mb-3">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color) => {
                      const lowerColor = color.toLowerCase();
                      return (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                            selectedColor === color
                              ? "ring-2 ring-offset-2 ring-F0BB78"
                              : "hover:scale-110"
                          }`}
                          style={{ backgroundColor: lowerColor }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select ${color} color`}
                        >
                          {selectedColor === color && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 ${
                                lowerColor === "black" || lowerColor === "blue"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Selected:{" "}
                    <span className="font-medium">{selectedColor}</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-black uppercase mb-3">
                    Quantity
                  </h3>
                  <div className="flex items-center w-32">
                    <button
                      onClick={decreaseQuantity}
                      className="w-10 h-10 rounded-l-lg flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300 font-medium">
                      {quantity}
                    </div>
                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 rounded-r-lg flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  className="flex-1 bg-black hover:bg-gray-900 text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                  onClick={handleAddToCart}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
                <button
                  className="flex-1 bg-white border-2 border-black hover:border-gray-800 text-black px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center"
                  onClick={handleAddToFavorite}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-F0BB78"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Add to Wishlist
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`py-3 px-4 font-medium text-sm relative ${
                      activeTab === "description"
                        ? "text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Description
                    {activeTab === "description" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-F0BB78"></span>
                    )}
                  </button>
                  <button
                    className={`py-3 px-4 font-medium text-sm relative ${
                      activeTab === "details"
                        ? "text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                    {activeTab === "details" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-F0BB78"></span>
                    )}
                  </button>
                  <button
                    className={`py-3 px-4 font-medium text-sm relative ${
                      activeTab === "shipping"
                        ? "text-black"
                        : "text-gray-500 hover:text-black"
                    }`}
                    onClick={() => setActiveTab("shipping")}
                  >
                    Shipping
                    {activeTab === "shipping" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-F0BB78"></span>
                    )}
                  </button>
                </div>
                <div className="py-4">
                  {activeTab === "description" && (
                    <div className="text-gray-700 space-y-3">
                      <p>{item.description || "No description available."}</p>
                      <ul className="list-disc pl-5 space-y-1 mt-4">
                        <li>Premium quality materials</li>
                        <li>Designed for comfort and style</li>
                        <li>Versatile and timeless design</li>
                        <li>Perfect for any occasion</li>
                      </ul>
                    </div>
                  )}
                  {activeTab === "details" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-sm text-gray-500 font-medium">
                          Material
                        </div>
                        <div className="text-sm">100% Premium Cotton</div>
                        <div className="text-sm text-gray-500 font-medium">
                          Care
                        </div>
                        <div className="text-sm">Machine wash cold</div>
                        <div className="text-sm text-gray-500 font-medium">
                          Origin
                        </div>
                        <div className="text-sm">Made in Portugal</div>
                        <div className="text-sm text-gray-500 font-medium">
                          SKU
                        </div>
                        <div className="text-sm">{item.id || "N/A"}</div>
                      </div>
                    </div>
                  )}
                  {activeTab === "shipping" && (
                    <div className="space-y-3">
                      <p className="text-gray-700">
                        Free standard shipping on all orders over $100.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-F0BB78"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Standard Delivery
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            3-5 business days
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            $4.99 (Free over $100)
                          </p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <h4 className="font-medium flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2 text-F0BB78"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Express Delivery
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            1-2 business days
                          </p>
                          <p className="text-sm text-gray-600 mt-1">$9.99</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-8 text-black flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-F0BB78"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Customer Reviews
          </h2>

          <div className="grid lg:grid-cols-12 gap-8 mb-10">
            {/* Review Summary */}
            <div className="lg:col-span-4">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-6">
                  <div className="text-5xl font-bold mr-4 text-black">
                    {calculateAverageRating()}
                  </div>
                  <div>
                    <div className="flex text-F0BB78">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              i < Math.round(calculateAverageRating())
                                ? "text-F0BB78"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Based on {reviews.length} reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center">
                      <div className="w-10 text-sm text-gray-700 font-medium">
                        {star} ★
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mx-2 overflow-hidden">
                        <div
                          className="bg-F0BB78 h-2 rounded-full"
                          style={{ width: `${getRatingPercentage(star)}%` }}
                        ></div>
                      </div>
                      <div className="w-10 text-sm text-gray-600 text-right">
                        {getRatingCount(star)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="lg:col-span-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-black">
                  Write a Review
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Rating
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-3xl text-gray-300 focus:outline-none hover:text-F0BB78 transition-colors"
                        >
                          <span className={star <= rating ? "text-F0BB78" : ""}>
                            ★
                          </span>
                        </button>
                      ))}
                      <span className="ml-3 text-gray-600 text-sm">
                        {rating} out of 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Your Review
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                      rows="4"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your detailed experience with this product..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Add Photo (Optional, Max 5MB)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full p-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-gray-800 transition-colors"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    {reviewImage && (
                      <div className="mt-3 flex items-center">
                        <img
                          src={URL.createObjectURL(reviewImage)}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-lg mr-4 border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => setReviewImage(null)}
                          className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {loadingReviews ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium">No reviews yet</h3>
              <p className="text-gray-500 mt-2">
                Be the first to review this product
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-F0BB78 flex items-center justify-center text-white font-bold mr-3">
                        {review.name
                          ? review.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-black">
                          {review.name || "Anonymous User"}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex text-F0BB78">
                            {Array(5)
                              .fill()
                              .map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-F0BB78"
                                      : "text-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed my-4">
                    {review.comment}
                  </p>

                  {review.reviewImage && (
                    <div className="mt-4 mb-6">
                      <img
                        src={
                          review.reviewImage.startsWith("http")
                            ? review.reviewImage
                            : `http://localhost:5000${review.reviewImage}`
                        }
                        alt="Review"
                        className="h-auto max-w-xs object-cover rounded-lg shadow-sm"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button className="text-sm text-gray-500 hover:text-black flex items-center transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        Helpful
                      </button>
                      <button className="text-sm text-gray-500 hover:text-black flex items-center transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2"
                          />
                        </svg>
                        Not Helpful
                      </button>
                    </div>
                    <button
                      className="text-sm text-gray-500 hover:text-red-600 flex items-center transition-colors"
                      onClick={() => openReportModal(review.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      Report
                    </button>
                  </div>
                </div>
              ))}

              {reviews.length > 5 && (
                <div className="flex justify-center mt-8">
                  <button className="px-8 py-3 border border-gray-300 rounded-lg text-black hover:bg-gray-50 font-medium transition-all hover:shadow-md">
                    Load More Reviews
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* You Might Also Like Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-8 text-black flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-F0BB78"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            You Might Also Like
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="group">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={`/api/placeholder/300/300`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    alt={`Related product ${index}`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-F0BB78"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-full bg-F0BB78 hover:bg-amber-400 text-black font-medium py-2 rounded-lg transition-colors">
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="text-sm font-medium text-black truncate">
                    Premium Product {index}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1">
                    Luxury Collection
                  </p>
                  <div className="mt-1 font-medium text-black">
                    ${(99.99 - index * 10).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-black">Report Review</h3>
              <button
                onClick={closeReportModal}
                className="text-gray-500 hover:text-black rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Reason for reporting
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows="4"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Please provide details about why you're reporting this review..."
                  required
                ></textarea>
              </div>

              <div className="text-xs text-gray-500 mb-6">
                <p>
                  Your report will be reviewed by our team. We take all reports
                  seriously and will take appropriate action if necessary.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeReportModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  className="px-4 py-2 bg-black hover:bg-gray-900 text-white rounded-lg transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to top button */}
      <button
        className="fixed bottom-6 right-6 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-900 transition-colors z-10 hover:scale-110 transition-transform"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProductDetails;
