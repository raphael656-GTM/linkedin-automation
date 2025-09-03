const BaseSpecialist = require('../BaseSpecialist');

/**
 * Data Architect - Tier 3 Architect
 * Domain: Data lakes, warehouses, governance, enterprise data strategy
 * Prerequisites: Requires Tier 2 specialist consultation
 */
class DataArchitect extends BaseSpecialist {
  constructor() {
    super({
      id: 'data-architect',
      name: 'Data Architect',
      domain: 'data-architecture',
      tier: 'TIER_3',
      prerequisites: ['tier-2-specialist-consultation'],
      expertise: [
        'enterprise data architecture',
        'data lake and warehouse design',
        'data governance frameworks',
        'master data management',
        'data integration patterns',
        'big data technologies',
        'real-time data processing',
        'data quality frameworks',
        'metadata management',
        'data privacy and compliance'
      ],
      handoffCriteria: []
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      dataLandscape: this.analyzeDataLandscape(task, context),
      dataVolume: this.analyzeDataVolume(task, context),
      dataVelocity: this.analyzeDataVelocity(task, context),
      dataVariety: this.analyzeDataVariety(task, context),
      dataGovernanceNeeds: this.analyzeDataGovernanceNeeds(task, context),
      complianceRequirements: this.analyzeComplianceRequirements(task, context),
      integrationComplexity: this.analyzeIntegrationComplexity(task, context),
      analyticsRequirements: this.analyzeAnalyticsRequirements(task, context),
      performanceRequirements: this.analyzePerformanceRequirements(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      dataArchitecture: this.recommendDataArchitecture(analysis, task),
      dataStorage: this.recommendDataStorage(analysis, task),
      dataIntegration: this.recommendDataIntegration(analysis, task),
      dataGovernance: this.recommendDataGovernance(analysis, task),
      masterDataManagement: this.recommendMasterDataManagement(analysis, task),
      dataQuality: this.recommendDataQuality(analysis, task),
      metadataManagement: this.recommendMetadataManagement(analysis, task),
      dataPrivacy: this.recommendDataPrivacy(analysis, task),
      analyticsStrategy: this.recommendAnalyticsStrategy(analysis, task),
      dataOperations: this.recommendDataOperations(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  analyzeDataLandscape(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const dataSourceTypes = {
      'transactional-systems': {
        indicators: ['database', 'transaction', 'erp', 'crm', 'oltp'],
        characteristics: ['structured-data', 'high-consistency', 'real-time-updates'],
        volume: 'medium-to-high',
        criticality: 'high'
      },
      'operational-systems': {
        indicators: ['logs', 'monitoring', 'events', 'metrics', 'telemetry'],
        characteristics: ['time-series-data', 'high-volume', 'real-time-streaming'],
        volume: 'very-high',
        criticality: 'medium'
      },
      'external-data': {
        indicators: ['third party', 'api', 'external feed', 'market data', 'social'],
        characteristics: ['varied-formats', 'external-dependencies', 'quality-concerns'],
        volume: 'variable',
        criticality: 'medium'
      },
      'unstructured-content': {
        indicators: ['documents', 'images', 'video', 'text', 'content'],
        characteristics: ['unstructured-format', 'large-files', 'metadata-rich'],
        volume: 'high',
        criticality: 'low-to-medium'
      },
      'analytical-systems': {
        indicators: ['reporting', 'analytics', 'bi', 'dashboard', 'olap'],
        characteristics: ['aggregated-data', 'historical-trends', 'read-heavy'],
        volume: 'medium',
        criticality: 'medium'
      }
    };
    
    const identifiedSources = [];
    Object.entries(dataSourceTypes).forEach(([sourceType, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        identifiedSources.push({
          sourceType,
          characteristics: config.characteristics,
          volume: config.volume,
          criticality: config.criticality,
          integrationComplexity: this.assessSourceIntegrationComplexity(sourceType)
        });
      }
    });
    
    if (identifiedSources.length === 0) {
      identifiedSources.push({
        sourceType: 'transactional-systems',
        characteristics: ['structured-data'],
        volume: 'medium',
        criticality: 'high',
        integrationComplexity: 'medium'
      });
    }
    
    return {
      sources: identifiedSources,
      dataDistribution: this.analyzeDataDistribution(identifiedSources),
      integrationPatterns: this.identifyRequiredIntegrationPatterns(identifiedSources),
      dataFlow: this.analyzeDataFlow(identifiedSources, taskText)
    };
  }
  
  analyzeDataVolume(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    // Extract volume indicators
    const volumeIndicators = {
      'big-data': ['big data', 'petabyte', 'terabyte', 'massive', 'large scale'],
      'high-volume': ['high volume', 'millions', 'billions', 'thousands'],
      'standard-volume': ['standard', 'normal', 'regular'],
      'low-volume': ['small', 'limited', 'minimal']
    };
    
    let volumeLevel = 'standard-volume';
    Object.entries(volumeIndicators).forEach(([level, indicators]) => {
      if (indicators.some(indicator => taskText.includes(indicator))) {
        volumeLevel = level;
      }
    });
    
    // Extract numerical indicators
    const numbers = taskText.match(/(\d+(?:,\d{3})*|\d+)\s*(petabyte|terabyte|gigabyte|million|billion|thousand)/gi);
    let estimatedVolume = 'unknown';
    
    if (numbers) {
      const maxNumber = this.extractMaxDataVolume(numbers);
      if (maxNumber >= 1000000000000) estimatedVolume = 'petabyte-scale';
      else if (maxNumber >= 1000000000) estimatedVolume = 'terabyte-scale';
      else if (maxNumber >= 1000000) estimatedVolume = 'gigabyte-scale';
      else estimatedVolume = 'megabyte-scale';
    }
    
    return {
      level: volumeLevel,
      estimatedVolume,
      growthRate: this.analyzeDataGrowthRate(taskText, context),
      retentionRequirements: this.analyzeRetentionRequirements(taskText, context),
      archivalStrategy: this.getArchivalStrategy(volumeLevel, taskText)
    };
  }
  
  analyzeDataVelocity(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const velocityTypes = {
      'real-time': {
        indicators: ['real-time', 'streaming', 'live', 'instant', 'immediate'],
        latency: 'milliseconds-to-seconds',
        processing: 'stream-processing',
        complexity: 'high'
      },
      'near-real-time': {
        indicators: ['near real-time', 'near-time', 'micro-batch', 'mini-batch'],
        latency: 'seconds-to-minutes',
        processing: 'micro-batch-processing',
        complexity: 'medium'
      },
      'batch': {
        indicators: ['batch', 'scheduled', 'periodic', 'daily', 'hourly'],
        latency: 'minutes-to-hours',
        processing: 'batch-processing',
        complexity: 'low'
      },
      'historical': {
        indicators: ['historical', 'archive', 'long-term', 'warehousing'],
        latency: 'hours-to-days',
        processing: 'bulk-processing',
        complexity: 'low'
      }
    };
    
    const detectedVelocities = [];
    Object.entries(velocityTypes).forEach(([velocity, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        detectedVelocities.push({
          velocity,
          latency: config.latency,
          processing: config.processing,
          complexity: config.complexity,
          priority: this.getVelocityPriority(velocity, taskText)
        });
      }
    });
    
    if (detectedVelocities.length === 0) {
      detectedVelocities.push({
        velocity: 'batch',
        latency: 'minutes-to-hours',
        processing: 'batch-processing',
        complexity: 'low',
        priority: 'medium'
      });
    }
    
    return {
      velocities: detectedVelocities,
      primaryVelocity: this.determinePrimaryVelocity(detectedVelocities),
      processingPatterns: this.getProcessingPatterns(detectedVelocities),
      infrastructureNeeds: this.getVelocityInfrastructureNeeds(detectedVelocities)
    };
  }
  
  analyzeDataVariety(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const dataTypes = {
      'structured': {
        indicators: ['database', 'sql', 'relational', 'table', 'structured'],
        formats: ['relational-database', 'csv', 'json', 'xml'],
        complexity: 'low',
        processing: 'sql-based'
      },
      'semi-structured': {
        indicators: ['json', 'xml', 'yaml', 'avro', 'parquet', 'semi-structured'],
        formats: ['json', 'xml', 'avro', 'parquet', 'orc'],
        complexity: 'medium',
        processing: 'schema-on-read'
      },
      'unstructured': {
        indicators: ['text', 'document', 'image', 'video', 'audio', 'unstructured'],
        formats: ['text-files', 'images', 'videos', 'documents', 'binaries'],
        complexity: 'high',
        processing: 'specialized-analytics'
      },
      'time-series': {
        indicators: ['time series', 'metrics', 'telemetry', 'sensor', 'iot'],
        formats: ['time-series-data', 'metrics', 'events'],
        complexity: 'medium',
        processing: 'time-series-analytics'
      },
      'graph': {
        indicators: ['graph', 'network', 'relationship', 'connected', 'social'],
        formats: ['graph-data', 'network-data', 'relationships'],
        complexity: 'high',
        processing: 'graph-analytics'
      }
    };
    
    const detectedTypes = [];
    Object.entries(dataTypes).forEach(([dataType, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        detectedTypes.push({
          dataType,
          formats: config.formats,
          complexity: config.complexity,
          processing: config.processing,
          prevalence: this.assessDataTypePrevalence(dataType, taskText)
        });
      }
    });
    
    if (detectedTypes.length === 0) {
      detectedTypes.push({
        dataType: 'structured',
        formats: ['relational-database'],
        complexity: 'low',
        processing: 'sql-based',
        prevalence: 'high'
      });
    }
    
    return {
      dataTypes: detectedTypes,
      varietyComplexity: this.calculateVarietyComplexity(detectedTypes),
      standardizationNeeds: this.getStandardizationNeeds(detectedTypes),
      processingRequirements: this.getVarietyProcessingRequirements(detectedTypes)
    };
  }
  
  analyzeDataGovernanceNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const governanceAreas = {
      'data-quality': {
        indicators: ['data quality', 'accuracy', 'completeness', 'consistency', 'validity'],
        importance: 'high',
        complexity: 'medium'
      },
      'data-lineage': {
        indicators: ['lineage', 'traceability', 'provenance', 'source tracking'],
        importance: 'high',
        complexity: 'high'
      },
      'data-catalog': {
        indicators: ['catalog', 'discovery', 'search', 'metadata', 'inventory'],
        importance: 'medium',
        complexity: 'medium'
      },
      'access-control': {
        indicators: ['access control', 'permissions', 'security', 'authorization'],
        importance: 'high',
        complexity: 'high'
      },
      'data-classification': {
        indicators: ['classification', 'sensitive', 'confidential', 'public'],
        importance: 'high',
        complexity: 'medium'
      },
      'privacy-protection': {
        indicators: ['privacy', 'gdpr', 'pii', 'personal data', 'anonymization'],
        importance: 'critical',
        complexity: 'high'
      }
    };
    
    const requiredAreas = [];
    Object.entries(governanceAreas).forEach(([area, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator)) ||
          this.isGovernanceAreaRequired(area, context)) {
        requiredAreas.push({
          area,
          importance: config.importance,
          complexity: config.complexity,
          priority: this.getGovernancePriority(area, config.importance)
        });
      }
    });
    
    return {
      areas: requiredAreas,
      overallGovernanceNeeds: this.calculateOverallGovernanceNeeds(requiredAreas),
      frameworkRecommendation: this.getGovernanceFrameworkRecommendation(requiredAreas),
      implementationApproach: this.getGovernanceImplementationApproach(requiredAreas)
    };
  }
  
  analyzeComplianceRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complianceFrameworks = {
      'gdpr': {
        indicators: ['gdpr', 'privacy', 'personal data', 'eu regulation'],
        requirements: ['consent-management', 'data-portability', 'right-to-erasure'],
        dataImpact: 'high'
      },
      'hipaa': {
        indicators: ['hipaa', 'healthcare', 'phi', 'medical'],
        requirements: ['data-encryption', 'access-controls', 'audit-trails'],
        dataImpact: 'high'
      },
      'pci-dss': {
        indicators: ['pci', 'payment', 'credit card', 'financial'],
        requirements: ['data-encryption', 'access-restrictions', 'monitoring'],
        dataImpact: 'medium'
      },
      'sox': {
        indicators: ['sox', 'financial reporting', 'sarbanes-oxley'],
        requirements: ['data-integrity', 'audit-trails', 'controls'],
        dataImpact: 'medium'
      },
      'ccpa': {
        indicators: ['ccpa', 'california', 'consumer privacy'],
        requirements: ['data-transparency', 'opt-out-rights', 'data-deletion'],
        dataImpact: 'high'
      }
    };
    
    const applicableFrameworks = [];
    Object.entries(complianceFrameworks).forEach(([framework, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        applicableFrameworks.push({
          framework,
          requirements: config.requirements,
          dataImpact: config.dataImpact,
          implementation: this.getComplianceImplementationNeeds(framework)
        });
      }
    });
    
    return {
      frameworks: applicableFrameworks,
      overallCompliance: this.calculateOverallComplianceImpact(applicableFrameworks),
      dataProtectionNeeds: this.getDataProtectionNeeds(applicableFrameworks),
      auditingRequirements: this.getAuditingRequirements(applicableFrameworks)
    };
  }
  
  analyzeIntegrationComplexity(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const integrationTypes = {
      'batch-etl': {
        indicators: ['etl', 'extract transform load', 'batch', 'scheduled'],
        complexity: 'medium',
        patterns: ['extract-transform-load', 'data-pipeline']
      },
      'real-time-streaming': {
        indicators: ['streaming', 'real-time', 'kafka', 'kinesis'],
        complexity: 'high',
        patterns: ['stream-processing', 'event-driven-architecture']
      },
      'api-integration': {
        indicators: ['api', 'rest', 'web service', 'microservice'],
        complexity: 'medium',
        patterns: ['api-gateway', 'service-mesh']
      },
      'database-replication': {
        indicators: ['replication', 'sync', 'cdc', 'change data capture'],
        complexity: 'high',
        patterns: ['change-data-capture', 'database-replication']
      },
      'file-based': {
        indicators: ['file', 'ftp', 'sftp', 'csv', 'excel'],
        complexity: 'low',
        patterns: ['file-transfer', 'batch-processing']
      }
    };
    
    const detectedIntegrations = [];
    Object.entries(integrationTypes).forEach(([integrationType, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        detectedIntegrations.push({
          integrationType,
          complexity: config.complexity,
          patterns: config.patterns,
          feasibility: this.assessIntegrationFeasibility(integrationType)
        });
      }
    });
    
    return {
      integrationTypes: detectedIntegrations,
      overallComplexity: this.calculateIntegrationComplexity(detectedIntegrations),
      recommendedPatterns: this.getRecommendedIntegrationPatterns(detectedIntegrations),
      toolingRequirements: this.getIntegrationToolingRequirements(detectedIntegrations)
    };
  }
  
  analyzeAnalyticsRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const analyticsTypes = {
      'descriptive': {
        indicators: ['reporting', 'dashboard', 'kpi', 'metrics', 'historical'],
        complexity: 'low',
        processing: 'batch-analytics'
      },
      'diagnostic': {
        indicators: ['drill down', 'root cause', 'why', 'analysis'],
        complexity: 'medium',
        processing: 'interactive-analytics'
      },
      'predictive': {
        indicators: ['predict', 'forecast', 'machine learning', 'ml', 'model'],
        complexity: 'high',
        processing: 'ml-analytics'
      },
      'prescriptive': {
        indicators: ['optimize', 'recommend', 'decision', 'action'],
        complexity: 'high',
        processing: 'advanced-analytics'
      },
      'real-time': {
        indicators: ['real-time analytics', 'live dashboard', 'instant', 'streaming analytics'],
        complexity: 'high',
        processing: 'stream-analytics'
      }
    };
    
    const requiredAnalytics = [];
    Object.entries(analyticsTypes).forEach(([analyticsType, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        requiredAnalytics.push({
          analyticsType,
          complexity: config.complexity,
          processing: config.processing,
          priority: this.getAnalyticsPriority(analyticsType, taskText)
        });
      }
    });
    
    if (requiredAnalytics.length === 0) {
      requiredAnalytics.push({
        analyticsType: 'descriptive',
        complexity: 'low',
        processing: 'batch-analytics',
        priority: 'medium'
      });
    }
    
    return {
      analyticsTypes: requiredAnalytics,
      overallComplexity: this.calculateAnalyticsComplexity(requiredAnalytics),
      platformRequirements: this.getAnalyticsPlatformRequirements(requiredAnalytics),
      skillRequirements: this.getAnalyticsSkillRequirements(requiredAnalytics)
    };
  }
  
  analyzePerformanceRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    return {
      queryPerformance: this.analyzeQueryPerformanceRequirements(taskText),
      dataLoadPerformance: this.analyzeDataLoadRequirements(taskText),
      concurrencyRequirements: this.analyzeConcurrencyRequirements(taskText),
      scalabilityNeeds: this.analyzeScalabilityNeeds(taskText, context),
      availabilityRequirements: this.analyzeAvailabilityRequirements(taskText)
    };
  }
  
  recommendDataArchitecture(analysis, task) {
    const { dataVolume, dataVelocity, dataVariety, analyticsRequirements, performanceRequirements } = analysis;
    
    if (dataVolume.level === 'big-data' && 
        dataVelocity.primaryVelocity === 'real-time' &&
        analyticsRequirements.overallComplexity === 'high') {
      return {
        architecture: 'lambda-architecture-with-data-mesh',
        rationale: 'Big data with real-time processing and complex analytics requires lambda architecture',
        layers: [
          'data-ingestion-layer',
          'stream-processing-layer',
          'batch-processing-layer',
          'serving-layer',
          'analytics-layer'
        ],
        components: [
          'distributed-messaging-system',
          'stream-processing-engine',
          'distributed-storage-system',
          'analytical-databases',
          'data-governance-platform'
        ],
        technologies: [
          'Apache-Kafka',
          'Apache-Spark-Streaming',
          'Apache-Hadoop-HDFS',
          'Apache-Druid',
          'Apache-Atlas'
        ],
        patterns: [
          'lambda-architecture',
          'data-mesh',
          'event-sourcing',
          'cqrs'
        ]
      };
    }
    
    if (dataVariety.varietyComplexity === 'high' && 
        analyticsRequirements.analyticsTypes.some(a => a.analyticsType === 'predictive')) {
      return {
        architecture: 'data-lakehouse-architecture',
        rationale: 'High data variety with ML requirements benefits from lakehouse approach',
        layers: [
          'data-ingestion-layer',
          'data-lake-storage-layer',
          'data-processing-layer',
          'data-warehouse-layer',
          'analytics-and-ml-layer'
        ],
        components: [
          'multi-format-ingestion-engine',
          'object-storage-system',
          'distributed-compute-engine',
          'analytical-query-engine',
          'ml-platform'
        ],
        technologies: [
          'Apache-Airflow',
          'Amazon-S3-Delta-Lake',
          'Apache-Spark',
          'Presto-Trino',
          'MLflow'
        ],
        patterns: [
          'data-lakehouse',
          'medallion-architecture',
          'feature-store',
          'ml-ops'
        ]
      };
    }
    
    if (performanceRequirements.queryPerformance === 'sub-second' &&
        analyticsRequirements.analyticsTypes.some(a => a.analyticsType === 'real-time')) {
      return {
        architecture: 'real-time-analytical-architecture',
        rationale: 'Sub-second query performance with real-time analytics requires specialized architecture',
        layers: [
          'real-time-ingestion-layer',
          'stream-processing-layer',
          'in-memory-storage-layer',
          'analytical-serving-layer'
        ],
        components: [
          'high-throughput-messaging',
          'stream-processing-cluster',
          'in-memory-databases',
          'real-time-analytics-engine'
        ],
        technologies: [
          'Apache-Pulsar',
          'Apache-Flink',
          'Redis-Cluster',
          'Apache-Pinot'
        ],
        patterns: [
          'kappa-architecture',
          'stream-processing',
          'in-memory-computing',
          'real-time-olap'
        ]
      };
    }
    
    return {
      architecture: 'modern-data-warehouse-architecture',
      rationale: 'Balanced approach suitable for most enterprise data requirements',
      layers: [
        'data-ingestion-layer',
        'data-staging-layer',
        'data-warehouse-layer',
        'data-mart-layer',
        'presentation-layer'
      ],
      components: [
        'etl-orchestration-engine',
        'staging-storage-system',
        'columnar-data-warehouse',
        'dimensional-data-marts',
        'bi-and-reporting-tools'
      ],
      technologies: [
        'Apache-Airflow',
        'Amazon-S3',
        'Snowflake-BigQuery',
        'dbt',
        'Tableau-PowerBI'
      ],
      patterns: [
        'etl-elt-pattern',
        'dimensional-modeling',
        'data-vault',
        'self-service-analytics'
      ]
    };
  }
  
  recommendDataStorage(analysis, task) {
    const { dataVolume, dataVelocity, dataVariety, performanceRequirements } = analysis;
    
    const storage = {
      approach: 'tiered-storage-strategy',
      tiers: []
    };
    
    // Hot tier for real-time access
    if (dataVelocity.velocities.some(v => v.velocity === 'real-time')) {
      storage.tiers.push({
        tier: 'hot-storage-tier',
        purpose: 'real-time-and-interactive-access',
        characteristics: ['low-latency', 'high-iops', 'expensive'],
        technologies: ['In-Memory-Databases', 'SSD-Storage', 'Columnar-Databases'],
        dataTypes: ['current-operational-data', 'real-time-analytics'],
        retention: '7-30 days'
      });
    }
    
    // Warm tier for frequent access
    storage.tiers.push({
      tier: 'warm-storage-tier',
      purpose: 'frequent-analytical-access',
      characteristics: ['balanced-performance-cost', 'scalable'],
      technologies: ['Cloud-Data-Warehouse', 'Distributed-Databases', 'Object-Storage'],
      dataTypes: ['historical-data', 'aggregated-data', 'reporting-data'],
      retention: '1-12 months'
    });
    
    // Cold tier for archival
    if (dataVolume.level === 'big-data' || dataVolume.level === 'high-volume') {
      storage.tiers.push({
        tier: 'cold-storage-tier',
        purpose: 'long-term-archival-and-compliance',
        characteristics: ['low-cost', 'high-capacity', 'slower-access'],
        technologies: ['Object-Storage-Archive', 'Tape-Storage', 'Compressed-Formats'],
        dataTypes: ['archived-data', 'compliance-data', 'backup-data'],
        retention: '1+ years'
      });
    }
    
    return {
      ...storage,
      dataLifecycleManagement: this.getDataLifecycleManagement(storage.tiers),
      compressionStrategy: this.getCompressionStrategy(dataVolume, dataVariety),
      partitioningStrategy: this.getPartitioningStrategy(dataVolume, performanceRequirements)
    };
  }
  
  recommendDataIntegration(analysis, task) {
    const { integrationComplexity, dataVelocity, dataVolume } = analysis;
    
    const integration = {
      approach: 'hybrid-integration-platform',
      patterns: []
    };
    
    // Batch integration pattern
    if (dataVelocity.velocities.some(v => v.velocity === 'batch')) {
      integration.patterns.push({
        pattern: 'batch-etl-integration',
        purpose: 'scheduled-bulk-data-processing',
        tools: ['Apache-Airflow', 'Apache-Spark', 'dbt', 'Talend'],
        frequency: 'scheduled-intervals',
        dataVolume: 'high-volume-batches'
      });
    }
    
    // Real-time integration pattern
    if (dataVelocity.velocities.some(v => v.velocity === 'real-time')) {
      integration.patterns.push({
        pattern: 'stream-processing-integration',
        purpose: 'real-time-data-processing',
        tools: ['Apache-Kafka', 'Apache-Flink', 'Confluent-Platform', 'AWS-Kinesis'],
        frequency: 'continuous-streaming',
        dataVolume: 'high-velocity-streams'
      });
    }
    
    // Change data capture pattern
    if (integrationComplexity.integrationTypes.some(i => i.integrationType === 'database-replication')) {
      integration.patterns.push({
        pattern: 'change-data-capture',
        purpose: 'real-time-database-synchronization',
        tools: ['Debezium', 'Maxwell', 'Oracle-GoldenGate', 'AWS-DMS'],
        frequency: 'real-time-changes',
        dataVolume: 'incremental-changes'
      });
    }
    
    // API integration pattern
    if (integrationComplexity.integrationTypes.some(i => i.integrationType === 'api-integration')) {
      integration.patterns.push({
        pattern: 'api-based-integration',
        purpose: 'service-to-service-data-exchange',
        tools: ['Apache-Camel', 'MuleSoft', 'Kong', 'Custom-APIs'],
        frequency: 'on-demand-or-scheduled',
        dataVolume: 'variable-based-on-api'
      });
    }
    
    return {
      ...integration,
      orchestration: this.getDataOrchestration(integration.patterns),
      qualityChecks: this.getIntegrationQualityChecks(),
      monitoring: this.getIntegrationMonitoring()
    };
  }
  
  recommendDataGovernance(analysis, task) {
    const { dataGovernanceNeeds, complianceRequirements } = analysis;
    
    const governance = {
      approach: 'comprehensive-data-governance-framework',
      components: []
    };
    
    // Data catalog and discovery
    if (dataGovernanceNeeds.areas.some(area => area.area === 'data-catalog')) {
      governance.components.push({
        component: 'data-catalog-and-discovery',
        purpose: 'centralized-data-asset-management',
        capabilities: ['automated-data-discovery', 'metadata-management', 'data-search', 'lineage-tracking'],
        technologies: ['Apache-Atlas', 'DataHub', 'Alation', 'Collibra'],
        integration: 'all-data-sources'
      });
    }
    
    // Data quality management
    if (dataGovernanceNeeds.areas.some(area => area.area === 'data-quality')) {
      governance.components.push({
        component: 'data-quality-management',
        purpose: 'ensure-data-accuracy-and-completeness',
        capabilities: ['data-profiling', 'quality-rules', 'anomaly-detection', 'quality-dashboards'],
        technologies: ['Great-Expectations', 'Talend-Data-Quality', 'Informatica-DQ', 'Monte-Carlo'],
        integration: 'data-pipelines-and-storage'
      });
    }
    
    // Access control and security
    if (dataGovernanceNeeds.areas.some(area => area.area === 'access-control')) {
      governance.components.push({
        component: 'data-access-control',
        purpose: 'secure-and-controlled-data-access',
        capabilities: ['role-based-access', 'attribute-based-access', 'data-masking', 'audit-logging'],
        technologies: ['Apache-Ranger', 'Privacera', 'Immuta', 'Native-Database-Security'],
        integration: 'identity-management-systems'
      });
    }
    
    // Data lineage and provenance
    if (dataGovernanceNeeds.areas.some(area => area.area === 'data-lineage')) {
      governance.components.push({
        component: 'data-lineage-tracking',
        purpose: 'track-data-flow-and-transformations',
        capabilities: ['automated-lineage-discovery', 'impact-analysis', 'data-provenance', 'change-tracking'],
        technologies: ['DataHub-Lineage', 'Apache-Atlas', 'Manta', 'Collibra-Lineage'],
        integration: 'etl-tools-and-databases'
      });
    }
    
    // Privacy and compliance
    if (complianceRequirements.frameworks.length > 0) {
      governance.components.push({
        component: 'privacy-and-compliance',
        purpose: 'ensure-regulatory-compliance',
        capabilities: ['data-classification', 'privacy-controls', 'consent-management', 'compliance-reporting'],
        technologies: ['OneTrust', 'Privacera', 'Microsoft-Purview', 'Varonis'],
        integration: 'all-data-processing-systems'
      });
    }
    
    return {
      ...governance,
      organizationStructure: this.getDataGovernanceOrganization(),
      policies: this.getDataGovernancePolicies(complianceRequirements),
      processes: this.getDataGovernanceProcesses()
    };
  }
  
  recommendMasterDataManagement(analysis, task) {
    const { dataLandscape, integrationComplexity, dataGovernanceNeeds } = analysis;
    
    if (!this.isMasterDataManagementNeeded(dataLandscape, integrationComplexity)) {
      return {
        recommendation: 'master-data-management-not-required',
        rationale: 'Limited data sources and low integration complexity'
      };
    }
    
    const mdm = {
      approach: 'hybrid-master-data-management',
      components: []
    };
    
    // Master data hub
    mdm.components.push({
      component: 'master-data-hub',
      purpose: 'centralized-master-data-management',
      capabilities: ['data-consolidation', 'golden-record-creation', 'data-synchronization'],
      technologies: ['Informatica-MDM', 'IBM-InfoSphere', 'Microsoft-MDS', 'Talend-MDM'],
      scope: 'critical-master-data-entities'
    });
    
    // Data stewardship
    mdm.components.push({
      component: 'data-stewardship-platform',
      purpose: 'collaborative-data-management',
      capabilities: ['data-validation', 'conflict-resolution', 'workflow-management', 'data-approval'],
      technologies: ['Collibra-Stewardship', 'Informatica-Stewardship', 'Custom-Workflows'],
      scope: 'all-master-data-domains'
    });
    
    // Data integration
    mdm.components.push({
      component: 'mdm-integration-services',
      purpose: 'distribute-master-data-to-systems',
      capabilities: ['real-time-sync', 'batch-distribution', 'api-services', 'change-notifications'],
      technologies: ['Integration-Platform', 'Message-Queues', 'API-Gateway'],
      scope: 'all-consuming-systems'
    });
    
    return {
      ...mdm,
      dataModel: this.getMasterDataModel(dataLandscape),
      governanceModel: this.getMdmGovernanceModel(),
      implementationStrategy: this.getMdmImplementationStrategy()
    };
  }
  
  recommendDataQuality(analysis, task) {
    const { dataGovernanceNeeds, integrationComplexity, analyticsRequirements } = analysis;
    
    const quality = {
      approach: 'proactive-data-quality-management',
      dimensions: []
    };
    
    // Data quality dimensions
    const qualityDimensions = [
      {
        dimension: 'accuracy',
        purpose: 'ensure-data-correctness',
        rules: ['format-validation', 'range-checks', 'reference-data-validation'],
        monitoring: 'automated-accuracy-checks'
      },
      {
        dimension: 'completeness',
        purpose: 'ensure-data-completeness',
        rules: ['null-value-checks', 'mandatory-field-validation', 'record-count-validation'],
        monitoring: 'completeness-trend-analysis'
      },
      {
        dimension: 'consistency',
        purpose: 'ensure-cross-system-consistency',
        rules: ['cross-reference-validation', 'business-rule-consistency', 'format-standardization'],
        monitoring: 'consistency-exception-tracking'
      },
      {
        dimension: 'timeliness',
        purpose: 'ensure-data-freshness',
        rules: ['sla-based-freshness-checks', 'data-arrival-monitoring', 'processing-time-tracking'],
        monitoring: 'timeliness-sla-monitoring'
      },
      {
        dimension: 'validity',
        purpose: 'ensure-data-validity',
        rules: ['business-rule-validation', 'domain-value-validation', 'relationship-validation'],
        monitoring: 'validity-exception-analysis'
      }
    ];
    
    quality.dimensions = qualityDimensions;
    
    return {
      ...quality,
      implementation: this.getDataQualityImplementation(),
      monitoring: this.getDataQualityMonitoring(),
      remediation: this.getDataQualityRemediation()
    };
  }
  
  recommendMetadataManagement(analysis, task) {
    const { dataLandscape, dataGovernanceNeeds } = analysis;
    
    const metadata = {
      approach: 'comprehensive-metadata-management',
      types: []
    };
    
    // Technical metadata
    metadata.types.push({
      type: 'technical-metadata',
      purpose: 'capture-system-and-structure-information',
      content: ['schema-definitions', 'data-types', 'constraints', 'indexes', 'statistics'],
      sources: ['databases', 'files', 'apis', 'applications'],
      automation: 'automated-discovery-and-harvesting'
    });
    
    // Business metadata
    metadata.types.push({
      type: 'business-metadata',
      purpose: 'capture-business-context-and-meaning',
      content: ['business-definitions', 'business-rules', 'ownership', 'usage-context'],
      sources: ['business-users', 'documentation', 'applications'],
      automation: 'collaborative-annotation-and-crowdsourcing'
    });
    
    // Operational metadata
    metadata.types.push({
      type: 'operational-metadata',
      purpose: 'capture-runtime-and-usage-information',
      content: ['access-patterns', 'performance-metrics', 'data-lineage', 'change-history'],
      sources: ['monitoring-systems', 'logs', 'profiling-tools'],
      automation: 'real-time-capture-and-analysis'
    });
    
    return {
      ...metadata,
      platform: this.getMetadataPlatform(metadata.types),
      integration: this.getMetadataIntegration(),
      governance: this.getMetadataGovernance()
    };
  }
  
  recommendDataPrivacy(analysis, task) {
    const { complianceRequirements, dataGovernanceNeeds } = analysis;
    
    if (complianceRequirements.frameworks.length === 0) {
      return {
        recommendation: 'basic-data-privacy-controls',
        rationale: 'No specific compliance requirements but basic privacy recommended'
      };
    }
    
    const privacy = {
      approach: 'privacy-by-design-framework',
      controls: []
    };
    
    // Data classification and discovery
    privacy.controls.push({
      control: 'sensitive-data-discovery-classification',
      purpose: 'identify-and-classify-sensitive-data',
      capabilities: ['automated-discovery', 'pattern-matching', 'ml-classification', 'risk-scoring'],
      technologies: ['Microsoft-Purview', 'Varonis', 'BigID', 'Spirion'],
      scope: 'all-data-repositories'
    });
    
    // Data minimization
    privacy.controls.push({
      control: 'data-minimization-controls',
      purpose: 'limit-data-collection-and-retention',
      capabilities: ['purpose-limitation', 'retention-management', 'data-reduction', 'consent-enforcement'],
      technologies: ['Custom-Policies', 'Automated-Purging', 'Consent-Management-Platform'],
      scope: 'all-personal-data-processing'
    });
    
    // Access controls
    privacy.controls.push({
      control: 'privacy-aware-access-controls',
      purpose: 'control-access-to-sensitive-data',
      capabilities: ['attribute-based-access', 'dynamic-masking', 'purpose-based-access', 'audit-logging'],
      technologies: ['Privacera', 'Immuta', 'Native-Database-Controls'],
      scope: 'all-sensitive-data-access'
    });
    
    // Subject rights management
    if (complianceRequirements.frameworks.some(f => f.framework === 'gdpr')) {
      privacy.controls.push({
        control: 'subject-rights-management',
        purpose: 'enable-data-subject-rights-exercise',
        capabilities: ['right-to-access', 'right-to-rectification', 'right-to-erasure', 'data-portability'],
        technologies: ['OneTrust', 'TrustArc', 'Custom-Portal'],
        scope: 'all-personal-data'
      });
    }
    
    return {
      ...privacy,
      policyFramework: this.getPrivacyPolicyFramework(complianceRequirements),
      riskAssessment: this.getPrivacyRiskAssessment(),
      training: this.getPrivacyTrainingProgram()
    };
  }
  
  recommendAnalyticsStrategy(analysis, task) {
    const { analyticsRequirements, dataVolume, dataVelocity } = analysis;
    
    const strategy = {
      approach: 'modern-analytics-platform',
      layers: []
    };
    
    // Self-service analytics layer
    if (analyticsRequirements.analyticsTypes.some(a => a.analyticsType === 'descriptive')) {
      strategy.layers.push({
        layer: 'self-service-analytics',
        purpose: 'enable-business-user-analytics',
        capabilities: ['drag-drop-interface', 'visual-query-builder', 'automated-insights'],
        technologies: ['Tableau', 'Power-BI', 'Looker', 'Qlik'],
        users: 'business-analysts-and-end-users'
      });
    }
    
    // Advanced analytics layer
    if (analyticsRequirements.analyticsTypes.some(a => a.analyticsType === 'predictive')) {
      strategy.layers.push({
        layer: 'advanced-analytics',
        purpose: 'enable-predictive-and-prescriptive-analytics',
        capabilities: ['machine-learning', 'statistical-modeling', 'optimization'],
        technologies: ['Apache-Spark-MLlib', 'Python-R', 'SAS', 'DataRobot'],
        users: 'data-scientists-and-analysts'
      });
    }
    
    // Real-time analytics layer
    if (dataVelocity.velocities.some(v => v.velocity === 'real-time')) {
      strategy.layers.push({
        layer: 'real-time-analytics',
        purpose: 'enable-streaming-and-real-time-analytics',
        capabilities: ['stream-processing', 'real-time-dashboards', 'alerting'],
        technologies: ['Apache-Kafka-Streams', 'Apache-Flink', 'ksqlDB', 'Apache-Pinot'],
        users: 'operational-teams-and-applications'
      });
    }
    
    return {
      ...strategy,
      dataPreparation: this.getDataPreparationStrategy(analyticsRequirements),
      visualization: this.getVisualizationStrategy(analyticsRequirements),
      deployment: this.getAnalyticsDeploymentStrategy()
    };
  }
  
  recommendDataOperations(analysis, task) {
    const { dataVolume, dataVelocity, integrationComplexity } = analysis;
    
    const operations = {
      approach: 'data-ops-automation-framework',
      components: []
    };
    
    // Data pipeline orchestration
    operations.components.push({
      component: 'pipeline-orchestration',
      purpose: 'automate-data-pipeline-execution',
      capabilities: ['workflow-scheduling', 'dependency-management', 'error-handling', 'monitoring'],
      technologies: ['Apache-Airflow', 'Prefect', 'Dagster', 'Azure-Data-Factory'],
      scope: 'all-data-pipelines'
    });
    
    // Data monitoring and observability
    operations.components.push({
      component: 'data-observability',
      purpose: 'monitor-data-health-and-performance',
      capabilities: ['data-freshness', 'data-volume', 'schema-changes', 'performance-metrics'],
      technologies: ['Monte-Carlo', 'Great-Expectations', 'dbt-docs', 'Custom-Monitoring'],
      scope: 'all-data-assets'
    });
    
    // Environment management
    operations.components.push({
      component: 'environment-management',
      purpose: 'manage-data-environments-and-deployments',
      capabilities: ['infrastructure-as-code', 'environment-provisioning', 'configuration-management'],
      technologies: ['Terraform', 'Kubernetes', 'Docker', 'Helm'],
      scope: 'all-data-infrastructure'
    });
    
    // Testing and validation
    operations.components.push({
      component: 'data-testing-validation',
      purpose: 'ensure-data-quality-and-pipeline-reliability',
      capabilities: ['data-validation', 'pipeline-testing', 'regression-testing', 'performance-testing'],
      technologies: ['Great-Expectations', 'dbt-test', 'pytest', 'Custom-Validators'],
      scope: 'all-data-processes'
    });
    
    return {
      ...operations,
      cicdPipeline: this.getDataOpsCiCd(),
      monitoring: this.getDataOpsMonitoring(),
      alerting: this.getDataOpsAlerting()
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { dataVolume, dataGovernanceNeeds, complianceRequirements, analyticsRequirements } = analysis;
    
    const steps = [
      'Data architecture design and technology selection',
      'Data storage and infrastructure setup',
      'Data integration platform implementation',
      'Data governance framework deployment',
      'Master data management implementation',
      'Data quality framework setup',
      'Analytics platform deployment',
      'Data privacy and compliance implementation',
      'Data operations and monitoring setup',
      'User training and adoption'
    ];
    
    if (complianceRequirements.frameworks.length > 0) {
      steps.splice(7, 0, 'Compliance audit and validation');
    }
    
    if (dataVolume.level === 'big-data') {
      steps.splice(2, 0, 'Big data platform and cluster setup');
    }
    
    return {
      steps,
      priority: 'critical',
      resources: this.getRequiredDataResources(analysis),
      timeline: this.calculateDataTimeline(steps.length, analysis),
      risks: this.identifyDataImplementationRisks(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'data-architecture-validation',
      'data-integration-testing',
      'data-quality-verification',
      'governance-framework-validation',
      'analytics-platform-testing'
    ];
    
    if (analysis.complianceRequirements.frameworks.length > 0) {
      baseChecks.push('compliance-audit', 'privacy-controls-validation');
    }
    
    if (analysis.dataVolume.level === 'big-data') {
      baseChecks.push('scalability-testing', 'performance-benchmarking');
    }
    
    if (analysis.analyticsRequirements.analyticsTypes.some(a => a.analyticsType === 'predictive')) {
      baseChecks.push('ml-model-validation', 'analytics-accuracy-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { dataVolume, dataGovernanceNeeds, complianceRequirements, analyticsRequirements, integrationComplexity } = analysis;
    
    let baseWeeks = 20; // Base data architecture implementation (5 months)
    
    // Data volume factors
    if (dataVolume.level === 'big-data') baseWeeks += 8;
    else if (dataVolume.level === 'high-volume') baseWeeks += 4;
    
    // Governance complexity
    if (dataGovernanceNeeds.overallGovernanceNeeds === 'high') baseWeeks += 8;
    else if (dataGovernanceNeeds.overallGovernanceNeeds === 'medium') baseWeeks += 4;
    
    // Compliance requirements
    const complexFrameworks = complianceRequirements.frameworks.filter(f => f.dataImpact === 'high').length;
    baseWeeks += complexFrameworks * 4;
    
    // Analytics complexity
    if (analyticsRequirements.overallComplexity === 'high') baseWeeks += 6;
    
    // Integration complexity
    if (integrationComplexity.overallComplexity === 'high') baseWeeks += 8;
    else if (integrationComplexity.overallComplexity === 'medium') baseWeeks += 4;
    
    return {
      estimate: `${baseWeeks}-${baseWeeks + 8} weeks`,
      confidence: 0.75,
      factors: [
        `Data volume: ${dataVolume.level}`,
        `Governance needs: ${dataGovernanceNeeds.overallGovernanceNeeds}`,
        `Compliance frameworks: ${complianceRequirements.frameworks.length}`,
        `Analytics complexity: ${analyticsRequirements.overallComplexity}`,
        `Integration complexity: ${integrationComplexity.overallComplexity}`
      ]
    };
  }
  
  getMaxComplexityHandled() {
    return 10; // Tier 3 handles maximum complexity
  }
  
  // Helper methods (key implementations)
  
  extractMaxDataVolume(numbers) {
    return Math.max(...numbers.map(n => {
      const num = parseInt(n.replace(/[^0-9]/g, ''));
      if (n.toLowerCase().includes('petabyte')) return num * 1000000000000;
      if (n.toLowerCase().includes('terabyte')) return num * 1000000000;
      if (n.toLowerCase().includes('gigabyte')) return num * 1000000;
      if (n.toLowerCase().includes('billion')) return num * 1000000000;
      if (n.toLowerCase().includes('million')) return num * 1000000;
      if (n.toLowerCase().includes('thousand')) return num * 1000;
      return num;
    }));
  }
  
  calculateOverallGovernanceNeeds(areas) {
    const criticalAreas = areas.filter(area => area.importance === 'critical').length;
    const highAreas = areas.filter(area => area.importance === 'high').length;
    
    if (criticalAreas > 0 || highAreas > 3) return 'high';
    if (highAreas > 1) return 'medium';
    return 'low';
  }
  
  isMasterDataManagementNeeded(dataLandscape, integrationComplexity) {
    const multipleSources = dataLandscape.sources.length > 2;
    const highIntegration = integrationComplexity.overallComplexity === 'high';
    const transactionalSources = dataLandscape.sources.some(s => s.sourceType === 'transactional-systems');
    
    return multipleSources && (highIntegration || transactionalSources);
  }
  
  getRequiredDataResources(analysis) {
    const resources = [
      'Data architecture expertise',
      'Data engineering team',
      'Data governance specialists',
      'Cloud data platform',
      'Data integration tools'
    ];
    
    if (analysis.dataVolume.level === 'big-data') {
      resources.push('Big data specialists', 'Distributed computing platform');
    }
    
    if (analysis.complianceRequirements.frameworks.length > 0) {
      resources.push('Compliance specialists', 'Privacy experts');
    }
    
    if (analysis.analyticsRequirements.analyticsTypes.some(a => a.analyticsType === 'predictive')) {
      resources.push('Data scientists', 'ML platform');
    }
    
    return resources;
  }
  
  identifyDataImplementationRisks(analysis) {
    const risks = ['data-migration-complexity', 'data-quality-issues'];
    
    if (analysis.dataVolume.level === 'big-data') {
      risks.push('scalability-challenges', 'performance-bottlenecks');
    }
    
    if (analysis.integrationComplexity.overallComplexity === 'high') {
      risks.push('integration-failures', 'data-synchronization-issues');
    }
    
    if (analysis.complianceRequirements.frameworks.length > 0) {
      risks.push('compliance-gaps', 'privacy-violations');
    }
    
    if (analysis.dataGovernanceNeeds.overallGovernanceNeeds === 'high') {
      risks.push('governance-adoption-challenges', 'organizational-resistance');
    }
    
    return risks;
  }
}

module.exports = DataArchitect;