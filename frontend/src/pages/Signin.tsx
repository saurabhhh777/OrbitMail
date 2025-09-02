import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthStore } from '../../store/userAuthStore';
import { Toaster, toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaApple } from 'react-icons/fa';
import { Lock, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';

const Signin: React.FC = () => {
  const { signin, googleAuth, githubAuth, appleAuth, isDarkMode } = userAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signin(formData);
      console.log("Signin response:", response);
      
      if (response?.data?.success) {
        toast.success('Signed in successfully!');
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 100);
      } else {
        toast.error('Sign in failed. Please try again.');
      }
    } catch (error: any) {
      console.log("Signin error:", error);
      toast.error(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    toast.success('Google OAuth not configured for development. Please use email/password signin.');
  };

  const handleGithubAuth = async () => {
    toast.success('GitHub OAuth not configured for development. Please use email/password signin.');
  };

  const handleAppleAuth = async () => {
    toast.success('Apple OAuth not configured for development. Please use email/password signup.');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <Toaster />
        <div className={`w-full max-w-sm rounded-2xl shadow-xl p-8 flex flex-col items-center transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 shadow-gray-900/50' 
            : 'bg-white shadow-xl'
        }`}>
          {/* Logo/Icon placeholder */}
          <div className="flex flex-col items-center mb-6">
            <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-400'}`}>
                <Lock size={32} />
              </span>
            </div>
            <h2 className={`text-2xl font-semibold text-center transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Sign in to your account
            </h2>
            <p className={`text-sm mt-1 text-center transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Or{' '}
              <Link to="/signup" className={`font-medium hover:underline transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}>
                create a new account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            {/* Email */}
            <div className="w-full mb-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className={`block w-full pl-10 pr-3 py-2 rounded-md border transition-all duration-300 focus:outline-none text-sm ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'border-gray-200 bg-gray-100 text-gray-900 focus:border-gray-400'
                }`}
                required
              />
            </div>

            {/* Password */}
            <div className="w-full mb-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className={`block w-full pl-10 pr-3 py-2 rounded-md border transition-all duration-300 focus:outline-none text-sm ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                    : 'border-gray-200 bg-gray-100 text-gray-900 focus:border-gray-400'
                }`}
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-md py-2 text-[15px] font-semibold mt-2 mb-4 transition-all duration-300 ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600'
                  : 'bg-black text-white hover:bg-gray-900 disabled:bg-gray-400'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full my-2">
            <div className={`flex-grow h-px transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`} />
            <span className={`px-3 text-xs transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              Or continue with
            </span>
            <div className={`flex-grow h-px transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`} />
          </div>

          {/* Social buttons */}
          <div className="flex w-full gap-3 justify-center mt-1 mb-3">
            <button
              onClick={handleGoogleAuth}
              className={`flex-1 flex justify-center items-center px-3 py-2 rounded-md border transition-all duration-300 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <FcGoogle size={24} />
            </button>
            <button
              onClick={handleGithubAuth}
              className={`flex-1 flex justify-center items-center px-3 py-2 rounded-md border transition-all duration-300 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <FaGithub size={19} className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`} />
            </button>
            <button
              onClick={handleAppleAuth}
              className={`flex-1 flex justify-center items-center px-3 py-2 rounded-md border transition-all duration-300 ${
                isDarkMode
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <FaApple size={19} className={`transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-500'
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
