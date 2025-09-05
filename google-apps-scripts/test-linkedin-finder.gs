/**
 * STORY 5: Comprehensive Test Suite for LinkedIn Profile Finder
 * Based on real-world failures and edge cases
 */

// Test configuration
const TEST_CONFIG = {
  runAllTests: true,
  verbose: true,
  stopOnFailure: false
};

/**
 * Test cases based on actual problems encountered
 */
const TEST_CASES = {
  nameContamination: [
    {
      id: 'NC1',
      description: 'Pascual Estrada should not match Joselyn Estrada Pascual',
      input: {
        firstName: 'Pascual',
        lastName: 'Estrada',
        company: 'Mount Sinai'
      },
      shouldReject: [
        'Joselyn Estrada Pascual',
        'Maria Pascual Estrada',
        'Estrada Pascual Associates'
      ],
      shouldAccept: [
        'Pascual Estrada',
        'Estrada, Pascual',
        'Pascual M. Estrada'
      ]
    },
    {
      id: 'NC2',
      description: 'Kelly O\'Neill should not match wrong names',
      input: {
        firstName: 'Kelly',
        lastName: 'O\'Neill',
        company: 'Adventhealth'
      },
      shouldReject: [
        'Arianna Bonné',
        'Kelly Smith',
        'John O\'Neill',
        'O\'Neill Kelly Associates'
      ],
      shouldAccept: [
        'Kelly O\'Neill',
        'O\'Neill, Kelly',
        'Kelly M. O\'Neill'
      ]
    },
    {
      id: 'NC3',
      description: 'Common name order issues',
      input: {
        firstName: 'John',
        lastName: 'Smith',
        company: 'Mayo Clinic'
      },
      shouldReject: [
        'Smith John Company',
        'Dr. Smith and John',
        'John\'s Smith Services'
      ],
      shouldAccept: [
        'John Smith',
        'Smith, John',
        'John A. Smith'
      ]
    }
  ],
  
  companyValidation: [
    {
      id: 'CV1',
      description: 'Same person at different company should be rejected',
      input: {
        firstName: 'Pascual',
        lastName: 'Estrada',
        company: 'Mount Sinai'
      },
      shouldReject: [
        { name: 'Pascual Estrada', company: 'Tufts Medicine' },
        { name: 'Pascual Estrada', company: 'NYU Langone' },
        { name: 'Pascual Estrada', company: 'Cleveland Clinic' }
      ],
      shouldAccept: [
        { name: 'Pascual Estrada', company: 'Mount Sinai Health' },
        { name: 'Pascual Estrada', company: 'MSH' },
        { name: 'Pascual Estrada', company: 'Mount Sinai Hospital' }
      ]
    },
    {
      id: 'CV2',
      description: 'Company aliases should be recognized',
      input: {
        firstName: 'Sarah',
        lastName: 'Johnson',
        company: 'Kaiser'
      },
      shouldAccept: [
        { name: 'Sarah Johnson', company: 'Kaiser Permanente' },
        { name: 'Sarah Johnson', company: 'KP' },
        { name: 'Sarah Johnson', company: 'Kaiser Foundation' }
      ]
    },
    {
      id: 'CV3',
      description: 'Partial company matches below threshold',
      input: {
        firstName: 'Michael',
        lastName: 'Chen',
        company: 'Stanford Health'
      },
      shouldReject: [
        { name: 'Michael Chen', company: 'Stanford University' }, // Different division
        { name: 'Michael Chen', company: 'Health Partners' }, // Only one word matches
        { name: 'Michael Chen', company: 'UC Health' } // Wrong institution
      ],
      shouldAccept: [
        { name: 'Michael Chen', company: 'Stanford Health Care' },
        { name: 'Michael Chen', company: 'Stanford Medicine' }
      ]
    }
  ],
  
  specialCharacters: [
    {
      id: 'SC1',
      description: 'Names with apostrophes',
      input: {
        firstName: 'Kelly',
        lastName: 'O\'Neill',
        company: 'Mayo Clinic'
      },
      expectedPatterns: [
        'Kelly O\'Neill',
        'O\'Neill, Kelly'
      ]
    },
    {
      id: 'SC2',
      description: 'Names with hyphens',
      input: {
        firstName: 'Marie-Claire',
        lastName: 'Dubois-Smith',
        company: 'Cleveland Clinic'
      },
      expectedPatterns: [
        'Marie-Claire Dubois-Smith',
        'Dubois-Smith, Marie-Claire'
      ]
    },
    {
      id: 'SC3',
      description: 'Names with accents',
      input: {
        firstName: 'José',
        lastName: 'García',
        company: 'HCA Healthcare'
      },
      expectedPatterns: [
        'José García',
        'Jose Garcia', // Should handle both with and without accents
        'García, José'
      ]
    }
  ],
  
  edgeCases: [
    {
      id: 'EC1',
      description: 'Single letter first name',
      input: {
        firstName: 'J',
        lastName: 'Smith',
        company: 'Northwell'
      },
      expectedBehavior: 'Should handle initial-only first names'
    },
    {
      id: 'EC2',
      description: 'Very long company name',
      input: {
        firstName: 'David',
        lastName: 'Brown',
        company: 'The Johns Hopkins Hospital and Health System Corporation'
      },
      expectedBehavior: 'Should match with shorter variations like Johns Hopkins'
    },
    {
      id: 'EC3',
      description: 'No company provided',
      input: {
        firstName: 'Alice',
        lastName: 'Williams',
        company: ''
      },
      expectedBehavior: 'Should only return results with very high name confidence'
    }
  ],
  
  performanceTests: [
    {
      id: 'PT1',
      description: 'Response time under 2 seconds',
      input: {
        firstName: 'Test',
        lastName: 'User',
        company: 'Test Company'
      },
      maxTime: 2000 // milliseconds
    }
  ]
};

