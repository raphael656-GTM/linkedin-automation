const BaseSpecialist = require('../BaseSpecialist');

/**
 * ML Integration Specialist - Tier 2 Specialist
 * Domain: ML APIs, model serving, AI integration, model lifecycle
 * Prerequisites: Requires Integration Generalist consultation
 */
class MlIntegrationSpecialist extends BaseSpecialist {
  constructor() {
    super({
      id: 'ml-integration-specialist',
      name: 'ML Integration Specialist',
      domain: 'ml-integration',
      tier: 'TIER_2',
      prerequisites: ['integration-generalist-consultation'],
      expertise: [
        'ML model integration',
        'model serving architectures',
        'AI API integration',
        'model lifecycle management',
        'inference optimization',
        'ML pipeline design',
        'model monitoring',
        'A/B testing for ML',
        'feature store integration',
        'real-time ML serving'
      ],
      handoffCriteria: [
        {
          condition: 'enterprise-ai-architecture',
          reason: 'Enterprise-wide AI strategy requires system architect involvement',
          targetTier: 'TIER_3',
          targetSpecialist: 'system-architect'
        },
        {
          condition: 'data-governance-requirements',
          reason: 'Complex data governance and compliance requires data architect oversight',
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
      mlUseCase: this.analyzeMlUseCase(task, context),
      modelType: this.analyzeModelType(task, context),
      integrationPattern: this.analyzeIntegrationPattern(task, context),
      performanceRequirements: this.analyzePerformanceRequirements(task, context),
      scalingNeeds: this.analyzeScalingNeeds(task, context),
      dataRequirements: this.analyzeDataRequirements(task, context),
      monitoringNeeds: this.analyzeMonitoringNeeds(task, context),
      complianceRequirements: this.analyzeComplianceRequirements(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      integrationArchitecture: this.recommendIntegrationArchitecture(analysis, task),
      servingStrategy: this.recommendServingStrategy(analysis, task),
      modelLifecycle: this.recommendModelLifecycle(analysis, task),
      dataStrategy: this.recommendDataStrategy(analysis, task),
      performanceOptimization: this.recommendPerformanceOptimization(analysis, task),
      monitoringStrategy: this.recommendMonitoringStrategy(analysis, task),
      securityImplementation: this.recommendSecurityImplementation(analysis, task),
      testingStrategy: this.recommendTestingStrategy(analysis, task),
      deploymentStrategy: this.recommendDeploymentStrategy(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  analyzeMlUseCase(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const useCases = {
      'recommendation': {
        indicators: ['recommend', 'suggestion', 'personalization', 'collaborative filtering'],
        characteristics: ['user-behavior-analysis', 'content-matching', 'real-time-inference'],
        dataNeeds: ['user-interaction-data', 'item-features', 'behavior-logs']
      },
      'classification': {
        indicators: ['classify', 'categorize', 'predict', 'decision', 'label'],
        characteristics: ['supervised-learning', 'feature-extraction', 'confidence-scoring'],
        dataNeeds: ['labeled-training-data', 'feature-vectors', 'ground-truth-labels']
      },
      'natural-language-processing': {
        indicators: ['nlp', 'text', 'sentiment', 'translation', 'summarization', 'chatbot'],
        characteristics: ['text-processing', 'language-understanding', 'context-awareness'],
        dataNeeds: ['text-corpus', 'language-models', 'domain-specific-data']
      },
      'computer-vision': {
        indicators: ['vision', 'image', 'object detection', 'face recognition', 'ocr'],
        characteristics: ['image-processing', 'feature-detection', 'visual-analysis'],
        dataNeeds: ['image-datasets', 'annotation-data', 'visual-features']
      },
      'time-series-forecasting': {
        indicators: ['forecast', 'time series', 'prediction', 'trend', 'seasonal'],
        characteristics: ['temporal-analysis', 'pattern-recognition', 'future-prediction'],
        dataNeeds: ['historical-time-series', 'seasonal-patterns', 'external-factors']
      },
      'anomaly-detection': {
        indicators: ['anomaly', 'fraud', 'outlier', 'unusual', 'detection'],
        characteristics: ['pattern-deviation', 'threshold-detection', 'real-time-alerting'],
        dataNeeds: ['normal-behavior-patterns', 'anomaly-examples', 'baseline-metrics']
      },
      'generative-ai': {
        indicators: ['generate', 'create', 'gpt', 'llm', 'generative', 'content creation'],
        characteristics: ['content-generation', 'creative-output', 'prompt-engineering'],
        dataNeeds: ['training-corpus', 'prompt-templates', 'quality-examples']
      }
    };
    
    let detectedUseCase = 'classification'; // Default
    let useCaseConfig = useCases.classification;
    
    Object.entries(useCases).forEach(([useCase, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        detectedUseCase = useCase;
        useCaseConfig = config;
      }
    });
    
    return {
      type: detectedUseCase,
      characteristics: useCaseConfig.characteristics,
      dataNeeds: useCaseConfig.dataNeeds,
      complexity: this.assessUseCaseComplexity(detectedUseCase, taskText),
      businessValue: this.assessBusinessValue(detectedUseCase, taskText)
    };
  }
  
  analyzeModelType(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const modelTypes = {
      'pre-trained-api': {
        indicators: ['openai', 'gpt', 'azure cognitive', 'aws ml', 'google ai'],
        characteristics: ['managed-service', 'api-integration', 'no-training-required'],
        pros: ['quick-integration', 'maintained-by-provider', 'high-quality-results'],
        cons: ['vendor-lock-in', 'ongoing-costs', 'limited-customization']
      },
      'hosted-model': {
        indicators: ['hugging face', 'model hub', 'pre-trained model', 'fine-tune'],
        characteristics: ['existing-model', 'customizable', 'self-hosted'],
        pros: ['customizable', 'cost-control', 'domain-adaptation'],
        cons: ['infrastructure-required', 'maintenance-overhead', 'expertise-needed']
      },
      'custom-model': {
        indicators: ['custom model', 'train from scratch', 'proprietary', 'bespoke'],
        characteristics: ['built-for-purpose', 'full-control', 'high-investment'],
        pros: ['perfect-fit', 'competitive-advantage', 'full-ownership'],
        cons: ['high-cost', 'long-timeline', 'high-risk']
      },
      'hybrid-approach': {
        indicators: ['combine', 'ensemble', 'multiple models', 'hybrid'],
        characteristics: ['multiple-model-types', 'complex-integration', 'best-of-both'],
        pros: ['optimal-performance', 'risk-mitigation', 'flexibility'],
        cons: ['complex-architecture', 'higher-maintenance', 'integration-challenges']
      }
    };
    
    let detectedType = 'pre-trained-api'; // Default for quick start
    let modelConfig = modelTypes['pre-trained-api'];
    
    Object.entries(modelTypes).forEach(([type, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        detectedType = type;
        modelConfig = config;
      }
    });
    
    return {
      type: detectedType,
      characteristics: modelConfig.characteristics,
      advantages: modelConfig.pros,
      disadvantages: modelConfig.cons,
      investmentLevel: this.getInvestmentLevel(detectedType),
      timeToValue: this.getTimeToValue(detectedType)
    };
  }
  
  analyzeIntegrationPattern(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const patterns = {
      'batch-processing': {
        indicators: ['batch', 'bulk', 'scheduled', 'offline', 'periodic'],
        characteristics: ['scheduled-execution', 'large-data-volumes', 'delayed-results'],
        latency: 'high-latency-acceptable',
        throughput: 'high-throughput-required'
      },
      'real-time-inference': {
        indicators: ['real-time', 'live', 'instant', 'immediate', 'online'],
        characteristics: ['low-latency', 'single-prediction', 'user-facing'],
        latency: 'sub-second-required',
        throughput: 'moderate-throughput'
      },
      'streaming-processing': {
        indicators: ['stream', 'continuous', 'event-driven', 'kafka', 'streaming'],
        characteristics: ['continuous-processing', 'event-based', 'scalable'],
        latency: 'near-real-time',
        throughput: 'high-throughput-required'
      },
      'asynchronous-processing': {
        indicators: ['async', 'queue', 'background', 'job', 'worker'],
        characteristics: ['decoupled-processing', 'queue-based', 'fault-tolerant'],
        latency: 'moderate-latency-acceptable',
        throughput: 'scalable-throughput'
      }
    };
    
    let detectedPattern = 'real-time-inference'; // Default
    let patternConfig = patterns['real-time-inference'];
    
    Object.entries(patterns).forEach(([pattern, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        detectedPattern = pattern;
        patternConfig = config;
      }
    });
    
    return {
      pattern: detectedPattern,
      characteristics: patternConfig.characteristics,
      latencyRequirement: patternConfig.latency,
      throughputRequirement: patternConfig.throughput,
      architecturalImplications: this.getArchitecturalImplications(detectedPattern)
    };
  }
  
  analyzePerformanceRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const performance = {
      latency: this.analyzeLatencyRequirements(taskText),
      throughput: this.analyzeThroughputRequirements(taskText),
      accuracy: this.analyzeAccuracyRequirements(taskText),
      availability: this.analyzeAvailabilityRequirements(taskText),
      scalability: this.analyzeScalabilityRequirements(taskText)
    };
    
    return {
      ...performance,
      overallRequirement: this.categorizeOverallRequirement(performance),
      tradeoffs: this.identifyPerformanceTradeoffs(performance),
      optimization: this.getOptimizationStrategy(performance)
    };
  }
  
  analyzeScalingNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalingIndicators = [
      'scale', 'growth', 'users', 'traffic', 'load',
      'concurrent', 'throughput', 'volume'
    ];
    
    const needsScaling = scalingIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.expectedLoad === 'high';
    
    if (!needsScaling) {
      return { required: false, approach: 'single-instance' };
    }
    
    return {
      required: true,
      scalingType: this.determineScalingType(taskText),
      triggers: this.getScalingTriggers(taskText),
      constraints: this.getScalingConstraints(taskText, context),
      strategy: this.getScalingStrategy(taskText)
    };
  }
  
  analyzeDataRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    return {
      inputData: this.analyzeInputDataRequirements(taskText, context),
      trainingData: this.analyzeTrainingDataRequirements(taskText, context),
      featureStore: this.analyzeFeatureStoreRequirements(taskText, context),
      dataVolume: this.analyzeDataVolume(taskText, context),
      dataQuality: this.analyzeDataQuality(taskText, context),
      dataPipeline: this.analyzeDataPipelineRequirements(taskText, context)
    };
  }
  
  analyzeMonitoringNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    return {
      modelPerformance: this.getModelPerformanceMonitoring(taskText),
      dataQuality: this.getDataQualityMonitoring(taskText),
      systemHealth: this.getSystemHealthMonitoring(taskText),
      businessMetrics: this.getBusinessMetricsMonitoring(taskText),
      alerting: this.getAlertingStrategy(taskText, context),
      drift: this.getDriftDetection(taskText)
    };
  }
  
  analyzeComplianceRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complianceIndicators = {
      'gdpr': {
        indicators: ['gdpr', 'privacy', 'personal data', 'consent'],
        requirements: ['data-privacy', 'consent-management', 'right-to-explanation']
      },
      'bias-fairness': {
        indicators: ['bias', 'fairness', 'discrimination', 'equal'],
        requirements: ['bias-testing', 'fairness-metrics', 'model-explainability']
      },
      'explainability': {
        indicators: ['explainable', 'interpretable', 'transparent', 'reasoning'],
        requirements: ['model-interpretability', 'decision-explanations', 'audit-trail']
      },
      'security': {
        indicators: ['secure', 'confidential', 'protected', 'encrypted'],
        requirements: ['data-encryption', 'access-control', 'audit-logging']
      }
    };
    
    const requirements = [];
    Object.entries(complianceIndicators).forEach(([type, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        requirements.push({
          type,
          requirements: config.requirements,
          impact: this.getComplianceImpact(type)
        });
      }
    });
    
    return {
      required: requirements.length > 0,
      standards: requirements,
      overallImpact: this.calculateOverallComplianceImpact(requirements)
    };
  }
  
  recommendIntegrationArchitecture(analysis, task) {
    const { integrationPattern, modelType, performanceRequirements, scalingNeeds } = analysis;
    
    if (integrationPattern.pattern === 'real-time-inference' && 
        performanceRequirements.overallRequirement === 'high') {
      return {
        architecture: 'high-performance-ml-serving',
        rationale: 'Real-time inference with high performance requirements',
        components: [
          'model-serving-cluster',
          'inference-cache',
          'load-balancer',
          'monitoring-system'
        ],
        patterns: [
          'microservice-based-serving',
          'caching-layer',
          'circuit-breaker-pattern'
        ],
        technologies: [
          'TensorFlow-Serving',
          'ONNX-Runtime',
          'Redis-Cache',
          'Kubernetes'
        ]
      };
    }
    
    if (integrationPattern.pattern === 'batch-processing') {
      return {
        architecture: 'batch-ml-processing-pipeline',
        rationale: 'Batch processing pattern for high-volume data processing',
        components: [
          'data-ingestion-layer',
          'batch-processing-engine',
          'model-serving-cluster',
          'result-storage-layer'
        ],
        patterns: [
          'etl-pipeline-pattern',
          'batch-processing-pattern',
          'data-lake-pattern'
        ],
        technologies: [
          'Apache-Spark',
          'Apache-Airflow',
          'Kubernetes-Jobs',
          'Data-Lake-Storage'
        ]
      };
    }
    
    if (integrationPattern.pattern === 'streaming-processing') {
      return {
        architecture: 'streaming-ml-pipeline',
        rationale: 'Continuous stream processing for real-time ML',
        components: [
          'stream-ingestion',
          'feature-processing',
          'model-inference',
          'result-streaming'
        ],
        patterns: [
          'event-streaming-pattern',
          'stream-processing-pattern',
          'lambda-architecture'
        ],
        technologies: [
          'Apache-Kafka',
          'Apache-Flink',
          'Kubernetes-Streaming',
          'Redis-Streams'
        ]
      };
    }
    
    return {
      architecture: 'standard-ml-api-integration',
      rationale: 'Standard API-based integration for moderate requirements',
      components: [
        'api-gateway',
        'model-serving-service',
        'data-preprocessing',
        'response-formatting'
      ],
      patterns: [
        'api-gateway-pattern',
        'microservice-pattern',
        'data-transformation-pattern'
      ],
      technologies: [
        'REST-API',
        'Docker-Containers',
        'API-Gateway',
        'Monitoring-Tools'
      ]
    };
  }
  
  recommendServingStrategy(analysis, task) {
    const { modelType, performanceRequirements, scalingNeeds, integrationPattern } = analysis;
    
    const strategy = {
      approach: 'optimized-model-serving',
      components: []
    };
    
    // Model serving infrastructure
    if (modelType.type === 'pre-trained-api') {
      strategy.components.push({
        component: 'api-proxy-layer',
        purpose: 'manage-external-api-calls',
        implementation: 'rate-limiting-and-error-handling',
        tools: ['API-Gateway', 'Circuit-Breakers', 'Retry-Logic']
      });
    } else {
      strategy.components.push({
        component: 'model-serving-infrastructure',
        purpose: 'host-and-serve-ml-models',
        implementation: 'containerized-model-serving',
        tools: ['TensorFlow-Serving', 'ONNX-Runtime', 'Kubernetes']
      });
    }
    
    // Performance optimization
    if (performanceRequirements.overallRequirement === 'high') {
      strategy.components.push({
        component: 'inference-optimization',
        purpose: 'optimize-model-inference-performance',
        implementation: 'model-optimization-and-caching',
        tools: ['TensorRT', 'ONNX-Optimization', 'Inference-Cache']
      });
    }
    
    // Scaling strategy
    if (scalingNeeds.required) {
      strategy.components.push({
        component: 'auto-scaling-infrastructure',
        purpose: 'automatically-scale-based-on-demand',
        implementation: 'horizontal-pod-autoscaling',
        tools: ['Kubernetes-HPA', 'Custom-Metrics', 'Load-Balancer']
      });
    }
    
    // Model versioning and A/B testing
    strategy.components.push({
      component: 'model-versioning-and-testing',
      purpose: 'manage-model-versions-and-gradual-rollouts',
      implementation: 'canary-deployment-with-a-b-testing',
      tools: ['MLflow', 'Feature-Flags', 'Traffic-Splitting']
    });
    
    return strategy;
  }
  
  recommendModelLifecycle(analysis, task) {
    const { modelType, complianceRequirements, monitoringNeeds } = analysis;
    
    const lifecycle = {
      approach: 'comprehensive-model-lifecycle-management',
      phases: []
    };
    
    // Model development phase
    lifecycle.phases.push({
      phase: 'development',
      activities: [
        'data-exploration-and-preparation',
        'feature-engineering',
        'model-training-and-validation',
        'model-evaluation-and-testing'
      ],
      tools: ['Jupyter-Notebooks', 'MLflow', 'Weights-and-Biases', 'DVC'],
      outputs: ['trained-model', 'evaluation-metrics', 'experiment-logs']
    });
    
    // Model deployment phase
    lifecycle.phases.push({
      phase: 'deployment',
      activities: [
        'model-packaging-and-containerization',
        'deployment-pipeline-setup',
        'canary-deployment',
        'production-validation'
      ],
      tools: ['Docker', 'Kubernetes', 'CI-CD-Pipeline', 'Model-Registry'],
      outputs: ['deployed-model', 'deployment-metrics', 'health-checks']
    });
    
    // Model monitoring phase
    lifecycle.phases.push({
      phase: 'monitoring',
      activities: [
        'performance-monitoring',
        'data-drift-detection',
        'model-drift-detection',
        'business-impact-tracking'
      ],
      tools: ['Prometheus', 'Grafana', 'Evidently-AI', 'Custom-Dashboards'],
      outputs: ['monitoring-dashboards', 'drift-reports', 'performance-metrics']
    });
    
    // Model maintenance phase
    lifecycle.phases.push({
      phase: 'maintenance',
      activities: [
        'model-retraining',
        'feature-updates',
        'performance-optimization',
        'security-updates'
      ],
      tools: ['Automated-Retraining', 'Feature-Store', 'Security-Scanners'],
      outputs: ['updated-model', 'performance-improvements', 'security-patches']
    });
    
    // Compliance and governance
    if (complianceRequirements.required) {
      lifecycle.phases.push({
        phase: 'governance',
        activities: [
          'model-explainability-reporting',
          'bias-and-fairness-testing',
          'audit-trail-maintenance',
          'compliance-reporting'
        ],
        tools: ['SHAP', 'LIME', 'Fairness-Indicators', 'Audit-Tools'],
        outputs: ['explainability-reports', 'fairness-metrics', 'audit-logs']
      });
    }
    
    return lifecycle;
  }
  
  recommendDataStrategy(analysis, task) {
    const { dataRequirements, mlUseCase, performanceRequirements } = analysis;
    
    const strategy = {
      approach: 'end-to-end-data-strategy',
      components: []
    };
    
    // Data ingestion
    strategy.components.push({
      component: 'data-ingestion',
      purpose: 'collect-and-ingest-data-from-various-sources',
      patterns: ['batch-ingestion', 'real-time-streaming', 'api-based-collection'],
      tools: ['Apache-Kafka', 'Apache-Airflow', 'API-Connectors'],
      implementation: this.getDataIngestionImplementation(dataRequirements)
    });
    
    // Feature store
    if (dataRequirements.featureStore.required) {
      strategy.components.push({
        component: 'feature-store',
        purpose: 'centralized-feature-management-and-serving',
        patterns: ['online-feature-store', 'offline-feature-store', 'feature-versioning'],
        tools: ['Feast', 'Tecton', 'Custom-Feature-Store'],
        implementation: 'real-time-and-batch-feature-serving'
      });
    }
    
    // Data preprocessing
    strategy.components.push({
      component: 'data-preprocessing',
      purpose: 'clean-transform-and-prepare-data-for-ml',
      patterns: ['etl-pipeline', 'data-validation', 'feature-engineering'],
      tools: ['Apache-Spark', 'Pandas', 'Great-Expectations'],
      implementation: this.getPreprocessingImplementation(mlUseCase.type)
    });
    
    // Data quality monitoring
    strategy.components.push({
      component: 'data-quality-monitoring',
      purpose: 'ensure-data-quality-and-detect-issues',
      patterns: ['data-profiling', 'anomaly-detection', 'schema-validation'],
      tools: ['Great-Expectations', 'Monte-Carlo', 'Custom-Validators'],
      implementation: 'automated-data-quality-checks'
    });
    
    // Data governance
    if (analysis.complianceRequirements.required) {
      strategy.components.push({
        component: 'data-governance',
        purpose: 'ensure-compliance-and-data-governance',
        patterns: ['data-lineage', 'access-control', 'privacy-protection'],
        tools: ['Apache-Atlas', 'Data-Catalog', 'Privacy-Tools'],
        implementation: 'comprehensive-data-governance'
      });
    }
    
    return strategy;
  }
  
  recommendPerformanceOptimization(analysis, task) {
    const { performanceRequirements, modelType, integrationPattern } = analysis;
    
    const optimizations = [];
    
    // Model optimization
    if (performanceRequirements.latency.requirement === 'low') {
      optimizations.push({
        area: 'model-optimization',
        techniques: [
          'model-quantization',
          'model-pruning',
          'knowledge-distillation',
          'onnx-optimization'
        ],
        tools: ['TensorRT', 'ONNX-Runtime', 'Intel-OpenVINO'],
        expectedGain: '30-80% latency reduction'
      });
    }
    
    // Inference optimization
    optimizations.push({
      area: 'inference-optimization',
      techniques: [
        'batch-inference',
        'inference-caching',
        'dynamic-batching',
        'model-ensemble-optimization'
      ],
      tools: ['TensorFlow-Serving', 'Triton-Inference-Server', 'Custom-Batching'],
      expectedGain: '40-90% throughput improvement'
    });
    
    // Infrastructure optimization
    if (performanceRequirements.throughput.requirement === 'high') {
      optimizations.push({
        area: 'infrastructure-optimization',
        techniques: [
          'gpu-acceleration',
          'horizontal-scaling',
          'load-balancing',
          'connection-pooling'
        ],
        tools: ['NVIDIA-GPUs', 'Kubernetes-HPA', 'Load-Balancers'],
        expectedGain: '100-500% throughput improvement'
      });
    }
    
    // Data optimization
    optimizations.push({
      area: 'data-optimization',
      techniques: [
        'feature-preprocessing',
        'data-caching',
        'efficient-serialization',
        'compression'
      ],
      tools: ['Redis', 'Apache-Arrow', 'Compression-Libraries'],
      expectedGain: '20-60% data processing improvement'
    });
    
    return {
      strategy: 'comprehensive-performance-optimization',
      optimizations,
      monitoring: this.getPerformanceMonitoring(),
      testing: this.getPerformanceTestingStrategy()
    };
  }
  
  recommendMonitoringStrategy(analysis, task) {
    const { monitoringNeeds, performanceRequirements, complianceRequirements } = analysis;
    
    const strategy = {
      approach: 'comprehensive-ml-monitoring',
      components: []
    };
    
    // Model performance monitoring
    strategy.components.push({
      component: 'model-performance-monitoring',
      metrics: [
        'accuracy-metrics',
        'precision-recall-f1',
        'latency-metrics',
        'throughput-metrics',
        'error-rates'
      ],
      tools: ['MLflow', 'Weights-and-Biases', 'Custom-Dashboards'],
      alerting: 'performance-degradation-alerts'
    });
    
    // Data quality monitoring
    strategy.components.push({
      component: 'data-quality-monitoring',
      metrics: [
        'data-freshness',
        'schema-compliance',
        'data-completeness',
        'data-accuracy',
        'anomaly-detection'
      ],
      tools: ['Great-Expectations', 'Monte-Carlo', 'Evidently-AI'],
      alerting: 'data-quality-alerts'
    });
    
    // Model drift monitoring
    strategy.components.push({
      component: 'model-drift-monitoring',
      metrics: [
        'prediction-drift',
        'data-drift',
        'concept-drift',
        'feature-importance-changes',
        'distribution-changes'
      ],
      tools: ['Evidently-AI', 'Alibi-Detect', 'Custom-Drift-Detection'],
      alerting: 'model-drift-alerts'
    });
    
    // System health monitoring
    strategy.components.push({
      component: 'system-health-monitoring',
      metrics: [
        'inference-service-health',
        'resource-utilization',
        'api-response-times',
        'system-availability',
        'error-tracking'
      ],
      tools: ['Prometheus', 'Grafana', 'Jaeger', 'Sentry'],
      alerting: 'system-health-alerts'
    });
    
    // Business metrics monitoring
    strategy.components.push({
      component: 'business-metrics-monitoring',
      metrics: [
        'business-kpi-tracking',
        'user-engagement-metrics',
        'conversion-rates',
        'revenue-impact',
        'roi-tracking'
      ],
      tools: ['Custom-Analytics', 'Business-Intelligence-Tools'],
      alerting: 'business-impact-alerts'
    });
    
    return strategy;
  }
  
  recommendSecurityImplementation(analysis, task) {
    const { complianceRequirements, modelType, dataRequirements } = analysis;
    
    const security = {
      approach: 'comprehensive-ml-security',
      components: []
    };
    
    // Data security
    security.components.push({
      component: 'data-security',
      measures: [
        'data-encryption-at-rest',
        'data-encryption-in-transit',
        'access-control',
        'data-anonymization'
      ],
      tools: ['Encryption-Libraries', 'Key-Management', 'IAM-Systems'],
      compliance: 'gdpr-hipaa-compliance'
    });
    
    // Model security
    security.components.push({
      component: 'model-security',
      measures: [
        'model-encryption',
        'secure-model-serving',
        'model-access-control',
        'adversarial-attack-protection'
      ],
      tools: ['Secure-Enclaves', 'Model-Encryption', 'Access-Control'],
      compliance: 'intellectual-property-protection'
    });
    
    // API security
    security.components.push({
      component: 'api-security',
      measures: [
        'api-authentication',
        'api-authorization',
        'rate-limiting',
        'input-validation',
        'output-sanitization'
      ],
      tools: ['OAuth2', 'API-Keys', 'Rate-Limiters', 'Validation-Libraries'],
      compliance: 'secure-api-access'
    });
    
    // Audit and compliance
    if (complianceRequirements.required) {
      security.components.push({
        component: 'audit-and-compliance',
        measures: [
          'audit-logging',
          'compliance-reporting',
          'model-explainability',
          'bias-detection'
        ],
        tools: ['Audit-Tools', 'Compliance-Dashboards', 'Explainability-Tools'],
        compliance: complianceRequirements.standards.map(s => s.type).join('-')
      });
    }
    
    return security;
  }
  
  recommendTestingStrategy(analysis, task) {
    const { mlUseCase, modelType, performanceRequirements } = analysis;
    
    const testingStrategy = {
      approach: 'comprehensive-ml-testing',
      testTypes: []
    };
    
    // Model testing
    testingStrategy.testTypes.push({
      type: 'model-testing',
      purpose: 'validate-model-performance-and-behavior',
      tests: [
        'accuracy-testing',
        'performance-testing',
        'edge-case-testing',
        'robustness-testing'
      ],
      tools: ['Testing-Frameworks', 'Model-Validation', 'Custom-Tests']
    });
    
    // Data testing
    testingStrategy.testTypes.push({
      type: 'data-testing',
      purpose: 'validate-data-quality-and-consistency',
      tests: [
        'data-schema-validation',
        'data-quality-testing',
        'data-drift-testing',
        'feature-consistency-testing'
      ],
      tools: ['Great-Expectations', 'Data-Validation-Tools']
    });
    
    // Integration testing
    testingStrategy.testTypes.push({
      type: 'integration-testing',
      purpose: 'test-end-to-end-ml-pipeline',
      tests: [
        'pipeline-integration-testing',
        'api-integration-testing',
        'performance-integration-testing',
        'error-handling-testing'
      ],
      tools: ['Testing-Frameworks', 'API-Testing-Tools']
    });
    
    // A/B testing
    testingStrategy.testTypes.push({
      type: 'ab-testing',
      purpose: 'validate-model-improvements-in-production',
      tests: [
        'model-version-comparison',
        'business-metric-testing',
        'user-experience-testing',
        'statistical-significance-testing'
      ],
      tools: ['Feature-Flags', 'A-B-Testing-Platforms', 'Statistical-Tools']
    });
    
    return testingStrategy;
  }
  
  recommendDeploymentStrategy(analysis, task) {
    const { integrationPattern, performanceRequirements, scalingNeeds } = analysis;
    
    const strategy = {
      approach: 'progressive-ml-deployment',
      phases: []
    };
    
    // Development deployment
    strategy.phases.push({
      phase: 'development',
      environment: 'dev-environment',
      strategy: 'rapid-iteration-deployment',
      tools: ['Docker', 'Local-Kubernetes', 'Development-Tools']
    });
    
    // Staging deployment
    strategy.phases.push({
      phase: 'staging',
      environment: 'production-like-staging',
      strategy: 'full-integration-testing',
      tools: ['Staging-Cluster', 'Load-Testing-Tools', 'Monitoring-Tools']
    });
    
    // Production deployment
    if (performanceRequirements.overallRequirement === 'high') {
      strategy.phases.push({
        phase: 'production',
        environment: 'high-performance-production',
        strategy: 'canary-deployment-with-monitoring',
        tools: ['Production-Kubernetes', 'Load-Balancers', 'Monitoring-Stack']
      });
    } else {
      strategy.phases.push({
        phase: 'production',
        environment: 'standard-production',
        strategy: 'blue-green-deployment',
        tools: ['Production-Environment', 'Deployment-Automation']
      });
    }
    
    return strategy;
  }
  
  getImplementationGuidance(analysis, task) {
    const { mlUseCase, modelType, integrationPattern, dataRequirements } = analysis;
    
    const steps = [
      'ML requirements analysis and use case definition',
      'Model selection and acquisition/training planning',
      'Data strategy and pipeline development',
      'ML serving infrastructure setup',
      'Integration development and testing',
      'Performance optimization and tuning',
      'Monitoring and observability implementation',
      'Security and compliance implementation',
      'Testing and validation',
      'Production deployment and rollout'
    ];
    
    if (dataRequirements.featureStore.required) {
      steps.splice(3, 0, 'Feature store setup and integration');
    }
    
    if (analysis.complianceRequirements.required) {
      steps.splice(-2, 0, 'Compliance validation and audit preparation');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredMlResources(analysis),
      timeline: this.calculateMlTimeline(steps.length, analysis),
      risks: this.identifyMlImplementationRisks(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'model-performance-validation',
      'integration-testing',
      'data-quality-validation',
      'performance-benchmarking',
      'security-testing'
    ];
    
    if (analysis.complianceRequirements.required) {
      baseChecks.push('compliance-validation', 'bias-fairness-testing', 'explainability-testing');
    }
    
    if (analysis.performanceRequirements.overallRequirement === 'high') {
      baseChecks.push('load-testing', 'stress-testing', 'latency-testing');
    }
    
    if (analysis.scalingNeeds.required) {
      baseChecks.push('scaling-validation', 'auto-scaling-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { mlUseCase, modelType, integrationPattern, dataRequirements, complianceRequirements } = analysis;
    
    let baseDays = 10; // Base ML integration implementation
    
    // Model type complexity
    if (modelType.type === 'custom-model') baseDays += 8;
    else if (modelType.type === 'hosted-model') baseDays += 4;
    else if (modelType.type === 'hybrid-approach') baseDays += 6;
    
    // Use case complexity
    if (mlUseCase.complexity === 'high') baseDays += 5;
    else if (mlUseCase.complexity === 'medium') baseDays += 3;
    
    // Integration complexity
    if (integrationPattern.pattern === 'streaming-processing') baseDays += 4;
    else if (integrationPattern.pattern === 'batch-processing') baseDays += 3;
    
    // Data requirements
    if (dataRequirements.featureStore.required) baseDays += 3;
    if (dataRequirements.dataPipeline.complexity === 'high') baseDays += 4;
    
    // Compliance requirements
    if (complianceRequirements.required) baseDays += 5;
    
    return {
      estimate: `${baseDays}-${baseDays + 5} days`,
      confidence: 0.75,
      factors: [
        `Model type: ${modelType.type}`,
        `Use case complexity: ${mlUseCase.complexity}`,
        `Integration pattern: ${integrationPattern.pattern}`,
        `Compliance required: ${complianceRequirements.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'enterprise-ai-architecture':
        return analysis.scalingNeeds.required &&
               analysis.complianceRequirements.required &&
               (task.description?.toLowerCase().includes('enterprise') ||
                task.description?.toLowerCase().includes('organization-wide'));
      
      case 'data-governance-requirements':
        return analysis.complianceRequirements.required &&
               analysis.complianceRequirements.standards.length > 2 &&
               analysis.dataRequirements.dataVolume.level === 'high';
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 8;
  }
  
  // Helper methods (key implementations due to space constraints)
  
  assessUseCaseComplexity(useCase, taskText) {
    const complexityFactors = {
      'recommendation': taskText.includes('real-time') ? 'high' : 'medium',
      'classification': taskText.includes('multi-class') || taskText.includes('complex') ? 'high' : 'medium',
      'natural-language-processing': taskText.includes('custom') || taskText.includes('domain-specific') ? 'high' : 'medium',
      'computer-vision': taskText.includes('real-time') || taskText.includes('video') ? 'high' : 'medium',
      'time-series-forecasting': taskText.includes('multi-variate') ? 'high' : 'medium',
      'anomaly-detection': taskText.includes('real-time') ? 'high' : 'medium',
      'generative-ai': 'high' // Always high complexity
    };
    return complexityFactors[useCase] || 'medium';
  }
  
  getInvestmentLevel(modelType) {
    const investments = {
      'pre-trained-api': 'low',
      'hosted-model': 'medium',
      'custom-model': 'high',
      'hybrid-approach': 'high'
    };
    return investments[modelType] || 'medium';
  }
  
  getTimeToValue(modelType) {
    const timeframes = {
      'pre-trained-api': '1-2 weeks',
      'hosted-model': '2-4 weeks',
      'custom-model': '2-6 months',
      'hybrid-approach': '1-3 months'
    };
    return timeframes[modelType] || '4-8 weeks';
  }
  
  getRequiredMlResources(analysis) {
    const resources = [
      'ML framework (TensorFlow/PyTorch)',
      'Model serving infrastructure',
      'Data processing tools',
      'Monitoring and observability tools'
    ];
    
    if (analysis.modelType.type !== 'pre-trained-api') {
      resources.push('GPU/TPU infrastructure', 'Model training resources');
    }
    
    if (analysis.dataRequirements.featureStore.required) {
      resources.push('Feature store infrastructure');
    }
    
    if (analysis.complianceRequirements.required) {
      resources.push('Compliance and audit tools', 'Explainability frameworks');
    }
    
    return resources;
  }
  
  identifyMlImplementationRisks(analysis) {
    const risks = ['model-performance-degradation', 'data-quality-issues'];
    
    if (analysis.modelType.type === 'custom-model') {
      risks.push('training-complexity', 'model-development-delays');
    }
    
    if (analysis.integrationPattern.pattern === 'real-time-inference') {
      risks.push('latency-requirements-not-met', 'scaling-challenges');
    }
    
    if (analysis.complianceRequirements.required) {
      risks.push('compliance-validation-failures', 'bias-detection-issues');
    }
    
    if (analysis.dataRequirements.dataVolume.level === 'high') {
      risks.push('data-pipeline-complexity', 'data-processing-bottlenecks');
    }
    
    return risks;
  }
}

module.exports = MlIntegrationSpecialist;