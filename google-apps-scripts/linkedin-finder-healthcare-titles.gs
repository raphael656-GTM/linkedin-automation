/**
 * LinkedIn Profile Finder - Healthcare Title Enhancement v6.0
 * Advanced title matching for complex healthcare positions
 * Handles multi-part titles, academic positions, and abbreviations
 */

// ==================== CONFIGURATION ====================
const API_KEY = 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';

// Adaptive Configuration - Less rigid, but still safe
const CONFIG = {
  // Two-Pass System - Balanced thresholds
  passes: {
    first: {
      minScore: 65,           
      minCompanyScore: 40,    
      requireExactName: true,
      requireCompany: false,  
      maxStrategies: 4,
      description: 'Primary search - good confidence'
    },
    second: {
      minScore: 50,           
      minCompanyScore: 25,    
      requireExactName: false,
      requireCompany: false,
      maxStrategies: 5,
      flagForReview: true,
      description: 'Fallback search - needs review'
    }
  },
  
  // Quality Control
  quality: {
    autoRejectThreshold: 40,    
    autoAcceptThreshold: 85,    
    reviewThreshold: 60,         
    rejectOnNameContamination: true,  
    ignoreLocationMismatch: true      
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
    aliases: ['University of Vermont Medical', 'UVM Medical Center', 'UVMMC', 'Vermont Medical', 'University of Vermont Health Network'],
    keyWords: ['Vermont', 'UVM'],
    commonTitles: ['Supervisor', 'Manager', 'Director', 'Nurse']
  },
  'Jefferson': {
    aliases: ['Thomas Jefferson University', 'Jefferson Health', 'TJUH', 'Sidney Kimmel', 'Jefferson Medical Group'],
    keyWords: ['Jefferson', 'Kimmel'],
    commonTitles: ['Professor', 'VP', 'Clinical', 'Medical']
  },
  'Tower Health': {
    aliases: ['Tower', 'Reading Hospital'],
    keyWords: ['Tower'],
    commonTitles: ['Chair', 'Vice Chair', 'Director', 'Chief']
  },
  'Mount Sinai': {
    aliases: ['Mount Sinai Health', 'MSH', 'Mt Sinai', 'Mount Sinai Hospital', 'MSK'],
    keyWords: ['Sinai', 'Mount Sinai', 'MSK'],
    commonTitles: ['Director', 'VP', 'Chief', 'Manager']
  },
  'Mass General Brigham': {
    aliases: ['MGB', 'Partners Healthcare', 'Massachusetts General', 'Brigham', 'MGH'],
    keyWords: ['Brigham', 'MGB', 'Mass General'],
    commonTitles: ['Director', 'Chief', 'President', 'Manager']
  },
  'Penn State Health': {
    aliases: ['Penn State', 'Penn State Medical', 'Penn State College of Medicine'],
    keyWords: ['Penn State'],
    commonTitles: ['Professor', 'Chief', 'Director', 'VP']
  },
  'NewYork-Presbyterian': {
    aliases: ['NYP', 'NY Presbyterian', 'NewYork Presbyterian', 'NYP BMH'],
    keyWords: ['Presbyterian', 'NYP'],
    commonTitles: ['Director', 'Chief', 'Manager', 'VP']
  },
  'BILH': {
    aliases: ['Beth Israel Lahey Health', 'Beth Israel', 'Lahey', 'BILH Solutions'],
    keyWords: ['BILH', 'Beth Israel', 'Lahey'],
    commonTitles: ['Executive Director', 'VP', 'Chief', 'Manager']
  },
  'Harrington': {
    aliases: ['Harrington Hospital', 'Harrington Healthcare'],
    keyWords: ['Harrington'],
    commonTitles: ['President', 'Director', 'Manager']
  }
};