/**
 * Run name validation tests
 */
function testNameValidation() {
  console.log('\n📝 TESTING NAME VALIDATION');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of TEST_CASES.nameContamination) {
    console.log(`\nTest ${testCase.id}: ${testCase.description}`);
    
    // Test rejection cases
    for (const rejectName of testCase.shouldReject) {
      const result = validateNameMatch(
        rejectName,
        testCase.input.firstName,
        testCase.input.lastName
      );
      
      if (result.isValid) {
        console.log(`  ❌ FAIL: Incorrectly accepted "${rejectName}"`);
        failed++;
      } else {
        console.log(`  ✅ PASS: Correctly rejected "${rejectName}"`);
        passed++;
      }
    }
    
    // Test acceptance cases
    for (const acceptName of testCase.shouldAccept) {
      const result = validateNameMatch(
        acceptName,
        testCase.input.firstName,
        testCase.input.lastName
      );
      
      if (!result.isValid) {
        console.log(`  ❌ FAIL: Incorrectly rejected "${acceptName}"`);
        failed++;
      } else {
        console.log(`  ✅ PASS: Correctly accepted "${acceptName}" (confidence: ${result.confidence}%)`);
        passed++;
      }
    }
  }
  
  return { passed, failed };
}

/**
 * Run company validation tests
 */
function testCompanyValidation() {
  console.log('\n🏢 TESTING COMPANY VALIDATION');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of TEST_CASES.companyValidation) {
    console.log(`\nTest ${testCase.id}: ${testCase.description}`);
    
    // Test rejection cases
    if (testCase.shouldReject) {
      for (const reject of testCase.shouldReject) {
        const score = scoreCompanyMatch(reject.company, testCase.input.company);
        
        if (score >= CONFIG.minCompanyScore) {
          console.log(`  ❌ FAIL: Score ${score}% for "${reject.company}" (should be < ${CONFIG.minCompanyScore}%)`);
          failed++;
        } else {
          console.log(`  ✅ PASS: Score ${score}% for "${reject.company}" (correctly below threshold)`);
          passed++;
        }
      }
    }
    
    // Test acceptance cases
    if (testCase.shouldAccept) {
      for (const accept of testCase.shouldAccept) {
        const score = scoreCompanyMatch(accept.company, testCase.input.company);
        
        if (score < CONFIG.minCompanyScore) {
          console.log(`  ❌ FAIL: Score ${score}% for "${accept.company}" (should be >= ${CONFIG.minCompanyScore}%)`);
          failed++;
        } else {
          console.log(`  ✅ PASS: Score ${score}% for "${accept.company}" (correctly above threshold)`);
          passed++;
        }
      }
    }
  }
  
  return { passed, failed };
}

