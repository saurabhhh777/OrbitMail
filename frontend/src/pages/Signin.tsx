import { Mail, Lock, Eye, EyeOff, Facebook, Apple } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { userAuthStore } from '../../store/userAuthStore';
import { Toaster, toast } from 'react-hot-toast';

const Signin = () => {
  const { signin } = userAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((data) => ({
      ...data, [name]: value
    }));
  };

  const handleSignin = async () => {
    try {
      setIsLoading(true);
      const res = await Signin(formdata);

      if (res) {
        toast.success("Login Successfully");
        navigate("/admin");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      toast.error("Error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 justify-center items-center">
      <Toaster />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* Logo/Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full mb-4">
            <Lock size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Sign in to continue</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">Please sign in to start your rental application</p>
        </div>

        {/* Email */}
        <div className="w-full mb-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="text-gray-400" size={18} />
          </div>
          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={handleChange}
            placeholder="Email"
            className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-100 focus:outline-none focus:border-gray-400 text-gray-900 text-sm"
          />
        </div>

        {/* Password */}
        <div className="w-full mb-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="text-gray-400" size={18} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formdata.password}
            onChange={handleChange}
            placeholder="Password"
            className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-200 bg-gray-100 focus:outline-none focus:border-gray-400 text-gray-900 text-sm"
          />
          <button
            type="button"
            className="absolute right-2 inset-y-0 flex items-center px-2 text-gray-400"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Sign In Button */}
        <button
          onClick={handleSignin}
          disabled={isLoading}
          className="w-full bg-black text-white rounded-md py-2 text-[15px] font-semibold mt-2 mb-4 hover:bg-gray-900 transition"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="flex items-center w-full my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-3 text-gray-400 text-xs">Or continue with</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        {/* Social Buttons */}
        <div className="flex w-full gap-3 justify-center mt-1 mb-3">
          <button className="flex-1 flex justify-center items-center px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50">
            <FcGoogle size={24} />
          </button>
          <button className="flex-1 flex justify-center items-center px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50">
            <Facebook size={19} className="text-gray-500" />
          </button>
          <button className="flex-1 flex justify-center items-center px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50">
            <Apple size={19} className="text-gray-500" />
          </button>
        </div>

        {/* Sign Up Prompt */}
        <div className="text-gray-500 text-xs text-center mt-2">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gray-900 font-medium hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
