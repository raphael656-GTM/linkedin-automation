#!/usr/bin/env node

const { EnhancedStoryGenerator } = require('./routing/EnhancedStoryGenerator');
const ParallelStoryExecutor = require('./routing/ParallelStoryExecutor');

async function createLinkedInAutomationStory() {
    console.log('🚀 Creating LinkedIn Automation Story\n');
    
    const generator = new EnhancedStoryGenerator();
    const executor = new ParallelStoryExecutor({
        maxParallel: 5,
        logLevel: 'info'
    });
    
    const storyInput = {
        title: 'Build Complete Google Sheets to Lemlist LinkedIn Automation System',
        description: 'Implement the complete architecture for healthcare executive outreach: Google Sheets source → n8n orchestration → Lemlist campaigns with AI personalization, processing 3000 prospects/month',
        priority: 'high',
        requirements: [
            'Google Sheets with 4 tabs (Raw Prospects, Enriched Data, Campaign Tracking, Performance Metrics)',
            'n8n Workflow 1: Daily Enrichment Pipeline (9 AM trigger)',
            'n8n Workflow 2: Campaign Assignment Router (hourly)',
            'n8n Workflow 3: Connection Acceptance Handler (webhook)',
            '5 Lemlist connection campaigns by title (C-Suite, IT/Digital, Patient Experience, Operations/Revenue, General)',
            '1 Lemlist engagement campaign with AI variables',
            'Apify LinkedIn scraper integration',
            'Serper.dev news search integration',
            'OpenAI GPT-4 message generation with 3-message sequence',
            'Cost optimization under $0.25 per prospect'
        ],
        constraints: [
            'Lemlist API rate limit: 20 requests/2 seconds',
            'Process 3000 prospects/month',
            'Connection acceptance to message: under 5 minutes',
            'Message quality: healthcare executive appropriate',
            'Total cost: under $180/month'
        ],
        tags: ['linkedin', 'automation', 'n8n', 'lemlist', 'sheets', 'ai-personalization'],
        acceptanceCriteria: [
            'All 3 n8n workflows operational',
            '5 connection campaigns created in Lemlist',
            'AI generates personalized messages for each prospect',
            'System processes 100+ prospects daily',
            'Cost per prospect stays under $0.25',
            'Webhook response time under 5 minutes'
        ]
    };
    
    console.log('📝 Story Details:');
    console.log('Title:', storyInput.title);
    console.log('Priority:', storyInput.priority);
    console.log('Requirements:', storyInput.requirements.length);
    console.log('Constraints:', storyInput.constraints.length);
    console.log('Tags:', storyInput.tags.join(', '));
    
    console.log('\n🔍 Analyzing story for intelligent splitting...\n');
    
    try {
        const result = await generator.generateStory(storyInput);
        
        if (result.type === 'split') {
            console.log('✂️  Story Split Results:');
            console.log('=======================');
            console.log(`📄 Parent story: ${result.parentStory.story.title}`);
            console.log(`📁 File: ${result.parentStory.file}`);
            
            console.log(`\n📚 Child stories (${result.childStories.length}):`);
            result.childStories.forEach((child, index) => {
                console.log(`\n${index + 1}. ${child.story.title}`);
                console.log(`   📁 File: ${child.file}`);
                console.log(`   🏷️  Type: ${child.story.type}`);
                console.log(`   ⭐ Priority: ${child.story.priority}`);
                console.log(`   🎯 Complexity: ${child.story.estimatedComplexity}`);
                if (child.story.dependencies?.length > 0) {
                    console.log(`   🔗 Dependencies: ${child.story.dependencies.join(', ')}`);
                }
            });
            
            if (result.conflicts && result.conflicts.length > 0) {
                console.log(`\n⚠️  Conflicts detected (${result.conflicts.length}):`);
                result.conflicts.forEach(conflict => {
                    console.log(`   - ${conflict.description} (${conflict.severity})`);
                    console.log(`     Resolution: ${conflict.resolution}`);
                });
            }
            
            console.log('\n📋 Recommended execution order:');
            if (result.executionOrder && result.executionOrder.length > 0) {
                result.executionOrder.forEach((story, index) => {
                    console.log(`   ${index + 1}. ${story.title} (${story.id})`);
                });
            }
            
            console.log('\n✅ Story creation completed successfully!');
            console.log('\n🤖 Starting parallel agent execution...\n');
            
            // Automatically execute with agents
            const execution = await executor.executeSplitStories(result);
            
            console.log('\n📊 Execution Results:');
            console.log('======================');
            console.log(`Status: ${execution.status}`);
            console.log(`Duration: ${execution.duration}ms`);
            console.log(`Stories executed: ${execution.results.length}`);
            
            const successful = execution.results.filter(r => r.status === 'completed').length;
            const failed = execution.results.filter(r => r.status === 'failed').length;
            
            console.log(`✅ Successful: ${successful}`);
            if (failed > 0) {
                console.log(`❌ Failed: ${failed}`);
            }
            
            console.log('\n📋 Detailed Results by Component:');
            execution.results.forEach((result, i) => {
                console.log(`\n${i + 1}. ${result.story.title}`);
                console.log(`   Status: ${result.status}`);
                if (result.specialist) {
                    console.log(`   Specialist: ${result.specialist} (Tier ${result.tier})`);
                    console.log(`   Complexity: ${result.complexity?.score || 'N/A'}/10`);
                }
                if (result.duration) {
                    console.log(`   Duration: ${result.duration}ms`);
                }
                if (result.qualityScore) {
                    console.log(`   Quality Score: ${(result.qualityScore.overall * 100).toFixed(1)}%`);
                }
                if (result.recommendation) {
                    console.log(`   Implementation: Ready in ${result.story.id}.md`);
                }
            });
            
            console.log('\n📁 Implementation files created in:');
            console.log('   .bmad/stories/active/');
            console.log('   .bmad/executions/completed/');
            
        } else {
            console.log('\n📄 Single Story Created:');
            console.log('========================');
            console.log(`📝 Title: ${result.story.title}`);
            console.log(`📁 File: ${result.file}`);
            console.log(`🏷️  Type: ${result.story.type}`);
            console.log(`⭐ Priority: ${result.story.priority}`);
            console.log(`🎯 Complexity: ${result.story.estimatedComplexity}`);
            
            console.log('\n⚠️  Story was not split. Consider breaking requirements into separate components.');
        }
        
    } catch (error) {
        console.error('\n❌ Error creating story:', error.message);
        console.error(error.stack);
    }
}

// Run if called directly
if (require.main === module) {
    createLinkedInAutomationStory()
        .then(() => {
            console.log('\n✨ LinkedIn Automation story creation and execution completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Failed:', error);
            process.exit(1);
        });
}

module.exports = { createLinkedInAutomationStory };