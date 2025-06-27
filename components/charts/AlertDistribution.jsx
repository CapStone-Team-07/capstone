// components/charts/AlertDistribution.jsx - Interactive Alert Distribution Chart

import React, { useState, useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  Filter,
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  Eye,
  EyeOff,
  RefreshCw,
  Maximize2
} from 'lucide-react';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <h4 className="text-white font-medium">{data.payload.name}</h4>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between space-x-6">
            <span className="text-gray-300">Count:</span>
            <span className="text-white font-medium">{data.payload.count.toLocaleString()}</span>
          </div>
          <div className="flex justify-between space-x-6">
            <span className="text-gray-300">Percentage:</span>
            <span className="text-white font-medium">{data.value}%</span>
          </div>
          <div className="flex justify-between space-x-6">
            <span className="text-gray-300">Severity:</span>
            <span className={`font-medium ${
              data.payload.severity === 'Critical' ? 'text-red-400' :
              data.payload.severity === 'High' ? 'text-orange-400' :
              data.payload.severity === 'Medium' ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {data.payload.severity}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Chart Legend Component
const CustomLegend = ({ payload, onToggle, hiddenItems }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className={`flex items-center space-x-2 cursor-pointer transition-opacity ${
            hiddenItems.includes(entry.value) ? 'opacity-40' : 'opacity-100'
          }`}
          onClick={() => onToggle(entry.value)}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-300 hover:text-white">
            {entry.value} ({entry.payload.count})
          </span>
          {hiddenItems.includes(entry.value) ? (
            <EyeOff className="w-3 h-3 text-gray-500" />
          ) : (
            <Eye className="w-3 h-3 text-gray-400" />
          )}
        </div>
      ))}
    </div>
  );
};

// Statistics Cards Component
const AlertStatistics = ({ data, timeRange }) => {
  const stats = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const critical = data.find(item => item.severity === 'Critical')?.count || 0;
    const avgPerType = Math.round(total / data.length);
    
    // Find highest threat type
    const highest = data.reduce((prev, current) => 
      prev.count > current.count ? prev : current
    );

    return {
      total,
      critical,
      avgPerType,
      highest,
      criticalPercentage: Math.round((critical / total) * 100)
    };
  }, [data]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-white">{stats.total.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Total Alerts</p>
          </div>
          <AlertTriangle className="w-6 h-6 text-blue-400" />
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-red-400">{stats.critical.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Critical Alerts</p>
          </div>
          <Shield className="w-6 h-6 text-red-400" />
        </div>
        <div className="mt-2">
          <div className="text-xs text-gray-400">
            {stats.criticalPercentage}% of total
          </div>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-white">{stats.avgPerType}</p>
            <p className="text-xs text-gray-400">Avg per Type</p>
          </div>
          <Activity className="w-6 h-6 text-green-400" />
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-orange-400">{stats.highest.name}</p>
            <p className="text-xs text-gray-400">Top Threat</p>
          </div>
          <TrendingUp className="w-6 h-6 text-orange-400" />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {stats.highest.count} alerts
        </div>
      </div>
    </div>
  );
};

// Chart Controls Component
const ChartControls = ({ 
  chartType, 
  setChartType, 
  timeRange, 
  setTimeRange, 
  sortBy, 
  setSortBy,
  onRefresh,
  onExport,
  isLoading 
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Chart Type Toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">View:</span>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Pie</span>
          </button>
          <button
            onClick={() => setChartType('donut')}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'donut' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            <span>Donut</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Bar</span>
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">Period:</span>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="count">Count</option>
          <option value="percentage">Percentage</option>
          <option value="severity">Severity</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        <button
          onClick={onExport}
          className="flex items-center space-x-1 px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm text-white transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

// Main Alert Distribution Component
const AlertDistribution = ({ 
  data, 
  title = "Alert Distribution", 
  height = 400,
  showStatistics = true 
}) => {
  const [chartType, setChartType] = useState('donut');
  const [timeRange, setTimeRange] = useState('7d');
  const [sortBy, setSortBy] = useState('count');
  const [hiddenItems, setHiddenItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Process and sort data
  const processedData = useMemo(() => {
    let sortedData = [...data];
    
    // Apply sorting
    switch (sortBy) {
      case 'count':
        sortedData.sort((a, b) => b.count - a.count);
        break;
      case 'percentage':
        sortedData.sort((a, b) => b.value - a.value);
        break;
      case 'severity':
        const severityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        sortedData.sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0));
        break;
      case 'name':
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // Filter out hidden items
    return sortedData.filter(item => !hiddenItems.includes(item.name));
  }, [data, sortBy, hiddenItems]);

  const handleToggleLegend = (itemName) => {
    setHiddenItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Threat Type', 'Count', 'Percentage', 'Severity'],
      ...processedData.map(row => [
        row.name,
        row.count,
        row.value,
        row.severity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alert-distribution-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      );
    }

    return (
      <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          outerRadius={chartType === 'donut' ? 120 : 140}
          innerRadius={chartType === 'donut' ? 60 : 0}
          paddingAngle={2}
          dataKey="value"
        >
          {processedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color}
              stroke={entry.color}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          content={
            <CustomLegend 
              onToggle={handleToggleLegend} 
              hiddenItems={hiddenItems}
            />
          }
        />
      </PieChart>
    );
  };

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">Distribution of security alerts by type</p>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Statistics */}
      {showStatistics && (
        <AlertStatistics data={processedData} timeRange={timeRange} />
      )}

      {/* Controls */}
      <ChartControls
        chartType={chartType}
        setChartType={setChartType}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onRefresh={handleRefresh}
        onExport={handleExport}
        isLoading={isLoading}
      />

      {/* Chart */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-800/50 rounded-lg flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 text-white">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Updating data...</span>
            </div>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height={isFullscreen ? 500 : height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary Table */}
      <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-white font-medium mb-3">Alert Summary</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {processedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300">{item.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white">{item.count.toLocaleString()}</span>
                <span className="text-gray-400">{item.value}%</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.severity === 'Critical' ? 'bg-red-900 text-red-300' :
                  item.severity === 'High' ? 'bg-orange-900 text-orange-300' :
                  item.severity === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-green-900 text-green-300'
                }`}>
                  {item.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Showing {processedData.length} threat types • Updated {new Date().toLocaleTimeString()}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDistribution;   