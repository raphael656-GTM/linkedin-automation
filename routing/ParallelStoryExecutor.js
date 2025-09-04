/**
 * ParallelStoryExecutor - Orchestrates parallel execution of split stories with sub-agents
 * Bridges the gap between story generation and agent execution
 */

const fs = require('fs').promises;
const path = require('path');
const TaskRouter = require('./TaskRouter');
const TaskComplexityAnalyzer = require('./TaskComplexityAnalyzer');
const SubAgentArchitecture = require('../SubAgentArchitecture');

class ParallelStoryExecutor {
    constructor(options = {}) {
        this.bmadPath = options.bmadPath || '.bmad';
        this.storiesPath = path.join(this.bmadPath, 'stories');
        this.executionPath = path.join(this.bmadPath, 'executions');
        this.subAgentArchitecture = null;
        this.activeExecutions = new Map();
        this.executionHistory = [];
        
        // Execution options
        this.options = {
            maxParallel: options.maxParallel || 5,
            timeout: options.timeout || 300000, // 5 minutes default
            retryAttempts: options.retryAttempts || 2,
            logLevel: options.logLevel || 'info',
            ...options
        };
        
        this.ensureDirectories();
    }
    
    async ensureDirectories() {
        const dirs = [
            this.executionPath,
            path.join(this.executionPath, 'active'),
            path.join(this.executionPath, 'completed'),
            path.join(this.executionPath, 'failed')
        ];
        
        for (const dir of dirs) {
            await fs.mkdir(dir, { recursive: true }).catch(() => {});
        }
    }
    
    async initialize() {
        if (!this.subAgentArchitecture) {
            this.subAgentArchitecture = new SubAgentArchitecture({
                configPath: path.join('config', 'sub-agent-config.json'),
                contextStorage: path.join(this.bmadPath, 'context'),
                learningEnabled: true,
                qualityAssuranceEnabled: true,
                errorRecoveryEnabled: true
            });
            
            await this.subAgentArchitecture.initialize();
        }
        
        this.log('ParallelStoryExecutor initialized', 'info');
        return this;
    }
    
    /**
     * Execute split stories in parallel based on dependencies
     */
    async executeSplitStories(splitResult) {
        await this.initialize();
        
        const executionId = this.generateExecutionId();
        const execution = {
            id: executionId,
            parentStory: splitResult.parentStory.story,
            childStories: splitResult.childStories,
            executionOrder: splitResult.executionOrder,
            conflicts: splitResult.conflicts,
            startTime: new Date().toISOString(),
            status: 'running',
            results: []
        };
        
        this.activeExecutions.set(executionId, execution);
        this.log(`Starting parallel execution ${executionId}`, 'info');
        
        try {
            // Group stories by dependency level
            const executionGroups = this.groupByDependencies(
                splitResult.executionOrder || splitResult.childStories.map(cs => cs.story)
            );
            
            this.log(`Execution plan: ${executionGroups.length} groups`, 'info');
            
            // Execute each group
            for (let groupIndex = 0; groupIndex < executionGroups.length; groupIndex++) {
                const group = executionGroups[groupIndex];
                this.log(`Executing Group ${groupIndex + 1} with ${group.length} stories in parallel`, 'info');
                
                // Execute all stories in this group in parallel
                const groupResults = await this.executeGroup(group, execution);
                execution.results.push(...groupResults);
                
                // Check if any story in the group failed
                const failures = groupResults.filter(r => r.status === 'failed');
                if (failures.length > 0) {
                    this.log(`Group ${groupIndex + 1} had ${failures.length} failures`, 'warn');
                    
                    // Determine if we should continue or abort
                    if (this.shouldAbortExecution(failures)) {
                        throw new Error(`Execution aborted due to critical failures in group ${groupIndex + 1}`);
                    }
                }
            }
            
            // Mark execution as completed
            execution.status = 'completed';
            execution.endTime = new Date().toISOString();
            execution.duration = Date.now() - new Date(execution.startTime).getTime();
            
            await this.saveExecutionResult(execution);
            this.activeExecutions.delete(executionId);
            
            this.log(`Execution ${executionId} completed successfully`, 'success');
            return execution;
            
        } catch (error) {
            // Mark execution as failed
            execution.status = 'failed';
            execution.error = error.message;
            execution.endTime = new Date().toISOString();
            
            await this.saveExecutionResult(execution, 'failed');
            this.activeExecutions.delete(executionId);
            
            this.log(`Execution ${executionId} failed: ${error.message}`, 'error');
            throw error;
        }
    }
    
