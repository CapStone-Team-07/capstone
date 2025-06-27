// "use client"
// import React, { useState, createContext, useContext, useEffect } from 'react';
// import { 
//   Shield, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   Menu, 
//   X, 
//   Home, 
//   Search, 
//   Bell, 
//   Settings, 
//   User, 
//   LogOut,
//   Activity,
//   AlertTriangle,
//   FileText,
//   Wrench,
//   TrendingUp,
//   CheckCircle,
//   XCircle,
//   Clock
// } from 'lucide-react';

// // Import chart components
// import ThreatTimeline from '@hooks/components/charts/ThreatTimeline';
// import AlertDistribution from '@hooks/components/charts/AlertDistribution';

// // Mock data generation functions
// const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// const generateThreatTimeline = (days = 30) => {
//   const data = [];
//   const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

//   for (let i = 0; i < days; i++) {
//     const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
//     data.push({
//       date: date.toISOString().split('T')[0],
//       critical: randomBetween(0, 5),
//       high: randomBetween(2, 15),
//       medium: randomBetween(5, 25),
//       low: randomBetween(10, 40),
//       total: 0
//     });
//     data[i].total = data[i].critical + data[i].high + data[i].medium + data[i].low;
//   }
//   return data;
// };

// const generateAlertDistribution = () => {
//   const baseData = [
//     { name: 'Malware Detection', count: 1247, severity: 'Critical', color: '#ef4444' },
//     { name: 'Phishing Attempts', count: 892, severity: 'High', color: '#f97316' },
//     { name: 'Brute Force Attacks', count: 634, severity: 'High', color: '#f59e0b' },
//     { name: 'Data Exfiltration', count: 423, severity: 'Critical', color: '#dc2626' },
//     { name: 'Suspicious Network Traffic', count: 356, severity: 'Medium', color: '#eab308' },
//     { name: 'Unauthorized Access', count: 298, severity: 'High', color: '#ea580c' },
//     { name: 'Policy Violations', count: 187, severity: 'Medium', color: '#ca8a04' },
//     { name: 'System Anomalies', count: 142, severity: 'Low', color: '#16a34a' }
//   ];

//   const total = baseData.reduce((sum, item) => sum + item.count, 0);
//   return baseData.map(item => ({
//     ...item,
//     value: Math.round((item.count / total) * 100)
//   }));
// };

// // Authentication Context
// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const login = async (credentials) => {
//     setLoading(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     if (credentials.username === 'admin' && credentials.password === 'admin') {
//       setIsAuthenticated(true);
//       setUser({
//         name: 'Security Administrator',
//         email: 'admin@cybersec.com',
//         role: 'SOC Manager',
//         avatar: '👤'
//       });
//       setLoading(false);
//       return { success: true };
//     }
    
//     setLoading(false);
//     return { success: false, error: 'Invalid credentials' };
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // Login Component
// const LoginPage = () => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const { login, loading } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     const result = await login(credentials);
//     if (!result.success) {
//       setError(result.error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//         }} />
//       </div>

//       <div className="w-full max-w-md">
//         {/* Logo and Title */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
//             <Shield className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">CyberSecure Platform</h1>
//           <p className="text-gray-300">Enterprise Security Operations Center</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-2xl">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={credentials.username}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//                 className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
//                 placeholder="Enter your username"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={credentials.password}
//                   onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//                   className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors pr-12"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-300 text-sm">
//                 {error}
//               </div>
//             )}

//             <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3 text-blue-300 text-sm">
//               <p className="font-medium mb-1">Demo Credentials:</p>
//               <p>Username: <span className="font-mono">admin</span></p>
//               <p>Password: <span className="font-mono">admin</span></p>
//             </div>

//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>Authenticating...</span>
//                 </>
//               ) : (
//                 <>
//                   <Lock className="w-5 h-5" />
//                   <span>Sign In</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         <div className="text-center mt-6 text-gray-400 text-sm">
//           <p>Secure access to your cybersecurity operations</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Dashboard Layout Components
// const Sidebar = ({ isOpen, onClose }) => {
//   const [activeItem, setActiveItem] = useState('dashboard');
//   const { user, logout } = useAuth();

