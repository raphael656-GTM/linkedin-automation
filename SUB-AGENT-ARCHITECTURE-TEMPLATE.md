# Sub-Agent Architecture Template

## Overview
This template provides a complete sub-agent architecture system with intelligent task routing, specialist hierarchies, and comprehensive quality assurance. Copy this template to any project for enterprise-grade AI task management.

## 1. Intelligent Task Routing (80/15/4/1 Distribution)

### Task Complexity Analysis Engine

```javascript
// Task Complexity Analyzer
class TaskComplexityAnalyzer {
  static analyzeTask(task) {
    const complexity = {
      scope: this.analyzeScopeComplexity(task),
      technical: this.analyzeTechnicalComplexity(task),
      domain: this.analyzeDomainComplexity(task),
      risk: this.analyzeRiskLevel(task)
    };
    
    return this.calculateOverallComplexity(complexity);
  }
  
  static calculateOverallComplexity(complexity) {
    const score = (
      complexity.scope * 0.3 +
      complexity.technical * 0.3 +
      complexity.domain * 0.25 +
      complexity.risk * 0.15
    );
    
    if (score <= 3) return 'DIRECT';          // 80% - Direct implementation
    if (score <= 6) return 'TIER_1';         // 15% - Tier 1 consultation
    if (score <= 8) return 'TIER_2';         // 4% - Tier 2 deep analysis
    return 'TIER_3';                         // 1% - Tier 3 coordination
  }
}
```

### Routing Decision Framework

```javascript
// Intelligent Task Router
class TaskRouter {
  static route(task, context) {
    const complexity = TaskComplexityAnalyzer.analyzeTask(task);
    const specialist = this.selectSpecialist(task, complexity);
    
    return {
      complexity,
      specialist,
      protocol: this.getProtocol(complexity),
      estimatedTime: this.estimateTime(complexity),
      qualityChecks: this.getQualityChecks(complexity)
    };
  }
  
  static selectSpecialist(task, complexity) {
    const domain = this.identifyDomain(task);
    const specialists = this.getSpecialistsForDomain(domain, complexity);
    return this.selectBestSpecialist(specialists, task);
  }
}
```

## 2. Tier 1-3 Specialist Hierarchy (18 Specialists Total)

### Tier 1 Specialists (Quick Consultation - 6 Specialists)

#### Architecture Generalist
```markdown
**Domain**: System design, scalability, patterns
**Expertise**: 
- Microservices architecture
- Design patterns implementation
- Scalability planning
- System integration design

**Consultation Triggers**:
- Multi-component system changes
- Performance architecture decisions
- Integration pattern selection
- Scalability planning

**Handoff Criteria to Tier 2**: Complex distributed systems, enterprise architecture
```

#### Security Generalist
```markdown
**Domain**: Authentication, authorization, data protection
**Expertise**:
- OAuth/JWT implementation
- API security patterns
- Data encryption
- Basic vulnerability assessment

**Consultation Triggers**:
- Authentication system changes
- API security implementation
- Data protection requirements
- Basic security audits

**Handoff Criteria to Tier 2**: Advanced threat modeling, compliance requirements
```

#### Performance Generalist
```markdown
**Domain**: Optimization, caching, scaling, monitoring
**Expertise**:
- Query optimization
- Caching strategies
- Basic performance profiling
- Monitoring implementation

**Consultation Triggers**:
- Performance bottleneck identification
- Caching strategy selection
- Basic optimization needs
- Monitoring setup

**Handoff Criteria to Tier 2**: Deep performance analysis, complex optimization
```

#### Data Generalist
```markdown
**Domain**: Database design, modeling, analytics
**Expertise**:
- Database schema design
- Data modeling
- Basic analytics
- Data migration planning

**Consultation Triggers**:
- Database design decisions
- Data modeling requirements
- Basic analytics implementation
- Data migration planning

**Handoff Criteria to Tier 2**: Complex data architectures, advanced analytics
```

#### Integration Generalist
```markdown
**Domain**: APIs, third-party services, microservices
**Expertise**:
- REST/GraphQL API design
- Third-party integration
- Service communication patterns
- Basic event-driven architecture

**Consultation Triggers**:
- API design decisions
- Third-party service integration
- Service communication setup
- Basic event handling

**Handoff Criteria to Tier 2**: Complex integration patterns, enterprise messaging
```

