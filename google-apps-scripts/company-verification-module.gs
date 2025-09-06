/**
 * Company Verification Module for LinkedIn Profile Finder
 * BMAD Story 2: Add Company Match Verification
 * Prevents wrong-company matches with comprehensive alias handling
 */

// ==================== COMPANY VERIFICATION CONFIGURATION ====================
const COMPANY_CONFIG = {
  // Scoring thresholds
  scoring: {
    exactMatch: 100,           // Perfect match
    allKeywordsMatch: 85,      // All important keywords present
    primaryKeywordMatch: 70,   // Main keyword matches
    industryPartialMatch: 60,  // Same industry + partial match
    partialMatch: 50,          // Some words match
    noMatch: 0                 // No match found
  },
  
  // Minimum scores for acceptance
  thresholds: {
    autoAccept: 80,           // Accept without question
    acceptable: 60,           // Acceptable with validation
    review: 40,               // Needs manual review  
    reject: 30                // Reject outright
  },
  
  // Matching rules
  rules: {
    requireIndustryMatch: true,     // Must be in same industry
    useAliasDatabase: true,         // Use comprehensive alias DB
    fuzzyMatchingEnabled: true,     // Allow fuzzy matching
    minWordMatchPercentage: 60,     // Min % of words that must match
    ignoreCommonWords: true         // Ignore words like "Inc", "LLC", etc.
  },
  
  debug: true
};

// ==================== COMPREHENSIVE HEALTHCARE SYSTEMS DATABASE ====================
const HEALTHCARE_SYSTEMS_DB = {
  'Mount Sinai': {
    aliases: [
      'Mount Sinai Health System',
      'Mount Sinai Hospital',
      'Mount Sinai Medical Center',
      'Mt. Sinai',
      'Mt Sinai',
      'MSH',
      'Mount Sinai Beth Israel',
      'Mount Sinai Brooklyn',
      'Mount Sinai Queens',
      'Mount Sinai West',
      'Mount Sinai Morningside',
      'Icahn School of Medicine at Mount Sinai'
    ],
    keywords: ['Mount', 'Sinai', 'MSH'],
    primaryKeyword: 'Sinai',
    locations: ['New York', 'NY', 'NYC'],
    type: 'health-system'
  },
  
  'Tufts Medicine': {
    aliases: [
      'Tufts Medical Center',
      'Tufts MC',
      'TMC',
      'Tufts',
      'Tufts University School of Medicine',
      'Tufts Children\'s Hospital',
      'Tufts Medical',
      'Tufts Healthcare'
    ],
    keywords: ['Tufts', 'TMC'],
    primaryKeyword: 'Tufts',
    locations: ['Boston', 'MA', 'Massachusetts'],
    type: 'academic-medical'
  },
  
  'Temple': {
    aliases: [
      'Temple University Hospital',
      'Temple Health',
      'Temple University Health System',
      'TUH',
      'Temple University',
      'Lewis Katz School of Medicine',
      'Temple Physicians',
      'Fox Chase Cancer Center'
    ],
    keywords: ['Temple', 'TUH'],
    primaryKeyword: 'Temple',
    locations: ['Philadelphia', 'PA', 'Pennsylvania'],
    type: 'academic-medical'
  },
  
  'Jefferson': {
    aliases: [
      'Jefferson Health',
      'Thomas Jefferson University',
      'Thomas Jefferson University Hospital',
      'TJUH',
      'Jefferson Medical',
      'Sidney Kimmel Medical College',
      'Jefferson Hospital',
      'Einstein Healthcare Network', // Merged with Jefferson
      'Abington Jefferson Health',
      'Jefferson Medical Group'
    ],
    keywords: ['Jefferson', 'TJUH', 'Kimmel'],
    primaryKeyword: 'Jefferson',
    locations: ['Philadelphia', 'PA', 'Pennsylvania', 'New Jersey', 'NJ'],
    type: 'academic-medical'
  },
  
  'Mass General Brigham': {
    aliases: [
      'Massachusetts General Hospital',
      'MGH',
      'Brigham and Women\'s Hospital',
      'BWH',
      'Partners HealthCare', // Former name
      'Partners',
      'MGB',
      'Mass General',
      'Brigham Health',
      'McLean Hospital',
      'Spaulding Rehabilitation'
    ],
    keywords: ['Mass', 'General', 'Brigham', 'MGB', 'MGH', 'Partners'],
    primaryKeyword: 'MGB',
    locations: ['Boston', 'MA', 'Massachusetts'],
    type: 'health-system'
  },
  
  'NewYork-Presbyterian': {
    aliases: [
      'NYP',
      'NY Presbyterian',
      'New York Presbyterian',
      'NewYork Presbyterian',
      'NYP/Weill Cornell',
      'NYP/Columbia',
      'Presbyterian Hospital',
      'Columbia University Medical Center',
      'Weill Cornell Medicine'
    ],
    keywords: ['Presbyterian', 'NYP', 'Cornell', 'Columbia'],
    primaryKeyword: 'Presbyterian',
    locations: ['New York', 'NY', 'NYC', 'Manhattan'],
    type: 'academic-medical'
  },
  
  'BILH': {
    aliases: [
      'Beth Israel Lahey Health',
      'Beth Israel Deaconess Medical Center',
      'BIDMC',
      'Lahey Hospital',
      'Lahey Clinic',
      'Beth Israel',
      'BI',
      'Mount Auburn Hospital',
      'New England Baptist Hospital'
    ],
    keywords: ['BILH', 'Beth', 'Israel', 'Lahey', 'BIDMC'],
    primaryKeyword: 'BILH',
    locations: ['Boston', 'MA', 'Massachusetts'],
    type: 'health-system'
  },
  
  'Penn State Health': {
    aliases: [
      'Penn State',
      'Penn State Medical Center',
      'Penn State Hershey Medical Center',
      'Penn State Milton S. Hershey Medical Center',
      'Penn State College of Medicine',
      'PSH',
      'Hershey Medical'
    ],
    keywords: ['Penn', 'State', 'Hershey', 'PSH'],
    primaryKeyword: 'Penn State',
    locations: ['Hershey', 'PA', 'Pennsylvania'],
    type: 'academic-medical'
  },
  
  'Tower Health': {
    aliases: [
      'Tower',
      'Reading Hospital',
      'Reading Health System',
      'Tower Health Medical Group',
      'St. Christopher\'s Hospital'
    ],
    keywords: ['Tower', 'Reading'],
    primaryKeyword: 'Tower',
    locations: ['Reading', 'PA', 'Pennsylvania'],
    type: 'health-system'
  },
  
  'UVM': {
    aliases: [
      'University of Vermont Medical Center',
      'UVM Medical Center',
      'UVMMC',
      'UVM Health Network',
      'University of Vermont Health Network',
      'Vermont Medical',
      'Fletcher Allen', // Former name
      'FAHC'
    ],
    keywords: ['UVM', 'Vermont', 'UVMMC'],
    primaryKeyword: 'UVM',
    locations: ['Burlington', 'VT', 'Vermont'],
    type: 'academic-medical'
  }
};

