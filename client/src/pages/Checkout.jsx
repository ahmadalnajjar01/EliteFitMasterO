import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { clearCart } from "../Slices/cartSlice";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = () => {
  const location = useLocation();
  const { cartItems, total, shippingCost } = location.state || {};
  const totalAmount = total;

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
  });
  const [loading, setLoading] = useState(false);

  const paypalOptions = {
    "client-id":
      "AQO_lrXGFsV-gcb9dl11jWIu-BW84qeQbOxa31FnSsbeJj_fpHAMK3sb-c2aJjJSnjuaN4CDAxvT3tL1",
    currency: "USD",
    intent: "capture",
  };

  const showToast = (icon, title, timer = 3000) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: icon,
      title: title,
    });
  };

  const validCart = cartItems.every(
    (item) =>
      item.selectedSize &&
      item.selectedSize !== "select size" &&
      item.selectedColor &&
      item.selectedColor !== "select color"
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    showToast(
      "info",
      `Payment method changed to ${
        method === "card" ? "Credit/Debit Card" : "PayPal"
      }`
    );
  };

  const validateForm = () => {
    if (!validCart) {
      showToast("warning", "Please select size and color for each item");
      return false;
    }

    const requiredFields = [
      "shippingName",
      "shippingAddress",
      "shippingCity",
      "shippingState",
      "shippingPostalCode",
    ];

    const isFormValid = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );

    if (!isFormValid) {
      showToast("warning", "Please fill out all the required shipping fields");
      return false;
    }

    return true;
  };

  const createOrder = async () => {
    setLoading(true);
    showToast("info", "Processing your order...");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const payload = {
        ...formData,
        productIds: cartItems.map((item) => item.id),
        total: totalAmount,
        size: cartItems.map((item) => item.selectedSize),
        color: cartItems.map((item) => item.selectedColor),
        paymentMethod: paymentMethod,
      };

      const response = await fetch(
        "http://localhost:5000/api/orders/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.includes("jwt")) {
          throw new Error("Session expired or invalid. Please log in again.");
        }
        throw new Error(data.message || "Order creation failed");
      }

      setLoading(false);
      Swal.fire({
        title: "Order Created!",
        text: "Your order has been placed successfully. A confirmation email will be sent soon.",
        icon: "success",
        confirmButtonText: "Continue Shopping",
        confirmButtonColor: "#F0BB78",
      }).then(() => {
        dispatch(clearCart());
        navigate("/");
      });
    } catch (error) {
      setLoading(false);

      if (error.message.includes("jwt") || error.message.includes("token")) {
        showToast("error", "Authentication Error: " + error.message, 5000);
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      } else {
        showToast("error", "Error: " + error.message, 5000);
      }
      throw error;
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    await createOrder();
  };

  return (
    <div className="font-sans bg-[#fff] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-black sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-black">
            Complete your purchase securely
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment Form */}
          <div className="lg:col-span-2 bg-[#252525] rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="space-y-8">
                {/* Shipping Information */}
                <div>
                  <h2 className="text-lg font-semibold text-[#F0BB78] flex items-center">
                    <span className="bg-[#F0BB78] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                      1
                    </span>
                    Shipping Information
                  </h2>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label
                        htmlFor="shippingName"
                        className="block text-sm font-medium text-white"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="shippingName"
                        name="shippingName"
                        value={formData.shippingName}
                        onChange={handleInputChange}
                        onBlur={() => {
                          if (formData.shippingName.trim() !== "") {
                            showToast("success", "Name saved!");
                          }
                        }}
                        className="mt-1 block w-full border-[#F0BB78] rounded-md shadow-sm focus:ring-[#F0BB78] focus:border-[#F0BB78] sm:text-sm px-3 py-2 border"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="shippingAddress"
                        className="block text-sm font-medium text-white"
                      >
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleInputChange}
                        onBlur={() => {
                          if (formData.shippingAddress.trim() !== "") {
                            showToast("success", "Address saved!");
                          }
                        }}
                        className="mt-1 block w-full border-[#F0BB78] rounded-md shadow-sm focus:ring-[#F0BB78] focus:border-[#F0BB78] sm:text-sm px-3 py-2 border"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="shippingCity"
                        className="block text-sm font-medium text-white"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        onBlur={() => {
                          if (formData.shippingCity.trim() !== "") {
                            showToast("success", "City saved!");
                          }
                        }}
                        className="mt-1 block w-full border-[#F0BB78] rounded-md shadow-sm focus:ring-[#F0BB78] focus:border-[#F0BB78] sm:text-sm px-3 py-2 border"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="shippingState"
                        className="block text-sm font-medium text-white"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        id="shippingState"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        onBlur={() => {
                          if (formData.shippingState.trim() !== "") {
                            showToast("success", "State saved!");
                          }
                        }}
                        className="mt-1 block w-full border-[#F0BB78] rounded-md shadow-sm focus:ring-[#F0BB78] focus:border-[#F0BB78] sm:text-sm px-3 py-2 border"
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="shippingPostalCode"
                        className="block text-sm font-medium text-white"
                      >
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        id="shippingPostalCode"
                        name="shippingPostalCode"
                        value={formData.shippingPostalCode}
                        onChange={handleInputChange}
                        onBlur={() => {
                          if (formData.shippingPostalCode.trim() !== "") {
                            showToast("success", "Postal code saved!");
                          }
                        }}
                        className="mt-1 block w-full border-[#F0BB78] rounded-md shadow-sm focus:ring-[#F0BB78] focus:border-[#F0BB78] sm:text-sm px-3 py-2 border"
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-6 border-t border-[#F0BB78]">
                  <h2 className="text-lg font-semibold text-[#F0BB78] flex items-center">
                    <span className="bg-[#F0BB78] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                      2
                    </span>
                    Payment Method
                  </h2>
                  <div className="mt-6 space-y-4">
                    <div
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-[#F0BB78] bg-[#F0BB78]/10"
                          : "border-[#F0BB78]/30 hover:border-[#F0BB78]"
                      }`}
                      onClick={() => handlePaymentMethodChange("card")}
                    >
                      <input
                        type="radio"
                        id="card-payment"
                        name="payment-method"
                        className="h-4 w-4 text-[#F0BB78] focus:ring-[#F0BB78] border-[#F0BB78]"
                        checked={paymentMethod === "card"}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor="card-payment"
                        className="ml-3 flex items-center cursor-pointer"
                      >
                        <span className="font-medium text-white">
                          Cash
                        </span>
                      </label>
                    </div>

                    <div
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "paypal"
                          ? "border-[#F0BB78] bg-[#F0BB78]/10"
                          : "border-[#F0BB78]/30 hover:border-[#F0BB78]"
                      }`}
                      onClick={() => handlePaymentMethodChange("paypal")}
                    >
                      <input
                        type="radio"
                        id="paypal-payment"
                        name="payment-method"
                        className="h-4 w-4 text-[#F0BB78] focus:ring-[#F0BB78] border-[#F0BB78]"
                        checked={paymentMethod === "paypal"}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor="paypal-payment"
                        className="ml-3 flex items-center cursor-pointer"
                      >
                        <span className="font-medium text-white">PayPal</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                {paymentMethod === "card" ? (
                  // Credit Card Form or Button
                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={handlePayment}
                      disabled={loading}
                      className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        loading
                          ? "bg-[#F0BB78]/50 cursor-wait"
                          : "bg-[#F0BB78] hover:bg-[#F0BB78]/80"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F0BB78]`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Pay with Card - ${totalAmount.toFixed(2)}</>
                      )}
                    </button>
                    <p className="mt-3 text-xs text-center text-white">
                      By completing your purchase, you agree to our{" "}
                      <a
                        href="#"
                        className="text-[#F0BB78] hover:text-[#F0BB78]/80"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#F0BB78] hover:text-[#F0BB78]/80"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                ) : (
                  // PayPal Button
                  <div className="pt-6">
                    <PayPalScriptProvider options={paypalOptions}>
                      <div className="paypal-button-container">
                        <PayPalButtons
                          style={{
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "paypal",
                          }}
                          createOrder={(data, actions) => {
                            if (!validateForm()) {
                              return Promise.reject(
                                new Error("Please fill all required fields")
                              );
                            }
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: totalAmount.toFixed(2),
                                    currency_code: "USD",
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={async (data, actions) => {
                            try {
                              await actions.order.capture();
                              await createOrder();
                            } catch (error) {
                              showToast(
                                "error",
                                "Payment failed: " + error.message,
                                5000
                              );
                            }
                          }}
                          onError={(err) => {
                            showToast(
                              "error",
                              "PayPal error: " + err.message,
                              5000
                            );
                          }}
                        />
                      </div>
                    </PayPalScriptProvider>
                    <p className="mt-3 text-xs text-center text-white">
                      By completing your purchase, you agree to our{" "}
                      <a
                        href="#"
                        className="text-[#F0BB78] hover:text-[#F0BB78]/80"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#F0BB78] hover:text-[#F0BB78]/80"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-[#252525] rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-[#F0BB78] mb-4">
                  Order Summary
                </h2>
                {cartItems.length > 0 && (
                  <div className="flow-root">
                    <ul className="divide-y divide-[#F0BB78]/50">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-4 flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-white">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#F0BB78]">
                              Qty: {item.quantity}
                              {item.selectedSize &&
                                ` | Size: ${item.selectedSize}`}
                              {item.selectedColor &&
                                ` | Color: ${item.selectedColor}`}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-[#F0BB78]">
                  <div className="flex justify-between text-sm font-medium text-white mb-2">
                    <p>Subtotal</p>
                    <p>${totalAmount.toFixed(2)}</p>
                  </div>
                 
                  <div className="flex justify-between text-base font-bold text-[#F0BB78]">
                    <p>Total</p>
                    <p>${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#252525] border border-[#F0BB78]/20 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-[#F0BB78] mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <div>
                  <h4 className="font-medium text-[#F0BB78]">
                    Need help completing your order?
                  </h4>
                  <p className="text-sm text-white mt-1">
                    If you have questions about payment or shipping, please
                    contact our support at{" "}
                    <a
                      href="mailto:help@shop.com"
                      className="text-[#F0BB78] underline"
                    >
                      help@shop.com
                    </a>{" "}
                    or call us at{" "}
                    <span className="font-medium">+1 234 567 890</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
