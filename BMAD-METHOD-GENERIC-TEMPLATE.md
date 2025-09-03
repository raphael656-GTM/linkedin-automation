# BMAD METHOD - Generic Project Template

## Overview
The **Build Management Automation & Deployment (BMAD) METHOD** is a context-preserved development framework that can be deployed to any software project to enhance development workflows, maintain context across sessions, and automate planning and deployment processes.

## Core Architecture

### Directory Structure
```
.bmad/
├── config/
│   ├── bmad-config.json          # Project-specific configuration
│   ├── file-patterns.json        # File inclusion/exclusion patterns
│   └── deployment-targets.json   # Deployment environment configs
├── agents/
│   ├── generic-agents/           # Reusable agent templates
│   │   ├── architecture-agent.json
│   │   ├── deployment-agent.json
│   │   ├── testing-agent.json
│   │   └── security-agent.json
│   └── project-agents/          # Project-specific agents
├── stories/
│   ├── active/                  # Current development stories
│   ├── completed/               # Completed stories archive
│   └── templates/              # Story templates by type
├── context/
│   ├── project-context.xml     # Flattened codebase context
│   ├── architecture.json       # System architecture snapshot
│   └── dependencies.json       # Dependency analysis
├── workflows/
│   ├── bmad-quickstart.md      # Getting started guide
│   ├── deployment-workflows/    # Deployment procedures
│   └── testing-workflows/      # Testing automation
└── scripts/
    ├── bmad-init.js            # Project initialization
    ├── codebase-flattener.js   # Context generation
    ├── story-generator.js      # Story creation
    ├── agent-planner.js        # Multi-agent planning
    └── deploy-with-context.js  # Context-aware deployment
```

## Installation & Setup

### 1. Quick Install Script
```bash
# Download and install BMAD in any project
curl -fsSL https://raw.githubusercontent.com/your-org/bmad-method/main/install.sh | bash

# Or manual installation
mkdir -p .bmad
# Copy template files (see below)
```

### 2. Initialize BMAD
```bash
npm run bmad:init
# Interactive setup wizard:
# - Project type detection
# - Framework selection
# - Deployment target configuration
# - Agent customization
```

### 3. Core Commands
```json
{
  "scripts": {
    "bmad:init": "node .bmad/scripts/bmad-init.js",
    "bmad:flatten": "node .bmad/scripts/codebase-flattener.js",
    "bmad:story": "node .bmad/scripts/story-generator.js",
    "bmad:plan": "node .bmad/scripts/agent-planner.js",
    "bmad:deploy": "node .bmad/scripts/deploy-with-context.js"
  }
}
```

## Configuration System

### bmad-config.json
```json
{
  "projectName": "{{PROJECT_NAME}}",
  "projectType": "web-app", // web-app, api, library, microservice
  "framework": "express",   // express, react, django, spring, etc.
  "language": "javascript", // javascript, python, java, go, etc.
  "deploymentTarget": "cloud", // cloud, on-premise, hybrid
  "cloudProvider": "aws",   // aws, gcp, azure, railway, vercel
  
  "features": {
    "contextPreservation": true,
    "multiAgentPlanning": true,
    "automaticDeployment": true,
    "testingIntegration": true,
    "securityScanning": true
  },
  
  "integrations": {
    "cicd": "github-actions", // github-actions, gitlab-ci, jenkins
    "monitoring": "prometheus", // prometheus, datadog, newrelic
    "databases": ["postgresql"], // postgresql, mongodb, redis
    "messageQueues": [], // rabbitmq, kafka, sqs
    "apis": [] // stripe, twilio, sendgrid, etc.
  },
  
  "customSettings": {
    "maxContextSize": "10MB",
    "storyRetention": "6months",
    "agentTimeout": "300s"
  }
}
```

