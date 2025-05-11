import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import UserPosts from "../Post/UserPosts";
import toast from "react-hot-toast";

const PublicUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/auth/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
      navigate("/discover"); // Redirect back to user list on error
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!profile) return;

    try {
      if (profile.followed) {
        await api.post(`/auth/unfollow/${userId}`);
        toast.success(`Unfollowed ${profile.userName}`);
      } else {
        await api.post(`/auth/follow/${userId}`);
        toast.success(`Following ${profile.userName}`);
      }

      // Update local state
      setProfile({
        ...profile,
        followed: !profile.followed,
      });
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error(profile.followed ? "Failed to unfollow" : "Failed to follow");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg animate-pulse">
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
              User not found
            </p>
            <button
              onClick={() => navigate("/discover")}
              className="mt-6 bg-indigo-600 text-white py-2.5 px-6 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back to Discover
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Profile header with cover image */}
          <div className="relative">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-48 sm:h-64">
              {/* Cover photo overlay pattern */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
                }}
              ></div>
            </div>

            {/* Profile info floating card */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-center">
                  {/* Profile picture */}
                  <div className="relative">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-md">
                      <img
                        src={
                          profile.profilePicture &&
                          profile.profilePicture !== ""
                            ? profile.profilePicture
                            : "/assets/default-avatar.png"
                        }
                        alt={`${profile.userName}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                    </div>

                    {/* Role badge */}
                    <div className="absolute -bottom-1 -right-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border border-indigo-200 dark:border-indigo-700">
                      {profile.role?.roleName?.replace("ROLE_", "")}
                    </div>
                  </div>

                  {/* User info */}
                  <div className="mt-6 sm:mt-0 sm:ml-8 flex flex-col sm:flex-row w-full items-center sm:items-start sm:justify-between">
                    <div className="text-center sm:text-left">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        {profile.userName}
                      </h1>
                      <div className="mt-1.5 flex flex-wrap justify-center sm:justify-start gap-2">
                        {/* We can add skill badges or other info here if available */}
                        <span className="inline-flex items-center text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
                          <span className="mr-1.5 w-2 h-2 inline-block bg-green-500 rounded-full"></span>
                          Active User
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleFollowToggle}
                      className={`mt-6 sm:mt-0 px-6 py-2.5 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        profile.followed
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-indigo-500"
                      }`}
                    >
                      {profile.followed ? (
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
                </div>
              </div>
            </div>
          </div>

          {/* Content section (with spacing to account for the floating card) */}
          <div className="mt-[100px] sm:mt-[120px] px-6 py-8">
            {/* Bio */}
            {profile.bio && (
              <div className="mt-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  About
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              </div>
            )}

            {/* User's Posts */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
                  />
                </svg>
                {profile.userName}'s Posts
              </h2>
              <UserPosts userId={userId} />
            </div>

            {/* Back button */}
            <div className="mt-10 flex justify-between items-center">
              <button
                onClick={() => navigate("/explore")}
                className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
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
                Back to Explore
              </button>

              {/* Optional: Share profile button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Profile link copied to clipboard!");
                }}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  ></path>
                </svg>
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
