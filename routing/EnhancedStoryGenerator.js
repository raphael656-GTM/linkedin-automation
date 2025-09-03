const fs = require('fs');
const path = require('path');
const { StoryAnalyzer } = require('./StoryAnalyzer');

class EnhancedStoryGenerator {
    constructor(options = {}) {
        this.bmadPath = options.bmadPath || '.bmad';
        this.storiesPath = path.join(this.bmadPath, 'stories');
        this.configPath = path.join(this.bmadPath, 'config', 'bmad-config.json');
        this.analyzer = new StoryAnalyzer();
        
        this.storyTemplates = {
            feature: {
                title: 'Feature Implementation',
                sections: ['overview', 'requirements', 'acceptance_criteria', 'technical_approach'],
                estimatedComplexity: 'medium'
            },
            bugfix: {
                title: 'Bug Fix',
                sections: ['problem_description', 'root_cause', 'solution_approach', 'testing_strategy'],
                estimatedComplexity: 'low'
            },
            refactor: {
                title: 'Code Refactoring',
                sections: ['current_state', 'target_state', 'refactoring_steps', 'risk_assessment'],
                estimatedComplexity: 'medium'
            },
            architecture: {
                title: 'Architecture Change',
                sections: ['current_architecture', 'proposed_architecture', 'migration_plan', 'impact_analysis'],
                estimatedComplexity: 'high'
            }
        };
        
        this.ensureDirectories();
    }
    
