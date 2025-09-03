const BaseSpecialist = require('../BaseSpecialist');

/**
 * Frontend Generalist - Tier 1 Specialist
 * Domain: UI/UX, responsive design, accessibility
 */
class FrontendGeneralist extends BaseSpecialist {
  constructor() {
    super({
      id: 'frontend-generalist',
      name: 'Frontend Generalist',
      domain: 'frontend',
      tier: 'TIER_1',
      expertise: [
        'component architecture',
        'state management',
        'responsive design',
        'basic accessibility',
        'ui/ux patterns',
        'css frameworks',
        'javascript frameworks',
        'performance optimization'
      ],
      handoffCriteria: [
        {
          condition: 'complex-frontend-architecture',
          reason: 'Complex frontend architectures require specialized expertise',
          targetTier: 'TIER_2',
          targetSpecialist: 'frontend-architecture-specialist'
        },
        {
          condition: 'advanced-ux-patterns',
          reason: 'Advanced UX patterns and design systems require UX architecture',
          targetTier: 'TIER_3',
          targetSpecialist: 'ux-architect'
        }
      ]
    });
  }
  
  async analyze(task, context) {
    const baseAnalysis = await super.analyze(task, context);
    
    return {
      ...baseAnalysis,
      uiComplexity: this.assessUiComplexity(task),
      componentStructure: this.analyzeComponentStructure(task),
      stateManagement: this.analyzeStateManagement(task),
      responsiveRequirements: this.analyzeResponsiveRequirements(task),
      accessibilityNeeds: this.analyzeAccessibilityNeeds(task),
      performanceRequirements: this.analyzePerformanceRequirements(task),
      interactionPatterns: this.analyzeInteractionPatterns(task)
    };
  }
  
  async generateRecommendations(analysis, task, context) {
    const recommendations = {
      architectureApproach: this.recommendArchitectureApproach(analysis, task),
      componentStrategy: this.recommendComponentStrategy(analysis, task),
      stateManagementApproach: this.recommendStateManagement(analysis, task),
      responsiveStrategy: this.recommendResponsiveStrategy(analysis, task),
      accessibilityImplementation: this.recommendAccessibilityImplementation(analysis, task),
      performanceOptimization: this.recommendPerformanceOptimization(analysis, task),
      implementation: this.getImplementationGuidance(analysis, task),
      qualityChecks: this.getQualityChecks(analysis, task),
      timeline: this.estimateTimeline(analysis, task)
    };
    
    return recommendations;
  }
  
  assessUiComplexity(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const complexityFactors = {
      simple: ['button', 'form', 'basic ui', 'simple page'],
      moderate: ['dashboard', 'table', 'modal', 'navigation', 'multiple components'],
      complex: ['interactive', 'drag and drop', 'real-time', 'animations', 'data visualization'],
      advanced: ['complex dashboard', 'advanced animations', 'custom controls', 'rich editor']
    };
    
    let complexity = 'simple';
    let score = 1;
    
    Object.entries(complexityFactors).forEach(([level, factors]) => {
      if (factors.some(factor => taskText.includes(factor))) {
        complexity = level;
        score = level === 'advanced' ? 8 : level === 'complex' ? 6 : level === 'moderate' ? 4 : 2;
      }
    });
    
    return {
      level: complexity,
      score,
      factors: this.getComplexityFactors(taskText),
      patterns: this.identifyUiPatterns(taskText)
    };
  }
  
  analyzeComponentStructure(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const componentTypes = {
      'presentational': ['display', 'show', 'render', 'view', 'static'],
      'container': ['container', 'wrapper', 'smart component', 'connected'],
      'form': ['form', 'input', 'validation', 'submit'],
      'layout': ['layout', 'grid', 'flex', 'responsive', 'structure'],
      'navigation': ['menu', 'nav', 'navigation', 'routing', 'breadcrumb'],
      'data': ['table', 'list', 'grid', 'data display', 'chart']
    };
    
    const detectedTypes = [];
    Object.entries(componentTypes).forEach(([type, keywords]) => {
      const relevance = keywords.filter(keyword => taskText.includes(keyword)).length;
      if (relevance > 0) {
        detectedTypes.push({
          type,
          relevance,
          complexity: this.getComponentComplexity(type),
          patterns: this.getComponentPatterns(type)
        });
      }
    });
    
    return {
      types: detectedTypes.sort((a, b) => b.relevance - a.relevance),
      hierarchy: this.determineComponentHierarchy(detectedTypes),
      reusability: this.assessReusabilityNeeds(taskText)
    };
  }
  