/**
 * Run special character tests
 */
function testSpecialCharacters() {
  console.log('\n🔤 TESTING SPECIAL CHARACTERS');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of TEST_CASES.specialCharacters) {
    console.log(`\nTest ${testCase.id}: ${testCase.description}`);
    
    for (const pattern of testCase.expectedPatterns) {
      const result = validateNameMatch(
        pattern,
        testCase.input.firstName,
        testCase.input.lastName
      );
      
      if (!result.isValid) {
        console.log(`  ❌ FAIL: Failed to match "${pattern}"`);
        failed++;
      } else {
        console.log(`  ✅ PASS: Matched "${pattern}" (confidence: ${result.confidence}%)`);
        passed++;
      }
    }
  }
  
  return { passed, failed };
}

/**
 * Run search strategy tests
 */
function testSearchStrategies() {
  console.log('\n🔍 TESTING SEARCH STRATEGIES');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  // Test that strategies are properly tiered
  const testInputs = [
    { firstName: 'John', lastName: 'Doe', jobTitle: 'CEO', company: 'Acme Corp', state: 'CA' },
    { firstName: 'Jane', lastName: 'Smith', jobTitle: '', company: 'Tech Inc', state: '' },
    { firstName: 'Bob', lastName: 'Johnson', jobTitle: '', company: '', state: '' }
  ];
  
  for (const input of testInputs) {
    const strategies = buildSearchStrategies(
      input.firstName,
      input.lastName,
      input.jobTitle,
      input.company,
      input.state
    );
    
    console.log(`\nInput: ${input.firstName} ${input.lastName}, ${input.company || 'No company'}`);
    console.log(`  Strategies generated: ${strategies.length}`);
    
    // Check tier ordering
    let lastTier = 0;
    let correctOrder = true;
    
    for (const strategy of strategies) {
      if (strategy.tier < lastTier) {
        correctOrder = false;
        break;
      }
      lastTier = strategy.tier;
      console.log(`    Tier ${strategy.tier}: ${strategy.description} (${strategy.confidence}% confidence)`);
    }
    
    if (correctOrder) {
      console.log(`  ✅ PASS: Strategies in correct tier order`);
      passed++;
    } else {
      console.log(`  ❌ FAIL: Strategies not in correct tier order`);
      failed++;
    }
    
    // Check that broad searches are only included if configured
    const hasBroadSearch = strategies.some(s => s.tier === 3);
    if (hasBroadSearch && !CONFIG.allowBroadSearch) {
      console.log(`  ❌ FAIL: Broad search included when not allowed`);
      failed++;
    } else {
      console.log(`  ✅ PASS: Broad search configuration respected`);
      passed++;
    }
  }
  
  return { passed, failed };
}

/**
 * Run scoring system tests
 */
