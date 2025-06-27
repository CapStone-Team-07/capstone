// lib/mock-data.js - Centralized Mock Data for Cybersecurity Platform

// Utility function to generate random data within ranges
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// MITRE ATT&CK Framework mappings
export const mitreAttackTechniques = [
  { id: 'T1566.001', name: 'Spearphishing Attachment', tactic: 'Initial Access' },
  { id: 'T1190', name: 'Exploit Public-Facing Application', tactic: 'Initial Access' },
  { id: 'T1078', name: 'Valid Accounts', tactic: 'Defense Evasion' },
  { id: 'T1055', name: 'Process Injection', tactic: 'Defense Evasion' },
  { id: 'T1003', name: 'OS Credential Dumping', tactic: 'Credential Access' },
  { id: 'T1083', name: 'File and Directory Discovery', tactic: 'Discovery' },
  { id: 'T1057', name: 'Process Discovery', tactic: 'Discovery' },
  { id: 'T1021.001', name: 'Remote Desktop Protocol', tactic: 'Lateral Movement' },
  { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact' },
  { id: 'T1020', name: 'Automated Exfiltration', tactic: 'Exfiltration' }
];

// Threat actor groups and their characteristics
export const threatActors = [
  { name: 'APT29', type: 'Nation State', origin: 'Russia', sophistication: 'Advanced' },
  { name: 'Lazarus Group', type: 'Nation State', origin: 'North Korea', sophistication: 'Advanced' },
  { name: 'FIN7', type: 'Cybercriminal', origin: 'Unknown', sophistication: 'Intermediate' },
  { name: 'Conti', type: 'Ransomware', origin: 'Russia', sophistication: 'Intermediate' },
  { name: 'Anonymous', type: 'Hacktivist', origin: 'Global', sophistication: 'Varies' }
];

// Asset types and configurations
export const assetTypes = [
  'Web Server', 'Database Server', 'Domain Controller', 'Email Server',
  'Firewall', 'Router', 'Switch', 'Workstation', 'Mobile Device',
  'Cloud Instance', 'Container', 'IoT Device', 'Network Printer', 'VPN Gateway'
];

// CVE database with realistic vulnerability data
export const cveDatabase = [
  {
    id: 'CVE-2024-1234',
    description: 'Remote Code Execution in Apache HTTP Server',
    cvssScore: 9.8,
    severity: 'Critical',
    publishedDate: '2024-01-15',
    affectedSoftware: 'Apache HTTP Server 2.4.x',
    exploitAvailable: true,
    patchAvailable: true
  },
  {
    id: 'CVE-2024-5678',
    description: 'SQL Injection in MySQL Database',
    cvssScore: 8.1,
    severity: 'High',
    publishedDate: '2024-02-03',
    affectedSoftware: 'MySQL 8.0.x',
    exploitAvailable: false,
    patchAvailable: true
  },
  {
    id: 'CVE-2024-9012',
    description: 'Cross-Site Scripting in WordPress Plugin',
    cvssScore: 6.1,
    severity: 'Medium',
    publishedDate: '2024-01-28',
    affectedSoftware: 'WordPress Contact Form 7',
    exploitAvailable: true,
    patchAvailable: false
  }
];

// Generate realistic threat data
export const generateThreats = (count = 50) => {
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const threatTypes = [
    'Malware Detection', 'Suspicious Login', 'Data Exfiltration', 'Phishing Attempt',
    'Brute Force Attack', 'Privilege Escalation', 'Lateral Movement', 'C2 Communication',
    'Ransomware Activity', 'Zero-Day Exploit', 'Insider Threat', 'DDoS Attack'
  ];
  const statuses = ['Active', 'Investigating', 'Contained', 'Resolved', 'False Positive'];
  const sources = ['EDR', 'SIEM', 'Firewall', 'IDS/IPS', 'Email Security', 'Endpoint'];

  return Array.from({ length: count }, (_, i) => {
    const severity = randomChoice(severities);
    const threatType = randomChoice(threatTypes);
    const mitreTechnique = randomChoice(mitreAttackTechniques);
    const actor = randomChoice(threatActors);
    const timestamp = randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date());

    return {
      id: `THR-${String(i + 1).padStart(4, '0')}`,
      timestamp: timestamp.toISOString(),
      severity,
      type: threatType,
      source: randomChoice(sources),
      sourceIp: `${randomBetween(1, 255)}.${randomBetween(1, 255)}.${randomBetween(1, 255)}.${randomBetween(1, 255)}`,
      targetIp: `192.168.1.${randomBetween(1, 254)}`,
      targetAsset: `${randomChoice(['SRV', 'WS', 'DB'])}-${String(randomBetween(1, 100)).padStart(3, '0')}`,
      status: randomChoice(statuses),
      description: `${threatType} detected from ${actor.name} using ${mitreTechnique.name}`,
      aiConfidence: randomBetween(60, 98),
      mitreId: mitreTechnique.id,
      mitreTactic: mitreTechnique.tactic,
      threatActor: actor.name,
      actorType: actor.type,
      riskScore: severity === 'Critical' ? randomBetween(85, 100) :
                 severity === 'High' ? randomBetween(70, 84) :
                 severity === 'Medium' ? randomBetween(40, 69) : randomBetween(10, 39),
      affectedUsers: randomBetween(1, 25),
      containmentTime: randomBetween(5, 240), // minutes
      evidenceCount: randomBetween(1, 15),
      relatedIncidents: randomBetween(0, 5)
    };
  });
};

