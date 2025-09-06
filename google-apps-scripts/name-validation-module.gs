/**
 * Name Validation Module for LinkedIn Profile Finder
 * BMAD Story 1: Implement Strict Name Pattern Validation
 * Prevents substring contamination and false positives
 */

// ==================== NAME VALIDATION CONFIGURATION ====================
const NAME_VALIDATION_CONFIG = {
  // Strict mode settings
  strictMode: true,
  requireWordBoundaries: true,
  preventSubstringMatches: true,
  
  // Pattern priorities (higher = better)
  patternPriorities: {
    exactOrder: 100,        // "FirstName LastName"
    linkedinFormat: 95,     // "LastName, FirstName"
    withMiddleInitial: 90,  // "FirstName M. LastName"
    withMiddleName: 85,     // "FirstName Middle LastName"
    reversedOrder: 70,      // "LastName FirstName" (some sites)
    withCredentials: 80,    // "FirstName LastName, MD"
    withPrefix: 75,         // "Dr. FirstName LastName"
  },
  
  // Special character handling
  specialChars: {
    apostrophe: ["'", "'", "`", "'"],  // Different apostrophe types
    hyphen: ["-", "–", "—"],            // Different dash types
    accents: true                        // Handle accented characters
  },
  
  // Debug settings
  debug: true,
  logPatternMatches: true
};

// ==================== NAME PREPROCESSING ====================
/**
 * Normalize name for consistent matching
 */
function normalizeName(name) {
  if (!name) return '';
  
  let normalized = name.trim();
  
  // Handle special apostrophes
  NAME_VALIDATION_CONFIG.specialChars.apostrophe.forEach(char => {
    normalized = normalized.replace(new RegExp(char, 'g'), "'");
  });
  
  // Handle special hyphens
  NAME_VALIDATION_CONFIG.specialChars.hyphen.forEach(char => {
    normalized = normalized.replace(new RegExp(char, 'g'), "-");
  });
  
  // Remove accent variations if needed (optional)
  if (NAME_VALIDATION_CONFIG.specialChars.accents) {
    const accentMap = {
      'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ã': 'a', 'å': 'a',
      'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e',
      'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i',
      'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'õ': 'o',
      'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u',
      'ñ': 'n', 'ç': 'c'
    };
    
    // Create both versions for matching
    const withAccents = normalized;
    const withoutAccents = normalized.replace(/[áàäâãåéèëêíìïîóòöôõúùüûñç]/gi, 
      match => accentMap[match.toLowerCase()] || match
    );
    
    return { original: normalized, withAccents, withoutAccents };
  }
  
  return { original: normalized };
}

// ==================== PATTERN GENERATION ====================
/**
 * Generate all possible name patterns for matching
 */
