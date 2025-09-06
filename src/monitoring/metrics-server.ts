import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { ProfileCacheManager } from '../cache/profile-cache-manager';

interface EnrichmentMetric {
  timestamp: string;
  requestId: string;
  profileId: string;
  enrichmentSuccess: boolean;
  dataSource: 'bright_data' | 'apify' | 'cache' | 'manual';
  fallbackUsed: boolean;
  completenessScore: number;
  confidenceScore: number;
  qualityScore: number;
  dataPoints: number;
  missingFields: string[];
  processingTime: number;
  cacheHit: boolean;
  enrichmentCost: number;
  hasCurrentPosition: boolean;
  experienceCount: number;
  skillsCount: number;
  educationCount: number;
  hasCompanyIntel: boolean;
  hasActivity: boolean;
  errors: string[];
  warnings: string[];
}

interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
  metadata?: any;
}

class MetricsCollector {
  private metrics: EnrichmentMetric[] = [];
  private alerts: Alert[] = [];
  private aggregatedStats: any = {};
  private io: Server | null = null;
  private cacheManager: ProfileCacheManager | null = null;
  
  constructor() {
    this.initializeStats();
    this.startAggregation();
  }
  
  setSocketIO(io: Server) {
    this.io = io;
  }
  
  setCacheManager(cacheManager: ProfileCacheManager) {
    this.cacheManager = cacheManager;
  }
  
  private initializeStats() {
    this.aggregatedStats = {
      total: 0,
      successful: 0,
      failed: 0,
      partial: 0,
      cached: 0,
      totalCost: 0,
      avgResponseTime: 0,
      avgCompleteness: 0,
      avgConfidence: 0,
      avgQuality: 0,
      dataSources: {
        bright_data: 0,
        apify: 0,
        cache: 0,
        manual: 0
      },
      qualityBuckets: {
        '0-20': 0,
        '21-40': 0,
        '41-60': 0,
        '61-80': 0,
        '81-100': 0
      },
      hourlyStats: new Array(24).fill(null).map(() => ({
        hour: 0,
        successful: 0,
        failed: 0,
        total: 0
      }))
    };
  }
  
