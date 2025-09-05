/**
 * LinkedIn Profile Finder - Adaptive Version v5.0
 * Balanced approach: Finds more people while avoiding wrong matches
 * Key fixes: Location is HQ not person, executives have multiple companies, better role detection
 */

// ==================== CONFIGURATION ====================
const API_KEY = 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';

// Adaptive Configuration - Less rigid, but still safe
const CONFIG = {
  // Two-Pass System - Balanced thresholds
  passes: {
    first: {
      minScore: 65,           // Lowered from 80 - more flexible
      minCompanyScore: 40,    // Lowered from 60 - allows partial matches
      requireExactName: true,
      requireCompany: false,  // Not mandatory - executives may have multiple
      maxStrategies: 4,
      description: 'Primary search - good confidence'
    },
    second: {
      minScore: 50,           // Reasonable threshold
      minCompanyScore: 25,    // Very flexible
      requireExactName: false,
      requireCompany: false,
      maxStrategies: 5,
      flagForReview: true,
      description: 'Fallback search - needs review'
    }
  },
  
  // Quality Control
  quality: {
    autoRejectThreshold: 40,    // Reasonable floor
    autoAcceptThreshold: 85,    // High confidence only
    reviewThreshold: 60,         // Middle ground needs review
    rejectOnNameContamination: true,  // Still important
    ignoreLocationMismatch: true      // Location is HQ, not person
  },
  
  // System Settings
  debugMode: true,
  currentIndustry: 'healthcare'
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
  'UVM': {
    aliases: ['University of Vermont Medical', 'UVM Medical Center', 'UVMMC', 'Vermont Medical'],
    keyWords: ['Vermont', 'UVM'],
    commonTitles: ['Supervisor', 'Manager', 'Director', 'Nurse']
  },
  'Jefferson': {
    aliases: ['Thomas Jefferson University', 'Jefferson Health', 'TJUH', 'Sidney Kimmel'],
    keyWords: ['Jefferson'],
    commonTitles: ['Professor', 'VP', 'Clinical', 'Medical']
  },
  'Tower Health': {
    aliases: ['Tower', 'Reading Hospital'],
    keyWords: ['Tower'],
    commonTitles: ['Chair', 'Vice Chair', 'Director', 'Chief']
  },
  'Mount Sinai': {
    aliases: ['Mount Sinai Health', 'MSH', 'Mt Sinai', 'Mount Sinai Hospital'],
    keyWords: ['Sinai', 'Mount Sinai'],
    commonTitles: ['Director', 'VP', 'Chief', 'Manager']
  }
};

