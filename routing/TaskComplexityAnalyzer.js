/**
 * Task Complexity Analyzer
 * Enhanced analyzer with sophisticated multi-dimensional complexity assessment
 * Analyzes task complexity across multiple dimensions to determine intelligent routing
 */
class TaskComplexityAnalyzer {
  static analyzeTask(task) {
    const complexity = {
      scope: this.analyzeScopeComplexity(task),
      technical: this.analyzeTechnicalComplexity(task),
      domain: this.analyzeDomainComplexity(task),
      risk: this.analyzeRiskLevel(task),
      temporal: this.analyzeTemporalComplexity(task),
      stakeholder: this.analyzeStakeholderComplexity(task),
      uncertainty: this.analyzeUncertaintyLevel(task),
      dependencies: this.analyzeDependencyComplexity(task)
    };
    
    const result = this.calculateOverallComplexity(complexity);
    return {
      tier: result,
      score: this.calculateNumericScore(complexity),
      dimensions: complexity,
      confidence: this.calculateConfidence(task, complexity),
      reasoning: this.generateReasoning(complexity)
    };
  }
  
  static analyzeScopeComplexity(task) {
    const indicators = {
      multipleComponents: this.checkMultipleComponents(task),
      crossDomain: this.checkCrossDomainImpact(task),
      integrationRequired: this.checkIntegrationRequired(task),
      dataFlowChanges: this.checkDataFlowChanges(task)
    };
    
    let score = 1;
    if (indicators.multipleComponents) score += 2;
    if (indicators.crossDomain) score += 2;
    if (indicators.integrationRequired) score += 1;
    if (indicators.dataFlowChanges) score += 1;
    
    return Math.min(score, 10);
  }
  
  static analyzeTechnicalComplexity(task) {
    const indicators = {
      newTechnology: this.checkNewTechnology(task),
      performanceCritical: this.checkPerformanceCritical(task),
      algorithmicComplexity: this.checkAlgorithmicComplexity(task),
      concurrencyRequired: this.checkConcurrencyRequired(task)
    };
    
    let score = 1;
    if (indicators.newTechnology) score += 2;
    if (indicators.performanceCritical) score += 2;
    if (indicators.algorithmicComplexity) score += 3;
    if (indicators.concurrencyRequired) score += 2;
    
    return Math.min(score, 10);
  }
  
  static analyzeDomainComplexity(task) {
    const domainKeywords = {
      security: {
        keywords: ['auth', 'security', 'encryption', 'oauth', 'jwt', 'permission', 'vulnerability', 'threat', 'compliance', 'audit'],
        weight: 2.5
      },
      performance: {
        keywords: ['optimization', 'cache', 'performance', 'speed', 'latency', 'bottleneck', 'profiling', 'monitoring'],
        weight: 2.0
      },
      data: {
        keywords: ['database', 'query', 'data', 'analytics', 'migration', 'etl', 'warehouse', 'lake', 'governance'],
        weight: 2.0
      },
      architecture: {
        keywords: ['architecture', 'design', 'pattern', 'scalability', 'microservices', 'distributed', 'system design'],
        weight: 2.5
      },
      integration: {
        keywords: ['api', 'integration', 'service', 'webhook', 'event', 'messaging', 'orchestration', 'choreography'],
        weight: 2.0
      },
      ml: {
        keywords: ['machine learning', 'ai', 'model', 'training', 'inference', 'ml', 'neural', 'algorithm'],
        weight: 3.0
      },
      devops: {
        keywords: ['deployment', 'ci/cd', 'infrastructure', 'kubernetes', 'docker', 'monitoring', 'observability'],
        weight: 1.5
      }
    };
    
    const taskText = task.description?.toLowerCase() || '';
    let score = 1;
    let domainDepth = 0;
    
    Object.entries(domainKeywords).forEach(([domain, config]) => {
      const matches = config.keywords.filter(keyword => taskText.includes(keyword));
      if (matches.length > 0) {
        domainDepth += matches.length * config.weight;
      }
    });
    
    score += Math.min(domainDepth / 2, 8);
    return Math.min(score, 10);
  }
  
