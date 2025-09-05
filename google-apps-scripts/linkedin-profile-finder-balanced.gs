// Replace with your actual API key and Search Engine ID
const API_KEY = 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';

// BALANCED Configuration - Less rigid, but still avoiding wrong matches
const CONFIG = {
  minCompanyScore: 30,      // Lowered from 60 - more flexible company matching
  minTotalScore: 50,         // Lowered from 70 - accept more results
  allowBroadSearch: true,    // Changed to true - enable fallback strategies
  requireExactNameOrder: false, // New - allow more name variations
  debugMode: true
};

// Expanded company aliases database
const COMPANY_ALIASES = {
  'Mount Sinai': ['Mount Sinai Health', 'Mount Sinai Health System', 'MSH', 'Mount Sinai Hospital', 'Mount Sinai Medical', 'Mt Sinai', 'Mt. Sinai'],
  'Adventhealth': ['AdventHealth', 'Advent Health', 'Florida Hospital', 'AH', 'Advent'],
  'NYU': ['NYU Langone', 'NYU Langone Health', 'New York University', 'NYU Medical', 'NYU Hospital'],
  'Mayo Clinic': ['Mayo', 'Mayo Clinic Health System', 'Mayo Health', 'Mayo Medical'],
  'Cleveland Clinic': ['Cleveland Clinic Foundation', 'CCF', 'Cleveland Clinic Health', 'Cleveland Medical'],
  'Johns Hopkins': ['Johns Hopkins Medicine', 'JHM', 'Johns Hopkins Hospital', 'JHH', 'Hopkins'],
  'Kaiser': ['Kaiser Permanente', 'Kaiser Foundation', 'KP', 'Kaiser Health'],
  'HCA': ['HCA Healthcare', 'Hospital Corporation of America', 'HCA Health'],
  'Northwell': ['Northwell Health', 'North Shore-LIJ', 'Northshore', 'North Shore'],
  'Providence': ['Providence Health', 'Providence St. Joseph', 'Providence Health & Services', 'Providence Medical']
};

/**
 * BALANCED Search Strategies - More strategies, better coverage
 */
function buildSearchStrategies(firstName, lastName, jobTitle, company, state) {
  const fullName = `${firstName} ${lastName}`.trim();
  const cleanCompany = cleanCompanyName(company);
  
  const strategies = [];
  
  // Tier 1: High Precision (but not too strict)
  if (company) {
    strategies.push({
      query: `"${fullName}" "${cleanCompany}" site:linkedin.com/in/`,
      tier: 1,
      confidence: 90,
      description: 'Exact name + full company'
    });
    
    // Try with just main company word
    const mainCompanyWord = cleanCompany.split(' ')[0];
    if (mainCompanyWord && mainCompanyWord.length > 3) {
      strategies.push({
        query: `"${fullName}" ${mainCompanyWord} site:linkedin.com/in/`,
        tier: 1,
        confidence: 85,
        description: 'Exact name + main company word'
      });
    }
  }
  
  // Tier 2: Medium Precision (more flexible)
  if (company) {
    // Last name, First name format
    strategies.push({
      query: `"${lastName}, ${firstName}" "${cleanCompany}" site:linkedin.com/in/`,
      tier: 2,
      confidence: 80,
      description: 'Name variation + company'
    });
    
    // Without quotes on company for partial matching
    strategies.push({
      query: `"${fullName}" ${cleanCompany} site:linkedin.com/in/`,
      tier: 2,
      confidence: 75,
      description: 'Name + company (flexible)'
    });
  }
  
  // Name with title if available
  if (jobTitle) {
    strategies.push({
      query: `"${fullName}" "${jobTitle}" site:linkedin.com/in/`,
      tier: 2,
      confidence: 70,
      description: 'Name + title'
    });
  }
  
  // Name with state if available
  if (state) {
    strategies.push({
      query: `"${fullName}" "${state}" site:linkedin.com/in/`,
      tier: 2,
      confidence: 65,
      description: 'Name + location'
    });
  }
  
  // Tier 3: Broader searches (but still LinkedIn-focused)
  strategies.push({
    query: `"${fullName}" site:linkedin.com/in/`,
    tier: 3,
    confidence: 60,
    description: 'Name only on LinkedIn'
  });
  
  // Alternative name format
  strategies.push({
    query: `"${firstName}" "${lastName}" linkedin profile`,
    tier: 3,
    confidence: 55,
    description: 'Name with LinkedIn keyword'
  });
  
  // Very broad - last resort
  if (CONFIG.allowBroadSearch) {
    strategies.push({
      query: `${firstName} ${lastName} ${cleanCompany} linkedin`,
      tier: 3,
      confidence: 50,
      description: 'Broad search - all terms'
    });
  }
  
  return strategies;
}