// ==================== HEALTHCARE TITLE PATTERNS ====================
const HEALTHCARE_TITLE_PATTERNS = {
  // Executive levels with variations
  executive: {
    keywords: ['chief', 'president', 'executive'],
    patterns: [
      /\b(?:chief|president|executive)\s+(?:\w+\s+)*(?:officer|director)/gi,
      /\b(?:ceo|cfo|cto|cio|cmo|ciso|cmio|cno|coo)\b/gi,
      /\bevp\b|\bsvp\b|\bvp\b/gi,
      /\bexecutive\s+(?:vice\s+)?president/gi,
      /\bsenior\s+vice\s+president/gi,
      /\bsystem\s+(?:chief|vice\s+president)/gi
    ],
    weight: 100
  },
  
  // Clinical leadership
  clinical: {
    keywords: ['clinical', 'medical', 'nursing', 'physician'],
    patterns: [
      /\b(?:clinical|medical|nursing)\s+(?:\w+\s+)*(?:director|officer|leader)/gi,
      /\b(?:chief|senior)\s+(?:medical|nursing|clinical)\s+(?:officer|informatics)/gi,
      /\bassociate\s+chief/gi,
      /\bmedical\s+director/gi,
      /\bnursing\s+director/gi,
      /\bclinical\s+(?:director|manager|lead)/gi
    ],
    weight: 90
  },
  
  // Academic positions
  academic: {
    keywords: ['professor', 'chair', 'dean', 'lecturer'],
    patterns: [
      /\b(?:professor|associate\s+professor|assistant\s+professor|clinical\s+professor)/gi,
      /\b(?:chair|vice\s+chair|department\s+chair)/gi,
      /\b(?:dean|associate\s+dean|assistant\s+dean)/gi,
      /\blecturer/gi,
      /\balumni\s+professor/gi
    ],
    weight: 85
  },
  
  // Directors and managers
  management: {
    keywords: ['director', 'manager', 'supervisor', 'lead', 'head'],
    patterns: [
      /\b(?:executive|senior|associate|assistant)?\s*director/gi,
      /\b(?:senior|regional|program|project)?\s*manager/gi,
      /\bsupervisor/gi,
      /\b(?:team|technical|clinical)?\s*lead/gi,
      /\bhead\s+of/gi,
      /\badministrative\s+director/gi
    ],
    weight: 80
  },
  
  // Specialized healthcare roles
  specialized: {
    keywords: ['informatics', 'innovation', 'transformation', 'revenue', 'quality', 'compliance'],
    patterns: [
      /\b(?:chief|director)\s+.*?informatics/gi,
      /\b(?:chief|director)\s+.*?innovation/gi,
      /\b(?:chief|director)\s+.*?transformation/gi,
      /\brevenue\s+(?:cycle|integrity|management)/gi,
      /\bquality\s+(?:improvement|assurance|director)/gi,
      /\bcompliance\s+(?:officer|director|manager)/gi,
      /\bdigital\s+(?:health|transformation|experience)/gi
    ],
    weight: 85
  },
  
  // Technical roles
  technical: {
    keywords: ['analyst', 'specialist', 'coordinator', 'administrator'],
    patterns: [
      /\b(?:senior|lead|principal)?\s*analyst/gi,
      /\b(?:technical|clinical|technology)?\s*specialist/gi,
      /\bcoordinator/gi,
      /\badministrator/gi,
      /\barchitect/gi,
      /\bengineer/gi
    ],
    weight: 70
  },
  
  // Healthcare practitioners
  practitioners: {
    keywords: ['nurse', 'physician', 'doctor', 'therapist', 'practitioner'],
    patterns: [
      /\b(?:registered|clinical)?\s*nurse/gi,
      /\bnurse\s+(?:manager|practitioner|case\s+manager)/gi,
      /\bphysician/gi,
      /\bdoctor/gi,
      /\bpractitioner/gi,
      /\btherapist/gi,
      /\bhospitalist/gi
    ],
    weight: 75
  }
};

