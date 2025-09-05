/**
 * Bright Data LinkedIn Scraper Integration
 * Enhances LinkedIn profile discovery with detailed enrichment
 */

// Configuration
const BRIGHT_DATA_CONFIG = {
  API_ENDPOINT: "https://api.brightdata.com/datasets/v3",
  DATASET_ID: "gd_l1viktl72bvl7bjuj0",
  BATCH_SIZE: 20,
  RATE_LIMIT_DELAY: 1000 // ms between requests
};

/**
 * Main function to enrich LinkedIn profiles using Bright Data
 * @param {string} spreadsheetId - The Google Sheet ID
 * @param {string} sheetName - The sheet name to process
 */
function enrichLinkedInProfiles(spreadsheetId, sheetName) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find column indices
  const linkedinUrlCol = headers.indexOf("LinkedIn URL");
  const enrichedTitleCol = headers.indexOf("Enriched Title");
  const enrichedCompanyCol = headers.indexOf("Enriched Company");
  const profileSummaryCol = headers.indexOf("Profile Summary");
  const skillsCol = headers.indexOf("Top Skills");
  
  // Add headers if not present
  if (enrichedTitleCol === -1) {
    sheet.getRange(1, headers.length + 1, 1, 4).setValues([[
      "Enriched Title", "Enriched Company", "Profile Summary", "Top Skills"
    ]]);
  }
  
  // Process profiles in batches
  const profiles = [];
  for (let i = 1; i < data.length; i++) {
    const linkedinUrl = data[i][linkedinUrlCol];
    if (linkedinUrl && \!data[i][enrichedTitleCol]) {
      profiles.push({ row: i + 1, url: linkedinUrl });
    }
  }
  
  processBatch(sheet, profiles, 0);
}

/**
 * Process a batch of profiles
 */
function processBatch(sheet, profiles, startIndex) {
  const batch = profiles.slice(startIndex, startIndex + BRIGHT_DATA_CONFIG.BATCH_SIZE);
  
  if (batch.length === 0) {
    SpreadsheetApp.getUi().alert("Enrichment complete\!");
    return;
  }
  
  const apiKey = PropertiesService.getScriptProperties().getProperty("BRIGHT_DATA_API_KEY");
  
  batch.forEach((profile, index) => {
    try {
      const enrichedData = fetchProfileData(profile.url, apiKey);
      
      if (enrichedData) {
        // Update sheet with enriched data
        const range = sheet.getRange(profile.row, 10, 1, 4); // Assuming columns J-M
        range.setValues([[
          enrichedData.current_title || "",
          enrichedData.current_company || "",
          enrichedData.summary ? enrichedData.summary.slice(0, 200) : "",
          enrichedData.skills ? enrichedData.skills.slice(0, 5).join(", ") : ""
        ]]);
      }
      
      // Rate limiting
      if (index < batch.length - 1) {
        Utilities.sleep(BRIGHT_DATA_CONFIG.RATE_LIMIT_DELAY);
      }
    } catch (error) {
      console.error("Error enriching profile:", error);
    }
  });
  
  // Process next batch
  if (startIndex + BRIGHT_DATA_CONFIG.BATCH_SIZE < profiles.length) {
    processBatch(sheet, profiles, startIndex + BRIGHT_DATA_CONFIG.BATCH_SIZE);
  }
}

/**
 * Fetch profile data from Bright Data API
 */
