/**
 * Context Management Architecture
 * Manages project context, specialist cache, and learning systems
 */

const fs = require('fs').promises;
const path = require('path');

class ContextManager {
  constructor(options = {}) {
    this.options = {
      contextStoragePath: options.contextStoragePath || './context',
      cacheExpirationTime: options.cacheExpirationTime || 24 * 60 * 60 * 1000, // 24 hours
      maxCacheSize: options.maxCacheSize || 1000,
      persistenceEnabled: options.persistenceEnabled !== false,
      ...options
    };
    
    this.storage = {
      projectContext: new ProjectContextStorage(this.options),
      specialistCache: new SpecialistCacheStorage(this.options),
      patternLibrary: new PatternLibraryStorage(this.options),
      analyticsLog: new AnalyticsLogStorage(this.options)
    };
    
    this.contextFlow = new ContextFlowController(this);
    this.learningSystem = new LearningSystem(this);
  }
  
  async initialize() {
    if (this.options.persistenceEnabled) {
      await this.ensureStorageDirectories();
      await this.loadPersistedData();
    }
    
    return this;
  }
  
  async updateProjectContext(context) {
    const updateData = {
      architecturalDecisions: context.decisions || [],
      currentState: context.state || {},
      constraints: context.constraints || [],
      objectives: context.objectives || [],
      stakeholders: context.stakeholders || [],
      timeline: context.timeline || null,
      resources: context.resources || {},
      riskProfile: context.riskProfile || {},
      qualityStandards: context.qualityStandards || {},
      timestamp: new Date().toISOString(),
      version: this.generateVersion()
    };
    
    await this.storage.projectContext.update(updateData);
    
    // Trigger context flow updates
    await this.contextFlow.onContextUpdate(updateData);
    
    return updateData;
  }
  
