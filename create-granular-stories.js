#!/usr/bin/env node

const { EnhancedStoryGenerator } = require('./routing/EnhancedStoryGenerator');
const fs = require('fs').promises;
const path = require('path');

async function createGranularStories() {
    console.log('📋 Creating Granular LinkedIn Automation Component Stories\n');
    console.log('=' .repeat(60));
    
    const generator = new EnhancedStoryGenerator();
    const stories = [];
    
    // Component 1: Google Sheets Infrastructure
    const sheetsStory = {
        title: 'Google Sheets 4-Tab Infrastructure Setup',
        description: 'Create Google Sheets structure with Raw Prospects, Enriched Data, Campaign Tracking, and Performance Metrics tabs',
        priority: 'high',
        requirements: [
            'Tab 1: Raw Prospects with fields (firstName, lastName, company, title, city, state, tier, status, timestamp)',
            'Tab 2: Enriched Data with all Tab 1 fields plus (email, linkedinUrl, companyDomain, enrichment_date, enrichment_source)',
            'Tab 3: Campaign Tracking with (email, campaign IDs, sent dates, response status)',
            'Tab 4: Performance Metrics with daily statistics and conversion tracking',
            'Google Apps Script for automated status updates',
            'Formulas for tier calculation and performance metrics'
        ],
        constraints: [
            'Must handle 3000+ rows efficiently',
            'Real-time status updates',
            'Data validation on all input fields'
        ],
        tags: ['sheets', 'infrastructure', 'database'],
        acceptanceCriteria: [
            'All 4 tabs created with correct structure',
            'Automated formulas working',
            'Status updates functioning',
            'Can handle 3000+ prospects'
        ]
    };
    
    // Component 2: n8n Daily Enrichment Pipeline
    const enrichmentStory = {
        title: 'n8n Daily Enrichment Pipeline Workflow',
        description: 'Build n8n workflow that runs daily at 9 AM to enrich prospects from Google Sheets using Lemlist API',
        priority: 'high',
        requirements: [
            'Daily trigger at 9 AM',
            'Read pending prospects from Google Sheets (max 100)',
            'Lemlist enrichment API integration',
            'Fallback to Apify if data missing',
            'Update Enriched Data sheet',
            'Mark status as enriched',
            'Bulk classification by title',
            'Error handling and retry logic'
        ],
        constraints: [
            'Lemlist API rate limit 20 requests/2 seconds',
            'Process batch of 100 prospects max',
            'Complete within 30 minutes'
        ],
        tags: ['n8n', 'enrichment', 'automation'],
        acceptanceCriteria: [
            'Workflow triggers daily at 9 AM',
            'Successfully enriches 90%+ prospects',
            'Updates Google Sheets correctly',
            'Handles API rate limits'
        ]
    };
    
    // Component 3: n8n Campaign Assignment Router
    const routerStory = {
        title: 'n8n Campaign Assignment Router Workflow',
        description: 'Build hourly n8n workflow that routes enriched prospects to appropriate Lemlist campaigns based on title',
        priority: 'high',
        requirements: [
            'Hourly trigger',
            'Read enriched prospects with status=enriched',
            'Title-based routing logic (C-Suite, IT/Digital, Patient Experience, Operations/Revenue, General)',
            'Batch prospects by campaign type (max 50)',
            'Add to appropriate Lemlist connection campaign',
            'Update tracking sheet',
            'Set status to in_campaign'
        ],
        constraints: [
            'Max 50 prospects per batch',
            'Lemlist API rate limits',
            'Must complete within 10 minutes'
        ],
        tags: ['n8n', 'routing', 'campaigns'],
        acceptanceCriteria: [
            'Routes prospects to correct campaigns',
            'Updates tracking accurately',
            'Handles all 5 campaign types',
            'Respects batch limits'
        ]
    };
    
    // Component 4: n8n Connection Acceptance Handler
    const acceptanceStory = {
        title: 'n8n Connection Acceptance Webhook Handler',
        description: 'Build webhook-triggered n8n workflow that handles LinkedIn connection acceptances with research and AI personalization',
        priority: 'high',
        requirements: [
            'Webhook trigger from Lemlist',
            'Extract connection data (email, name, company, linkedinUrl)',
            'Parallel research with Apify LinkedIn scraper',
            'Serper.dev company news search',
            'Cache research data for 7 days',
            'OpenAI GPT-4 message generation (3 messages)',
            'Add to engagement campaign with personalized variables',
            'Remove from connection campaign',
            'Update tracking sheet'
        ],
        constraints: [
            'Response time under 5 minutes',
            'Message quality for healthcare executives',
            'Cache reuse if data < 7 days old'
        ],
        tags: ['n8n', 'webhook', 'personalization', 'ai'],
        acceptanceCriteria: [
            'Webhook responds in < 5 minutes',
            'Generates 3 personalized messages',
            'Successfully moves to engagement campaign',
            'Research data properly cached'
        ]
    };
    
    // Component 5: Lemlist Campaign Configuration
    const lemlistStory = {
        title: 'Lemlist Campaign Structure Setup',
        description: 'Create 5 connection campaigns and 1 universal engagement campaign in Lemlist with proper webhooks',
        priority: 'high',
        requirements: [
            '5 Connection Campaigns (C-Suite, IT/Digital, Patient Experience, Operations/Revenue, General)',
            'Each with: Visit profile → Wait 1 day → Send connection (no message) → Webhook on acceptance',
            '1 Universal Engagement Campaign with custom variables',
            'Variables: custom_intro, custom_value, custom_cta, research_notes',
            'Message sequence: Immediate → Wait 2 days → Second → Wait 3 days → Third',
            'Webhook configuration for all campaigns',
            'API integration setup'
        ],
        constraints: [
            'LinkedIn connection limits',
            'Message sending limits',
            'Webhook response requirements'
        ],
        tags: ['lemlist', 'campaigns', 'configuration'],
        acceptanceCriteria: [
            'All 6 campaigns created',
            'Webhooks properly configured',
            'Custom variables working',
            'Message sequences set up'
        ]
    };
    
    // Component 6: AI Personalization Engine
    const aiStory = {
        title: 'AI Message Personalization Engine',
        description: 'Build OpenAI GPT-4 integration for generating personalized 3-message sequences for healthcare executives',
        priority: 'high',
        requirements: [
            'OpenAI GPT-4 API integration',
            'Healthcare executive context prompts',
            'Message 1: Introduction (150 words, no pitch)',
            'Message 2: Value Bridge (200 words, soft intro)',
            'Message 3: Clear CTA (150 words, specific ask)',
            'Research data compilation',
            'Quality validation checks',
            'Cost tracking per message'
        ],
        constraints: [
            'Cost under $0.013 per message',
            'Healthcare appropriate tone',
            'Message length limits'
        ],
        tags: ['ai', 'openai', 'personalization'],
        acceptanceCriteria: [
            'Generates relevant personalized messages',
            'Maintains healthcare executive tone',
            'Stays within word limits',
            'Cost per message under target'
        ]
    };
    
    // Process each story
    const storyInputs = [
        sheetsStory,
        enrichmentStory,
        routerStory,
        acceptanceStory,
        lemlistStory,
        aiStory
    ];
    
    for (const storyInput of storyInputs) {
        console.log(`\n📝 Creating: ${storyInput.title}`);
        console.log('-'.repeat(50));
        
        try {
            const result = await generator.generateStory(storyInput);
            stories.push(result);
            
            if (result.type === 'split') {
                console.log(`   ✂️ Split into ${result.childStories.length} subtasks`);
            } else {
                console.log(`   ✅ Created as single story`);
            }
            console.log(`   📁 File: ${result.file || result.parentStory?.file}`);
            
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n\n📊 Summary');
    console.log('=' .repeat(60));
    console.log(`Total stories created: ${stories.length}`);
    console.log('\nStory files created in: .bmad/stories/active/');
    
    return stories;
}

// Generate n8n Workflow Configurations
async function generateN8nWorkflows() {
    console.log('\n\n🔧 Generating n8n Workflow Configurations');
    console.log('=' .repeat(60));
    
    const workflowsDir = path.join(process.cwd(), 'n8n-workflows-generated');
    await fs.mkdir(workflowsDir, { recursive: true });
    
    // Workflow 1: Daily Enrichment Pipeline
    const dailyEnrichmentWorkflow = {
        name: "Daily Enrichment Pipeline",
        nodes: [
            {
                parameters: {
                    rule: {
                        interval: [{
                            field: "cronExpression",
                            expression: "0 9 * * *"  // 9 AM daily
                        }]
                    }
                },
                name: "Daily Trigger 9AM",
                type: "n8n-nodes-base.scheduleTrigger",
                position: [250, 300]
            },
            {
                parameters: {
                    authentication: "oAuth2",
                    operation: "read",
                    sheetId: "{{$env.GOOGLE_SHEET_ID}}",
                    range: "Raw Prospects!A2:Z",
                    filters: {
                        conditions: [{
                            column: "H",  // status column
                            value: "pending"
                        }]
                    },
                    options: {
                        returnAllMatches: false,
                        limit: 100
                    }
                },
                name: "Read Pending Prospects",
                type: "n8n-nodes-base.googleSheets",
                position: [450, 300]
            },
            {
                parameters: {
                    url: "https://api.lemlist.com/api/enrich",
                    method: "POST",
                    authentication: "genericCredentialType",
                    genericAuthType: "httpHeaderAuth",
                    headers: {
                        "X-API-KEY": "={{$credentials.lemlistApi}}"
                    },
                    bodyParametersUi: {
                        parameter: [
                            {
                                name: "firstName",
                                value: "={{$json.firstName}}"
                            },
                            {
                                name: "lastName", 
                                value: "={{$json.lastName}}"
                            },
                            {
                                name: "company",
                                value: "={{$json.company}}"
                            }
                        ]
                    },
                    options: {
                        batching: {
                            batch: {
                                batchSize: 20,
                                batchInterval: 2000  // Rate limit: 20/2sec
                            }
                        }
                    }
                },
                name: "Lemlist Enrichment",
                type: "n8n-nodes-base.httpRequest",
                position: [650, 300]
            },
            {
                parameters: {
                    conditions: {
                        boolean: [{
                            value1: "={{$json.email}}",
                            operation: "isEmpty"
                        }]
                    }
                },
                name: "Check Enrichment",
                type: "n8n-nodes-base.if",
                position: [850, 300]
            },
            {
                parameters: {
                    url: "https://api.apify.com/v2/acts/email-finder/run-sync",
                    method: "POST",
                    authentication: "genericCredentialType",
                    headers: {
                        "Authorization": "Bearer {{$credentials.apifyToken}}"
                    },
                    body: {
                        "name": "={{$json.firstName}} {{$json.lastName}}",
                        "company": "={{$json.company}}"
                    }
                },
                name: "Apify Fallback",
                type: "n8n-nodes-base.httpRequest",
                position: [850, 450]
            },
            {
                parameters: {
                    authentication: "oAuth2",
                    operation: "update",
                    sheetId: "{{$env.GOOGLE_SHEET_ID}}",
                    range: "Enriched Data!A:Z",
                    dataMode: "autoMapInputData",
                    options: {
                        upsert: true,
                        keyColumn: "email"
                    },
                    fieldsUi: {
                        fields: [
                            {
                                column: "email",
                                value: "={{$json.email}}"
                            },
                            {
                                column: "linkedinUrl",
                                value: "={{$json.linkedinUrl}}"
                            },
                            {
                                column: "status",
                                value: "enriched"
                            },
                            {
                                column: "enrichment_date",
                                value: "={{new Date().toISOString()}}"
                            }
                        ]
                    }
                },
                name: "Update Enriched Sheet",
                type: "n8n-nodes-base.googleSheets",
                position: [1050, 300]
            },
            {
                parameters: {
                    functionCode: `
                        const title = $json.title.toUpperCase();
                        let campaignType = 'General';
                        
                        if (['CHIEF', 'PRESIDENT', 'CEO', 'CFO', 'CTO', 'CIO', 'CMO'].some(t => title.includes(t))) {
                            campaignType = 'C-Suite';
                        } else if (['IT', 'DIGITAL', 'TECHNOLOGY', 'INFORMATICS', 'DATA'].some(t => title.includes(t))) {
                            campaignType = 'IT-Digital';
                        } else if (['PATIENT', 'EXPERIENCE', 'QUALITY', 'CLINICAL'].some(t => title.includes(t))) {
                            campaignType = 'Patient-Experience';
                        } else if (['REVENUE', 'OPERATIONS', 'FINANCE', 'RCM'].some(t => title.includes(t))) {
                            campaignType = 'Operations-Revenue';
                        }
                        
                        return {
                            ...$json,
                            campaignType,
                            routingComplete: true
                        };
                    `
                },
                name: "Classify by Title",
                type: "n8n-nodes-base.functionItem",
                position: [1250, 300]
            }
        ],
        connections: {
            "Daily Trigger 9AM": {
                main: [[{
                    node: "Read Pending Prospects",
                    type: "main",
                    index: 0
                }]]
            },
            "Read Pending Prospects": {
                main: [[{
                    node: "Lemlist Enrichment",
                    type: "main",
                    index: 0
                }]]
            },
            "Lemlist Enrichment": {
                main: [[{
                    node: "Check Enrichment",
                    type: "main",
                    index: 0
                }]]
            },
            "Check Enrichment": {
                main: [
                    [{
                        node: "Update Enriched Sheet",
                        type: "main",
                        index: 0
                    }],
                    [{
                        node: "Apify Fallback",
                        type: "main",
                        index: 0
                    }]
                ]
            },
            "Apify Fallback": {
                main: [[{
                    node: "Update Enriched Sheet",
                    type: "main",
                    index: 0
                }]]
            },
            "Update Enriched Sheet": {
                main: [[{
                    node: "Classify by Title",
                    type: "main",
                    index: 0
                }]]
            }
        },
        settings: {
            executionOrder: "v1"
        },
        staticData: null,
        tags: [],
        triggerCount: 0,
        updatedAt: "2025-09-04T12:00:00.000Z",
        versionId: "1"
    };
    
    // Workflow 2: Campaign Assignment Router
    const campaignRouterWorkflow = {
        name: "Campaign Assignment Router",
        nodes: [
            {
                parameters: {
                    rule: {
                        interval: [{
                            field: "hours",
                            hoursInterval: 1
                        }]
                    }
                },
                name: "Hourly Trigger",
                type: "n8n-nodes-base.scheduleTrigger",
                position: [250, 300]
            },
            {
                parameters: {
                    authentication: "oAuth2",
                    operation: "read",
                    sheetId: "{{$env.GOOGLE_SHEET_ID}}",
                    range: "Enriched Data!A2:Z",
                    filters: {
                        conditions: [{
                            column: "status",
                            value: "enriched"
                        }]
                    },
                    options: {
                        limit: 50
                    }
                },
                name: "Read Enriched Prospects",
                type: "n8n-nodes-base.googleSheets",
                position: [450, 300]
            },
            {
                parameters: {
                    fieldToSplitOut: "campaignType",
                    options: {}
                },
                name: "Split by Campaign",
                type: "n8n-nodes-base.itemLists",
                position: [650, 300]
            },
            {
                parameters: {
                    values: {
                        string: [{
                            name: "campaignId",
                            value: "={{$json.campaignType === 'C-Suite' ? $env.LEMLIST_CSUITE_CAMPAIGN : $json.campaignType === 'IT-Digital' ? $env.LEMLIST_IT_CAMPAIGN : $json.campaignType === 'Patient-Experience' ? $env.LEMLIST_PATIENT_CAMPAIGN : $json.campaignType === 'Operations-Revenue' ? $env.LEMLIST_OPS_CAMPAIGN : $env.LEMLIST_GENERAL_CAMPAIGN}}"
                        }]
                    }
                },
                name: "Set Campaign ID",
                type: "n8n-nodes-base.set",
                position: [850, 300]
            },
            {
                parameters: {
                    url: "https://api.lemlist.com/api/campaigns/{{$json.campaignId}}/leads",
                    method: "POST",
                    authentication: "genericCredentialType",
                    headers: {
                        "X-API-KEY": "={{$credentials.lemlistApi}}"
                    },
                    bodyParametersJson: {
                        "email": "={{$json.email}}",
                        "firstName": "={{$json.firstName}}",
                        "lastName": "={{$json.lastName}}",
                        "company": "={{$json.company}}",
                        "linkedinUrl": "={{$json.linkedinUrl}}"
                    },
                    options: {
                        batching: {
                            batch: {
                                batchSize: 20,
                                batchInterval: 2000
                            }
                        }
                    }
                },
                name: "Add to Lemlist Campaign",
                type: "n8n-nodes-base.httpRequest",
                position: [1050, 300]
            },
            {
                parameters: {
                    authentication: "oAuth2",
                    operation: "update",
                    sheetId: "{{$env.GOOGLE_SHEET_ID}}",
                    range: "Campaign Tracking!A:Z",
                    dataMode: "autoMapInputData",
                    fieldsUi: {
                        fields: [
                            {
                                column: "email",
                                value: "={{$json.email}}"
                            },
                            {
                                column: "connection_campaign_id",
                                value: "={{$json.campaignId}}"
                            },
                            {
                                column: "connection_sent_date",
                                value: "={{new Date().toISOString()}}"
                            },
                            {
                                column: "status",
                                value: "in_campaign"
                            }
                        ]
                    }
                },
                name: "Update Tracking",
                type: "n8n-nodes-base.googleSheets",
                position: [1250, 300]
            }
        ],
        connections: {
            "Hourly Trigger": {
                main: [[{
                    node: "Read Enriched Prospects",
                    type: "main",
                    index: 0
                }]]
            },
            "Read Enriched Prospects": {
                main: [[{
                    node: "Split by Campaign",
                    type: "main",
                    index: 0
                }]]
            },
            "Split by Campaign": {
                main: [[{
                    node: "Set Campaign ID",
                    type: "main",
                    index: 0
                }]]
            },
            "Set Campaign ID": {
                main: [[{
                    node: "Add to Lemlist Campaign",
                    type: "main",
                    index: 0
                }]]
            },
            "Add to Lemlist Campaign": {
                main: [[{
                    node: "Update Tracking",
                    type: "main",
                    index: 0
                }]]
            }
        },
        settings: {
            executionOrder: "v1"
        }
    };
    
    // Workflow 3: Connection Acceptance Handler
    const acceptanceHandlerWorkflow = {
        name: "Connection Acceptance Handler",
        nodes: [
            {
                parameters: {
                    httpMethod: "POST",
                    path: "lemlist-webhook",
                    responseMode: "onReceived",
                    responseCode: 200
                },
                name: "Lemlist Webhook",
                type: "n8n-nodes-base.webhook",
                position: [250, 300],
                webhookId: "{{$env.WEBHOOK_ID}}"
            },
            {
                parameters: {
                    jsCode: `
                        // Extract connection data
                        const data = $json;
                        return {
                            email: data.email,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            company: data.company,
                            linkedinUrl: data.linkedinUrl,
                            acceptedAt: new Date().toISOString()
                        };
                    `
                },
                name: "Extract Connection Data",
                type: "n8n-nodes-base.code",
                position: [450, 300]
            },
            {
                parameters: {},
                name: "Parallel Research",
                type: "n8n-nodes-base.merge",
                position: [850, 300]
            },
            {
                parameters: {
                    url: "https://api.apify.com/v2/acts/linkedin-scraper/runs",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer {{$credentials.apifyToken}}"
                    },
                    body: {
                        "profileUrl": "={{$json.linkedinUrl}}",
                        "includePosts": true,
                        "postsLimit": 10
                    }
                },
                name: "Apify LinkedIn Scraper",
                type: "n8n-nodes-base.httpRequest",
                position: [650, 200]
            },
            {
                parameters: {
                    url: "https://serpapi.com/search",
                    qs: {
                        "q": "={{$json.company}} news 2024",
                        "api_key": "={{$credentials.serperApiKey}}",
                        "num": "5"
                    }
                },
                name: "Serper News Search",
                type: "n8n-nodes-base.httpRequest",
                position: [650, 400]
            },
            {
                parameters: {
                    url: "https://api.openai.com/v1/chat/completions",
                    method: "POST",
                    authentication: "genericCredentialType",
                    headers: {
                        "Authorization": "Bearer {{$credentials.openaiApiKey}}"
                    },
                    bodyParametersJson: {
                        "model": "gpt-4",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are crafting personalized LinkedIn messages for healthcare executives. Based on the research provided, generate 3 progressive messages:\n\nMessage 1 (Introduction): Reference specific recent activity, genuine connection, under 150 words, no pitch.\n\nMessage 2 (Value Bridge): Reference company initiative, share insight, soft value intro, under 200 words.\n\nMessage 3 (Clear CTA): Direct but respectful, specific value prop, clear next step, under 150 words."
                            },
                            {
                                "role": "user",
                                "content": "Prospect: {{$json.firstName}} {{$json.lastName}}\\nTitle: {{$json.title}}\\nCompany: {{$json.company}}\\nResearch: {{$json.research}}"
                            }
                        ],
                        "temperature": 0.7
                    }
                },
                name: "Generate AI Messages",
                type: "n8n-nodes-base.httpRequest",
                position: [1050, 300]
            },
            {
                parameters: {
                    url: "https://api.lemlist.com/api/campaigns/{{$env.LEMLIST_ENGAGEMENT_CAMPAIGN}}/leads",
                    method: "POST",
                    headers: {
                        "X-API-KEY": "={{$credentials.lemlistApi}}"
                    },
                    bodyParametersJson: {
                        "email": "={{$json.email}}",
                        "firstName": "={{$json.firstName}}",
                        "lastName": "={{$json.lastName}}",
                        "custom_intro": "={{$json.message1}}",
                        "custom_value": "={{$json.message2}}",
                        "custom_cta": "={{$json.message3}}",
                        "research_notes": "={{$json.research_summary}}"
                    }
                },
                name: "Add to Engagement Campaign",
                type: "n8n-nodes-base.httpRequest",
                position: [1250, 300]
            }
        ],
        connections: {
            "Lemlist Webhook": {
                main: [[{
                    node: "Extract Connection Data",
                    type: "main",
                    index: 0
                }]]
            },
            "Extract Connection Data": {
                main: [[
                    {
                        node: "Apify LinkedIn Scraper",
                        type: "main",
                        index: 0
                    },
                    {
                        node: "Serper News Search",
                        type: "main",
                        index: 0
                    }
                ]]
            },
            "Apify LinkedIn Scraper": {
                main: [[{
                    node: "Parallel Research",
                    type: "main",
                    index: 0
                }]]
            },
            "Serper News Search": {
                main: [[{
                    node: "Parallel Research",
                    type: "main",
                    index: 1
                }]]
            },
            "Parallel Research": {
                main: [[{
                    node: "Generate AI Messages",
                    type: "main",
                    index: 0
                }]]
            },
            "Generate AI Messages": {
                main: [[{
                    node: "Add to Engagement Campaign",
                    type: "main",
                    index: 0
                }]]
            }
        },
        settings: {
            executionOrder: "v1"
        }
    };
    
    // Save workflow files
    const workflows = {
        'daily-enrichment-pipeline.json': dailyEnrichmentWorkflow,
        'campaign-assignment-router.json': campaignRouterWorkflow,
        'connection-acceptance-handler.json': acceptanceHandlerWorkflow
    };
    
    for (const [filename, workflow] of Object.entries(workflows)) {
        const filepath = path.join(workflowsDir, filename);
        await fs.writeFile(filepath, JSON.stringify(workflow, null, 2));
        console.log(`\n✅ Generated: ${filename}`);
        console.log(`   📁 Location: ${filepath}`);
        console.log(`   📊 Nodes: ${workflow.nodes.length}`);
    }
    
    console.log('\n\n📋 Environment Variables Required:');
    console.log('=' .repeat(60));
    console.log('GOOGLE_SHEET_ID=your_sheet_id');
    console.log('LEMLIST_CSUITE_CAMPAIGN=campaign_id_1');
    console.log('LEMLIST_IT_CAMPAIGN=campaign_id_2');
    console.log('LEMLIST_PATIENT_CAMPAIGN=campaign_id_3');
    console.log('LEMLIST_OPS_CAMPAIGN=campaign_id_4');
    console.log('LEMLIST_GENERAL_CAMPAIGN=campaign_id_5');
    console.log('LEMLIST_ENGAGEMENT_CAMPAIGN=campaign_id_6');
    console.log('WEBHOOK_ID=your_webhook_id');
    
    console.log('\n📋 API Credentials Required:');
    console.log('=' .repeat(60));
    console.log('- Google Sheets OAuth2');
    console.log('- Lemlist API Key');
    console.log('- Apify Token');
    console.log('- Serper API Key');
    console.log('- OpenAI API Key');
    
    return workflows;
}

// Main execution
async function main() {
    console.log('🚀 LinkedIn Automation Component Builder');
    console.log('=' .repeat(60));
    
    // Create granular stories
    const stories = await createGranularStories();
    
    // Generate n8n workflows
    const workflows = await generateN8nWorkflows();
    
    console.log('\n\n✨ Complete! Your LinkedIn automation components are ready:');
    console.log('=' .repeat(60));
    console.log('\n1. Granular stories created in: .bmad/stories/active/');
    console.log('2. n8n workflows generated in: n8n-workflows-generated/');
    console.log('\n📌 Next Steps:');
    console.log('   1. Import the n8n workflows to your n8n instance');
    console.log('   2. Configure environment variables and credentials');
    console.log('   3. Set up Google Sheets with the 4-tab structure');
    console.log('   4. Create Lemlist campaigns with webhooks');
    console.log('   5. Test with a small batch of prospects');
}

if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('❌ Error:', error);
            process.exit(1);
        });
}

module.exports = { createGranularStories, generateN8nWorkflows };