function generateNamePatterns(firstName, lastName) {
  const patterns = [];
  
  // Normalize names
  const firstNorm = normalizeName(firstName);
  const lastNorm = normalizeName(lastName);
  
  // Use the original normalized version
  const first = firstNorm.original;
  const last = lastNorm.original;
  
  // Escape special regex characters
  const firstEsc = escapeRegexString(first);
  const lastEsc = escapeRegexString(last);
  
  // Pattern A: "FirstName LastName" (exact order)
  patterns.push({
    regex: new RegExp(`\\b${firstEsc}\\s+${lastEsc}\\b`, 'i'),
    type: 'exactOrder',
    priority: NAME_VALIDATION_CONFIG.patternPriorities.exactOrder,
    description: 'Exact order: FirstName LastName'
  });
  
  // Pattern B: "LastName, FirstName" (LinkedIn format)
  patterns.push({
    regex: new RegExp(`\\b${lastEsc}\\s*,\\s*${firstEsc}\\b`, 'i'),
    type: 'linkedinFormat',
    priority: NAME_VALIDATION_CONFIG.patternPriorities.linkedinFormat,
    description: 'LinkedIn format: LastName, FirstName'
  });
  
  // Pattern C: "FirstName M. LastName" or "FirstName M LastName" (with middle initial)
  patterns.push({
    regex: new RegExp(`\\b${firstEsc}\\s+\\w\\.?\\s+${lastEsc}\\b`, 'i'),
    type: 'withMiddleInitial',
    priority: NAME_VALIDATION_CONFIG.patternPriorities.withMiddleInitial,
    description: 'With middle initial'
  });
  
  // Pattern D: "FirstName Middle LastName" (with full middle name)
  patterns.push({
    regex: new RegExp(`\\b${firstEsc}\\s+\\w+\\s+${lastEsc}\\b`, 'i'),
    type: 'withMiddleName',
    priority: NAME_VALIDATION_CONFIG.patternPriorities.withMiddleName,
    description: 'With middle name'
  });
  
  // Pattern E: "Dr. FirstName LastName" or "FirstName LastName, MD"
  patterns.push({
    regex: new RegExp(`\\b(?:Dr\\.?\\s+)?${firstEsc}\\s+${lastEsc}(?:\\s*,\\s*(?:MD|PhD|RN|NP|MBA|MSN|MPH))?\\b`, 'i'),
    type: 'withCredentials',
    priority: NAME_VALIDATION_CONFIG.patternPriorities.withCredentials,
    description: 'With professional titles/credentials'
  });
  
  // Pattern F: Handle special characters in names (O'Neill, García, etc.)
  if (first.includes("'") || last.includes("'") || first.includes("-") || last.includes("-")) {
    // Create variations with and without special chars
    const firstVar = first.replace(/'/g, '').replace(/-/g, ' ');
    const lastVar = last.replace(/'/g, '').replace(/-/g, ' ');
    
    patterns.push({
      regex: new RegExp(`\\b${escapeRegexString(firstVar)}\\s+${escapeRegexString(lastVar)}\\b`, 'i'),
      type: 'specialCharVariation',
      priority: NAME_VALIDATION_CONFIG.patternPriorities.exactOrder - 5,
      description: 'Special character variation'
    });
  }
  
  // Pattern G: Just the names together (LastName FirstName) - lower priority
  patterns.push({
    regex: new RegExp(`\\b${lastEsc}\\s+${firstEsc}\\b`, 'i'),
    type: 'reversedOrder',
    priority: NAME_VALIDATION_CONFIG.patternPriorities.reversedOrder,
    description: 'Reversed order: LastName FirstName'
  });
  
  return patterns;
}

// ==================== CONTAMINATION DETECTION ====================
/**
 * Detect if names appear in wrong context (contamination)
 */
function detectNameContamination(content, firstName, lastName, patterns) {
  const firstNorm = normalizeName(firstName).original.toLowerCase();
  const lastNorm = normalizeName(lastName).original.toLowerCase();
  const contentLower = content.toLowerCase();
  
  // Check if any pattern matched
  const patternMatched = patterns.some(p => p.regex.test(content));
  
  if (!patternMatched) {
    // Check if names appear separately (potential contamination)
    const hasFirst = new RegExp(`\\b${escapeRegexString(firstNorm)}\\b`, 'i').test(contentLower);
    const hasLast = new RegExp(`\\b${escapeRegexString(lastNorm)}\\b`, 'i').test(contentLower);
    
    if (hasFirst && hasLast) {
      // Names present but not in valid pattern
      // Check distance between names
      const firstIndex = contentLower.indexOf(firstNorm);
      const lastIndex = contentLower.indexOf(lastNorm);
      const distance = Math.abs(lastIndex - firstIndex);
      
      if (distance > 100) {
        return {
          contaminated: true,
          reason: 'Names found but too far apart',
          distance: distance
        };
      } else {
        return {
          contaminated: true,
          reason: 'Names found but not in valid pattern',
          distance: distance
        };
      }
    } else if (hasFirst || hasLast) {
      return {
        contaminated: true,
        reason: `Only ${hasFirst ? 'first' : 'last'} name found`,
        partial: true
      };
    }
  }
  
  return {
    contaminated: false,
    reason: patternMatched ? 'Valid pattern match' : 'Names not found'
  };
}

// ==================== MAIN VALIDATION FUNCTION ====================
/**
 * Strict name validation with pattern matching
 * @return {Object} Validation result with score, pattern, and details
 */
function validateNameStrictV2(content, firstName, lastName) {
  if (!content || !firstName || !lastName) {
    return {
      valid: false,
      score: 0,
      reason: 'Missing required data',
      details: null
    };
  }
  
  // Generate all possible patterns
  const patterns = generateNamePatterns(firstName, lastName);
  
  // Sort patterns by priority (highest first)
  patterns.sort((a, b) => b.priority - a.priority);
  
  let bestMatch = null;
  let matchedPattern = null;
  
  // Test each pattern
  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      bestMatch = {
        valid: true,
        score: pattern.priority,
        pattern: pattern.type,
        description: pattern.description
      };
      matchedPattern = pattern;
      
      if (NAME_VALIDATION_CONFIG.logPatternMatches && NAME_VALIDATION_CONFIG.debug) {
        console.log(`✓ Name match found: ${pattern.description} (score: ${pattern.priority})`);
      }
      
      // Use the best (first) match
      break;
    }
  }
  
  // Check for contamination if no valid pattern matched
  if (!bestMatch) {
    const contamination = detectNameContamination(content, firstName, lastName, patterns);
    
    if (contamination.contaminated) {
      return {
        valid: false,
        score: contamination.partial ? 20 : 30,
        reason: contamination.reason,
        contaminated: true,
        details: contamination
      };
    }
    
    return {
      valid: false,
      score: 0,
      reason: 'No name pattern matched',
      contaminated: false,
      details: {
        firstName: firstName,
        lastName: lastName,
        patternsChecked: patterns.length
      }
    };
  }
  
  // Additional validation: Check for false positives
  const falsePositiveCheck = checkForFalsePositives(content, firstName, lastName, matchedPattern);
  
  if (falsePositiveCheck.isFalsePositive) {
    return {
      valid: false,
      score: bestMatch.score * 0.5, // Reduce score significantly
      reason: falsePositiveCheck.reason,
      pattern: bestMatch.pattern,
      falsePositive: true
    };
  }
  
  return {
    valid: true,
    score: bestMatch.score,
    pattern: bestMatch.pattern,
    description: bestMatch.description,
    reason: 'Valid name match with high confidence',
    details: {
      firstName: firstName,
      lastName: lastName,
      matchedPattern: matchedPattern.type
    }
  };
}