#### Frontend Generalist
```markdown
**Domain**: UI/UX, responsive design, accessibility
**Expertise**:
- Component architecture
- State management
- Responsive design
- Basic accessibility

**Consultation Triggers**:
- UI component design
- State management decisions
- Responsive design implementation
- Basic accessibility requirements

**Handoff Criteria to Tier 2**: Complex frontend architectures, advanced UX patterns
```

### Tier 2 Specialists (Deep Analysis - 6 Specialists)

#### Database Specialist
```markdown
**Domain**: PostgreSQL, Redis, performance tuning
**Prerequisites**: Requires Data Generalist consultation
**Expertise**:
- Advanced query optimization
- Database performance tuning
- Complex data modeling
- Database clustering/sharding

**Consultation Triggers**:
- Complex database performance issues
- Advanced data modeling needs
- Database scaling requirements
- Data consistency challenges

**Handoff Criteria to Tier 3**: Enterprise data architecture, cross-system data consistency
```

#### API Design Specialist
```markdown
**Domain**: REST, GraphQL, versioning
**Prerequisites**: Requires Integration Generalist consultation
**Expertise**:
- Advanced API design patterns
- API versioning strategies
- Complex GraphQL schemas
- API performance optimization

**Consultation Triggers**:
- Complex API architecture
- Advanced versioning needs
- GraphQL optimization
- API ecosystem design

**Handoff Criteria to Tier 3**: Enterprise API governance, cross-domain API strategy
```

#### Auth Systems Specialist
```markdown
**Domain**: OAuth, JWT, SSO, MFA
**Prerequisites**: Requires Security Generalist consultation
**Expertise**:
- Advanced authentication flows
- SSO implementation
- Multi-factor authentication
- Identity federation

**Consultation Triggers**:
- Complex authentication requirements
- Enterprise SSO integration
- Advanced security protocols
- Identity management systems

**Handoff Criteria to Tier 3**: Enterprise identity governance, compliance frameworks
```

#### Performance Optimization Specialist
```markdown
**Domain**: Profiling, memory/CPU optimization
**Prerequisites**: Requires Performance Generalist consultation
**Expertise**:
- Advanced profiling techniques
- Memory optimization
- CPU optimization
- Performance monitoring systems

**Consultation Triggers**:
- Complex performance bottlenecks
- Memory leak investigation
- CPU optimization needs
- Advanced monitoring requirements

**Handoff Criteria to Tier 3**: System-wide performance architecture
```

#### ML Integration Specialist
```markdown
**Domain**: ML APIs, model serving, AI integration
**Prerequisites**: Requires Data Generalist consultation
**Expertise**:
- ML model integration
- AI API implementation
- Model serving architecture
- ML pipeline design

**Consultation Triggers**:
- AI/ML feature integration
- Model serving requirements
- ML pipeline development
- AI performance optimization

**Handoff Criteria to Tier 3**: Enterprise ML architecture, cross-domain AI strategy
```

#### Testing Strategy Specialist
```markdown
**Domain**: Test automation, CI/CD, frameworks
**Prerequisites**: Requires Architecture Generalist consultation
**Expertise**:
- Advanced testing strategies
- CI/CD pipeline design
- Test automation frameworks
- Quality assurance processes

**Consultation Triggers**:
- Complex testing requirements
- CI/CD optimization
- Test automation strategies
- Quality framework design

**Handoff Criteria to Tier 3**: Enterprise testing governance, cross-team QA strategy
```

### Tier 3 Architects (Cross-Domain Coordination - 6 Architects)

#### System Architect
```markdown
**Domain**: Enterprise architecture, cross-domain coordination
**Expertise**:
- Enterprise architecture patterns
- Cross-system integration
- Technology strategy
- Architectural governance

**Consultation Triggers**:
- Enterprise-wide architectural decisions
- Cross-domain system integration
- Technology standardization
- Architectural policy development
```

#### Integration Architect
```markdown
**Domain**: Service mesh, enterprise integration patterns
**Expertise**:
- Service mesh architecture
- Enterprise integration patterns
- Event-driven architecture
- Distributed system design

**Consultation Triggers**:
- Complex integration architectures
- Service mesh implementation
- Enterprise messaging systems
- Distributed system coordination
```

#### Scale Architect
```markdown
**Domain**: Horizontal scaling, distributed systems
**Expertise**:
- Horizontal scaling strategies
- Distributed system patterns
- Load balancing architecture
- Fault tolerance design

**Consultation Triggers**:
- Large-scale system design
- Distributed architecture planning
- Scaling strategy development
- Fault tolerance requirements
```

