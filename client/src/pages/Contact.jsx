import React, { useState } from "react";
import axios from "axios";
import {
  Send,
  Phone,
  MapPin,
  Mail,
  Clock,
  MessageSquare,
  X,
} from "lucide-react";

// Replace with your actual video file path
import contactVideo from "../assets/contactVideo.mp4";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // or "error"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve token from local storage (if applicable)
      const token = localStorage.getItem("token");

      // Axios POST request to /api/messages with Authorization header
      const response = await axios.post(
        "http://localhost:5000/api/messages",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Show success toast
        setToast({
          visible: true,
          message: "Thank you for your message. We'll get back to you soon!",
          type: "success",
        });

        // Reset form after submission
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        // Show error toast using response data (if provided)
        setToast({
          visible: true,
          message:
            response.data?.message || "Something went wrong. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      setToast({
        visible: true,
        message:
          (error.response && error.response.data.message) ||
          "Unable to send message. Please try again.",
        type: "error",
      });
    }

    // Auto hide toast after 5 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="min-h-screen bg-[#fff]">
      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center p-4 rounded-lg shadow-lg 
          ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white max-w-md`}
          role="alert"
        >
          <div className="mr-3">{toast.message}</div>
          <button
            onClick={hideToast}
            className="ml-auto inline-flex items-center justify-center rounded-md p-1 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Section with Video Background */}
      <div className="relative h-[50vh] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={contactVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-[#F0BB78]">CONTACT</span> US
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            We're here to help. Reach out with any questions about our products
            or services.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-16 -mt-20 relative z-20">
        <div className="bg-[#181818] rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Contact Info */}
            <div className="bg-[#252525] text-white p-8 md:p-12 md:w-1/3">
              <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
              <div className="flex items-center mb-4">
                <Phone className="h-5 w-5 mr-3" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 mr-3" />
                <span>info@example.com</span>
              </div>
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 mr-3" />
                <span>1234 Example St, City, Country</span>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 mr-3" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 md:p-12 md:w-2/3 bg-[#181818]">
              <div className="flex items-center mb-8">
                <div className="bg-[#F0BB78] p-3 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-[#000000]" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Send Us A Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-white/70 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#303030] bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#F0BB78] focus:border-[#F0BB78]"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white/70 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#303030] bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#F0BB78] focus:border-[#F0BB78]"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-white/70 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#303030] bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#F0BB78] focus:border-[#F0BB78]"
                      placeholder="+1 (123) 456-7890"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-white/70 mb-1"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#303030] bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#F0BB78] focus:border-[#F0BB78]"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-white/70 mb-1"
                  >
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-[#303030] bg-[#252525] text-white rounded-lg focus:ring-2 focus:ring-[#F0BB78] focus:border-[#F0BB78]"
                    placeholder="Write your message here..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F0BB78] text-[#000000] px-6 py-3 rounded-lg hover:bg-[#F0BB78]/90 transition-colors flex items-center justify-center font-semibold"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
