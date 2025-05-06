import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Access the token using the useMyContext hook from the ContextProvider
  const { token } = useMyContext();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const onPasswordForgotHandler = async (data) => {
    //destructuring email from the data object
    const { email } = data;

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("email", email);
      await api.post("/auth/public/forgot-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //reset the field by using reset() function provided by react hook form after submit
      reset();

      //showing success message
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      toast.error("Error sending password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //if there is token exist navigate the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Animated gradient background similar to landing page */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="a" gradientTransform="rotate(40)">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <path
            d="M0,1000 C300,800 400,600 500,300 C600,100 700,50 1000,0 L1000,1000 Z"
            fill="url(#a)"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <form
          onSubmit={handleSubmit(onPasswordForgotHandler)}
          className="sm:w-[450px] w-[360px] bg-white dark:bg-gray-900 shadow-xl rounded-2xl py-10 sm:px-10 px-6 border border-gray-100 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
            >
              Forgot Password?
            </motion.h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Enter your email and we'll send you a password reset link
            </p>
          </div>
          <Divider className="mb-8"></Divider>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3 mb-6"
          >
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 border rounded-xl ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white transition-all`}
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              })}
            />
            {errors.email && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-red-500"
              >
                *Email is required and must be valid
              </motion.span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold w-full py-3 rounded-xl shadow-lg shadow-indigo-500/30 transition-all my-3 text-lg ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
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
                </span>
              ) : (
                "Send Recovery Link"
              )}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <Link
              className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 transition-colors font-medium flex items-center justify-center"
              to="/login"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back To Login
            </Link>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
