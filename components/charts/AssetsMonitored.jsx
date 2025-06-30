// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import {
//   Server, 
//   Monitor, 
//   Smartphone, 
//   Printer, 
//   Router, 
//   Shield, 
//   Wifi,
//   HardDrive,
//   Cloud,
//   Globe,
//   Search,
//   Filter,
//   RefreshCw,
//   ZoomIn,
//   ZoomOut,
//   Maximize2,
//   Eye,
//   EyeOff,
//   Settings,
//   Activity,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Clock,
//   MapPin,
//   Network,
//   Layers,
//   Grid,
//   Info,
//   Download,
//   Upload,
//   Play,
//   Pause,
//   MoreHorizontal,
//   X,
//   ChevronDown,
//   ChevronUp
// } from 'lucide-react';

// const AssetsMonitored = () => {
//   // State management
//   const [assets, setAssets] = useState([]);
//   const [selectedAsset, setSelectedAsset] = useState(null);
//   const [viewMode, setViewMode] = useState('topology'); // topology, grid, list
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedAssets, setSelectedAssets] = useState(new Set());
//   const [showFilters, setShowFilters] = useState(false);
//   const [autoRefresh, setAutoRefresh] = useState(true);
//   const [showMiniMap, setShowMiniMap] = useState(true);
//   const [loading, setLoading] = useState(false);
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     types: [],
//     status: [],
//     criticality: [],
//     location: []
//   });

//   // Canvas references
//   const canvasRef = useRef(null);
//   const containerRef = useRef(null);
//   const isDragging = useRef(false);
//   const dragStart = useRef({ x: 0, y: 0 });

//   // Generate network topology with your specific devices
//   const generateNetworkAssets = useCallback(() => {
//     const assetTypes = [
//       { type: 'firewall', icon: Shield, color: '#ef4444', category: 'Security' },
//       { type: 'switch', icon: Router, color: '#3b82f6', category: 'Network' },
//       { type: 'workstation', icon: Monitor, color: '#f59e0b', category: 'Endpoint' }
//     ];

//     const statuses = ['online', 'offline', 'warning'];
//     const criticalities = ['critical', 'high', 'medium', 'low'];
//     const locations = ['Office-Floor1', 'Office-Floor2', 'IT-Room'];

//     const assets = [];
    
//     // 1. Firewall (gateway to internet) - positioned at top center
//     const firewallInfo = assetTypes.find(t => t.type === 'firewall');
//     assets.push({
//       id: 'firewall-1',
//       name: 'Main-Firewall',
//       type: 'firewall',
//       typeInfo: firewallInfo,
//       x: 400,
//       y: 120,
//       status: 'online',
//       criticality: 'critical',
//       location: 'IT-Room',
//       ip: '192.168.1.1',
//       lastSeen: new Date(Date.now() - 30000),
//       uptime: 180,
//       connections: ['switch-1'],
//       metadata: {
//         cpu: 25,
//         memory: 45,
//         networkLoad: 30,
//         throughput: '150 Mbps',
//         rules: 245,
//         model: 'Cisco ASA 5515-X',
//         firmware: '9.12(4)'
//       }
//     });

//     // 2. Switch (connects all PCs) - positioned below firewall
//     const switchInfo = assetTypes.find(t => t.type === 'switch');
//     assets.push({
//       id: 'switch-1',
//       name: 'Core-Switch',
//       type: 'switch',
//       typeInfo: switchInfo,
//       x: 400,
//       y: 250,
//       status: 'online',
//       criticality: 'high',
//       location: 'IT-Room',
//       lastSeen: new Date(Date.now() - 15000),
//       uptime: 180,
//       connections: ['akmpc007', 'akmpc105', 'akmpc085', 'akmpc047', 'cl101', 'akmpc049', 'akmpc048'],
//       metadata: {
//         cpu: 15,
//         memory: 32,
//         networkLoad: 45,
//         connectedDevices: 7,
//         bandwidth: '1 Gbps',
//         model: 'Cisco Catalyst 2960-X',
//         ports: 48,
//         activeports: 7
//       }
//     });

//     // 3. Seven PCs with your specific names - positioned in a circular pattern around the switch
// const pcNames = [
//   { name: 'akmpc007', x: 150, y: 380, user: 'User', ip: '192.168.80.244' },
//   { name: 'akmpc105', x: 280, y: 450, user: 'User', ip: '192.168.80.36' },
//   { name: 'akmpc085', x: 400, y: 480, user: 'User', ip: '192.168.80.121' },
//   { name: 'akmpc047', x: 520, y: 450, user: 'User', ip: '192.168.80.40' },
//   { name: 'cl101', x: 650, y: 380, user: 'User', ip: '192.168.80.220' },
//   { name: 'akmpc049', x: 580, y: 300, user: 'User', ip: '192.168.80.248' },
//   { name: 'akmpc048', x: 220, y: 300, user: 'User', ip: '192.168.80.222' }
// ];

//     const workstationInfo = assetTypes.find(t => t.type === 'workstation');
//     pcNames.forEach((pc, index) => {
//       // Make some PCs have different statuses for realistic simulation
//       let status = 'online';
      
