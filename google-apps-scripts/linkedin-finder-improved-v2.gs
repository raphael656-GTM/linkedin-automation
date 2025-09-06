/**
 * LinkedIn Profile Finder - Improved Accuracy Version 2.0
 * Implements BMAD Story 0: Redesigned Search Strategy with Tiered System
 * Focus on precision over coverage - Better to return "Not Found" than wrong person
 */

// ==================== CONFIGURATION ====================
const API_KEY = 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';

// Improved Configuration with 3-Tier System
const CONFIG = {
  // Tier-based strategy system for high precision
  tiers: {
    tier1: {
      name: 'Exact Match Strategies',
      minScore: 85,
      minNameScore: 95,
      minCompanyScore: 80,
      requireExactName: true,
      requireCompany: true,
      maxStrategies: 2,
      description: 'High-precision strategies with all details'
    },
    tier2: {
      name: 'High-Confidence Strategies', 
      minScore: 75,
      minNameScore: 90,
      minCompanyScore: 60,
      requireExactName: true,
      requireCompany: false,
      maxStrategies: 2,
      description: 'Name-focused strategies with company variations'
    },
    tier3: {
      name: 'Fallback Strategies (Optional)',
      minScore: 65,
      minNameScore: 85,
      minCompanyScore: 40,
      requireExactName: false,
      requireCompany: false,
      enabled: false, // Opt-in only
      maxStrategies: 1,
      description: 'Broader search - must be explicitly enabled'
    }
  },
  
  // Quality thresholds
  quality: {
    autoAcceptThreshold: 90,      // Auto-accept if score >= 90
    autoRejectThreshold: 60,      // Auto-reject if score < 60
    requireManualReview: 70,      // Flag for review between 60-90
    rejectOnNameMismatch: true,   // Immediately reject if name doesn't match
    logStrategyUsed: true         // Track which strategy succeeded
  },
  
  // System settings
  debugMode: true,
  returnNotFoundInsteadOfWrong: true,
  maxResultsPerStrategy: 3
};

// ==================== HEALTHCARE SYSTEMS DATABASE ====================
const HEALTHCARE_SYSTEMS = {
  'Tufts Medicine': {
    aliases: ['Tufts Medical', 'Tufts MC', 'TMC', 'Tufts Medical Center', 'Tufts'],
    keyWords: ['Tufts'],
    commonTitles: ['Manager', 'Director', 'Analyst', 'VP', 'Chief']
  },
  'Temple': {
    aliases: ['Temple University Hospital', 'Temple Health', 'Temple University Health System', 'TUH'],
    keyWords: ['Temple'],
    commonTitles: ['Clinical Director', 'VP', 'Director', 'Chair']
  },
  'Mount Sinai': {
    aliases: ['Mount Sinai Health', 'MSH', 'Mt Sinai', 'Mount Sinai Hospital', 'Mount Sinai Health System'],
    keyWords: ['Sinai', 'Mount Sinai'],
    commonTitles: ['Director', 'VP', 'Chief', 'Manager']
  },
  'Mass General Brigham': {
    aliases: ['MGB', 'Partners Healthcare', 'Massachusetts General', 'Brigham', 'MGH'],
    keyWords: ['Brigham', 'MGB', 'Mass General'],
    commonTitles: ['Director', 'Chief', 'President', 'Manager']
  }
  // Add more healthcare systems as needed
};