// ==================== IMPROVED NAME VALIDATION ====================
function validateNameMatch(content, firstName, lastName, strict = true) {
  if (!content) return { isValid: false, confidence: 0 };
  
  const contentLower = content.toLowerCase();
  const firstNameLower = firstName.toLowerCase();
  const lastNameLower = lastName.toLowerCase();
  
  // CRITICAL: Still detect obvious wrong matches
  // Check for reversed names (Pascual Estrada → Jorge Estrada Pascual)
  const reversedPattern = new RegExp(`\\b\\w+\\s+${lastNameLower}\\s+${firstNameLower}\\b`, 'i');
  if (reversedPattern.test(content)) {
    return { 
      isValid: false, 
      confidence: 0, 
      contamination: true,
      reason: 'Reversed name order - wrong person'
    };
  }
  
  // Check for different first name with same last name (Mary Yurick → Alissa Yurick)
  // But be careful - some people use nicknames or middle names
  const namePattern = new RegExp(`\\b(\\w+)\\s+${lastNameLower}\\b`, 'gi');
  const matches = [...content.matchAll(namePattern)];
  
  if (matches.length > 0) {
    const foundFirstNames = matches.map(m => m[1].toLowerCase());
    const hasCorrectFirstName = foundFirstNames.some(name => 
      name === firstNameLower || 
      name.startsWith(firstNameLower.substring(0, 3)) || // Nickname check
      firstNameLower.startsWith(name.substring(0, 3))     // Nickname check
    );
    
    if (!hasCorrectFirstName && !contentLower.includes(firstNameLower)) {
      // Check if it might be a middle name situation
      const possibleMiddleName = contentLower.includes(firstNameLower.charAt(0));
      if (!possibleMiddleName) {
        return {
          isValid: false,
          confidence: 0,
          contamination: true,
          reason: 'Different first name - likely wrong person'
        };
      }
    }
  }
  
  // Positive matching patterns
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fName = escapeRegex(firstName);
  const lName = escapeRegex(lastName);
  
  const patterns = [
    {
      regex: new RegExp(`\\b${fName}\\s+${lName}\\b`, 'i'),
      confidence: 100,
      description: 'Exact match'
    },
    {
      regex: new RegExp(`\\b${lName},\\s*${fName}\\b`, 'i'),
      confidence: 95,
      description: 'LinkedIn format'
    },
    {
      regex: new RegExp(`\\b${fName}\\s+\\w\\.?\\s+${lName}\\b`, 'i'),
      confidence: 90,
      description: 'With middle initial'
    },
    {
      regex: new RegExp(`\\b${fName[0]}\\.?\\s*${lName}\\b`, 'i'),
      confidence: 70,
      description: 'Initial + last name'
    }
  ];
  
  // Check patterns
  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      return { 
        isValid: true, 
        confidence: pattern.confidence,
        matchType: pattern.description
      };
    }
  }
  
  // Relaxed check - both names present nearby
  if (!strict) {
    if (contentLower.includes(firstNameLower) && contentLower.includes(lastNameLower)) {
      const firstIndex = contentLower.indexOf(firstNameLower);
      const lastIndex = contentLower.indexOf(lastNameLower);
      const distance = Math.abs(lastIndex - firstIndex);
      
      if (distance < 30) {
        return {
          isValid: true,
          confidence: 60,
          matchType: 'Names found nearby'
        };
      }
    }
  }
  
  return { isValid: false, confidence: 0 };
}

// ==================== SMART COMPANY MATCHING ====================
function validateCompany(resultContent, targetCompany) {
  if (!targetCompany) {
    return { valid: true, confidence: 40, reason: 'No company specified' };
  }
  
  const contentLower = resultContent.toLowerCase();
  const targetLower = targetCompany.toLowerCase();
  
  // Direct match
  if (contentLower.includes(targetLower)) {
    return { valid: true, confidence: 100 };
  }
  
  // Check healthcare systems
  for (const [system, config] of Object.entries(HEALTHCARE_SYSTEMS)) {
    const systemLower = system.toLowerCase();
    
    // Check if target matches this system
    const targetIsThisSystem = 
      targetLower.includes(systemLower) ||
      config.aliases.some(alias => targetLower.includes(alias.toLowerCase())) ||
      config.keyWords.some(word => targetLower.includes(word.toLowerCase()));
    
    if (targetIsThisSystem) {
      // Check if result matches this system
      const resultMatchesSystem = 
        config.keyWords.some(word => contentLower.includes(word.toLowerCase())) ||
        config.aliases.some(alias => contentLower.includes(alias.toLowerCase()));
      
      if (resultMatchesSystem) {
        return { 
          valid: true, 
          confidence: 90,
          system: system,
          reason: 'Healthcare system match'
        };
      }
    }
  }
  
  // Check for executives with multiple affiliations
  // High-level executives often have multiple companies listed
  const executiveIndicators = ['chief', 'president', 'vp', 'vice president', 'executive', 
                               'professor', 'clinical', 'chair', 'director'];
  
  const hasExecutiveRole = executiveIndicators.some(indicator => 
    contentLower.includes(indicator)
  );
  
  if (hasExecutiveRole) {
    // For executives, be more flexible with company matching
    const targetWords = targetLower.split(/\s+/).filter(w => w.length > 2);
    const matchingWords = targetWords.filter(word => contentLower.includes(word));
    
    if (matchingWords.length > 0) {
      const matchRatio = matchingWords.length / targetWords.length;
      return {
        valid: true,
        confidence: Math.max(50, matchRatio * 100),
        reason: 'Executive with partial company match',
        matchedWords: matchingWords
      };
    }
    
    // Executive without company match - still possible if other signals strong
    return {
      valid: true,
      confidence: 30,
      reason: 'Executive role - may have multiple affiliations'
    };
  }
  
  // Partial word matching for non-executives
  const targetWords = targetLower.split(/\s+/).filter(w => w.length > 2);
  const matchingWords = targetWords.filter(word => contentLower.includes(word));
  
  if (matchingWords.length >= 2 || 
      (matchingWords.length === 1 && matchingWords[0].length > 4)) {
    return {
      valid: true,
      confidence: (matchingWords.length / targetWords.length) * 80,
      matchedWords: matchingWords
    };
  }
  
  // No good match
  return {
    valid: false,
    confidence: 20,
    reason: 'Insufficient company match'
  };
}