//       assets.push({
//         id: pc.name,
//         name: pc.name.toUpperCase(),
//         type: 'workstation',
//         typeInfo: workstationInfo,
//         x: pc.x,
//         y: pc.y,
//         status: status,
//         criticality: 'low',
//         location: 'Office-Floor1',
//         ip: pc.ip,
//         lastSeen: new Date(Date.now() - (status === 'offline' ? 1800000 : Math.random() * 300000)),
//         uptime: status === 'offline' ? 0 : Math.floor(Math.random() * 30) + 1,
//         connections: ['switch-1'],
//         metadata: {
//           cpu: status === 'offline' ? 0 : Math.floor(Math.random() * 80) + 10,
//           memory: status === 'offline' ? 0 : Math.floor(Math.random() * 70) + 20,
//           storage: Math.floor(Math.random() * 60) + 30,
//           user: pc.user,
//           os: index % 3 === 0 ? 'Windows 11' : (index % 3 === 1 ? 'Windows 10' : 'Windows Server 2019'),
//           domain: 'ACC.LOCAL',
//           lastLogin: status === 'offline' ? 'N/A' : new Date(Date.now() - Math.random() * 86400000).toLocaleString()
//         }
//       });
//     });

//     return assets;
//   }, []);

//   // Initialize assets
//   useEffect(() => {
//     setLoading(true);
//     setTimeout(() => {
//       const networkAssets = generateNetworkAssets();
//       setAssets(networkAssets);
//       setLoading(false);
//     }, 1000);
//   }, [generateNetworkAssets]);

//   // Auto-refresh functionality
//   useEffect(() => {
//     let interval;
//     if (autoRefresh) {
//       interval = setInterval(() => {
//         // Simulate real-time updates
//         setAssets(prevAssets => 
//           prevAssets.map(asset => {
//             if (asset.status === 'offline') return asset; // Don't update offline devices
            
//             return {
//               ...asset,
//               metadata: {
//                 ...asset.metadata,
//                 cpu: asset.type === 'workstation' ? Math.max(0, Math.min(100, asset.metadata.cpu + (Math.random() - 0.5) * 10)) : asset.metadata.cpu,
//                 memory: asset.type === 'workstation' ? Math.max(0, Math.min(100, asset.metadata.memory + (Math.random() - 0.5) * 5)) : asset.metadata.memory,
//                 networkLoad: Math.max(0, Math.min(100, (asset.metadata.networkLoad || 30) + (Math.random() - 0.5) * 15))
//               },
//               lastSeen: Math.random() > 0.8 ? new Date() : asset.lastSeen
//             };
//           })
//         );
//       }, 5000);
//     }
//     return () => clearInterval(interval);
//   }, [autoRefresh]);

//   // Filter assets based on search and filters
//   const filteredAssets = useMemo(() => {
//     let filtered = assets;

//     if (searchTerm) {
//       filtered = filtered.filter(asset =>
//         asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         asset.ip.includes(searchTerm) ||
//         asset.type.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filters.types.length > 0) {
//       filtered = filtered.filter(asset => filters.types.includes(asset.type));
//     }

//     if (filters.status.length > 0) {
//       filtered = filtered.filter(asset => filters.status.includes(asset.status));
//     }

//     if (filters.criticality.length > 0) {
//       filtered = filtered.filter(asset => filters.criticality.includes(asset.criticality));
//     }

//     if (filters.location.length > 0) {
//       filtered = filtered.filter(asset => filters.location.includes(asset.location));
//     }

//     return filtered;
//   }, [assets, searchTerm, filters]);

//   // Get asset connections for drawing lines
//   const getConnections = useCallback(() => {
//     const connections = [];
//     filteredAssets.forEach(asset => {
//       asset.connections.forEach(targetId => {
//         const target = filteredAssets.find(a => a.id === targetId);
//         if (target) {
//           connections.push({
//             source: asset,
//             target: target,
//             id: `${asset.id}-${targetId}`
//           });
//         }
//       });
//     });
//     return connections;
//   }, [filteredAssets]);

//   // Utility functions
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'online': return '#10b981';
//       case 'offline': return '#ef4444';
//       case 'warning': return '#f59e0b';
//       case 'maintenance': return '#6b7280';
//       default: return '#6b7280';
//     }
//   };

//   const getCriticalityColor = (criticality) => {
//     switch (criticality) {
//       case 'critical': return '#dc2626';
//       case 'high': return '#ea580c';
//       case 'medium': return '#ca8a04';
//       case 'low': return '#16a34a';
//       default: return '#6b7280';
//     }
//   };

//   const formatUptime = (days) => {
//     if (days < 1) return '< 1 day';
//     if (days < 30) return `${days} days`;
//     if (days < 365) return `${Math.floor(days / 30)} months`;
//     return `${Math.floor(days / 365)} years`;
//   };

//   // Handle canvas interactions
//   const handleMouseDown = (e) => {
//     if (e.target.closest('.asset-node') || e.target.closest('.asset-controls')) return;
    
//     isDragging.current = true;
//     dragStart.current = {
//       x: e.clientX - panOffset.x,
//       y: e.clientY - panOffset.y
//     };
//   };

//   const handleMouseMove = (e) => {
//     if (!isDragging.current) return;
    
//     setPanOffset({
//       x: e.clientX - dragStart.current.x,
//       y: e.clientY - dragStart.current.y
//     });
//   };

//   const handleMouseUp = () => {
//     isDragging.current = false;
//   };

