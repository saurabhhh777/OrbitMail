import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

interface DashboardData {
  users: {
    total: number;
    free: number;
    basic: number;
    premium: number;
    recent: number;
  };
  domains: {
    total: number;
    verified: number;
  };
  emails: {
    total: number;
    recent: number;
  };
  revenue: {
    basic: number;
    premium: number;
    total: number;
  };
}

interface User {
  _id: string;
  email: string;
  name?: string;
  subscription: {
    plan: string;
    status: string;
  };
  createdAt: string;
}

interface Domain {
  _id: string;
  domain: string;
  isVerified: boolean;
  userId: {
    email: string;
    name?: string;
  };
  createdAt: string;
}

interface EmailAnalytics {
  period: string;
  startDate: string;
  endDate: string;
  totalEmails: number;
  chartData: Array<{
    date: string;
    total: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [emailAnalytics, setEmailAnalytics] = useState<EmailAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30days');
  const [userFilters, setUserFilters] = useState({
    plan: 'all',
    search: '',
    page: 1
  });
  const [domainFilters, setDomainFilters] = useState({
    verified: 'all',
    search: '',
    page: 1
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/v1/admin/dashboard', {
        withCredentials: true
      });
      setDashboardData(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (userFilters.plan !== 'all') params.append('plan', userFilters.plan);
      if (userFilters.search) params.append('search', userFilters.search);
      params.append('page', userFilters.page.toString());

      const response = await axios.get(`/api/v1/admin/users?${params}`, {
        withCredentials: true
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchDomains = async () => {
    try {
      const params = new URLSearchParams();
      if (domainFilters.verified !== 'all') params.append('verified', domainFilters.verified);
      if (domainFilters.search) params.append('search', domainFilters.search);
      params.append('page', domainFilters.page.toString());

      const response = await axios.get(`/api/v1/admin/domains?${params}`, {
        withCredentials: true
      });
      setDomains(response.data.domains);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to load domains');
    }
  };

  const fetchEmailAnalytics = async () => {
    try {
      const response = await axios.get(`/api/v1/admin/email-analytics?period=${analyticsPeriod}`, {
        withCredentials: true
      });
      setEmailAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching email analytics:', error);
      toast.error('Failed to load email analytics');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardData(),
        fetchUsers(),
        fetchDomains(),
        fetchEmailAnalytics()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [userFilters]);

  useEffect(() => {
    if (activeTab === 'domains') {
      fetchDomains();
    }
  }, [domainFilters]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchEmailAnalytics();
    }
  }, [analyticsPeriod]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, domains, and monitor platform analytics
          </p>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'users', name: 'Users' },
                { id: 'domains', name: 'Domains' },
                { id: 'analytics', name: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.users.total}</p>
                <p className="text-sm text-gray-600">+{dashboardData.users.recent} this month</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Total Domains</h3>
                <p className="text-3xl font-bold text-green-600">{dashboardData.domains.total}</p>
                <p className="text-sm text-gray-600">{dashboardData.domains.verified} verified</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Total Emails</h3>
                <p className="text-3xl font-bold text-purple-600">{dashboardData.emails.total}</p>
                <p className="text-sm text-gray-600">+{dashboardData.emails.recent} this month</p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-orange-600">₹{dashboardData.revenue.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600">₹{dashboardData.revenue.basic.toLocaleString()} Basic + ₹{dashboardData.revenue.premium.toLocaleString()} Premium</p>
              </div>
            </div>

            {/* User Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">User Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Free', value: dashboardData.users.free },
                        { name: 'Basic', value: dashboardData.users.basic },
                        { name: 'Premium', value: dashboardData.users.premium }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <select
                  value={userFilters.plan}
                  onChange={(e) => setUserFilters({...userFilters, plan: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userFilters.search}
                  onChange={(e) => setUserFilters({...userFilters, search: e.target.value})}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.subscription.plan === 'free' ? 'bg-gray-100 text-gray-800' :
                          user.subscription.plan === 'basic' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {user.subscription.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.subscription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Domains Tab */}
        {activeTab === 'domains' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Domain Management</h3>
              
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <select
                  value={domainFilters.verified}
                  onChange={(e) => setDomainFilters({...domainFilters, verified: e.target.value})}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Domains</option>
                  <option value="true">Verified Only</option>
                  <option value="false">Unverified Only</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Search domains..."
                  value={domainFilters.search}
                  onChange={(e) => setDomainFilters({...domainFilters, search: e.target.value})}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Domain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {domains.map((domain) => (
                    <tr key={domain._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {domain.domain}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{domain.userId.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{domain.userId.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          domain.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {domain.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(domain.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Email Analytics</h3>
                <select
                  value={analyticsPeriod}
                  onChange={(e) => setAnalyticsPeriod(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1day">Last 24 Hours</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>
              
              {emailAnalytics && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-blue-800">Total Emails</h4>
                      <p className="text-2xl font-bold text-blue-600">{emailAnalytics.totalEmails}</p>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={emailAnalytics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 