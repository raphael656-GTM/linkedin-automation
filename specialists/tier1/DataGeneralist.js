const BaseSpecialist = require('../BaseSpecialist');

/**
 * Data Generalist - Tier 1 Specialist
 * Domain: Database design, modeling, analytics
 */
class DataGeneralist extends BaseSpecialist {
  constructor() {
    super({
      id: 'data-generalist',
      name: 'Data Generalist',
      domain: 'data',
      tier: 'TIER_1',
      expertise: [
        'database schema design',
        'data modeling',
        'basic analytics',
        'data migration',
        'query optimization',
        'data validation',
        'backup strategies',
        'data relationships'
      ],
      handoffCriteria: [
        {
          condition: 'complex-data-architecture',
          reason: 'Complex data architectures require specialized database expertise',
          targetTier: 'TIER_2',
          targetSpecialist: 'database-specialist'
        },
        {
          condition: 'enterprise-data-strategy',
          reason: 'Enterprise-wide data governance requires data architecture expertise',
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
      dataScope: this.assessDataScope(task),
      modelingComplexity: this.analyzeModelingComplexity(task),
      storageRequirements: this.analyzeStorageRequirements(task),
      queryPatterns: this.analyzeQueryPatterns(task),
      migrationNeeds: this.analyzeMigrationNeeds(task),
      analyticsRequirements: this.analyzeAnalyticsRequirements(task),
      consistencyRequirements: this.analyzeConsistencyRequirements(task)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      dataModel: this.recommendDataModel(analysis, task),
      databaseChoice: this.recommendDatabaseChoice(analysis, task),
      schemaDesign: this.recommendSchemaDesign(analysis, task),
      queryStrategy: this.recommendQueryStrategy(analysis, task),
      migrationPlan: this.recommendMigrationPlan(analysis, task),
      analyticsApproach: this.recommendAnalyticsApproach(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  assessDataScope(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scopeAreas = {
      transactional: ['transaction', 'order', 'payment', 'crud', 'user data'],
      analytical: ['analytics', 'reporting', 'metrics', 'dashboard', 'insights'],
      operational: ['logs', 'monitoring', 'events', 'audit', 'tracking'],
      reference: ['lookup', 'configuration', 'settings', 'metadata', 'catalog'],
      temporal: ['time series', 'historical', 'timeline', 'versioning', 'audit trail'],
      hierarchical: ['tree', 'parent-child', 'nested', 'hierarchy', 'category']
    };
    
    const detectedAreas = [];
    Object.entries(scopeAreas).forEach(([area, keywords]) => {
      const relevance = keywords.filter(keyword => taskText.includes(keyword)).length;
      if (relevance > 0) {
        detectedAreas.push({
          area,
          relevance,
          complexity: this.getAreaComplexity(area),
          requirements: this.getAreaRequirements(area)
        });
      }
    });
    
    return detectedAreas.sort((a, b) => b.relevance - a.relevance);
  }
  
  analyzeModelingComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complexityIndicators = {
      simple: ['single table', 'flat structure', 'basic crud'],
      moderate: ['multiple tables', 'relationships', 'foreign keys'],
      complex: ['many-to-many', 'inheritance', 'polymorphic', 'denormalization'],
      advanced: ['graph relationships', 'temporal modeling', 'event sourcing']
    };
    
    let complexity = 'simple';
    let score = 1;
    
    Object.entries(complexityIndicators).forEach(([level, indicators]) => {
      if (indicators.some(indicator => taskText.includes(indicator))) {
        complexity = level;
        score = level === 'advanced' ? 8 : level === 'complex' ? 6 : level === 'moderate' ? 4 : 2;
      }
    });
    
    return {
      level: complexity,
      score,
      factors: this.getComplexityFactors(taskText),
      relationships: this.analyzeRelationships(taskText)
    };
  }
  
  analyzeStorageRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const volumeIndicators = this.extractVolumeIndicators(taskText);
    const performanceNeeds = this.extractPerformanceNeeds(taskText);
    const consistencyNeeds = this.extractConsistencyNeeds(taskText);
    
    return {
      volume: volumeIndicators,
      performance: performanceNeeds,
      consistency: consistencyNeeds,
      scalability: this.assessScalabilityNeeds(taskText),
      durability: this.assessDurabilityNeeds(taskText)
    };
  }
  
  analyzeQueryPatterns(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const queryTypes = {
      simple: ['select', 'insert', 'update', 'delete', 'basic query'],
      complex: ['join', 'aggregate', 'group by', 'subquery', 'window function'],
      analytical: ['sum', 'count', 'average', 'analytics', 'reporting'],
      search: ['search', 'filter', 'find', 'lookup', 'full text'],
      batch: ['batch', 'bulk', 'mass', 'import', 'export']
    };
    
    const detectedPatterns = [];
    Object.entries(queryTypes).forEach(([type, patterns]) => {
      if (patterns.some(pattern => taskText.includes(pattern))) {
        detectedPatterns.push({
          type,
          frequency: this.estimateQueryFrequency(type, taskText),
          complexity: this.getQueryComplexity(type),
          optimization: this.getQueryOptimization(type)
        });
      }
    });
    
    return detectedPatterns.sort((a, b) => b.frequency - a.frequency);
  }
  
  analyzeMigrationNeeds(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const migrationKeywords = ['migrate', 'migration', 'move data', 'import', 'export', 'transform'];
    const hasMigration = migrationKeywords.some(keyword => taskText.includes(keyword));
    
    if (!hasMigration) {
      return { required: false };
    }
    
    return {
      required: true,
      type: this.determineMigrationType(taskText),
      complexity: this.assessMigrationComplexity(taskText),
      risks: this.identifyMigrationRisks(taskText),
      strategy: this.recommendMigrationStrategy(taskText)
    };
  }
  
  analyzeAnalyticsRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const analyticsKeywords = [
      'analytics', 'reporting', 'dashboard', 'metrics', 'kpi',
      'insights', 'trends', 'statistics', 'visualization'
    ];
    
    const hasAnalytics = analyticsKeywords.some(keyword => taskText.includes(keyword));
    
    if (!hasAnalytics) {
      return { required: false };
    }
    
    return {
      required: true,
      type: this.determineAnalyticsType(taskText),
      complexity: this.assessAnalyticsComplexity(taskText),
      realTime: this.needsRealTimeAnalytics(taskText),
      aggregations: this.identifyRequiredAggregations(taskText)
    };
  }
  
  analyzeConsistencyRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const consistencyLevels = {
      strong: ['acid', 'consistency', 'transaction', 'atomic'],
      eventual: ['eventual', 'async', 'distributed', 'availability'],
      weak: ['cache', 'temporary', 'best effort']
    };
    
    let level = 'strong'; // Default
    Object.entries(consistencyLevels).forEach(([consistencyLevel, indicators]) => {
      if (indicators.some(indicator => taskText.includes(indicator))) {
        level = consistencyLevel;
      }
    });
    
    return {
      level,
      requirements: this.getConsistencyRequirements(level),
      tradeoffs: this.getConsistencyTradeoffs(level)
    };
  }
  
  recommendDataModel(analysis, task) {
    const { modelingComplexity, dataScope } = analysis;
    
    if (modelingComplexity.level === 'advanced') {
      return {
        approach: 'event-sourcing',
        rationale: 'Advanced complexity requires event-driven data model',
        patterns: ['event-sourcing', 'cqrs', 'aggregate-root'],
        benefits: ['auditability', 'scalability', 'flexibility']
      };
    }
    
    if (modelingComplexity.level === 'complex') {
      return {
        approach: 'domain-driven-design',
        rationale: 'Complex relationships benefit from domain modeling',
        patterns: ['aggregate', 'entity', 'value-object', 'repository'],
        benefits: ['maintainability', 'testability', 'business-alignment']
      };
    }
    
    if (modelingComplexity.level === 'moderate') {
      return {
        approach: 'relational-model',
        rationale: 'Moderate complexity fits well with relational approach',
        patterns: ['normalized-tables', 'foreign-keys', 'indexes'],
        benefits: ['data-integrity', 'query-flexibility', 'standardization']
      };
    }
    
    return {
      approach: 'simple-model',
      rationale: 'Simple requirements allow for straightforward modeling',
      patterns: ['flat-structure', 'minimal-relationships'],
      benefits: ['simplicity', 'quick-development', 'easy-maintenance']
    };
  }
  
  recommendDatabaseChoice(analysis, task) {
    const { storageRequirements, queryPatterns, analyticsRequirements } = analysis;
    
    if (analyticsRequirements.required && analyticsRequirements.complexity === 'high') {
      return {
        primary: 'time-series-db',
        rationale: 'Analytics workload requires specialized database',
        options: ['InfluxDB', 'TimescaleDB', 'ClickHouse'],
        considerations: ['query-performance', 'compression', 'time-based-partitioning']
      };
    }
    
    if (queryPatterns.some(p => p.type === 'search') && 
        storageRequirements.volume === 'large') {
      return {
        primary: 'search-engine',
        rationale: 'Search-heavy workload with large volume',
        options: ['Elasticsearch', 'OpenSearch', 'Solr'],
        considerations: ['indexing-strategy', 'search-relevance', 'scalability']
      };
    }
    
    if (storageRequirements.consistency.level === 'eventual' ||
        storageRequirements.scalability === 'horizontal') {
      return {
        primary: 'nosql-database',
        rationale: 'Scalability and eventual consistency requirements',
        options: ['MongoDB', 'Cassandra', 'DynamoDB'],
        considerations: ['partition-strategy', 'consistency-model', 'query-patterns']
      };
    }
    
    return {
      primary: 'relational-database',
      rationale: 'Standard relational database fits requirements',
      options: ['PostgreSQL', 'MySQL', 'SQLite'],
      considerations: ['transaction-support', 'query-optimization', 'backup-strategy']
    };
  }
  
  recommendSchemaDesign(analysis, task) {
    const { modelingComplexity, storageRequirements } = analysis;
    
    const design = {
      normalization: this.recommendNormalization(modelingComplexity, storageRequirements),
      indexing: this.recommendIndexing(analysis),
      partitioning: this.recommendPartitioning(storageRequirements),
      constraints: this.recommendConstraints(modelingComplexity),
      relationships: this.recommendRelationships(modelingComplexity)
    };
    
    return design;
  }
  
  recommendQueryStrategy(analysis, task) {
    const { queryPatterns } = analysis;
    
    return {
      optimization: this.getQueryOptimizationStrategy(queryPatterns),
      caching: this.getQueryCachingStrategy(queryPatterns),
      indexing: this.getQueryIndexingStrategy(queryPatterns),
      performance: this.getQueryPerformanceStrategy(queryPatterns)
    };
  }
  
  recommendMigrationPlan(analysis, task) {
    const { migrationNeeds } = analysis;
    
    if (!migrationNeeds.required) {
      return { required: false };
    }
    
    return {
      strategy: migrationNeeds.strategy,
      phases: this.getMigrationPhases(migrationNeeds.type),
      rollback: this.getMigrationRollback(migrationNeeds.type),
      validation: this.getMigrationValidation(migrationNeeds.type),
      timeline: this.getMigrationTimeline(migrationNeeds.complexity)
    };
  }
  
  recommendAnalyticsApproach(analysis, task) {
    const { analyticsRequirements } = analysis;
    
    if (!analyticsRequirements.required) {
      return { required: false };
    }
    
    return {
      architecture: this.getAnalyticsArchitecture(analyticsRequirements.type),
      processing: this.getAnalyticsProcessing(analyticsRequirements.realTime),
      storage: this.getAnalyticsStorage(analyticsRequirements.complexity),
      visualization: this.getAnalyticsVisualization(analyticsRequirements.type)
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { modelingComplexity, migrationNeeds, analyticsRequirements } = analysis;
    
    const steps = [
      'Data requirements analysis',
      'Data model design',
      'Database schema creation',
      'Data validation rules',
      'Query optimization',
      'Testing and validation'
    ];
    
    if (migrationNeeds.required) {
      steps.splice(3, 0, 'Data migration planning', 'Migration execution');
    }
    
    if (analyticsRequirements.required) {
      steps.splice(-1, 0, 'Analytics implementation');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredDataResources(analysis),
      timeline: this.calculateDataTimeline(steps.length)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = ['data-validation', 'schema-review', 'query-performance-testing'];
    
    if (analysis.migrationNeeds.required) {
      baseChecks.push('migration-testing', 'data-integrity-validation');
    }
    
    if (analysis.analyticsRequirements.required) {
      baseChecks.push('analytics-accuracy-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { modelingComplexity, migrationNeeds, analyticsRequirements } = analysis;
    
    let baseDays = modelingComplexity.level === 'advanced' ? 5 :
                   modelingComplexity.level === 'complex' ? 3 :
                   modelingComplexity.level === 'moderate' ? 2 : 1;
    
    if (migrationNeeds.required) baseDays += migrationNeeds.complexity === 'high' ? 4 : 2;
    if (analyticsRequirements.required) baseDays += 2;
    
    return {
      estimate: `${baseDays}-${baseDays + 2} days`,
      confidence: 0.8,
      factors: [
        `Modeling complexity: ${modelingComplexity.level}`,
        `Migration required: ${migrationNeeds.required}`,
        `Analytics required: ${analyticsRequirements.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'complex-data-architecture':
        return analysis.modelingComplexity.score > 6 ||
               (analysis.migrationNeeds.required && analysis.migrationNeeds.complexity === 'high');
      
      case 'enterprise-data-strategy':
        return analysis.analyticsRequirements.required &&
               analysis.storageRequirements.volume === 'enterprise';
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 6;
  }
  
  // Helper methods
  getAreaComplexity(area) {
    const complexities = {
      transactional: 6,
      analytical: 7,
      operational: 4,
      reference: 2,
      temporal: 8,
      hierarchical: 7
    };
    return complexities[area] || 3;
  }
  
  getAreaRequirements(area) {
    const requirements = {
      transactional: ['ACID compliance', 'high consistency'],
      analytical: ['query performance', 'aggregation support'],
      operational: ['high throughput', 'retention policies'],
      reference: ['lookup performance', 'data integrity'],
      temporal: ['time-based queries', 'versioning'],
      hierarchical: ['recursive queries', 'tree operations']
    };
    return requirements[area] || [];
  }
  
  getComplexityFactors(taskText) {
    const factors = [];
    if (taskText.includes('relationship')) factors.push('complex-relationships');
    if (taskText.includes('inheritance')) factors.push('inheritance-modeling');
    if (taskText.includes('temporal')) factors.push('temporal-data');
    return factors;
  }
  
  analyzeRelationships(taskText) {
    const relationships = [];
    if (taskText.includes('one-to-many') || taskText.includes('foreign key')) {
      relationships.push('one-to-many');
    }
    if (taskText.includes('many-to-many') || taskText.includes('junction')) {
      relationships.push('many-to-many');
    }
    if (taskText.includes('inheritance') || taskText.includes('polymorphic')) {
      relationships.push('inheritance');
    }
    return relationships;
  }
  
  extractVolumeIndicators(taskText) {
    const numbers = taskText.match(/\d+/g);
    if (!numbers) return 'unknown';
    
    const largestNumber = Math.max(...numbers.map(n => parseInt(n)));
    if (largestNumber > 1000000) return 'large';
    if (largestNumber > 10000) return 'medium';
    return 'small';
  }
  
  extractPerformanceNeeds(taskText) {
    const performanceKeywords = ['fast', 'quick', 'performance', 'speed', 'latency'];
    return performanceKeywords.some(keyword => taskText.includes(keyword)) ? 'high' : 'standard';
  }
  
  extractConsistencyNeeds(taskText) {
    const strongConsistencyKeywords = ['consistent', 'acid', 'transaction', 'atomic'];
    return strongConsistencyKeywords.some(keyword => taskText.includes(keyword)) ? 'strong' : 'eventual';
  }
  
  assessScalabilityNeeds(taskText) {
    const scalingKeywords = ['scale', 'distributed', 'horizontal', 'cluster'];
    return scalingKeywords.some(keyword => taskText.includes(keyword)) ? 'horizontal' : 'vertical';
  }
  
  assessDurabilityNeeds(taskText) {
    const durabilityKeywords = ['backup', 'persistent', 'durable', 'recovery'];
    return durabilityKeywords.some(keyword => taskText.includes(keyword)) ? 'high' : 'standard';
  }
  
  estimateQueryFrequency(type, taskText) {
    if (taskText.includes('frequent') || taskText.includes('often')) return 8;
    if (taskText.includes('batch') || taskText.includes('periodic')) return 3;
    return 5; // Default
  }
  
  getQueryComplexity(type) {
    const complexities = {
      simple: 2,
      complex: 7,
      analytical: 6,
      search: 5,
      batch: 4
    };
    return complexities[type] || 3;
  }
  
  getQueryOptimization(type) {
    const optimizations = {
      simple: ['indexing'],
      complex: ['query-rewriting', 'join-optimization'],
      analytical: ['materialized-views', 'aggregation-tables'],
      search: ['full-text-indexing', 'search-optimization'],
      batch: ['bulk-operations', 'connection-pooling']
    };
    return optimizations[type] || ['basic-optimization'];
  }
  
  determineMigrationType(taskText) {
    if (taskText.includes('schema change')) return 'schema-migration';
    if (taskText.includes('database change')) return 'platform-migration';
    if (taskText.includes('data transformation')) return 'data-transformation';
    return 'data-migration';
  }
  
  assessMigrationComplexity(taskText) {
    if (taskText.includes('complex') || taskText.includes('transform')) return 'high';
    if (taskText.includes('simple') || taskText.includes('direct')) return 'low';
    return 'medium';
  }
  
  identifyMigrationRisks(taskText) {
    return ['data-loss', 'downtime', 'performance-impact'];
  }
  
  recommendMigrationStrategy(taskText) {
    if (taskText.includes('zero downtime')) return 'online-migration';
    if (taskText.includes('batch')) return 'batch-migration';
    return 'staged-migration';
  }
  
  determineAnalyticsType(taskText) {
    if (taskText.includes('real-time') || taskText.includes('streaming')) return 'real-time';
    if (taskText.includes('historical') || taskText.includes('trend')) return 'historical';
    if (taskText.includes('dashboard') || taskText.includes('report')) return 'reporting';
    return 'basic-analytics';
  }
  
  assessAnalyticsComplexity(taskText) {
    if (taskText.includes('machine learning') || taskText.includes('prediction')) return 'high';
    if (taskText.includes('aggregation') || taskText.includes('grouping')) return 'medium';
    return 'low';
  }
  
  needsRealTimeAnalytics(taskText) {
    return taskText.includes('real-time') || taskText.includes('live') || taskText.includes('streaming');
  }
  
  identifyRequiredAggregations(taskText) {
    const aggregations = [];
    if (taskText.includes('sum') || taskText.includes('total')) aggregations.push('sum');
    if (taskText.includes('count')) aggregations.push('count');
    if (taskText.includes('average') || taskText.includes('mean')) aggregations.push('average');
    if (taskText.includes('max') || taskText.includes('min')) aggregations.push('min-max');
    return aggregations;
  }
  
  getConsistencyRequirements(level) {
    const requirements = {
      strong: ['ACID transactions', 'immediate consistency'],
      eventual: ['eventual consistency', 'partition tolerance'],
      weak: ['best effort', 'high availability']
    };
    return requirements[level] || requirements.strong;
  }
  
  getConsistencyTradeoffs(level) {
    const tradeoffs = {
      strong: ['lower availability', 'potential performance impact'],
      eventual: ['temporary inconsistency', 'complex conflict resolution'],
      weak: ['data inconsistency risk', 'application complexity']
    };
    return tradeoffs[level] || [];
  }
  
  recommendNormalization(complexity, requirements) {
    if (complexity.level === 'simple') return '3NF';
    if (requirements.performance === 'high') return 'denormalized';
    return '3NF-selective-denormalization';
  }
  
  recommendIndexing(analysis) {
    return {
      strategy: 'query-based-indexing',
      types: ['btree', 'hash'],
      monitoring: 'index-usage-tracking'
    };
  }
  
  recommendPartitioning(requirements) {
    if (requirements.volume === 'large') {
      return {
        strategy: 'range-partitioning',
        key: 'date-based'
      };
    }
    return { strategy: 'no-partitioning' };
  }
  
  recommendConstraints(complexity) {
    const constraints = ['primary-key', 'foreign-key'];
    if (complexity.level !== 'simple') {
      constraints.push('check-constraints', 'unique-constraints');
    }
    return constraints;
  }
  
  recommendRelationships(complexity) {
    if (complexity.level === 'simple') return ['simple-foreign-keys'];
    if (complexity.level === 'complex') return ['junction-tables', 'polymorphic-associations'];
    return ['standard-associations'];
  }
  
  getQueryOptimizationStrategy(patterns) {
    return {
      approach: 'pattern-based-optimization',
      techniques: ['indexing', 'query-rewriting', 'materialized-views']
    };
  }
  
  getQueryCachingStrategy(patterns) {
    return {
      level: 'query-result-caching',
      invalidation: 'time-based'
    };
  }
  
  getQueryIndexingStrategy(patterns) {
    return {
      approach: 'usage-based-indexing',
      monitoring: 'slow-query-analysis'
    };
  }
  
  getQueryPerformanceStrategy(patterns) {
    return {
      monitoring: ['response-time', 'query-count', 'index-hit-ratio'],
      optimization: ['explain-plan-analysis', 'query-profiling']
    };
  }
  
  getMigrationPhases(type) {
    return ['preparation', 'schema-migration', 'data-migration', 'validation', 'cleanup'];
  }
  
  getMigrationRollback(type) {
    return {
      strategy: 'backup-based-rollback',
      checkpoints: 'phase-based-checkpoints'
    };
  }
  
  getMigrationValidation(type) {
    return ['data-integrity-check', 'count-validation', 'sample-data-verification'];
  }
  
  getMigrationTimeline(complexity) {
    const timelines = {
      high: '3-5 days',
      medium: '1-2 days',
      low: '4-8 hours'
    };
    return timelines[complexity] || '1 day';
  }
  
  getAnalyticsArchitecture(type) {
    if (type === 'real-time') return 'streaming-analytics';
    if (type === 'historical') return 'data-warehouse';
    return 'olap-cube';
  }
  
  getAnalyticsProcessing(realTime) {
    return realTime ? 'stream-processing' : 'batch-processing';
  }
  
  getAnalyticsStorage(complexity) {
    if (complexity === 'high') return 'columnar-storage';
    return 'standard-storage';
  }
  
  getAnalyticsVisualization(type) {
    return {
      tools: ['Dashboard framework', 'Reporting engine'],
      approach: 'web-based-visualization'
    };
  }
  
  getRequiredDataResources(analysis) {
    const resources = ['Database design tools', 'Testing data'];
    if (analysis.migrationNeeds.required) {
      resources.push('Migration tools', 'Backup systems');
    }
    return resources;
  }
  
  calculateDataTimeline(stepCount) {
    return {
      planning: '1 day',
      design: '1 day',
      implementation: `${Math.ceil(stepCount * 0.5)} days`,
      testing: '1 day'
    };
  }
}

module.exports = DataGeneralist;