/**
 * BALANCED Name Validation - Less strict but still avoiding contamination
 */
function validateNameMatch(content, firstName, lastName) {
  if (!content) return { isValid: false, confidence: 0 };
  
  const contentLower = content.toLowerCase();
  const firstNameLower = firstName.toLowerCase();
  const lastNameLower = lastName.toLowerCase();
  
  // Quick contamination check - reject obvious wrong matches
  const wrongPatterns = [
    // These patterns indicate it's definitely the wrong person
    new RegExp(`\\b${lastNameLower}\\s+${firstNameLower}\\s+(associates|company|group|llc|inc)\\b`, 'i'),
    new RegExp(`\\b(dr|mr|ms|mrs)\\s+${lastNameLower}\\s+and\\s+${firstNameLower}\\b`, 'i'),
  ];
  
  for (const pattern of wrongPatterns) {
    if (pattern.test(content)) {
      if (CONFIG.debugMode) {
        console.log(`❌ Name contamination detected: Wrong pattern match`);
      }
      return { isValid: false, confidence: 0, contamination: true };
    }
  }
  
  // Flexible name matching - various acceptable patterns
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fName = escapeRegex(firstName);
  const lName = escapeRegex(lastName);
  
  const patterns = [
    {
      regex: new RegExp(`\\b${fName}\\s+${lName}\\b`, 'i'),
      confidence: 100,
      description: 'FirstName LastName'
    },
    {
      regex: new RegExp(`\\b${lName},\\s*${fName}\\b`, 'i'),
      confidence: 95,
      description: 'LastName, FirstName'
    },
    {
      regex: new RegExp(`\\b${fName}\\s+\\w\\.?\\s+${lName}\\b`, 'i'),
      confidence: 90,
      description: 'FirstName M LastName'
    },
    {
      regex: new RegExp(`\\b${fName}\\s+"[^"]*"\\s+${lName}\\b`, 'i'),
      confidence: 85,
      description: 'FirstName "Nickname" LastName'
    },
    {
      regex: new RegExp(`\\b${fName[0]}\\.?\\s+${lName}\\b`, 'i'),
      confidence: 75,
      description: 'F. LastName'
    }
  ];
  
  // Check patterns
  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      if (CONFIG.debugMode) {
        console.log(`✅ Name match: ${pattern.description} (${pattern.confidence}% confidence)`);
      }
      return { isValid: true, confidence: pattern.confidence };
    }
  }
  
  // Relaxed validation - if both names appear close to each other, likely valid
  if (contentLower.includes(firstNameLower) && contentLower.includes(lastNameLower)) {
    // Check if names are within reasonable distance (not across the entire text)
    const firstIndex = contentLower.indexOf(firstNameLower);
    const lastIndex = contentLower.indexOf(lastNameLower);
    const distance = Math.abs(lastIndex - firstIndex);
    
    // If names are within 50 characters of each other, probably the same person
    if (distance < 50) {
      if (CONFIG.debugMode) {
        console.log(`✅ Name match: Both names present nearby (60% confidence)`);
      }
      return { isValid: true, confidence: 60 };
    }
  }
  
  return { isValid: false, confidence: 0 };
}

/**
 * BALANCED Company Scoring - More forgiving
 */
