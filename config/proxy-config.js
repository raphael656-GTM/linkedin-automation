/**
 * Residential Proxy Configuration for LinkedIn Scraping
 * Cost-optimized proxy rotation and management
 */

const crypto = require('crypto');

class ProxyManager {
  constructor(options = {}) {
    this.providers = options.providers || [];
    this.currentProvider = 0;
    this.sessionRotationInterval = options.sessionRotationInterval || 10; // requests
    this.requestCount = 0;
    this.sessionId = this.generateSessionId();
    this.rateLimits = options.rateLimits || {
      requestsPerMinute: 60,
      requestsPerHour: 1000
    };
    this.lastRequestTime = 0;
    this.hourlyRequests = [];
  }

  /**
   * Residential Proxy Providers Configuration
   * Recommended providers for LinkedIn scraping
   */
  static getRecommendedProviders() {
    return [
      {
        name: 'Bright Data',
        endpoint: 'brd-customer-{customer_id}-zone-{zone}:password@zproxy.lum-superproxy.io:22225',
        cost_per_gb: 8.40,
        countries: ['US', 'UK', 'CA', 'AU'],
        rotating: true,
        sticky_session: true
      },
      {
        name: 'Oxylabs',
        endpoint: 'customer-{username}-cc-us-sessid-{session}:password@pr.oxylabs.io:7777',
        cost_per_gb: 10.00,
        countries: ['US', 'UK', 'DE', 'FR'],
        rotating: true,
        sticky_session: true
      },
      {
        name: 'Smartproxy',
        endpoint: 'user-{username}-session-{session}:password@gate.smartproxy.com:10000',
        cost_per_gb: 8.50,
        countries: ['US', 'UK', 'CA'],
        rotating: true,
        sticky_session: true
      },
      {
        name: 'NetNut',
        endpoint: '{username}:{password}@rotating-residential.netnut.io:5959',
        cost_per_gb: 20.00,
        countries: ['US', 'UK', 'DE', 'IL'],
        rotating: true,
        sticky_session: false
      }
    ];
  }

  /**
   * Initialize proxy configuration
   */
  async initialize(providerConfig) {
    this.config = {
      ...providerConfig,
      session: this.sessionId,
      country: providerConfig.preferredCountry || 'US'
    };

    console.log(`Initialized proxy: ${this.config.name} (${this.config.country})`);
  }

  /**
   * Get current proxy configuration for Apify
   */
  getApifyProxyConfig() {
    if (!this.config) {
      throw new Error('Proxy not initialized');
    }

    return {
      useResidentialProxies: true,
      proxyUrls: [this.buildProxyUrl()],
      sessionId: this.sessionId,
      countryCode: this.config.country,
      rotateSession: this.shouldRotateSession()
    };
  }

  /**
   * Build proxy URL with current session
   */
  buildProxyUrl() {
    const template = this.config.endpoint;
    
    return template
      .replace('{customer_id}', process.env.PROXY_CUSTOMER_ID || 'your_customer_id')
      .replace('{username}', process.env.PROXY_USERNAME || 'your_username')
      .replace('{password}', process.env.PROXY_PASSWORD || 'your_password')
      .replace('{zone}', process.env.PROXY_ZONE || 'static')
      .replace('{session}', this.sessionId);
  }

  /**
   * Determine if session should rotate
   */
  shouldRotateSession() {
    this.requestCount++;
    
    if (this.requestCount >= this.sessionRotationInterval) {
      this.rotateSession();
      return true;
    }
    
    return false;
  }

  /**
   * Rotate to new session
   */
  rotateSession() {
    this.sessionId = this.generateSessionId();
    this.requestCount = 0;
    console.log(`Rotated to new proxy session: ${this.sessionId}`);
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'session_' + crypto.randomBytes(8).toString('hex');
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneMinuteAgo = now - 60 * 1000;

    // Clean old entries
    this.hourlyRequests = this.hourlyRequests.filter(time => time > oneHourAgo);

    // Check minute limit
    const lastMinuteRequests = this.hourlyRequests.filter(time => time > oneMinuteAgo).length;
    if (lastMinuteRequests >= this.rateLimits.requestsPerMinute) {
      const waitTime = 60000 - (now - oneMinuteAgo);
      console.log(`Rate limit reached, waiting ${waitTime}ms`);
      await this.sleep(waitTime);
    }

    // Check hourly limit
    if (this.hourlyRequests.length >= this.rateLimits.requestsPerHour) {
      const waitTime = oneHourAgo - this.hourlyRequests[0] + 1000;
      console.log(`Hourly limit reached, waiting ${waitTime}ms`);
      await this.sleep(waitTime);
    }

    // Record this request
    this.hourlyRequests.push(now);
    this.lastRequestTime = now;
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cost optimization - adaptive proxy selection
   */
  selectOptimalProxy(requirements = {}) {
    const providers = ProxyManager.getRecommendedProviders();
    
    // Sort by cost-effectiveness for LinkedIn scraping
    return providers.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      
      // Cost factor (lower is better)
      scoreA += (20 - a.cost_per_gb) * 0.4;
      scoreB += (20 - b.cost_per_gb) * 0.4;
      
      // Reliability factor (sticky session preferred)
      if (a.sticky_session) scoreA += 30;
      if (b.sticky_session) scoreB += 30;
      
      // Country availability
      if (a.countries.includes(requirements.country || 'US')) scoreA += 20;
      if (b.countries.includes(requirements.country || 'US')) scoreB += 20;
      
      return scoreB - scoreA;
    })[0];
  }

  /**
   * Get proxy statistics
   */
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentRequests = this.hourlyRequests.filter(time => time > oneHourAgo);
    
    return {
      currentSession: this.sessionId,
      requestCount: this.requestCount,
      recentRequests: recentRequests.length,
      provider: this.config?.name || 'Not configured',
      country: this.config?.country || 'Not set',
      rateLimitUtilization: {
        hourly: Math.round((recentRequests.length / this.rateLimits.requestsPerHour) * 100),
        perMinute: Math.round((recentRequests.filter(t => t > now - 60000).length / this.rateLimits.requestsPerMinute) * 100)
      }
    };
  }

  /**
   * Cost calculation for scraping job
   */
  calculateScrapingCost(profileCount, avgDataPerProfile = 0.5) {
    const totalDataMB = profileCount * avgDataPerProfile;
    const totalDataGB = totalDataMB / 1024;
    const cost = totalDataGB * (this.config?.cost_per_gb || 10);
    
    return {
      profiles: profileCount,
      dataMB: Math.round(totalDataMB * 100) / 100,
      dataGB: Math.round(totalDataGB * 1000) / 1000,
      cost: Math.round(cost * 100) / 100,
      costPerProfile: Math.round((cost / profileCount) * 100) / 100
    };
  }

  /**
   * Proxy health check
   */
  async healthCheck() {
    try {
      const proxyUrl = this.buildProxyUrl();
      const testUrl = 'http://httpbin.org/ip';
      
      // This would be implemented with actual HTTP request
      console.log(`Health checking proxy: ${this.config?.name}`);
      
      return {
        healthy: true,
        responseTime: Math.random() * 1000 + 500, // Simulated
        ip: '1.2.3.4', // Would be actual IP from response
        country: this.config?.country
      };
      
    } catch (error) {
      console.error('Proxy health check failed:', error.message);
      return {
        healthy: false,
        error: error.message
      };
    }
  }
}

module.exports = ProxyManager;