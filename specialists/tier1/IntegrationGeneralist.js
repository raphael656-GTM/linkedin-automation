const BaseSpecialist = require('../BaseSpecialist');

/**
 * Integration Generalist - Tier 1 Specialist
 * Domain: APIs, third-party services, microservices
 */
class IntegrationGeneralist extends BaseSpecialist {
  constructor() {
    super({
      id: 'integration-generalist',
      name: 'Integration Generalist',
      domain: 'integration',
      tier: 'TIER_1',
      expertise: [
        'REST API design',
        'GraphQL implementation',
        'third-party integration',
        'service communication',
        'webhook implementation',
        'basic event-driven architecture',
        'API authentication',
        'message queuing'
      ],
      handoffCriteria: [
        {
          condition: 'complex-integration-patterns',
          reason: 'Complex integration architectures require specialized API expertise',
          targetTier: 'TIER_2',
          targetSpecialist: 'api-design-specialist'
        },
        {
          condition: 'enterprise-integration-strategy',
          reason: 'Enterprise messaging and service mesh require integration architecture',
          targetTier: 'TIER_3',
          targetSpecialist: 'integration-architect'
        }
      ]
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      integrationScope: this.assessIntegrationScope(task),
      apiComplexity: this.analyzeApiComplexity(task),
      servicePatterns: this.analyzeServicePatterns(task),
      dataFlowRequirements: this.analyzeDataFlowRequirements(task),
      authenticationNeeds: this.analyzeAuthenticationNeeds(task),
      errorHandlingRequirements: this.analyzeErrorHandlingRequirements(task),
      scalabilityRequirements: this.analyzeScalabilityRequirements(task)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      integrationStrategy: this.recommendIntegrationStrategy(analysis, task),
      apiDesign: this.recommendApiDesign(analysis, task),
      communicationPatterns: this.recommendCommunicationPatterns(analysis, task),
      authenticationApproach: this.recommendAuthenticationApproach(analysis, task),
      errorHandlingStrategy: this.recommendErrorHandlingStrategy(analysis, task),
      monitoringSetup: this.recommendMonitoringSetup(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  assessIntegrationScope(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scopeTypes = {
      'internal-api': ['internal api', 'service to service', 'microservice', 'backend api'],
      'external-api': ['external api', 'third party', 'partner api', 'public api'],
      'webhook': ['webhook', 'callback', 'notification', 'event trigger'],
      'batch-integration': ['batch', 'bulk', 'file transfer', 'etl', 'data sync'],
      'real-time': ['real-time', 'streaming', 'live', 'websocket', 'sse'],
      'event-driven': ['event', 'message', 'queue', 'pub/sub', 'event-driven']
    };
    
    const detectedScopes = [];
    Object.entries(scopeTypes).forEach(([scope, keywords]) => {
      const relevance = keywords.filter(keyword => taskText.includes(keyword)).length;
      if (relevance > 0) {
        detectedScopes.push({
          scope,
          relevance,
          complexity: this.getScopeComplexity(scope),
          patterns: this.getScopePatterns(scope)
        });
      }
    });
    
    return detectedScopes.sort((a, b) => b.relevance - a.relevance);
  }
  
  analyzeApiComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complexityFactors = {
      simple: ['get', 'post', 'simple api', 'basic crud'],
      moderate: ['rest', 'json', 'authentication', 'validation', 'error handling'],
      complex: ['graphql', 'real-time', 'batch operations', 'complex queries'],
      advanced: ['federated', 'schema stitching', 'complex transformations', 'orchestration']
    };
    
    let complexity = 'simple';
    let score = 1;
    
    Object.entries(complexityFactors).forEach(([level, factors]) => {
      if (factors.some(factor => taskText.includes(factor))) {
        complexity = level;
        score = level === 'advanced' ? 8 : level === 'complex' ? 6 : level === 'moderate' ? 4 : 2;
      }
    });
    
    return {
      level: complexity,
      score,
      factors: this.getComplexityFactors(taskText),
      patterns: this.identifyApiPatterns(taskText)
    };
  }
  
  analyzeServicePatterns(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const patterns = {
      'request-response': ['request', 'response', 'synchronous', 'api call'],
      'publish-subscribe': ['publish', 'subscribe', 'pub/sub', 'event', 'notification'],
      'message-queue': ['queue', 'message', 'async', 'background', 'worker'],
      'saga-pattern': ['saga', 'transaction', 'compensation', 'rollback'],
      'circuit-breaker': ['circuit breaker', 'fallback', 'resilience', 'timeout'],
      'api-gateway': ['gateway', 'proxy', 'routing', 'load balancer']
    };
    
    const identifiedPatterns = [];
    Object.entries(patterns).forEach(([pattern, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        identifiedPatterns.push({
          pattern,
          applicability: this.getPatternApplicability(pattern, taskText),
          complexity: this.getPatternComplexity(pattern),
          benefits: this.getPatternBenefits(pattern)
        });
      }
    });
    
    return identifiedPatterns.sort((a, b) => b.applicability - a.applicability);
  }
  
  analyzeDataFlowRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const flowTypes = {
      unidirectional: ['one way', 'send', 'push', 'notify'],
      bidirectional: ['two way', 'request response', 'sync', 'interactive'],
      multicast: ['broadcast', 'multiple', 'fan out', 'distribute'],
      aggregation: ['collect', 'aggregate', 'combine', 'merge', 'fan in']
    };
    
    const dataCharacteristics = {
      volume: this.estimateDataVolume(taskText),
      frequency: this.estimateDataFrequency(taskText),
      consistency: this.estimateConsistencyRequirements(taskText),
      latency: this.estimateLatencyRequirements(taskText)
    };
    
    const detectedFlows = [];
    Object.entries(flowTypes).forEach(([flow, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        detectedFlows.push({
          type: flow,
          characteristics: dataCharacteristics,
          requirements: this.getFlowRequirements(flow)
        });
      }
    });
    
    return {
      flows: detectedFlows,
      characteristics: dataCharacteristics
    };
  }
  
  analyzeAuthenticationNeeds(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const authTypes = {
      none: ['no auth', 'public', 'anonymous'],
      basic: ['basic auth', 'username password', 'simple'],
      bearer: ['bearer token', 'jwt', 'access token'],
      oauth: ['oauth', 'oauth2', 'authorization code'],
      apikey: ['api key', 'api token', 'key based'],
      mutual: ['mutual tls', 'client certificate', 'mtls']
    };
    
    let authType = 'basic'; // Default
    Object.entries(authTypes).forEach(([type, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        authType = type;
      }
    });
    
    return {
      type: authType,
      complexity: this.getAuthComplexity(authType),
      requirements: this.getAuthRequirements(authType),
      implementation: this.getAuthImplementation(authType)
    };
  }
  
  analyzeErrorHandlingRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const errorScenarios = {
      network: ['network', 'timeout', 'connection', 'unreachable'],
      service: ['service down', 'unavailable', 'maintenance', 'degraded'],
      data: ['validation', 'invalid', 'malformed', 'corrupt'],
      rate: ['rate limit', 'throttle', 'quota', 'limit exceeded'],
      auth: ['unauthorized', 'forbidden', 'authentication', 'permission']
    };
    
    const detectedScenarios = [];
    Object.entries(errorScenarios).forEach(([scenario, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        detectedScenarios.push({
          type: scenario,
          strategy: this.getErrorStrategy(scenario),
          recovery: this.getRecoveryStrategy(scenario)
        });
      }
    });
    
    const requiresRobustHandling = taskText.includes('resilient') || 
                                    taskText.includes('fault tolerant') ||
                                    taskText.includes('high availability');
    
    return {
      scenarios: detectedScenarios,
      robustnessLevel: requiresRobustHandling ? 'high' : 'standard',
      strategies: this.getErrorHandlingStrategies(requiresRobustHandling)
    };
  }
  
  analyzeScalabilityRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalabilityIndicators = [
      'scale', 'high volume', 'load', 'concurrent', 'throughput',
      'performance', 'many requests', 'heavy traffic'
    ];
    
    const needsScalability = scalabilityIndicators.some(indicator => 
      taskText.includes(indicator)
    );
    
    if (!needsScalability) {
      return { required: false };
    }
    
    return {
      required: true,
      type: this.determineScalingType(taskText),
      bottlenecks: this.identifyScalingBottlenecks(taskText),
      strategies: this.getScalingStrategies(taskText)
    };
  }
  
