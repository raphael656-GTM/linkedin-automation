const TaskComplexityAnalyzer = require('./TaskComplexityAnalyzer');

/**
 * Intelligent Task Router
 * Routes tasks to appropriate specialists based on complexity and domain analysis
 */
class TaskRouter {
  constructor(config = {}) {
    this.config = {
      distributionTargets: {
        DIRECT: 80,
        TIER_1: 15,
        TIER_2: 4,
        TIER_3: 1
      },
      ...config
    };
    
    this.specialists = this.loadSpecialistRegistry();
  }
  
  static route(task, context = {}) {
    const complexity = TaskComplexityAnalyzer.analyzeTask(task);
    const specialist = this.selectSpecialist(task, complexity);
    
    return {
      complexity,
      specialist,
      protocol: this.getProtocol(complexity),
      estimatedTime: this.estimateTime(complexity),
      qualityChecks: this.getQualityChecks(complexity),
      routing: {
        tier: complexity,
        confidence: this.calculateConfidence(task, complexity),
        alternatives: this.getAlternatives(task, complexity)
      }
    };
  }
  
  static selectSpecialist(task, complexity) {
    const domain = this.identifyDomain(task);
    const specialists = this.getSpecialistsForDomain(domain, complexity);
    return this.selectBestSpecialist(specialists, task);
  }
  
  static identifyDomain(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const domainPatterns = {
      architecture: ['architecture', 'design', 'pattern', 'scalability', 'system design'],
      security: ['auth', 'security', 'encryption', 'oauth', 'jwt', 'permission', 'vulnerability'],
      performance: ['performance', 'optimization', 'cache', 'speed', 'latency', 'memory'],
      data: ['database', 'query', 'data', 'analytics', 'migration', 'sql', 'nosql'],
      integration: ['api', 'integration', 'service', 'webhook', 'event', 'microservice'],
      frontend: ['ui', 'component', 'react', 'vue', 'angular', 'css', 'responsive'],
      testing: ['test', 'testing', 'qa', 'automation', 'ci/cd', 'quality'],
      ml: ['ml', 'ai', 'machine learning', 'model', 'prediction', 'analytics']
    };
    
    let bestMatch = 'general';
    let maxScore = 0;
    
    Object.entries(domainPatterns).forEach(([domain, patterns]) => {
      const score = patterns.filter(pattern => taskText.includes(pattern)).length;
      if (score > maxScore) {
        maxScore = score;
        bestMatch = domain;
      }
    });
    
    return bestMatch;
  }
  
  static getSpecialistsForDomain(domain, complexity) {
    const specialistMapping = {
      DIRECT: [],
      TIER_1: {
        architecture: ['architecture-generalist'],
        security: ['security-generalist'],
        performance: ['performance-generalist'],
        data: ['data-generalist'],
        integration: ['integration-generalist'],
        frontend: ['frontend-generalist'],
        general: ['architecture-generalist']
      },
      TIER_2: {
        data: ['database-specialist'],
        integration: ['api-design-specialist'],
        security: ['auth-systems-specialist'],
        performance: ['performance-optimization-specialist'],
        ml: ['ml-integration-specialist'],
        testing: ['testing-strategy-specialist'],
        general: ['database-specialist']
      },
      TIER_3: {
        architecture: ['system-architect'],
        integration: ['integration-architect'],
        performance: ['scale-architect'],
        security: ['security-architect'],
        data: ['data-architect'],
        general: ['system-architect']
      }
    };
    
    if (complexity === 'DIRECT') return [];
    
    const tierMapping = specialistMapping[complexity];
    return tierMapping[domain] || tierMapping.general || [];
  }
  
  static selectBestSpecialist(specialists, task) {
    if (specialists.length === 0) return null;
    if (specialists.length === 1) return specialists[0];
    
    // For multiple specialists, select based on task keywords
    const taskText = task.description?.toLowerCase() || '';
    
    const specialistPriority = {
      'database-specialist': ['database', 'sql', 'query', 'data'],
      'api-design-specialist': ['api', 'rest', 'graphql', 'endpoint'],
      'auth-systems-specialist': ['auth', 'oauth', 'jwt', 'login'],
      'performance-optimization-specialist': ['performance', 'optimization', 'speed'],
      'ml-integration-specialist': ['ml', 'ai', 'model', 'prediction'],
      'testing-strategy-specialist': ['test', 'testing', 'qa', 'automation']
    };
    
    let bestSpecialist = specialists[0];
    let maxRelevance = 0;
    
    specialists.forEach(specialist => {
      const keywords = specialistPriority[specialist] || [];
      const relevance = keywords.filter(keyword => taskText.includes(keyword)).length;
      if (relevance > maxRelevance) {
        maxRelevance = relevance;
        bestSpecialist = specialist;
      }
    });
    
    return bestSpecialist;
  }
  