// ==================== TITLE NORMALIZATION ====================
function normalizeTitle(title) {
  if (!title) return '';
  
  // Remove common separators and clean up
  let normalized = title
    .replace(/[;,]/g, ' ')           // Replace semicolons and commas with spaces
    .replace(/\s+and\s+/gi, ' ')     // Remove 'and'
    .replace(/\s+&\s+/g, ' ')        // Remove '&'
    .replace(/\s+at\s+.*$/i, '')    // Remove company mentions
    .replace(/\s+\-\s+/g, ' ')       // Replace dashes with spaces
    .replace(/\s+/g, ' ')            // Multiple spaces to single
    .trim();
  
  // Expand common abbreviations
  const abbreviations = {
    'vp': 'vice president',
    'svp': 'senior vice president',
    'evp': 'executive vice president',
    'avp': 'associate vice president',
    'asst': 'assistant',
    'assoc': 'associate',
    'sr': 'senior',
    'jr': 'junior',
    'mgr': 'manager',
    'dir': 'director',
    'rcm': 'revenue cycle management',
    'it': 'information technology',
    'is': 'information services',
    'ai': 'artificial intelligence',
    'ceo': 'chief executive officer',
    'cfo': 'chief financial officer',
    'cio': 'chief information officer',
    'cto': 'chief technology officer',
    'cmo': 'chief marketing officer',
    'cno': 'chief nursing officer',
    'cmio': 'chief medical information officer',
    'ciso': 'chief information security officer',
    'rn': 'registered nurse',
    'np': 'nurse practitioner',
    'pa': 'physician assistant',
    'md': 'doctor',
    'phd': 'doctor',
    'mba': 'business administration'
  };
  
  // Replace abbreviations
  const words = normalized.toLowerCase().split(' ');
  const expanded = words.map(word => {
    const clean = word.replace(/[.,]/g, '');
    return abbreviations[clean] || word;
  }).join(' ');
  
  return expanded;
}

// ==================== EXTRACT KEY TITLE COMPONENTS ====================
function extractTitleComponents(title) {
  const normalized = normalizeTitle(title);
  const components = {
    level: '',        // executive, senior, associate, assistant
    role: '',         // president, director, manager, analyst
    department: '',   // clinical, medical, nursing, IT, finance
    specialization: '', // informatics, innovation, quality, etc.
    academic: '',     // professor, chair, dean
    credentials: []   // MD, PhD, RN, etc.
  };
  
  // Extract level
  const levelPatterns = [
    { pattern: /\bexecutive\b/i, value: 'executive' },
    { pattern: /\bsenior\b/i, value: 'senior' },
    { pattern: /\bassociate\b/i, value: 'associate' },
    { pattern: /\bassistant\b/i, value: 'assistant' },
    { pattern: /\bsystem\b/i, value: 'system' },
    { pattern: /\bregional\b/i, value: 'regional' },
    { pattern: /\bcorporate\b/i, value: 'corporate' }
  ];
  
  for (const {pattern, value} of levelPatterns) {
    if (pattern.test(normalized)) {
      components.level = value;
      break;
    }
  }
  
  // Extract primary role
  const rolePatterns = [
    { pattern: /\bpresident\b/i, value: 'president' },
    { pattern: /\bofficer\b/i, value: 'officer' },
    { pattern: /\bdirector\b/i, value: 'director' },
    { pattern: /\bmanager\b/i, value: 'manager' },
    { pattern: /\bsupervisor\b/i, value: 'supervisor' },
    { pattern: /\banalyst\b/i, value: 'analyst' },
    { pattern: /\bspecialist\b/i, value: 'specialist' },
    { pattern: /\bcoordinator\b/i, value: 'coordinator' },
    { pattern: /\blead\b/i, value: 'lead' },
    { pattern: /\bhead\b/i, value: 'head' }
  ];
  
  for (const {pattern, value} of rolePatterns) {
    if (pattern.test(normalized)) {
      components.role = value;
      break;
    }
  }
  
  // Extract department
  const deptPatterns = [
    { pattern: /\bclinical\b/i, value: 'clinical' },
    { pattern: /\bmedical\b/i, value: 'medical' },
    { pattern: /\bnursing\b/i, value: 'nursing' },
    { pattern: /\binformation\s+(?:technology|services|systems)\b/i, value: 'IT' },
    { pattern: /\bfinance\b|\bfinancial\b/i, value: 'finance' },
    { pattern: /\boperations?\b/i, value: 'operations' },
    { pattern: /\bquality\b/i, value: 'quality' },
    { pattern: /\brevenue\b/i, value: 'revenue' },
    { pattern: /\bdigital\b/i, value: 'digital' },
    { pattern: /\bpharmacy\b/i, value: 'pharmacy' }
  ];
  
  for (const {pattern, value} of deptPatterns) {
    if (pattern.test(normalized)) {
      components.department = value;
      break;
    }
  }
  
  // Extract specialization
  const specPatterns = [
    { pattern: /\binformatics\b/i, value: 'informatics' },
    { pattern: /\binnovation\b/i, value: 'innovation' },
    { pattern: /\btransformation\b/i, value: 'transformation' },
    { pattern: /\banalytics\b/i, value: 'analytics' },
    { pattern: /\bcompliance\b/i, value: 'compliance' },
    { pattern: /\bstrategy\b/i, value: 'strategy' },
    { pattern: /\bexperience\b/i, value: 'experience' },
    { pattern: /\bintegrity\b/i, value: 'integrity' },
    { pattern: /\baccess\b/i, value: 'access' },
    { pattern: /\bgovernance\b/i, value: 'governance' }
  ];
  
  for (const {pattern, value} of specPatterns) {
    if (pattern.test(normalized)) {
      components.specialization = value;
      break;
    }
  }
  
  // Extract academic positions
  if (/professor|chair|dean|lecturer/i.test(normalized)) {
    if (/professor/i.test(normalized)) components.academic = 'professor';
    else if (/chair/i.test(normalized)) components.academic = 'chair';
    else if (/dean/i.test(normalized)) components.academic = 'dean';
    else if (/lecturer/i.test(normalized)) components.academic = 'lecturer';
  }
  
  // Extract credentials
  const credentialPatterns = /\b(MD|PhD|RN|NP|PA|MBA|MSN|DNP|MPH|MHA|FACHE|CPHIMS|PMP)\b/gi;
  const credentials = normalized.match(credentialPatterns);
  if (credentials) {
    components.credentials = [...new Set(credentials.map(c => c.toUpperCase()))];
  }
  
  return components;
}

