import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

const FollowersList = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/followers");
      setFollowers(response.data);
      // Debug to see the actual property name
      if (response.data.length > 0) {
        console.log("First follower data:", response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to load followers");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (userId, isFollowed) => {
    try {
      if (isFollowed) {
        await api.post(`/auth/unfollow/${userId}`);
        toast.success("Unfollowed successfully");
      } else {
        await api.post(`/auth/follow/${userId}`);
        toast.success("Followed successfully");
      }

      // Update local state correctly
      setFollowers(
        followers.map((follower) =>
          follower.id === userId
            ? { ...follower, followed: !isFollowed }
            : follower
        )
      );
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error(isFollowed ? "Failed to unfollow" : "Failed to follow");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center p-8 bg-gray-900">
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
            Loading followers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 bg-gray-900 min-h-screen">
      <div className="mb-6 max-w-7xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Profile
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 max-w-7xl mx-auto"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Your Followers</h2>
          <p className="text-indigo-100 text-sm">
            People who follow your profile
          </p>
        </div>

        <div className="p-6">
          {followers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">👥</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                You don't have any followers yet.
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                As your profile grows, followers will appear here.
              </p>
            </motion.div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {followers.map((follower, index) => {
                // Generate a unique key that doesn't rely solely on array index
                const uniqueKey = follower.id || `follower-${index}`;

                return (
                  <motion.div
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Link to={`/profile/${follower.id}`} className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900">
                          {follower.profilePicture ? (
                            <img
                              src={follower.profilePicture}
                              alt={`${follower.username || "User"}'s profile`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/150";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                              {follower.username
                                ? follower.username.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                          )}
                        </div>
                        {follower.enabled && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                        )}
                      </Link>
                      <div className="ml-4">
                        <Link
                          to={`/profile/${follower.id}`}
                          className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {follower.username || "Anonymous User"}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {follower.bio || "No bio available"}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleFollowToggle(follower.id, follower.followed)
                      }
                      className={`ml-4 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        follower.followed
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      {follower.followed ? (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          Following
                        </span>
                      ) : (
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          Follow
                        </span>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FollowersList;