  addMetric(metric: EnrichmentMetric) {
    this.metrics.push(metric);
    
    // Keep only last 10000 metrics in memory
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000);
    }
    
    // Update aggregated stats
    this.updateAggregatedStats(metric);
    
    // Check for alert conditions
    this.checkAlertConditions(metric);
    
    // Emit real-time update via WebSocket
    if (this.io) {
      this.io.emit('metric:new', metric);
      this.io.emit('stats:update', this.getStats());
    }
  }
  
  private updateAggregatedStats(metric: EnrichmentMetric) {
    const stats = this.aggregatedStats;
    
    stats.total++;
    
    if (metric.enrichmentSuccess) {
      stats.successful++;
    } else {
      stats.failed++;
    }
    
    if (metric.completenessScore < 70 && metric.enrichmentSuccess) {
      stats.partial++;
    }
    
    if (metric.cacheHit) {
      stats.cached++;
    }
    
    stats.totalCost += metric.enrichmentCost;
    
    // Update averages
    const n = stats.total;
    stats.avgResponseTime = ((stats.avgResponseTime * (n - 1)) + metric.processingTime) / n;
    stats.avgCompleteness = ((stats.avgCompleteness * (n - 1)) + metric.completenessScore) / n;
    stats.avgConfidence = ((stats.avgConfidence * (n - 1)) + metric.confidenceScore) / n;
    stats.avgQuality = ((stats.avgQuality * (n - 1)) + metric.qualityScore) / n;
    
    // Update data source counts
    stats.dataSources[metric.dataSource]++;
    
    // Update quality buckets
    const qualityBucket = this.getQualityBucket(metric.qualityScore);
    stats.qualityBuckets[qualityBucket]++;
    
    // Update hourly stats
    const hour = new Date(metric.timestamp).getHours();
    stats.hourlyStats[hour].hour = hour;
    stats.hourlyStats[hour].total++;
    if (metric.enrichmentSuccess) {
      stats.hourlyStats[hour].successful++;
    } else {
      stats.hourlyStats[hour].failed++;
    }
  }
  
  private getQualityBucket(score: number): string {
    if (score <= 20) return '0-20';
    if (score <= 40) return '21-40';
    if (score <= 60) return '41-60';
    if (score <= 80) return '61-80';
    return '81-100';
  }
  
  private checkAlertConditions(metric: EnrichmentMetric) {
    // Check for critical alerts
    if (!metric.enrichmentSuccess && metric.errors.length > 0) {
      const errorRate = (this.aggregatedStats.failed / this.aggregatedStats.total) * 100;
      if (errorRate > 10) {
        this.createAlert('critical', `High error rate: ${errorRate.toFixed(1)}%`, {
          errorRate,
          recentErrors: metric.errors
        });
      }
    }
    
    // Check for performance alerts
    if (metric.processingTime > 5000) {
      this.createAlert('warning', `Slow enrichment: ${metric.processingTime}ms for ${metric.profileId}`, {
        processingTime: metric.processingTime,
        profileId: metric.profileId
      });
    }
    
    // Check for quality alerts
    if (metric.qualityScore < 30) {
      this.createAlert('warning', `Low quality enrichment for ${metric.profileId}`, {
        qualityScore: metric.qualityScore,
        missingFields: metric.missingFields
      });
    }
    
    // Check for cost alerts
    const hourlyRate = this.getHourlyRate();
    if (hourlyRate > 10) {
      this.createAlert('warning', `High API cost rate: $${hourlyRate.toFixed(2)}/hour`, {
        hourlyRate,
        totalCost: this.aggregatedStats.totalCost
      });
    }
    
    // Check cache performance
    const cacheHitRate = (this.aggregatedStats.cached / this.aggregatedStats.total) * 100;
    if (cacheHitRate < 50 && this.aggregatedStats.total > 100) {
      this.createAlert('info', `Low cache hit rate: ${cacheHitRate.toFixed(1)}%`, {
        cacheHitRate,
        totalRequests: this.aggregatedStats.total
      });
    }
  }
  
  private createAlert(level: Alert['level'], message: string, metadata?: any) {
    // Check if similar alert already exists
    const existingAlert = this.alerts.find(
      a => a.message === message && !a.resolved && 
      (Date.now() - new Date(a.timestamp).getTime()) < 3600000 // Within last hour
    );
    
    if (existingAlert) {
      return; // Don't create duplicate alerts
    }
    
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      timestamp: new Date().toISOString(),
      resolved: false,
      metadata
    };
    
    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    // Emit alert via WebSocket
    if (this.io) {
      this.io.emit('alert:new', alert);
    }
  }
  
  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      if (this.io) {
        this.io.emit('alert:resolved', alertId);
      }
    }
  }
  
  private getHourlyRate(): number {
    const oneHourAgo = Date.now() - 3600000;
    const recentMetrics = this.metrics.filter(
      m => new Date(m.timestamp).getTime() > oneHourAgo
    );
    
    return recentMetrics.reduce((sum, m) => sum + m.enrichmentCost, 0);
  }
  
  getStats() {
    const successRate = this.aggregatedStats.total > 0
      ? (this.aggregatedStats.successful / this.aggregatedStats.total) * 100
      : 0;
    
    const cacheHitRate = this.aggregatedStats.total > 0
      ? (this.aggregatedStats.cached / this.aggregatedStats.total) * 100
      : 0;
    
    return {
      successRate: successRate.toFixed(1),
      profilesEnriched: this.aggregatedStats.total,
      avgResponseTime: Math.round(this.aggregatedStats.avgResponseTime),
      cacheHitRate: cacheHitRate.toFixed(1),
      apiCost: this.aggregatedStats.totalCost.toFixed(2),
      qualityScore: Math.round(this.aggregatedStats.avgQuality),
      timeline: this.getTimelineData(),
      sourceDistribution: Object.values(this.aggregatedStats.dataSources),
      qualityDistribution: Object.values(this.aggregatedStats.qualityBuckets),
      statusCounts: {
        success: this.aggregatedStats.successful,
        partial: this.aggregatedStats.partial,
        failed: this.aggregatedStats.failed,
        cached: this.aggregatedStats.cached
      },
      alerts: this.alerts.filter(a => !a.resolved)
    };
  }
  
  private getTimelineData() {
    const now = new Date();
    const labels: string[] = [];
    const successful: number[] = [];
    const failed: number[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = (now.getHours() - i + 24) % 24;
      labels.push(`${hour}:00`);
      
      const hourData = this.aggregatedStats.hourlyStats[hour];
      successful.push(hourData.successful);
      failed.push(hourData.failed);
    }
    
    return { labels, successful, failed };
  }
  
  getMetricsByTimeRange(startTime: Date, endTime: Date): EnrichmentMetric[] {
    return this.metrics.filter(m => {
      const timestamp = new Date(m.timestamp);
      return timestamp >= startTime && timestamp <= endTime;
    });
  }
  
  async getCacheStats() {
    if (!this.cacheManager) {
      return null;
    }
    
    return await this.cacheManager.getStats();
  }
  
  private startAggregation() {
    // Reset hourly stats every hour
    setInterval(() => {
      const currentHour = new Date().getHours();
      this.aggregatedStats.hourlyStats[currentHour] = {
        hour: currentHour,
        successful: 0,
        failed: 0,
        total: 0
      };
    }, 3600000); // Every hour
    
    // Clean old metrics every 6 hours
    setInterval(() => {
      const sixHoursAgo = Date.now() - 21600000;
      this.metrics = this.metrics.filter(
        m => new Date(m.timestamp).getTime() > sixHoursAgo
      );
    }, 21600000); // Every 6 hours
  }
  
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify({
        metrics: this.metrics,
        aggregatedStats: this.aggregatedStats,
        alerts: this.alerts
      }, null, 2);
    }
    
    // CSV export
    const headers = [
      'timestamp', 'requestId', 'profileId', 'success', 'dataSource',
      'completenessScore', 'confidenceScore', 'qualityScore', 'processingTime',
      'cost', 'cacheHit'
    ].join(',');
    
    const rows = this.metrics.map(m => [
      m.timestamp,
      m.requestId,
      m.profileId,
      m.enrichmentSuccess,
      m.dataSource,
      m.completenessScore,
      m.confidenceScore,
      m.qualityScore,
      m.processingTime,
      m.enrichmentCost,
      m.cacheHit
    ].join(','));
    
    return [headers, ...rows].join('\n');
  }
}

