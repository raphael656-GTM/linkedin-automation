const TaskComplexityAnalyzer = require('./TaskComplexityAnalyzer');

class StoryAnalyzer {
    constructor() {
        this.conflictPatterns = [
            // File-level conflicts
            { pattern: /same\s+file|modify\s+.*\s+file|edit\s+.*\s+file/i, type: 'file_conflict' },
            { pattern: /database\s+schema|migration/i, type: 'schema_conflict' },
            { pattern: /config|configuration|environment/i, type: 'config_conflict' },
            
            // Dependency conflicts
            { pattern: /dependency|package|library|framework/i, type: 'dependency_conflict' },
            { pattern: /api\s+contract|interface|contract/i, type: 'interface_conflict' },
            
            // Deployment conflicts
            { pattern: /deploy|deployment|build|compile/i, type: 'deployment_conflict' },
            { pattern: /database|migration|schema/i, type: 'data_conflict' },
            
            // Testing conflicts
            { pattern: /test.*setup|test.*config|test.*environment/i, type: 'test_conflict' }
        ];
        
        this.splitPatterns = [
            // Frontend/Backend splits
            {
                pattern: /frontend.*backend|backend.*frontend|full.?stack/i,
                splitter: (story) => this.splitFrontendBackend(story)
            },
            
            // API + Implementation splits
            {
                pattern: /api.*implementation|implement.*api|create.*api.*and/i,
                splitter: (story) => this.splitApiImplementation(story)
            },
            
            // Database + Logic splits
            {
                pattern: /database.*logic|model.*controller|schema.*business/i,
                splitter: (story) => this.splitDatabaseLogic(story)
            },
            
            // UI + Business Logic splits
            {
                pattern: /ui.*logic|interface.*business|form.*validation/i,
                splitter: (story) => this.splitUILogic(story)
            },
            
            // Authentication flow splits
            {
                pattern: /auth.*flow|login.*register|authentication.*authorization/i,
                splitter: (story) => this.splitAuthFlow(story)
            },
            
            // Testing splits
            {
                pattern: /unit.*integration|test.*implement|implement.*test/i,
                splitter: (story) => this.splitTestingStory(story)
            },
            
            // Multiple feature detection
            {
                pattern: /and|,|\+|also|additionally|furthermore/i,
                splitter: (story) => this.splitMultipleFeatures(story)
            }
        ];
    }
    
    async analyzeStory(story) {
        const analysis = {
            originalStory: story,
            canBeSplit: false,
            suggestedSplits: [],
            conflicts: [],
            complexity: TaskComplexityAnalyzer.analyzeTask({
                description: story.description,
                requirements: story.requirements || [],
                constraints: story.constraints || []
            })
        };
        
        // Check for split patterns
        for (const splitPattern of this.splitPatterns) {
            if (splitPattern.pattern.test(story.description)) {
                const splits = splitPattern.splitter(story);
                if (splits && splits.length > 1) {
                    analysis.canBeSplit = true;
                    analysis.suggestedSplits.push(...splits);
                }
            }
        }
        
        // Analyze conflicts between suggested splits
        if (analysis.suggestedSplits.length > 1) {
            analysis.conflicts = this.analyzeConflicts(analysis.suggestedSplits);
        }
        
        return analysis;
    }
    
    splitFrontendBackend(story) {
        const description = story.description.toLowerCase();
        const splits = [];
        
        // Frontend story
        splits.push({
            ...story,
            id: `${story.id || 'story'}_frontend`,
            title: `Frontend: ${story.title || story.description}`,
            description: story.description.replace(/backend|server|api/gi, 'frontend interface'),
            type: 'frontend',
            dependencies: [],
            tags: ['frontend', 'ui', ...(story.tags || [])]
        });
        
        // Backend story
        splits.push({
            ...story,
            id: `${story.id || 'story'}_backend`,
            title: `Backend: ${story.title || story.description}`,
            description: story.description.replace(/frontend|ui|interface/gi, 'backend API'),
            type: 'backend',
            dependencies: [],
            tags: ['backend', 'api', ...(story.tags || [])]
        });
        
        // Set dependencies
        splits[0].dependencies = [splits[1].id]; // Frontend depends on backend
        
        return splits;
    }
    
