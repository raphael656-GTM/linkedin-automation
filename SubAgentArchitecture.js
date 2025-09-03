/**
 * Sub-Agent Architecture - Main Integration Class
 * Provides a unified interface to the sub-agent system
 */

const TaskComplexityAnalyzer = require('./routing/TaskComplexityAnalyzer');
const TaskRouter = require('./routing/TaskRouter');
const { QualityAssurance } = require('./quality/QualityAssurance');
const { ContextManager } = require('./context/ContextManager');
const { ErrorDetectionSystem } = require('./recovery/ErrorRecovery');
const { T1ToT2Handoff, T2ToT3Escalation } = require('./protocols/HandoffProtocols');

// Import all specialists
const ArchitectureGeneralist = require('./specialists/tier1/ArchitectureGeneralist');
const SecurityGeneralist = require('./specialists/tier1/SecurityGeneralist');
const PerformanceGeneralist = require('./specialists/tier1/PerformanceGeneralist');
const DataGeneralist = require('./specialists/tier1/DataGeneralist');
const IntegrationGeneralist = require('./specialists/tier1/IntegrationGeneralist');
const FrontendGeneralist = require('./specialists/tier1/FrontendGeneralist');

const DatabaseSpecialist = require('./specialists/tier2/DatabaseSpecialist');
const SystemArchitect = require('./specialists/tier3/SystemArchitect');