  recommendIntegrationStrategy(analysis, task) {
    const { integrationScope, servicePatterns } = analysis;
    
    if (integrationScope.length === 0) {
      return {
        strategy: 'simple-integration',
        rationale: 'No specific integration patterns identified'
      };
    }
    
    const primaryScope = integrationScope[0];
    
    if (primaryScope.scope === 'event-driven' || servicePatterns.some(p => p.pattern === 'publish-subscribe')) {
      return {
        strategy: 'event-driven-integration',
        rationale: 'Event-driven patterns identified for loose coupling',
        components: ['event-bus', 'event-handlers', 'event-store'],
        benefits: ['loose-coupling', 'scalability', 'resilience']
      };
    }
    
    if (primaryScope.scope === 'external-api' || primaryScope.scope === 'internal-api') {
      return {
        strategy: 'api-first-integration',
        rationale: 'API-centric integration for service communication',
        components: ['api-gateway', 'service-registry', 'load-balancer'],
        benefits: ['standardization', 'discoverability', 'monitoring']
      };
    }
    
    return {
      strategy: 'hybrid-integration',
      rationale: 'Multiple integration patterns require flexible approach',
      components: ['api-gateway', 'message-broker', 'service-mesh'],
      benefits: ['flexibility', 'pattern-support', 'observability']
    };
  }
  