### file-patterns.json
```json
{
  "javascript": {
    "include": ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx", "**/*.json"],
    "exclude": ["node_modules/**", "dist/**", "build/**", "coverage/**"]
  },
  "python": {
    "include": ["**/*.py", "**/*.yml", "**/*.yaml", "requirements.txt", "setup.py"],
    "exclude": ["__pycache__/**", "venv/**", ".env/**", "*.pyc"]
  },
  "java": {
    "include": ["**/*.java", "**/*.xml", "**/*.properties", "pom.xml", "build.gradle"],
    "exclude": ["target/**", "build/**", ".gradle/**"]
  },
  "go": {
    "include": ["**/*.go", "go.mod", "go.sum", "**/*.yaml"],
    "exclude": ["vendor/**", "bin/**"]
  },
  "generic": {
    "include": ["**/*.md", "**/*.txt", "Dockerfile*", "*.env*"],
    "exclude": ["*.log", ".git/**", "tmp/**", "temp/**"]
  }
}
```

## Generic Agent Templates

### Architecture Agent
```json
{
  "id": "architecture-agent",
  "name": "Architecture Planning Agent",
  "description": "Analyzes system architecture and plans structural changes",
  "capabilities": [
    "system_design_analysis",
    "dependency_mapping",
    "performance_optimization",
    "scalability_planning"
  ],
  "prompts": {
    "analyze_architecture": "Analyze the current system architecture and identify improvement opportunities",
    "plan_refactoring": "Create a refactoring plan that maintains system stability",
    "design_new_feature": "Design architecture for new feature integration"
  },
  "tools": [
    "context_analyzer",
    "dependency_tracker",
    "performance_profiler"
  ]
}
```

### Deployment Agent
```json
{
  "id": "deployment-agent",
  "name": "Deployment Automation Agent",
  "description": "Handles deployment planning and execution across environments",
  "capabilities": [
    "deployment_planning",
    "rollback_strategies",
    "environment_management",
    "health_monitoring"
  ],
  "configurable": {
    "cloud_provider": "{{CLOUD_PROVIDER}}",
    "deployment_strategy": "{{DEPLOYMENT_STRATEGY}}",
    "monitoring_tools": "{{MONITORING_TOOLS}}"
  },
  "workflows": {
    "deploy_to_staging": "Deploy with validation and testing",
    "deploy_to_production": "Production deployment with rollback capability",
    "rollback": "Automated rollback to previous stable version"
  }
}
```

### Testing Agent
```json
{
  "id": "testing-agent", 
  "name": "Testing Automation Agent",
  "description": "Manages testing strategies and automation",
  "capabilities": [
    "test_planning",
    "coverage_analysis", 
    "performance_testing",
    "security_testing"
  ],
  "frameworks": {
    "javascript": ["jest", "mocha", "cypress"],
    "python": ["pytest", "unittest", "selenium"],
    "java": ["junit", "testng", "mockito"],
    "go": ["testing", "testify"]
  }
}
```

## Story Templates

### Generic Feature Template
```markdown
# BMAD Feature Story: {{FEATURE_NAME}}

## Story Metadata
- **ID**: {{STORY_ID}}
- **Created**: {{TIMESTAMP}}
- **Agent**: {{RESPONSIBLE_AGENT}}
- **Priority**: {{PRIORITY}}
- **Estimated Effort**: {{EFFORT_ESTIMATE}}
- **Dependencies**: {{DEPENDENCIES}}

## Context Preservation
### Current State
```xml
<context-snapshot>
  <project-type>{{PROJECT_TYPE}}</project-type>
  <framework>{{FRAMEWORK}}</framework>
  <architecture>{{CURRENT_ARCHITECTURE}}</architecture>
  <deployment-target>{{DEPLOYMENT_TARGET}}</deployment-target>
</context-snapshot>
```

### Business Context
- **User Story**: As a {{ROLE}}, I want {{FEATURE}} so that {{BENEFIT}}
- **Acceptance Criteria**:
  - [ ] {{CRITERION_1}}
  - [ ] {{CRITERION_2}}
  - [ ] {{CRITERION_3}}

### Technical Context
- **Affected Systems**: {{AFFECTED_SYSTEMS}}
- **API Changes**: {{API_CHANGES}}
- **Database Changes**: {{DATABASE_CHANGES}}
- **Performance Requirements**: {{PERFORMANCE_METRICS}}

## Implementation Plan

### Phase 1: Foundation
{{PHASE_1_TASKS}}

### Phase 2: Core Implementation  
{{PHASE_2_TASKS}}

### Phase 3: Testing & Integration
{{PHASE_3_TASKS}}

### Phase 4: Deployment & Monitoring
{{PHASE_4_TASKS}}
```

