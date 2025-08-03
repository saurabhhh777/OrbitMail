import Logo from "../assets/android-chrome-192x192.png";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { userAuthStore } from "../../store/userAuthStore";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, Authuser, isLogined, logout } = userAuthStore();
  
  console.log("Navbar - Authuser:", Authuser);
  console.log("Navbar - isLogined:", isLogined);

  return (
    <nav
      className={`${
        isDarkMode ? "bg-[#131313] text-white" : "bg-white text-black"
      } flex items-center justify-between px-8 lg:px-16 py-6 shadow-sm`}
    >
      <Link to="/">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img
              src={Logo}
              alt="OrbitMail Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-2xl font-bold font-poppins">OrbitMail</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center space-x-8 font-poppins">
        <Link
          to="/solution"
          className="hover:text-primary transition-colors font-medium"
        >
          Solution
        </Link>
        <Link
          to="/pricing"
          className="hover:text-primary transition-colors font-medium"
        >
          Pricing
        </Link>
        <Link
          to="/docs"
          className="hover:text-primary transition-colors font-medium"
        >
          Docs
        </Link>
        <Link
          to="/support"
          className="hover:text-primary transition-colors font-medium"
        >
          Support
        </Link>
      </div>

      <div className="flex items-center space-x-4 font-poppins">
        {Authuser ? (
          <>
            <Link
              to="/dashboard"
              className="hover:text-primary transition-colors font-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="hover:text-primary transition-colors font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className="hover:text-primary transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 rounded-lg transition-colors font-medium border border-current"
            >
              Sign Up
            </Link>
            <Link
              to="/admin/login"
              className="text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              Admin
            </Link>
          </>
        )}
        <div className="flex justify-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
