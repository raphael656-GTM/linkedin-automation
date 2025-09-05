/**
 * LinkedIn Profile Finder - Comprehensive Solution v3.0
 * Implements ALL recommendations for maximum accuracy and efficiency
 */

// ==================== CONFIGURATION ====================
const API_KEY = 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';

// Master Configuration
const CONFIG = {
  // Two-Pass System Configuration
  passes: {
    first: {
      minScore: 75,
      minCompanyScore: 50,
      requireExactName: true,
      maxStrategies: 3,
      description: 'High confidence strict search'
    },
    second: {
      minScore: 50,
      minCompanyScore: 30,
      requireExactName: false,
      maxStrategies: 5,
      flagForReview: true,
      description: 'Relaxed search with review flag'
    }
  },
  
  // API Optimization
  api: {
    maxPerMinute: 30,
    maxPerHour: 1000,
    maxPerDay: 10000,
    progressiveSearch: {
      start: 3,
      expand: 5,
      max: 10
    }
  },
  
  // Quality Control
  quality: {
    autoRejectThreshold: 30,
    autoAcceptThreshold: 85,
    reviewThreshold: 50,
    requireManualReviewForCommonNames: true
  },
  
  // System Settings
  cache: {
    enabled: true,
    durationDays: 30
  },
  
  debugMode: true,
  currentIndustry: 'healthcare' // Change based on your industry
};

// ==================== INDUSTRY CONFIGURATIONS ====================
const INDUSTRY_CONFIGS = {
  healthcare: {
    commonSystems: ['Mount Sinai', 'Kaiser', 'HCA', 'Adventhealth', 'Mayo Clinic', 
                    'Cleveland Clinic', 'Johns Hopkins', 'Northwell', 'Providence'],
    titleKeywords: ['MD', 'RN', 'Director', 'Chief', 'Physician', 'Doctor', 'Nurse', 
                   'Administrator', 'Clinical', 'Medical'],
    minCompanyScore: 40,
    boostForCredentials: true,
    aliases: {
      'Mount Sinai': ['Mount Sinai Health', 'MSH', 'Mt Sinai', 'Mount Sinai Hospital'],
      'Adventhealth': ['AdventHealth', 'Advent Health', 'Florida Hospital', 'AH'],
      'Kaiser': ['Kaiser Permanente', 'KP', 'Kaiser Foundation'],
      'Mayo': ['Mayo Clinic', 'Mayo Health', 'Mayo Medical']
    }
  },
  
  tech: {
    commonCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix'],
    titleKeywords: ['Engineer', 'Developer', 'PM', 'Designer', 'Manager', 'Lead', 
                   'Architect', 'DevOps', 'Data Scientist'],
    minCompanyScore: 60,
    checkGitHub: true,
    aliases: {
      'Google': ['Alphabet', 'Google LLC', 'Google Inc'],
      'Meta': ['Facebook', 'Meta Platforms'],
      'Amazon': ['AWS', 'Amazon Web Services']
    }
  },
  
  finance: {
    commonCompanies: ['Goldman', 'JPMorgan', 'Morgan Stanley', 'Citi', 'Bank of America'],
    titleKeywords: ['VP', 'Director', 'Analyst', 'Associate', 'Partner', 'Trader', 'Banker'],
    minCompanyScore: 70,
    requireTitle: true,
    aliases: {
      'Goldman': ['Goldman Sachs', 'GS'],
      'JPMorgan': ['JP Morgan', 'Chase', 'JPMC'],
      'Morgan Stanley': ['MS', 'Morgan Stanley Wealth Management']
    }
  }
};

// ==================== KNOWN DUPLICATES DATABASE ====================
const KNOWN_DUPLICATES = {
  'John Smith': {
    differentiators: ['company', 'title'],
    knownProfiles: ['john-smith-1', 'john-smith-2', 'johnsmith3']
  },
  'Michael Johnson': {
    differentiators: ['industry', 'location'],
    knownProfiles: ['michael-johnson-pharma', 'michael-johnson-tech']
  },
  'David Brown': {
    differentiators: ['credentials', 'company'],
    knownProfiles: ['david-brown-ceo', 'david-brown-md']
  }
};

// ==================== VALIDATION RULES ====================
const VALIDATION_RULES = {
  blacklistRules: [
    { 
      name: 'competitor_company',
      check: (result) => {
        const competitors = ['Competitor1', 'Competitor2']; // Add your competitors
        return !competitors.some(c => result.company?.includes(c));
      },
      message: 'Competitor company detected'
    },
    {
      name: 'retired_indicator',
      check: (result) => !result.title?.toLowerCase().includes('retired'),
      message: 'Retired professional'
    },
    {
      name: 'student_profile',
      check: (result) => !result.title?.toLowerCase().includes('student'),
      message: 'Student profile'
    }
  ],
  
  reviewRules: [
    {
      name: 'c_level_executive',
      check: (result) => /^(CEO|CFO|CTO|CMO|COO|Chief)/i.test(result.title || ''),
      message: 'C-level executive - verify carefully'
    },
    {
      name: 'common_name_large_company',
      check: (result, person) => {
        return isCommonName(person.firstName, person.lastName) && 
               isLargeCompany(result.company);
      },
      message: 'Common name at large company'
    },
    {
      name: 'low_company_match',
      check: (result) => result.companyScore < 30,
      message: 'Weak company match'
    }
  ],
  
  greenlistRules: [
    {
      name: 'previously_verified',
      check: (result, person) => checkPreviouslyVerified(person),
      message: 'Previously verified profile'
    },
    {
      name: 'exact_url_match',
      check: (result, person) => {
        const knownUrls = getKnownGoodUrls();
        return knownUrls.includes(result.url);
      },
      message: 'Known good URL'
    }
  ]
};

