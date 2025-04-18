import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../assets/elitefit-logo.svg"; // Import the logo

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  useEffect(() => {
    // Load the Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize the Google sign-in
      window.google.accounts.id.initialize({
        client_id:
          "268942872776-ulvhmack82ul53133h6fkdd4f7ehnsgb.apps.googleusercontent.com",
        callback: handleGoogleLogin,
        ux_mode: "popup",
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
        }
      );
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleLogin = async (googleResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { credential: googleResponse.credential },
        { withCredentials: true }
      );

      console.log("Google login response data:", res.data);

      // Check if token is returned
      if (res.data.token) {
        // Save the token
        localStorage.setItem("token", res.data.token);
      }

      // Success Alert
      Swal.fire({
        icon: "success",
        title: "Access Granted",
        text: "You've successfully accessed your EliteFit.",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonColor: "#F0BB78",
      }).then(() => navigate("/"));
    } catch (error) {
      // Error Alert
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: error.response?.data?.message || "Authentication failed.",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonColor: "#F0BB78",
      });
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending request with credentials:", credentials);
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        credentials
      );

      console.log("Received response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stored in localStorage:", response.data.token);

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${response.data.user.firstName}!`,
          background: "#1a1a1a",
          color: "#ffffff",
          confirmButtonColor: "#F0BB78",
        }).then(() => {
          navigate("/");
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response
          ? error.response.data.message
          : "Invalid credentials",
        background: "#1a1a1a",
        color: "#ffffff",
        confirmButtonColor: "#F0BB78",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#181818] to-[#252525] flex items-center justify-center">
      <div className="max-w-6xl mx-auto bg-[#181818] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Section - Visuals */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-[#252525] to-[#181818] p-10 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#F0BB78]/5 blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#F0BB78]/5 blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

          {/* Replace text with logo */}
          <div className="flex mb-4 items-center justify-center flex-col ">
            <h1 className="text-4xl font-bold mb-2 mt-10">Welcome to </h1>
            <img src={Logo} alt="EliteFit logo" className="w-[240px] mt-1" />
          </div>

          {/* Glowing element for extra visual appeal */}
          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-[#F0BB78]/20 blur-2xl pointer-events-none"></div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 p-10 bg-[#181818] text-white">
          <h2 className="text-3xl font-bold text-white mb-6 ml-18">Sign In</h2>
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-black rounded-full text-sm font-semibold tracking-wide shadow-sm mb-6 ml-10">
            Access Your Account
          </span>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#252525] border border-[#303030] text-white rounded-lg focus:border-[#F0BB78] focus:outline-none focus:ring-1 focus:ring-[#F0BB78]"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-[#252525] border border-[#303030] text-white rounded-lg focus:border-[#F0BB78] focus:outline-none focus:ring-1 focus:ring-[#F0BB78] pr-10"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#F0BB78]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full bg-[#F0BB78] text-[#000000] py-3 px-6 rounded-lg font-semibold hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#000000]"
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
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Google Sign-In Button Container */}
          <div className="flex items-center justify-center mt-6">
            <div id="google-signin-btn"></div>
          </div>

          <p className="mt-6 text-center text-white/70">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#F0BB78] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