    ensureDirectories() {
        const dirs = [
            this.bmadPath,
            this.storiesPath,
            path.join(this.storiesPath, 'active'),
            path.join(this.storiesPath, 'completed'),
            path.join(this.storiesPath, 'templates'),
            path.join(this.bmadPath, 'config')
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }
    
    async generateStory(input) {
        console.log('🔍 Analyzing story input for potential splits...');
        
        // Create initial story from input
        const initialStory = this.createStoryFromInput(input);
        
        // Analyze if story should be split
        const splitAnalysis = await this.analyzer.generateSplitSuggestion(initialStory);
        
        if (splitAnalysis.shouldSplit) {
            console.log(`✂️  Story can be split into ${splitAnalysis.suggestedStories.length} non-conflicting subtasks`);
            console.log('📋 Suggested breakdown:');
            
            splitAnalysis.suggestedStories.forEach((story, index) => {
                console.log(`   ${index + 1}. ${story.title}`);
            });
            
            if (splitAnalysis.conflicts.length > 0) {
                console.log('⚠️  Potential conflicts detected:');
                splitAnalysis.conflicts.forEach(conflict => {
                    console.log(`   - ${conflict.description} (${conflict.severity})`);
                    console.log(`     Resolution: ${conflict.resolution}`);
                });
            }
            
            // Ask user for confirmation
            const shouldProceed = await this.confirmSplit(splitAnalysis);
            
            if (shouldProceed) {
                return await this.createMultipleStories(splitAnalysis);
            }
        }
        
        // Create single story if no split needed or user declined
        console.log('📝 Creating single story...');
        return await this.createSingleStory(initialStory);
    }
    
    createStoryFromInput(input) {
        const storyType = this.detectStoryType(input.description);
        const template = this.storyTemplates[storyType];
        
        return {
            id: this.generateStoryId(),
            title: input.title || input.description,
            description: input.description,
            type: storyType,
            priority: input.priority || 'medium',
            estimatedComplexity: template.estimatedComplexity,
            requirements: input.requirements || [],
            constraints: input.constraints || [],
            tags: input.tags || [],
            acceptanceCriteria: input.acceptanceCriteria || [],
            createdAt: new Date().toISOString(),
            status: 'active'
        };
    }
    
    detectStoryType(description) {
        const desc = description.toLowerCase();
        
        if (desc.includes('bug') || desc.includes('fix') || desc.includes('error')) {
            return 'bugfix';
        }
        
        if (desc.includes('refactor') || desc.includes('cleanup') || desc.includes('optimize')) {
            return 'refactor';
        }
        
        if (desc.includes('architecture') || desc.includes('system') || desc.includes('design')) {
            return 'architecture';
        }
        
        return 'feature';
    }
    
    async confirmSplit(splitAnalysis) {
        // In a real implementation, this would use readline or similar
        // For now, we'll assume user wants to split if conflicts are manageable
        const highConflicts = splitAnalysis.conflicts.filter(c => c.severity === 'high').length;
        
        if (highConflicts > 0) {
            console.log('❌ High-severity conflicts detected. Keeping as single story.');
            return false;
        }
        
        console.log('✅ Proceeding with story split based on analysis.');
        return true;
    }
    
    async createMultipleStories(splitAnalysis) {
        const createdStories = [];
        
        // Create stories in execution order
        for (const story of splitAnalysis.executionOrder) {
            const storyFile = await this.writeStoryFile(story);
            createdStories.push({
                story,
                file: storyFile
            });
            
            console.log(`📄 Created: ${story.title} (${story.id})`);
        }
        
        // Create a parent story that references the split stories
        const parentStory = {
            ...splitAnalysis.originalStory,
            id: `${splitAnalysis.originalStory.id}_parent`,
            title: `[SPLIT] ${splitAnalysis.originalStory.title}`,
            status: 'split',
            splitInto: createdStories.map(cs => cs.story.id),
            executionOrder: splitAnalysis.executionOrder.map(s => s.id),
            conflicts: splitAnalysis.conflicts,
            recommendation: splitAnalysis.recommendation
        };
        
        const parentFile = await this.writeStoryFile(parentStory);
        
        return {
            type: 'split',
            parentStory: { story: parentStory, file: parentFile },
            childStories: createdStories,
            executionOrder: splitAnalysis.executionOrder,
            conflicts: splitAnalysis.conflicts
        };
    }
    
    async createSingleStory(story) {
        const storyFile = await this.writeStoryFile(story);
        
        return {
            type: 'single',
            story,
            file: storyFile
        };
    }
    
    async writeStoryFile(story) {
        const filename = `${story.id}.md`;
        const filepath = path.join(this.storiesPath, 'active', filename);
        
        const content = this.generateStoryContent(story);
        fs.writeFileSync(filepath, content);
        
        return filepath;
    }
    
    generateStoryContent(story) {
        const template = this.storyTemplates[story.type];
        
        let content = `# ${story.title}\n\n`;
        content += `**ID:** ${story.id}\n`;
        content += `**Type:** ${story.type}\n`;
        content += `**Priority:** ${story.priority}\n`;
        content += `**Complexity:** ${story.estimatedComplexity}\n`;
        content += `**Status:** ${story.status}\n`;
        content += `**Created:** ${story.createdAt}\n\n`;
        
        if (story.tags && story.tags.length > 0) {
            content += `**Tags:** ${story.tags.join(', ')}\n\n`;
        }
        
        if (story.dependencies && story.dependencies.length > 0) {
            content += `**Dependencies:** ${story.dependencies.join(', ')}\n\n`;
        }
        
        content += `## Description\n${story.description}\n\n`;
        
        if (story.requirements && story.requirements.length > 0) {
            content += `## Requirements\n`;
            story.requirements.forEach(req => {
                content += `- ${req}\n`;
            });
            content += '\n';
        }
        
        if (story.constraints && story.constraints.length > 0) {
            content += `## Constraints\n`;
            story.constraints.forEach(constraint => {
                content += `- ${constraint}\n`;
            });
            content += '\n';
        }
        
        if (story.acceptanceCriteria && story.acceptanceCriteria.length > 0) {
            content += `## Acceptance Criteria\n`;
            story.acceptanceCriteria.forEach((criteria, index) => {
                content += `${index + 1}. ${criteria}\n`;
            });
            content += '\n';
        }
        
        // Add template sections
        if (template && template.sections) {
            template.sections.forEach(section => {
                const sectionTitle = section.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                content += `## ${sectionTitle}\n_TODO: Fill in this section_\n\n`;
            });
        }
        
        if (story.conflicts && story.conflicts.length > 0) {
            content += `## Potential Conflicts\n`;
            story.conflicts.forEach(conflict => {
                content += `- **${conflict.type}** (${conflict.severity}): ${conflict.description}\n`;
                content += `  - Resolution: ${conflict.resolution}\n`;
            });
            content += '\n';
        }
        
        if (story.splitInto && story.splitInto.length > 0) {
            content += `## Split Stories\n`;
            content += `This story has been split into the following subtasks:\n`;
            story.splitInto.forEach(storyId => {
                content += `- ${storyId}\n`;
            });
            content += '\n';
            
            if (story.executionOrder) {
                content += `### Execution Order\n`;
                story.executionOrder.forEach((storyId, index) => {
                    content += `${index + 1}. ${storyId}\n`;
                });
                content += '\n';
            }
        }
        
        content += `## Notes\n_Add implementation notes, decisions, and updates here_\n\n`;
        content += `## Progress\n- [ ] Story analysis complete\n- [ ] Implementation started\n- [ ] Implementation complete\n- [ ] Testing complete\n- [ ] Story closed\n`;
        
        return content;
    }
    
    generateStoryId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `story_${timestamp}_${random}`;
    }
    
