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
  TrendingUp,
  Layers,
  Terminal,
  HardDrive,
  Wifi
} from 'lucide-react';

const ThreatHunting = () => {
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
  const [actionLoading, setActionLoading] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    level: [],
    rule: [],
    agent: [],
    location: [],
    dateRange: 'all',
    riskScore: [0, 15]
  });

  // Mock current user
  const currentUser = {
    id: 'soc-analyst-001',
    name: 'SOC Analyst',
    role: 'Security Analyst'
  };

  // Initialize with Wazuh-like alert data
  const initializeWazuhAlerts = () => {
    const wazuhAlerts = [
      {
        id: "2024-12-28T10:30:00.000Z-001",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        rule: {
          id: "5712",
          level: 12,
          description: "Multiple authentication failures from same source IP",
          groups: ["authentication_failed", "authentication"],
          mitre: {
            id: ["T1110"],
            tactic: ["Credential Access"],
            technique: ["Brute Force"]
          },
          firedtimes: 15,
          frequency: 10
        },
        agent: {
          id: "001",
          name: "web-server-01",
          ip: "10.0.1.100"
        },
        manager: {
          name: "wazuh-manager"
        },
        cluster: {
          name: "wazuh-cluster"
        },
        full_log: "Dec 28 10:30:00 web-server-01 sshd[1234]: Failed password for admin from 192.168.1.100 port 22 ssh2",
        decoder: {
          name: "sshd"
        },
        data: {
          srcip: "192.168.1.100",
          srcport: "22",
          protocol: "SSH",
          srcuser: "admin",
          dstip: "10.0.1.100",
          dstport: "22"
        },
        location: "/var/log/auth.log",
        predecoder: {
          program_name: "sshd",
          timestamp: "Dec 28 10:30:00",
          hostname: "web-server-01"
        },
        status: "Active",
        severity: "High",
        confidence: 95,
        starred: true,
        flagged: false,
        actions: [],
        notes: "",
        assignedTo: null,
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null
      },
      {
        id: "2024-12-28T09:45:00.000Z-002",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        rule: {
          id: "31108",
          level: 10,
          description: "Web application attack detected",
          groups: ["web", "attack", "sql_injection"],
          mitre: {
            id: ["T1190"],
            tactic: ["Initial Access"],
            technique: ["Exploit Public-Facing Application"]
          },
          firedtimes: 8,
          frequency: 5
        },
        agent: {
          id: "002",
          name: "nginx-proxy",
          ip: "10.0.2.50"
        },
        manager: {
          name: "wazuh-manager"
        },
        cluster: {
          name: "wazuh-cluster"
        },
        full_log: "192.168.1.150 - - [28/Dec/2024:09:45:00 +0000] \"GET /admin.php?id=1' OR '1'='1 HTTP/1.1\" 200 1234 \"-\" \"Mozilla/5.0\"",
        decoder: {
          name: "web-accesslog"
        },
        data: {
          srcip: "192.168.1.150",
          url: "/admin.php?id=1' OR '1'='1",
          protocol: "HTTP",
          status: "200",
          size: "1234",
          method: "GET"
        },
        location: "/var/log/nginx/access.log",
        predecoder: {
          program_name: "nginx",
          timestamp: "28/Dec/2024:09:45:00",
          hostname: "nginx-proxy"
        },
        status: "Investigating",
        severity: "Critical",
        confidence: 92,
        starred: false,
        flagged: true,
        actions: [],
        notes: "",
        assignedTo: "Jane Smith",
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null
      },
      {
        id: "2024-12-28T08:15:00.000Z-003",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        rule: {
          id: "40104",
          level: 7,
          description: "Multiple Windows Logon Failures",
          groups: ["authentication_failed", "windows"],
          mitre: {
            id: ["T1110.001"],
            tactic: ["Credential Access"],
            technique: ["Password Guessing"]
          },
          firedtimes: 25,
          frequency: 15
        },
        agent: {
          id: "003",
          name: "dc-server-01",
          ip: "10.0.3.10"
        },
        manager: {
          name: "wazuh-manager"
        },
        cluster: {
          name: "wazuh-cluster"
        },
        full_log: "2024-12-28 08:15:00, Error, Microsoft-Windows-Security-Auditing, 4625, Logon, An account failed to log on.",
        decoder: {
          name: "windows-security"
        },
        data: {
          win: {
            eventdata: {
              subjectUserName: "admin",
              targetUserName: "administrator",
              workstationName: "WORKSTATION-01",
              ipAddress: "192.168.1.200",
              logonType: "3"
            }
          }
        },
        location: "WinEvtLog",
        predecoder: {
          program_name: "WinEvtLog",
          timestamp: "2024-12-28 08:15:00",
          hostname: "dc-server-01"
        },
        status: "Contained",
        severity: "Medium",
        confidence: 85,
        starred: false,
        flagged: false,
        actions: [],
        notes: "",
        assignedTo: "Mike Johnson",
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null
      },
      {
        id: "2024-12-28T07:30:00.000Z-004",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        rule: {
          id: "87105",
          level: 15,
          description: "Malware detected by ClamAV",
          groups: ["malware", "antivirus"],
          mitre: {
            id: ["T1059"],
            tactic: ["Execution"],
            technique: ["Command and Scripting Interpreter"]
          },
          firedtimes: 1,
          frequency: 1
        },
        agent: {
          id: "004",
          name: "file-server-01",
          ip: "10.0.4.20"
        },
        manager: {
          name: "wazuh-manager"
        },
        cluster: {
          name: "wazuh-cluster"
        },
        full_log: "Dec 28 07:30:00 file-server-01 clamd[5678]: /home/user/downloads/suspicious.exe: Trojan.Win32.Agent FOUND",
        decoder: {
          name: "clamav"
        },
        data: {
          extra_data: "Trojan.Win32.Agent",
          filename: "/home/user/downloads/suspicious.exe"
        },
        location: "/var/log/clamav/clamav.log",
        predecoder: {
          program_name: "clamd",
          timestamp: "Dec 28 07:30:00",
          hostname: "file-server-01"
        },
        status: "Resolved",
        severity: "Critical",
        confidence: 98,
        starred: true,
        flagged: true,
        actions: [
          {
            type: "quarantine",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            user: "System",
            notes: "File automatically quarantined by antivirus"
          },
          {
            type: "resolve",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            user: "Sarah Wilson",
            notes: "Malware removed, system scanned clean"
          }
        ],
        notes: "File contained known malware. Quarantined and removed successfully.",
        assignedTo: "Sarah Wilson",
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Generate additional mock Wazuh alerts
    const ruleIds = ["5712", "31108", "40104", "87105", "1002", "2502", "5402", "30115", "30301"];
    const ruleDescriptions = [
      "SSH authentication failure", "Web attack detected", "Windows logon failure",
      "Malware detected", "System error", "User login", "Invalid user",
      "Possible scan", "Firewall drop"
    ];
    const levels = [3, 5, 7, 10, 12, 15];
    const severities = ["Low", "Medium", "High", "Critical"];
    const statuses = ["Active", "Investigating", "Contained", "Resolved", "False Positive"];
    const agentNames = ["web-server-01", "db-server-01", "file-server-01", "dc-server-01", "nginx-proxy", "mail-server-01"];
    const sourceIPs = ["192.168.1.100", "10.0.0.50", "172.16.1.200", "203.0.113.10", "198.51.100.5"];

    for (let i = 5; i <= 50; i++) {
      const ruleId = ruleIds[Math.floor(Math.random() * ruleIds.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const severity = level >= 12 ? "Critical" : level >= 10 ? "High" : level >= 7 ? "Medium" : "Low";
      const baseTime = Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000);
      const agentName = agentNames[Math.floor(Math.random() * agentNames.length)];
      const srcip = sourceIPs[Math.floor(Math.random() * sourceIPs.length)];

      wazuhAlerts.push({
        id: `2024-12-28T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00.000Z-${String(i).padStart(3, '0')}`,
        timestamp: new Date(baseTime).toISOString(),
        rule: {
          id: ruleId,
          level: level,
          description: ruleDescriptions[Math.floor(Math.random() * ruleDescriptions.length)],
          groups: ["authentication", "web", "system"],
          mitre: {
            id: ["T1110", "T1190", "T1059"][Math.floor(Math.random() * 3)],
            tactic: ["Initial Access", "Credential Access", "Execution"][Math.floor(Math.random() * 3)],
            technique: ["Brute Force", "Exploit Public-Facing Application", "Command and Scripting Interpreter"][Math.floor(Math.random() * 3)]
          },
          firedtimes: Math.floor(Math.random() * 50) + 1,
          frequency: Math.floor(Math.random() * 20) + 1
        },
        agent: {
          id: String(i).padStart(3, '0'),
          name: agentName,
          ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        },
        manager: {
          name: "wazuh-manager"
        },
        cluster: {
          name: "wazuh-cluster"
        },
        full_log: `Sample log entry for rule ${ruleId} from ${agentName}`,
        decoder: {
          name: ["sshd", "web-accesslog", "windows-security", "syslog"][Math.floor(Math.random() * 4)]
        },
        data: {
          srcip: srcip,
          srcport: String(Math.floor(Math.random() * 65535) + 1),
          protocol: ["TCP", "UDP", "HTTP", "HTTPS", "SSH"][Math.floor(Math.random() * 5)]
        },
        location: ["/var/log/auth.log", "/var/log/nginx/access.log", "WinEvtLog", "/var/log/syslog"][Math.floor(Math.random() * 4)],
        predecoder: {
          program_name: agentName.split('-')[0],
          timestamp: new Date(baseTime).toISOString().split('T')[0],
          hostname: agentName
        },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        severity: severity,
        confidence: Math.floor(Math.random() * 40) + 60,
        starred: Math.random() > 0.9,
        flagged: Math.random() > 0.8,
        actions: [],
        notes: "",
        assignedTo: Math.random() > 0.7 ? ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"][Math.floor(Math.random() * 4)] : null,
        blockedAt: null,
        escalatedAt: null,
        resolvedAt: null
      });
    }

    return wazuhAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Initialize data
  useEffect(() => {
    setLoading(true);
    // Simulate API call to Wazuh
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

  // Interactive Actions for Wazuh alerts

  const handleQuarantineFile = async (alert) => {
    setActionLoading(`quarantine-${alert.id}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAlerts(prevAlerts => 
        prevAlerts.map(a => 
          a.id === alert.id 
            ? {
                ...a,
                status: 'Contained',
                actions: [
                  ...a.actions,
                  {
                    type: 'quarantine',
                    timestamp: new Date().toISOString(),
                    user: currentUser.name,
                    notes: `File quarantined: ${alert.data?.filename || 'suspicious file'}`
                  }
                ]
              }
            : a
        )
      );

      showNotification(`File quarantined successfully`, 'success');
      
      if (selectedAlert?.id === alert.id) {
        setSelectedAlert(null);
      }
      
    } catch (error) {
      showNotification('Failed to quarantine file. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEscalateAlert = async (alert) => {
    setActionLoading(`escalate-${alert.id}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newLevel = Math.min(alert.rule.level + 3, 15);
      const newSeverity = newLevel >= 12 ? "Critical" : newLevel >= 10 ? "High" : "Medium";
      
      setAlerts(prevAlerts => 
        prevAlerts.map(a => 
          a.id === alert.id 
            ? {
                ...a,
                status: 'Escalated',
                severity: newSeverity,
                rule: { ...a.rule, level: newLevel },
                escalatedAt: new Date().toISOString(),
                actions: [
                  ...a.actions,
                  {
                    type: 'escalate',
                    timestamp: new Date().toISOString(),
                    user: currentUser.name,
                    notes: `Alert escalated to ${newSeverity} severity (level ${newLevel})`
                  }
                ]
              }
            : a
        )
      );

      showNotification(`Alert ${alert.id} escalated to ${newSeverity} severity`, 'warning');
      
      if (selectedAlert?.id === alert.id) {
        setSelectedAlert(null);
      }
      
    } catch (error) {
      showNotification('Failed to escalate alert. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolveAlert = async (alert) => {
    setActionLoading(`resolve-${alert.id}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAlerts(prevAlerts => 
        prevAlerts.map(a => 
          a.id === alert.id 
            ? {
                ...a,
                status: 'Resolved',
                resolvedAt: new Date().toISOString(),
                actions: [
                  ...a.actions,
                  {
                    type: 'resolve',
                    timestamp: new Date().toISOString(),
                    user: currentUser.name,
                    notes: 'Alert investigated and resolved. No further action required.'
                  }
                ]
              }
            : a
        )
      );

      showNotification(`Alert ${alert.id} resolved successfully`, 'success');
      
      if (selectedAlert?.id === alert.id) {
        setSelectedAlert(null);
      }
      
    } catch (error) {
      showNotification('Failed to resolve alert. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        const updatedData = initializeWazuhAlerts();
        setAlerts(updatedData);
        showNotification('Alert data refreshed from Wazuh', 'info');
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
        alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.data?.srcip?.includes(searchTerm) ||
        alert.rule.id.includes(searchTerm) ||
        alert.full_log.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.level.length > 0) {
      filtered = filtered.filter(alert => {
        return filters.level.some(level => {
          if (level === 'low') return alert.rule.level <= 5;
          if (level === 'medium') return alert.rule.level > 5 && alert.rule.level <= 10;
          if (level === 'high') return alert.rule.level > 10 && alert.rule.level <= 12;
          if (level === 'critical') return alert.rule.level > 12;
          return false;
        });
      });
    }

    if (filters.rule.length > 0) {
      filtered = filtered.filter(alert => filters.rule.includes(alert.rule.id));
    }
    if (filters.agent.length > 0) {
      filtered = filtered.filter(alert => filters.agent.includes(alert.agent.name));
    }
    if (filters.location.length > 0) {
      filtered = filtered.filter(alert => filters.location.includes(alert.location));
    }

    filtered = filtered.filter(alert => 
      alert.rule.level >= filters.riskScore[0] && 
      alert.rule.level <= filters.riskScore[1]
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

      if (sortConfig.key === 'timestamp') {
        aValue = new Date(a.timestamp);
        bValue = new Date(b.timestamp);
      } else if (sortConfig.key === 'level') {
        aValue = a.rule.level;
        bValue = b.rule.level;
      } else if (sortConfig.key === 'rule') {
        aValue = a.rule.id;
        bValue = b.rule.id;
      } else if (sortConfig.key === 'agent') {
        aValue = a.agent.name;
        bValue = b.agent.name;
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
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
      showNotification('Wazuh alert data refreshed successfully', 'success');
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Alert ID', 'Rule ID', 'Rule Description', 'Level', 'Severity', 'Agent', 'Source IP', 'Timestamp'],
      ...sortedAlerts.map(alert => [
        alert.id,
        alert.rule.id,
        alert.rule.description,
        alert.rule.level,
        alert.severity,
        alert.agent.name,
        alert.data?.srcip || 'N/A',
        alert.timestamp
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wazuh-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Wazuh alert data exported successfully', 'success');
  };

  const getLevelColor = (level) => {
    if (level >= 12) return 'text-red-400 bg-red-500/20';
    if (level >= 10) return 'text-orange-400 bg-orange-500/20';
    if (level >= 7) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
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

  // Wazuh-specific Filter Panel
  const WazuhFilterPanel = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Wazuh Alert Filters</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Alert Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Alert Level</label>
          <div className="space-y-2">
            {[
              { key: 'low', label: 'Low (0-5)', color: 'text-green-400' },
              { key: 'medium', label: 'Medium (6-10)', color: 'text-yellow-400' },
              { key: 'high', label: 'High (11-12)', color: 'text-orange-400' },
              { key: 'critical', label: 'Critical (13-15)', color: 'text-red-400' }
            ].map(level => (
              <label key={level.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.level.includes(level.key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, level: [...prev.level, level.key] }));
                    } else {
                      setFilters(prev => ({ ...prev, level: prev.level.filter(l => l !== level.key) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className={`text-sm ${level.color}`}>{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rule ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Rule IDs</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {['5712', '31108', '40104', '87105', '1002', '2502', '5402'].map(ruleId => (
              <label key={ruleId} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.rule.includes(ruleId)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, rule: [...prev.rule, ruleId] }));
                    } else {
                      setFilters(prev => ({ ...prev, rule: prev.rule.filter(r => r !== ruleId) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">{ruleId}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Agent Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Agents</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {['web-server-01', 'db-server-01', 'file-server-01', 'dc-server-01', 'nginx-proxy', 'mail-server-01'].map(agent => (
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

        {/* Alert Level Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alert Level Range: {filters.riskScore[0]} - {filters.riskScore[1]}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="15"
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
              max="15"
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
          onClick={() => setFilters({ level: [], rule: [], agent: [], location: [], dateRange: 'all', riskScore: [0, 15] })}
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

  // Enhanced Wazuh Alert Detail Modal
  const WazuhAlertDetailModal = ({ alert, onClose }) => {
    const [activeTab, setActiveTab] = useState('details');
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getLevelColor(alert.rule.level).split(' ')[1]}`} />
                <div>
                  <h2 className="text-xl font-bold text-white">Wazuh Alert: {alert.rule.id}</h2>
                  <p className="text-sm text-gray-400">{alert.id}</p>
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
                { id: 'details', label: 'Alert Details', icon: Info },
                { id: 'rule', label: 'Rule Info', icon: FileText },
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
                {/* Basic Alert Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Alert Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Alert Level:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(alert.rule.level)}`}>
                          Level {alert.rule.level} ({alert.severity})
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence:</span>
                        <span className="text-white">{alert.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Assigned To:</span>
                        <span className="text-white">{alert.assignedTo || 'Unassigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rule Fired:</span>
                        <span className="text-white">{alert.rule.firedtimes} times</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency:</span>
                        <span className="text-white">{alert.rule.frequency}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Agent Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Agent ID:</span>
                        <span className="text-white font-mono">{alert.agent.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Agent Name:</span>
                        <span className="text-white">{alert.agent.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Agent IP:</span>
                        <span className="text-white font-mono">{alert.agent.ip}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Log Location:</span>
                        <span className="text-white font-mono text-sm">{alert.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Decoder:</span>
                        <span className="text-white">{alert.decoder.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network and Event Data */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Event Data</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Timestamp:</span>
                        <span className="text-white">{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      {alert.data?.srcip && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Source IP:</span>
                          <div className="flex items-center space-x-2">
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
                      {alert.data?.srcport && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Source Port:</span>
                          <span className="text-white">{alert.data.srcport}</span>
                        </div>
                      )}
                      {alert.data?.protocol && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Protocol:</span>
                          <span className="text-white">{alert.data.protocol}</span>
                        </div>
                      )}
                      {alert.data?.filename && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">File:</span>
                          <span className="text-white font-mono text-sm break-all">{alert.data.filename}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* MITRE ATT&CK Information */}
                  {alert.rule.mitre && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">MITRE ATT&CK</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Technique ID:</span>
                          <span className="text-blue-400 font-mono">{alert.rule.mitre.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tactic:</span>
                          <span className="text-white">{alert.rule.mitre.tactic}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Technique:</span>
                          <span className="text-white">{alert.rule.mitre.technique}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Full Log */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Raw Log</h3>
                    <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                      <pre className="text-gray-300 text-xs whitespace-pre-wrap break-all font-mono">
                        {alert.full_log}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rule' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Rule Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rule ID:</span>
                        <span className="text-white font-mono">{alert.rule.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-white">{alert.rule.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fired Times:</span>
                        <span className="text-white">{alert.rule.firedtimes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frequency:</span>
                        <span className="text-white">{alert.rule.frequency}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Rule Groups</h3>
                    <div className="flex flex-wrap gap-2">
                      {alert.rule.groups.map((group, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Rule Description</h3>
                  <p className="text-gray-300 text-sm leading-relaxed bg-gray-700/30 p-3 rounded-lg">
                    {alert.rule.description}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Alert Timeline</h3>
                <div className="space-y-4">
                  {/* Initial detection */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Alert Generated</p>
                      <p className="text-gray-400 text-sm">Wazuh rule {alert.rule.id} triggered</p>
                      <p className="text-gray-500 text-xs">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions timeline */}
                  {alert.actions.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        action.type === 'quarantine' ? 'bg-purple-500/20' :
                        action.type === 'escalate' ? 'bg-orange-500/20' :
                        action.type === 'resolve' ? 'bg-green-500/20' : 'bg-gray-500/20'
                      }`}>
                        {action.type === 'quarantine' && <Shield className="w-4 h-4 text-purple-400" />}
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

                  {alert.actions.length === 0 && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Quarantine File (for malware alerts) */}
                  {alert.rule.groups.includes('malware') && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Shield className="w-6 h-6 text-purple-400" />
                        <h4 className="font-medium text-white">Quarantine File</h4>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Quarantine the detected malicious file to prevent further damage
                      </p>
                      <button
                        onClick={() => handleQuarantineFile(alert)}
                        disabled={actionLoading === `quarantine-${alert.id}` || alert.status === 'Contained'}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        {actionLoading === `quarantine-${alert.id}` ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4" />
                        )}
                        <span>{alert.status === 'Contained' ? 'Already Quarantined' : 'Quarantine'}</span>
                      </button>
                    </div>
                  )}

                  {/* Escalate Alert */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="w-6 h-6 text-orange-400" />
                      <h4 className="font-medium text-white">Escalate Alert</h4>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Escalate alert level and notify security management
                    </p>
                    <button
                      onClick={() => handleEscalateAlert(alert)}
                      disabled={actionLoading === `escalate-${alert.id}` || alert.status === 'Escalated'}
                      className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {actionLoading === `escalate-${alert.id}` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                      <span>{alert.status === 'Escalated' ? 'Already Escalated' : 'Escalate'}</span>
                    </button>
                  </div>

                  {/* Resolve Alert */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h4 className="font-medium text-white">Resolve Alert</h4>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Mark alert as resolved after investigation and remediation
                    </p>
                    <button
                      onClick={() => handleResolveAlert(alert)}
                      disabled={actionLoading === `resolve-${alert.id}` || alert.status === 'Resolved'}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {actionLoading === `resolve-${alert.id}` ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>{alert.status === 'Resolved' ? 'Already Resolved' : 'Resolve'}</span>
                    </button>
                  </div>
                </div>

                {/* Action History */}
                {alert.actions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-white mb-3">Recent Actions</h4>
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      {alert.actions.slice(-3).map((action, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-600 last:border-b-0">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              action.type === 'quarantine' ? 'bg-purple-500/20 text-purple-400' :
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
          <h1 className="text-2xl font-bold text-white">Wazuh Threat Hunting</h1>
          <p className="text-gray-400 mt-1">Advanced threat analysis and investigation with Wazuh SIEM</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            <span>{filteredAlerts.length} alerts found</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Database className="w-4 h-4" />
            <span>Wazuh Manager</span>
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
                placeholder="Search alerts, rules, agents, IPs..."
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
              {(filters.level.length > 0 || filters.rule.length > 0 || filters.agent.length > 0) && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {filters.level.length + filters.rule.length + filters.agent.length}
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
        {(filters.level.length > 0 || filters.rule.length > 0 || filters.agent.length > 0 || filters.dateRange !== 'all') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.level.map(level => (
              <span key={level} className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <span>Level: {level}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, level: prev.level.filter(l => l !== level) }))}
                  className="hover:text-blue-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.rule.map(rule => (
              <span key={rule} className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <span>Rule: {rule}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, rule: prev.rule.filter(r => r !== rule) }))}
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
      {showFilters && <WazuhFilterPanel />}

      {/* Wazuh Alerts Table */}
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
            
            {selectedAlerts.size > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{selectedAlerts.size} selected</span>
                <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                  Bulk Action
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-400">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedAlerts.length)} of {sortedAlerts.length} alerts
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
                    checked={selectedAlerts.size === paginatedAlerts.length && paginatedAlerts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlerts(new Set(paginatedAlerts.map(a => a.id)));
                      } else {
                        setSelectedAlerts(new Set());
                      }
                    }}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
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
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('rule')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Rule</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('level')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Level</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <span className="text-gray-300 font-medium text-sm">Status</span>
                </th>
                <th className="p-3 text-left">
                  <button
                    onClick={() => handleSort('agent')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium text-sm"
                  >
                    <span>Agent</span>
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="p-3 text-left">
                  <span className="text-gray-300 font-medium text-sm">Source IP</span>
                </th>
                <th className="p-3 text-left">
                  <span className="text-gray-300 font-medium text-sm">Assigned</span>
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
                      <span>Loading Wazuh alerts...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedAlerts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-gray-400">
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
                        className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-white">{formatTimeAgo(alert.timestamp)}</div>
                      <div className="text-xs text-gray-400">{new Date(alert.timestamp).toLocaleDateString()}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-blue-400">{alert.rule.id}</span>
                        {alert.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                        {alert.flagged && <Flag className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="max-w-xs">
                        <p className="text-white font-medium text-sm truncate">{alert.rule.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {alert.rule.groups.slice(0, 2).map((group, idx) => (
                            <span key={idx} className="text-xs px-1 py-0.5 bg-gray-600 text-gray-300 rounded">
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(alert.rule.level)}`}>
                        {alert.rule.level}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        {alert.severity}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Server className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-white">{alert.agent.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{alert.agent.ip}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {alert.data?.srcip ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm text-white">{alert.data.srcip}</span>
                          <button
                            onClick={() => navigator.clipboard.writeText(alert.data.srcip)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="p-3">
                      {alert.assignedTo ? (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-white">{alert.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        {/* Quick Actions */}
                        <button
                          onClick={() => setSelectedAlert(alert)}
                          className="p-1 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Quick Escalate */}
                        <button
                          onClick={() => handleEscalateAlert(alert)}
                          disabled={actionLoading === `escalate-${alert.id}` || alert.status === 'Escalated'}
                          className="p-1 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded transition-colors disabled:opacity-50"
                          title="Escalate"
                        >
                          {actionLoading === `escalate-${alert.id}` ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                        </button>

                        {/* Quick Resolve */}
                        <button
                          onClick={() => handleResolveAlert(alert)}
                          disabled={actionLoading === `resolve-${alert.id}` || alert.status === 'Resolved'}
                          className="p-1 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors disabled:opacity-50"
                          title="Resolve"
                        >
                          {actionLoading === `resolve-${alert.id}` ? (
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

      {/* Wazuh Alert Detail Modal */}
      {selectedAlert && (
        <WazuhAlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
};

export default ThreatHunting;