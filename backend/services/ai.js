/**
 * AI Service for threat detection
 * For prototype, we'll use rule-based approaches
 * In production, this would use trained ML models
 */
class AIService {
  /**
   * Check text for phishing attempts
   * @param {String} text - The text to analyze
   * @returns {Object} - Analysis results
   */
  static analyzeTextForPhishing(text) {
    if (!text) return { isPhishing: false, confidence: 0, reasons: [] };

    const lowerText = text.toLowerCase();
    
    // Phishing indicators (simplified for prototype)
    const phishingPatterns = [
      { pattern: 'urgent action required', weight: 0.3 },
      { pattern: 'verify your account', weight: 0.3 },
      { pattern: 'update your payment', weight: 0.3 },
      { pattern: 'suspicious activity', weight: 0.2 },
      { pattern: 'click this link', weight: 0.2 },
      { pattern: 'your account will be suspended', weight: 0.4 },
      { pattern: 'confirm your information', weight: 0.3 },
      { pattern: 'lottery winner', weight: 0.5 },
      { pattern: 'you have won', weight: 0.3 },
      { pattern: 'password expired', weight: 0.3 },
      { pattern: 'unusual login', weight: 0.2 },
      { pattern: 'limited time offer', weight: 0.1 },
      { pattern: 'bank account', weight: 0.1 },
      { pattern: 'login information', weight: 0.2 },
      { pattern: 'security alert', weight: 0.2 }
    ];
    
    let phishingScore = 0;
    const matchedPatterns = [];
    
    // Check for matches and calculate score
    phishingPatterns.forEach(({ pattern, weight }) => {
      if (lowerText.includes(pattern)) {
        phishingScore += weight;
        matchedPatterns.push(pattern);
      }
    });
    
    // Check for suspicious URLs
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = lowerText.match(urlPattern) || [];
    
    urls.forEach(url => {
      // Check for URL shorteners
      if (url.includes('bit.ly') || 
          url.includes('tinyurl') || 
          url.includes('goo.gl')) {
        phishingScore += 0.3;
        matchedPatterns.push('URL shortener detected');
      }
      
      // Check for suspicious domains
      if (!url.includes('https://')) {
        phishingScore += 0.2;
        matchedPatterns.push('Non-HTTPS URL');
      }
      
      // Check for misleading domains
      const suspiciousDomains = ['paypa1.com', 'amaz0n.com', 'g00gle.com', 'faceb00k.com'];
      if (suspiciousDomains.some(domain => url.includes(domain))) {
        phishingScore += 0.5;
        matchedPatterns.push('Suspicious domain');
      }
    });
    
    // Analysis results
    return {
      isPhishing: phishingScore > 0.5,
      confidence: Math.min(0.99, phishingScore),
      reasons: matchedPatterns
    };
  }
  
  /**
   * Analyze user behavior for anomalies
   * @param {Array} userActivities - Recent user activities
   * @param {Object} userProfile - User's normal behavior profile
   * @returns {Object} - Anomaly detection results
   */
  static detectAnomalies(userActivities, userProfile) {
    // In a real implementation, this would use more sophisticated anomaly detection
    // For prototype, we'll use simple rule-based detection
    
    const anomalies = [];
    let anomalyScore = 0;
    
    // Check for login from new location
    const knownLocations = userProfile.knownLocations || [];
    userActivities.forEach(activity => {
      if (
        activity.type === 'login' && 
        activity.location && 
        !knownLocations.includes(activity.location)
      ) {
        anomalies.push({
          type: 'new_location',
          description: `Login from new location: ${activity.location}`,
          severity: 'medium'
        });
        anomalyScore += 0.3;
      }
      
      // Check for unusual time
      if (
        activity.type === 'login' && 
        activity.time && 
        (activity.time.hour < 6 || activity.time.hour > 22)
      ) {
        anomalies.push({
          type: 'unusual_time',
          description: `Login at unusual time: ${activity.time.hour}:${activity.time.minute}`,
          severity: 'low'
        });
        anomalyScore += 0.2;
      }
      
      // Check for multiple failed login attempts
      if (activity.type === 'failed_login' && activity.count > 3) {
        anomalies.push({
          type: 'multiple_failed_logins',
          description: `${activity.count} failed login attempts`,
          severity: 'high'
        });
        anomalyScore += 0.5;
      }
    });
    
    return {
      hasAnomalies: anomalies.length > 0,
      anomalyScore,
      anomalies
    };
  }
}

module.exports = AIService;
