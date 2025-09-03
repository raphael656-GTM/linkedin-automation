/**
 * LinkedIn Automation Cache System
 * Implements intelligent caching to reduce scraping costs by 40%
 * Target: 40% cache hit rate for 3,000 prospects/month
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class LinkedInCacheSystem {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || path.join(__dirname, '../cache');
    this.defaultTTL = options.defaultTTL || 24 * 60 * 60 * 1000; // 24 hours
    this.maxCacheSize = options.maxCacheSize || 1000; // Max cached profiles
    this.costPerScrape = options.costPerScrape || 0.05; // $0.05 per profile
    this.stats = {
      hits: 0,
      misses: 0,
      saves: 0,
      totalCostSaved: 0
    };
  }

  async initialize() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      console.log('Cache system initialized:', this.cacheDir);
    } catch (error) {
      console.error('Failed to initialize cache system:', error);
      throw error;
    }
  }

  /**
   * Generate cache key for LinkedIn profile
   */
  generateCacheKey(linkedinId) {
    return crypto.createHash('md5').update(linkedinId).digest('hex');
  }

  /**
   * Get cached profile data
   */
  async get(linkedinId) {
    try {
      const cacheKey = this.generateCacheKey(linkedinId);
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      
      const data = await fs.readFile(cacheFile, 'utf8');
      const cacheEntry = JSON.parse(data);
      
      // Check if cache is still valid
      if (Date.now() - cacheEntry.timestamp > this.defaultTTL) {
        // Cache expired, remove file
        await this.delete(linkedinId);
        this.stats.misses++;
        return null;
      }
      
      this.stats.hits++;
      this.stats.totalCostSaved += this.costPerScrape;
      
      console.log(`Cache hit for ${linkedinId}, cost saved: $${this.costPerScrape}`);
      return cacheEntry.data;
      
    } catch (error) {
      // Cache miss (file doesn't exist or is corrupted)
      this.stats.misses++;
      return null;
    }
  }

  /**
   * Cache profile data
   */
  async set(linkedinId, profileData) {
    try {
      const cacheKey = this.generateCacheKey(linkedinId);
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      
      const cacheEntry = {
        linkedinId,
        timestamp: Date.now(),
        data: profileData,
        version: '1.0'
      };
      
      await fs.writeFile(cacheFile, JSON.stringify(cacheEntry, null, 2));
      this.stats.saves++;
      
      console.log(`Cached profile data for ${linkedinId}`);
      
      // Clean up old cache if needed
      await this.cleanupCache();
      
    } catch (error) {
      console.error(`Failed to cache profile ${linkedinId}:`, error);
    }
  }

  /**
   * Delete cached profile
   */
  async delete(linkedinId) {
    try {
      const cacheKey = this.generateCacheKey(linkedinId);
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      await fs.unlink(cacheFile);
    } catch (error) {
      // File doesn't exist, ignore
    }
  }

  /**
   * Check if profile data is cached and valid
   */
  async exists(linkedinId) {
    const data = await this.get(linkedinId);
    return data !== null;
  }

  /**
   * Clean up old cache entries to maintain max cache size
   */
  async cleanupCache() {
    try {
      const files = await fs.readdir(this.cacheDir);
      const cacheFiles = files.filter(f => f.endsWith('.json'));
      
      if (cacheFiles.length <= this.maxCacheSize) {
        return;
      }
      
      // Get file stats and sort by modification time
      const fileStats = await Promise.all(
        cacheFiles.map(async (file) => {
          const filePath = path.join(this.cacheDir, file);
          const stats = await fs.stat(filePath);
          return { file, mtime: stats.mtime, path: filePath };
        })
      );
      
      // Sort oldest first
      fileStats.sort((a, b) => a.mtime - b.mtime);
      
      // Delete oldest files to get under max size
      const filesToDelete = fileStats.slice(0, fileStats.length - this.maxCacheSize);
      
      for (const fileInfo of filesToDelete) {
        await fs.unlink(fileInfo.path);
      }
      
      console.log(`Cleaned up ${filesToDelete.length} old cache entries`);
      
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total) : 0;
    
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      saves: this.stats.saves,
      hitRate: Math.round(hitRate * 100) / 100,
      hitRatePercentage: Math.round(hitRate * 10000) / 100 + '%',
      totalCostSaved: Math.round(this.stats.totalCostSaved * 100) / 100,
      estimatedMonthlySavings: Math.round(this.stats.totalCostSaved * 30 * 100) / 100
    };
  }

  /**
   * Bulk cache operation for multiple profiles
   */
  async bulkGet(linkedinIds) {
    const results = {};
    
    for (const linkedinId of linkedinIds) {
      results[linkedinId] = await this.get(linkedinId);
    }
    
    return results;
  }

  /**
   * Get cache summary for monitoring
   */
  async getCacheSummary() {
    try {
      const files = await fs.readdir(this.cacheDir);
      const cacheFiles = files.filter(f => f.endsWith('.json'));
      
      let totalSize = 0;
      let oldestDate = Date.now();
      let newestDate = 0;
      
      for (const file of cacheFiles) {
        const filePath = path.join(this.cacheDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        oldestDate = Math.min(oldestDate, stats.mtime.getTime());
        newestDate = Math.max(newestDate, stats.mtime.getTime());
      }
      
      return {
        totalFiles: cacheFiles.length,
        totalSizeKB: Math.round(totalSize / 1024),
        oldestEntry: new Date(oldestDate).toISOString(),
        newestEntry: new Date(newestDate).toISOString(),
        utilizationPercentage: Math.round((cacheFiles.length / this.maxCacheSize) * 100),
        ...this.getStats()
      };
      
    } catch (error) {
      console.error('Failed to get cache summary:', error);
      return { error: error.message };
    }
  }

  /**
   * Priority-based caching for high-value prospects
   */
  async priorityCache(linkedinId, profileData, priority = 'normal') {
    const priorities = {
      'high': 7 * 24 * 60 * 60 * 1000,    // 7 days
      'normal': 24 * 60 * 60 * 1000,      // 24 hours  
      'low': 12 * 60 * 60 * 1000          // 12 hours
    };
    
    const ttl = priorities[priority] || this.defaultTTL;
    
    // Temporarily override TTL for this cache operation
    const originalTTL = this.defaultTTL;
    this.defaultTTL = ttl;
    
    await this.set(linkedinId, { ...profileData, priority, cached_with_ttl: ttl });
    
    this.defaultTTL = originalTTL;
  }

  /**
   * Export cache data for backup
   */
  async exportCache() {
    try {
      const files = await fs.readdir(this.cacheDir);
      const cacheFiles = files.filter(f => f.endsWith('.json'));
      const exportData = [];
      
      for (const file of cacheFiles) {
        const filePath = path.join(this.cacheDir, file);
        const data = await fs.readFile(filePath, 'utf8');
        exportData.push(JSON.parse(data));
      }
      
      const exportFile = path.join(this.cacheDir, `cache-export-${Date.now()}.json`);
      await fs.writeFile(exportFile, JSON.stringify(exportData, null, 2));
      
      return {
        exportFile,
        totalEntries: exportData.length,
        exportSize: exportData.length * 1024 // Rough estimate
      };
      
    } catch (error) {
      console.error('Failed to export cache:', error);
      throw error;
    }
  }
}

module.exports = LinkedInCacheSystem;