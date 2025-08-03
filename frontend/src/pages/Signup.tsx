import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaApple } from 'react-icons/fa';
import {Link,useNavigate} from "react-router-dom";
import { userAuthStore } from '../../store/userAuthStore';
import {Toaster,toast} from "react-hot-toast";
import Navbar from '../components/Navbar';


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {signup, googleAuth, githubAuth, appleAuth} = userAuthStore();
  const [isLoading,setIsLoading] = useState(false);
  const navigate = useNavigate();
  


  const [formdata,setFormdata] = useState({
    email:"",
    password:"",
    confirmpassword:""
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setFormdata((data)=>({...data,[name]:value}));
  }

  const handleSignup = async()=>{
    try {
      // Frontend validation
      if (!formdata.email || !formdata.password || !formdata.confirmpassword) {
        toast.error("All fields are required");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formdata.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Password validation
      if (formdata.password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }

      // Password confirmation
      if (formdata.password !== formdata.confirmpassword) {
        toast.error("Passwords do not match");
        return;
      }

      setIsLoading(true);
      const res = await signup(formdata);
      
      if(res){
        console.log("handle Signup");
        toast.success("Signup Successfully");
        navigate("/dashboard");
      }
      
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error instanceof Error && error.message
          ? error.message
          : "Error Occured"
      );
    }
    finally{
      setIsLoading(false);
    }
  }

  const handleGoogleAuth = async () => {
    toast.success('Google OAuth not configured for development. Please use email/password signup.');
  };

  const handleGithubAuth = async () => {
    toast.success('GitHub OAuth not configured for development. Please use email/password signup.');
  };

  const handleAppleAuth = async () => {
    toast.success('Apple OAuth not configured for development. Please use email/password signup.');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">

      <Toaster/>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* Logo/Icon placeholder */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full mb-4">
            <span className="text-gray-400"><Lock size={32} /></span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Sign up to create your account</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">Please sign up to create your account</p>
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
            placeholder="Password"
            name="password"
            value={formdata.password}
            onChange={handleChange}
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

        {/* Confirm Password */}
        <div className="w-full mb-3 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="text-gray-400" size={18} />
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmpassword"
            value={formdata.confirmpassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="block w-full pl-10 pr-10 py-2 rounded-md border border-gray-200 bg-gray-100 focus:outline-none focus:border-gray-400 text-gray-900 text-sm"
          />
          <button
            type="button"
            className="absolute right-2 inset-y-0 flex items-center px-2 text-gray-400"
            onClick={() => setShowConfirmPassword((v) => !v)}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-black text-white rounded-md py-2 text-[15px] font-semibold mt-2 mb-4 hover:bg-gray-900 transition"
        >
          Sign Up
          {isLoading && ""}
        </button>

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

        {/* Sign in prompt */}
        <div className="text-gray-500 text-xs text-center mt-2">
          Already have an account?{' '}
          <Link to={"/signin"} className='text-gray-900 font-medium hover:underline'>
            Sign In
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Signup;