// Generate asset inventory
export const generateAssets = (count = 200) => {
  const statuses = ['Online', 'Offline', 'Warning', 'Maintenance'];
  const locations = ['HQ-Floor1', 'HQ-Floor2', 'DC-East', 'DC-West', 'Branch-NY', 'Branch-LA', 'Cloud-AWS', 'Cloud-Azure'];
  const criticalities = ['Critical', 'High', 'Medium', 'Low'];

  return Array.from({ length: count }, (_, i) => {
    const assetType = randomChoice(assetTypes);
    const status = randomChoice(statuses);
    const criticality = randomChoice(criticalities);
    const lastSeen = randomDate(new Date(Date.now() - 24 * 60 * 60 * 1000), new Date());

    return {
      id: `AST-${String(i + 1).padStart(4, '0')}`,
      name: `${assetType.replace(' ', '-')}-${String(i + 1).padStart(3, '0')}`,
      type: assetType,
      status,
      ipAddress: `192.168.${randomBetween(1, 10)}.${randomBetween(1, 254)}`,
      macAddress: Array.from({ length: 6 }, () => randomBetween(0, 255).toString(16).padStart(2, '0')).join(':'),
      location: randomChoice(locations),
      criticality,
      lastSeen: lastSeen.toISOString(),
      os: randomChoice(['Windows 11', 'Windows Server 2022', 'Ubuntu 22.04', 'CentOS 8', 'macOS 13']),
      vulnerabilities: randomBetween(0, 15),
      patchLevel: randomBetween(60, 100),
      complianceScore: randomBetween(70, 100),
      uptime: randomBetween(85, 100),
      owner: randomChoice(['IT Department', 'Finance', 'HR', 'Sales', 'Engineering', 'Security']),
      installDate: randomDate(new Date('2020-01-01'), new Date('2024-01-01')).toISOString().split('T')[0]
    };
  });
};

// Generate vulnerability data
export const generateVulnerabilities = (count = 100) => {
  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const categories = ['SQL Injection', 'XSS', 'Buffer Overflow', 'Privilege Escalation', 'Information Disclosure', 'DoS'];
  const statuses = ['Open', 'In Progress', 'Patched', 'Accepted Risk', 'False Positive'];

  return Array.from({ length: count }, (_, i) => {
    const cve = randomChoice(cveDatabase);
    const severity = cve.severity;
    const category = randomChoice(categories);
    const status = randomChoice(statuses);
    const discoveredDate = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

    return {
      id: `VUL-${String(i + 1).padStart(4, '0')}`,
      cveId: cve.id,
      title: cve.description,
      severity,
      category,
      cvssScore: cve.cvssScore,
      status,
      discoveredDate: discoveredDate.toISOString(),
      affectedAssets: randomBetween(1, 20),
      exploitAvailable: cve.exploitAvailable,
      patchAvailable: cve.patchAvailable,
      riskScore: cve.cvssScore * 10,
      businessImpact: severity === 'Critical' ? 'High' : severity === 'High' ? 'Medium' : 'Low',
      remediationEffort: randomBetween(1, 40), // hours
      daysOpen: Math.floor((new Date() - discoveredDate) / (1000 * 60 * 60 * 24)),
      vendor: randomChoice(['Microsoft', 'Apache', 'Oracle', 'Adobe', 'Google', 'Mozilla']),
      affectedSoftware: cve.affectedSoftware,
      description: `${category} vulnerability in ${cve.affectedSoftware}. ${cve.description}`,
      recommendation: 'Apply security patch immediately and monitor for exploitation attempts.'
    };
  });
};