  static analyzeRiskLevel(task) {
    const riskFactors = {
      productionImpact: this.checkProductionImpact(task),
      dataConsistency: this.checkDataConsistencyRisk(task),
      securityImplications: this.checkSecurityImplications(task),
      backwardCompatibility: this.checkBackwardCompatibility(task)
    };
    
    let score = 1;
    if (riskFactors.productionImpact) score += 3;
    if (riskFactors.dataConsistency) score += 2;
    if (riskFactors.securityImplications) score += 2;
    if (riskFactors.backwardCompatibility) score += 2;
    
    return Math.min(score, 10);
  }
  
  static calculateOverallComplexity(complexity) {
    const weights = {
      scope: 0.20,
      technical: 0.25,
      domain: 0.20,
      risk: 0.15,
      temporal: 0.05,
      stakeholder: 0.05,
      uncertainty: 0.05,
      dependencies: 0.05
    };
    
    const score = Object.entries(complexity).reduce((total, [dimension, value]) => {
      return total + (value * (weights[dimension] || 0));
    }, 0);
    
    const adjustedScore = this.applyContextualAdjustments(score, complexity);
    
    if (adjustedScore <= 3.5) return 'DIRECT';    // 80% - Direct implementation
    if (adjustedScore <= 6.5) return 'TIER_1';   // 15% - Tier 1 consultation
    if (adjustedScore <= 8.5) return 'TIER_2';   // 4% - Tier 2 deep analysis
    return 'TIER_3';                             // 1% - Tier 3 coordination
  }
  
  static calculateNumericScore(complexity) {
    const weights = {
      scope: 0.20, technical: 0.25, domain: 0.20, risk: 0.15,
      temporal: 0.05, stakeholder: 0.05, uncertainty: 0.05, dependencies: 0.05
    };
    
    return Object.entries(complexity).reduce((total, [dimension, value]) => {
      return total + (value * (weights[dimension] || 0));
    }, 0);
  }
  
  static applyContextualAdjustments(score, complexity) {
    let adjusted = score;
    
    if (complexity.risk > 8 && complexity.uncertainty > 7) {
      adjusted += 1.0;
    }
    
    if (complexity.dependencies > 8 && complexity.stakeholder > 6) {
      adjusted += 0.5;
    }
    
    if (complexity.technical > 8 && complexity.domain > 8) {
      adjusted += 0.5;
    }
    
    return Math.min(adjusted, 10);
  }
  
  // Helper methods for scope analysis
  static checkMultipleComponents(task) {
    const componentKeywords = ['component', 'module', 'service', 'system'];
    const taskText = task.description?.toLowerCase() || '';
    return componentKeywords.some(keyword => 
      (taskText.match(new RegExp(keyword, 'g')) || []).length > 1
    );
  }
  
  static checkCrossDomainImpact(task) {
    const domains = ['frontend', 'backend', 'database', 'api', 'ui', 'server'];
    const taskText = task.description?.toLowerCase() || '';
    return domains.filter(domain => taskText.includes(domain)).length > 1;
  }
  