//   const navigationItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'threats', label: 'Threat Hunting', icon: AlertTriangle },
//     { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Activity },
//     { id: 'config', label: 'Configuration', icon: Wrench },
//     { id: 'reports', label: 'Reports', icon: FileText },
//   ];

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
//       )}

//       {/* Sidebar */}
//       <div className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 transform transition-transform duration-300 ${
//         isOpen ? 'translate-x-0' : '-translate-x-full'
//       } lg:translate-x-0 lg:static lg:z-auto`}>
        
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-700">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//               <Shield className="w-5 h-5 text-white" />
//             </div>
//             <span className="font-bold text-white">CyberSecure</span>
//           </div>
//           <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 p-4">
//           <ul className="space-y-2">
//             {navigationItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeItem === item.id;
              
//               return (
//                 <li key={item.id}>
//                   <button
//                     onClick={() => setActiveItem(item.id)}
//                     className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
//                       isActive 
//                         ? 'bg-blue-600 text-white' 
//                         : 'text-gray-300 hover:bg-gray-700 hover:text-white'
//                     }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     <span>{item.label}</span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* User Profile */}
//         <div className="p-4 border-t border-gray-700">
//           <div className="flex items-center space-x-3 mb-3">
//             <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
//               <User className="w-4 h-4 text-white" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium text-white truncate">{user?.name}</p>
//               <p className="text-xs text-gray-400 truncate">{user?.role}</p>
//             </div>
//           </div>
//           <button
//             onClick={logout}
//             className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
//           >
//             <LogOut className="w-4 h-4" />
//             <span className="text-sm">Sign Out</span>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// const Header = ({ onMenuClick }) => {
//   const [showNotifications, setShowNotifications] = useState(false);
//   const { user } = useAuth();

//   const notifications = [
//     { id: 1, type: 'critical', message: 'Critical vulnerability detected in web server', time: '2 min ago' },
//     { id: 2, type: 'warning', message: 'Unusual login activity from new location', time: '15 min ago' },
//     { id: 3, type: 'info', message: 'Weekly security report is ready', time: '1 hour ago' },
//   ];

//   return (
//     <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <button
//             onClick={onMenuClick}
//             className="lg:hidden text-gray-300 hover:text-white"
//           >
//             <Menu className="w-6 h-6" />
//           </button>
          
//           <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
//             <span>Dashboard</span>
//             <span>/</span>
//             <span className="text-white">Overview</span>
//           </nav>
//         </div>

//         <div className="flex items-center space-x-4">
//           {/* Search */}
//           <div className="hidden md:flex items-center">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search threats, assets..."
//                 className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
//               />
//             </div>
//           </div>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-2 text-gray-300 hover:text-white transition-colors"
//             >
//               <Bell className="w-5 h-5" />
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//             </button>