//   const handleZoom = (delta) => {
//     setZoomLevel(prev => Math.max(0.3, Math.min(3, prev + delta)));
//   };

//   const resetView = () => {
//     setZoomLevel(1);
//     setPanOffset({ x: 0, y: 0 });
//   };

//   // Asset Node Component
//   const AssetNode = ({ asset, onClick }) => {
//     const Icon = asset.typeInfo.icon;
//     const isSelected = selectedAssets.has(asset.id);
    
//     return (
//       <g
//         className="asset-node cursor-pointer"
//         transform={`translate(${asset.x}, ${asset.y})`}
//         onClick={() => onClick(asset)}
//       >
//         {/* Selection ring */}
//         {isSelected && (
//           <circle
//             cx="0"
//             cy="0"
//             r="35"
//             fill="none"
//             stroke="#3b82f6"
//             strokeWidth="2"
//             strokeDasharray="5,5"
//           >
//             <animateTransform
//               attributeName="transform"
//               type="rotate"
//               values="0;360"
//               dur="3s"
//               repeatCount="indefinite"
//             />
//           </circle>
//         )}
        
//         {/* Asset background */}
//         <circle
//           cx="0"
//           cy="0"
//           r="25"
//           fill={asset.typeInfo.color}
//           fillOpacity="0.2"
//           stroke={getStatusColor(asset.status)}
//           strokeWidth="3"
//         />
        
//         {/* Asset icon */}
//         <foreignObject x="-10" y="-10" width="20" height="20">
//           <Icon className="w-5 h-5 text-white" />
//         </foreignObject>
        
//         {/* Status indicator */}
//         <circle
//           cx="18"
//           cy="-18"
//           r="5"
//           fill={getStatusColor(asset.status)}
//         />
        
//         {/* Criticality indicator */}
//         <rect
//           x="-3"
//           y="22"
//           width="6"
//           height="10"
//           fill={getCriticalityColor(asset.criticality)}
//           rx="3"
//         />
        
//         {/* Asset name */}
//         <text
//           x="0"
//           y="45"
//           textAnchor="middle"
//           className="fill-white text-sm font-medium"
//           style={{ fontSize: '12px' }}
//         >
//           {asset.name}
//         </text>
        
//         {/* IP Address */}
//         <text
//           x="0"
//           y="58"
//           textAnchor="middle"
//           className="fill-gray-400 text-xs"
//           style={{ fontSize: '10px' }}
//         >
//           {asset.ip}
//         </text>
//       </g>
//     );
//   };

//   // Connection Line Component
//   const ConnectionLine = ({ connection }) => (
//     <line
//       x1={connection.source.x}
//       y1={connection.source.y}
//       x2={connection.target.x}
//       y2={connection.target.y}
//       stroke="#4b5563"
//       strokeWidth="2"
//       strokeDasharray="3,3"
//       opacity="0.7"
//     />
//   );

//   // Asset Details Panel
//   const AssetDetailsPanel = ({ asset, onClose }) => (
//     <div className="absolute top-4 right-4 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
//       <div className="p-4 border-b border-gray-700 flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
//         <button onClick={onClose} className="text-gray-400 hover:text-white">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
//         {/* Basic Info */}
//         <div className="grid grid-cols-2 gap-3 text-sm">
//           <div>
//             <span className="text-gray-400">Type:</span>
//             <p className="text-white capitalize">{asset.type}</p>
//           </div>
//           <div>
//             <span className="text-gray-400">Status:</span>
//             <div className="flex items-center space-x-2">
//               <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getStatusColor(asset.status) }} />
//               <span className="text-white capitalize">{asset.status}</span>
//             </div>
//           </div>
//           <div>
//             <span className="text-gray-400">IP Address:</span>
//             <p className="text-white font-mono">{asset.ip}</p>
//           </div>
//           <div>
//             <span className="text-gray-400">Criticality:</span>
//             <span className={`text-xs px-2 py-1 rounded-full capitalize`} 
//                   style={{ backgroundColor: getCriticalityColor(asset.criticality) + '20', color: getCriticalityColor(asset.criticality) }}>
//               {asset.criticality}
//             </span>
//           </div>
//           <div>
//             <span className="text-gray-400">Location:</span>
//             <p className="text-white">{asset.location}</p>
//           </div>
//           <div>
//             <span className="text-gray-400">Uptime:</span>
//             <p className="text-white">{formatUptime(asset.uptime)}</p>
//           </div>
//         </div>

//         {/* Performance Metrics */}
//         <div>
//           <h4 className="text-white font-medium mb-2">Performance</h4>
//           <div className="space-y-2">
//             {asset.metadata.cpu !== undefined && (
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">CPU Usage</span>
//                   <span className="text-white">{asset.metadata.cpu}%</span>
//                 </div>
//                 <div className="w-full bg-gray-700 rounded-full h-2">
//                   <div 
//                     className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${asset.metadata.cpu}%` }}
//                   />
//                 </div>
//               </div>
//             )}
            
//             {asset.metadata.memory !== undefined && (
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Memory Usage</span>
//                   <span className="text-white">{asset.metadata.memory}%</span>
//                 </div>
//                 <div className="w-full bg-gray-700 rounded-full h-2">
//                   <div 
//                     className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${asset.metadata.memory}%` }}
//                   />
//                 </div>
//               </div>
//             )}
            
