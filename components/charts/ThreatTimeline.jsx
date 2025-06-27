// components/charts/ThreatTimeline.jsx - Interactive Threat Timeline Chart

import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Filter,
  Download,
  Maximize2,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl">
        <h4 className="text-white font-medium mb-2">{`Date: ${label}`}</h4>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.dataKey} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-300 capitalize">{entry.dataKey}:</span>
              </div>
              <span className="text-white font-medium">{entry.value}</span>
            </div>
          ))}
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total:</span>
              <span className="text-white font-bold">{total}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Chart Controls Component
const ChartControls = ({ 
  chartType, 
  setChartType, 
  timeRange, 
  setTimeRange, 
  visibleLines, 
  setVisibleLines, 
  onRefresh, 
  onExport,
  isLoading 
}) => {
  const severityLevels = [
    { key: 'critical', label: 'Critical', color: '#ef4444' },
    { key: 'high', label: 'High', color: '#f97316' },
    { key: 'medium', label: 'Medium', color: '#eab308' },
    { key: 'low', label: 'Low', color: '#22c55e' }
  ];

  const toggleLine = (lineKey) => {
    setVisibleLines(prev => ({
      ...prev,
      [lineKey]: !prev[lineKey]
    }));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      {/* Chart Type Toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">View:</span>
        <div className="flex bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              chartType === 'area' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Area
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Severity Toggles */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">Show:</span>
        <div className="flex space-x-1">
          {severityLevels.map((level) => (
            <button
              key={level.key}
              onClick={() => toggleLine(level.key)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-colors border ${
                visibleLines[level.key]
                  ? 'border-gray-500 bg-gray-700'
                  : 'border-gray-600 bg-gray-800 opacity-50'
              }`}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: level.color }}
              />
              <span className="text-white">{level.label}</span>
              {visibleLines[level.key] ? (
                <Eye className="w-3 h-3 text-green-400" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-500" />
              )}
            </button>
          ))}
        </div>
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

// Statistics Summary Component
const ThreatStatistics = ({ data, timeRange }) => {
  const stats = useMemo(() => {
    if (!data.length) return null;

    const totals = data.reduce((acc, day) => ({
      critical: acc.critical + day.critical,
      high: acc.high + day.high,
      medium: acc.medium + day.medium,
      low: acc.low + day.low,
      total: acc.total + day.total
    }), { critical: 0, high: 0, medium: 0, low: 0, total: 0 });

    const latest = data[data.length - 1] || {};
    const previous = data[data.length - 2] || {};
    
    const dailyChange = latest.total - previous.total;
    const avgDaily = Math.round(totals.total / data.length);
    
    // Calculate trend
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.total, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.total, 0) / secondHalf.length;
    
    const trendDirection = secondHalfAvg > firstHalfAvg ? 'up' : 'down';
    const trendPercentage = Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100);

    return {
      totals,
      dailyChange,
      avgDaily,
      trendDirection,
      trendPercentage: Math.round(trendPercentage)
    };
  }, [data]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">{stats.totals.total.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Threats</p>
          </div>
          <Activity className="w-8 h-8 text-blue-400" />
        </div>
        <div className={`flex items-center space-x-1 mt-2 text-sm ${
          stats.dailyChange >= 0 ? 'text-red-400' : 'text-green-400'
        }`}>
          {stats.dailyChange >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{Math.abs(stats.dailyChange)} from yesterday</span>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-red-400">{stats.totals.critical}</p>
            <p className="text-sm text-gray-400">Critical Threats</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.totals.critical / stats.totals.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">{stats.avgDaily}</p>
            <p className="text-sm text-gray-400">Daily Average</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-400" />
        </div>
        <div className="text-sm text-gray-400 mt-2">
          Over {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-2xl font-bold ${
              stats.trendDirection === 'up' ? 'text-red-400' : 'text-green-400'
            }`}>
              {stats.trendDirection === 'up' ? '+' : '-'}{stats.trendPercentage}%
            </p>
            <p className="text-sm text-gray-400">Trend</p>
          </div>
          {stats.trendDirection === 'up' ? (
            <TrendingUp className="w-8 h-8 text-red-400" />
          ) : (
            <TrendingDown className="w-8 h-8 text-green-400" />
          )}
        </div>
        <div className="text-sm text-gray-400 mt-2">
          vs previous period
        </div>
      </div>
    </div>
  );
};

// Main Threat Timeline Component
const ThreatTimeline = ({ data, title = "Threat Detection Timeline", height = 400 }) => {
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('30d');
  const [visibleLines, setVisibleLines] = useState({
    critical: true,
    high: true,
    medium: true,
    low: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter data based on visible lines
  const filteredData = useMemo(() => {
    return data.map(item => {
      const filtered = { date: item.date };
      Object.keys(visibleLines).forEach(key => {
        if (visibleLines[key]) {
          filtered[key] = item[key];
        }
      });
      // Recalculate total for visible lines only
      filtered.total = Object.keys(filtered)
        .filter(key => key !== 'date')
        .reduce((sum, key) => sum + (filtered[key] || 0), 0);
      return filtered;
    });
  }, [data, visibleLines]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Critical', 'High', 'Medium', 'Low', 'Total'],
      ...filteredData.map(row => [
        row.date,
        row.critical || 0,
        row.high || 0,
        row.medium || 0,
        row.low || 0,
        row.total || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat-timeline-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const severityConfig = {
    critical: { color: '#ef4444', strokeWidth: 3 },
    high: { color: '#f97316', strokeWidth: 2 },
    medium: { color: '#eab308', strokeWidth: 2 },
    low: { color: '#22c55e', strokeWidth: 2 }
  };

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
  const DataComponent = chartType === 'area' ? Area : Line;

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 ${
      isFullscreen ? 'fixed inset-4 z-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">Real-time threat detection over time</p>
        </div>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Statistics */}
      <ThreatStatistics data={filteredData} timeRange={timeRange} />

      {/* Controls */}
      <ChartControls
        chartType={chartType}
        setChartType={setChartType}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        visibleLines={visibleLines}
        setVisibleLines={setVisibleLines}
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
          <ChartComponent data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', color: '#fff' }}
              iconType="circle"
            />
            
            {/* Reference line for average */}
            {filteredData.length > 0 && (
              <ReferenceLine 
                y={filteredData.reduce((sum, item) => sum + (item.total || 0), 0) / filteredData.length}
                stroke="#6b7280"
                strokeDasharray="5 5"
                label={{ value: "Average", position: "right", fill: "#9ca3af" }}
              />
            )}

            {/* Render lines/areas for each severity level */}
            {Object.entries(severityConfig).map(([severity, config]) => (
              visibleLines[severity] && (
                <DataComponent
                  key={severity}
                  type="monotone"
                  dataKey={severity}
                  stroke={config.color}
                  strokeWidth={config.strokeWidth}
                  fill={chartType === 'area' ? `${config.color}20` : undefined}
                  dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
                  name={severity.charAt(0).toUpperCase() + severity.slice(1)}
                />
              )
            ))}

            {/* Brush for zooming */}
            {filteredData.length > 7 && (
              <Brush 
                dataKey="date" 
                height={30} 
                stroke="#4b5563"
                fill="#1f2937"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
            )}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Showing {filteredData.length} data points • Updated {new Date().toLocaleTimeString()}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Real-time</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4" />
            <span>Auto-refresh: 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatTimeline;