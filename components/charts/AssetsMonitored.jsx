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
  const [viewMode, setViewMode] = useState('topology'); // topology, grid, list
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

  // Generate mock network assets with realistic topology
  const generateNetworkAssets = useCallback(() => {
    const assetTypes = [
      { type: 'firewall', icon: Shield, color: '#ef4444', category: 'Security' },
      { type: 'router', icon: Router, color: '#3b82f6', category: 'Network' },
      { type: 'switch', icon: Network, color: '#06b6d4', category: 'Network' },
      { type: 'server', icon: Server, color: '#10b981', category: 'Compute' },
      { type: 'workstation', icon: Monitor, color: '#f59e0b', category: 'Endpoint' },
      { type: 'mobile', icon: Smartphone, color: '#8b5cf6', category: 'Endpoint' },
      { type: 'printer', icon: Printer, color: '#6b7280', category: 'IoT' },
      { type: 'wifi', icon: Wifi, color: '#ec4899', category: 'Network' },
      { type: 'cloud', icon: Cloud, color: '#06b6d4', category: 'Cloud' },
      { type: 'storage', icon: HardDrive, color: '#84cc16', category: 'Storage' }
    ];

    const statuses = ['online', 'offline', 'warning', 'maintenance'];
    const criticalities = ['critical', 'high', 'medium', 'low'];
    const locations = ['HQ-Floor1', 'HQ-Floor2', 'DC-East', 'DC-West', 'Branch-NY', 'Cloud-AWS'];

    const assets = [];
    
    // Core infrastructure first (centered positioning)
    const coreAssets = [
      { type: 'firewall', name: 'Main-Firewall', x: 400, y: 200, connections: ['router-1', 'router-2'] },
      { type: 'router', name: 'Core-Router-1', x: 200, y: 300, connections: ['switch-1', 'switch-2'] },
      { type: 'router', name: 'Core-Router-2', x: 600, y: 300, connections: ['switch-3', 'switch-4'] },
      { type: 'switch', name: 'Access-Switch-1', x: 100, y: 450, connections: [] },
      { type: 'switch', name: 'Access-Switch-2', x: 300, y: 450, connections: [] },
      { type: 'switch', name: 'Access-Switch-3', x: 500, y: 450, connections: [] },
      { type: 'switch', name: 'Access-Switch-4', x: 700, y: 450, connections: [] }
    ];

    // Add core assets
    coreAssets.forEach((asset, index) => {
      const typeInfo = assetTypes.find(t => t.type === asset.type);
      const status = index < 6 ? 'online' : statuses[Math.floor(Math.random() * statuses.length)];
      
      assets.push({
        id: `${asset.type}-${index + 1}`,
        name: asset.name,
        type: asset.type,
        typeInfo,
        x: asset.x,
        y: asset.y,
        status,
        criticality: asset.type === 'firewall' ? 'critical' : 
                    asset.type === 'router' ? 'high' : 'medium',
        location: index < 4 ? 'HQ-Floor1' : 'HQ-Floor2',
        ip: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 254) + 1}`,
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        uptime: Math.floor(Math.random() * 365),
        connections: asset.connections,
        metadata: {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          storage: Math.floor(Math.random() * 100),
          networkLoad: Math.floor(Math.random() * 100)
        }
      });
    });

    // Add endpoint devices connected to switches
    const switchPositions = [
      { x: 100, y: 450, switchId: 'switch-1' },
      { x: 300, y: 450, switchId: 'switch-2' },
      { x: 500, y: 450, switchId: 'switch-3' },
      { x: 700, y: 450, switchId: 'switch-4' }
    ];

    switchPositions.forEach((pos, switchIndex) => {
      // Add workstations
      for (let i = 0; i < 3; i++) {
        const angle = (i * 60) + (switchIndex * 15);
        const radius = 80 + (i * 20);
        const x = pos.x + Math.cos(angle * Math.PI / 180) * radius;
        const y = pos.y + Math.sin(angle * Math.PI / 180) * radius;
        
        const typeInfo = assetTypes.find(t => t.type === 'workstation');
        assets.push({
          id: `workstation-${switchIndex + 1}-${i + 1}`,
          name: `WS-${String.fromCharCode(65 + switchIndex)}${i + 1}`,
          type: 'workstation',
          typeInfo,
          x: Math.max(50, Math.min(750, x)),
          y: Math.max(50, Math.min(550, y)),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          criticality: criticalities[Math.floor(Math.random() * criticalities.length)],
          location: locations[Math.floor(Math.random() * locations.length)],
          ip: `192.168.${switchIndex + 1}.${i + 10}`,
          lastSeen: new Date(Date.now() - Math.random() * 3600000),
          uptime: Math.floor(Math.random() * 365),
          connections: [pos.switchId],
          metadata: {
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100),
            storage: Math.floor(Math.random() * 100),
            user: `User${switchIndex + 1}${i + 1}`
          }
        });
      }

      // Add some IoT devices
      if (Math.random() > 0.5) {
        const typeInfo = assetTypes.find(t => t.type === 'printer');
        assets.push({
          id: `printer-${switchIndex + 1}`,
          name: `Printer-${switchIndex + 1}`,
          type: 'printer',
          typeInfo,
          x: pos.x + 40,
          y: pos.y + 60,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          criticality: 'low',
          location: locations[switchIndex],
          ip: `192.168.${switchIndex + 1}.200`,
          lastSeen: new Date(Date.now() - Math.random() * 3600000),
          uptime: Math.floor(Math.random() * 365),
          connections: [pos.switchId],
          metadata: {
            model: 'HP LaserJet Pro',
            paperLevel: Math.floor(Math.random() * 100),
            tonerLevel: Math.floor(Math.random() * 100)
          }
        });
      }
    });

    // Add servers in data center area
    const serverTypes = ['web', 'db', 'app', 'mail', 'dns'];
    serverTypes.forEach((serverType, index) => {
      const typeInfo = assetTypes.find(t => t.type === 'server');
      assets.push({
        id: `server-${serverType}`,
        name: `${serverType.toUpperCase()}-Server`,
        type: 'server',
        typeInfo,
        x: 50 + (index * 80),
        y: 100,
        status: index < 3 ? 'online' : statuses[Math.floor(Math.random() * statuses.length)],
        criticality: index < 2 ? 'critical' : 'high',
        location: 'DC-East',
        ip: `10.0.1.${index + 10}`,
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        uptime: Math.floor(Math.random() * 365),
        connections: ['router-1'],
        metadata: {
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          storage: Math.floor(Math.random() * 100),
          services: Math.floor(Math.random() * 20) + 5
        }
      });
    });

    // Add cloud resources
    const cloudTypeInfo = assetTypes.find(t => t.type === 'cloud');
    assets.push({
      id: 'cloud-aws',
      name: 'AWS-Cloud',
      type: 'cloud',
      typeInfo: cloudTypeInfo,
      x: 400,
      y: 50,
      status: 'online',
      criticality: 'high',
      location: 'Cloud-AWS',
      ip: '52.91.48.123',
      lastSeen: new Date(Date.now() - 60000),
      uptime: 365,
      connections: ['firewall-1'],
      metadata: {
        instances: 12,
        region: 'us-east-1',
        cost: '$1,245/month'
      }
    });

    return assets;
  }, []);

  // Initialize assets
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const networkAssets = generateNetworkAssets();
      setAssets(networkAssets);
      setLoading(false);
    }, 1000);
  }, [generateNetworkAssets]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        // Simulate real-time updates
        setAssets(prevAssets => 
          prevAssets.map(asset => ({
            ...asset,
            metadata: {
              ...asset.metadata,
              cpu: Math.max(0, Math.min(100, asset.metadata.cpu + (Math.random() - 0.5) * 10)),
              memory: Math.max(0, Math.min(100, asset.metadata.memory + (Math.random() - 0.5) * 5)),
              networkLoad: Math.max(0, Math.min(100, (asset.metadata.networkLoad || 50) + (Math.random() - 0.5) * 15))
            },
            lastSeen: Math.random() > 0.9 ? new Date() : asset.lastSeen
          }))
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filter assets based on search and filters
  const filteredAssets = useMemo(() => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip.includes(searchTerm) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase())
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
            r="28"
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
          r="20"
          fill={asset.typeInfo.color}
          fillOpacity="0.2"
          stroke={getStatusColor(asset.status)}
          strokeWidth="2"
        />
        
        {/* Asset icon */}
        <foreignObject x="-8" y="-8" width="16" height="16">
          <Icon className="w-4 h-4 text-white" />
        </foreignObject>
        
        {/* Status indicator */}
        <circle
          cx="15"
          cy="-15"
          r="4"
          fill={getStatusColor(asset.status)}
        />
        
        {/* Criticality indicator */}
        <rect
          x="-2"
          y="18"
          width="4"
          height="8"
          fill={getCriticalityColor(asset.criticality)}
          rx="2"
        />
        
        {/* Asset name */}
        <text
          x="0"
          y="35"
          textAnchor="middle"
          className="fill-white text-xs font-medium"
          style={{ fontSize: '10px' }}
        >
          {asset.name}
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
      strokeWidth="1"
      strokeDasharray="2,2"
      opacity="0.6"
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
            <span className="text-gray-400">Criticality:</span>
            <span className={`text-xs px-2 py-1 rounded-full capitalize`} 
                  style={{ backgroundColor: getCriticalityColor(asset.criticality) + '20', color: getCriticalityColor(asset.criticality) }}>
              {asset.criticality}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Location:</span>
            <p className="text-white">{asset.location}</p>
          </div>
          <div>
            <span className="text-gray-400">Uptime:</span>
            <p className="text-white">{formatUptime(asset.uptime)}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-white font-medium mb-2">Performance</h4>
          <div className="space-y-2">
            {asset.metadata.cpu !== undefined && (
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className="text-white">{asset.metadata.cpu}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${asset.metadata.cpu}%` }}
                  />
                </div>
              </div>
            )}
            
            {asset.metadata.memory !== undefined && (
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Memory Usage</span>
                  <span className="text-white">{asset.metadata.memory}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${asset.metadata.memory}%` }}
                  />
                </div>
              </div>
            )}
            
            {asset.metadata.networkLoad !== undefined && (
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Network Load</span>
                  <span className="text-white">{asset.metadata.networkLoad}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${asset.metadata.networkLoad}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Metadata */}
        <div>
          <h4 className="text-white font-medium mb-2">Additional Info</h4>
          <div className="space-y-1 text-sm">
            {Object.entries(asset.metadata).map(([key, value]) => {
              if (['cpu', 'memory', 'storage', 'networkLoad'].includes(key)) return null;
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-white">{value}</span>
                </div>
              );
            })}
          </div>
        </div>

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Assets Monitored</h1>
          <p className="text-gray-400 mt-1">
            Network topology view of {filteredAssets.length} monitored assets
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
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
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
              onClick={() => setLoading(true)}
              disabled={loading}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl relative overflow-hidden" style={{ height: '600px' }}>
        {loading && (
          <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center z-20">
            <div className="flex items-center space-x-3 text-white">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span>Loading network topology...</span>
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
                        <p className="text-xs text-gray-400 capitalize">{asset.type}</p>
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
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{asset.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Uptime:</span>
                        <span className="text-white">{formatUptime(asset.uptime)}</span>
                      </div>
                    </div>

                    {/* Performance indicators */}
                    {asset.metadata.cpu !== undefined && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">CPU</span>
                          <span className="text-white">{asset.metadata.cpu}%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${asset.metadata.cpu}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {assets.filter(a => a.status === 'online').length}
          </div>
          <div className="text-sm text-gray-400">Online Assets</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {assets.filter(a => a.status === 'offline').length}
          </div>
          <div className="text-sm text-gray-400">Offline Assets</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-400">
            {assets.filter(a => a.criticality === 'critical').length}
          </div>
          <div className="text-sm text-gray-400">Critical Assets</div>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Array.from(new Set(assets.map(a => a.location))).length}
          </div>
          <div className="text-sm text-gray-400">Locations</div>
        </div>
      </div>
    </div>
  );
};

export default AssetsMonitored;