//             {asset.metadata.networkLoad !== undefined && (
//               <div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Network Load</span>
//                   <span className="text-white">{asset.metadata.networkLoad}%</span>
//                 </div>
//                 <div className="w-full bg-gray-700 rounded-full h-2">
//                   <div 
//                     className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${asset.metadata.networkLoad}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Additional Metadata */}
//         <div>
//           <h4 className="text-white font-medium mb-2">Additional Info</h4>
//           <div className="space-y-1 text-sm">
//             {Object.entries(asset.metadata).map(([key, value]) => {
//               if (['cpu', 'memory', 'storage', 'networkLoad'].includes(key)) return null;
//               return (
//                 <div key={key} className="flex justify-between">
//                   <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
//                   <span className="text-white">{value}</span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Last Seen */}
//         <div className="text-xs text-gray-500">
//           Last seen: {asset.lastSeen.toLocaleString()}
//         </div>
//       </div>
//     </div>
//   );

//   // Filter Panel Component
//   const FilterPanel = () => (
//     <div className="absolute top-16 left-4 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
//       <div className="p-4 border-b border-gray-700 flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-white">Filters</h3>
//         <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="p-4 space-y-4">
//         {/* Asset Types */}
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">Asset Types</label>
//           <div className="space-y-1">
//             {Array.from(new Set(assets.map(a => a.type))).map(type => (
//               <label key={type} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={filters.types.includes(type)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setFilters(prev => ({ ...prev, types: [...prev.types, type] }));
//                     } else {
//                       setFilters(prev => ({ ...prev, types: prev.types.filter(t => t !== type) }));
//                     }
//                   }}
//                   className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="text-sm text-gray-300 capitalize">{type}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
//           <div className="space-y-1">
//             {['online', 'offline', 'warning', 'maintenance'].map(status => (
//               <label key={status} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={filters.status.includes(status)}
//                   onChange={(e) => {
//                     if (e.target.checked) {
//                       setFilters(prev => ({ ...prev, status: [...prev.status, status] }));
//                     } else {
//                       setFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }));
//                     }
//                   }}
//                   className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
//                 />
//                 <div className="flex items-center space-x-2">
//                   <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: getStatusColor(status) }} />
//                   <span className="text-sm text-gray-300 capitalize">{status}</span>
//                 </div>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Clear Filters */}
//         <button
//           onClick={() => setFilters({ types: [], status: [], criticality: [], location: [] })}
//           className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
//         >
//           Clear All Filters
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-white">Network Assets Monitor</h1>
//           <p className="text-gray-400 mt-1">
//             Monitoring {filteredAssets.length} network assets across your infrastructure
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <div className="flex items-center space-x-2 text-sm text-gray-400">
//             <Activity className="w-4 h-4" />
//             <span>{assets.filter(a => a.status === 'online').length} online</span>
//           </div>
//           <button
//             onClick={() => setAutoRefresh(!autoRefresh)}
//             className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
//               autoRefresh 
//                 ? 'bg-green-600 hover:bg-green-700 text-white' 
//                 : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
//             }`}
//           >
//             {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
//             <span>Auto Refresh</span>
//           </button>
//         </div>
//       </div>

//       {/* Controls Bar */}
//       <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//           {/* Search and View Controls */}
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search assets..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
//               />
//             </div>

//             <div className="flex bg-gray-700 rounded-lg p-1">
//               <button
//                 onClick={() => setViewMode('topology')}
//                 className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                   viewMode === 'topology' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
//                 }`}
//               >
//                 <Network className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`px-3 py-1 text-sm rounded-md transition-colors ${
//                   viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
//                 }`}
//               >
//                 <Grid className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Action Controls */}
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
//             >
//               <Filter className="w-4 h-4" />
//               <span>Filters</span>
//               {(filters.types.length > 0 || filters.status.length > 0) && (
//                 <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
//                   {filters.types.length + filters.status.length}
//                 </span>
//               )}
//             </button>

//             <button
//               onClick={() => setShowMiniMap(!showMiniMap)}
//               className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
//                 showMiniMap ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
//               }`}
//             >
//               <MapPin className="w-4 h-4" />
//               <span>Mini Map</span>
//             </button>

//             <button
//               onClick={resetView}
//               className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
//             >
//               <Maximize2 className="w-4 h-4" />
//               <span>Reset View</span>
//             </button>

//             <button
//               onClick={() => setLoading(true)}
//               disabled={loading}
//               className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center space-x-2"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="bg-gray-800 border border-gray-700 rounded-xl relative overflow-hidden" style={{ height: '600px' }}>
//         {loading && (
//           <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center z-20">
//             <div className="flex items-center space-x-3 text-white">
//               <RefreshCw className="w-6 h-6 animate-spin" />
//               <span>Loading network topology...</span>
//             </div>
//           </div>
//         )}


//         {/* Topology View */}
//         {viewMode === 'topology' && (
//           <div
//             ref={containerRef}
//             className="w-full h-full cursor-move relative"
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//           >
//             <svg
//               ref={canvasRef}
//               className="w-full h-full"
//               style={{
//                 transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
//                 transformOrigin: 'center center'
//               }}
//             >
//               {/* Background Grid */}
//               <defs>
//                 <pattern
//                   id="grid"
//                   width="20"
//                   height="20"
//                   patternUnits="userSpaceOnUse"
//                 >
//                   <path
//                     d="M 20 0 L 0 0 0 20"
//                     fill="none"
//                     stroke="#374151"
//                     strokeWidth="0.5"
//                     opacity="0.5"
//                   />
//                 </pattern>
//               </defs>
//               <rect width="100%" height="100%" fill="url(#grid)" />