  async cacheSpecialistConsultation(consultation) {
    const cacheData = {
      specialist: consultation.specialist,
      task: consultation.task,
      recommendation: consultation.recommendation,
      outcome: consultation.outcome,
      quality: consultation.quality || {},
      context: consultation.context || {},
      cacheKey: this.generateCacheKey(consultation),
      expirationTime: this.calculateExpiration(consultation),
      accessCount: 0,
      lastAccessed: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    
    await this.storage.specialistCache.store(cacheData);
    
    // Update pattern library based on consultation
    await this.updatePatternLibrary(consultation);
    
    return cacheData;
  }
  
  async getProjectContext() {
    return await this.storage.projectContext.get();
  }
  
  async getCachedConsultation(cacheKey) {
    const cached = await this.storage.specialistCache.get(cacheKey);
    
    if (cached && !this.isExpired(cached)) {
      // Update access statistics
      await this.storage.specialistCache.updateAccess(cacheKey);
      return cached;
    }
    
    return null;
  }
  
  async findSimilarConsultations(task, threshold = 0.7) {
    const allCached = await this.storage.specialistCache.getAll();
    const validCached = allCached.filter(cached => !this.isExpired(cached));
    
    const similarities = validCached.map(cached => ({
      consultation: cached,
      similarity: this.calculateTaskSimilarity(task, cached.task)
    }));
    
    return similarities
      .filter(item => item.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity);
  }
  
  async getRelevantPatterns(task, domain) {
    const patterns = await this.storage.patternLibrary.getPatterns(domain);
    return patterns.filter(pattern => 
      this.isPatternRelevant(pattern, task)
    ).sort((a, b) => b.relevance - a.relevance);
  }
  
  async logAnalytics(event) {
    const analyticsEntry = {
      event: event.type,
      data: event.data,
      context: event.context || {},
      timestamp: new Date().toISOString(),
      sessionId: event.sessionId || this.generateSessionId(),
      userId: event.userId || 'anonymous'
    };
    
    await this.storage.analyticsLog.log(analyticsEntry);
    
    // Trigger learning system update
    await this.learningSystem.processAnalyticsEvent(analyticsEntry);
    
    return analyticsEntry;
  }
  
  async optimizeCache() {
    const cacheStats = await this.storage.specialistCache.getStatistics();
    
    if (cacheStats.size > this.options.maxCacheSize) {
      await this.storage.specialistCache.evictLeastUsed();
    }
    
    await this.storage.specialistCache.cleanExpired();
    
    return cacheStats;
  }
  
  async generateContextualRecommendations(task) {
    const context = await this.getProjectContext();
    const similarConsultations = await this.findSimilarConsultations(task);
    const relevantPatterns = await this.getRelevantPatterns(task, this.identifyDomain(task));
    
    const recommendations = {
      contextualFactors: this.analyzeContextualFactors(task, context),
      historicalInsights: this.extractHistoricalInsights(similarConsultations),
      applicablePatterns: relevantPatterns.slice(0, 5),
      riskFactors: this.identifyContextualRisks(task, context),
      opportunityFactors: this.identifyOpportunities(task, context),
      constraints: this.extractContextualConstraints(context),
      stakeholderConsiderations: this.getStakeholderContext(context)
    };
    
    return recommendations;
  }
  
  async updatePatternLibrary(consultation) {
    const patterns = this.extractPatterns(consultation);
    
    for (const pattern of patterns) {
      await this.storage.patternLibrary.updatePattern(pattern);
    }
  }
  
  // Helper methods
  generateVersion() {
    return `v${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateCacheKey(consultation) {
    const keyData = {
      specialist: consultation.specialist.id,
      taskHash: this.hashTask(consultation.task),
      contextHash: this.hashContext(consultation.context)
    };
    
    return `${keyData.specialist}-${keyData.taskHash}-${keyData.contextHash}`;
  }
  
  calculateExpiration(consultation) {
    const baseExpiration = new Date(Date.now() + this.options.cacheExpirationTime);
    
    // Adjust expiration based on consultation characteristics
    if (consultation.quality?.score > 0.9) {
      baseExpiration.setTime(baseExpiration.getTime() + this.options.cacheExpirationTime * 0.5);
    }
    
    return baseExpiration.toISOString();
  }
  
  isExpired(cached) {
    return new Date() > new Date(cached.expirationTime);
  }
  
  calculateTaskSimilarity(task1, task2) {
    const factors = {
      descriptionSimilarity: this.calculateTextSimilarity(
        task1.description || '', 
        task2.description || ''
      ),
      domainSimilarity: this.calculateDomainSimilarity(task1, task2),
      complexitySimilarity: this.calculateComplexitySimilarity(task1, task2),
      requirementsSimilarity: this.calculateRequirementsSimilarity(task1, task2)
    };
    
    // Weighted average
    return (
      factors.descriptionSimilarity * 0.4 +
      factors.domainSimilarity * 0.3 +
      factors.complexitySimilarity * 0.2 +
      factors.requirementsSimilarity * 0.1
    );
  }
  
  isPatternRelevant(pattern, task) {
    const taskText = task.description?.toLowerCase() || '';
    const patternKeywords = pattern.keywords || [];
    
    const relevantKeywords = patternKeywords.filter(keyword =>
      taskText.includes(keyword.toLowerCase())
    );
    
    return relevantKeywords.length > 0;
  }
  
  identifyDomain(task) {
    const taskText = task.description?.toLowerCase() || '';
    const domainKeywords = {
      architecture: ['architecture', 'design', 'pattern', 'system'],
      security: ['security', 'auth', 'encryption', 'compliance'],
      performance: ['performance', 'optimization', 'speed', 'scale'],
      data: ['data', 'database', 'analytics', 'storage'],
      integration: ['integration', 'api', 'service', 'connectivity'],
      frontend: ['frontend', 'ui', 'ux', 'client']
    };
    
    let bestMatch = 'general';
    let maxMatches = 0;
    
    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
      const matches = keywords.filter(keyword => taskText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = domain;
      }
    });
    
    return bestMatch;
  }
  
  extractPatterns(consultation) {
    const patterns = [];
    
    // Extract patterns from recommendation
    if (consultation.recommendation?.patterns) {
      consultation.recommendation.patterns.forEach(pattern => {
        patterns.push({
          type: 'recommendation-pattern',
          name: pattern,
          domain: consultation.specialist.domain,
          context: consultation.context,
          success: consultation.outcome?.successful || false,
          frequency: 1
        });
      });
    }
    
    // Extract patterns from successful outcomes
    if (consultation.outcome?.successful && consultation.outcome.approach) {
      patterns.push({
        type: 'successful-approach',
        name: consultation.outcome.approach,
        domain: consultation.specialist.domain,
        context: consultation.context,
        success: true,
        frequency: 1
      });
    }
    
    return patterns;
  }
  
  hashTask(task) {
    const taskString = JSON.stringify({
      description: task.description,
      requirements: task.requirements,
      constraints: task.constraints
    });
    
    return this.simpleHash(taskString);
  }
  
  hashContext(context) {
    const contextString = JSON.stringify({
      projectSize: context.projectSize,
      teamSize: context.teamSize,
      timeline: context.timeline,
      constraints: context.constraints
    });
    
    return this.simpleHash(contextString);
  }
  
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  calculateTextSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }
  
  calculateDomainSimilarity(task1, task2) {
    const domain1 = this.identifyDomain(task1);
    const domain2 = this.identifyDomain(task2);
    
    return domain1 === domain2 ? 1.0 : 0.3;
  }
  
  calculateComplexitySimilarity(task1, task2) {
    const complexity1 = this.estimateComplexity(task1);
    const complexity2 = this.estimateComplexity(task2);
    
    const diff = Math.abs(complexity1 - complexity2);
    return Math.max(0, 1 - diff / 10);
  }
  
  calculateRequirementsSimilarity(task1, task2) {
    const req1 = task1.requirements || [];
    const req2 = task2.requirements || [];
    
    if (req1.length === 0 && req2.length === 0) return 1;
    if (req1.length === 0 || req2.length === 0) return 0;
    
    const intersection = req1.filter(req => req2.includes(req));
    return intersection.length / Math.max(req1.length, req2.length);
  }
  
  estimateComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    const complexityIndicators = {
      high: ['enterprise', 'distributed', 'complex', 'advanced'],
      medium: ['integrate', 'optimize', 'scale', 'design'],
      low: ['simple', 'basic', 'straightforward', 'minor']
    };
    
    if (complexityIndicators.high.some(indicator => taskText.includes(indicator))) return 8;
    if (complexityIndicators.medium.some(indicator => taskText.includes(indicator))) return 5;
    return 2;
  }
  
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  async ensureStorageDirectories() {
    const directories = [
      this.options.contextStoragePath,
      path.join(this.options.contextStoragePath, 'project'),
      path.join(this.options.contextStoragePath, 'cache'),
      path.join(this.options.contextStoragePath, 'patterns'),
      path.join(this.options.contextStoragePath, 'analytics')
    ];
    
    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
      }
    }
  }
  
  async loadPersistedData() {
    await this.storage.projectContext.load();
    await this.storage.specialistCache.load();
    await this.storage.patternLibrary.load();
    await this.storage.analyticsLog.load();
  }
  
  analyzeContextualFactors(task, context) {
    return {
      projectConstraints: context.constraints || [],
      availableResources: context.resources || {},
      stakeholderPriorities: context.objectives || [],
      technicalDebt: context.technicalDebt || [],
      complianceRequirements: context.compliance || []
    };
  }
  
  extractHistoricalInsights(similarConsultations) {
    return similarConsultations.slice(0, 3).map(item => ({
      consultation: item.consultation,
      similarity: item.similarity,
      keyInsights: this.extractInsights(item.consultation),
      applicability: this.assessApplicability(item.consultation)
    }));
  }
  
  identifyContextualRisks(task, context) {
    const risks = [];
    
    if (context.timeline?.tight) {
      risks.push({ type: 'timeline-risk', severity: 'medium' });
    }
    
    if (context.resources?.limited) {
      risks.push({ type: 'resource-risk', severity: 'high' });
    }
    
    if (context.technicalDebt?.high) {
      risks.push({ type: 'technical-debt-risk', severity: 'medium' });
    }
    
    return risks;
  }
  
  identifyOpportunities(task, context) {
    const opportunities = [];
    
    if (context.resources?.excess) {
      opportunities.push({ type: 'resource-opportunity', potential: 'high' });
    }
    
    if (context.innovation?.encouraged) {
      opportunities.push({ type: 'innovation-opportunity', potential: 'medium' });
    }
    
    return opportunities;
  }
  
  extractContextualConstraints(context) {
    return {
      technical: context.constraints?.technical || [],
      business: context.constraints?.business || [],
      regulatory: context.constraints?.regulatory || [],
      timeline: context.constraints?.timeline || [],
      budget: context.constraints?.budget || []
    };
  }
  
  getStakeholderContext(context) {
    return {
      primaryStakeholders: context.stakeholders?.primary || [],
      secondaryStakeholders: context.stakeholders?.secondary || [],
      decisionMakers: context.stakeholders?.decisionMakers || [],
      influencers: context.stakeholders?.influencers || []
    };
  }
  
  extractInsights(consultation) {
    return {
      successFactors: consultation.outcome?.successFactors || [],
      challenges: consultation.outcome?.challenges || [],
      lessons: consultation.outcome?.lessons || [],
      recommendations: consultation.recommendation?.keyPoints || []
    };
  }
  
  assessApplicability(consultation) {
    return {
      directApplicability: 0.8, // Placeholder
      adaptationRequired: 0.3,  // Placeholder
      contextSensitivity: 0.6   // Placeholder
    };
  }
}

// Storage implementations
class ProjectContextStorage {
  constructor(options) {
    this.options = options;
    this.data = {};
    this.filePath = path.join(options.contextStoragePath, 'project', 'context.json');
  }
  
  async update(contextData) {
    this.data = { ...this.data, ...contextData };
    
    if (this.options.persistenceEnabled) {
      await this.persist();
    }
  }
  
  async get() {
    return this.data;
  }
  
  async load() {
    if (this.options.persistenceEnabled) {
      try {
        const data = await fs.readFile(this.filePath, 'utf8');
        this.data = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        // File doesn't exist, start with empty data
        this.data = {};
      }
    }
  }
  
  async persist() {
    await fs.writeFile(this.filePath, JSON.stringify(this.data, null, 2));
  }
}

class SpecialistCacheStorage {
  constructor(options) {
    this.options = options;
    this.cache = new Map();
    this.filePath = path.join(options.contextStoragePath, 'cache', 'consultations.json');
  }
  
  async store(cacheData) {
    this.cache.set(cacheData.cacheKey, cacheData);
    
    if (this.options.persistenceEnabled) {
      await this.persist();
    }
  }
  
  async get(cacheKey) {
    return this.cache.get(cacheKey);
  }
  
  async getAll() {
    return Array.from(this.cache.values());
  }
  
  async updateAccess(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached) {
      cached.accessCount += 1;
      cached.lastAccessed = new Date().toISOString();
      this.cache.set(cacheKey, cached);
      
      if (this.options.persistenceEnabled) {
        await this.persist();
      }
    }
  }
  
  async getStatistics() {
    const entries = Array.from(this.cache.values());
    return {
      size: entries.length,
      totalAccesses: entries.reduce((sum, entry) => sum + entry.accessCount, 0),
      averageAccesses: entries.length > 0 ? 
        entries.reduce((sum, entry) => sum + entry.accessCount, 0) / entries.length : 0,
      oldestEntry: entries.reduce((oldest, entry) => 
        !oldest || new Date(entry.timestamp) < new Date(oldest.timestamp) ? entry : oldest, null
      ),
      newestEntry: entries.reduce((newest, entry) => 
        !newest || new Date(entry.timestamp) > new Date(newest.timestamp) ? entry : newest, null
      )
    };
  }
  
  async evictLeastUsed() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].accessCount - b[1].accessCount);
    
    const toEvict = entries.slice(0, Math.floor(entries.length * 0.1));
    toEvict.forEach(([key]) => this.cache.delete(key));
    
    if (this.options.persistenceEnabled) {
      await this.persist();
    }
  }
  
  async cleanExpired() {
    const now = new Date();
    const expired = [];
    
    for (const [key, cached] of this.cache.entries()) {
      if (new Date(cached.expirationTime) < now) {
        expired.push(key);
      }
    }
    
    expired.forEach(key => this.cache.delete(key));
    
    if (this.options.persistenceEnabled && expired.length > 0) {
      await this.persist();
    }
    
    return expired.length;
  }
  
  async load() {
    if (this.options.persistenceEnabled) {
      try {
        const data = await fs.readFile(this.filePath, 'utf8');
        const cacheArray = JSON.parse(data);
        this.cache = new Map(cacheArray.map(item => [item.cacheKey, item]));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        this.cache = new Map();
      }
    }
  }
  
  async persist() {
    const cacheArray = Array.from(this.cache.values());
    await fs.writeFile(this.filePath, JSON.stringify(cacheArray, null, 2));
  }
}

class PatternLibraryStorage {
  constructor(options) {
    this.options = options;
    this.patterns = new Map();
    this.filePath = path.join(options.contextStoragePath, 'patterns', 'library.json');
  }
  
  async updatePattern(pattern) {
    const key = `${pattern.domain}-${pattern.name}`;
    const existing = this.patterns.get(key);
    
    if (existing) {
      existing.frequency += pattern.frequency;
      existing.lastSeen = new Date().toISOString();
      if (pattern.success) existing.successRate = 
        (existing.successRate * existing.usageCount + 1) / (existing.usageCount + 1);
      existing.usageCount += 1;
    } else {
      this.patterns.set(key, {
        ...pattern,
        successRate: pattern.success ? 1.0 : 0.0,
        usageCount: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString()
      });
    }
    
    if (this.options.persistenceEnabled) {
      await this.persist();
    }
  }
  
  async getPatterns(domain) {
    const domainPatterns = Array.from(this.patterns.values())
      .filter(pattern => pattern.domain === domain || pattern.domain === 'general');
    
    return domainPatterns.map(pattern => ({
      ...pattern,
      relevance: this.calculateRelevance(pattern)
    }));
  }
  
  calculateRelevance(pattern) {
    const frequencyWeight = Math.min(pattern.frequency / 10, 1.0) * 0.3;
    const successWeight = pattern.successRate * 0.4;
    const recencyWeight = this.calculateRecencyWeight(pattern.lastSeen) * 0.3;
    
    return frequencyWeight + successWeight + recencyWeight;
  }
  
  calculateRecencyWeight(lastSeen) {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const daysSince = (now - lastSeenDate) / (1000 * 60 * 60 * 24);
    
    return Math.max(0, 1 - daysSince / 365); // Decay over a year
  }
  
  async load() {
    if (this.options.persistenceEnabled) {
      try {
        const data = await fs.readFile(this.filePath, 'utf8');
        const patternsArray = JSON.parse(data);
        this.patterns = new Map(patternsArray.map(pattern => [
          `${pattern.domain}-${pattern.name}`, pattern
        ]));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        this.patterns = new Map();
      }
    }
  }
  
  async persist() {
    const patternsArray = Array.from(this.patterns.values());
    await fs.writeFile(this.filePath, JSON.stringify(patternsArray, null, 2));
  }
}

class AnalyticsLogStorage {
  constructor(options) {
    this.options = options;
    this.logs = [];
    this.filePath = path.join(options.contextStoragePath, 'analytics', 'events.json');
    this.maxLogSize = options.maxLogSize || 10000;
  }
  
  async log(analyticsEntry) {
    this.logs.push(analyticsEntry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogSize) {
      this.logs = this.logs.slice(-this.maxLogSize);
    }
    
    if (this.options.persistenceEnabled) {
      await this.persist();
    }
  }
  
  async getRecentLogs(count = 100) {
    return this.logs.slice(-count);
  }
  
  async getLogsByType(eventType) {
    return this.logs.filter(log => log.event === eventType);
  }
  
  async load() {
    if (this.options.persistenceEnabled) {
      try {
        const data = await fs.readFile(this.filePath, 'utf8');
        this.logs = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        this.logs = [];
      }
    }
  }
  
  async persist() {
    await fs.writeFile(this.filePath, JSON.stringify(this.logs, null, 2));
  }
}

class ContextFlowController {
  constructor(contextManager) {
    this.contextManager = contextManager;
  }
  
  static manageContextFlow(task, routing) {
    return {
      routerIntegration: this.integrateWithRouter(routing),
      specialistContext: this.prepareSpecialistContext(task),
      implementationPatterns: this.retrievePatterns(task),
      analyticsCollection: this.collectAnalytics(task, routing)
    };
  }
  
  async onContextUpdate(contextUpdate) {
    // Update dependent systems when context changes
    await this.updatePatternRelevance(contextUpdate);
    await this.adjustCacheStrategy(contextUpdate);
    await this.notifyLearningSystem(contextUpdate);
  }
  
  static updateContextFromOutcome(outcome) {
    return {
      patternUpdates: this.updatePatterns(outcome),
      routerOptimization: this.optimizeRouter(outcome),
      cacheUpdates: this.updateCache(outcome),
      analyticsLogging: this.logAnalytics(outcome)
    };
  }
  
  async updatePatternRelevance(contextUpdate) {
    // Update pattern library based on context changes
    const patterns = await this.contextManager.storage.patternLibrary.getPatterns('all');
    
    for (const pattern of patterns) {
      pattern.contextRelevance = this.calculateContextualRelevance(pattern, contextUpdate);
    }
  }
  
  async adjustCacheStrategy(contextUpdate) {
    // Adjust cache parameters based on project context
    if (contextUpdate.timeline?.urgent) {
      // Increase cache hit preference for urgent projects
      this.contextManager.options.cacheExpirationTime *= 1.5;
    }
    
    if (contextUpdate.qualityStandards?.high) {
      // Decrease cache usage for high quality requirements
      this.contextManager.options.cacheExpirationTime *= 0.8;
    }
  }
  
  async notifyLearningSystem(contextUpdate) {
    await this.contextManager.learningSystem.onContextUpdate(contextUpdate);
  }
  
  calculateContextualRelevance(pattern, context) {
    // Calculate how relevant a pattern is given the current context
    let relevance = pattern.relevance || 0.5;
    
    // Adjust based on project constraints
    if (context.constraints && pattern.constraints) {
      const constraintMatch = this.calculateConstraintMatch(
        context.constraints, 
        pattern.constraints
      );
      relevance = relevance * 0.8 + constraintMatch * 0.2;
    }
    
    // Adjust based on timeline
    if (context.timeline?.tight && pattern.implementationSpeed === 'fast') {
      relevance += 0.1;
    }
    
    return Math.min(relevance, 1.0);
  }
  
  calculateConstraintMatch(contextConstraints, patternConstraints) {
    const totalConstraints = contextConstraints.length;
    if (totalConstraints === 0) return 1.0;
    
    const matchingConstraints = contextConstraints.filter(constraint =>
      patternConstraints.some(pConstraint => 
        this.constraintsMatch(constraint, pConstraint)
      )
    ).length;
    
    return matchingConstraints / totalConstraints;
  }
  
  constraintsMatch(constraint1, constraint2) {
    // Simple constraint matching logic
    return constraint1.type === constraint2.type && 
           constraint1.severity === constraint2.severity;
  }
  
  // Static helper methods
  static integrateWithRouter(routing) {
    return {
      complexityContext: routing.complexity,
      specialistContext: routing.specialist,
      routingDecision: routing.routing
    };
  }
  
  static prepareSpecialistContext(task) {
    return {
      taskContext: task,
      environmentContext: process.env,
      projectContext: {} // Would be populated from actual context
    };
  }
  
  static retrievePatterns(task) {
    // Would retrieve relevant patterns for the task
    return [];
  }
  
  static collectAnalytics(task, routing) {
    return {
      taskType: task.type,
      routingDecision: routing.complexity,
      timestamp: new Date().toISOString()
    };
  }
}

class LearningSystem {
  constructor(contextManager) {
    this.contextManager = contextManager;
  }
  
  static analyzePatterns(consultations) {
    return {
      successPatterns: this.identifySuccessPatterns(consultations),
      failurePatterns: this.identifyFailurePatterns(consultations),
      optimizationOpportunities: this.findOptimizations(consultations),
      routingImprovements: this.suggestRoutingImprovements(consultations)
    };
  }
  
  async processAnalyticsEvent(event) {
    // Process analytics events for learning
    if (event.event === 'consultation-completed') {
      await this.analyzeConsultationOutcome(event.data);
    }
    
    if (event.event === 'routing-decision') {
      await this.analyzeRoutingEffectiveness(event.data);
    }
  }
  
  async onContextUpdate(contextUpdate) {
    // Learn from context updates
    await this.updateLearningModels(contextUpdate);
  }
  
  async analyzeConsultationOutcome(consultationData) {
    // Extract patterns from successful consultations
    if (consultationData.successful) {
      const pattern = this.extractSuccessPattern(consultationData);
      await this.contextManager.storage.patternLibrary.updatePattern(pattern);
    }
  }
  
  async analyzeRoutingEffectiveness(routingData) {
    // Analyze if routing decisions led to good outcomes
    const effectiveness = this.calculateRoutingEffectiveness(routingData);
    
    if (effectiveness.score < 0.7) {
      await this.suggestRoutingAdjustments(routingData, effectiveness);
    }
  }
  
  extractSuccessPattern(consultationData) {
    return {
      type: 'success-pattern',
      name: `${consultationData.approach}-success`,
      domain: consultationData.domain,
      context: consultationData.context,
      success: true,
      frequency: 1,
      approach: consultationData.approach,
      factors: consultationData.successFactors || []
    };
  }
  
  calculateRoutingEffectiveness(routingData) {
    // Placeholder for routing effectiveness calculation
    return {
      score: 0.8,
      factors: ['complexity-match', 'specialist-alignment'],
      improvements: []
    };
  }
  
  async suggestRoutingAdjustments(routingData, effectiveness) {
    // Log suggestions for routing improvements
    await this.contextManager.logAnalytics({
      type: 'routing-improvement-suggestion',
      data: {
        originalRouting: routingData,
        effectiveness: effectiveness,
        suggestions: this.generateRoutingImprovements(effectiveness)
      }
    });
  }
  
  generateRoutingImprovements(effectiveness) {
    return effectiveness.improvements.map(improvement => ({
      area: improvement,
      recommendation: this.getImprovementRecommendation(improvement),
      priority: 'medium'
    }));
  }
  
  getImprovementRecommendation(improvement) {
    const recommendations = {
      'complexity-match': 'Adjust complexity thresholds for better specialist matching',
      'specialist-alignment': 'Improve specialist selection criteria',
      'context-awareness': 'Enhance context integration in routing decisions'
    };
    
    return recommendations[improvement] || 'General routing optimization needed';
  }
  
  async updateLearningModels(contextUpdate) {
    // Update machine learning models based on new context
    // This would integrate with actual ML frameworks
    const learningUpdate = {
      contextFeatures: this.extractContextFeatures(contextUpdate),
      timestamp: new Date().toISOString(),
      modelVersion: 'v1.0'
    };
    
    await this.contextManager.logAnalytics({
      type: 'learning-model-update',
      data: learningUpdate
    });
  }
  
  extractContextFeatures(contextUpdate) {
    return {
      projectSize: contextUpdate.projectSize || 'unknown',
      timeline: contextUpdate.timeline?.type || 'unknown',
      complexity: contextUpdate.complexity || 'medium',
      constraints: (contextUpdate.constraints || []).length,
      stakeholders: (contextUpdate.stakeholders || []).length
    };
  }
  
  static optimizeRouting(patterns, currentRouting) {
    return {
      thresholdAdjustments: this.adjustThresholds(patterns),
      specialistSelection: this.optimizeSpecialistSelection(patterns),
      complexityAssessment: this.improveComplexityAssessment(patterns),
      performancePredictions: this.enhancePredictions(patterns)
    };
  }
  
  // Static helper methods for pattern analysis
  static identifySuccessPatterns(consultations) {
    const successful = consultations.filter(c => c.outcome?.successful);
    return this.extractCommonPatterns(successful);
  }
  
  static identifyFailurePatterns(consultations) {
    const failed = consultations.filter(c => !c.outcome?.successful);
    return this.extractCommonPatterns(failed);
  }
  
  static findOptimizations(consultations) {
    return {
      cacheOptimizations: this.findCacheOptimizations(consultations),
      routingOptimizations: this.findRoutingOptimizations(consultations),
      qualityOptimizations: this.findQualityOptimizations(consultations)
    };
  }
  
  static suggestRoutingImprovements(consultations) {
    return consultations
      .filter(c => c.routingEffectiveness < 0.7)
      .map(c => ({
        original: c.routing,
        suggested: this.generateImprovedRouting(c),
        reason: this.explainImprovement(c)
      }));
  }
  
  static extractCommonPatterns(consultations) {
    // Extract common patterns from a set of consultations
    const patterns = {};
    
    consultations.forEach(consultation => {
      const approach = consultation.recommendation?.approach;
      if (approach) {
        if (!patterns[approach]) patterns[approach] = 0;
        patterns[approach]++;
      }
    });
    
    return Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .map(([pattern, frequency]) => ({ pattern, frequency }));
  }
  
  static adjustThresholds(patterns) {
    // Placeholder for threshold adjustments
    return { complexity: 'adjusted', quality: 'adjusted' };
  }
  
  static optimizeSpecialistSelection(patterns) {
    // Placeholder for specialist selection optimization
    return { criteria: 'updated', weightings: 'adjusted' };
  }
  
  static improveComplexityAssessment(patterns) {
    // Placeholder for complexity assessment improvements
    return { factors: 'updated', scoring: 'refined' };
  }
  
  static enhancePredictions(patterns) {
    // Placeholder for prediction enhancements
    return { accuracy: 'improved', confidence: 'increased' };
  }
}

module.exports = {
  ContextManager,
  ContextFlowController,
  LearningSystem
};