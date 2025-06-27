//"use client"
import React, { useState, useEffect } from 'react';
import {
  Shield, AlertTriangle, Bug, Target, TrendingUp, TrendingDown,
  Clock, CheckCircle, XCircle, Eye, Search, Filter, Download,
  RefreshCw, Calendar, MapPin, ExternalLink, Zap, Users,
  Server, Laptop, Smartphone, Database, Globe, Lock,
  AlertCircle, Info, Play, Pause, BarChart3, PieChart,
  FileText, Settings, ArrowUp, ArrowDown, Minus, Plus,
  Activity, Hash, Link, Bookmark, Star, Flag, Copy,
  ChevronRight, ChevronDown, X, Edit, Save, Upload
} from 'lucide-react';

const Vulnerabilities = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssetType, setFilterAssetType] = useState('all');
  const [sortBy, setSortBy] = useState('cvss');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showPatchModal, setShowPatchModal] = useState(false);
  const [selectedPatches, setSelectedPatches] = useState(new Set());

  // Mock vulnerability data
  const [vulnerabilities] = useState([
    {
      id: 'CVE-2024-0001',
      title: 'Remote Code Execution in Apache HTTP Server',
      description: 'A critical vulnerability in Apache HTTP Server allows remote attackers to execute arbitrary code via specially crafted HTTP requests.',
      severity: 'Critical',
      cvssScore: 9.8,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
      cweId: 'CWE-787',
      publishedDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      status: 'Open',
      exploitAvailable: true,
      exploitInWild: false,
      patchAvailable: true,
      vendorAdvisory: 'https://httpd.apache.org/security/vulnerabilities_24.html',
      affectedAssets: [
        { id: 'WEB-001', name: 'Web Server 01', type: 'server', ip: '10.0.1.10' },
        { id: 'WEB-002', name: 'Web Server 02', type: 'server', ip: '10.0.1.11' },
        { id: 'LB-001', name: 'Load Balancer', type: 'server', ip: '10.0.1.5' }
      ],
      riskScore: 95,
      businessImpact: 'High',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentialityImpact: 'High',
      integrityImpact: 'High',
      availabilityImpact: 'High',
      remediationEffort: 'Medium',
      remediationTime: '2-4 hours',
      tags: ['web-server', 'apache', 'rce', 'critical'],
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-0001',
        'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-0001'
      ],
      timeline: [
        { date: new Date('2024-01-15'), event: 'Vulnerability discovered', type: 'discovery' },
        { date: new Date('2024-01-16'), event: 'CVE assigned', type: 'assignment' },
        { date: new Date('2024-01-18'), event: 'Patch released by vendor', type: 'patch' },
        { date: new Date('2024-01-20'), event: 'Internal assessment completed', type: 'assessment' }
      ]
    },
    {
      id: 'CVE-2024-0002',
      title: 'SQL Injection in Customer Portal',
      description: 'A SQL injection vulnerability in the customer portal allows authenticated users to access sensitive data.',
      severity: 'High',
      cvssScore: 8.8,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H',
      cweId: 'CWE-89',
      publishedDate: new Date('2024-01-10'),
      lastModified: new Date('2024-01-18'),
      status: 'In Progress',
      exploitAvailable: false,
      exploitInWild: false,
      patchAvailable: true,
      vendorAdvisory: 'https://portal-vendor.com/security/advisory-001',
      affectedAssets: [
        { id: 'APP-001', name: 'Customer Portal', type: 'application', ip: '10.0.2.20' },
        { id: 'DB-001', name: 'Customer Database', type: 'database', ip: '10.0.2.21' }
      ],
      riskScore: 85,
      businessImpact: 'High',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentialityImpact: 'High',
      integrityImpact: 'High',
      availabilityImpact: 'High',
      remediationEffort: 'High',
      remediationTime: '1-2 weeks',
      tags: ['sql-injection', 'web-app', 'database'],
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-0002'
      ],
      timeline: [
        { date: new Date('2024-01-10'), event: 'Vulnerability reported', type: 'discovery' },
        { date: new Date('2024-01-12'), event: 'Assessment started', type: 'assessment' },
        { date: new Date('2024-01-15'), event: 'Remediation planning', type: 'planning' },
        { date: new Date('2024-01-18'), event: 'Development work started', type: 'remediation' }
      ]
    },
    {
      id: 'CVE-2024-0003',
      title: 'Cross-Site Scripting in Admin Panel',
      description: 'A stored XSS vulnerability in the admin panel could allow attackers to execute malicious scripts.',
      severity: 'Medium',
      cvssScore: 6.1,
      cvssVector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N',
      cweId: 'CWE-79',
      publishedDate: new Date('2024-01-08'),
      lastModified: new Date('2024-01-22'),
      status: 'Resolved',
      exploitAvailable: true,
      exploitInWild: false,
      patchAvailable: true,
      vendorAdvisory: 'https://admin-panel.com/security/xss-fix',
      affectedAssets: [
        { id: 'ADMIN-001', name: 'Admin Panel', type: 'application', ip: '10.0.3.30' }
      ],
      riskScore: 45,
      businessImpact: 'Medium',
      attackVector: 'Network',
      attackComplexity: 'Low',
      privilegesRequired: 'None',
      userInteraction: 'Required',
      scope: 'Changed',
      confidentialityImpact: 'Low',
      integrityImpact: 'Low',
      availabilityImpact: 'None',
      remediationEffort: 'Low',
      remediationTime: '2-4 hours',
      tags: ['xss', 'web-app', 'admin-panel'],
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-0003'
      ],
      timeline: [
        { date: new Date('2024-01-08'), event: 'Vulnerability discovered', type: 'discovery' },
        { date: new Date('2024-01-10'), event: 'Fix developed', type: 'remediation' },
        { date: new Date('2024-01-12'), event: 'Patch deployed', type: 'patch' },
        { date: new Date('2024-01-15'), event: 'Vulnerability resolved', type: 'resolution' }
      ]
    },
    {
      id: 'CVE-2024-0004',
      title: 'Privilege Escalation in Linux Kernel',
      description: 'A local privilege escalation vulnerability in the Linux kernel allows users to gain root access.',
      severity: 'High',
      cvssScore: 7.8,
      cvssVector: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H',
      cweId: 'CWE-269',
      publishedDate: new Date('2024-01-12'),
      lastModified: new Date('2024-01-19'),
      status: 'Open',
      exploitAvailable: true,
      exploitInWild: true,
      patchAvailable: true,
      vendorAdvisory: 'https://kernel.org/security/CVE-2024-0004',
      affectedAssets: [
        { id: 'SRV-001', name: 'Database Server 01', type: 'server', ip: '10.0.1.50' },
        { id: 'SRV-002', name: 'Application Server', type: 'server', ip: '10.0.1.51' },
        { id: 'WS-001', name: 'Workstation 01', type: 'laptop', ip: '192.168.1.101' },
        { id: 'WS-002', name: 'Workstation 02', type: 'laptop', ip: '192.168.1.102' }
      ],
      riskScore: 88,
      businessImpact: 'High',
      attackVector: 'Local',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentialityImpact: 'High',
      integrityImpact: 'High',
      availabilityImpact: 'High',
      remediationEffort: 'Medium',
      remediationTime: '4-8 hours',
      tags: ['kernel', 'privilege-escalation', 'linux'],
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-0004',
        'https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-0004'
      ],
      timeline: [
        { date: new Date('2024-01-12'), event: 'Vulnerability published', type: 'discovery' },
        { date: new Date('2024-01-14'), event: 'Exploit code released', type: 'exploit' },
        { date: new Date('2024-01-16'), event: 'Patch available', type: 'patch' },
        { date: new Date('2024-01-19'), event: 'Active exploitation detected', type: 'exploit' }
      ]
    },
    {
      id: 'CVE-2024-0005',
      title: 'Buffer Overflow in Network Driver',
      description: 'A buffer overflow vulnerability in the network driver could lead to system crashes or code execution.',
      severity: 'Medium',
      cvssScore: 5.5,
      cvssVector: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:U/C:N/I:N/A:H',
      cweId: 'CWE-120',
      publishedDate: new Date('2024-01-05'),
      lastModified: new Date('2024-01-25'),
      status: 'Resolved',
      exploitAvailable: false,
      exploitInWild: false,
      patchAvailable: true,
      vendorAdvisory: 'https://network-vendor.com/security/buffer-overflow-fix',
      affectedAssets: [
        { id: 'NET-001', name: 'Network Switch 01', type: 'network', ip: '10.0.0.1' },
        { id: 'NET-002', name: 'Network Switch 02', type: 'network', ip: '10.0.0.2' }
      ],
      riskScore: 35,
      businessImpact: 'Low',
      attackVector: 'Local',
      attackComplexity: 'Low',
      privilegesRequired: 'Low',
      userInteraction: 'None',
      scope: 'Unchanged',
      confidentialityImpact: 'None',
      integrityImpact: 'None',
      availabilityImpact: 'High',
      remediationEffort: 'Low',
      remediationTime: '1-2 hours',
      tags: ['buffer-overflow', 'network', 'driver'],
      references: [
        'https://nvd.nist.gov/vuln/detail/CVE-2024-0005'
      ],
      timeline: [
        { date: new Date('2024-01-05'), event: 'Vulnerability reported', type: 'discovery' },
        { date: new Date('2024-01-08'), event: 'Vendor patch released', type: 'patch' },
        { date: new Date('2024-01-10'), event: 'Patches applied', type: 'remediation' },
        { date: new Date('2024-01-12'), event: 'Vulnerability closed', type: 'resolution' }
      ]
    }
  ]);

  // Attack surface metrics
  const [attackSurface] = useState({
    totalAssets: 247,
    exposedAssets: 42,
    criticalServices: 15,
    openPorts: 1284,
    externalFacing: 28,
    lastScan: new Date(Date.now() - 1000 * 60 * 60 * 2),
    riskScore: 72,
    trend: 'increasing'
  });

  // CVSS distribution data
  const cvssDistribution = vulnerabilities.reduce((acc, vuln) => {
    if (vuln.cvssScore >= 9.0) acc.critical++;
    else if (vuln.cvssScore >= 7.0) acc.high++;
    else if (vuln.cvssScore >= 4.0) acc.medium++;
    else acc.low++;
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });

  // Auto-refresh effect
  useEffect(() => {
    let interval = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log('Auto-refreshing vulnerability data...');
      }, 60000); // Refresh every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Utility functions
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-purple-400 bg-purple-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'text-red-400 bg-red-500/20';
      case 'in progress': return 'text-yellow-400 bg-yellow-500/20';
      case 'resolved': return 'text-green-400 bg-green-500/20';
      case 'closed': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getAssetTypeIcon = (type) => {
    switch (type) {
      case 'server': return Server;
      case 'laptop': return Laptop;
      case 'mobile': return Smartphone;
      case 'database': return Database;
      case 'application': return Globe;
      case 'network': return Activity;
      default: return Shield;
    }
  };

  const getCVSSColor = (score) => {
    if (score >= 9.0) return 'text-purple-400';
    if (score >= 7.0) return 'text-red-400';
    if (score >= 4.0) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Filter and sort vulnerabilities
  const filteredVulnerabilities = vulnerabilities
    .filter(vuln => {
      const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vuln.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vuln.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = filterSeverity === 'all' || vuln.severity.toLowerCase() === filterSeverity;
      const matchesStatus = filterStatus === 'all' || vuln.status.toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesSeverity && matchesStatus;
    })
    .sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'cvss':
          aVal = a.cvssScore;
          bVal = b.cvssScore;
          break;
        case 'risk':
          aVal = a.riskScore;
          bVal = b.riskScore;
          break;
        case 'published':
          aVal = a.publishedDate;
          bVal = b.publishedDate;
          break;
        case 'assets':
          aVal = a.affectedAssets.length;
          bVal = b.affectedAssets.length;
          break;
        default:
          aVal = a.title;
          bVal = b.title;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Attack Surface Exposure Gauge Component
  const AttackSurfaceGauge = ({ score, trend }) => {
    const angle = (score / 100) * 180;
    const color = score >= 80 ? '#dc2626' : score >= 60 ? '#f59e0b' : '#10b981';
    
    return (
      <div className="relative w-48 h-24 mx-auto">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(angle / 180) * 251.33} 251.33`}
          />
          <line
            x1="100"
            y1="80"
            x2={100 + 70 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={80 + 70 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="80" r="5" fill={color} />
        </svg>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-2xl font-bold text-white">{score}</div>
          <div className="text-sm text-gray-400">Risk Score</div>
          <div className={`flex items-center justify-center space-x-1 text-xs ${
            trend === 'increasing' ? 'text-red-400' : 'text-green-400'
          }`}>
            {trend === 'increasing' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend}</span>
          </div>
        </div>
      </div>
    );
  };

  // CVSS Distribution Chart Component
  const CVSSDistributionChart = ({ data }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = {
      critical: '#a855f7',
      high: '#dc2626',
      medium: '#f59e0b',
      low: '#10b981'
    };

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(data).map(([severity, count]) => (
            <div key={severity} className="text-center">
              <div className="text-2xl font-bold" style={{ color: colors[severity] }}>
                {count}
              </div>
              <div className="text-sm text-gray-400 capitalize">{severity}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {Object.entries(data).map(([severity, count]) => (
            <div key={severity} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-400 capitalize">{severity}</div>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${total > 0 ? (count / total) * 100 : 0}%`,
                    backgroundColor: colors[severity]
                  }}
                />
              </div>
              <div className="w-8 text-sm text-gray-400">{count}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Vulnerability Detail Modal
  const VulnerabilityDetailModal = ({ vulnerability, onClose }) => {
    const [activeDetailTab, setActiveDetailTab] = useState('overview');

    const detailTabs = [
      { id: 'overview', label: 'Overview', icon: Info },
      { id: 'technical', label: 'Technical Details', icon: Bug },
      { id: 'assets', label: 'Affected Assets', icon: Target },
      { id: 'timeline', label: 'Timeline', icon: Clock },
      { id: 'remediation', label: 'Remediation', icon: Settings }
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Bug className="w-6 h-6 text-red-400" />
                  <div>
                    <h2 className="text-xl font-bold text-white">{vulnerability.id}</h2>
                    <p className="text-sm text-gray-400">{vulnerability.title}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(vulnerability.severity)}`}>
                    {vulnerability.severity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vulnerability.status)}`}>
                    {vulnerability.status}
                  </span>
                  <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded-lg">
                    <span className={`text-lg font-bold ${getCVSSColor(vulnerability.cvssScore)}`}>
                      {vulnerability.cvssScore}
                    </span>
                    <span className="text-xs text-gray-400">CVSS</span>
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

            {/* Tab Navigation */}
            <div className="flex space-x-6 mt-4">
              {detailTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeDetailTab === tab.id
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

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Overview Tab */}
            {activeDetailTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                      <p className="text-gray-300 leading-relaxed">{vulnerability.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Risk Assessment</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Risk Score:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  vulnerability.riskScore >= 80 ? 'bg-red-500' :
                                  vulnerability.riskScore >= 60 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${vulnerability.riskScore}%` }}
                              />
                            </div>
                            <span className="text-white font-medium">{vulnerability.riskScore}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Business Impact:</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            vulnerability.businessImpact === 'High' ? 'bg-red-500/20 text-red-400' :
                            vulnerability.businessImpact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {vulnerability.businessImpact}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Affected Assets:</span>
                          <span className="text-white font-medium">{vulnerability.affectedAssets.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Exploit Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Exploit Available:</span>
                          <div className="flex items-center space-x-2">
                            {vulnerability.exploitAvailable ? (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                            <span className={vulnerability.exploitAvailable ? 'text-red-400' : 'text-green-400'}>
                              {vulnerability.exploitAvailable ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Active Exploitation:</span>
                          <div className="flex items-center space-x-2">
                            {vulnerability.exploitInWild ? (
                              <Zap className="w-4 h-4 text-red-400" />
                            ) : (
                              <Shield className="w-4 h-4 text-green-400" />
                            )}
                            <span className={vulnerability.exploitInWild ? 'text-red-400' : 'text-green-400'}>
                              {vulnerability.exploitInWild ? 'Detected' : 'None'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Patch Available:</span>
                          <div className="flex items-center space-x-2">
                            {vulnerability.patchAvailable ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className={vulnerability.patchAvailable ? 'text-green-400' : 'text-red-400'}>
                              {vulnerability.patchAvailable ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">References</h3>
                      <div className="space-y-2">
                        {vulnerability.references.map((ref, index) => (
                          <a
                            key={index}
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm">{ref}</span>
                          </a>
                        ))}
                        {vulnerability.vendorAdvisory && (
                          <a
                            href={vulnerability.vendorAdvisory}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Vendor Advisory</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Details Tab */}
            {activeDetailTab === 'technical' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">CVSS v3.1 Metrics</h3>
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Base Score:</span>
                          <span className={`text-lg font-bold ${getCVSSColor(vulnerability.cvssScore)}`}>
                            {vulnerability.cvssScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Vector:</span>
                          <span className="text-white text-sm font-mono">{vulnerability.cvssVector}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Attack Vector</div>
                            <div className="text-sm text-white">{vulnerability.attackVector}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Attack Complexity</div>
                            <div className="text-sm text-white">{vulnerability.attackComplexity}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Privileges Required</div>
                            <div className="text-sm text-white">{vulnerability.privilegesRequired}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">User Interaction</div>
                            <div className="text-sm text-white">{vulnerability.userInteraction}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Impact Metrics</h3>
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Confidentiality:</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            vulnerability.confidentialityImpact === 'High' ? 'bg-red-500/20 text-red-400' :
                            vulnerability.confidentialityImpact === 'Low' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {vulnerability.confidentialityImpact}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Integrity:</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            vulnerability.integrityImpact === 'High' ? 'bg-red-500/20 text-red-400' :
                            vulnerability.integrityImpact === 'Low' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {vulnerability.integrityImpact}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Availability:</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            vulnerability.availabilityImpact === 'High' ? 'bg-red-500/20 text-red-400' :
                            vulnerability.availabilityImpact === 'Low' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {vulnerability.availabilityImpact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Vulnerability Details</h3>
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">CWE ID:</span>
                          <span className="text-white font-mono">{vulnerability.cweId}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Published:</span>
                          <span className="text-white">{vulnerability.publishedDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Last Modified:</span>
                          <span className="text-white">{vulnerability.lastModified.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Scope:</span>
                          <span className="text-white">{vulnerability.scope}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {vulnerability.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Affected Assets Tab */}
            {activeDetailTab === 'assets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Affected Assets ({vulnerability.affectedAssets.length})</h3>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Export List</span>
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {vulnerability.affectedAssets.map((asset) => {
                    const AssetIcon = getAssetTypeIcon(asset.type);
                    return (
                      <div
                        key={asset.id}
                        className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-600 rounded-lg">
                            <AssetIcon className="w-6 h-6 text-gray-300" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="text-white font-medium">{asset.name}</h4>
                              <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs capitalize">
                                {asset.type}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-gray-400 text-sm">ID: {asset.id}</span>
                              <span className="text-gray-400 text-sm">IP: {asset.ip}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeDetailTab === 'timeline' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Vulnerability Timeline</h3>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>
                  
                  <div className="space-y-6">
                    {vulnerability.timeline.map((event, index) => {
                      const getEventIcon = (type) => {
                        switch (type) {
                          case 'discovery': return Eye;
                          case 'assignment': return Hash;
                          case 'patch': return CheckCircle;
                          case 'assessment': return Search;
                          case 'planning': return Calendar;
                          case 'remediation': return Settings;
                          case 'resolution': return CheckCircle;
                          case 'exploit': return Zap;
                          default: return Info;
                        }
                      };
                      
                      const getEventColor = (type) => {
                        switch (type) {
                          case 'discovery': return 'text-blue-400 bg-blue-500/20';
                          case 'assignment': return 'text-gray-400 bg-gray-500/20';
                          case 'patch': return 'text-green-400 bg-green-500/20';
                          case 'assessment': return 'text-yellow-400 bg-yellow-500/20';
                          case 'planning': return 'text-purple-400 bg-purple-500/20';
                          case 'remediation': return 'text-orange-400 bg-orange-500/20';
                          case 'resolution': return 'text-green-400 bg-green-500/20';
                          case 'exploit': return 'text-red-400 bg-red-500/20';
                          default: return 'text-gray-400 bg-gray-500/20';
                        }
                      };
                      
                      const EventIcon = getEventIcon(event.type);
                      
                      return (
                        <div key={index} className="relative flex items-start space-x-4">
                          <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(event.type)}`}>
                            <EventIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <p className="text-white font-medium">{event.event}</p>
                              <span className={`px-2 py-1 rounded text-xs capitalize ${getEventColor(event.type)}`}>
                                {event.type}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">
                              {event.date.toLocaleDateString()} at {event.date.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Remediation Tab */}
            {activeDetailTab === 'remediation' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Remediation Details</h3>
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Effort Level:</span>
                          <span className={`px-2 py-1 rounded text-sm ${
                            vulnerability.remediationEffort === 'High' ? 'bg-red-500/20 text-red-400' :
                            vulnerability.remediationEffort === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {vulnerability.remediationEffort}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Estimated Time:</span>
                          <span className="text-white">{vulnerability.remediationTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Patch Available:</span>
                          <span className={vulnerability.patchAvailable ? 'text-green-400' : 'text-red-400'}>
                            {vulnerability.patchAvailable ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Recommended Actions</h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <div className="text-white font-medium">Apply Security Patch</div>
                            <div className="text-gray-400 text-sm">Update to the latest version containing the security fix</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                          <div>
                            <div className="text-white font-medium">Implement Workaround</div>
                            <div className="text-gray-400 text-sm">Configure firewall rules to limit exposure</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                          <div>
                            <div className="text-white font-medium">Monitor for Exploitation</div>
                            <div className="text-gray-400 text-sm">Enable enhanced logging and monitoring</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Patch Management</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download Patch</span>
                        </button>
                        
                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          <Play className="w-4 h-4" />
                          <span>Schedule Deployment</span>
                        </button>
                        
                        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <Calendar className="w-4 h-4" />
                          <span>Create Maintenance Window</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Risk Mitigation</h3>
                      <div className="bg-gray-700/30 border border-gray-700 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Current Risk:</span>
                            <span className="text-red-400 font-medium">High</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">With Patch:</span>
                            <span className="text-green-400 font-medium">Low</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Risk Reduction:</span>
                            <span className="text-blue-400 font-medium">87%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main tab navigation
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    { id: 'assets', label: 'Asset Mapping', icon: Target },
    { id: 'patches', label: 'Patch Management', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">Vulnerability Assessment Center</h1>
                <p className="text-gray-400">Comprehensive vulnerability management and risk assessment</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Auto-refresh:</span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 rounded-lg transition-colors ${
                  autoRefresh ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={() => setLoading(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-6 mt-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      {/* Main Content */}
      <div className="p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {vulnerabilities.filter(v => v.status === 'Open').length}
                    </div>
                    <div className="text-sm text-gray-400">Open Vulnerabilities</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg">
                    <Bug className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {vulnerabilities.filter(v => v.severity === 'Critical').length}
                    </div>
                    <div className="text-sm text-gray-400">Critical Severity</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {vulnerabilities.filter(v => v.status === 'In Progress').length}
                    </div>
                    <div className="text-sm text-gray-400">In Progress</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {vulnerabilities.filter(v => v.status === 'Resolved').length}
                    </div>
                    <div className="text-sm text-gray-400">Resolved</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attack Surface & CVSS Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Attack Surface Exposure */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Attack Surface Exposure</h3>
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                
                <AttackSurfaceGauge score={attackSurface.riskScore} trend={attackSurface.trend} />
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{attackSurface.exposedAssets}</div>
                    <div className="text-sm text-gray-400">Exposed Assets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{attackSurface.openPorts}</div>
                    <div className="text-sm text-gray-400">Open Ports</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{attackSurface.criticalServices}</div>
                    <div className="text-sm text-gray-400">Critical Services</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{attackSurface.externalFacing}</div>
                    <div className="text-sm text-gray-400">External Facing</div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <div className="text-xs text-gray-500">
                    Last scan: {formatTimeAgo(attackSurface.lastScan)}
                  </div>
                </div>
              </div>

              {/* CVSS Score Distribution */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">CVSS Score Distribution</h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
                
                <CVSSDistributionChart data={cvssDistribution} />
              </div>
            </div>

            {/* Recent Vulnerabilities */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent High-Risk Vulnerabilities</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
              </div>

              <div className="space-y-4">
                {vulnerabilities
                  .filter(v => v.cvssScore >= 7.0)
                  .slice(0, 5)
                  .map((vuln) => (
                    <div
                      key={vuln.id}
                      className="flex items-center space-x-4 p-4 bg-gray-700/30 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedVulnerability(vuln)}
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        vuln.severity === 'Critical' ? 'bg-purple-400' :
                        vuln.severity === 'High' ? 'bg-red-400' :
                        vuln.severity === 'Medium' ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">{vuln.id}</span>
                          <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </span>
                          <span className={`text-sm font-bold ${getCVSSColor(vuln.cvssScore)}`}>
                            {vuln.cvssScore}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm mt-1">{vuln.title}</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">{vuln.affectedAssets.length} assets</span>
                        {vuln.exploitInWild && <Zap className="w-4 h-4 text-red-400" />}
                        {vuln.patchAvailable && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Vulnerabilities Tab */}
        {activeTab === 'vulnerabilities' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vulnerabilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Vulnerabilities Table */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium">
                        <button
                          onClick={() => handleSort('id')}
                          className="flex items-center space-x-1 hover:text-white"
                        >
                          <span>CVE ID</span>
                          {sortBy === 'id' && (
                            sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-4 text-gray-300 font-medium">Title</th>
                      <th className="text-left p-4 text-gray-300 font-medium">
                        <button
                          onClick={() => handleSort('cvss')}
                          className="flex items-center space-x-1 hover:text-white"
                        >
                          <span>CVSS</span>
                          {sortBy === 'cvss' && (
                            sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-4 text-gray-300 font-medium">Severity</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left p-4 text-gray-300 font-medium">
                        <button
                          onClick={() => handleSort('assets')}
                          className="flex items-center space-x-1 hover:text-white"
                        >
                          <span>Assets</span>
                          {sortBy === 'assets' && (
                            sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="text-left p-4 text-gray-300 font-medium">Exploit</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVulnerabilities.map((vuln) => (
                      <tr
                        key={vuln.id}
                        className="border-t border-gray-700 hover:bg-gray-700/30 cursor-pointer"
                        onClick={() => setSelectedVulnerability(vuln)}
                      >
                        <td className="p-4">
                          <span className="text-blue-400 font-mono">{vuln.id}</span>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{vuln.title}</div>
                          <div className="text-gray-400 text-sm mt-1">
                            Published {formatTimeAgo(vuln.publishedDate)}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-lg font-bold ${getCVSSColor(vuln.cvssScore)}`}>
                            {vuln.cvssScore}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-sm ${getStatusColor(vuln.status)}`}>
                            {vuln.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-white">{vuln.affectedAssets.length}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            {vuln.exploitAvailable && (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" title="Exploit Available" />
                            )}
                            {vuln.exploitInWild && (
                              <Zap className="w-4 h-4 text-red-400" title="Active Exploitation" />
                            )}
                            {vuln.patchAvailable && (
                              <CheckCircle className="w-4 h-4 text-green-400" title="Patch Available" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedVulnerability(vuln);
                              }}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit action
                              }}
                              className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Asset Mapping Tab */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Asset Vulnerability Mapping</h3>
              
              <div className="grid gap-4">
                {Array.from(new Set(vulnerabilities.flatMap(v => v.affectedAssets))).map((asset) => {
                  const AssetIcon = getAssetTypeIcon(asset.type);
                  const assetVulns = vulnerabilities.filter(v => 
                    v.affectedAssets.some(a => a.id === asset.id)
                  );
                  
                  return (
                    <div
                      key={asset.id}
                      className="bg-gray-700/30 border border-gray-700 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-600 rounded-lg">
                            <AssetIcon className="w-6 h-6 text-gray-300" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{asset.name}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-gray-400 text-sm">ID: {asset.id}</span>
                              <span className="text-gray-400 text-sm">IP: {asset.ip}</span>
                              <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs capitalize">
                                {asset.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-400">
                              {assetVulns.filter(v => v.severity === 'Critical' || v.severity === 'High').length}
                            </div>
                            <div className="text-xs text-gray-400">High Risk</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-white">{assetVulns.length}</div>
                            <div className="text-xs text-gray-400">Total Vulns</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {assetVulns.slice(0, 3).map(vuln => (
                          <span
                            key={vuln.id}
                            className={`px-2 py-1 rounded text-xs ${getSeverityColor(vuln.severity)}`}
                          >
                            {vuln.id}
                          </span>
                        ))}
                        {assetVulns.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                            +{assetVulns.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Patch Management Tab */}
        {activeTab === 'patches' && (
          <div className="space-y-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Patch Management Workflow</h3>
                <button
                  onClick={() => setShowPatchModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Patches</span>
                </button>
              </div>

              <div className="grid gap-4">
                {vulnerabilities
                  .filter(v => v.patchAvailable)
                  .map((vuln) => {
                    const isSelected = selectedPatches.has(vuln.id);
                    
                    return (
                      <div
                        key={vuln.id}
                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-gray-700 bg-gray-700/30 hover:bg-gray-700/50'
                        }`}
                        onClick={() => {
                          const newSelected = new Set(selectedPatches);
                          if (isSelected) {
                            newSelected.delete(vuln.id);
                          } else {
                            newSelected.add(vuln.id);
                          }
                          setSelectedPatches(newSelected);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                            />
                            <div>
                              <div className="flex items-center space-x-3">
                                <span className="text-white font-medium">{vuln.id}</span>
                                <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(vuln.severity)}`}>
                                  {vuln.severity}
                                </span>
                              </div>
                              <div className="text-gray-400 text-sm mt-1">{vuln.title}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-sm text-white">{vuln.remediationTime}</div>
                              <div className="text-xs text-gray-400">Est. Time</div>
                            </div>
                            <div className="text-center">
                              <div className={`text-sm ${
                                vuln.remediationEffort === 'High' ? 'text-red-400' :
                                vuln.remediationEffort === 'Medium' ? 'text-yellow-400' :
                                'text-green-400'
                              }`}>
                                {vuln.remediationEffort}
                              </div>
                              <div className="text-xs text-gray-400">Effort</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-white">{vuln.affectedAssets.length}</div>
                              <div className="text-xs text-gray-400">Assets</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {selectedPatches.size > 0 && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      {selectedPatches.size} patches selected for deployment
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Deploy Now
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Vulnerability Detail Modal */}
      {selectedVulnerability && (
        <VulnerabilityDetailModal
          vulnerability={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
        />
      )}
    </div>
  );
};

export default Vulnerabilities;