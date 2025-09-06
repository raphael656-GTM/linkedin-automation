/**
 * Result Scoring Module for LinkedIn Profile Finder
 * BMAD Story 3: Implement Comprehensive Result Scoring
 * Unified scoring system integrating all validation signals
 */

// ==================== SCORING CONFIGURATION ====================
const SCORING_CONFIG = {
  // Component weights (must total 100)
  weights: {
    nameMatch: 40,          // Name validation score weight
    companyMatch: 30,       // Company verification score weight
    titleMatch: 20,         // Title/role match score weight
    strategyConfidence: 10  // Search strategy confidence weight
  },
  
  // Acceptance thresholds
  thresholds: {
    autoAccept: 85,         // Automatically accept if >= 85
    acceptable: 70,         // Acceptable with validation if >= 70
    review: 60,             // Needs manual review if >= 60
    reject: 50              // Reject if < 50
  },
  
  // Bonus/penalty adjustments
  adjustments: {
    exactUrlMatch: 10,      // Bonus if LinkedIn URL format is perfect
    multipleMatches: -5,    // Penalty if multiple results have similar scores
    recentActivity: 5,      // Bonus if profile shows recent activity
    incompleteProfile: -10, // Penalty for profiles with minimal info
    verifiedBadge: 5        // Bonus for verified profiles
  },
  
  // Performance tracking
  performance: {
    trackMetrics: true,
    logDetailedScores: true,
    saveScoreHistory: true
  },
  
  debug: true
};

// ==================== METRICS TRACKING ====================
const METRICS = {
  searches: 0,
  successful: 0,
  failed: 0,
  avgScore: 0,
  avgTime: 0,
  scoreDistribution: {
    autoAccept: 0,
    acceptable: 0,
    review: 0,
    rejected: 0
  }
};

// ==================== TITLE MATCHING ====================
/**
 * Advanced title matching with component analysis
 */
function scoreTitleMatch(extractedTitle, targetTitle) {
  if (!targetTitle) {
    return {
      score: 100, // No title to match = assume match
      matched: true,
      details: { reason: 'No target title specified' }
    };
  }
  
  if (!extractedTitle) {
    return {
      score: 0,
      matched: false,
      details: { reason: 'No title found in result' }
    };
  }
  
  const targetNorm = normalizeTitle(targetTitle);
  const extractedNorm = normalizeTitle(extractedTitle);
  
  // Exact match
  if (targetNorm === extractedNorm) {
    return {
      score: 100,
      matched: true,
      details: { reason: 'Exact title match' }
    };
  }
  
  // Component-based matching
  const targetComponents = extractTitleKeywords(targetTitle);
  const extractedComponents = extractTitleKeywords(extractedTitle);
  
  let matchedComponents = 0;
  let totalComponents = targetComponents.length;
  const matchDetails = [];
  
  // Check each target component
  targetComponents.forEach(component => {
    if (extractedComponents.includes(component)) {
      matchedComponents++;
      matchDetails.push(component);
    }
  });
  
  // Calculate percentage match
  const matchPercentage = totalComponents > 0 
    ? (matchedComponents / totalComponents) * 100 
    : 0;
  
  // Special handling for healthcare titles
  const healthcareBonus = calculateHealthcareTitleBonus(targetTitle, extractedTitle);
  const finalScore = Math.min(100, matchPercentage + healthcareBonus);
  
  return {
    score: finalScore,
    matched: finalScore >= 50,
    details: {
      matchedComponents: matchDetails,
      totalComponents: totalComponents,
      percentage: matchPercentage,
      healthcareBonus: healthcareBonus,
      reason: `${matchPercentage.toFixed(0)}% component match`
    }
  };
}

/**
 * Extract significant keywords from title
 */