function fetchProfileData(linkedinUrl, apiKey) {
  try {
    const payload = {
      url: linkedinUrl,
      dataset_id: BRIGHT_DATA_CONFIG.DATASET_ID,
      format: "json",
      discover_emails: false // LinkedIn-only focus
    };
    
    const response = UrlFetchApp.fetch(BRIGHT_DATA_CONFIG.API_ENDPOINT + "/trigger", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return processProfileResponse(data);
    } else {
      console.error("API Error:", response.getContentText());
      return null;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

/**
 * Process and normalize the API response
 */
function processProfileResponse(data) {
  // Handle different response formats from Bright Data
  if (data.status === "pending") {
    // For async requests, would need to poll for results
    return null;
  }
  
  return {
    name: data.name || data.full_name,
    current_title: data.headline || data.current_position?.title,
    current_company: data.current_company?.name || data.current_position?.company,
    location: data.location || data.geo_location,
    summary: data.summary || data.about,
    skills: Array.isArray(data.skills) ? data.skills.map(s => s.name || s) : [],
    experience_years: calculateExperienceYears(data.experience),
    education: data.education?.[0]?.school || "",
    connections: data.connections_count || data.network_size,
    last_activity: data.last_post_date || data.recent_activity_date
  };
}

/**
 * Calculate years of experience from experience array
 */
function calculateExperienceYears(experience) {
  if (\!Array.isArray(experience) || experience.length === 0) return 0;
  
  const firstJob = experience[experience.length - 1];
  if (firstJob?.start_date) {
    const startYear = new Date(firstJob.start_date).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  }
  
  return 0;
}

/**
 * Validate enriched data against original search criteria
 */
function validateEnrichment(originalData, enrichedData) {
  const validation = {
    nameMatch: false,
    titleMatch: false,
    companyMatch: false,
    overallConfidence: 0
  };
  
  // Name validation
  if (originalData.name && enrichedData.name) {
    const originalName = originalData.name.toLowerCase().split(" ");
    const enrichedName = enrichedData.name.toLowerCase().split(" ");
    validation.nameMatch = originalName.some(part => enrichedName.includes(part));
  }
  
  // Title validation (using fuzzy matching from healthcare titles)
  if (originalData.title && enrichedData.current_title) {
    validation.titleMatch = fuzzyTitleMatch(
      originalData.title,
      enrichedData.current_title,
      0.6
    );
  }
  
  // Company validation
  if (originalData.company && enrichedData.current_company) {
    validation.companyMatch = normalizeCompany(originalData.company) === 
                             normalizeCompany(enrichedData.current_company);
  }
  
  // Calculate confidence
  validation.overallConfidence = 
    (validation.nameMatch ? 40 : 0) +
    (validation.titleMatch ? 35 : 0) +
    (validation.companyMatch ? 25 : 0);
  
  return validation;
}

/**
 * Create personalization data from enriched profile
 */
function createPersonalization(enrichedData) {
  const personalization = {
    greeting: "Hi " + enrichedData.name.split(" ")[0],
    commonality: "",
    value_prop: ""
  };
  
  // Skills-based personalization
  if (enrichedData.skills && enrichedData.skills.length > 0) {
    const topSkill = enrichedData.skills[0];
    personalization.commonality = "I noticed your expertise in " + topSkill;
  }
  
  // Experience-based personalization
  if (enrichedData.experience_years > 10) {
    personalization.value_prop = "With your extensive experience in healthcare";
  } else if (enrichedData.current_title?.toLowerCase().includes("director")) {
    personalization.value_prop = "As a healthcare leader";
  }
  
  // Education-based personalization
  if (enrichedData.education) {
    personalization.education_reference = "Fellow " + enrichedData.education + " alum here";
  }
  
  return personalization;
}

/**
 * Menu item to trigger enrichment
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("LinkedIn Enrichment")
    .addItem("Enrich Profiles", "runEnrichment")
    .addItem("Validate Data", "validateAllData")
    .addItem("Generate Personalizations", "generatePersonalizations")
    .addSeparator()
    .addItem("Settings", "showSettings")
    .addToUi();
}

/**
 * Run enrichment from menu
 */
function runEnrichment() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  enrichLinkedInProfiles(spreadsheetId, sheet.getName());
}

// Helper functions from linkedin-finder-healthcare-titles.gs
function normalizeCompany(company) {
  if (\!company) return "";
  return company.toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .replace(/(inc|llc|ltd|corp|corporation|company|co|group|health|healthcare|medical|center|hospital|clinic)$/g, "")
    .trim();
}

// Note: Import fuzzyTitleMatch from linkedin-finder-healthcare-titles.gs