  static checkIntegrationRequired(task) {
    const integrationKeywords = ['integrate', 'connect', 'sync', 'webhook', 'api'];
    const taskText = task.description?.toLowerCase() || '';
    return integrationKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static checkDataFlowChanges(task) {
    const dataFlowKeywords = ['data flow', 'pipeline', 'stream', 'queue', 'event'];
    const taskText = task.description?.toLowerCase() || '';
    return dataFlowKeywords.some(keyword => taskText.includes(keyword));
  }
  
  // Helper methods for technical analysis
  static checkNewTechnology(task) {
    const newTechKeywords = ['new', 'implement', 'introduce', 'adopt', 'migrate'];
    const taskText = task.description?.toLowerCase() || '';
    return newTechKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static checkPerformanceCritical(task) {
    const performanceKeywords = ['performance', 'optimize', 'fast', 'speed', 'latency', 'cache'];
    const taskText = task.description?.toLowerCase() || '';
    return performanceKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static checkAlgorithmicComplexity(task) {
    const algorithmKeywords = ['algorithm', 'sort', 'search', 'optimize', 'complex logic'];
    const taskText = task.description?.toLowerCase() || '';
    return algorithmKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static checkConcurrencyRequired(task) {
    const concurrencyKeywords = ['concurrent', 'parallel', 'async', 'thread', 'queue'];
    const taskText = task.description?.toLowerCase() || '';
    return concurrencyKeywords.some(keyword => taskText.includes(keyword));
  }
  
  // Helper methods for risk analysis
  static checkProductionImpact(task) {
    const productionKeywords = ['production', 'live', 'deploy', 'release', 'critical'];
    const taskText = task.description?.toLowerCase() || '';
    return productionKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static checkDataConsistencyRisk(task) {
    const dataRiskKeywords = ['migration', 'data change', 'schema', 'consistency'];
    const taskText = task.description?.toLowerCase() || '';
    return dataRiskKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static checkSecurityImplications(task) {
    const securityKeywords = ['security', 'auth', 'permission', 'encryption', 'sensitive'];
    const taskText = task.description?.toLowerCase() || '';
    return securityKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static checkBackwardCompatibility(task) {
    const compatibilityKeywords = ['breaking change', 'compatibility', 'legacy', 'version'];
    const taskText = task.description?.toLowerCase() || '';
    return compatibilityKeywords.some(keyword => taskText.includes(keyword));
  }
  
  static analyzeTemporalComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    const urgencyKeywords = ['urgent', 'asap', 'immediate', 'critical', 'emergency'];
    const timeConstraintKeywords = ['deadline', 'timeline', 'schedule', 'time-sensitive'];
    const longTermKeywords = ['roadmap', 'strategic', 'long-term', 'future', 'evolution'];
    
    let score = 1;
    
    if (urgencyKeywords.some(keyword => taskText.includes(keyword))) {
      score += 2;
    }
    
    if (timeConstraintKeywords.some(keyword => taskText.includes(keyword))) {
      score += 1;
    }
    
    if (longTermKeywords.some(keyword => taskText.includes(keyword))) {
      score += 3;
    }
    
    const estimatedDuration = this.estimateTaskDuration(task);
    if (estimatedDuration > 30) score += 2;
    if (estimatedDuration > 90) score += 1;
    
    return Math.min(score, 10);
  }
  
  static analyzeStakeholderComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    const stakeholderKeywords = ['stakeholder', 'team', 'department', 'user', 'client', 'customer'];
    const approvalKeywords = ['approval', 'sign-off', 'review', 'governance', 'compliance'];
    const crossFunctionalKeywords = ['cross-functional', 'multi-team', 'coordination', 'collaboration'];
    
    let score = 1;
    let stakeholderCount = 0;
    
    stakeholderKeywords.forEach(keyword => {
      const matches = (taskText.match(new RegExp(keyword, 'g')) || []).length;
      stakeholderCount += matches;
    });
    
    score += Math.min(stakeholderCount, 3);
    
    if (approvalKeywords.some(keyword => taskText.includes(keyword))) {
      score += 2;
    }
    
    if (crossFunctionalKeywords.some(keyword => taskText.includes(keyword))) {
      score += 2;
    }
    
    return Math.min(score, 10);
  }
  
  static analyzeUncertaintyLevel(task) {
    const taskText = task.description?.toLowerCase() || '';
    const uncertaintyKeywords = ['unclear', 'unknown', 'investigate', 'research', 'explore'];
    const experimentalKeywords = ['experiment', 'prototype', 'proof of concept', 'pilot', 'trial'];
    const unknownScopeKeywords = ['tbd', 'to be determined', 'flexible', 'adaptive', 'iterative'];
    
    let score = 1;
    
    if (uncertaintyKeywords.some(keyword => taskText.includes(keyword))) {
      score += 3;
    }
    
    if (experimentalKeywords.some(keyword => taskText.includes(keyword))) {
      score += 2;
    }
    
    if (unknownScopeKeywords.some(keyword => taskText.includes(keyword))) {
      score += 2;
    }
    
    const questionMarks = (taskText.match(/\?/g) || []).length;
    score += Math.min(questionMarks * 0.5, 2);
    
    return Math.min(score, 10);
  }
  
  static analyzeDependencyComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    const dependencyKeywords = ['depends on', 'requires', 'needs', 'prerequisite', 'blocks', 'blocked by'];
    const externalKeywords = ['external', 'third-party', '3rd party', 'vendor', 'partner'];
    const systemKeywords = ['system', 'service', 'component', 'module', 'library'];
    
    let score = 1;
    let dependencyCount = 0;
    
    dependencyKeywords.forEach(keyword => {
      if (taskText.includes(keyword)) dependencyCount++;
    });
    
    score += Math.min(dependencyCount * 1.5, 4);
    
    if (externalKeywords.some(keyword => taskText.includes(keyword))) {
      score += 2;
    }
    
    const systemMatches = systemKeywords.filter(keyword => taskText.includes(keyword)).length;
    score += Math.min(systemMatches * 0.5, 2);
    
    return Math.min(score, 10);
  }
  
  static estimateTaskDuration(task) {
    const taskText = task.description?.toLowerCase() || '';
    const quickKeywords = ['fix', 'update', 'change', 'modify'];
    const mediumKeywords = ['implement', 'create', 'build', 'develop'];
    const longKeywords = ['design', 'architect', 'migrate', 'refactor', 'transform'];
    
    if (quickKeywords.some(keyword => taskText.includes(keyword))) return 5;
    if (mediumKeywords.some(keyword => taskText.includes(keyword))) return 20;
    if (longKeywords.some(keyword => taskText.includes(keyword))) return 60;
    
    return 15;
  }
  
  static calculateConfidence(task, complexity) {
    let confidence = 0.8;
    
    const taskLength = (task.description || '').length;
    if (taskLength < 50) confidence -= 0.2;
    if (taskLength > 200) confidence += 0.1;
    
    if (complexity.uncertainty > 7) confidence -= 0.3;
    if (complexity.uncertainty < 3) confidence += 0.1;
    
    const hasSpecificKeywords = this.hasSpecificTechnicalTerms(task);
    if (hasSpecificKeywords) confidence += 0.1;
    
    return Math.max(0.3, Math.min(1.0, confidence));
  }
  
  static hasSpecificTechnicalTerms(task) {
    const technicalTerms = [
      'react', 'nodejs', 'python', 'javascript', 'typescript', 'docker',
      'kubernetes', 'aws', 'gcp', 'azure', 'postgresql', 'mongodb',
      'redis', 'graphql', 'rest api', 'microservices'
    ];
    
    const taskText = task.description?.toLowerCase() || '';
    return technicalTerms.some(term => taskText.includes(term));
  }
  
  static generateReasoning(complexity) {
    const reasons = [];
    
    if (complexity.scope > 7) reasons.push('High scope complexity due to multi-component impact');
    if (complexity.technical > 7) reasons.push('High technical complexity requiring specialized expertise');
    if (complexity.domain > 7) reasons.push('High domain complexity spanning multiple areas');
    if (complexity.risk > 7) reasons.push('High risk requiring careful consideration');
    if (complexity.uncertainty > 6) reasons.push('Significant uncertainty requiring exploration');
    if (complexity.dependencies > 6) reasons.push('Complex dependencies requiring coordination');
    
    if (reasons.length === 0) {
      reasons.push('Relatively straightforward task suitable for direct implementation');
    }
    
    return reasons;
  }
}

module.exports = TaskComplexityAnalyzer;