function scoreCompanyMatch(resultCompany, targetCompany) {
  if (!targetCompany) return 50; // If no company provided, neutral score
  if (!resultCompany) return 30; // If no company in result, low but not zero
  
  // Clean both companies
  const cleanTarget = cleanCompanyName(targetCompany);
  const cleanResult = cleanCompanyName(resultCompany);
  
  // Exact match
  if (cleanResult === cleanTarget) {
    if (CONFIG.debugMode) console.log(`✅ Exact company match`);
    return 100;
  }
  
  // Check if one contains the other
  const targetLower = cleanTarget.toLowerCase();
  const resultLower = cleanResult.toLowerCase();
  
  if (resultLower.includes(targetLower) || targetLower.includes(resultLower)) {
    if (CONFIG.debugMode) console.log(`✅ Company substring match`);
    return 85;
  }
  
  // Check aliases
  for (const [main, aliases] of Object.entries(COMPANY_ALIASES)) {
    const allVariations = [main.toLowerCase(), ...aliases.map(a => a.toLowerCase())];
    
    if (allVariations.some(v => targetLower.includes(v) || v.includes(targetLower))) {
      if (allVariations.some(v => resultLower.includes(v) || v.includes(resultLower))) {
        if (CONFIG.debugMode) console.log(`✅ Company alias match`);
        return 80;
      }
    }
  }
  
  // Word overlap scoring - more lenient
  const targetWords = targetLower.split(/\s+/).filter(w => w.length > 2);
  const resultWords = resultLower.split(/\s+/).filter(w => w.length > 2);
  
  if (targetWords.length === 0) return 40; // No target words to match
  
  // Count matching words (including partial matches)
  let matchCount = 0;
  for (const targetWord of targetWords) {
    if (resultWords.some(rw => rw === targetWord || rw.includes(targetWord) || targetWord.includes(rw))) {
      matchCount++;
    }
  }
  
  // More generous scoring
  const score = (matchCount / targetWords.length) * 100;
  
  // Boost score if at least one important word matches
  const importantWords = ['hospital', 'health', 'medical', 'clinic', 'center', 'university', 'institute'];
  const hasImportantMatch = targetWords.some(tw => 
    importantWords.includes(tw) && resultWords.some(rw => rw === tw)
  );
  
  const finalScore = hasImportantMatch ? Math.min(score + 20, 100) : score;
  
  if (CONFIG.debugMode) {
    console.log(`📊 Company match: ${Math.round(finalScore)}% (${matchCount}/${targetWords.length} words)`);
  }
  
  return finalScore;
}

/**
 * BALANCED Scoring System - More forgiving thresholds
 */