    splitApiImplementation(story) {
        const splits = [];
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_api_design`,
            title: `API Design: ${story.title || story.description}`,
            description: `Design and document API endpoints for: ${story.description}`,
            type: 'api_design',
            dependencies: [],
            tags: ['api', 'design', 'documentation', ...(story.tags || [])]
        });
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_implementation`,
            title: `Implementation: ${story.title || story.description}`,
            description: `Implement the business logic for: ${story.description}`,
            type: 'implementation',
            dependencies: [splits[0].id],
            tags: ['implementation', 'business_logic', ...(story.tags || [])]
        });
        
        return splits;
    }
    
    splitDatabaseLogic(story) {
        const splits = [];
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_database`,
            title: `Database: ${story.title || story.description}`,
            description: `Create database schema and models for: ${story.description}`,
            type: 'database',
            dependencies: [],
            tags: ['database', 'schema', 'models', ...(story.tags || [])]
        });
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_business_logic`,
            title: `Business Logic: ${story.title || story.description}`,
            description: `Implement business logic for: ${story.description}`,
            type: 'business_logic',
            dependencies: [splits[0].id],
            tags: ['business_logic', 'services', ...(story.tags || [])]
        });
        
        return splits;
    }
    
    splitUILogic(story) {
        const splits = [];
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_ui`,
            title: `UI Components: ${story.title || story.description}`,
            description: `Create UI components for: ${story.description}`,
            type: 'ui',
            dependencies: [],
            tags: ['ui', 'components', 'frontend', ...(story.tags || [])]
        });
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_logic`,
            title: `Logic Integration: ${story.title || story.description}`,
            description: `Integrate business logic with UI for: ${story.description}`,
            type: 'integration',
            dependencies: [splits[0].id],
            tags: ['integration', 'logic', ...(story.tags || [])]
        });
        
        return splits;
    }
    
    splitAuthFlow(story) {
        const splits = [];
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_auth_backend`,
            title: `Authentication Backend: ${story.title || story.description}`,
            description: `Implement authentication backend for: ${story.description}`,
            type: 'auth_backend',
            dependencies: [],
            tags: ['authentication', 'backend', 'security', ...(story.tags || [])]
        });
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_auth_ui`,
            title: `Authentication UI: ${story.title || story.description}`,
            description: `Create authentication UI for: ${story.description}`,
            type: 'auth_ui',
            dependencies: [splits[0].id],
            tags: ['authentication', 'ui', 'frontend', ...(story.tags || [])]
        });
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_auth_integration`,
            title: `Authentication Integration: ${story.title || story.description}`,
            description: `Integrate authentication flow for: ${story.description}`,
            type: 'auth_integration',
            dependencies: [splits[0].id, splits[1].id],
            tags: ['authentication', 'integration', ...(story.tags || [])]
        });
        
        return splits;
    }
    
    splitTestingStory(story) {
        const splits = [];
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_implementation`,
            title: `Implementation: ${story.title || story.description}`,
            description: story.description.replace(/test.*|testing.*/gi, ''),
            type: 'implementation',
            dependencies: [],
            tags: ['implementation', ...(story.tags || [])]
        });
        
        splits.push({
            ...story,
            id: `${story.id || 'story'}_testing`,
            title: `Testing: ${story.title || story.description}`,
            description: `Create comprehensive tests for: ${story.description}`,
            type: 'testing',
            dependencies: [splits[0].id],
            tags: ['testing', 'quality_assurance', ...(story.tags || [])]
        });
        
        return splits;
    }
    
    splitMultipleFeatures(story) {
        const description = story.description;
        const features = this.extractFeatures(description);
        
        if (features.length <= 1) return [story];
        
        return features.map((feature, index) => ({
            ...story,
            id: `${story.id || 'story'}_${index + 1}`,
            title: `${story.title || 'Feature'} - ${feature.trim()}`,
            description: feature.trim(),
            type: story.type || 'feature',
            dependencies: index > 0 ? [`${story.id || 'story'}_${index}`] : [],
            tags: ['split_feature', ...(story.tags || [])]
        }));
    }
    
    extractFeatures(description) {
        // Split on common separators and clean up
        const separators = /\s+and\s+|\s*,\s*|\s*\+\s*|\s+also\s+|\s+additionally\s+|\s+furthermore\s+/i;
        return description.split(separators)
            .map(f => f.trim())
            .filter(f => f.length > 10) // Filter out very short fragments
            .slice(0, 5); // Limit to max 5 features
    }
    
    analyzeConflicts(stories) {
        const conflicts = [];
        
        for (let i = 0; i < stories.length; i++) {
            for (let j = i + 1; j < stories.length; j++) {
                const storyA = stories[i];
                const storyB = stories[j];
                
                const conflict = this.checkConflictBetween(storyA, storyB);
                if (conflict) {
                    conflicts.push({
                        stories: [storyA.id, storyB.id],
                        type: conflict.type,
                        severity: conflict.severity,
                        description: conflict.description,
                        resolution: conflict.resolution
                    });
                }
            }
        }
        
        return conflicts;
    }
    
    checkConflictBetween(storyA, storyB) {
        const descA = storyA.description.toLowerCase();
        const descB = storyB.description.toLowerCase();
        
        for (const conflictPattern of this.conflictPatterns) {
            if (conflictPattern.pattern.test(descA) && conflictPattern.pattern.test(descB)) {
                return {
                    type: conflictPattern.type,
                    severity: this.calculateConflictSeverity(storyA, storyB, conflictPattern.type),
                    description: `Both stories involve ${conflictPattern.type.replace('_', ' ')}`,
                    resolution: this.suggestConflictResolution(conflictPattern.type, storyA, storyB)
                };
            }
        }
        
        // Check for tag-based conflicts
        const commonTags = (storyA.tags || []).filter(tag => 
            (storyB.tags || []).includes(tag) && 
            ['database', 'config', 'deployment', 'api'].includes(tag)
        );
        
        if (commonTags.length > 0) {
            return {
                type: 'tag_conflict',
                severity: 'medium',
                description: `Both stories share conflicting tags: ${commonTags.join(', ')}`,
                resolution: 'Consider sequential execution or coordination'
            };
        }
        
        return null;
    }
    
    calculateConflictSeverity(storyA, storyB, conflictType) {
        const severityMap = {
            file_conflict: 'high',
            schema_conflict: 'high',
            deployment_conflict: 'high',
            dependency_conflict: 'medium',
            interface_conflict: 'medium',
            config_conflict: 'medium',
            data_conflict: 'high',
            test_conflict: 'low'
        };
        
        return severityMap[conflictType] || 'medium';
    }
    
    suggestConflictResolution(conflictType, storyA, storyB) {
        const resolutions = {
            file_conflict: `Execute ${storyA.id} before ${storyB.id} to avoid file conflicts`,
            schema_conflict: `Coordinate database changes between ${storyA.id} and ${storyB.id}`,
            deployment_conflict: `Deploy ${storyA.id} and ${storyB.id} together to avoid conflicts`,
            dependency_conflict: `Resolve dependency conflicts before starting both stories`,
            interface_conflict: `Define API contracts before implementing ${storyA.id} and ${storyB.id}`,
            config_conflict: `Coordinate configuration changes between stories`,
            data_conflict: `Plan data migration strategy for both stories`,
            test_conflict: `Coordinate test environments and data between stories`
        };
        
        return resolutions[conflictType] || 'Manual coordination required';
    }
    
    async generateSplitSuggestion(story) {
        const analysis = await this.analyzeStory(story);
        
        if (!analysis.canBeSplit) {
            return {
                shouldSplit: false,
                reason: 'Story appears to be already focused and non-divisible',
                originalStory: story
            };
        }
        
        // Filter out conflicting splits
        const viableSplits = this.filterViableSplits(analysis.suggestedSplits, analysis.conflicts);
        
        return {
            shouldSplit: viableSplits.length > 1,
            originalStory: story,
            suggestedStories: viableSplits,
            conflicts: analysis.conflicts,
            executionOrder: this.calculateExecutionOrder(viableSplits),
            recommendation: this.generateRecommendation(analysis)
        };
    }
    
    filterViableSplits(splits, conflicts) {
        if (conflicts.length === 0) return splits;
        
        // For high-severity conflicts, merge conflicting stories back
        const highConflicts = conflicts.filter(c => c.severity === 'high');
        
        if (highConflicts.length > 0) {
            // Keep only the first story and merge conflicting ones back
            return [splits[0]];
        }
        
        return splits;
    }
    
    calculateExecutionOrder(stories) {
        // Topological sort based on dependencies
        const order = [];
        const visited = new Set();
        const temp = new Set();
        
        const visit = (story) => {
            if (temp.has(story.id)) {
                throw new Error(`Circular dependency detected involving ${story.id}`);
            }
            
            if (visited.has(story.id)) return;
            
            temp.add(story.id);
            
            // Visit dependencies first
            (story.dependencies || []).forEach(depId => {
                const depStory = stories.find(s => s.id === depId);
                if (depStory) visit(depStory);
            });
            
            temp.delete(story.id);
            visited.add(story.id);
            order.push(story);
        };
        
        stories.forEach(story => {
            if (!visited.has(story.id)) {
                visit(story);
            }
        });
        
        return order;
    }
    
    generateRecommendation(analysis) {
        if (!analysis.canBeSplit) {
            return 'Keep story as single unit - it appears well-focused';
        }
        
        if (analysis.conflicts.length === 0) {
            return 'Split recommended - no conflicts detected between subtasks';
        }
        
        const highConflicts = analysis.conflicts.filter(c => c.severity === 'high').length;
        const mediumConflicts = analysis.conflicts.filter(c => c.severity === 'medium').length;
        
        if (highConflicts > 0) {
            return `Split not recommended - ${highConflicts} high-severity conflicts detected`;
        }
        
        if (mediumConflicts > 2) {
            return `Split with caution - ${mediumConflicts} medium-severity conflicts detected`;
        }
        
        return 'Split recommended with coordination between subtasks';
    }
}

module.exports = { StoryAnalyzer };