// ==================== IMPROVED ROLE/TITLE EXTRACTION & VALIDATION ====================
function extractAndValidateRole(content, targetTitle) {
  // Common patterns where roles appear in LinkedIn search results
  const rolePatterns = [
    // "Name - Title at Company"
    /\-\s*([^-|•]+?)(?:\s+at\s+|\s*\||$)/i,
    // "Name | Title - Company"
    /\|\s*([^-|•]+?)(?:\s*\-|\s*•|$)/i,
    // "Title at Company"
    /^([^-|•]+?)(?:\s+at\s+[A-Z])/i,
    // After name, before company
    /[A-Z][a-z]+\s+[A-Z][a-z]+\s*[\-|•]\s*([^-|•]+?)(?:\s+at\s+|\s*[\-|•])/i,
    // Common role keywords anywhere
    /((?:Chief|Director|Manager|Analyst|Vice President|VP|SVP|EVP|President|Clinical|Professor|Chair|Supervisor|Coordinator|Administrator|Nurse|Doctor|Physician|Specialist|Lead|Head|Senior|Principal)[^|•\n]*)/i
  ];
  
  let extractedRole = '';
  
  for (const pattern of rolePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      extractedRole = match[1].trim();
      // Clean up the extracted role
      extractedRole = extractedRole
        .replace(/\s*\|.*$/, '')
        .replace(/\s*-.*$/, '')
        .replace(/\s+at\s+.*$/, '')
        .trim();
      
      if (extractedRole && extractedRole.length > 2) {
        break;
      }
    }
  }
  
  if (!targetTitle) {
    return { 
      valid: true, 
      confidence: 40,
      extractedRole: extractedRole,
      reason: 'No target title to validate'
    };
  }
  
  const targetLower = targetTitle.toLowerCase();
  const extractedLower = extractedRole.toLowerCase();
  
  // Direct match
  if (extractedLower.includes(targetLower) || targetLower.includes(extractedLower)) {
    return {
      valid: true,
      confidence: 95,
      extractedRole: extractedRole,
      reason: 'Direct title match'
    };
  }
  
  // Check key role words
  const roleCategories = {
    executive: ['chief', 'president', 'executive', 'ceo', 'cfo', 'cto', 'cio', 'cmo'],
    leadership: ['vp', 'vice president', 'svp', 'evp', 'director', 'head', 'chair'],
    management: ['manager', 'supervisor', 'lead', 'coordinator'],
    clinical: ['clinical', 'medical', 'physician', 'doctor', 'nurse', 'therapist'],
    technical: ['analyst', 'engineer', 'developer', 'architect', 'specialist'],
    academic: ['professor', 'associate professor', 'assistant professor', 'clinical professor']
  };
  
  // Find categories for both target and extracted
  let targetCategory = null;
  let extractedCategory = null;
  
  for (const [category, keywords] of Object.entries(roleCategories)) {
    if (keywords.some(kw => targetLower.includes(kw))) {
      targetCategory = category;
    }
    if (keywords.some(kw => extractedLower.includes(kw))) {
      extractedCategory = category;
    }
  }
  
  // Same category = good match
  if (targetCategory && targetCategory === extractedCategory) {
    return {
      valid: true,
      confidence: 75,
      extractedRole: extractedRole,
      category: targetCategory,
      reason: 'Same role category'
    };
  }
  
  // Check for important matching words
  const targetWords = targetLower.split(/\s+/).filter(w => w.length > 3);
  const extractedWords = extractedLower.split(/\s+/).filter(w => w.length > 3);
  
  const matchingWords = targetWords.filter(tw => 
    extractedWords.some(ew => ew === tw || ew.includes(tw) || tw.includes(ew))
  );
  
  if (matchingWords.length > 0) {
    const confidence = Math.min(60, (matchingWords.length / targetWords.length) * 100);
    return {
      valid: true,
      confidence: confidence,
      extractedRole: extractedRole,
      matchingWords: matchingWords,
      reason: 'Partial title match'
    };
  }
  
  // No role match but not a rejection
  return {
    valid: true,
    confidence: 30,
    extractedRole: extractedRole || 'Not found',
    reason: 'No clear title match'
  };
}

