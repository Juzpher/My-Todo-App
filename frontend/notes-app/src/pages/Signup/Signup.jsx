import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import Spinner from "../../components/Spinner/Spinner"; // Import Spinner

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!email) {
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

    setError("");
    setLoading(true); // Set loading to true

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle Successful registration response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      } else if (response.data && response.data.message) {
        setError(response.data.message);
      }
    } catch (error) {
      // Handle Registration error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false); // Set loading to false after the request completes
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