    async listStories(status = 'active') {
        const storiesDir = path.join(this.storiesPath, status);
        
        if (!fs.existsSync(storiesDir)) {
            return [];
        }
        
        const files = fs.readdirSync(storiesDir)
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filepath = path.join(storiesDir, file);
                const content = fs.readFileSync(filepath, 'utf8');
                return this.parseStoryFile(content, filepath);
            });
        
        return files;
    }
    
    parseStoryFile(content, filepath) {
        const lines = content.split('\n');
        const story = {
            file: filepath,
            title: lines[0]?.replace('# ', '').trim(),
        };
        
        // Parse metadata
        lines.forEach(line => {
            if (line.startsWith('**ID:**')) {
                story.id = line.replace('**ID:**', '').trim();
            } else if (line.startsWith('**Type:**')) {
                story.type = line.replace('**Type:**', '').trim();
            } else if (line.startsWith('**Status:**')) {
                story.status = line.replace('**Status:**', '').trim();
            } else if (line.startsWith('**Priority:**')) {
                story.priority = line.replace('**Priority:**', '').trim();
            }
        });
        
        return story;
    }
    
    async getStoryById(storyId) {
        const activeStories = await this.listStories('active');
        const completedStories = await this.listStories('completed');
        
        return [...activeStories, ...completedStories].find(s => s.id === storyId);
    }
    
    async markStoryComplete(storyId) {
        const story = await this.getStoryById(storyId);
        
        if (!story) {
            throw new Error(`Story ${storyId} not found`);
        }
        
        // Move from active to completed
        const currentPath = story.file;
        const filename = path.basename(currentPath);
        const newPath = path.join(this.storiesPath, 'completed', filename);
        
        // Update status in content
        let content = fs.readFileSync(currentPath, 'utf8');
        content = content.replace(/\*\*Status:\*\* active/, '**Status:** completed');
        content = content.replace(/\*\*Status:\*\* in_progress/, '**Status:** completed');
        
        // Add completion timestamp
        const now = new Date().toISOString();
        content = content.replace(
            /(\*\*Created:\*\* .+)/,
            `$1\n**Completed:** ${now}`
        );
        
        fs.writeFileSync(newPath, content);
        fs.unlinkSync(currentPath);
        
        console.log(`✅ Story ${storyId} marked as completed`);
        
        return newPath;
    }
}

module.exports = { EnhancedStoryGenerator };