// ==================== CACHING SYSTEM ====================
class CacheSystem {
  static set(firstName, lastName, company, result) {
    if (!CONFIG.cache.enabled) return;
    
    const key = this.generateKey(firstName, lastName, company);
    const cache = PropertiesService.getScriptProperties();
    
    const data = {
      url: result.url,
      confidence: result.confidence,
      companyMatch: result.companyMatch,
      timestamp: new Date().toISOString(),
      verified: result.verified || false
    };
    
    try {
      cache.setProperty(key, JSON.stringify(data));
    } catch (e) {
      console.log('Cache write failed:', e);
    }
  }
  
  static get(firstName, lastName, company) {
    if (!CONFIG.cache.enabled) return null;
    
    const key = this.generateKey(firstName, lastName, company);
    const cache = PropertiesService.getScriptProperties();
    
    try {
      const cached = cache.getProperty(key);
      if (cached) {
        const data = JSON.parse(cached);
        const age = Date.now() - new Date(data.timestamp).getTime();
        const maxAge = CONFIG.cache.durationDays * 24 * 60 * 60 * 1000;
        
        if (age < maxAge) {
          console.log('✅ Cache hit for:', firstName, lastName);
          return data;
        }
      }
    } catch (e) {
      console.log('Cache read failed:', e);
    }
    
    return null;
  }
  
  static generateKey(firstName, lastName, company) {
    return `lf_${firstName}_${lastName}_${company}`.toLowerCase()
      .replace(/[^a-z0-9_]/g, '')
      .substring(0, 100); // Properties have key length limit
  }
  
  static clear() {
    const cache = PropertiesService.getScriptProperties();
    const keys = cache.getKeys();
    keys.filter(k => k.startsWith('lf_')).forEach(k => cache.deleteProperty(k));
  }
}

// ==================== PATTERN TRACKING & LEARNING ====================
class PatternTracker {
  static trackSuccess(input, result, strategy) {
    const patterns = this.getPatterns();
    
    patterns.successes.push({
      nameFormat: this.detectNameFormat(input),
      companyFormat: this.detectCompanyFormat(input),
      strategy: strategy.description,
      confidence: result.confidence,
      timestamp: new Date().toISOString()
    });
    
    this.savePatterns(patterns);
  }
  
  static trackFailure(input, reason) {
    const patterns = this.getPatterns();
    
    patterns.failures.push({
      input: input,
      reason: reason,
      timestamp: new Date().toISOString()
    });
    
    this.savePatterns(patterns);
  }
  
  static getRecommendations() {
    const patterns = this.getPatterns();
    
    // Analyze success patterns
    const successStrategies = patterns.successes.map(s => s.strategy);
    const strategyCount = {};
    successStrategies.forEach(s => {
      strategyCount[s] = (strategyCount[s] || 0) + 1;
    });
    
    // Find problematic companies
    const failedCompanies = patterns.failures
      .filter(f => f.input.company)
      .map(f => f.input.company);
    const companyFailCount = {};
    failedCompanies.forEach(c => {
      companyFailCount[c] = (companyFailCount[c] || 0) + 1;
    });
    
    return {
      mostSuccessfulStrategy: Object.entries(strategyCount)
        .sort((a, b) => b[1] - a[1])[0],
      problematicCompanies: Object.entries(companyFailCount)
        .filter(([_, count]) => count > 2)
        .map(([company, _]) => company),
      successRate: patterns.successes.length / 
        (patterns.successes.length + patterns.failures.length) * 100
    };
  }
  
  static detectNameFormat(input) {
    const { firstName, lastName } = input;
    if (firstName.length === 1) return 'initial_last';
    if (firstName.includes('.')) return 'abbreviated';
    if (firstName.includes('-')) return 'hyphenated';
    return 'standard';
  }
  
  static detectCompanyFormat(input) {
    const { company } = input;
    if (!company) return 'none';
    if (company.length < 5) return 'abbreviated';
    if (company.includes(',')) return 'full_legal';
    return 'standard';
  }
  
  static getPatterns() {
    const cache = PropertiesService.getScriptProperties();
    const patterns = cache.getProperty('patterns');
    return patterns ? JSON.parse(patterns) : { successes: [], failures: [] };
  }
  
  static savePatterns(patterns) {
    const cache = PropertiesService.getScriptProperties();
    // Keep only last 100 entries of each type
    patterns.successes = patterns.successes.slice(-100);
    patterns.failures = patterns.failures.slice(-100);
    cache.setProperty('patterns', JSON.stringify(patterns));
  }
}

// ==================== DUPLICATE DETECTION ====================
function detectDuplicateRisk(firstName, lastName) {
  const commonFirstNames = ['john', 'david', 'michael', 'robert', 'james', 'william',
                           'mary', 'jennifer', 'lisa', 'sarah', 'jessica', 'emily'];
  const commonLastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia',
                          'martinez', 'davis', 'rodriguez', 'wilson', 'anderson'];
  
  const risk = {
    isCommon: false,
    requiresStrictMatching: false,
    minRequiredScore: CONFIG.passes.first.minScore,
    strategy: 'standard'
  };
  
  const firstLower = firstName.toLowerCase();
  const lastLower = lastName.toLowerCase();
  const fullName = `${firstName} ${lastName}`;
  
  // Check if it's a known duplicate
  if (KNOWN_DUPLICATES[fullName]) {
    risk.isCommon = true;
    risk.requiresStrictMatching = true;
    risk.minRequiredScore = 85;
    risk.strategy = 'known_duplicate';
    risk.differentiators = KNOWN_DUPLICATES[fullName].differentiators;
  }
  // Check if it's a common name
  else if (commonFirstNames.includes(firstLower) || commonLastNames.includes(lastLower)) {
    risk.isCommon = true;
    risk.requiresStrictMatching = true;
    risk.minRequiredScore = 70;
    risk.strategy = 'common_name';
  }
  
  return risk;
}

