import React, { useState, useEffect } from 'react';
import {
  Server, Laptop, Smartphone, Printer, Monitor, Shield, 
  AlertTriangle, CheckCircle, XCircle, Eye, EyeOff, 
  Settings, Filter, Search, RefreshCw, Download, Upload,
  GitCompare, Clock, TrendingUp, TrendingDown, Minus,
  Plus, Edit, Save, X, Check, AlertCircle, Info,
  ChevronRight, ChevronDown, FileText, BarChart3,
  Target, Zap, Play, Pause, History, Users, Lock
} from 'lucide-react';

const Configuration = () => {
  // State management
  const [activeTab, setActiveTab] = useState('assets');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configDiff, setConfigDiff] = useState(null);
  const [complianceView, setComplianceView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssetType, setFilterAssetType] = useState('all');
  const [filterCompliance, setFilterCompliance] = useState('all');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Mock data
  const [assets] = useState([
    {
      id: 'WS-001',
      name: 'CEO-Laptop-01',
      type: 'laptop',
      os: 'Windows 11 Pro',
      ip: '192.168.1.101',
      location: 'Executive Floor',
      owner: 'John Smith',
      lastSeen: new Date(Date.now() - 1000 * 60 * 30),
      complianceScore: 85,
      status: 'online',
      riskLevel: 'medium',
      configurations: {
        system: {
          hostname: 'CEO-LAPTOP-01',
          domain: 'company.local',
          osVersion: '22H2',
          lastUpdate: '2024-01-15',
          timezone: 'UTC-5'
        },
        security: {
          antivirus: 'Windows Defender',
          firewall: 'enabled',
          encryption: 'BitLocker enabled',
          passwordPolicy: 'strong',
          autoLock: '15 minutes'
        },
        network: {
          wifi: 'Corporate-WiFi',
          vpn: 'Always-On VPN',
          proxy: 'company-proxy.local:8080',
          dns: ['8.8.8.8', '8.8.4.4']
        }
      },
      complianceResults: {
        cis: { score: 87, issues: 3, passed: 45, failed: 3 },
        nist: { score: 82, issues: 5, passed: 42, failed: 5 },
        iso27001: { score: 90, issues: 2, passed: 48, failed: 2 }
      },
      driftItems: [
        {
          category: 'security',
          item: 'Password Policy',
          baseline: 'Complex passwords required',
          current: 'Simple passwords allowed',
          severity: 'high',
          detected: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ]
    },
    {
      id: 'SRV-001',
      name: 'Database-Server-01',
      type: 'server',
      os: 'Ubuntu Server 22.04',
      ip: '10.0.1.50',
      location: 'Data Center Rack A1',
      owner: 'IT Operations',
      lastSeen: new Date(Date.now() - 1000 * 60 * 5),
      complianceScore: 95,
      status: 'online',
      riskLevel: 'low',
      configurations: {
        system: {
          hostname: 'db-server-01',
          kernel: '5.15.0-58-generic',
          uptime: '45 days',
          memory: '32GB',
          storage: '2TB SSD RAID1'
        },
        security: {
          ssh: 'Key-based authentication',
          firewall: 'ufw enabled',
          selinux: 'enforcing',
          updates: 'automatic security updates',
          backup: 'daily encrypted backups'
        },
        database: {
          engine: 'PostgreSQL 14.6',
          connections: '200 max',
          ssl: 'required',
          logging: 'enabled',
          replication: 'streaming replication'
        }
      },
      complianceResults: {
        cis: { score: 95, issues: 1, passed: 50, failed: 1 },
        nist: { score: 93, issues: 2, passed: 48, failed: 2 },
        iso27001: { score: 97, issues: 1, passed: 49, failed: 1 }
      },
      driftItems: []
    },
    {
      id: 'MOB-001',
      name: 'Sales-iPhone-01',
      type: 'mobile',
      os: 'iOS 17.2',
      ip: '192.168.1.205',
      location: 'Sales Department',
      owner: 'Sarah Johnson',
      lastSeen: new Date(Date.now() - 1000 * 60 * 10),
      complianceScore: 78,
      status: 'online',
      riskLevel: 'medium',
      configurations: {
        device: {
          model: 'iPhone 14 Pro',
          storage: '256GB',
          mdmEnrolled: true,
          jailbroken: false,
          passcode: 'enabled'
        },
        security: {
          biometric: 'Face ID enabled',
          encryption: 'enabled',
          remoteWipe: 'enabled',
          appRestrictions: 'corporate policy',
          vpnProfile: 'installed'
        },
        apps: {
          managedApps: 12,
          personalApps: 45,
          prohibitedApps: 0,
          outdatedApps: 3
        }
      },
      complianceResults: {
        cis: { score: 75, issues: 6, passed: 38, failed: 6 },
        nist: { score: 80, issues: 4, passed: 40, failed: 4 },
        iso27001: { score: 82, issues: 3, passed: 42, failed: 3 }
      },
      driftItems: [
        {
          category: 'apps',
          item: 'Outdated Applications',
          baseline: 'All apps up to date',
          current: '3 apps need updates',
          severity: 'medium',
          detected: new Date(Date.now() - 1000 * 60 * 60 * 6)
        }
      ]
    },
    {
      id: 'PRT-001',
      name: 'Office-Printer-01',
      type: 'printer',
      os: 'Embedded Linux',
      ip: '192.168.1.150',
      location: 'Main Office Floor 2',
      owner: 'Facilities',
      lastSeen: new Date(Date.now() - 1000 * 60 * 2),
      complianceScore: 65,
      status: 'online',
      riskLevel: 'high',
      configurations: {
        device: {
          model: 'HP LaserJet Enterprise',
          firmware: '2.1.3',
          memory: '512MB',
          storage: '32GB eMMC',
          network: 'Ethernet + WiFi'
        },
        security: {
          authentication: 'none',
          encryption: 'disabled',
          accessControl: 'open',
          logging: 'minimal',
          firmware: 'outdated'
        },
        network: {
          protocols: ['HTTP', 'SNMP', 'FTP'],
          ports: ['80', '443', '161', '21'],
          wifi: 'Corporate-Guest',
          ipConfig: 'DHCP'
        }
      },
      complianceResults: {
        cis: { score: 60, issues: 12, passed: 28, failed: 12 },
        nist: { score: 65, issues: 10, passed: 30, failed: 10 },
        iso27001: { score: 70, issues: 8, passed: 32, failed: 8 }
      },
      driftItems: [
        {
          category: 'security',
          item: 'Authentication Required',
          baseline: 'User authentication required',
          current: 'No authentication configured',
          severity: 'high',
          detected: new Date(Date.now() - 1000 * 60 * 60 * 12)
        },
        {
          category: 'firmware',
          item: 'Firmware Version',
          baseline: 'Latest firmware v2.2.1',
          current: 'Outdated firmware v2.1.3',
          severity: 'medium',
          detected: new Date(Date.now() - 1000 * 60 * 60 * 24)
        }
      ]
    }
  ]);

  const [complianceStandards] = useState({
    cis: {
      name: 'CIS Controls',
      version: 'v8',
      description: 'Center for Internet Security Critical Controls',
      categories: [
        { name: 'Inventory and Control', weight: 15, score: 88 },
        { name: 'Software Asset Management', weight: 15, score: 92 },
        { name: 'Data Protection', weight: 20, score: 85 },
        { name: 'Secure Configuration', weight: 25, score: 78 },
        { name: 'Account Management', weight: 25, score: 90 }
      ]
    },
    nist: {
      name: 'NIST CSF',
      version: '1.1',
      description: 'NIST Cybersecurity Framework',
      categories: [
        { name: 'Identify', weight: 20, score: 85 },
        { name: 'Protect', weight: 25, score: 82 },
        { name: 'Detect', weight: 20, score: 88 },
        { name: 'Respond', weight: 20, score: 80 },
        { name: 'Recover', weight: 15, score: 87 }
      ]
    },
    iso27001: {
      name: 'ISO 27001',
      version: '2013',
      description: 'Information Security Management',
      categories: [
        { name: 'Security Policy', weight: 10, score: 95 },
        { name: 'Access Control', weight: 20, score: 88 },
        { name: 'Cryptography', weight: 15, score: 90 },
        { name: 'Physical Security', weight: 15, score: 85 },
        { name: 'Operations Security', weight: 25, score: 82 },
        { name: 'Incident Management', weight: 15, score: 87 }
      ]
    }
  });

  // Auto-refresh effect
  useEffect(() => {
    let interval = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        // Simulate real-time updates
        console.log('Auto-refreshing configurations...');
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Utility functions
  const getAssetIcon = (type) => {
    switch (type) {
      case 'laptop': return Laptop;
      case 'server': return Server;
      case 'mobile': return Smartphone;
      case 'printer': return Printer;
      default: return Monitor;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-500/20';
      case 'offline': return 'text-red-400 bg-red-500/20';
      case 'maintenance': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'critical': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getComplianceColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  // Filter and search logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.ip.includes(searchTerm);
    
    const matchesType = filterAssetType === 'all' || asset.type === filterAssetType;
    
    const matchesCompliance = filterCompliance === 'all' ||
      (filterCompliance === 'high' && asset.complianceScore >= 90) ||
      (filterCompliance === 'medium' && asset.complianceScore >= 70 && asset.complianceScore < 90) ||
      (filterCompliance === 'low' && asset.complianceScore < 70);

    return matchesSearch && matchesType && matchesCompliance;
  });

  // Configuration diff viewer
  const ConfigDiffViewer = ({ oldConfig, newConfig, onClose }) => {
    const [expandedSections, setExpandedSections] = useState(new Set(['security']));
    
    const toggleSection = (section) => {
      const newExpanded = new Set(expandedSections);
      if (newExpanded.has(section)) {
        newExpanded.delete(section);
      } else {
        newExpanded.add(section);
      }
      setExpandedSections(newExpanded);
    };

    const getDiffType = (oldVal, newVal) => {
      if (oldVal === undefined) return 'added';
      if (newVal === undefined) return 'removed';
      if (oldVal !== newVal) return 'modified';
      return 'unchanged';
    };

    const renderConfigSection = (sectionName, oldSection = {}, newSection = {}) => {
      const allKeys = new Set([...Object.keys(oldSection), ...Object.keys(newSection)]);
      
      return (
        <div key={sectionName} className="border border-gray-700 rounded-lg mb-4">
          <button
            onClick={() => toggleSection(sectionName)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {expandedSections.has(sectionName) ? 
                <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                <ChevronRight className="w-4 h-4 text-gray-400" />
              }
              <span className="font-medium text-white capitalize">{sectionName}</span>
            </div>
            <span className="text-xs text-gray-400">{allKeys.size} items</span>
          </button>

          {expandedSections.has(sectionName) && (
            <div className="border-t border-gray-700">
              <div className="grid grid-cols-2 gap-0">
                <div className="p-4 border-r border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Baseline Configuration</h4>
                  <div className="space-y-2">
                    {Array.from(allKeys).map(key => {
                      const diffType = getDiffType(oldSection[key], newSection[key]);
                      return (
                        <div key={key} className={`p-2 rounded text-sm ${
                          diffType === 'removed' ? 'bg-red-500/10 text-red-400' :
                          diffType === 'modified' ? 'bg-yellow-500/10 text-yellow-400' :
                          'text-gray-300'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {diffType === 'removed' && <Minus className="w-3 h-3" />}
                            {diffType === 'modified' && <Minus className="w-3 h-3" />}
                            <span className="font-mono text-xs">{key}:</span>
                          </div>
                          <div className="ml-5 font-mono text-xs">
                            {oldSection[key]?.toString() || 'undefined'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Current Configuration</h4>
                  <div className="space-y-2">
                    {Array.from(allKeys).map(key => {
                      const diffType = getDiffType(oldSection[key], newSection[key]);
                      return (
                        <div key={key} className={`p-2 rounded text-sm ${
                          diffType === 'added' ? 'bg-green-500/10 text-green-400' :
                          diffType === 'modified' ? 'bg-yellow-500/10 text-yellow-400' :
                          'text-gray-300'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {diffType === 'added' && <Plus className="w-3 h-3" />}
                            {diffType === 'modified' && <Plus className="w-3 h-3" />}
                            <span className="font-mono text-xs">{key}:</span>
                          </div>
                          <div className="ml-5 font-mono text-xs">
                            {newSection[key]?.toString() || 'undefined'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Configuration Diff Viewer</h2>
              <p className="text-sm text-gray-400">Comparing baseline vs current configuration</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {Object.keys(oldConfig).map(sectionName => 
              renderConfigSection(sectionName, oldConfig[sectionName], newConfig[sectionName])
            )}
          </div>
        </div>
      </div>
    );
  };

  // Asset configuration modal
  const AssetConfigModal = ({ asset, onClose }) => {
    const [activeConfigTab, setActiveConfigTab] = useState('system');
    const [editMode, setEditMode] = useState(false);
    const [editedConfig, setEditedConfig] = useState(asset.configurations);

    const configTabs = Object.keys(asset.configurations);

    const handleSaveConfig = () => {
      // In a real app, this would save to backend
      console.log('Saving configuration:', editedConfig);
      setEditMode(false);
      // Show success notification
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {React.createElement(getAssetIcon(asset.type), { className: "w-6 h-6 text-blue-400" })}
                <div>
                  <h2 className="text-xl font-bold text-white">{asset.name}</h2>
                  <p className="text-sm text-gray-400">{asset.id} • {asset.ip}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    editMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {editMode ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  <span>{editMode ? 'Cancel' : 'Edit'}</span>
                </button>
                {editMode && (
                  <button
                    onClick={handleSaveConfig}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Configuration Tabs */}
            <div className="flex space-x-4 mt-4">
              {configTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveConfigTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    activeConfigTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(asset.configurations[activeConfigTab] || {}).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={Array.isArray(value) ? value.join(', ') : value}
                      onChange={(e) => {
                        const newValue = key === 'dns' ? e.target.value.split(', ') : e.target.value;
                        setEditedConfig(prev => ({
                          ...prev,
                          [activeConfigTab]: {
                            ...prev[activeConfigTab],
                            [key]: newValue
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-700/30 border border-gray-700 rounded-lg text-white font-mono text-sm">
                      {Array.isArray(value) ? value.join(', ') : value.toString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Compliance dashboard component
  const ComplianceDashboard = () => {
    const overallScore = Math.round(
      (complianceStandards.cis.categories.reduce((sum, cat) => sum + cat.score * cat.weight, 0) / 100 +
       complianceStandards.nist.categories.reduce((sum, cat) => sum + cat.score * cat.weight, 0) / 100 +
       complianceStandards.iso27001.categories.reduce((sum, cat) => sum + cat.score * cat.weight, 0) / 100) / 3
    );

    return (
      <div className="space-y-6">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Overall Compliance</p>
                <p className={`text-2xl font-bold ${getComplianceColor(overallScore)}`}>
                  {overallScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Compliant Assets</p>
                <p className="text-2xl font-bold text-green-400">
                  {assets.filter(a => a.complianceScore >= 80).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Issues</p>
                <p className="text-2xl font-bold text-red-400">
                  {assets.reduce((sum, asset) => sum + asset.driftItems.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Drift Detected</p>
                <p className="text-2xl font-bold text-purple-400">
                  {assets.filter(a => a.driftItems.length > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(complianceStandards).map(([key, standard]) => {
            const avgScore = Math.round(
              standard.categories.reduce((sum, cat) => sum + cat.score * cat.weight, 0) / 100
            );
            
            return (
              <div key={key} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{standard.name}</h3>
                    <p className="text-sm text-gray-400">{standard.version}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Score</p>
                    <p className={`text-2xl font-bold ${getComplianceColor(avgScore)}`}>
                      {avgScore}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {standard.categories.map((category,index) => (
                   <div key={index} className="space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-300">{category.name}</span>
                       <span className={`text-sm font-medium ${getComplianceColor(category.score)}`}>
                         {category.score}%
                       </span>
                     </div>
                     <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                       <div
                         className={`h-full transition-all duration-300 ${
                           category.score >= 90 ? 'bg-green-500' :
                           category.score >= 80 ? 'bg-yellow-500' :
                           category.score >= 70 ? 'bg-orange-500' : 'bg-red-500'
                         }`}
                         style={{ width: `${category.score}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           );
         })}
       </div>

       {/* Configuration Drift Detection */}
       <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
         <div className="flex items-center justify-between mb-6">
           <div>
             <h3 className="text-lg font-semibold text-white">Configuration Drift</h3>
             <p className="text-sm text-gray-400">Assets with configuration deviations from baseline</p>
           </div>
           <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
             Scan All Assets
           </button>
         </div>

         <div className="space-y-4">
           {assets.filter(asset => asset.driftItems.length > 0).map(asset => (
             <div key={asset.id} className="border border-gray-700 rounded-lg p-4">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center space-x-3">
                   {React.createElement(getAssetIcon(asset.type), { className: "w-5 h-5 text-blue-400" })}
                   <div>
                     <p className="font-medium text-white">{asset.name}</p>
                     <p className="text-sm text-gray-400">{asset.id}</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-2">
                   <span className="text-sm text-gray-400">{asset.driftItems.length} issues</span>
                   <button
                     onClick={() => setConfigDiff({old: asset.configurations, new: asset.configurations})}
                     className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                   >
                     View Diff
                   </button>
                 </div>
               </div>

               <div className="space-y-2">
                 {asset.driftItems.map((drift, index) => (
                   <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                     <div className="flex items-center space-x-3">
                       <div className={`w-2 h-2 rounded-full ${
                         drift.severity === 'high' ? 'bg-red-500' :
                         drift.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                       }`} />
                       <div>
                         <p className="text-sm font-medium text-white">{drift.item}</p>
                         <p className="text-xs text-gray-400">
                           Expected: {drift.baseline} | Current: {drift.current}
                         </p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                         drift.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                         drift.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                         'bg-blue-500/20 text-blue-400'
                       }`}>
                         {drift.severity}
                       </span>
                       <p className="text-xs text-gray-500 mt-1">
                         {formatTimeAgo(drift.detected)}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
   );
 };

 return (
   <div className="p-6 space-y-6">
     {/* Header */}
     <div className="flex items-center justify-between">
       <div>
         <h1 className="text-2xl font-bold text-white">Configuration Management</h1>
         <p className="text-gray-400 mt-1">Manage assets, configurations, and compliance</p>
       </div>
       <div className="flex items-center space-x-3">
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
         <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
           <Upload className="w-4 h-4" />
           <span>Import Config</span>
         </button>
         <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
           <Download className="w-4 h-4" />
           <span>Export</span>
         </button>
       </div>
     </div>

     {/* Tab Navigation */}
     <div className="flex space-x-6 border-b border-gray-700">
       {[
         { id: 'assets', label: 'Asset Management', icon: Server },
         { id: 'compliance', label: 'Compliance Dashboard', icon: Shield },
         { id: 'drift', label: 'Configuration Drift', icon: GitCompare }
       ].map(tab => {
         const Icon = tab.icon;
         return (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
               activeTab === tab.id
                 ? 'border-blue-500 text-blue-400'
                 : 'border-transparent text-gray-400 hover:text-white'
             }`}
           >
             <Icon className="w-5 h-5" />
             <span className="font-medium">{tab.label}</span>
           </button>
         );
       })}
     </div>

     {/* Assets Tab */}
     {activeTab === 'assets' && (
       <div className="space-y-6">
         {/* Search and Filter Bar */}
         <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
             <div className="flex-1 max-w-md">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                 <input
                   type="text"
                   placeholder="Search assets..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                 />
               </div>
             </div>

             <div className="flex items-center space-x-3">
               <select
                 value={filterAssetType}
                 onChange={(e) => setFilterAssetType(e.target.value)}
                 className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
               >
                 <option value="all">All Types</option>
                 <option value="laptop">Laptops</option>
                 <option value="server">Servers</option>
                 <option value="mobile">Mobile</option>
                 <option value="printer">Printers</option>
               </select>

               <select
                 value={filterCompliance}
                 onChange={(e) => setFilterCompliance(e.target.value)}
                 className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
               >
                 <option value="all">All Compliance</option>
                 <option value="high">High (90%+)</option>
                 <option value="medium">Medium (70-89%)</option>
                 <option value="low">Low ({"<70%"})</option>
               </select>

               <button
                 disabled={loading}
                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
               >
                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                 <span>Refresh</span>
               </button>
             </div>
           </div>
         </div>

         {/* Assets Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredAssets.map(asset => {
             const AssetIcon = getAssetIcon(asset.type);
             return (
               <div key={asset.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-colors">
                 {/* Asset Header */}
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                       <AssetIcon className="w-5 h-5 text-blue-400" />
                     </div>
                     <div>
                       <h3 className="font-medium text-white">{asset.name}</h3>
                       <p className="text-sm text-gray-400">{asset.id}</p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                       {asset.status}
                     </span>
                   </div>
                 </div>

                 {/* Asset Details */}
                 <div className="space-y-3 mb-4">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-400">OS:</span>
                     <span className="text-sm text-white">{asset.os}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-400">IP:</span>
                     <span className="text-sm text-white font-mono">{asset.ip}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-400">Owner:</span>
                     <span className="text-sm text-white">{asset.owner}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-gray-400">Last Seen:</span>
                     <span className="text-sm text-white">{formatTimeAgo(asset.lastSeen)}</span>
                   </div>
                 </div>

                 {/* Compliance Score */}
                 <div className="mb-4">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-sm text-gray-400">Compliance Score</span>
                     <span className={`text-sm font-medium ${getComplianceColor(asset.complianceScore)}`}>
                       {asset.complianceScore}%
                     </span>
                   </div>
                   <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                     <div
                       className={`h-full transition-all duration-300 ${
                         asset.complianceScore >= 90 ? 'bg-green-500' :
                         asset.complianceScore >= 80 ? 'bg-yellow-500' :
                         asset.complianceScore >= 70 ? 'bg-orange-500' : 'bg-red-500'
                       }`}
                       style={{ width: `${asset.complianceScore}%` }}
                     />
                   </div>
                 </div>

                 {/* Risk Level */}
                 <div className="flex items-center justify-between mb-4">
                   <span className="text-sm text-gray-400">Risk Level:</span>
                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(asset.riskLevel)}`}>
                     {asset.riskLevel}
                   </span>
                 </div>

                 {/* Configuration Issues */}
                 {asset.driftItems.length > 0 && (
                   <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                     <div className="flex items-center space-x-2 mb-2">
                       <AlertTriangle className="w-4 h-4 text-red-400" />
                       <span className="text-sm font-medium text-red-400">Configuration Issues</span>
                     </div>
                     <p className="text-xs text-red-300">
                       {asset.driftItems.length} drift(s) detected
                     </p>
                   </div>
                 )}

                 {/* Actions */}
                 <div className="flex items-center space-x-2">
                   <button
                     onClick={() => setSelectedAsset(asset)}
                     className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                   >
                     <Eye className="w-4 h-4" />
                     <span>View Config</span>
                   </button>
                   <button
                     onClick={() => setConfigDiff({old: asset.configurations, new: asset.configurations})}
                     className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                   >
                     <GitCompare className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             );
           })}
         </div>

         {filteredAssets.length === 0 && (
           <div className="text-center py-12">
             <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-gray-500" />
             </div>
             <h3 className="text-lg font-medium text-gray-400 mb-2">No assets found</h3>
             <p className="text-gray-500">Try adjusting your search or filter criteria</p>
           </div>
         )}
       </div>
     )}

     {/* Compliance Tab */}
     {activeTab === 'compliance' && <ComplianceDashboard />}

     {/* Configuration Drift Tab */}
     {activeTab === 'drift' && (
       <div className="space-y-6">
         {/* Drift Overview */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                 <AlertTriangle className="w-6 h-6 text-red-400" />
               </div>
               <div>
                 <p className="text-sm text-gray-400">Assets with Drift</p>
                 <p className="text-2xl font-bold text-red-400">
                   {assets.filter(a => a.driftItems.length > 0).length}
                 </p>
               </div>
             </div>
           </div>

           <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                 <Clock className="w-6 h-6 text-yellow-400" />
               </div>
               <div>
                 <p className="text-sm text-gray-400">Total Drift Items</p>
                 <p className="text-2xl font-bold text-yellow-400">
                   {assets.reduce((sum, asset) => sum + asset.driftItems.length, 0)}
                 </p>
               </div>
             </div>
           </div>

           <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                 <TrendingUp className="w-6 h-6 text-purple-400" />
               </div>
               <div>
                 <p className="text-sm text-gray-400">Critical Issues</p>
                 <p className="text-2xl font-bold text-purple-400">
                   {assets.reduce((sum, asset) => 
                     sum + asset.driftItems.filter(d => d.severity === 'high').length, 0
                   )}
                 </p>
               </div>
             </div>
           </div>
         </div>

         {/* Drift Detection Results */}
         <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="text-lg font-semibold text-white">Configuration Drift Detection</h3>
               <p className="text-sm text-gray-400">Real-time monitoring of configuration changes</p>
             </div>
             <div className="flex items-center space-x-3">
               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                 <RefreshCw className="w-4 h-4" />
                 <span>Scan Now</span>
               </button>
               <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                 <Settings className="w-4 h-4" />
                 <span>Configure Baselines</span>
               </button>
             </div>
           </div>

           {/* Drift Results Table */}
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead className="bg-gray-700/50">
                 <tr>
                   <th className="p-3 text-left text-gray-300 font-medium text-sm">Asset</th>
                   <th className="p-3 text-left text-gray-300 font-medium text-sm">Configuration Item</th>
                   <th className="p-3 text-left text-gray-300 font-medium text-sm">Severity</th>
                   <th className="p-3 text-left text-gray-300 font-medium text-sm">Expected</th>
                   <th className="p-3 text-left text-gray-300 font-medium text-sm">Current</th>
                   <th className="p-3 text-left text-gray-300 font-medium text-sm">Detected</th>
                   <th className="p-3 text-left text-gray-300 font-medium text-sm">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {assets.flatMap(asset => 
                   asset.driftItems.map((drift, index) => (
                     <tr key={`${asset.id}-${index}`} className="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                       <td className="p-3">
                         <div className="flex items-center space-x-2">
                           {React.createElement(getAssetIcon(asset.type), { className: "w-4 h-4 text-blue-400" })}
                           <div>
                             <p className="text-sm font-medium text-white">{asset.name}</p>
                             <p className="text-xs text-gray-400">{asset.id}</p>
                           </div>
                         </div>
                       </td>
                       <td className="p-3">
                         <p className="text-sm text-white">{drift.item}</p>
                         <p className="text-xs text-gray-400 capitalize">{drift.category}</p>
                       </td>
                       <td className="p-3">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           drift.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                           drift.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                           'bg-blue-500/20 text-blue-400'
                         }`}>
                           {drift.severity}
                         </span>
                       </td>
                       <td className="p-3">
                         <p className="text-sm text-white font-mono max-w-xs truncate">
                           {drift.baseline}
                         </p>
                       </td>
                       <td className="p-3">
                         <p className="text-sm text-white font-mono max-w-xs truncate">
                           {drift.current}
                         </p>
                       </td>
                       <td className="p-3">
                         <p className="text-sm text-white">{formatTimeAgo(drift.detected)}</p>
                       </td>
                       <td className="p-3">
                         <div className="flex items-center space-x-2">
                           <button
                             onClick={() => setConfigDiff({old: asset.configurations, new: asset.configurations})}
                             className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
                           >
                             View Diff
                           </button>
                           <button className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors">
                             Remediate
                           </button>
                         </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
             
             {assets.every(asset => asset.driftItems.length === 0) && (
               <div className="text-center py-8">
                 <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle className="w-8 h-8 text-green-400" />
                 </div>
                 <h3 className="text-lg font-medium text-green-400 mb-2">No Configuration Drift Detected</h3>
                 <p className="text-gray-400">All assets are compliant with their baseline configurations</p>
               </div>
             )}
           </div>
         </div>
       </div>
     )}

     {/* Modals */}
     {selectedAsset && (
       <AssetConfigModal
         asset={selectedAsset}
         onClose={() => setSelectedAsset(null)}
       />
     )}

     {configDiff && (
       <ConfigDiffViewer
         oldConfig={configDiff.old}
         newConfig={configDiff.new}
         onClose={() => setConfigDiff(null)}
       />
     )}
   </div>
 );
};

export default Configuration;