// Express server setup
export function createMetricsServer(port: number = 3000) {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  const collector = new MetricsCollector();
  const cacheManager = new ProfileCacheManager();
  
  collector.setSocketIO(io);
  collector.setCacheManager(cacheManager);
  
  // Middleware
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../monitoring')));
  
  // API Routes
  app.post('/metrics/enrichment', (req, res) => {
    try {
      collector.addMetric(req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.get('/metrics/stats', async (req, res) => {
    const stats = collector.getStats();
    const cacheStats = await collector.getCacheStats();
    res.json({ ...stats, cache: cacheStats });
  });
  
  app.get('/metrics/export', (req, res) => {
    const format = req.query.format as 'json' | 'csv' || 'json';
    const data = collector.exportMetrics(format);
    
    res.setHeader('Content-Type', format === 'json' ? 'application/json' : 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=metrics.${format}`);
    res.send(data);
  });
  
  app.post('/metrics/alert/resolve', (req, res) => {
    const { alertId } = req.body;
    collector.resolveAlert(alertId);
    res.json({ success: true });
  });
  
  app.get('/metrics/range', (req, res) => {
    const { start, end } = req.query;
    const startTime = new Date(start as string);
    const endTime = new Date(end as string);
    
    const metrics = collector.getMetricsByTimeRange(startTime, endTime);
    res.json(metrics);
  });
  
  app.post('/metrics/errors', (req, res) => {
    // Log errors for monitoring
    console.error('Enrichment error:', req.body);
    res.json({ success: true });
  });
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  });
  
  // Serve dashboard
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../monitoring/dashboard.html'));
  });
  
  // WebSocket connections
  io.on('connection', (socket) => {
    console.log('Dashboard connected:', socket.id);
    
    // Send current stats on connection
    socket.emit('stats:initial', collector.getStats());
    
    socket.on('disconnect', () => {
      console.log('Dashboard disconnected:', socket.id);
    });
  });
  
  // Start server
  server.listen(port, () => {
    console.log(`Metrics server running on http://localhost:${port}`);
    console.log(`Dashboard available at http://localhost:${port}/`);
  });
  
  return { app, server, io, collector, cacheManager };
}

// Start server if run directly
if (require.main === module) {
  createMetricsServer(process.env.PORT ? parseInt(process.env.PORT) : 3000);
}