// ==================== EXTRACT COMPANY FROM CONTENT ====================
function extractCompanyFromContent(content) {
  if (!content) return '';
  
  // Improved patterns for company extraction
  const patterns = [
    // "at Company | LinkedIn"
    /\bat\s+([A-Z][^|•\-\n]*?)(?:\s*[\|•\-]|\s*LinkedIn|$)/i,
    // "- Company"
    /\-\s+([A-Z][^|•\-\n]*?)(?:\s*[\|•]|$)/i,
    // "works at Company"
    /(?:works?\s+at|employed\s+by)\s+([A-Z][^|•\-\n]*?)(?:\s*[\|•\-]|$)/i,
    // After title, before LinkedIn
    /(?:at|@)\s+([A-Z][^|•\-\n]*?)(?:\s*LinkedIn|$)/i,
    // Healthcare-specific
    /\b((?:Tufts|Temple|Mount\s+Sinai|Jefferson|Tower|UVM|Vermont)[^|•\-\n]*?)(?:\s*[\|•\-]|$)/i
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      let company = match[1].trim();
      // Clean up
      company = company
        .replace(/\s*\|.*$/, '')
        .replace(/\s*LinkedIn.*$/i, '')
        .replace(/\s*[\-•].*$/, '')
        .trim();
      
      if (company && company.length > 2 && !company.toLowerCase().includes('linkedin')) {
        return company;
      }
    }
  }
  
  return '';
}

