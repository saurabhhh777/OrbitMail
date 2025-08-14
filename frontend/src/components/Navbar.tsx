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
        isDarkMode 
          ? "bg-[#0A0A0A] text-[#FAFAFA] border-[#262626]" 
          : "bg-[#FFFFFF] text-[#0A0A0A] border-[#E5E5E5]"
      } flex items-center justify-between px-8 lg:px-16 py-6 shadow-sm border-b transition-colors duration-200`}
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
          className={`hover:text-[#3B82F6] transition-colors font-medium ${
            isDarkMode ? "text-[#D4D4D4] hover:text-[#3B82F6]" : "text-[#404040] hover:text-[#3B82F6]"
          }`}
        >
          Solution
        </Link>
        <Link
          to="/pricing"
          className={`hover:text-[#3B82F6] transition-colors font-medium ${
            isDarkMode ? "text-[#D4D4D4] hover:text-[#3B82F6]" : "text-[#404040] hover:text-[#3B82F6]"
          }`}
        >
          Pricing
        </Link>
        <Link
          to="/docs"
          className={`hover:text-[#3B82F6] transition-colors font-medium ${
            isDarkMode ? "text-[#D4D4D4] hover:text-[#3B82F6]" : "text-[#404040] hover:text-[#3B82F6]"
          }`}
        >
          Docs
        </Link>
        <Link
          to="/support"
          className={`hover:text-[#3B82F6] transition-colors font-medium ${
            isDarkMode ? "text-[#D4D4D4] hover:text-[#3B82F6]" : "text-[#404040] hover:text-[#3B82F6]"
          }`}
        >
          Support
        </Link>
      </div>

      <div className="flex items-center space-x-4 font-poppins">
        {Authuser ? (
          <>
            <Link
              to="/dashboard"
              className={`hover:text-[#3B82F6] transition-colors font-medium ${
                isDarkMode ? "text-[#D4D4D4] hover:text-[#3B82F6]" : "text-[#404040] hover:text-[#3B82F6]"
              }`}
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className={`hover:text-[#3B82F6] transition-colors font-medium ${
                isDarkMode ? "text-[#D4D4D4] hover:text-[#3B82F6]" : "text-[#404040] hover:text-[#3B82F6]"
              }`}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signin"
              className={`hover:text-[#3B82F6] transition-colors font-medium ${
                isDarkMode ? "text-[#D4D4D4] hover:text-[#3B82F6]" : "text-[#404040] hover:text-[#3B82F6]"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-2 rounded-lg transition-colors font-medium border ${
                isDarkMode 
                  ? "border-[#525252] text-[#D4D4D4] hover:bg-[#262626]" 
                  : "border-[#D4D4D4] text-[#404040] hover:bg-[#F5F5F5]"
              }`}
            >
              Sign Up
            </Link>
          </>
        )}
        <div className="flex justify-center">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode 
                ? "hover:bg-[#262626] text-[#D4D4D4]" 
                : "hover:bg-[#F5F5F5] text-[#404040]"
            }`}
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