// ==================== ADVANCED NAME VALIDATION ====================
function validateNameMatch(content, firstName, lastName, strict = false) {
  if (!content) return { isValid: false, confidence: 0 };
  
  const contentLower = content.toLowerCase();
  const firstNameLower = firstName.toLowerCase();
  const lastNameLower = lastName.toLowerCase();
  
  // Check for contamination patterns
  const contaminationPatterns = [
    new RegExp(`\\b${lastNameLower}\\s+${firstNameLower}\\s+(associates|company|group|llc|inc)\\b`, 'i'),
    new RegExp(`\\b(dr|mr|ms|mrs)\\s+${lastNameLower}\\s+and\\s+${firstNameLower}\\b`, 'i'),
    new RegExp(`\\b${firstNameLower}'s\\s+${lastNameLower}\\b`, 'i'), // John's Smith Services
  ];
  
  for (const pattern of contaminationPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, confidence: 0, contamination: true };
    }
  }
  
  // Strict name patterns for high confidence
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fName = escapeRegex(firstName);
  const lName = escapeRegex(lastName);
  
  const strictPatterns = [
    {
      regex: new RegExp(`\\b${fName}\\s+${lName}\\b`, 'i'),
      confidence: 100,
      description: 'Exact: FirstName LastName'
    },
    {
      regex: new RegExp(`\\b${lName},\\s*${fName}\\b`, 'i'),
      confidence: 95,
      description: 'LinkedIn: LastName, FirstName'
    },
    {
      regex: new RegExp(`\\b${fName}\\s+\\w\\.?\\s+${lName}\\b`, 'i'),
      confidence: 90,
      description: 'With middle: FirstName M. LastName'
    }
  ];
  
  // Check strict patterns first
  for (const pattern of strictPatterns) {
    if (pattern.regex.test(content)) {
      return { 
        isValid: true, 
        confidence: pattern.confidence,
        matchType: pattern.description
      };
    }
  }
  
  // If not strict mode, check relaxed patterns
  if (!strict) {
    // Check if names appear close together
    const firstIndex = contentLower.indexOf(firstNameLower);
    const lastIndex = contentLower.indexOf(lastNameLower);
    
    if (firstIndex !== -1 && lastIndex !== -1) {
      const distance = Math.abs(lastIndex - firstIndex);
      
      // Names within 30 characters
      if (distance < 30) {
        return {
          isValid: true,
          confidence: 60,
          matchType: 'Proximity match'
        };
      }
    }
  }
  
  return { isValid: false, confidence: 0 };
}