// ==================== STRICT NAME VALIDATION (Story 1 Preview) ====================
function validateNameStrict(content, firstName, lastName) {
  if (!content || !firstName || !lastName) {
    return { valid: false, score: 0, reason: 'Missing required data' };
  }
  
  const cleanContent = content.toLowerCase();
  const fName = firstName.toLowerCase().trim();
  const lName = lastName.toLowerCase().trim();
  
  // Build regex patterns with word boundaries to prevent partial matches
  const patterns = [
    // Pattern A: "FirstName LastName" (exact order)
    new RegExp(`\\b${escapeRegex(fName)}\\s+${escapeRegex(lName)}\\b`, 'i'),
    // Pattern B: "LastName, FirstName" (LinkedIn format)
    new RegExp(`\\b${escapeRegex(lName)}\\s*,\\s*${escapeRegex(fName)}\\b`, 'i'),
    // Pattern C: "FirstName M. LastName" (with middle initial)
    new RegExp(`\\b${escapeRegex(fName)}\\s+\\w\\.?\\s+${escapeRegex(lName)}\\b`, 'i'),
    // Pattern D: Just full name together
    new RegExp(`\\b${escapeRegex(fName)}${escapeRegex(lName)}\\b`, 'i')
  ];
  
  let matchFound = false;
  let matchPattern = '';
  let score = 0;
  
  // Check each pattern
  for (let i = 0; i < patterns.length; i++) {
    if (patterns[i].test(content)) {
      matchFound = true;
      matchPattern = `Pattern ${String.fromCharCode(65 + i)}`;
      score = 100 - (i * 5); // Decrease score for less exact patterns
      break;
    }
  }
  
  // Additional validation: Check for name contamination
  if (!matchFound) {
    // Check if names appear but in wrong context
    const hasFirstName = new RegExp(`\\b${escapeRegex(fName)}\\b`, 'i').test(content);
    const hasLastName = new RegExp(`\\b${escapeRegex(lName)}\\b`, 'i').test(content);
    
    if (hasFirstName && hasLastName) {
      // Names present but not in correct pattern - possible contamination
      return {
        valid: false,
        score: 30,
        reason: 'Names found but not in valid pattern - possible wrong person'
      };
    }
  }
  
  return {
    valid: matchFound,
    score: score,
    pattern: matchPattern,
    reason: matchFound ? 'Exact name match found' : 'Name pattern not found'
  };
}

// ==================== COMPANY VERIFICATION (Story 2 Preview) ====================
function verifyCompany(content, targetCompany) {
  if (!targetCompany) {
    return { score: 0, matched: false, reason: 'No company specified' };
  }
  
  const cleanContent = content.toLowerCase();
  const cleanTarget = targetCompany.toLowerCase().trim();
  
  // Check for exact match first
  if (cleanContent.includes(cleanTarget)) {
    return { score: 100, matched: true, reason: 'Exact company match' };
  }
  
  // Check against healthcare system aliases
  for (const [system, data] of Object.entries(HEALTHCARE_SYSTEMS)) {
    if (system.toLowerCase() === cleanTarget || 
        data.aliases.some(alias => alias.toLowerCase() === cleanTarget)) {
      
      // Check if any keywords match
      const keywordMatches = data.keyWords.filter(keyword => 
        cleanContent.includes(keyword.toLowerCase())
      );
      
      if (keywordMatches.length > 0) {
        const score = Math.min(100, 80 + (keywordMatches.length * 10));
        return {
          score: score,
          matched: true,
          reason: `Matched healthcare system: ${system} (keywords: ${keywordMatches.join(', ')})`
        };
      }
    }
  }
  
  // Partial match checking
  const companyWords = cleanTarget.split(/\s+/).filter(w => w.length > 2);
  const matchedWords = companyWords.filter(word => cleanContent.includes(word));
  const matchPercentage = (matchedWords.length / companyWords.length) * 100;
  
  if (matchPercentage >= 60) {
    return {
      score: matchPercentage,
      matched: true,
      reason: `Partial company match: ${matchedWords.join(', ')}`
    };
  }
  
  return {
    score: matchPercentage,
    matched: false,
    reason: 'Company not found or insufficient match'
  };
}