function scoreSearchResult(item, firstName, lastName, company, jobTitle, strategy) {
  const content = `${item.title || ''} ${item.snippet || ''}`;
  
  // Name validation (0-40 points)
  const nameValidation = validateNameMatch(content, firstName, lastName);
  let nameScore = 0;
  
  if (nameValidation.contamination) {
    nameScore = 0; // Still reject contaminated names
  } else if (nameValidation.isValid) {
    nameScore = (nameValidation.confidence / 100) * 40;
  } else {
    // Partial credit if names are at least present
    const hasFirstName = content.toLowerCase().includes(firstName.toLowerCase());
    const hasLastName = content.toLowerCase().includes(lastName.toLowerCase());
    if (hasFirstName && hasLastName) {
      nameScore = 10; // Some points for having both names
    }
  }
  
  // Company matching (0-30 points) - more lenient
  const extractedCompany = extractCompanyFromContent(content);
  const companyMatchScore = scoreCompanyMatch(extractedCompany, company);
  const companyScore = (companyMatchScore / 100) * 30;
  
  // Title/role matching (0-20 points) - more flexible
  let titleScore = 0;
  if (jobTitle) {
    const titleWords = jobTitle.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const contentLower = content.toLowerCase();
    const matchingWords = titleWords.filter(w => contentLower.includes(w));
    titleScore = titleWords.length > 0 ? (matchingWords.length / titleWords.length) * 20 : 10;
  } else {
    titleScore = 10; // Default points if no title to match
  }
  
  // Strategy confidence (0-10 points)
  const strategyScore = (strategy.confidence / 100) * 10;
  
  // Calculate total
  const totalScore = nameScore + companyScore + titleScore + strategyScore;
  
  // Boost score for strong signals
  let boostedScore = totalScore;
  
  // Boost if LinkedIn URL is clean and contains name-like pattern
  if (item.link && item.link.includes('linkedin.com/in/')) {
    const urlPath = item.link.split('linkedin.com/in/')[1];
    if (urlPath) {
      const urlParts = urlPath.toLowerCase().replace(/[^a-z]/g, '');
      const firstNameClean = firstName.toLowerCase().replace(/[^a-z]/g, '');
      const lastNameClean = lastName.toLowerCase().replace(/[^a-z]/g, '');
      
      if (urlParts.includes(firstNameClean) || urlParts.includes(lastNameClean)) {
        boostedScore += 10; // URL boost
        if (CONFIG.debugMode) {
          console.log('   +10 boost: Name in LinkedIn URL');
        }
      }
    }
  }
  
  const breakdown = {
    name: Math.round(nameScore),
    company: Math.round(companyScore),
    title: Math.round(titleScore),
    strategy: Math.round(strategyScore),
    total: Math.round(boostedScore)
  };
  
  if (CONFIG.debugMode) {
    console.log(`📊 Score: ${breakdown.total}/100 (Name:${breakdown.name} Company:${breakdown.company} Title:${breakdown.title})`);
  }
  
  return {
    url: item.link,
    score: boostedScore,
    breakdown: breakdown,
    accepted: boostedScore >= CONFIG.minTotalScore && !nameValidation.contamination,
    companyMatch: companyMatchScore,
    nameContamination: nameValidation.contamination || false
  };
}

/**
 * Extract company from content - improved extraction
 */
function extractCompanyFromContent(content) {
  if (!content) return '';
  
  // More patterns to extract company
  const patterns = [
    /(?:at|@)\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*[|\-•]|\s+LinkedIn|$)/i,
    /(?:works? at|employed by|with)\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*[|\-•]|$)/i,
    /[•·]\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*[|\-•]|$)/i,
    /\|\s+([A-Z][^|•\-\n]{2,50}?)(?:\s*\||$)/i,
    /(?:^|\n)([A-Z][^|•\-\n]{2,50}?)(?:\s*[|\-•])/i
  ];
  
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const extracted = match[1].trim();
      // Clean up common suffixes
      return extracted.replace(/\s*(LinkedIn|Profile|View|See|Experience)$/i, '').trim();
    }
  }
  
  return '';
}

/**
 * Main finder with better fallback logic
 */
