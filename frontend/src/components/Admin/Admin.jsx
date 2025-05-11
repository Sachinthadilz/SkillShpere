import React from "react";
import { Route, Routes } from "react-router-dom";
import UserList from "./UserList";
import UserDetails from "./UserDetails";
import { motion } from "framer-motion";

const Admin = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="transition-all overflow-hidden flex-1 duration-150 w-full min-h-[calc(100vh-74px)]"
      >
        <div className="p-6 max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Admin Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Manage users, content, and system settings
            </motion.p>
          </div>

          {/* Content Area with animations and styling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <Routes>
              <Route path="users" element={<UserList />} />
              <Route path="users/:userId" element={<UserDetails />} />
              {/* Add other routes as necessary */}
            </Routes>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