### Generic Bug Fix Template
```markdown
# BMAD Bug Fix Story: {{BUG_TITLE}}

## Bug Metadata
- **ID**: BUG-{{NUMBER}}
- **Severity**: {{SEVERITY}}
- **Reported**: {{DATE}}
- **System**: {{AFFECTED_SYSTEM}}
- **Status**: {{STATUS}}

## Problem Context

### Symptoms
- **User Impact**: {{IMPACT_DESCRIPTION}}
- **Error Messages**: 
  ```
  {{ERROR_LOGS}}
  ```
- **Reproduction Steps**: {{REPRODUCTION_STEPS}}

### Investigation
1. **Root Cause**: {{ROOT_CAUSE}}
2. **Affected Components**: {{COMPONENTS}}
3. **Risk Assessment**: {{RISK_LEVEL}}

## Solution Implementation

### Fix Strategy
{{FIX_DESCRIPTION}}

### Testing Plan
- [ ] Unit tests for fix
- [ ] Integration tests
- [ ] Regression testing
- [ ] Performance validation

### Deployment Plan
- [ ] Staging deployment
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Rollback plan ready
```

## Initialization Workflow

### bmad-init.js
```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class BMADInitializer {
    constructor() {
        this.config = {};
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async init() {
        console.log('🚀 BMAD METHOD Initialization');
        console.log('=====================================');
        
        // Project detection
        await this.detectProjectType();
        
        // Configuration setup
        await this.setupConfiguration();
        
        // Agent selection
        await this.selectAgents();
        
        // File structure creation
        await this.createFileStructure();
        
        // Package.json update
        await this.updatePackageJson();
        
        console.log('✅ BMAD METHOD initialized successfully!');
        console.log('Run "npm run bmad:flatten" to start');
        
        this.rl.close();
    }

    async detectProjectType() {
        // Auto-detect project type from files
        if (fs.existsSync('package.json')) {
            this.config.language = 'javascript';
            this.config.projectType = 'web-app';
            const pkg = JSON.parse(fs.readFileSync('package.json'));
            this.config.projectName = pkg.name;
            this.config.framework = this.detectFramework(pkg);
        } else if (fs.existsSync('requirements.txt') || fs.existsSync('setup.py')) {
            this.config.language = 'python';
            this.config.projectType = 'api';
        } else if (fs.existsSync('pom.xml') || fs.existsSync('build.gradle')) {
            this.config.language = 'java';
            this.config.projectType = 'enterprise-app';
        } else if (fs.existsSync('go.mod')) {
            this.config.language = 'go';
            this.config.projectType = 'microservice';
        }
        
        console.log(`Detected: ${this.config.language} ${this.config.projectType}`);
    }

    detectFramework(packageJson) {
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        if (deps.react) return 'react';
        if (deps.express) return 'express';
        if (deps.nestjs) return 'nestjs';
        if (deps.vue) return 'vue';
        if (deps.angular) return 'angular';
        
        return 'vanilla';
    }

    async setupConfiguration() {
        // Interactive configuration setup
        this.config.deploymentTarget = await this.ask('Deployment target (cloud/on-premise): ');
        this.config.cloudProvider = await this.ask('Cloud provider (aws/gcp/azure/railway): ');
        this.config.features = await this.selectFeatures();
    }

    async selectAgents() {
        console.log('\nSelect agents to include:');
        const availableAgents = [
            'architecture-agent',
            'deployment-agent', 
            'testing-agent',
            'security-agent',
            'performance-agent'
        ];
        
        this.config.agents = [];
        for (const agent of availableAgents) {
            const include = await this.ask(`Include ${agent}? (y/n): `);
            if (include.toLowerCase() === 'y') {
                this.config.agents.push(agent);
            }
        }
    }

    async createFileStructure() {
        const dirs = [
            '.bmad/config',
            '.bmad/agents/generic-agents',
            '.bmad/agents/project-agents', 
            '.bmad/stories/active',
            '.bmad/stories/completed',
            '.bmad/stories/templates',
            '.bmad/context',
            '.bmad/workflows',
            '.bmad/scripts'
        ];
        
        dirs.forEach(dir => {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        });
        
        // Copy template files
        await this.copyTemplateFiles();
        
        // Generate configuration files
        await this.generateConfigFiles();
    }

    async copyTemplateFiles() {
        // Copy generic agent templates
        const agents = this.config.agents;
        for (const agent of agents) {
            const template = this.getAgentTemplate(agent);
            fs.writeFileSync(`.bmad/agents/generic-agents/${agent}.json`, JSON.stringify(template, null, 2));
        }
        
        // Copy story templates
        const storyTemplates = {
            'feature-template.md': this.getFeatureTemplate(),
            'bug-fix-template.md': this.getBugTemplate(),
            'refactor-template.md': this.getRefactorTemplate()
        };
        
        for (const [filename, content] of Object.entries(storyTemplates)) {
            fs.writeFileSync(`.bmad/stories/templates/${filename}`, content);
        }
    }

    async generateConfigFiles() {
        // Generate bmad-config.json
        fs.writeFileSync('.bmad/config/bmad-config.json', JSON.stringify(this.config, null, 2));
        
        // Generate file-patterns.json based on language
        const patterns = this.getFilePatterns(this.config.language);
        fs.writeFileSync('.bmad/config/file-patterns.json', JSON.stringify(patterns, null, 2));
        
        // Generate deployment targets
        const deploymentConfig = this.getDeploymentConfig();
        fs.writeFileSync('.bmad/config/deployment-targets.json', JSON.stringify(deploymentConfig, null, 2));
    }

    async updatePackageJson() {
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json'));
            
            pkg.scripts = pkg.scripts || {};
            pkg.scripts['bmad:init'] = 'node .bmad/scripts/bmad-init.js';
            pkg.scripts['bmad:flatten'] = 'node .bmad/scripts/codebase-flattener.js';
            pkg.scripts['bmad:story'] = 'node .bmad/scripts/story-generator.js';
            pkg.scripts['bmad:plan'] = 'node .bmad/scripts/agent-planner.js';
            pkg.scripts['bmad:deploy'] = 'node .bmad/scripts/deploy-with-context.js';
            
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
            console.log('Updated package.json with BMAD scripts');
        }
    }

    ask(question) {
        return new Promise((resolve) => {
            this.rl.question(question, resolve);
        });
    }
}

// Run initialization
if (require.main === module) {
    new BMADInitializer().init().catch(console.error);
}

module.exports = BMADInitializer;
```