function findLinkedInProfile(firstName, lastName, jobTitle = '', company = '', state = '') {
  try {
    if (!firstName || !lastName) {
      return { error: 'Missing required name fields' };
    }
    
    const strategies = buildSearchStrategies(firstName, lastName, jobTitle, company, state);
    const allResults = [];
    let strategiesAttempted = 0;
    const maxStrategies = 5; // Try up to 5 strategies before giving up
    
    if (CONFIG.debugMode) {
      console.log(`\n🔍 Searching: ${firstName} ${lastName} at ${company || 'Any company'}`);
    }
    
    // Try strategies until we find good results
    for (const strategy of strategies) {
      strategiesAttempted++;
      
      if (CONFIG.debugMode) {
        console.log(`\n📡 Strategy ${strategiesAttempted}: ${strategy.description}`);
      }
      
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(strategy.query)}&num=5`;
      
      try {
        const response = UrlFetchApp.fetch(url);
        const data = JSON.parse(response.getContentText());
        
        if (data.error) {
          console.error('API Error:', data.error.message);
          continue;
        }
        
        if (data.items && data.items.length > 0) {
          // Score all results
          for (const item of data.items) {
            if (item.link && item.link.includes('linkedin.com/in/')) {
              const scoredResult = scoreSearchResult(item, firstName, lastName, company, jobTitle, strategy);
              
              // Accept results even with lower scores
              if (scoredResult.accepted) {
                allResults.push(scoredResult);
              }
            }
          }
          
          // If we have any acceptable results, we can stop
          if (allResults.length > 0 && strategiesAttempted >= 2) {
            if (CONFIG.debugMode) {
              console.log(`✅ Found ${allResults.length} matches, stopping search`);
            }
            break;
          }
        }
        
        // Stop if we've tried enough strategies
        if (strategiesAttempted >= maxStrategies) {
          break;
        }
        
      } catch (error) {
        console.error(`Error with strategy: ${error.toString()}`);
      }
      
      Utilities.sleep(300);
    }
    
    // Return the best result
    if (allResults.length > 0) {
      allResults.sort((a, b) => b.score - a.score);
      const best = allResults[0];
      
      if (CONFIG.debugMode) {
        console.log(`\n✅ BEST MATCH: Score ${Math.round(best.score)}/100`);
      }
      
      return {
        url: best.url,
        confidence: Math.round(best.score),
        companyMatch: Math.round(best.companyMatch),
        breakdown: best.breakdown
      };
    }
    
    // If no results, try one more time with very broad search
    if (CONFIG.allowBroadSearch && strategiesAttempted < strategies.length) {
      if (CONFIG.debugMode) {
        console.log('\n🔄 No results found, trying broadest search...');
      }
      
      const broadQuery = `${firstName} ${lastName} linkedin`;
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(broadQuery)}&num=3`;
      
      try {
        const response = UrlFetchApp.fetch(url);
        const data = JSON.parse(response.getContentText());
        
        if (data.items) {
          for (const item of data.items) {
            if (item.link && item.link.includes('linkedin.com/in/')) {
              // Very basic validation - just check if names are present
              const content = `${item.title} ${item.snippet}`;
              const hasFirstName = content.toLowerCase().includes(firstName.toLowerCase());
              const hasLastName = content.toLowerCase().includes(lastName.toLowerCase());
              
              if (hasFirstName && hasLastName) {
                return {
                  url: item.link,
                  confidence: 40, // Low confidence
                  companyMatch: 0,
                  breakdown: { name: 20, company: 0, title: 0, strategy: 20, total: 40 },
                  lowConfidence: true
                };
              }
            }
          }
        }
      } catch (error) {
        console.error('Broad search error:', error);
      }
    }
    
    if (CONFIG.debugMode) {
      console.log('\n❌ No acceptable matches found');
    }
    
    return { 
      url: 'Not Found',
      confidence: 0,
      reason: 'No results found - try adding more details'
    };
    
  } catch (error) {
    console.error('Error in findLinkedInProfile:', error);
    return { 
      error: error.toString(),
      url: 'Error'
    };
  }
}

/**
 * Clean company name helper
 */