#### Security Architect
```markdown
**Domain**: Security governance, compliance, threat modeling
**Expertise**:
- Security architecture design
- Compliance framework implementation
- Advanced threat modeling
- Security governance

**Consultation Triggers**:
- Enterprise security architecture
- Compliance requirements
- Advanced threat modeling
- Security governance framework
```

#### Data Architect
```markdown
**Domain**: Data lakes, warehouses, governance
**Expertise**:
- Data architecture design
- Data governance frameworks
- Data lake/warehouse architecture
- Master data management

**Consultation Triggers**:
- Enterprise data architecture
- Data governance requirements
- Large-scale data systems
- Data quality frameworks
```

#### Governance Architect
```markdown
**Domain**: Compliance, policy enforcement, governance
**Expertise**:
- Governance framework design
- Policy enforcement systems
- Compliance automation
- Risk management

**Consultation Triggers**:
- Governance framework development
- Compliance automation
- Policy enforcement systems
- Risk management frameworks
```

## 3. Inter-Tier Communication Protocols

### Tier 1 → Tier 2 Handoff Protocol

```javascript
// T1 to T2 Handoff Structure
class T1ToT2Handoff {
  constructor(consultation) {
    this.consultationSummary = {
      problem: consultation.problem,
      initialAssessment: consultation.assessment,
      constraintsIdentified: consultation.constraints,
      preliminaryRecommendations: consultation.recommendations
    };
    
    this.contextPreservation = {
      businessRequirements: consultation.businessContext,
      technicalConstraints: consultation.technicalContext,
      timeConstraints: consultation.timeline,
      resourceConstraints: consultation.resources
    };
    
    this.decisionRationale = {
      whyEscalated: consultation.escalationReason,
      specificExpertiseNeeded: consultation.expertiseGaps,
      expectedOutcomes: consultation.expectedResults
    };
  }
  
  generateHandoffDocument() {
    return {
      summary: this.consultationSummary,
      context: this.contextPreservation,
      rationale: this.decisionRationale,
      timestamp: new Date().toISOString(),
      handoffType: 'T1_TO_T2'
    };
  }
}
```

### Tier 2 → Tier 3 Escalation Protocol

```javascript
// T2 to T3 Escalation Structure
class T2ToT3Escalation {
  constructor(analysis) {
    this.technicalAnalysis = {
      deepAnalysisResults: analysis.results,
      implementationAlternatives: analysis.alternatives,
      technicalRisks: analysis.risks,
      performanceImplications: analysis.performance
    };
    
    this.crossDomainImpact = {
      affectedSystems: analysis.systemImpacts,
      integrationRequirements: analysis.integrations,
      dataFlowChanges: analysis.dataFlow,
      securityImplications: analysis.security
    };
    
    this.architecturalConsiderations = {
      scalabilityRequirements: analysis.scalability,
      maintainabilityImpact: analysis.maintainability,
      evolutionStrategy: analysis.evolution,
      governanceNeeds: analysis.governance
    };
  }
}
```

### Cross-Specialist Collaboration Framework

```javascript
// Specialist Collaboration Manager
class SpecialistCollaboration {
  static createSharedContext(specialists, task) {
    return {
      sharedKnowledge: this.buildKnowledgeBase(specialists),
      consultationReports: this.generateReports(specialists),
      decisionAuditTrail: this.createAuditTrail(task),
      communicationProtocol: this.establishProtocol(specialists)
    };
  }
  
  static maintainConsistency(collaboration) {
    return {
      standardizedTerminology: this.enforceTerminology(),
      consistentRecommendations: this.validateConsistency(),
      knowledgeTransfer: this.facilitateTransfer(),
      qualityGates: this.implementQualityGates()
    };
  }
}
```

## 4. Quality Assurance Framework

### Specialist Validation Checkpoints

```javascript
// Quality Assurance System
class QualityAssurance {
  static validateSpecialistRecommendation(specialist, recommendation, task) {
    const checks = {
      expertiseAlignment: this.checkExpertiseAlignment(specialist, task),
      recommendationQuality: this.assessRecommendationQuality(recommendation),
      implementationViability: this.checkImplementationViability(recommendation),
      riskAssessment: this.assessRisks(recommendation)
    };
    
    return {
      passed: this.allChecksPassed(checks),
      score: this.calculateQualityScore(checks),
      improvements: this.suggestImprovements(checks),
      escalationNeeded: this.needsEscalation(checks)
    };
  }
  
  static trackSpecialistPerformance(specialist, outcomes) {
    return {
      accuracyRate: this.calculateAccuracy(outcomes),
      implementationSuccessRate: this.calculateSuccess(outcomes),
      userSatisfactionScore: this.calculateSatisfaction(outcomes),
      improvementRecommendations: this.suggestImprovements(outcomes)
    };
  }
}
```

