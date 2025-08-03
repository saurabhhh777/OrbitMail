import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAuthStore } from '../../store/userAuthStore';
import { Toaster, toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaApple } from 'react-icons/fa';
import { Lock, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';

const Signin: React.FC = () => {
  const { signin, googleAuth, githubAuth, appleAuth } = userAuthStore();
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
    toast.success('Apple OAuth not configured for development. Please use email/password signin.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <Toaster />
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          {/* Logo/Icon placeholder */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full mb-4">
              <span className="text-gray-400"><Lock size={32} /></span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 text-center">Sign in to your account</h2>
            <p className="text-gray-500 text-sm mt-1 text-center">
              Or{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            {/* Email */}
            <div className="w-full mb-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="text-gray-400" size={18} />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-100 focus:outline-none focus:border-gray-400 text-gray-900 text-sm"
                required
              />
            </div>

            {/* Password */}
            <div className="w-full mb-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-100 focus:outline-none focus:border-gray-400 text-gray-900 text-sm"
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-md py-2 text-[15px] font-semibold mt-2 mb-4 hover:bg-gray-900 transition disabled:bg-gray-400"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center w-full my-2">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-gray-400 text-xs">Or continue with</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          {/* Social buttons */}
          <div className="flex w-full gap-3 justify-center mt-1 mb-3">
            <button
              onClick={handleGoogleAuth}
              className="flex-1 flex justify-center items-center px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
            >
              <FcGoogle size={24} />
            </button>
            <button
              onClick={handleGithubAuth}
              className="flex-1 flex justify-center items-center px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
            >
              <FaGithub size={19} className="text-gray-500" />
            </button>
            <button
              onClick={handleAppleAuth}
              className="flex-1 flex justify-center items-center px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
            >
              <FaApple size={19} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