function extractTitleKeywords(title) {
  const normalized = normalizeTitle(title);
  const keywords = [];
  
  // Important role keywords
  const roleKeywords = [
    'president', 'vp', 'vice', 'director', 'manager', 'chief',
    'head', 'lead', 'senior', 'associate', 'assistant', 'coordinator',
    'specialist', 'analyst', 'supervisor', 'executive', 'officer'
  ];
  
  // Department keywords
  const deptKeywords = [
    'clinical', 'medical', 'nursing', 'it', 'information', 'technology',
    'digital', 'innovation', 'operations', 'finance', 'quality', 'revenue',
    'patient', 'experience', 'care', 'health', 'pharmacy', 'laboratory'
  ];
  
  // Extract matching keywords
  const words = normalized.toLowerCase().split(/\s+/);
  words.forEach(word => {
    if (roleKeywords.includes(word) || deptKeywords.includes(word)) {
      keywords.push(word);
    }
  });
  
  return keywords;
}

/**
 * Calculate healthcare-specific title bonus
 */
function calculateHealthcareTitleBonus(targetTitle, extractedTitle) {
  let bonus = 0;
  
  // Check for healthcare-specific patterns
  const healthcarePatterns = [
    { pattern: /chief\s+medical/i, bonus: 10 },
    { pattern: /chief\s+nursing/i, bonus: 10 },
    { pattern: /medical\s+director/i, bonus: 8 },
    { pattern: /clinical\s+director/i, bonus: 8 },
    { pattern: /patient\s+experience/i, bonus: 7 },
    { pattern: /revenue\s+cycle/i, bonus: 7 },
    { pattern: /health\s+information/i, bonus: 6 },
    { pattern: /quality\s+improvement/i, bonus: 6 }
  ];
  
  for (const {pattern, bonus: patternBonus} of healthcarePatterns) {
    if (pattern.test(targetTitle) && pattern.test(extractedTitle)) {
      bonus = Math.max(bonus, patternBonus);
    }
  }
  
  return bonus;
}

/**
 * Normalize title for comparison
 */
