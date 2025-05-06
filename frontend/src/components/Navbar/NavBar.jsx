import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import {
  IoMenu,
  IoClose,
  IoPersonCircleOutline,
  IoLogOutOutline,
  IoHomeOutline,
  IoInformationCircleOutline,
  IoMailOutline,
  IoShieldOutline,
  IoCompassOutline,
  IoChevronDownOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";

const Navbar = () => {
  const [headerToggle, setHeaderToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin, currentUser } =
    useMyContext();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("auth/notifications");
      setNotifications(response.data);
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbarElement = document.getElementById("navbar-content");
      if (
        headerToggle &&
        navbarElement &&
        !navbarElement.contains(event.target) &&
        !document.getElementById("menu-toggle").contains(event.target)
      ) {
        setHeaderToggle(false);
      }

      // Close dropdown when clicking outside
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      // Close notifications when clicking outside
      if (
        notificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [headerToggle, dropdownOpen, notificationsOpen]);

  // Close menu when navigating
  useEffect(() => {
    setHeaderToggle(false);
    setDropdownOpen(false);
    setNotificationsOpen(false);
  }, [pathName]);

  const handleLogout = () => {
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("USER");
    localStorage.removeItem("CSRF_TOKEN");
    localStorage.removeItem("IS_ADMIN");
    setToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    navigate("/login");
  };

  const NavItem = ({ to, icon, label, active }) => (
    <Link to={to}>
      <motion.li
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 py-2 px-4 rounded-md transition-all duration-300 ${
          active
            ? "font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        {icon}
        <span>{label}</span>
      </motion.li>
    </Link>
  );

  // Profile dropdown component
  const ProfileDropdown = () => (
    <div ref={dropdownRef} className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
          if (notificationsOpen) setNotificationsOpen(false);
        }}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      >
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-indigo-500">
          {/* Use currentUser.profilePic if available, otherwise show default avatar */}
          {currentUser?.profilePicture ? (
            <img
              src={currentUser.profilePicture}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {currentUser?.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>
        <IoChevronDownOutline
          className={`transition-transform duration-300 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
          >
            <Link to="/profile">
              <motion.div
                whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <IoPersonCircleOutline className="text-lg" />
                <span>Profile</span>
              </motion.div>
            </Link>

            {isAdmin && (
              <Link to="/admin/users">
                <motion.div
                  whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <IoShieldOutline className="text-lg" />
                  <span>Admin Dashboard</span>
                </motion.div>
              </Link>
            )}

            <motion.div
              whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <IoLogOutOutline className="text-lg" />
              <span>Log Out</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Notifications dropdown component
  const NotificationsDropdown = () => {
    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    const handleMarkAllAsRead = async () => {
      try {
        await api.put("auth/notifications/read-all");
        fetchNotifications(); // Refresh notifications after marking as read
        toast.success("All notifications marked as read");
      } catch (error) {
        toast.error("Failed to mark notifications as read");
        console.error("Error marking notifications as read:", error);
      }
    };

    const handleNotificationClick = async (id) => {
      try {
        await api.put(`auth/notifications/${id}/read`);
        fetchNotifications(); // Refresh after marking individual notification as read
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    };

    return (
      <div ref={notificationsRef} className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setNotificationsOpen(!notificationsOpen);
            if (dropdownOpen) setDropdownOpen(false);
          }}
          className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 relative"
          aria-label="Notifications"
        >
          <IoNotificationsOutline className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {notificationsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-medium">Notifications</h3>
                {notifications.length > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      whileHover={{
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                      }}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`p-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                        !notification.isRead
                          ? "bg-indigo-50 dark:bg-indigo-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            !notification.isRead
                              ? "bg-indigo-500"
                              : "bg-gray-300 dark:bg-gray-600"
                          } mr-2`}
                        ></div>
                        <div>
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No notifications yet
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <header
      className={`h-16 lg:h-20 z-50 text-gray-800 dark:text-gray-200 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900"
      } transition-all duration-300 sticky top-0`}
    >
      <div className="max-w-7xl mx-auto h-full">
        <nav className="px-4 sm:px-6 lg:px-8 flex w-full h-full items-center justify-between">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h3 className="font-poppins text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SkillSphere
              </h3>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-1">
            <NavItem
              to="/"
              icon={<IoHomeOutline className="text-lg" />}
              label="Home"
              active={pathName === "/"}
            />
            <NavItem
              to="/contact"
              icon={<IoMailOutline className="text-lg" />}
              label="Contact"
              active={pathName === "/contact"}
            />
            <NavItem
              to="/about"
              icon={<IoInformationCircleOutline className="text-lg" />}
              label="About"
              active={pathName === "/about"}
            />

            {token ? (
              <>
                <NavItem
                  to="/explore"
                  icon={<IoCompassOutline className="text-lg" />}
                  label="Explore"
                  active={pathName === "/explore"}
                />

                {/* Notifications Dropdown */}
                <div className="ml-2">
                  <NotificationsDropdown />
                </div>

                {/* Profile Dropdown */}
                <div className="ml-2">
                  <ProfileDropdown />
                </div>
              </>
            ) : (
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-md transition-all duration-300"
                >
                  Sign Up
                </motion.button>
              </Link>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <motion.button
            id="menu-toggle"
            whileTap={{ scale: 0.9 }}
            onClick={() => setHeaderToggle(!headerToggle)}
            className="lg:hidden block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {headerToggle ? (
              <IoClose className="text-2xl" />
            ) : (
              <IoMenu className="text-2xl" />
            )}
          </motion.button>
        </nav>
      </div>

      {/* Mobile Navigation Overlay */}
      {headerToggle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setHeaderToggle(false)}
        />
      )}

      {/* Mobile Navigation */}
      <motion.div
        id="navbar-content"
        initial={{ x: "100%" }}
        animate={{ x: headerToggle ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-16 right-0 bottom-0 w-3/4 max-w-sm z-50 bg-white dark:bg-gray-900 shadow-xl lg:hidden overflow-y-auto"
      >
        <div className="flex flex-col p-4 space-y-2">
          {/* User info section for mobile */}
          {token && currentUser && (
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 mb-2">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-500">
                {currentUser?.profilePicture ? (
                  <img
                    src={currentUser.profilePicture}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {currentUser?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{currentUser.name || "User"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentUser.email || ""}
                </p>
              </div>
            </div>
          )}

          <NavItem
            to="/"
            icon={<IoHomeOutline className="text-lg" />}
            label="Home"
            active={pathName === "/"}
          />
          <NavItem
            to="/contact"
            icon={<IoMailOutline className="text-lg" />}
            label="Contact"
            active={pathName === "/contact"}
          />
          <NavItem
            to="/about"
            icon={<IoInformationCircleOutline className="text-lg" />}
            label="About"
            active={pathName === "/about"}
          />

          {token ? (
            <>
              <NavItem
                to="/explore"
                icon={<IoCompassOutline className="text-lg" />}
                label="Explore"
                active={pathName === "/explore"}
              />
              <NavItem
                to="/profile"
                icon={<IoPersonCircleOutline className="text-lg" />}
                label="Profile"
                active={pathName === "/profile"}
              />

              {isAdmin && (
                <NavItem
                  to="/admin/users"
                  icon={<IoShieldOutline className="text-lg" />}
                  label="Admin"
                  active={pathName.startsWith("/admin")}
                />
              )}

              {/* Add Notifications section for mobile */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <IoNotificationsOutline className="text-lg" />
                    Notifications
                  </h3>
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications.filter((n) => !n.isRead).length}
                    </span>
                  )}
                </div>
                <div className="px-4 py-2 text-sm">
                  {loading ? (
                    <div className="text-center py-2">
                      <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto">
                      {notifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                          className={`mb-2 p-2 rounded-md cursor-pointer ${
                            !notification.isRead
                              ? "bg-indigo-50 dark:bg-indigo-900/20"
                              : ""
                          }`}
                        >
                          <p className="font-medium text-xs">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>
                        </div>
                      ))}
                      {notifications.length > 3 && (
                        <Link
                          to="/notifications"
                          className="text-xs text-indigo-600 hover:underline block text-center mt-1"
                        >
                          View all notifications
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 italic">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-300"
                >
                  <IoLogOutOutline className="text-lg" />
                  <span>Log Out</span>
                </motion.button>
              </div>
            </>
          ) : (
            <div className="pt-4">
              <Link to="/signup" className="block w-full">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-md transition-all duration-300"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
