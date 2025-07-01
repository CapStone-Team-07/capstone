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
    const [notifications, setNotifications] = useState([]);
    const [actionLoading, setActionLoading] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
      severity: [],
      level: [],
      agent: [],
      dateRange: 'all',
      ruleLevel: [0, 15]
    });

    // Mock current user
    const currentUser = {
      id: 'user-001',
      name: 'Security Administrator',
      role: 'SOC Manager'
    };

    // Wazuh API configuration
    const WAZUH_API_URL = 'https://192.168.80.11:9200';
    const API_CREDENTIALS = btoa('kibanaserver:vx?tix9ngoFqkqWc4XsMA.AXccNyTZiv');

    // Fetch threats from Wazuh API
    const fetchThreatsFromAPI = async () => {
      try {
        const query = {
          query: {
            bool: {
              filter: [
                {
                  bool: {
                    should: [
                      { range: { "rule.level": { gte: 12 } } }
                    ],
                    minimum_should_match: 1
                  }
                },
                {
                  range: {
                    "@timestamp": {
                      gte: "now-24h",
                      lte: "now"
                    }
                  }
                }
              ]
            }
          },
          sort: [
            { "@timestamp": { order: "desc" } }
          ],
          size: 100
        };

        const response = await fetch(`${WAZUH_API_URL}/wazuh-alerts-*/_search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${API_CREDENTIALS}`
          },
          body: JSON.stringify(query)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return transformWazuhData(data.hits.hits);
      } catch (error) {
        console.error('Error fetching threats from Wazuh API:', error);
        showNotification('Failed to fetch threats from Wazuh API', 'error');
        return [];
      }
    };

    // Transform Wazuh data to our threat format
    const transformWazuhData = (wazuhHits) => {
      return wazuhHits.map((hit, index) => {
        const source = hit._source;
        const rule = source.rule || {};
        const agent = source.agent || {};
        const data = source.data || {};
        const vulnerability = data.vulnerability || {};
        
        // Determine severity based on rule level
        const getSeverityFromLevel = (level) => {
          if (level >= 15) return 'Critical';
          if (level >= 12) return 'High';
          if (level >= 7) return 'Medium';
          return 'Low';
        };

        // Extract IP addresses from various sources
        const extractIPs = () => {
          let sourceIP = 'N/A';
          let targetIP = 'N/A';
          
          if (agent.ip) {
            targetIP = agent.ip;
          }
          
          // Try to extract source IP from different fields
          if (data.srcip) {
            sourceIP = data.srcip;
          } else if (data.source_ip) {
            sourceIP = data.source_ip;
          } else if (source.srcip) {
            sourceIP = source.srcip;
          }
          
          return { sourceIP, targetIP };
        };

        const { sourceIP, targetIP } = extractIPs();
        const severity = getSeverityFromLevel(rule.level || 0);
        
        // Determine category based on rule groups or description
        const getCategory = () => {
          const groups = rule.groups || [];
          const description = rule.description || '';
          
          if (groups.includes('vulnerability-detector') || vulnerability.cve) {
            return 'Vulnerability';
          }
          if (groups.includes('authentication') || groups.includes('login')) {
            return 'Authentication';
          }
          if (groups.includes('firewall') || groups.includes('iptables')) {
            return 'Network Security';
          }
          if (groups.includes('malware') || groups.includes('rootcheck')) {
            return 'Malware';
          }
          if (groups.includes('web') || groups.includes('apache')) {
            return 'Web Security';
          }
          if (groups.includes('ossec')) {
            return 'System Monitoring';
          }
          
          return 'Security Alert';
        };

        // Generate risk score based on rule level and other factors
        const calculateRiskScore = () => {
          const baseScore = (rule.level || 0) * 6.67; // Convert 0-15 scale to 0-100
          
          // Adjust based on severity factors
          let adjustedScore = baseScore;
          
          if (vulnerability.cvss && vulnerability.cvss.cvss3) {
            const cvssScore = parseFloat(vulnerability.cvss.cvss3.base_score || 0);
            adjustedScore = Math.max(adjustedScore, cvssScore * 10);
          }
          
          return Math.min(Math.round(adjustedScore), 100);
        };

        return {
          id: hit._id || `THR-${String(index + 1).padStart(6, '0')}`,
          title: rule.description || 'Security Alert',
          description: vulnerability.title || rule.description || 'Security event detected',
          severity: severity,
          category: getCategory(),
          status: 'Active',
          source: 'Wazuh',
          riskScore: calculateRiskScore(),
          sourceIP: sourceIP,
          targetIP: targetIP,
          country: 'Unknown',
          timestamp: source.timestamp || source['@timestamp'] || new Date().toISOString(),
          lastActivity: source.timestamp || source['@timestamp'] || new Date().toISOString(),
          affectedAssets: 1,
          confidence: Math.round((rule.level || 0) * 6.67),
          attackVector: vulnerability.cve || 'Unknown',
          protocol: 'N/A',
          port: 'N/A',
          iocs: rule.groups ? rule.groups.length : 0,
          mitreTactics: 'Unknown',
          analyst: 'Wazuh System',
          starred: false,
          flagged: rule.level >= 13,
          actions: [],
          notes: "",
          // Wazuh specific fields
          ruleId: rule.id,
          ruleLevel: rule.level || 0,
          ruleGroups: rule.groups || [],
          agentName: agent.name || 'Unknown',
          agentId: agent.id || 'Unknown',
          manageName: source.manager?.name || 'Unknown',
          cve: vulnerability.cve || null,
          cvssScore: vulnerability.cvss?.cvss3?.base_score || null,
          vulnerabilityType: vulnerability.type || null,
          packetInfo: vulnerability.package || null,
          rawData: source // Store original data for detailed view
        };
      });
    };

    // Initialize data
    useEffect(() => {
      const loadThreats = async () => {
        setLoading(true);
        try {
          const data = await fetchThreatsFromAPI();
          console.log("Real Time Data from Wazuh" ,data)
          setThreats(data);
          setFilteredThreats(data);
        } catch (error) {
          console.error('Error loading threats:', error);
          showNotification('Failed to load threats', 'error');
        } finally {
          setLoading(false);
        }
      };

      loadThreats();
    }, []);

    // Notification system
    const showNotification = (message, type = 'success') => {
      const id = Date.now();
      const notification = { id, message, type, timestamp: new Date() };
      setNotifications(prev => [notification, ...prev.slice(0, 4)]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    // Interactive Actions - Only Escalate remains
    const handleEscalate = async (threat) => {
      setActionLoading(`escalate-${threat.id}`);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        const severityLevels = { 'Low': 'Medium', 'Medium': 'High', 'High': 'Critical', 'Critical': 'Critical' };
        const newSeverity = severityLevels[threat.severity];
        
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
        
        if (selectedThreat?.id === threat.id) {
          setSelectedThreat(null);
        }
        
      } catch (error) {
        showNotification('Failed to escalate threat. Please try again.', 'error');
      } finally {
        setActionLoading(null);
      }
    };

    // Auto-refresh functionality
    useEffect(() => {
      let interval;
      if (autoRefresh) {
        interval = setInterval(async () => {
          const updatedData = await fetchThreatsFromAPI();
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
          threat.targetIP.includes(searchTerm) ||
          threat.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (threat.cve && threat.cve.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (filters.severity.length > 0) {
        filtered = filtered.filter(threat => filters.severity.includes(threat.severity));
      }
      if (filters.level.length > 0) {
        filtered = filtered.filter(threat => filters.level.includes(threat.ruleLevel.toString()));
      }
      if (filters.agent.length > 0) {
        filtered = filtered.filter(threat => filters.agent.includes(threat.agentName));
      }

      filtered = filtered.filter(threat => 
        threat.ruleLevel >= filters.ruleLevel[0] && 
        threat.ruleLevel <= filters.ruleLevel[1]
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

    const handleRefresh = async () => {
      setLoading(true);
      try {
        const data = await fetchThreatsFromAPI();
        setThreats(data);
        showNotification('Threat data refreshed successfully', 'success');
      } catch (error) {
        showNotification('Failed to refresh threat data', 'error');
      } finally {
        setLoading(false);
      }
    };

    const handleExport = () => {
      const csvContent = [
        ['ID', 'Title', 'Severity', 'Category', 'Rule Level', 'Agent Name', 'Source IP', 'Target IP', 'CVE', 'Timestamp'],
        ...sortedThreats.map(threat => [
          threat.id,
          threat.title,
          threat.severity,
          threat.category,
          threat.ruleLevel,
          threat.agentName,
          threat.sourceIP,
          threat.targetIP,
          threat.cve || '',
          threat.timestamp
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wazuh-threats-${new Date().toISOString().split('T')[0]}.csv`;
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

    // Get unique values for filters
    const getUniqueAgents = () => {
      return [...new Set(threats.map(t => t.agentName))].filter(Boolean);
    };

    const getUniqueLevels = () => {
      return [...new Set(threats.map(t => t.ruleLevel.toString()))].sort((a, b) => parseInt(b) - parseInt(a));
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

          {/* Rule Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rule Level</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {getUniqueLevels().map(level => (
                <label key={level} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.level.includes(level)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, level: [...prev.level, level] }));
                      } else {
                        setFilters(prev => ({ ...prev, level: prev.level.filter(l => l !== level) }));
                      }
                    }}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Level {level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Agent Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Agent</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {getUniqueAgents().map(agent => (
                <label key={agent} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.agent.includes(agent)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters(prev => ({ ...prev, agent: [...prev.agent, agent] }));
                      } else {
                        setFilters(prev => ({ ...prev, agent: prev.agent.filter(a => a !== agent) }));
                      }
                    }}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">{agent}</span>
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

          {/* Rule Level Range */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rule Level Range: {filters.ruleLevel[0]} - {filters.ruleLevel[1]}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="15"
                value={filters.ruleLevel[0]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  ruleLevel: [parseInt(e.target.value), prev.ruleLevel[1]] 
                }))}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="15"
                value={filters.ruleLevel[1]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  ruleLevel: [prev.ruleLevel[0], parseInt(e.target.value)] 
                }))}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setFilters({ severity: [], level: [], agent: [], dateRange: 'all', ruleLevel: [0, 15] })}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );

    // Enhanced Threat detail modal
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
                    <p className="text-sm text-gray-400">Wazuh Threat ID: {threat.id}</p>
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
                  {/* Wazuh Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Wazuh Threat Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Severity:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                            {threat.severity}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rule Level:</span>
                          <span className="text-white font-medium">{threat.ruleLevel}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Rule ID:</span>
                          <span className="text-white">{threat.ruleId}</span>
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
                          <span className="text-gray-400">IOCs:</span>
                          <span className="text-white">{threat.iocs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-white">{threat.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Agent Name:</span>
                          <span className="text-white">{threat.agentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Agent ID:</span>
                          <span className="text-white">{threat.agentId}</span>
                        </div>
                        {threat.cve && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">CVE:</span>
                            <span className="text-orange-400 font-mono">{threat.cve}</span>
                          </div>
                        )}
                        {threat.cvssScore && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">CVSS Score:</span>
                            <span className="text-red-400 font-medium">{threat.cvssScore}</span>
                          </div>
                        )}
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
                            {threat.sourceIP !== 'N/A' && (
                              <button
                                onClick={() => navigator.clipboard.writeText(threat.sourceIP)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Target IP:</span>
                          <span className="text-white font-mono">{threat.targetIP}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Manager:</span>
                          <span className="text-white">{threat.manageName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rule and Vulnerability Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Rule Details</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rule Groups:</span>
                          <div className="flex flex-wrap gap-1">
                            {threat.ruleGroups.map((group, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                                {group}
                              </span>
                            ))}
                          </div>
                        </div>
                        {threat.vulnerabilityType && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Vulnerability Type:</span>
                            <span className="text-white">{threat.vulnerabilityType}</span>
                          </div>
                        )}
                        {threat.packetInfo && (
                          <div>
                            <span className="text-gray-400 block mb-2">Package Information:</span>
                            <div className="bg-gray-700/30 p-3 rounded-lg text-sm">
                              <div className="space-y-1">
                                {threat.packetInfo.name && (
                                  <div><span className="text-gray-400">Name:</span> <span className="text-white">{threat.packetInfo.name}</span></div>
                                )}
                                {threat.packetInfo.version && (
                                  <div><span className="text-gray-400">Version:</span> <span className="text-white">{threat.packetInfo.version}</span></div>
                                )}
                                {threat.packetInfo.condition && (
                                  <div><span className="text-gray-400">Condition:</span> <span className="text-white">{threat.packetInfo.condition}</span></div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
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
                        {threat.escalatedAt && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Escalated At:</span>
                            <span className="text-orange-400">{new Date(threat.escalatedAt).toLocaleString()}</span>
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
                        <p className="text-white font-medium">Threat Detected by Wazuh</p>
                        <p className="text-gray-400 text-sm">Rule {threat.ruleId} triggered - Level {threat.ruleLevel}</p>
                        <p className="text-gray-500 text-xs">{new Date(threat.timestamp).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Actions timeline */}
                    {threat.actions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          action.type === 'escalate' ? 'bg-orange-500/20' : 'bg-gray-500/20'
                        }`}>
                          {action.type === 'escalate' && <TrendingUp className="w-4 h-4 text-orange-400" />}
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
                        <p className="text-gray-400">No manual actions taken yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'actions' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Available Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Escalate Action */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                        <h4 className="font-medium text-white">Escalate Alert</h4>
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

                    {/* View in Wazuh */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <ExternalLink className="w-6 h-6 text-blue-400" />
                        <h4 className="font-medium text-white">View in Wazuh</h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Open this alert in the Wazuh dashboard for detailed analysis
                      </p>
                      <button
                        onClick={() => window.open(`https://192.168.80.11:5601/app/wazuh#/manager/?tab=ruleset&redirectRule=${threat.ruleId}`, '_blank')}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in Wazuh</span>
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
                                action.type === 'escalate' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'
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

                  {/* Raw Data Preview */}
                  <div className="mt-6">
                    <h4 className="font-medium text-white mb-3">Raw Alert Data</h4>
                    <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="text-green-400 text-xs font-mono">
                        {JSON.stringify(threat.rawData, null, 2)}
                      </pre>
                    </div>
                  </div>
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
            <h1 className="text-2xl font-bold text-white">Wazuh Threats</h1>
            <p className="text-gray-400 mt-1">Real-time security alerts from Wazuh SIEM</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Activity className="w-4 h-4" />
              <span>{filteredThreats.length} alerts found</span>
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
                  placeholder="Search alerts, CVEs, agents, IPs..."
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
                {(filters.severity.length > 0 || filters.level.length > 0 || filters.agent.length > 0) && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                    {filters.severity.length + filters.level.length + filters.agent.length}
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
          {(filters.severity.length > 0 || filters.level.length > 0 || filters.agent.length > 0 || filters.dateRange !== 'all') && (
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
              {filters.level.map(level => (
                <span key={level} className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <span>Level: {level}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, level: prev.level.filter(l => l !== level) }))}
                    className="hover:text-purple-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.agent.map(agent => (
                <span key={agent} className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <span>Agent: {agent}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, agent: prev.agent.filter(a => a !== agent) }))}
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

        {/* Threats Table */}
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
            </div>

            <div className="text-sm text-gray-400">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedThreats.length)} of {sortedThreats.length} alerts
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
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
                      <span>Description</span>
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
                      onClick={() => handleSort('ruleLevel')}
                      className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                    >
                      <span>Rule Level</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="p-3 text-left">
                    <button
                      onClick={() => handleSort('agentName')}
                      className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                    >
                      <span>Agent</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="p-3 text-left">
                    <button
                      onClick={() => handleSort('sourceIP')}
                      className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                    >
                      <span>Agent IP</span>
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
                    <td colSpan="8" className="p-8 text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Loading alerts from Wazuh...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedThreats.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-400">
                      No alerts found matching your criteria
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
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-white truncate max-w-32">{threat.id}</span>
                          {threat.flagged && <Flag className="w-4 h-4 text-red-400" />}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="max-w-xs">
                          <p className="text-white font-medium text-sm truncate">{threat.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">{threat.category}</span>
                            {threat.cve && (
                              <>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-orange-400 font-mono">{threat.cve}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                          {threat.severity}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            threat.ruleLevel >= 13 ? 'bg-red-500/20 text-red-400' :
                            threat.ruleLevel >= 10 ? 'bg-orange-500/20 text-orange-400' :
                            threat.ruleLevel >= 7 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {threat.ruleLevel}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-white text-sm">{threat.agentName}</p>
                          <p className="text-gray-400 text-xs">ID: {threat.agentId}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          {/* Source IP changed to Agent IP  */}
                          <span className="font-mono text-sm text-white">{threat.rawData.agent.ip}</span>
                          {threat.sourceIP !== 'N/A' && (
                            <button
                              onClick={() => navigator.clipboard.writeText(threat.sourceIP)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-white">{formatTimeAgo(threat.timestamp)}</div>
                        <div className="text-xs text-gray-400">{new Date(threat.timestamp).toLocaleDateString()}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedThreat(threat)}
                            className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
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

                          {/* External Link to Wazuh */}
                          <button
                            onClick={() => window.open(`https://192.168.80.11:5601/app/wazuh#/manager/?tab=ruleset&redirectRule=${threat.ruleId}`, '_blank')}
                            className="p-1 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                            title="View in Wazuh"
                          >
                            <ExternalLink className="w-4 h-4" />
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

        {/* Connection Status */}
        <div className="fixed bottom-4 right-4 z-40">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
            threats.length > 0 
              ? 'bg-green-900/90 border border-green-700 text-green-100' 
              : 'bg-red-900/90 border border-red-700 text-red-100'
          } backdrop-blur-sm`}>
            <div className={`w-2 h-2 rounded-full ${threats.length > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
            <span>
              {threats.length > 0 
                ? `Connected to Wazuh (${threats.length} alerts)` 
                : 'Disconnected from Wazuh'
              }
            </span>
          </div>
        </div>
      </div>
    );
  };

  export default ThreatHunting; 