### Consistency Verification System

```javascript
// Consistency Verification
class ConsistencyVerifier {
  static verifyRecommendationConsistency(recommendations) {
    return {
      architecturalConsistency: this.checkArchitecturalAlignment(recommendations),
      technologyConsistency: this.checkTechnologyAlignment(recommendations),
      patternConsistency: this.checkPatternAlignment(recommendations),
      qualityConsistency: this.checkQualityStandards(recommendations)
    };
  }
  
  static generateConsistencyReport(verification) {
    return {
      overallScore: this.calculateConsistencyScore(verification),
      inconsistencies: this.identifyInconsistencies(verification),
      resolutionStrategies: this.suggestResolutions(verification),
      preventionMeasures: this.suggestPrevention(verification)
    };
  }
}
```

### Decision Quality Metrics

```javascript
// Decision Quality Tracking
class DecisionQualityTracker {
  static trackDecision(decision, outcome) {
    return {
      decisionId: this.generateDecisionId(),
      specialist: decision.specialist,
      recommendation: decision.recommendation,
      implementation: outcome.implementation,
      results: outcome.results,
      qualityScore: this.calculateQualityScore(decision, outcome),
      timestamp: new Date().toISOString()
    };
  }
  
  static generateQualityMetrics(decisions) {
    return {
      overallQuality: this.calculateOverallQuality(decisions),
      specialistPerformance: this.analyzeSpecialistPerformance(decisions),
      recommendationAccuracy: this.analyzeAccuracy(decisions),
      improvementOpportunities: this.identifyImprovements(decisions)
    };
  }
}
```

## 5. Context Management Architecture

### Context Storage Components

```javascript
// Context Storage System
class ContextManager {
  constructor() {
    this.storage = {
      projectContext: new ProjectContextStorage(),
      specialistCache: new SpecialistCacheStorage(),
      patternLibrary: new PatternLibraryStorage(),
      analyticsLog: new AnalyticsLogStorage()
    };
  }
  
  async updateProjectContext(context) {
    await this.storage.projectContext.update({
      architecturalDecisions: context.decisions,
      currentState: context.state,
      constraints: context.constraints,
      objectives: context.objectives,
      timestamp: new Date().toISOString()
    });
  }
  
  async cacheSpecialistConsultation(consultation) {
    await this.storage.specialistCache.store({
      specialist: consultation.specialist,
      task: consultation.task,
      recommendation: consultation.recommendation,
      outcome: consultation.outcome,
      cacheKey: this.generateCacheKey(consultation),
      expirationTime: this.calculateExpiration(consultation)
    });
  }
}
```

### Context Flow Management

```javascript
// Context Flow Controller
class ContextFlowController {
  static manageContextFlow(task, routing) {
    return {
      routerIntegration: this.integrateWithRouter(routing),
      specialistContext: this.prepareSpecialistContext(task),
      implementationPatterns: this.retrievePatterns(task),
      analyticsCollection: this.collectAnalytics(task, routing)
    };
  }
  
  static updateContextFromOutcome(outcome) {
    return {
      patternUpdates: this.updatePatterns(outcome),
      routerOptimization: this.optimizeRouter(outcome),
      cacheUpdates: this.updateCache(outcome),
      analyticsLogging: this.logAnalytics(outcome)
    };
  }
}
```

### Learning System Integration

```javascript
// Learning System
class LearningSystem {
  static analyzePatterns(consultations) {
    return {
      successPatterns: this.identifySuccessPatterns(consultations),
      failurePatterns: this.identifyFailurePatterns(consultations),
      optimizationOpportunities: this.findOptimizations(consultations),
      routingImprovements: this.suggestRoutingImprovements(consultations)
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
}
```

## 6. Error Recovery & Feedback Loops

### Error Detection Systems