  analyzeStateManagement(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const stateIndicators = {
      local: ['component state', 'local state', 'internal state'],
      global: ['global state', 'app state', 'shared state', 'redux', 'context'],
      server: ['server state', 'api data', 'remote data', 'cache'],
      url: ['routing', 'url state', 'query params', 'navigation']
    };
    
    const detectedStates = [];
    Object.entries(stateIndicators).forEach(([type, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        detectedStates.push({
          type,
          complexity: this.getStateComplexity(type),
          management: this.getStateManagement(type)
        });
      }
    });
    
    return {
      types: detectedStates,
      complexity: this.calculateOverallStateComplexity(detectedStates),
      synchronization: this.assessSynchronizationNeeds(taskText)
    };
  }
  
  analyzeResponsiveRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const responsiveKeywords = [
      'responsive', 'mobile', 'tablet', 'desktop', 'breakpoint',
      'adaptive', 'screen size', 'device', 'viewport'
    ];
    
    const needsResponsive = responsiveKeywords.some(keyword => 
      taskText.includes(keyword)
    );
    
    if (!needsResponsive) {
      return { required: false };
    }
    
    return {
      required: true,
      breakpoints: this.identifyBreakpoints(taskText),
      approach: this.determineResponsiveApproach(taskText),
      priorities: this.getResponsivePriorities(taskText)
    };
  }
  
  analyzeAccessibilityNeeds(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const a11yKeywords = [
      'accessibility', 'a11y', 'wcag', 'screen reader', 'keyboard',
      'aria', 'focus', 'contrast', 'alt text', 'semantic'
    ];
    
    const needsA11y = a11yKeywords.some(keyword => taskText.includes(keyword)) ||
                      taskText.includes('accessible');
    
    if (!needsA11y) {
      return { 
        required: false,
        basicRequirements: ['semantic-html', 'keyboard-navigation']
      };
    }
    
    return {
      required: true,
      level: this.determineA11yLevel(taskText),
      requirements: this.getA11yRequirements(taskText),
      testing: this.getA11yTesting(taskText)
    };
  }
  
  analyzePerformanceRequirements(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const performanceKeywords = [
      'performance', 'fast', 'speed', 'optimize', 'lazy load',
      'bundle size', 'load time', 'responsive time'
    ];
    
    const needsPerformance = performanceKeywords.some(keyword => 
      taskText.includes(keyword)
    );
    
    if (!needsPerformance) {
      return { required: false };
    }
    
    return {
      required: true,
      priorities: this.getPerformancePriorities(taskText),
      metrics: this.getPerformanceMetrics(taskText),
      optimizations: this.getPerformanceOptimizations(taskText)
    };
  }
  
  analyzeInteractionPatterns(task) {
    const taskText = task.description?.toLowerCase() || '';
    
    const interactionPatterns = {
      'click': ['click', 'button', 'link', 'select'],
      'hover': ['hover', 'tooltip', 'preview', 'mouseover'],
      'drag-drop': ['drag', 'drop', 'sortable', 'reorder'],
      'scroll': ['scroll', 'infinite scroll', 'pagination'],
      'keyboard': ['keyboard', 'shortcut', 'hotkey', 'tab'],
      'touch': ['touch', 'swipe', 'pinch', 'mobile gesture']
    };
    
    const detectedPatterns = [];
    Object.entries(interactionPatterns).forEach(([pattern, keywords]) => {
      if (keywords.some(keyword => taskText.includes(keyword))) {
        detectedPatterns.push({
          pattern,
          complexity: this.getInteractionComplexity(pattern),
          implementation: this.getInteractionImplementation(pattern)
        });
      }
    });
    
    return detectedPatterns.sort((a, b) => b.complexity - a.complexity);
  }
  
  recommendArchitectureApproach(analysis, task) {
    const { uiComplexity, componentStructure } = analysis;
    
    if (uiComplexity.level === 'advanced' || 
        componentStructure.types.length > 4) {
      return {
        approach: 'modular-architecture',
        rationale: 'Complex UI requires modular, maintainable architecture',
        structure: ['feature-modules', 'shared-components', 'design-system'],
        patterns: ['atomic-design', 'component-composition', 'render-props']
      };
    }
    
    if (uiComplexity.level === 'complex' || 
        componentStructure.reusability === 'high') {
      return {
        approach: 'component-library',
        rationale: 'Reusable components benefit from library approach',
        structure: ['component-library', 'storybook', 'documentation'],
        patterns: ['compound-components', 'render-props', 'hooks']
      };
    }
    
    return {
      approach: 'simple-structure',
      rationale: 'Straightforward requirements allow simple organization',
      structure: ['components', 'pages', 'utils'],
      patterns: ['functional-components', 'props-drilling', 'local-state']
    };
  }
  
  recommendComponentStrategy(analysis, task) {
    const { componentStructure, stateManagement } = analysis;
    
    const strategy = {
      organization: this.getComponentOrganization(componentStructure),
      naming: this.getComponentNaming(),
      composition: this.getComponentComposition(componentStructure),
      lifecycle: this.getComponentLifecycle(stateManagement)
    };
    
    return strategy;
  }
  
  recommendStateManagement(analysis, task) {
    const { stateManagement, uiComplexity } = analysis;
    
    if (stateManagement.complexity === 'high' || 
        stateManagement.types.some(t => t.type === 'global')) {
      return {
        approach: 'centralized-state',
        solution: 'redux-toolkit',
        rationale: 'Complex state requires centralized management',
        patterns: ['actions', 'reducers', 'selectors', 'middleware']
      };
    }
    
    if (stateManagement.types.some(t => t.type === 'server')) {
      return {
        approach: 'server-state-management',
        solution: 'react-query',
        rationale: 'Server state benefits from specialized library',
        patterns: ['queries', 'mutations', 'caching', 'synchronization']
      };
    }
    
    return {
      approach: 'local-state',
      solution: 'react-hooks',
      rationale: 'Simple state can be managed locally',
      patterns: ['useState', 'useReducer', 'useContext', 'custom-hooks']
    };
  }
  
  recommendResponsiveStrategy(analysis, task) {
    const { responsiveRequirements } = analysis;
    
    if (!responsiveRequirements.required) {
      return {
        approach: 'desktop-first',
        rationale: 'No specific responsive requirements'
      };
    }
    
    return {
      approach: responsiveRequirements.approach,
      breakpoints: responsiveRequirements.breakpoints,
      implementation: this.getResponsiveImplementation(responsiveRequirements.approach),
      testing: this.getResponsiveTesting()
    };
  }
  
  recommendAccessibilityImplementation(analysis, task) {
    const { accessibilityNeeds } = analysis;
    
    if (!accessibilityNeeds.required) {
      return {
        approach: 'basic-accessibility',
        implementation: accessibilityNeeds.basicRequirements,
        rationale: 'Basic accessibility for good practices'
      };
    }
    
    return {
      approach: 'comprehensive-accessibility',
      level: accessibilityNeeds.level,
      implementation: accessibilityNeeds.requirements,
      testing: accessibilityNeeds.testing,
      tools: this.getA11yTools()
    };
  }
  
  recommendPerformanceOptimization(analysis, task) {
    const { performanceRequirements, uiComplexity } = analysis;
    
    if (!performanceRequirements.required) {
      return {
        approach: 'standard-performance',
        optimizations: ['code-splitting', 'lazy-loading']
      };
    }
    
    return {
      approach: 'performance-focused',
      priorities: performanceRequirements.priorities,
      optimizations: performanceRequirements.optimizations,
      metrics: performanceRequirements.metrics,
      monitoring: this.getPerformanceMonitoring()
    };
  }
  
  getImplementationGuidance(analysis, task) {
    const { uiComplexity, componentStructure, stateManagement } = analysis;
    
    const steps = [
      'UI/UX requirements analysis',
      'Component architecture design',
      'State management setup',
      'Component implementation',
      'Styling and responsive design',
      'Accessibility implementation',
      'Testing and validation',
      'Performance optimization'
    ];
    
    if (stateManagement.complexity === 'high') {
      steps.splice(3, 0, 'Advanced state management setup');
    }
    
    if (analysis.responsiveRequirements.required) {
      steps.splice(5, 0, 'Responsive design implementation');
    }
    
    return {
      steps,
      priority: 'high',
      resources: this.getRequiredFrontendResources(analysis),
      timeline: this.calculateFrontendTimeline(steps.length)
    };
  }
  
  getQualityChecks(analysis, task) {
    const baseChecks = ['component-testing', 'visual-regression-testing'];
    
    if (analysis.accessibilityNeeds.required) {
      baseChecks.push('accessibility-testing');
    }
    
    if (analysis.responsiveRequirements.required) {
      baseChecks.push('responsive-testing');
    }
    
    if (analysis.performanceRequirements.required) {
      baseChecks.push('performance-testing');
    }
    
    return baseChecks;
  }
  
  estimateTimeline(analysis, task) {
    const { uiComplexity, componentStructure, stateManagement } = analysis;
    
    let baseDays = uiComplexity.level === 'advanced' ? 6 :
                   uiComplexity.level === 'complex' ? 4 :
                   uiComplexity.level === 'moderate' ? 2 : 1;
    
    if (componentStructure.types.length > 3) baseDays += 1;
    if (stateManagement.complexity === 'high') baseDays += 2;
    if (analysis.responsiveRequirements.required) baseDays += 1;
    if (analysis.accessibilityNeeds.required) baseDays += 1;
    
    return {
      estimate: `${baseDays}-${baseDays + 2} days`,
      confidence: 0.8,
      factors: [
        `UI complexity: ${uiComplexity.level}`,
        `Component types: ${componentStructure.types.length}`,
        `State complexity: ${stateManagement.complexity}`,
        `Responsive required: ${analysis.responsiveRequirements.required}`,
        `A11y required: ${analysis.accessibilityNeeds.required}`
      ]
    };
  }
  
  evaluateHandoffCriterion(criterion, analysis, task) {
    switch (criterion.condition) {
      case 'complex-frontend-architecture':
        return analysis.uiComplexity.score > 6 ||
               analysis.componentStructure.types.length > 5;
      
      case 'advanced-ux-patterns':
        return analysis.interactionPatterns.some(p => p.complexity > 7) ||
               analysis.uiComplexity.level === 'advanced';
      
      default:
        return false;
    }
  }
  
  getMaxComplexityHandled() {
    return 6;
  }
  
  // Helper methods
  getComplexityFactors(taskText) {
    const factors = [];
    if (taskText.includes('animation')) factors.push('animations');
    if (taskText.includes('interactive')) factors.push('interactivity');
    if (taskText.includes('real-time')) factors.push('real-time-updates');
    if (taskText.includes('visualization')) factors.push('data-visualization');
    return factors;
  }
  
  identifyUiPatterns(taskText) {
    const patterns = [];
    if (taskText.includes('dashboard')) patterns.push('dashboard');
    if (taskText.includes('table')) patterns.push('data-table');
    if (taskText.includes('form')) patterns.push('form');
    if (taskText.includes('modal')) patterns.push('modal');
    if (taskText.includes('navigation')) patterns.push('navigation');
    return patterns;
  }
  
  getComponentComplexity(type) {
    const complexities = {
      'presentational': 2,
      'container': 4,
      'form': 5,
      'layout': 3,
      'navigation': 6,
      'data': 7
    };
    return complexities[type] || 3;
  }
  
  getComponentPatterns(type) {
    const patterns = {
      'presentational': ['pure-component', 'stateless'],
      'container': ['smart-component', 'connected'],
      'form': ['controlled-components', 'validation'],
      'layout': ['flexbox', 'grid', 'responsive'],
      'navigation': ['routing', 'active-states'],
      'data': ['virtualization', 'pagination', 'sorting']
    };
    return patterns[type] || [];
  }
  
  determineComponentHierarchy(detectedTypes) {
    if (detectedTypes.length > 3) return 'deep';
    if (detectedTypes.length > 1) return 'moderate';
    return 'flat';
  }
  
  assessReusabilityNeeds(taskText) {
    const reusabilityKeywords = ['reusable', 'component library', 'shared', 'common'];
    if (reusabilityKeywords.some(keyword => taskText.includes(keyword))) {
      return 'high';
    }
    return 'medium';
  }
  
  getStateComplexity(type) {
    const complexities = {
      local: 2,
      global: 6,
      server: 7,
      url: 4
    };
    return complexities[type] || 3;
  }
  
  getStateManagement(type) {
    const management = {
      local: 'useState-useReducer',
      global: 'redux-context',
      server: 'react-query-swr',
      url: 'react-router'
    };
    return management[type] || 'useState';
  }
  
  calculateOverallStateComplexity(detectedStates) {
    if (detectedStates.length === 0) return 'low';
    const maxComplexity = Math.max(...detectedStates.map(s => s.complexity));
    return maxComplexity > 5 ? 'high' : maxComplexity > 3 ? 'medium' : 'low';
  }
  
  assessSynchronizationNeeds(taskText) {
    const syncKeywords = ['sync', 'real-time', 'live', 'update'];
    return syncKeywords.some(keyword => taskText.includes(keyword));
  }
  
  identifyBreakpoints(taskText) {
    return ['mobile', 'tablet', 'desktop']; // Default breakpoints
  }
  
  determineResponsiveApproach(taskText) {
    if (taskText.includes('mobile first')) return 'mobile-first';
    if (taskText.includes('desktop first')) return 'desktop-first';
    return 'mobile-first'; // Default
  }
  
  getResponsivePriorities(taskText) {
    const priorities = [];
    if (taskText.includes('mobile')) priorities.push('mobile-optimization');
    if (taskText.includes('tablet')) priorities.push('tablet-layout');
    if (taskText.includes('desktop')) priorities.push('desktop-features');
    return priorities.length > 0 ? priorities : ['mobile-optimization'];
  }
  
  determineA11yLevel(taskText) {
    if (taskText.includes('wcag aa') || taskText.includes('full accessibility')) {
      return 'WCAG-AA';
    }
    return 'basic-accessibility';
  }
  
  getA11yRequirements(taskText) {
    return [
      'semantic-html',
      'aria-labels',
      'keyboard-navigation',
      'focus-management',
      'color-contrast',
      'screen-reader-support'
    ];
  }
  
  getA11yTesting(taskText) {
    return ['axe-testing', 'keyboard-testing', 'screen-reader-testing'];
  }
  
  getA11yTools() {
    return ['axe-core', 'eslint-plugin-jsx-a11y', 'react-axe'];
  }
  
  getPerformancePriorities(taskText) {
    const priorities = [];
    if (taskText.includes('load time')) priorities.push('initial-load');
    if (taskText.includes('bundle size')) priorities.push('bundle-optimization');
    if (taskText.includes('runtime')) priorities.push('runtime-performance');
    return priorities.length > 0 ? priorities : ['initial-load'];
  }
  
  getPerformanceMetrics(taskText) {
    return [
      'first-contentful-paint',
      'largest-contentful-paint',
      'cumulative-layout-shift',
      'time-to-interactive'
    ];
  }
  
  getPerformanceOptimizations(taskText) {
    return [
      'code-splitting',
      'lazy-loading',
      'image-optimization',
      'caching-strategies',
      'bundle-optimization'
    ];
  }
  
  getPerformanceMonitoring() {
    return {
      tools: ['Lighthouse', 'Web Vitals', 'Webpack Bundle Analyzer'],
      metrics: ['load-times', 'bundle-sizes', 'runtime-performance']
    };
  }
  
  getInteractionComplexity(pattern) {
    const complexities = {
      'click': 2,
      'hover': 3,
      'drag-drop': 8,
      'scroll': 4,
      'keyboard': 6,
      'touch': 7
    };
    return complexities[pattern] || 3;
  }
  
  getInteractionImplementation(pattern) {
    const implementations = {
      'click': 'onClick-handlers',
      'hover': 'onMouseEnter-onMouseLeave',
      'drag-drop': 'react-dnd-library',
      'scroll': 'onScroll-intersection-observer',
      'keyboard': 'onKeyDown-handlers',
      'touch': 'touch-event-handlers'
    };
    return implementations[pattern] || 'event-handlers';
  }
  
  getComponentOrganization(structure) {
    if (structure.hierarchy === 'deep') {
      return 'feature-based-organization';
    }
    return 'type-based-organization';
  }
  
  getComponentNaming() {
    return {
      convention: 'PascalCase',
      patterns: ['ComponentName', 'FeatureComponent', 'ComponentContainer']
    };
  }
  
  getComponentComposition(structure) {
    if (structure.reusability === 'high') {
      return 'compound-components';
    }
    return 'simple-composition';
  }
  
  getComponentLifecycle(stateManagement) {
    if (stateManagement.complexity === 'high') {
      return 'useEffect-cleanup-patterns';
    }
    return 'simple-lifecycle';
  }
  
  getResponsiveImplementation(approach) {
    return {
      technique: 'css-grid-flexbox',
      breakpoints: 'css-media-queries',
      approach: approach
    };
  }
  
  getResponsiveTesting() {
    return ['device-testing', 'viewport-testing', 'responsive-screenshots'];
  }
  
  getRequiredFrontendResources(analysis) {
    const resources = ['Design system', 'Component testing tools'];
    if (analysis.responsiveRequirements.required) {
      resources.push('Device testing setup');
    }
    if (analysis.accessibilityNeeds.required) {
      resources.push('Accessibility testing tools');
    }
    return resources;
  }
  
  calculateFrontendTimeline(stepCount) {
    return {
      planning: '1 day',
      design: '1 day',
      implementation: `${Math.ceil(stepCount * 0.6)} days`,
      testing: '2 days',
      optimization: '1 day'
    };
  }
}

module.exports = FrontendGeneralist;