// ==================== REDESIGNED SEARCH STRATEGIES ====================
function buildTieredSearchStrategies(person) {
  const { firstName, lastName, jobTitle, company, state } = person;
  const fullName = `${firstName} ${lastName}`.trim();
  const strategies = [];
  
  // TIER 1: Exact Match Strategies (High Precision)
  if (CONFIG.tiers.tier1.enabled !== false) {
    if (company && jobTitle) {
      strategies.push({
        query: `"${fullName}" "${company}" "${jobTitle}" site:linkedin.com/in/`,
        tier: 1,
        confidence: 95,
        description: 'Tier 1: Full exact match (name + company + title)',
        requiresValidation: ['name', 'company', 'title']
      });
    }
    
    if (company) {
      strategies.push({
        query: `"${fullName}" "${company}" site:linkedin.com/in/`,
        tier: 1,
        confidence: 90,
        description: 'Tier 1: Exact name + company',
        requiresValidation: ['name', 'company']
      });
    }
  }
  
  // TIER 2: High-Confidence Strategies (Name-focused)
  if (CONFIG.tiers.tier2.enabled !== false) {
    // LinkedIn format with company keyword
    if (company) {
      const mainCompanyWord = company.split(' ').find(w => w.length > 3) || company.split(' ')[0];
      strategies.push({
        query: `"${lastName}, ${firstName}" ${mainCompanyWord} site:linkedin.com/in/`,
        tier: 2,
        confidence: 80,
        description: 'Tier 2: LinkedIn format + company keyword',
        requiresValidation: ['name', 'company-partial']
      });
    }
    
    // Name with title keywords
    if (jobTitle) {
      const titleKeywords = jobTitle.split(' ').slice(0, 2).join(' ');
      strategies.push({
        query: `"${fullName}" ${titleKeywords} site:linkedin.com/in/`,
        tier: 2,
        confidence: 75,
        description: 'Tier 2: Exact name + title keywords',
        requiresValidation: ['name', 'title-partial']
      });
    }
  }
  
  // TIER 3: Fallback Strategies (Only if explicitly enabled)
  if (CONFIG.tiers.tier3.enabled === true) {
    strategies.push({
      query: `"${fullName}" healthcare site:linkedin.com/in/`,
      tier: 3,
      confidence: 65,
      description: 'Tier 3: Name + industry (FALLBACK - Review Required)',
      requiresValidation: ['name'],
      requiresReview: true
    });
  }
  
  // Log strategy selection
  if (CONFIG.debugMode) {
    console.log(`Generated ${strategies.length} search strategies for ${fullName}`);
    strategies.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.description} (confidence: ${s.confidence})`);
    });
  }
  
  return strategies;
}

// ==================== RESULT SCORING WITH STRATEGY TRACKING ====================
function scoreResultWithStrategy(item, person, strategy) {
  const scores = {
    nameScore: 0,
    companyScore: 0,
    titleScore: 0,
    totalScore: 0,
    strategyUsed: strategy.description,
    strategyConfidence: strategy.confidence,
    tier: strategy.tier,
    validationResults: {},
    requiresReview: strategy.requiresReview || false
  };
  
  // Get content from search result
  const content = `${item.title || ''} ${item.snippet || ''} ${item.link || ''}`;
  
  // Validate name (strict)
  const nameValidation = validateNameStrict(content, person.firstName, person.lastName);
  scores.nameScore = nameValidation.score;
  scores.validationResults.name = nameValidation;
  
  // If name doesn't match and we reject on mismatch, return early
  if (CONFIG.quality.rejectOnNameMismatch && !nameValidation.valid) {
    scores.totalScore = 0;
    scores.rejected = true;
    scores.rejectionReason = 'Name validation failed';
    return scores;
  }
  
  // Validate company if provided
  if (person.company) {
    const companyValidation = verifyCompany(content, person.company);
    scores.companyScore = companyValidation.score;
    scores.validationResults.company = companyValidation;
  }
  
  // Validate title if provided (simplified for now)
  if (person.jobTitle) {
    const titleWords = person.jobTitle.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    const matchedWords = titleWords.filter(word => word.length > 2 && contentLower.includes(word));
    scores.titleScore = (matchedWords.length / titleWords.length) * 100;
    scores.validationResults.title = {
      matched: matchedWords,
      total: titleWords.length
    };
  }
  
  // Calculate weighted total score
  const weights = {
    name: 0.5,
    company: 0.3,
    title: 0.2
  };
  
  scores.totalScore = (
    scores.nameScore * weights.name +
    scores.companyScore * weights.company +
    scores.titleScore * weights.title
  );
  
  // Apply tier-based thresholds
  const tierConfig = CONFIG.tiers[`tier${strategy.tier}`];
  if (tierConfig) {
    if (scores.nameScore < tierConfig.minNameScore) {
      scores.rejected = true;
      scores.rejectionReason = `Name score ${scores.nameScore} below tier ${strategy.tier} threshold`;
    }
    if (person.company && scores.companyScore < tierConfig.minCompanyScore) {
      scores.rejected = true;
      scores.rejectionReason = `Company score ${scores.companyScore} below tier ${strategy.tier} threshold`;
    }
    if (scores.totalScore < tierConfig.minScore) {
      scores.rejected = true;
      scores.rejectionReason = `Total score ${scores.totalScore} below tier ${strategy.tier} threshold`;
    }
  }
  
  // Mark for review if in review range
  if (scores.totalScore >= CONFIG.quality.autoRejectThreshold && 
      scores.totalScore < CONFIG.quality.autoAcceptThreshold) {
    scores.requiresReview = true;
  }
  
  return scores;
}

// ==================== MAIN SEARCH FUNCTION ====================
function findLinkedInProfileImproved(firstName, lastName, jobTitle = '', company = '', state = '') {
  const person = { firstName, lastName, jobTitle, company, state };
  const searchStartTime = new Date();
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Searching for: ${firstName} ${lastName}`);
  if (company) console.log(`Company: ${company}`);
  if (jobTitle) console.log(`Title: ${jobTitle}`);
  console.log(`${'='.repeat(50)}`);
  
  // Build tiered strategies
  const strategies = buildTieredSearchStrategies(person);
  
  if (strategies.length === 0) {
    return {
      success: false,
      message: 'No search strategies available - check configuration',
      person: person
    };
  }
  
  let bestResult = null;
  let bestScore = 0;
  let strategyUsed = null;
  
  // Execute strategies in order (by tier and confidence)
  for (const strategy of strategies) {
    console.log(`\nTrying: ${strategy.description}`);
    
    try {
      // Execute search
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(strategy.query)}&num=${CONFIG.maxResultsPerStrategy}`;
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.items && data.items.length > 0) {
        // Score each result
        for (const item of data.items) {
          const scoring = scoreResultWithStrategy(item, person, strategy);
          
          if (CONFIG.debugMode) {
            console.log(`  Result: ${item.link}`);
            console.log(`    Name Score: ${scoring.nameScore}`);
            console.log(`    Company Score: ${scoring.companyScore}`);
            console.log(`    Total Score: ${scoring.totalScore}`);
            if (scoring.rejected) {
              console.log(`    REJECTED: ${scoring.rejectionReason}`);
            }
          }
          
          // Check if this is the best result so far
          if (!scoring.rejected && scoring.totalScore > bestScore) {
            bestScore = scoring.totalScore;
            bestResult = {
              url: item.link,
              title: item.title,
              snippet: item.snippet,
              scoring: scoring
            };
            strategyUsed = strategy;
          }
          
          // If we found a high-confidence match, stop searching
          if (bestScore >= CONFIG.quality.autoAcceptThreshold) {
            console.log(`✓ High-confidence match found (score: ${bestScore})`);
            break;
          }
        }
        
        // Stop if we have a good enough result for this tier
        if (bestScore >= CONFIG.tiers[`tier${strategy.tier}`].minScore) {
          break;
        }
      }
    } catch (error) {
      console.error(`Error with strategy: ${error.message}`);
    }
  }
  
  // Prepare final result
  if (bestResult && bestScore >= CONFIG.quality.autoRejectThreshold) {
    const executionTime = (new Date() - searchStartTime) / 1000;
    
    return {
      success: true,
      url: bestResult.url,
      confidence: bestScore,
      requiresReview: bestResult.scoring.requiresReview,
      strategyUsed: strategyUsed.description,
      tier: strategyUsed.tier,
      scores: {
        total: bestScore,
        name: bestResult.scoring.nameScore,
        company: bestResult.scoring.companyScore,
        title: bestResult.scoring.titleScore
      },
      executionTime: executionTime,
      person: person
    };
  } else if (CONFIG.returnNotFoundInsteadOfWrong) {
    // Better to return "not found" than wrong person
    return {
      success: false,
      message: 'No sufficiently confident match found',
      bestScore: bestScore,
      reason: bestScore > 0 ? 'Score below threshold' : 'No matches found',
      person: person
    };
  } else {
    // Return best effort (if config allows)
    return {
      success: false,
      message: 'Low confidence result',
      url: bestResult ? bestResult.url : null,
      confidence: bestScore,
      warning: 'Result does not meet quality thresholds',
      person: person
    };
  }
}

// ==================== HELPER FUNCTIONS ====================
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==================== TEST FUNCTIONS ====================
function testImprovedFinder() {
  // Test cases that previously failed
  const testCases = [
    {
      firstName: 'Kelly',
      lastName: "O'Neill",
      company: 'Mount Sinai',
      jobTitle: 'Director of Clinical Operations',
      expected: 'Should find correct Kelly O\'Neill at Mount Sinai'
    },
    {
      firstName: 'Pascual',
      lastName: 'Estrada',
      company: 'Tufts Medicine',
      jobTitle: 'VP',
      expected: 'Should find correct Pascual Estrada at Tufts'
    },
    {
      firstName: 'Joselyn',
      lastName: 'Estrada Pascual',
      company: 'Temple',
      jobTitle: 'Manager',
      expected: 'Should handle complex Hispanic names correctly'
    }
  ];
  
  console.log('Running improved finder tests...\n');
  
  testCases.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.firstName} ${test.lastName}`);
    console.log(`Expected: ${test.expected}`);
    
    const result = findLinkedInProfileImproved(
      test.firstName,
      test.lastName,
      test.jobTitle,
      test.company
    );
    
    if (result.success) {
      console.log(`✓ Found: ${result.url}`);
      console.log(`  Confidence: ${result.confidence}%`);
      console.log(`  Strategy: ${result.strategyUsed}`);
    } else {
      console.log(`✗ Not found: ${result.message}`);
    }
    console.log('\n');
  });
}