//               {/* Connection Lines */}
//               {getConnections().map((connection) => (
//                 <ConnectionLine key={connection.id} connection={connection} />
//               ))}

//               {/* Asset Nodes */}
//               {filteredAssets.map((asset) => (
//                 <AssetNode
//                   key={asset.id}
//                   asset={asset}
//                   onClick={(asset) => {
//                     if (selectedAssets.has(asset.id)) {
//                       setSelectedAssets(prev => {
//                         const newSet = new Set(prev);
//                         newSet.delete(asset.id);
//                         return newSet;
//                       });
//                       setSelectedAsset(null);
//                     } else {
//                       setSelectedAssets(new Set([asset.id]));
//                       setSelectedAsset(asset);
//                     }
//                   }}
//                 />
//               ))}
//             </svg>

//             {/* Zoom Controls */}
//             <div className="absolute bottom-4 right-4 flex flex-col space-y-2 asset-controls">
//               <button
//                 onClick={() => handleZoom(0.1)}
//                 className="w-10 h-10 bg-gray-700/90 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
//               >
//                 <ZoomIn className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => handleZoom(-0.1)}
//                 className="w-10 h-10 bg-gray-700/90 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center transition-colors"
//               >
//                 <ZoomOut className="w-5 h-5" />
//               </button>
//               <div className="bg-gray-700/90 px-2 py-1 rounded text-white text-xs text-center">
//                 {Math.round(zoomLevel * 100)}%
//               </div>
//             </div>

//             {/* Mini Map */}
//             {showMiniMap && (
//               <div className="absolute top-4 left-4 w-48 h-32 bg-gray-900/90 border border-gray-600 rounded-lg overflow-hidden asset-controls">
//                 <svg className="w-full h-full" viewBox="0 0 800 600">
//                   {/* Mini map background */}
//                   <rect width="800" height="600" fill="#1f2937" opacity="0.8" />
                  
//                   {/* Mini asset nodes */}
//                   {filteredAssets.map((asset) => (
//                     <circle
//                       key={asset.id}
//                       cx={asset.x}
//                       cy={asset.y}
//                       r="3"
//                       fill={getStatusColor(asset.status)}
//                     />
//                   ))}
                  
//                   {/* Viewport indicator */}
//                   <rect
//                     x={-panOffset.x / zoomLevel + 400}
//                     y={-panOffset.y / zoomLevel + 300}
//                     width={800 / zoomLevel}
//                     height={600 / zoomLevel}
//                     fill="none"
//                     stroke="#3b82f6"
//                     strokeWidth="2"
//                   />
//                 </svg>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Grid View */}
//         {viewMode === 'grid' && (
//           <div className="p-6 overflow-y-auto h-full">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {filteredAssets.map((asset) => {
//                 const Icon = asset.typeInfo.icon;
//                 return (
//                   <div
//                     key={asset.id}
//                     className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors cursor-pointer"
//                     onClick={() => setSelectedAsset(asset)}
//                   >
//                     <div className="flex items-center space-x-3 mb-3">
//                       <div
//                         className="w-10 h-10 rounded-lg flex items-center justify-center"
//                         style={{ backgroundColor: asset.typeInfo.color + '30' }}
//                       >
//                         <Icon className="w-5 h-5" style={{ color: asset.typeInfo.color }} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-medium text-white truncate">{asset.name}</h3>
//                         <p className="text-xs text-gray-400 capitalize">{asset.type}</p>
//                       </div>
//                       <div
//                         className="w-3 h-3 rounded-full"
//                         style={{ backgroundColor: getStatusColor(asset.status) }}
//                       />
//                     </div>

//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">IP:</span>
//                         <span className="text-white font-mono">{asset.ip}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">Location:</span>
//                         <span className="text-white">{asset.location}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-400">Uptime:</span>
//                         <span className="text-white">{formatUptime(asset.uptime)}</span>
//                       </div>
//                     </div>

//                     {/* Performance indicators */}
//                     {asset.metadata.cpu !== undefined && (
//                       <div className="mt-3">
//                         <div className="flex justify-between text-xs mb-1">
//                           <span className="text-gray-400">CPU</span>
//                           <span className="text-white">{asset.metadata.cpu}%</span>
//                         </div>
//                         <div className="w-full bg-gray-600 rounded-full h-1">
//                           <div
//                             className="bg-blue-500 h-1 rounded-full transition-all duration-300"
//                             style={{ width: `${asset.metadata.cpu}%` }}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Asset Details Panel */}
//         {selectedAsset && (
//           <AssetDetailsPanel
//             asset={selectedAsset}
//             onClose={() => {
//               setSelectedAsset(null);
//               setSelectedAssets(new Set());
//             }}
//           />
//         )}

//         {/* Filter Panel */}
//         {showFilters && <FilterPanel />}
//       </div>

