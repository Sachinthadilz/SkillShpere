import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

const FollowingList = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/following");
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
      toast.error("Failed to load following");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await api.post(`/auth/unfollow/${userId}`);
      toast.success("Unfollowed successfully");

      // Remove unfollowed user from the list
      setFollowing(following.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
      toast.error("Failed to unfollow");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-8">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mx-auto"
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
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading following...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">People You Follow</h2>
          <p className="text-indigo-100 text-sm">
            Accounts you're currently following
          </p>
        </div>

        <div className="p-6">
          {following.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                You are not following anyone yet.
              </p>
              <Link
                to="/discover"
                className="mt-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Discover People
              </Link>
            </motion.div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {following.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Link to={`/profile/${user.id}`} className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.username || "User"}'s profile`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                            {user.username
                              ? user.username.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                        )}
                      </div>
                      {user.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                      )}
                    </Link>
                    <div className="ml-4">
                      <Link
                        to={`/profile/${user.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {user.username || "Anonymous User"}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {user.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUnfollow(user.id)}
                    className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Unfollow
                    </span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FollowingList;
