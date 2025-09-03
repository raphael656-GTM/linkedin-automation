const BaseSpecialist = require('../BaseSpecialist');

/**
 * Database Specialist - Tier 2 Specialist
 * Domain: PostgreSQL, Redis, performance tuning
 * Prerequisites: Requires Data Generalist consultation
 */
class DatabaseSpecialist extends BaseSpecialist {
  constructor() {
    super({
      id: 'database-specialist',
      name: 'Database Specialist',
      domain: 'database',
      tier: 'TIER_2',
      prerequisites: ['data-generalist-consultation'],
      expertise: [
        'advanced query optimization',
        'database performance tuning',
        'complex data modeling',
        'database clustering/sharding',
        'replication strategies',
        'backup and recovery',
        'indexing strategies',
        'connection pooling'
      ],
      handoffCriteria: [
        {
          condition: 'enterprise-data-architecture',
          reason: 'Enterprise-wide data architecture requires data architect oversight',
          targetTier: 'TIER_3',
          targetSpecialist: 'data-architect'
        },
        {
          condition: 'cross-system-consistency',
          reason: 'Cross-system data consistency requires architectural coordination',
          targetTier: 'TIER_3',
          targetSpecialist: 'data-architect'
        }
      ]
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      queryComplexity: this.analyzeQueryComplexity(task),
      performanceBottlenecks: this.identifyPerformanceBottlenecks(task, context),
      scalingRequirements: this.analyzeScalingRequirements(task, context),
      dataVolume: this.analyzeDataVolume(task, context),
      consistencyRequirements: this.analyzeConsistencyRequirements(task),
      availabilityNeeds: this.analyzeAvailabilityNeeds(task, context),
      backupStrategy: this.analyzeBackupStrategy(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      databaseArchitecture: this.recommendDatabaseArchitecture(analysis, task),
      performanceOptimization: this.recommendPerformanceOptimization(analysis, task),
      scalingStrategy: this.recommendScalingStrategy(analysis, task),
      indexingStrategy: this.recommendIndexingStrategy(analysis, task),
      queryOptimization: this.recommendQueryOptimization(analysis, task),
      backupAndRecovery: this.recommendBackupAndRecovery(analysis, task),
      monitoring: this.recommendDatabaseMonitoring(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  analyzeQueryComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complexityIndicators = {
      simple: ['select', 'insert', 'update', 'delete', 'simple join'],
      moderate: ['multiple joins', 'subquery', 'group by', 'having', 'window function'],
      complex: ['recursive cte', 'materialized view', 'complex aggregation', 'pivot'],
      advanced: ['dynamic sql', 'stored procedure', 'trigger', 'function', 'partition']
    };
    
    let complexity = 'simple';
    let score = 1;
    const detectedPatterns = [];
    
    Object.entries(complexityIndicators).forEach(([level, indicators]) => {
      indicators.forEach(indicator => {
        if (taskText.includes(indicator)) {
          detectedPatterns.push(indicator);
          complexity = level;
          score = level === 'advanced' ? 9 : level === 'complex' ? 7 : level === 'moderate' ? 4 : 2;
        }
      });
    });
    
    return {
      level: complexity,
      score,
      patterns: detectedPatterns,
      optimizationOpportunities: this.identifyQueryOptimizationOpportunities(detectedPatterns)
    };
  }
  
  identifyPerformanceBottlenecks(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const bottleneckTypes = {
      'slow-queries': {
        indicators: ['slow query', 'query timeout', 'long running', 'performance'],
        impact: 'high',
        solutions: ['indexing', 'query-rewriting', 'partitioning']
      },
      'lock-contention': {
        indicators: ['deadlock', 'lock wait', 'blocking', 'concurrency'],
        impact: 'high',
        solutions: ['isolation-level-tuning', 'query-optimization', 'connection-pooling']
      },
      'io-bottleneck': {
        indicators: ['disk io', 'storage', 'read performance', 'write performance'],
        impact: 'medium',
        solutions: ['ssd-upgrade', 'io-optimization', 'buffer-tuning']
      },
      'memory-pressure': {
        indicators: ['memory', 'cache miss', 'swap', 'buffer'],
        impact: 'medium',
        solutions: ['memory-tuning', 'query-optimization', 'connection-limits']
      },
      'connection-limits': {
        indicators: ['connection', 'pool', 'too many connections'],
        impact: 'medium',
        solutions: ['connection-pooling', 'connection-limits', 'pgbouncer']
      }
    };
    
    const identifiedBottlenecks = [];
    Object.entries(bottleneckTypes).forEach(([type, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        identifiedBottlenecks.push({
          type,
          impact: config.impact,
          solutions: config.solutions,
          priority: this.calculateBottleneckPriority(type, config.impact)
        });
      }
    });
    
    return identifiedBottlenecks.sort((a, b) => b.priority - a.priority);
  }
  
  analyzeScalingRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalingIndicators = [
      'scale', 'growth', 'load', 'users', 'traffic', 'volume',
      'horizontal', 'vertical', 'cluster', 'replica'
    ];
    
    const needsScaling = scalingIndicators.some(indicator => 
      taskText.includes(indicator)
    );
    
    if (!needsScaling) {
      return { required: false };
    }
    
    const currentLoad = this.estimateCurrentLoad(context);
    const projectedLoad = this.estimateProjectedLoad(taskText, context);
    
    return {
      required: true,
      currentLoad,
      projectedLoad,
      scalingType: this.determineScalingType(taskText),
      constraints: this.identifyScalingConstraints(context),
      timeline: this.getScalingTimeline(taskText)
    };
  }
  
  analyzeDataVolume(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    // Extract numeric indicators
    const numbers = taskText.match(/\d+/g);
    let estimatedRecords = 'unknown';
    let estimatedSize = 'unknown';
    
    if (numbers) {
      const largestNumber = Math.max(...numbers.map(n => parseInt(n)));
      if (largestNumber > 100000000) {
        estimatedRecords = 'very-large';
        estimatedSize = 'terabytes';
      } else if (largestNumber > 10000000) {
        estimatedRecords = 'large';
        estimatedSize = 'hundreds-gb';
      } else if (largestNumber > 1000000) {
        estimatedRecords = 'medium';
        estimatedSize = 'tens-gb';
      } else {
        estimatedRecords = 'small';
        estimatedSize = 'gb';
      }
    }
    
    return {
      recordCount: estimatedRecords,
      dataSize: estimatedSize,
      growthRate: this.estimateGrowthRate(taskText),
      partitioningNeeds: this.assessPartitioningNeeds(estimatedRecords),
      archivalNeeds: this.assessArchivalNeeds(taskText, estimatedRecords)
    };
  }
  
  analyzeConsistencyRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const consistencyLevels = {
      'strong': {
        indicators: ['acid', 'consistent', 'immediate', 'synchronous'],
        tradeoffs: ['performance-impact', 'availability-impact'],
        implementation: 'synchronous-replication'
      },
      'eventual': {
        indicators: ['eventual', 'async', 'distributed', 'availability'],
        tradeoffs: ['temporary-inconsistency', 'conflict-resolution'],
        implementation: 'asynchronous-replication'
      },
      'weak': {
        indicators: ['cache', 'best-effort', 'performance'],
        tradeoffs: ['data-loss-risk', 'inconsistency-windows'],
        implementation: 'read-replicas'
      }
    };
    
    let selectedLevel = 'strong'; // Default
    let config = consistencyLevels.strong;
    
    Object.entries(consistencyLevels).forEach(([level, levelConfig]) => {
      if (levelConfig.indicators.some(indicator => taskText.includes(indicator))) {
        selectedLevel = level;
        config = levelConfig;
      }
    });
    
    return {
      level: selectedLevel,
      tradeoffs: config.tradeoffs,
      implementation: config.implementation,
      monitoring: this.getConsistencyMonitoring(selectedLevel)
    };
  }
  
  analyzeAvailabilityNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const availabilityIndicators = {
      'high': ['99.9', '99.99', 'high availability', 'ha', 'always available'],
      'standard': ['business hours', 'maintenance window', 'planned downtime'],
      'basic': ['best effort', 'development', 'testing']
    };
    
    let availabilityLevel = 'standard'; // Default
    Object.entries(availabilityIndicators).forEach(([level, indicators]) => {
      if (indicators.some(indicator => taskText.includes(indicator))) {
        availabilityLevel = level;
      }
    });
    
    return {
      level: availabilityLevel,
      requirements: this.getAvailabilityRequirements(availabilityLevel),
      implementation: this.getAvailabilityImplementation(availabilityLevel),
      monitoring: this.getAvailabilityMonitoring(availabilityLevel)
    };
  }
  
  analyzeBackupStrategy(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const backupKeywords = ['backup', 'recovery', 'restore', 'disaster', 'rpo', 'rto'];
    const needsBackup = backupKeywords.some(keyword => taskText.includes(keyword)) ||
                        context.productionEnvironment;
    
    if (!needsBackup) {
      return { required: false };
    }
    
    return {
      required: true,
      rpoRequirement: this.extractRPO(taskText),
      rtoRequirement: this.extractRTO(taskText),
      backupTypes: this.determineBackupTypes(taskText, context),
      retentionPolicy: this.determineRetentionPolicy(taskText),
      testingStrategy: this.getBackupTestingStrategy()
    };
  }
  
  recommendDatabaseArchitecture(analysis, task) {
    const { scalingRequirements, availabilityNeeds, dataVolume } = analysis;
    
    if (availabilityNeeds.level === 'high' && 
        scalingRequirements.required && 
        dataVolume.recordCount === 'very-large') {
      return {
        architecture: 'distributed-cluster',
        rationale: 'High availability and large scale require distributed architecture',
        components: ['primary-cluster', 'read-replicas', 'load-balancer', 'connection-pooler'],
        technologies: ['PostgreSQL-cluster', 'PgBouncer', 'HAProxy'],
        benefits: ['high-availability', 'horizontal-scaling', 'load-distribution']
      };
    }
    
    if (scalingRequirements.required || availabilityNeeds.level === 'high') {
      return {
        architecture: 'primary-replica',
        rationale: 'Scaling or availability needs require replica setup',
        components: ['primary-database', 'read-replicas', 'connection-pooler'],
        technologies: ['PostgreSQL-streaming-replication', 'PgBouncer'],
        benefits: ['read-scaling', 'backup-availability', 'load-distribution']
      };
    }
    
    return {
      architecture: 'single-instance',
      rationale: 'Current requirements fit single instance with optimization',
      components: ['optimized-postgresql', 'connection-pooler', 'monitoring'],
      technologies: ['PostgreSQL', 'PgBouncer', 'pg_stat_statements'],
      benefits: ['simplicity', 'cost-effectiveness', 'easier-maintenance']
    };
  }
  
  recommendPerformanceOptimization(analysis, task) {
    const { performanceBottlenecks, queryComplexity } = analysis;
    
    const optimizations = [];
    
    // Query-level optimizations
    if (queryComplexity.level === 'complex' || queryComplexity.level === 'advanced') {
      optimizations.push({
        area: 'query-optimization',
        techniques: ['explain-analyze', 'query-rewriting', 'materialized-views'],
        priority: 'high',
        expectedImprovement: '30-70%'
      });
    }
    
    // Index optimizations
    optimizations.push({
      area: 'indexing',
      techniques: ['btree-indexes', 'partial-indexes', 'covering-indexes'],
      priority: 'high',
      expectedImprovement: '50-90%'
    });
    
    // Configuration optimizations
    if (performanceBottlenecks.some(b => b.type === 'memory-pressure')) {
      optimizations.push({
        area: 'memory-configuration',
        techniques: ['shared_buffers-tuning', 'work_mem-adjustment', 'effective_cache_size'],
        priority: 'medium',
        expectedImprovement: '20-40%'
      });
    }
    
    // Connection optimizations
    if (performanceBottlenecks.some(b => b.type === 'connection-limits')) {
      optimizations.push({
        area: 'connection-optimization',
        techniques: ['connection-pooling', 'max_connections-tuning', 'pgbouncer'],
        priority: 'medium',
        expectedImprovement: '25-50%'
      });
    }
    
    return optimizations.sort((a, b) => 
      (b.priority === 'high' ? 2 : 1) - (a.priority === 'high' ? 2 : 1)
    );
  }
  
  recommendScalingStrategy(analysis, task) {
    const { scalingRequirements, dataVolume, consistencyRequirements } = analysis;
    
    if (!scalingRequirements.required) {
      return {
        strategy: 'vertical-scaling-preparation',
        rationale: 'Prepare for future scaling needs with vertical approach'
      };
    }
    
    if (consistencyRequirements.level === 'strong' && 
        dataVolume.recordCount === 'very-large') {
      return {
        strategy: 'read-replica-scaling',
        rationale: 'Strong consistency requires read replica approach for scaling',
        implementation: {
          'read-replicas': '3-5 replicas for read scaling',
          'connection-pooling': 'PgBouncer for connection management',
          'load-balancing': 'Read/write splitting'
        },
        phases: ['single-replica', 'multiple-replicas', 'geographic-distribution']
      };
    }
    
    if (dataVolume.recordCount === 'very-large') {
      return {
        strategy: 'horizontal-partitioning',
        rationale: 'Very large data volume benefits from partitioning',
        implementation: {
          'partitioning': 'Range or hash partitioning',
          'sharding': 'Application-level sharding',
          'federation': 'Federated queries across shards'
        },
        phases: ['table-partitioning', 'database-sharding', 'distributed-queries']
      };
    }
    
    return {
      strategy: 'hybrid-scaling',
      rationale: 'Combination of vertical and horizontal scaling',
      implementation: {
        'vertical': 'Resource upgrades for primary',
        'horizontal': 'Read replicas for scaling',
        'caching': 'Redis for hot data'
      },
      phases: ['vertical-optimization', 'read-replica-addition', 'caching-layer']
    };
  }
  
  recommendIndexingStrategy(analysis, task) {
    const { queryComplexity, dataVolume, performanceBottlenecks } = analysis;
    
    const indexingRecommendations = {
      strategy: 'performance-driven-indexing',
      approach: 'query-analysis-based',
      techniques: []
    };
    
    // Basic indexing for all scenarios
    indexingRecommendations.techniques.push({
      type: 'primary-secondary-indexes',
      implementation: 'btree-indexes-on-frequent-queries',
      monitoring: 'index-usage-statistics'
    });
    
    // Advanced indexing for complex queries
    if (queryComplexity.level === 'complex' || queryComplexity.level === 'advanced') {
      indexingRecommendations.techniques.push({
        type: 'composite-indexes',
        implementation: 'multi-column-indexes-for-complex-where-clauses',
        monitoring: 'query-plan-analysis'
      });
      
      indexingRecommendations.techniques.push({
        type: 'covering-indexes',
        implementation: 'include-columns-to-avoid-table-lookups',
        monitoring: 'index-only-scan-tracking'
      });
    }
    
    // Partial indexing for large tables
    if (dataVolume.recordCount === 'large' || dataVolume.recordCount === 'very-large') {
      indexingRecommendations.techniques.push({
        type: 'partial-indexes',
        implementation: 'conditional-indexes-for-filtered-queries',
        monitoring: 'partial-index-effectiveness'
      });
    }
    
    // Specialized indexing
    if (queryComplexity.patterns.includes('full text search')) {
      indexingRecommendations.techniques.push({
        type: 'gin-gist-indexes',
        implementation: 'specialized-indexes-for-text-search',
        monitoring: 'search-performance-metrics'
      });
    }
    
    return indexingRecommendations;
  }
  
  recommendQueryOptimization(analysis, task) {
    const { queryComplexity } = analysis;
    
    if (queryComplexity.level === 'simple') {
      return {
        approach: 'basic-optimization',
        techniques: ['proper-indexing', 'query-parameterization'],
        tools: ['pg_stat_statements', 'explain-analyze']
      };
    }
    
    return {
      approach: 'advanced-optimization',
      techniques: [
        'query-rewriting',
        'cte-optimization',
        'materialized-view-usage',
        'partition-pruning',
        'parallel-query-execution'
      ],
      tools: [
        'pg_stat_statements',
        'auto_explain',
        'pg_stat_activity',
        'query-plan-analysis'
      ],
      monitoring: [
        'slow-query-logging',
        'query-performance-tracking',
        'execution-plan-monitoring'
      ]
    };
  }
  
  recommendBackupAndRecovery(analysis, task) {
    const { backupStrategy, availabilityNeeds, dataVolume } = analysis;
    
    if (!backupStrategy.required) {
      return {
        strategy: 'basic-backup',
        approach: 'pg_dump-for-small-databases'
      };
    }
    
    const strategy = {
      approach: 'comprehensive-backup-strategy',
      components: []
    };
    
    // Base backup
    strategy.components.push({
      type: 'base-backup',
      tool: 'pg_basebackup',
      frequency: this.getBackupFrequency(backupStrategy.rpoRequirement),
      retention: backupStrategy.retentionPolicy
    });
    
    // WAL archiving for point-in-time recovery
    if (backupStrategy.rpoRequirement !== 'daily') {
      strategy.components.push({
        type: 'wal-archiving',
        tool: 'archive_command',
        frequency: 'continuous',
        retention: 'based-on-base-backup-retention'
      });
    }
    
    // Streaming replication for high availability
    if (availabilityNeeds.level === 'high') {
      strategy.components.push({
        type: 'streaming-replication',
        tool: 'postgresql-streaming-replication',
        frequency: 'real-time',
        purpose: 'high-availability-and-backup'
      });
    }
    
    return strategy;
  }
  
  recommendDatabaseMonitoring(analysis, task) {
    const { performanceBottlenecks, scalingRequirements } = analysis;
    
    const monitoring = {
      approach: 'comprehensive-monitoring',
      metrics: [
        'query-performance',
        'connection-counts',
        'lock-waits',
        'buffer-hit-ratio',
        'checkpoint-activity',
        'replication-lag'
      ],
      tools: [
        'pg_stat_statements',
        'pg_stat_activity',
        'pg_stat_bgwriter',
        'pg_stat_database'
      ],
      alerting: [
        'slow-query-alerts',
        'high-connection-count',
        'lock-wait-threshold',
        'replication-lag-alerts'
      ]
    };
    
    if (scalingRequirements.required) {
      monitoring.metrics.push('replica-lag', 'load-distribution');
      monitoring.alerting.push('replica-health-alerts');
    }
    
    if (performanceBottlenecks.some(b => b.type === 'memory-pressure')) {
      monitoring.metrics.push('memory-usage', 'cache-hit-ratios');
      monitoring.alerting.push('memory-pressure-alerts');
    }
    
    return monitoring;
  }
  
  getImplementationGuidance(analysis, task) {
    const { scalingRequirements, performanceBottlenecks, backupStrategy } = analysis;
    
    const steps = [
      'Database architecture planning',
      'Performance baseline establishment',
      'Index strategy implementation',
      'Query optimization',
      'Configuration tuning',
      'Monitoring setup',
      'Performance testing',
      'Documentation and runbooks'
    ];
    
    if (scalingRequirements.required) {
      steps.splice(5, 0, 'Scaling implementation (replicas/partitioning)');
    }
    
    if (backupStrategy.required) {
      steps.splice(6, 0, 'Backup and recovery setup');
    }
    
    return {
      steps,
      priority: 'critical',
      resources: this.getRequiredDatabaseResources(analysis),
      timeline: this.calculateDatabaseTimeline(steps.length),
      risks: this.identifyImplementationRisks(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'performance-testing',
      'query-plan-analysis',
      'index-effectiveness-review',
      'backup-restore-testing'
    ];
    
    if (analysis.scalingRequirements.required) {
      baseChecks.push('scaling-testing', 'replication-lag-testing');
    }
    
    if (analysis.availabilityNeeds.level === 'high') {
      baseChecks.push('failover-testing', 'disaster-recovery-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { 
      queryComplexity, 
      scalingRequirements, 
      performanceBottlenecks, 
      dataVolume 
    } = analysis;
    
    let baseDays = 3; // Base database optimization work
    
    if (queryComplexity.level === 'advanced') baseDays += 3;
    else if (queryComplexity.level === 'complex') baseDays += 2;
    
    if (scalingRequirements.required) baseDays += 4;
    if (performanceBottlenecks.length > 2) baseDays += 2;
    if (dataVolume.recordCount === 'very-large') baseDays += 3;
    
    return {
      estimate: `${baseDays}-${baseDays + 3} days`,
      confidence: 0.85,
      factors: [
        `Query complexity: ${queryComplexity.level}`,
        `Scaling required: ${scalingRequirements.required}`,
        `Performance bottlenecks: ${performanceBottlenecks.length}`,
        `Data volume: ${dataVolume.recordCount}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'enterprise-data-architecture':
        return analysis.scalingRequirements.required &&
               analysis.dataVolume.recordCount === 'very-large' &&
               analysis.availabilityNeeds.level === 'high';
      
      case 'cross-system-consistency':
        return analysis.consistencyRequirements.level === 'strong' &&
               task.description?.toLowerCase().includes('multiple systems');
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 8;
  }
  
  // Helper methods
  identifyQueryOptimizationOpportunities(patterns) {
    const opportunities = [];
    if (patterns.includes('multiple joins')) {
      opportunities.push('join-order-optimization');
    }
    if (patterns.includes('subquery')) {
      opportunities.push('subquery-to-join-conversion');
    }
    if (patterns.includes('window function')) {
      opportunities.push('window-function-optimization');
    }
    return opportunities;
  }
  
  calculateBottleneckPriority(type, impact) {
    const priorities = {
      'slow-queries': 9,
      'lock-contention': 8,
      'io-bottleneck': 6,
      'memory-pressure': 7,
      'connection-limits': 5
    };
    return priorities[type] || 5;
  }
  
  estimateCurrentLoad(context) {
    return context.currentQPS || context.currentUsers || 'unknown';
  }
  
  estimateProjectedLoad(taskText, context) {
    const growthIndicators = taskText.match(/(\d+)x|(\d+)%/g);
    if (growthIndicators) {
      return `${growthIndicators[0]} growth expected`;
    }
    return 'unknown';
  }
  
  determineScalingType(taskText) {
    if (taskText.includes('horizontal') || taskText.includes('shard')) {
      return 'horizontal';
    }
    if (taskText.includes('vertical') || taskText.includes('upgrade')) {
      return 'vertical';
    }
    return 'hybrid';
  }
  
  identifyScalingConstraints(context) {
    const constraints = [];
    if (context.budgetConstraints) constraints.push('budget');
    if (context.complianceRequirements) constraints.push('compliance');
    if (context.legacyIntegrations) constraints.push('legacy-compatibility');
    return constraints.length > 0 ? constraints : ['budget', 'complexity'];
  }
  
  getScalingTimeline(taskText) {
    if (taskText.includes('urgent') || taskText.includes('immediate')) {
      return 'weeks';
    }
    return 'months';
  }
  
  estimateGrowthRate(taskText) {
    if (taskText.includes('rapid') || taskText.includes('exponential')) {
      return 'high';
    }
    if (taskText.includes('steady') || taskText.includes('linear')) {
      return 'medium';
    }
    return 'low';
  }
  
  assessPartitioningNeeds(recordCount) {
    return recordCount === 'very-large' || recordCount === 'large';
  }
  
  assessArchivalNeeds(taskText, recordCount) {
    return taskText.includes('archiv') || recordCount === 'very-large';
  }
  
  getConsistencyMonitoring(level) {
    if (level === 'strong') {
      return ['replication-lag', 'transaction-conflicts', 'consistency-checks'];
    }
    return ['eventual-consistency-metrics', 'conflict-resolution-stats'];
  }
  
  getAvailabilityRequirements(level) {
    const requirements = {
      'high': ['99.99%', 'automated-failover', 'geographic-redundancy'],
      'standard': ['99.9%', 'maintenance-windows', 'manual-failover'],
      'basic': ['best-effort', 'planned-downtime-acceptable']
    };
    return requirements[level] || requirements.standard;
  }
  
  getAvailabilityImplementation(level) {
    const implementations = {
      'high': 'streaming-replication-with-automatic-failover',
      'standard': 'streaming-replication-with-manual-failover',
      'basic': 'backup-based-recovery'
    };
    return implementations[level] || implementations.standard;
  }
  
  getAvailabilityMonitoring(level) {
    if (level === 'high') {
      return ['uptime-monitoring', 'failover-detection', 'health-checks'];
    }
    return ['basic-uptime-monitoring', 'backup-status'];
  }
  
  extractRPO(taskText) {
    if (taskText.includes('zero') || taskText.includes('no data loss')) {
      return 'zero';
    }
    if (taskText.includes('hour')) return 'hourly';
    if (taskText.includes('day')) return 'daily';
    return 'hourly'; // Default
  }
  
  extractRTO(taskText) {
    if (taskText.includes('minute')) return 'minutes';
    if (taskText.includes('hour')) return 'hours';
    return 'hours'; // Default
  }
  
  determineBackupTypes(taskText, context) {
    const types = ['full-backup'];
    if (context.largeDatabase || taskText.includes('incremental')) {
      types.push('incremental-backup');
    }
    if (taskText.includes('point in time')) {
      types.push('point-in-time-recovery');
    }
    return types;
  }
  
  determineRetentionPolicy(taskText) {
    if (taskText.includes('compliance') || taskText.includes('regulation')) {
      return 'long-term-retention';
    }
    return 'standard-retention';
  }
  
  getBackupTestingStrategy() {
    return {
      frequency: 'monthly',
      scope: 'full-restore-testing',
      validation: 'data-integrity-checks'
    };
  }
  
  getBackupFrequency(rpoRequirement) {
    const frequencies = {
      'zero': 'continuous',
      'hourly': 'hourly',
      'daily': 'daily'
    };
    return frequencies[rpoRequirement] || 'daily';
  }
  
  getRequiredDatabaseResources(analysis) {
    const resources = [
      'Database performance monitoring tools',
      'Query analysis tools',
      'Backup infrastructure'
    ];
    
    if (analysis.scalingRequirements.required) {
      resources.push('Load testing tools', 'Replication setup');
    }
    
    return resources;
  }
  
  calculateDatabaseTimeline(stepCount) {
    return {
      planning: '1 day',
      baseline: '1 day',
      implementation: `${Math.ceil(stepCount * 0.8)} days`,
      testing: '3 days',
      optimization: '2 days'
    };
  }
  
  identifyImplementationRisks(analysis) {
    const risks = ['performance-degradation-during-changes'];
    
    if (analysis.scalingRequirements.required) {
      risks.push('replication-lag', 'split-brain-scenarios');
    }
    
    if (analysis.dataVolume.recordCount === 'very-large') {
      risks.push('long-maintenance-windows', 'storage-space-issues');
    }
    
    return risks;
  }
}

module.exports = DatabaseSpecialist;