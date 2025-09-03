/**
 * Base Specialist Class
 * Provides common functionality for all specialist types
 */
class BaseSpecialist {
  constructor(config = {}) {
    this.id = config.id;
    this.name = config.name;
    this.domain = config.domain;
    this.expertise = config.expertise || [];
    this.tier = config.tier;
    this.prerequisites = config.prerequisites || [];
    this.handoffCriteria = config.handoffCriteria || [];
  }
  
  async consult(task, context = {}) {
    try {
      // Validate consultation prerequisites
      this.validatePrerequisites(context);
      
      // Perform consultation
      const analysis = await this.analyze(task, context);
      const recommendations = await this.generateRecommendations(analysis, task, context);
      
      // Check if handoff is needed
      const handoffRequired = this.checkHandoffRequired(analysis, task);
      
      return {
        specialist: this.id,
        domain: this.domain,
        tier: this.tier,
        analysis,
        recommendations,
        handoffRequired,
        consultation: {
          timestamp: new Date().toISOString(),
          confidence: this.calculateConfidence(analysis),
          quality: this.assessQuality(recommendations),
          nextSteps: this.defineNextSteps(recommendations, handoffRequired)
        }
      };
    } catch (error) {
      return this.handleConsultationError(error, task, context);
    }
  }
  
  validatePrerequisites(context) {
    for (const prerequisite of this.prerequisites) {
      if (!context[prerequisite]) {
        throw new Error(`Missing prerequisite: ${prerequisite}`);
      }
    }
  }
  
  async analyze(task, context) {
    // Base analysis - to be overridden by specific specialists
    return {
      taskComplexity: this.assessTaskComplexity(task),
      domainRelevance: this.assessDomainRelevance(task),
      contextualFactors: this.analyzeContext(context),
      constraints: this.identifyConstraints(task, context),
      risks: this.identifyRisks(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    // Base recommendations - to be overridden by specific specialists
    return {
      primaryRecommendation: this.getPrimaryRecommendation(analysis, task),
      alternatives: this.getAlternativeRecommendations(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
  }
  
  checkHandoffRequired(analysis, task) {
    // Check against handoff criteria
    for (const criterion of this.handoffCriteria) {
      if (this.evaluateHandoffCriterion(criterion, analysis, task)) {
        return {
          required: true,
          reason: criterion.reason,
          targetTier: criterion.targetTier,
          targetSpecialist: criterion.targetSpecialist
        };
      }
    }
    
    return { required: false };
  }
  
  calculateConfidence(analysis) {
    let confidence = 0.7; // Base confidence
    
    // Adjust based on domain relevance
    confidence += analysis.domainRelevance * 0.2;
    
    // Adjust based on task complexity match with expertise
    if (analysis.taskComplexity <= this.getMaxComplexityHandled()) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
  
  assessQuality(recommendations) {
    return {
      completeness: this.assessCompleteness(recommendations),
      specificity: this.assessSpecificity(recommendations),
      actionability: this.assessActionability(recommendations),
      riskAssessment: this.assessRiskCoverage(recommendations)
    };
  }
  
  defineNextSteps(recommendations, handoffRequired) {
    if (handoffRequired.required) {
      return {
        action: 'handoff',
        target: handoffRequired.targetSpecialist,
        reason: handoffRequired.reason,
        context: this.prepareHandoffContext(recommendations)
      };
    }
    
    return {
      action: 'implement',
      priority: recommendations.implementation.priority,
      timeline: recommendations.timeline,
      qualityGates: recommendations.qualityChecks
    };
  }
  
  handleConsultationError(error, task, context) {
    return {
      specialist: this.id,
      error: {
        type: error.name,
        message: error.message,
        severity: this.assessErrorSeverity(error),
        recovery: this.suggestRecovery(error, task, context)
      },
      fallback: this.provideFallbackRecommendation(task, context)
    };
  }
  
  // Helper methods to be implemented by specific specialists
  assessTaskComplexity(task) {
    // Default implementation
    return task.description ? task.description.length / 100 : 1;
  }
  
  assessDomainRelevance(task) {
    const taskText = task.description?.toLowerCase() || '';
    const relevantKeywords = this.expertise;
    const matches = relevantKeywords.filter(keyword => 
      taskText.includes(keyword.toLowerCase())
    ).length;
    
    return Math.min(matches / relevantKeywords.length, 1.0);
  }
  
  analyzeContext(context) {
    return {
      projectSize: context.projectSize || 'unknown',
      teamSize: context.teamSize || 'unknown',
      timeline: context.timeline || 'unknown',
      constraints: context.constraints || []
    };
  }
  
  identifyConstraints(task, context) {
    return context.constraints || [];
  }
  
  identifyRisks(task, context) {
    return [];
  }
  
  getPrimaryRecommendation(analysis, task) {
    return {
      approach: 'standard',
      rationale: 'Based on standard practices for this domain',
      confidence: 0.8
    };
  }
  
  getAlternativeRecommendations(analysis, task) {
    return [];
  }
  
  getImplementationGuidance(analysis, task) {
    return {
      steps: ['Analyze requirements', 'Design solution', 'Implement', 'Test'],
      priority: 'medium',
      resources: []
    };
  }
  
  getQualityChecks(analysis, task) {
    return ['code-review', 'testing'];
  }
  
  estimateTimeline(analysis, task) {
    return {
      estimate: '1-2 days',
      confidence: 0.7
    };
  }
  
  getMaxComplexityHandled() {
    // Override in specific specialists
    return 5;
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    // Override in specific specialists
    return false;
  }
  
  assessCompleteness(recommendations) {
    return 0.8;
  }
  
  assessSpecificity(recommendations) {
    return 0.7;
  }
  
  assessActionability(recommendations) {
    return 0.8;
  }
  
  assessRiskCoverage(recommendations) {
    return 0.6;
  }
  
  prepareHandoffContext(recommendations) {
    return {
      analysis: recommendations,
      timestamp: new Date().toISOString(),
      specialist: this.id
    };
  }
  
  assessErrorSeverity(error) {
    return 'medium';
  }
  
  suggestRecovery(error, task, context) {
    return {
      action: 'retry',
      modifications: []
    };
  }
  
  provideFallbackRecommendation(task, context) {
    return {
      approach: 'conservative',
      rationale: 'Fallback recommendation due to consultation error',
      confidence: 0.5
    };
  }
}

module.exports = BaseSpecialist;