// ==================== FALSE POSITIVE DETECTION ====================
/**
 * Additional checks to prevent false positives
 */
function checkForFalsePositives(content, firstName, lastName, pattern) {
  const contentLower = content.toLowerCase();
  const firstLower = firstName.toLowerCase();
  const lastLower = lastName.toLowerCase();
  
  // Check 1: Name appears multiple times (might be a list)
  const firstCount = (contentLower.match(new RegExp(`\\b${escapeRegexString(firstLower)}\\b`, 'gi')) || []).length;
  const lastCount = (contentLower.match(new RegExp(`\\b${escapeRegexString(lastLower)}\\b`, 'gi')) || []).length;
  
  if (firstCount > 3 || lastCount > 3) {
    return {
      isFalsePositive: true,
      reason: 'Name appears too many times - possible list or directory'
    };
  }
  
  // Check 2: Common name confusion patterns
  // Example: "Joselyn Estrada Pascual" matching search for "Pascual Estrada"
  if (pattern.type === 'reversedOrder' || pattern.type === 'specialCharVariation') {
    // Extract the actual matched text
    const match = content.match(pattern.regex);
    if (match) {
      const matchedText = match[0];
      
      // Check if there are additional words that might indicate a different person
      const surroundingText = content.substring(
        Math.max(0, content.indexOf(matchedText) - 50),
        Math.min(content.length, content.indexOf(matchedText) + matchedText.length + 50)
      );
      
      // Look for indicators of a different person
      if (/\b(Jr|Sr|II|III|IV)\b/i.test(surroundingText) && 
          !new RegExp(`\\b(Jr|Sr|II|III|IV)\\b`, 'i').test(firstName + ' ' + lastName)) {
        return {
          isFalsePositive: true,
          reason: 'Generation suffix mismatch'
        };
      }
    }
  }
  
  // Check 3: Context indicators
  const negativeContext = [
    'not', 'except', 'excluding', 'other than', 'instead of',
    'replaced', 'formerly', 'previous', 'successor'
  ];
  
  for (const word of negativeContext) {
    const regex = new RegExp(`${word}\\s+\\w+\\s+${escapeRegexString(firstLower)}`, 'i');
    if (regex.test(contentLower)) {
      return {
        isFalsePositive: true,
        reason: `Negative context detected: "${word}"`
      };
    }
  }
  
  return {
    isFalsePositive: false,
    reason: 'No false positive indicators detected'
  };
}

