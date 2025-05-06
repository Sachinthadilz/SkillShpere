import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Errors = ({ message }) => {
  const navigate = useNavigate();
  const onBackHandler = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-4"
        >
          <FiAlertCircle
            className="text-indigo-600 dark:text-indigo-400"
            size={48}
          />
        </motion.div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong.
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>

        <motion.button
          onClick={onBackHandler}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 text-white font-semibold px-8 py-4 rounded-xl transition-all"
        >
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Errors;