    /**
     * Execute a group of stories in parallel
     */
    async executeGroup(stories, execution) {
        const promises = stories.map(story => 
            this.executeStoryWithAgent(story, execution)
                .catch(error => ({
                    story: story,
                    status: 'failed',
                    error: error.message,
                    timestamp: new Date().toISOString()
                }))
        );
        
        // Use Promise.allSettled to handle individual failures
        const results = await Promise.allSettled(promises);
        
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                return {
                    story: stories[index],
                    status: 'failed',
                    error: result.reason?.message || 'Unknown error',
                    timestamp: new Date().toISOString()
                };
            }
        });
    }
    
    /**
     * Execute a single story with the appropriate agent
     */
    async executeStoryWithAgent(story, execution) {
        const startTime = Date.now();
        
        this.log(`Executing story: ${story.title} (${story.id})`, 'debug');
        
        try {
            // 1. Analyze task complexity
            const complexity = TaskComplexityAnalyzer.analyzeTask({
                description: story.description,
                requirements: story.requirements || [],
                constraints: story.constraints || []
            });
            
            // 2. Route to appropriate specialist
            const routing = await this.subAgentArchitecture.route({
                description: story.description,
                requirements: story.requirements,
                constraints: story.constraints,
                complexity: complexity
            });
            
            this.log(`Routed ${story.id} to ${routing.specialist.name} (Tier ${routing.tier})`, 'debug');
            
            // 3. Execute consultation with the specialist
            const result = await this.subAgentArchitecture.execute(routing);
            
            // 4. Validate quality if enabled
            let qualityScore = null;
            if (this.subAgentArchitecture.qualityAssurance) {
                qualityScore = await this.subAgentArchitecture.qualityAssurance.validateRecommendation(
                    result.recommendation,
                    routing.specialist
                );
            }
            
            const executionResult = {
                story: story,
                status: 'completed',
                specialist: routing.specialist.name,
                tier: routing.tier,
                complexity: complexity,
                recommendation: result.recommendation,
                qualityScore: qualityScore,
                duration: Date.now() - startTime,
                timestamp: new Date().toISOString()
            };
            
            // Save intermediate result
            await this.saveStoryResult(story.id, executionResult);
            
            this.log(`Completed ${story.id} in ${executionResult.duration}ms`, 'debug');
            
            return executionResult;
            
        } catch (error) {
            this.log(`Failed to execute ${story.id}: ${error.message}`, 'error');
            
            // Attempt retry if configured
            if (this.options.retryAttempts > 0) {
                this.log(`Retrying ${story.id} (${this.options.retryAttempts} attempts remaining)`, 'info');
                this.options.retryAttempts--;
                return await this.executeStoryWithAgent(story, execution);
            }
            
            throw error;
        }
    }
    
    /**
     * Group stories by their dependency levels for parallel execution
     */
    groupByDependencies(stories) {
        const groups = [];
        const processed = new Set();
        const storyMap = new Map(stories.map(s => [s.id, s]));
        
        // Helper function to get dependency depth
        const getDepth = (story, visited = new Set()) => {
            if (visited.has(story.id)) return 0;
            visited.add(story.id);
            
            if (!story.dependencies || story.dependencies.length === 0) {
                return 0;
            }
            
            let maxDepth = 0;
            for (const depId of story.dependencies) {
                const depStory = storyMap.get(depId);
                if (depStory && !processed.has(depId)) {
                    maxDepth = Math.max(maxDepth, getDepth(depStory, visited) + 1);
                }
            }
            
            return maxDepth;
        };
        
        // Calculate depth for each story
        const depths = new Map();
        stories.forEach(story => {
            depths.set(story.id, getDepth(story));
        });
        
        // Group by depth
        const maxDepth = Math.max(...Array.from(depths.values()));
        
        for (let depth = 0; depth <= maxDepth; depth++) {
            const group = [];
            
            stories.forEach(story => {
                if (depths.get(story.id) === depth && !processed.has(story.id)) {
                    // Check if all dependencies are processed
                    const depsReady = !story.dependencies || 
                        story.dependencies.every(depId => processed.has(depId));
                    
                    if (depsReady) {
                        group.push(story);
                        processed.add(story.id);
                    }
                }
            });
            
            if (group.length > 0) {
                groups.push(group);
            }
        }
        
        return groups;
    }
    
    /**
     * Determine if execution should be aborted based on failures
     */
    shouldAbortExecution(failures) {
        // Abort if any high-priority story failed
        const criticalFailures = failures.filter(f => 
            f.story.priority === 'high' || 
            f.story.critical === true
        );
        
        return criticalFailures.length > 0;
    }
    
    /**
     * Save execution result to file
     */
    async saveExecutionResult(execution, status = 'completed') {
        const filename = `execution-${execution.id}.json`;
        const filepath = path.join(this.executionPath, status, filename);
        
        await fs.writeFile(filepath, JSON.stringify(execution, null, 2));
        
        // Update execution history
        this.executionHistory.push({
            id: execution.id,
            parentStory: execution.parentStory.title,
            status: execution.status,
            startTime: execution.startTime,
            endTime: execution.endTime,
            duration: execution.duration,
            storiesExecuted: execution.results.length,
            failures: execution.results.filter(r => r.status === 'failed').length
        });
    }
    
    /**
     * Save individual story result
     */
    async saveStoryResult(storyId, result) {
        const filename = `story-${storyId}-result.json`;
        const filepath = path.join(this.executionPath, 'active', filename);
        
        await fs.writeFile(filepath, JSON.stringify(result, null, 2));
    }
    
    /**
     * Get execution status
     */
    getExecutionStatus(executionId) {
        return this.activeExecutions.get(executionId);
    }
    
    /**
     * Get all active executions
     */
    getActiveExecutions() {
        return Array.from(this.activeExecutions.values());
    }
    
    /**
     * Get execution history
     */
    getExecutionHistory() {
        return this.executionHistory;
    }
    
    /**
     * Generate unique execution ID
     */
    generateExecutionId() {
        return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Logging utility
     */
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logLevels = ['debug', 'info', 'warn', 'error', 'success'];
        const currentLevel = logLevels.indexOf(this.options.logLevel);
        const messageLevel = logLevels.indexOf(level);
        
        if (messageLevel >= currentLevel) {
            const prefix = {
                debug: '🔍',
                info: 'ℹ️',
                warn: '⚠️',
                error: '❌',
                success: '✅'
            }[level] || '📝';
            
            console.log(`${prefix} [${timestamp}] ${message}`);
        }
    }
}

module.exports = ParallelStoryExecutor;