//             {showNotifications && (
//               <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
//                 <div className="p-3 border-b border-gray-700">
//                   <h3 className="font-medium text-white">Notifications</h3>
//                 </div>
//                 <div className="max-h-64 overflow-y-auto">
//                   {notifications.map((notification) => (
//                     <div key={notification.id} className="p-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50">
//                       <div className="flex items-start space-x-3">
//                         <div className={`w-2 h-2 rounded-full mt-2 ${
//                           notification.type === 'critical' ? 'bg-red-500' :
//                           notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
//                         }`} />
//                         <div className="flex-1">
//                           <p className="text-sm text-white">{notification.message}</p>
//                           <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* User Menu */}
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
//               <User className="w-4 h-4 text-white" />
//             </div>
//             <span className="hidden md:block text-sm text-white">{user?.name}</span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// // Recent Activity Component
// const RecentActivity = () => {
//   const activities = [
//     {
//       id: 1,
//       type: 'threat',
//       title: 'Malware detected on Server-001',
//       description: 'Trojan.Win32.Agent found in system files',
//       time: '2 minutes ago',
//       severity: 'critical',
//       icon: AlertTriangle
//     },
//     {
//       id: 2,
//       type: 'login',
//       title: 'Suspicious login attempt',
//       description: 'Multiple failed login attempts from IP 192.168.1.100',
//       time: '5 minutes ago',
//       severity: 'high',
//       icon: Shield
//     },
//     {
//       id: 3,
//       type: 'scan',
//       title: 'Vulnerability scan completed',
//       description: 'Network scan found 3 new vulnerabilities',
//       time: '12 minutes ago',
//       severity: 'medium',
//       icon: Activity
//     },
//     {
//       id: 4,
//       type: 'update',
//       title: 'Security policies updated',
//       description: 'Firewall rules updated successfully',
//       time: '1 hour ago',
//       severity: 'info',
//       icon: CheckCircle
//     }
//   ];

//   return (
//     <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
//       <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
//       <div className="space-y-4 max-h-80 overflow-y-auto">
//         {activities.map((activity) => {
//           const Icon = activity.icon;
//           return (
//             <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
//               <div className={`p-2 rounded-lg ${
//                 activity.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
//                 activity.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
//                 activity.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
//                 'bg-blue-500/20 text-blue-400'
//               }`}>
//                 <Icon className="w-4 h-4" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-white font-medium text-sm">{activity.title}</p>
//                 <p className="text-gray-400 text-xs mt-1">{activity.description}</p>
//                 <p className="text-gray-500 text-xs mt-2">{activity.time}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// // Dashboard Overview Component
// const DashboardOverview = () => {
//   const [metrics, setMetrics] = useState({
//     activeThreats: 12,
//     criticalVulns: 8,
//     securityScore: 87,
//     assetsMonitored: 1247
//   });

//   // Generate data for charts
//   const threatTimelineData = generateThreatTimeline(30);
//   const alertDistributionData = generateAlertDistribution();

//   const metricCards = [
//     {
//       title: 'Active Threats',
//       value: metrics.activeThreats,
//       change: '+3',
//       trend: 'up',
//       color: 'red',
//       icon: AlertTriangle
//     },
//     {
//       title: 'Critical Vulnerabilities',
//       value: metrics.criticalVulns,
//       change: '-2',
//       trend: 'down',
//       color: 'yellow',
//       icon: XCircle
//     },
//     {
//       title: 'Security Score',
//       value: `${metrics.securityScore}%`,
//       change: '+5%',
//       trend: 'up',
//       color: 'green',
//       icon: CheckCircle
//     },
//     {
//       title: 'Assets Monitored',
//       value: metrics.assetsMonitored.toLocaleString(),
//       change: '+47',
//       trend: 'up',
//       color: 'blue',
//       icon: Activity
//     }
//   ];

//   return (
//     <div className="p-6 space-y-6">
//       {/* Welcome Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
//           <p className="text-gray-400 mt-1">Welcome back! Here's your security overview.</p>
//         </div>
//         <div className="flex items-center space-x-2 text-sm text-gray-400">
//           <Clock className="w-4 h-4" />
//           <span>Last updated: 2 minutes ago</span>
//         </div>
//       </div>

//       {/* Metrics Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {metricCards.map((metric, index) => {
//           const Icon = metric.icon;
//           return (
//             <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
//                   metric.color === 'red' ? 'bg-red-500/20 text-red-400' :
//                   metric.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
//                   metric.color === 'green' ? 'bg-green-500/20 text-green-400' :
//                   'bg-blue-500/20 text-blue-400'
//                 }`}>
//                   <Icon className="w-5 h-5" />
//                 </div>
//                 <div className={`flex items-center space-x-1 text-sm ${
//                   metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
//                 }`}>
//                   <TrendingUp className={`w-4 h-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
//                   <span>{metric.change}</span>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
//                 <p className="text-gray-400 text-sm">{metric.title}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Charts Section */}
//       <div className="space-y-6">
//         {/* Threat Timeline Chart - Full Width */}
//         <ThreatTimeline 
//           data={threatTimelineData} 
//           title="Threat Detection Timeline"
//           height={400}
//         />
        
