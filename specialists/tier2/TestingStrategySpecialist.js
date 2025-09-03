const BaseSpecialist = require('../BaseSpecialist');

/**
 * Testing Strategy Specialist - Tier 2 Specialist
 * Domain: Test automation, CI/CD, testing frameworks, quality assurance
 * Prerequisites: Requires Architecture Generalist consultation
 */
class TestingStrategySpecialist extends BaseSpecialist {
  constructor() {
    super({
      id: 'testing-strategy-specialist',
      name: 'Testing Strategy Specialist',
      domain: 'testing-strategy',
      tier: 'TIER_2',
      prerequisites: ['architecture-generalist-consultation'],
      expertise: [
        'test automation frameworks',
        'CI/CD pipeline testing',
        'testing pyramids and strategies',
        'performance testing',
        'security testing',
        'integration testing',
        'contract testing',
        'test data management',
        'quality gates',
        'testing in production'
      ],
      handoffCriteria: [
        {
          condition: 'enterprise-testing-governance',
          reason: 'Enterprise-wide testing governance requires governance architect oversight',
          targetTier: 'TIER_3',
          targetSpecialist: 'governance-architect'
        },
        {
          condition: 'complex-distributed-testing',
          reason: 'Complex distributed system testing requires system architect involvement',
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
      applicationArchitecture: this.analyzeApplicationArchitecture(task, context),
      testingScope: this.analyzeTestingScope(task, context),
      qualityRequirements: this.analyzeQualityRequirements(task, context),
      automationNeeds: this.analyzeAutomationNeeds(task, context),
      cicdIntegration: this.analyzeCicdIntegration(task, context),
      testDataNeeds: this.analyzeTestDataNeeds(task, context),
      performanceTestingNeeds: this.analyzePerformanceTestingNeeds(task, context),
      securityTestingNeeds: this.analyzeSecurityTestingNeeds(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      testingStrategy: this.recommendTestingStrategy(analysis, task),
      testingFrameworks: this.recommendTestingFrameworks(analysis, task),
      testAutomation: this.recommendTestAutomation(analysis, task),
      cicdIntegration: this.recommendCicdIntegration(analysis, task),
      testDataStrategy: this.recommendTestDataStrategy(analysis, task),
      qualityGates: this.recommendQualityGates(analysis, task),
      performanceTesting: this.recommendPerformanceTesting(analysis, task),
      securityTesting: this.recommendSecurityTesting(analysis, task),
      testEnvironments: this.recommendTestEnvironments(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  analyzeApplicationArchitecture(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const architectures = {
      'monolithic': {
        indicators: ['monolith', 'single application', 'traditional app'],
        characteristics: ['single-deployment-unit', 'shared-database', 'internal-communication'],
        testingImplications: ['integration-heavy', 'end-to-end-focus', 'single-test-suite']
      },
      'microservices': {
        indicators: ['microservice', 'service-oriented', 'distributed', 'api-based'],
        characteristics: ['multiple-services', 'independent-deployment', 'network-communication'],
        testingImplications: ['contract-testing', 'service-isolation', 'distributed-testing']
      },
      'serverless': {
        indicators: ['serverless', 'lambda', 'function', 'faas'],
        characteristics: ['event-driven', 'stateless-functions', 'managed-infrastructure'],
        testingImplications: ['function-unit-testing', 'event-testing', 'integration-challenges']
      },
      'spa': {
        indicators: ['single page', 'react', 'angular', 'vue', 'frontend'],
        characteristics: ['client-heavy', 'api-dependent', 'browser-based'],
        testingImplications: ['ui-testing-focus', 'api-contract-testing', 'browser-automation']
      },
      'mobile': {
        indicators: ['mobile', 'ios', 'android', 'react native', 'flutter'],
        characteristics: ['device-specific', 'platform-dependent', 'app-store-distribution'],
        testingImplications: ['device-testing', 'platform-testing', 'performance-focus']
      }
    };
    
    let detectedArchitecture = 'monolithic'; // Default
    let archConfig = architectures.monolithic;
    
    Object.entries(architectures).forEach(([arch, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        detectedArchitecture = arch;
        archConfig = config;
      }
    });
    
    return {
      type: detectedArchitecture,
      characteristics: archConfig.characteristics,
      testingImplications: archConfig.testingImplications,
      complexity: this.assessArchitecturalComplexity(detectedArchitecture, taskText)
    };
  }
  
  analyzeTestingScope(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scopes = {
      'unit': {
        indicators: ['unit test', 'component test', 'individual function', 'isolated'],
        coverage: 'function-level',
        priority: this.getScopePriority('unit', taskText)
      },
      'integration': {
        indicators: ['integration', 'component interaction', 'module interaction'],
        coverage: 'component-interaction',
        priority: this.getScopePriority('integration', taskText)
      },
      'system': {
        indicators: ['system test', 'end-to-end', 'e2e', 'full workflow'],
        coverage: 'complete-system',
        priority: this.getScopePriority('system', taskText)
      },
      'acceptance': {
        indicators: ['acceptance', 'user acceptance', 'uat', 'business requirements'],
        coverage: 'business-requirements',
        priority: this.getScopePriority('acceptance', taskText)
      },
      'performance': {
        indicators: ['performance', 'load', 'stress', 'scalability'],
        coverage: 'non-functional-requirements',
        priority: this.getScopePriority('performance', taskText)
      },
      'security': {
        indicators: ['security', 'vulnerability', 'penetration', 'auth'],
        coverage: 'security-requirements',
        priority: this.getScopePriority('security', taskText)
      }
    };
    
    const requiredScopes = [];
    Object.entries(scopes).forEach(([scope, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator)) || 
          config.priority === 'high') {
        requiredScopes.push({
          scope,
          coverage: config.coverage,
          priority: config.priority,
          rationale: this.getScopeRationale(scope, taskText)
        });
      }
    });
    
    // Ensure minimum scopes
    if (requiredScopes.length === 0) {
      requiredScopes.push(
        { scope: 'unit', coverage: 'function-level', priority: 'high', rationale: 'Essential for code quality' },
        { scope: 'integration', coverage: 'component-interaction', priority: 'medium', rationale: 'Verify component interactions' }
      );
    }
    
    return {
      scopes: requiredScopes,
      testingPyramid: this.getTestingPyramid(requiredScopes),
      overallComplexity: this.calculateScopeComplexity(requiredScopes)
    };
  }
  
  analyzeQualityRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    return {
      codeCoverage: this.analyzeCoverageRequirements(taskText, context),
      qualityMetrics: this.analyzeQualityMetrics(taskText, context),
      defectTolerance: this.analyzeDefectTolerance(taskText, context),
      performanceTargets: this.analyzePerformanceTargets(taskText, context),
      reliabilityRequirements: this.analyzeReliabilityRequirements(taskText, context),
      maintainabilityRequirements: this.analyzeMaintainabilityRequirements(taskText, context)
    };
  }
  
  analyzeAutomationNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const automationFactors = {
      'frequency': this.analyzeTestFrequency(taskText),
      'repeatability': this.analyzeRepeatabilityNeeds(taskText),
      'regression': this.analyzeRegressionTestingNeeds(taskText),
      'cicd': this.analyzeCicdRequirements(taskText),
      'maintenance': this.analyzeMaintenanceOverhead(taskText)
    };
    
    const automationLevel = this.calculateAutomationLevel(automationFactors);
    
    return {
      level: automationLevel,
      factors: automationFactors,
      priorityAreas: this.identifyAutomationPriorities(automationFactors),
      constraints: this.identifyAutomationConstraints(taskText, context),
      roi: this.assessAutomationRoi(automationFactors, context)
    };
  }
  
  analyzeCicdIntegration(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const cicdIndicators = [
      'ci/cd', 'continuous integration', 'continuous deployment',
      'pipeline', 'automated deployment', 'devops'
    ];
    
    const hasCicd = cicdIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.hasCicdPipeline;
    
    if (!hasCicd) {
      return { required: false, recommendation: 'consider-cicd-adoption' };
    }
    
    return {
      required: true,
      integrationPoints: this.identifyIntegrationPoints(taskText),
      qualityGates: this.identifyQualityGates(taskText),
      pipelineStages: this.getPipelineStages(taskText),
      toolingRequirements: this.getCicdToolingRequirements(taskText, context)
    };
  }
  
  analyzeTestDataNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    return {
      dataTypes: this.identifyTestDataTypes(taskText),
      dataVolume: this.assessTestDataVolume(taskText, context),
      dataGeneration: this.analyzeDataGenerationNeeds(taskText),
      dataPrivacy: this.analyzeDataPrivacyRequirements(taskText, context),
      dataManagement: this.analyzeDataManagementNeeds(taskText, context),
      environments: this.analyzeTestEnvironmentDataNeeds(taskText)
    };
  }
  
  analyzePerformanceTestingNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const performanceIndicators = [
      'performance', 'load', 'stress', 'scalability',
      'response time', 'throughput', 'latency'
    ];
    
    const needsPerformanceTesting = performanceIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.performanceCritical;
    
    if (!needsPerformanceTesting) {
      return { required: false };
    }
    
    return {
      required: true,
      testTypes: this.identifyPerformanceTestTypes(taskText),
      targets: this.identifyPerformanceTargets(taskText, context),
      scenarios: this.identifyPerformanceScenarios(taskText),
      tools: this.getPerformanceTestingTools(taskText),
      environments: this.getPerformanceTestEnvironments(taskText)
    };
  }
  
  analyzeSecurityTestingNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const securityIndicators = [
      'security', 'authentication', 'authorization', 'encryption',
      'vulnerability', 'penetration', 'owasp', 'security scan'
    ];
    
    const needsSecurityTesting = securityIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.securityCritical || context.publicFacing;
    
    if (!needsSecurityTesting) {
      return { required: false };
    }
    
    return {
      required: true,
      testTypes: this.identifySecurityTestTypes(taskText),
      vulnerabilities: this.identifyTargetVulnerabilities(taskText),
      compliance: this.identifySecurityCompliance(taskText, context),
      tools: this.getSecurityTestingTools(taskText),
      frequency: this.getSecurityTestingFrequency(taskText, context)
    };
  }
  
