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

  // Generate simple network topology with your specific devices
  const generateNetworkAssets = useCallback(() => {
    const assetTypes = [
      { type: 'firewall', icon: Shield, color: '#ef4444', category: 'Security' },
      { type: 'router', icon: Router, color: '#3b82f6', category: 'Network' },
      { type: 'workstation', icon: Monitor, color: '#f59e0b', category: 'Endpoint' },
      { type: 'printer', icon: Printer, color: '#6b7280', category: 'IoT' }
    ];

    const statuses = ['online', 'offline', 'warning'];
    const criticalities = ['critical', 'high', 'medium', 'low'];
    const locations = ['Office-Floor1', 'Office-Floor2'];

    const assets = [];
    
    // 1. Firewall (gateway to internet) - positioned at top center
    const firewallInfo = assetTypes.find(t => t.type === 'firewall');
    assets.push({
      id: 'firewall-1',
      name: 'Main-Firewall',
      type: 'firewall',
      typeInfo: firewallInfo,
      x: 400,
      y: 150,
      status: 'online',
      criticality: 'critical',
      location: 'Office-Floor1',
      ip: '192.168.1.1',
      lastSeen: new Date(Date.now() - 30000),
      uptime: 180,
      connections: ['router-1'],
      metadata: {
        cpu: 25,
        memory: 45,
        networkLoad: 30,
        throughput: '150 Mbps',
        rules: 245
      }
    });

    // 2. Router (connects everything) - positioned below firewall
    const routerInfo = assetTypes.find(t => t.type === 'router');
    assets.push({
      id: 'router-1',
      name: 'Main-Router',
      type: 'router',
      typeInfo: routerInfo,
      x: 400,
      y: 280,
      status: 'online',
      criticality: 'high',
      location: 'Office-Floor1',
      ip: '192.168.1.254',
      lastSeen: new Date(Date.now() - 15000),
      uptime: 180,
      connections: ['pc-1', 'pc-2', 'pc-3', 'pc-4', 'pc-5', 'printer-1'],
      metadata: {
        cpu: 15,
        memory: 32,
        networkLoad: 45,
        connectedDevices: 6,
        bandwidth: '1 Gbps'
      }
    });

    // 3. Five PCs - positioned in a semi-circle around the router
    const pcPositions = [
      { x: 150, y: 420, name: 'PC-01' },
      { x: 280, y: 450, name: 'PC-02' },
      { x: 400, y: 470, name: 'PC-03' },
      { x: 520, y: 450, name: 'PC-04' },
      { x: 650, y: 420, name: 'PC-05' }
    ];

    const workstationInfo = assetTypes.find(t => t.type === 'workstation');
    pcPositions.forEach((pos, index) => {
      const statusIndex = index === 2 ? 1 : 0; // PC-03 is offline for example
      assets.push({
        id: `pc-${index + 1}`,
        name: pos.name,
        type: 'workstation',
        typeInfo: workstationInfo,
        x: pos.x,
        y: pos.y,
        status: index === 2 ? 'offline' : (index === 4 ? 'warning' : 'online'),
        criticality: index < 2 ? 'medium' : 'low',
        location: index < 3 ? 'Office-Floor1' : 'Office-Floor2',
        ip: `192.168.1.${10 + index}`,
        lastSeen: new Date(Date.now() - (index === 2 ? 1800000 : Math.random() * 300000)),
        uptime: index === 2 ? 0 : Math.floor(Math.random() * 30) + 1,
        connections: ['router-1'],
        metadata: {
          cpu: index === 2 ? 0 : Math.floor(Math.random() * 80) + 10,
          memory: index === 2 ? 0 : Math.floor(Math.random() * 70) + 20,
          storage: Math.floor(Math.random() * 60) + 30,
          user: `User${index + 1}`,
          os: index % 2 === 0 ? 'Windows 11' : 'Windows 10'
        }
      });
    });

    // 4. Printer - positioned to the side
    const printerInfo = assetTypes.find(t => t.type === 'printer');
    assets.push({
      id: 'printer-1',
      name: 'Office-Printer',
      type: 'printer',
      typeInfo: printerInfo,
      x: 600,
      y: 300,
      status: 'online',
      criticality: 'low',
      location: 'Office-Floor1',
      ip: '192.168.1.200',
      lastSeen: new Date(Date.now() - 120000),
      uptime: 45,
      connections: ['router-1'],
      metadata: {
        model: 'HP LaserJet Pro MFP',
        paperLevel: 75,
        tonerLevel: 45,
        totalPages: 12540,
        queuedJobs: 2
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
          prevAssets.map(asset => {
            if (asset.status === 'offline') return asset; // Don't update offline devices
            
            return {
              ...asset,
              metadata: {
                ...asset.metadata,
                cpu: asset.type === 'workstation' ? Math.max(0, Math.min(100, asset.metadata.cpu + (Math.random() - 0.5) * 10)) : asset.metadata.cpu,
                memory: asset.type === 'workstation' ? Math.max(0, Math.min(100, asset.metadata.memory + (Math.random() - 0.5) * 5)) : asset.metadata.memory,
                networkLoad: Math.max(0, Math.min(100, (asset.metadata.networkLoad || 30) + (Math.random() - 0.5) * 15))
              },
              lastSeen: Math.random() > 0.8 ? new Date() : asset.lastSeen
            };
          })
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