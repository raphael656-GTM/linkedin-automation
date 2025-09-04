#!/usr/bin/env node

/**
 * Test script to demonstrate parallel story execution with sub-agents
 */

const ParallelStoryExecutor = require('../routing/ParallelStoryExecutor');
const { EnhancedStoryGenerator } = require('../routing/EnhancedStoryGenerator');

async function testParallelExecution() {
    console.log('🧪 Testing Parallel Story Execution with Sub-Agents\n');
    console.log('=' .repeat(50));
    
    // Initialize components
    const generator = new EnhancedStoryGenerator();
    const executor = new ParallelStoryExecutor({
        maxParallel: 3,
        logLevel: 'debug'
    });
    
    // Test Story 1: LinkedIn Authentication with Rate Limiting
    console.log('\n📝 Test Case 1: LinkedIn Authentication with Rate Limiting');
    console.log('-'.repeat(50));
    
    const authStoryInput = {
        title: 'Implement LinkedIn Authentication with Rate Limiting',
        description: 'Add LinkedIn OAuth authentication flow with rate limiting to prevent API abuse',
        priority: 'high',
        requirements: [
            'OAuth 2.0 authentication flow',
            'JWT token management',
            'Rate limiting per user (100 requests/hour)',
            'Frontend login UI with LinkedIn button',
            'Backend API endpoints for auth',
            'Session management and persistence'
        ],
        constraints: [
            'Must comply with LinkedIn API terms',
            'Support 1000+ concurrent users',
            'Response time under 2 seconds'
        ],
        tags: ['auth', 'linkedin', 'security', 'rate-limiting'],
        acceptanceCriteria: [
            'Users can login with LinkedIn',
            'Rate limiting prevents API abuse',
            'Sessions persist across browser restarts',
            'Error handling for auth failures'
        ]
    };
    
    try {
        // Generate and potentially split the story
        console.log('\n🔍 Analyzing story for intelligent splitting...');
        const authResult = await generator.generateStory(authStoryInput);
        
        if (authResult.type === 'split') {
            console.log(`\n✂️  Story split into ${authResult.childStories.length} subtasks:`);
            authResult.childStories.forEach((child, i) => {
                console.log(`   ${i + 1}. ${child.story.title}`);
                console.log(`      Type: ${child.story.type}, Priority: ${child.story.priority}`);
            });
            
            // Execute the split stories in parallel
            console.log('\n🚀 Starting parallel execution with sub-agents...');
            const execution = await executor.executeSplitStories(authResult);
            
            // Display results
            console.log('\n📊 Execution Results:');
            console.log(`   Status: ${execution.status}`);
            console.log(`   Duration: ${execution.duration}ms`);
            console.log(`   Stories Executed: ${execution.results.length}`);
            
            // Show individual story results
            console.log('\n📋 Individual Story Results:');
            execution.results.forEach((result, i) => {
                console.log(`\n   ${i + 1}. ${result.story.title}`);
                console.log(`      Status: ${result.status}`);
                console.log(`      Specialist: ${result.specialist} (Tier ${result.tier})`);
                console.log(`      Complexity Score: ${result.complexity.score}/10`);
                console.log(`      Duration: ${result.duration}ms`);
                
                if (result.qualityScore) {
                    console.log(`      Quality Score: ${(result.qualityScore.overall * 100).toFixed(1)}%`);
                }
                
                if (result.recommendation) {
                    console.log(`      Recommendation: ${result.recommendation.approach?.substring(0, 100)}...`);
                }
            });
            
            // Show parallel execution groups
            console.log('\n🔄 Execution Groups (Parallel Batches):');
            const groups = executor.groupByDependencies(authResult.executionOrder);
            groups.forEach((group, i) => {
                console.log(`   Group ${i + 1} (Parallel):`);
                group.forEach(story => {
                    console.log(`      - ${story.title}`);
                });
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    // Test Story 2: Multiple Feature Story
    console.log('\n\n📝 Test Case 2: Multiple Features in One Request');
    console.log('-'.repeat(50));
    
    const multiFeatureInput = {
        title: 'Add profile scraping, data export, and analytics dashboard',
        description: 'Implement LinkedIn profile scraping with data export to CSV and analytics dashboard for insights',
        priority: 'medium',
        requirements: [
            'Scrape LinkedIn profiles',
            'Export data to CSV format',
            'Create analytics dashboard',
            'Store data in database'
        ],
        constraints: [
            'Rate limit scraping to 50 profiles/hour',
            'Dashboard must be responsive'
        ],
        tags: ['scraping', 'export', 'analytics'],
        acceptanceCriteria: [
            'Can scrape profiles successfully',
            'CSV export works correctly',
            'Dashboard displays key metrics'
        ]
    };
    
    try {
        console.log('\n🔍 Analyzing multi-feature story...');
        const multiResult = await generator.generateStory(multiFeatureInput);
        
        if (multiResult.type === 'split') {
            console.log(`\n✂️  Story split into ${multiResult.childStories.length} features:`);
            
            // Check for conflicts
            if (multiResult.conflicts && multiResult.conflicts.length > 0) {
                console.log('\n⚠️  Conflicts detected:');
                multiResult.conflicts.forEach(conflict => {
                    console.log(`   - ${conflict.description}`);
                    console.log(`     Severity: ${conflict.severity}`);
                    console.log(`     Resolution: ${conflict.resolution}`);
                });
            }
            
            console.log('\n🚀 Executing multiple features in parallel...');
            const multiExecution = await executor.executeSplitStories(multiResult);
            
            console.log('\n📊 Multi-Feature Execution Summary:');
            const successful = multiExecution.results.filter(r => r.status === 'completed').length;
            const failed = multiExecution.results.filter(r => r.status === 'failed').length;
            console.log(`   ✅ Successful: ${successful}/${multiExecution.results.length}`);
            if (failed > 0) {
                console.log(`   ❌ Failed: ${failed}/${multiExecution.results.length}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Multi-feature test failed:', error.message);
    }
    
    // Display execution history
    console.log('\n\n📜 Execution History Summary');
    console.log('-'.repeat(50));
    const history = executor.getExecutionHistory();
    console.log(`Total Executions: ${history.length}`);
    history.forEach((exec, i) => {
        console.log(`${i + 1}. ${exec.parentStory} - ${exec.status} (${exec.duration}ms)`);
    });
    
    console.log('\n✅ Parallel execution test completed!');
}

// Run the test
if (require.main === module) {
    testParallelExecution()
        .then(() => {
            console.log('\n👋 Test completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Test failed with error:', error);
            process.exit(1);
        });
}

module.exports = { testParallelExecution };