  recommendTestingStrategy(analysis, task) {
    const { applicationArchitecture, testingScope, qualityRequirements } = analysis;
    
    if (applicationArchitecture.type === 'microservices') {
      return {
        strategy: 'microservices-testing-strategy',
        rationale: 'Distributed architecture requires specialized testing approach',
        pyramid: {
          'unit-tests': '60%',
          'integration-tests': '25%',
          'contract-tests': '10%',
          'end-to-end-tests': '5%'
        },
        patterns: [
          'consumer-driven-contract-testing',
          'service-virtualization',
          'distributed-tracing-for-testing',
          'chaos-engineering'
        ],
        focus: [
          'service-isolation',
          'api-contract-validation',
          'inter-service-communication',
          'distributed-system-resilience'
        ]
      };
    }
    
    if (applicationArchitecture.type === 'spa') {
      return {
        strategy: 'frontend-focused-testing-strategy',
        rationale: 'Client-heavy architecture requires frontend testing emphasis',
        pyramid: {
          'unit-tests': '50%',
          'component-tests': '30%',
          'integration-tests': '15%',
          'e2e-tests': '5%'
        },
        patterns: [
          'component-testing',
          'visual-regression-testing',
          'cross-browser-testing',
          'accessibility-testing'
        ],
        focus: [
          'ui-component-behavior',
          'user-interaction-flows',
          'browser-compatibility',
          'performance-metrics'
        ]
      };
    }
    
    if (qualityRequirements.reliabilityRequirements.level === 'critical') {
      return {
        strategy: 'high-reliability-testing-strategy',
        rationale: 'Critical reliability requirements demand comprehensive testing',
        pyramid: {
          'unit-tests': '40%',
          'integration-tests': '30%',
          'system-tests': '20%',
          'chaos-tests': '10%'
        },
        patterns: [
          'property-based-testing',
          'mutation-testing',
          'chaos-engineering',
          'canary-testing'
        ],
        focus: [
          'fault-tolerance',
          'error-recovery',
          'system-resilience',
          'graceful-degradation'
        ]
      };
    }
    
    return {
      strategy: 'balanced-testing-strategy',
      rationale: 'Balanced approach suitable for standard applications',
      pyramid: {
        'unit-tests': '70%',
        'integration-tests': '20%',
        'end-to-end-tests': '10%'
      },
      patterns: [
        'test-driven-development',
        'behavior-driven-development',
        'risk-based-testing'
      ],
      focus: [
        'code-quality',
        'functional-correctness',
        'user-workflows'
      ]
    };
  }
  
