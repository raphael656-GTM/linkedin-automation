const BaseSpecialist = require('../BaseSpecialist');

/**
 * Architecture Generalist - Tier 1 Specialist
 * Domain: System design, scalability, patterns
 */
class ArchitectureGeneralist extends BaseSpecialist {
  constructor() {
    super({
      id: 'architecture-generalist',
      name: 'Architecture Generalist',
      domain: 'architecture',
      tier: 'TIER_1',
      expertise: [
        'microservices architecture',
        'design patterns',
        'scalability planning',
        'system integration',
        'component design',
        'architectural patterns',
        'system design',
        'modular architecture'
      ],
      handoffCriteria: [
        {
          condition: 'enterprise-scale-system',
          reason: 'Complex distributed systems require enterprise architecture expertise',
          targetTier: 'TIER_2',
          targetSpecialist: 'system-architect'
        },
        {
          condition: 'cross-domain-coordination',
          reason: 'Multi-domain coordination requires architectural oversight',
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
      architecturalComplexity: this.assessArchitecturalComplexity(task),
      designPatterns: this.identifyRelevantPatterns(task),
      scalabilityRequirements: this.analyzeScalabilityNeeds(task),
      integrationPoints: this.identifyIntegrationPoints(task),
      componentStructure: this.analyzeComponentStructure(task)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      architecturalApproach: this.recommendArchitecturalApproach(analysis, task),
      designPatterns: this.recommendDesignPatterns(analysis, task),
      componentStructure: this.recommendComponentStructure(analysis, task),
      scalabilityStrategy: this.recommendScalabilityStrategy(analysis, task),
      integrationStrategy: this.recommendIntegrationStrategy(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  assessArchitecturalComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complexityIndicators = {
      low: ['simple component', 'single function', 'basic feature'],
      medium: ['module', 'service', 'integration', 'multiple components'],
      high: ['system', 'architecture', 'distributed', 'microservices', 'enterprise']
    };
    
    let complexity = 'low';
    if (complexityIndicators.high.some(indicator => taskText.includes(indicator))) {
      complexity = 'high';
    } else if (complexityIndicators.medium.some(indicator => taskText.includes(indicator))) {
      complexity = 'medium';
    }
    
    return {
      level: complexity,
      score: complexity === 'high' ? 8 : complexity === 'medium' ? 5 : 2,
      indicators: this.getComplexityIndicators(taskText)
    };
  }
  
  identifyRelevantPatterns(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const patternMapping = {
      'singleton': ['single instance', 'one instance', 'global'],
      'factory': ['create', 'instantiate', 'generate'],
      'observer': ['notify', 'event', 'subscribe', 'listen'],
      'strategy': ['algorithm', 'behavior', 'switch', 'variant'],
      'decorator': ['enhance', 'extend', 'wrap', 'add functionality'],
      'facade': ['simplify', 'interface', 'wrapper', 'abstraction'],
      'mvc': ['model', 'view', 'controller', 'separation'],
      'repository': ['data access', 'database', 'persistence'],
      'dependency-injection': ['inject', 'dependency', 'loosely coupled']
    };
    
    const applicablePatterns = [];
    Object.entries(patternMapping).forEach(([pattern, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        applicablePatterns.push({
          pattern,
          relevance: this.calculatePatternRelevance(pattern, taskText),
          benefits: this.getPatternBenefits(pattern)
        });
      }
    });
    
    return applicablePatterns.sort((a, b) => b.relevance - a.relevance);
  }
  
  analyzeScalabilityNeeds(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalabilityIndicators = [
      'scale', 'performance', 'load', 'concurrent', 'high traffic',
      'many users', 'distributed', 'horizontal', 'vertical'
    ];
    
    const hasScalabilityNeeds = scalabilityIndicators.some(indicator => 
      taskText.includes(indicator)
    );
    
    return {
      required: hasScalabilityNeeds,
      type: this.determineScalabilityType(taskText),
      considerations: this.getScalabilityConsiderations(taskText)
    };
  }
  
  identifyIntegrationPoints(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const integrationKeywords = [
      'api', 'service', 'database', 'external', 'third-party',
      'integrate', 'connect', 'interface', 'webhook', 'messaging'
    ];
    
    const integrationPoints = integrationKeywords.filter(keyword => 
      taskText.includes(keyword)
    );
    
    return {
      count: integrationPoints.length,
      types: integrationPoints,
      complexity: integrationPoints.length > 3 ? 'high' : 
                  integrationPoints.length > 1 ? 'medium' : 'low'
    };
  }
  
  analyzeComponentStructure(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const componentIndicators = [
      'component', 'module', 'service', 'class', 'function',
      'library', 'package', 'namespace'
    ];
    
    const structureComplexity = componentIndicators.filter(indicator => 
      taskText.includes(indicator)
    ).length;
    
    return {
      complexity: structureComplexity > 3 ? 'high' : 
                  structureComplexity > 1 ? 'medium' : 'low',
      recommendedStructure: this.recommendStructure(structureComplexity),
      considerations: this.getStructureConsiderations(structureComplexity)
    };
  }
  
  recommendArchitecturalApproach(analysis, task) {
    const { architecturalComplexity, scalabilityRequirements, integrationPoints } = analysis;
    
    if (architecturalComplexity.level === 'high' || 
        scalabilityRequirements.required ||
        integrationPoints.complexity === 'high') {
      return {
        approach: 'layered-architecture',
        rationale: 'Complex requirements need structured approach',
        components: ['presentation', 'business', 'data', 'integration'],
        benefits: ['separation of concerns', 'maintainability', 'testability']
      };
    }
    
    if (architecturalComplexity.level === 'medium') {
      return {
        approach: 'modular-architecture',
        rationale: 'Moderate complexity benefits from modular design',
        components: ['core', 'features', 'shared'],
        benefits: ['reusability', 'maintainability', 'clear boundaries']
      };
    }
    
    return {
      approach: 'simple-architecture',
      rationale: 'Low complexity allows for straightforward implementation',
      components: ['main', 'utilities'],
      benefits: ['simplicity', 'quick development', 'easy maintenance']
    };
  }
  
  recommendDesignPatterns(analysis, task) {
    const relevantPatterns = analysis.designPatterns.slice(0, 3); // Top 3 patterns
    
    return relevantPatterns.map(patternInfo => ({
      pattern: patternInfo.pattern,
      applicability: patternInfo.relevance,
      implementation: this.getPatternImplementationGuidance(patternInfo.pattern),
      benefits: patternInfo.benefits
    }));
  }
  
  recommendComponentStructure(analysis, task) {
    const { componentStructure } = analysis;
    
    return {
      structure: componentStructure.recommendedStructure,
      organization: this.getOrganizationPrinciples(componentStructure.complexity),
      naming: this.getNamingConventions(),
      dependencies: this.getDependencyGuidelines()
    };
  }
  
  recommendScalabilityStrategy(analysis, task) {
    const { scalabilityRequirements } = analysis;
    
    if (!scalabilityRequirements.required) {
      return {
        strategy: 'none-required',
        rationale: 'Current requirements do not indicate scalability needs'
      };
    }
    
    return {
      strategy: scalabilityRequirements.type,
      implementation: this.getScalabilityImplementation(scalabilityRequirements.type),
      monitoring: this.getScalabilityMonitoring(),
      considerations: scalabilityRequirements.considerations
    };
  }
  
  recommendIntegrationStrategy(analysis, task) {
    const { integrationPoints } = analysis;
    
    if (integrationPoints.count === 0) {
      return {
        strategy: 'no-integration',
        rationale: 'No external integrations identified'
      };
    }
    
    return {
      strategy: 'api-first',
      patterns: this.getIntegrationPatterns(integrationPoints.complexity),
      errorHandling: this.getIntegrationErrorHandling(),
      testing: this.getIntegrationTesting()
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { architecturalComplexity } = analysis;
    
    const baseSteps = [
      'Define architectural boundaries',
      'Identify core components',
      'Design component interfaces',
      'Implement core functionality',
      'Add integration points',
      'Implement error handling',
      'Add logging and monitoring',
      'Write tests',
      'Document architecture'
    ];
    
    const steps = architecturalComplexity.level === 'high' ? baseSteps :
                  architecturalComplexity.level === 'medium' ? baseSteps.slice(0, 7) :
                  baseSteps.slice(0, 5);
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredResources(architecturalComplexity.level),
      timeline: this.calculateImplementationTimeline(steps.length)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = ['architecture-review', 'code-review', 'integration-testing'];
    
    if (analysis.scalabilityRequirements.required) {
      baseChecks.push('performance-testing');
    }
    
    if (analysis.integrationPoints.count > 0) {
      baseChecks.push('integration-validation');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { architecturalComplexity, integrationPoints, scalabilityRequirements } = analysis;
    
    let baseDays = architecturalComplexity.level === 'high' ? 5 :
                   architecturalComplexity.level === 'medium' ? 3 : 1;
    
    if (integrationPoints.complexity === 'high') baseDays += 2;
    if (scalabilityRequirements.required) baseDays += 1;
    
    return {
      estimate: `${baseDays}-${baseDays + 2} days`,
      confidence: 0.8,
      factors: [
        `Architectural complexity: ${architecturalComplexity.level}`,
        `Integration complexity: ${integrationPoints.complexity}`,
        `Scalability required: ${scalabilityRequirements.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'enterprise-scale-system':
        return analysis.architecturalComplexity.score > 7 ||
               analysis.integrationPoints.count > 5;
      
      case 'cross-domain-coordination':
        return analysis.integrationPoints.complexity === 'high' &&
               analysis.scalabilityRequirements.required;
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 7;
  }
  
  // Helper methods
  getComplexityIndicators(taskText) {
    const indicators = [];
    if (taskText.includes('distributed')) indicators.push('distributed-system');
    if (taskText.includes('microservice')) indicators.push('microservices');
    if (taskText.includes('scale')) indicators.push('scalability');
    if (taskText.includes('integration')) indicators.push('integration');
    return indicators;
  }
  
  calculatePatternRelevance(pattern, taskText) {
    // Simple relevance calculation based on keyword density
    return Math.random() * 0.5 + 0.5; // Mock implementation
  }
  
  getPatternBenefits(pattern) {
    const benefits = {
      'singleton': ['single instance', 'global access', 'resource efficiency'],
      'factory': ['flexible creation', 'loose coupling', 'extensibility'],
      'observer': ['loose coupling', 'dynamic relationships', 'event-driven'],
      'strategy': ['algorithm flexibility', 'runtime switching', 'extensibility'],
      'decorator': ['functionality extension', 'composition over inheritance'],
      'facade': ['simplified interface', 'subsystem decoupling'],
      'mvc': ['separation of concerns', 'maintainability', 'testability'],
      'repository': ['data abstraction', 'testability', 'centralized queries'],
      'dependency-injection': ['loose coupling', 'testability', 'flexibility']
    };
    
    return benefits[pattern] || ['improves design'];
  }
  
  determineScalabilityType(taskText) {
    if (taskText.includes('horizontal') || taskText.includes('distributed')) {
      return 'horizontal';
    }
    if (taskText.includes('vertical') || taskText.includes('upgrade')) {
      return 'vertical';
    }
    return 'horizontal'; // Default
  }
  
  getScalabilityConsiderations(taskText) {
    return [
      'Monitor performance metrics',
      'Plan for data consistency',
      'Design for fault tolerance',
      'Consider caching strategies'
    ];
  }
  
  recommendStructure(complexity) {
    if (complexity > 3) return 'layered';
    if (complexity > 1) return 'modular';
    return 'simple';
  }
  
  getStructureConsiderations(complexity) {
    const considerations = ['Clear interfaces', 'Single responsibility'];
    if (complexity > 1) considerations.push('Dependency management');
    if (complexity > 3) considerations.push('Layer isolation');
    return considerations;
  }
  
  getPatternImplementationGuidance(pattern) {
    return `Implement ${pattern} pattern following standard conventions`;
  }
  
  getOrganizationPrinciples(complexity) {
    return ['Single responsibility', 'Clear interfaces', 'Minimal dependencies'];
  }
  
  getNamingConventions() {
    return ['Use descriptive names', 'Follow language conventions', 'Be consistent'];
  }
  
  getDependencyGuidelines() {
    return ['Minimize dependencies', 'Use interfaces', 'Avoid circular dependencies'];
  }
  
  getScalabilityImplementation(type) {
    return `Implement ${type} scaling with proper monitoring`;
  }
  
  getScalabilityMonitoring() {
    return ['Response time', 'Throughput', 'Resource utilization'];
  }
  
  getIntegrationPatterns(complexity) {
    if (complexity === 'high') return ['Event-driven', 'Message queues', 'Circuit breaker'];
    if (complexity === 'medium') return ['REST APIs', 'Error handling'];
    return ['Simple APIs'];
  }
  
  getIntegrationErrorHandling() {
    return ['Retry mechanisms', 'Graceful degradation', 'Error logging'];
  }
  
  getIntegrationTesting() {
    return ['Contract testing', 'Integration tests', 'Mock external services'];
  }
  
  getRequiredResources(complexity) {
    const resources = ['Developer time', 'Testing environment'];
    if (complexity === 'high') resources.push('Architecture review', 'Performance testing tools');
    return resources;
  }
  
  calculateImplementationTimeline(stepCount) {
    return {
      planning: '1 day',
      implementation: `${Math.ceil(stepCount * 0.5)} days`,
      testing: '1 day',
      review: '1 day'
    };
  }
}

module.exports = ArchitectureGeneralist;