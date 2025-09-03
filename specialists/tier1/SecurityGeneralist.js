const BaseSpecialist = require('../BaseSpecialist');

/**
 * Security Generalist - Tier 1 Specialist
 * Domain: Authentication, authorization, data protection
 */
class SecurityGeneralist extends BaseSpecialist {
  constructor() {
    super({
      id: 'security-generalist',
      name: 'Security Generalist',
      domain: 'security',
      tier: 'TIER_1',
      expertise: [
        'authentication',
        'authorization',
        'data protection',
        'oauth',
        'jwt',
        'api security',
        'input validation',
        'secure coding',
        'basic encryption'
      ],
      handoffCriteria: [
        {
          condition: 'advanced-threat-modeling',
          reason: 'Advanced threat modeling requires specialized security expertise',
          targetTier: 'TIER_2',
          targetSpecialist: 'auth-systems-specialist'
        },
        {
          condition: 'compliance-requirements',
          reason: 'Compliance frameworks require security architecture expertise',
          targetTier: 'TIER_3',
          targetSpecialist: 'security-architect'
        }
      ]
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      securityScope: this.assessSecurityScope(task),
      threatLevel: this.assessThreatLevel(task, context),
      authRequirements: this.analyzeAuthRequirements(task),
      dataProtection: this.analyzeDataProtection(task),
      vulnerabilities: this.identifyPotentialVulnerabilities(task),
      complianceNeeds: this.assessComplianceNeeds(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      securityApproach: this.recommendSecurityApproach(analysis, task),
      authenticationStrategy: this.recommendAuthStrategy(analysis, task),
      dataProtectionMeasures: this.recommendDataProtection(analysis, task),
      vulnerabilityMitigation: this.recommendVulnerabilityMitigation(analysis, task),
      securityTesting: this.recommendSecurityTesting(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  assessSecurityScope(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scopeIndicators = {
      authentication: ['login', 'auth', 'signin', 'signup', 'user', 'password'],
      authorization: ['permission', 'role', 'access', 'authorize', 'rbac'],
      dataProtection: ['encrypt', 'secure', 'protect', 'sensitive', 'privacy'],
      apiSecurity: ['api', 'endpoint', 'token', 'jwt', 'oauth'],
      inputValidation: ['validate', 'sanitize', 'input', 'form', 'injection'],
      communication: ['https', 'tls', 'ssl', 'secure connection']
    };
    
    const detectedScopes = [];
    Object.entries(scopeIndicators).forEach(([scope, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        detectedScopes.push({
          scope,
          relevance: this.calculateScopeRelevance(scope, taskText, keywords),
          priority: this.getScopePriority(scope)
        });
      }
    });
    
    return detectedScopes.sort((a, b) => b.priority - a.priority);
  }
  
  assessThreatLevel(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    let threatScore = 1;
    
    // High-risk indicators
    const highRiskIndicators = [
      'user data', 'personal information', 'payment', 'financial',
      'admin', 'privileged', 'sensitive', 'critical'
    ];
    
    const mediumRiskIndicators = [
      'api', 'external', 'integration', 'public', 'user input'
    ];
    
    if (highRiskIndicators.some(indicator => taskText.includes(indicator))) {
      threatScore = 8;
    } else if (mediumRiskIndicators.some(indicator => taskText.includes(indicator))) {
      threatScore = 5;
    } else {
      threatScore = 2;
    }
    
    // Environmental factors
    if (context.environment === 'production') threatScore += 1;
    if (context.internetFacing) threatScore += 2;
    if (context.regulatedIndustry) threatScore += 2;
    
    return {
      score: Math.min(threatScore, 10),
      level: threatScore > 7 ? 'high' : threatScore > 4 ? 'medium' : 'low',
      factors: this.getThreatFactors(taskText, context)
    };
  }
  
  analyzeAuthRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const authTypes = {
      basic: ['basic auth', 'username password', 'simple login'],
      oauth: ['oauth', 'oauth2', 'social login', 'google login', 'facebook'],
      jwt: ['jwt', 'token', 'bearer token', 'access token'],
      saml: ['saml', 'sso', 'single sign', 'enterprise'],
      mfa: ['mfa', '2fa', 'two factor', 'multi factor']
    };
    
    const detectedAuthTypes = [];
    Object.entries(authTypes).forEach(([type, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        detectedAuthTypes.push({
          type,
          complexity: this.getAuthComplexity(type),
          securityLevel: this.getAuthSecurityLevel(type)
        });
      }
    });
    
    return {
      required: detectedAuthTypes.length > 0 || taskText.includes('auth') || taskText.includes('login'),
      types: detectedAuthTypes,
      complexity: this.calculateAuthComplexity(detectedAuthTypes)
    };
  }
  
  analyzeDataProtection(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const dataTypes = {
      personal: ['personal', 'pii', 'name', 'email', 'phone'],
      financial: ['payment', 'credit card', 'banking', 'financial'],
      health: ['health', 'medical', 'hipaa', 'patient'],
      sensitive: ['sensitive', 'confidential', 'secret', 'private']
    };
    
    const detectedDataTypes = [];
    Object.entries(dataTypes).forEach(([type, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        detectedDataTypes.push({
          type,
          protectionLevel: this.getDataProtectionLevel(type),
          regulations: this.getApplicableRegulations(type)
        });
      }
    });
    
    return {
      required: detectedDataTypes.length > 0,
      dataTypes: detectedDataTypes,
      protectionMeasures: this.getRequiredProtectionMeasures(detectedDataTypes)
    };
  }
  
  identifyPotentialVulnerabilities(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const vulnerabilityPatterns = {
      'sql-injection': ['sql', 'database', 'query', 'input'],
      'xss': ['user input', 'display', 'html', 'script'],
      'csrf': ['form', 'post', 'state change', 'action'],
      'auth-bypass': ['auth', 'login', 'session', 'cookie'],
      'data-exposure': ['log', 'error', 'debug', 'expose'],
      'insecure-communication': ['http', 'plain text', 'unencrypted']
    };
    
    const potentialVulnerabilities = [];
    Object.entries(vulnerabilityPatterns).forEach(([vulnerability, indicators]) => {
      if (indicators.some(indicator => taskText.includes(indicator))) {
        potentialVulnerabilities.push({
          type: vulnerability,
          severity: this.getVulnerabilitySeverity(vulnerability),
          likelihood: this.getVulnerabilityLikelihood(vulnerability, taskText),
          mitigation: this.getVulnerabilityMitigation(vulnerability)
        });
      }
    });
    
    return potentialVulnerabilities.sort((a, b) => b.severity - a.severity);
  }
  
  assessComplianceNeeds(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complianceFrameworks = {
      gdpr: ['gdpr', 'privacy', 'consent', 'personal data', 'eu'],
      hipaa: ['hipaa', 'health', 'medical', 'patient'],
      pci: ['pci', 'payment', 'credit card', 'financial'],
      sox: ['sox', 'financial reporting', 'audit'],
      iso27001: ['iso', 'information security', 'isms']
    };
    
    const applicableFrameworks = [];
    Object.entries(complianceFrameworks).forEach(([framework, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        applicableFrameworks.push({
          framework: framework.toUpperCase(),
          requirements: this.getComplianceRequirements(framework),
          impact: this.getComplianceImpact(framework)
        });
      }
    });
    
    return {
      required: applicableFrameworks.length > 0 || context.regulatedIndustry,
      frameworks: applicableFrameworks,
      generalRequirements: this.getGeneralComplianceRequirements()
    };
  }
  
  recommendSecurityApproach(analysis, task) {
    const { threatLevel, securityScope } = analysis;
    
    if (threatLevel.level === 'high') {
      return {
        approach: 'defense-in-depth',
        rationale: 'High threat level requires comprehensive security measures',
        layers: ['network', 'application', 'data', 'identity'],
        principles: ['least privilege', 'fail secure', 'defense in depth']
      };
    }
    
    if (threatLevel.level === 'medium') {
      return {
        approach: 'layered-security',
        rationale: 'Moderate threat level requires multiple security controls',
        layers: ['application', 'data', 'identity'],
        principles: ['secure by default', 'least privilege']
      };
    }
    
    return {
      approach: 'basic-security',
      rationale: 'Low threat level allows for standard security practices',
      layers: ['application', 'data'],
      principles: ['secure coding practices', 'input validation']
    };
  }
  
  recommendAuthStrategy(analysis, task) {
    const { authRequirements } = analysis;
    
    if (!authRequirements.required) {
      return {
        strategy: 'no-auth-required',
        rationale: 'No authentication requirements identified'
      };
    }
    
    if (authRequirements.complexity === 'high') {
      return {
        strategy: 'enterprise-auth',
        implementation: 'oauth2-with-jwt',
        features: ['sso', 'mfa', 'role-based-access'],
        considerations: ['token-refresh', 'session-management', 'audit-logging']
      };
    }
    
    if (authRequirements.complexity === 'medium') {
      return {
        strategy: 'standard-auth',
        implementation: 'jwt-based',
        features: ['login-logout', 'password-reset', 'role-based-access'],
        considerations: ['secure-storage', 'session-timeout', 'brute-force-protection']
      };
    }
    
    return {
      strategy: 'simple-auth',
      implementation: 'session-based',
      features: ['basic-login', 'logout'],
      considerations: ['secure-passwords', 'https-only', 'session-management']
    };
  }
  
  recommendDataProtection(analysis, task) {
    const { dataProtection } = analysis;
    
    if (!dataProtection.required) {
      return {
        measures: ['basic-access-control'],
        rationale: 'No sensitive data protection requirements identified'
      };
    }
    
    const measures = [];
    dataProtection.dataTypes.forEach(dataType => {
      if (dataType.protectionLevel === 'high') {
        measures.push('encryption-at-rest', 'encryption-in-transit', 'access-logging');
      } else if (dataType.protectionLevel === 'medium') {
        measures.push('access-control', 'audit-logging');
      }
    });
    
    return {
      measures: [...new Set(measures)],
      encryption: this.getEncryptionRecommendations(dataProtection.dataTypes),
      storage: this.getStorageRecommendations(dataProtection.dataTypes),
      access: this.getAccessControlRecommendations(dataProtection.dataTypes)
    };
  }
  
  recommendVulnerabilityMitigation(analysis, task) {
    const { vulnerabilities } = analysis;
    
    return vulnerabilities.map(vuln => ({
      vulnerability: vuln.type,
      priority: vuln.severity,
      mitigation: vuln.mitigation,
      implementation: this.getMitigationImplementation(vuln.type),
      testing: this.getMitigationTesting(vuln.type)
    }));
  }
  
  recommendSecurityTesting(analysis, task) {
    const { threatLevel, vulnerabilities } = analysis;
    
    const baseTesting = ['input-validation-testing', 'auth-testing'];
    
    if (threatLevel.level === 'high') {
      baseTesting.push('penetration-testing', 'security-scanning', 'threat-modeling');
    } else if (threatLevel.level === 'medium') {
      baseTesting.push('security-scanning', 'vulnerability-assessment');
    }
    
    if (vulnerabilities.length > 0) {
      baseTesting.push('vulnerability-specific-testing');
    }
    
    return {
      testTypes: [...new Set(baseTesting)],
      frequency: this.getTestingFrequency(threatLevel.level),
      tools: this.getRecommendedTools(threatLevel.level)
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { threatLevel, authRequirements, dataProtection } = analysis;
    
    const steps = [
      'Security requirements analysis',
      'Threat modeling',
      'Security architecture design',
      'Secure coding implementation',
      'Security testing',
      'Security review',
      'Deployment security configuration'
    ];
    
    if (authRequirements.required) {
      steps.splice(3, 0, 'Authentication implementation');
    }
    
    if (dataProtection.required) {
      steps.splice(4, 0, 'Data protection implementation');
    }
    
    return {
      steps: threatLevel.level === 'low' ? steps.slice(0, 5) : steps,
      priority: 'high',
      resources: this.getRequiredSecurityResources(threatLevel.level),
      timeline: this.calculateSecurityTimeline(steps.length)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = ['security-code-review', 'vulnerability-scanning'];
    
    if (analysis.authRequirements.required) {
      baseChecks.push('auth-testing');
    }
    
    if (analysis.dataProtection.required) {
      baseChecks.push('data-protection-audit');
    }
    
    if (analysis.threatLevel.level === 'high') {
      baseChecks.push('penetration-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { threatLevel, authRequirements, dataProtection } = analysis;
    
    let baseDays = threatLevel.level === 'high' ? 4 :
                   threatLevel.level === 'medium' ? 2 : 1;
    
    if (authRequirements.complexity === 'high') baseDays += 3;
    else if (authRequirements.complexity === 'medium') baseDays += 1;
    
    if (dataProtection.required) baseDays += 2;
    
    return {
      estimate: `${baseDays}-${baseDays + 2} days`,
      confidence: 0.75,
      factors: [
        `Threat level: ${threatLevel.level}`,
        `Auth complexity: ${authRequirements.complexity || 'none'}`,
        `Data protection required: ${dataProtection.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'advanced-threat-modeling':
        return analysis.threatLevel.score > 7 ||
               analysis.complianceNeeds.required;
      
      case 'compliance-requirements':
        return analysis.complianceNeeds.frameworks.length > 1 ||
               analysis.complianceNeeds.frameworks.some(f => 
                 ['HIPAA', 'PCI', 'SOX'].includes(f.framework)
               );
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 6;
  }
  
  // Helper methods
  calculateScopeRelevance(scope, taskText, keywords) {
    const matches = keywords.filter(keyword => taskText.includes(keyword)).length;
    return matches / keywords.length;
  }
  
  getScopePriority(scope) {
    const priorities = {
      authentication: 9,
      authorization: 8,
      dataProtection: 9,
      apiSecurity: 7,
      inputValidation: 8,
      communication: 6
    };
    return priorities[scope] || 5;
  }
  
  getThreatFactors(taskText, context) {
    const factors = [];
    if (taskText.includes('user data')) factors.push('handles-user-data');
    if (context.internetFacing) factors.push('internet-facing');
    if (context.regulatedIndustry) factors.push('regulated-industry');
    return factors;
  }
  
  getAuthComplexity(type) {
    const complexity = {
      basic: 2,
      jwt: 4,
      oauth: 6,
      saml: 8,
      mfa: 7
    };
    return complexity[type] || 3;
  }
  
  getAuthSecurityLevel(type) {
    const levels = {
      basic: 3,
      jwt: 6,
      oauth: 8,
      saml: 9,
      mfa: 9
    };
    return levels[type] || 5;
  }
  
  calculateAuthComplexity(authTypes) {
    if (authTypes.length === 0) return 'none';
    const maxComplexity = Math.max(...authTypes.map(t => t.complexity));
    return maxComplexity > 6 ? 'high' : maxComplexity > 3 ? 'medium' : 'low';
  }
  
  getDataProtectionLevel(type) {
    const levels = {
      personal: 'medium',
      financial: 'high',
      health: 'high',
      sensitive: 'high'
    };
    return levels[type] || 'low';
  }
  
  getApplicableRegulations(type) {
    const regulations = {
      personal: ['GDPR', 'CCPA'],
      financial: ['PCI-DSS', 'SOX'],
      health: ['HIPAA'],
      sensitive: ['General Data Protection']
    };
    return regulations[type] || [];
  }
  
  getRequiredProtectionMeasures(dataTypes) {
    const measures = new Set();
    dataTypes.forEach(type => {
      if (type.protectionLevel === 'high') {
        measures.add('encryption');
        measures.add('access-control');
        measures.add('audit-logging');
      } else if (type.protectionLevel === 'medium') {
        measures.add('access-control');
        measures.add('basic-logging');
      }
    });
    return Array.from(measures);
  }
  
  getVulnerabilitySeverity(vulnerability) {
    const severities = {
      'sql-injection': 9,
      'xss': 7,
      'csrf': 6,
      'auth-bypass': 9,
      'data-exposure': 8,
      'insecure-communication': 5
    };
    return severities[vulnerability] || 5;
  }
  
  getVulnerabilityLikelihood(vulnerability, taskText) {
    // Simple likelihood assessment
    return taskText.length > 100 ? 'medium' : 'low';
  }
  
  getVulnerabilityMitigation(vulnerability) {
    const mitigations = {
      'sql-injection': 'Use parameterized queries and input validation',
      'xss': 'Implement output encoding and CSP headers',
      'csrf': 'Use CSRF tokens and SameSite cookies',
      'auth-bypass': 'Implement proper session management',
      'data-exposure': 'Implement secure logging practices',
      'insecure-communication': 'Use HTTPS and secure protocols'
    };
    return mitigations[vulnerability] || 'Follow secure coding practices';
  }
  
  getComplianceRequirements(framework) {
    return [`Implement ${framework.toUpperCase()} controls`, 'Document compliance measures'];
  }
  
  getComplianceImpact(framework) {
    return 'medium';
  }
  
  getGeneralComplianceRequirements() {
    return ['Data protection', 'Access controls', 'Audit logging'];
  }
  
  getEncryptionRecommendations(dataTypes) {
    return ['AES-256 for data at rest', 'TLS 1.3 for data in transit'];
  }
  
  getStorageRecommendations(dataTypes) {
    return ['Encrypted storage', 'Access-controlled databases', 'Secure backups'];
  }
  
  getAccessControlRecommendations(dataTypes) {
    return ['Role-based access', 'Principle of least privilege', 'Regular access reviews'];
  }
  
  getMitigationImplementation(vulnerability) {
    return `Implement standard ${vulnerability} mitigation techniques`;
  }
  
  getMitigationTesting(vulnerability) {
    return `Test for ${vulnerability} using security scanning tools`;
  }
  
  getTestingFrequency(threatLevel) {
    if (threatLevel === 'high') return 'weekly';
    if (threatLevel === 'medium') return 'monthly';
    return 'quarterly';
  }
  
  getRecommendedTools(threatLevel) {
    const tools = ['OWASP ZAP', 'SonarQube'];
    if (threatLevel === 'high') tools.push('Burp Suite', 'Nessus');
    return tools;
  }
  
  getRequiredSecurityResources(threatLevel) {
    const resources = ['Security testing tools', 'Code review'];
    if (threatLevel === 'high') resources.push('Security specialist', 'Penetration testing');
    return resources;
  }
  
  calculateSecurityTimeline(stepCount) {
    return {
      planning: '1 day',
      implementation: `${Math.ceil(stepCount * 0.6)} days`,
      testing: '2 days',
      review: '1 day'
    };
  }
}

module.exports = SecurityGeneralist;