//         {/* Alert Distribution and Recent Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <AlertDistribution 
//             data={alertDistributionData}
//             title="Alert Distribution by Type"
//             height={350}
//             showStatistics={false}
//           />
//           <RecentActivity />
//         </div>
        
//         {/* System Health and Additional Metrics */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">CPU Usage</span>
//                 <span className="text-white">67%</span>
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Memory Usage</span>
//                 <span className="text-white">45%</span>
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-300">Network Activity</span>
//                 <span className="text-white">82%</span>
//               </div>
//               <div className="w-full bg-gray-700 rounded-full h-2">
//                 <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '82%' }}></div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4">Security Score</h3>
//             <div className="flex items-center justify-center mb-4">
//               <div className="relative w-24 h-24">
//                 <div className="w-24 h-24 rounded-full border-8 border-gray-700"></div>
//                 <div className="absolute inset-0 w-24 h-24 rounded-full border-8 border-green-500 border-r-transparent animate-pulse" style={{ transform: 'rotate(45deg)' }}></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white">87</span>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Firewall</span>
//                 <span className="text-green-400">Active</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Antivirus</span>
//                 <span className="text-green-400">Updated</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Patches</span>
//                 <span className="text-yellow-400">3 Pending</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
//             <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
//             <div className="space-y-3">
//               <button className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors">
//                 <Shield className="w-4 h-4" />
//                 <span>Run Security Scan</span>
//               </button>
//               <button className="w-full flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-colors">
//                 <AlertTriangle className="w-4 h-4" />
//                 <span>View All Threats</span>
//               </button>
//               <button className="w-full flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors">
//                 <FileText className="w-4 h-4" />
//                 <span>Generate Report</span>
//               </button>
//               <button className="w-full flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors">
//                 <Settings className="w-4 h-4" />
//                 <span>System Settings</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main App Component
// // Main App Component
// const App = () => {
//  const [sidebarOpen, setSidebarOpen] = useState(false);
//  const { isAuthenticated } = useAuth();

//  if (!isAuthenticated) {
//    return <LoginPage />;
//  }

//  return (
//    <div className="min-h-screen bg-gray-900 text-white">
//      <div className="flex">
//        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//        <div className="flex-1 lg:ml-0">
//          <Header onMenuClick={() => setSidebarOpen(true)} />
//          <main className="min-h-screen">
//            <DashboardOverview />
//          </main>
//        </div>
//      </div>
//    </div>
//  );
// };

// // Root Application with Provider
// export default function CybersecurityPlatform() {
//  return (
//    <AuthProvider>
//      <App />
//    </AuthProvider>
//  );
// }


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

