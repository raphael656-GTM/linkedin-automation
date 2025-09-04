#!/usr/bin/env node

const readline = require('readline');
const { EnhancedStoryGenerator } = require('../routing/EnhancedStoryGenerator');
const ParallelStoryExecutor = require('../routing/ParallelStoryExecutor');

class InteractiveStoryGenerator {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.generator = new EnhancedStoryGenerator();
        this.executor = new ParallelStoryExecutor({
            maxParallel: 5,
            logLevel: 'info'
        });
    }
    
    async run() {
        console.log('🚀 BMAD Story Generator with Intelligent Splitting\n');
        
        try {
            await this.showMainMenu();
        } catch (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        } finally {
            this.rl.close();
        }
    }
    
    async showMainMenu() {
        console.log('Available actions:');
        console.log('1. Create new story');
        console.log('2. Execute story with agents (parallel)');
        console.log('3. List active stories');
        console.log('4. List completed stories');
        console.log('5. Mark story as complete');
        console.log('6. View execution history');
        console.log('7. Exit');
        
        const choice = await this.ask('Choose an action (1-7): ');
        
        switch (choice.trim()) {
            case '1':
                await this.createNewStory();
                break;
            case '2':
                await this.executeStoryWithAgents();
                break;
            case '3':
                await this.listStories('active');
                break;
            case '4':
                await this.listStories('completed');
                break;
            case '5':
                await this.markStoryComplete();
                break;
            case '6':
                await this.viewExecutionHistory();
                break;
            case '7':
                console.log('👋 Goodbye!');
                return;
            default:
                console.log('Invalid choice. Please try again.\n');
                await this.showMainMenu();
        }
        
        console.log('\n');
        await this.showMainMenu();
    }
    
    async createNewStory() {
        console.log('\n📝 Create New Story');
        console.log('===================');
        
        const storyInput = {};
        
        // Gather story information
        storyInput.title = await this.ask('Story title: ');
        storyInput.description = await this.ask('Description: ');
        storyInput.priority = await this.ask('Priority (low/medium/high) [medium]: ') || 'medium';
        
        // Requirements
        console.log('\nRequirements (press Enter twice when done):');
        storyInput.requirements = await this.gatherList('Requirement');
        
        // Constraints
        console.log('\nConstraints (press Enter twice when done):');
        storyInput.constraints = await this.gatherList('Constraint');
        
        // Tags
        const tagsInput = await this.ask('Tags (comma-separated): ');
        storyInput.tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];
        
        // Acceptance criteria
        console.log('\nAcceptance Criteria (press Enter twice when done):');
        storyInput.acceptanceCriteria = await this.gatherList('Criteria');
        
        console.log('\n🔍 Analyzing story and checking for potential splits...');
        
        try {
            const result = await this.generator.generateStory(storyInput);
            
            if (result.type === 'split') {
                console.log('\n✂️  Story Split Results:');
                console.log('=======================');
                console.log(`📄 Parent story: ${result.parentStory.story.title}`);
                console.log(`📁 File: ${result.parentStory.file}`);
                
                console.log(`\n📚 Child stories (${result.childStories.length}):`);
                result.childStories.forEach((child, index) => {
                    console.log(`   ${index + 1}. ${child.story.title}`);
                    console.log(`      📁 File: ${child.file}`);
                    console.log(`      🏷️  Type: ${child.story.type}`);
                    if (child.story.dependencies?.length > 0) {
                        console.log(`      🔗 Dependencies: ${child.story.dependencies.join(', ')}`);
                    }
                });
                
                // Ask if user wants to execute immediately
                const executeNow = await this.ask('\n🚀 Execute stories with agents now? (y/n): ');
                if (executeNow.toLowerCase() === 'y') {
                    console.log('\n🤖 Starting parallel agent execution...');
                    await this.executor.executeSplitStories(result);
                }
                
                if (result.conflicts.length > 0) {
                    console.log(`\n⚠️  Conflicts detected (${result.conflicts.length}):`);
                    result.conflicts.forEach(conflict => {
                        console.log(`   - ${conflict.description} (${conflict.severity})`);
                        console.log(`     Resolution: ${conflict.resolution}`);
                    });
                }
                
                console.log('\n📋 Recommended execution order:');
                result.executionOrder.forEach((story, index) => {
                    console.log(`   ${index + 1}. ${story.title} (${story.id})`);
                });
                
            } else {
                console.log('\n📄 Single Story Created:');
                console.log('========================');
                console.log(`📝 Title: ${result.story.title}`);
                console.log(`📁 File: ${result.file}`);
                console.log(`🏷️  Type: ${result.story.type}`);
                console.log(`⭐ Priority: ${result.story.priority}`);
                console.log(`🎯 Complexity: ${result.story.estimatedComplexity}`);
            }
            
            console.log('\n✅ Story creation completed successfully!');
            
        } catch (error) {
            console.error('\n❌ Error creating story:', error.message);
        }
    }
    
    async listStories(status) {
        console.log(`\n📚 ${status.charAt(0).toUpperCase() + status.slice(1)} Stories`);
        console.log('='.repeat(15 + status.length));
        
        try {
            const stories = await this.generator.listStories(status);
            
            if (stories.length === 0) {
                console.log(`No ${status} stories found.`);
                return;
            }
            
            stories.forEach((story, index) => {
                console.log(`\n${index + 1}. ${story.title || 'Untitled'}`);
                console.log(`   ID: ${story.id || 'Unknown'}`);
                console.log(`   Type: ${story.type || 'Unknown'}`);
                console.log(`   Priority: ${story.priority || 'Unknown'}`);
                console.log(`   File: ${story.file}`);
            });
            
        } catch (error) {
            console.error(`❌ Error listing ${status} stories:`, error.message);
        }
    }
    
    async markStoryComplete() {
        console.log('\n✅ Mark Story as Complete');
        console.log('==========================');
        
        try {
            // Show active stories first
            const activeStories = await this.generator.listStories('active');
            
            if (activeStories.length === 0) {
                console.log('No active stories found.');
                return;
            }
            
            console.log('Active stories:');
            activeStories.forEach((story, index) => {
                console.log(`${index + 1}. ${story.title} (${story.id})`);
            });
            
            const choice = await this.ask('Enter story number or ID: ');
            
            let storyId;
            if (/^\d+$/.test(choice)) {
                const index = parseInt(choice) - 1;
                if (index >= 0 && index < activeStories.length) {
                    storyId = activeStories[index].id;
                } else {
                    console.log('Invalid story number.');
                    return;
                }
            } else {
                storyId = choice;
            }
            
            const completedFile = await this.generator.markStoryComplete(storyId);
            console.log(`✅ Story ${storyId} marked as completed.`);
            console.log(`📁 Moved to: ${completedFile}`);
            
        } catch (error) {
            console.error('❌ Error marking story as complete:', error.message);
        }
    }
    
    async gatherList(itemType) {
        const items = [];
        let counter = 1;
        
        while (true) {
            const item = await this.ask(`${itemType} ${counter}: `);
            
            if (!item.trim()) {
                break;
            }
            
            items.push(item.trim());
            counter++;
        }
        
        return items;
    }
    
    async ask(question) {
        return new Promise((resolve) => {
            this.rl.question(question, resolve);
        });
    }
    
    async executeStoryWithAgents() {
        console.log('\n🤖 Execute Story with Parallel Agents');
        console.log('======================================');
        
        try {
            // List recent split stories
            const parentStories = await this.generator.listStories('active');
            const splitStories = parentStories.filter(s => s.status === 'split' || s.title?.includes('[SPLIT]'));
            
            if (splitStories.length === 0) {
                console.log('No split stories found. Create a story first and let it be split.');
                return;
            }
            
            console.log('Available split stories:');
            splitStories.forEach((story, index) => {
                console.log(`${index + 1}. ${story.title} (${story.id})`);
                if (story.splitInto) {
                    console.log(`   Split into ${story.splitInto.length} subtasks`);
                }
            });
            
            const choice = await this.ask('\nSelect story to execute (number): ');
            const storyIndex = parseInt(choice) - 1;
            
            if (storyIndex < 0 || storyIndex >= splitStories.length) {
                console.log('Invalid selection.');
                return;
            }
            
            const selectedStory = splitStories[storyIndex];
            
            // Reconstruct the split result from stored data
            const splitResult = {
                type: 'split',
                parentStory: { story: selectedStory },
                childStories: [],
                executionOrder: selectedStory.executionOrder || [],
                conflicts: selectedStory.conflicts || []
            };
            
            // Load child stories
            if (selectedStory.splitInto) {
                for (const childId of selectedStory.splitInto) {
                    const childStory = await this.generator.getStory(childId);
                    if (childStory) {
                        splitResult.childStories.push({ story: childStory });
                    }
                }
            }
            
            console.log(`\n🚀 Executing ${splitResult.childStories.length} stories in parallel...`);
            const execution = await this.executor.executeSplitStories(splitResult);
            
            console.log('\n📊 Execution Results:');
            console.log(`Status: ${execution.status}`);
            console.log(`Duration: ${execution.duration}ms`);
            console.log(`Stories executed: ${execution.results.length}`);
            
            const successful = execution.results.filter(r => r.status === 'completed').length;
            const failed = execution.results.filter(r => r.status === 'failed').length;
            
            console.log(`✅ Successful: ${successful}`);
            if (failed > 0) {
                console.log(`❌ Failed: ${failed}`);
            }
            
        } catch (error) {
            console.error('❌ Error executing story:', error.message);
        }
    }
    
    async viewExecutionHistory() {
        console.log('\n📊 Execution History');
        console.log('====================');
        
        const history = this.executor.getExecutionHistory();
        
        if (history.length === 0) {
            console.log('No execution history available.');
            return;
        }
        
        console.log(`\nTotal executions: ${history.length}`);
        
        history.forEach((exec, index) => {
            console.log(`\n${index + 1}. Execution ${exec.id}`);
            console.log(`   Parent: ${exec.parentStory}`);
            console.log(`   Status: ${exec.status}`);
            console.log(`   Duration: ${exec.duration ? exec.duration + 'ms' : 'N/A'}`);
            console.log(`   Stories: ${exec.storiesExecuted} executed, ${exec.failures} failed`);
            console.log(`   Time: ${exec.startTime}`);
        });
        
        // Show active executions if any
        const active = this.executor.getActiveExecutions();
        if (active.length > 0) {
            console.log(`\n🔄 Active Executions: ${active.length}`);
            active.forEach(exec => {
                console.log(`   - ${exec.id}: ${exec.parentStory.title}`);
            });
        }
    }
}

// Run the interactive story generator
if (require.main === module) {
    const generator = new InteractiveStoryGenerator();
    generator.run().catch(console.error);
}

module.exports = { InteractiveStoryGenerator };