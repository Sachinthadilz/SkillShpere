import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/NavBar";
import Footer from "./components/Footer/Footer";
import ContactUs from "./components/ContactUs/ContactUs";
import AboutUs from "./components/AboutUs/AboutUs";
import Landing from "./components/LandingPage/LandingPage";
import Signup from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";
import UserProfile from "./components/Auth/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./components/Admin/Admin";
import AccessDenied from "./components/Auth/AccessDenied";
import NotFound from "./components/NotFound";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminPage={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
