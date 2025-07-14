import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import Spinner from "../../components/Spinner/Spinner"; // Import Spinner

const Signup = ({ setIsAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name.trim(),
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
        setError(
          response.data?.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Signup error:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message || "Registration failed";
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
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border-none rounded-2xl bg-primary-effects dark:bg-primary-dark px-7 py-10 custom-transition shadow-custom">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7 text-center font-bold text-text-default dark:text-text-dark uppercase">
              Sign Up
            </h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
                "Sign Up"
              )}
            </button>
            <p className="text-sm text-center text-text-default dark:text-text-dark mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary text-accent-default hover:text-accent-effects font-medium underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