// ==================== HELPER FUNCTIONS ====================
/**
 * Escape special regex characters in a string
 */
function escapeRegexString(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ==================== TEST FUNCTIONS ====================
/**
 * Test the name validation module
 */
function testNameValidation() {
  const testCases = [
    {
      content: 'Kelly O\'Neill - Director at Mount Sinai Health System',
      firstName: 'Kelly',
      lastName: 'O\'Neill',
      expected: 'Should match with special character'
    },
    {
      content: 'Profile of Arianna Bonné, Healthcare Executive',
      firstName: 'Kelly',
      lastName: 'O\'Neill',
      expected: 'Should NOT match - wrong person'
    },
    {
      content: 'Estrada Pascual, Joselyn - Manager at Temple Health',
      firstName: 'Pascual',
      lastName: 'Estrada',
      expected: 'Should NOT match - names in wrong context'
    },
    {
      content: 'Pascual Estrada, MD - Vice President at Tufts Medicine',
      firstName: 'Pascual',
      lastName: 'Estrada',
      expected: 'Should match correctly'
    },
    {
      content: 'Dr. María García-López, Chief Medical Officer',
      firstName: 'María',
      lastName: 'García-López',
      expected: 'Should match with accents and hyphens'
    },
    {
      content: 'LinkedIn profile: Smith, John Michael - Senior Director',
      firstName: 'John',
      lastName: 'Smith',
      expected: 'Should match with middle name'
    }
  ];
  
  console.log('=' .repeat(60));
  console.log('NAME VALIDATION MODULE TEST');
  console.log('=' .repeat(60));
  
  testCases.forEach((test, index) => {
    console.log(`\nTest ${index + 1}: ${test.firstName} ${test.lastName}`);
    console.log(`Content: "${test.content}"`);
    console.log(`Expected: ${test.expected}`);
    
    const result = validateNameStrictV2(test.content, test.firstName, test.lastName);
    
    console.log('Result:');
    console.log(`  Valid: ${result.valid}`);
    console.log(`  Score: ${result.score}`);
    console.log(`  Pattern: ${result.pattern || 'None'}`);
    console.log(`  Reason: ${result.reason}`);
    
    if (result.contaminated) {
      console.log(`  ⚠️  Contamination detected: ${result.details.reason}`);
    }
    if (result.falsePositive) {
      console.log(`  ⚠️  False positive detected`);
    }
    
    console.log(result.valid ? '✓ PASS' : '✗ FAIL');
  });
  
  console.log('\n' + '=' .repeat(60));
}

// ==================== EXPORT FOR USE IN MAIN SCRIPT ====================
/**
 * This function can be called from the main LinkedIn finder script
 */
function getNameValidator() {
  return {
    validate: validateNameStrictV2,
    generatePatterns: generateNamePatterns,
    detectContamination: detectNameContamination,
    config: NAME_VALIDATION_CONFIG
  };
}