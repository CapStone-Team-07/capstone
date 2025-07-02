// components/dashboard/Alerts.jsx - Wazuh Security Alerts Management Component
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
  TrendingUp,
  Tag,
  Edit,
  Save,
  Plus,
  Minus,
  Check,
  AlertOctagon,
  Layers,
  Terminal,
  Code,
  HardDrive,
  Wifi,
  Monitor,
  Archive,
  Zap
} from 'lucide-react';

const Alerts = () => {
  // State management
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [alertToAssign, setAlertToAssign] = useState(null);

  // Filter states for Wazuh-specific data
  const [filters, setFilters] = useState({
    level: [], // Wazuh alert levels (0-15)
    rule_groups: [], // Wazuh rule groups
    agent_name: [], // Wazuh agents
    rule_description: [],
    location: [], // Log locations
    dateRange: 'all',
    rule_level: [0, 15]
  });

  // Wazuh-specific rule groups and descriptions
  const wazuhRuleGroups = [
    'authentication', 'syslog', 'sshd', 'apache', 'web', 'windows',
    'firewall', 'ids', 'intrusion_detection', 'policy_monitoring',
    'vulnerability-detector', 'rootcheck', 'sca', 'docker',
    'aws', 'gcp', 'azure', 'office365', 'github', 'virustotal'
  ];

  const wazuhAgents = [
    'wazuh-manager', 'web-server-01', 'db-server-01', 'mail-server-01',
    'dc-server-01', 'file-server-01', 'backup-server-01', 'proxy-server-01',
    'fw-checkpoint-01', 'workstation-001', 'workstation-002', 'workstation-003'
  ];

  const wazuhLocations = [
    '/var/log/auth.log', '/var/log/syslog', '/var/log/apache2/access.log',
    '/var/log/apache2/error.log', 'Security', 'Application', 'System',
    'WinEventLog', 'osquery', 'command', 'full_command'
  ];

  // Available users for assignment
  const availableUsers = [
    { id: 'user-001', name: 'Fidan Huseynova', role: 'Senior SOC Analyst', email: 'f.huseynova@company.com', avatar: '👧' },
    { id: 'user-002', name: 'Hasan Hamidov', role: 'SOC Analyst', email: 'h.hamidov@company.com', avatar: '👨🏿‍🦲' },
    { id: 'user-003', name: 'Gulyaz Ismayilzada', role: 'Security Engineer', email: 'g.ismayilzada@company.com', avatar: '👩‍💼' },
    // { id: 'user-004', name: 'Emily Davis', role: 'Incident Responder', email: 'emily.davis@company.com', avatar: '👩‍💼' },
    // { id: 'user-005', name: 'David Wilson', role: 'Threat Analyst', email: 'david.wilson@company.com', avatar: '🧔🏽‍♂️' },
    // { id: 'user-006', name: 'Lisa Rodriguez', role: 'SOC Manager', email: 'lisa.rodriguez@company.com', avatar: '👩‍💻' }
  ];

  // Initialize with Wazuh-formatted mock data
  const initializeWazuhAlerts = () => {
    const levels = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const ruleGroups = wazuhRuleGroups;
    const agents = wazuhAgents;
    const locations = wazuhLocations;
    
    const ruleDescriptions = [
      'SSH authentication success',
      'SSH authentication failure',
      'Apache error log',
      'Windows Logon Success',
      'Windows Logon Failure',
      'File integrity monitoring event',
      'System shutdown',
      'New user created',
      'User deleted',
      'Password changed',
      'Privilege escalation attempt',
      'Suspicious command execution',
      'Malware detected',
      'Vulnerability found',
      'Configuration assessment failed',
      'Docker container started',
      'AWS CloudTrail login',
      'Firewall connection blocked',
      'IDS signature match',
      'Rootkit detected'
    ];

    const mockAlerts = [];
    for (let i = 1; i <= 50; i++) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const ruleGroup = ruleGroups[Math.floor(Math.random() * ruleGroups.length)];
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const ruleDescription = ruleDescriptions[Math.floor(Math.random() * ruleDescriptions.length)];
      
      const baseTime = Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000);
      const ruleId = 1000 + Math.floor(Math.random() * 99000);
      
      const alert = {
        id: `${Date.now()}-${i}`,
        timestamp: new Date(baseTime).toISOString(),
        rule: {
          id: ruleId,
          level: level,
          description: ruleDescription,
          groups: [ruleGroup, 'wazuh'],
          firedtimes: Math.floor(Math.random() * 100) + 1,
          frequency: Math.floor(Math.random() * 10) + 1,
          pci_dss: level >= 10 ? ['10.2.4', '10.2.5'] : [],
          gdpr: level >= 10 ? ['IV_35.7.d'] : [],
          hipaa: level >= 10 ? ['164.312.b'] : [],
          nist_800_53: level >= 10 ? ['AU.14', 'AC.7'] : [],
          tsc: level >= 10 ? ['CC6.1', 'CC6.8'] : []
        },
        agent: {
          id: `00${Math.floor(Math.random() * 99)}`,
          name: agent,
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        },
        manager: {
          name: 'wazuh-manager'
        },
        cluster: {
          name: 'wazuh-cluster',
          node: 'master'
        },
        location: location,
        decoder: {
          name: ruleGroup === 'sshd' ? 'sshd' : 
                ruleGroup === 'apache' ? 'apache-errorlog' :
                ruleGroup === 'windows' ? 'windows-event' : 'syslog'
        },
        data: {
          srcip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          dstport: Math.floor(Math.random() * 65535),
          protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
          action: level >= 10 ? 'BLOCK' : 'ALLOW',
          url: ruleGroup === 'web' ? `/path/to/resource${i}` : undefined,
          user: ruleGroup === 'authentication' ? `user${Math.floor(Math.random() * 100)}` : undefined,
          command: ruleGroup === 'syslog' ? `command${i}` : undefined
        },
        full_log: `${new Date(baseTime).toISOString().slice(0, 19)} ${agent} ${ruleDescription}: Sample log entry for alert ${i}`,
        predecoder: {
          program_name: ruleGroup === 'sshd' ? 'sshd' : 
                       ruleGroup === 'apache' ? 'apache2' :
                       ruleGroup === 'windows' ? 'WinEvtLog' : 'kernel',
          timestamp: new Date(baseTime).toISOString().slice(0, 19),
          hostname: agent
        },
        // Custom fields for UI
        starred: Math.random() > 0.9,
        flagged: Math.random() > 0.8,
        acknowledged: Math.random() > 0.7,
        tags: Math.random() > 0.8 ? ['critical', 'investigate'] : [],
        notes: '',
        assignedTo: Math.random() > 0.6 ? availableUsers[Math.floor(Math.random() * availableUsers.length)] : null,
        assignedAt: Math.random() > 0.6 ? new Date(baseTime + 60000).toISOString() : null
      };

      mockAlerts.push(alert);
    }
    
    return mockAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Initialize data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const data = initializeWazuhAlerts();
      setAlerts(data);
      setFilteredAlerts(data);
      setLoading(false);
    }, 1000);
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

  // Assign alert to user
  const handleAssignAlert = async (alertId, user) => {
    try {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? {
                ...alert,
                assignedTo: user,
                assignedAt: new Date().toISOString()
              }
            : alert
        )
      );

      showNotification(`Alert assigned to ${user.name}`, 'success');
      setShowAssignModal(false);
      setAlertToAssign(null);
      
    } catch (error) {
      showNotification('Failed to assign alert. Please try again.', 'error');
    }
  };

  // Unassign alert
  const handleUnassignAlert = async (alertId) => {
    try {
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? {
                ...alert,
                assignedTo: null,
                assignedAt: null
              }
            : alert
        )
      );

      showNotification('Alert unassigned successfully', 'success');
      
    } catch (error) {
      showNotification('Failed to unassign alert. Please try again.', 'error');
    }
  };
  const handleArchiveAlerts = async () => {
    if (selectedAlerts.size === 0) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAlerts(prevAlerts => 
        prevAlerts.filter(alert => !selectedAlerts.has(alert.id))
      );

      showNotification(`${selectedAlerts.size} alerts archived successfully`, 'success');
      setSelectedAlerts(new Set());
      
    } catch (error) {
      showNotification('Failed to archive alerts. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Export alerts to JSON (Wazuh format)
  const handleExportWazuhFormat = () => {
    const wazuhExport = {
      alerts: sortedAlerts.map(alert => ({
        timestamp: alert.timestamp,
        rule: alert.rule,
        agent: alert.agent,
        manager: alert.manager,
        location: alert.location,
        decoder: alert.decoder,
        data: alert.data,
        full_log: alert.full_log,
        predecoder: alert.predecoder
      })),
      total: sortedAlerts.length,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(wazuhExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wazuh-alerts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Wazuh alerts exported successfully', 'success');
  };

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        const updatedData = initializeWazuhAlerts();
        setAlerts(updatedData);
        showNotification('Alert data refreshed', 'info');
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter and search logic
  useEffect(() => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.data.srcip?.includes(searchTerm) ||
        alert.data.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.rule.id.toString().includes(searchTerm)
      );
    }

    if (filters.level.length > 0) {
      filtered = filtered.filter(alert => filters.level.includes(alert.rule.level));
    }
    if (filters.rule_groups.length > 0) {
      filtered = filtered.filter(alert => 
        alert.rule.groups.some(group => filters.rule_groups.includes(group))
      );
    }
    if (filters.location.length > 0) {
      filtered = filtered.filter(alert => filters.location.includes(alert.location));
    }
    if (filters.agent_name.length > 0) {
      filtered = filtered.filter(alert => filters.agent_name.includes(alert.agent.name));
    }

    filtered = filtered.filter(alert => 
      alert.rule.level >= filters.rule_level[0] && 
      alert.rule.level <= filters.rule_level[1]
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
      
      filtered = filtered.filter(alert => new Date(alert.timestamp) >= cutoff);
    }

    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [searchTerm, filters, alerts]);

  // Sorting logic
  const sortedAlerts = useMemo(() => {
    const sorted = [...filteredAlerts].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'timestamp':
          return sortConfig.direction === 'asc' 
            ? new Date(a.timestamp) - new Date(b.timestamp)
            : new Date(b.timestamp) - new Date(a.timestamp);
        case 'rule.level':
          aValue = a.rule.level;
          bValue = b.rule.level;
          break;
        case 'rule.description':
          aValue = a.rule.description;
          bValue = b.rule.description;
          break;
        case 'agent.name':
          aValue = a.agent.name;
          bValue = b.agent.name;
          break;
        default:
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
      }

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [filteredAlerts, sortConfig]);

  // Pagination logic
  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedAlerts.slice(startIndex, startIndex + pageSize);
  }, [sortedAlerts, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedAlerts.length / pageSize);

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
      const data = initializeWazuhAlerts();
      setAlerts(data);
      setLoading(false);
      showNotification('Wazuh alerts refreshed successfully', 'success');
    }, 1000);
  };

  const getLevelColor = (level) => {
    if (level >= 12) return 'text-red-400 bg-red-500/20';
    if (level >= 9) return 'text-orange-400 bg-orange-500/20';
    if (level >= 6) return 'text-yellow-400 bg-yellow-500/20';
    if (level >= 3) return 'text-blue-400 bg-blue-500/20';
    return 'text-gray-400 bg-gray-500/20';
  };

  const getLevelLabel = (level) => {
    if (level >= 12) return 'Critical';
    if (level >= 9) return 'High';
    if (level >= 6) return 'Medium';
    if (level >= 3) return 'Low';
    return 'Info';
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

  // User Assignment Modal
  const UserAssignmentModal = ({ alert, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Assign Alert</h3>
              <p className="text-sm text-gray-400 mt-1">Rule {alert?.rule.id} - {alert?.rule.description}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {/* Current Assignment */}
            {alert?.assignedTo && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                      {alert.assignedTo.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium">{alert.assignedTo.name}</p>
                      <p className="text-blue-400 text-sm">{alert.assignedTo.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnassignAlert(alert.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    Unassign
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Assigned {alert.assignedAt ? formatTimeAgo(alert.assignedAt) : 'recently'}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {alert?.assignedTo ? 'Reassign to:' : 'Assign to:'}
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableUsers
                  .filter(user => user.id !== alert?.assignedTo?.id)
                  .map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleAssignAlert(alert.id, user)}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-gray-400 text-sm">{user.role}</p>
                        <p className="text-gray-500 text-xs">{user.email}</p>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Responsive Filter Panel Component
  const FilterPanel = () => (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4 ${
      showMobileFilters ? 'block' : 'hidden lg:block'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={() => {
            setShowFilters(false);
            setShowMobileFilters(false);
          }}
          className="text-gray-400 hover:text-white lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Alert Level Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Alert Level</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {[15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3].map(level => (
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
                <span className="text-sm text-gray-300">Level {level} ({getLevelLabel(level)})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rule Groups Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Rule Groups</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {wazuhRuleGroups.slice(0, 10).map(group => (
              <label key={group} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.rule_groups.includes(group)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, rule_groups: [...prev.rule_groups, group] }));
                    } else {
                      setFilters(prev => ({ ...prev, rule_groups: prev.rule_groups.filter(g => g !== group) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{group}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Agent Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Agents</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {wazuhAgents.slice(0, 8).map(agent => (
              <label key={agent} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.agent_name.includes(agent)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, agent_name: [...prev.agent_name, agent] }));
                    } else {
                      setFilters(prev => ({ ...prev, agent_name: prev.agent_name.filter(a => a !== agent) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{agent}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Log Locations</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {wazuhLocations.slice(0, 6).map(location => (
              <label key={location} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.location.includes(location)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, location: [...prev.location, location] }));
                    } else {
                      setFilters(prev => ({ ...prev, location: prev.location.filter(l => l !== location) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300 truncate">{location}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Time Range</label>
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
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Rule Level: {filters.rule_level[0]} - {filters.rule_level[1]}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="15"
              value={filters.rule_level[0]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                rule_level: [parseInt(e.target.value), prev.rule_level[1]] 
              }))}
              className="flex-1"
            />
            <input
              type="range"
              min="0"
              max="15"
              value={filters.rule_level[1]}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                rule_level: [prev.rule_level[0], parseInt(e.target.value)] 
              }))}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => setFilters({ 
            level: [], 
            rule_groups: [], 
            agent_name: [], 
            rule_description: [], 
            location: [], 
            dateRange: 'all', 
            rule_level: [0, 15] 
          })}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={() => {
            setShowFilters(false);
            setShowMobileFilters(false);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Enhanced Wazuh Alert Detail Modal
  const WazuhAlertDetailModal = ({ alert, onClose }) => {
    const [activeTab, setActiveTab] = useState('details');
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getLevelColor(alert.rule.level).split(' ')[1]}`} />
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-white truncate">{alert.rule.description}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-sm text-gray-400">Rule {alert.rule.id}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(alert.rule.level)}`}>
                      Level {alert.rule.level}
                    </span>
                    {alert.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                    {alert.flagged && <Flag className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile-friendly Tab Navigation */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { id: 'details', label: 'Details', icon: Info },
                { id: 'rule', label: 'Rule Info', icon: Code },
                { id: 'compliance', label: 'Compliance', icon: CheckCircle },
                { id: 'raw', label: 'Raw Log', icon: Terminal }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alert Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Alert Information</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-400">Level:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(alert.rule.level)} mt-1 sm:mt-0 self-start sm:self-auto`}>
                          {alert.rule.level} - {getLevelLabel(alert.rule.level)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Description:</span>
                        <span className="text-white mt-1 sm:mt-0 sm:text-right sm:max-w-xs break-words">{alert.rule.description}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Groups:</span>
                        <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
                          {alert.rule.groups.map((group, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Fired Times:</span>
                        <span className="text-white mt-1 sm:mt-0">{alert.rule.firedtimes}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Frequency:</span>
                        <span className="text-white mt-1 sm:mt-0">{alert.rule.frequency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Agent Information</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Agent ID:</span>
                        <span className="text-white font-mono mt-1 sm:mt-0">{alert.agent.id}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Agent Name:</span>
                        <span className="text-white mt-1 sm:mt-0">{alert.agent.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Agent IP:</span>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          <span className="text-white font-mono">{alert.agent.ip}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(alert.agent.ip)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Manager:</span>
                        <span className="text-white mt-1 sm:mt-0">{alert.manager.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network & System Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">System Information</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white font-mono text-sm mt-1 sm:mt-0 break-all">{alert.location}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Decoder:</span>
                        <span className="text-white mt-1 sm:mt-0">{alert.decoder.name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Program:</span>
                        <span className="text-white mt-1 sm:mt-0">{alert.predecoder.program_name}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Hostname:</span>
                        <span className="text-white mt-1 sm:mt-0">{alert.predecoder.hostname}</span>
                      </div>
                    </div>
                  </div>

                  {/* Network Data */}
                  {alert.data.srcip && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Network Information</h3>
                      <div className="space-y-3">
                        {alert.data.srcip && (
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-gray-400">Source IP:</span>
                            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                              <span className="text-white font-mono">{alert.data.srcip}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(alert.data.srcip)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {alert.data.dstport && (
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-gray-400">Destination Port:</span>
                            <span className="text-white mt-1 sm:mt-0">{alert.data.dstport}</span>
                          </div>
                        )}
                        {alert.data.protocol && (
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-gray-400">Protocol:</span>
                            <span className="text-white mt-1 sm:mt-0">{alert.data.protocol}</span>
                          </div>
                        )}
                        {alert.data.action && (
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-gray-400">Action:</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium mt-1 sm:mt-0 self-start sm:self-auto ${
                              alert.data.action === 'BLOCK' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {alert.data.action}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Data */}
                  {(alert.data.user || alert.data.url || alert.data.command) && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Additional Data</h3>
                      <div className="space-y-3">
                        {alert.data.user && (
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-gray-400">User:</span>
                            <span className="text-white mt-1 sm:mt-0">{alert.data.user}</span>
                          </div>
                        )}
                        {alert.data.url && (
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-gray-400">URL:</span>
                            <span className="text-white font-mono text-sm mt-1 sm:mt-0 break-all">{alert.data.url}</span>
                          </div>
                        )}
                        {alert.data.command && (
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <span className="text-gray-400">Command:</span>
                            <span className="text-white font-mono text-sm mt-1 sm:mt-0 break-all">{alert.data.command}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Timeline</h3>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-white mt-1 sm:mt-0">{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <span className="text-gray-400">Time Ago:</span>
                        <span className="text-white mt-1 sm:mt-0">{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rule' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Rule Details</h3>
                  <div className="bg-gray-700/30 rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Rule ID</label>
                        <div className="text-white font-mono bg-gray-800 px-3 py-2 rounded">{alert.rule.id}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                        <div className="text-white bg-gray-800 px-3 py-2 rounded">{alert.rule.level}</div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <div className="text-white bg-gray-800 px-3 py-2 rounded break-words">{alert.rule.description}</div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Groups</label>
                      <div className="flex flex-wrap gap-2">
                        {alert.rule.groups.map((group, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Fired Times</label>
                        <div className="text-white bg-gray-800 px-3 py-2 rounded">{alert.rule.firedtimes}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Frequency</label>
                        <div className="text-white bg-gray-800 px-3 py-2 rounded">{alert.rule.frequency}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Compliance Standards</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* PCI DSS */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <h4 className="font-medium text-white">PCI DSS</h4>
                      </div>
                      {alert.rule.pci_dss.length > 0 ? (
                        <div className="space-y-1">
                          {alert.rule.pci_dss.map((pci, index) => (
                            <span key={index} className="block text-sm text-green-400 font-mono">{pci}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Not applicable</span>
                      )}
                    </div>

                    {/* GDPR */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Shield className="w-5 h-5 text-purple-400" />
                        <h4 className="font-medium text-white">GDPR</h4>
                      </div>
                      {alert.rule.gdpr.length > 0 ? (
                        <div className="space-y-1">
                          {alert.rule.gdpr.map((gdpr, index) => (
                            <span key={index} className="block text-sm text-green-400 font-mono">{gdpr}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Not applicable</span>
                      )}
                    </div>

                    {/* HIPAA */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <h4 className="font-medium text-white">HIPAA</h4>
                      </div>
                      {alert.rule.hipaa.length > 0 ? (
                        <div className="space-y-1">
                          {alert.rule.hipaa.map((hipaa, index) => (
                            <span key={index} className="block text-sm text-green-400 font-mono">{hipaa}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Not applicable</span>
                      )}
                    </div>

                    {/* NIST 800-53 */}
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Shield className="w-5 h-5 text-orange-400" />
                        <h4 className="font-medium text-white">NIST 800-53</h4>
                      </div>
                      {alert.rule.nist_800_53.length > 0 ? (
                        <div className="space-y-1">
                          {alert.rule.nist_800_53.map((nist, index) => (
                            <span key={index} className="block text-sm text-green-400 font-mono">{nist}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Not applicable</span>
                      )}
                    </div>
                  </div>

                  {/* TSC */}
                  {alert.rule.tsc.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-white mb-2">TSC (Trust Services Criteria)</h4>
                      <div className="bg-gray-700/30 rounded-lg p-3">
                        <div className="flex flex-wrap gap-2">
                          {alert.rule.tsc.map((tsc, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm font-mono">
                              {tsc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'raw' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Raw Log Data</h3>
                  
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Full Log Entry</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(alert.full_log)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap break-words">
                      {alert.full_log}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">JSON Alert Data</h3>
                  
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Structured Alert Data</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify({
                          timestamp: alert.timestamp,
                          rule: alert.rule,
                          agent: alert.agent,
                          manager: alert.manager,
                          location: alert.location,
                          decoder: alert.decoder,
                          data: alert.data,
                          predecoder: alert.predecoder
                        }, null, 2))}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-blue-400 font-mono text-sm whitespace-pre-wrap break-words">
                      {JSON.stringify({
                        timestamp: alert.timestamp,
                        rule: alert.rule,
                        agent: alert.agent,
                        manager: alert.manager,
                        location: alert.location,
                        decoder: alert.decoder,
                        data: alert.data,
                        predecoder: alert.predecoder
                      }, null, 2)}
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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Notification Banner */}
      <NotificationBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Security Incidents</h1>
          {/* <p className="text-gray-400 mt-1 text-sm sm:text-base">Monitor and analyze Wazuh SIEM alerts in real-time</p> */}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            <span>{filteredAlerts.length} alerts</span>
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
            <span className="hidden sm:inline">Auto Refresh</span>
            <span className="sm:hidden">Auto</span>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="space-y-4">
          {/* Search and action buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rules, agents, IPs, users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowFilters(!showFilters);
                  setShowMobileFilters(!showMobileFilters);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {(filters.level.length > 0 || filters.rule_groups.length > 0 || filters.agent_name.length > 0 || filters.location.length > 0) && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                    {filters.level.length + filters.rule_groups.length + filters.agent_name.length + filters.location.length}
                  </span>
                )}
              </button>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleExportWazuhFormat}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.level.length > 0 || filters.rule_groups.length > 0 || filters.agent_name.length > 0 || filters.location.length > 0 || filters.dateRange !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {filters.level.map(level => (
                <span key={level} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <span>Level {level}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, level: prev.level.filter(l => l !== level) }))}
                    className="hover:text-blue-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.rule_groups.map(group => (
                <span key={group} className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <span>{group}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, rule_groups: prev.rule_groups.filter(g => g !== group) }))}
                    className="hover:text-purple-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.agent_name.map(agent => (
                <span key={agent} className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <span>{agent}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, agent_name: prev.agent_name.filter(a => a !== agent) }))}
                    className="hover:text-green-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.dateRange !== 'all' && (
                <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <span>Time: {filters.dateRange}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
                    className="hover:text-yellow-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && <FilterPanel />}

      {/* Responsive Alerts Table/Cards */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
            
            {selectedAlerts.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{selectedAlerts.size} selected</span>
                <button 
                  onClick={handleArchiveAlerts}
                  disabled={loading}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:opacity-50 text-white text-sm rounded transition-colors flex items-center space-x-1"
                >
                  {loading ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Archive className="w-3 h-3" />
                  )}
                  <span>Archive</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedAlerts.length)} of {sortedAlerts.length} alerts
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="p-3 text-left">
                  {/* <input
                    type="checkbox"
                    checked={selectedAlerts.size === paginatedAlerts.length && paginatedAlerts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlerts(new Set(paginatedAlerts.map(a => a.id)));
                      } else {
                        setSelectedAlerts(new Set());
                      }
                    }}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  /> */}
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('rule.id')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Rule ID</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('rule.description')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Description</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('rule.level')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Level</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('agent.name')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Agent</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <span className="text-gray-300 font-medium text-sm">Groups</span>
                </th>
                <th className="p-3 text-left">
                  <span className="text-gray-300 font-medium text-sm">Source IP</span>
                </th>
                <th className="p-3 text-left">
                  <span className="text-gray-300 font-medium text-sm">Assigned</span>
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left text-gray-300 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-400">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Loading Wazuh alerts...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center text-gray-400">
                    No alerts found matching your criteria
                  </td>
                </tr>
              ) : (
                paginatedAlerts.map((alert, index) => (
                  <tr
                    key={alert.id}
                    className={`border-t border-gray-700 hover:bg-gray-700/30 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-800/30' : ''
                    }`}
                  >
                    <td className="p-3">
                      {/* <input
                        type="checkbox"
                        checked={selectedAlerts.has(alert.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedAlerts);
                          if (e.target.checked) {
                            newSelected.add(alert.id);
                          } else {
                            newSelected.delete(alert.id);
                          }
                          setSelectedAlerts(newSelected);
                        }}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      /> */}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-white">{alert.rule.id}</span>
                        {alert.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                        {alert.flagged && <Flag className="w-4 h-4 text-red-400" />}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="max-w-xs">
                        <p className="text-white font-medium text-sm truncate">{alert.rule.description}</p>
                        <p className="text-gray-400 text-xs truncate">{alert.location}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(alert.rule.level)}`}>
                        {alert.rule.level}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        <p className="text-white text-sm">{alert.agent.name}</p>
                        <p className="text-gray-400 text-xs font-mono">{alert.agent.ip}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {alert.rule.groups.slice(0, 2).map((group, groupIndex) => (
                          <span key={groupIndex} className="px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                            {group}
                          </span>
                        ))}
                        {alert.rule.groups.length > 2 && (
                          <span className="text-gray-400 text-xs">+{alert.rule.groups.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {alert.data.srcip ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-mono text-sm">{alert.data.srcip}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(alert.data.srcip)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {alert.assignedTo ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                            {alert.assignedTo.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm truncate">{alert.assignedTo.name}</p>
                            <p className="text-gray-400 text-xs truncate">{alert.assignedTo.role}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-white">{formatTimeAgo(alert.timestamp)}</div>
                      <div className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setAlertToAssign(alert);
                            setShowAssignModal(true);
                          }}
                          className="p-1 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-colors"
                          title="Assign User"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(alert, null, 2))}
                          className="p-1 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                          title="Copy JSON"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-400">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading alerts...</span>
              </div>
            </div>
          ) : paginatedAlerts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No alerts found matching your criteria
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {paginatedAlerts.map((alert) => (
                <div key={alert.id} className="bg-gray-700/30 rounded-lg p-4 space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.has(alert.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedAlerts);
                          if (e.target.checked) {
                            newSelected.add(alert.id);
                          } else {
                            newSelected.delete(alert.id);
                          }
                          setSelectedAlerts(newSelected);
                        }}
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-white">Rule {alert.rule.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(alert.rule.level)}`}>
                            L{alert.rule.level}
                          </span>
                        </div>
                        <p className="text-white font-medium text-sm mt-1 truncate">{alert.rule.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                      {alert.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                      {alert.flagged && <Flag className="w-4 h-4 text-red-400" />}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Agent:</span>
                      <p className="text-white truncate">{alert.agent.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">IP:</span>
                      <p className="text-white font-mono truncate">{alert.agent.ip}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Source IP:</span>
                      <p className="text-white font-mono truncate">{alert.data.srcip || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Time:</span>
                      <p className="text-white">{formatTimeAgo(alert.timestamp)}</p>
                    </div>
                  </div>

                  {/* Groups */}
                  <div>
                    <span className="text-gray-400 text-sm">Groups:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {alert.rule.groups.map((group, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assignment Info */}
                  {alert.assignedTo && (
                    <div>
                      <span className="text-gray-400 text-sm">Assigned to:</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                          {alert.assignedTo.avatar}
                        </div>
                        <div>
                          <p className="text-white text-sm">{alert.assignedTo.name}</p>
                          <p className="text-gray-400 text-xs">{alert.assignedTo.role}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                    <div className="text-xs text-gray-400 truncate">
                      Location: {alert.location}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setAlertToAssign(alert);
                          setShowAssignModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                        title="Assign User"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(alert, null, 2))}
                        className="p-1 text-gray-400 hover:text-green-400 transition-colors"
                        title="Copy JSON"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-400 text-center sm:text-left">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers - Responsive */}
              <div className="hidden sm:flex items-center space-x-1">
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

              {/* Mobile page indicator */}
              <div className="sm:hidden px-3 py-1 bg-gray-700 rounded text-white text-sm">
                {currentPage} / {totalPages}
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

      {/* Wazuh Alert Detail Modal */}
      {selectedAlert && (
        <WazuhAlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}

      {/* User Assignment Modal */}
      {showAssignModal && alertToAssign && (
        <UserAssignmentModal
          alert={alertToAssign}
          onClose={() => {
            setShowAssignModal(false);
            setAlertToAssign(null);
          }}
        />
      )}
    </div>
  );
};

export default Alerts;