// ==================== FUZZY TITLE MATCHING ====================
function fuzzyTitleMatch(targetTitle, extractedTitle) {
  if (!targetTitle || !extractedTitle) {
    return { match: false, confidence: 0 };
  }
  
  // Get components for both titles
  const targetComponents = extractTitleComponents(targetTitle);
  const extractedComponents = extractTitleComponents(extractedTitle);
  
  // Normalize both titles
  const targetNorm = normalizeTitle(targetTitle);
  const extractedNorm = normalizeTitle(extractedTitle);
  
  let score = 0;
  let maxScore = 0;
  let matches = [];
  
  // Check component matches
  if (targetComponents.role && extractedComponents.role) {
    maxScore += 30;
    if (targetComponents.role === extractedComponents.role) {
      score += 30;
      matches.push(`Role: ${targetComponents.role}`);
    }
  }
  
  if (targetComponents.level && extractedComponents.level) {
    maxScore += 20;
    if (targetComponents.level === extractedComponents.level) {
      score += 20;
      matches.push(`Level: ${targetComponents.level}`);
    }
  }
  
  if (targetComponents.department && extractedComponents.department) {
    maxScore += 20;
    if (targetComponents.department === extractedComponents.department) {
      score += 20;
      matches.push(`Dept: ${targetComponents.department}`);
    }
  }
  
  if (targetComponents.specialization && extractedComponents.specialization) {
    maxScore += 15;
    if (targetComponents.specialization === extractedComponents.specialization) {
      score += 15;
      matches.push(`Spec: ${targetComponents.specialization}`);
    }
  }
  
  if (targetComponents.academic && extractedComponents.academic) {
    maxScore += 15;
    if (targetComponents.academic === extractedComponents.academic) {
      score += 15;
      matches.push(`Academic: ${targetComponents.academic}`);
    }
  }
  
  // Check pattern matches
  for (const [category, config] of Object.entries(HEALTHCARE_TITLE_PATTERNS)) {
    const targetMatches = config.patterns.some(pattern => pattern.test(targetTitle));
    const extractedMatches = config.patterns.some(pattern => pattern.test(extractedTitle));
    
    if (targetMatches && extractedMatches) {
      score += config.weight * 0.2;
      maxScore += config.weight * 0.2;
      matches.push(`Category: ${category}`);
    }
  }
  
  // Word similarity check
  const targetWords = targetNorm.split(' ').filter(w => w.length > 2);
  const extractedWords = extractedNorm.split(' ').filter(w => w.length > 2);
  
  const commonWords = targetWords.filter(tw => 
    extractedWords.some(ew => {
      // Exact match
      if (tw === ew) return true;
      // Partial match (for variations)
      if (tw.length > 4 && ew.length > 4) {
        const similarity = calculateStringSimilarity(tw, ew);
        return similarity > 0.8;
      }
      return false;
    })
  );
  
  if (commonWords.length > 0) {
    const wordScore = (commonWords.length / Math.max(targetWords.length, extractedWords.length)) * 30;
    score += wordScore;
    maxScore += 30;
    if (commonWords.length > 1) {
      matches.push(`Common words: ${commonWords.join(', ')}`);
    }
  }
  
  // Calculate final confidence
  const confidence = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  
  // Determine if it's a match
  const isMatch = confidence >= 50 || 
                  (matches.length >= 2 && confidence >= 40) ||
                  (targetComponents.role === extractedComponents.role && confidence >= 35);
  
  return {
    match: isMatch,
    confidence: confidence,
    targetComponents: targetComponents,
    extractedComponents: extractedComponents,
    matches: matches,
    debug: {
      targetNorm: targetNorm,
      extractedNorm: extractedNorm,
      score: score,
      maxScore: maxScore
    }
  };
}

