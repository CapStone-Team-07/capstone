import axios from 'axios';
import base64url from 'base64url';

const BASE_URL = 'https://www.virustotal.com/api/v3';

/**
 * Check file hash against VirusTotal
 * @param {string} fileHash
 * @param {string} apiKey
 * @returns {Promise<object>}
 */
export const checkFileHash = async (fileHash, apiKey) => {
  if (!apiKey) {
    return {
      error: 'VirusTotal API key not configured',
      hash: fileHash
    };
  }

  try {
    const headers = { 'x-apikey': apiKey };
    const response = await axios.get(`${BASE_URL}/files/${fileHash}`, { headers });

    if (response.status === 200) {
      const data = response.data;
      const stats = data?.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const total = Object.values(stats).reduce((a, b) => a + b, 0);

      return {
        hash: fileHash,
        detection_ratio: `${malicious}/${total}`,
        malicious: malicious > 0,
        threat_level: getFileThreatLevel(malicious, total),
        scan_date: data?.data?.attributes?.last_analysis_date,
        stats
      };
    } else if (response.status === 404) {
      return {
        hash: fileHash,
        detection_ratio: '0/0',
        malicious: false,
        threat_level: 'UNKNOWN',
        message: 'File not found in VirusTotal database'
      };
    } else {
      return {
        error: `VirusTotal API error: ${response.status}`,
        hash: fileHash
      };
    }
  } catch (e) {
    return {
      error: `VirusTotal request failed: ${e.message}`,
      hash: fileHash
    };
  }
};

/**
 * Check URL against VirusTotal
 * @param {string} url
 * @param {string} apiKey
 * @returns {Promise<object>}
 */
export const checkUrl = async (url, apiKey) => {
  if (!apiKey) {
    return {
      error: 'VirusTotal API key not configured',
      url
    };
  }

  try {
    const headers = { 'x-apikey': apiKey };
    const urlId = base64url(url); // URL-safe base64 encoding (without padding)
    const response = await axios.get(`${BASE_URL}/urls/${urlId}`, { headers });

    if (response.status === 200) {
      const data = response.data;
      const stats = data?.data?.attributes?.last_analysis_stats || {};
      const malicious = stats.malicious || 0;
      const total = Object.values(stats).reduce((a, b) => a + b, 0);

      return {
        url,
        detection_ratio: `${malicious}/${total}`,
        malicious: malicious > 0,
        threat_level: getUrlThreatLevel(malicious),
        scan_date: data?.data?.attributes?.last_analysis_date,
        stats
      };
    } else if (response.status === 404) {
      return {
        url,
        detection_ratio: '0/0',
        malicious: false,
        threat_level: 'UNKNOWN',
        message: 'URL not found in VirusTotal database'
      };
    } else {
      return {
        error: `VirusTotal API error: ${response.status}`,
        url
      };
    }
  } catch (e) {
    return {
      error: `VirusTotal request failed: ${e.message}`,
      url
    };
  }
};

// 🔒 Internal threat level helpers
const getFileThreatLevel = (malicious, total) => {
  if (total === 0) return 'UNKNOWN';
  const ratio = malicious / total;
  if (ratio >= 0.3) return 'HIGH';
  if (ratio >= 0.1) return 'MEDIUM';
  return 'LOW';
};

const getUrlThreatLevel = (malicious) => {
  if (malicious >= 5) return 'HIGH';
  if (malicious >= 2) return 'MEDIUM';
  if (malicious >= 1) return 'LOW';
  return 'CLEAN';
};