function cleanCompanyName(company) {
  if (!company) return '';
  
  return company
    .replace(/[,.]$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Batch processing
 */
function batchFindLinkedInProfiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Add headers
  if (values[0][5] !== 'LinkedIn URL') {
    sheet.getRange(1, 6).setValue('LinkedIn URL');
    sheet.getRange(1, 7).setValue('Confidence %');
    sheet.getRange(1, 8).setValue('Company Match %');
    sheet.getRange(1, 9).setValue('Status');
  }
  
  const results = [];
  let successCount = 0;
  let lowConfidenceCount = 0;
  let notFoundCount = 0;
  
  for (let i = 1; i < values.length; i++) {
    const firstName = values[i][0] || '';
    const lastName = values[i][1] || '';
    const jobTitle = values[i][2] || '';
    const company = values[i][3] || '';
    const state = values[i][4] || '';
    
    if (!firstName && !lastName) {
      results.push(['', '', '', '']);
      continue;
    }
    
    console.log(`Processing ${i}/${values.length - 1}: ${firstName} ${lastName}`);
    
    const result = findLinkedInProfile(firstName, lastName, jobTitle, company, state);
    
    if (result.url && result.url !== 'Not Found' && result.url !== 'Error') {
      const status = result.lowConfidence ? 'Found (Low Confidence)' : 'Found';
      results.push([
        result.url,
        result.confidence + '%',
        result.companyMatch + '%',
        status
      ]);
      
      if (result.lowConfidence) {
        lowConfidenceCount++;
      } else {
        successCount++;
      }
    } else {
      results.push([
        'Not Found',
        '0%',
        '0%',
        result.reason || 'No matches'
      ]);
      notFoundCount++;
    }
    
    Utilities.sleep(1000);
  }
  
  // Write results
  if (results.length > 0) {
    sheet.getRange(2, 6, results.length, 4).setValues(results);
  }
  
  // Show summary
  const total = successCount + lowConfidenceCount + notFoundCount;
  const overallSuccess = successCount + lowConfidenceCount;
  const successRate = total > 0 ? Math.round((overallSuccess / total) * 100) : 0;
  
  SpreadsheetApp.getUi().alert(
    `✅ Processing Complete!\n\n` +
    `High Confidence: ${successCount}\n` +
    `Low Confidence: ${lowConfidenceCount}\n` +
    `Not Found: ${notFoundCount}\n` +
    `Overall Success Rate: ${successRate}%\n\n` +
    `Check confidence scores for quality!`
  );
}

/**
 * Process selected rows
 */
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
    const firstName = values[i][0] || '';
    const lastName = values[i][1] || '';
    const jobTitle = values[i][2] || '';
    const company = values[i][3] || '';
    const state = values[i][4] || '';
    
    if (!firstName && !lastName) {
      results.push(['', '', '', '']);
      continue;
    }
    
    const result = findLinkedInProfile(firstName, lastName, jobTitle, company, state);
    
    if (result.url && result.url !== 'Not Found' && result.url !== 'Error') {
      const status = result.lowConfidence ? 'Low Confidence' : 'Found';
      results.push([
        result.url,
        result.confidence + '%',
        result.companyMatch + '%',
        status
      ]);
    } else {
      results.push([
        'Not Found',
        '0%',
        '0%',
        result.reason || 'No matches'
      ]);
    }
    
    Utilities.sleep(1000);
  }
  
  if (results.length > 0) {
    sheet.getRange(startRow, 6, results.length, 4).setValues(results);
  }
  
  SpreadsheetApp.getUi().alert(`Processed ${results.length} rows`);
}

/**
 * Test with a single profile
 */
function testSingleProfile() {
  // Modify these test values as needed
  const result = findLinkedInProfile('Kelly', "O'Neill", '', 'Adventhealth', '');
  
  const message = result.url !== 'Not Found' && result.url !== 'Error' ?
    `✅ Found: ${result.url}\nConfidence: ${result.confidence}%\nCompany Match: ${result.companyMatch}%` :
    `❌ Not Found\nReason: ${result.reason || 'No matches'}`;
  
  SpreadsheetApp.getUi().alert('Test Result', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Configuration dialog
 */
function showConfiguration() {
  const ui = SpreadsheetApp.getUi();
  
  ui.alert(
    'Current Configuration',
    `These settings balance accuracy vs coverage:\n\n` +
    `Min Company Score: ${CONFIG.minCompanyScore}% (30 = flexible)\n` +
    `Min Total Score: ${CONFIG.minTotalScore}/100 (50 = balanced)\n` +
    `Allow Broad Search: ${CONFIG.allowBroadSearch}\n` +
    `Debug Mode: ${CONFIG.debugMode}\n\n` +
    `Lower scores = more results but less accurate\n` +
    `Higher scores = fewer results but more accurate`,
    ui.ButtonSet.OK
  );
}

/**
 * Menu setup
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎯 LinkedIn Finder Balanced')
    .addItem('🔍 Find All Profiles', 'batchFindLinkedInProfiles')
    .addItem('✅ Process Selected Rows', 'processSelectedRows')
    .addSeparator()
    .addItem('🧪 Test Single Profile', 'testSingleProfile')
    .addItem('⚙️ Show Configuration', 'showConfiguration')
    .addToUi();
}