```javascript
// Error Detection Framework
class ErrorDetectionSystem {
  static detectImplementationFailure(implementation, expectedOutcome) {
    const detectionResults = {
      syntaxErrors: this.checkSyntaxErrors(implementation),
      logicErrors: this.checkLogicErrors(implementation),
      integrationFailures: this.checkIntegrationFailures(implementation),
      performanceIssues: this.checkPerformanceIssues(implementation)
    };
    
    return {
      hasFailures: this.hasAnyFailures(detectionResults),
      failureTypes: this.categorizeFailures(detectionResults),
      severity: this.assessSeverity(detectionResults),
      recoveryStrategy: this.recommendRecovery(detectionResults)
    };
  }
  
  static detectUserDissatisfaction(feedback, outcome) {
    return {
      satisfactionScore: this.calculateSatisfactionScore(feedback),
      qualityGaps: this.identifyQualityGaps(feedback, outcome),
      routingAccuracy: this.assessRoutingAccuracy(feedback),
      improvementNeeds: this.identifyImprovementNeeds(feedback)
    };
  }
  
  static detectQualityProblems(codeReview, standards) {
    return {
      codeQualityIssues: this.assessCodeQuality(codeReview),
      architecturalInconsistencies: this.checkArchitecturalConsistency(codeReview),
      securityVulnerabilities: this.checkSecurityIssues(codeReview),
      maintenanceProblems: this.assessMaintainability(codeReview)
    };
  }
}
```

### Recovery Actions Framework

```javascript
// Recovery Actions System
class RecoveryActionsSystem {
  static autoEscalateTier(currentTier, failure) {
    const escalationStrategy = {
      from: currentTier,
      to: this.determineTargetTier(currentTier, failure),
      reason: failure.primaryCause,
      context: this.preserveContext(failure),
      specialistRequirements: this.identifyRequiredExpertise(failure)
    };
    
    return {
      escalation: escalationStrategy,
      timeline: this.estimateEscalationTime(escalationStrategy),
      resources: this.calculateRequiredResources(escalationStrategy),
      successProbability: this.estimateSuccessProbability(escalationStrategy)
    };
  }
  
  static changeRoutingDecision(originalRouting, feedback) {
    return {
      newRouting: this.recalculateRouting(originalRouting, feedback),
      reasonForChange: this.documentReason(feedback),
      expectedImprovement: this.predictImprovement(originalRouting, feedback),
      rollbackPlan: this.createRollbackPlan(originalRouting)
    };
  }
  
  static addSpecialistConsultation(currentSpecialists, qualityGaps) {
    return {
      additionalSpecialists: this.selectAdditionalSpecialists(qualityGaps),
      consultationStrategy: this.planConsultationStrategy(qualityGaps),
      integrationApproach: this.planIntegration(currentSpecialists, qualityGaps),
      qualityExpectations: this.setQualityExpectations(qualityGaps)
    };
  }
}
```

### Learning Updates System

```javascript
// Learning Updates Framework
class LearningUpdatesSystem {
  static adjustComplexityThresholds(outcomes, currentThresholds) {
    const analysis = this.analyzeThresholdPerformance(outcomes, currentThresholds);
    
    return {
      newThresholds: this.calculateOptimalThresholds(analysis),
      adjustmentRationale: this.documentAdjustmentReason(analysis),
      expectedImpact: this.predictImpact(analysis),
      validationPlan: this.createValidationPlan(analysis)
    };
  }
  
  static updateSuccessPatterns(recoveryOutcomes) {
    return {
      newPatterns: this.extractSuccessPatterns(recoveryOutcomes),
      patternConfidence: this.calculatePatternConfidence(recoveryOutcomes),
      applicabilityRules: this.defineApplicabilityRules(recoveryOutcomes),
      integrationStrategy: this.planPatternIntegration(recoveryOutcomes)
    };
  }
  
  static refineRoutingLogic(feedbackData, routingDecisions) {
    const refinements = this.analyzeFeedbackPatterns(feedbackData, routingDecisions);
    
    return {
      algorithmUpdates: this.generateAlgorithmUpdates(refinements),
      selectionCriteria: this.refineSelectionCriteria(refinements),
      performancePredictors: this.improvePerformancePredictors(refinements),
      validationMetrics: this.updateValidationMetrics(refinements)
    };
  }
}
```

### Feedback Integration System