  recommendApiDesign(analysis, task) {
    const { apiComplexity, dataFlowRequirements } = analysis;
    
    if (apiComplexity.level === 'advanced' || 
        apiComplexity.patterns.includes('graphql')) {
      return {
        approach: 'graphql-api',
        rationale: 'Complex query requirements benefit from GraphQL flexibility',
        features: ['schema-first', 'type-safety', 'flexible-queries'],
        considerations: ['schema-design', 'resolver-optimization', 'caching']
      };
    }
    
    if (apiComplexity.level === 'complex' || 
        dataFlowRequirements.characteristics.consistency === 'strong') {
      return {
        approach: 'rest-api-advanced',
        rationale: 'Complex REST API with advanced features',
        features: ['hateoas', 'versioning', 'content-negotiation', 'caching'],
        considerations: ['resource-design', 'status-codes', 'error-handling']
      };
    }
    
    return {
      approach: 'rest-api-standard',
      rationale: 'Standard REST API for straightforward requirements',
      features: ['crud-operations', 'json-format', 'http-methods'],
      considerations: ['resource-naming', 'status-codes', 'documentation']
    };
  }
  
  recommendCommunicationPatterns(analysis, task) {
    const { servicePatterns, dataFlowRequirements } = analysis;
    
    const patterns = [];
    
    if (dataFlowRequirements.characteristics.latency === 'low') {
      patterns.push({
        pattern: 'synchronous-communication',
        use: 'low-latency-requirements',
        implementation: 'http-requests'
      });
    }
    
    if (dataFlowRequirements.characteristics.volume === 'high' ||
        servicePatterns.some(p => p.pattern === 'message-queue')) {
      patterns.push({
        pattern: 'asynchronous-messaging',
        use: 'high-volume-decoupling',
        implementation: 'message-broker'
      });
    }
    
    if (servicePatterns.some(p => p.pattern === 'publish-subscribe')) {
      patterns.push({
        pattern: 'event-driven-communication',
        use: 'loose-coupling-notifications',
        implementation: 'event-bus'
      });
    }
    
    return patterns.length > 0 ? patterns : [{
      pattern: 'request-response',
      use: 'standard-communication',
      implementation: 'http-api'
    }];
  }
  
