import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AccessDenied = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Animated background element */}
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
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center relative z-10 border border-gray-100 dark:border-gray-700"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            bounce: 0.4,
          }}
          className="text-yellow-500 text-7xl mb-6 flex justify-center items-center"
        >
          <FaExclamationTriangle />
        </motion.div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Access Denied
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          You do not have permission to view this page.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goHome}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 text-white font-semibold px-8 py-3 rounded-xl transition-all text-lg w-full"
        >
          Go Back Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
