import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { Blocks } from "react-loader-spinner";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const UserDetails = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const [loading, setLoading] = useState(false);
  const [updateRoleLoader, setUpdateRoleLoader] = useState(false);
  const [passwordLoader, setPasswordLoader] = useState(false);

  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/user/${userId}`);
      setUser(response.data);

      setSelectedRole(response.data.role?.roleName || "");
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching user details", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    //if user exist set the value by using the setValue function provided my react-hook-form
    if (user && Object.keys(user).length > 0) {
      setValue("username", user.userName);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/admin/roles");
      setRoles(response.data);
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error("Error fetching roles", err);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
  }, [fetchUserDetails, fetchRoles]);

  //set the selected role
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  //handle update role
  const handleUpdateRole = async () => {
    setUpdateRoleLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("roleName", selectedRole);

      await api.put(`/admin/update-role`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      fetchUserDetails();
      toast.success("Update role successful");
    } catch (err) {
      console.log(err);
      toast.error("Update Role Failed");
    } finally {
      setUpdateRoleLoader(false);
    }
  };

  //handle update the password
  const handleSavePassword = async (data) => {
    setPasswordLoader(true);
    const newPassword = data.password;

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);
      formData.append("password", newPassword);

      await api.put(`/admin/update-password`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      setIsEditingPassword(false);
      setValue("password", "");
      //fetchUserDetails();
      toast.success("password update success");
    } catch (err) {
      toast.error("Error updating password " + err.response.data);
    } finally {
      setPasswordLoader(false);
    }
  };

  const handleCheckboxChange = async (e, updateUrl) => {
    const { name, checked } = e.target;

    let message = null;
    if (name === "lock") {
      message = "Update Account Lock status Successful";
    } else if (name === "expire") {
      message = "Update Account Expiry status Successful";
    } else if (name === "enabled") {
      message = "Update Account Enabled status Successful";
    } else if (name === "credentialsExpire") {
      message = "Update Account Credentials Expired status Successful";
    }

    try {
      const formData = new URLSearchParams();
      formData.append("userId", userId);

      formData.append(name, checked);

      await api.put(updateUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      fetchUserDetails();
      toast.success(message);
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(`Error updating ${name}:`);
    } finally {
      message = null;
    }
  };

  // Custom Input Field component to replace the imported one
  const CustomInputField = ({
    label,
    id,
    type,
    placeholder,
    required,
    readOnly,
    autoFocus,
    min,
  }) => {
    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors[id]
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          readOnly={readOnly}
          autoFocus={autoFocus}
          {...register(id, {
            required: required ? `${label} is required` : false,
            minLength: min
              ? { value: min, message: `Minimum length should be ${min}` }
              : undefined,
          })}
        />
        {errors[id] && (
          <p className="mt-1 text-sm text-red-500">{errors[id].message}</p>
        )}
      </div>
    );
  };

  // Custom Button component to replace the imported one
  const CustomButton = ({ children, type = "button", onClick, className }) => {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type={type}
        onClick={onClick}
        className={`transition-all ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  // Custom Error Component to replace the imported one
  const CustomError = ({ message }) => {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-10 px-6">
      {/* Go Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto mb-4"
      >
        <CustomButton
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Go Back to User List
        </CustomButton>
      </motion.div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-72">
          <span>
            <Blocks
              height="70"
              width="70"
              color="#6366F1"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              visible={true}
            />
          </span>
          <span className="mt-4 text-gray-600 dark:text-gray-300">
            Please wait...
          </span>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-8 shadow-lg rounded-xl bg-white dark:bg-gray-800 overflow-hidden"
          >
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4">
                Profile Information
              </h1>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(handleSavePassword)}
              >
                <CustomInputField
                  label="UserName"
                  required
                  id="username"
                  type="text"
                  placeholder="Enter your UserName"
                  readOnly
                />
                <CustomInputField
                  label="Email"
                  required
                  id="email"
                  type="text"
                  placeholder="Enter your Email"
                  readOnly
                />
                <CustomInputField
                  label="Password"
                  required
                  autoFocus={isEditingPassword}
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  readOnly={!isEditingPassword}
                  min={6}
                />
                {!isEditingPassword ? (
                  <CustomButton
                    type="button"
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white mb-0 w-fit px-6 py-3 rounded-lg font-medium"
                  >
                    Click To Edit Password
                  </CustomButton>
                ) : (
                  <div className="flex items-center gap-3">
                    <CustomButton
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white mb-0 w-fit px-6 py-3 rounded-lg font-medium"
                    >
                      {passwordLoader ? "Loading..." : "Save"}
                    </CustomButton>
                    <CustomButton
                      type="button"
                      onClick={() => setIsEditingPassword(!isEditingPassword)}
                      className="bg-red-600 hover:bg-red-700 text-white mb-0 w-fit px-6 py-3 rounded-lg font-medium"
                    >
                      Cancel
                    </CustomButton>
                  </div>
                )}
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto shadow-lg rounded-xl bg-white dark:bg-gray-800 overflow-hidden"
          >
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4">
                Admin Actions
              </h1>

              <div className="py-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-gray-700 dark:text-gray-300 font-medium">
                    Role:
                  </label>
                  <select
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 uppercase bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={selectedRole}
                    onChange={handleRoleChange}
                  >
                    {roles.map((role) => (
                      <option
                        className="uppercase"
                        key={role.roleId}
                        value={role.roleName}
                      >
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
                <CustomButton
                  onClick={handleUpdateRole}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {updateRoleLoader ? "Loading..." : "Update Role"}
                </CustomButton>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      className="w-5 h-5 text-indigo-600"
                      type="checkbox"
                      id="lock"
                      name="lock"
                      checked={!user?.accountNonLocked}
                      onChange={(e) =>
                        handleCheckboxChange(e, "/admin/update-lock-status")
                      }
                    />
                    <label
                      htmlFor="lock"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Lock Account
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      className="w-5 h-5 text-indigo-600"
                      type="checkbox"
                      id="expire"
                      name="expire"
                      checked={!user?.accountNonExpired}
                      onChange={(e) =>
                        handleCheckboxChange(e, "/admin/update-expiry-status")
                      }
                    />
                    <label
                      htmlFor="expire"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Account Expiry
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      className="w-5 h-5 text-indigo-600"
                      type="checkbox"
                      id="enabled"
                      name="enabled"
                      checked={user?.enabled}
                      onChange={(e) =>
                        handleCheckboxChange(e, "/admin/update-enabled-status")
                      }
                    />
                    <label
                      htmlFor="enabled"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Account Enabled
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      className="w-5 h-5 text-indigo-600"
                      type="checkbox"
                      id="credentialsExpire"
                      name="credentialsExpire"
                      checked={!user?.credentialsNonExpired}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          `/admin/update-credentials-expiry-status?userId=${userId}&expire=${user?.credentialsNonExpired}`
                        )
                      }
                    />
                    <label
                      htmlFor="credentialsExpire"
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      Credentials Expired
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
