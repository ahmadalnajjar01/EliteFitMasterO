import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Edit,
  Check,
  X,
  ShoppingBag,
  MapPin,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { removeFromFavorite } from "../Slices/favoriteSlice";
import { addToCart } from "../Slices/cartSlice";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get favorites from Redux store
  const favoriteItems = useSelector((state) => state.favorite.favorite);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    fetch("http://localhost:5000/api/orders/get-profile-orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data.user);
        setEditData({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          address: data.user.address,
        });
        setShippingAddresses(data.user.orders || []);
        setOrders(data.user.orders || []);
      })
      .catch((err) => console.error("Profile Fetch Error:", err));
  }, []);

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

  const handleEdit = () => {
    setEditing(!editing);
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUser(data.user);
        setEditing(false);
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => {
        console.error("Profile Update Error:", err);
        toast.error("Failed to update profile", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  const handleNavigation = (path, message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      navigate(path);
    }, 300);
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
    });
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen bg-[#181818]">
        <div className="w-8 h-8 border-4 border-t-[#F0BB78] border-b-[#F0BB78] border-white rounded-full animate-spin"></div>
        <p className="ml-3 text-xl text-white">Loading your profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      <ToastContainer />
      {/* Hero Banner */}
      <div className="h-64 bg-gradient-to-b from-[#F0BB78]/30 to-[#181818] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#181818] opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-wider">
              MEMBER PROFILE
            </h1>
            <p className="mt-2 text-lg">Premium Experience</p>
            <div className="mt-4 mx-auto h-1 w-24 bg-[#F0BB78] rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/3">
            <div className="bg-[#252525] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_0_1px_rgba(240,187,120,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(240,187,120,0.1)] transition-all duration-300">
              <div className="p-6 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-[#F0BB78] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(240,187,120,0.4)]">
                  <UserCircle className="w-24 h-24 text-[#181818]" />
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-[#F0BB78] mb-4">{user.email}</p>

                <div className="w-full mt-4">
                  <button
                    className={`w-full py-3 px-4 mb-2 text-left font-medium rounded-lg transition duration-300 ${
                      activeTab === "profile"
                        ? "bg-[#F0BB78] text-[#181818]"
                        : "hover:bg-[#303030]"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <UserCircle className="inline-block mr-2 w-5 h-5" />
                    Profile Information
                  </button>

                  <button
                    className={`w-full py-3 px-4 mb-2 text-left font-medium rounded-lg transition duration-300 ${
                      activeTab === "shipping"
                        ? "bg-[#F0BB78] text-[#181818]"
                        : "hover:bg-[#303030]"
                    }`}
                    onClick={() => setActiveTab("shipping")}
                  >
                    <MapPin className="inline-block mr-2 w-5 h-5" />
                    Shipping Addresses
                  </button>

                  <button
                    className={`w-full py-3 px-4 mb-2 text-left font-medium rounded-lg transition duration-300 ${
                      activeTab === "orders"
                        ? "bg-[#F0BB78] text-[#181818]"
                        : "hover:bg-[#303030]"
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingBag className="inline-block mr-2 w-5 h-5" />
                    Order History
                  </button>

                  <button
                    className={`w-full py-3 px-4 mb-2 text-left font-medium rounded-lg transition duration-300 ${
                      activeTab === "wishlist"
                        ? "bg-[#F0BB78] text-[#181818]"
                        : "hover:bg-[#303030]"
                    }`}
                    onClick={() => setActiveTab("wishlist")}
                  >
                    <Heart className="inline-block mr-2 w-5 h-5" />
                    Wishlist ({favoriteItems.length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="md:w-2/3">
            <div className="bg-[#252525] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_0_1px_rgba(240,187,120,0.05)] overflow-hidden">
              {activeTab === "profile" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Profile Information</h3>
                    {!editing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center bg-[#F0BB78] hover:bg-[#F0BB78]/80 text-[#181818] py-2 px-4 rounded-lg transition duration-300 transform hover:-translate-y-1"
                      >
                        <Edit className="mr-2 w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300 transform hover:-translate-y-1"
                        >
                          <Check className="mr-2 w-4 h-4" /> Save
                        </button>
                        <button
                          onClick={handleEdit}
                          className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300 transform hover:-translate-y-1"
                        >
                          <X className="mr-2 w-4 h-4" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {editing ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#181818] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#F0BB78] focus:outline-none"
                          value={editData.firstName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              firstName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full bg-[#181818] border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-[#F0BB78] focus:outline-none"
                          value={editData.lastName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="w-full bg-[#181818] border border-gray-700 rounded-lg px-3 py-2 text-gray-500 focus:outline-none"
                          value={editData.email}
                          disabled
                        />
                      </div>
                
                    </div>
                  ) : (
                    <div className="bg-[#181818] rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[#F0BB78] text-sm font-medium mb-1">
                            First Name
                          </h4>
                          <p className="text-lg">{user.firstName}</p>
                        </div>
                        <div>
                          <h4 className="text-[#F0BB78] text-sm font-medium mb-1">
                            Last Name
                          </h4>
                          <p className="text-lg">{user.lastName}</p>
                        </div>
                        <div>
                          <h4 className="text-[#F0BB78] text-sm font-medium mb-1">
                            Email
                          </h4>
                          <p className="text-lg">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Address Tab */}
              {activeTab === "shipping" && (
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-6">
                    Shipping Addresses
                  </h3>
                  {shippingAddresses.length > 0 ? (
                    <div className="space-y-4">
                      {shippingAddresses.map((address, idx) => (
                        <div
                          key={idx}
                          className="bg-[#181818] p-4 rounded-xl border-l-4 border-[#F0BB78] hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium text-[#F0BB78]">
                              {address.shippingName}
                            </h4>
                          </div>
                          <p className="mt-2">{address.shippingAddress}</p>
                          <p className="mt-1">{address.shippingCity}</p>
                          <p className="mt-1">{address.shippingState}</p>
                          <p className="mt-1">{address.shippingPostalCode}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#181818] rounded-xl p-6 text-center">
                      <p className="text-gray-400">
                        No shipping addresses found
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === "orders" && (
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-6">Order History</h3>
                  {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#303030]">
                            <th className="text-left py-3 px-4 text-[#F0BB78]">
                              Order ID
                            </th>
                            <th className="text-left py-3 px-4 text-[#F0BB78]">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 text-[#F0BB78]">
                              Status
                            </th>
                            <th className="text-right py-3 px-4 text-[#F0BB78]">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr
                              key={order.id}
                              className="border-b border-[#303030] hover:bg-[#181818] transition-colors duration-300"
                            >
                              <td className="py-3 px-4">#{order.id}</td>
                              <td className="py-3 px-4">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">{order.status}</td>
                              <td className="py-3 px-4 text-right">
                                ${order.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-[#181818] rounded-xl p-6 text-center">
                      <p className="text-gray-400">
                        No order history available
                      </p>
                      <button
                        onClick={() =>
                          handleNavigation(
                            "/products",
                            "Taking you to our shop..."
                          )
                        }
                        className="mt-4 bg-[#F0BB78] hover:bg-[#F0BB78]/80 text-[#181818] py-2 px-6 rounded-lg"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab - Now showing favorite items */}
              {activeTab === "wishlist" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                      My Favorites{" "}
                      <span className="text-[#F0BB78]">
                        ({favoriteItems.length})
                      </span>
                    </h3>
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
                            handleNavigation(
                              "/products",
                              "Taking you to our shop..."
                            )
                          }
                          className="mt-6 bg-[#F0BB78] text-black hover:bg-[#F0BB78]/90 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Browse Products
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                              navigate(`/product/${item.id}`, {
                                state: { item },
                              });
                            }}
                          >
                            <img
                              src={getImageUrl(item)}
                              alt={item.name}
                              className="w-full object-cover object-top aspect-[4/5] group-hover:scale-110 transition-transform duration-1000 ease-out"
                              style={{
                                filter: "brightness(0.8) contrast(1.1)",
                              }}
                            />

                            {item.oldPrice && (
                              <div className="absolute top-3 left-3 bg-[#F0BB78] text-black text-xs font-bold px-2 py-1 rounded-full shadow-[0_0_20px_rgba(240,187,120,0.4)]">
                                {Math.round(
                                  ((item.oldPrice - item.price) /
                                    item.oldPrice) *
                                    100
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
