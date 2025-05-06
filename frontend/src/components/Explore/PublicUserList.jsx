import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const PublicUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/profiles");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user profiles");
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

      // Update the users state to reflect the change in follow status
      setUsers(
        users.map((user) =>
          user.userId === userId ? { ...user, followed: !isFollowed } : user
        )
      );
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error(isFollowed ? "Failed to unfollow" : "Failed to follow");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Loading profiles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Discover People
        </h2>

        {users.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div
                key={user.userId}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-3">
                      <img
                        src={
                          user.profilePicture
                        }
                        alt={`${user.userName || "User"}'s profile`}
                        className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800"
                      />
                    </div>
                    <Link to={`/profile/${user.userId}`}>
                      <h3 className="text-xl font-semibold text-white hover:underline">
                        {user.userName || "No username"}
                      </h3>
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                    {user.bio || "No bio available"}
                  </p>
                  <button
                    onClick={() =>
                      handleFollowToggle(user.userId, user.followed)
                    }
                    className={`w-full py-2 px-4 rounded-md transition-colors ${
                      user.followed
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {user.followed ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicUserList;