// ==================== MENU FUNCTIONS ====================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('LinkedIn Finder v2')
    .addItem('Test Improved Finder', 'testImprovedFinder')
    .addItem('Process Selected Rows', 'processSelectedRowsV2')
    .addItem('Configure Settings', 'showConfigDialog')
    .addSeparator()
    .addItem('Enable Tier 3 (Fallback)', 'enableTier3')
    .addItem('Disable Tier 3', 'disableTier3')
    .addToUi();
}

function enableTier3() {
  CONFIG.tiers.tier3.enabled = true;
  SpreadsheetApp.getUi().alert('Tier 3 (Fallback strategies) enabled. Results will require manual review.');
}

function disableTier3() {
  CONFIG.tiers.tier3.enabled = false;
  SpreadsheetApp.getUi().alert('Tier 3 (Fallback strategies) disabled. Only high-confidence strategies will be used.');
}

function processSelectedRowsV2() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  const startRow = range.getRow();
  const numRows = range.getNumRows();
  
  // Assume columns: A=FirstName, B=LastName, C=Title, D=Company, E=State, F=LinkedIn URL, G=Confidence, H=Strategy Used
  
  for (let i = 0; i < numRows; i++) {
    const row = startRow + i;
    const firstName = sheet.getRange(row, 1).getValue();
    const lastName = sheet.getRange(row, 2).getValue();
    const title = sheet.getRange(row, 3).getValue();
    const company = sheet.getRange(row, 4).getValue();
    const state = sheet.getRange(row, 5).getValue();
    
    if (firstName && lastName) {
      const result = findLinkedInProfileImproved(firstName, lastName, title, company, state);
      
      if (result.success) {
        sheet.getRange(row, 6).setValue(result.url);
        sheet.getRange(row, 7).setValue(`${result.confidence.toFixed(1)}%`);
        sheet.getRange(row, 8).setValue(result.strategyUsed);
        
        // Color code based on confidence
        if (result.confidence >= 90) {
          sheet.getRange(row, 6, 1, 3).setBackground('#d4edda'); // Green
        } else if (result.requiresReview) {
          sheet.getRange(row, 6, 1, 3).setBackground('#fff3cd'); // Yellow
        }
      } else {
        sheet.getRange(row, 6).setValue('Not Found');
        sheet.getRange(row, 7).setValue(result.reason || 'No match');
        sheet.getRange(row, 6, 1, 2).setBackground('#f8d7da'); // Red
      }
    }
    
    // Add delay to avoid rate limiting
    Utilities.sleep(1000);
  }
  
  SpreadsheetApp.getUi().alert('Processing complete!');
}