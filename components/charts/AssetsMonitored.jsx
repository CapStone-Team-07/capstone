import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Server, 
  Monitor, 
  Smartphone, 
  Printer, 
  Router, 
  Shield, 
  Wifi,
  HardDrive,
  Cloud,
  Globe,
  Search,
  Filter,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Network,
  Layers,
  Grid,
  Info,
  Download,
  Upload,
  Play,
  Pause,
  MoreHorizontal,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AssetsMonitored = () => {
  // State management
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewMode, setViewMode] = useState('topology');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    types: [],
    status: [],
    criticality: [],
    location: []
  });

  // Canvas references
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // EDR API Configuration - Using your backend proxy
  const EDR_CONFIG = {
    url: 'http://192.168.80.247:5555/api/devices',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Asset type mapping
  const assetTypeMap = {
    workstation: { icon: Monitor, color: '#f59e0b', category: 'Endpoint' },
    server: { icon: Server, color: '#8b5cf6', category: 'Infrastructure' },
    default: { icon: HardDrive, color: '#6b7280', category: 'Other' }
  };

  // Transform EDR API data to component format
  const transformEdrAsset = (edrDevice, index) => {
    console.log('Transforming EDR device:', edrDevice);
    
    if (!edrDevice) {
      console.warn('Device is null or undefined');
      return null;
    }
    
    // Determine device type based on form factor or OS
    let deviceType = 'workstation';
    if (edrDevice.formfactor === 1) deviceType = 'server';
    else if (edrDevice.formfactor === 2) deviceType = 'workstation';
    else if (edrDevice.formfactor === 3) deviceType = 'workstation';
    
    const typeInfo = assetTypeMap[deviceType] || assetTypeMap.default;
    
    // Auto-layout positioning
    const getAutoPosition = (index, total) => {
      const cols = Math.ceil(Math.sqrt(total));
      const row = Math.floor(index / cols);
      const col = index % cols;
      return {
        x: 150 + col * 200,
        y: 150 + row * 150
      };
    };

    const position = getAutoPosition(index, 10);
    
    // Determine status
    let status = 'offline';
    if (edrDevice.is_online && edrDevice.is_online_http) {
      status = 'online';
    } else if (edrDevice.online_status === 1) {
      status = 'online';
    } else if (edrDevice.patches_available_count > 0) {
      status = 'warning';
    }
    
    // Determine criticality based on security factors
    let criticality = 'low';
    if (edrDevice.patches_available_count > 2) criticality = 'high';
    else if (edrDevice.patches_available_count > 0) criticality = 'medium';
    
    // Extract IP addresses
    const primaryIP = edrDevice.net?.internal_ip_addresses?.[0] || '0.0.0.0';
    
    // Calculate uptime (convert from timestamp to days)
    const now = Date.now() / 1000;
    const uptimeDays = edrDevice.was_active_at ? 
      Math.floor((now - edrDevice.was_active_at) / 86400) : 0;

    const transformed = {
      id: edrDevice.uuid || `device-${edrDevice.id}`,
      name: edrDevice.name || edrDevice.friendly_name || `Device-${edrDevice.id}`,
      type: deviceType,
      typeInfo,
      x: position.x,
      y: position.y,
      status,
      criticality,
      location: 'Office', // Default location since not in EDR data
      ip: primaryIP,
      lastSeen: new Date((edrDevice.was_active_at || Date.now() / 1000) * 1000),
      uptime: Math.max(0, uptimeDays),
      connections: [], // No connection data in EDR API
      metadata: {
        cpu: edrDevice.cpu?.total || 0,
        cpuFrequency: edrDevice.cpu?.frequency || 0,
        memory: edrDevice.ram?.usage_percent || 0,
        memoryUsageMB: edrDevice.ram?.usage_mb || 0,
        memoryTotalMB: edrDevice.ram?.total || 0,
        storage: edrDevice.disks?.[0] ? 
          Math.round(((edrDevice.disks[0].size - edrDevice.disks[0].free) / edrDevice.disks[0].size) * 100) : 0,
        storageSizeMB: edrDevice.disks?.[0]?.size || 0,
        storageFreeMB: edrDevice.disks?.[0]?.free || 0,
        manufacturer: edrDevice.hardware?.system_manufacturer || 'Unknown',
        model: edrDevice.hardware?.system_model || 'Unknown',
        serialNumber: edrDevice.hardware?.serial_number || 'N/A',
        processor: edrDevice.hardware?.processor || 'Unknown',
        user: edrDevice.logged_in_user || 'N/A',
        domain: edrDevice.logged_in_user?.split('\\')[0] || 'N/A',
        lastLogin: edrDevice.last_logged_at ? 
          new Date(edrDevice.last_logged_at * 1000).toLocaleString() : 'N/A',
        os: edrDevice.os_name || 'Unknown',
        osVersion: edrDevice.os_version || 'N/A',
        agentVersion: edrDevice.agent_version || 'N/A',
        ccvVersion: edrDevice.ccv_version || 'N/A',
        externalIP: edrDevice.net?.external_ip_addresses?.[0] || 'N/A',
        allInternalIPs: edrDevice.net?.internal_ip_addresses || [],
        allExternalIPs: edrDevice.net?.external_ip_addresses || [],
        diskName: edrDevice.disks?.[0]?.name || 'N/A',
        isRooted: edrDevice.is_rooted || false,
        hasGui: edrDevice.hasGui || false,
        isManaged: edrDevice.is_managed || false,
        formFactor: edrDevice.formfactor || 0,
        lockType: edrDevice.lock_type || 0,
        mdmActive: edrDevice.is_mdm_active || false,
        takeoverEnabled: edrDevice.takeover_enable || false
      },
      // Security and compliance data
      vulnerabilities: {
        total: edrDevice.patches_available_count || 0,
        critical: 0, // Not available in EDR data
        high: 0,
        medium: edrDevice.patches_available_count || 0,
        low: 0
      },
      patchLevel: edrDevice.patches_status || 0,
      pendingPatches: edrDevice.patches_available_count || 0,
      securityScore: edrDevice.patches_available_count === 0 ? 95 : 
        Math.max(20, 95 - (edrDevice.patches_available_count * 15)),
      complianceScore: edrDevice.is_mdm_active ? 90 : 50,
      riskLevel: edrDevice.patches_available_count > 2 ? 'high' : 
        edrDevice.patches_available_count > 0 ? 'medium' : 'low',
      securityControls: {
        edr: edrDevice.is_edr_installed || false,
        ces: edrDevice.is_ces_installed || false,
        antivirus: edrDevice.active_components?.CCS > 0,
        firewall: true // Assume Windows firewall
      },
      compliance: {
        managed: edrDevice.is_managed || false,
        mdmActive: edrDevice.is_mdm_active || false,
        agentInstalled: edrDevice.has_dm_client || false
      },
      tags: [
        edrDevice.os_name?.includes('Windows') ? 'Windows' : 'Other OS',
        edrDevice.is_online ? 'Online' : 'Offline',
        edrDevice.is_managed ? 'Managed' : 'Unmanaged'
      ].filter(Boolean),
      businessFunction: 'General Workstation',
      notes: edrDevice.notes || '',
      // Additional EDR specific data
      edrData: {
        id: edrDevice.id,
        uuid: edrDevice.uuid,
        mdmToken: edrDevice.mdm_token,
        addedAt: edrDevice.added_at,
        onlineStatusAt: edrDevice.online_status_at,
        activeComponents: edrDevice.active_components || {},
        remoteToolsSupport: edrDevice.remote_tools_support || {},
        billing: edrDevice.billing || {},
        owner: edrDevice.owner || {},
        company: edrDevice.company || {}
      }
    };
    
    console.log('Transformed EDR device:', transformed);
    return transformed;
  };

  // Fetch assets from EDR API
  const fetchAssetsFromEDR = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching assets from EDR API...');
      
      const response = await fetch(EDR_CONFIG.url, {
        method: 'GET',
        headers: EDR_CONFIG.headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('EDR API response:', data);
      
      // Handle the response structure from your backend proxy
      const devices = data.devices || data.data || [];
      
      if (devices.length === 0) {
        console.warn('No devices found in EDR response');
        setAssets([]);
        return;
      }
      
      // Transform EDR data to component format
      const transformedAssets = devices.map((device, index) => {
        return transformEdrAsset(device, index);
      }).filter(asset => asset !== null);
      
      console.log('Transformed EDR assets:', transformedAssets);
      setAssets(transformedAssets);
      
    } catch (error) {
      console.error('Error fetching EDR assets:', error);
      
      // Show user-friendly error message
      if (error.message.includes('CORS')) {
        console.error('CORS Error: Please ensure your backend proxy is running and configured correctly');
      } else if (error.message.includes('Failed to fetch')) {
        console.error('Network Error: Unable to connect to backend proxy at', EDR_CONFIG.url);
      }
      
      // Fallback to empty array on error
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize assets on component mount
  useEffect(() => {
    fetchAssetsFromEDR();
  }, [fetchAssetsFromEDR]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAssetsFromEDR();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAssetsFromEDR]);

  // Filter assets based on search and filters
  const filteredAssets = useMemo(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip.includes(searchTerm) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.metadata.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter(asset => filters.types.includes(asset.type));
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(asset => filters.status.includes(asset.status));
    }

    if (filters.criticality.length > 0) {
      filtered = filtered.filter(asset => filters.criticality.includes(asset.criticality));
    }

    if (filters.location.length > 0) {
      filtered = filtered.filter(asset => filters.location.includes(asset.location));
    }

    return filtered;
  }, [assets, searchTerm, filters]);

  // Get asset connections for drawing lines
  const getConnections = useCallback(() => {
    const connections = [];
    filteredAssets.forEach(asset => {
      asset.connections.forEach(targetId => {
        const target = filteredAssets.find(a => a.id === targetId);
        if (target) {
          connections.push({
            source: asset,
            target: target,
            id: `${asset.id}-${targetId}`
          });
        }
      });
    });
    return connections;
  }, [filteredAssets]);

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'offline': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'maintenance': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const formatUptime = (days) => {
    if (days < 1) return '< 1 day';
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle canvas interactions
  const handleMouseDown = (e) => {
    if (e.target.closest('.asset-node') || e.target.closest('.asset-controls')) return;
    
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.max(0.3, Math.min(3, prev + delta)));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Asset Node Component
  const AssetNode = ({ asset, onClick }) => {
    const Icon = asset.typeInfo.icon;
    const isSelected = selectedAssets.has(asset.id);
    
    return (
      <g
        className="asset-node cursor-pointer"
        transform={`translate(${asset.x}, ${asset.y})`}
        onClick={() => onClick(asset)}
      >
        {/* Selection ring */}
        {isSelected && (
          <circle
            cx="0"
            cy="0"
            r="35"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0;360"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        
        {/* Asset background */}
        <circle
          cx="0"
          cy="0"
          r="25"
          fill={asset.typeInfo.color}
          fillOpacity="0.2"
          stroke={getStatusColor(asset.status)}
          strokeWidth="3"
        />
        
        {/* Asset icon */}
        <foreignObject x="-10" y="-10" width="20" height="20">
          <Icon className="w-5 h-5 text-white" />
        </foreignObject>
        
        {/* Status indicator */}
        <circle
          cx="18"
          cy="-18"
          r="5"
          fill={getStatusColor(asset.status)}
        />
        
        {/* Criticality indicator */}
        <rect
          x="-3"
          y="22"
          width="6"
          height="10"
          fill={getCriticalityColor(asset.criticality)}
          rx="3"
        />
        
        {/* Asset name */}
        <text
          x="0"
          y="45"
          textAnchor="middle"
          className="fill-white text-sm font-medium"
          style={{ fontSize: '12px' }}
        >
          {asset.name}
        </text>
        
        {/* IP Address */}
        <text
          x="0"
          y="58"
          textAnchor="middle"
          className="fill-gray-400 text-xs"
          style={{ fontSize: '10px' }}
        >
          {asset.ip}
        </text>
      </g>
    );
  };

  // Connection Line Component
  const ConnectionLine = ({ connection }) => (
    <line
      x1={connection.source.x}
      y1={connection.source.y}
      x2={connection.target.x}
      y2={connection.target.y}
      stroke="#4b5563"
      strokeWidth="2"
      strokeDasharray="3,3"
      opacity="0.7"
    />
  );

  // Asset Details Panel
  const AssetDetailsPanel = ({ asset, onClose }) => (
    <div className="absolute top-4 right-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Type:</span>
            <p className="text-white capitalize">{asset.type}</p>
          </div>
          <div>
            <span className="text-gray-400">Status:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getStatusColor(asset.status) }} />
              <span className="text-white capitalize">{asset.status}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400">IP Address:</span>
            <p className="text-white font-mono">{asset.ip}</p>
          </div>
          <div>
            <span className="text-gray-400">Serial Number:</span>
            <p className="text-white font-mono text-xs">{asset.metadata.serialNumber}</p>
          </div>
          <div>
            <span className="text-gray-400">Model:</span>
            <p className="text-white">{asset.metadata.model}</p>
          </div>
          <div>
            <span className="text-gray-400">Manufacturer:</span>
            <p className="text-white">{asset.metadata.manufacturer}</p>
          </div>
        </div>

        {/* System Performance */}
        <div>
          <h4 className="text-white font-medium mb-2">System Performance</h4>
          <div className="space-y-2">
            {/* CPU Usage */}
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">CPU Cores</span>
                <span className="text-white">{asset.metadata.cpu} cores @ {asset.metadata.cpuFrequency}MHz</span>
              </div>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-white">{asset.metadata.memory}% ({formatBytes(asset.metadata.memoryUsageMB * 1024 * 1024)})</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${asset.metadata.memory}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">
                Total: {formatBytes(asset.metadata.memoryTotalMB * 1024 * 1024)}
              </div>
            </div>
            
            {/* Storage Usage */}
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Storage ({asset.metadata.diskName})</span>
                <span className="text-white">{asset.metadata.storage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${asset.metadata.storage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">
                Free: {formatBytes(asset.metadata.storageFreeMB * 1024 * 1024)} / Total: {formatBytes(asset.metadata.storageSizeMB * 1024 * 1024)}
              </div>
            </div>
          </div>
        </div>

        {/* Network Information */}
        <div>
          <h4 className="text-white font-medium mb-2">Network</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">External IP:</span>
              <span className="text-white font-mono">{asset.metadata.externalIP}</span>
            </div>
            {asset.metadata.allInternalIPs.length > 1 && (
              <div>
                <span className="text-gray-400">All Internal IPs:</span>
                <div className="max-h-20 overflow-y-auto">
                  {asset.metadata.allInternalIPs.map((ip, index) => (
                    <div key={index} className="text-white font-mono text-xs">{ip}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User & Domain Info */}
        <div>
          <h4 className="text-white font-medium mb-2">User Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Current User:</span>
              <span className="text-white">{asset.metadata.user}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Domain:</span>
              <span className="text-white">{asset.metadata.domain}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Login:</span>
              <span className="text-white text-xs">{asset.metadata.lastLogin}</span>
            </div>
          </div>
        </div>

        {/* Operating System */}
        <div>
          <h4 className="text-white font-medium mb-2">Operating System</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">OS:</span>
              <span className="text-white">{asset.metadata.os}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Version:</span>
              <span className="text-white">{asset.metadata.osVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Processor:</span>
              <span className="text-white text-xs">{asset.metadata.processor}</span>
            </div>
          </div>
        </div>

        {/* Security & Compliance */}
        <div>
          <h4 className="text-white font-medium mb-2">Security & Compliance</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Security Score:</span>
              <span className={`font-medium ${
                asset.securityScore >= 80 ? 'text-green-400' :
                asset.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>{asset.securityScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Compliance Score:</span>
              <span className={`font-medium ${
                asset.complianceScore >= 80 ? 'text-green-400' :
                asset.complianceScore >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>{asset.complianceScore}/100</span>
            </div>
            {asset.pendingPatches > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Pending Patches:</span>
                <span className="text-orange-400">{asset.pendingPatches}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">MDM Active:</span>
              <span className={asset.metadata.mdmActive ? 'text-green-400' : 'text-red-400'}>
                {asset.metadata.mdmActive ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Managed:</span>
              <span className={asset.metadata.isManaged ? 'text-green-400' : 'text-red-400'}>
                {asset.metadata.isManaged ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Agent Information */}
        <div>
          <h4 className="text-white font-medium mb-2">Agent Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Agent Version:</span>
              <span className="text-white">{asset.metadata.agentVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">CCV Version:</span>
              <span className="text-white">{asset.metadata.ccvVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remote Access:</span>
              <span className={asset.metadata.takeoverEnabled ? 'text-green-400' : 'text-red-400'}>
                {asset.metadata.takeoverEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-1">
              {asset.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Last Seen */}
        <div className="text-xs text-gray-500">
          Last seen: {asset.lastSeen.toLocaleString()}
        </div>
      </div>
    </div>
  );

  // Filter Panel Component
  const FilterPanel = () => (
    <div className="absolute top-16 left-4 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Asset Types */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Asset Types</label>
          <div className="space-y-1">
            {Array.from(new Set(assets.map(a => a.type))).map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters(prev => ({ ...prev, types: [...prev.types, type] }));
                    } else {
                      setFilters(prev => ({ ...prev, types: prev.types.filter(t => t !== type) }));
                    }
                  }}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <div className="space-y-1">
            {['online', 'offline', 'warning', 'maintenance'].map(status => (
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
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getStatusColor(status) }} />
                  <span className="text-sm text-gray-300 capitalize">{status}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => setFilters({ types: [], status: [], criticality: [], location: [] })}
          className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">EDR Assets Monitor</h1>
          <p className="text-gray-400 mt-1">
            Monitoring {filteredAssets.length} managed devices via Comodo EDR
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            <span>{assets.filter(a => a.status === 'online').length} online</span>
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

      {/* Controls Bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search and View Controls */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices by name, IP, or serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-80"
              />
            </div>

            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('topology')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'topology' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Network className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(filters.types.length > 0 || filters.status.length > 0) && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {filters.types.length + filters.status.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowMiniMap(!showMiniMap)}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                showMiniMap ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Mini Map</span>
            </button>

            <button
              onClick={resetView}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Reset View</span>
            </button>

            <button
              onClick={fetchAssetsFromEDR}
              disabled={loading}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh EDR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl relative overflow-hidden" style={{ height: '600px' }}>
        {loading && (
          <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center z-20">
            <div className="flex flex-col items-center space-y-3 text-white">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span>Loading devices from Comodo EDR...</span>
              <span className="text-sm text-gray-400">Fetching device information</span>
            </div>
          </div>
        )}

        {/* Topology View */}
        {viewMode === 'topology' && (
          <div
            ref={containerRef}
            className="w-full h-full cursor-move relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <svg
              ref={canvasRef}
              className="w-full h-full"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center'
              }}
            >
              {/* Background Grid */}
              <defs>
                <pattern
                  id="grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="0.5"
                    opacity="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Connection Lines */}
              {getConnections().map((connection) => (
                <ConnectionLine key={connection.id} connection={connection} />
              ))}

              {/* Asset Nodes */}
              {filteredAssets.map((asset) => (
                <AssetNode
                  key={asset.id}
                  asset={asset}
                  onClick={(asset) => {
                    if (selectedAssets.has(asset.id)) {
                      setSelectedAssets(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(asset.id);
                        return newSet;
                      });
                      setSelectedAsset(null);
                    } else {
                      setSelectedAssets(new Set([asset.id]));
                      setSelectedAsset(asset);
                    }
                  }}
                />
              ))}
            </svg>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col space-y-2 asset-controls">
              <button
                onClick={() => handleZoom(0.1)}
                className="w-10 h-10 bg-gray-700/90 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleZoom(-0.1)}
                className="w-10 h-10 bg-gray-700/90 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <div className="bg-gray-700/90 px-2 py-1 rounded text-white text-xs text-center">
                {Math.round(zoomLevel * 100)}%
              </div>
            </div>

            {/* Mini Map */}
            {showMiniMap && (
              <div className="absolute top-4 left-4 w-48 h-32 bg-gray-900/90 border border-gray-600 rounded-lg overflow-hidden asset-controls">
                <svg className="w-full h-full" viewBox="0 0 800 600">
                  {/* Mini map background */}
                  <rect width="800" height="600" fill="#1f2937" opacity="0.8" />
                  
                  {/* Mini asset nodes */}
                  {filteredAssets.map((asset) => (
                    <circle
                      key={asset.id}
                      cx={asset.x}
                      cy={asset.y}
                      r="3"
                      fill={getStatusColor(asset.status)}
                    />
                  ))}
                  
                  {/* Viewport indicator */}
                  <rect
                    x={-panOffset.x / zoomLevel + 400}
                    y={-panOffset.y / zoomLevel + 300}
                    width={800 / zoomLevel}
                    height={600 / zoomLevel}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="p-6 overflow-y-auto h-full">
            {filteredAssets.length === 0 && !loading ? (
              <div className="col-span-full p-8 text-center text-gray-400">
                <div className="flex flex-col items-center space-y-3">
                  <Shield className="w-16 h-16 text-gray-600" />
                  <h3 className="text-lg font-medium">No Devices Found</h3>
                  <p className="text-sm">
                    {assets.length === 0 
                      ? 'No devices available from the EDR API. Check your connection and credentials.'
                      : 'No devices match your current filters. Try adjusting your search criteria.'
                    }
                  </p>
                  {assets.length === 0 && (
                    <button
                      onClick={fetchAssetsFromEDR}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Retry EDR Connection
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAssets.map((asset) => {
                  const Icon = asset.typeInfo.icon;
                  return (
                    <div
                      key={asset.id}
                      className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors cursor-pointer"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: asset.typeInfo.color + '30' }}
                        >
                          <Icon className="w-5 h-5" style={{ color: asset.typeInfo.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">{asset.name}</h3>
                          <p className="text-xs text-gray-400">{asset.metadata.model}</p>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getStatusColor(asset.status) }}
                        />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">IP:</span>
                          <span className="text-white font-mono">{asset.ip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">User:</span>
                          <span className="text-white text-xs truncate">{asset.metadata.user}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Memory:</span>
                          <span className="text-white">{asset.metadata.memory}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Security Score:</span>
                          <span className={`font-medium ${
                            asset.securityScore >= 80 ? 'text-green-400' :
                            asset.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{asset.securityScore}/100</span>
                        </div>
                        {asset.pendingPatches > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Pending Patches:</span>
                            <span className="text-orange-400">{asset.pendingPatches}</span>
                          </div>
                        )}
                      </div>

                      {/* Memory usage bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">RAM Usage</span>
                          <span className="text-white">{formatBytes(asset.metadata.memoryUsageMB * 1024 * 1024)}</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div
                            className="bg-green-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${asset.metadata.memory}%` }}
                          />
                        </div>
                      </div>

                      {/* Tags */}
                      {asset.tags && asset.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {asset.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {asset.tags.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{asset.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Asset Details Panel */}
        {selectedAsset && (
          <AssetDetailsPanel
            asset={selectedAsset}
            onClose={() => {
              setSelectedAsset(null);
              setSelectedAssets(new Set());
            }}
          />
        )}

        {/* Filter Panel */}
        {showFilters && <FilterPanel />}
      </div>

      {/* Statistics Footer */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {assets.filter(a => a.status === 'online').length}
          </div>
          <div className="text-sm text-gray-400">Online Devices</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {assets.filter(a => a.status === 'offline').length}
          </div>
          <div className="text-sm text-gray-400">Offline Devices</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {assets.filter(a => a.pendingPatches > 0).length}
          </div>
          <div className="text-sm text-gray-400">Need Patches</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {assets.filter(a => a.metadata.mdmActive).length}
          </div>
          <div className="text-sm text-gray-400">MDM Managed</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(assets.reduce((sum, a) => sum + a.securityScore, 0) / Math.max(assets.length, 1))}
          </div>
          <div className="text-sm text-gray-400">Avg Security Score</div>
        </div>
      </div>
    </div>
  );
};

export default AssetsMonitored;