function testScoringSystem() {
  console.log('\n📊 TESTING SCORING SYSTEM');
  console.log('=' .repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  // Test various scoring scenarios
  const testScenarios = [
    {
      description: 'Perfect match should score high',
      item: {
        title: 'John Doe - CEO at Acme Corp',
        snippet: 'John Doe is the CEO of Acme Corp, leading innovation...',
        link: 'https://linkedin.com/in/johndoe'
      },
      input: { firstName: 'John', lastName: 'Doe', company: 'Acme Corp', jobTitle: 'CEO' },
      strategy: { tier: 1, confidence: 95 },
      expectedMinScore: 85
    },
    {
      description: 'Name match but wrong company should score low',
      item: {
        title: 'John Doe - CEO at Different Corp',
        snippet: 'John Doe leads Different Corp as CEO...',
        link: 'https://linkedin.com/in/johndoe2'
      },
      input: { firstName: 'John', lastName: 'Doe', company: 'Acme Corp', jobTitle: 'CEO' },
      strategy: { tier: 1, confidence: 95 },
      expectedMaxScore: 60
    },
    {
      description: 'Contaminated name should score zero',
      item: {
        title: 'Doe John Associates',
        snippet: 'Doe John Associates provides consulting...',
        link: 'https://linkedin.com/in/doejohn'
      },
      input: { firstName: 'John', lastName: 'Doe', company: 'Acme Corp', jobTitle: '' },
      strategy: { tier: 2, confidence: 70 },
      expectedMaxScore: 30
    }
  ];
  
  for (const scenario of testScenarios) {
    console.log(`\n${scenario.description}`);
    
    const result = scoreSearchResult(
      scenario.item,
      scenario.input.firstName,
      scenario.input.lastName,
      scenario.input.company,
      scenario.input.jobTitle,
      scenario.strategy
    );
    
    console.log(`  Score: ${Math.round(result.score)}/100`);
    console.log(`  Breakdown: Name=${result.breakdown.name}, Company=${result.breakdown.company}, Title=${result.breakdown.title}, Strategy=${result.breakdown.strategy}`);
    
    if (scenario.expectedMinScore && result.score >= scenario.expectedMinScore) {
      console.log(`  ✅ PASS: Score ${Math.round(result.score)} >= ${scenario.expectedMinScore}`);
      passed++;
    } else if (scenario.expectedMaxScore && result.score <= scenario.expectedMaxScore) {
      console.log(`  ✅ PASS: Score ${Math.round(result.score)} <= ${scenario.expectedMaxScore}`);
      passed++;
    } else {
      console.log(`  ❌ FAIL: Score outside expected range`);
      failed++;
    }
  }
  
  return { passed, failed };
}

/**
 * Main test runner
 */
function runAllTests() {
  console.log('\n🧪 LINKEDIN FINDER TEST SUITE v1.0');
  console.log('=' .repeat(50));
  console.log(`Configuration:`);
  console.log(`  Min Company Score: ${CONFIG.minCompanyScore}%`);
  console.log(`  Min Total Score: ${CONFIG.minTotalScore}/100`);
  console.log(`  Allow Broad Search: ${CONFIG.allowBroadSearch}`);
  console.log('=' .repeat(50));
  
  const results = {
    nameValidation: { passed: 0, failed: 0 },
    companyValidation: { passed: 0, failed: 0 },
    specialCharacters: { passed: 0, failed: 0 },
    searchStrategies: { passed: 0, failed: 0 },
    scoringSystem: { passed: 0, failed: 0 }
  };
  
  // Run all test suites
  if (TEST_CONFIG.runAllTests || confirm('Run name validation tests?')) {
    results.nameValidation = testNameValidation();
  }
  
  if (TEST_CONFIG.runAllTests || confirm('Run company validation tests?')) {
    results.companyValidation = testCompanyValidation();
  }
  
  if (TEST_CONFIG.runAllTests || confirm('Run special character tests?')) {
    results.specialCharacters = testSpecialCharacters();
  }
  
  if (TEST_CONFIG.runAllTests || confirm('Run search strategy tests?')) {
    results.searchStrategies = testSearchStrategies();
  }
  
  if (TEST_CONFIG.runAllTests || confirm('Run scoring system tests?')) {
    results.scoringSystem = testScoringSystem();
  }
  
  // Calculate totals
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const suite in results) {
    totalPassed += results[suite].passed;
    totalFailed += results[suite].failed;
  }
  
  // Display summary
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(50));
  
  for (const suite in results) {
    const r = results[suite];
    const total = r.passed + r.failed;
    const rate = total > 0 ? Math.round((r.passed / total) * 100) : 0;
    console.log(`${suite}: ${r.passed}/${total} passed (${rate}%)`);
  }
  
  console.log('=' .repeat(50));
  const overallRate = Math.round((totalPassed / (totalPassed + totalFailed)) * 100);
  console.log(`OVERALL: ${totalPassed}/${totalPassed + totalFailed} passed (${overallRate}%)`);
  
  if (overallRate >= 95) {
    console.log('✅ EXCELLENT: All critical tests passing!');
  } else if (overallRate >= 80) {
    console.log('⚠️ GOOD: Most tests passing, some issues to address');
  } else {
    console.log('❌ NEEDS WORK: Significant test failures');
  }
  
  // Create test report in spreadsheet
  saveTestReport(results, overallRate);
  
  return results;
}

