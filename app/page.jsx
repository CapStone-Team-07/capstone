// New Try Integrating ThreatHunting
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
  Flag
} from 'lucide-react';

// Import chart components
import ThreatTimeline from '@hooks/components/charts/ThreatTimeline';
import AlertDistribution from '@hooks/components/charts/AlertDistribution';

// Import dashboard components
import ThreatHunting from '@hooks/components/dashboard/ThreatHunting';
import Configuration from '@hooks/components/dashboard/Configuration';
import Vulnerabilities from '@hooks/components/dashboard/Vulnerabilities';

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

// Generate threat hunting data | Fetching from db.json
// const generateThreatHuntingData = () => {
//   const severities = ['Critical', 'High', 'Medium', 'Low'];
//   const categories = ['Malware', 'Phishing', 'Brute Force', 'Data Exfiltration', 'Insider Threat', 'Advanced Persistent Threat', 'Ransomware', 'DDoS'];
//   const statuses = ['Active', 'Investigating', 'Contained', 'Resolved', 'False Positive'];
//   const sources = ['Firewall', 'IDS/IPS', 'Endpoint Detection', 'Email Security', 'Network Monitor', 'SIEM', 'Threat Intel'];
//   const countries = ['United States', 'China', 'Russia', 'Germany', 'United Kingdom', 'France', 'India', 'Brazil'];
//   const attackTypes = ['SQL Injection', 'Cross-Site Scripting', 'Buffer Overflow', 'Man-in-the-Middle', 'Zero-Day Exploit', 'Social Engineering'];

//   const threats = [];
//   for (let i = 0; i < 150; i++) {
//     const severity = severities[Math.floor(Math.random() * severities.length)];
//     const category = categories[Math.floor(Math.random() * categories.length)];
//     const status = statuses[Math.floor(Math.random() * statuses.length)];
//     const source = sources[Math.floor(Math.random() * sources.length)];
//     const country = countries[Math.floor(Math.random() * countries.length)];
//     const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    
//     const baseTime = Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000);
//     const riskScore = Math.floor(Math.random() * 100) + 1;
    
//     threats.push({
//       id: `THR-${String(i + 1).padStart(6, '0')}`,
//       title: `${category} - ${attackType}`,
//       description: `Suspicious ${category.toLowerCase()} activity detected from ${country}`,
//       severity,
//       category,
//       status,
//       source,
//       riskScore,
//       sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
//       targetIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
//       country,
//       timestamp: new Date(baseTime).toISOString(),
//       lastActivity: new Date(baseTime + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
//       affectedAssets: Math.floor(Math.random() * 50) + 1,
//       confidence: Math.floor(Math.random() * 40) + 60,
//       attackVector: attackType,
//       protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP', 'SSH'][Math.floor(Math.random() * 6)],
//       port: Math.floor(Math.random() * 65535) + 1,
//       iocs: Math.floor(Math.random() * 20) + 1,
//       mitreTactics: ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion'][Math.floor(Math.random() * 5)],
//       analyst: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'][Math.floor(Math.random() * 5)],
//       starred: Math.random() > 0.8,
//       flagged: Math.random() > 0.7
//     });
//   }
//   return threats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
// };

// Authentication Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      setIsAuthenticated(true);
      setUser({
        name: 'Security Administrator',
        email: 'admin@cybersec.com',
        role: 'SOC Manager',
        avatar: '👤'
      });
      setLoading(false);
      return { success: true };
    }
    
    setLoading(false);
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
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

// Login Component
const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(credentials);
    if (!result.success) {
      setError(result.error);
    }
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
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                placeholder="Enter your username"
                required
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 text-blue-300 text-sm">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Username: <span className="font-mono">admin</span></p>
              <p>Password: <span className="font-mono">admin</span></p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
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
          </div>
        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Secure access to your cybersecurity operations</p>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component with Navigation
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { currentView, navigate } = useNavigation();

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home,
      breadcrumb: ['Dashboard', 'Overview']
    },
    { 
      id: 'threats', 
      label: 'Threat Hunting', 
      icon: AlertTriangle,
      breadcrumb: ['Security', 'Threat Hunting']
    },
    { 
      id: 'vulnerabilities', 
      label: 'Vulnerabilities', 
      icon: Activity,
      breadcrumb: ['Security', 'Vulnerabilities']
    },
    { 
      id: 'config', 
      label: 'Configuration', 
      icon: Wrench,
      breadcrumb: ['System', 'Configuration']
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText,
      breadcrumb: ['Analytics', 'Reports']
    },
  ];

  const handleNavigation = (item) => {
    navigate(item.id, item.breadcrumb);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
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
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
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
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
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

// Header Component with Dynamic Breadcrumb
const Header = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();
  const { breadcrumb } = useNavigation();

  const notifications = [
    { id: 1, type: 'critical', message: 'Critical vulnerability detected in web server', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Unusual login activity from new location', time: '15 min ago' },
    { id: 3, type: 'info', message: 'Weekly security report is ready', time: '1 hour ago' },
  ];

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

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-700">
                  <h3 className="font-medium text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'critical' ? 'bg-red-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden md:block text-sm text-white">{user?.name}</span>
          </div>
        </div>
      </div>
    </header>
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
              <div className={`p-2 rounded-lg ${
                activity.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
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

// Dashboard Overview Component
const DashboardOverview = () => {
  const [metrics, setMetrics] = useState({
    activeThreats: 12,
    criticalVulns: 8,
    securityScore: 87,
    assetsMonitored: 1247
  });

  const threatTimelineData = generateThreatTimeline(30);
  const alertDistributionData = generateAlertDistribution();

  const metricCards = [
    {
      title: 'Active Threats',
      value: metrics.activeThreats,
      change: '+3',
      trend: 'up',
      color: 'red',
      icon: AlertTriangle
    },
    {
      title: 'Critical Vulnerabilities',
      value: metrics.criticalVulns,
      change: '-2',
      trend: 'down',
      color: 'yellow',
      icon: XCircle
    },
    {
      title: 'Security Score',
      value: `${metrics.securityScore}%`,
      change: '+5%',
      trend: 'up',
      color: 'green',
      icon: CheckCircle
    },
    {
      title: 'Assets Monitored',
      value: metrics.assetsMonitored.toLocaleString(),
      change: '+47',
      trend: 'up',
      color: 'blue',
      icon: Activity
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's your security overview.</p>
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
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  metric.color === 'red' ? 'bg-red-500/20 text-red-400' :
                  metric.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                  metric.color === 'green' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                 <span>{metric.change}</span>
               </div>
             </div>
             <div>
               <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
               <p className="text-gray-400 text-sm">{metric.title}</p>
             </div>
           </div>
         );
       })}
     </div>

     <div className="space-y-6">
       <ThreatTimeline 
         data={threatTimelineData} 
         title="Threat Detection Timeline"
         height={400}
       />
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <AlertDistribution 
           data={alertDistributionData}
           title="Alert Distribution by Type"
           height={350}
           showStatistics={false}
         />
         <RecentActivity />
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
             <button className="w-full flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors">
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
// Demo
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

// Demo
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

// Demo
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
   case 'threats':
     return <ThreatHunting />;
   case 'vulnerabilities':
     return <Vulnerabilities />;
   case 'config':
     return <Configuration />;
   case 'reports':
     return <ReportsView />;
   default:
     return <DashboardOverview />;
 }
};

// Main App Component
const App = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const { isAuthenticated } = useAuth();

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