// Generate compliance data
export const generateComplianceData = () => {
  const frameworks = [
    { name: 'NIST CSF', fullName: 'NIST Cybersecurity Framework', score: randomBetween(75, 95) },
    { name: 'ISO 27001', fullName: 'ISO/IEC 27001:2013', score: randomBetween(70, 90) },
    { name: 'SOC 2', fullName: 'SOC 2 Type II', score: randomBetween(80, 95) },
    { name: 'PCI DSS', fullName: 'Payment Card Industry DSS', score: randomBetween(85, 98) },
    { name: 'GDPR', fullName: 'General Data Protection Regulation', score: randomBetween(78, 92) },
    { name: 'HIPAA', fullName: 'Health Insurance Portability Act', score: randomBetween(82, 96) }
  ];

  return frameworks.map(framework => ({
    ...framework,
    controls: randomBetween(50, 200),
    passed: Math.floor(framework.controls * (framework.score / 100)),
    failed: Math.floor(framework.controls * ((100 - framework.score) / 100)),
    lastAssessment: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()).toISOString().split('T')[0],
    nextAssessment: randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  }));
};

// Generate time-series data for charts
export const generateThreatTimeline = (days = 30) => {
  const data = [];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      critical: randomBetween(0, 5),
      high: randomBetween(2, 15),
      medium: randomBetween(5, 25),
      low: randomBetween(10, 40),
      total: 0
    });
    data[i].total = data[i].critical + data[i].high + data[i].medium + data[i].low;
  }

  return data;
};

// Generate alert distribution data
export const generateAlertDistribution = () => [
  { name: 'Malware', value: 35, color: '#ef4444' },
  { name: 'Phishing', value: 25, color: '#f97316' },
  { name: 'Brute Force', value: 20, color: '#eab308' },
  { name: 'Data Exfiltration', value: 12, color: '#06b6d4' },
  { name: 'Other', value: 8, color: '#8b5cf6' }
];

// Generate geographic threat data
export const generateGeographicThreats = () => [
  { country: 'United States', threats: 245, lat: 39.8283, lng: -98.5795 },
  { country: 'China', threats: 189, lat: 35.8617, lng: 104.1954 },
  { country: 'Russia', threats: 156, lat: 61.5240, lng: 105.3188 },
  { country: 'Germany', threats: 89, lat: 51.1657, lng: 10.4515 },
  { country: 'United Kingdom', threats: 76, lat: 55.3781, lng: -3.4360 },
  { country: 'Brazil', threats: 64, lat: -14.2350, lng: -51.9253 },
  { country: 'India', threats: 52, lat: 20.5937, lng: 78.9629 },
  { country: 'France', threats: 41, lat: 46.2276, lng: 2.2137 }
];

// Generate security metrics over time
export const generateSecurityMetrics = (days = 30) => {
  const data = [];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  let securityScore = randomBetween(75, 85);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    // Add some realistic variance
    securityScore += randomBetween(-3, 3);
    securityScore = Math.max(60, Math.min(100, securityScore));

    data.push({
      date: date.toISOString().split('T')[0],
      securityScore: securityScore,
      threatsDetected: randomBetween(5, 30),
      threatsResolved: randomBetween(3, 25),
      vulnerabilitiesPatched: randomBetween(0, 8),
      complianceScore: randomBetween(80, 95)
    });
  }

  return data;
};

// Generate network traffic data
export const generateNetworkTraffic = () => {
  const protocols = ['HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS', 'SMTP'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return hours.map(hour => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    normal: randomBetween(1000, 5000),
    suspicious: randomBetween(0, 200),
    blocked: randomBetween(0, 100),
    protocol: randomChoice(protocols)
  }));
};

