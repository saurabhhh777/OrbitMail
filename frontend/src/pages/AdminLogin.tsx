import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';

const AdminLogin: React.FC = () => {
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
      const response = await fetch('/api/v1/admin/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Admin login successful!');
        setTimeout(() => {
          navigate('/admin');
        }, 100);
      } else {
        toast.error(data.message || 'Admin login failed');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast.error('Admin login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <Toaster />
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
          {/* Logo/Icon placeholder */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 flex items-center justify-center bg-red-100 rounded-full mb-4">
              <span className="text-red-500"><Lock size={32} /></span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 text-center">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1 text-center">
              Access admin dashboard
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
                placeholder="Admin Email"
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
                placeholder="Admin Password"
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 bg-gray-100 focus:outline-none focus:border-gray-400 text-gray-900 text-sm"
                required
              />
            </div>

            {/* Admin Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white rounded-md py-2 text-[15px] font-semibold mt-2 mb-4 hover:bg-red-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          {/* Back to regular login */}
          <div className="text-center">
            <Link to="/signin" className="text-blue-600 hover:text-blue-500 text-sm">
              ← Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 