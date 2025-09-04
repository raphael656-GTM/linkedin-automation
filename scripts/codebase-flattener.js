#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class CodebaseFlattener {
    constructor() {
        this.outputDir = path.join(process.cwd(), '.bmad', 'context');
        this.configPath = path.join(process.cwd(), 'config', 'sub-agent-config.json');
        this.filePatterns = this.loadFilePatterns();
        this.maxFileSize = 10 * 1024 * 1024; // 10MB limit
    }

    loadFilePatterns() {
        // Default patterns for JavaScript/Node.js project
        return {
            include: [
                '**/*.js',
                '**/*.json',
                '**/*.md',
                '**/*.sh',
                'n8n-workflows/*.json',
                'config/*.json',
                'config/*.js'
            ],
            exclude: [
                'node_modules/**',
                '.git/**',
                'dist/**',
                'build/**',
                'coverage/**',
                '*.log',
                '.env*',
                'package-lock.json',
                '.bmad/context/**'
            ]
        };
    }

    async flatten() {
        console.log('🔍 BMAD Codebase Flattener');
        console.log('=====================================\n');

        // Create output directory
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Collect all relevant files
        const files = await this.collectFiles();
        console.log(`Found ${files.length} files to process\n`);

        // Generate flattened context
        const context = await this.generateContext(files);
        
        // Generate architecture analysis
        const architecture = this.analyzeArchitecture(files);
        
        // Generate dependency map
        const dependencies = this.analyzeDependencies();

        // Write output files
        await this.writeOutputs(context, architecture, dependencies);

        console.log('\n✅ Codebase flattening complete!');
        console.log(`📁 Output directory: ${this.outputDir}`);
        console.log('\nGenerated files:');
        console.log('  - project-context.xml (flattened code)');
        console.log('  - architecture.json (system structure)');
        console.log('  - dependencies.json (dependency graph)');
        console.log('  - file-index.json (file mapping)');
    }

    async collectFiles() {
        const files = [];
        
        for (const pattern of this.filePatterns.include) {
            const matches = glob.sync(pattern, {
                ignore: this.filePatterns.exclude,
                dot: true
            });
            files.push(...matches);
        }

        // Remove duplicates and sort
        return [...new Set(files)].sort();
    }

    async generateContext(files) {
        const contextParts = [];
        
        contextParts.push('<?xml version="1.0" encoding="UTF-8"?>');
        contextParts.push('<project-context>');
        contextParts.push('  <metadata>');
        contextParts.push(`    <generated>${new Date().toISOString()}</generated>`);
        contextParts.push(`    <files-count>${files.length}</files-count>`);
        contextParts.push('    <project>LinkedIn Automation System</project>');
        contextParts.push('  </metadata>\n');
        
        contextParts.push('  <project-structure>');
        
        for (const file of files) {
            const stats = fs.statSync(file);
            if (stats.size > this.maxFileSize) {
                console.log(`⚠️  Skipping large file: ${file} (${Math.round(stats.size / 1024 / 1024)}MB)`);
                continue;
            }

            try {
                const content = fs.readFileSync(file, 'utf-8');
                const ext = path.extname(file).slice(1);
                
                contextParts.push(`    <file path="${file}" type="${ext}" size="${stats.size}">`);
                contextParts.push('      <content><![CDATA[');
                contextParts.push(content);
                contextParts.push(']]></content>');
                contextParts.push('    </file>\n');
            } catch (error) {
                console.log(`⚠️  Error reading file: ${file}`);
            }
        }
        
        contextParts.push('  </project-structure>');
        contextParts.push('</project-context>');
        
        return contextParts.join('\n');
    }

    analyzeArchitecture(files) {
        const architecture = {
            timestamp: new Date().toISOString(),
            project: 'LinkedIn Automation System',
            structure: {
                directories: {},
                fileTypes: {},
                components: []
            },
            technologies: [],
            patterns: []
        };

        // Analyze directory structure
        files.forEach(file => {
            const dir = path.dirname(file);
            architecture.structure.directories[dir] = 
                (architecture.structure.directories[dir] || 0) + 1;
            
            const ext = path.extname(file);
            architecture.structure.fileTypes[ext] = 
                (architecture.structure.fileTypes[ext] || 0) + 1;
        });

        // Identify components
        if (fs.existsSync('n8n-workflows')) {
            architecture.structure.components.push({
                name: 'N8N Workflows',
                type: 'automation',
                path: 'n8n-workflows/'
            });
        }

        if (fs.existsSync('specialists')) {
            architecture.structure.components.push({
                name: 'Sub-Agent Specialists',
                type: 'ai-agents',
                path: 'specialists/'
            });
        }

        if (fs.existsSync('config')) {
            architecture.structure.components.push({
                name: 'Configuration',
                type: 'config',
                path: 'config/'
            });
        }

        // Detect technologies
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
            architecture.technologies.push('Node.js');
            
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps.express) architecture.technologies.push('Express');
            if (deps.axios) architecture.technologies.push('Axios');
            if (deps.puppeteer) architecture.technologies.push('Puppeteer');
        }

        // Identify patterns
        architecture.patterns = [
            'Multi-Agent Architecture',
            'Context Preservation',
            'N8N Workflow Automation',
            'LinkedIn Scraping Pipeline',
            'AI Personalization'
        ];

        return architecture;
    }

    analyzeDependencies() {
        const dependencies = {
            timestamp: new Date().toISOString(),
            npm: {},
            internal: {},
            external: []
        };

        // Analyze NPM dependencies
        if (fs.existsSync('package.json')) {
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
            dependencies.npm = {
                production: pkg.dependencies || {},
                development: pkg.devDependencies || {},
                scripts: pkg.scripts || {}
            };
        }

        // Analyze internal module dependencies
        const jsFiles = glob.sync('**/*.js', { 
            ignore: ['node_modules/**', '.bmad/**'] 
        });

        jsFiles.forEach(file => {
            const content = fs.readFileSync(file, 'utf-8');
            const requireMatches = content.match(/require\(['"]([^'"]+)['"]\)/g) || [];
            const importMatches = content.match(/import .+ from ['"]([^'"]+)['"]/g) || [];
            
            const deps = [];
            requireMatches.forEach(match => {
                const dep = match.match(/require\(['"]([^'"]+)['"]\)/)[1];
                if (dep.startsWith('.')) deps.push(dep);
            });
            
            if (deps.length > 0) {
                dependencies.internal[file] = deps;
            }
        });

        // External integrations
        dependencies.external = [
            { service: 'Google Sheets', type: 'data-source' },
            { service: 'Lemlist', type: 'email-automation' },
            { service: 'LinkedIn', type: 'social-scraping' },
            { service: 'OpenAI/Claude', type: 'ai-personalization' }
        ];

        return dependencies;
    }

    async writeOutputs(context, architecture, dependencies) {
        // Write flattened context
        fs.writeFileSync(
            path.join(this.outputDir, 'project-context.xml'),
            context
        );

        // Write architecture analysis
        fs.writeFileSync(
            path.join(this.outputDir, 'architecture.json'),
            JSON.stringify(architecture, null, 2)
        );

        // Write dependency analysis
        fs.writeFileSync(
            path.join(this.outputDir, 'dependencies.json'),
            JSON.stringify(dependencies, null, 2)
        );

        // Create file index for quick navigation
        const fileIndex = {
            generated: new Date().toISOString(),
            files: glob.sync('**/*', { 
                ignore: ['node_modules/**', '.git/**', '.bmad/**'],
                nodir: true
            }).map(file => ({
                path: file,
                size: fs.statSync(file).size,
                modified: fs.statSync(file).mtime
            }))
        };

        fs.writeFileSync(
            path.join(this.outputDir, 'file-index.json'),
            JSON.stringify(fileIndex, null, 2)
        );
    }
}

// Run if called directly
if (require.main === module) {
    new CodebaseFlattener().flatten().catch(console.error);
}

module.exports = CodebaseFlattener;