## Usage Examples

### For React Application
```bash
# Initialize in React project
npm run bmad:init
# Detects: javascript, react, web-app

# Create feature story
npm run bmad:story
# Input: "Add user authentication with JWT"
# Generates: React-specific auth implementation story

# Deploy with context
npm run bmad:deploy
# Uses Vercel/Netlify deployment patterns
```

### For Python API
```bash
# Initialize in Flask/Django project
npm run bmad:init  
# Detects: python, flask, api

# Create bug fix story
npm run bmad:story
# Input: "Fix database connection pooling"
# Generates: Python-specific debugging story

# Plan with architecture agent
npm run bmad:plan
# Uses Python testing frameworks and deployment patterns
```

### For Go Microservice
```bash
# Initialize in Go project
npm run bmad:init
# Detects: go, microservice

# Flatten codebase
npm run bmad:flatten
# Includes .go files, go.mod, Kubernetes configs

# Deploy to cloud
npm run bmad:deploy
# Uses Docker/Kubernetes deployment workflows
```

## Benefits

1. **Universal Context Preservation**: Works with any technology stack
2. **Configurable Workflows**: Adapts to project-specific needs
3. **Multi-Agent Planning**: Leverages specialized AI agents
4. **Framework Agnostic**: Supports any programming language/framework
5. **Deployment Flexibility**: Works with any cloud provider or on-premise
6. **Template Library**: Reusable patterns for common development tasks

## Next Steps

1. **Package as NPM Module**: `npm install -g bmad-method`
2. **Create Online Generator**: Web interface for project setup
3. **Agent Marketplace**: Community-contributed specialized agents
4. **IDE Extensions**: VSCode/IntelliJ plugins for integrated workflow
5. **CI/CD Integration**: Native support for GitHub Actions, GitLab CI

This generic BMAD template provides a complete framework that can be deployed to any software project, automatically adapting to the technology stack and requirements while preserving the core benefits of context-aware development.