class SubAgentArchitecture {
  constructor(options = {}) {
    this.options = {
      configPath: options.configPath || './config/sub-agent-config.json',
      contextStorage: options.contextStorage || './context/',
      learningEnabled: options.learningEnabled !== false,
      qualityAssuranceEnabled: options.qualityAssuranceEnabled !== false,
      errorRecoveryEnabled: options.errorRecoveryEnabled !== false,
      ...options
    };
    
    this.config = null;
    this.contextManager = null;
    this.qualityAssurance = null;
    this.errorDetection = null;
    this.specialists = new Map();
    this.initialized = false;
    
    this.stats = {
      tasksProcessed: 0,
      routingDecisions: new Map(),
      qualityScores: [],
      errorRecoveries: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }
  
  async initialize() {
    if (this.initialized) return this;
    
    try {
      // Load configuration
      await this.loadConfiguration();
      
      // Initialize core components
      await this.initializeComponents();
      
      // Register specialists
      this.registerSpecialists();
      
      // Initialize context manager
      if (this.options.learningEnabled) {
        await this.contextManager.initialize();
      }
      
      this.initialized = true;
      console.log('Sub-Agent Architecture initialized successfully');
      
      return this;
    } catch (error) {
      console.error('Failed to initialize Sub-Agent Architecture:', error);
      throw error;
    }
  }
  
  async loadConfiguration() {
    if (this.options.configPath && typeof this.options.configPath === 'string') {
      try {
        const fs = require('fs').promises;
        const configData = await fs.readFile(this.options.configPath, 'utf8');
        this.config = JSON.parse(configData);
      } catch (error) {
        console.warn('Could not load config file, using defaults:', error.message);
        this.config = this.getDefaultConfiguration();
      }
    } else {
      this.config = this.options.configPath || this.getDefaultConfiguration();
    }
  }
  
  async initializeComponents() {
    // Initialize Context Manager
    if (this.options.learningEnabled) {
      this.contextManager = new ContextManager({
        contextStoragePath: this.options.contextStorage,
        ...this.config.context
      });
    }
    
    // Initialize Quality Assurance
    if (this.options.qualityAssuranceEnabled) {
      this.qualityAssurance = new QualityAssurance(this.config.quality);
    }
    
    // Initialize Error Detection
    if (this.options.errorRecoveryEnabled) {
      this.errorDetection = new ErrorDetectionSystem(this.config.recovery);
    }
  }
  
  registerSpecialists() {
    // Register Tier 1 Specialists
    this.specialists.set('architecture-generalist', ArchitectureGeneralist);
    this.specialists.set('security-generalist', SecurityGeneralist);
    this.specialists.set('performance-generalist', PerformanceGeneralist);
    this.specialists.set('data-generalist', DataGeneralist);
    this.specialists.set('integration-generalist', IntegrationGeneralist);
    this.specialists.set('frontend-generalist', FrontendGeneralist);
    
    // Register Tier 2 Specialists
    this.specialists.set('database-specialist', DatabaseSpecialist);
    
    // Register Tier 3 Architects
    this.specialists.set('system-architect', SystemArchitect);
  }
  
  async route(task) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      // Analyze task complexity
      const complexity = TaskComplexityAnalyzer.analyzeTask(task);
      
      // Get routing decision
      const routing = TaskRouter.route(task, await this.getContext());
      
      // Update statistics
      this.updateRoutingStats(routing);
      
      // Log routing decision
      if (this.contextManager) {
        await this.contextManager.logAnalytics({
          type: 'routing-decision',
          data: { task, complexity, routing },
          context: await this.getContext()
        });
      }
      
      return routing;
    } catch (error) {
      console.error('Routing failed:', error);
      throw error;
    }
  }
  
  async execute(routing) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      const startTime = Date.now();
      
      // Check cache first
      if (this.contextManager) {
        const cacheKey = this.generateCacheKey(routing.task, routing.specialist);
        const cached = await this.contextManager.getCachedConsultation(cacheKey);
        
        if (cached) {
          this.stats.cacheHits++;
          console.log('Cache hit for consultation');
          return this.processCachedResult(cached, routing);
        } else {
          this.stats.cacheMisses++;
        }
      }
      
      // Execute consultation
      let result;
      
      if (routing.complexity === 'DIRECT') {
        result = await this.executeDirect(routing);
      } else {
        result = await this.executeSpecialistConsultation(routing);
      }
      
      // Quality assurance
      if (this.qualityAssurance && result.recommendation) {
        const qualityResult = this.qualityAssurance.performValidation(
          result.specialist, 
          result.recommendation, 
          routing.task
        );
        
        result.qualityAssessment = qualityResult;
        this.stats.qualityScores.push(qualityResult.score);
        
        // Handle quality issues
        if (!qualityResult.passed) {
          result = await this.handleQualityIssues(result, qualityResult, routing);
        }
      }
      
      // Cache result
      if (this.contextManager && result.recommendation) {
        await this.contextManager.cacheSpecialistConsultation({
          specialist: result.specialist,
          task: routing.task,
          recommendation: result.recommendation,
          outcome: result.outcome,
          quality: result.qualityAssessment,
          context: await this.getContext()
        });
      }
      
      // Update context
      if (this.contextManager) {
        await this.contextManager.updateProjectContext({
          decisions: [result.recommendation],
          state: { lastConsultation: result },
          timestamp: new Date().toISOString()
        });
      }
      
      // Log execution
      const executionTime = Date.now() - startTime;
      if (this.contextManager) {
        await this.contextManager.logAnalytics({
          type: 'consultation-completed',
          data: { 
            routing, 
            result, 
            executionTime,
            successful: !!result.recommendation 
          }
        });
      }
      
      this.stats.tasksProcessed++;
      
      return result;
    } catch (error) {
      console.error('Execution failed:', error);
      
      // Error recovery
      if (this.errorDetection) {
        const recovery = await this.handleExecutionError(error, routing);
        if (recovery.successful) {
          return recovery.result;
        }
      }
      
      throw error;
    }
  }
  
  async executeDirect(routing) {
    // Direct implementation without specialist consultation
    return {
      type: 'direct-implementation',
      task: routing.task,
      recommendation: {
        approach: 'direct-implementation',
        rationale: 'Task complexity allows for direct implementation',
        steps: ['Implement solution', 'Test', 'Deploy'],
        confidence: 0.8
      },
      specialist: { id: 'direct', domain: 'general' },
      timestamp: new Date().toISOString()
    };
  }
  
  async executeSpecialistConsultation(routing) {
    const { specialist: specialistId, complexity } = routing;
    
    // Get specialist class
    const SpecialistClass = this.specialists.get(specialistId);
    if (!SpecialistClass) {
      throw new Error(`Specialist not found: ${specialistId}`);
    }
    
    // Create specialist instance
    const specialist = new SpecialistClass();
    
    // Get context for consultation
    const context = await this.getContext();
    
    // Perform consultation
    const consultation = await specialist.consult(routing.task, context);
    
    // Check if handoff is required
    if (consultation.handoffRequired && consultation.handoffRequired.required) {
      return await this.handleHandoff(consultation, routing);
    }
    
    return consultation;
  }
  
  async handleHandoff(consultation, routing) {
    const handoff = consultation.handoffRequired;
    
    if (handoff.targetTier === 'TIER_2') {
      // Create T1 to T2 handoff
      const handoffProtocol = new T1ToT2Handoff({
        problem: routing.task.description,
        assessment: consultation.analysis,
        constraints: consultation.constraints || [],
        recommendations: consultation.recommendations,
        escalationReason: handoff.reason,
        specialist: consultation.specialist
      });
      
      const handoffDoc = handoffProtocol.generateHandoffDocument();
      const validation = handoffProtocol.validateHandoff();
      
      if (!validation.valid) {
        throw new Error(`Handoff validation failed: ${validation.recommendations.join(', ')}`);
      }
      
      // Route to Tier 2
      const newRouting = {
        ...routing,
        complexity: 'TIER_2',
        specialist: handoff.targetSpecialist,
        handoff: handoffDoc
      };
      
      return await this.executeSpecialistConsultation(newRouting);
    }
    
    if (handoff.targetTier === 'TIER_3') {
      // Create T2 to T3 escalation
      const escalation = new T2ToT3Escalation({
        results: consultation.analysis,
        alternatives: consultation.recommendations.alternatives || [],
        risks: consultation.analysis.risks || [],
        performance: consultation.analysis.performance || {},
        systemImpacts: consultation.analysis.systemImpacts || [],
        integrations: consultation.analysis.integrations || [],
        dataFlow: consultation.analysis.dataFlow || {},
        security: consultation.analysis.security || {}
      });
      
      const escalationDoc = escalation.generateEscalationDocument();
      
      // Route to Tier 3
      const newRouting = {
        ...routing,
        complexity: 'TIER_3',
        specialist: handoff.targetSpecialist,
        escalation: escalationDoc
      };
      
      return await this.executeSpecialistConsultation(newRouting);
    }
    
    throw new Error(`Unknown handoff target tier: ${handoff.targetTier}`);
  }
  
  async handleQualityIssues(result, qualityResult, routing) {
    console.log('Quality issues detected, attempting recovery...');
    
    if (qualityResult.escalationNeeded && qualityResult.escalationNeeded.needed) {
      // Escalate to higher tier
      const escalationRouting = {
        ...routing,
        complexity: this.getNextTier(routing.complexity),
        escalationReason: qualityResult.escalationNeeded.reasons
      };
      
      return await this.executeSpecialistConsultation(escalationRouting);
    }
    
    // Apply quality improvements
    if (qualityResult.improvements && qualityResult.improvements.length > 0) {
      const improvedResult = { ...result };
      
      // Apply improvements to recommendation
      qualityResult.improvements.forEach(improvement => {
        this.applyQualityImprovement(improvedResult.recommendation, improvement);
      });
      
      return improvedResult;
    }
    
    return result;
  }
  
  async handleExecutionError(error, routing) {
    console.log('Handling execution error:', error.message);
    
    this.stats.errorRecoveries++;
    
    // Try alternative routing
    if (routing.routing && routing.routing.alternatives) {
      for (const alternative of routing.routing.alternatives) {
        try {
          const alternativeRouting = {
            ...routing,
            complexity: alternative.tier,
            specialist: this.selectSpecialistForTier(alternative.tier, routing.task)
          };
          
          const result = await this.executeSpecialistConsultation(alternativeRouting);
          
          return {
            successful: true,
            result,
            recovery: {
              originalError: error.message,
              recoveryMethod: 'alternative-routing',
              alternativeUsed: alternative
            }
          };
        } catch (altError) {
          console.log('Alternative routing also failed:', altError.message);
        }
      }
    }
    
    // Fallback to direct implementation
    try {
      const fallbackResult = await this.executeDirect(routing);
      
      return {
        successful: true,
        result: {
          ...fallbackResult,
          fallback: true,
          originalError: error.message
        },
        recovery: {
          originalError: error.message,
          recoveryMethod: 'fallback-to-direct'
        }
      };
    } catch (fallbackError) {
      return {
        successful: false,
        error: error,
        fallbackError: fallbackError
      };
    }
  }
  
  async getContext() {
    if (!this.contextManager) return {};
    
    try {
      const context = await this.contextManager.getProjectContext();
      return context || {};
    } catch (error) {
      console.warn('Could not retrieve context:', error.message);
      return {};
    }
  }
  
  async updateContext(result) {
    if (!this.contextManager) return;
    
    try {
      await this.contextManager.updateProjectContext({
        decisions: result.recommendation ? [result.recommendation] : [],
        state: { lastResult: result },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Could not update context:', error.message);
    }
  }
  
  generateCacheKey(task, specialistId) {
    const taskHash = JSON.stringify({
      description: task.description,
      requirements: task.requirements
    });
    
    return `${specialistId}-${this.simpleHash(taskHash)}`;
  }
  
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }
  
  processCachedResult(cached, routing) {
    return {
      ...cached,
      fromCache: true,
      cacheTimestamp: cached.timestamp,
      freshness: this.calculateCacheFreshness(cached.timestamp)
    };
  }
  
  calculateCacheFreshness(timestamp) {
    const age = Date.now() - new Date(timestamp).getTime();
    const ageHours = age / (1000 * 60 * 60);
    
    if (ageHours < 1) return 'very-fresh';
    if (ageHours < 6) return 'fresh';
    if (ageHours < 24) return 'acceptable';
    return 'stale';
  }
  
  updateRoutingStats(routing) {
    const tier = routing.complexity;
    if (!this.stats.routingDecisions.has(tier)) {
      this.stats.routingDecisions.set(tier, 0);
    }
    this.stats.routingDecisions.set(tier, this.stats.routingDecisions.get(tier) + 1);
  }
  
  getNextTier(currentTier) {
    const tierProgression = {
      'DIRECT': 'TIER_1',
      'TIER_1': 'TIER_2',
      'TIER_2': 'TIER_3',
      'TIER_3': 'TIER_3' // Already at highest tier
    };
    
    return tierProgression[currentTier] || 'TIER_1';
  }
  
  selectSpecialistForTier(tier, task) {
    const domain = this.identifyTaskDomain(task);
    const tierSpecialists = this.config.specialists[tier.toLowerCase()];
    
    if (!tierSpecialists) return null;
    
    // Find specialist for domain
    const specialist = tierSpecialists.find(s => 
      s.domain === domain || s.expertise.some(exp => 
        task.description?.toLowerCase().includes(exp.toLowerCase())
      )
    );
    
    return specialist ? specialist.id : tierSpecialists[0]?.id;
  }
  
  identifyTaskDomain(task) {
    const taskText = task.description?.toLowerCase() || '';
    const domainKeywords = {
      architecture: ['architecture', 'design', 'pattern'],
      security: ['security', 'auth', 'encryption'],
      performance: ['performance', 'optimization', 'speed'],
      data: ['data', 'database', 'analytics'],
      integration: ['integration', 'api', 'service'],
      frontend: ['frontend', 'ui', 'client']
    };
    
    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        return domain;
      }
    }
    
    return 'architecture'; // Default
  }
  
  applyQualityImprovement(recommendation, improvement) {
    switch (improvement.area) {
      case 'clarity':
        recommendation.rationale = recommendation.rationale || 'Improved clarity';
        break;
      case 'specificity':
        if (!recommendation.timeline) recommendation.timeline = 'To be determined';
        if (!recommendation.resources) recommendation.resources = ['Development team'];
        break;
      case 'completeness':
        if (!recommendation.risks) recommendation.risks = [];
        if (!recommendation.benefits) recommendation.benefits = [];
        break;
      default:
        recommendation.improvements = recommendation.improvements || [];
        recommendation.improvements.push(improvement.suggestions);
    }
  }
  
  getStats() {
    return {
      ...this.stats,
      averageQualityScore: this.stats.qualityScores.length > 0 
        ? this.stats.qualityScores.reduce((sum, score) => sum + score, 0) / this.stats.qualityScores.length 
        : 0,
      cacheHitRate: (this.stats.cacheHits + this.stats.cacheMisses) > 0 
        ? this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) 
        : 0,
      routingDistribution: Object.fromEntries(this.stats.routingDecisions)
    };
  }
  
  getDefaultConfiguration() {
    return {
      routing: {
        distributionTargets: { direct: 80, tier1: 15, tier2: 4, tier3: 1 },
        complexityThresholds: { direct: 3, tier1: 6, tier2: 8, tier3: 10 }
      },
      specialists: {
        tier1: [
          { id: 'architecture-generalist', domain: 'architecture', enabled: true },
          { id: 'security-generalist', domain: 'security', enabled: true },
          { id: 'performance-generalist', domain: 'performance', enabled: true },
          { id: 'data-generalist', domain: 'data', enabled: true },
          { id: 'integration-generalist', domain: 'integration', enabled: true },
          { id: 'frontend-generalist', domain: 'frontend', enabled: true }
        ],
        tier2: [
          { id: 'database-specialist', domain: 'database', enabled: true }
        ],
        tier3: [
          { id: 'system-architect', domain: 'system-architecture', enabled: true }
        ]
      },
      quality: {
        validationCheckpoints: true,
        qualityThresholds: { minimal: 0.6, acceptable: 0.75, excellent: 0.9 }
      },
      context: {
        storageEnabled: true,
        learningEnabled: true,
        cacheExpiration: "24h"
      },
      recovery: {
        errorDetection: true,
        autoEscalation: true,
        feedbackIntegration: true
      }
    };
  }
}

