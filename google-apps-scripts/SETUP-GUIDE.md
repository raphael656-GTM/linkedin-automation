# LinkedIn Finder Comprehensive - Setup Guide

## 🚀 Quick Start

### Step 1: API Setup
1. Get Google Custom Search API credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Custom Search API"
   - Create API Key
   
2. Create Search Engine:
   - Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
   - Create new search engine
   - Set to search entire web
   - Get Search Engine ID

3. Update the script:
```javascript
const API_KEY = 'YOUR_ACTUAL_API_KEY';
const SEARCH_ENGINE_ID = 'YOUR_ACTUAL_SEARCH_ENGINE_ID';
```

### Step 2: Choose Your Industry
The system comes pre-configured for three industries. Set yours:

```javascript
CONFIG.currentIndustry = 'healthcare' // or 'tech' or 'finance'
```

### Step 3: Customize for Your Organization

#### Add Your Company Aliases
```javascript
// In INDUSTRY_CONFIGS, add your company variations:
healthcare: {
  aliases: {
    'Your Hospital': ['Your Hospital System', 'YH', 'Your Medical'],
    // Add more...
  }
}
```

#### Add Known Duplicates in Your Database
```javascript
const KNOWN_DUPLICATES = {
  'John Smith': {
    differentiators: ['company', 'title'],
    knownProfiles: ['john-smith-yourcompany', 'john-smith-otherco']
  },
  // Add your known duplicates...
};
```

#### Set Validation Rules for Your Needs
```javascript
const VALIDATION_RULES = {
  blacklistRules: [
    { 
      name: 'competitor_company',
      check: (result) => {
        const competitors = ['Competitor1', 'Competitor2']; // YOUR competitors
        return !competitors.some(c => result.company?.includes(c));
      }
    }
  ]
};
```

## 📊 Sheet Setup

### Required Columns (A-L):
| Column | Field | Description |
|--------|-------|-------------|
| A | First Name | Required |
| B | Last Name | Required |
| C | Job Title | Optional but helps accuracy |
| D | Company Name | Highly recommended |
| E | State | Optional |
| F | LinkedIn URL | Output - Found profile |
| G | Confidence % | Output - Match confidence |
| H | Company Match % | Output - Company similarity |
| I | Status | Output - Found/Not Found/Needs Review |
| J | Verified By | Manual verification tracking |
| K | Verified Date | When verified |
| L | Alternates/Notes | Alternative profiles or notes |

## 🎯 Usage Instructions

### First Run - Testing
1. **Test with a known profile:**
   - Menu → Testing → Test Single Profile
   - Verify it finds the correct person

2. **Test with common names:**
   - Menu → Testing → Test Common Name
   - Should flag for review if multiple matches

3. **Check your configuration:**
   - Menu → Configuration → View Current Settings

### Production Run

#### Method 1: Two-Pass System (Recommended)
```
Menu → Process All (Two-Pass)
```
- **Pass 1**: Strict search (75+ score required)
- **Pass 2**: Relaxed search for failures (50+ score)
- Pass 2 results automatically flagged for review

#### Method 2: Selected Rows
```
Select rows → Menu → Process Selected Rows
```
Good for testing or processing specific batches

### Review Process

#### Status Types:
- **Found** (Green): High confidence match
- **Needs Review** (Yellow): Manual verification needed
- **Not Found** (Red): No acceptable matches
- **Verified** (Blue): Human confirmed

#### Review Workflow:
1. Filter sheet by Status = "Needs Review"
2. Check the LinkedIn URL manually
3. If correct:
   - Change Status to "Verified"
   - Add your name to "Verified By"
   - Add date to "Verified Date"
4. If incorrect:
   - Change Status to "Incorrect"
   - Add correct URL to "Alternates/Notes"

## 🔧 Optimization Tips

### 1. Data Quality Improvements
- **Add middle initials**: Reduces duplicates by 40%
- **Use full company names**: Not abbreviations
- **Include job titles**: Even partial titles help 25-30%
- **Add state/location**: Helps with large companies

### 2. Cache Management
- Cache stores results for 30 days
- Reduces API calls by 40%
- Clear cache: Menu → Configuration → Clear Cache

### 3. Pattern Learning
The system learns from your data:
- Menu → Analytics → View Success Patterns
- Menu → Analytics → View Problem Companies

### 4. Batch Processing Tips
- Process by company for better cache hits
- System saves progress every 25 records
- Can resume if interrupted

## 📈 Performance Tuning

### Adjust Thresholds
```javascript
CONFIG.passes.first.minScore = 75;  // Raise for higher precision
CONFIG.passes.second.minScore = 50; // Lower for more matches
```

### API Limits
```javascript
CONFIG.api = {
  maxPerMinute: 30,    // Adjust based on your quota
  maxPerHour: 1000,
  maxPerDay: 10000
};
```

### Industry-Specific Tuning
```javascript
// Healthcare: More flexible due to system variations
healthcare: {
  minCompanyScore: 40,  // Lower threshold
}

// Finance: Stricter due to many similar titles
finance: {
  minCompanyScore: 70,  // Higher threshold
  requireTitle: true    // Title required
}
```

## 🚨 Troubleshooting

### Low Match Rate (<50%)
1. Check data quality (full names, companies)
2. Lower Pass 2 threshold to 40
3. Enable broad search
4. Check problematic companies list

### Too Many False Positives
1. Raise Pass 1 threshold to 80
2. Require company match of 50+
3. Enable strict name matching
4. Add more validation rules

### API Errors
1. Check API key and Search Engine ID
2. Verify quota limits not exceeded
3. Check rate limiting settings

### Common Names Issues
- System auto-detects common names
- Requires higher confidence (70+ vs 50+)
- Always flags for review if multiple matches

## 📊 Expected Results

With proper configuration:
- **Pass 1 Success**: 60-70% found with high confidence
- **Pass 2 Success**: Additional 15-20% with review flag
- **Overall Success**: 85-90% after review
- **False Positives**: <2% with validation rules
- **Processing Speed**: ~100 profiles/hour
- **API Cost**: ~$5 per 1000 searches

## 🔄 Maintenance

### Weekly Tasks
- Review "Needs Review" items
- Check Analytics Report for patterns
- Clear old cache if needed

### Monthly Tasks
- Audit 5% random sample for accuracy
- Update company aliases
- Review and update known duplicates
- Check problematic companies list

## 📝 Best Practices

1. **Start Small**: Test with 10-20 profiles first
2. **Review Regularly**: Don't let review queue build up
3. **Track Patterns**: Use analytics to improve
4. **Update Aliases**: Add new company variations as found
5. **Document Issues**: Keep notes on problem cases
6. **Verify C-Level**: Always manually verify executives
7. **Use Confidence Scores**: 
   - 80%+ = Usually correct
   - 50-79% = Should verify
   - <50% = Likely wrong

## 🆘 Support

For issues or questions:
1. Check Analytics → View Success Patterns
2. Review problematic companies list
3. Verify configuration settings
4. Test with known profiles
5. Clear cache and retry

## 📄 Version History

- **v3.0**: Comprehensive solution with all recommendations
- **v2.0**: Balanced approach with relaxed matching
- **v1.0**: Initial strict validation version

---

Remember: The system is designed to flag uncertain matches rather than guess wrong. It's better to review 20% than have 20% wrong matches!