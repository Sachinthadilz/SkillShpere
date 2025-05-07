import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const PublicUserFollowing = ({ userId, onClose }) => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/auth/user/following/${userId}`);
      console.log("API Following Response:", response.data); // Debug log
      setFollowing(response.data);
    } catch (error) {
      console.error("Error fetching following:", error);
      toast.error("Failed to load following");
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to a user's profile
  const handleNavigateToProfile = (profileId) => {
    onClose(); // Close the modal first
    navigate(`/profile/${profileId}`); // Then navigate to the profile
  };

  const handleFollowToggle = async (followingId, isFollowed) => {
    try {
      if (isFollowed) {
        await api.post(`/auth/unfollow/${followingId}`);
        toast.success("Unfollowed successfully");
      } else {
        await api.post(`/auth/follow/${followingId}`);
        toast.success("Followed successfully");
      }

      // Update local state with more flexible property matching
      setFollowing(
        following.map((user) => {
          // Check both possible ID fields to be safe
          if (user.id === followingId || user.userId === followingId) {
            return { ...user, followed: !isFollowed };
          }
          return user;
        })
      );
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error(isFollowed ? "Failed to unfollow" : "Failed to follow");
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto relative">
            <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
            Loading following...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Following</h2>
          <p className="text-pink-100 text-sm">People this profile follows</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
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
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {following.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Not following anyone yet
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              When this profile follows people, they will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {following.map((user, index) => {
              // Get the ID value (support both possible field names)
              const userIdValue = user.id || user.userId;
              // Get the username (support both possible field names)
              const userName =
                user.userName || user.username || "Anonymous User";

              return (
                <div
                  key={userIdValue || `following-${index}`}
                  className="py-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => handleNavigateToProfile(userIdValue)}
                      className="relative bg-transparent border-0 p-0 cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-100 dark:border-purple-900">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${userName}'s profile`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                      </div>
                      {user.enabled && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                      )}
                    </button>
                    <div className="ml-4">
                      <button
                        onClick={() => handleNavigateToProfile(userIdValue)}
                        className="font-medium text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors bg-transparent border-0 p-0 cursor-pointer text-left"
                      >
                        {userName}
                      </button>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {user.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleFollowToggle(userIdValue, user.followed)
                    }
                    className={`ml-4 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      user.followed
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    {user.followed ? (
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
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicUserFollowing;
