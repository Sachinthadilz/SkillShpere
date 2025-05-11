import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import { motion } from "framer-motion"; // Added for animations
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
} from "react-icons/io5";

const Navbar = () => {
  const [headerToggle, setHeaderToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathName = useLocation().pathname;
  const navigate = useNavigate();

  const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } =
    useMyContext();

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

  // Close mobile menu when clicking outside
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [headerToggle]);

  // Close menu when navigating
  useEffect(() => {
    setHeaderToggle(false);
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

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="ml-4 flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-300"
                >
                  <IoLogOutOutline className="text-lg" />
                  <span>Log Out</span>
                </motion.button>
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