  recommendTestingFrameworks(analysis, task) {
    const { applicationArchitecture, testingScope, automationNeeds } = analysis;
    
    const frameworks = {
      unit: this.getUnitTestingFrameworks(applicationArchitecture.type),
      integration: this.getIntegrationTestingFrameworks(applicationArchitecture.type),
      e2e: this.getE2eTestingFrameworks(applicationArchitecture.type),
      performance: this.getPerformanceTestingFrameworks(analysis.performanceTestingNeeds),
      security: this.getSecurityTestingFrameworks(analysis.securityTestingNeeds)
    };
    
    return {
      frameworks,
      rationale: this.getFrameworkRationale(frameworks, applicationArchitecture.type),
      integration: this.getFrameworkIntegration(frameworks),
      toolchain: this.getTestingToolchain(frameworks, automationNeeds.level)
    };
  }
  
  recommendTestAutomation(analysis, task) {
    const { automationNeeds, cicdIntegration, applicationArchitecture } = analysis;
    
    const automation = {
      strategy: 'progressive-test-automation',
      approach: this.getAutomationApproach(automationNeeds.level),
      priorities: []
    };
    
    // High-priority automation areas
    if (automationNeeds.priorityAreas.includes('regression')) {
      automation.priorities.push({
        area: 'regression-test-automation',
        priority: 'high',
        approach: 'automated-regression-suite',
        tools: ['test-framework', 'ci-cd-integration'],
        expectedRoi: '80-90% time savings'
      });
    }
    
    if (automationNeeds.priorityAreas.includes('smoke')) {
      automation.priorities.push({
        area: 'smoke-test-automation',
        priority: 'high',
        approach: 'critical-path-automation',
        tools: ['e2e-framework', 'deployment-integration'],
        expectedRoi: '60-80% validation time savings'
      });
    }
    
    // Medium-priority automation areas
    if (automationNeeds.priorityAreas.includes('api')) {
      automation.priorities.push({
        area: 'api-test-automation',
        priority: 'medium',
        approach: 'contract-based-api-testing',
        tools: ['api-testing-framework', 'mock-services'],
        expectedRoi: '70-85% api validation savings'
      });
    }
    
    // Infrastructure automation
    automation.priorities.push({
      area: 'test-infrastructure-automation',
      priority: 'medium',
      approach: 'containerized-test-environments',
      tools: ['docker', 'kubernetes', 'infrastructure-as-code'],
      expectedRoi: '50-70% environment setup savings'
    });
    
    return {
      ...automation,
      implementation: this.getAutomationImplementation(automationNeeds),
      maintenance: this.getAutomationMaintenance(automationNeeds),
      metrics: this.getAutomationMetrics()
    };
  }
  
  recommendCicdIntegration(analysis, task) {
    const { cicdIntegration, qualityRequirements, testingScope } = analysis;
    
    if (!cicdIntegration.required) {
      return {
        recommendation: 'implement-basic-cicd-with-testing',
        rationale: 'CI/CD integration essential for automated quality gates'
      };
    }
    
    const integration = {
      strategy: 'comprehensive-cicd-testing-integration',
      stages: []
    };
    
    // Build stage testing
    integration.stages.push({
      stage: 'build',
      tests: ['unit-tests', 'static-analysis', 'dependency-check'],
      gates: ['code-coverage-threshold', 'static-analysis-pass'],
      failFast: true,
      duration: '2-5 minutes'
    });
    
    // Integration stage testing
    if (testingScope.scopes.some(s => s.scope === 'integration')) {
      integration.stages.push({
        stage: 'integration',
        tests: ['integration-tests', 'contract-tests', 'component-tests'],
        gates: ['integration-test-pass', 'contract-compliance'],
        failFast: true,
        duration: '5-15 minutes'
      });
    }
    
    // System stage testing
    if (testingScope.scopes.some(s => s.scope === 'system')) {
      integration.stages.push({
        stage: 'system',
        tests: ['system-tests', 'e2e-tests', 'smoke-tests'],
        gates: ['critical-path-validation', 'system-health-check'],
        failFast: false,
        duration: '10-30 minutes'
      });
    }
    
    // Performance stage testing
    if (analysis.performanceTestingNeeds.required) {
      integration.stages.push({
        stage: 'performance',
        tests: ['performance-tests', 'load-tests'],
        gates: ['performance-threshold-compliance'],
        failFast: false,
        duration: '15-60 minutes'
      });
    }
    
    // Security stage testing
    if (analysis.securityTestingNeeds.required) {
      integration.stages.push({
        stage: 'security',
        tests: ['security-scans', 'vulnerability-tests'],
        gates: ['security-compliance', 'vulnerability-threshold'],
        failFast: false,
        duration: '5-20 minutes'
      });
    }
    
    return {
      ...integration,
      parallelization: this.getParallelizationStrategy(integration.stages),
      environments: this.getCicdTestEnvironments(integration.stages),
      reporting: this.getCicdReporting()
    };
  }
  
  recommendTestDataStrategy(analysis, task) {
    const { testDataNeeds, applicationArchitecture, qualityRequirements } = analysis;
    
    const strategy = {
      approach: 'comprehensive-test-data-management',
      components: []
    };
    
    // Test data generation
    strategy.components.push({
      component: 'test-data-generation',
      approach: this.getDataGenerationApproach(testDataNeeds.dataGeneration),
      tools: this.getDataGenerationTools(testDataNeeds.dataTypes),
      automation: 'automated-data-generation'
    });
    
    // Test data management
    if (testDataNeeds.dataVolume.level === 'high') {
      strategy.components.push({
        component: 'test-data-management',
        approach: 'centralized-test-data-management',
        tools: ['test-data-management-platform', 'data-versioning'],
        automation: 'data-lifecycle-automation'
      });
    }
    
    // Data privacy and masking
    if (testDataNeeds.dataPrivacy.required) {
      strategy.components.push({
        component: 'data-privacy-protection',
        approach: 'automated-data-masking-and-anonymization',
        tools: ['data-masking-tools', 'synthetic-data-generators'],
        compliance: testDataNeeds.dataPrivacy.standards
      });
    }
    
    // Environment-specific data
    strategy.components.push({
      component: 'environment-data-management',
      approach: 'environment-specific-data-provisioning',
      tools: ['infrastructure-as-code', 'data-seeding-automation'],
      environments: testDataNeeds.environments
    });
    
    return strategy;
  }
  
  recommendQualityGates(analysis, task) {
    const { qualityRequirements, testingScope, cicdIntegration } = analysis;
    
    const gates = [];
    
    // Code quality gates
    gates.push({
      gate: 'code-quality-gate',
      metrics: [
        `code-coverage >= ${qualityRequirements.codeCoverage.target}%`,
        'static-analysis-violations = 0',
        'code-complexity <= acceptable-threshold'
      ],
      enforcement: 'blocking',
      stage: 'build'
    });
    
    // Functional quality gates
    gates.push({
      gate: 'functional-quality-gate',
      metrics: [
        'unit-test-pass-rate = 100%',
        'integration-test-pass-rate >= 95%',
        'critical-path-tests = 100%'
      ],
      enforcement: 'blocking',
      stage: 'integration'
    });
    
    // Performance quality gates
    if (analysis.performanceTestingNeeds.required) {
      gates.push({
        gate: 'performance-quality-gate',
        metrics: [
          `response-time <= ${qualityRequirements.performanceTargets.responseTime}`,
          `throughput >= ${qualityRequirements.performanceTargets.throughput}`,
          'error-rate <= 0.1%'
        ],
        enforcement: 'warning-then-blocking',
        stage: 'performance'
      });
    }
    
    // Security quality gates
    if (analysis.securityTestingNeeds.required) {
      gates.push({
        gate: 'security-quality-gate',
        metrics: [
          'critical-vulnerabilities = 0',
          'high-vulnerabilities <= 2',
          'security-scan-pass = true'
        ],
        enforcement: 'blocking',
        stage: 'security'
      });
    }
    
    return {
      gates,
      enforcement: this.getGateEnforcement(gates),
      reporting: this.getGateReporting(),
      escalation: this.getGateEscalation()
    };
  }
  
  recommendPerformanceTesting(analysis, task) {
    const { performanceTestingNeeds, applicationArchitecture, qualityRequirements } = analysis;
    
    if (!performanceTestingNeeds.required) {
      return {
        required: false,
        recommendation: 'consider-basic-performance-testing'
      };
    }
    
    const strategy = {
      approach: 'comprehensive-performance-testing',
      testTypes: []
    };
    
    // Load testing
    strategy.testTypes.push({
      type: 'load-testing',
      purpose: 'validate-normal-load-performance',
      scenarios: performanceTestingNeeds.scenarios.filter(s => s.type === 'normal-load'),
      tools: performanceTestingNeeds.tools,
      frequency: 'every-release'
    });
    
    // Stress testing
    if (performanceTestingNeeds.testTypes.includes('stress')) {
      strategy.testTypes.push({
        type: 'stress-testing',
        purpose: 'identify-breaking-points',
        scenarios: performanceTestingNeeds.scenarios.filter(s => s.type === 'stress'),
        tools: performanceTestingNeeds.tools,
        frequency: 'major-releases'
      });
    }
    
    // Spike testing
    if (applicationArchitecture.type === 'microservices') {
      strategy.testTypes.push({
        type: 'spike-testing',
        purpose: 'validate-auto-scaling-behavior',
        scenarios: ['sudden-load-increase', 'traffic-spikes'],
        tools: performanceTestingNeeds.tools,
        frequency: 'infrastructure-changes'
      });
    }
    
    // Endurance testing
    if (qualityRequirements.reliabilityRequirements.level === 'high') {
      strategy.testTypes.push({
        type: 'endurance-testing',
        purpose: 'validate-long-running-stability',
        scenarios: ['sustained-load', 'memory-leak-detection'],
        tools: performanceTestingNeeds.tools,
        frequency: 'quarterly'
      });
    }
    
    return strategy;
  }
  
  recommendSecurityTesting(analysis, task) {
    const { securityTestingNeeds, applicationArchitecture, qualityRequirements } = analysis;
    
    if (!securityTestingNeeds.required) {
      return {
        required: false,
        recommendation: 'implement-basic-security-scanning'
      };
    }
    
    const strategy = {
      approach: 'layered-security-testing',
      layers: []
    };
    
    // Static security analysis
    strategy.layers.push({
      layer: 'static-analysis',
      purpose: 'identify-code-level-vulnerabilities',
      tools: ['sonarqube', 'checkmarx', 'veracode'],
      frequency: 'every-commit',
      integration: 'ci-pipeline'
    });
    
    // Dynamic security testing
    strategy.layers.push({
      layer: 'dynamic-analysis',
      purpose: 'identify-runtime-vulnerabilities',
      tools: ['owasp-zap', 'burp-suite', 'nessus'],
      frequency: 'every-deployment',
      integration: 'cd-pipeline'
    });
    
    // Dependency scanning
    strategy.layers.push({
      layer: 'dependency-scanning',
      purpose: 'identify-vulnerable-dependencies',
      tools: ['snyk', 'dependabot', 'npm-audit'],
      frequency: 'daily',
      integration: 'automated-monitoring'
    });
    
    // Penetration testing
    if (securityTestingNeeds.compliance.includes('external-audit')) {
      strategy.layers.push({
        layer: 'penetration-testing',
        purpose: 'comprehensive-security-validation',
        tools: ['external-security-firm', 'internal-red-team'],
        frequency: 'quarterly',
        integration: 'manual-process'
      });
    }
    
    return strategy;
  }
  
  recommendTestEnvironments(analysis, task) {
    const { applicationArchitecture, testingScope, cicdIntegration } = analysis;
    
    const environments = [];
    
    // Development environment
    environments.push({
      environment: 'development',
      purpose: 'developer-testing-and-debugging',
      testTypes: ['unit-tests', 'component-tests'],
      infrastructure: 'local-development',
      dataStrategy: 'minimal-test-data',
      maintenance: 'developer-managed'
    });
    
    // Integration environment
    if (testingScope.scopes.some(s => s.scope === 'integration')) {
      environments.push({
        environment: 'integration',
        purpose: 'integration-testing-and-api-validation',
        testTypes: ['integration-tests', 'contract-tests'],
        infrastructure: 'shared-infrastructure',
        dataStrategy: 'realistic-test-data',
        maintenance: 'automated-provisioning'
      });
    }
    
    // Staging environment
    environments.push({
      environment: 'staging',
      purpose: 'pre-production-validation',
      testTypes: ['system-tests', 'e2e-tests', 'acceptance-tests'],
      infrastructure: 'production-like',
      dataStrategy: 'production-like-data',
      maintenance: 'infrastructure-team-managed'
    });
    
    // Performance environment
    if (analysis.performanceTestingNeeds.required) {
      environments.push({
        environment: 'performance',
        purpose: 'performance-and-load-testing',
        testTypes: ['load-tests', 'stress-tests', 'performance-tests'],
        infrastructure: 'high-performance-dedicated',
        dataStrategy: 'large-volume-test-data',
        maintenance: 'performance-team-managed'
      });
    }
    
    // Security environment
    if (analysis.securityTestingNeeds.required) {
      environments.push({
        environment: 'security',
        purpose: 'security-testing-and-vulnerability-assessment',
        testTypes: ['security-scans', 'penetration-tests'],
        infrastructure: 'isolated-security-environment',
        dataStrategy: 'anonymized-production-data',
        maintenance: 'security-team-managed'
      });
    }
    
    return {
      environments,
      provisioning: this.getEnvironmentProvisioning(environments),
      management: this.getEnvironmentManagement(environments),
      costs: this.getEnvironmentCosts(environments)
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { testingScope, automationNeeds, cicdIntegration } = analysis;
    
    const steps = [
      'Testing strategy definition and framework selection',
      'Test environment setup and configuration',
      'Core testing framework implementation',
      'Test data management setup',
      'Test automation implementation',
      'CI/CD integration and quality gates',
      'Performance testing implementation',
      'Security testing integration',
      'Monitoring and reporting setup',
      'Team training and process documentation'
    ];
    
    if (analysis.performanceTestingNeeds.required) {
      steps.splice(6, 0, 'Performance testing environment setup');
    }
    
    if (analysis.securityTestingNeeds.required) {
      steps.splice(-2, 0, 'Security testing tools integration');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredTestingResources(analysis),
      timeline: this.calculateTestingTimeline(steps.length, analysis),
      risks: this.identifyTestingImplementationRisks(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'testing-framework-validation',
      'test-coverage-verification',
      'automation-effectiveness-testing',
      'ci-cd-integration-validation',
      'quality-gate-functionality-testing'
    ];
    
    if (analysis.performanceTestingNeeds.required) {
      baseChecks.push('performance-testing-validation', 'load-testing-accuracy');
    }
    
    if (analysis.securityTestingNeeds.required) {
      baseChecks.push('security-testing-effectiveness', 'vulnerability-detection-validation');
    }
    
    if (analysis.applicationArchitecture.type === 'microservices') {
      baseChecks.push('contract-testing-validation', 'service-isolation-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { testingScope, automationNeeds, applicationArchitecture, performanceTestingNeeds, securityTestingNeeds } = analysis;
    
    let baseDays = 8; // Base testing strategy implementation
    
    // Complexity factors
    if (applicationArchitecture.complexity === 'high') baseDays += 4;
    else if (applicationArchitecture.complexity === 'medium') baseDays += 2;
    
    // Scope factors
    const scopeCount = testingScope.scopes.length;
    baseDays += scopeCount * 1.5;
    
    // Automation factors
    if (automationNeeds.level === 'high') baseDays += 6;
    else if (automationNeeds.level === 'medium') baseDays += 3;
    
    // Additional testing types
    if (performanceTestingNeeds.required) baseDays += 3;
    if (securityTestingNeeds.required) baseDays += 2;
    
    return {
      estimate: `${baseDays}-${baseDays + 4} days`,
      confidence: 0.8,
      factors: [
        `Architecture complexity: ${applicationArchitecture.complexity}`,
        `Testing scopes: ${scopeCount}`,
        `Automation level: ${automationNeeds.level}`,
        `Performance testing: ${performanceTestingNeeds.required}`,
        `Security testing: ${securityTestingNeeds.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'enterprise-testing-governance':
        return analysis.qualityRequirements.reliabilityRequirements.level === 'critical' &&
               analysis.testingScope.overallComplexity === 'high' &&
               (task.description?.toLowerCase().includes('enterprise') ||
                task.description?.toLowerCase().includes('governance'));
      
      case 'complex-distributed-testing':
        return analysis.applicationArchitecture.type === 'microservices' &&
               analysis.applicationArchitecture.complexity === 'high' &&
               analysis.testingScope.scopes.length > 4;
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 8;
  }
  
  // Helper methods (key implementations)
  
  assessArchitecturalComplexity(architecture, taskText) {
    const complexityFactors = {
      'monolithic': taskText.includes('large') || taskText.includes('complex') ? 'medium' : 'low',
      'microservices': taskText.includes('many services') || taskText.includes('distributed') ? 'high' : 'medium',
      'serverless': taskText.includes('many functions') || taskText.includes('complex workflow') ? 'medium' : 'low',
      'spa': taskText.includes('complex ui') || taskText.includes('many components') ? 'medium' : 'low',
      'mobile': taskText.includes('multiple platforms') || taskText.includes('complex features') ? 'high' : 'medium'
    };
    return complexityFactors[architecture] || 'medium';
  }
  
  getScopePriority(scope, taskText) {
    if (taskText.includes(scope)) return 'high';
    
    const implicitPriorities = {
      'unit': 'high', // Always high priority
      'integration': taskText.includes('api') || taskText.includes('service') ? 'high' : 'medium',
      'system': taskText.includes('workflow') || taskText.includes('user journey') ? 'high' : 'medium',
      'acceptance': taskText.includes('business') || taskText.includes('requirement') ? 'high' : 'low',
      'performance': taskText.includes('scale') || taskText.includes('load') ? 'high' : 'low',
      'security': taskText.includes('secure') || taskText.includes('auth') ? 'high' : 'low'
    };
    
    return implicitPriorities[scope] || 'medium';
  }
  
  calculateAutomationLevel(factors) {
    let score = 0;
    
    if (factors.frequency === 'high') score += 3;
    else if (factors.frequency === 'medium') score += 2;
    else score += 1;
    
    if (factors.repeatability === 'high') score += 3;
    if (factors.regression === 'critical') score += 3;
    if (factors.cicd === 'required') score += 2;
    if (factors.maintenance === 'low') score += 2;
    
    if (score >= 10) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  }
  
  getUnitTestingFrameworks(architectureType) {
    const frameworks = {
      'monolithic': ['Jest', 'Mocha', 'Jasmine'],
      'microservices': ['Jest', 'Mocha', 'TestNG'],
      'serverless': ['Jest', 'AVA', 'AWS-SAM-CLI'],
      'spa': ['Jest', 'Vitest', 'Karma'],
      'mobile': ['Jest', 'XCTest', 'Espresso']
    };
    return frameworks[architectureType] || frameworks['monolithic'];
  }
  
  getRequiredTestingResources(analysis) {
    const resources = [
      'Testing frameworks and tools',
      'CI/CD pipeline integration',
      'Test environment infrastructure',
      'Test data management tools'
    ];
    
    if (analysis.automationNeeds.level === 'high') {
      resources.push('Test automation engineers', 'Automation infrastructure');
    }
    
    if (analysis.performanceTestingNeeds.required) {
      resources.push('Performance testing tools', 'Load testing infrastructure');
    }
    
    if (analysis.securityTestingNeeds.required) {
      resources.push('Security testing tools', 'Security testing expertise');
    }
    
    return resources;
  }
  
  identifyTestingImplementationRisks(analysis) {
    const risks = ['test-maintenance-overhead', 'automation-brittleness'];
    
    if (analysis.applicationArchitecture.type === 'microservices') {
      risks.push('distributed-testing-complexity', 'service-dependency-management');
    }
    
    if (analysis.automationNeeds.level === 'high') {
      risks.push('automation-technical-debt', 'test-data-management-complexity');
    }
    
    if (analysis.performanceTestingNeeds.required) {
      risks.push('performance-test-environment-costs', 'performance-baseline-drift');
    }
    
    if (analysis.securityTestingNeeds.required) {
      risks.push('false-positive-security-alerts', 'security-testing-pipeline-slowdown');
    }
    
    return risks;
  }
}

module.exports = TestingStrategySpecialist;