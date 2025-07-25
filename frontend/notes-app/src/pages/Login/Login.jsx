import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import Spinner from "../../components/Spinner/Spinner"; // Import Spinner

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Function to fill demo credentials
  const fillDemoCredentials = () => {
    setEmail("email.demo@gmail.com");
    setPassword("password");
    setError(""); // Clear any existing errors
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    // Validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/login", {
        email: email.trim(),
        password: password,
      });

      // Check for successful response
      if (response.data && !response.data.error && response.data.accessToken) {
        // Store the token
        localStorage.setItem("token", response.data.accessToken);

        // Update authentication state
        if (setIsAuthenticated) {
          setIsAuthenticated(true);
        }

        // Navigate to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // Handle case where response doesn't have expected structure
        setError(response.data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message || "Invalid credentials";
        setError(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        setError(
          "Unable to connect to server. Please check your internet connection."
        );
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28 ">
        <div className="w-96 border-none rounded-2xl bg-primary-effects dark:bg-primary-dark px-7 py-10 custom-transition shadow-custom ">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7 text-center font-bold text-text-default dark:text-text-dark uppercase">
              Log In
            </h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Demo Credentials */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 mb-4 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                Demo Credentials
              </p>
              <div className="space-y-1 mb-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  📧{" "}
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    email.demo@gmail.com
                  </span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  🔑{" "}
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    password
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 font-medium"
              >
                Use Demo
              </button>
            </div>
            {error && <p className="text-critical-default">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center" // Added flex and justify-center
              disabled={loading} // Disable button while loading
            >
              {loading ? ( // Show loading state
                <span className="flex items-center">
                  <Spinner />
                </span>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-sm text-center text-text-default dark:text-text-dark mt-4">
              Not registered yet?{" "}
              <Link
                to="/signup"
                className="text-primary text-accent-default hover:text-accent-effects font-medium underline"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
