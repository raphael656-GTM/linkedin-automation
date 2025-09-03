const BaseSpecialist = require('../BaseSpecialist');

/**
 * API Design Specialist - Tier 2 Specialist
 * Domain: REST, GraphQL, versioning, documentation
 * Prerequisites: Requires Integration Generalist consultation
 */
class ApiDesignSpecialist extends BaseSpecialist {
  constructor() {
    super({
      id: 'api-design-specialist',
      name: 'API Design Specialist',
      domain: 'api-design',
      tier: 'TIER_2',
      prerequisites: ['integration-generalist-consultation'],
      expertise: [
        'REST API design',
        'GraphQL schema design',
        'API versioning strategies',
        'OpenAPI specification',
        'API documentation',
        'rate limiting',
        'API security',
        'response optimization',
        'error handling patterns',
        'API gateway patterns'
      ],
      handoffCriteria: [
        {
          condition: 'enterprise-integration-architecture',
          reason: 'Enterprise-wide API strategy requires integration architect oversight',
          targetTier: 'TIER_3',
          targetSpecialist: 'integration-architect'
        },
        {
          condition: 'complex-microservices-orchestration',
          reason: 'Complex service orchestration requires system architect involvement',
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
      apiType: this.determineApiType(task),
      complexityLevel: this.analyzeApiComplexity(task, context),
      versioningNeeds: this.analyzeVersioningNeeds(task, context),
      securityRequirements: this.analyzeSecurityRequirements(task, context),
      performanceRequirements: this.analyzePerformanceRequirements(task, context),
      documentationNeeds: this.analyzeDocumentationNeeds(task, context),
      clientTypes: this.analyzeClientTypes(task, context),
      dataComplexity: this.analyzeDataComplexity(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      apiArchitecture: this.recommendApiArchitecture(analysis, task),
      designPatterns: this.recommendDesignPatterns(analysis, task),
      versioningStrategy: this.recommendVersioningStrategy(analysis, task),
      securityImplementation: this.recommendSecurityImplementation(analysis, task),
      documentationStrategy: this.recommendDocumentationStrategy(analysis, task),
      performanceOptimization: this.recommendPerformanceOptimization(analysis, task),
      errorHandling: this.recommendErrorHandling(analysis, task),
      testing: this.recommendApiTesting(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  determineApiType(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    if (taskText.includes('graphql') || taskText.includes('graph query')) {
      return {
        type: 'graphql',
        rationale: 'GraphQL mentioned explicitly or query flexibility needed',
        considerations: ['schema-first-design', 'resolver-optimization', 'query-complexity']
      };
    }
    
    if (taskText.includes('real-time') || taskText.includes('websocket') || taskText.includes('streaming')) {
      return {
        type: 'real-time',
        rationale: 'Real-time communication requirements detected',
        considerations: ['websockets', 'server-sent-events', 'connection-management']
      };
    }
    
    if (taskText.includes('file upload') || taskText.includes('binary') || taskText.includes('multipart')) {
      return {
        type: 'multipart-rest',
        rationale: 'File handling or binary data requirements',
        considerations: ['multipart-form-data', 'streaming-uploads', 'content-validation']
      };
    }
    
    return {
      type: 'rest',
      rationale: 'Standard REST API approach suitable for requirements',
      considerations: ['resource-based-design', 'http-methods', 'status-codes']
    };
  }
  
  analyzeApiComplexity(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    let complexity = 'simple';
    let score = 1;
    const factors = [];
    
    // Endpoint count indicators
    if (taskText.includes('many endpoints') || taskText.includes('dozens of')) {
      complexity = 'complex';
      score = Math.max(score, 7);
      factors.push('multiple-endpoints');
    }
    
    // Relationship complexity
    if (taskText.includes('nested') || taskText.includes('relationship') || taskText.includes('association')) {
      complexity = 'moderate';
      score = Math.max(score, 5);
      factors.push('nested-resources');
    }
    
    // Business logic complexity
    if (taskText.includes('business rule') || taskText.includes('validation') || taskText.includes('workflow')) {
      complexity = 'moderate';
      score = Math.max(score, 6);
      factors.push('business-logic');
    }
    
    // Integration complexity
    if (taskText.includes('third party') || taskText.includes('external') || taskText.includes('integration')) {
      complexity = 'complex';
      score = Math.max(score, 8);
      factors.push('external-integrations');
    }
    
    // Microservices complexity
    if (taskText.includes('microservice') || taskText.includes('distributed') || taskText.includes('service mesh')) {
      complexity = 'advanced';
      score = Math.max(score, 9);
      factors.push('distributed-architecture');
    }
    
    return {
      level: complexity,
      score,
      factors,
      estimatedEndpoints: this.estimateEndpointCount(taskText),
      resourceComplexity: this.assessResourceComplexity(factors)
    };
  }
  
  analyzeVersioningNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const versioningIndicators = [
      'version', 'backward compatible', 'breaking change',
      'api evolution', 'deprecat', 'migration'
    ];
    
    const needsVersioning = versioningIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.existingApi || context.publicApi;
    
    if (!needsVersioning) {
      return { required: false, strategy: 'single-version' };
    }
    
    return {
      required: true,
      strategy: this.determineVersioningStrategy(taskText, context),
      migrationStrategy: this.getMigrationStrategy(taskText),
      backwardCompatibility: this.getBackwardCompatibilityRequirements(taskText),
      deprecationPolicy: this.getDeprecationPolicy(context)
    };
  }
  
  analyzeSecurityRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const securityLevels = {
      'high': {
        indicators: ['oauth', 'jwt', 'sensitive', 'private', 'secure', 'authentication', 'authorization'],
        requirements: ['authentication', 'authorization', 'input-validation', 'rate-limiting', 'audit-logging']
      },
      'medium': {
        indicators: ['user', 'login', 'access', 'permission'],
        requirements: ['basic-auth', 'input-validation', 'rate-limiting']
      },
      'basic': {
        indicators: ['public', 'read-only', 'open'],
        requirements: ['input-validation', 'basic-rate-limiting']
      }
    };
    
    let securityLevel = 'basic';
    let requirements = securityLevels.basic.requirements;
    
    Object.entries(securityLevels).forEach(([level, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        securityLevel = level;
        requirements = config.requirements;
      }
    });
    
    return {
      level: securityLevel,
      requirements,
      authenticationMethods: this.getAuthenticationMethods(securityLevel, taskText),
      authorizationPattern: this.getAuthorizationPattern(securityLevel, taskText),
      dataProtection: this.getDataProtectionRequirements(taskText)
    };
  }
  
  analyzePerformanceRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const performanceIndicators = {
      'high': ['real-time', 'low latency', 'fast', 'immediate', 'millisecond'],
      'medium': ['responsive', 'quick', 'efficient', 'scalable'],
      'standard': ['normal', 'acceptable', 'reasonable']
    };
    
    let performanceLevel = 'standard';
    Object.entries(performanceIndicators).forEach(([level, indicators]) => {
      if (indicators.some(indicator => taskText.includes(indicator))) {
        performanceLevel = level;
      }
    });
    
    return {
      level: performanceLevel,
      cachingStrategy: this.getCachingStrategy(performanceLevel),
      optimizationTechniques: this.getOptimizationTechniques(performanceLevel),
      scalingRequirements: this.getScalingRequirements(taskText, context),
      monitoringNeeds: this.getPerformanceMonitoringNeeds(performanceLevel)
    };
  }
  
  analyzeDocumentationNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const documentationIndicators = [
      'document', 'spec', 'openapi', 'swagger',
      'external developer', 'third party', 'public api'
    ];
    
    const needsDocumentation = documentationIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.publicApi || context.externalConsumers;
    
    if (!needsDocumentation) {
      return { level: 'minimal', approach: 'code-comments' };
    }
    
    const level = context.publicApi || taskText.includes('external') ? 'comprehensive' : 'standard';
    
    return {
      level,
      approach: this.getDocumentationApproach(level),
      tools: this.getDocumentationTools(level),
      interactive: level === 'comprehensive',
      examples: level !== 'minimal'
    };
  }
  
  analyzeClientTypes(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const clientTypes = [];
    
    if (taskText.includes('web') || taskText.includes('browser') || taskText.includes('frontend')) {
      clientTypes.push({ type: 'web-browser', considerations: ['cors', 'csrf-protection', 'cookie-handling'] });
    }
    
    if (taskText.includes('mobile') || taskText.includes('ios') || taskText.includes('android')) {
      clientTypes.push({ type: 'mobile-app', considerations: ['offline-handling', 'data-sync', 'push-notifications'] });
    }
    
    if (taskText.includes('server') || taskText.includes('backend') || taskText.includes('microservice')) {
      clientTypes.push({ type: 'server-to-server', considerations: ['service-discovery', 'circuit-breakers', 'retry-policies'] });
    }
    
    if (taskText.includes('third party') || taskText.includes('external') || taskText.includes('partner')) {
      clientTypes.push({ type: 'external-systems', considerations: ['api-keys', 'webhook-validation', 'rate-limiting'] });
    }
    
    if (clientTypes.length === 0) {
      clientTypes.push({ type: 'general', considerations: ['standard-http', 'json-responses'] });
    }
    
    return clientTypes;
  }
  
  analyzeDataComplexity(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    let complexity = 'simple';
    let score = 1;
    const characteristics = [];
    
    if (taskText.includes('nested') || taskText.includes('hierarchy') || taskText.includes('tree')) {
      complexity = 'moderate';
      score = Math.max(score, 5);
      characteristics.push('nested-structures');
    }
    
    if (taskText.includes('file') || taskText.includes('upload') || taskText.includes('binary')) {
      complexity = 'moderate';
      score = Math.max(score, 6);
      characteristics.push('file-handling');
    }
    
    if (taskText.includes('batch') || taskText.includes('bulk') || taskText.includes('large dataset')) {
      complexity = 'complex';
      score = Math.max(score, 7);
      characteristics.push('bulk-operations');
    }
    
    if (taskText.includes('real-time') || taskText.includes('streaming') || taskText.includes('live')) {
      complexity = 'complex';
      score = Math.max(score, 8);
      characteristics.push('real-time-data');
    }
    
    return {
      level: complexity,
      score,
      characteristics,
      serializationNeeds: this.getSerializationNeeds(characteristics),
      validationComplexity: this.getValidationComplexity(characteristics)
    };
  }
  
  recommendApiArchitecture(analysis, task) {
    const { apiType, complexityLevel, clientTypes } = analysis;
    
    if (apiType.type === 'graphql') {
      return {
        architecture: 'graphql-api',
        rationale: 'GraphQL provides flexible querying for complex data requirements',
        components: ['graphql-server', 'schema-definition', 'resolvers', 'data-loaders'],
        patterns: ['schema-first-design', 'resolver-composition', 'query-optimization'],
        tools: ['apollo-server', 'graphql-tools', 'dataloader']
      };
    }
    
    if (complexityLevel.level === 'advanced' || 
        clientTypes.some(c => c.type === 'server-to-server')) {
      return {
        architecture: 'layered-rest-api',
        rationale: 'Complex requirements need layered architecture for maintainability',
        components: ['api-gateway', 'service-layer', 'data-access-layer', 'validation-layer'],
        patterns: ['repository-pattern', 'service-layer-pattern', 'dto-pattern'],
        tools: ['express-js', 'joi-validation', 'swagger-ui']
      };
    }
    
    return {
      architecture: 'standard-rest-api',
      rationale: 'Standard REST architecture suitable for current requirements',
      components: ['controller-layer', 'service-layer', 'model-layer'],
      patterns: ['mvc-pattern', 'resource-based-routing'],
      tools: ['express-js', 'swagger-specification']
    };
  }
  
  recommendDesignPatterns(analysis, task) {
    const { complexityLevel, dataComplexity, clientTypes } = analysis;
    
    const patterns = [];
    
    // Core patterns based on complexity
    if (complexityLevel.level === 'simple') {
      patterns.push({
        pattern: 'resource-based-urls',
        rationale: 'Simple resource mapping for straightforward requirements',
        implementation: 'noun-based-endpoints-with-http-verbs'
      });
    } else {
      patterns.push({
        pattern: 'hierarchical-resources',
        rationale: 'Nested resources for complex data relationships',
        implementation: 'parent-child-url-structure'
      });
    }
    
    // Data handling patterns
    if (dataComplexity.characteristics.includes('nested-structures')) {
      patterns.push({
        pattern: 'embedded-vs-linked-resources',
        rationale: 'Optimize data transfer for nested structures',
        implementation: 'conditional-embedding-with-expand-parameter'
      });
    }
    
    if (dataComplexity.characteristics.includes('bulk-operations')) {
      patterns.push({
        pattern: 'bulk-operations',
        rationale: 'Efficient handling of batch operations',
        implementation: 'array-based-endpoints-with-partial-success'
      });
    }
    
    // Client-specific patterns
    if (clientTypes.some(c => c.type === 'mobile-app')) {
      patterns.push({
        pattern: 'mobile-optimized-responses',
        rationale: 'Optimize for mobile bandwidth and battery',
        implementation: 'field-selection-and-compression'
      });
    }
    
    if (clientTypes.some(c => c.type === 'external-systems')) {
      patterns.push({
        pattern: 'webhook-notifications',
        rationale: 'Event-driven communication for external systems',
        implementation: 'callback-urls-with-retry-logic'
      });
    }
    
    return patterns;
  }
  
  recommendVersioningStrategy(analysis, task) {
    const { versioningNeeds, clientTypes, complexityLevel } = analysis;
    
    if (!versioningNeeds.required) {
      return {
        strategy: 'no-versioning',
        rationale: 'Single version sufficient for current needs'
      };
    }
    
    if (clientTypes.some(c => c.type === 'external-systems') || 
        complexityLevel.level === 'advanced') {
      return {
        strategy: 'header-versioning',
        rationale: 'Header-based versioning for external APIs provides flexibility',
        implementation: {
          method: 'accept-header-versioning',
          example: 'Accept: application/vnd.api.v2+json',
          fallback: 'latest-version-as-default'
        },
        migrationPath: versioningNeeds.migrationStrategy,
        deprecationPolicy: versioningNeeds.deprecationPolicy
      };
    }
    
    if (versioningNeeds.backwardCompatibility === 'strict') {
      return {
        strategy: 'url-versioning',
        rationale: 'URL versioning provides clear version separation',
        implementation: {
          method: 'url-path-versioning',
          example: '/api/v2/users',
          routing: 'version-specific-controllers'
        },
        migrationPath: versioningNeeds.migrationStrategy,
        deprecationPolicy: versioningNeeds.deprecationPolicy
      };
    }
    
    return {
      strategy: 'semantic-versioning',
      rationale: 'Semantic versioning for gradual evolution',
      implementation: {
        method: 'backward-compatible-changes',
        additive: 'new-fields-and-endpoints',
        breaking: 'major-version-bump'
      },
      migrationPath: versioningNeeds.migrationStrategy
    };
  }
  
  recommendSecurityImplementation(analysis, task) {
    const { securityRequirements, clientTypes, apiType } = analysis;
    
    const implementation = {
      level: securityRequirements.level,
      authentication: securityRequirements.authenticationMethods,
      authorization: securityRequirements.authorizationPattern,
      implementation: []
    };
    
    // Authentication implementation
    if (securityRequirements.level === 'high') {
      implementation.implementation.push({
        component: 'oauth2-jwt-authentication',
        rationale: 'OAuth2 with JWT for secure, stateless authentication',
        tools: ['passport-js', 'jsonwebtoken', 'oauth2-server'],
        configuration: 'rsa-signed-tokens-with-refresh'
      });
      
      implementation.implementation.push({
        component: 'rbac-authorization',
        rationale: 'Role-based access control for fine-grained permissions',
        tools: ['casl', 'node-acl'],
        configuration: 'resource-action-based-permissions'
      });
    }
    
    // Input validation
    implementation.implementation.push({
      component: 'input-validation',
      rationale: 'Comprehensive input validation for security',
      tools: ['joi', 'express-validator', 'ajv'],
      configuration: 'schema-based-validation-with-sanitization'
    });
    
    // Rate limiting
    if (clientTypes.some(c => c.type === 'external-systems') || 
        securityRequirements.level !== 'basic') {
      implementation.implementation.push({
        component: 'rate-limiting',
        rationale: 'Protect against abuse and ensure fair usage',
        tools: ['express-rate-limit', 'redis-rate-limiter'],
        configuration: 'sliding-window-with-ip-and-user-limits'
      });
    }
    
    // Data protection
    if (securityRequirements.dataProtection.includes('encryption')) {
      implementation.implementation.push({
        component: 'data-encryption',
        rationale: 'Protect sensitive data in transit and at rest',
        tools: ['helmet', 'bcrypt', 'crypto'],
        configuration: 'tls-encryption-with-field-level-encryption'
      });
    }
    
    return implementation;
  }
  
  recommendDocumentationStrategy(analysis, task) {
    const { documentationNeeds, apiType, securityRequirements } = analysis;
    
    if (documentationNeeds.level === 'minimal') {
      return {
        approach: 'code-comments',
        tools: ['jsdoc'],
        deliverables: ['inline-documentation']
      };
    }
    
    const strategy = {
      approach: documentationNeeds.approach,
      specification: apiType.type === 'graphql' ? 'graphql-schema' : 'openapi-3.0',
      tools: documentationNeeds.tools,
      deliverables: []
    };
    
    if (apiType.type === 'rest') {
      strategy.deliverables.push({
        type: 'openapi-specification',
        tool: 'swagger-ui',
        features: ['interactive-testing', 'schema-validation', 'example-generation']
      });
    } else if (apiType.type === 'graphql') {
      strategy.deliverables.push({
        type: 'graphql-documentation',
        tool: 'graphql-playground',
        features: ['schema-introspection', 'query-examples', 'mutation-examples']
      });
    }
    
    if (documentationNeeds.level === 'comprehensive') {
      strategy.deliverables.push({
        type: 'developer-guides',
        content: ['getting-started', 'authentication-guide', 'error-handling', 'rate-limiting'],
        format: 'markdown-with-examples'
      });
      
      strategy.deliverables.push({
        type: 'sdk-documentation',
        languages: ['javascript', 'python', 'curl'],
        examples: 'real-world-scenarios'
      });
    }
    
    return strategy;
  }
  
  recommendPerformanceOptimization(analysis, task) {
    const { performanceRequirements, dataComplexity, clientTypes } = analysis;
    
    const optimizations = [];
    
    // Caching strategy
    optimizations.push({
      technique: 'response-caching',
      implementation: performanceRequirements.cachingStrategy,
      tools: ['redis', 'express-cache-middleware'],
      rationale: 'Reduce database load and improve response times'
    });
    
    // Data optimization
    if (dataComplexity.level !== 'simple') {
      optimizations.push({
        technique: 'response-optimization',
        implementation: ['field-selection', 'data-pagination', 'lazy-loading'],
        tools: ['graphql-field-selection', 'cursor-pagination'],
        rationale: 'Optimize data transfer for complex responses'
      });
    }
    
    // Client-specific optimizations
    if (clientTypes.some(c => c.type === 'mobile-app')) {
      optimizations.push({
        technique: 'mobile-optimization',
        implementation: ['response-compression', 'batch-requests', 'delta-updates'],
        tools: ['compression-middleware', 'graphql-batch-loader'],
        rationale: 'Optimize for mobile bandwidth and battery'
      });
    }
    
    // High-performance requirements
    if (performanceRequirements.level === 'high') {
      optimizations.push({
        technique: 'connection-optimization',
        implementation: ['connection-pooling', 'keep-alive', 'http2'],
        tools: ['cluster-module', 'http2-server'],
        rationale: 'Minimize connection overhead for high-performance requirements'
      });
    }
    
    return optimizations;
  }
  
  recommendErrorHandling(analysis, task) {
    const { securityRequirements, clientTypes, apiType } = analysis;
    
    const strategy = {
      approach: 'consistent-error-responses',
      format: apiType.type === 'graphql' ? 'graphql-errors' : 'rfc7807-problem-details',
      implementation: []
    };
    
    // Standard error handling
    strategy.implementation.push({
      component: 'error-standardization',
      pattern: 'structured-error-responses',
      fields: ['error_code', 'message', 'details', 'timestamp', 'request_id'],
      rationale: 'Consistent error format for client handling'
    });
    
    // Security-conscious error handling
    if (securityRequirements.level === 'high') {
      strategy.implementation.push({
        component: 'security-error-handling',
        pattern: 'minimal-error-disclosure',
        approach: 'generic-messages-with-detailed-logging',
        rationale: 'Prevent information leakage while maintaining debuggability'
      });
    }
    
    // Client-specific error handling
    if (clientTypes.some(c => c.type === 'external-systems')) {
      strategy.implementation.push({
        component: 'external-client-errors',
        pattern: 'detailed-validation-errors',
        approach: 'field-level-error-messages',
        rationale: 'Help external developers integrate successfully'
      });
    }
    
    // Monitoring and alerting
    strategy.implementation.push({
      component: 'error-monitoring',
      pattern: 'structured-error-logging',
      tools: ['winston', 'sentry', 'prometheus'],
      rationale: 'Track and alert on API errors for operational visibility'
    });
    
    return strategy;
  }
  
  recommendApiTesting(analysis, task) {
    const { complexityLevel, securityRequirements, apiType } = analysis;
    
    const testingStrategy = {
      approach: 'multi-layer-testing',
      layers: []
    };
    
    // Unit tests
    testingStrategy.layers.push({
      type: 'unit-tests',
      scope: 'individual-endpoints',
      tools: ['jest', 'supertest'],
      coverage: 'business-logic-and-edge-cases'
    });
    
    // Integration tests
    if (complexityLevel.level !== 'simple') {
      testingStrategy.layers.push({
        type: 'integration-tests',
        scope: 'end-to-end-workflows',
        tools: ['jest', 'supertest', 'test-containers'],
        coverage: 'cross-endpoint-interactions'
      });
    }
    
    // Security tests
    if (securityRequirements.level !== 'basic') {
      testingStrategy.layers.push({
        type: 'security-tests',
        scope: 'authentication-authorization-validation',
        tools: ['jwt-test-utils', 'security-test-framework'],
        coverage: 'access-control-and-input-validation'
      });
    }
    
    // Contract tests
    if (apiType.type === 'rest') {
      testingStrategy.layers.push({
        type: 'contract-tests',
        scope: 'api-specification-compliance',
        tools: ['swagger-parser', 'api-spec-converter'],
        coverage: 'openapi-specification-validation'
      });
    }
    
    // Performance tests
    testingStrategy.layers.push({
      type: 'performance-tests',
      scope: 'load-and-stress-testing',
      tools: ['artillery', 'k6'],
      coverage: 'response-times-and-throughput'
    });
    
    return testingStrategy;
  }
  
  getImplementationGuidance(analysis, task) {
    const { complexityLevel, apiType, securityRequirements } = analysis;
    
    const steps = [
      'API requirements analysis and specification design',
      'Project structure setup and core dependencies',
      'Authentication and authorization implementation',
      'Core endpoint development',
      'Input validation and error handling',
      'Testing implementation (unit and integration)',
      'Documentation generation',
      'Security review and testing',
      'Performance optimization',
      'Deployment preparation'
    ];
    
    if (apiType.type === 'graphql') {
      steps.splice(1, 0, 'GraphQL schema design and resolver planning');
    }
    
    if (securityRequirements.level === 'high') {
      steps.splice(7, 0, 'Security audit and penetration testing');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredApiResources(analysis),
      timeline: this.calculateApiTimeline(steps.length, complexityLevel),
      risks: this.identifyApiImplementationRisks(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'openapi-specification-validation',
      'endpoint-response-validation',
      'error-handling-verification',
      'security-testing'
    ];
    
    if (analysis.apiType.type === 'graphql') {
      baseChecks.push('graphql-schema-validation', 'resolver-testing');
    }
    
    if (analysis.securityRequirements.level === 'high') {
      baseChecks.push('authentication-testing', 'authorization-testing', 'security-audit');
    }
    
    if (analysis.performanceRequirements.level === 'high') {
      baseChecks.push('load-testing', 'performance-profiling');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { complexityLevel, apiType, securityRequirements, documentationNeeds } = analysis;
    
    let baseDays = 5; // Base API development time
    
    if (apiType.type === 'graphql') baseDays += 3;
    if (complexityLevel.level === 'advanced') baseDays += 5;
    else if (complexityLevel.level === 'complex') baseDays += 3;
    else if (complexityLevel.level === 'moderate') baseDays += 2;
    
    if (securityRequirements.level === 'high') baseDays += 3;
    else if (securityRequirements.level === 'medium') baseDays += 1;
    
    if (documentationNeeds.level === 'comprehensive') baseDays += 2;
    
    return {
      estimate: `${baseDays}-${baseDays + 3} days`,
      confidence: 0.8,
      factors: [
        `API type: ${apiType.type}`,
        `Complexity: ${complexityLevel.level}`,
        `Security: ${securityRequirements.level}`,
        `Documentation: ${documentationNeeds.level}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'enterprise-integration-architecture':
        return analysis.complexityLevel.level === 'advanced' &&
               analysis.clientTypes.some(c => c.type === 'server-to-server') &&
               (task.description?.toLowerCase().includes('enterprise') || 
                task.description?.toLowerCase().includes('organization'));
      
      case 'complex-microservices-orchestration':
        return analysis.complexityLevel.factors.includes('distributed-architecture') &&
               task.description?.toLowerCase().includes('orchestrat');
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 8;
  }
  
  // Helper methods
  estimateEndpointCount(taskText) {
    if (taskText.includes('crud')) return '4-8 endpoints';
    if (taskText.includes('many') || taskText.includes('complex')) return '10+ endpoints';
    return '3-6 endpoints';
  }
  
  assessResourceComplexity(factors) {
    if (factors.includes('distributed-architecture')) return 'high';
    if (factors.includes('external-integrations')) return 'medium-high';
    if (factors.includes('business-logic')) return 'medium';
    return 'low';
  }
  
  determineVersioningStrategy(taskText, context) {
    if (context.publicApi || taskText.includes('public')) return 'strict-versioning';
    if (context.existingApi) return 'backward-compatible-evolution';
    return 'semantic-versioning';
  }
  
  getMigrationStrategy(taskText) {
    if (taskText.includes('gradual') || taskText.includes('phased')) {
      return 'phased-migration';
    }
    return 'direct-migration';
  }
  
  getBackwardCompatibilityRequirements(taskText) {
    if (taskText.includes('breaking change')) return 'version-bump';
    if (taskText.includes('backward compatible')) return 'strict';
    return 'reasonable';
  }
  
  getDeprecationPolicy(context) {
    if (context.publicApi) return 'long-term-support';
    return 'standard-deprecation';
  }
  
  getAuthenticationMethods(level, taskText) {
    if (level === 'high') {
      return taskText.includes('oauth') ? 'oauth2-jwt' : 'jwt-bearer';
    }
    if (level === 'medium') return 'basic-auth-or-api-key';
    return 'none';
  }
  
  getAuthorizationPattern(level, taskText) {
    if (level === 'high') return 'rbac';
    if (level === 'medium') return 'simple-permissions';
    return 'none';
  }
  
  getDataProtectionRequirements(taskText) {
    const requirements = [];
    if (taskText.includes('encrypt') || taskText.includes('secure')) {
      requirements.push('encryption');
    }
    if (taskText.includes('audit') || taskText.includes('log')) {
      requirements.push('audit-logging');
    }
    return requirements;
  }
  
  getCachingStrategy(level) {
    if (level === 'high') return 'aggressive-caching-with-invalidation';
    if (level === 'medium') return 'selective-caching';
    return 'basic-response-caching';
  }
  
  getOptimizationTechniques(level) {
    if (level === 'high') {
      return ['response-compression', 'connection-pooling', 'query-optimization'];
    }
    return ['response-caching', 'pagination'];
  }
  
  getScalingRequirements(taskText, context) {
    if (taskText.includes('scale') || context.highTraffic) {
      return 'horizontal-scaling-ready';
    }
    return 'single-instance';
  }
  
  getPerformanceMonitoringNeeds(level) {
    if (level === 'high') return 'comprehensive-apm';
    if (level === 'medium') return 'basic-metrics';
    return 'error-logging';
  }
  
  getDocumentationApproach(level) {
    if (level === 'comprehensive') return 'specification-driven-with-examples';
    if (level === 'standard') return 'specification-based';
    return 'code-comments';
  }
  
  getDocumentationTools(level) {
    if (level === 'comprehensive') return ['swagger-ui', 'postman-collections', 'sdk-generators'];
    if (level === 'standard') return ['swagger-ui', 'openapi-generator'];
    return ['jsdoc'];
  }
  
  getSerializationNeeds(characteristics) {
    if (characteristics.includes('file-handling')) return 'multipart-serialization';
    if (characteristics.includes('real-time-data')) return 'streaming-serialization';
    return 'json-serialization';
  }
  
  getValidationComplexity(characteristics) {
    if (characteristics.includes('nested-structures')) return 'nested-schema-validation';
    if (characteristics.includes('bulk-operations')) return 'array-validation';
    return 'simple-field-validation';
  }
  
  getRequiredApiResources(analysis) {
    const resources = [
      'API development framework (Express.js/Fastify)',
      'Validation library (Joi/Yup)',
      'Documentation tools (Swagger UI)'
    ];
    
    if (analysis.securityRequirements.level === 'high') {
      resources.push('Authentication framework (Passport.js)', 'Security testing tools');
    }
    
    if (analysis.apiType.type === 'graphql') {
      resources.push('GraphQL server (Apollo Server)', 'Schema development tools');
    }
    
    return resources;
  }
  
  calculateApiTimeline(stepCount, complexityLevel) {
    const multiplier = complexityLevel.level === 'advanced' ? 1.5 : 
                      complexityLevel.level === 'complex' ? 1.3 : 1.0;
    
    return {
      planning: '1-2 days',
      development: `${Math.ceil(stepCount * 0.7 * multiplier)} days`,
      testing: `${Math.ceil(2 * multiplier)} days`,
      documentation: '1-2 days',
      deployment: '1 day'
    };
  }
  
  identifyApiImplementationRisks(analysis) {
    const risks = ['api-breaking-changes', 'security-vulnerabilities'];
    
    if (analysis.complexityLevel.level === 'advanced') {
      risks.push('integration-complexity', 'performance-bottlenecks');
    }
    
    if (analysis.securityRequirements.level === 'high') {
      risks.push('authentication-complexity', 'authorization-edge-cases');
    }
    
    if (analysis.apiType.type === 'graphql') {
      risks.push('query-complexity-attacks', 'n-plus-one-queries');
    }
    
    return risks;
  }
}

module.exports = ApiDesignSpecialist;