// components/dashboard/AIAlertAnalyst.jsx - AI-Powered Alert Analysis with OpenAI GPT-4

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Play,
  Pause,
  RefreshCw,
  Upload,
  Download,
  Copy,
  FileText,
  Target,
  Shield,
  Activity,
  Info,
  Zap,
  Clock,
  MapPin,
  User,
  Server,
  Network,
  Database,
  Code,
  Search,
  Filter,
  Settings,
  Save,
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  TrendingUp,
  BarChart3,
  PieChart,
  MessageSquare,
  Lightbulb,
  Flag,
  Star
} from 'lucide-react';

const AIAlertAnalyst = () => {
  // State management
  const [alertInput, setAlertInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('ssh_bruteforce');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [apiSettings, setApiSettings] = useState({
    temperature: 0.3,
    maxTokens: 2048,
    model: 'gpt-4'
  });
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  // Mock alert templates for demonstration
  const alertTemplates = {
    ssh_bruteforce: {
      name: 'SSH Brute Force Attack',
      description: 'Multiple failed SSH login attempts',
      data: {
        timestamp: "2025-06-30T12:01:45Z",
        rule: {
          level: 10,
          description: "Multiple failed SSH login attempts",
          id: "5710",
          groups: ["authentication_failures", "sshd"]
        },
        agent: {
          id: "001",
          name: "web-server-1",
          ip: "10.0.1.50"
        },
        source: {
          ip: "192.168.1.55",
          port: 59832
        },
        user: "admin",
        location: "/var/log/auth.log",
        full_log: "Failed password for invalid user admin from 192.168.1.55 port 59832 ssh2",
        decoder: {
          name: "sshd"
        },
        threat_intel: {
          source_reputation: "suspicious",
          geolocation: "Unknown",
          known_bad_actor: false
        },
        previous_events: 15,
        time_window: "5 minutes"
      }
    },
    web_attack: {
      name: 'Web Application Attack',
      description: 'SQL injection attempt detected',
      data: {
        timestamp: "2025-06-30T14:23:12Z",
        rule: {
          level: 12,
          description: "SQL injection attack attempt",
          id: "31103",
          groups: ["web", "attack", "sql_injection"]
        },
        agent: {
          id: "002",
          name: "web-app-server",
          ip: "10.0.2.100"
        },
        source: {
          ip: "203.45.67.89",
          port: 80
        },
        user: "www-data",
        location: "/var/log/apache2/access.log",
        full_log: "POST /login.php HTTP/1.1 - 200 - \"username=admin' OR '1'='1&password=test\"",
        decoder: {
          name: "apache"
        },
        url: "/login.php",
        method: "POST",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        threat_intel: {
          source_reputation: "malicious",
          geolocation: "China",
          known_bad_actor: true,
          threat_feeds: ["blocklist_db", "malware_ips"]
        }
      }
    },
    malware_detection: {
      name: 'Malware Detection',
      description: 'Suspicious file execution detected',
      data: {
        timestamp: "2025-06-30T16:45:33Z",
        rule: {
          level: 15,
          description: "Malware detected - Trojan.Win32.Agent",
          id: "92001",
          groups: ["malware", "trojan", "endpoint"]
        },
        agent: {
          id: "003",
          name: "desktop-workstation-05",
          ip: "192.168.10.45"
        },
        file: {
          path: "C:\\Users\\jdoe\\Downloads\\invoice.exe",
          hash: "d41d8cd98f00b204e9800998ecf8427e",
          size: 2048576
        },
        process: {
          name: "invoice.exe",
          pid: 4521,
          parent: "explorer.exe"
        },
        user: "jdoe",
        location: "Windows Event Log",
        full_log: "Malicious file detected: C:\\Users\\jdoe\\Downloads\\invoice.exe - Trojan.Win32.Agent",
        decoder: {
          name: "windows-defender"
        },
        threat_intel: {
          virus_total_score: "56/70",
          malware_family: "Trojan.Win32.Agent",
          known_campaigns: ["PhishingCampaign2024"]
        }
      }
    },
    privilege_escalation: {
      name: 'Privilege Escalation',
      description: 'Suspicious privilege escalation attempt',
      data: {
        timestamp: "2025-06-30T18:12:07Z",
        rule: {
          level: 13,
          description: "Possible privilege escalation attempt",
          id: "80790",
          groups: ["privilege_escalation", "sudo", "authentication"]
        },
        agent: {
          id: "004",
          name: "db-server-01",
          ip: "10.0.3.200"
        },
        source: {
          ip: "10.0.3.45"
        },
        user: "backup",
        command: "sudo /bin/bash",
        location: "/var/log/auth.log",
        full_log: "sudo: backup : TTY=pts/0 ; PWD=/home/backup ; USER=root ; COMMAND=/bin/bash",
        decoder: {
          name: "sudo"
        },
        threat_intel: {
          user_risk_score: "medium",
          unusual_behavior: true,
          off_hours_activity: true
        }
      }
    }
  };

  // Initialize with default template
  useEffect(() => {
    if (selectedTemplate && alertTemplates[selectedTemplate]) {
      setAlertInput(JSON.stringify(alertTemplates[selectedTemplate].data, null, 2));
    }
  }, [selectedTemplate]);

  // OpenAI API integration
  const analyzeAlertWithAI = async (alertData) => {
    const OPENAI_API_KEY = 'OPEN-API-KEY';
    const startTime = Date.now();
    
    try {
      // Task 1: Alert Summarization & Classification
      const summaryPrompt = `
You are an expert cybersecurity analyst. Analyze this Wazuh security alert and provide:

1. A clear, plain-language summary of what this alert means
2. Your assessment of the threat level (Critical/High/Medium/Low)
3. Classification as one of: "True Positive", "False Positive", or "Needs Investigation"
4. Risk assessment and immediate recommendations

Alert Data:
${JSON.stringify(alertData, null, 2)}

Respond in this exact JSON format:
{
  "summary": "Plain language explanation of what happened",
  "threat_level": "Critical|High|Medium|Low",
  "classification": "True Positive|False Positive|Needs Investigation",
  "confidence_score": 0-100,
  "risk_assessment": "Detailed risk analysis",
  "immediate_actions": ["action1", "action2", "action3"],
  "context": "Additional context and background information"
}`;

      // Task 2: MITRE ATT&CK Mapping
      const mitrePrompt = `
You are a MITRE ATT&CK expert. Analyze this security alert and map it to relevant MITRE ATT&CK techniques.

Alert Data:
${JSON.stringify(alertData, null, 2)}

Identify the most relevant MITRE ATT&CK techniques and provide detailed mapping. Respond in this exact JSON format:
{
  "primary_technique": {
    "id": "T1XXX",
    "name": "Technique Name",
    "tactic": "Tactic Name",
    "confidence": 0-100,
    "evidence": "Why this technique applies to this alert"
  },
  "secondary_techniques": [
    {
      "id": "T1XXX",
      "name": "Technique Name", 
      "tactic": "Tactic Name",
      "confidence": 0-100,
      "evidence": "Supporting evidence"
    }
  ],
  "kill_chain_phase": "Which phase of the cyber kill chain",
  "behavioral_indicators": ["indicator1", "indicator2"],
  "related_groups": ["APT groups or threat actors that use these techniques"],
  "recommendations": ["Detection and mitigation recommendations"]
}`;

      // Make parallel API calls
      const [summaryResponse, mitreResponse] = await Promise.all([
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: apiSettings.model,
            temperature: apiSettings.temperature,
            max_tokens: apiSettings.maxTokens,
            messages: [
              {
                role: 'system',
                content: 'You are an expert cybersecurity analyst with deep knowledge of threat detection and incident response.'
              },
              {
                role: 'user',
                content: summaryPrompt
              }
            ]
          })
        }),
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: apiSettings.model,
            temperature: apiSettings.temperature,
            max_tokens: apiSettings.maxTokens,
            messages: [
              {
                role: 'system',
                content: 'You are a MITRE ATT&CK expert specializing in mapping security events to attack techniques and providing actionable intelligence.'
              },
              {
                role: 'user',
                content: mitrePrompt
              }
            ]
          })
        })
      ]);

      if (!summaryResponse.ok || !mitreResponse.ok) {
        throw new Error('API request failed');
      }

      const summaryData = await summaryResponse.json();
      const mitreData = await mitreResponse.json();

      // Parse AI responses
      let summaryResult, mitreResult;
      
      try {
        summaryResult = JSON.parse(summaryData.choices[0].message.content);
      } catch (e) {
        summaryResult = {
          summary: summaryData.choices[0].message.content,
          threat_level: "Medium",
          classification: "Needs Investigation",
          confidence_score: 75,
          risk_assessment: "Unable to parse structured response",
          immediate_actions: ["Manual review required"],
          context: "Response parsing failed"
        };
      }

      try {
        mitreResult = JSON.parse(mitreData.choices[0].message.content);
      } catch (e) {
        mitreResult = {
          primary_technique: {
            id: "Unknown",
            name: "Manual Analysis Required",
            tactic: "Unknown",
            confidence: 50,
            evidence: "Unable to parse AI response"
          },
          secondary_techniques: [],
          kill_chain_phase: "Unknown",
          behavioral_indicators: [],
          related_groups: [],
          recommendations: ["Manual MITRE ATT&CK mapping required"]
        };
      }

      return {
        timestamp: new Date().toISOString(),
        alert_id: alertData.rule?.id || 'unknown',
        summary: summaryResult,
        mitre_mapping: mitreResult,
        raw_alert: alertData,
        processing_time: Date.now() - startTime
      };

    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
  };

  // Handle analysis execution
  const handleAnalyze = async () => {
    if (!alertInput.trim()) {
      setError('Please provide alert data to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Parse alert input
      const alertData = JSON.parse(alertInput);
      
      // Perform AI analysis
      const results = await analyzeAlertWithAI(alertData);
      
      // Update results and history
      setAnalysisResults(results);
      setAnalysisHistory(prev => [results, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Export functions
  const exportResults = () => {
    if (!analysisResults) return;
    
    const exportData = {
      analysis_results: analysisResults,
      exported_at: new Date().toISOString(),
      analyst: "AI Alert Analyst v1.0"
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alert-analysis-${analysisResults.alert_id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Utility functions
  const getThreatLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'True Positive': return 'text-red-400 bg-red-500/20';
      case 'False Positive': return 'text-green-400 bg-green-500/20';
      case 'Needs Investigation': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatProcessingTime = (ms) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Alert Analyst</h1>
            <p className="text-gray-400">GPT-4 powered security alert analysis and MITRE ATT&CK mapping</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {/* <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button> */}
          {analysisResults && (
            <button
              onClick={exportResults}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Settings Panel */}
      {showAdvancedSettings && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">AI Analysis Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
              <select
                value={apiSettings.model}
                onChange={(e) => setApiSettings(prev => ({ ...prev, model: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="gpt-4">GPT-4 (Recommended)</option>
                <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temperature: {apiSettings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={apiSettings.temperature}
                onChange={(e) => setApiSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
              <input
                type="number"
                value={apiSettings.maxTokens}
                onChange={(e) => setApiSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                min="256"
                max="4096"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          {/* Alert Templates */}
          {/* <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Alert Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(alertTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`p-3 rounded-lg border transition-colors text-left ${
                    selectedTemplate === key
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-600 hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div> */}

          {/* Alert Input */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Alert Data Input</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    try {
                      setAlertInput(JSON.stringify(JSON.parse(alertInput), null, 2));
                    } catch (e) {
                      setError('Invalid JSON format');
                    }
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                >
                  Format JSON
                </button>
                <button
                  onClick={() => setAlertInput('')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={alertInput}
              onChange={(e) => setAlertInput(e.target.value)}
              placeholder="Paste your Wazuh alert JSON here..."
              className="w-full h-64 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">
                {alertInput.length} characters
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !alertInput.trim()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {analysisResults ? (
            <>
              {/* Analysis Summary */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Alert Summary & Classification</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatProcessingTime(analysisResults.processing_time)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Classification & Threat Level */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Classification</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClassificationColor(analysisResults.summary.classification)}`}>
                        {analysisResults.summary.classification}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Threat Level</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getThreatLevelColor(analysisResults.summary.threat_level)}`}>
                        {analysisResults.summary.threat_level}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">AI Confidence</span>
                      <span className="text-white">{analysisResults.summary.confidence_score}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysisResults.summary.confidence_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Analysis Summary</div>
                    <p className="text-white text-sm leading-relaxed bg-gray-700/30 p-3 rounded-lg">
                      {analysisResults.summary.summary}
                    </p>
                  </div>

                  {/* Risk Assessment */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Risk Assessment</div>
                    <p className="text-gray-300 text-sm leading-relaxed bg-gray-700/30 p-3 rounded-lg">
                      {analysisResults.summary.risk_assessment}
                    </p>
                  </div>

                  {/* Immediate Actions */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Recommended Actions</div>
                    <ul className="space-y-1">
                      {analysisResults.summary.immediate_actions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* MITRE ATT&CK Mapping */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span>MITRE ATT&CK Mapping</span>
                </h3>

                <div className="space-y-4">
                  {/* Primary Technique */}
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">Primary Technique</h4>
                      <span className="text-sm text-blue-400">
                        {analysisResults.mitre_mapping.primary_technique.confidence}% confidence
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded font-mono">
                          <a href={`https://attack.mitre.org/techniques/${analysisResults.mitre_mapping.primary_technique.id}/`} target="_blank" rel="noopener noreferrer">
                            {analysisResults.mitre_mapping.primary_technique.id}
                          </a>
                        </span>
                        <span className="text-white font-medium">
                          {analysisResults.mitre_mapping.primary_technique.name}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-400">Tactic: </span>
                        <span className="text-gray-300">{analysisResults.mitre_mapping.primary_technique.tactic}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {analysisResults.mitre_mapping.primary_technique.evidence}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Techniques */}
                  {analysisResults.mitre_mapping.secondary_techniques?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white mb-3">Secondary Techniques</h4>
                      <div className="space-y-2">
                        {analysisResults.mitre_mapping.secondary_techniques.map((technique, index) => (
                          <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-mono">
                                  <a href={`https://attack.mitre.org/techniques/${technique.id}/`} target="_blank" rel="noopener noreferrer">
                                    {technique.id}
                                  </a>
                                </span>
                                <span className="text-white text-sm">{technique.name}</span>
                              </div>
                              <span className="text-xs text-blue-400">{technique.confidence}%</span>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">
                              Tactic: {technique.tactic}
                            </div>
                            <p className="text-xs text-gray-300">{technique.evidence}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kill Chain Phase & Alert ID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Kill Chain Phase</div>
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm">
                        {analysisResults.mitre_mapping.kill_chain_phase}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Alert ID</div>
                      <span className="text-white font-mono text-sm">{analysisResults.alert_id}</span>
                    </div>
                  </div>

                  {/* Behavioral Indicators */}
                  {analysisResults.mitre_mapping.behavioral_indicators?.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Behavioral Indicators</div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.mitre_mapping.behavioral_indicators.map((indicator, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                            {indicator}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Threat Groups */}
                  {analysisResults.mitre_mapping.related_groups?.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Related Threat Groups</div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.mitre_mapping.related_groups.map((group, index) => (
                          <span key={index} className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Detection & Mitigation</div>
                    <ul className="space-y-1">
                      {analysisResults.mitre_mapping.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <div className="w-1 h-1 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Raw Analysis Data (Collapsible) */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <button
                  onClick={() => setActiveTab(activeTab === 'raw' ? 'analysis' : 'raw')}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-semibold text-white">Raw Analysis Data</h3>
                  {activeTab === 'raw' ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {activeTab === 'raw' && (
                  <div className="mt-4">
                    <pre className="bg-gray-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(analysisResults, null, 2)}
                    </pre>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(analysisResults, null, 2))}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Placeholder when no results */
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Analysis Ready</h3>
              <p className="text-gray-400 mb-4 text-sm">
                Paste your Wazuh alert data, then click "Run AI Analysis" to get:
              </p>
              <div className="space-y-2 mt-4 text-sm text-gray-300 text-lg">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Intelligent alert summarization & classification</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  <span>Automated MITRE ATT&CK technique mapping</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span>Actionable recommendations & next steps</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Analysis History</h3>
            <button
              onClick={() => setAnalysisHistory([])}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analysisHistory.map((analysis, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => setAnalysisResults(analysis)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getClassificationColor(analysis.summary.classification)}`}>
                      {analysis.summary.classification}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getThreatLevelColor(analysis.summary.threat_level)}`}>
                      {analysis.summary.threat_level}
                    </span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Alert {analysis.alert_id}</div>
                    <div className="text-gray-400 text-xs">
                      {new Date(analysis.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">
                    {formatProcessingTime(analysis.processing_time)}
                  </span>
                  <div className="text-blue-400">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Information */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>OpenAI GPT-4 Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>Secure API Integration</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>Model: {apiSettings.model}</span>
            <span>Temp: {apiSettings.temperature}</span>
            <span>Max Tokens: {apiSettings.maxTokens}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAlertAnalyst;