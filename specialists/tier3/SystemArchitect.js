const BaseSpecialist = require('../BaseSpecialist');

/**
 * System Architect - Tier 3 Architect
 * Domain: Enterprise architecture, cross-domain coordination
 */
class SystemArchitect extends BaseSpecialist {
  constructor() {
    super({
      id: 'system-architect',
      name: 'System Architect',
      domain: 'system-architecture',
      tier: 'TIER_3',
      expertise: [
        'enterprise architecture patterns',
        'cross-system integration',
        'technology strategy',
        'architectural governance',
        'system design principles',
        'scalability architecture',
        'distributed systems',
        'architectural decision making'
      ],
      prerequisites: ['tier2-specialist-consultation'],
      handoffCriteria: [] // Top tier - no handoffs
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      enterpriseScope: this.assessEnterpriseScope(task, context),
      architecturalComplexity: this.analyzeArchitecturalComplexity(task),
      crossDomainImpact: this.analyzeCrossDomainImpact(task, context),
      technologyStrategy: this.analyzeTechnologyStrategy(task, context),
      governanceRequirements: this.analyzeGovernanceRequirements(task, context),
      scalabilityArchitecture: this.analyzeScalabilityArchitecture(task),
      riskAssessment: this.analyzeEnterpriseRisks(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      architecturalVision: this.recommendArchitecturalVision(analysis, task),
      technologyStrategy: this.recommendTechnologyStrategy(analysis, task),
      integrationArchitecture: this.recommendIntegrationArchitecture(analysis, task),
      scalabilityFramework: this.recommendScalabilityFramework(analysis, task),
      governanceFramework: this.recommendGovernanceFramework(analysis, task),
      implementationRoadmap: this.recommendImplementationRoadmap(analysis, task),
      riskMitigation: this.recommendRiskMitigation(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  assessEnterpriseScope(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scopeIndicators = {
      'single-system': {
        keywords: ['single application', 'one system', 'isolated'],
        complexity: 2,
        coordination: 'minimal'
      },
      'multi-system': {
        keywords: ['multiple systems', 'several applications', 'system integration'],
        complexity: 5,
        coordination: 'moderate'
      },
      'enterprise-wide': {
        keywords: ['enterprise', 'company-wide', 'organization', 'all systems'],
        complexity: 8,
        coordination: 'extensive'
      },
      'ecosystem': {
        keywords: ['ecosystem', 'platform', 'marketplace', 'partners'],
        complexity: 9,
        coordination: 'complex'
      }
    };
    
    let detectedScope = 'single-system';
    let maxComplexity = 0;
    
    Object.entries(scopeIndicators).forEach(([scope, config]) => {
      if (config.keywords.some(keyword => taskText.includes(keyword))) {
        if (config.complexity > maxComplexity) {
          detectedScope = scope;
          maxComplexity = config.complexity;
        }
      }
    });
    
    return {
      scope: detectedScope,
      complexity: maxComplexity,
      coordination: scopeIndicators[detectedScope].coordination,
      stakeholders: this.identifyStakeholders(detectedScope, context),
      constraints: this.identifyEnterpriseConstraints(context)
    };
  }
  
  analyzeArchitecturalComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complexityDimensions = {
      technical: this.assessTechnicalComplexity(taskText),
      business: this.assessBusinessComplexity(taskText),
      operational: this.assessOperationalComplexity(taskText),
      organizational: this.assessOrganizationalComplexity(taskText)
    };
    
    const overallComplexity = Math.max(...Object.values(complexityDimensions));
    
    return {
      dimensions: complexityDimensions,
      overall: overallComplexity,
      level: overallComplexity > 8 ? 'very-high' :
             overallComplexity > 6 ? 'high' :
             overallComplexity > 4 ? 'medium' : 'low',
      challenges: this.identifyArchitecturalChallenges(complexityDimensions)
    };
  }
  
  analyzeCrossDomainImpact(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const domains = {
      'security': ['security', 'auth', 'compliance', 'privacy', 'audit'],
      'data': ['data', 'database', 'analytics', 'storage', 'governance'],
      'integration': ['api', 'service', 'integration', 'messaging', 'event'],
      'performance': ['performance', 'scale', 'load', 'optimization', 'speed'],
      'operations': ['deploy', 'monitor', 'ops', 'maintenance', 'support'],
      'business': ['business', 'process', 'workflow', 'rules', 'logic']
    };
    
    const impactedDomains = [];
    Object.entries(domains).forEach(([domain, keywords]) => {
      const relevance = keywords.filter(keyword => taskText.includes(keyword)).length;
      if (relevance > 0) {
        impactedDomains.push({
          domain,
          relevance,
          impact: this.assessDomainImpact(domain, relevance),
          coordination: this.getDomainCoordination(domain)
        });
      }
    });
    
    return {
      domains: impactedDomains.sort((a, b) => b.relevance - a.relevance),
      crossCutting: impactedDomains.length > 3,
      coordinationNeeds: this.assessCoordinationNeeds(impactedDomains)
    };
  }
  
  analyzeTechnologyStrategy(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const technologyAspects = {
      'platform-strategy': this.assessPlatformStrategy(taskText, context),
      'technology-stack': this.assessTechnologyStack(taskText, context),
      'modernization': this.assessModernizationNeeds(taskText, context),
      'standardization': this.assessStandardizationNeeds(taskText, context),
      'innovation': this.assessInnovationOpportunities(taskText, context)
    };
    
    return {
      aspects: technologyAspects,
      maturity: this.assessTechnologyMaturity(context),
      alignment: this.assessBusinessAlignment(taskText, context),
      constraints: this.identifyTechnologyConstraints(context)
    };
  }
  
  analyzeGovernanceRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const governanceAreas = {
      'architectural-governance': {
        required: taskText.includes('standard') || taskText.includes('policy'),
        level: this.assessGovernanceLevel('architectural', taskText, context)
      },
      'data-governance': {
        required: taskText.includes('data') || taskText.includes('privacy'),
        level: this.assessGovernanceLevel('data', taskText, context)
      },
      'security-governance': {
        required: taskText.includes('security') || taskText.includes('compliance'),
        level: this.assessGovernanceLevel('security', taskText, context)
      },
      'operational-governance': {
        required: taskText.includes('operations') || taskText.includes('process'),
        level: this.assessGovernanceLevel('operational', taskText, context)
      }
    };
    
    return {
      areas: governanceAreas,
      frameworks: this.identifyApplicableFrameworks(context),
      compliance: this.assessComplianceRequirements(context),
      enforcement: this.assessEnforcementNeeds(governanceAreas)
    };
  }
  
  analyzeScalabilityArchitecture(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalabilityDimensions = {
      'horizontal': {
        needed: taskText.includes('horizontal') || taskText.includes('scale out'),
        complexity: this.assessHorizontalScalingComplexity(taskText)
      },
      'vertical': {
        needed: taskText.includes('vertical') || taskText.includes('scale up'),
        complexity: this.assessVerticalScalingComplexity(taskText)
      },
      'functional': {
        needed: taskText.includes('microservice') || taskText.includes('decompose'),
        complexity: this.assessFunctionalScalingComplexity(taskText)
      },
      'data': {
        needed: taskText.includes('data') && taskText.includes('scale'),
        complexity: this.assessDataScalingComplexity(taskText)
      }
    };
    
    return {
      dimensions: scalabilityDimensions,
      approach: this.determineScalabilityApproach(scalabilityDimensions),
      challenges: this.identifyScalabilityChallenges(scalabilityDimensions),
      timeline: this.assessScalabilityTimeline(scalabilityDimensions)
    };
  }
  
  analyzeEnterpriseRisks(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const riskCategories = {
      'technical': this.assessTechnicalRisks(taskText, context),
      'business': this.assessBusinessRisks(taskText, context),
      'operational': this.assessOperationalRisks(taskText, context),
      'organizational': this.assessOrganizationalRisks(taskText, context),
      'compliance': this.assessComplianceRisks(taskText, context)
    };
    
    const allRisks = Object.values(riskCategories).flat();
    const highRisks = allRisks.filter(risk => risk.severity === 'high');
    
    return {
      categories: riskCategories,
      highRisks,
      overallRiskLevel: this.calculateOverallRiskLevel(allRisks),
      mitigation: this.identifyRiskMitigation(allRisks)
    };
  }
  
  recommendArchitecturalVision(analysis, task) {
    const { enterpriseScope, architecturalComplexity, crossDomainImpact } = analysis;
    
    if (enterpriseScope.scope === 'ecosystem' || architecturalComplexity.level === 'very-high') {
      return {
        vision: 'distributed-enterprise-architecture',
        principles: [
          'domain-driven-design',
          'microservices-architecture',
          'event-driven-communication',
          'api-first-design',
          'cloud-native-principles'
        ],
        patterns: [
          'bounded-contexts',
          'saga-pattern',
          'cqrs',
          'event-sourcing',
          'api-gateway'
        ],
        benefits: [
          'scalability',
          'resilience',
          'team-autonomy',
          'technology-diversity',
          'rapid-innovation'
        ]
      };
    }
    
    if (enterpriseScope.scope === 'enterprise-wide' || crossDomainImpact.crossCutting) {
      return {
        vision: 'layered-enterprise-architecture',
        principles: [
          'separation-of-concerns',
          'standardization',
          'reusability',
          'integration-excellence',
          'governance-by-design'
        ],
        patterns: [
          'layered-architecture',
          'service-oriented-architecture',
          'enterprise-service-bus',
          'shared-data-architecture',
          'centralized-governance'
        ],
        benefits: [
          'consistency',
          'governance',
          'integration',
          'cost-efficiency',
          'compliance'
        ]
      };
    }
    
    return {
      vision: 'modular-system-architecture',
      principles: [
        'modularity',
        'simplicity',
        'maintainability',
        'performance',
        'cost-effectiveness'
      ],
      patterns: [
        'modular-monolith',
        'clean-architecture',
        'dependency-injection',
        'repository-pattern',
        'mvc-pattern'
      ],
      benefits: [
        'simplicity',
        'maintainability',
        'development-speed',
        'cost-effectiveness',
        'easy-deployment'
      ]
    };
  }
  
  recommendTechnologyStrategy(analysis, task) {
    const { technologyStrategy, enterpriseScope } = analysis;
    
    const strategy = {
      approach: this.determineTechnologyApproach(technologyStrategy, enterpriseScope),
      platform: this.recommendPlatformStrategy(technologyStrategy),
      modernization: this.recommendModernizationStrategy(technologyStrategy),
      standardization: this.recommendStandardizationStrategy(technologyStrategy),
      innovation: this.recommendInnovationStrategy(technologyStrategy)
    };
    
    return strategy;
  }
  
  recommendIntegrationArchitecture(analysis, task) {
    const { crossDomainImpact, enterpriseScope } = analysis;
    
    if (enterpriseScope.scope === 'ecosystem') {
      return {
        approach: 'api-economy-architecture',
        patterns: ['api-gateway', 'service-mesh', 'event-streaming'],
        governance: 'federated-api-governance',
        security: 'zero-trust-architecture'
      };
    }
    
    if (crossDomainImpact.crossCutting) {
      return {
        approach: 'enterprise-integration-architecture',
        patterns: ['enterprise-service-bus', 'canonical-data-model', 'message-routing'],
        governance: 'centralized-integration-governance',
        security: 'enterprise-security-model'
      };
    }
    
    return {
      approach: 'point-to-point-integration',
      patterns: ['direct-api-calls', 'shared-databases', 'file-transfers'],
      governance: 'lightweight-governance',
      security: 'application-level-security'
    };
  }
  
  recommendScalabilityFramework(analysis, task) {
    const { scalabilityArchitecture, enterpriseScope } = analysis;
    
    return {
      framework: this.selectScalabilityFramework(scalabilityArchitecture, enterpriseScope),
      dimensions: this.prioritizeScalabilityDimensions(scalabilityArchitecture),
      implementation: this.planScalabilityImplementation(scalabilityArchitecture),
      monitoring: this.designScalabilityMonitoring(scalabilityArchitecture)
    };
  }
  
  recommendGovernanceFramework(analysis, task) {
    const { governanceRequirements, enterpriseScope } = analysis;
    
    return {
      framework: this.selectGovernanceFramework(governanceRequirements, enterpriseScope),
      structure: this.designGovernanceStructure(governanceRequirements),
      processes: this.defineGovernanceProcesses(governanceRequirements),
      tools: this.recommendGovernanceTools(governanceRequirements),
      metrics: this.defineGovernanceMetrics(governanceRequirements)
    };
  }
  
  recommendImplementationRoadmap(analysis, task) {
    const { architecturalComplexity, enterpriseScope, riskAssessment } = analysis;
    
    const phases = this.defineImplementationPhases(analysis);
    const timeline = this.calculateRoadmapTimeline(phases, architecturalComplexity);
    const dependencies = this.identifyPhaseDependencies(phases);
    
    return {
      phases,
      timeline,
      dependencies,
      riskMitigation: this.planRiskMitigation(riskAssessment),
      governance: this.planImplementationGovernance(enterpriseScope)
    };
  }
  
  recommendRiskMitigation(analysis, task) {
    const { riskAssessment } = analysis;
    
    return {
      strategy: 'comprehensive-risk-management',
      highPriorityRisks: riskAssessment.highRisks,
      mitigationPlans: this.createMitigationPlans(riskAssessment.categories),
      monitoring: this.designRiskMonitoring(riskAssessment),
      contingency: this.planContingencyMeasures(riskAssessment.highRisks)
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { enterpriseScope, architecturalComplexity } = analysis;
    
    const steps = [
      'Architectural vision definition',
      'Stakeholder alignment',
      'Technology strategy development',
      'Governance framework establishment',
      'Integration architecture design',
      'Scalability framework definition',
      'Risk assessment and mitigation planning',
      'Implementation roadmap creation',
      'Pilot project execution',
      'Full-scale implementation',
      'Monitoring and optimization'
    ];
    
    return {
      steps,
      priority: 'strategic',
      resources: this.getRequiredArchitecturalResources(analysis),
      timeline: this.calculateArchitecturalTimeline(steps.length),
      governance: this.planImplementationGovernance(enterpriseScope),
      success_criteria: this.defineSuccessCriteria(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'architectural-review',
      'technology-alignment-review',
      'governance-compliance-check',
      'risk-assessment-validation',
      'stakeholder-approval'
    ];
    
    if (analysis.enterpriseScope.scope === 'enterprise-wide' || 
        analysis.enterpriseScope.scope === 'ecosystem') {
      baseChecks.push('enterprise-architecture-board-review');
    }
    
    if (analysis.crossDomainImpact.crossCutting) {
      baseChecks.push('cross-domain-impact-assessment');
    }
    
    if (analysis.riskAssessment.highRisks.length > 0) {
      baseChecks.push('risk-mitigation-plan-review');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { architecturalComplexity, enterpriseScope, crossDomainImpact } = analysis;
    
    let baseWeeks = 4; // Base architectural work
    
    if (enterpriseScope.scope === 'ecosystem') baseWeeks += 8;
    else if (enterpriseScope.scope === 'enterprise-wide') baseWeeks += 6;
    else if (enterpriseScope.scope === 'multi-system') baseWeeks += 3;
    
    if (architecturalComplexity.level === 'very-high') baseWeeks += 6;
    else if (architecturalComplexity.level === 'high') baseWeeks += 4;
    
    if (crossDomainImpact.crossCutting) baseWeeks += 2;
    
    return {
      estimate: `${baseWeeks}-${baseWeeks + 4} weeks`,
      confidence: 0.7,
      factors: [
        `Enterprise scope: ${enterpriseScope.scope}`,
        `Architectural complexity: ${architecturalComplexity.level}`,
        `Cross-domain impact: ${crossDomainImpact.crossCutting}`,
        `High risks: ${analysis.riskAssessment.highRisks.length}`
      ],
      phases: {
        'analysis-and-design': `${Math.ceil(baseWeeks * 0.4)} weeks`,
        'stakeholder-alignment': `${Math.ceil(baseWeeks * 0.2)} weeks`,
        'detailed-planning': `${Math.ceil(baseWeeks * 0.4)} weeks`
      }
    };
  }
  
  getMaxComplexityHandled() {
    return 10; // System Architect handles maximum complexity
  }
  
  // Helper methods
  identifyStakeholders(scope, context) {
    const stakeholders = ['development-teams', 'product-owners'];
    
    if (scope === 'enterprise-wide' || scope === 'ecosystem') {
      stakeholders.push('c-suite', 'enterprise-architects', 'security-team');
    }
    
    if (scope === 'multi-system' || scope === 'enterprise-wide') {
      stakeholders.push('operations-team', 'data-governance');
    }
    
    return stakeholders;
  }
  
  identifyEnterpriseConstraints(context) {
    const constraints = [];
    if (context.regulatedIndustry) constraints.push('compliance-requirements');
    if (context.legacySystems) constraints.push('legacy-integration');
    if (context.budgetConstraints) constraints.push('budget-limitations');
    if (context.timeConstraints) constraints.push('delivery-deadlines');
    return constraints;
  }
  
  assessTechnicalComplexity(taskText) {
    const indicators = ['distributed', 'microservice', 'real-time', 'high-performance', 'complex-integration'];
    return indicators.filter(i => taskText.includes(i)).length * 2;
  }
  
  assessBusinessComplexity(taskText) {
    const indicators = ['multiple-business-units', 'complex-workflow', 'regulatory', 'compliance'];
    return indicators.filter(i => taskText.includes(i)).length * 2;
  }
  
  assessOperationalComplexity(taskText) {
    const indicators = ['24/7', 'high-availability', 'global', 'multi-region', 'disaster-recovery'];
    return indicators.filter(i => taskText.includes(i)).length * 2;
  }
  
  assessOrganizationalComplexity(taskText) {
    const indicators = ['multiple-teams', 'cross-functional', 'stakeholder', 'governance'];
    return indicators.filter(i => taskText.includes(i)).length * 2;
  }
  
  identifyArchitecturalChallenges(dimensions) {
    const challenges = [];
    if (dimensions.technical > 6) challenges.push('technical-complexity');
    if (dimensions.business > 6) challenges.push('business-alignment');
    if (dimensions.operational > 6) challenges.push('operational-scalability');
    if (dimensions.organizational > 6) challenges.push('organizational-coordination');
    return challenges;
  }
  
  assessDomainImpact(domain, relevance) {
    return relevance > 2 ? 'high' : relevance > 1 ? 'medium' : 'low';
  }
  
  getDomainCoordination(domain) {
    const coordination = {
      'security': 'security-team',
      'data': 'data-governance-team',
      'integration': 'integration-team',
      'performance': 'performance-team',
      'operations': 'devops-team',
      'business': 'business-analysts'
    };
    return coordination[domain] || 'architecture-team';
  }
  
  assessCoordinationNeeds(impactedDomains) {
    if (impactedDomains.length > 4) return 'extensive';
    if (impactedDomains.length > 2) return 'moderate';
    return 'minimal';
  }
  
  // Technology Strategy Assessment Methods
  assessPlatformStrategy(taskText, context) {
    return {
      current: context.currentPlatform || 'mixed',
      target: this.determinePlatformTarget(taskText),
      migration: this.assessMigrationNeeds(taskText, context)
    };
  }
  
  assessTechnologyStack(taskText, context) {
    return {
      frontend: context.frontendTech || 'modern-spa',
      backend: context.backendTech || 'microservices',
      data: context.dataTech || 'polyglot-persistence',
      integration: context.integrationTech || 'api-first'
    };
  }
  
  assessModernizationNeeds(taskText, context) {
    const needsModernization = taskText.includes('moderniz') || 
                               taskText.includes('legacy') || 
                               context.legacySystems;
    
    return {
      needed: needsModernization,
      scope: needsModernization ? this.assessModernizationScope(taskText) : 'none',
      approach: needsModernization ? this.recommendModernizationApproach(taskText) : 'none'
    };
  }
  
  assessStandardizationNeeds(taskText, context) {
    return {
      needed: taskText.includes('standard') || taskText.includes('consistent'),
      areas: this.identifyStandardizationAreas(taskText),
      approach: 'gradual-standardization'
    };
  }
  
  assessInnovationOpportunities(taskText, context) {
    return {
      ai_ml: taskText.includes('ai') || taskText.includes('machine learning'),
      cloud_native: taskText.includes('cloud') || taskText.includes('containeriz'),
      edge_computing: taskText.includes('edge') || taskText.includes('iot'),
      blockchain: taskText.includes('blockchain') || taskText.includes('distributed ledger')
    };
  }
  
  assessTechnologyMaturity(context) {
    return context.technologyMaturity || 'evolving';
  }
  
  assessBusinessAlignment(taskText, context) {
    return taskText.includes('business') || taskText.includes('strategic') ? 'high' : 'medium';
  }
  
  identifyTechnologyConstraints(context) {
    const constraints = [];
    if (context.legacySystems) constraints.push('legacy-compatibility');
    if (context.securityRequirements) constraints.push('security-compliance');
    if (context.performanceRequirements) constraints.push('performance-requirements');
    return constraints;
  }
  
  // Governance Assessment Methods
  assessGovernanceLevel(type, taskText, context) {
    if (context.enterpriseEnvironment) return 'high';
    if (taskText.includes('compliance') || taskText.includes('regulation')) return 'high';
    return 'medium';
  }
  
  identifyApplicableFrameworks(context) {
    const frameworks = [];
    if (context.regulatedIndustry) frameworks.push('compliance-frameworks');
    if (context.enterpriseEnvironment) frameworks.push('enterprise-frameworks');
    frameworks.push('architectural-governance');
    return frameworks;
  }
  
  assessComplianceRequirements(context) {
    return {
      required: context.regulatedIndustry || context.complianceNeeds,
      frameworks: context.complianceFrameworks || ['general-data-protection'],
      level: context.complianceLevel || 'standard'
    };
  }
  
  assessEnforcementNeeds(governanceAreas) {
    const requiredAreas = Object.values(governanceAreas).filter(area => area.required);
    return requiredAreas.length > 2 ? 'automated-enforcement' : 'manual-review';
  }
  
  // Implementation Planning Methods
  defineImplementationPhases(analysis) {
    const phases = [
      {
        name: 'foundation',
        description: 'Establish architectural foundation and governance',
        duration: '4-6 weeks',
        deliverables: ['architectural-vision', 'governance-framework', 'technology-strategy']
      },
      {
        name: 'pilot',
        description: 'Execute pilot implementation with core components',
        duration: '6-8 weeks',
        deliverables: ['pilot-system', 'integration-patterns', 'operational-procedures']
      },
      {
        name: 'scaling',
        description: 'Scale implementation across enterprise',
        duration: '12-16 weeks',
        deliverables: ['full-implementation', 'monitoring-systems', 'documentation']
      }
    ];
    
    if (analysis.enterpriseScope.scope === 'ecosystem') {
      phases.push({
        name: 'ecosystem-integration',
        description: 'Integrate with external partners and platforms',
        duration: '8-10 weeks',
        deliverables: ['partner-integrations', 'api-marketplace', 'ecosystem-governance']
      });
    }
    
    return phases;
  }
  
  calculateRoadmapTimeline(phases, complexity) {
    let totalWeeks = phases.reduce((sum, phase) => {
      const weeks = parseInt(phase.duration.split('-')[1]);
      return sum + weeks;
    }, 0);
    
    if (complexity.level === 'very-high') totalWeeks *= 1.3;
    else if (complexity.level === 'high') totalWeeks *= 1.2;
    
    return {
      total: `${Math.ceil(totalWeeks)} weeks`,
      phases: phases.map(phase => ({
        name: phase.name,
        duration: phase.duration
      }))
    };
  }
  
  identifyPhaseDependencies(phases) {
    return phases.map((phase, index) => ({
      phase: phase.name,
      dependencies: index === 0 ? [] : [phases[index - 1].name],
      criticalPath: index < phases.length - 1
    }));
  }
  
  getRequiredArchitecturalResources(analysis) {
    const resources = [
      'Enterprise Architect',
      'Solution Architects',
      'Technical Leads',
      'Business Analysts'
    ];
    
    if (analysis.enterpriseScope.scope === 'enterprise-wide' || 
        analysis.enterpriseScope.scope === 'ecosystem') {
      resources.push('Program Manager', 'Change Management Team');
    }
    
    if (analysis.crossDomainImpact.crossCutting) {
      resources.push('Domain Experts', 'Integration Specialists');
    }
    
    return resources;
  }
  
  calculateArchitecturalTimeline(stepCount) {
    return {
      'strategic-planning': '2 weeks',
      'detailed-design': '4 weeks',
      'stakeholder-alignment': '2 weeks',
      'implementation-planning': '2 weeks',
      'governance-setup': '1 week'
    };
  }
  
  defineSuccessCriteria(analysis) {
    return {
      'architectural-coherence': 'System components follow architectural principles',
      'business-alignment': 'Architecture supports business objectives',
      'scalability-achievement': 'System scales according to requirements',
      'governance-compliance': 'All components comply with governance standards',
      'stakeholder-satisfaction': 'Stakeholders approve architectural decisions'
    };
  }
  
  // Risk Assessment Methods
  assessTechnicalRisks(taskText, context) {
    return [
      { risk: 'technology-obsolescence', severity: 'medium', probability: 'low' },
      { risk: 'integration-complexity', severity: 'high', probability: 'medium' },
      { risk: 'performance-bottlenecks', severity: 'medium', probability: 'medium' }
    ];
  }
  
  assessBusinessRisks(taskText, context) {
    return [
      { risk: 'business-disruption', severity: 'high', probability: 'low' },
      { risk: 'cost-overrun', severity: 'medium', probability: 'medium' }
    ];
  }
  
  assessOperationalRisks(taskText, context) {
    return [
      { risk: 'operational-complexity', severity: 'medium', probability: 'high' },
      { risk: 'skill-gaps', severity: 'medium', probability: 'medium' }
    ];
  }
  
  assessOrganizationalRisks(taskText, context) {
    return [
      { risk: 'resistance-to-change', severity: 'high', probability: 'medium' },
      { risk: 'coordination-challenges', severity: 'medium', probability: 'high' }
    ];
  }
  
  assessComplianceRisks(taskText, context) {
    if (context.regulatedIndustry) {
      return [
        { risk: 'regulatory-non-compliance', severity: 'high', probability: 'low' },
        { risk: 'audit-failures', severity: 'medium', probability: 'low' }
      ];
    }
    return [];
  }
  
  calculateOverallRiskLevel(allRisks) {
    const highSeverityRisks = allRisks.filter(risk => risk.severity === 'high');
    if (highSeverityRisks.length > 2) return 'high';
    if (highSeverityRisks.length > 0) return 'medium';
    return 'low';
  }
  
  identifyRiskMitigation(allRisks) {
    return allRisks.filter(risk => risk.severity === 'high' || risk.probability === 'high')
                   .map(risk => ({
                     risk: risk.risk,
                     mitigation: this.getMitigationStrategy(risk.risk)
                   }));
  }
  
  getMitigationStrategy(riskType) {
    const strategies = {
      'technology-obsolescence': 'technology-roadmap-planning',
      'integration-complexity': 'phased-integration-approach',
      'performance-bottlenecks': 'performance-testing-and-monitoring',
      'business-disruption': 'change-management-and-communication',
      'cost-overrun': 'detailed-estimation-and-tracking',
      'operational-complexity': 'operational-excellence-practices',
      'skill-gaps': 'training-and-knowledge-transfer',
      'resistance-to-change': 'stakeholder-engagement-and-communication',
      'coordination-challenges': 'governance-and-communication-protocols',
      'regulatory-non-compliance': 'compliance-review-and-validation',
      'audit-failures': 'continuous-compliance-monitoring'
    };
    
    return strategies[riskType] || 'risk-monitoring-and-response';
  }
  
  // Additional helper methods
  determinePlatformTarget(taskText) {
    if (taskText.includes('cloud')) return 'cloud-native';
    if (taskText.includes('hybrid')) return 'hybrid-cloud';
    return 'modernized-on-premise';
  }
  
  assessMigrationNeeds(taskText, context) {
    return {
      needed: context.legacySystems || taskText.includes('migrat'),
      approach: 'strangler-fig-pattern',
      timeline: 'gradual'
    };
  }
  
  assessModernizationScope(taskText) {
    if (taskText.includes('complete')) return 'full-modernization';
    if (taskText.includes('partial')) return 'selective-modernization';
    return 'incremental-modernization';
  }
  
  recommendModernizationApproach(taskText) {
    return 'strangler-fig-pattern';
  }
  
  identifyStandardizationAreas(taskText) {
    const areas = [];
    if (taskText.includes('api')) areas.push('api-standards');
    if (taskText.includes('data')) areas.push('data-standards');
    if (taskText.includes('security')) areas.push('security-standards');
    return areas.length > 0 ? areas : ['architectural-standards'];
  }
}

module.exports = SystemArchitect;