/**
 * Save test results to a new sheet
 */
function saveTestReport(results, overallRate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Test Results');
  
  if (!sheet) {
    sheet = ss.insertSheet('Test Results');
  } else {
    sheet.clear();
  }
  
  // Headers
  const headers = ['Test Suite', 'Passed', 'Failed', 'Total', 'Pass Rate'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  
  // Results
  const rows = [];
  for (const suite in results) {
    const r = results[suite];
    const total = r.passed + r.failed;
    const rate = total > 0 ? Math.round((r.passed / total) * 100) : 0;
    rows.push([suite, r.passed, r.failed, total, `${rate}%`]);
  }
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  
  // Overall summary
  const summaryRow = sheet.getLastRow() + 2;
  sheet.getRange(summaryRow, 1).setValue('OVERALL').setFontWeight('bold');
  sheet.getRange(summaryRow, 5).setValue(`${overallRate}%`).setFontWeight('bold');
  
  // Timestamp
  sheet.getRange(summaryRow + 2, 1).setValue(`Test run: ${new Date().toLocaleString()}`);
  
  console.log('\n📄 Test report saved to "Test Results" sheet');
}

/**
 * Performance benchmark test
 */
function runPerformanceTest() {
  console.log('\n⚡ PERFORMANCE TEST');
  console.log('=' .repeat(50));
  
  const testCases = [
    { firstName: 'John', lastName: 'Doe', company: 'Acme Corp' },
    { firstName: 'Jane', lastName: 'Smith', company: 'Tech Inc' },
    { firstName: 'Bob', lastName: 'Johnson', company: 'Health Systems' }
  ];
  
  const times = [];
  
  for (const testCase of testCases) {
    const startTime = new Date().getTime();
    
    // Simulate the search (without actual API call)
    const strategies = buildSearchStrategies(
      testCase.firstName,
      testCase.lastName,
      '',
      testCase.company,
      ''
    );
    
    // Simulate scoring
    for (let i = 0; i < 5; i++) {
      const mockItem = {
        title: `${testCase.firstName} ${testCase.lastName}`,
        snippet: `Works at ${testCase.company}`,
        link: 'https://linkedin.com/in/test'
      };
      
      scoreSearchResult(
        mockItem,
        testCase.firstName,
        testCase.lastName,
        testCase.company,
        '',
        strategies[0] || { tier: 1, confidence: 90 }
      );
    }
    
    const endTime = new Date().getTime();
    const elapsed = endTime - startTime;
    times.push(elapsed);
    
    console.log(`  ${testCase.firstName} ${testCase.lastName}: ${elapsed}ms`);
  }
  
  const avgTime = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  console.log(`\nAverage processing time: ${avgTime}ms`);
  
  if (avgTime < 100) {
    console.log('✅ EXCELLENT: Very fast processing');
  } else if (avgTime < 500) {
    console.log('✅ GOOD: Acceptable performance');
  } else {
    console.log('⚠️ WARNING: Processing may be slow');
  }
}

/**
 * Add test menu items
 */
function addTestMenu() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('🧪 Tests');
  
  menu.addItem('Run All Tests', 'runAllTests');
  menu.addSeparator();
  menu.addItem('Test Name Validation', 'testNameValidation');
  menu.addItem('Test Company Validation', 'testCompanyValidation');
  menu.addItem('Test Special Characters', 'testSpecialCharacters');
  menu.addItem('Test Search Strategies', 'testSearchStrategies');
  menu.addItem('Test Scoring System', 'testScoringSystem');
  menu.addSeparator();
  menu.addItem('Performance Benchmark', 'runPerformanceTest');
  
  menu.addToUi();
}

// Initialize test menu on open
function onOpen() {
  addTestMenu();
}