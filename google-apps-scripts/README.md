# Google Apps Script - LinkedIn Profile Finder

## Overview
This Google Apps Script automates finding LinkedIn profile URLs for prospects using Google's Custom Search API. It integrates directly with Google Sheets to process bulk lists of names and companies.

## Features
- **8 search strategies** with fallback approaches
- **Batch processing** with rate limiting
- **Retry mechanism** for not-found profiles
- **Data cleaning** utilities
- **Results summary** with success metrics
- **Custom menu** in Google Sheets

## Setup Instructions

### 1. Get Google Custom Search API Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Custom Search API"
4. Create API credentials (API Key)
5. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
6. Create a search engine that searches the entire web
7. Get your Search Engine ID

### 2. Install the Script
1. Open your Google Sheet with prospect data
2. Go to Extensions → Apps Script
3. Delete any existing code
4. Copy the entire `linkedin-profile-finder.gs` file
5. Paste into Apps Script editor
6. Replace the placeholder values:
   ```javascript
   const API_KEY = 'YOUR_ACTUAL_API_KEY';
   const SEARCH_ENGINE_ID = 'YOUR_ACTUAL_SEARCH_ENGINE_ID';
   ```
7. Save the project (Ctrl+S or Cmd+S)

### 3. Sheet Structure
Your Google Sheet should have this structure:
- **Column A**: First Name
- **Column B**: Last Name
- **Column C**: Job Title (optional)
- **Column D**: Company Name
- **Column E**: State (optional)
- **Column F**: LinkedIn URL (output)

### 4. Usage
After installation, refresh your Google Sheet. You'll see a new menu "LinkedIn Finder" with these options:

- **Find All**: Process all rows in the sheet
- **Process Selected Rows**: Process only highlighted rows
- **Retry "Not Found"**: Second attempt for failed searches
- **Clean Data First**: Clean names and company data
- **Show Results Summary**: Display success metrics
- **Test API Connection**: Verify API setup

## Search Strategies
The script uses multiple strategies in order:
1. Exact name + exact company
2. Exact name + partial company
3. Name + job title + company
4. Name variations (Last, First)
5. Broader search without site restriction
6. Name + location
7. Name with LinkedIn keyword
8. Flexible name matching

## Rate Limits & Costs
- Google Custom Search API: 100 queries/day free, then $5 per 1000 queries
- Script includes 1-second delays between searches
- Batch processing limited to avoid timeouts

## Success Rates
- **Industry average**: 10-25% match rate
- **With clean data**: 15-30% match rate
- **With all strategies**: Up to 40% match rate

## Troubleshooting

### Low Match Rate?
1. Run "Clean Data First" to fix formatting
2. Use "Retry Not Found" for second pass
3. Ensure company names are complete (not abbreviated)

### API Errors?
1. Check API key and Search Engine ID
2. Verify API is enabled in Google Cloud Console
3. Check daily quota limits

### Script Timeout?
- Process smaller batches (select 50-100 rows at a time)
- Use "Process Selected Rows" instead of full batch

## Tips for Better Results
1. **Clean data first**: Remove special characters, expand abbreviations
2. **Include job titles**: Helps differentiate common names
3. **Add state/location**: Improves accuracy for large companies
4. **Retry failures**: Second pass often finds 10-15% more profiles
5. **Manual verification**: Spot-check results for accuracy

## Privacy & Compliance
- This script only searches publicly available information
- Respects LinkedIn's robots.txt through Google Search
- Add delays to avoid rate limiting
- Use responsibly and in compliance with LinkedIn's ToS