function normalizeTitle(title) {
  if (!title) return '';
  
  return title.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ==================== COMPREHENSIVE SCORING ====================
/**
 * Main scoring function integrating all components
 */
function calculateComprehensiveScore(searchResult, validationResults, searchContext) {
  const startTime = new Date();
  
  const scoring = {
    components: {
      name: 0,
      company: 0,
      title: 0,
      strategy: 0
    },
    adjustments: {
      applied: [],
      total: 0
    },
    weightedTotal: 0,
    finalScore: 0,
    confidence: 'none',
    recommendation: 'reject',
    details: {},
    performanceMs: 0
  };
  
  // Component 1: Name Match Score (0-100, weighted 40%)
  if (validationResults.name) {
    scoring.components.name = Math.min(100, validationResults.name.score || 0);
    scoring.details.name = validationResults.name.details || {};
  }
  
  // Component 2: Company Match Score (0-100, weighted 30%)
  if (validationResults.company) {
    scoring.components.company = Math.min(100, validationResults.company.score || 0);
    scoring.details.company = validationResults.company.details || {};
  }
  
  // Component 3: Title Match Score (0-100, weighted 20%)
  if (searchContext.targetTitle) {
    const titleResult = scoreTitleMatch(
      extractTitleFromResult(searchResult),
      searchContext.targetTitle
    );
    scoring.components.title = titleResult.score;
    scoring.details.title = titleResult.details;
  } else {
    scoring.components.title = 100; // No title to match
  }
  
  // Component 4: Search Strategy Confidence (0-100, weighted 10%)
  if (searchContext.strategy) {
    scoring.components.strategy = searchContext.strategy.confidence || 75;
    scoring.details.strategy = {
      tier: searchContext.strategy.tier,
      description: searchContext.strategy.description
    };
  }
  
  // Calculate weighted total
  const weights = SCORING_CONFIG.weights;
  scoring.weightedTotal = (
    (scoring.components.name * weights.nameMatch / 100) +
    (scoring.components.company * weights.companyMatch / 100) +
    (scoring.components.title * weights.titleMatch / 100) +
    (scoring.components.strategy * weights.strategyConfidence / 100)
  );
  
  // Apply adjustments
  scoring.adjustments = applyScoreAdjustments(searchResult, scoring.weightedTotal);
  
  // Calculate final score
  scoring.finalScore = Math.max(0, Math.min(100, 
    scoring.weightedTotal + scoring.adjustments.total
  ));
  
  // Determine confidence and recommendation
  const thresholds = SCORING_CONFIG.thresholds;
  if (scoring.finalScore >= thresholds.autoAccept) {
    scoring.confidence = 'high';
    scoring.recommendation = 'accept';
  } else if (scoring.finalScore >= thresholds.acceptable) {
    scoring.confidence = 'medium';
    scoring.recommendation = 'accept-with-validation';
  } else if (scoring.finalScore >= thresholds.review) {
    scoring.confidence = 'low';
    scoring.recommendation = 'manual-review';
  } else {
    scoring.confidence = 'none';
    scoring.recommendation = 'reject';
  }
  
  // Track performance
  scoring.performanceMs = new Date() - startTime;
  
  // Update metrics
  updateMetrics(scoring);
  
  // Log if debug mode
  if (SCORING_CONFIG.debug) {
    logDetailedScore(scoring);
  }
  
  return scoring;
}

// ==================== SCORE ADJUSTMENTS ====================
/**
 * Apply bonus/penalty adjustments to score
 */
function applyScoreAdjustments(searchResult, baseScore) {
  const adjustments = {
    applied: [],
    total: 0
  };
  
  const adj = SCORING_CONFIG.adjustments;
  
  // Check for exact LinkedIn URL format
  if (searchResult.link && /linkedin\.com\/in\/[\w-]+\/?$/.test(searchResult.link)) {
    adjustments.applied.push({ type: 'exactUrlMatch', value: adj.exactUrlMatch });
    adjustments.total += adj.exactUrlMatch;
  }
  
  // Check for verified badge indicator
  if (searchResult.snippet && /verified|✓|✔/.test(searchResult.snippet)) {
    adjustments.applied.push({ type: 'verifiedBadge', value: adj.verifiedBadge });
    adjustments.total += adj.verifiedBadge;
  }
  
  // Check for recent activity
  if (searchResult.snippet && /\d+\s*(day|week|month)s?\s+ago/i.test(searchResult.snippet)) {
    adjustments.applied.push({ type: 'recentActivity', value: adj.recentActivity });
    adjustments.total += adj.recentActivity;
  }
  
  // Check for incomplete profile
  const snippet = (searchResult.snippet || '').toLowerCase();
  if (snippet.includes('incomplete') || snippet.includes('no information')) {
    adjustments.applied.push({ type: 'incompleteProfile', value: adj.incompleteProfile });
    adjustments.total += adj.incompleteProfile;
  }
  
  return adjustments;
}

// ==================== RESULT RANKING ====================
/**
 * Rank multiple search results by comprehensive score
 */
function rankSearchResults(searchResults, person, searchStrategy) {
  const rankedResults = [];
  
  searchResults.forEach((result, index) => {
    // Validate name
    const nameValidation = validateNameStrictV2 ? 
      validateNameStrictV2(
        `${result.title} ${result.snippet}`,
        person.firstName,
        person.lastName
      ) : { score: 75, valid: true };
    
    // Validate company
    const companyValidation = verifyCompanyMatch ?
      verifyCompanyMatch(result, person.company) : 
      { score: person.company ? 50 : 100, verified: true };
    
    // Calculate comprehensive score
    const scoring = calculateComprehensiveScore(
      result,
      {
        name: nameValidation,
        company: companyValidation
      },
      {
        targetTitle: person.jobTitle,
        strategy: searchStrategy
      }
    );
    
    rankedResults.push({
      index: index,
      result: result,
      scoring: scoring,
      rank: 0
    });
  });
  
  // Sort by final score (descending)
  rankedResults.sort((a, b) => b.scoring.finalScore - a.scoring.finalScore);
  
  // Assign ranks
  rankedResults.forEach((item, index) => {
    item.rank = index + 1;
  });
  
  // Apply multiple match penalty if scores are too close
  if (rankedResults.length > 1) {
    const topScore = rankedResults[0].scoring.finalScore;
    const secondScore = rankedResults[1].scoring.finalScore;
    
    if (Math.abs(topScore - secondScore) < 5) {
      // Scores too close - apply penalty
      rankedResults[0].scoring.adjustments.applied.push({
        type: 'multipleMatches',
        value: SCORING_CONFIG.adjustments.multipleMatches
      });
      rankedResults[0].scoring.finalScore += SCORING_CONFIG.adjustments.multipleMatches;
    }
  }
  
  return rankedResults;
}

// ==================== UTILITY FUNCTIONS ====================
/**
 * Extract title from search result
 */
function extractTitleFromResult(searchResult) {
  const content = `${searchResult.title || ''} ${searchResult.snippet || ''}`;
  
  // Common patterns for title extraction
  const patterns = [
    /\-\s*([^-|]+?)(?:\s*[\-|]|$)/,  // "Name - Title - Company"
    /\|\s*([^|]+?)(?:\s*[\-|]|$)/,    // "Name | Title | Company"
    /\,\s*([^,]+?)(?:\s*at\s+)/i,     // "Name, Title at Company"
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return '';
}

// ==================== METRICS AND LOGGING ====================
/**
 * Update performance metrics
 */
function updateMetrics(scoring) {
  if (!SCORING_CONFIG.performance.trackMetrics) return;
  
  METRICS.searches++;
  
  if (scoring.recommendation === 'accept' || scoring.recommendation === 'accept-with-validation') {
    METRICS.successful++;
  } else {
    METRICS.failed++;
  }
  
  // Update average score
  METRICS.avgScore = ((METRICS.avgScore * (METRICS.searches - 1)) + scoring.finalScore) / METRICS.searches;
  
  // Update score distribution
  if (scoring.finalScore >= SCORING_CONFIG.thresholds.autoAccept) {
    METRICS.scoreDistribution.autoAccept++;
  } else if (scoring.finalScore >= SCORING_CONFIG.thresholds.acceptable) {
    METRICS.scoreDistribution.acceptable++;
  } else if (scoring.finalScore >= SCORING_CONFIG.thresholds.review) {
    METRICS.scoreDistribution.review++;
  } else {
    METRICS.scoreDistribution.rejected++;
  }
  
  // Update average time
  METRICS.avgTime = ((METRICS.avgTime * (METRICS.searches - 1)) + scoring.performanceMs) / METRICS.searches;
}

/**
 * Log detailed scoring information
 */
function logDetailedScore(scoring) {
  if (!SCORING_CONFIG.performance.logDetailedScores) return;
  
  console.log('\n' + '='.repeat(50));
  console.log('COMPREHENSIVE SCORE BREAKDOWN');
  console.log('='.repeat(50));
  
  console.log('\nComponent Scores:');
  console.log(`  Name Match:     ${scoring.components.name.toFixed(1)}/100 (weight: ${SCORING_CONFIG.weights.nameMatch}%)`);
  console.log(`  Company Match:  ${scoring.components.company.toFixed(1)}/100 (weight: ${SCORING_CONFIG.weights.companyMatch}%)`);
  console.log(`  Title Match:    ${scoring.components.title.toFixed(1)}/100 (weight: ${SCORING_CONFIG.weights.titleMatch}%)`);
  console.log(`  Strategy Conf:  ${scoring.components.strategy.toFixed(1)}/100 (weight: ${SCORING_CONFIG.weights.strategyConfidence}%)`);
  
  console.log(`\nWeighted Total: ${scoring.weightedTotal.toFixed(1)}/100`);
  
  if (scoring.adjustments.applied.length > 0) {
    console.log('\nAdjustments Applied:');
    scoring.adjustments.applied.forEach(adj => {
      console.log(`  ${adj.type}: ${adj.value > 0 ? '+' : ''}${adj.value}`);
    });
    console.log(`  Total Adjustment: ${scoring.adjustments.total > 0 ? '+' : ''}${scoring.adjustments.total}`);
  }
  
  console.log(`\nFinal Score: ${scoring.finalScore.toFixed(1)}/100`);
  console.log(`Confidence: ${scoring.confidence}`);
  console.log(`Recommendation: ${scoring.recommendation}`);
  console.log(`Processing Time: ${scoring.performanceMs}ms`);
  
  console.log('='.repeat(50));
}

/**
 * Get current metrics
 */
function getMetrics() {
  return {
    ...METRICS,
    successRate: METRICS.searches > 0 ? 
      ((METRICS.successful / METRICS.searches) * 100).toFixed(1) + '%' : 'N/A'
  };
}

// ==================== TEST FUNCTIONS ====================
/**
 * Test the scoring module
 */
function testScoringModule() {
  console.log('Testing Comprehensive Scoring Module...\n');
  
  const testCases = [
    {
      description: 'Perfect match scenario',
      searchResult: {
        title: 'John Smith - VP Clinical Operations at Mount Sinai',
        snippet: 'Leading healthcare operations...',
        link: 'https://linkedin.com/in/john-smith'
      },
      validationResults: {
        name: { score: 100, valid: true },
        company: { score: 100, verified: true }
      },
      searchContext: {
        targetTitle: 'VP Clinical Operations',
        strategy: { confidence: 95, tier: 1 }
      },
      expectedRange: [90, 100]
    },
    {
      description: 'Partial match scenario',
      searchResult: {
        title: 'Jane Doe | Director at Temple Health',
        snippet: 'Healthcare professional...',
        link: 'https://linkedin.com/in/jane-doe-123'
      },
      validationResults: {
        name: { score: 95, valid: true },
        company: { score: 70, verified: true }
      },
      searchContext: {
        targetTitle: 'Director of Operations',
        strategy: { confidence: 80, tier: 2 }
      },
      expectedRange: [70, 85]
    },
    {
      description: 'Poor match scenario',
      searchResult: {
        title: 'Different Person - Unrelated Role',
        snippet: 'No relevant information',
        link: 'https://example.com/profile'
      },
      validationResults: {
        name: { score: 30, valid: false },
        company: { score: 20, verified: false }
      },
      searchContext: {
        targetTitle: 'CEO',
        strategy: { confidence: 60, tier: 3 }
      },
      expectedRange: [0, 50]
    }
  ];
  
  testCases.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.description}`);
    
    const scoring = calculateComprehensiveScore(
      test.searchResult,
      test.validationResults,
      test.searchContext
    );
    
    const inRange = scoring.finalScore >= test.expectedRange[0] && 
                   scoring.finalScore <= test.expectedRange[1];
    
    console.log(`  Final Score: ${scoring.finalScore.toFixed(1)}`);
    console.log(`  Expected Range: ${test.expectedRange[0]}-${test.expectedRange[1]}`);
    console.log(`  Recommendation: ${scoring.recommendation}`);
    console.log(`  Result: ${inRange ? '✓ PASS' : '✗ FAIL'}\n`);
  });
  
  console.log('\nMetrics Summary:');
  const metrics = getMetrics();
  console.log(`  Total Searches: ${metrics.searches}`);
  console.log(`  Success Rate: ${metrics.successRate}`);
  console.log(`  Average Score: ${metrics.avgScore.toFixed(1)}`);
  console.log(`  Average Time: ${metrics.avgTime.toFixed(1)}ms`);
}

// ==================== EXPORT FOR USE IN MAIN SCRIPT ====================
/**
 * Export the scoring functions
 */
function getScoringModule() {
  return {
    calculateScore: calculateComprehensiveScore,
    rankResults: rankSearchResults,
    scoreTitle: scoreTitleMatch,
    getMetrics: getMetrics,
    config: SCORING_CONFIG
  };
}