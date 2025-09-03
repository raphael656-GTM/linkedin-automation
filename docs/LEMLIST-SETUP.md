# Lemlist Campaign Configuration

## Your Campaign Details
- **Team ID**: `tea_iCFKHJZYanhskw54r`
- **Campaign ID**: `ctp_kniL5tYjDtyX3KFwr`
- **Campaign URL**: https://app.lemlist.com/teams/tea_iCFKHJZYanhskw54r/templates/campaigns/ctp_kniL5tYjDtyX3KFwr

## Setup Instructions

### 1. Configure Webhooks in Lemlist
Go to your campaign settings and add these webhooks:

#### Connection Accepted Webhook
- **Event**: LinkedIn Connection Accepted
- **URL**: `http://your-server:5678/webhook/linkedin-connection`
- **Method**: POST

#### Reply Received Webhook  
- **Event**: Reply Received
- **URL**: `http://your-server:5678/webhook/lemlist-response`
- **Method**: POST

### 2. Required Custom Fields
Add these custom fields in Lemlist:

```
- linkedin_url (Text)
- tier (Text) 
- personalization_score (Number)
- message_1_subject (Text)
- message_1_content (Long Text)
- message_2_subject (Text)
- message_2_content (Long Text)
- message_3_subject (Text)
- message_3_content (Long Text)
- ai_generated_date (Date)
- scraping_status (Text)
```

### 3. Campaign Sequence Setup
Configure your Lemlist campaign with:

1. **LinkedIn Steps**:
   - Visit LinkedIn Profile
   - Send Connection Request
   - Wait for Connection (trigger webhook)

2. **Message Sequence** (after connection):
   - Message 1: {{message_1_content}} (Immediate)
   - Message 2: {{message_2_content}} (Day +2)
   - Message 3: {{message_3_content}} (Day +5)

### 4. API Configuration
Add your Lemlist API key to n8n:
1. Go to n8n credentials
2. Create new Lemlist credentials
3. Add your API key

### 5. Update Workflows
The workflows are configured to use campaign ID: `ctp_kniL5tYjDtyX3KFwr`

All prospects (Tier 1, 2, and 3) will be added to this single campaign.

## Testing

### Test Import
1. Add a test row to Google Sheets
2. Run workflow 01 manually
3. Check if prospect appears in Lemlist campaign

### Test Connection Webhook
1. Manually trigger a test webhook from Lemlist
2. Check n8n execution logs
3. Verify scraping workflow triggers

### Test Message Delivery
1. Run full pipeline with test prospect
2. Check custom fields updated in Lemlist
3. Verify messages scheduled correctly