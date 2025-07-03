// Updated page.jsx with Backend Authentication
"use client"
import React, { useState, createContext, useContext, useEffect } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Menu,
  X,
  Home,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Activity,
  AlertTriangle,
  FileText,
  Wrench,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Globe,
  Play,
  Pause,
  MoreHorizontal,
  Network,
  Server,
  Database,
  Target,
  Zap,
  Info,
  Calendar,
  Hash,
  ArrowUpDown,
  ExternalLink,
  Copy,
  Star,
  Flag,
  ShieldMinus,
  ChevronDown,
  AirVent,
  AnchorIcon
} from 'lucide-react';

// Import authentication system
import { AuthProvider, useAuth, AuthLoadingSpinner } from '@hooks/auth/Auth';

// Import chart components
import ThreatTimeline from '@hooks/components/charts/ThreatTimeline';

// Import dashboard components
import ThreatHunting from '@hooks/components/dashboard/ThreatHunting';
import Configuration from '@hooks/components/dashboard/Configuration';
import Vulnerabilities from '@hooks/components/dashboard/Vulnerabilities';
import AssetsMonitored from '@hooks/components/charts/AssetsMonitored';
import Alerts from '@hooks/components/dashboard/Alerts';

import AIAlertAnalyst from '@hooks/components/dashboard/AIAlertAnalyst';
import SecurityChatbot from '@hooks/components/dashboard/SecurityChatbot';

// Mock data generation functions
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateThreatTimeline = (days = 30) => {
  const data = [];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      critical: randomBetween(0, 5),
      high: randomBetween(2, 15),
      medium: randomBetween(5, 25),
      low: randomBetween(10, 40),
      total: 0
    });
    data[i].total = data[i].critical + data[i].high + data[i].medium + data[i].low;
  }
  return data;
};

const generateAlertDistribution = () => {
  const baseData = [
    { name: 'Malware Detection', count: 1247, severity: 'Critical', color: '#ef4444' },
    { name: 'Phishing Attempts', count: 892, severity: 'High', color: '#f97316' },
    { name: 'Brute Force Attacks', count: 634, severity: 'High', color: '#f59e0b' },
    { name: 'Data Exfiltration', count: 423, severity: 'Critical', color: '#dc2626' },
    { name: 'Suspicious Network Traffic', count: 356, severity: 'Medium', color: '#eab308' },
    { name: 'Unauthorized Access', count: 298, severity: 'High', color: '#ea580c' },
    { name: 'Policy Violations', count: 187, severity: 'Medium', color: '#ca8a04' },
    { name: 'System Anomalies', count: 142, severity: 'Low', color: '#16a34a' }
  ];

  const total = baseData.reduce((sum, item) => sum + item.count, 0);
  return baseData.map(item => ({
    ...item,
    value: Math.round((item.count / total) * 100)
  }));
};

// Navigation Context for routing
const NavigationContext = createContext();

const NavigationProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [breadcrumb, setBreadcrumb] = useState(['Dashboard', 'Overview']);

  const navigate = (view, crumb = []) => {
    setCurrentView(view);
    setBreadcrumb(crumb);
  };

  return (
    <NavigationContext.Provider value={{ currentView, breadcrumb, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Enhanced Login Component with Backend Integration
const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  // const [rememberMe, setRememberMe] = useState(false);
  const { login, loginLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    const result = await login(credentials);
    if (!result.success) {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  // Pre-fill demo credentials for testing
  const handleDemoLogin = () => {
    setCredentials({ username: 'Arif', password: 'password123' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CyberSecure Platform</h1>
          <p className="text-gray-300">Enterprise Security Operations Center</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                placeholder="Enter your username"
                required
                disabled={loginLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                  disabled={loginLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loginLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me and Forget Password
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  disabled={loginLoading}
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                disabled={loginLoading}
              >
                Forgot password?
              </button>
            </div> */}

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loginLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Demo Credentials Helper */}
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 font-medium text-sm mb-1">Demo Account</p>
                  <p className="text-blue-400 text-xs">Username: Arif • Password: password123</p>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                  disabled={loginLoading}
                >
                  Use Demo
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Secure access to your cybersecurity operations</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sidebar Component with User Info
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, getRoleDisplayName } = useAuth();
  const { currentView, navigate } = useNavigation();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      breadcrumb: ['Dashboard', 'Overview'],
      permissions: []
    },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: AlertTriangle,
      breadcrumb: ['Security', 'Incidents'],
      permissions: ['threats:read']
    },
    {
      id: 'threats',
      label: 'Threats',
      icon: ShieldMinus,
      breadcrumb: ['Security', 'Threats'],
      permissions: ['threats:read']
    },
    {
      id: 'vulnerabilities',
      label: 'Vulnerabilities',
      icon: Activity,
      breadcrumb: ['Security', 'Vulnerabilities'],
      permissions: ['vulnerabilities:read']
    },
    {
      id: 'assets',
      label: 'Assets Monitored',
      icon: Server,
      breadcrumb: ['Assets', 'Monitored Assets'],
      permissions: ['assets:read']
    },
    {
      id: 'config',
      label: 'Configuration',
      icon: Wrench,
      breadcrumb: ['System', 'Configuration'],
      permissions: ['admin']
    },
    // {
    //   id: 'aidashboard',
    //   label: 'AI Dashboard',
    //   icon: AnchorIcon,
    //   breadcrumb: ['System', 'AI Dashboard'],
    //   permissions: ['']
    // },
    {
      id: 'aianalysis',
      label: 'AI Analysis',
      icon: AnchorIcon,
      breadcrumb: ['System', 'AI Analysis'],
      permissions: ['']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      breadcrumb: ['Analytics', 'Reports'],
      permissions: ['reports:read']
    },
  ];

  const handleNavigation = (item) => {
    navigate(item.id, item.breadcrumb);
    onClose(); // Close sidebar on mobile after navigation
  };

  const handleLogout = async () => {
    await logout();
  };

  // Check if user has access to navigation item
  const hasAccess = (item) => {
    if (!item.permissions || item.permissions.length === 0) return true;

    return item.permissions.some(permission => {
      if (permission === 'admin') return user?.role === 'admin';
      return user?.permissions?.includes(permission);
    });
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}>

        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">CyberSecure</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const hasItemAccess = hasAccess(item);

              // if (!hasItemAccess) return null; // Uncomment to hide inaccessible items (only admin)

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs text-gray-400 truncate">{getRoleDisplayName()}</p>
            </div>
          </div>

          {/* User status indicators */}
          <div className="flex items-center space-x-2 mb-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-400">Online</span>
            </div>
            {user?.twoFactorEnabled && (
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span className="text-gray-400">2FA</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Enhanced Header Component with User Info
const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, getRoleDisplayName } = useAuth();
  const { breadcrumb } = useNavigation();

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
            {breadcrumb.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                <span className={index === breadcrumb.length - 1 ? 'text-white' : 'text-gray-400'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search threats, assets..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <span className="hidden md:block text-sm">{user?.firstName || user?.username}</span>
              {/* Downside ^ */}
              {/* <ChevronDown className="w-4 h-4" /> */}
            </button>

            {/* Hiding Dropdown menu
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user?.fullName}</p>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                      <p className="text-xs text-blue-400">{getRoleDisplayName()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-gray-400 font-medium">
                    ACCOUNT SETTINGS
                  </div>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors">
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </button>
                </div>
                
                <div className="p-2 border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
};

// Time Period Selector Component
const TimePeriodSelector = ({ selectedPeriod, onPeriodChange, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const periods = [
    { value: 7, label: 'Last 7 days', description: 'Past week' },
    { value: 14, label: 'Last 14 days', description: 'Past 2 weeks' },
    { value: 30, label: 'Last 30 days', description: 'Past month' },
    { value: 60, label: 'Last 60 days', description: 'Past 2 months' },
    { value: 90, label: 'Last 90 days', description: 'Past quarter' },
    { value: 180, label: 'Last 180 days', description: 'Past 6 months' }
  ];

  const currentPeriod = periods.find(p => p.value === selectedPeriod) || periods[2];

  const handlePeriodSelect = (period) => {
    onPeriodChange(period.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{currentPeriod.label}</span>
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-400 px-2 py-1 mb-1">
              SELECT TIME PERIOD
            </div>
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodSelect(period)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${period.value === selectedPeriod
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{period.label}</span>
                  <span className="text-xs opacity-75">{period.description}</span>
                </div>
                {period.value === selectedPeriod && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'threat',
      title: 'Malware detected on Server-001',
      description: 'Trojan.Win32.Agent found in system files',
      time: '2 minutes ago',
      severity: 'critical',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'login',
      title: 'Suspicious login attempt',
      description: 'Multiple failed login attempts from IP 192.168.1.100',
      time: '5 minutes ago',
      severity: 'high',
      icon: Shield
    },
    {
      id: 3,
      type: 'scan',
      title: 'Vulnerability scan completed',
      description: 'Network scan found 3 new vulnerabilities',
      time: '12 minutes ago',
      severity: 'medium',
      icon: Activity
    },
    {
      id: 4,
      type: 'update',
      title: 'Security policies updated',
      description: 'Firewall rules updated successfully',
      time: '1 hour ago',
      severity: 'info',
      icon: CheckCircle
    }
  ];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
              <div className={`p-2 rounded-lg ${activity.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                activity.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  activity.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">{activity.title}</p>
                <p className="text-gray-400 text-xs mt-1">{activity.description}</p>
                <p className="text-gray-500 text-xs mt-2">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Dashboard Overview Component with Interactive Timeline
const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    activeThreats: 12,
    criticalVulns: 8,
    securityScore: 87,
    assetsMonitored: 147
  });

  // Timeline state management
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(30);
  const [threatTimelineData, setThreatTimelineData] = useState([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

  const { navigate } = useNavigation();
  const { user, hasPermission } = useAuth();

  // Generate initial data and alert distribution
  const alertDistributionData = generateAlertDistribution();

  // Load timeline data when period changes
  useEffect(() => {
    const loadTimelineData = async () => {
      setIsLoadingTimeline(true);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const newData = generateThreatTimeline(selectedTimePeriod);
      setThreatTimelineData(newData);
      setIsLoadingTimeline(false);
    };

    loadTimelineData();
  }, [selectedTimePeriod]);

  const handleTimePeriodChange = (newPeriod) => {
    setSelectedTimePeriod(newPeriod);
  };

  const metricCards = [
    {
      title: 'Active Threats',
      value: metrics.activeThreats,
      change: '+3',
      trend: 'up',
      color: 'red',
      icon: AlertTriangle,
      clickable: hasPermission('threats:read'),
      onClick: () => navigate('threats', ['Security', 'Threats'])
    },
    {
      title: 'Critical Vulnerabilities',
      value: metrics.criticalVulns,
      change: '-2',
      trend: 'down',
      color: 'yellow',
      icon: XCircle,
      clickable: hasPermission('vulnerabilities:read'),
      onClick: () => navigate('vulnerabilities', ['Security', 'Vulnerabilities'])
    },
    {
      title: 'Security Score',
      value: `${metrics.securityScore}%`,
      change: '+5%',
      trend: 'up',
      color: 'green',
      icon: CheckCircle,
      clickable: false
    },
    {
      title: 'Assets Monitored',
      value: metrics.assetsMonitored.toLocaleString(),
      change: '+47',
      trend: 'up',
      color: 'blue',
      icon: Activity,
      clickable: hasPermission('assets:read'),
      onClick: () => navigate('assets', ['Assets', 'Monitored Assets'])
    }
  ];

  const handleMetricClick = (metric) => {
    if (metric.clickable && metric.onClick) {
      metric.onClick();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back, {user?.firstName}! Here's your security overview.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-200 ${metric.clickable
                ? 'cursor-pointer hover:border-blue-500 hover:shadow-lg hover:scale-105 transform'
                : ''
                }`}
              onClick={() => handleMetricClick(metric)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.color === 'red' ? 'bg-red-500/20 text-red-400' :
                  metric.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    metric.color === 'green' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                  }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                  <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
                <p className="text-gray-400 text-sm">{metric.title}</p>
                {metric.clickable && (
                  <p className="text-blue-400 text-xs mt-2 flex items-center space-x-1">
                    <span>Click to view details</span>
                    <ExternalLink className="w-3 h-3" />
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-6">
        {/* Interactive Threat Timeline with Period Selector */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Threat Detection Timeline</h3>
              <p className="text-sm text-gray-400 mt-1">
                Monitor threat patterns over time to identify trends and anomalies
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <RefreshCw className={`w-4 h-4 ${isLoadingTimeline ? 'animate-spin' : ''}`} />
                <span>{isLoadingTimeline ? 'Updating...' : 'Live data'}</span>
              </div>
              <TimePeriodSelector
                selectedPeriod={selectedTimePeriod}
                onPeriodChange={handleTimePeriodChange}
                isLoading={isLoadingTimeline}
              />
            </div>
          </div>

          {/* Timeline Chart Container */}
          <div className="relative">
            {isLoadingTimeline && (
              <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center space-x-3 text-white">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading timeline data...</span>
                </div>
              </div>
            )}
            <ThreatTimeline
              data={threatTimelineData}
              title=""
              height={400}
              showTitle={false}
            />
          </div>

          {/* Timeline Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {threatTimelineData.reduce((sum, day) => sum + day.critical, 0)}
              </div>
              <div className="text-sm text-gray-400">Critical Threats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {threatTimelineData.reduce((sum, day) => sum + day.high, 0)}
              </div>
              <div className="text-sm text-gray-400">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {threatTimelineData.reduce((sum, day) => sum + day.medium, 0)}
              </div>
              <div className="text-sm text-gray-400">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {threatTimelineData.reduce((sum, day) => sum + day.low, 0)}
              </div>
              <div className="text-sm text-gray-400">Low Priority</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">CPU Usage</span>
                <span className="text-white">67%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Memory Usage</span>
                <span className="text-white">45%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-300">Network Activity</span>
                <span className="text-white">82%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security Score</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24">
                <div className="w-24 h-24 rounded-full border-8 border-gray-700"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border-8 border-green-500 border-r-transparent animate-pulse" style={{ transform: 'rotate(45deg)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">87</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Firewall</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Antivirus</span>
                <span className="text-green-400">Updated</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Patches</span>
                <span className="text-yellow-400">3 Pending</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
                <Shield className="w-4 h-4" />
                <span>Run Security Scan</span>
              </button>
              <button
                onClick={() => navigate('threats', ['Security', 'Threats'])}
                className="w-full flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>View All Threats</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors">
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors">
                <Settings className="w-4 h-4" />
                <span>System Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder Components for other views
const VulnerabilitiesView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white mb-4">Vulnerabilities</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
      <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">Vulnerability Management</h2>
      <p className="text-gray-400">This section will contain vulnerability scanning and management tools.</p>
    </div>
  </div>
);

const ConfigurationView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white mb-4">Configuration</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
      <Wrench className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">System Configuration</h2>
      <p className="text-gray-400">Configure system settings, security policies, and integrations.</p>
    </div>
  </div>
);

const ReportsView = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white mb-4">Reports</h1>
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
      <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">Security Reports</h2>
      <p className="text-gray-400">Generate and view comprehensive security reports and analytics.</p>
    </div>
  </div>
);

// Main Content Router
const MainContent = () => {
  const { currentView } = useNavigation();

  switch (currentView) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'incidents':
      return <Alerts />;
    case 'threats':
      return <ThreatHunting />;
    case 'vulnerabilities':
      return <Vulnerabilities />;
    case 'config':
      return <Configuration />;
    case 'aianalysis':
      return <AIAlertAnalyst />;
    case 'reports':
      return <ReportsView />;
    case 'assets':
      return <AssetsMonitored />;
    default:
      return <DashboardOverview />;
  }
};

// Main App Component
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <AuthLoadingSpinner />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 lg:ml-0">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="min-h-screen">
              <MainContent />
            </main>
          </div>
        </div>
        <SecurityChatbot/>
      </div>

    </NavigationProvider>

  );
};

// Root Application with Provider
export default function CybersecurityPlatform() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}