  recommendAuthenticationApproach(analysis, task) {
    const { authenticationNeeds, integrationScope } = analysis;
    
    if (authenticationNeeds.type === 'none') {
      return {
        approach: 'no-authentication',
        rationale: 'Public API or internal trusted network'
      };
    }
    
    const hasExternalIntegration = integrationScope.some(scope => 
      scope.scope === 'external-api'
    );
    
    if (hasExternalIntegration && authenticationNeeds.complexity > 5) {
      return {
        approach: 'oauth2-with-scopes',
        rationale: 'External API requires robust authentication',
        implementation: 'oauth2-server',
        features: ['scoped-access', 'token-refresh', 'client-credentials']
      };
    }
    
    if (authenticationNeeds.type === 'bearer' || authenticationNeeds.type === 'jwt') {
      return {
        approach: 'jwt-based-auth',
        rationale: 'Token-based authentication for scalable access',
        implementation: 'jwt-validation',
        features: ['stateless-tokens', 'claim-based-auth', 'token-expiry']
      };
    }
    
    return {
      approach: 'api-key-auth',
      rationale: 'Simple API key authentication for controlled access',
      implementation: 'api-key-validation',
      features: ['key-rotation', 'usage-tracking', 'rate-limiting']
    };
  }
  
  recommendErrorHandlingStrategy(analysis, task) {
    const { errorHandlingRequirements } = analysis;
    
    if (errorHandlingRequirements.robustnessLevel === 'high') {
      return {
        strategy: 'comprehensive-error-handling',
        rationale: 'High robustness requirements need comprehensive error handling',
        patterns: ['circuit-breaker', 'retry-with-backoff', 'fallback-responses'],
        monitoring: ['error-rate-tracking', 'alert-thresholds', 'error-classification']
      };
    }
    
    return {
      strategy: 'standard-error-handling',
      rationale: 'Standard error handling for typical integration scenarios',
      patterns: ['http-status-codes', 'error-responses', 'basic-retry'],
      monitoring: ['error-logging', 'basic-metrics']
    };
  }
  