// Generate incident response data
export const generateIncidents = (count = 25) => {
  const types = ['Data Breach', 'Malware Infection', 'Phishing Campaign', 'Insider Threat', 'System Compromise'];
  const priorities = ['P1 - Critical', 'P2 - High', 'P3 - Medium', 'P4 - Low'];
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  return Array.from({ length: count }, (_, i) => {
    const createdDate = randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date());
    const type = randomChoice(types);
    const priority = randomChoice(priorities);
    const status = randomChoice(statuses);

    return {
      id: `INC-${String(i + 1).padStart(4, '0')}`,
      title: `${type} - ${randomChoice(['Web Server', 'Email System', 'Database', 'Workstation'])}`,
      type,
      priority,
      status,
      severity: priority.includes('Critical') ? 'Critical' : priority.includes('High') ? 'High' : 'Medium',
      createdDate: createdDate.toISOString(),
      assignee: randomChoice(['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Brown']),
      affectedSystems: randomBetween(1, 10),
      estimatedLoss: randomBetween(1000, 100000),
      recoveryTime: randomBetween(30, 480), // minutes
      rootCause: randomChoice(['Human Error', 'System Failure', 'External Attack', 'Configuration Error']),
      lessonsLearned: status === 'Closed' ? 'Documented' : 'Pending'
    };
  });
};

// Configuration templates
export const configurationTemplates = {
  firewall: {
    name: 'Firewall Rules',
    rules: [
      { id: 1, action: 'ALLOW', source: '192.168.1.0/24', dest: 'ANY', port: '80,443', protocol: 'TCP' },
      { id: 2, action: 'DENY', source: 'ANY', dest: '192.168.1.100', port: '22', protocol: 'TCP' },
      { id: 3, action: 'ALLOW', source: '10.0.0.0/8', dest: '192.168.1.0/24', port: '3389', protocol: 'TCP' }
    ]
  },
  ids: {
    name: 'IDS Signatures',
    signatures: [
      { id: 'SID-001', name: 'SQL Injection Attempt', enabled: true, severity: 'High' },
      { id: 'SID-002', name: 'Port Scan Detection', enabled: true, severity: 'Medium' },
      { id: 'SID-003', name: 'Malware Communication', enabled: true, severity: 'Critical' }
    ]
  }
};

// Export all mock data generators and static data
export const mockData = {
  threats: generateThreats(100),
  assets: generateAssets(250),
  vulnerabilities: generateVulnerabilities(150),
  compliance: generateComplianceData(),
  threatTimeline: generateThreatTimeline(30),
  alertDistribution: generateAlertDistribution(),
  geographicThreats: generateGeographicThreats(),
  securityMetrics: generateSecurityMetrics(30),
  networkTraffic: generateNetworkTraffic(),
  incidents: generateIncidents(50),
  mitreAttackTechniques,
  threatActors,
  cveDatabase,
  configurationTemplates
};

// Real-time data simulation functions
export const simulateRealTimeThreats = () => {
  const newThreat = generateThreats(1)[0];
  newThreat.id = `THR-RT-${Date.now()}`;
  newThreat.timestamp = new Date().toISOString();
  return newThreat;
};

export const simulateRealTimeMetrics = () => ({
  activeThreats: randomBetween(8, 25),
  criticalVulns: randomBetween(3, 12),
  securityScore: randomBetween(78, 92),
  assetsMonitored: 1247 + randomBetween(-5, 10),
  lastUpdate: new Date().toISOString()
});

// Search and filter utilities
export const searchThreats = (threats, query) => {
  if (!query) return threats;
  
  const lowercaseQuery = query.toLowerCase();
  return threats.filter(threat =>
    threat.type.toLowerCase().includes(lowercaseQuery) ||
    threat.description.toLowerCase().includes(lowercaseQuery) ||
    threat.threatActor.toLowerCase().includes(lowercaseQuery) ||
    threat.mitreId.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterThreatsBySeverity = (threats, severity) => {
  if (!severity || severity === 'All') return threats;
  return threats.filter(threat => threat.severity === severity);
};

export const filterThreatsByStatus = (threats, status) => {
  if (!status || status === 'All') return threats;
  return threats.filter(threat => threat.status === status);
};

export const sortThreats = (threats, sortBy, sortOrder = 'desc') => {
  return [...threats].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'timestamp') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    
    if (sortBy === 'riskScore' || sortBy === 'aiConfidence') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

console.log('Mock data initialized:', {
  threats: mockData.threats.length,
  assets: mockData.assets.length,
  vulnerabilities: mockData.vulnerabilities.length,
  incidents: mockData.incidents.length
});