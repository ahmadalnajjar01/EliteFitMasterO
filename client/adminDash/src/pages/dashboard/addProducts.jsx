import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProducts = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    occasionId: "",
    stock: "",
    status: true,
    isNewArrival: false,
    onSale: false,
    image: null,
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);

  // Fetch categories and occasions on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/categories/get-all-categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchOccasions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/occasion/get-all"
        );
        setOccasions(response.data.data);
      } catch (error) {
        console.error("Error fetching occasions:", error);
      }
    };

    fetchCategories();
    fetchOccasions();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("categoryId", formData.categoryId);
    data.append("occasionId", formData.occasionId);
    data.append("stock", formData.stock);
    data.append("status", formData.status);
    data.append("isNewArrival", formData.isNewArrival);
    data.append("onSale", formData.onSale);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/create-products",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Product added successfully!");
      setMessageType("success");
      console.log("Product created:", response.data.product);

      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        occasionId: "",
        stock: "",
        status: true,
        isNewArrival: false,
        onSale: false,
        image: null,
      });
    } catch (error) {
      setMessage("Error adding product. Please try again.");
      setMessageType("error");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 relative">
        <span
          className="inline-block pb-2 pr-4 border-b-4 border-amber-400"
          style={{ borderColor: "#F0BB78" }}
        >
          Add New Product
        </span>
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            messageType === "success"
              ? "bg-green-50 border-l-4 border-green-500 text-green-700"
              : "bg-red-50 border-l-4 border-red-500 text-red-700"
          }`}
        >
          <span className="font-medium">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              style={{ focusRing: "#F0BB78" }}
            />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              style={{ focusRing: "#F0BB78" }}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Price
            </label>
            <div className="relative">
              <div className="absolute left-0 inset-y-0 flex items-center pl-4 pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                style={{ focusRing: "#F0BB78" }}
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              style={{ focusRing: "#F0BB78" }}
            />
          </div>

          {/* Category ID */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none bg-white"
              style={{
                focusRing: "#F0BB78",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F0BB78'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "3rem",
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Occasion ID */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Occasion
            </label>
            <select
              name="occasionId"
              value={formData.occasionId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none bg-white"
              style={{
                focusRing: "#F0BB78",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F0BB78'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "3rem",
              }}
            >
              <option value="">Select an occasion</option>
              {occasions.map((occasion) => (
                <option key={occasion.id} value={occasion.id}>
                  {occasion.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status, New Arrival, and On Sale in one row */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none bg-white"
                style={{
                  focusRing: "#F0BB78",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F0BB78'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "3rem",
                }}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            {/* New Arrival */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Is New Arrival
              </label>
              <select
                name="isNewArrival"
                value={formData.isNewArrival}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none bg-white"
                style={{
                  focusRing: "#F0BB78",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F0BB78'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "3rem",
                }}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>

            {/* On Sale */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                On Sale
              </label>
              <select
                name="onSale"
                value={formData.onSale}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all appearance-none bg-white"
                style={{
                  focusRing: "#F0BB78",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23F0BB78'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "3rem",
                }}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          </div>

          {/* Product Image */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-900">
              Product Image
            </label>
            <div
              className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-amber-400 transition-colors"
              style={{ hoverBorderColor: "#F0BB78" }}
            >
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <div className="flex flex-col items-center justify-center">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    {formData.image
                      ? formData.image.name
                      : "Click to upload image or drag and drop"}
                  </p>
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="px-8 py-3 rounded-lg text-white font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"
            style={{
              backgroundColor: "#181818",
              color: "#ffffff",
              focusRing: "#F0BB78",
            }}
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProducts;
