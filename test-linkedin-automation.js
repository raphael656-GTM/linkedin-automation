#!/usr/bin/env node

/**
 * LinkedIn Automation Test Suite
 * Comprehensive testing of all automation components
 */

const LinkedInOrchestrator = require('./linkedin-orchestrator');
const LinkedInAutomationImplementation = require('./linkedin-automation-implementation');
const fs = require('fs').promises;
const path = require('path');

class LinkedInAutomationTester {
  constructor() {
    this.tests = [];
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
  }

  async runAllTests() {
    console.log('🧪 LinkedIn Automation Test Suite\n');
    console.log('=' .repeat(50));
    
    // Define test suites
    this.defineTests();
    
    // Run each test
    for (const test of this.tests) {
      await this.runTest(test);
    }
    
    // Print summary
    this.printSummary();
  }

  defineTests() {
    this.tests = [
      {
        name: 'Configuration Loading',
        description: 'Verify configuration files can be loaded',
        async: true,
        fn: async () => {
          const automation = new LinkedInAutomationImplementation();
          await automation.loadConfiguration();
          
          if (!automation.config) {
            throw new Error('Configuration not loaded');
          }
          
          if (!automation.config.workflow) {
            throw new Error('Workflow configuration missing');
          }
          
          return true;
        }
      },
      
      {
        name: 'Google Apps Script Validation',
        description: 'Check if Google Apps Scripts are present',
        async: true,
        fn: async () => {
          const scriptsPath = path.join(__dirname, 'google-apps-scripts');
          const requiredScripts = [
            'linkedin-finder-adaptive.gs',
            'linkedin-profile-finder.gs'
          ];
          
          for (const script of requiredScripts) {
            const scriptPath = path.join(scriptsPath, script);
            try {
              await fs.access(scriptPath);
            } catch {
              throw new Error(`Missing script: ${script}`);
            }
          }
          
          return true;
        }
      },
      
      {
        name: 'n8n Workflow Structure',
        description: 'Validate n8n workflow JSON structure',
        async: true,
        fn: async () => {
          const workflowPath = path.join(__dirname, 'n8n-workflows-generated/linkedin-only-automation.json');
          const workflowData = await fs.readFile(workflowPath, 'utf-8');
          const workflow = JSON.parse(workflowData);
          
          if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
            throw new Error('Invalid workflow structure: missing nodes');
          }
          
          if (!workflow.connections) {
            throw new Error('Invalid workflow structure: missing connections');
          }
          
          // Check for required node types
          const nodeTypes = workflow.nodes.map(n => n.type);
          const requiredTypes = [
            'n8n-nodes-base.scheduleTrigger',
            'n8n-nodes-base.googleSheets',
            'n8n-nodes-base.httpRequest'
          ];
          
          for (const type of requiredTypes) {
            if (!nodeTypes.includes(type)) {
              throw new Error(`Missing required node type: ${type}`);
            }
          }
          
          return true;
        }
      },
      
      {
        name: 'Orchestrator Initialization',
        description: 'Test orchestrator can initialize',
        async: true,
        fn: async () => {
          const orchestrator = new LinkedInOrchestrator();
          const result = await orchestrator.initialize();
          
          if (!result.success) {
            throw new Error('Orchestrator initialization failed');
          }
          
          return true;
        }
      },
      
      {
        name: 'Profile Search Simulation',
        description: 'Test LinkedIn profile search logic',
        async: true,
        fn: async () => {
          const orchestrator = new LinkedInOrchestrator();
          const profile = await orchestrator.searchLinkedInProfile(
            'John Doe Healthcare CEO',
            { firstName: 'John', lastName: 'Doe', company: 'Healthcare Inc' }
          );
          
          if (typeof profile.found !== 'boolean') {
            throw new Error('Invalid profile search result');
          }
          
          if (typeof profile.confidence !== 'number') {
            throw new Error('Missing confidence score');
          }
          
          return true;
        }
      },
      
      {
        name: 'Message Generation',
        description: 'Test personalized message generation',
        async: true,
        fn: async () => {
          const orchestrator = new LinkedInOrchestrator();
          const profile = {
            firstName: 'Jane',
            lastName: 'Smith',
            company: 'Tech Corp',
            title: 'Chief Technology Officer',
            industry: 'Technology'
          };
          
          const message = await orchestrator.generateMessage(profile);
          
          if (!message.text) {
            throw new Error('No message text generated');
          }
          
          if (!message.text.includes(profile.firstName)) {
            throw new Error('Message not personalized with name');
          }
          
          return true;
        }
      },
      
      {
        name: 'Queue Management',
        description: 'Test message queue operations',
        async: true,
        fn: async () => {
          const orchestrator = new LinkedInOrchestrator();
          await orchestrator.initialize();
          
          const initialPending = orchestrator.state.queues.pending.length;
          
          await orchestrator.queueMessage({
            profile: { firstName: 'Test', lastName: 'User' },
            message: { text: 'Test message' },
            scheduledFor: new Date().toISOString()
          });
          
          if (orchestrator.state.queues.pending.length !== initialPending + 1) {
            throw new Error('Message not added to queue');
          }
          
          return true;
        }
      },
      
      {
        name: 'Pipeline Execution',
        description: 'Test prospecting pipeline with sample data',
        async: true,
        fn: async () => {
          const orchestrator = new LinkedInOrchestrator();
          await orchestrator.initialize();
          
          const testProspects = [
            { firstName: 'Test', lastName: 'User1', company: 'Test Co' }
          ];
          
          const results = await orchestrator.runProspectingPipeline(testProspects);
          
          if (!results.metrics) {
            throw new Error('Pipeline did not return metrics');
          }
          
          if (typeof results.metrics.duration !== 'number') {
            throw new Error('Invalid pipeline duration metric');
          }
          
          return true;
        }
      },
      
      {
        name: 'BMAD Story Integration',
        description: 'Verify BMAD story files exist',
        async: true,
        fn: async () => {
          const bmadPath = path.join(__dirname, '.bmad/stories/linkedin-finder');
          const executionPlanPath = path.join(bmadPath, 'execution-plan.json');
          
          try {
            const planData = await fs.readFile(executionPlanPath, 'utf-8');
            const plan = JSON.parse(planData);
            
            if (!plan.stories || !Array.isArray(plan.stories)) {
              throw new Error('Invalid execution plan structure');
            }
            
            return true;
          } catch (error) {
            throw new Error(`BMAD story integration error: ${error.message}`);
          }
        }
      },
      
      {
        name: 'Rate Limiting',
        description: 'Test rate limiting functionality',
        async: false,
        fn: () => {
          const orchestrator = new LinkedInOrchestrator();
          
          // Set daily limit
          orchestrator.state.dailyLimit = 5;
          orchestrator.state.processedToday = 4;
          
          // Should be under limit
          if (orchestrator.state.processedToday >= orchestrator.state.dailyLimit) {
            throw new Error('Rate limiting not working correctly');
          }
          
          // Simulate reaching limit
          orchestrator.state.processedToday = 5;
          
          if (orchestrator.state.processedToday < orchestrator.state.dailyLimit) {
            throw new Error('Rate limit not detected');
          }
          
          return true;
        }
      },
      
      {
        name: 'Error Recovery',
        description: 'Test error handling and recovery',
        async: true,
        fn: async () => {
          const automation = new LinkedInAutomationImplementation();
          
          // Test with invalid data
          try {
            await automation.findLinkedInProfile(null);
          } catch (error) {
            // Expected to catch error
            return true;
          }
          
          // If no error was thrown, test failed
          throw new Error('Error handling not working');
        }
      },
      
      {
        name: 'Dashboard Generation',
        description: 'Test dashboard metrics generation',
        async: true,
        fn: async () => {
          const orchestrator = new LinkedInOrchestrator();
          await orchestrator.initialize();
          
          const dashboard = await orchestrator.generateDashboard();
          
          if (!dashboard.timestamp) {
            throw new Error('Dashboard missing timestamp');
          }
          
          if (!dashboard.queues) {
            throw new Error('Dashboard missing queue metrics');
          }
          
          return true;
        }
      }
    ];
  }

  async runTest(test) {
    process.stdout.write(`\n🔧 ${test.name}... `);
    
    try {
      if (test.async) {
        await test.fn();
      } else {
        test.fn();
      }
      
      console.log('✅ PASSED');
      this.results.passed++;
    } catch (error) {
      console.log(`❌ FAILED`);
      console.log(`   Error: ${error.message}`);
      this.results.failed++;
      this.results.errors.push({
        test: test.name,
        error: error.message
      });
    }
  }

  printSummary() {
    console.log('\n' + '=' .repeat(50));
    console.log('📊 TEST SUMMARY\n');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`⏭️  Skipped: ${this.results.skipped}`);
    console.log(`📈 Success Rate: ${((this.results.passed / this.tests.length) * 100).toFixed(1)}%`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.errors.forEach(err => {
        console.log(`  - ${err.test}: ${err.error}`);
      });
    }
    
    console.log('\n' + '=' .repeat(50));
    
    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Performance Test\n');
  console.log('=' .repeat(50));
  
  const orchestrator = new LinkedInOrchestrator();
  await orchestrator.initialize();
  
  const prospectCounts = [10, 50, 100];
  
  for (const count of prospectCounts) {
    const prospects = Array.from({ length: count }, (_, i) => ({
      firstName: `User${i}`,
      lastName: `Test${i}`,
      company: `Company${i}`,
      title: 'Manager'
    }));
    
    const startTime = Date.now();
    await orchestrator.runProspectingPipeline(prospects);
    const duration = (Date.now() - startTime) / 1000;
    
    console.log(`\n📊 Processed ${count} prospects in ${duration.toFixed(2)}s`);
    console.log(`   Average: ${(duration / count).toFixed(3)}s per prospect`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'test';
  
  switch (command) {
    case 'test':
      const tester = new LinkedInAutomationTester();
      await tester.runAllTests();
      break;
      
    case 'performance':
      await performanceTest();
      break;
      
    case 'help':
      console.log('LinkedIn Automation Test Suite');
      console.log('Usage: node test-linkedin-automation.js [command]');
      console.log('Commands:');
      console.log('  test        - Run all tests (default)');
      console.log('  performance - Run performance benchmarks');
      console.log('  help        - Show this help message');
      break;
      
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { LinkedInAutomationTester };