// ==================== STRING SIMILARITY (LEVENSHTEIN) ====================
function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

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

// ==================== ENHANCED ROLE/TITLE EXTRACTION & VALIDATION ====================
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
    /[A-Z][a-z]+\s+[A-Z][a-z]+\s*[\-|•]\s*([^-|•]+?)(?:\s+at\s+|\s*[\-|•])/i
  ];
  
  let extractedRole = '';
  
  // First try to extract the role from common patterns
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
  
  // If no role found, try to find key title words
  if (!extractedRole) {
    // Look for title keywords anywhere in the content
    for (const [category, config] of Object.entries(HEALTHCARE_TITLE_PATTERNS)) {
      for (const pattern of config.patterns) {
        const match = content.match(pattern);
        if (match) {
          extractedRole = match[0].trim();
          break;
        }
      }
      if (extractedRole) break;
    }
  }
  
  // If we have both target and extracted titles, do fuzzy matching
  if (targetTitle && extractedRole) {
    const fuzzyResult = fuzzyTitleMatch(targetTitle, extractedRole);
    
    return {
      valid: true,
      confidence: fuzzyResult.confidence,
      extractedRole: extractedRole,
      fuzzyMatch: fuzzyResult.match,
      matches: fuzzyResult.matches,
      targetComponents: fuzzyResult.targetComponents,
      extractedComponents: fuzzyResult.extractedComponents,
      reason: fuzzyResult.match ? 'Title components match' : 'Partial title match'
    };
  }
  
  // No target title to validate against
  if (!targetTitle) {
    return { 
      valid: true, 
      confidence: 40,
      extractedRole: extractedRole || 'Not found',
      reason: 'No target title to validate'
    };
  }
  
  // Have target but no extracted role
  return {
    valid: true,
    confidence: 20,
    extractedRole: 'Not found',
    reason: 'Could not extract role from content'
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
    /(?:at|@)\s+([A-Z][^|•\-\n]*?)(?:\s*LinkedIn|$)/i
  ];
  
  // Add healthcare-specific patterns
  for (const [system, config] of Object.entries(HEALTHCARE_SYSTEMS)) {
    const keywords = config.keyWords.join('|');
    const pattern = new RegExp(`\\b((?:${keywords})[^|•\\-\\n]*?)(?:\\s*[\\|•\\-]|$)`, 'i');
    patterns.push(pattern);
  }
  
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
  
  // 3. Enhanced Role/Title Validation (Supporting signal - 25% weight)
  const roleValidation = extractAndValidateRole(content, person.jobTitle);
  result.validations.role = roleValidation;
  result.extractedRole = roleValidation.extractedRole;
  
  // Give extra weight if fuzzy match is successful
  if (roleValidation.fuzzyMatch) {
    result.scores.role = Math.min((roleValidation.confidence / 100) * 35, 35);
  } else {
    result.scores.role = (roleValidation.confidence / 100) * 25;
  }
  
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
  
  // Extra boost for good title match with healthcare patterns
  if (roleValidation.fuzzyMatch && roleValidation.confidence >= 70) {
    result.scores.total += 5;
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
  
  // If we have a complex healthcare title, simplify it for search
  let searchTitle = jobTitle;
  if (jobTitle) {
    const components = extractTitleComponents(jobTitle);
    // Use the most important components for search
    const searchTerms = [];
    if (components.role) searchTerms.push(components.role);
    if (components.department && !searchTerms.includes(components.department)) {
      searchTerms.push(components.department);
    }
    if (searchTerms.length > 0) {
      searchTitle = searchTerms.join(' ');
    }
  }
  
  if (pass === 'first') {
    // Start with most specific
    if (company && searchTitle) {
      strategies.push({
        query: `"${fullName}" "${searchTitle}" "${company}" site:linkedin.com/in/`,
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
    
    if (searchTitle) {
      strategies.push({
        query: `"${fullName}" ${searchTitle} site:linkedin.com/in/`,
        tier: 1,
        confidence: 80,
        description: 'Name + title keywords'
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
    
    // Try with simplified title
    if (searchTitle) {
      const titleWords = searchTitle.split(' ').slice(0, 2).join(' ');
      strategies.push({
        query: `${firstName} ${lastName} ${titleWords} site:linkedin.com/in/`,
        tier: 2,
        confidence: 65,
        description: 'Flexible name + title'
      });
    }
    
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
      if (jobTitle) {
        const components = extractTitleComponents(jobTitle);
        console.log(`   Title Components:`, JSON.stringify(components));
      }
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
              if (scored.validations.role && scored.validations.role.fuzzyMatch) {
                console.log(`   Title Match: ${scored.validations.role.matches.join(', ')}`);
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
      titleMatches: best.validations.role.matches || [],
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
      results.push(['', '', '', '', '', '', '']);
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
      `${result.roleMatch || 0}%`,
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
    'LinkedIn URL', 'Confidence', 'Found Company', 'Found Role', 'Company Match', 'Role Match', 'Status'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
}

function saveProgress(sheet, results) {
  if (results.length > 0) {
    sheet.getRange(2, 6, results.length, 7).setValues(results);
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
    jobTitle: 'System Chief Medical Information Officer'
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
    `Title Matches: ${result.titleMatches ? result.titleMatches.join(', ') : 'None'}\n` +
    `Needs Review: ${result.needsReview || false}`;
  
  SpreadsheetApp.getUi().alert('Test Result', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ==================== MENU ====================
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🎯 LinkedIn Finder Healthcare')
    .addItem('🔍 Process All', 'batchFindLinkedInProfiles')
    .addItem('✅ Process Selected', 'processSelectedRows')
    .addItem('🧪 Test Profile', 'testSingleProfile')
    .addItem('ℹ️ About', () => {
      SpreadsheetApp.getUi().alert(
        'LinkedIn Finder Healthcare v6.0',
        'Healthcare-optimized title matching:\n\n' +
        '✅ Handles complex multi-part titles\n' +
        '✅ Understands healthcare abbreviations\n' +
        '✅ Fuzzy matching for title variations\n' +
        '✅ Academic position recognition\n' +
        '✅ Department and specialization matching\n\n' +
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
      results.push(['', '', '', '', '', '', '']);
      continue;
    }
    
    const result = findLinkedInProfile(row[0], row[1], row[2], row[3], row[4]);
    
    results.push([
      result.url || '',
      result.confidence ? `${result.confidence}%` : '',
      result.extractedCompany || '',
      result.extractedRole || '',
      `${result.companyMatch || 0}%`,
      `${result.roleMatch || 0}%`,
      result.needsReview ? 'Review' : result.url === 'Not Found' ? 'Not Found' : 'Found'
    ]);
    
    Utilities.sleep(1000);
  }
  
  sheet.getRange(startRow, 6, results.length, 7).setValues(results);
  SpreadsheetApp.getUi().alert(`Processed ${results.length} rows`);
}