// ==================== COMMON WORDS TO IGNORE ====================
const IGNORE_WORDS = new Set([
  'inc', 'incorporated', 'llc', 'ltd', 'limited', 'corp', 'corporation',
  'company', 'co', 'group', 'health', 'healthcare', 'medical', 'center',
  'hospital', 'system', 'network', 'associates', 'partners', 'services',
  'solutions', 'the', 'at', 'of', 'and', '&'
]);

// ==================== COMPANY NAME PREPROCESSING ====================
/**
 * Normalize company name for matching
 */
function normalizeCompanyName(company) {
  if (!company) return '';
  
  let normalized = company.toLowerCase()
    .replace(/[.,;:'"]/g, '')           // Remove punctuation
    .replace(/\s+/g, ' ')                // Normalize spaces
    .replace(/&/g, 'and')                // Replace & with and
    .replace(/\bhealthcare\b/g, 'health care')  // Normalize healthcare
    .replace(/\bmed\b/g, 'medical')     // Expand med to medical
    .replace(/\buniv\b/g, 'university')  // Expand univ
    .replace(/\bhosp\b/g, 'hospital')    // Expand hosp
    .trim();
  
  return normalized;
}

/**
 * Extract significant words from company name
 */
function extractSignificantWords(company) {
  const normalized = normalizeCompanyName(company);
  const words = normalized.split(' ');
  
  // Filter out common words if configured
  if (COMPANY_CONFIG.rules.ignoreCommonWords) {
    return words.filter(word => 
      word.length > 2 && !IGNORE_WORDS.has(word.toLowerCase())
    );
  }
  
  return words.filter(word => word.length > 2);
}

// ==================== COMPANY MATCHING ALGORITHM ====================
/**
 * Score company match using multiple strategies
 */
function scoreCompanyMatch(contentCompany, targetCompany, context = {}) {
  const scoring = {
    score: 0,
    method: 'none',
    matched: false,
    details: {},
    confidence: 'none'
  };
  
  if (!targetCompany) {
    scoring.details.reason = 'No target company provided';
    return scoring;
  }
  
  const contentNorm = normalizeCompanyName(contentCompany);
  const targetNorm = normalizeCompanyName(targetCompany);
  
  // Strategy 1: Exact match
  if (contentNorm === targetNorm) {
    scoring.score = COMPANY_CONFIG.scoring.exactMatch;
    scoring.method = 'exact';
    scoring.matched = true;
    scoring.confidence = 'high';
    scoring.details.reason = 'Exact company name match';
    return scoring;
  }
  
  // Strategy 2: Check healthcare systems database
  if (COMPANY_CONFIG.rules.useAliasDatabase) {
    const dbMatch = matchAgainstDatabase(contentCompany, targetCompany);
    if (dbMatch.matched) {
      scoring.score = dbMatch.score;
      scoring.method = 'database';
      scoring.matched = true;
      scoring.confidence = dbMatch.confidence;
      scoring.details = dbMatch.details;
      return scoring;
    }
  }
  
  // Strategy 3: Word-based matching
  const targetWords = extractSignificantWords(targetCompany);
  const contentWords = extractSignificantWords(contentCompany);
  
  if (targetWords.length > 0) {
    const matchedWords = targetWords.filter(word => 
      contentWords.some(cWord => cWord.includes(word) || word.includes(cWord))
    );
    
    const matchPercentage = (matchedWords.length / targetWords.length) * 100;
    
    if (matchPercentage >= COMPANY_CONFIG.rules.minWordMatchPercentage) {
      scoring.score = Math.min(
        COMPANY_CONFIG.scoring.partialMatch + (matchPercentage - 60),
        COMPANY_CONFIG.scoring.primaryKeywordMatch
      );
      scoring.method = 'word-match';
      scoring.matched = true;
      scoring.confidence = matchPercentage >= 80 ? 'medium' : 'low';
      scoring.details = {
        matchedWords: matchedWords,
        totalWords: targetWords.length,
        percentage: matchPercentage,
        reason: `${matchPercentage.toFixed(0)}% word match`
      };
      return scoring;
    }
  }
  
  // Strategy 4: Industry-based partial match
  if (context.industry === 'healthcare' && COMPANY_CONFIG.rules.requireIndustryMatch) {
    // Check if content mentions healthcare-related terms
    const healthcareTerms = ['health', 'medical', 'hospital', 'clinic', 'care', 'medicine'];
    const hasHealthcareContext = healthcareTerms.some(term => contentNorm.includes(term));
    
    if (hasHealthcareContext && matchedWords.length > 0) {
      scoring.score = COMPANY_CONFIG.scoring.industryPartialMatch;
      scoring.method = 'industry-partial';
      scoring.matched = true;
      scoring.confidence = 'low';
      scoring.details = {
        reason: 'Healthcare industry with partial match',
        matchedWords: matchedWords
      };
      return scoring;
    }
  }
  
  // No match found
  scoring.score = COMPANY_CONFIG.scoring.noMatch;
  scoring.method = 'none';
  scoring.matched = false;
  scoring.confidence = 'none';
  scoring.details.reason = 'No company match found';
  
  return scoring;
}

// ==================== DATABASE MATCHING ====================
/**
 * Match against healthcare systems database
 */
function matchAgainstDatabase(contentCompany, targetCompany) {
  const contentNorm = normalizeCompanyName(contentCompany);
  const targetNorm = normalizeCompanyName(targetCompany);
  
  // Check each system in the database
  for (const [systemName, systemData] of Object.entries(HEALTHCARE_SYSTEMS_DB)) {
    const systemNorm = normalizeCompanyName(systemName);
    
    // Check if target matches this system
    let targetMatchesSystem = false;
    
    if (systemNorm === targetNorm) {
      targetMatchesSystem = true;
    } else {
      // Check aliases
      for (const alias of systemData.aliases) {
        if (normalizeCompanyName(alias) === targetNorm) {
          targetMatchesSystem = true;
          break;
        }
      }
    }
    
    if (targetMatchesSystem) {
      // Now check if content matches this system
      // Check primary keyword first (highest priority)
      if (contentNorm.includes(systemData.primaryKeyword.toLowerCase())) {
        return {
          matched: true,
          score: COMPANY_CONFIG.scoring.allKeywordsMatch,
          confidence: 'high',
          details: {
            system: systemName,
            matchType: 'primary-keyword',
            keyword: systemData.primaryKeyword,
            reason: `Matched ${systemName} via primary keyword`
          }
        };
      }
      
      // Check all keywords
      const matchedKeywords = systemData.keywords.filter(keyword => 
        contentNorm.includes(keyword.toLowerCase())
      );
      
      if (matchedKeywords.length === systemData.keywords.length) {
        return {
          matched: true,
          score: COMPANY_CONFIG.scoring.allKeywordsMatch,
          confidence: 'high',
          details: {
            system: systemName,
            matchType: 'all-keywords',
            keywords: matchedKeywords,
            reason: `All keywords matched for ${systemName}`
          }
        };
      } else if (matchedKeywords.length > 0) {
        const score = COMPANY_CONFIG.scoring.primaryKeywordMatch + 
                     (matchedKeywords.length * 5);
        return {
          matched: true,
          score: Math.min(score, COMPANY_CONFIG.scoring.allKeywordsMatch),
          confidence: 'medium',
          details: {
            system: systemName,
            matchType: 'partial-keywords',
            keywords: matchedKeywords,
            reason: `Partial keyword match for ${systemName}`
          }
        };
      }
      
      // Check exact aliases
      for (const alias of systemData.aliases) {
        if (contentNorm.includes(normalizeCompanyName(alias))) {
          return {
            matched: true,
            score: COMPANY_CONFIG.scoring.exactMatch,
            confidence: 'high',
            details: {
              system: systemName,
              matchType: 'alias-exact',
              alias: alias,
              reason: `Exact alias match: ${alias}`
            }
          };
        }
      }
    }
  }
  
  return {
    matched: false,
    score: 0,
    confidence: 'none',
    details: {
      reason: 'No database match found'
    }
  };
}

// ==================== MAIN VERIFICATION FUNCTION ====================
/**
 * Comprehensive company verification
 */
function verifyCompanyMatch(searchResult, targetCompany, options = {}) {
  const verification = {
    verified: false,
    score: 0,
    confidence: 'none',
    method: 'none',
    requiresReview: false,
    details: {}
  };
  
  if (!targetCompany) {
    verification.details.reason = 'No target company specified';
    return verification;
  }
  
  // Extract company from search result
  const extractedCompany = extractCompanyFromResult(searchResult);
  
  if (!extractedCompany) {
    verification.details.reason = 'Could not extract company from result';
    verification.score = 0;
    return verification;
  }
  
  // Perform scoring
  const scoring = scoreCompanyMatch(
    extractedCompany,
    targetCompany,
    { industry: options.industry || 'healthcare' }
  );
  
  // Apply thresholds
  verification.score = scoring.score;
  verification.method = scoring.method;
  verification.details = scoring.details;
  
  if (scoring.score >= COMPANY_CONFIG.thresholds.autoAccept) {
    verification.verified = true;
    verification.confidence = 'high';
  } else if (scoring.score >= COMPANY_CONFIG.thresholds.acceptable) {
    verification.verified = true;
    verification.confidence = 'medium';
    verification.requiresReview = scoring.score < COMPANY_CONFIG.thresholds.autoAccept;
  } else if (scoring.score >= COMPANY_CONFIG.thresholds.review) {
    verification.verified = false;
    verification.confidence = 'low';
    verification.requiresReview = true;
  } else {
    verification.verified = false;
    verification.confidence = 'none';
  }
  
  // Log if in debug mode
  if (COMPANY_CONFIG.debug) {
    console.log(`Company Verification: ${targetCompany}`);
    console.log(`  Extracted: ${extractedCompany}`);
    console.log(`  Score: ${scoring.score}`);
    console.log(`  Method: ${scoring.method}`);
    console.log(`  Verified: ${verification.verified}`);
    console.log(`  Confidence: ${verification.confidence}`);
  }
  
  return verification;
}

// ==================== HELPER FUNCTIONS ====================
/**
 * Extract company name from search result
 */
function extractCompanyFromResult(searchResult) {
  // Try multiple extraction methods
  const content = `${searchResult.title || ''} ${searchResult.snippet || ''}`;
  
  // Pattern 1: "at Company Name"
  const atPattern = /\bat\s+([A-Z][A-Za-z\s&'-]+(?:Health|Medical|Hospital|Center|System|University|Medicine|Healthcare))/;
  const atMatch = content.match(atPattern);
  if (atMatch) return atMatch[1];
  
  // Pattern 2: "Company Name -"
  const dashPattern = /([A-Z][A-Za-z\s&'-]+(?:Health|Medical|Hospital|Center|System|University|Medicine|Healthcare))\s*[-–]/;
  const dashMatch = content.match(dashPattern);
  if (dashMatch) return dashMatch[1];
  
  // Pattern 3: LinkedIn format "| Company Name"
  const pipePattern = /\|\s*([A-Z][A-Za-z\s&'-]+(?:Health|Medical|Hospital|Center|System|University|Medicine|Healthcare))/;
  const pipeMatch = content.match(pipePattern);
  if (pipeMatch) return pipeMatch[1];
  
  // Pattern 4: Look for known healthcare systems
  for (const [system, data] of Object.entries(HEALTHCARE_SYSTEMS_DB)) {
    if (content.includes(system)) return system;
    
    for (const alias of data.aliases) {
      if (content.includes(alias)) return alias;
    }
  }
  
  return null;
}

// ==================== TEST FUNCTIONS ====================
/**
 * Test the company verification module
 */
function testCompanyVerification() {
  const testCases = [
    {
      searchResult: {
        title: 'John Smith - VP at Mount Sinai Health System',
        snippet: 'Leading healthcare innovation at Mount Sinai Hospital in New York'
      },
      targetCompany: 'Mount Sinai',
      expected: 'Should match via database'
    },
    {
      searchResult: {
        title: 'Jane Doe | Tufts Medical Center',
        snippet: 'Director of Operations at TMC'
      },
      targetCompany: 'Tufts Medicine',
      expected: 'Should match via alias TMC'
    },
    {
      searchResult: {
        title: 'Bob Johnson - Jefferson Health Executive',
        snippet: 'Working at Thomas Jefferson University Hospital'
      },
      targetCompany: 'TJUH',
      expected: 'Should match Jefferson via alias'
    },
    {
      searchResult: {
        title: 'Alice Williams at Boston Medical',
        snippet: 'Healthcare leader in Massachusetts'
      },
      targetCompany: 'Mount Sinai',
      expected: 'Should NOT match - wrong location'
    },
    {
      searchResult: {
        title: 'Dr. Smith - Partners Healthcare',
        snippet: 'Now at Mass General Brigham after the merger'
      },
      targetCompany: 'MGB',
      expected: 'Should match via former name Partners'
    }
  ];
  
  console.log('=' .repeat(60));
  console.log('COMPANY VERIFICATION MODULE TEST');
  console.log('=' .repeat(60));
  
  testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: Target Company = "${test.targetCompany}"`);
    console.log(`Result Title: "${test.searchResult.title}"`);
    console.log(`Expected: ${test.expected}`);
    
    const result = verifyCompanyMatch(test.searchResult, test.targetCompany);
    
    console.log('Result:');
    console.log(`  Verified: ${result.verified}`);
    console.log(`  Score: ${result.score}`);
    console.log(`  Confidence: ${result.confidence}`);
    console.log(`  Method: ${result.method}`);
    console.log(`  Details: ${result.details.reason || JSON.stringify(result.details)}`);
    
    console.log(result.verified && result.score >= 60 ? '✓ PASS' : '✗ FAIL');
  });
  
  console.log('\n' + '=' .repeat(60));
}

// ==================== EXPORT FOR USE IN MAIN SCRIPT ====================
/**
 * Export the company verification functions
 */
function getCompanyVerifier() {
  return {
    verify: verifyCompanyMatch,
    scoreMatch: scoreCompanyMatch,
    normalizeCompany: normalizeCompanyName,
    extractCompany: extractCompanyFromResult,
    database: HEALTHCARE_SYSTEMS_DB,
    config: COMPANY_CONFIG
  };
}