const BaseSpecialist = require('../BaseSpecialist');

/**
 * Authentication Systems Specialist - Tier 2 Specialist
 * Domain: OAuth, JWT, SSO, MFA, identity management
 * Prerequisites: Requires Security Generalist consultation
 */
class AuthSystemsSpecialist extends BaseSpecialist {
  constructor() {
    super({
      id: 'auth-systems-specialist',
      name: 'Authentication Systems Specialist',
      domain: 'authentication-systems',
      tier: 'TIER_2',
      prerequisites: ['security-generalist-consultation'],
      expertise: [
        'OAuth 2.0/OpenID Connect',
        'JWT token management',
        'Single Sign-On (SSO)',
        'Multi-Factor Authentication',
        'Identity providers integration',
        'Session management',
        'Password policies',
        'Account security',
        'Token security',
        'Identity federation'
      ],
      handoffCriteria: [
        {
          condition: 'enterprise-identity-governance',
          reason: 'Enterprise-wide identity governance requires security architect oversight',
          targetTier: 'TIER_3',
          targetSpecialist: 'security-architect'
        },
        {
          condition: 'complex-compliance-requirements',
          reason: 'Complex compliance and governance requirements need architectural guidance',
          targetTier: 'TIER_3',
          targetSpecialist: 'governance-architect'
        }
      ]
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      authenticationMethods: this.analyzeAuthenticationMethods(task, context),
      userTypes: this.analyzeUserTypes(task, context),
      securityLevel: this.analyzeSecurityLevel(task, context),
      integrationComplexity: this.analyzeIntegrationComplexity(task, context),
      complianceRequirements: this.analyzeComplianceRequirements(task, context),
      scalingRequirements: this.analyzeScalingRequirements(task, context),
      sessionManagement: this.analyzeSessionManagement(task, context),
      mfaRequirements: this.analyzeMfaRequirements(task, context)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      authenticationArchitecture: this.recommendAuthenticationArchitecture(analysis, task),
      authenticationMethods: this.recommendAuthenticationMethods(analysis, task),
      tokenStrategy: this.recommendTokenStrategy(analysis, task),
      sessionStrategy: this.recommendSessionStrategy(analysis, task),
      mfaImplementation: this.recommendMfaImplementation(analysis, task),
      identityProviders: this.recommendIdentityProviders(analysis, task),
      securityPolicies: this.recommendSecurityPolicies(analysis, task),
      userManagement: this.recommendUserManagement(analysis, task),
      monitoring: this.recommendAuthMonitoring(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  analyzeAuthenticationMethods(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const methods = [];
    
    if (taskText.includes('oauth') || taskText.includes('social login') || taskText.includes('google') || taskText.includes('microsoft')) {
      methods.push({
        method: 'oauth2-oidc',
        providers: this.extractOAuthProviders(taskText),
        rationale: 'OAuth/OpenID Connect for third-party authentication'
      });
    }
    
    if (taskText.includes('jwt') || taskText.includes('token') || taskText.includes('stateless')) {
      methods.push({
        method: 'jwt-tokens',
        type: 'bearer-token-authentication',
        rationale: 'JWT tokens for stateless authentication'
      });
    }
    
    if (taskText.includes('session') || taskText.includes('cookie') || taskText.includes('traditional')) {
      methods.push({
        method: 'session-based',
        storage: 'server-side-sessions',
        rationale: 'Traditional session-based authentication'
      });
    }
    
    if (taskText.includes('api key') || taskText.includes('machine to machine') || taskText.includes('service')) {
      methods.push({
        method: 'api-key-authentication',
        type: 'service-authentication',
        rationale: 'API keys for service-to-service authentication'
      });
    }
    
    if (taskText.includes('certificate') || taskText.includes('mutual tls') || taskText.includes('client cert')) {
      methods.push({
        method: 'certificate-based',
        type: 'mutual-tls-authentication',
        rationale: 'Certificate-based authentication for high security'
      });
    }
    
    // Default fallback
    if (methods.length === 0) {
      methods.push({
        method: 'username-password',
        type: 'traditional-credentials',
        rationale: 'Standard username/password authentication'
      });
    }
    
    return methods;
  }
  
  analyzeUserTypes(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const userTypes = [];
    
    if (taskText.includes('customer') || taskText.includes('end user') || taskText.includes('public')) {
      userTypes.push({
        type: 'external-users',
        characteristics: ['self-registration', 'password-reset', 'social-login'],
        securityLevel: 'standard'
      });
    }
    
    if (taskText.includes('employee') || taskText.includes('staff') || taskText.includes('internal')) {
      userTypes.push({
        type: 'internal-users',
        characteristics: ['active-directory', 'sso', 'corporate-policies'],
        securityLevel: 'high'
      });
    }
    
    if (taskText.includes('admin') || taskText.includes('administrator') || taskText.includes('privileged')) {
      userTypes.push({
        type: 'privileged-users',
        characteristics: ['mfa-required', 'audit-logging', 'elevated-permissions'],
        securityLevel: 'critical'
      });
    }
    
    if (taskText.includes('service') || taskText.includes('application') || taskText.includes('machine')) {
      userTypes.push({
        type: 'service-accounts',
        characteristics: ['api-keys', 'certificate-auth', 'automated-access'],
        securityLevel: 'high'
      });
    }
    
    if (taskText.includes('partner') || taskText.includes('third party') || taskText.includes('external org')) {
      userTypes.push({
        type: 'partner-users',
        characteristics: ['federated-identity', 'limited-access', 'audit-trail'],
        securityLevel: 'high'
      });
    }
    
    return userTypes.length > 0 ? userTypes : [{
      type: 'general-users',
      characteristics: ['standard-authentication'],
      securityLevel: 'standard'
    }];
  }
  
  analyzeSecurityLevel(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    let level = 'standard';
    let score = 5;
    const factors = [];
    
    // High security indicators
    const highSecurityIndicators = [
      'financial', 'banking', 'healthcare', 'government', 
      'sensitive data', 'confidential', 'classified',
      'pii', 'personal information', 'gdpr', 'hipaa'
    ];
    
    if (highSecurityIndicators.some(indicator => taskText.includes(indicator))) {
      level = 'critical';
      score = 9;
      factors.push('sensitive-data-handling');
    }
    
    // Multi-factor authentication requirements
    if (taskText.includes('mfa') || taskText.includes('multi-factor') || taskText.includes('2fa')) {
      level = level === 'critical' ? 'critical' : 'high';
      score = Math.max(score, 8);
      factors.push('mfa-required');
    }
    
    // Compliance requirements
    const complianceIndicators = ['compliance', 'regulation', 'audit', 'sox', 'pci'];
    if (complianceIndicators.some(indicator => taskText.includes(indicator))) {
      level = level === 'critical' ? 'critical' : 'high';
      score = Math.max(score, 8);
      factors.push('compliance-requirements');
    }
    
    // Enterprise indicators
    if (taskText.includes('enterprise') || taskText.includes('organization') || taskText.includes('corporate')) {
      level = level === 'critical' ? 'critical' : 'high';
      score = Math.max(score, 7);
      factors.push('enterprise-requirements');
    }
    
    return {
      level,
      score,
      factors,
      requirements: this.getSecurityRequirements(level),
      policies: this.getSecurityPolicies(level)
    };
  }
  
  analyzeIntegrationComplexity(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    let complexity = 'simple';
    let score = 1;
    const integrations = [];
    
    // Identity provider integrations
    if (taskText.includes('active directory') || taskText.includes('ldap')) {
      integrations.push({ type: 'active-directory', complexity: 'moderate' });
      complexity = 'moderate';
      score = Math.max(score, 6);
    }
    
    if (taskText.includes('saml') || taskText.includes('sso')) {
      integrations.push({ type: 'saml-sso', complexity: 'complex' });
      complexity = 'complex';
      score = Math.max(score, 7);
    }
    
    if (taskText.includes('okta') || taskText.includes('azure ad') || taskText.includes('auth0')) {
      integrations.push({ type: 'cloud-identity-provider', complexity: 'moderate' });
      complexity = 'moderate';
      score = Math.max(score, 5);
    }
    
    // Multiple authentication methods
    const authMethods = ['oauth', 'jwt', 'session', 'api key', 'certificate'];
    const detectedMethods = authMethods.filter(method => taskText.includes(method));
    if (detectedMethods.length > 2) {
      complexity = 'complex';
      score = Math.max(score, 8);
      integrations.push({ type: 'multiple-auth-methods', complexity: 'complex' });
    }
    
    // Federation requirements
    if (taskText.includes('federation') || taskText.includes('trust relationship')) {
      integrations.push({ type: 'identity-federation', complexity: 'advanced' });
      complexity = 'advanced';
      score = Math.max(score, 9);
    }
    
    return {
      level: complexity,
      score,
      integrations,
      estimatedConnections: integrations.length || 1,
      federationRequired: integrations.some(i => i.type === 'identity-federation')
    };
  }
  
  analyzeComplianceRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const requirements = [];
    
    // GDPR
    if (taskText.includes('gdpr') || taskText.includes('privacy') || taskText.includes('eu')) {
      requirements.push({
        standard: 'gdpr',
        requirements: ['consent-management', 'data-portability', 'right-to-erasure'],
        impact: 'high'
      });
    }
    
    // HIPAA
    if (taskText.includes('hipaa') || taskText.includes('healthcare') || taskText.includes('medical')) {
      requirements.push({
        standard: 'hipaa',
        requirements: ['audit-logging', 'access-controls', 'encryption'],
        impact: 'critical'
      });
    }
    
    // PCI DSS
    if (taskText.includes('pci') || taskText.includes('payment') || taskText.includes('credit card')) {
      requirements.push({
        standard: 'pci-dss',
        requirements: ['strong-authentication', 'network-isolation', 'regular-audits'],
        impact: 'high'
      });
    }
    
    // SOX
    if (taskText.includes('sox') || taskText.includes('financial') || taskText.includes('public company')) {
      requirements.push({
        standard: 'sox',
        requirements: ['audit-trails', 'segregation-of-duties', 'access-reviews'],
        impact: 'high'
      });
    }
    
    // ISO 27001
    if (taskText.includes('iso 27001') || taskText.includes('information security')) {
      requirements.push({
        standard: 'iso-27001',
        requirements: ['risk-management', 'security-policies', 'continuous-monitoring'],
        impact: 'medium'
      });
    }
    
    return {
      required: requirements.length > 0,
      standards: requirements,
      overallImpact: this.calculateOverallComplianceImpact(requirements),
      auditingNeeds: this.getAuditingNeeds(requirements)
    };
  }
  
  analyzeScalingRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const scalingIndicators = [
      'scale', 'thousands', 'millions', 'concurrent',
      'load', 'performance', 'high traffic'
    ];
    
    const needsScaling = scalingIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.expectedUsers > 1000;
    
    if (!needsScaling) {
      return { required: false, level: 'single-instance' };
    }
    
    let level = 'moderate';
    const estimatedUsers = this.estimateUserCount(taskText, context);
    
    if (estimatedUsers > 100000) {
      level = 'high';
    } else if (estimatedUsers > 10000) {
      level = 'moderate';
    } else {
      level = 'low';
    }
    
    return {
      required: true,
      level,
      estimatedUsers,
      concurrentSessions: Math.floor(estimatedUsers * 0.1),
      scalingStrategy: this.getScalingStrategy(level),
      cachingNeeds: this.getCachingNeeds(level)
    };
  }
  
  analyzeSessionManagement(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const sessionTypes = {
      'stateless': {
        indicators: ['stateless', 'jwt', 'token', 'microservice'],
        approach: 'jwt-based-sessions',
        storage: 'client-side-tokens'
      },
      'stateful': {
        indicators: ['session', 'server-side', 'traditional'],
        approach: 'server-side-sessions',
        storage: 'session-store'
      },
      'hybrid': {
        indicators: ['hybrid', 'mixed', 'both'],
        approach: 'mixed-session-strategy',
        storage: 'flexible-storage'
      }
    };
    
    let sessionType = 'stateless'; // Default
    Object.entries(sessionTypes).forEach(([type, config]) => {
      if (config.indicators.some(indicator => taskText.includes(indicator))) {
        sessionType = type;
      }
    });
    
    const strategy = sessionTypes[sessionType];
    
    return {
      type: sessionType,
      approach: strategy.approach,
      storage: strategy.storage,
      timeout: this.getSessionTimeout(taskText, context),
      refreshStrategy: this.getRefreshStrategy(sessionType),
      securityMeasures: this.getSessionSecurityMeasures(sessionType)
    };
  }
  
  analyzeMfaRequirements(task, context) {
    const taskText = task.description?.toLowerCase() || '';
    
    const mfaIndicators = [
      'mfa', 'multi-factor', '2fa', 'two-factor',
      'otp', 'authenticator', 'sms', 'email verification'
    ];
    
    const needsMfa = mfaIndicators.some(indicator => 
      taskText.includes(indicator)
    ) || context.securityLevel === 'high' || context.privilegedUsers;
    
    if (!needsMfa) {
      return { required: false };
    }
    
    const methods = this.extractMfaMethods(taskText);
    const fallbackMethods = methods.length === 0 ? ['totp', 'sms'] : [];
    
    return {
      required: true,
      methods: methods.length > 0 ? methods : fallbackMethods,
      enrollment: this.getMfaEnrollmentStrategy(taskText),
      backup: this.getMfaBackupStrategy(methods),
      policies: this.getMfaPolicies(taskText, context)
    };
  }
  
  recommendAuthenticationArchitecture(analysis, task) {
    const { securityLevel, integrationComplexity, scalingRequirements, userTypes } = analysis;
    
    if (securityLevel.level === 'critical' && 
        integrationComplexity.level === 'advanced') {
      return {
        architecture: 'enterprise-identity-platform',
        rationale: 'Critical security and complex integrations require enterprise platform',
        components: ['identity-provider', 'policy-engine', 'audit-system', 'federation-layer'],
        patterns: ['zero-trust-architecture', 'policy-based-access-control'],
        technologies: ['Okta/Azure-AD', 'SAML', 'OIDC', 'SCIM']
      };
    }
    
    if (scalingRequirements.required && scalingRequirements.level === 'high') {
      return {
        architecture: 'distributed-authentication-system',
        rationale: 'High scaling requirements need distributed architecture',
        components: ['auth-service-cluster', 'token-validation-service', 'session-store-cluster'],
        patterns: ['stateless-authentication', 'token-based-auth', 'distributed-sessions'],
        technologies: ['JWT', 'Redis-Cluster', 'OAuth2', 'Load-Balancers']
      };
    }
    
    if (integrationComplexity.integrations.length > 1) {
      return {
        architecture: 'federated-authentication-system',
        rationale: 'Multiple integrations benefit from federated approach',
        components: ['federation-server', 'identity-broker', 'protocol-adapters'],
        patterns: ['identity-federation', 'protocol-bridging', 'claims-transformation'],
        technologies: ['SAML', 'OIDC', 'LDAP', 'Identity-Bridge']
      };
    }
    
    return {
      architecture: 'standard-authentication-system',
      rationale: 'Standard architecture suitable for current requirements',
      components: ['auth-service', 'user-store', 'session-management'],
      patterns: ['traditional-auth', 'role-based-access'],
      technologies: ['Passport.js', 'Database', 'Sessions/JWT']
    };
  }
  
  recommendAuthenticationMethods(analysis, task) {
    const { authenticationMethods, userTypes, securityLevel } = analysis;
    
    const recommendations = [];
    
    // Primary authentication method
    if (authenticationMethods.some(m => m.method === 'oauth2-oidc')) {
      recommendations.push({
        method: 'oauth2-oidc',
        priority: 'primary',
        implementation: 'openid-connect-with-social-providers',
        providers: authenticationMethods.find(m => m.method === 'oauth2-oidc').providers,
        rationale: 'OAuth/OIDC for social authentication and federation'
      });
    }
    
    // JWT for API authentication
    if (authenticationMethods.some(m => m.method === 'jwt-tokens') || 
        userTypes.some(u => u.type === 'service-accounts')) {
      recommendations.push({
        method: 'jwt-bearer-tokens',
        priority: 'primary',
        implementation: 'rsa-signed-jwt-tokens',
        tokenTypes: ['access-token', 'refresh-token'],
        rationale: 'JWT tokens for stateless API authentication'
      });
    }
    
    // Session-based for web applications
    if (authenticationMethods.some(m => m.method === 'session-based')) {
      recommendations.push({
        method: 'session-based-auth',
        priority: 'secondary',
        implementation: 'secure-http-sessions',
        storage: 'redis-session-store',
        rationale: 'Sessions for traditional web application authentication'
      });
    }
    
    // API keys for service authentication
    if (userTypes.some(u => u.type === 'service-accounts')) {
      recommendations.push({
        method: 'api-key-authentication',
        priority: 'specialized',
        implementation: 'hmac-signed-api-keys',
        keyTypes: ['read-only', 'read-write', 'admin'],
        rationale: 'API keys for service-to-service authentication'
      });
    }
    
    // Certificate-based for high security
    if (securityLevel.level === 'critical') {
      recommendations.push({
        method: 'mutual-tls-authentication',
        priority: 'specialized',
        implementation: 'client-certificate-validation',
        certificateTypes: ['user-certificates', 'service-certificates'],
        rationale: 'mTLS for highest security requirements'
      });
    }
    
    return recommendations;
  }
  
  recommendTokenStrategy(analysis, task) {
    const { sessionManagement, scalingRequirements, securityLevel } = analysis;
    
    if (sessionManagement.type === 'stateless' || scalingRequirements.required) {
      return {
        strategy: 'jwt-token-strategy',
        tokenTypes: {
          'access-token': {
            expiration: '15-30 minutes',
            claims: ['user-id', 'roles', 'permissions', 'issued-at'],
            signing: 'rsa-256-signing'
          },
          'refresh-token': {
            expiration: '7-30 days',
            storage: 'secure-database-storage',
            rotation: 'automatic-rotation-on-use'
          }
        },
        implementation: {
          library: 'jsonwebtoken',
          keyManagement: 'rotating-key-pairs',
          validation: 'signature-and-expiration-validation'
        },
        security: {
          keyRotation: 'monthly',
          tokenBinding: securityLevel.level === 'critical',
          audience: 'application-specific'
        }
      };
    }
    
    return {
      strategy: 'session-token-strategy',
      tokenTypes: {
        'session-id': {
          expiration: sessionManagement.timeout,
          storage: 'server-side-session-store',
          security: 'httponly-secure-cookies'
        }
      },
      implementation: {
        library: 'express-session',
        store: 'redis-session-store',
        serialization: 'secure-session-serialization'
      },
      security: {
        cookieSettings: 'secure-httponly-samesite',
        sessionFixation: 'regenerate-on-login',
        csrfProtection: 'enabled'
      }
    };
  }
  
  recommendSessionStrategy(analysis, task) {
    const { sessionManagement, scalingRequirements, userTypes } = analysis;
    
    const strategy = {
      type: sessionManagement.type,
      approach: sessionManagement.approach,
      implementation: {}
    };
    
    if (sessionManagement.type === 'stateless') {
      strategy.implementation = {
        storage: 'client-side-jwt-tokens',
        state: 'stored-in-token-claims',
        invalidation: 'token-blacklisting-for-logout',
        scaling: 'horizontally-scalable',
        tools: ['jsonwebtoken', 'redis-blacklist']
      };
    } else if (sessionManagement.type === 'stateful') {
      strategy.implementation = {
        storage: scalingRequirements.required ? 'redis-cluster' : 'redis-single',
        state: 'server-side-session-data',
        invalidation: 'session-deletion',
        scaling: 'shared-session-store',
        tools: ['express-session', 'connect-redis']
      };
    } else {
      strategy.implementation = {
        storage: 'hybrid-token-and-session',
        state: 'critical-data-server-side',
        invalidation: 'dual-invalidation-strategy',
        scaling: 'flexible-scaling',
        tools: ['jsonwebtoken', 'express-session', 'redis']
      };
    }
    
    strategy.timeout = sessionManagement.timeout;
    strategy.refreshStrategy = sessionManagement.refreshStrategy;
    strategy.securityMeasures = sessionManagement.securityMeasures;
    
    return strategy;
  }
  
  recommendMfaImplementation(analysis, task) {
    const { mfaRequirements, userTypes, securityLevel } = analysis;
    
    if (!mfaRequirements.required) {
      return {
        required: false,
        rationale: 'MFA not required for current security level'
      };
    }
    
    const implementation = {
      required: true,
      rationale: 'MFA required for enhanced security',
      methods: [],
      enrollment: mfaRequirements.enrollment,
      policies: mfaRequirements.policies
    };
    
    // TOTP (Time-based One-Time Password)
    if (mfaRequirements.methods.includes('totp')) {
      implementation.methods.push({
        method: 'totp',
        implementation: 'time-based-otp-with-authenticator-apps',
        tools: ['speakeasy', 'qrcode', 'google-authenticator'],
        backup: 'recovery-codes',
        rationale: 'Most secure and user-friendly MFA method'
      });
    }
    
    // SMS-based OTP
    if (mfaRequirements.methods.includes('sms')) {
      implementation.methods.push({
        method: 'sms-otp',
        implementation: 'sms-delivered-verification-codes',
        tools: ['twilio', 'aws-sns', 'messagebird'],
        backup: 'voice-call-fallback',
        rationale: 'Widely accessible MFA method',
        limitations: 'sim-swapping-risk'
      });
    }
    
    // Email-based verification
    if (mfaRequirements.methods.includes('email')) {
      implementation.methods.push({
        method: 'email-verification',
        implementation: 'email-delivered-verification-codes',
        tools: ['nodemailer', 'sendgrid', 'aws-ses'],
        backup: 'alternative-email',
        rationale: 'Fallback MFA method for account recovery'
      });
    }
    
    // Hardware tokens for high security
    if (securityLevel.level === 'critical') {
      implementation.methods.push({
        method: 'hardware-tokens',
        implementation: 'fido2-webauthn-security-keys',
        tools: ['webauthn-server', 'yubikey-support'],
        backup: 'multiple-registered-keys',
        rationale: 'Highest security for critical applications'
      });
    }
    
    // Biometric authentication
    if (mfaRequirements.methods.includes('biometric')) {
      implementation.methods.push({
        method: 'biometric-authentication',
        implementation: 'webauthn-biometric-verification',
        tools: ['webauthn-api', 'platform-authenticators'],
        backup: 'fallback-to-other-mfa-methods',
        rationale: 'User-friendly biometric verification'
      });
    }
    
    return implementation;
  }
  
  recommendIdentityProviders(analysis, task) {
    const { integrationComplexity, userTypes, complianceRequirements } = analysis;
    
    const recommendations = [];
    
    // Internal identity providers
    if (userTypes.some(u => u.type === 'internal-users')) {
      recommendations.push({
        provider: 'active-directory-integration',
        type: 'internal',
        protocols: ['ldap', 'saml', 'oidc'],
        rationale: 'Integrate with existing corporate directory',
        implementation: 'ldap-authentication-with-group-mapping'
      });
    }
    
    // Cloud identity providers
    if (integrationComplexity.integrations.some(i => i.type === 'cloud-identity-provider')) {
      recommendations.push({
        provider: 'cloud-identity-platform',
        type: 'cloud',
        options: ['Azure-AD', 'Okta', 'Auth0', 'AWS-Cognito'],
        protocols: ['oidc', 'saml', 'oauth2'],
        rationale: 'Managed identity platform for scalability and features',
        implementation: 'oidc-integration-with-custom-claims'
      });
    }
    
    // Social identity providers
    if (userTypes.some(u => u.type === 'external-users')) {
      recommendations.push({
        provider: 'social-identity-providers',
        type: 'social',
        options: ['Google', 'Microsoft', 'Facebook', 'LinkedIn', 'GitHub'],
        protocols: ['oauth2', 'oidc'],
        rationale: 'Reduce friction for external user registration',
        implementation: 'oauth2-social-login-with-account-linking'
      });
    }
    
    // Federated identity providers
    if (integrationComplexity.federationRequired) {
      recommendations.push({
        provider: 'federated-identity-providers',
        type: 'federated',
        protocols: ['saml', 'ws-federation', 'oidc'],
        rationale: 'Enable identity federation across organizations',
        implementation: 'saml-federation-with-attribute-mapping'
      });
    }
    
    // Compliance-specific providers
    if (complianceRequirements.required) {
      recommendations.push({
        provider: 'compliance-certified-providers',
        type: 'compliance',
        certifications: complianceRequirements.standards.map(s => s.standard),
        rationale: 'Meet specific compliance requirements',
        implementation: 'certified-provider-with-audit-logging'
      });
    }
    
    return recommendations;
  }
  
  recommendSecurityPolicies(analysis, task) {
    const { securityLevel, complianceRequirements, userTypes } = analysis;
    
    const policies = {
      passwordPolicies: this.getPasswordPolicies(securityLevel.level),
      accountPolicies: this.getAccountPolicies(securityLevel.level, userTypes),
      sessionPolicies: this.getSessionPolicies(securityLevel.level),
      auditPolicies: this.getAuditPolicies(securityLevel.level, complianceRequirements)
    };
    
    if (complianceRequirements.required) {
      policies.compliancePolicies = this.getCompliancePolicies(complianceRequirements);
    }
    
    return policies;
  }
  
  recommendUserManagement(analysis, task) {
    const { userTypes, scalingRequirements, integrationComplexity } = analysis;
    
    const userManagement = {
      approach: 'comprehensive-user-management',
      components: []
    };
    
    // User registration and onboarding
    userManagement.components.push({
      component: 'user-registration',
      features: ['email-verification', 'profile-setup', 'terms-acceptance'],
      implementation: 'self-service-registration-with-verification'
    });
    
    // Profile management
    userManagement.components.push({
      component: 'profile-management',
      features: ['profile-editing', 'password-change', 'mfa-setup'],
      implementation: 'self-service-profile-management'
    });
    
    // User provisioning for enterprise
    if (userTypes.some(u => u.type === 'internal-users')) {
      userManagement.components.push({
        component: 'user-provisioning',
        features: ['automated-provisioning', 'role-assignment', 'deprovisioning'],
        implementation: 'scim-based-provisioning',
        protocols: ['scim', 'just-in-time-provisioning']
      });
    }
    
    // Account recovery
    userManagement.components.push({
      component: 'account-recovery',
      features: ['password-reset', 'account-unlock', 'security-questions'],
      implementation: 'multi-channel-account-recovery'
    });
    
    // User administration
    if (userTypes.some(u => u.type === 'privileged-users')) {
      userManagement.components.push({
        component: 'user-administration',
        features: ['user-management-ui', 'bulk-operations', 'user-analytics'],
        implementation: 'admin-portal-with-rbac'
      });
    }
    
    return userManagement;
  }
  
  recommendAuthMonitoring(analysis, task) {
    const { securityLevel, complianceRequirements, scalingRequirements } = analysis;
    
    const monitoring = {
      approach: 'comprehensive-auth-monitoring',
      metrics: [
        'authentication-success-failure-rates',
        'login-attempt-patterns',
        'session-duration-statistics',
        'mfa-usage-rates'
      ],
      alerting: [
        'failed-login-threshold-alerts',
        'suspicious-activity-detection',
        'account-lockout-notifications',
        'unusual-access-pattern-alerts'
      ]
    };
    
    if (securityLevel.level === 'critical') {
      monitoring.metrics.push('privileged-access-tracking', 'security-policy-violations');
      monitoring.alerting.push('critical-security-events', 'policy-violation-alerts');
    }
    
    if (complianceRequirements.required) {
      monitoring.auditLogging = {
        events: ['authentication-events', 'authorization-decisions', 'privilege-changes'],
        retention: complianceRequirements.auditingNeeds.retention,
        integrity: 'tamper-evident-logging'
      };
    }
    
    if (scalingRequirements.required) {
      monitoring.performance = {
        metrics: ['authentication-response-times', 'token-validation-performance', 'session-store-performance'],
        capacity: 'concurrent-session-tracking'
      };
    }
    
    return monitoring;
  }
  
  getImplementationGuidance(analysis, task) {
    const { securityLevel, integrationComplexity, mfaRequirements } = analysis;
    
    const steps = [
      'Authentication requirements analysis and architecture design',
      'Identity provider selection and integration setup',
      'Core authentication service implementation',
      'Token/session management implementation',
      'Authorization and access control implementation',
      'Security policies and password policies implementation',
      'User management and registration flows',
      'Security testing and vulnerability assessment',
      'Monitoring and audit logging setup',
      'Documentation and security runbooks'
    ];
    
    if (mfaRequirements.required) {
      steps.splice(4, 0, 'Multi-factor authentication implementation');
    }
    
    if (integrationComplexity.level === 'advanced') {
      steps.splice(2, 0, 'Identity federation and protocol integration');
    }
    
    if (securityLevel.level === 'critical') {
      steps.splice(-2, 0, 'Security audit and penetration testing');
    }
    
    return {
      steps,
      priority: 'critical',
      resources: this.getRequiredAuthResources(analysis),
      timeline: this.calculateAuthTimeline(steps.length, securityLevel.level),
      risks: this.identifyAuthImplementationRisks(analysis)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = [
      'authentication-flow-testing',
      'authorization-testing',
      'security-policy-validation',
      'session-management-testing',
      'password-policy-testing'
    ];
    
    if (analysis.mfaRequirements.required) {
      baseChecks.push('mfa-flow-testing', 'backup-method-testing');
    }
    
    if (analysis.securityLevel.level === 'critical') {
      baseChecks.push('security-audit', 'penetration-testing', 'compliance-validation');
    }
    
    if (analysis.integrationComplexity.level !== 'simple') {
      baseChecks.push('integration-testing', 'federation-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { securityLevel, integrationComplexity, mfaRequirements, complianceRequirements } = analysis;
    
    let baseDays = 7; // Base authentication implementation
    
    if (securityLevel.level === 'critical') baseDays += 5;
    else if (securityLevel.level === 'high') baseDays += 3;
    
    if (integrationComplexity.level === 'advanced') baseDays += 6;
    else if (integrationComplexity.level === 'complex') baseDays += 4;
    else if (integrationComplexity.level === 'moderate') baseDays += 2;
    
    if (mfaRequirements.required) baseDays += 3;
    if (complianceRequirements.required) baseDays += 4;
    
    return {
      estimate: `${baseDays}-${baseDays + 4} days`,
      confidence: 0.8,
      factors: [
        `Security level: ${securityLevel.level}`,
        `Integration complexity: ${integrationComplexity.level}`,
        `MFA required: ${mfaRequirements.required}`,
        `Compliance required: ${complianceRequirements.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'enterprise-identity-governance':
        return analysis.securityLevel.level === 'critical' &&
               analysis.integrationComplexity.level === 'advanced' &&
               analysis.userTypes.some(u => u.type === 'internal-users') &&
               (task.description?.toLowerCase().includes('enterprise') ||
                task.description?.toLowerCase().includes('governance'));
      
      case 'complex-compliance-requirements':
        return analysis.complianceRequirements.required &&
               analysis.complianceRequirements.standards.length > 2;
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 8;
  }
  
  // Helper methods
  extractOAuthProviders(taskText) {
    const providers = [];
    const providerMap = {
      'google': 'Google',
      'microsoft': 'Microsoft',
      'azure': 'Azure-AD',
      'facebook': 'Facebook',
      'github': 'GitHub',
      'linkedin': 'LinkedIn',
      'okta': 'Okta',
      'auth0': 'Auth0'
    };
    
    Object.entries(providerMap).forEach(([key, value]) => {
      if (taskText.includes(key)) {
        providers.push(value);
      }
    });
    
    return providers.length > 0 ? providers : ['Google', 'Microsoft'];
  }
  
  getSecurityRequirements(level) {
    const requirements = {
      'standard': ['password-policies', 'session-security', 'input-validation'],
      'high': ['strong-password-policies', 'session-security', 'input-validation', 'audit-logging', 'mfa-recommended'],
      'critical': ['strong-password-policies', 'session-security', 'input-validation', 'comprehensive-audit-logging', 'mfa-required', 'encryption', 'regular-audits']
    };
    return requirements[level] || requirements.standard;
  }
  
  getSecurityPolicies(level) {
    const policies = {
      'standard': ['basic-password-policy', 'session-timeout'],
      'high': ['strong-password-policy', 'account-lockout-policy', 'session-security-policy'],
      'critical': ['enterprise-password-policy', 'strict-account-lockout-policy', 'comprehensive-session-policy', 'privileged-access-policy']
    };
    return policies[level] || policies.standard;
  }
  
  calculateOverallComplianceImpact(requirements) {
    if (requirements.length === 0) return 'none';
    
    const highImpactStandards = requirements.filter(r => r.impact === 'critical' || r.impact === 'high');
    if (highImpactStandards.length > 0) return 'high';
    
    return 'medium';
  }
  
  getAuditingNeeds(requirements) {
    if (requirements.length === 0) return { required: false };
    
    return {
      required: true,
      retention: '7 years', // Conservative for most compliance requirements
      events: ['authentication', 'authorization', 'privilege-changes', 'policy-changes'],
      integrity: 'tamper-evident',
      access: 'restricted-read-only'
    };
  }
  
  estimateUserCount(taskText, context) {
    if (context.expectedUsers) return context.expectedUsers;
    
    const numbers = taskText.match(/\d+/g);
    if (numbers) {
      return Math.max(...numbers.map(n => parseInt(n)));
    }
    
    if (taskText.includes('enterprise')) return 10000;
    if (taskText.includes('organization')) return 5000;
    return 1000;
  }
  
  getScalingStrategy(level) {
    const strategies = {
      'low': 'vertical-scaling',
      'moderate': 'horizontal-scaling-with-load-balancer',
      'high': 'distributed-authentication-cluster'
    };
    return strategies[level];
  }
  
  getCachingNeeds(level) {
    const needs = {
      'low': 'basic-session-caching',
      'moderate': 'distributed-session-cache',
      'high': 'multi-tier-caching-with-cdn'
    };
    return needs[level];
  }
  
  getSessionTimeout(taskText, context) {
    if (taskText.includes('long session') || taskText.includes('remember me')) return '30 days';
    if (taskText.includes('short session') || taskText.includes('secure')) return '15 minutes';
    if (context.securityLevel === 'critical') return '30 minutes';
    return '4 hours';
  }
  
  getRefreshStrategy(sessionType) {
    if (sessionType === 'stateless') return 'refresh-token-rotation';
    if (sessionType === 'stateful') return 'session-extension';
    return 'hybrid-refresh-strategy';
  }
  
  getSessionSecurityMeasures(sessionType) {
    const measures = ['secure-cookies', 'csrf-protection'];
    if (sessionType === 'stateless') {
      measures.push('token-binding', 'audience-validation');
    } else {
      measures.push('session-fixation-protection', 'concurrent-session-limits');
    }
    return measures;
  }
  
  extractMfaMethods(taskText) {
    const methods = [];
    if (taskText.includes('totp') || taskText.includes('authenticator')) methods.push('totp');
    if (taskText.includes('sms')) methods.push('sms');
    if (taskText.includes('email')) methods.push('email');
    if (taskText.includes('biometric')) methods.push('biometric');
    if (taskText.includes('hardware') || taskText.includes('yubikey')) methods.push('hardware');
    return methods;
  }
  
  getMfaEnrollmentStrategy(taskText) {
    if (taskText.includes('mandatory') || taskText.includes('required')) return 'mandatory-enrollment';
    if (taskText.includes('optional')) return 'optional-enrollment';
    return 'progressive-enrollment';
  }
  
  getMfaBackupStrategy(methods) {
    if (methods.includes('totp')) return 'recovery-codes';
    if (methods.includes('sms')) return 'voice-call-backup';
    return 'admin-override';
  }
  
  getMfaPolicies(taskText, context) {
    return {
      enrollmentPeriod: '30 days',
      backupMethodRequired: true,
      adminBypass: context.securityLevel !== 'critical',
      rememberDevice: !taskText.includes('always require')
    };
  }
  
  getPasswordPolicies(level) {
    const policies = {
      'standard': {
        minLength: 8,
        complexity: 'letters-and-numbers',
        history: 5,
        expiration: 'never'
      },
      'high': {
        minLength: 10,
        complexity: 'letters-numbers-symbols',
        history: 12,
        expiration: '180 days'
      },
      'critical': {
        minLength: 12,
        complexity: 'strong-complexity-requirements',
        history: 24,
        expiration: '90 days'
      }
    };
    return policies[level] || policies.standard;
  }
  
  getAccountPolicies(level, userTypes) {
    const policies = {
      lockoutThreshold: level === 'critical' ? 3 : 5,
      lockoutDuration: level === 'critical' ? '30 minutes' : '15 minutes',
      passwordResetLimit: '3 per hour',
      concurrentSessions: userTypes.some(u => u.type === 'privileged-users') ? 1 : 5
    };
    return policies;
  }
  
  getSessionPolicies(level) {
    const policies = {
      'standard': {
        timeout: '4 hours',
        renewalThreshold: '1 hour',
        concurrentLimit: 5
      },
      'high': {
        timeout: '2 hours',
        renewalThreshold: '30 minutes',
        concurrentLimit: 3
      },
      'critical': {
        timeout: '1 hour',
        renewalThreshold: '15 minutes',
        concurrentLimit: 1
      }
    };
    return policies[level] || policies.standard;
  }
  
  getAuditPolicies(level, complianceRequirements) {
    const policies = {
      events: ['login', 'logout', 'failed-authentication', 'privilege-changes'],
      retention: complianceRequirements.required ? '7 years' : '1 year',
      integrity: 'hash-chaining',
      access: 'read-only-with-approval'
    };
    
    if (level === 'critical') {
      policies.events.push('all-access-attempts', 'configuration-changes', 'administrative-actions');
      policies.realTimeAlerting = true;
    }
    
    return policies;
  }
  
  getCompliancePolicies(complianceRequirements) {
    const policies = {};
    
    complianceRequirements.standards.forEach(standard => {
      switch (standard.standard) {
        case 'gdpr':
          policies.gdpr = {
            consentManagement: true,
            dataPortability: true,
            rightToErasure: true,
            privacyByDesign: true
          };
          break;
        case 'hipaa':
          policies.hipaa = {
            accessControls: 'role-based',
            auditLogging: 'comprehensive',
            encryption: 'end-to-end',
            minimumNecessary: true
          };
          break;
        case 'pci-dss':
          policies.pci = {
            strongAuthentication: true,
            regularTesting: true,
            accessRestriction: 'need-to-know',
            securityPolicies: 'comprehensive'
          };
          break;
      }
    });
    
    return policies;
  }
  
  getRequiredAuthResources(analysis) {
    const resources = [
      'Authentication framework (Passport.js)',
      'Token management library (jsonwebtoken)',
      'Password hashing library (bcrypt)',
      'Session store (Redis)'
    ];
    
    if (analysis.mfaRequirements.required) {
      resources.push('MFA library (speakeasy)', 'SMS service (Twilio)');
    }
    
    if (analysis.integrationComplexity.level !== 'simple') {
      resources.push('Identity provider SDKs', 'Protocol libraries (SAML/OIDC)');
    }
    
    if (analysis.securityLevel.level === 'critical') {
      resources.push('Security testing tools', 'Certificate management tools');
    }
    
    return resources;
  }
  
  calculateAuthTimeline(stepCount, securityLevel) {
    const multiplier = securityLevel === 'critical' ? 1.5 : 
                      securityLevel === 'high' ? 1.3 : 1.0;
    
    return {
      analysis: '2 days',
      setup: '2 days',
      development: `${Math.ceil(stepCount * 0.8 * multiplier)} days`,
      testing: `${Math.ceil(3 * multiplier)} days`,
      security: `${Math.ceil(2 * multiplier)} days`
    };
  }
  
  identifyAuthImplementationRisks(analysis) {
    const risks = ['security-vulnerabilities', 'authentication-bypass'];
    
    if (analysis.integrationComplexity.level === 'advanced') {
      risks.push('integration-failures', 'identity-provider-dependencies');
    }
    
    if (analysis.mfaRequirements.required) {
      risks.push('mfa-bypass-attempts', 'recovery-method-abuse');
    }
    
    if (analysis.securityLevel.level === 'critical') {
      risks.push('privilege-escalation', 'audit-log-tampering');
    }
    
    if (analysis.complianceRequirements.required) {
      risks.push('compliance-violations', 'audit-failures');
    }
    
    return risks;
  }
}

module.exports = AuthSystemsSpecialist;