```javascript
// Feedback Integration Framework
class FeedbackIntegrationSystem {
  static integrateImplementationFailureFeedback(failure, recovery) {
    const feedbackLoop = {
      failureAnalysis: this.analyzeFailure(failure),
      recoveryEffectiveness: this.assessRecoveryEffectiveness(recovery),
      learningOpportunities: this.identifyLearningOpportunities(failure, recovery),
      systemUpdates: this.generateSystemUpdates(failure, recovery)
    };
    
    // Update Context Router
    this.updateContextRouter(feedbackLoop);
    
    // Adjust Complexity Thresholds
    this.adjustComplexityThresholds(feedbackLoop);
    
    return feedbackLoop;
  }
  
  static integrateUserDissatisfactionFeedback(dissatisfaction, routingDecision) {
    const feedbackLoop = {
      dissatisfactionAnalysis: this.analyzeDissatisfaction(dissatisfaction),
      routingAssessment: this.assessRoutingDecision(routingDecision),
      improvementStrategy: this.developImprovementStrategy(dissatisfaction),
      preventionMeasures: this.developPreventionMeasures(dissatisfaction)
    };
    
    // Change Routing Decision
    this.changeRoutingDecision(feedbackLoop);
    
    // Update Success Patterns
    this.updateSuccessPatterns(feedbackLoop);
    
    return feedbackLoop;
  }
  
  static integrateQualityProblemsFeedback(qualityProblems, consultation) {
    const feedbackLoop = {
      qualityAnalysis: this.analyzeQualityProblems(qualityProblems),
      consultationAssessment: this.assessConsultationQuality(consultation),
      specialistPerformance: this.evaluateSpecialistPerformance(consultation),
      processImprovements: this.identifyProcessImprovements(qualityProblems)
    };
    
    // Add Specialist Consultation
    this.addSpecialistConsultation(feedbackLoop);
    
    // Refine Routing Logic
    this.refineRoutingLogic(feedbackLoop);
    
    return feedbackLoop;
  }
}
```

## Implementation Template

### Project Setup

```bash
# Create sub-agent architecture directory
mkdir sub-agents
cd sub-agents

# Create core directories
mkdir -p {routing,specialists,protocols,quality,context,recovery}

# Create configuration files
touch config/sub-agent-config.json
touch config/specialist-registry.json
touch config/quality-standards.json
```

### Configuration Files

#### sub-agent-config.json
```json
{
  "routing": {
    "distributionTargets": {
      "direct": 80,
      "tier1": 15,
      "tier2": 4,
      "tier3": 1
    },
    "complexityThresholds": {
      "direct": 3,
      "tier1": 6,
      "tier2": 8,
      "tier3": 10
    }
  },
  "specialists": {
    "tier1": [
      "architecture-generalist",
      "security-generalist", 
      "performance-generalist",
      "data-generalist",
      "integration-generalist",
      "frontend-generalist"
    ],
    "tier2": [
      "database-specialist",
      "api-design-specialist",
      "auth-systems-specialist", 
      "performance-optimization-specialist",
      "ml-integration-specialist",
      "testing-strategy-specialist"
    ],
    "tier3": [
      "system-architect",
      "integration-architect",
      "scale-architect",
      "security-architect",
      "data-architect", 
      "governance-architect"
    ]
  },
  "quality": {
    "validationCheckpoints": true,
    "consistencyVerification": true,
    "performanceTracking": true,
    "continuousImprovement": true
  },
  "context": {
    "storageEnabled": true,
    "learningEnabled": true,
    "cacheExpiration": "24h",
    "patternRecognition": true
  },
  "recovery": {
    "errorDetection": true,
    "autoEscalation": true,
    "feedbackIntegration": true,
    "learningUpdates": true
  }
}
```

### Usage Instructions

1. **Copy Template**: Copy all files to your target project
2. **Configure Specialists**: Update specialist configurations for your domain
3. **Initialize Context**: Set up context storage for your project
4. **Test Routing**: Validate task routing with sample tasks
5. **Monitor Quality**: Implement quality metrics tracking
6. **Enable Learning**: Activate feedback loops and learning systems

### Integration Examples

```javascript
// Example integration in your main application
import { SubAgentArchitecture } from './sub-agents';

class MyApplication {
  constructor() {
    this.subAgents = new SubAgentArchitecture({
      configPath: './config/sub-agent-config.json',
      contextStorage: './context/',
      learningEnabled: true
    });
  }
  
  async handleTask(task) {
    const routing = await this.subAgents.route(task);
    const result = await this.subAgents.execute(routing);
    await this.subAgents.updateContext(result);
    return result;
  }
}
```

This template provides a complete, portable c architecture that can be deployed to any project requiring intelligent task routing and specialist consultation management.