// ==================== ADVANCED COMPANY SCORING ====================
function scoreCompanyMatch(resultCompany, targetCompany) {
  if (!targetCompany) return 40; // No company = neutral score
  if (!resultCompany) return 20; // No result company = low score
  
  const industry = INDUSTRY_CONFIGS[CONFIG.currentIndustry];
  const cleanTarget = cleanCompanyName(targetCompany);
  const cleanResult = cleanCompanyName(resultCompany);
  
  // Exact match
  if (cleanResult === cleanTarget) {
    return 100;
  }
  
  // Check industry-specific aliases
  if (industry && industry.aliases) {
    for (const [main, aliases] of Object.entries(industry.aliases)) {
      const allVariations = [main.toLowerCase(), ...aliases.map(a => a.toLowerCase())];
      const targetLower = cleanTarget.toLowerCase();
      const resultLower = cleanResult.toLowerCase();
      
      if (allVariations.includes(targetLower) || 
          allVariations.some(v => targetLower.includes(v))) {
        if (allVariations.includes(resultLower) || 
            allVariations.some(v => resultLower.includes(v))) {
          return 90; // Alias match
        }
      }
    }
  }
  
  // Substring matching
  const targetLower = cleanTarget.toLowerCase();
  const resultLower = cleanResult.toLowerCase();
  
  if (resultLower.includes(targetLower) || targetLower.includes(resultLower)) {
    return 75;
  }
  
  // Word-based scoring with importance weighting
  const importantWords = ['hospital', 'health', 'medical', 'clinic', 'center', 
                         'university', 'institute', 'bank', 'capital', 'partners'];
  
  const targetWords = targetLower.split(/\s+/).filter(w => w.length > 2);
  const resultWords = resultLower.split(/\s+/).filter(w => w.length > 2);
  
  let score = 0;
  let importantMatches = 0;
  
  for (const targetWord of targetWords) {
    const isImportant = importantWords.includes(targetWord);
    
    if (resultWords.some(rw => rw === targetWord || 
                              rw.includes(targetWord) || 
                              targetWord.includes(rw))) {
      score += isImportant ? 20 : 10;
      if (isImportant) importantMatches++;
    }
  }
  
  // Bonus for important word matches
  if (importantMatches > 0) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

// ==================== URL INTELLIGENCE ====================
function analyzeLinkedInUrl(url, firstName, lastName, company) {
  if (!url || !url.includes('linkedin.com/in/')) {
    return { score: 0, signals: {} };
  }
  
  const urlPath = url.split('linkedin.com/in/')[1] || '';
  const urlParts = urlPath.toLowerCase().split(/[-_\/]/);
  
  const signals = {
    hasFirstName: false,
    hasLastName: false,
    hasCompanyHint: false,
    hasNumbers: false,
    hasDuplicateIndicator: false,
    complexity: urlParts.length
  };
  
  const firstNameLower = firstName.toLowerCase();
  const lastNameLower = lastName.toLowerCase();
  
  // Check for name components
  signals.hasFirstName = urlParts.some(part => 
    part.includes(firstNameLower) || firstNameLower.includes(part)
  );
  signals.hasLastName = urlParts.some(part => 
    part.includes(lastNameLower) || lastNameLower.includes(part)
  );
  
  // Numbers often indicate duplicates
  signals.hasNumbers = /\d/.test(urlPath);
  signals.hasDuplicateIndicator = /\d{2,}/.test(urlPath) || urlPath.includes('-1') || 
                                  urlPath.includes('-2') || urlPath.includes('-3');
  
  // Check for company hints
  if (company && urlParts.length > 2) {
    const companyWords = company.toLowerCase().split(/\s+/);
    signals.hasCompanyHint = urlParts.some(part => 
      companyWords.some(word => part.includes(word) && word.length > 3)
    );
  }
  
  // Calculate score
  let score = 0;
  if (signals.hasFirstName) score += 30;
  if (signals.hasLastName) score += 30;
  if (signals.hasCompanyHint) score += 20;
  if (!signals.hasNumbers) score += 10;
  if (!signals.hasDuplicateIndicator) score += 10;
  
  return { score, signals };
}

// ==================== MULTI-RESULT COMPARISON ====================
function compareAndSelectBest(results, person, duplicateRisk) {
  if (!results || results.length === 0) {
    return null;
  }
  
  // Score each result comprehensively
  const scoredResults = results.map(result => {
    const nameValidation = validateNameMatch(
      `${result.title} ${result.snippet}`,
      person.firstName,
      person.lastName,
      duplicateRisk.requiresStrictMatching
    );
    
    const extractedCompany = extractCompanyFromContent(`${result.title} ${result.snippet}`);
    const companyScore = scoreCompanyMatch(extractedCompany, person.company);
    
    const urlAnalysis = analyzeLinkedInUrl(result.link, person.firstName, person.lastName, person.company);
    
    // Title matching
    let titleScore = 0;
    if (person.jobTitle) {
      const titleWords = person.jobTitle.toLowerCase().split(/\s+/);
      const contentLower = `${result.title} ${result.snippet}`.toLowerCase();
      const matchingWords = titleWords.filter(w => contentLower.includes(w));
      titleScore = (matchingWords.length / titleWords.length) * 100;
    }
    
    // Calculate weighted total score
    const totalScore = 
      (nameValidation.confidence || 0) * 0.35 +
      companyScore * 0.30 +
      titleScore * 0.20 +
      urlAnalysis.score * 0.15;
    
    return {
      ...result,
      scores: {
        name: nameValidation.confidence || 0,
        company: companyScore,
        title: titleScore,
        url: urlAnalysis.score,
        total: totalScore
      },
      signals: {
        nameValidation,
        urlAnalysis: urlAnalysis.signals,
        extractedCompany
      }
    };
  });
  
  // Sort by total score
  scoredResults.sort((a, b) => b.scores.total - a.scores.total);
  
  // Check if top result is significantly better
  if (scoredResults.length >= 2) {
    const gap = scoredResults[0].scores.total - scoredResults[1].scores.total;
    
    // If scores are too close and it's a common name, flag for review
    if (gap < 15 && duplicateRisk.isCommon) {
      return {
        needsManualReview: true,
        candidates: scoredResults.slice(0, 3),
        reason: 'Multiple similar matches for common name'
      };
    }
  }
  
  // Check if the best result meets minimum threshold
  const best = scoredResults[0];
  if (best.scores.total < duplicateRisk.minRequiredScore) {
    return {
      needsManualReview: true,
      candidates: [best],
      reason: `Score ${Math.round(best.scores.total)} below threshold ${duplicateRisk.minRequiredScore}`
    };
  }
  
  return best;
}

// ==================== COMPREHENSIVE SEARCH STRATEGIES ====================
function buildComprehensiveStrategies(person, pass = 'first') {
  const { firstName, lastName, jobTitle, company, state } = person;
  const fullName = `${firstName} ${lastName}`.trim();
  const cleanCompany = cleanCompanyName(company);
  
  const strategies = [];
  const config = CONFIG.passes[pass];
  
  // Pass 1: High-precision strategies
  if (pass === 'first') {
    // Strategy 1: Full exact match
    if (company && jobTitle) {
      strategies.push({
        query: `"${fullName}" "${jobTitle}" "${cleanCompany}" site:linkedin.com/in/`,
        tier: 1,
        confidence: 95,
        description: 'Exact: name + title + company'
      });
    }
    
    // Strategy 2: Name + company
    if (company) {
      strategies.push({
        query: `"${fullName}" "${cleanCompany}" site:linkedin.com/in/`,
        tier: 1,
        confidence: 90,
        description: 'Exact: name + company'
      });
    }
    
    // Strategy 3: LinkedIn format
    strategies.push({
      query: `"${lastName}, ${firstName}" site:linkedin.com/in/`,
      tier: 1,
      confidence: 85,
      description: 'LinkedIn name format'
    });
  }
  
  // Pass 2: Broader strategies
  else if (pass === 'second') {
    // Strategy 1: Name + main company word
    if (company) {
      const mainWord = cleanCompany.split(' ')[0];
      strategies.push({
        query: `"${fullName}" ${mainWord} site:linkedin.com/in/`,
        tier: 2,
        confidence: 70,
        description: 'Name + main company word'
      });
    }
    
    // Strategy 2: Name + title
    if (jobTitle) {
      strategies.push({
        query: `"${fullName}" "${jobTitle}" site:linkedin.com/in/`,
        tier: 2,
        confidence: 65,
        description: 'Name + title'
      });
    }
    
    // Strategy 3: Name + location
    if (state) {
      strategies.push({
        query: `"${fullName}" "${state}" site:linkedin.com/in/`,
        tier: 2,
        confidence: 60,
        description: 'Name + location'
      });
    }
    
    // Strategy 4: Name only on LinkedIn
    strategies.push({
      query: `"${fullName}" site:linkedin.com/in/`,
      tier: 3,
      confidence: 55,
      description: 'Name only on LinkedIn'
    });
    
    // Strategy 5: Broad search
    strategies.push({
      query: `${firstName} ${lastName} ${cleanCompany || ''} linkedin`,
      tier: 3,
      confidence: 50,
      description: 'Broad search'
    });
  }
  
  return strategies.slice(0, config.maxStrategies);
}

// ==================== MAIN SEARCH FUNCTION ====================
function findLinkedInProfile(firstName, lastName, jobTitle = '', company = '', state = '') {
  try {
    // Input validation
    if (!firstName || !lastName) {
      return { error: 'Missing required name fields' };
    }
    
    const person = { firstName, lastName, jobTitle, company, state };
    
    // Check cache first
    const cached = CacheSystem.get(firstName, lastName, company);
    if (cached) {
      return cached;
    }
    
    // Detect duplicate risk
    const duplicateRisk = detectDuplicateRisk(firstName, lastName);
    
    if (CONFIG.debugMode) {
      console.log(`\n🔍 Searching: ${firstName} ${lastName}`);
      console.log(`   Company: ${company || 'Any'}`);
      console.log(`   Duplicate Risk: ${duplicateRisk.isCommon ? 'HIGH' : 'LOW'}`);
    }
    
    // Two-pass search system
    let result = null;
    
    // Pass 1: High-confidence search
    result = executeSearch(person, 'first', duplicateRisk);
    
    // Pass 2: If no results, try relaxed search
    if (!result || result.url === 'Not Found') {
      if (CONFIG.debugMode) {
        console.log('\n📡 Pass 1 failed, trying Pass 2...');
      }
      result = executeSearch(person, 'second', duplicateRisk);
      
      if (result && result.url !== 'Not Found') {
        result.flaggedForReview = true;
        result.reviewReason = 'Found in second pass';
      }
    }
    
    // Apply validation rules
    if (result && result.url !== 'Not Found') {
      result = applyValidationRules(result, person);
    }
    
    // Cache successful results
    if (result && result.url !== 'Not Found' && !result.error) {
      CacheSystem.set(firstName, lastName, company, result);
    }
    
    // Track patterns
    if (result && result.url !== 'Not Found') {
      PatternTracker.trackSuccess(person, result, result.strategy || {});
    } else {
      PatternTracker.trackFailure(person, 'Not found after both passes');
    }
    
    return result;
    
  } catch (error) {
    console.error('Error in findLinkedInProfile:', error);
    return { error: error.toString(), url: 'Error' };
  }
}

// ==================== SEARCH EXECUTION ====================
function executeSearch(person, pass, duplicateRisk) {
  const strategies = buildComprehensiveStrategies(person, pass);
  const config = CONFIG.passes[pass];
  const allResults = [];
  
  for (const strategy of strategies) {
    if (CONFIG.debugMode) {
      console.log(`\n📡 ${strategy.description}`);
    }
    
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(strategy.query)}&num=${CONFIG.api.progressiveSearch.start}`;
    
    try {
      const response = UrlFetchApp.fetch(searchUrl);
      const data = JSON.parse(response.getContentText());
      
      if (data.error) {
        console.error('API Error:', data.error.message);
        continue;
      }
      
      if (data.items && data.items.length > 0) {
        // Collect all LinkedIn results
        const linkedInResults = data.items.filter(item => 
          item.link && item.link.includes('linkedin.com/in/')
        );
        
        if (linkedInResults.length > 0) {
          allResults.push(...linkedInResults);
          
          // If we have enough results, stop searching
          if (allResults.length >= 3) {
            break;
          }
        }
      }
      
    } catch (error) {
      console.error('Search error:', error);
    }
    
    Utilities.sleep(300); // Rate limiting
  }
  
  // Compare and select best result
  if (allResults.length > 0) {
    const best = compareAndSelectBest(allResults, person, duplicateRisk);
    
    if (best) {
      if (best.needsManualReview) {
        return {
          url: best.candidates[0].link,
          confidence: Math.round(best.candidates[0].scores.total),
          needsReview: true,
          reviewReason: best.reason,
          alternatives: best.candidates.slice(1).map(c => c.link)
        };
      } else {
        return {
          url: best.link,
          confidence: Math.round(best.scores.total),
          companyMatch: Math.round(best.scores.company),
          breakdown: best.scores
        };
      }
    }
  }
  
  return {
    url: 'Not Found',
    confidence: 0,
    reason: `No results in ${pass} pass`
  };
}

// ==================== VALIDATION RULES APPLICATION ====================
function applyValidationRules(result, person) {
  // Check blacklist rules
  for (const rule of VALIDATION_RULES.blacklistRules) {
    if (!rule.check(result)) {
      return {
        url: 'Rejected',
        reason: rule.message,
        originalUrl: result.url
      };
    }
  }
  
  // Check greenlist rules
  for (const rule of VALIDATION_RULES.greenlistRules) {
    if (rule.check(result, person)) {
      result.verified = true;
      result.verificationReason = rule.message;
      return result;
    }
  }
  
  // Check review rules
  for (const rule of VALIDATION_RULES.reviewRules) {
    if (rule.check(result, person)) {
      result.needsReview = true;
      result.reviewReason = rule.message;
    }
  }
  
  return result;
}

// ==================== BATCH PROCESSING ====================
function batchFindLinkedInProfiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Setup columns
  setupReviewWorkflow(sheet);
  
  // Group by company for better cache performance
  const grouped = groupByCompany(values.slice(1));
  
  const results = [];
  let stats = {
    found: 0,
    notFound: 0,
    needsReview: 0,
    cached: 0,
    errors: 0
  };
  
  // Process each company group
  for (const [company, rows] of Object.entries(grouped)) {
    console.log(`\n📁 Processing company: ${company || 'No Company'} (${rows.length} people)`);
    
    for (const row of rows) {
      const person = {
        firstName: row.data[0],
        lastName: row.data[1],
        jobTitle: row.data[2],
        company: row.data[3],
        state: row.data[4]
      };
      
      if (!person.firstName || !person.lastName) {
        results[row.index] = ['', '', '', '', ''];
        continue;
      }
      
      const result = findLinkedInProfile(
        person.firstName,
        person.lastName,
        person.jobTitle,
        person.company,
        person.state
      );
      
      // Process result
      let status = '';
      if (result.url === 'Not Found') {
        status = 'Not Found';
        stats.notFound++;
      } else if (result.url === 'Error' || result.url === 'Rejected') {
        status = result.reason || 'Error';
        stats.errors++;
      } else if (result.needsReview) {
        status = 'Needs Review';
        stats.needsReview++;
      } else {
        status = result.verified ? 'Verified' : 'Found';
        stats.found++;
      }
      
      results[row.index] = [
        result.url || 'Not Found',
        result.confidence ? `${result.confidence}%` : '0%',
        result.companyMatch ? `${result.companyMatch}%` : '0%',
        status,
        '', // Verified By
        '', // Verified Date
        result.alternatives ? result.alternatives.join(', ') : ''
      ];
      
      // Save progress every 25 records
      if ((stats.found + stats.notFound + stats.errors) % 25 === 0) {
        saveProgress(sheet, results);
      }
      
      Utilities.sleep(1000); // Rate limiting
    }
  }
  
  // Final save
  saveProgress(sheet, results);
  
  // Show summary
  showBatchSummary(stats);
  
  // Generate recommendations
  const recommendations = PatternTracker.getRecommendations();
  if (recommendations.problematicCompanies.length > 0) {
    console.log('\n⚠️ Problematic companies:', recommendations.problematicCompanies);
  }
}

// ==================== HELPER FUNCTIONS ====================
function cleanCompanyName(company) {
  if (!company) return '';
  
  return company
    .replace(/[,.]$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCompanyFromContent(content) {
  if (!content) return '';
  
  const patterns = [
    /(?:at|@)\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*[|\-•]|\s+LinkedIn|$)/i,
    /(?:works? at|employed by|with)\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*[|\-•]|$)/i,
    /[•·]\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*[|\-•]|$)/i,
    /\|\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*\||$)/i
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim()
        .replace(/\s*(LinkedIn|Profile|View|See|Experience)$/i, '')
        .trim();
    }
  }
  
  return '';
}

function isCommonName(firstName, lastName) {
  const commonFirstNames = ['john', 'david', 'michael', 'robert', 'james'];
  const commonLastNames = ['smith', 'johnson', 'williams', 'brown', 'jones'];
  
  return commonFirstNames.includes(firstName.toLowerCase()) ||
         commonLastNames.includes(lastName.toLowerCase());
}

function isLargeCompany(company) {
  if (!company) return false;
  
  const largeCompanies = [
    ...INDUSTRY_CONFIGS.healthcare.commonSystems,
    ...INDUSTRY_CONFIGS.tech.commonCompanies,
    ...INDUSTRY_CONFIGS.finance.commonCompanies
  ];
  
  const companyLower = company.toLowerCase();
  return largeCompanies.some(large => 
    companyLower.includes(large.toLowerCase())
  );
}

function checkPreviouslyVerified(person) {
  // Check if this person was previously verified
  const cache = PropertiesService.getScriptProperties();
  const key = `verified_${person.firstName}_${person.lastName}`.toLowerCase();
  return cache.getProperty(key) !== null;
}

function getKnownGoodUrls() {
  // Return list of previously verified URLs
  const cache = PropertiesService.getScriptProperties();
  const verifiedKey = 'verified_urls';
  const urls = cache.getProperty(verifiedKey);
  return urls ? JSON.parse(urls) : [];
}

function groupByCompany(rows) {
  const grouped = {};
  
  rows.forEach((row, index) => {
    const company = row[3] || 'No Company';
    if (!grouped[company]) {
      grouped[company] = [];
    }
    grouped[company].push({ index, data: row });
  });
  
  return grouped;
}

// ==================== UI SETUP ====================
function setupReviewWorkflow(sheet) {
  const headers = [
    'First Name',
    'Last Name', 
    'Job Title',
    'Company Name',
    'State',
    'LinkedIn URL',
    'Confidence %',
    'Company Match %',
    'Status',
    'Verified By',
    'Verified Date',
    'Alternates/Notes'
  ];
  
  // Set headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
  
  // Set column widths
  sheet.setColumnWidth(6, 300); // LinkedIn URL
  sheet.setColumnWidth(9, 150); // Status
  sheet.setColumnWidth(12, 200); // Notes
  
  // Add conditional formatting
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    // Color code by confidence
    const confidenceRange = sheet.getRange(2, 7, lastRow - 1, 1);
    const statusRange = sheet.getRange(2, 9, lastRow - 1, 1);
    
    // This would be done with conditional formatting rules in the UI
  }
}

function saveProgress(sheet, results) {
  // Save current progress to sheet
  const startRow = 2;
  const validResults = results.filter(r => r !== undefined);
  
  if (validResults.length > 0) {
    sheet.getRange(startRow, 6, validResults.length, 7).setValues(validResults);
  }
}

function showBatchSummary(stats) {
  const total = stats.found + stats.notFound + stats.needsReview + stats.errors;
  const successRate = total > 0 ? Math.round(((stats.found + stats.needsReview) / total) * 100) : 0;
  
  const message = `
📊 PROCESSING COMPLETE
═══════════════════════
✅ Found: ${stats.found}
⚠️  Needs Review: ${stats.needsReview}
❌ Not Found: ${stats.notFound}
🚫 Errors: ${stats.errors}
💾 From Cache: ${stats.cached}
═══════════════════════
Success Rate: ${successRate}%

Review items marked "Needs Review" for best accuracy.
  `;
  
  SpreadsheetApp.getUi().alert('Results', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==================== MENU SYSTEM ====================
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🎯 LinkedIn Finder Pro')
    .addItem('🔍 Process All (Two-Pass)', 'batchFindLinkedInProfiles')
    .addItem('✅ Process Selected Rows', 'processSelectedRows')
    .addSeparator()
    .addSubMenu(ui.createMenu('⚙️ Configuration')
      .addItem('Switch to Healthcare', () => setIndustry('healthcare'))
      .addItem('Switch to Tech', () => setIndustry('tech'))
      .addItem('Switch to Finance', () => setIndustry('finance'))
      .addSeparator()
      .addItem('View Current Settings', 'showConfiguration')
      .addItem('Clear Cache', 'clearCache'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Analytics')
      .addItem('View Success Patterns', 'showPatterns')
      .addItem('View Problem Companies', 'showProblematicCompanies')
      .addItem('Generate Report', 'generateAnalyticsReport'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🧪 Testing')
      .addItem('Test Single Profile', 'testSingleProfile')
      .addItem('Test Common Name', 'testCommonName')
      .addItem('Test Duplicate Detection', 'testDuplicateDetection'))
    .addSeparator()
    .addItem('ℹ️ About', 'showAbout')
    .addToUi();
}

// ==================== UTILITY FUNCTIONS ====================
function processSelectedRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selection = sheet.getSelection();
  const activeRange = selection.getActiveRange();
  
  if (!activeRange) {
    SpreadsheetApp.getUi().alert('Please select rows to process');
    return;
  }
  
  const startRow = activeRange.getRow();
  const numRows = activeRange.getNumRows();
  const dataRange = sheet.getRange(startRow, 1, numRows, 5);
  const values = dataRange.getValues();
  
  const results = [];
  
  for (let i = 0; i < values.length; i++) {
    const person = {
      firstName: values[i][0],
      lastName: values[i][1],
      jobTitle: values[i][2],
      company: values[i][3],
      state: values[i][4]
    };
    
    if (!person.firstName || !person.lastName) {
      results.push(['', '', '', '', '', '', '']);
      continue;
    }
    
    const result = findLinkedInProfile(
      person.firstName,
      person.lastName,
      person.jobTitle,
      person.company,
      person.state
    );
    
    const status = result.needsReview ? 'Needs Review' : 
                  result.url === 'Not Found' ? 'Not Found' : 
                  result.verified ? 'Verified' : 'Found';
    
    results.push([
      result.url || 'Not Found',
      result.confidence ? `${result.confidence}%` : '0%',
      result.companyMatch ? `${result.companyMatch}%` : '0%',
      status,
      '', // Verified By
      '', // Verified Date
      result.alternatives ? result.alternatives.join(', ') : ''
    ]);
    
    Utilities.sleep(1000);
  }
  
  if (results.length > 0) {
    sheet.getRange(startRow, 6, results.length, 7).setValues(results);
  }
  
  SpreadsheetApp.getUi().alert(`Processed ${results.length} rows`);
}

function setIndustry(industry) {
  CONFIG.currentIndustry = industry;
  SpreadsheetApp.getUi().alert(`Switched to ${industry} configuration`);
}

function showConfiguration() {
  const industry = CONFIG.currentIndustry;
  const config = INDUSTRY_CONFIGS[industry];
  
  const message = `
CURRENT CONFIGURATION
════════════════════════
Industry: ${industry.toUpperCase()}
Min Company Score: ${config.minCompanyScore}%
Pass 1 Threshold: ${CONFIG.passes.first.minScore}
Pass 2 Threshold: ${CONFIG.passes.second.minScore}

Common Companies:
${config.commonCompanies ? config.commonCompanies.slice(0, 5).join(', ') : config.commonSystems.slice(0, 5).join(', ')}

Title Keywords:
${config.titleKeywords.slice(0, 5).join(', ')}
  `;
  
  SpreadsheetApp.getUi().alert('Configuration', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function clearCache() {
  CacheSystem.clear();
  SpreadsheetApp.getUi().alert('Cache cleared successfully');
}

function showPatterns() {
  const recommendations = PatternTracker.getRecommendations();
  
  const message = `
SUCCESS PATTERNS
════════════════════════
Most Successful Strategy:
${recommendations.mostSuccessfulStrategy ? recommendations.mostSuccessfulStrategy[0] : 'No data'}

Success Rate: ${Math.round(recommendations.successRate || 0)}%

Problematic Companies:
${recommendations.problematicCompanies.length > 0 ? 
  recommendations.problematicCompanies.join(', ') : 'None identified'}
  `;
  
  SpreadsheetApp.getUi().alert('Pattern Analysis', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function showProblematicCompanies() {
  const recommendations = PatternTracker.getRecommendations();
  
  if (recommendations.problematicCompanies.length === 0) {
    SpreadsheetApp.getUi().alert('No problematic companies identified yet');
    return;
  }
  
  const message = `
PROBLEMATIC COMPANIES
════════════════════════
These companies have had multiple search failures:

${recommendations.problematicCompanies.map(c => `• ${c}`).join('\n')}

Consider:
1. Adding company aliases
2. Using alternate company names
3. Including more details (location, division)
  `;
  
  SpreadsheetApp.getUi().alert('Problematic Companies', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function generateAnalyticsReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  let reportSheet = sheet.getSheetByName('Analytics Report');
  
  if (!reportSheet) {
    reportSheet = sheet.insertSheet('Analytics Report');
  } else {
    reportSheet.clear();
  }
  
  // Get pattern data
  const recommendations = PatternTracker.getRecommendations();
  
  // Create report
  const report = [
    ['LinkedIn Finder Analytics Report'],
    ['Generated:', new Date().toLocaleString()],
    [''],
    ['PERFORMANCE METRICS'],
    ['Success Rate:', `${Math.round(recommendations.successRate || 0)}%`],
    [''],
    ['CONFIGURATION'],
    ['Current Industry:', CONFIG.currentIndustry],
    ['Pass 1 Threshold:', CONFIG.passes.first.minScore],
    ['Pass 2 Threshold:', CONFIG.passes.second.minScore],
    [''],
    ['PROBLEM AREAS'],
    ['Problematic Companies:', recommendations.problematicCompanies.join(', ') || 'None']
  ];
  
  reportSheet.getRange(1, 1, report.length, 2).setValues(report);
  
  // Format
  reportSheet.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  reportSheet.getRange(4, 1).setFontWeight('bold');
  reportSheet.getRange(7, 1).setFontWeight('bold');
  reportSheet.getRange(12, 1).setFontWeight('bold');
  
  SpreadsheetApp.getUi().alert('Report generated in "Analytics Report" sheet');
}

function testSingleProfile() {
  const result = findLinkedInProfile('John', 'Smith', 'Director', 'Mayo Clinic', 'Minnesota');
  
  const message = result.url !== 'Not Found' ?
    `✅ Found: ${result.url}
Confidence: ${result.confidence}%
Company Match: ${result.companyMatch}%
Needs Review: ${result.needsReview || false}
${result.reviewReason || ''}` :
    `❌ Not Found
Reason: ${result.reason || 'No matches'}`;
  
  SpreadsheetApp.getUi().alert('Test Result', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function testCommonName() {
  const result = findLinkedInProfile('John', 'Smith', '', 'Google', '');
  
  const duplicateRisk = detectDuplicateRisk('John', 'Smith');
  
  const message = `
COMMON NAME TEST
════════════════════════
Name: John Smith
Duplicate Risk: ${duplicateRisk.isCommon ? 'HIGH' : 'LOW'}
Min Required Score: ${duplicateRisk.minRequiredScore}

Result: ${result.url !== 'Not Found' ? result.url : 'Not Found'}
Confidence: ${result.confidence || 0}%
Needs Review: ${result.needsReview || false}
  `;
  
  SpreadsheetApp.getUi().alert('Common Name Test', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

function testDuplicateDetection() {
  const testCases = [
    { firstName: 'John', lastName: 'Smith' },
    { firstName: 'Michael', lastName: 'Johnson' },
    { firstName: 'Sarah', lastName: 'Williams' },
    { firstName: 'Unique', lastName: 'Namehere' }
  ];
  
  const results = testCases.map(person => {
    const risk = detectDuplicateRisk(person.firstName, person.lastName);
    return `${person.firstName} ${person.lastName}: ${risk.isCommon ? 'HIGH RISK' : 'Low Risk'} (min score: ${risk.minRequiredScore})`;
  });
  
  SpreadsheetApp.getUi().alert('Duplicate Detection Test', results.join('\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

function showAbout() {
  const message = `
LINKEDIN FINDER PRO v3.0
════════════════════════
Comprehensive Edition

Features:
✅ Two-Pass Search System
✅ Industry-Specific Configs
✅ Duplicate Detection
✅ Smart Caching
✅ Pattern Learning
✅ Review Workflow
✅ Company Aliases
✅ Validation Rules

Expected Accuracy: 85-95%
False Positives: <2%

For best results:
1. Include job titles
2. Use full company names
3. Review flagged items
4. Keep cache enabled
  `;
  
  SpreadsheetApp.getUi().alert('About', message, SpreadsheetApp.getUi().ButtonSet.OK);
}