// ==================== ADAPTIVE SCORING SYSTEM ====================
function scoreSearchResult(item, person, strategy) {
  const content = `${item.title || ''} ${item.snippet || ''}`;
  
  // Initialize result
  const result = {
    url: item.link,
    scores: {},
    validations: {},
    confidence: 0,
    accepted: false,
    needsReview: false,
    rejectionReasons: []
  };
  
  // 1. Name Validation (Critical - 40% weight)
  const nameValidation = validateNameMatch(content, person.firstName, person.lastName, true);
  result.validations.name = nameValidation;
  
  // Hard reject on contamination
  if (nameValidation.contamination) {
    result.rejectionReasons.push(nameValidation.reason);
    return result;
  }
  
  result.scores.name = nameValidation.isValid ? (nameValidation.confidence / 100) * 40 : 0;
  
  // 2. Company Validation (Important but flexible - 30% weight)
  const extractedCompany = extractCompanyFromContent(content);
  const companyValidation = validateCompany(content, person.company);
  result.validations.company = companyValidation;
  result.extractedCompany = extractedCompany;
  
  result.scores.company = (companyValidation.confidence / 100) * 30;
  
  // 3. Role/Title Validation (Supporting signal - 25% weight)
  const roleValidation = extractAndValidateRole(content, person.jobTitle);
  result.validations.role = roleValidation;
  result.extractedRole = roleValidation.extractedRole;
  
  result.scores.role = (roleValidation.confidence / 100) * 25;
  
  // 4. Search Strategy Quality (5% weight)
  result.scores.strategy = (strategy.confidence / 100) * 5;
  
  // Calculate total
  result.scores.total = 
    result.scores.name +
    result.scores.company +
    result.scores.role +
    result.scores.strategy;
  
  // Boost for strong signals
  if (nameValidation.confidence >= 95 && companyValidation.confidence >= 60) {
    result.scores.total += 10; // Boost for strong match
  }
  
  // Determine acceptance
  const passConfig = CONFIG.passes[strategy.pass || 'first'];
  result.confidence = Math.round(result.scores.total);
  
  // Accept if meets thresholds
  if (result.scores.total >= passConfig.minScore) {
    // Only reject if name is definitely wrong
    if (nameValidation.isValid || (!nameValidation.contamination && result.scores.total >= 60)) {
      result.accepted = true;
      
      // Flag for review if uncertain
      if (result.scores.total < CONFIG.quality.autoAcceptThreshold ||
          companyValidation.confidence < 50 ||
          nameValidation.confidence < 80) {
        result.needsReview = true;
        result.reviewReason = 'Medium confidence - please verify';
      }
    }
  }
  
  return result;
}

// ==================== BUILD SEARCH STRATEGIES ====================
function buildSearchStrategies(person, pass) {
  const { firstName, lastName, jobTitle, company, state } = person;
  const fullName = `${firstName} ${lastName}`.trim();
  const strategies = [];
  
  if (pass === 'first') {
    // Start with most specific
    if (company && jobTitle) {
      strategies.push({
        query: `"${fullName}" "${jobTitle}" "${company}" site:linkedin.com/in/`,
        tier: 1,
        confidence: 90,
        description: 'Full details search'
      });
    }
    
    if (company) {
      strategies.push({
        query: `"${fullName}" "${company}" site:linkedin.com/in/`,
        tier: 1,
        confidence: 85,
        description: 'Name + company'
      });
    }
    
    if (jobTitle) {
      strategies.push({
        query: `"${fullName}" "${jobTitle}" site:linkedin.com/in/`,
        tier: 1,
        confidence: 80,
        description: 'Name + title'
      });
    }
    
    // LinkedIn format
    strategies.push({
      query: `"${lastName}, ${firstName}" site:linkedin.com/in/`,
      tier: 1,
      confidence: 75,
      description: 'LinkedIn name format'
    });
  } else {
    // Second pass - broader
    if (company) {
      const mainWord = company.split(' ').find(w => w.length > 3) || company.split(' ')[0];
      strategies.push({
        query: `"${fullName}" ${mainWord} site:linkedin.com/in/`,
        tier: 2,
        confidence: 70,
        description: 'Name + key company word'
      });
    }
    
    // Try without quotes on name
    strategies.push({
      query: `${firstName} ${lastName} ${company || ''} site:linkedin.com/in/`,
      tier: 2,
      confidence: 65,
      description: 'Flexible name search'
    });
    
    // Name only
    strategies.push({
      query: `"${fullName}" site:linkedin.com/in/`,
      tier: 2,
      confidence: 60,
      description: 'Name only'
    });
    
    // Very broad
    strategies.push({
      query: `${firstName} ${lastName} linkedin`,
      tier: 3,
      confidence: 50,
      description: 'Broad search'
    });
  }
  
  return strategies.slice(0, CONFIG.passes[pass].maxStrategies);
}

