// SignIn.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("adminToken", data.token);

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
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

          {/* Admin logo and title */}
          <div className="flex mb-4 items-center justify-center flex-col relative z-10">
            <div className="bg-[#F0BB78] text-[#181818] px-3 py-1 rounded-full text-sm font-bold mb-4">
              ADMIN PORTAL
            </div>
            <h1 className="text-4xl font-bold mb-2">Welcome to</h1>
            <img
              src="/img/elitefit-logo.svg" // Correct path for logo in public folder
              alt="EliteFit Admin"
              className="w-[240px] mt-1"
            />

            {/* Admin shield icon */}
            <div className="mt-8 flex items-center justify-center">
              <div className="bg-[#F0BB78]/20 p-4 rounded-full">
                <ShieldAlert size={48} className="text-[#F0BB78]" />
              </div>
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-xl font-medium text-[#F0BB78]">
                Administrative Access
              </h2>
              <p className="text-white/70 mt-2">
                Secure login for authorized personnel only
              </p>
            </div>
          </div>

          {/* Glowing elements for visual appeal */}
          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-[#F0BB78]/20 blur-2xl pointer-events-none"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-[#F0BB78]/30 blur-xl pointer-events-none"></div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 p-10 bg-[#181818] text-white">
          <h2 className="text-3xl font-bold text-white mb-4">Admin Sign In</h2>
          <span className="inline-block px-3 py-1 bg-[#F0BB78] text-[#181818] rounded-full text-sm font-semibold tracking-wide shadow-sm mb-6">
            Restricted Access
          </span>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#252525] border border-[#303030] text-white rounded-lg focus:border-[#F0BB78] focus:outline-none focus:ring-1 focus:ring-[#F0BB78]"
                  placeholder="admin@elitefit.com"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Admin Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#252525] border border-[#303030] text-white rounded-lg focus:border-[#F0BB78] focus:outline-none focus:ring-1 focus:ring-[#F0BB78] pr-10"
                  placeholder="Enter your secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-[#F0BB78]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 text-white rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-[#F0BB78] text-[#000000] py-3 px-6 rounded-lg font-semibold hover:shadow-[0_5px_15px_rgba(240,187,120,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              {loading ? (
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
                  Authenticating...
                </>
              ) : (
                <>
                  Access Admin Dashboard
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

          <div className="mt-8 pt-6 border-t border-[#303030]">
            <p className="text-center text-white/70 text-sm">
              This is a restricted area for administrators only. <br />
              For customer access, please{" "}
              <Link
                to="/login"
                className="text-[#F0BB78] hover:underline font-medium"
              >
                visit the main login page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; // Correct export statement
