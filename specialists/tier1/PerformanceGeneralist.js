const BaseSpecialist = require('../BaseSpecialist');

/**
 * Performance Generalist - Tier 1 Specialist
 * Domain: Optimization, caching, scaling, monitoring
 */
class PerformanceGeneralist extends BaseSpecialist {
  constructor() {
    super({
      id: 'performance-generalist',
      name: 'Performance Generalist',
      domain: 'performance',
      tier: 'TIER_1',
      expertise: [
        'performance optimization',
        'caching strategies',
        'basic profiling',
        'monitoring setup',
        'query optimization',
        'resource management',
        'load testing',
        'bottleneck identification'
      ],
      handoffCriteria: [
        {
          condition: 'complex-performance-analysis',
          reason: 'Complex performance bottlenecks require deep analysis expertise',
          targetTier: 'TIER_2',
          targetSpecialist: 'performance-optimization-specialist'
        },
        {
          condition: 'system-wide-optimization',
          reason: 'System-wide performance architecture requires scaling expertise',
          targetTier: 'TIER_3',
          targetSpecialist: 'scale-architect'
        }
      ]
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      performanceScope: this.assessPerformanceScope(task),
      bottleneckTypes: this.identifyBottleneckTypes(task),
      scalingNeeds: this.analyzeScalingNeeds(task, context),
      monitoringRequirements: this.assessMonitoringRequirements(task),
      cacheOpportunities: this.identifyCacheOpportunities(task),
      resourceConstraints: this.analyzeResourceConstraints(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      optimizationStrategy: this.recommendOptimizationStrategy(analysis, task),
      cachingStrategy: this.recommendCachingStrategy(analysis, task),
      monitoringSetup: this.recommendMonitoringSetup(analysis, task),
      scalingApproach: this.recommendScalingApproach(analysis, task),
      performanceTesting: this.recommendPerformanceTesting(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  assessPerformanceScope(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scopeAreas = {
      frontend: ['ui', 'render', 'dom', 'browser', 'client', 'javascript', 'css'],
      backend: ['server', 'api', 'service', 'backend', 'processing'],
      database: ['query', 'database', 'sql', 'index', 'table'],
      network: ['network', 'bandwidth', 'latency', 'request', 'response'],
      memory: ['memory', 'ram', 'leak', 'allocation', 'garbage'],
      cpu: ['cpu', 'processing', 'computation', 'algorithm'],
      storage: ['disk', 'io', 'file', 'storage', 'read', 'write']
    };
    
    const detectedAreas = [];
    Object.entries(scopeAreas).forEach(([area, keywords]) => {
      const relevance = keywords.filter(keyword => taskText.includes(keyword)).length;
      if (relevance > 0) {
        detectedAreas.push({
          area,
          relevance,
          priority: this.getAreaPriority(area, taskText),
          impact: this.getAreaImpact(area)
        });
      }
    });
    
    return detectedAreas.sort((a, b) => b.priority - a.priority);
  }
  
  identifyBottleneckTypes(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const bottleneckPatterns = {
      'slow-queries': ['slow query', 'database slow', 'query time', 'sql performance'],
      'memory-leaks': ['memory leak', 'memory usage', 'out of memory', 'heap'],
      'cpu-intensive': ['cpu', 'high processing', 'computation', 'algorithm slow'],
      'io-bottleneck': ['file io', 'disk', 'read write', 'storage slow'],
      'network-latency': ['network slow', 'latency', 'request time', 'api slow'],
      'rendering-issues': ['render slow', 'ui lag', 'paint', 'layout'],
      'concurrency-issues': ['lock', 'deadlock', 'thread', 'concurrent', 'race']
    };
    
    const identifiedBottlenecks = [];
    Object.entries(bottleneckPatterns).forEach(([type, patterns]) => {
      if (patterns.some(pattern => taskText.includes(pattern))) {
        identifiedBottlenecks.push({
          type,
          severity: this.getBottleneckSeverity(type, taskText),
          likelihood: this.getBottleneckLikelihood(type, taskText),
          impact: this.getBottleneckImpact(type)
        });
      }
    });
    
    return identifiedBottlenecks.sort((a, b) => b.severity - a.severity);
  }
  
  analyzeScalingNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalingIndicators = [
      'scale', 'load', 'concurrent users', 'high traffic',
      'performance under load', 'capacity', 'throughput'
    ];
    
    const needsScaling = scalingIndicators.some(indicator => taskText.includes(indicator));
    
    if (!needsScaling) {
      return { required: false };
    }
    
    return {
      required: true,
      type: this.determineScalingType(taskText),
      currentLoad: this.estimateCurrentLoad(context),
      targetLoad: this.estimateTargetLoad(taskText, context),
      constraints: this.identifyScalingConstraints(context)
    };
  }
  
  assessMonitoringRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const monitoringTypes = {
      performance: ['monitor performance', 'metrics', 'response time', 'throughput'],
      resource: ['cpu usage', 'memory usage', 'disk usage', 'resource monitor'],
      application: ['application metrics', 'business metrics', 'user metrics'],
      error: ['error rate', 'exception', 'failure', 'error monitoring'],
      availability: ['uptime', 'availability', 'health check']
    };
    
    const requiredMonitoring = [];
    Object.entries(monitoringTypes).forEach(([type, indicators]) => {
      if (indicators.some(indicator => taskText.includes(indicator))) {
        requiredMonitoring.push({
          type,
          priority: this.getMonitoringPriority(type),
          metrics: this.getTypeMetrics(type),
          frequency: this.getMonitoringFrequency(type)
        });
      }
    });
    
    return {
      required: requiredMonitoring.length > 0 || taskText.includes('monitor'),
      types: requiredMonitoring,
      tools: this.recommendMonitoringTools(requiredMonitoring)
    };
  }
  
  identifyCacheOpportunities(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const cachePatterns = {
      'database-cache': ['query', 'database', 'frequent read', 'data access'],
      'api-cache': ['api response', 'external call', 'third party', 'service call'],
      'browser-cache': ['static', 'asset', 'image', 'css', 'js'],
      'memory-cache': ['lookup', 'computation', 'expensive operation'],
      'session-cache': ['user data', 'session', 'temporary', 'state']
    };
    
    const opportunities = [];
    Object.entries(cachePatterns).forEach(([cacheType, patterns]) => {
      if (patterns.some(pattern => taskText.includes(pattern))) {
        opportunities.push({
          type: cacheType,
          benefit: this.getCacheBenefit(cacheType),
          complexity: this.getCacheComplexity(cacheType),
          strategy: this.getCacheStrategy(cacheType)
        });
      }
    });
    
    return opportunities.sort((a, b) => b.benefit - a.benefit);
  }
  
  analyzeResourceConstraints(task, context) {
    return {
      memory: context.memoryLimit || 'unknown',
      cpu: context.cpuLimit || 'unknown',
      bandwidth: context.bandwidthLimit || 'unknown',
      storage: context.storageLimit || 'unknown',
      budget: context.budgetConstraints || 'unknown'
    };
  }
  
  recommendOptimizationStrategy(analysis, task) {
    const { performanceScope, bottleneckTypes } = analysis;
    
    if (bottleneckTypes.length === 0) {
      return {
        strategy: 'preventive-optimization',
        rationale: 'No specific bottlenecks identified, focus on best practices',
        approach: 'general-optimization',
        priorities: ['code-optimization', 'caching', 'monitoring']
      };
    }
    
    const primaryBottleneck = bottleneckTypes[0];
    
    return {
      strategy: 'targeted-optimization',
      rationale: `Primary bottleneck identified: ${primaryBottleneck.type}`,
      approach: this.getOptimizationApproach(primaryBottleneck.type),
      priorities: this.getOptimizationPriorities(bottleneckTypes),
      techniques: this.getOptimizationTechniques(primaryBottleneck.type)
    };
  }
  
  recommendCachingStrategy(analysis, task) {
    const { cacheOpportunities } = analysis;
    
    if (cacheOpportunities.length === 0) {
      return {
        strategy: 'basic-caching',
        rationale: 'No specific cache opportunities identified',
        implementation: 'standard-http-caching'
      };
    }
    
    const topOpportunity = cacheOpportunities[0];
    
    return {
      strategy: 'strategic-caching',
      rationale: `Primary cache opportunity: ${topOpportunity.type}`,
      implementation: topOpportunity.strategy,
      layers: this.getCacheLayers(cacheOpportunities),
      invalidation: this.getCacheInvalidationStrategy(topOpportunity.type),
      monitoring: this.getCacheMonitoring(topOpportunity.type)
    };
  }
  
  recommendMonitoringSetup(analysis, task) {
    const { monitoringRequirements, performanceScope } = analysis;
    
    if (!monitoringRequirements.required) {
      return {
        setup: 'basic-monitoring',
        rationale: 'Basic monitoring for general performance awareness'
      };
    }
    
    return {
      setup: 'comprehensive-monitoring',
      rationale: 'Specific monitoring requirements identified',
      metrics: this.getRecommendedMetrics(monitoringRequirements.types),
      dashboards: this.getRecommendedDashboards(performanceScope),
      alerts: this.getRecommendedAlerts(monitoringRequirements.types),
      tools: monitoringRequirements.tools
    };
  }
  
  recommendScalingApproach(analysis, task) {
    const { scalingNeeds } = analysis;
    
    if (!scalingNeeds.required) {
      return {
        approach: 'no-scaling-needed',
        rationale: 'Current requirements do not indicate scaling needs'
      };
    }
    
    return {
      approach: scalingNeeds.type,
      rationale: `Scaling required for ${scalingNeeds.targetLoad} load`,
      implementation: this.getScalingImplementation(scalingNeeds.type),
      phases: this.getScalingPhases(scalingNeeds),
      monitoring: this.getScalingMonitoring()
    };
  }
  
  recommendPerformanceTesting(analysis, task) {
    const { scalingNeeds, bottleneckTypes, performanceScope } = analysis;
    
    const testTypes = ['load-testing'];
    
    if (scalingNeeds.required) {
      testTypes.push('stress-testing', 'capacity-testing');
    }
    
    if (bottleneckTypes.length > 0) {
      testTypes.push('bottleneck-testing');
    }
    
    if (performanceScope.some(scope => scope.area === 'frontend')) {
      testTypes.push('browser-performance-testing');
    }
    
    return {
      testTypes,
      tools: this.getPerformanceTestingTools(testTypes),
      scenarios: this.getTestScenarios(analysis),
      metrics: this.getTestMetrics(performanceScope)
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { bottleneckTypes, scalingNeeds, cacheOpportunities } = analysis;
    
    const steps = [
      'Performance baseline measurement',
      'Bottleneck identification',
      'Optimization implementation',
      'Performance testing',
      'Monitoring setup',
      'Performance validation'
    ];
    
    if (cacheOpportunities.length > 0) {
      steps.splice(3, 0, 'Caching implementation');
    }
    
    if (scalingNeeds.required) {
      steps.splice(4, 0, 'Scaling implementation');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredPerformanceResources(analysis),
      timeline: this.calculatePerformanceTimeline(steps.length)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = ['performance-testing', 'load-testing'];
    
    if (analysis.scalingNeeds.required) {
      baseChecks.push('stress-testing');
    }
    
    if (analysis.bottleneckTypes.length > 0) {
      baseChecks.push('bottleneck-analysis');
    }
    
    if (analysis.cacheOpportunities.length > 0) {
      baseChecks.push('cache-effectiveness-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { bottleneckTypes, scalingNeeds, cacheOpportunities } = analysis;
    
    let baseDays = 2; // Base performance work
    
    if (bottleneckTypes.length > 2) baseDays += 2;
    if (scalingNeeds.required) baseDays += 3;
    if (cacheOpportunities.length > 1) baseDays += 1;
    
    return {
      estimate: `${baseDays}-${baseDays + 2} days`,
      confidence: 0.7,
      factors: [
        `Bottlenecks identified: ${bottleneckTypes.length}`,
        `Scaling required: ${scalingNeeds.required}`,
        `Cache opportunities: ${cacheOpportunities.length}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'complex-performance-analysis':
        return analysis.bottleneckTypes.length > 3 ||
               analysis.bottleneckTypes.some(b => b.severity > 7);
      
      case 'system-wide-optimization':
        return analysis.scalingNeeds.required &&
               analysis.performanceScope.length > 4;
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 6;
  }
  
  // Helper methods
  getAreaPriority(area, taskText) {
    const priorities = {
      database: 9,
      backend: 8,
      memory: 8,
      cpu: 7,
      frontend: 6,
      network: 6,
      storage: 5
    };
    return priorities[area] || 5;
  }
  
  getAreaImpact(area) {
    const impacts = {
      database: 'high',
      backend: 'high',
      memory: 'high',
      cpu: 'medium',
      frontend: 'medium',
      network: 'medium',
      storage: 'low'
    };
    return impacts[area] || 'low';
  }
  
  getBottleneckSeverity(type, taskText) {
    const severities = {
      'slow-queries': 9,
      'memory-leaks': 8,
      'cpu-intensive': 7,
      'io-bottleneck': 6,
      'network-latency': 6,
      'rendering-issues': 5,
      'concurrency-issues': 8
    };
    return severities[type] || 5;
  }
  
  getBottleneckLikelihood(type, taskText) {
    // Simple likelihood assessment based on task description
    return taskText.includes('slow') ? 'high' : 'medium';
  }
  
  getBottleneckImpact(type) {
    const impacts = {
      'slow-queries': 'high',
      'memory-leaks': 'high',
      'cpu-intensive': 'medium',
      'io-bottleneck': 'medium',
      'network-latency': 'medium',
      'rendering-issues': 'low',
      'concurrency-issues': 'high'
    };
    return impacts[type] || 'medium';
  }
  
  determineScalingType(taskText) {
    if (taskText.includes('horizontal') || taskText.includes('distributed')) {
      return 'horizontal';
    }
    if (taskText.includes('vertical') || taskText.includes('upgrade')) {
      return 'vertical';
    }
    return 'horizontal'; // Default
  }
  
  estimateCurrentLoad(context) {
    return context.currentUsers || 'unknown';
  }
  
  estimateTargetLoad(taskText, context) {
    // Extract load estimates from task description
    const numbers = taskText.match(/\d+/g);
    return numbers ? `${numbers[0]} users` : 'unknown';
  }
  
  identifyScalingConstraints(context) {
    return context.scalingConstraints || ['budget', 'infrastructure'];
  }
  
  getMonitoringPriority(type) {
    const priorities = {
      performance: 9,
      error: 8,
      resource: 7,
      availability: 8,
      application: 6
    };
    return priorities[type] || 5;
  }
  
  getTypeMetrics(type) {
    const metrics = {
      performance: ['response_time', 'throughput', 'latency'],
      resource: ['cpu_usage', 'memory_usage', 'disk_usage'],
      application: ['user_count', 'transaction_count', 'business_metrics'],
      error: ['error_rate', 'exception_count', 'failure_rate'],
      availability: ['uptime', 'health_status', 'service_availability']
    };
    return metrics[type] || [];
  }
  
  getMonitoringFrequency(type) {
    const frequencies = {
      performance: '1m',
      resource: '30s',
      application: '5m',
      error: '1m',
      availability: '30s'
    };
    return frequencies[type] || '5m';
  }
  
  recommendMonitoringTools(monitoringTypes) {
    const tools = ['Prometheus', 'Grafana'];
    if (monitoringTypes.some(t => t.type === 'application')) {
      tools.push('New Relic', 'DataDog');
    }
    return tools;
  }
  
  getCacheBenefit(cacheType) {
    const benefits = {
      'database-cache': 8,
      'api-cache': 7,
      'browser-cache': 9,
      'memory-cache': 6,
      'session-cache': 5
    };
    return benefits[cacheType] || 5;
  }
  
  getCacheComplexity(cacheType) {
    const complexities = {
      'database-cache': 6,
      'api-cache': 4,
      'browser-cache': 2,
      'memory-cache': 3,
      'session-cache': 4
    };
    return complexities[cacheType] || 3;
  }
  
  getCacheStrategy(cacheType) {
    const strategies = {
      'database-cache': 'redis-cache',
      'api-cache': 'http-cache',
      'browser-cache': 'browser-cache',
      'memory-cache': 'in-memory-cache',
      'session-cache': 'session-store'
    };
    return strategies[cacheType] || 'standard-cache';
  }
  
  getOptimizationApproach(bottleneckType) {
    const approaches = {
      'slow-queries': 'query-optimization',
      'memory-leaks': 'memory-management',
      'cpu-intensive': 'algorithm-optimization',
      'io-bottleneck': 'io-optimization',
      'network-latency': 'network-optimization',
      'rendering-issues': 'ui-optimization',
      'concurrency-issues': 'concurrency-optimization'
    };
    return approaches[bottleneckType] || 'general-optimization';
  }
  
  getOptimizationPriorities(bottleneckTypes) {
    return bottleneckTypes.slice(0, 3).map(b => b.type);
  }
  
  getOptimizationTechniques(bottleneckType) {
    const techniques = {
      'slow-queries': ['indexing', 'query-rewriting', 'denormalization'],
      'memory-leaks': ['garbage-collection', 'object-pooling', 'memory-profiling'],
      'cpu-intensive': ['algorithm-improvement', 'caching', 'parallel-processing'],
      'io-bottleneck': ['async-io', 'buffering', 'connection-pooling'],
      'network-latency': ['caching', 'compression', 'cdn'],
      'rendering-issues': ['virtual-dom', 'lazy-loading', 'code-splitting'],
      'concurrency-issues': ['lock-free-algorithms', 'async-patterns', 'thread-pools']
    };
    return techniques[bottleneckType] || ['general-optimization'];
  }
  
  getCacheLayers(opportunities) {
    return opportunities.map(opp => opp.type);
  }
  
  getCacheInvalidationStrategy(cacheType) {
    const strategies = {
      'database-cache': 'time-based-ttl',
      'api-cache': 'etag-based',
      'browser-cache': 'versioning',
      'memory-cache': 'lru-eviction',
      'session-cache': 'session-expiry'
    };
    return strategies[cacheType] || 'time-based';
  }
  
  getCacheMonitoring(cacheType) {
    return ['hit-rate', 'miss-rate', 'eviction-rate'];
  }
  
  getRecommendedMetrics(monitoringTypes) {
    const allMetrics = new Set();
    monitoringTypes.forEach(type => {
      this.getTypeMetrics(type.type).forEach(metric => allMetrics.add(metric));
    });
    return Array.from(allMetrics);
  }
  
  getRecommendedDashboards(performanceScope) {
    return ['System Overview', 'Performance Metrics', 'Error Tracking'];
  }
  
  getRecommendedAlerts(monitoringTypes) {
    return ['High Response Time', 'Error Rate Spike', 'Resource Exhaustion'];
  }
  
  getScalingImplementation(scalingType) {
    if (scalingType === 'horizontal') {
      return 'load-balancer-with-multiple-instances';
    }
    return 'resource-upgrade';
  }
  
  getScalingPhases(scalingNeeds) {
    return ['baseline-measurement', 'initial-scaling', 'load-testing', 'final-scaling'];
  }
  
  getScalingMonitoring() {
    return ['instance-count', 'load-distribution', 'response-times'];
  }
  
  getPerformanceTestingTools(testTypes) {
    const tools = ['JMeter', 'k6'];
    if (testTypes.includes('browser-performance-testing')) {
      tools.push('Lighthouse', 'WebPageTest');
    }
    return tools;
  }
  
  getTestScenarios(analysis) {
    const scenarios = ['normal-load'];
    if (analysis.scalingNeeds.required) {
      scenarios.push('peak-load', 'stress-test');
    }
    return scenarios;
  }
  
  getTestMetrics(performanceScope) {
    return ['response-time', 'throughput', 'error-rate', 'resource-usage'];
  }
  
  getRequiredPerformanceResources(analysis) {
    const resources = ['Performance testing tools', 'Monitoring setup'];
    if (analysis.scalingNeeds.required) {
      resources.push('Load testing environment', 'Scaling infrastructure');
    }
    return resources;
  }
  
  calculatePerformanceTimeline(stepCount) {
    return {
      planning: '1 day',
      implementation: `${Math.ceil(stepCount * 0.6)} days`,
      testing: '2 days',
      optimization: '1 day'
    };
  }
}

module.exports = PerformanceGeneralist;