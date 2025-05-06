import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";
import { useForm } from "react-hook-form";
import Switch from "@mui/material/Switch";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Blocks } from "react-loader-spinner";
import moment from "moment";
import Errors from "../Errors";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserProfile = () => {
  // Access the currentUser and token hook using the useMyContext custom hook from the ContextProvider
  const { currentUser, token } = useMyContext();
  //set the loggin session from the token
  const [loginSession, setLoginSession] = useState(null);

  const [credentialExpireDate, setCredentialExpireDate] = useState(null);
  const [pageError, setPageError] = useState(false);

  const [accountExpired, setAccountExpired] = useState();
  const [accountLocked, setAccountLock] = useState();
  const [accountEnabled, setAccountEnabled] = useState();
  const [credentialExpired, setCredentialExpired] = useState();

  const [openAccount, setOpenAccount] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enable, Step 2: Verify

  const [activeTab, setActiveTab] = useState("profile");

  //loading state
  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [disabledLoader, setDisbledLoader] = useState(false);
  const [twofaCodeLoader, settwofaCodeLoader] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      password: "",
    },
    mode: "onTouched",
  });

  //fetching the 2fa sttaus
  useEffect(() => {
    setPageLoader(true);

    const fetch2FAStatus = async () => {
      try {
        const response = await api.get(`/auth/user/2fa-status`);
        setIs2faEnabled(response.data.is2faEnabled);
      } catch (error) {
        setPageError(error?.response?.data?.message);
        toast.error("Error fetching 2FA status");
      } finally {
        setPageLoader(false);
      }
    };
    fetch2FAStatus();
  }, []);

  //enable the 2fa
  const enable2FA = async () => {
    setDisbledLoader(true);
    try {
      const response = await api.post(`/auth/enable-2fa`);
      setQrCodeUrl(response.data);
      setStep(2);
    } catch (error) {
      toast.error("Error enabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  //diable the 2fa
  const disable2FA = async () => {
    setDisbledLoader(true);
    try {
      await api.post(`/auth/disable-2fa`);
      setIs2faEnabled(false);
      setQrCodeUrl("");
    } catch (error) {
      toast.error("Error disabling 2FA");
    } finally {
      setDisbledLoader(false);
    }
  };

  //verify the 2fa
  const verify2FA = async () => {
    if (!code || code.trim().length === 0)
      return toast.error("Please Enter The Code To Verify");

    settwofaCodeLoader(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);

      await api.post(`/auth/verify-2fa`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("2FA verified successful");

      setIs2faEnabled(true);
      setStep(1);
    } catch (error) {
      console.error("Error verifying 2FA", error);
      toast.error("Invalid 2FA Code");
    } finally {
      settwofaCodeLoader(false);
    }
  };

  //update the credentials
  const handleUpdateCredential = async (data) => {
    const newUsername = data.username;
    const newPassword = data.password;

    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newUsername", newUsername);
      formData.append("newPassword", newPassword);
      await api.post("/auth/update-credentials", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("Update Credential successful");
    } catch (error) {
      toast.error("Update Credential failed");
    } finally {
      setLoading(false);
    }
  };

  //set the status of (credentialsNonExpired, accountNonLocked, enabled and credentialsNonExpired) current user
  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
      setAccountExpired(!currentUser.accountNonExpired);
      setAccountLock(!currentUser.accountNonLocked);
      setAccountEnabled(currentUser.enabled);
      setCredentialExpired(!currentUser.credentialsNonExpired);

      //moment npm package is used to format the date
      const expiredFormatDate = moment(
        currentUser?.credentialsExpiryDate
      ).format("D MMMM YYYY");
      setCredentialExpireDate(expiredFormatDate);
    }
  }, [currentUser, setValue]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("dddd, D MMMM YYYY, h:mm A");
      //set the loggin session from the token
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  //update the AccountExpiryStatus
  const handleAccountExpiryStatus = async (event) => {
    setAccountExpired(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("Update Account Expirey Status");
    } catch (error) {
      toast.error("Update expirey status failed");
    }
  };

  //update the AccountLockStatus
  const handleAccountLockStatus = async (event) => {
    setAccountLock(event.target.checked);

    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("lock", event.target.checked);

      await api.put("/auth/update-lock-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("Update Account Lock Status");
    } catch (error) {
      toast.error("Update Account Lock status failed");
    }
  };

  //update the AccountEnabledStatus
  const handleAccountEnabledStatus = async (event) => {
    setAccountEnabled(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("enabled", event.target.checked);

      await api.put("/auth/update-enabled-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("Update Account Enabled Status");
    } catch (error) {
      toast.error("Update Account Enabled status failed");
    }
  };

  //update the CredentialExpiredStatus
  const handleCredentialExpiredStatus = async (event) => {
    setCredentialExpired(event.target.checked);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("expire", event.target.checked);

      await api.put("/auth/update-credentials-expiry-status", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("Update Credentials Expiry Status");
    } catch (error) {
      toast.error("Credentials Expiry Status Failed");
    }
  };

  if (pageError) {
    return <Errors message={pageError} />;
  }

  //two function for opening and closing the according
  const onOpenAccountHandler = () => {
    setOpenAccount(!openAccount);
    setOpenSetting(false);
  };
  const onOpenSettingHandler = () => {
    setOpenSetting(!openSetting);
    setOpenAccount(false);
  };

  // Add these with your other state declarations (around line 30)
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    currentUser?.profilePicture || null
  );
  const [stats, setStats] = useState({
    followers: 0,
    following: 0,
  });

  // Add this effect to fetch follower stats (after your other useEffect hooks)
  // Fix the API calls to get followers and following counts
  useEffect(() => {
    const fetchSocialStats = async () => {
      if (currentUser?.id) {
        try {
          // Use the correct API endpoints - you were using the same endpoint for both
          const [followersResponse, followingResponse] = await Promise.all([
            api.get(`/auth/followers`), // For followers
            api.get(`/auth/following`), // For following - this should be different
          ]);

          // Set the counts correctly from the responses
          setStats({
            followers: followersResponse.data.length || 0,
            following: followingResponse.data.length || 0,
          });
        } catch (error) {
          console.error("Error fetching social stats:", error);
          // Set default values in case of error
          setStats({ followers: 0, following: 0 });
        }
      }
    };

    fetchSocialStats();
  }, [currentUser?.id]);

  // Add this function for profile picture changes
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function for updating social profile
  const handleUpdateSocialProfile = async () => {
    try {
      setLoading(true);

      // Create a FormData object to handle the file upload
      const formData = new FormData();
      formData.append("bio", bio);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      // Use an appropriate endpoint for your backend
      const response = await api.post("/auth/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Social profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating social profile:", error);
      toast.error(
        error.response?.data?.message || "Failed to update social profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // Tab navigation
  const navItems = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security & MFA", icon: "🔒" },
    { id: "account", label: "Account Settings", icon: "⚙️" },
    { id: "activity", label: "Activity Log", icon: "📊" },
    { id: "social", label: "Social Profile", icon: "🌐" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="w-24 h-24 relative overflow-hidden rounded-full">
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {currentUser?.username}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser?.email}
                </p>
                <div className="mt-2">
                  <span className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold">
                    {currentUser && currentUser["roles"][0]}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Update User Credentials
              </h3>
              <form
                className="space-y-4"
                onSubmit={handleSubmit(handleUpdateCredential)}
              >
                {/* Username field */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text"
                    placeholder="Enter your username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    readOnly
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    readOnly
                  />
                </div>

                {/* Password field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="password"
                    placeholder="Set a new password"
                    {...register("password", {
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md flex justify-center items-center transition-all"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Credentials"
                  )}
                </motion.button>
              </form>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Last Login Session
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-gray-600 dark:text-gray-300">
                  Your last login was on:
                </p>
                <p className="text-gray-800 dark:text-white font-semibold mt-1">
                  {loginSession}
                </p>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Multi-Factor Authentication
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      is2faEnabled
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {is2faEnabled ? "Activated" : "Deactivated"}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Two-factor authentication adds an additional layer of security
                  to your account by requiring more than just a password to sign
                  in.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={disabledLoader}
                  onClick={is2faEnabled ? disable2FA : enable2FA}
                  className={`px-4 py-2 rounded-lg font-semibold shadow-md text-white ${
                    is2faEnabled
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  }`}
                >
                  {disabledLoader ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  ) : is2faEnabled ? (
                    "Disable Two-Factor Authentication"
                  ) : (
                    "Enable Two-Factor Authentication"
                  )}
                </motion.button>
              </div>

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                >
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Set Up Two-Factor Authentication
                  </h4>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        1. Scan this QR code with your authenticator app (such
                        as Google Authenticator, Authy, or Microsoft
                        Authenticator).
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        2. Enter the verification code generated by your app
                        below.
                      </p>
                    </div>
                    <div className="flex-1 flex justify-center bg-white p-4 rounded-lg">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="max-w-full h-auto"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={verify2FA}
                      className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md"
                    >
                      {twofaCodeLoader ? "Verifying..." : "Verify Code"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        );

      case "account":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Account Settings
            </h3>

            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Account Status
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage your account activation status
                    </p>
                  </div>
                  {currentUser?.roles?.includes("ADMIN") ? (
                    <Switch
                      checked={accountEnabled}
                      onChange={handleAccountEnabledStatus}
                      inputProps={{ "aria-label": "Account enabled status" }}
                      color="primary"
                    />
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        accountEnabled
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {accountEnabled ? "Enabled" : "Disabled"}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Account Expiry
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Set whether your account has an expiration date
                    </p>
                  </div>
                  {currentUser?.roles?.includes("ADMIN") ? (
                    <Switch
                      checked={accountExpired}
                      onChange={handleAccountExpiryStatus}
                      inputProps={{ "aria-label": "Account expiry status" }}
                      color="primary"
                    />
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        accountExpired
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {accountExpired ? "Expired" : "Not Expired"}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Account Lock
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lock or unlock your account
                    </p>
                  </div>
                  {currentUser?.roles?.includes("ADMIN") ? (
                    <Switch
                      checked={accountLocked}
                      onChange={handleAccountLockStatus}
                      inputProps={{ "aria-label": "Account lock status" }}
                      color="primary"
                    />
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        accountLocked
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {accountLocked ? "Locked" : "Unlocked"}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      Credential Expiry
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Set whether your login credentials expire
                    </p>
                  </div>
                  {currentUser?.roles?.includes("ADMIN") ? (
                    <Switch
                      checked={credentialExpired}
                      onChange={handleCredentialExpiredStatus}
                      inputProps={{ "aria-label": "Credential expiry status" }}
                      color="primary"
                    />
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        credentialExpired
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {credentialExpired ? "Expired" : "Not Expired"}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Credentials Expiration
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Your credentials will expire on:
                  <span className="ml-2 font-medium text-gray-800 dark:text-white">
                    {credentialExpireDate}
                  </span>
                </p>
              </div>

              {!currentUser?.roles?.includes("ADMIN") && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Information
                      </h3>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                        Only administrators can modify account settings. Please
                        contact an administrator if you need to change these
                        settings.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "activity":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Activity Log
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Login Session
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {loginSession}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Success
                  </span>
                </div>
              </div>

              {/* This is placeholder activity - you can replace with real data */}
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Password Changed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {moment()
                        .subtract(5, "days")
                        .format("dddd, D MMMM YYYY, h:mm A")}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    Security
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Profile Updated
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {moment()
                        .subtract(2, "weeks")
                        .format("dddd, D MMMM YYYY, h:mm A")}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    Profile
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      Account Created
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {moment()
                        .subtract(1, "month")
                        .format("dddd, D MMMM YYYY, h:mm A")}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                    Account
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      // Replace the entire social tab case with this simplified version
      case "social":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Social Profile
            </h3>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-20 h-20 relative overflow-hidden rounded-full border-4 border-white/30">
                  {currentUser?.profilePicture ? (
                    <img
                      src={currentUser.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold">
                      {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-bold">{currentUser?.username}</h4>
                  <p className="text-indigo-100 text-sm">
                    {currentUser?.bio || "No bio yet"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-black/10 rounded-lg p-3">
                <Link
                  to="/followers"
                  className="text-center hover:bg-black/10 rounded-md transition-colors p-2"
                >
                  <p className="text-2xl font-bold">{stats?.followers || 0}</p>
                  <p className="text-xs text-indigo-100">Followers</p>
                </Link>
                <Link
                  to="/following"
                  className="text-center hover:bg-black/10 rounded-md transition-colors p-2"
                >
                  <p className="text-2xl font-bold">{stats?.following || 0}</p>
                  <p className="text-xs text-indigo-100">Following</p>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Profile Settings
              </h4>

              <div>
                <label
                  htmlFor="profilePicture"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Profile Picture
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gray-300 dark:bg-gray-600">
                        <span className="text-gray-500 dark:text-gray-400 text-lg">
                          No image
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
                    Upload New Image
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                  {profilePicture && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        setPreviewImage(null);
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others a little about yourself"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Brief description for your profile. Max 160 characters.
                </p>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={handleUpdateSocialProfile}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Update Social Profile"
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] bg-gray-50 dark:bg-gray-900">
      {pageLoader ? (
        <div className="flex flex-col justify-center items-center h-[calc(100vh-74px)]">
          <Blocks
            height="70"
            width="70"
            color="#6366F1"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            visible={true}
          />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Page header */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              User Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* User card */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                      {currentUser?.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          alt={`${currentUser.username}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                          {currentUser?.username?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </div>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                      {currentUser?.username}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div key={`nav-${activeTab}`}>
                  <nav>
                    {navItems.map((item) => (
                      <motion.button
                        key={item.id}
                        whileHover={{
                          scale: 1.02,
                          backgroundColor: "rgba(99, 102, 241, 0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                          activeTab === item.id
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.label}</span>
                      </motion.button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-3">
              <motion.div
                key={`tab-content-${activeTab}`} // More specific key
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