// Usage example
async function exampleUsage() {
  // Create sub-agent architecture instance
  const subAgents = new SubAgentArchitecture({
    configPath: './config/sub-agent-config.json',
    contextStorage: './context/',
    learningEnabled: true
  });
  
  // Initialize the system
  await subAgents.initialize();
  
  // Define a task
  const task = {
    description: 'Design a scalable authentication system for our microservices architecture',
    requirements: [
      'Support OAuth2 and JWT tokens',
      'Handle 10,000+ concurrent users',
      'Integrate with existing user database',
      'Provide SSO capabilities'
    ],
    constraints: [
      'Must be completed in 2 weeks',
      'Limited budget for new infrastructure',
      'Security compliance required'
    ]
  };
  
  try {
    // Route the task
    const routing = await subAgents.route(task);
    console.log('Routing decision:', routing);
    
    // Execute the consultation
    const result = await subAgents.execute(routing);
    console.log('Consultation result:', result);
    
    // Update context with results
    await subAgents.updateContext(result);
    
    // Get system statistics
    const stats = subAgents.getStats();
    console.log('System stats:', stats);
    
  } catch (error) {
    console.error('Error in sub-agent processing:', error);
  }
}

module.exports = SubAgentArchitecture;

// Export example usage for documentation
if (require.main === module) {
  exampleUsage().catch(console.error);
}