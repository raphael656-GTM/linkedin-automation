#!/usr/bin/env node

const { EnhancedStoryGenerator } = require('../routing/EnhancedStoryGenerator');

class StorySpittingTester {
    constructor() {
        this.generator = new EnhancedStoryGenerator();
    }
    
    async runTests() {
        console.log('🧪 Testing Story Splitting Functionality\n');
        
        const testCases = [
            {
                name: 'Frontend + Backend Split',
                story: {
                    title: 'User Authentication System',
                    description: 'Create a complete user authentication system with frontend login forms and backend JWT API endpoints',
                    requirements: ['JWT tokens', 'Password validation', 'User registration'],
                    constraints: ['Security compliance', '2-week timeline']
                }
            },
            {
                name: 'API + Implementation Split', 
                story: {
                    title: 'Product Catalog API',
                    description: 'Design and implement a product catalog API with full CRUD operations',
                    requirements: ['REST endpoints', 'Database integration', 'Search functionality'],
                    constraints: ['Performance requirements', 'Backward compatibility']
                }
            },
            {
                name: 'Multiple Features Split',
                story: {
                    title: 'E-commerce Enhancements',
                    description: 'Add shopping cart functionality and implement user reviews and create order tracking system',
                    requirements: ['Cart persistence', 'Review moderation', 'Order notifications'],
                    constraints: ['Mobile compatibility', 'Load testing required']
                }
            },
            {
                name: 'Authentication Flow Split',
                story: {
                    title: 'Social Login Integration',
                    description: 'Implement social login authentication with Google OAuth and Facebook login integration',
                    requirements: ['OAuth 2.0', 'Profile sync', 'Account linking'],
                    constraints: ['Privacy compliance', 'Mobile app support']
                }
            },
            {
                name: 'Single Feature (No Split Expected)',
                story: {
                    title: 'Bug Fix: Memory Leak',
                    description: 'Fix memory leak in the user session management component',
                    requirements: ['Memory profiling', 'Session cleanup'],
                    constraints: ['No downtime', 'Performance monitoring']
                }
            }
        ];
        
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`\n${'='.repeat(50)}`);
            console.log(`Test ${i + 1}: ${testCase.name}`);
            console.log(`${'='.repeat(50)}`);
            
            try {
                console.log(`📝 Original Story: ${testCase.story.title}`);
                console.log(`📄 Description: ${testCase.story.description}`);
                
                const result = await this.generator.generateStory(testCase.story);
                
                if (result.type === 'split') {
                    console.log(`\n✂️  SPLIT DETECTED - Created ${result.childStories.length} subtasks:`);
                    
                    result.childStories.forEach((child, index) => {
                        console.log(`\n   ${index + 1}. ${child.story.title}`);
                        console.log(`      📋 Type: ${child.story.type}`);
                        console.log(`      📝 Description: ${child.story.description}`);
                        
                        if (child.story.dependencies?.length > 0) {
                            console.log(`      🔗 Dependencies: ${child.story.dependencies.join(', ')}`);
                        }
                        
                        if (child.story.tags?.length > 0) {
                            console.log(`      🏷️  Tags: ${child.story.tags.join(', ')}`);
                        }
                    });
                    
                    if (result.conflicts.length > 0) {
                        console.log(`\n   ⚠️  Conflicts (${result.conflicts.length}):`);
                        result.conflicts.forEach(conflict => {
                            console.log(`      - ${conflict.description} (${conflict.severity})`);
                            console.log(`        Resolution: ${conflict.resolution}`);
                        });
                    } else {
                        console.log(`\n   ✅ No conflicts detected`);
                    }
                    
                    console.log(`\n   📋 Execution Order:`);
                    result.executionOrder.forEach((story, index) => {
                        console.log(`      ${index + 1}. ${story.title}`);
                    });
                    
                } else {
                    console.log(`\n📄 SINGLE STORY - No split recommended`);
                    console.log(`   🏷️  Type: ${result.story.type}`);
                    console.log(`   ⭐ Priority: ${result.story.priority}`);
                    console.log(`   🎯 Complexity: ${result.story.estimatedComplexity}`);
                }
                
                console.log(`\n✅ Test completed successfully`);
                
            } catch (error) {
                console.error(`\n❌ Test failed: ${error.message}`);
                console.error(error.stack);
            }
        }
        
        console.log(`\n\n${'='.repeat(50)}`);
        console.log('📊 Test Summary');
        console.log(`${'='.repeat(50)}`);
        console.log('All story splitting tests completed!');
        console.log('Check the .bmad/stories/active/ directory for generated story files.');
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new StorySpittingTester();
    tester.runTests().catch(console.error);
}

module.exports = { StorySpittingTester };