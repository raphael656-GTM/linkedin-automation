// Replace with your actual API key and Search Engine ID
const API_KEY = 'YOUR_API_KEY_HERE';
const SEARCH_ENGINE_ID = 'YOUR_SEARCH_ENGINE_ID_HERE';

/**
 * Enhanced LinkedIn profile finder with multiple search strategies
 */
function findLinkedInProfile(firstName, lastName, jobTitle = '', company = '', state = '') {
  try {
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Clean and prepare company name
    let cleanCompany = company.replace(/\s+(Inc|LLC|Corp|Corporation|Ltd|Limited|Health|System|Medical|Center)\.?$/i, '');
    cleanCompany = cleanCompany.replace(/\s+/g, ' ').trim();
    
    // Multiple search strategies with different approaches
    const searchStrategies = [
      // Strategy 1: Exact name + exact company
      `"${fullName}" "${cleanCompany}" site:linkedin.com/in/`,
      
      // Strategy 2: Exact name + partial company
      `"${fullName}" ${cleanCompany.split(' ')[0]} site:linkedin.com/in/`,
      
      // Strategy 3: Name + job title + company
      jobTitle ? `"${fullName}" "${jobTitle}" "${cleanCompany}" site:linkedin.com/in/` : null,
      
      // Strategy 4: Name variations
      `"${lastName}, ${firstName}" site:linkedin.com/in/`,
      
      // Strategy 5: Broader search without site restriction
      `"${fullName}" "${cleanCompany}" linkedin`,
      
      // Strategy 6: Name + location if available
      state ? `"${fullName}" "${state}" site:linkedin.com/in/` : null,
      
      // Strategy 7: Just name with linkedin keyword
      `"${fullName}" linkedin profile`,
      
      // Strategy 8: Name without quotes (catches more variations)
      `${firstName} ${lastName} ${cleanCompany} site:linkedin.com/in/`
    ].filter(Boolean); // Remove null strategies
    
    for (let i = 0; i < searchStrategies.length; i++) {
      const query = searchStrategies[i];
      console.log(`Strategy ${i + 1}: ${query}`);
      
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=5`;
      
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.error) {
        console.error('API Error:', data.error.message);
        return `API Error: ${data.error.message}`;
      }
      
      if (data.items && data.items.length > 0) {
        // Score and rank results
        for (let item of data.items) {
          if (item.link && item.link.includes('linkedin.com/in/')) {
            // Verify this looks like the right person
            const title = item.title.toLowerCase();
            const snippet = item.snippet.toLowerCase();
            const fullNameLower = fullName.toLowerCase();
            
            // Basic relevance check
            if (title.includes(fullNameLower) || 
                snippet.includes(fullNameLower) ||
                title.includes(firstName.toLowerCase()) && title.includes(lastName.toLowerCase())) {
              return item.link;
            }
          }
        }
      }
      
      // Small delay between strategies
      Utilities.sleep(300);
    }
    
    return "Not Found";
    
  } catch (error) {
    console.error('Error finding LinkedIn profile:', error);
    return `Error: ${error.toString()}`;
  }
}

/**
 * Batch process multiple rows to find LinkedIn profiles
 * Designed for your specific sheet structure:
 * A: First Name, B: Last Name, C: Job Title, D: Company Name, E: State
 * Results will be added to Column F
 */
function batchFindLinkedInProfiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Get the data ranges based on your sheet structure
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Skip header row (row 1), start from row 2
  const results = [];
  
  for (let i = 1; i < values.length; i++) { // Start from index 1 (row 2)
    const firstName = values[i][0] || ''; // Column A
    const lastName = values[i][1] || '';  // Column B
    const jobTitle = values[i][2] || '';  // Column C
    const company = values[i][3] || '';   // Column D
    const state = values[i][4] || '';     // Column E
    
    // Skip empty rows
    if (!firstName && !lastName) {
      results.push(['']);
      continue;
    }
    
    console.log(`Processing: ${firstName} ${lastName} at ${company}`);
    
    const linkedinUrl = findLinkedInProfile(firstName, lastName, jobTitle, company, state);
    results.push([linkedinUrl]);
    
    // Add delay to respect API rate limits
    Utilities.sleep(1000); // 1 second delay between requests
  }
  
  // Write results to column F (starting from F2)
  if (results.length > 0) {
    // Add header to column F if it doesn't exist
    const headerRange = sheet.getRange(1, 6);
    if (headerRange.getValue() === '') {
      headerRange.setValue('LinkedIn URL');
    }
    
    // Write the results starting from F2
    sheet.getRange(2, 6, results.length, 1).setValues(results);
  }
  
  SpreadsheetApp.getUi().alert(`Processed ${results.length} profiles. Results added to column F.`);
}

/**
 * Process only selected rows (useful for testing or partial processing)
 */
function processSelectedRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const selection = sheet.getSelection();
  const activeRange = selection.getActiveRange();
  
  if (!activeRange) {
    SpreadsheetApp.getUi().alert('Please select the rows you want to process first.');
    return;
  }
  
  const startRow = activeRange.getRow();
  const numRows = activeRange.getNumRows();
  
  // Get data for selected rows
  const dataRange = sheet.getRange(startRow, 1, numRows, 5); // A to E columns
  const values = dataRange.getValues();
  
  const results = [];
  
  for (let i = 0; i < values.length; i++) {
    const firstName = values[i][0] || '';
    const lastName = values[i][1] || '';
    const jobTitle = values[i][2] || '';
    const company = values[i][3] || '';
    const state = values[i][4] || '';
    
    if (!firstName && !lastName) {
      results.push(['']);
      continue;
    }
    
    console.log(`Processing: ${firstName} ${lastName}`);
    
    const linkedinUrl = findLinkedInProfile(firstName, lastName, jobTitle, company, state);
    results.push([linkedinUrl]);
    
    Utilities.sleep(1000);
  }
  
  // Write results to column F for the selected rows
  if (results.length > 0) {
    sheet.getRange(startRow, 6, results.length, 1).setValues(results);
  }
  
  SpreadsheetApp.getUi().alert(`Processed ${results.length} selected rows.`);
}

/**
 * Test function for a single profile using your sheet structure
 */
function testSingleProfile() {
  // Test with the first row of data from your sheet
  const result = findLinkedInProfile('Salonia', 'Brown', 'System Vice Pre', 'Mount Sinai Health', 'New York');
  console.log('Test result:', result);
  SpreadsheetApp.getUi().alert('Test Result: ' + result);
}

/**
 * Test API connection
 */
function testAPIConnection() {
  const testUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=test`;
  
  try {
    const response = UrlFetchApp.fetch(testUrl);
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      SpreadsheetApp.getUi().alert('API Error: ' + data.error.message);
    } else {
      SpreadsheetApp.getUi().alert('API is working! Found ' + (data.searchInformation?.totalResults || 0) + ' results');
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert('Connection Error: ' + error.toString());
  }
}

/**
 * Second pass for "Not Found" entries
 */
function retryNotFoundProfiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let processedCount = 0;
  let foundCount = 0;
  
  for (let i = 1; i < values.length; i++) {
    const linkedinResult = values[i][5]; // Column F
    
    if (linkedinResult === "Not Found" || linkedinResult === "") {
      const firstName = values[i][0];
      const lastName = values[i][1];
      const jobTitle = values[i][2];
      const company = values[i][3];
      const state = values[i][4];
      
      if (firstName && lastName) {
        console.log(`Retrying: ${firstName} ${lastName}`);
        
        // Try alternative search approach
        const result = findLinkedInProfileAlternative(firstName, lastName, jobTitle, company, state);
        
        if (result !== "Not Found") {
          sheet.getRange(i + 1, 6).setValue(result);
          foundCount++;
        }
        
        processedCount++;
        Utilities.sleep(1000);
      }
    }
  }
  
  SpreadsheetApp.getUi().alert(`Retry complete! Found ${foundCount} additional profiles out of ${processedCount} retries.`);
}

function findLinkedInProfileAlternative(firstName, lastName, jobTitle, company, state) {
  try {
    // Alternative strategies for difficult cases
    const alternatives = [
      // Try with middle initial guessing
      `"${firstName.charAt(0)}. ${lastName}" "${company}" site:linkedin.com/in/`,
      
      // Try without company constraint
      `"${firstName} ${lastName}" linkedin profile -facebook -twitter`,
      
      // Try with industry terms
      `"${firstName} ${lastName}" healthcare linkedin` // Customize for your industry
    ];
    
    for (let query of alternatives) {
      const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=3`;
      
      const response = UrlFetchApp.fetch(url);
      const data = JSON.parse(response.getContentText());
      
      if (data.items) {
        for (let item of data.items) {
          if (item.link && item.link.includes('linkedin.com/in/')) {
            return item.link;
          }
        }
      }
      
      Utilities.sleep(300);
    }
    
    return "Not Found";
  } catch (error) {
    return "Error";
  }
}

/**
 * Clean data for better results
 */
function cleanDataForBetterResults() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  for (let i = 1; i < values.length; i++) {
    let firstName = values[i][0];
    let lastName = values[i][1];
    let company = values[i][3];
    
    // Clean names
    firstName = firstName.replace(/[^a-zA-Z\s-']/g, '').trim();
    lastName = lastName.replace(/[^a-zA-Z\s-']/g, '').trim();
    
    // Expand company abbreviations
    company = company.replace(/\bHea\b/g, 'Health')
                   .replace(/\bMed\b/g, 'Medical')
                   .replace(/\bSys\b/g, 'System')
                   .replace(/\bCtr\b/g, 'Center');
    
    // Update the cleaned data
    sheet.getRange(i + 1, 1).setValue(firstName);
    sheet.getRange(i + 1, 2).setValue(lastName);
    sheet.getRange(i + 1, 4).setValue(company);
  }
  
  SpreadsheetApp.getUi().alert('Data cleaned! Try running the search again.');
}

/**
 * Show results summary
 */
function showResultsSummary() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  let total = 0;
  let found = 0;
  let notFound = 0;
  let errors = 0;
  
  for (let i = 1; i < values.length; i++) {
    const result = values[i][5]; // Column F
    if (result) {
      total++;
      if (result.includes('linkedin.com')) {
        found++;
      } else if (result === 'Not Found') {
        notFound++;
      } else {
        errors++;
      }
    }
  }
  
  const successRate = total > 0 ? Math.round((found / total) * 100) : 0;
  
  const summary = `
📊 RESULTS SUMMARY:
━━━━━━━━━━━━━━━━━━━━
✅ Found: ${found}
❌ Not Found: ${notFound}
⚠️ Errors: ${errors}
📈 Success Rate: ${successRate}%
📋 Total Processed: ${total}

🎯 Industry Average: 10-25%
${successRate >= 15 ? '🎉 Above average!' : successRate >= 10 ? '👍 Good results!' : '💡 Try the retry function!'}
  `;
  
  SpreadsheetApp.getUi().alert(summary);
}

/**
 * Adds proper headers to your sheet if they don't exist
 */
function addHeaders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Set headers in row 1
  const headers = [
    'First Name',    // A1
    'Last Name',     // B1
    'Job Title',     // C1
    'Company Name',  // D1
    'State',         // E1
    'LinkedIn URL'   // F1
  ];
  
  // Write headers to first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers (bold, background color)
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
  
  SpreadsheetApp.getUi().alert('Headers added successfully!');
}

/**
 * Creates a menu in Google Sheets for easy access
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('LinkedIn Finder')
    .addItem('🎯 Find All (Name+Job+Company Priority)', 'batchFindLinkedInProfiles')
    .addItem('🔄 Retry "Not Found" Profiles', 'retryNotFoundProfiles')
    .addItem('✅ Validate Existing Results', 'validateExistingResults')
    .addItem('🧹 Clean Data First', 'cleanDataForBetterResults')
    .addItem('📊 Show Results Summary', 'showResultsSummary')
    .addSeparator()
    .addItem('🎯 Process Selected Rows Only', 'processSelectedRows')
    .addItem('🧪 Test Pascual Estrada Detailed', 'testPascualEstraDaDetailed')
    .addItem('🧪 Test Name Contamination', 'testNameContamination')
    .addItem('🧪 Test Problem Cases', 'testProblemCases')
    .addItem('🔧 Test API Connection', 'testAPIConnection')
    .addSeparator()
    .addItem('📋 Add Headers', 'addHeaders')
    .addToUi();
}