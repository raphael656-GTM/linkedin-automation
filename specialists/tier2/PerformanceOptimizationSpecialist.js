const BaseSpecialist = require('../BaseSpecialist');

/**
 * Performance Optimization Specialist - Tier 2 Specialist
 * Domain: Profiling, memory optimization, CPU optimization, caching
 * Prerequisites: Requires Performance Generalist consultation
 */
class PerformanceOptimizationSpecialist extends BaseSpecialist {
  constructor() {
    super({
      id: 'performance-optimization-specialist',
      name: 'Performance Optimization Specialist',
      domain: 'performance-optimization',
      tier: 'TIER_2',
      prerequisites: ['performance-generalist-consultation'],
      expertise: [
        'performance profiling',
        'memory optimization',
        'CPU optimization',
        'database query optimization',
        'caching strategies',
        'load balancing',
        'code optimization',
        'resource optimization',
        'bottleneck identification',
        'performance monitoring'
      ],
      handoffCriteria: [
        {
          condition: 'distributed-system-optimization',
          reason: 'Distributed system performance requires scale architect involvement',
          targetTier: 'TIER_3',
          targetSpecialist: 'scale-architect'
        },
        {
          condition: 'enterprise-performance-architecture',
          reason: 'Enterprise-wide performance architecture requires system architect oversight',
          targetTier: 'TIER_3',
          targetSpecialist: 'system-architect'
        }
      ]
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      performanceBottlenecks: this.identifyPerformanceBottlenecks(task, context),
      systemLoad: this.analyzeSystemLoad(task, context),
      resourceUtilization: this.analyzeResourceUtilization(task, context),
      optimizationOpportunities: this.identifyOptimizationOpportunities(task, context),
      cachingNeeds: this.analyzeCachingNeeds(task, context),
      scalingRequirements: this.analyzeScalingRequirements(task, context),
      monitoringNeeds: this.analyzeMonitoringNeeds(task, context),
      performanceTargets: this.definePerformanceTargets(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      optimizationStrategy: this.recommendOptimizationStrategy(analysis, task),
      bottleneckSolutions: this.recommendBottleneckSolutions(analysis, task),
      cachingStrategy: this.recommendCachingStrategy(analysis, task),
      resourceOptimization: this.recommendResourceOptimization(analysis, task),
      databaseOptimization: this.recommendDatabaseOptimization(analysis, task),
      codeOptimization: this.recommendCodeOptimization(analysis, task),
      infrastructureOptimization: this.recommendInfrastructureOptimization(analysis, task),
      monitoringStrategy: this.recommendMonitoringStrategy(analysis, task),
      testingStrategy: this.recommendPerformanceTestingStrategy(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  identifyPerformanceBottlenecks(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const bottleneckTypes = {
      'cpu-bottleneck': {
        indicators: ['cpu', 'processing', 'computation', 'algorithm', 'slow execution'],
        impact: 'high',
        solutions: ['algorithm-optimization', 'parallel-processing', 'cpu-scaling']
      },
      'memory-bottleneck': {
        indicators: ['memory', 'ram', 'out of memory', 'gc', 'heap'],
        impact: 'high',
        solutions: ['memory-optimization', 'gc-tuning', 'memory-scaling']
      },
      'io-bottleneck': {
        indicators: ['disk', 'file', 'read', 'write', 'storage', 'io'],
        impact: 'high',
        solutions: ['io-optimization', 'ssd-upgrade', 'async-io']
      },
      'network-bottleneck': {
        indicators: ['network', 'latency', 'bandwidth', 'connection', 'timeout'],
        impact: 'medium',
        solutions: ['network-optimization', 'compression', 'connection-pooling']
      },
      'database-bottleneck': {
        indicators: ['database', 'query', 'sql', 'index', 'slow query'],
        impact: 'high',
        solutions: ['query-optimization', 'indexing', 'database-scaling']
      },
      'cache-miss': {
        indicators: ['cache miss', 'cache', 'repeated calculations', 'duplicate requests'],
        impact: 'medium',
        solutions: ['caching-strategy', 'cache-optimization', 'precomputation']
      },
      'concurrency-bottleneck': {
        indicators: ['concurrency', 'lock', 'thread', 'deadlock', 'contention'],
        impact: 'high',
        solutions: ['lock-optimization', 'async-processing', 'concurrency-patterns']
      },
      'serialization-bottleneck': {
        indicators: ['serialization', 'json', 'xml', 'parsing', 'conversion'],
        impact: 'medium',
        solutions: ['serialization-optimization', 'binary-protocols', 'streaming']
      }
    };
    
    const identifiedBottlenecks = [];
    Object.entries(bottleneckTypes).forEach(([type, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        identifiedBottlenecks.push({
          type,
          impact: config.impact,
          solutions: config.solutions,
          priority: this.calculateBottleneckPriority(type, config.impact),
          evidence: config.indicators.filter(indicator => taskText.includes(indicator))
        });
      }
    });
    
    return identifiedBottlenecks.sort((a, b) => b.priority - a.priority);
  }
  
  analyzeSystemLoad(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const loadIndicators = {
      'high-load': {
        patterns: ['high load', 'heavy traffic', 'thousands', 'millions', 'concurrent users'],
        level: 'high',
        characteristics: ['peak-traffic-handling', 'resource-contention', 'scaling-needs']
      },
      'variable-load': {
        patterns: ['variable load', 'peak hours', 'seasonal', 'burst', 'spike'],
        level: 'variable',
        characteristics: ['load-balancing-needs', 'auto-scaling', 'resource-elasticity']
      },
      'steady-load': {
        patterns: ['steady', 'consistent', 'predictable', 'regular'],
        level: 'steady',
        characteristics: ['consistent-optimization', 'baseline-performance', 'resource-planning']
      }
    };
    
    let loadType = 'steady'; // Default
    let characteristics = loadIndicators.steady.characteristics;
    
    Object.entries(loadIndicators).forEach(([type, config]) => {
      if (config.patterns.some(pattern => taskText.includes(pattern))) {
        loadType = type;
        characteristics = config.characteristics;
      }
    });
    
    return {
      type: loadType,
      level: loadIndicators[loadType].level,
      characteristics,
      estimatedLoad: this.estimateLoad(taskText, context),
      peakFactors: this.identifyPeakFactors(taskText),
      loadProfile: this.getLoadProfile(loadType)
    };
  }
  
  analyzeResourceUtilization(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const utilization = {
      cpu: this.analyzeCpuUtilization(taskText, context),
      memory: this.analyzeMemoryUtilization(taskText, context),
      storage: this.analyzeStorageUtilization(taskText, context),
      network: this.analyzeNetworkUtilization(taskText, context),
      database: this.analyzeDatabaseUtilization(taskText, context)
    };
    
    return {
      ...utilization,
      overallUtilization: this.calculateOverallUtilization(utilization),
      resourceConstraints: this.identifyResourceConstraints(utilization),
      optimizationPotential: this.assessOptimizationPotential(utilization)
    };
  }
  
  identifyOptimizationOpportunities(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const opportunities = [];
    
    // Algorithm optimization
    if (taskText.includes('algorithm') || taskText.includes('computation') || taskText.includes('processing')) {
      opportunities.push({
        type: 'algorithm-optimization',
        potential: 'high',
        techniques: ['algorithm-improvement', 'data-structure-optimization', 'complexity-reduction'],
        estimatedGain: '50-90%'
      });
    }
    
    // Caching opportunities
    if (taskText.includes('repeated') || taskText.includes('duplicate') || taskText.includes('calculation')) {
      opportunities.push({
        type: 'caching-optimization',
        potential: 'high',
        techniques: ['result-caching', 'computation-memoization', 'data-caching'],
        estimatedGain: '60-95%'
      });
    }
    
    // Database optimization
    if (taskText.includes('database') || taskText.includes('query') || taskText.includes('sql')) {
      opportunities.push({
        type: 'database-optimization',
        potential: 'high',
        techniques: ['query-optimization', 'index-tuning', 'connection-pooling'],
        estimatedGain: '40-80%'
      });
    }
    
    // Async processing
    if (taskText.includes('blocking') || taskText.includes('wait') || taskText.includes('synchronous')) {
      opportunities.push({
        type: 'async-optimization',
        potential: 'medium',
        techniques: ['async-processing', 'non-blocking-io', 'event-driven-architecture'],
        estimatedGain: '30-70%'
      });
    }
    
    // Resource pooling
    if (taskText.includes('connection') || taskText.includes('resource') || taskText.includes('creation')) {
      opportunities.push({
        type: 'resource-pooling',
        potential: 'medium',
        techniques: ['connection-pooling', 'object-pooling', 'resource-reuse'],
        estimatedGain: '25-60%'
      });
    }
    
    // Compression
    if (taskText.includes('data transfer') || taskText.includes('bandwidth') || taskText.includes('payload')) {
      opportunities.push({
        type: 'compression-optimization',
        potential: 'medium',
        techniques: ['data-compression', 'response-compression', 'asset-optimization'],
        estimatedGain: '20-50%'
      });
    }
    
    return opportunities.sort((a, b) => 
      (b.potential === 'high' ? 3 : b.potential === 'medium' ? 2 : 1) -
      (a.potential === 'high' ? 3 : a.potential === 'medium' ? 2 : 1)
    );
  }
  
  analyzeCachingNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const cachingIndicators = [
      'repeated', 'cache', 'frequent access', 'duplicate',
      'expensive calculation', 'slow query', 'static data'
    ];
    
    const needsCaching = cachingIndicators.some(indicator => 
      taskText.includes(indicator)
    );
    
    if (!needsCaching) {
      return { required: false, strategy: 'no-caching' };
    }
    
    const cachingLevels = [];
    
    // Application-level caching
    if (taskText.includes('calculation') || taskText.includes('computation')) {
      cachingLevels.push({
        level: 'application',
        type: 'in-memory-caching',
        scope: 'computed-results',
        ttl: 'variable-based-on-data-volatility'
      });
    }
    
    // Database result caching
    if (taskText.includes('database') || taskText.includes('query')) {
      cachingLevels.push({
        level: 'database',
        type: 'query-result-caching',
        scope: 'database-queries',
        ttl: 'based-on-data-update-frequency'
      });
    }
    
    // HTTP response caching
    if (taskText.includes('api') || taskText.includes('response') || taskText.includes('endpoint')) {
      cachingLevels.push({
        level: 'http',
        type: 'response-caching',
        scope: 'api-responses',
        ttl: 'content-based-expiration'
      });
    }
    
    // CDN caching
    if (taskText.includes('static') || taskText.includes('asset') || taskText.includes('image')) {
      cachingLevels.push({
        level: 'cdn',
        type: 'edge-caching',
        scope: 'static-assets',
        ttl: 'long-term-caching'
      });
    }
    
    return {
      required: true,
      strategy: 'multi-level-caching',
      levels: cachingLevels,
      invalidationStrategy: this.getCacheInvalidationStrategy(cachingLevels),
      consistencyRequirements: this.getCacheConsistencyRequirements(taskText)
    };
  }
  
  analyzeScalingRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalingIndicators = [
      'scale', 'scaling', 'load', 'traffic', 'users',
      'concurrent', 'throughput', 'performance'
    ];
    
    const needsScaling = scalingIndicators.some(indicator => 
      taskText.includes(indicator)
    );
    
    if (!needsScaling) {
      return { required: false, approach: 'single-instance' };
    }
    
    const scalingType = this.determineScalingType(taskText);
    const scalingApproach = this.getScalingApproach(scalingType, taskText);
    
    return {
      required: true,
      type: scalingType,
      approach: scalingApproach,
      triggers: this.getScalingTriggers(taskText),
      constraints: this.getScalingConstraints(context),
      timeline: this.getScalingTimeline(taskText)
    };
  }
  
  analyzeMonitoringNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const monitoringTypes = {
      'performance-monitoring': {
        indicators: ['performance', 'response time', 'latency', 'throughput'],
        metrics: ['response-times', 'throughput', 'error-rates', 'resource-utilization']
      },
      'resource-monitoring': {
        indicators: ['cpu', 'memory', 'disk', 'network'],
        metrics: ['cpu-usage', 'memory-usage', 'disk-io', 'network-io']
      },
      'application-monitoring': {
        indicators: ['application', 'code', 'function', 'method'],
        metrics: ['function-execution-times', 'code-coverage', 'error-tracking', 'user-experience']
      },
      'infrastructure-monitoring': {
        indicators: ['server', 'infrastructure', 'cluster', 'node'],
        metrics: ['server-health', 'cluster-status', 'node-availability', 'service-discovery']
      }
    };
    
    const requiredMonitoring = [];
    Object.entries(monitoringTypes).forEach(([type, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        requiredMonitoring.push({
          type,
          metrics: config.metrics,
          priority: this.getMonitoringPriority(type)
        });
      }
    });
    
    return {
      types: requiredMonitoring.length > 0 ? requiredMonitoring : [{
        type: 'basic-monitoring',
        metrics: ['response-times', 'error-rates'],
        priority: 'medium'
      }],
      alerting: this.getAlertingRequirements(requiredMonitoring),
      dashboards: this.getDashboardRequirements(requiredMonitoring),
      retention: this.getMetricsRetention(context)
    };
  }
  
  definePerformanceTargets(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    // Extract explicit performance targets
    const targets = {
      responseTime: this.extractResponseTimeTarget(taskText),
      throughput: this.extractThroughputTarget(taskText),
      availability: this.extractAvailabilityTarget(taskText),
      errorRate: this.extractErrorRateTarget(taskText)
    };
    
    // Set defaults based on application type
    const applicationType = this.determineApplicationType(taskText);
    const defaultTargets = this.getDefaultTargets(applicationType);
    
    return {
      ...defaultTargets,
      ...Object.fromEntries(Object.entries(targets).filter(([_, v]) => v !== null)),
      applicationType,
      businessImpact: this.assessBusinessImpact(taskText, context),
      sla: this.getSlaRequirements(targets, defaultTargets)
    };
  }
  
  recommendOptimizationStrategy(analysis, task) {
    const { performanceBottlenecks, optimizationOpportunities, performanceTargets } = analysis;
    
    const strategy = {
      approach: 'data-driven-optimization',
      phases: []
    };
    
    // Phase 1: Critical bottleneck resolution
    if (performanceBottlenecks.filter(b => b.impact === 'high').length > 0) {
      strategy.phases.push({
        phase: 'critical-bottleneck-resolution',
        priority: 'immediate',
        bottlenecks: performanceBottlenecks.filter(b => b.impact === 'high'),
        expectedGain: '40-80% performance improvement',
        duration: '1-2 weeks'
      });
    }
    
    // Phase 2: High-impact optimizations
    const highImpactOpportunities = optimizationOpportunities.filter(o => o.potential === 'high');
    if (highImpactOpportunities.length > 0) {
      strategy.phases.push({
        phase: 'high-impact-optimizations',
        priority: 'high',
        optimizations: highImpactOpportunities,
        expectedGain: '30-60% performance improvement',
        duration: '2-3 weeks'
      });
    }
    
    // Phase 3: Medium-impact optimizations
    const mediumImpactOpportunities = optimizationOpportunities.filter(o => o.potential === 'medium');
    if (mediumImpactOpportunities.length > 0) {
      strategy.phases.push({
        phase: 'medium-impact-optimizations',
        priority: 'medium',
        optimizations: mediumImpactOpportunities,
        expectedGain: '15-40% performance improvement',
        duration: '1-2 weeks'
      });
    }
    
    // Phase 4: Infrastructure optimization
    if (analysis.scalingRequirements.required) {
      strategy.phases.push({
        phase: 'infrastructure-optimization',
        priority: 'medium',
        focus: 'scaling-and-infrastructure',
        expectedGain: '20-50% capacity improvement',
        duration: '2-4 weeks'
      });
    }
    
    return {
      ...strategy,
      overallApproach: this.getOverallOptimizationApproach(analysis),
      successMetrics: this.getOptimizationMetrics(performanceTargets),
      riskMitigation: this.getOptimizationRiskMitigation()
    };
  }
  
  recommendBottleneckSolutions(analysis, task) {
    const { performanceBottlenecks } = analysis;
    
    const solutions = performanceBottlenecks.map(bottleneck => {
      const solution = {
        bottleneck: bottleneck.type,
        impact: bottleneck.impact,
        priority: bottleneck.priority,
        solutions: []
      };
      
      switch (bottleneck.type) {
        case 'cpu-bottleneck':
          solution.solutions = [
            {
              technique: 'algorithm-optimization',
              approach: 'optimize-computational-complexity',
              tools: ['profiling-tools', 'code-analysis'],
              expectedGain: '50-80%'
            },
            {
              technique: 'parallel-processing',
              approach: 'multi-threading-or-clustering',
              tools: ['worker-threads', 'cluster-module'],
              expectedGain: '200-400%'
            },
            {
              technique: 'cpu-scaling',
              approach: 'vertical-or-horizontal-scaling',
              tools: ['load-balancers', 'auto-scaling'],
              expectedGain: '100-300%'
            }
          ];
          break;
          
        case 'memory-bottleneck':
          solution.solutions = [
            {
              technique: 'memory-optimization',
              approach: 'reduce-memory-footprint',
              tools: ['memory-profilers', 'gc-analyzers'],
              expectedGain: '30-70%'
            },
            {
              technique: 'garbage-collection-tuning',
              approach: 'optimize-gc-parameters',
              tools: ['gc-tuning-tools', 'heap-analyzers'],
              expectedGain: '20-50%'
            },
            {
              technique: 'memory-scaling',
              approach: 'increase-available-memory',
              tools: ['infrastructure-scaling', 'memory-optimization'],
              expectedGain: '50-200%'
            }
          ];
          break;
          
        case 'database-bottleneck':
          solution.solutions = [
            {
              technique: 'query-optimization',
              approach: 'optimize-sql-queries-and-indexes',
              tools: ['query-analyzers', 'execution-plan-tools'],
              expectedGain: '40-90%'
            },
            {
              technique: 'database-caching',
              approach: 'implement-query-result-caching',
              tools: ['redis', 'memcached', 'application-cache'],
              expectedGain: '60-95%'
            },
            {
              technique: 'connection-pooling',
              approach: 'optimize-database-connections',
              tools: ['connection-pool-libraries', 'database-proxies'],
              expectedGain: '25-60%'
            }
          ];
          break;
          
        case 'io-bottleneck':
          solution.solutions = [
            {
              technique: 'async-io',
              approach: 'non-blocking-io-operations',
              tools: ['async-libraries', 'event-loop-optimization'],
              expectedGain: '40-80%'
            },
            {
              technique: 'io-optimization',
              approach: 'optimize-file-and-disk-operations',
              tools: ['io-profilers', 'disk-optimization-tools'],
              expectedGain: '30-70%'
            },
            {
              technique: 'storage-upgrade',
              approach: 'ssd-upgrade-and-storage-optimization',
              tools: ['ssd-storage', 'storage-optimization'],
              expectedGain: '200-500%'
            }
          ];
          break;
          
        default:
          solution.solutions = bottleneck.solutions.map(s => ({
            technique: s,
            approach: `implement-${s}`,
            expectedGain: '20-50%'
          }));
      }
      
      return solution;
    });
    
    return solutions.sort((a, b) => b.priority - a.priority);
  }
  
  recommendCachingStrategy(analysis, task) {
    const { cachingNeeds, systemLoad, optimizationOpportunities } = analysis;
    
    if (!cachingNeeds.required) {
      return {
        strategy: 'minimal-caching',
        approach: 'basic-http-caching',
        rationale: 'Limited caching needs identified'
      };
    }
    
    const strategy = {
      strategy: cachingNeeds.strategy,
      levels: cachingNeeds.levels,
      implementation: []
    };
    
    // Application-level caching
    if (cachingNeeds.levels.some(l => l.level === 'application')) {
      strategy.implementation.push({
        level: 'application-cache',
        technology: 'in-memory-cache-with-lru-eviction',
        tools: ['node-cache', 'memory-cache', 'lru-cache'],
        configuration: {
          maxSize: this.getCacheSize(systemLoad.level),
          ttl: 'content-based-ttl',
          evictionPolicy: 'lru'
        },
        rationale: 'Fast access to frequently computed results'
      });
    }
    
    // Distributed caching
    if (systemLoad.level === 'high' || analysis.scalingRequirements.required) {
      strategy.implementation.push({
        level: 'distributed-cache',
        technology: 'redis-cluster',
        tools: ['redis', 'redis-cluster', 'redis-sentinel'],
        configuration: {
          clustering: 'hash-slot-based-clustering',
          replication: 'master-replica-setup',
          persistence: 'rdb-and-aof'
        },
        rationale: 'Shared cache across multiple application instances'
      });
    }
    
    // Database query caching
    if (optimizationOpportunities.some(o => o.type === 'database-optimization')) {
      strategy.implementation.push({
        level: 'database-cache',
        technology: 'query-result-caching',
        tools: ['redis', 'memcached', 'database-query-cache'],
        configuration: {
          keyStrategy: 'query-hash-based-keys',
          invalidation: 'ttl-and-event-based',
          compression: 'response-compression'
        },
        rationale: 'Cache expensive database query results'
      });
    }
    
    // HTTP response caching
    strategy.implementation.push({
      level: 'http-cache',
      technology: 'http-response-caching',
      tools: ['varnish', 'nginx-cache', 'cloudflare'],
      configuration: {
        cacheHeaders: 'cache-control-and-etag',
        varyHeaders: 'content-type-and-encoding',
        purging: 'api-based-cache-purging'
      },
      rationale: 'Cache HTTP responses at edge and reverse proxy'
    });
    
    return {
      ...strategy,
      invalidationStrategy: this.getAdvancedInvalidationStrategy(strategy.implementation),
      monitoring: this.getCacheMonitoring(),
      performance: this.getCachePerformanceOptimization()
    };
  }
  
  recommendResourceOptimization(analysis, task) {
    const { resourceUtilization, optimizationOpportunities } = analysis;
    
    const optimizations = [];
    
    // CPU optimization
    if (resourceUtilization.cpu.utilization === 'high' || 
        optimizationOpportunities.some(o => o.type === 'algorithm-optimization')) {
      optimizations.push({
        resource: 'cpu',
        techniques: [
          {
            technique: 'algorithm-optimization',
            approach: 'optimize-computational-complexity',
            expectedGain: '40-80% CPU reduction'
          },
          {
            technique: 'code-optimization',
            approach: 'optimize-hot-code-paths',
            expectedGain: '20-50% CPU reduction'
          },
          {
            technique: 'parallel-processing',
            approach: 'utilize-multiple-cpu-cores',
            expectedGain: '100-400% throughput increase'
          }
        ]
      });
    }
    
    // Memory optimization
    if (resourceUtilization.memory.utilization === 'high') {
      optimizations.push({
        resource: 'memory',
        techniques: [
          {
            technique: 'memory-leak-elimination',
            approach: 'identify-and-fix-memory-leaks',
            expectedGain: '30-70% memory reduction'
          },
          {
            technique: 'object-pooling',
            approach: 'reuse-expensive-objects',
            expectedGain: '20-50% memory reduction'
          },
          {
            technique: 'garbage-collection-tuning',
            approach: 'optimize-gc-parameters',
            expectedGain: '15-40% performance improvement'
          }
        ]
      });
    }
    
    // Storage optimization
    if (resourceUtilization.storage.utilization === 'high') {
      optimizations.push({
        resource: 'storage',
        techniques: [
          {
            technique: 'data-compression',
            approach: 'compress-stored-data',
            expectedGain: '50-80% storage reduction'
          },
          {
            technique: 'data-archiving',
            approach: 'archive-old-data',
            expectedGain: '30-60% storage reduction'
          },
          {
            technique: 'io-optimization',
            approach: 'optimize-read-write-patterns',
            expectedGain: '25-60% io performance improvement'
          }
        ]
      });
    }
    
    // Network optimization
    if (resourceUtilization.network.utilization === 'high') {
      optimizations.push({
        resource: 'network',
        techniques: [
          {
            technique: 'response-compression',
            approach: 'compress-http-responses',
            expectedGain: '60-90% bandwidth reduction'
          },
          {
            technique: 'connection-optimization',
            approach: 'optimize-network-connections',
            expectedGain: '30-70% latency reduction'
          },
          {
            technique: 'cdn-optimization',
            approach: 'utilize-content-delivery-network',
            expectedGain: '40-80% response time improvement'
          }
        ]
      });
    }
    
    return {
      optimizations,
      prioritization: this.prioritizeResourceOptimizations(optimizations),
      monitoring: this.getResourceOptimizationMonitoring(),
      validation: this.getResourceOptimizationValidation()
    };
  }
  
  recommendDatabaseOptimization(analysis, task) {
    const { performanceBottlenecks, optimizationOpportunities } = analysis;
    
    const dbBottlenecks = performanceBottlenecks.filter(b => b.type === 'database-bottleneck');
    const dbOpportunities = optimizationOpportunities.filter(o => o.type === 'database-optimization');
    
    if (dbBottlenecks.length === 0 && dbOpportunities.length === 0) {
      return {
        required: false,
        rationale: 'No significant database performance issues identified'
      };
    }
    
    const optimizations = {
      required: true,
      strategy: 'comprehensive-database-optimization',
      techniques: []
    };
    
    // Query optimization
    optimizations.techniques.push({
      technique: 'query-optimization',
      approach: 'analyze-and-optimize-slow-queries',
      tools: ['explain-analyze', 'query-profiler', 'slow-query-log'],
      implementation: [
        'identify-slow-queries',
        'analyze-execution-plans',
        'rewrite-inefficient-queries',
        'optimize-join-strategies'
      ],
      expectedGain: '40-90% query performance improvement'
    });
    
    // Indexing strategy
    optimizations.techniques.push({
      technique: 'indexing-optimization',
      approach: 'optimize-database-indexes',
      tools: ['index-analyzer', 'query-planner'],
      implementation: [
        'analyze-query-patterns',
        'create-composite-indexes',
        'remove-unused-indexes',
        'optimize-index-maintenance'
      ],
      expectedGain: '50-95% query performance improvement'
    });
    
    // Connection pooling
    optimizations.techniques.push({
      technique: 'connection-optimization',
      approach: 'optimize-database-connections',
      tools: ['connection-pool-libraries', 'database-proxy'],
      implementation: [
        'implement-connection-pooling',
        'optimize-pool-size',
        'configure-connection-timeouts',
        'monitor-connection-usage'
      ],
      expectedGain: '30-70% connection efficiency improvement'
    });
    
    // Caching layer
    if (dbOpportunities.some(o => o.techniques.includes('result-caching'))) {
      optimizations.techniques.push({
        technique: 'database-caching',
        approach: 'implement-query-result-caching',
        tools: ['redis', 'memcached', 'application-cache'],
        implementation: [
          'implement-query-result-cache',
          'cache-expensive-aggregations',
          'implement-cache-invalidation',
          'optimize-cache-hit-ratio'
        ],
        expectedGain: '70-98% cached query performance improvement'
      });
    }
    
    // Database configuration tuning
    optimizations.techniques.push({
      technique: 'configuration-tuning',
      approach: 'optimize-database-configuration',
      tools: ['database-tuning-tools', 'performance-monitors'],
      implementation: [
        'tune-memory-settings',
        'optimize-buffer-sizes',
        'configure-checkpoint-behavior',
        'optimize-wal-settings'
      ],
      expectedGain: '20-50% overall database performance improvement'
    });
    
    return optimizations;
  }
  
  recommendCodeOptimization(analysis, task) {
    const { optimizationOpportunities, performanceBottlenecks } = analysis;
    
    const codeOptimizations = [];
    
    // Algorithm optimization
    if (optimizationOpportunities.some(o => o.type === 'algorithm-optimization')) {
      codeOptimizations.push({
        area: 'algorithm-optimization',
        techniques: [
          {
            technique: 'complexity-reduction',
            approach: 'reduce-algorithmic-complexity',
            methods: ['optimize-loops', 'reduce-nested-complexity', 'use-efficient-data-structures'],
            expectedGain: '50-90% execution time reduction'
          },
          {
            technique: 'data-structure-optimization',
            approach: 'use-optimal-data-structures',
            methods: ['hash-maps-for-lookups', 'trees-for-sorted-data', 'arrays-for-sequential-access'],
            expectedGain: '30-80% memory and time improvement'
          }
        ]
      });
    }
    
    // Async optimization
    if (optimizationOpportunities.some(o => o.type === 'async-optimization')) {
      codeOptimizations.push({
        area: 'async-optimization',
        techniques: [
          {
            technique: 'async-await-optimization',
            approach: 'optimize-asynchronous-operations',
            methods: ['parallel-async-execution', 'promise-batching', 'async-iteration'],
            expectedGain: '40-85% concurrency improvement'
          },
          {
            technique: 'non-blocking-operations',
            approach: 'eliminate-blocking-operations',
            methods: ['async-file-operations', 'non-blocking-network-calls', 'streaming-operations'],
            expectedGain: '60-95% responsiveness improvement'
          }
        ]
      });
    }
    
    // Memory optimization
    if (performanceBottlenecks.some(b => b.type === 'memory-bottleneck')) {
      codeOptimizations.push({
        area: 'memory-optimization',
        techniques: [
          {
            technique: 'memory-leak-prevention',
            approach: 'prevent-and-fix-memory-leaks',
            methods: ['proper-cleanup', 'weak-references', 'event-listener-removal'],
            expectedGain: '40-90% memory usage reduction'
          },
          {
            technique: 'object-optimization',
            approach: 'optimize-object-creation-and-usage',
            methods: ['object-pooling', 'prototype-optimization', 'property-access-optimization'],
            expectedGain: '25-60% memory and cpu improvement'
          }
        ]
      });
    }
    
    // Hot path optimization
    codeOptimizations.push({
      area: 'hot-path-optimization',
      techniques: [
        {
          technique: 'critical-path-optimization',
          approach: 'optimize-most-frequently-executed-code',
          methods: ['profile-guided-optimization', 'inline-critical-functions', 'reduce-function-calls'],
          expectedGain: '30-70% overall performance improvement'
        },
        {
          technique: 'micro-optimizations',
          approach: 'apply-targeted-micro-optimizations',
          methods: ['loop-unrolling', 'branch-prediction-optimization', 'cache-friendly-patterns'],
          expectedGain: '10-30% fine-tuned performance improvement'
        }
      ]
    });
    
    return {
      optimizations: codeOptimizations,
      profilingStrategy: this.getCodeProfilingStrategy(),
      validationApproach: this.getCodeOptimizationValidation(),
      tooling: this.getCodeOptimizationTools()
    };
  }
  
  recommendInfrastructureOptimization(analysis, task) {
    const { scalingRequirements, systemLoad, resourceUtilization } = analysis;
    
    const infrastructureOptimizations = {
      approach: 'infrastructure-performance-optimization',
      optimizations: []
    };
    
    // Load balancing optimization
    if (systemLoad.level === 'high' || scalingRequirements.required) {
      infrastructureOptimizations.optimizations.push({
        component: 'load-balancing',
        optimization: 'intelligent-load-distribution',
        techniques: ['weighted-round-robin', 'least-connections', 'ip-hash-distribution'],
        tools: ['nginx', 'haproxy', 'aws-alb'],
        expectedGain: '30-70% request distribution improvement'
      });
    }
    
    // Caching infrastructure
    if (analysis.cachingNeeds.required) {
      infrastructureOptimizations.optimizations.push({
        component: 'caching-infrastructure',
        optimization: 'multi-tier-caching-architecture',
        techniques: ['edge-caching', 'reverse-proxy-caching', 'application-caching'],
        tools: ['varnish', 'nginx-cache', 'redis', 'memcached'],
        expectedGain: '60-95% response time improvement for cached content'
      });
    }
    
    // Database infrastructure
    if (resourceUtilization.database.utilization === 'high') {
      infrastructureOptimizations.optimizations.push({
        component: 'database-infrastructure',
        optimization: 'database-performance-infrastructure',
        techniques: ['read-replicas', 'connection-pooling', 'database-clustering'],
        tools: ['pgbouncer', 'mysql-proxy', 'database-clusters'],
        expectedGain: '40-80% database performance improvement'
      });
    }
    
    // CDN optimization
    if (resourceUtilization.network.utilization === 'high') {
      infrastructureOptimizations.optimizations.push({
        component: 'content-delivery',
        optimization: 'global-content-distribution',
        techniques: ['edge-locations', 'dynamic-content-acceleration', 'image-optimization'],
        tools: ['cloudflare', 'aws-cloudfront', 'fastly'],
        expectedGain: '50-90% global response time improvement'
      });
    }
    
    // Auto-scaling infrastructure
    if (scalingRequirements.required) {
      infrastructureOptimizations.optimizations.push({
        component: 'auto-scaling',
        optimization: 'dynamic-resource-scaling',
        techniques: ['horizontal-pod-autoscaling', 'vertical-scaling', 'predictive-scaling'],
        tools: ['kubernetes-hpa', 'aws-auto-scaling', 'custom-scaling-policies'],
        expectedGain: '25-60% resource utilization efficiency'
      });
    }
    
    return infrastructureOptimizations;
  }
  
  recommendMonitoringStrategy(analysis, task) {
    const { monitoringNeeds, performanceTargets, systemLoad } = analysis;
    
    const strategy = {
      approach: 'comprehensive-performance-monitoring',
      components: []
    };
    
    // Application Performance Monitoring (APM)
    strategy.components.push({
      component: 'application-performance-monitoring',
      metrics: [
        'response-times',
        'throughput',
        'error-rates',
        'apdex-scores',
        'transaction-traces'
      ],
      tools: ['new-relic', 'datadog', 'elastic-apm', 'custom-metrics'],
      alerting: this.getApmAlerting(performanceTargets),
      dashboards: 'real-time-performance-dashboards'
    });
    
    // Infrastructure monitoring
    strategy.components.push({
      component: 'infrastructure-monitoring',
      metrics: [
        'cpu-utilization',
        'memory-usage',
        'disk-io',
        'network-io',
        'load-average'
      ],
      tools: ['prometheus', 'grafana', 'collectd', 'telegraf'],
      alerting: this.getInfrastructureAlerting(),
      dashboards: 'infrastructure-health-dashboards'
    });
    
    // Custom performance monitoring
    if (systemLoad.level === 'high') {
      strategy.components.push({
        component: 'custom-performance-monitoring',
        metrics: [
          'business-transaction-performance',
          'user-experience-metrics',
          'custom-performance-counters',
          'performance-budgets'
        ],
        tools: ['custom-instrumentation', 'performance-apis', 'real-user-monitoring'],
        alerting: 'business-impact-based-alerting',
        dashboards: 'business-performance-dashboards'
      });
    }
    
    // Database performance monitoring
    if (analysis.performanceBottlenecks.some(b => b.type === 'database-bottleneck')) {
      strategy.components.push({
        component: 'database-performance-monitoring',
        metrics: [
          'query-execution-times',
          'database-connections',
          'lock-waits',
          'buffer-hit-ratios',
          'slow-query-analysis'
        ],
        tools: ['pg-stat-statements', 'mysql-performance-schema', 'database-profilers'],
        alerting: 'database-performance-alerting',
        dashboards: 'database-performance-dashboards'
      });
    }
    
    return strategy;
  }
  
  recommendPerformanceTestingStrategy(analysis, task) {
    const { performanceTargets, systemLoad, scalingRequirements } = analysis;
    
    const testingStrategy = {
      approach: 'comprehensive-performance-testing',
      testTypes: []
    };
    
    // Load testing
    testingStrategy.testTypes.push({
      type: 'load-testing',
      purpose: 'verify-normal-load-performance',
      tools: ['artillery', 'k6', 'jmeter'],
      scenarios: [
        'baseline-load-testing',
        'sustained-load-testing',
        'gradual-load-increase'
      ],
      targets: {
        responseTime: performanceTargets.responseTime,
        throughput: performanceTargets.throughput,
        errorRate: performanceTargets.errorRate
      }
    });
    
    // Stress testing
    if (systemLoad.level === 'high' || scalingRequirements.required) {
      testingStrategy.testTypes.push({
        type: 'stress-testing',
        purpose: 'determine-breaking-points',
        tools: ['k6', 'artillery', 'gatling'],
        scenarios: [
          'spike-testing',
          'volume-testing',
          'endurance-testing'
        ],
        targets: {
          maxThroughput: 'find-system-limits',
          degradationPoint: 'identify-performance-cliff',
          recoveryTime: 'measure-recovery-time'
        }
      });
    }
    
    // Performance regression testing
    testingStrategy.testTypes.push({
      type: 'performance-regression-testing',
      purpose: 'prevent-performance-regressions',
      tools: ['automated-performance-testing', 'ci-cd-integration'],
      scenarios: [
        'commit-based-performance-testing',
        'release-candidate-testing',
        'performance-budget-validation'
      ],
      targets: {
        performanceBudget: 'maintain-performance-standards',
        regressionThreshold: '5% performance degradation limit'
      }
    });
    
    // Profiling and diagnostics
    testingStrategy.testTypes.push({
      type: 'profiling-testing',
      purpose: 'identify-performance-bottlenecks',
      tools: ['clinic-js', 'node-profiler', 'flame-graphs'],
      scenarios: [
        'cpu-profiling',
        'memory-profiling',
        'io-profiling'
      ],
      targets: {
        bottleneckIdentification: 'identify-hot-spots',
        resourceOptimization: 'optimize-resource-usage'
      }
    });
    
    return testingStrategy;
  }
  
  getImplementationGuidance(analysis, task) {
    const { optimizationOpportunities, performanceBottlenecks, cachingNeeds } = analysis;
    
    const steps = [
      'Performance baseline establishment and profiling',
      'Critical bottleneck identification and prioritization',
      'High-impact optimization implementation',
      'Caching strategy implementation',
      'Database optimization implementation',
      'Code optimization and refactoring',
      'Infrastructure optimization setup',
      'Performance monitoring implementation',
      'Load testing and validation',
      'Performance regression prevention setup'
    ];
    
    if (cachingNeeds.required) {
      steps.splice(4, 0, 'Multi-tier caching implementation');
    }
    
    if (analysis.scalingRequirements.required) {
      steps.splice(-2, 0, 'Auto-scaling and load balancing setup');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredOptimizationResources(analysis),
      timeline: this.calculateOptimizationTimeline(steps.length, analysis),
      risks: this.identifyOptimizationImplementationRisks(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'performance-baseline-validation',
      'bottleneck-resolution-verification',
      'optimization-impact-measurement',
      'performance-regression-testing',
      'monitoring-accuracy-validation'
    ];
    
    if (analysis.cachingNeeds.required) {
      baseChecks.push('cache-hit-ratio-validation', 'cache-invalidation-testing');
    }
    
    if (analysis.scalingRequirements.required) {
      baseChecks.push('scaling-behavior-validation', 'load-distribution-testing');
    }
    
    if (analysis.performanceBottlenecks.some(b => b.impact === 'high')) {
      baseChecks.push('critical-bottleneck-elimination-verification');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { performanceBottlenecks, optimizationOpportunities, cachingNeeds, scalingRequirements } = analysis;
    
    let baseDays = 8; // Base optimization implementation time
    
    const criticalBottlenecks = performanceBottlenecks.filter(b => b.impact === 'high').length;
    baseDays += criticalBottlenecks * 2;
    
    const highImpactOpportunities = optimizationOpportunities.filter(o => o.potential === 'high').length;
    baseDays += highImpactOpportunities * 1.5;
    
    if (cachingNeeds.required) baseDays += 3;
    if (scalingRequirements.required) baseDays += 4;
    
    return {
      estimate: `${baseDays}-${baseDays + 4} days`,
      confidence: 0.85,
      factors: [
        `Critical bottlenecks: ${criticalBottlenecks}`,
        `High-impact opportunities: ${highImpactOpportunities}`,
        `Caching required: ${cachingNeeds.required}`,
        `Scaling required: ${scalingRequirements.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'distributed-system-optimization':
        return analysis.scalingRequirements.required &&
               analysis.scalingRequirements.type === 'horizontal' &&
               analysis.systemLoad.level === 'high';
      
      case 'enterprise-performance-architecture':
        return analysis.performanceBottlenecks.filter(b => b.impact === 'high').length > 3 &&
               (task.description?.toLowerCase().includes('enterprise') || 
                task.description?.toLowerCase().includes('large scale'));
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 8;
  }
  
  // Helper methods implementation continues...
  // (Due to length constraints, I'll include key helper methods)
  
  calculateBottleneckPriority(type, impact) {
    const priorities = {
      'cpu-bottleneck': 9,
      'memory-bottleneck': 8,
      'database-bottleneck': 9,
      'io-bottleneck': 7,
      'network-bottleneck': 6,
      'cache-miss': 5,
      'concurrency-bottleneck': 8,
      'serialization-bottleneck': 4
    };
    const basePriority = priorities[type] || 5;
    return impact === 'high' ? basePriority : basePriority - 2;
  }
  
  analyzeCpuUtilization(taskText, context) {
    let utilization = 'medium';
    if (taskText.includes('cpu intensive') || taskText.includes('computation')) {
      utilization = 'high';
    } else if (taskText.includes('lightweight') || taskText.includes('simple')) {
      utilization = 'low';
    }
    
    return {
      utilization,
      bottlenecks: utilization === 'high' ? ['algorithm-efficiency', 'concurrency'] : [],
      optimizationPotential: utilization === 'high' ? 'high' : 'medium'
    };
  }
  
  analyzeMemoryUtilization(taskText, context) {
    let utilization = 'medium';
    if (taskText.includes('memory intensive') || taskText.includes('large dataset')) {
      utilization = 'high';
    } else if (taskText.includes('minimal memory') || taskText.includes('lightweight')) {
      utilization = 'low';
    }
    
    return {
      utilization,
      bottlenecks: utilization === 'high' ? ['memory-leaks', 'gc-pressure'] : [],
      optimizationPotential: utilization === 'high' ? 'high' : 'medium'
    };
  }
  
  analyzeStorageUtilization(taskText, context) {
    let utilization = 'medium';
    if (taskText.includes('large files') || taskText.includes('data storage')) {
      utilization = 'high';
    } else if (taskText.includes('minimal storage') || taskText.includes('in-memory')) {
      utilization = 'low';
    }
    
    return {
      utilization,
      bottlenecks: utilization === 'high' ? ['io-bottlenecks', 'disk-space'] : [],
      optimizationPotential: utilization === 'high' ? 'high' : 'low'
    };
  }
  
  analyzeNetworkUtilization(taskText, context) {
    let utilization = 'medium';
    if (taskText.includes('high traffic') || taskText.includes('data transfer')) {
      utilization = 'high';
    } else if (taskText.includes('offline') || taskText.includes('local')) {
      utilization = 'low';
    }
    
    return {
      utilization,
      bottlenecks: utilization === 'high' ? ['bandwidth-limits', 'latency'] : [],
      optimizationPotential: utilization === 'high' ? 'high' : 'medium'
    };
  }
  
  analyzeDatabaseUtilization(taskText, context) {
    let utilization = 'medium';
    if (taskText.includes('database intensive') || taskText.includes('many queries')) {
      utilization = 'high';
    } else if (taskText.includes('minimal database') || taskText.includes('read-only')) {
      utilization = 'low';
    }
    
    return {
      utilization,
      bottlenecks: utilization === 'high' ? ['slow-queries', 'connection-limits'] : [],
      optimizationPotential: utilization === 'high' ? 'very-high' : 'medium'
    };
  }
  
  determineApplicationType(taskText) {
    if (taskText.includes('real-time') || taskText.includes('gaming')) return 'real-time';
    if (taskText.includes('api') || taskText.includes('microservice')) return 'api';
    if (taskText.includes('web app') || taskText.includes('website')) return 'web-application';
    if (taskText.includes('data processing') || taskText.includes('analytics')) return 'data-processing';
    return 'general-application';
  }
  
  getDefaultTargets(applicationType) {
    const targets = {
      'real-time': {
        responseTime: '< 50ms',
        throughput: '10000+ req/sec',
        availability: '99.99%',
        errorRate: '< 0.01%'
      },
      'api': {
        responseTime: '< 200ms',
        throughput: '5000+ req/sec',
        availability: '99.9%',
        errorRate: '< 0.1%'
      },
      'web-application': {
        responseTime: '< 500ms',
        throughput: '1000+ req/sec',
        availability: '99.5%',
        errorRate: '< 1%'
      },
      'data-processing': {
        responseTime: '< 5s',
        throughput: '100+ jobs/min',
        availability: '99%',
        errorRate: '< 0.1%'
      }
    };
    return targets[applicationType] || targets['general-application'] || {
      responseTime: '< 1s',
      throughput: '500+ req/sec',
      availability: '99%',
      errorRate: '< 1%'
    };
  }
  
  getRequiredOptimizationResources(analysis) {
    const resources = [
      'Performance profiling tools (clinic.js, 0x)',
      'Load testing tools (Artillery, K6)',
      'Monitoring tools (Prometheus, Grafana)',
      'Caching infrastructure (Redis)'
    ];
    
    if (analysis.performanceBottlenecks.some(b => b.type === 'database-bottleneck')) {
      resources.push('Database optimization tools', 'Query analysis tools');
    }
    
    if (analysis.scalingRequirements.required) {
      resources.push('Load balancing infrastructure', 'Auto-scaling tools');
    }
    
    return resources;
  }
  
  identifyOptimizationImplementationRisks(analysis) {
    const risks = ['performance-regression-during-optimization', 'system-instability'];
    
    if (analysis.performanceBottlenecks.filter(b => b.impact === 'high').length > 2) {
      risks.push('complex-optimization-interdependencies');
    }
    
    if (analysis.scalingRequirements.required) {
      risks.push('scaling-complexity', 'infrastructure-dependencies');
    }
    
    if (analysis.cachingNeeds.required) {
      risks.push('cache-invalidation-complexity', 'data-consistency-issues');
    }
    
    return risks;
  }
}

module.exports = PerformanceOptimizationSpecialist;