// Generate threat hunting data
const generateThreatHuntingData = () => {
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const categories = ['Malware', 'Phishing', 'Brute Force', 'Data Exfiltration', 'Insider Threat', 'Advanced Persistent Threat', 'Ransomware', 'DDoS'];
  const statuses = ['Active', 'Investigating', 'Contained', 'Resolved', 'False Positive'];
  const sources = ['Firewall', 'IDS/IPS', 'Endpoint Detection', 'Email Security', 'Network Monitor', 'SIEM', 'Threat Intel'];
  const countries = ['United States', 'China', 'Russia', 'Germany', 'United Kingdom', 'France', 'India', 'Brazil'];
  const attackTypes = ['SQL Injection', 'Cross-Site Scripting', 'Buffer Overflow', 'Man-in-the-Middle', 'Zero-Day Exploit', 'Social Engineering'];

  const threats = [];
  for (let i = 0; i < 150; i++) {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const country = countries[Math.floor(Math.random() * countries.length)];
    const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    
    const baseTime = Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000);
    const riskScore = Math.floor(Math.random() * 100) + 1;
    
    threats.push({
      id: `THR-${String(i + 1).padStart(6, '0')}`,
      title: `${category} - ${attackType}`,
      description: `Suspicious ${category.toLowerCase()} activity detected from ${country}`,
      severity,
      category,
      status,
      source,
      riskScore,
      sourceIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      targetIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country,
      timestamp: new Date(baseTime).toISOString(),
      lastActivity: new Date(baseTime + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      affectedAssets: Math.floor(Math.random() * 50) + 1,
      confidence: Math.floor(Math.random() * 40) + 60,
      attackVector: attackType,
      protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS', 'FTP', 'SSH'][Math.floor(Math.random() * 6)],
      port: Math.floor(Math.random() * 65535) + 1,
      iocs: Math.floor(Math.random() * 20) + 1,
      mitreTactics: ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion'][Math.floor(Math.random() * 5)],
      analyst: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'][Math.floor(Math.random() * 5)],
      starred: Math.random() > 0.8,
      flagged: Math.random() > 0.7
    });
  }
  return threats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

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

// Threat Hunting Component
import ThreatHunting from '@hooks/components/dashboard/ThreatHunting';
// const ThreatHunting = () => {
//  const [threats, setThreats] = useState([]);
//  const [filteredThreats, setFilteredThreats] = useState([]);
//  const [loading, setLoading] = useState(false);
//  const [selectedThreat, setSelectedThreat] = useState(null);
//  const [searchTerm, setSearchTerm] = useState('');
//  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
//  const [currentPage, setCurrentPage] = useState(1);
//  const [pageSize, setPageSize] = useState(25);
//  const [showFilters, setShowFilters] = useState(false);
//  const [autoRefresh, setAutoRefresh] = useState(false);
//  const [selectedThreats, setSelectedThreats] = useState(new Set());

//  const [filters, setFilters] = useState({
//    severity: [],
//    category: [],
//    status: [],
//    source: [],
//    dateRange: 'all',
//    riskScore: [0, 100]
//  });

//  useEffect(() => {
//    setLoading(true);
//    setTimeout(() => {
//      const data = generateThreatHuntingData();
//      setThreats(data);
//      setFilteredThreats(data);
//      setLoading(false);
//    }, 1000);
//  }, []);

//  useEffect(() => {
//    let interval;
//    if (autoRefresh) {
//      interval = setInterval(() => {
//        const updatedData = generateThreatHuntingData();
//        setThreats(updatedData);
//      }, 30000);
//    }
//    return () => clearInterval(interval);
//  }, [autoRefresh]);

//  const getSeverityColor = (severity) => {
//    switch (severity) {
//      case 'Critical': return 'text-red-400 bg-red-500/20';
//      case 'High': return 'text-orange-400 bg-orange-500/20';
//      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
//      case 'Low': return 'text-green-400 bg-green-500/20';
//      default: return 'text-gray-400 bg-gray-500/20';
//    }
//  };

//  const getStatusColor = (status) => {
//    switch (status) {
//      case 'Active': return 'text-red-400 bg-red-500/20';
//      case 'Investigating': return 'text-yellow-400 bg-yellow-500/20';
//      case 'Contained': return 'text-blue-400 bg-blue-500/20';
//      case 'Resolved': return 'text-green-400 bg-green-500/20';
//      case 'False Positive': return 'text-gray-400 bg-gray-500/20';
//      default: return 'text-gray-400 bg-gray-500/20';
//    }
//  };

//  const formatTimeAgo = (timestamp) => {
//    const now = new Date();
//    const then = new Date(timestamp);
//    const diffMs = now - then;
//    const diffMins = Math.floor(diffMs / 60000);
//    const diffHours = Math.floor(diffMins / 60);
//    const diffDays = Math.floor(diffHours / 24);

//    if (diffMins < 1) return 'Just now';
//    if (diffMins < 60) return `${diffMins}m ago`;
//    if (diffHours < 24) return `${diffHours}h ago`;
//    return `${diffDays}d ago`;
//  };

//  const handleRefresh = () => {
//    setLoading(true);
//    setTimeout(() => {
//      const data = generateThreatHuntingData();
//      setThreats(data);
//      setLoading(false);
//    }, 1000);
//  };

//  const ThreatDetailModal = ({ threat, onClose }) => (
//    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//        <div className="p-6">
//          <div className="flex items-center justify-between mb-6">
//            <div className="flex items-center space-x-3">
//              <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.severity).split(' ')[1]}`} />
//              <h2 className="text-xl font-bold text-white">{threat.title}</h2>
//            </div>
//            <button
//              onClick={onClose}
//              className="text-gray-400 hover:text-white transition-colors"
//            >
//              <X className="w-6 h-6" />
//            </button>
//          </div>

//          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//            <div className="space-y-4">
//              <div>
//                <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
//                <div className="space-y-2 text-sm">
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Threat ID:</span>
//                    <span className="text-white font-mono">{threat.id}</span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Severity:</span>
//                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
//                      {threat.severity}
//                    </span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Status:</span>
//                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
//                      {threat.status}
//                    </span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Risk Score:</span>
//                    <span className="text-white">{threat.riskScore}/100</span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Category:</span>
//                    <span className="text-white">{threat.category}</span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Source:</span>
//                    <span className="text-white">{threat.source}</span>
//                  </div>
//                </div>
//              </div>
//            </div>

//            <div className="space-y-4">
//              <div>
//                <h3 className="text-lg font-semibold text-white mb-3">Network Information</h3>
//                <div className="space-y-2 text-sm">
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Source IP:</span>
//                    <span className="text-white font-mono">{threat.sourceIP}</span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Target IP:</span>
//                    <span className="text-white font-mono">{threat.targetIP}</span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Protocol:</span>
//                    <span className="text-white">{threat.protocol}</span>
//                  </div>
//                  <div className="flex justify-between">
//                    <span className="text-gray-400">Port:</span>
//                    <span className="text-white">{threat.port}</span>
//                  </div>
//                </div>
//              </div>
//            </div>
//          </div>

//          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
//            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2">
//              <AlertTriangle className="w-4 h-4" />
//              <span>Block IP</span>
//            </button>
//            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
//              <CheckCircle className="w-4 h-4" />
//              <span>Resolve</span>
//            </button>
//          </div>
//        </div>
//      </div>
//    </div>
//  );

//  return (
//    <div className="p-6 space-y-6">
//      <div className="flex items-center justify-between">
//        <div>
//          <h1 className="text-2xl font-bold text-white">Threat Hunting</h1>
//          <p className="text-gray-400 mt-1">Advanced threat analysis and investigation</p>
//        </div>
//        <div className="flex items-center space-x-3">
//          <div className="flex items-center space-x-2 text-sm text-gray-400">
//            <Activity className="w-4 h-4" />
//            <span>{filteredThreats.length} threats found</span>
//          </div>
//          <button
//            onClick={() => setAutoRefresh(!autoRefresh)}
//            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
//              autoRefresh 
//                ? 'bg-green-600 hover:bg-green-700 text-white' 
//                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
//            }`}
//          >
//            {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//            <span>Auto Refresh</span>
//          </button>
//        </div>
//      </div>

//      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
//        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//          <div className="flex-1 max-w-md">
//            <div className="relative">
//              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//              <input
//                type="text"
//                placeholder="Search threats, IPs, IOCs..."
//                value={searchTerm}
//                onChange={(e) => setSearchTerm(e.target.value)}
//                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//              />
//            </div>
//          </div>

//          <div className="flex items-center space-x-3">
//            <button
//              onClick={() => setShowFilters(!showFilters)}
//              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
//            >
//              <Filter className="w-4 h-4" />
//              <span>Filters</span>
//            </button>

//            <button
//              onClick={handleRefresh}
//              disabled={loading}
//              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
//            >
//              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//              <span>Refresh</span>
//            </button>
//          </div>
//        </div>
//      </div>

//      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
//        <div className="overflow-x-auto">
//          <table className="w-full">
//            <thead className="bg-gray-700/50">
//              <tr>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Threat ID</th>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Title</th>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Severity</th>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Status</th>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Risk Score</th>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Source IP</th>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Detected</th>
//                <th className="p-3 text-left text-gray-300 font-medium text-sm">Actions</th>
//              </tr>
//            </thead>
//            <tbody>
//              {loading ? (
//                <tr>
//                  <td colSpan="8" className="p-8 text-center">
//                    <div className="flex items-center justify-center space-x-2 text-gray-400">
//                      <RefreshCw className="w-5 h-5 animate-spin" />
//                      <span>Loading threats...</span>
//                    </div>
//                  </td>
//                </tr>
//              ) : threats.slice(0, pageSize).map((threat, index) => (
//                <tr
//                  key={threat.id}
//                  className={`border-t border-gray-700 hover:bg-gray-700/30 transition-colors ${
//                    index % 2 === 0 ? 'bg-gray-800/30' : ''
//                  }`}
//                >
//                  <td className="p-3">
//                    <div className="flex items-center space-x-2">
//                      <span className="font-mono text-sm text-white">{threat.id}</span>
//                      {threat.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
//                      {threat.flagged && <Flag className="w-4 h-4 text-red-400" />}
//                    </div>
//                  </td>
//                  <td className="p-3">
//                    <div className="max-w-xs">
//                      <p className="text-white font-medium text-sm truncate">{threat.title}</p>
//                      <p className="text-gray-400 text-xs truncate">{threat.description}</p>
//                    </div>
//                  </td>
//                  <td className="p-3">
//                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
//                      {threat.severity}
//                    </span>
//                  </td>
//                  <td className="p-3">
//                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
//                      {threat.status}
//                    </span>
//                  </td>
//                  <td className="p-3">
//                    <div className="flex items-center space-x-2">
//                      <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
//                        <div
//                          className={`h-full ${
//                            threat.riskScore >= 80 ? 'bg-red-500' :
//                            threat.riskScore >= 60 ? 'bg-orange-500' :
//                            threat.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
//                          }`}
//                          style={{ width: `${threat.riskScore}%` }}
//                        />
//                      </div>
//                      <span className="text-sm text-white">{threat.riskScore}</span>
//                    </div>
//                  </td>
//                  <td className="p-3">
//                    <div className="flex items-center space-x-2">
//                      <span className="font-mono text-sm text-white">{threat.sourceIP}</span>
//                      <button
//                        onClick={() => navigator.clipboard.writeText(threat.sourceIP)}
//                        className="text-gray-400 hover:text-white transition-colors"
//                      >
//                        <Copy className="w-3 h-3" />
//                      </button>
//                    </div>
//                  </td>
//                  <td className="p-3">
//                    <div className="text-sm text-white">{formatTimeAgo(threat.timestamp)}</div>
//                  </td>
//                  <td className="p-3">
//                    <div className="flex items-center space-x-2">
//                      <button
//                        onClick={() => setSelectedThreat(threat)}
//                        className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
//                        title="View Details"
//                      >
//                        <Eye className="w-4 h-4" />
//                      </button>
//                      <button
//                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
//                        title="Block"
//                      >
//                        <Shield className="w-4 h-4" />
//                      </button>
//                    </div>
//                  </td>
//                </tr>
//              ))}
//            </tbody>
//          </table>
//        </div>
//      </div>

//      {selectedThreat && (
//        <ThreatDetailModal
//          threat={selectedThreat}
//          onClose={() => setSelectedThreat(null)}
//        />
//      )}
//    </div>
//  );
// };

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
     return <VulnerabilitiesView />;
   case 'config':
     return <ConfigurationView />;
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