  recommendMonitoringSetup(analysis, task) {
    const { scalabilityRequirements, integrationScope } = analysis;
    
    const metrics = ['response-time', 'error-rate', 'throughput'];
    
    if (scalabilityRequirements.required) {
      metrics.push('concurrent-requests', 'queue-depth', 'resource-utilization');
    }
    
    if (integrationScope.some(scope => scope.scope === 'external-api')) {
      metrics.push('external-service-availability', 'dependency-health');
    }
    
    return {
      metrics,
      dashboards: ['integration-overview', 'error-tracking', 'performance-metrics'],
      alerts: ['high-error-rate', 'response-time-degradation', 'service-unavailable'],
      tools: this.getRecommendedMonitoringTools(integrationScope)
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { apiComplexity, servicePatterns, authenticationNeeds } = analysis;
    
    const steps = [
      'Integration requirements analysis',
      'API design and specification',
      'Authentication implementation',
      'Core integration logic',
      'Error handling implementation',
      'Testing and validation',
      'Monitoring setup',
      'Documentation'
    ];
    
    if (servicePatterns.some(p => p.pattern === 'message-queue')) {
      steps.splice(4, 0, 'Message broker setup');
    }
    
    if (authenticationNeeds.complexity > 5) {
      steps.splice(3, 0, 'Advanced authentication setup');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredIntegrationResources(analysis),
      timeline: this.calculateIntegrationTimeline(steps.length)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = ['integration-testing', 'api-contract-testing'];
    
    if (analysis.authenticationNeeds.type !== 'none') {
      baseChecks.push('authentication-testing');
    }
    
    if (analysis.scalabilityRequirements.required) {
      baseChecks.push('load-testing', 'performance-testing');
    }
    
    if (analysis.errorHandlingRequirements.robustnessLevel === 'high') {
      baseChecks.push('fault-tolerance-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { apiComplexity, servicePatterns, authenticationNeeds } = analysis;
    
    let baseDays = apiComplexity.level === 'advanced' ? 5 :
                   apiComplexity.level === 'complex' ? 3 :
                   apiComplexity.level === 'moderate' ? 2 : 1;
    
    if (servicePatterns.length > 2) baseDays += 1;
    if (authenticationNeeds.complexity > 5) baseDays += 2;
    
    return {
      estimate: `${baseDays}-${baseDays + 2} days`,
      confidence: 0.75,
      factors: [
        `API complexity: ${apiComplexity.level}`,
        `Service patterns: ${servicePatterns.length}`,
        `Auth complexity: ${authenticationNeeds.complexity}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'complex-integration-patterns':
        return analysis.servicePatterns.length > 3 ||
               analysis.apiComplexity.score > 6;
      
      case 'enterprise-integration-strategy':
        return analysis.scalabilityRequirements.required &&
               analysis.integrationScope.length > 4;
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 6;
  }
  
  // Helper methods
  getScopeComplexity(scope) {
    const complexities = {
      'internal-api': 3,
      'external-api': 6,
      'webhook': 4,
      'batch-integration': 5,
      'real-time': 7,
      'event-driven': 8
    };
    return complexities[scope] || 3;
  }
  
  getScopePatterns(scope) {
    const patterns = {
      'internal-api': ['request-response', 'service-discovery'],
      'external-api': ['rate-limiting', 'circuit-breaker', 'caching'],
      'webhook': ['event-notification', 'retry-logic', 'idempotency'],
      'batch-integration': ['file-processing', 'bulk-operations', 'scheduling'],
      'real-time': ['websockets', 'server-sent-events', 'streaming'],
      'event-driven': ['publish-subscribe', 'event-sourcing', 'saga-pattern']
    };
    return patterns[scope] || [];
  }
  
  getComplexityFactors(taskText) {
    const factors = [];
    if (taskText.includes('real-time')) factors.push('real-time-processing');
    if (taskText.includes('transform')) factors.push('data-transformation');
    if (taskText.includes('orchestration')) factors.push('service-orchestration');
    return factors;
  }
  
  identifyApiPatterns(taskText) {
    const patterns = [];
    if (taskText.includes('graphql')) patterns.push('graphql');
    if (taskText.includes('rest')) patterns.push('rest');
    if (taskText.includes('webhook')) patterns.push('webhook');
    if (taskText.includes('rpc')) patterns.push('rpc');
    return patterns;
  }
  
  getPatternApplicability(pattern, taskText) {
    // Simple scoring based on keyword presence
    return taskText.includes(pattern.replace('-', ' ')) ? 8 : 5;
  }
  
  getPatternComplexity(pattern) {
    const complexities = {
      'request-response': 2,
      'publish-subscribe': 6,
      'message-queue': 5,
      'saga-pattern': 8,
      'circuit-breaker': 6,
      'api-gateway': 7
    };
    return complexities[pattern] || 4;
  }
  
  getPatternBenefits(pattern) {
    const benefits = {
      'request-response': ['simplicity', 'direct-communication'],
      'publish-subscribe': ['loose-coupling', 'scalability', 'flexibility'],
      'message-queue': ['decoupling', 'reliability', 'load-leveling'],
      'saga-pattern': ['distributed-transactions', 'consistency'],
      'circuit-breaker': ['fault-tolerance', 'resilience'],
      'api-gateway': ['centralized-management', 'security', 'monitoring']
    };
    return benefits[pattern] || ['improved-architecture'];
  }
  
  estimateDataVolume(taskText) {
    const numbers = taskText.match(/\d+/g);
    if (!numbers) return 'medium';
    
    const largestNumber = Math.max(...numbers.map(n => parseInt(n)));
    if (largestNumber > 10000) return 'high';
    if (largestNumber < 100) return 'low';
    return 'medium';
  }
  
  estimateDataFrequency(taskText) {
    if (taskText.includes('real-time') || taskText.includes('continuous')) return 'high';
    if (taskText.includes('batch') || taskText.includes('periodic')) return 'low';
    return 'medium';
  }
  
  estimateConsistencyRequirements(taskText) {
    if (taskText.includes('strong') || taskText.includes('acid')) return 'strong';
    if (taskText.includes('eventual')) return 'eventual';
    return 'eventual';
  }
  
  estimateLatencyRequirements(taskText) {
    if (taskText.includes('real-time') || taskText.includes('immediate')) return 'low';
    if (taskText.includes('batch') || taskText.includes('background')) return 'high';
    return 'medium';
  }
  
  getFlowRequirements(flow) {
    const requirements = {
      unidirectional: ['fire-and-forget', 'no-response-needed'],
      bidirectional: ['request-response', 'acknowledgment'],
      multicast: ['fan-out', 'multiple-consumers'],
      aggregation: ['data-collection', 'result-combination']
    };
    return requirements[flow] || [];
  }
  
  getAuthComplexity(authType) {
    const complexities = {
      none: 0,
      basic: 2,
      bearer: 4,
      oauth: 8,
      apikey: 3,
      mutual: 9
    };
    return complexities[authType] || 2;
  }
  
  getAuthRequirements(authType) {
    const requirements = {
      none: [],
      basic: ['credential-storage', 'secure-transmission'],
      bearer: ['token-validation', 'token-expiry'],
      oauth: ['authorization-server', 'token-management', 'scope-validation'],
      apikey: ['key-management', 'usage-tracking'],
      mutual: ['certificate-management', 'tls-configuration']
    };
    return requirements[authType] || [];
  }
  
  getAuthImplementation(authType) {
    const implementations = {
      none: 'no-auth-middleware',
      basic: 'basic-auth-middleware',
      bearer: 'jwt-validation-middleware',
      oauth: 'oauth2-server-integration',
      apikey: 'api-key-middleware',
      mutual: 'mutual-tls-configuration'
    };
    return implementations[authType] || 'basic-auth-middleware';
  }
  
  getErrorStrategy(scenario) {
    const strategies = {
      network: 'retry-with-exponential-backoff',
      service: 'circuit-breaker-pattern',
      data: 'validation-and-sanitization',
      rate: 'rate-limiting-with-queuing',
      auth: 'proper-http-status-codes'
    };
    return strategies[scenario] || 'standard-error-response';
  }
  
  getRecoveryStrategy(scenario) {
    const strategies = {
      network: 'automatic-retry',
      service: 'fallback-service',
      data: 'error-response-with-details',
      rate: 'backoff-and-retry',
      auth: 'authentication-refresh'
    };
    return strategies[scenario] || 'log-and-alert';
  }
  
  getErrorHandlingStrategies(robustHandling) {
    if (robustHandling) {
      return ['circuit-breaker', 'retry-logic', 'fallback-mechanisms', 'graceful-degradation'];
    }
    return ['basic-error-responses', 'error-logging'];
  }
  
  determineScalingType(taskText) {
    if (taskText.includes('horizontal') || taskText.includes('load balancer')) {
      return 'horizontal';
    }
    return 'vertical';
  }
  
  identifyScalingBottlenecks(taskText) {
    const bottlenecks = [];
    if (taskText.includes('database')) bottlenecks.push('database');
    if (taskText.includes('network')) bottlenecks.push('network');
    if (taskText.includes('cpu')) bottlenecks.push('cpu');
    return bottlenecks.length > 0 ? bottlenecks : ['general-throughput'];
  }
  
  getScalingStrategies(taskText) {
    return ['load-balancing', 'horizontal-scaling', 'caching', 'connection-pooling'];
  }
  
  getRecommendedMonitoringTools(integrationScope) {
    const tools = ['Prometheus', 'Grafana'];
    if (integrationScope.some(scope => scope.scope === 'external-api')) {
      tools.push('API monitoring tools');
    }
    return tools;
  }
  
  getRequiredIntegrationResources(analysis) {
    const resources = ['API testing tools', 'Integration testing framework'];
    if (analysis.servicePatterns.some(p => p.pattern === 'message-queue')) {
      resources.push('Message broker', 'Queue monitoring tools');
    }
    return resources;
  }
  
  calculateIntegrationTimeline(stepCount) {
    return {
      planning: '1 day',
      design: '1 day',
      implementation: `${Math.ceil(stepCount * 0.4)} days`,
      testing: '2 days',
      deployment: '1 day'
    };
  }
}

module.exports = IntegrationGeneralist;