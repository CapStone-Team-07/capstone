// New Features - Add Block IP Escalate and Resolve features - Threat Hunting [17:03 - 27.06.25]  
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Shield,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Globe,
  Activity,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Pause,
  MoreHorizontal,
  FileText,
  Lock,
  Unlock,
  Zap,
  Target,
  Database,
  Network,
  Server,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Calendar,
  Hash,
  ArrowUpDown,
  ExternalLink,
  Copy,
  Star,
  Flag,
  Bell,
  MessageSquare,
  Users,
  TrendingUp
} from 'lucide-react';

const ThreatHunting = () => {
  // State management
  const [threats, setThreats] = useState([]);
  const [filteredThreats, setFilteredThreats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedThreats, setSelectedThreats] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    severity: [],
    category: [],
    status: [],
    source: [],
    dateRange: 'all',
    riskScore: [0, 100]
  });

  // Mock current user
  const currentUser = {
    id: 'user-001',
    name: 'Security Administrator',
    role: 'SOC Manager'
  };

  // Initialize with mock data from db.json structure
  const initializeThreats = () => {
    const mockThreats = [
      {
        id: "THR-000001",
        title: "Malware - SQL Injection",
        description: "Suspicious malware activity detected from China",
        severity: "Critical",
        category: "Malware",
        status: "Active",
        source: "Firewall",
        riskScore: 87,
        sourceIP: "192.168.1.100",
        targetIP: "192.168.50.25",
        country: "China",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        affectedAssets: 15,
        confidence: 92,
        attackVector: "SQL Injection",
        protocol: "HTTP",
        port: 80,
        iocs: 8,
        mitreTactics: "Initial Access",
        analyst: "John Doe",
        starred: true,
        flagged: false,
        actions: [],
        notes: "",
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null,
        blockedBy: null,
        escalatedBy: null,
        resolvedBy: null
      },
      {
        id: "THR-000002",
        title: "Phishing - Cross-Site Scripting",
        description: "Suspicious phishing activity detected from Russia",
        severity: "High",
        category: "Phishing",
        status: "Investigating",
        source: "Email Security",
        riskScore: 72,
        sourceIP: "203.45.67.89",
        targetIP: "192.168.50.30",
        country: "Russia",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        affectedAssets: 8,
        confidence: 78,
        attackVector: "Cross-Site Scripting",
        protocol: "HTTPS",
        port: 443,
        iocs: 5,
        mitreTactics: "Execution",
        analyst: "Jane Smith",
        starred: false,
        flagged: true,
        actions: [],
        notes: "",
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null,
        blockedBy: null,
        escalatedBy: null,
        resolvedBy: null
      },
      {
        id: "THR-000003",
        title: "Brute Force - Buffer Overflow",
        description: "Suspicious brute force activity detected from Germany",
        severity: "Medium",
        category: "Brute Force",
        status: "Contained",
        source: "IDS/IPS",
        riskScore: 54,
        sourceIP: "185.92.14.56",
        targetIP: "192.168.50.12",
        country: "Germany",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        affectedAssets: 3,
        confidence: 65,
        attackVector: "Buffer Overflow",
        protocol: "SSH",
        port: 22,
        iocs: 12,
        mitreTactics: "Privilege Escalation",
        analyst: "Mike Johnson",
        starred: false,
        flagged: false,
        actions: [],
        notes: "",
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null,
        blockedBy: null,
        escalatedBy: null,
        resolvedBy: null
      }
    ];

    // Generate additional random threats
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    const categories = ['Malware', 'Phishing', 'Brute Force', 'Data Exfiltration', 'Insider Threat', 'Advanced Persistent Threat', 'Ransomware', 'DDoS'];
    const statuses = ['Active', 'Investigating', 'Contained', 'Resolved', 'False Positive'];
    const sources = ['Firewall', 'IDS/IPS', 'Endpoint Detection', 'Email Security', 'Network Monitor', 'SIEM', 'Threat Intel'];
    const countries = ['United States', 'China', 'Russia', 'Germany', 'United Kingdom', 'France', 'India', 'Brazil'];
    const attackTypes = ['SQL Injection', 'Cross-Site Scripting', 'Buffer Overflow', 'Man-in-the-Middle', 'Zero-Day Exploit', 'Social Engineering'];

    for (let i = 4; i <= 25; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      
      const baseTime = Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000);
      const riskScore = Math.floor(Math.random() * 100) + 1;
      
      mockThreats.push({
        id: `THR-${String(i).padStart(6, '0')}`,
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
        flagged: Math.random() > 0.7,
        actions: [],
        notes: "",
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null,
        blockedBy: null,
        escalatedBy: null,
        resolvedBy: null
      });
    }
    
    return mockThreats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Initialize data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = initializeThreats();
      setThreats(data);
      setFilteredThreats(data);
      setLoading(false);
    }, 1000);
  }, []);

  // Notification system
  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep only 5 notifications
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Interactive Actions
  const handleBlockIP = async (threat) => {
    setActionLoading(`block-${threat.id}`);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update threat status
      setThreats(prevThreats => 
        prevThreats.map(t => 
          t.id === threat.id 
            ? {
                ...t,
                status: 'Blocked',
                blockedAt: new Date().toISOString(),
                blockedBy: currentUser.name,
                actions: [
                  ...t.actions,
                  {
                    type: 'block',
                    timestamp: new Date().toISOString(),
                    user: currentUser.name,
                    notes: `IP ${threat.sourceIP} blocked due to malicious activity`
                  }
                ]
              }
            : t
        )
      );

      showNotification(`IP ${threat.sourceIP} has been successfully blocked`, 'success');
      
      // Close modal if open
      if (selectedThreat?.id === threat.id) {
        setSelectedThreat(null);
      }
      
    } catch (error) {
      showNotification('Failed to block IP. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEscalate = async (threat) => {
    setActionLoading(`escalate-${threat.id}`);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Determine new severity
      const severityLevels = { 'Low': 'Medium', 'Medium': 'High', 'High': 'Critical', 'Critical': 'Critical' };
      const newSeverity = severityLevels[threat.severity];
      
      // Update threat
      setThreats(prevThreats => 
        prevThreats.map(t => 
          t.id === threat.id 
            ? {
                ...t,
                status: 'Escalated',
                severity: newSeverity,
                escalatedAt: new Date().toISOString(),
                escalatedBy: currentUser.name,
                actions: [
                  ...t.actions,
                  {
                    type: 'escalate',
                    timestamp: new Date().toISOString(),
                    user: currentUser.name,
                    notes: `Threat escalated to ${newSeverity} severity and forwarded to Security Manager`
                  }
                ]
              }
            : t
        )
      );

      showNotification(`Threat ${threat.id} has been escalated to ${newSeverity} severity`, 'warning');
      
      // Close modal if open
      if (selectedThreat?.id === threat.id) {
        setSelectedThreat(null);
      }
      
    } catch (error) {
      showNotification('Failed to escalate threat. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolve = async (threat) => {
    setActionLoading(`resolve-${threat.id}`);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update threat
      setThreats(prevThreats => 
        prevThreats.map(t => 
          t.id === threat.id 
            ? {
                ...t,
                status: 'Resolved',
                resolvedAt: new Date().toISOString(),
                resolvedBy: currentUser.name,
                actions: [
                  ...t.actions,
                  {
                    type: 'resolve',
                    timestamp: new Date().toISOString(),
                    user: currentUser.name,
                    notes: 'Threat analyzed and confirmed as resolved. No further action required.'
                  }
                ]
              }
            : t
        )
      );

      showNotification(`Threat ${threat.id} has been resolved successfully`, 'success');
      
      // Close modal if open
      if (selectedThreat?.id === threat.id) {
        setSelectedThreat(null);
      }
      
    } catch (error) {
      showNotification('Failed to resolve threat. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        const updatedData = initializeThreats();
        setThreats(updatedData);
        showNotification('Threat data refreshed', 'info');
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter and search logic
  useEffect(() => {
    let filtered = threats;

    if (searchTerm) {
      filtered = filtered.filter(threat =>
        threat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.sourceIP.includes(searchTerm) ||
        threat.targetIP.includes(searchTerm)
      );
    }

    if (filters.severity.length > 0) {
      filtered = filtered.filter(threat => filters.severity.includes(threat.severity));
    }
    if (filters.category.length > 0) {
      filtered = filtered.filter(threat => filters.category.includes(threat.category));
    }
    if (filters.status.length > 0) {
      filtered = filtered.filter(threat => filters.status.includes(threat.status));
    }
    if (filters.source.length > 0) {
      filtered = filtered.filter(threat => filters.source.includes(threat.source));
    }

    filtered = filtered.filter(threat => 
      threat.riskScore >= filters.riskScore[0] && 
      threat.riskScore <= filters.riskScore[1]
    );

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.dateRange) {
        case '1h':
          cutoff.setHours(now.getHours() - 1);
          break;
        case '24h':
          cutoff.setDate(now.getDate() - 1);
          break;
        case '7d':
          cutoff.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoff.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(threat => new Date(threat.timestamp) >= cutoff);
    }

    setFilteredThreats(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, threats]);

  // Sorting logic
  const sortedThreats = useMemo(() => {
    const sorted = [...filteredThreats].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'timestamp' || sortConfig.key === 'lastActivity') {
        return sortConfig.direction === 'asc' 
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [filteredThreats, sortConfig]);

  // Pagination logic
  const paginatedThreats = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedThreats.slice(startIndex, startIndex + pageSize);
  }, [sortedThreats, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedThreats.length / pageSize);

  // Utility functions
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const data = initializeThreats();
      setThreats(data);
      setLoading(false);
      showNotification('Threat data refreshed successfully', 'success');
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Title', 'Severity', 'Category', 'Status', 'Risk Score', 'Source IP', 'Target IP', 'Timestamp'],
      ...sortedThreats.map(threat => [
        threat.id,
        threat.title,
        threat.severity,
        threat.category,
        threat.status,
        threat.riskScore,
        threat.sourceIP,
        threat.targetIP,
        threat.timestamp
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-hunting-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Threat data exported successfully', 'success');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-red-400 bg-red-500/20';
      case 'Investigating': return 'text-yellow-400 bg-yellow-500/20';
      case 'Contained': return 'text-blue-400 bg-blue-500/20';
      case 'Resolved': return 'text-green-400 bg-green-500/20';
      case 'Blocked': return 'text-purple-400 bg-purple-500/20';
      case 'Escalated': return 'text-orange-400 bg-orange-500/20';
      case 'False Positive': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Notification Component
  const NotificationBanner = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ${
            notification.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-100' :
            notification.type === 'error' ? 'bg-red-900/90 border-red-700 text-red-100' :
            notification.type === 'warning' ? 'bg-yellow-900/90 border-yellow-700 text-yellow-100' :
            'bg-blue-900/90 border-blue-700 text-blue-100'
          } backdrop-blur-sm`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5" />}
            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {notification.type === 'info' && <Info className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      ))}
    </div>
  );

  // Filter component
  const FilterPanel = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
          <div className="space-y-2">
            {['Critical', 'High', 'Medium', 'Low'].map(severity => (
              <label key={severity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.severity.includes(severity)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, severity: [...prev.severity, severity] }));
                    } else {
                      setFilters(prev => ({ ...prev, severity: prev.severity.filter(s => s !== severity) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{severity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <div className="space-y-2">
            {['Active', 'Investigating', 'Contained', 'Resolved', 'Blocked', 'Escalated', 'False Positive'].map(status => (
              <label key={status} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, status: [...prev.status, status] }));
                    } else {
                      setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {['Malware', 'Phishing', 'Brute Force', 'Data Exfiltration', 'Insider Threat', 'Advanced Persistent Threat', 'Ransomware', 'DDoS'].map(category => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.category.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, category: [...prev.category, category] }));
                    } else {
                      setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== category) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Risk Score Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Risk Score: {filters.riskScore[0]} - {filters.riskScore[1]}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.riskScore[0]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                riskScore: [parseInt(e.target.value), prev.riskScore[1]] 
              }))}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.riskScore[1]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                riskScore: [prev.riskScore[0], parseInt(e.target.value)] 
              }))}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setFilters({ severity: [], category: [], status: [], source: [], dateRange: 'all', riskScore: [0, 100] })}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={() => setShowFilters(false)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        
        >Apply Filters
        </button>
       {/* </button> */}
     </div>
   </div>
 );

 // Enhanced Threat detail modal with interactive actions
 const ThreatDetailModal = ({ threat, onClose }) => {
   const [activeTab, setActiveTab] = useState('details');
   
   return (
     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
       <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
         {/* Modal Header */}
         <div className="p-6 border-b border-gray-700">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-3">
               <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat.severity).split(' ')[1]}`} />
               <div>
                 <h2 className="text-xl font-bold text-white">{threat.title}</h2>
                 <p className="text-sm text-gray-400">{threat.id}</p>
               </div>
             </div>
             <button
               onClick={onClose}
               className="text-gray-400 hover:text-white transition-colors"
             >
               <X className="w-6 h-6" />
             </button>
           </div>

           {/* Tab Navigation */}
           <div className="flex space-x-6 mt-4">
             {[
               { id: 'details', label: 'Details', icon: Info },
               { id: 'timeline', label: 'Timeline', icon: Clock },
               { id: 'actions', label: 'Actions', icon: Zap }
             ].map(tab => {
               const Icon = tab.icon;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                     activeTab === tab.id
                       ? 'bg-blue-600 text-white'
                       : 'text-gray-400 hover:text-white hover:bg-gray-700'
                   }`}
                 >
                   <Icon className="w-4 h-4" />
                   <span>{tab.label}</span>
                 </button>
               );
             })}
           </div>
         </div>

         {/* Modal Content */}
         <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
           {activeTab === 'details' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {/* Basic Information */}
               <div className="space-y-4">
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-3">Basic Information</h3>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center">
                       <span className="text-gray-400">Severity:</span>
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                         {threat.severity}
                       </span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-gray-400">Status:</span>
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                         {threat.status}
                       </span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Risk Score:</span>
                       <div className="flex items-center space-x-2">
                         <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                           <div
                             className={`h-full ${
                               threat.riskScore >= 80 ? 'bg-red-500' :
                               threat.riskScore >= 60 ? 'bg-orange-500' :
                               threat.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                             }`}
                             style={{ width: `${threat.riskScore}%` }}
                           />
                         </div>
                         <span className="text-white font-medium">{threat.riskScore}/100</span>
                       </div>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Confidence:</span>
                       <span className="text-white">{threat.confidence}%</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Category:</span>
                       <span className="text-white">{threat.category}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Source:</span>
                       <span className="text-white">{threat.source}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Assigned Analyst:</span>
                       <span className="text-white">{threat.analyst}</span>
                     </div>
                   </div>
                 </div>

                 {/* Network Information */}
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-3">Network Information</h3>
                   <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-gray-400">Source IP:</span>
                       <div className="flex items-center space-x-2">
                         <span className="text-white font-mono">{threat.sourceIP}</span>
                         <button
                           onClick={() => navigator.clipboard.writeText(threat.sourceIP)}
                           className="text-gray-400 hover:text-white transition-colors"
                         >
                           <Copy className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Target IP:</span>
                       <span className="text-white font-mono">{threat.targetIP}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Protocol:</span>
                       <span className="text-white">{threat.protocol}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Port:</span>
                       <span className="text-white">{threat.port}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Country:</span>
                       <div className="flex items-center space-x-1">
                         <Globe className="w-4 h-4 text-gray-400" />
                         <span className="text-white">{threat.country}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Attack Information */}
               <div className="space-y-4">
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-3">Attack Details</h3>
                   <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-gray-400">Attack Vector:</span>
                       <span className="text-white">{threat.attackVector}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">MITRE Tactic:</span>
                       <span className="text-white">{threat.mitreTactics}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Affected Assets:</span>
                       <span className="text-white">{threat.affectedAssets}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">IOCs:</span>
                       <span className="text-white">{threat.iocs}</span>
                     </div>
                   </div>
                 </div>

                 {/* Timeline Information */}
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-3">Timeline</h3>
                   <div className="space-y-3">
                     <div className="flex justify-between">
                       <span className="text-gray-400">First Detected:</span>
                       <span className="text-white">{new Date(threat.timestamp).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Last Activity:</span>
                       <span className="text-white">{new Date(threat.lastActivity).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-400">Duration:</span>
                       <span className="text-white">{formatTimeAgo(threat.timestamp)}</span>
                     </div>
                     {threat.blockedAt && (
                       <div className="flex justify-between">
                         <span className="text-gray-400">Blocked At:</span>
                         <span className="text-purple-400">{new Date(threat.blockedAt).toLocaleString()}</span>
                       </div>
                     )}
                     {threat.escalatedAt && (
                       <div className="flex justify-between">
                         <span className="text-gray-400">Escalated At:</span>
                         <span className="text-orange-400">{new Date(threat.escalatedAt).toLocaleString()}</span>
                       </div>
                     )}
                     {threat.resolvedAt && (
                       <div className="flex justify-between">
                         <span className="text-gray-400">Resolved At:</span>
                         <span className="text-green-400">{new Date(threat.resolvedAt).toLocaleString()}</span>
                       </div>
                     )}
                   </div>
                 </div>

                 {/* Description */}
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                   <p className="text-gray-300 text-sm leading-relaxed bg-gray-700/30 p-3 rounded-lg">
                     {threat.description}
                   </p>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'timeline' && (
             <div>
               <h3 className="text-lg font-semibold text-white mb-4">Action Timeline</h3>
               <div className="space-y-4">
                 {/* Initial detection */}
                 <div className="flex items-start space-x-3">
                   <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                     <AlertTriangle className="w-4 h-4 text-blue-400" />
                   </div>
                   <div className="flex-1">
                     <p className="text-white font-medium">Threat Detected</p>
                     <p className="text-gray-400 text-sm">Initial detection by {threat.source}</p>
                     <p className="text-gray-500 text-xs">{new Date(threat.timestamp).toLocaleString()}</p>
                   </div>
                 </div>

                 {/* Actions timeline */}
                 {threat.actions.map((action, index) => (
                   <div key={index} className="flex items-start space-x-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                       action.type === 'block' ? 'bg-purple-500/20' :
                       action.type === 'escalate' ? 'bg-orange-500/20' :
                       action.type === 'resolve' ? 'bg-green-500/20' : 'bg-gray-500/20'
                     }`}>
                       {action.type === 'block' && <Shield className="w-4 h-4 text-purple-400" />}
                       {action.type === 'escalate' && <TrendingUp className="w-4 h-4 text-orange-400" />}
                       {action.type === 'resolve' && <CheckCircle className="w-4 h-4 text-green-400" />}
                     </div>
                     <div className="flex-1">
                       <p className="text-white font-medium capitalize">{action.type}ed</p>
                       <p className="text-gray-400 text-sm">{action.notes}</p>
                       <p className="text-gray-500 text-xs">by {action.user} • {new Date(action.timestamp).toLocaleString()}</p>
                     </div>
                   </div>
                 ))}

                 {threat.actions.length === 0 && (
                   <div className="text-center py-8">
                     <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                     <p className="text-gray-400">No actions taken yet</p>
                   </div>
                 )}
               </div>
             </div>
           )}

           {activeTab === 'actions' && (
             <div>
               <h3 className="text-lg font-semibold text-white mb-4">Available Actions</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Block IP Action */}
                 <div className="bg-gray-700/30 rounded-lg p-4">
                   <div className="flex items-center space-x-3 mb-3">
                     <Shield className="w-6 h-6 text-purple-400" />
                     <h4 className="font-medium text-white">Block IP Address</h4>
                   </div>
                   <p className="text-gray-400 text-sm mb-4">
                     Block the source IP {threat.sourceIP} to prevent further attacks
                   </p>
                   <button
                     onClick={() => handleBlockIP(threat)}
                     disabled={actionLoading === `block-${threat.id}` || threat.status === 'Blocked'}
                     className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                   >
                     {actionLoading === `block-${threat.id}` ? (
                       <RefreshCw className="w-4 h-4 animate-spin" />
                     ) : (
                       <Shield className="w-4 h-4" />
                     )}
                     <span>{threat.status === 'Blocked' ? 'Already Blocked' : 'Block IP'}</span>
                   </button>
                 </div>

                 {/* Escalate Action */}
                 <div className="bg-gray-700/30 rounded-lg p-4">
                   <div className="flex items-center space-x-3 mb-3">
                     <TrendingUp className="w-6 h-6 text-orange-400" />
                     <h4 className="font-medium text-white">Escalate Threat</h4>
                   </div>
                   <p className="text-gray-400 text-sm mb-4">
                     Escalate to higher severity and notify security management
                   </p>
                   <button
                     onClick={() => handleEscalate(threat)}
                     disabled={actionLoading === `escalate-${threat.id}` || threat.status === 'Escalated'}
                     className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                   >
                     {actionLoading === `escalate-${threat.id}` ? (
                       <RefreshCw className="w-4 h-4 animate-spin" />
                     ) : (
                       <TrendingUp className="w-4 h-4" />
                     )}
                     <span>{threat.status === 'Escalated' ? 'Already Escalated' : 'Escalate'}</span>
                   </button>
                 </div>

                 {/* Resolve Action */}
                 <div className="bg-gray-700/30 rounded-lg p-4">
                   <div className="flex items-center space-x-3 mb-3">
                     <CheckCircle className="w-6 h-6 text-green-400" />
                     <h4 className="font-medium text-white">Resolve Threat</h4>
                   </div>
                   <p className="text-gray-400 text-sm mb-4">
                     Mark threat as resolved after investigation and remediation
                   </p>
                   <button
                     onClick={() => handleResolve(threat)}
                     disabled={actionLoading === `resolve-${threat.id}` || threat.status === 'Resolved'}
                     className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                   >
                     {actionLoading === `resolve-${threat.id}` ? (
                       <RefreshCw className="w-4 h-4 animate-spin" />
                     ) : (
                       <CheckCircle className="w-4 h-4" />
                     )}
                     <span>{threat.status === 'Resolved' ? 'Already Resolved' : 'Resolve'}</span>
                   </button>
                 </div>
               </div>

               {/* Action History */}
               {threat.actions.length > 0 && (
                 <div className="mt-6">
                   <h4 className="font-medium text-white mb-3">Recent Actions</h4>
                   <div className="bg-gray-700/30 rounded-lg p-4">
                     {threat.actions.slice(-3).map((action, index) => (
                       <div key={index} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                         <div className="flex items-center space-x-2">
                           <span className={`px-2 py-1 rounded text-xs font-medium ${
                             action.type === 'block' ? 'bg-purple-500/20 text-purple-400' :
                             action.type === 'escalate' ? 'bg-orange-500/20 text-orange-400' :
                             'bg-green-500/20 text-green-400'
                           }`}>
                             {action.type}
                           </span>
                           <span className="text-sm text-gray-300">by {action.user}</span>
                         </div>
                         <span className="text-xs text-gray-500">{formatTimeAgo(action.timestamp)}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           )}
         </div>
       </div>
     </div>
   );
 };

 return (
   <div className="p-6 space-y-6">
     {/* Notification Banner */}
     <NotificationBanner />

     {/* Header */}
     <div className="flex items-center justify-between">
       <div>
         <h1 className="text-2xl font-bold text-white">Threat Hunting</h1>
         <p className="text-gray-400 mt-1">Advanced threat analysis and investigation</p>
       </div>
       <div className="flex items-center space-x-3">
         <div className="flex items-center space-x-2 text-sm text-gray-400">
           <Activity className="w-4 h-4" />
           <span>{filteredThreats.length} threats found</span>
         </div>
         <button
           onClick={() => setAutoRefresh(!autoRefresh)}
           className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
             autoRefresh 
               ? 'bg-green-600 hover:bg-green-700 text-white' 
               : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
           }`}
         >
           {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
           <span>Auto Refresh</span>
         </button>
       </div>
     </div>

     {/* Search and Filter Bar */}
     <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
         <div className="flex-1 max-w-md">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input
               type="text"
               placeholder="Search threats, IPs, IOCs..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
             />
           </div>
         </div>

         <div className="flex items-center space-x-3">
           <button
             onClick={() => setShowFilters(!showFilters)}
             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
           >
             <Filter className="w-4 h-4" />
             <span>Filters</span>
             {(filters.severity.length > 0 || filters.category.length > 0 || filters.status.length > 0) && (
               <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                 {filters.severity.length + filters.category.length + filters.status.length}
               </span>
             )}
           </button>

           <button
             onClick={handleRefresh}
             disabled={loading}
             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
           >
             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             <span>Refresh</span>
           </button>

           <button
             onClick={handleExport}
             className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
           >
             <Download className="w-4 h-4" />
             <span>Export</span>
           </button>
         </div>
       </div>

       {/* Active Filters Display */}
       {(filters.severity.length > 0 || filters.category.length > 0 || filters.status.length > 0 || filters.dateRange !== 'all') && (
         <div className="mt-4 flex flex-wrap gap-2">
           {filters.severity.map(severity => (
             <span key={severity} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
               <span>Severity: {severity}</span>
               <button
                 onClick={() => setFilters(prev => ({ ...prev, severity: prev.severity.filter(s => s !== severity) }))}
                 className="hover:text-blue-300"
               >
                 <X className="w-3 h-3" />
               </button>
             </span>
           ))}
           {filters.category.map(category => (
             <span key={category} className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
               <span>Category: {category}</span>
               <button
                 onClick={() => setFilters(prev => ({ ...prev, category: prev.category.filter(c => c !== category) }))}
                 className="hover:text-purple-300"
               >
                 <X className="w-3 h-3" />
               </button>
             </span>
           ))}
           {filters.status.map(status => (
             <span key={status} className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
               <span>Status: {status}</span>
               <button
                 onClick={() => setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }))}
                 className="hover:text-green-300"
               >
                 <X className="w-3 h-3" />
               </button>
             </span>
           ))}
           {filters.dateRange !== 'all' && (
             <span className="bg-orange-600/20 text-orange-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
               <span>Time: {filters.dateRange}</span>
               <button
                 onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
                 className="hover:text-orange-300"
               >
                 <X className="w-3 h-3" />
               </button>
             </span>
           )}
         </div>
       )}
     </div>

     {/* Filter Panel */}
     {showFilters && <FilterPanel />}

     {/* Enhanced Threats Table */}
     <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
       {/* Table Controls */}
       <div className="p-4 border-b border-gray-700 flex items-center justify-between">
         <div className="flex items-center space-x-4">
           <select
             value={pageSize}
             onChange={(e) => setPageSize(Number(e.target.value))}
             className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
           >
             <option value={10}>10 per page</option>
             <option value={25}>25 per page</option>
             <option value={50}>50 per page</option>
             <option value={100}>100 per page</option>
           </select>
           
           {selectedThreats.size > 0 && (
             <div className="flex items-center space-x-2">
               <span className="text-sm text-gray-400">{selectedThreats.size} selected</span>
               <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                 Bulk Action
               </button>
             </div>
           )}
         </div>

         <div className="text-sm text-gray-400">
           Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedThreats.length)} of {sortedThreats.length} threats
         </div>
       </div>

       {/* Table */}
       <div className="overflow-x-auto">
         <table className="w-full">
           <thead className="bg-gray-700/50">
             <tr>
               <th className="p-3 text-left">
                 <input
                   type="checkbox"
                   checked={selectedThreats.size === paginatedThreats.length && paginatedThreats.length > 0}
                   onChange={(e) => {
                     if (e.target.checked) {
                       setSelectedThreats(new Set(paginatedThreats.map(t => t.id)));
                     } else {
                       setSelectedThreats(new Set());
                     }
                   }}
                   className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                 />
               </th>
               <th className="p-3 text-left">
                 <button
                   onClick={() => handleSort('id')}
                   className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                 >
                   <span>Threat ID</span>
                   <ArrowUpDown className="w-4 h-4" />
                 </button>
               </th>
               <th className="p-3 text-left">
                 <button
                   onClick={() => handleSort('title')}
                   className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                 >
                   <span>Title</span>
                   <ArrowUpDown className="w-4 h-4" />
                 </button>
               </th>
               <th className="p-3 text-left">
                 <button
                   onClick={() => handleSort('severity')}
                   className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                 >
                   <span>Severity</span>
                   <ArrowUpDown className="w-4 h-4" />
                 </button>
               </th>
               <th className="p-3 text-left">
                 <button
                   onClick={() => handleSort('status')}
                   className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                 >
                   <span>Status</span>
                   <ArrowUpDown className="w-4 h-4" />
                 </button>
               </th>
               <th className="p-3 text-left">
                 <button
                   onClick={() => handleSort('riskScore')}
                   className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                 >
                   <span>Risk Score</span>
                   <ArrowUpDown className="w-4 h-4" />
                 </button>
               </th>
               <th className="p-3 text-left">
                 <button
                   onClick={() => handleSort('sourceIP')}className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                 >
                   <span>Source IP</span>
                   <ArrowUpDown className="w-4 h-4" />
                 </button>
               </th>
               <th className="p-3 text-left">
                 <button
                   onClick={() => handleSort('timestamp')}
                   className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                 >
                   <span>Detected</span>
                   <ArrowUpDown className="w-4 h-4" />
                 </button>
               </th>
               <th className="p-3 text-left text-gray-300 font-medium text-sm">Actions</th>
             </tr>
           </thead>
           <tbody>
             {loading ? (
               <tr>
                 <td colSpan="9" className="p-8 text-center">
                   <div className="flex items-center justify-center space-x-2 text-gray-400">
                     <RefreshCw className="w-5 h-5 animate-spin" />
                     <span>Loading threats...</span>
                   </div>
                 </td>
               </tr>
             ) : paginatedThreats.length === 0 ? (
               <tr>
                 <td colSpan="9" className="p-8 text-center text-gray-400">
                   No threats found matching your criteria
                 </td>
               </tr>
             ) : (
               paginatedThreats.map((threat, index) => (
                 <tr
                   key={threat.id}
                   className={`border-t border-gray-700 hover:bg-gray-700/30 transition-colors ${
                     index % 2 === 0 ? 'bg-gray-800/30' : ''
                   }`}
                 >
                   <td className="p-3">
                     <input
                       type="checkbox"
                       checked={selectedThreats.has(threat.id)}
                       onChange={(e) => {
                         const newSelected = new Set(selectedThreats);
                         if (e.target.checked) {
                           newSelected.add(threat.id);
                         } else {
                           newSelected.delete(threat.id);
                         }
                         setSelectedThreats(newSelected);
                       }}
                       className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                     />
                   </td>
                   <td className="p-3">
                     <div className="flex items-center space-x-2">
                       <span className="font-mono text-sm text-white">{threat.id}</span>
                       {threat.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                       {threat.flagged && <Flag className="w-4 h-4 text-red-400" />}
                     </div>
                   </td>
                   <td className="p-3">
                     <div className="max-w-xs">
                       <p className="text-white font-medium text-sm truncate">{threat.title}</p>
                       <p className="text-gray-400 text-xs truncate">{threat.description}</p>
                       <div className="flex items-center space-x-2 mt-1">
                         <span className="text-xs text-gray-500">{threat.category}</span>
                         <span className="text-xs text-gray-500">•</span>
                         <span className="text-xs text-gray-500">{threat.source}</span>
                       </div>
                     </div>
                   </td>
                   <td className="p-3">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                       {threat.severity}
                     </span>
                   </td>
                   <td className="p-3">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(threat.status)}`}>
                       {threat.status}
                     </span>
                   </td>
                   <td className="p-3">
                     <div className="flex items-center space-x-2">
                       <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                         <div
                           className={`h-full ${
                             threat.riskScore >= 80 ? 'bg-red-500' :
                             threat.riskScore >= 60 ? 'bg-orange-500' :
                             threat.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                           }`}
                           style={{ width: `${threat.riskScore}%` }}
                         />
                       </div>
                       <span className="text-sm text-white">{threat.riskScore}</span>
                     </div>
                   </td>
                   <td className="p-3">
                     <div className="flex items-center space-x-2">
                       <span className="font-mono text-sm text-white">{threat.sourceIP}</span>
                       <button
                         onClick={() => navigator.clipboard.writeText(threat.sourceIP)}
                         className="text-gray-400 hover:text-white transition-colors"
                       >
                         <Copy className="w-3 h-3" />
                       </button>
                     </div>
                     <div className="flex items-center space-x-1 mt-1">
                       <MapPin className="w-3 h-3 text-gray-500" />
                       <span className="text-xs text-gray-500">{threat.country}</span>
                     </div>
                   </td>
                   <td className="p-3">
                     <div className="text-sm text-white">{formatTimeAgo(threat.timestamp)}</div>
                     <div className="text-xs text-gray-400">{new Date(threat.timestamp).toLocaleDateString()}</div>
                   </td>
                   <td className="p-3">
                     <div className="flex items-center space-x-1">
                       {/* Quick Actions */}
                       <button
                         onClick={() => setSelectedThreat(threat)}
                         className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                         title="View Details"
                       >
                         <Eye className="w-4 h-4" />
                       </button>
                       
                       {/* Quick Block */}
                       <button
                         onClick={() => handleBlockIP(threat)}
                         disabled={actionLoading === `block-${threat.id}` || threat.status === 'Blocked'}
                         className="p-1 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-colors disabled:opacity-50"
                         title="Block IP"
                       >
                         {actionLoading === `block-${threat.id}` ? (
                           <RefreshCw className="w-4 h-4 animate-spin" />
                         ) : (
                           <Shield className="w-4 h-4" />
                         )}
                       </button>

                       {/* Quick Escalate */}
                       <button
                         onClick={() => handleEscalate(threat)}
                         disabled={actionLoading === `escalate-${threat.id}` || threat.status === 'Escalated'}
                         className="p-1 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded transition-colors disabled:opacity-50"
                         title="Escalate"
                       >
                         {actionLoading === `escalate-${threat.id}` ? (
                           <RefreshCw className="w-4 h-4 animate-spin" />
                         ) : (
                           <TrendingUp className="w-4 h-4" />
                         )}
                       </button>

                       {/* Quick Resolve */}
                       <button
                         onClick={() => handleResolve(threat)}
                         disabled={actionLoading === `resolve-${threat.id}` || threat.status === 'Resolved'}
                         className="p-1 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors disabled:opacity-50"
                         title="Resolve"
                       >
                         {actionLoading === `resolve-${threat.id}` ? (
                           <RefreshCw className="w-4 h-4 animate-spin" />
                         ) : (
                           <CheckCircle className="w-4 h-4" />
                         )}
                       </button>
                     </div>
                   </td>
                 </tr>
               ))
             )}
           </tbody>
         </table>
       </div>

       {/* Pagination */}
       {totalPages > 1 && (
         <div className="p-4 border-t border-gray-700 flex items-center justify-between">
           <div className="text-sm text-gray-400">
             Page {currentPage} of {totalPages}
           </div>
           <div className="flex items-center space-x-2">
             <button
               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
               disabled={currentPage === 1}
               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
             >
               Previous
             </button>
             
             {/* Page Numbers */}
             <div className="flex items-center space-x-1">
               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                 const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                 return (
                   <button
                     key={pageNum}
                     onClick={() => setCurrentPage(pageNum)}
                     className={`px-3 py-1 rounded transition-colors ${
                       currentPage === pageNum
                         ? 'bg-blue-600 text-white'
                         : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                     }`}
                   >
                     {pageNum}
                   </button>
                 );
               })}
             </div>

             <button
               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
               disabled={currentPage === totalPages}
               className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
             >
               Next
             </button>
           </div>
         </div>
       )}
     </div>

     {/* Enhanced Threat Detail Modal */}
     {selectedThreat && (
       <ThreatDetailModal
         threat={selectedThreat}
         onClose={() => setSelectedThreat(null)}
       />
     )}
   </div>
 );
};

export default ThreatHunting;