// ==================== MAIN SEARCH FUNCTION ====================
function findLinkedInProfile(firstName, lastName, jobTitle = '', company = '', state = '') {
  try {
    if (!firstName || !lastName) {
      return { error: 'Missing required name fields' };
    }
    
    const person = { firstName, lastName, jobTitle, company, state };
    
    if (CONFIG.debugMode) {
      console.log(`\n🔍 Searching: ${firstName} ${lastName}`);
      console.log(`   Company: ${company || 'Not specified'}`);
      console.log(`   Title: ${jobTitle || 'Not specified'}`);
    }
    
    // Try first pass
    let result = executeSearch(person, 'first');
    
    // Try second pass if needed
    if (!result || result.url === 'Not Found') {
      if (CONFIG.debugMode) {
        console.log('\n📡 Trying broader search...');
      }
      result = executeSearch(person, 'second');
      
      if (result && result.url !== 'Not Found') {
        result.flaggedForReview = true;
        result.reviewReason = 'Found in broad search - verify carefully';
      }
    }
    
    return result || {
      url: 'Not Found',
      confidence: 0,
      reason: 'No acceptable matches found'
    };
    
  } catch (error) {
    console.error('Error:', error);
    return { error: error.toString() };
  }
}

// ==================== EXECUTE SEARCH ====================
function executeSearch(person, pass) {
  const strategies = buildSearchStrategies(person, pass);
  const allResults = [];
  
  for (const strategy of strategies) {
    strategy.pass = pass;
    
    if (CONFIG.debugMode) {
      console.log(`\n📡 ${strategy.description}`);
    }
    
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(strategy.query)}&num=5`;
    
    try {
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.items) {
        for (const item of data.items) {
          if (item.link && item.link.includes('linkedin.com/in/')) {
            const scored = scoreSearchResult(item, person, strategy);
            
            if (CONFIG.debugMode) {
              console.log(`   Score: ${scored.confidence} - ${scored.accepted ? 'Accepted' : 'Rejected'}`);
              if (scored.extractedRole) {
                console.log(`   Role: ${scored.extractedRole}`);
              }
              if (scored.extractedCompany) {
                console.log(`   Company: ${scored.extractedCompany}`);
              }
            }
            
            if (scored.accepted) {
              allResults.push(scored);
            }
          }
        }
        
        // If we have good results, stop
        if (allResults.length > 0 && allResults.some(r => r.confidence >= 70)) {
          break;
        }
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    
    Utilities.sleep(300);
  }
  
  // Return best result
  if (allResults.length > 0) {
    allResults.sort((a, b) => b.confidence - a.confidence);
    const best = allResults[0];
    
    return {
      url: best.url,
      confidence: best.confidence,
      extractedCompany: best.extractedCompany,
      extractedRole: best.extractedRole,
      companyMatch: Math.round(best.validations.company.confidence),
      roleMatch: Math.round(best.validations.role.confidence),
      needsReview: best.needsReview,
      reviewReason: best.reviewReason
    };
  }
  
  return null;
}

// ==================== BATCH PROCESSING ====================
function batchFindLinkedInProfiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  setupColumns(sheet);
  
  const results = [];
  const stats = {
    found: 0,
    notFound: 0,
    needsReview: 0
  };
  
  for (let i = 1; i < values.length; i++) {
    const person = {
      firstName: values[i][0] || '',
      lastName: values[i][1] || '',
      jobTitle: values[i][2] || '',
      company: values[i][3] || '',
      state: values[i][4] || '' // Note: This is company HQ, not person location
    };
    
    if (!person.firstName || !person.lastName) {
      results.push(['', '', '', '', '', '']);
      continue;
    }
    
    console.log(`Processing ${i}/${values.length - 1}: ${person.firstName} ${person.lastName}`);
    
    const result = findLinkedInProfile(
      person.firstName,
      person.lastName,
      person.jobTitle,
      person.company,
      person.state
    );
    
    let status = '';
    if (result.url === 'Not Found') {
      status = 'Not Found';
      stats.notFound++;
    } else if (result.needsReview) {
      status = 'Review';
      stats.needsReview++;
    } else {
      status = 'Found';
      stats.found++;
    }
    
    results.push([
      result.url || '',
      result.confidence ? `${result.confidence}%` : '',
      result.extractedCompany || '',
      result.extractedRole || '',
      `${result.companyMatch || 0}%`,
      status
    ]);
    
    if (i % 10 === 0) {
      saveProgress(sheet, results);
    }
    
    Utilities.sleep(1000);
  }
  
  saveProgress(sheet, results);
  showSummary(stats);
}

// ==================== HELPER FUNCTIONS ====================
function setupColumns(sheet) {
  const headers = [
    'First Name', 'Last Name', 'Job Title', 'Company', 'Location (HQ)',
    'LinkedIn URL', 'Confidence', 'Found Company', 'Found Role', 'Company Match', 'Status'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
}

function saveProgress(sheet, results) {
  if (results.length > 0) {
    sheet.getRange(2, 6, results.length, 6).setValues(results);
  }
}

function showSummary(stats) {
  const total = stats.found + stats.notFound + stats.needsReview;
  const successRate = total > 0 ? Math.round(((stats.found + stats.needsReview) / total) * 100) : 0;
  
  SpreadsheetApp.getUi().alert(
    'Results',
    `✅ Found: ${stats.found}\n` +
    `⚠️ Review: ${stats.needsReview}\n` +
    `❌ Not Found: ${stats.notFound}\n\n` +
    `Success Rate: ${successRate}%`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ==================== TEST FUNCTION ====================
function testSingleProfile() {
  const test = {
    firstName: 'Shafiq',
    lastName: 'Rab',
    company: 'Tufts Medicine',
    jobTitle: 'Chief Digital Officer'
  };
  
  const result = findLinkedInProfile(
    test.firstName,
    test.lastName,
    test.jobTitle,
    test.company,
    ''
  );
  
  const message = `Test: ${test.firstName} ${test.lastName}\n\n` +
    `Result: ${result.url || 'Not Found'}\n` +
    `Confidence: ${result.confidence}%\n` +
    `Extracted Company: ${result.extractedCompany || 'None'}\n` +
    `Extracted Role: ${result.extractedRole || 'None'}\n` +
    `Company Match: ${result.companyMatch}%\n` +
    `Role Match: ${result.roleMatch}%\n` +
    `Needs Review: ${result.needsReview || false}`;
  
  SpreadsheetApp.getUi().alert('Test Result', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==================== MENU ====================
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🎯 LinkedIn Finder Adaptive')
    .addItem('🔍 Process All', 'batchFindLinkedInProfiles')
    .addItem('✅ Process Selected', 'processSelectedRows')
    .addItem('🧪 Test Profile', 'testSingleProfile')
    .addItem('ℹ️ About', () => {
      SpreadsheetApp.getUi().alert(
        'LinkedIn Finder Adaptive v5.0',
        'Balanced approach:\n\n' +
        '✅ Finds more profiles\n' +
        '✅ Avoids wrong person matches\n' +
        '✅ Shows extracted role & company\n' +
        '✅ Handles executives with multiple companies\n' +
        '✅ Location = Company HQ (not person)\n\n' +
        'Review items marked "Review" for best accuracy',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    })
    .addToUi();
}

function processSelectedRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  
  if (!range) {
    SpreadsheetApp.getUi().alert('Select rows first');
    return;
  }
  
  const startRow = range.getRow();
  const values = range.getValues();
  const results = [];
  
  for (const row of values) {
    if (!row[0] || !row[1]) {
      results.push(['', '', '', '', '', '']);
      continue;
    }
    
    const result = findLinkedInProfile(row[0], row[1], row[2], row[3], row[4]);
    
    results.push([
      result.url || '',
      result.confidence ? `${result.confidence}%` : '',
      result.extractedCompany || '',
      result.extractedRole || '',
      `${result.companyMatch || 0}%`,
      result.needsReview ? 'Review' : result.url === 'Not Found' ? 'Not Found' : 'Found'
    ]);
    
    Utilities.sleep(1000);
  }
  
  sheet.getRange(startRow, 6, results.length, 6).setValues(results);
  SpreadsheetApp.getUi().alert(`Processed ${results.length} rows`);
}