  static getProtocol(complexity) {
    const protocols = {
      DIRECT: 'direct-implementation',
      TIER_1: 'consultation-protocol',
      TIER_2: 'deep-analysis-protocol',
      TIER_3: 'coordination-protocol'
    };
    
    return protocols[complexity];
  }
  
  static estimateTime(complexity) {
    const timeEstimates = {
      DIRECT: { min: 15, max: 60, unit: 'minutes' },
      TIER_1: { min: 1, max: 4, unit: 'hours' },
      TIER_2: { min: 4, max: 24, unit: 'hours' },
      TIER_3: { min: 1, max: 5, unit: 'days' }
    };
    
    return timeEstimates[complexity];
  }
  
  static getQualityChecks(complexity) {
    const qualityChecks = {
      DIRECT: ['syntax-check', 'basic-testing'],
      TIER_1: ['syntax-check', 'integration-testing', 'code-review'],
      TIER_2: ['comprehensive-testing', 'security-audit', 'performance-review', 'architecture-review'],
      TIER_3: ['full-qa-suite', 'security-audit', 'performance-audit', 'architecture-audit', 'compliance-check']
    };
    
    return qualityChecks[complexity];
  }
  
  static calculateConfidence(task, complexity) {
    let confidence = 0.8; // Base confidence
    
    // Adjust based on task clarity
    if (task.description && task.description.length > 50) confidence += 0.1;
    if (task.requirements && task.requirements.length > 0) confidence += 0.1;
    
    // Adjust based on complexity alignment
    const taskText = task.description?.toLowerCase() || '';
    const complexityIndicators = {
      DIRECT: ['simple', 'basic', 'quick', 'straightforward'],
      TIER_1: ['moderate', 'standard', 'typical'],
      TIER_2: ['complex', 'advanced', 'detailed'],
      TIER_3: ['enterprise', 'large-scale', 'critical', 'strategic']
    };
    
    const indicators = complexityIndicators[complexity] || [];
    if (indicators.some(indicator => taskText.includes(indicator))) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
  
  static getAlternatives(task, primaryComplexity) {
    const alternatives = [];
    
    // Always consider one tier lower if not already DIRECT
    if (primaryComplexity === 'TIER_1') {
      alternatives.push({ tier: 'DIRECT', reason: 'If task is simpler than assessed' });
    } else if (primaryComplexity === 'TIER_2') {
      alternatives.push({ tier: 'TIER_1', reason: 'If deep analysis not required' });
    } else if (primaryComplexity === 'TIER_3') {
      alternatives.push({ tier: 'TIER_2', reason: 'If coordination not needed' });
    }
    
    // Always consider one tier higher for safety
    if (primaryComplexity === 'DIRECT') {
      alternatives.push({ tier: 'TIER_1', reason: 'If complications arise' });
    } else if (primaryComplexity === 'TIER_1') {
      alternatives.push({ tier: 'TIER_2', reason: 'If deeper expertise needed' });
    } else if (primaryComplexity === 'TIER_2') {
      alternatives.push({ tier: 'TIER_3', reason: 'If architectural oversight required' });
    }
    
    return alternatives;
  }
  
  loadSpecialistRegistry() {
    // This would load from a configuration file in a real implementation
    return {
      tier1: [
        'architecture-generalist',
        'security-generalist',
        'performance-generalist',
        'data-generalist',
        'integration-generalist',
        'frontend-generalist'
      ],
      tier2: [
        'database-specialist',
        'api-design-specialist',
        'auth-systems-specialist',
        'performance-optimization-specialist',
        'ml-integration-specialist',
        'testing-strategy-specialist'
      ],
      tier3: [
        'system-architect',
        'integration-architect',
        'scale-architect',
        'security-architect',
        'data-architect',
        'governance-architect'
      ]
    };
  }
}

module.exports = TaskRouter;