//       {/* Statistics Footer */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
//           <div className="text-2xl font-bold text-green-400">
//             {assets.filter(a => a.status === 'online').length}
//           </div>
//           <div className="text-sm text-gray-400">Online Assets</div>
//         </div>
//         <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
//           <div className="text-2xl font-bold text-red-400">
//             {assets.filter(a => a.status === 'offline').length}
//           </div>
//           <div className="text-sm text-gray-400">Offline Assets</div>
//         </div>
//         <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
//           <div className="text-2xl font-bold text-orange-400">
//             {assets.filter(a => a.criticality === 'critical').length}
//           </div>
//           <div className="text-sm text-gray-400">Critical Assets</div>
//         </div>
//         <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
//           <div className="text-2xl font-bold text-blue-400">
//             {Array.from(new Set(assets.map(a => a.location))).length}
//           </div>
//           <div className="text-sm text-gray-400">Locations</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssetsMonitored;


////

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

  // API Configuration
  const API_BASE_URL = 'http://192.168.80.247:5000/api';

  // Asset type mapping with icons and colors
  const assetTypeMap = {
    firewall: { icon: Shield, color: '#ef4444', category: 'Security' },
    switch: { icon: Router, color: '#3b82f6', category: 'Network' },
    router: { icon: Router, color: '#10b981', category: 'Network' },
    workstation: { icon: Monitor, color: '#f59e0b', category: 'Endpoint' },
    server: { icon: Server, color: '#8b5cf6', category: 'Infrastructure' },
    printer: { icon: Printer, color: '#06b6d4', category: 'Peripheral' },
    mobile: { icon: Smartphone, color: '#f97316', category: 'Mobile' },
    laptop: { icon: Monitor, color: '#eab308', category: 'Endpoint' },
    default: { icon: HardDrive, color: '#6b7280', category: 'Other' }
  };

  // Transform API data to component format
  const transformApiAsset = (apiAsset, index) => {
    console.log('Transforming asset:', apiAsset);
    
    if (!apiAsset) {
      console.warn('Asset is null or undefined');
      return null;
    }
    
    const typeInfo = assetTypeMap[apiAsset.type] || assetTypeMap.default;
    console.log('Asset type info:', typeInfo, 'for type:', apiAsset.type);
    
    // Auto-layout positioning for assets without predefined positions
    const getAutoPosition = (index, total) => {
      if (apiAsset.position && apiAsset.position.x !== undefined && apiAsset.position.y !== undefined) {
        console.log('Using predefined position:', apiAsset.position);
        return { x: apiAsset.position.x, y: apiAsset.position.y };
      }
      
      // Create a grid layout for assets without positions
      const cols = Math.ceil(Math.sqrt(total));
      const row = Math.floor(index / cols);
      const col = index % cols;
      const position = {
        x: 100 + col * 150,
        y: 100 + row * 120
      };
      console.log('Generated auto position:', position, 'for index:', index);
      return position;
    };

    const position = getAutoPosition(index, 50); // Assuming max 50 assets for layout

    const transformed = {
      id: apiAsset.assetId || apiAsset._id || `asset-${index}`,
      name: apiAsset.name || `Asset-${index}`,
      type: apiAsset.type || 'default',
      typeInfo,
      x: position.x,
      y: position.y,
      status: apiAsset.status || 'unknown',
      criticality: apiAsset.criticality || 'medium',
      location: apiAsset.location || 'Unknown',
      ip: apiAsset.ipAddress || apiAsset.ip || '0.0.0.0',
      lastSeen: apiAsset.lastSeen ? new Date(apiAsset.lastSeen) : new Date(),
      uptime: apiAsset.uptime || 0,
      connections: apiAsset.connections || [],
      metadata: {
        cpu: apiAsset.metadata?.cpu || 0,
        memory: apiAsset.metadata?.memory || 0,
        storage: apiAsset.metadata?.storage || 0,
        networkLoad: apiAsset.metadata?.networkLoad || 0,
        throughput: apiAsset.metadata?.throughput || 'N/A',
        bandwidth: apiAsset.metadata?.bandwidth || 'N/A',
        connectedDevices: apiAsset.metadata?.connectedDevices || 0,
        activeports: apiAsset.metadata?.activeports || 0,
        manufacturer: apiAsset.metadata?.manufacturer || 'Unknown',
        model: apiAsset.metadata?.model || 'Unknown',
        serialNumber: apiAsset.metadata?.serialNumber || 'N/A',
        firmware: apiAsset.metadata?.firmware || 'N/A',
        version: apiAsset.metadata?.version || 'N/A',
        rules: apiAsset.metadata?.rules || 0,
        ports: apiAsset.metadata?.ports || 0,
        user: apiAsset.metadata?.user || apiAsset.owner || 'N/A',
        domain: apiAsset.metadata?.domain || 'N/A',
        lastLogin: apiAsset.metadata?.lastLogin || 'N/A',
        os: apiAsset.operatingSystem || 'Unknown',
        osVersion: apiAsset.osVersion || 'N/A',
        department: apiAsset.department || 'N/A',
        owner: apiAsset.owner || 'N/A',
        securityScore: apiAsset.securityScore || 0,
        complianceScore: apiAsset.complianceScore || 0,
        riskLevel: apiAsset.riskLevel || 'unknown'
      },
      // Additional API data
      vulnerabilities: apiAsset.vulnerabilities || { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
      patchLevel: apiAsset.patchLevel || 0,
      pendingPatches: apiAsset.pendingPatches || 0,
      securityControls: apiAsset.securityControls || {},
      compliance: apiAsset.compliance || {},
      tags: apiAsset.tags || [],
      businessFunction: apiAsset.businessFunction || 'N/A',
      notes: apiAsset.notes || ''
    };
    
    console.log('Final transformed asset:', transformed);
    return transformed;
  };

  // Fetch assets from API
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch assets from:', `${API_BASE_URL}/assets`);
      
      const response = await fetch(`${API_BASE_URL}/assets`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData = await response.json();
      console.log('Raw API response:', apiData);
      console.log('API response type:', typeof apiData);
      console.log('API response length:', Array.isArray(apiData) ? apiData.length : 'Not an array');
      
      // Handle both array and object responses
      let assetsArray;
      if (Array.isArray(apiData)) {
        assetsArray = apiData;
        console.log('Using direct array response');
      } else if (apiData && apiData.data && Array.isArray(apiData.data)) {
        assetsArray = apiData.data;
        console.log('Using apiData.data array');
      } else if (apiData && typeof apiData === 'object') {
        // If it's an object but not an array, try to extract assets from different possible keys
        assetsArray = apiData.assets || apiData.items || apiData.results || [];
        console.log('Trying alternate object keys, found:', assetsArray.length, 'items');
      } else {
        assetsArray = [];
        console.warn('Could not determine asset array format');
      }
      
      console.log('Final assets array:', assetsArray);
      console.log('Assets array length:', assetsArray.length);
      
      if (assetsArray.length === 0) {
        console.warn('No assets found in API response');
        setAssets([]);
        return;
      }
      
      // Transform API data to component format
      console.log('Starting transformation of', assetsArray.length, 'assets');
      const transformedAssets = assetsArray.map((asset, index) => {
        console.log(`Transforming asset ${index}:`, asset);
        const transformed = transformApiAsset(asset, index);
        console.log(`Transformed asset ${index}:`, transformed);
        return transformed;
      });
      
      console.log('All transformed assets:', transformedAssets);
      setAssets(transformedAssets);
      
    } catch (error) {
      console.error('Error fetching assets:', error);
      console.error('Error stack:', error.stack);
      
      // Fallback to empty array on error
      setAssets([]);
      
      // You could also show a notification to the user here
      if (typeof window !== 'undefined') {
        console.error(`Failed to fetch assets: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize assets on component mount
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAssets(); // Fetch fresh data from API
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchAssets]);

  // Filter assets based on search and filters
  const filteredAssets = useMemo(() => {
    console.log('Filtering assets. Total assets:', assets.length);
    console.log('Current assets:', assets);
    
    let filtered = assets;

    if (searchTerm) {
      console.log('Applying search filter:', searchTerm);
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip.includes(searchTerm) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('After search filter:', filtered.length);
    }

    if (filters.types.length > 0) {
      console.log('Applying type filter:', filters.types);
      filtered = filtered.filter(asset => filters.types.includes(asset.type));
      console.log('After type filter:', filtered.length);
    }

    if (filters.status.length > 0) {
      console.log('Applying status filter:', filters.status);
      filtered = filtered.filter(asset => filters.status.includes(asset.status));
      console.log('After status filter:', filtered.length);
    }

    if (filters.criticality.length > 0) {
      console.log('Applying criticality filter:', filters.criticality);
      filtered = filtered.filter(asset => filters.criticality.includes(asset.criticality));
      console.log('After criticality filter:', filtered.length);
    }

    if (filters.location.length > 0) {
      console.log('Applying location filter:', filters.location);
      filtered = filtered.filter(asset => filters.location.includes(asset.location));
      console.log('After location filter:', filtered.length);
    }

    console.log('Final filtered assets:', filtered);
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
            {asset.metadata.department && asset.metadata.department !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Department:</span>
                <span className="text-white">{asset.metadata.department}</span>
              </div>
            )}
            {asset.metadata.owner && asset.metadata.owner !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Owner:</span>
                <span className="text-white">{asset.metadata.owner}</span>
              </div>
            )}
            {asset.metadata.os && asset.metadata.os !== 'Unknown' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Operating System:</span>
                <span className="text-white">{asset.metadata.os}</span>
              </div>
            )}
            {asset.metadata.osVersion && asset.metadata.osVersion !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">OS Version:</span>
                <span className="text-white">{asset.metadata.osVersion}</span>
              </div>
            )}
            {asset.metadata.manufacturer && asset.metadata.manufacturer !== 'Unknown' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Manufacturer:</span>
                <span className="text-white">{asset.metadata.manufacturer}</span>
              </div>
            )}
            {asset.metadata.model && asset.metadata.model !== 'Unknown' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Model:</span>
                <span className="text-white">{asset.metadata.model}</span>
              </div>
            )}
            {asset.metadata.serialNumber && asset.metadata.serialNumber !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Serial Number:</span>
                <span className="text-white font-mono">{asset.metadata.serialNumber}</span>
              </div>
            )}
            {asset.metadata.firmware && asset.metadata.firmware !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Firmware:</span>
                <span className="text-white">{asset.metadata.firmware}</span>
              </div>
            )}
            {asset.metadata.throughput && asset.metadata.throughput !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Throughput:</span>
                <span className="text-white">{asset.metadata.throughput}</span>
              </div>
            )}
            {asset.metadata.bandwidth && asset.metadata.bandwidth !== 'N/A' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Bandwidth:</span>
                <span className="text-white">{asset.metadata.bandwidth}</span>
              </div>
            )}
            {asset.metadata.rules > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Firewall Rules:</span>
                <span className="text-white">{asset.metadata.rules}</span>
              </div>
            )}
            {asset.metadata.activeports > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Active Ports:</span>
                <span className="text-white">{asset.metadata.activeports}</span>
              </div>
            )}
            {asset.metadata.connectedDevices > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Connected Devices:</span>
                <span className="text-white">{asset.metadata.connectedDevices}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security & Compliance */}
        {(asset.metadata.securityScore > 0 || asset.metadata.complianceScore > 0 || asset.vulnerabilities.total > 0) && (
          <div>
            <h4 className="text-white font-medium mb-2">Security & Compliance</h4>
            <div className="space-y-1 text-sm">
              {asset.metadata.securityScore > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Security Score:</span>
                  <span className={`font-medium ${
                    asset.metadata.securityScore >= 80 ? 'text-green-400' :
                    asset.metadata.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>{asset.metadata.securityScore}/100</span>
                </div>
              )}
              {asset.metadata.complianceScore > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Compliance Score:</span>
                  <span className={`font-medium ${
                    asset.metadata.complianceScore >= 80 ? 'text-green-400' :
                    asset.metadata.complianceScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>{asset.metadata.complianceScore}/100</span>
                </div>
              )}
              {asset.vulnerabilities.total > 0 && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Vulnerabilities:</span>
                    <span className="text-red-400">{asset.vulnerabilities.total} total</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-red-300">Critical:</span>
                      <span className="text-red-400">{asset.vulnerabilities.critical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-300">High:</span>
                      <span className="text-orange-400">{asset.vulnerabilities.high}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-300">Medium:</span>
                      <span className="text-yellow-400">{asset.vulnerabilities.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-300">Low:</span>
                      <span className="text-green-400">{asset.vulnerabilities.low}</span>
                    </div>
                  </div>
                </div>
              )}
              {asset.patchLevel > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Patch Level:</span>
                  <span className="text-white">{asset.patchLevel}%</span>
                </div>
              )}
              {asset.pendingPatches > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Patches:</span>
                  <span className="text-orange-400">{asset.pendingPatches}</span>
                </div>
              )}
            </div>
          </div>
        )}

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

        {/* Business Function & Notes */}
        {(asset.businessFunction && asset.businessFunction !== 'N/A') && (
          <div>
            <h4 className="text-white font-medium mb-2">Business Function</h4>
            <p className="text-gray-300 text-sm">{asset.businessFunction}</p>
          </div>
        )}

        {asset.notes && asset.notes.trim() && (
          <div>
            <h4 className="text-white font-medium mb-2">Notes</h4>
            <p className="text-gray-300 text-sm">{asset.notes}</p>
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
          <h1 className="text-2xl font-bold text-white">Network Assets Monitor</h1>
          <p className="text-gray-400 mt-1">
            Monitoring {filteredAssets.length} network assets across your infrastructure
          </p>
          {/* Debug info */}
          <div className="text-xs text-gray-500 mt-1">
            Total assets: {assets.length} | Filtered: {filteredAssets.length} | Loading: {loading.toString()}
          </div>
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
              onClick={fetchAssets}
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
            <div className="flex flex-col items-center space-y-3 text-white">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span>Loading assets from API...</span>
              <span className="text-sm text-gray-400">Fetching from {API_BASE_URL}/assets</span>
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
            {/* Debug info for grid view */}
            <div className="mb-4 p-2 bg-gray-700 rounded text-xs text-gray-300">
              Debug: Assets={assets.length}, Filtered={filteredAssets.length}, Loading={loading.toString()}, ViewMode={viewMode}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAssets.length === 0 && !loading ? (
                <div className="col-span-full p-8 text-center text-gray-400">
                  <div className="flex flex-col items-center space-y-3">
                    <Server className="w-16 h-16 text-gray-600" />
                    <h3 className="text-lg font-medium">No Assets Found</h3>
                    <p className="text-sm">
                      {assets.length === 0 
                        ? 'No assets available from the API. Check your connection and API endpoint.'
                        : 'No assets match your current filters. Try adjusting your search criteria.'
                      }
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      API URL: {API_BASE_URL}/assets<br/>
                      Total assets loaded: {assets.length}<br/>
                      Filtered assets: {filteredAssets.length}
                    </div>
                    {assets.length === 0 && (
                      <button
                        onClick={fetchAssets}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Retry API Connection
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                filteredAssets.map((asset) => {
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
                        {asset.metadata.securityScore > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Security Score:</span>
                            <span className={`font-medium ${
                              asset.metadata.securityScore >= 80 ? 'text-green-400' :
                              asset.metadata.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                            }`}>{asset.metadata.securityScore}/100</span>
                          </div>
                        )}
                        {asset.vulnerabilities.total > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Vulnerabilities:</span>
                            <span className="text-red-400">{asset.vulnerabilities.total}</span>
                          </div>
                        )}
                      </div>

                      {/* Performance indicators */}
                      {asset.metadata.cpu !== undefined && asset.metadata.cpu > 0 && (
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

                      {/* Tags */}
                      {asset.tags && asset.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {asset.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {asset.tags.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{asset.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
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