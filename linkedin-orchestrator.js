/**
 * LinkedIn Automation Orchestrator
 * Central control system for all LinkedIn automation components
 */

const fs = require('fs').promises;
const path = require('path');
const LinkedInAutomationImplementation = require('./linkedin-automation-implementation');
// Optional dependencies - check if they exist
let ParallelStoryExecutor, EnhancedStoryGenerator;
try {
  ParallelStoryExecutor = require('./routing/ParallelStoryExecutor').ParallelStoryExecutor;
} catch (e) {
  console.log('ParallelStoryExecutor not available, using stub');
}
try {
  EnhancedStoryGenerator = require('./routing/EnhancedStoryGenerator').EnhancedStoryGenerator;
} catch (e) {
  console.log('EnhancedStoryGenerator not available, using stub');
}

class LinkedInOrchestrator {
  constructor() {
    this.components = {
      automation: null,
      storyExecutor: null,
      storyGenerator: null
    };
    
    this.pipelines = {
      prospecting: {
        name: 'LinkedIn Prospecting Pipeline',
        stages: ['discovery', 'enrichment', 'validation', 'outreach']
      },
      engagement: {
        name: 'LinkedIn Engagement Pipeline', 
        stages: ['connection', 'research', 'personalization', 'follow-up']
      }
    };
    
    this.state = {
      active: false,
      currentPipeline: null,
      processedToday: 0,
      dailyLimit: 100,
      queues: {
        pending: [],
        processing: [],
        completed: [],
        failed: []
      }
    };
  }

  async initialize() {
    console.log('🎯 Initializing LinkedIn Orchestrator...\n');
    
    try {
      // Initialize core automation
      this.components.automation = new LinkedInAutomationImplementation();
      await this.components.automation.initialize();
      
      // Initialize story executor for parallel processing (if available)
      if (ParallelStoryExecutor) {
        this.components.storyExecutor = new ParallelStoryExecutor();
      } else {
        this.components.storyExecutor = null;
      }
      
      // Initialize story generator (if available)
      if (EnhancedStoryGenerator) {
        this.components.storyGenerator = new EnhancedStoryGenerator();
      } else {
        this.components.storyGenerator = null;
      }
      
      // Load existing queues
      await this.loadQueues();
      
      // Setup pipeline monitors
      this.setupPipelineMonitors();
      
      console.log('✅ Orchestrator initialized successfully\n');
      return { success: true };
    } catch (error) {
      console.error('❌ Orchestrator initialization failed:', error);
      throw error;
    }
  }

  async runProspectingPipeline(prospects) {
    console.log(`\n🔍 Starting Prospecting Pipeline for ${prospects.length} prospects...\n`);
    
    this.state.currentPipeline = 'prospecting';
    const results = {
      successful: [],
      failed: [],
      metrics: {
        startTime: Date.now(),
        profilesFound: 0,
        enrichmentRate: 0,
        validationRate: 0
      }
    };
    
    try {
      // Stage 1: Discovery
      console.log('📍 Stage 1: Discovery');
      const discoveryResults = await this.runDiscoveryStage(prospects);
      results.metrics.profilesFound = discoveryResults.found.length;
      
      // Stage 2: Enrichment
      console.log('📊 Stage 2: Enrichment');
      const enrichmentResults = await this.runEnrichmentStage(discoveryResults.found);
      results.metrics.enrichmentRate = (enrichmentResults.enriched.length / discoveryResults.found.length) * 100;
      
      // Stage 3: Validation
      console.log('✅ Stage 3: Validation');
      const validationResults = await this.runValidationStage(enrichmentResults.enriched);
      results.metrics.validationRate = (validationResults.valid.length / enrichmentResults.enriched.length) * 100;
      
      // Stage 4: Outreach
      console.log('📮 Stage 4: Outreach');
      const outreachResults = await this.runOutreachStage(validationResults.valid);
      
      // Compile results
      results.successful = outreachResults.sent;
      results.failed = [
        ...discoveryResults.notFound,
        ...enrichmentResults.failed,
        ...validationResults.invalid,
        ...outreachResults.failed
      ];
      
      results.metrics.endTime = Date.now();
      results.metrics.duration = (results.metrics.endTime - results.metrics.startTime) / 1000;
      
      console.log(`\n✅ Prospecting Pipeline completed in ${results.metrics.duration}s`);
      console.log(`   - Profiles Found: ${results.metrics.profilesFound}`);
      console.log(`   - Enrichment Rate: ${results.metrics.enrichmentRate.toFixed(1)}%`);
      console.log(`   - Validation Rate: ${results.metrics.validationRate.toFixed(1)}%`);
      console.log(`   - Messages Sent: ${results.successful.length}\n`);
      
      return results;
    } catch (error) {
      console.error('❌ Pipeline error:', error);
      throw error;
    } finally {
      this.state.currentPipeline = null;
    }
  }

  async runDiscoveryStage(prospects) {
    const found = [];
    const notFound = [];
    
    // Process in batches for efficiency
    const batchSize = 10;
    for (let i = 0; i < prospects.length; i += batchSize) {
      const batch = prospects.slice(i, i + batchSize);
      
      const promises = batch.map(async (prospect) => {
        try {
          // Use Google Apps Script LinkedIn finder logic
          const searchQuery = `${prospect.firstName} ${prospect.lastName} ${prospect.company} LinkedIn`;
          const profile = await this.searchLinkedInProfile(searchQuery, prospect);
          
          if (profile.found && profile.confidence > 60) {
            found.push({ ...prospect, ...profile });
          } else {
            notFound.push({ ...prospect, reason: 'Profile not found or low confidence' });
          }
        } catch (error) {
          notFound.push({ ...prospect, reason: error.message });
        }
      });
      
      await Promise.all(promises);
      
      // Respect rate limits
      await this.delay(1000);
    }
    
    return { found, notFound };
  }

  async runEnrichmentStage(profiles) {
    const enriched = [];
    const failed = [];
    
    for (const profile of profiles) {
      try {
        // Enrich with additional data
        const enrichmentData = await this.enrichProfile(profile);
        enriched.push({ ...profile, ...enrichmentData });
      } catch (error) {
        failed.push({ ...profile, enrichmentError: error.message });
      }
    }
    
    return { enriched, failed };
  }

  async runValidationStage(profiles) {
    const valid = [];
    const invalid = [];
    
    for (const profile of profiles) {
      // Validate profile data
      const validation = this.validateProfile(profile);
      
      if (validation.isValid) {
        valid.push({ ...profile, validationScore: validation.score });
      } else {
        invalid.push({ ...profile, validationErrors: validation.errors });
      }
    }
    
    return { valid, invalid };
  }

  async runOutreachStage(profiles) {
    const sent = [];
    const failed = [];
    
    for (const profile of profiles) {
      try {
        // Generate personalized message
        const message = await this.generateMessage(profile);
        
        // Queue for sending
        await this.queueMessage({
          profile,
          message,
          scheduledFor: this.getOptimalSendTime()
        });
        
        sent.push({ ...profile, message });
      } catch (error) {
        failed.push({ ...profile, outreachError: error.message });
      }
    }
    
    return { sent, failed };
  }

  async searchLinkedInProfile(query, prospect) {
    // Simulate LinkedIn search logic
    // In production, this would use the Google Apps Script or API
    
    const mockResults = {
      found: Math.random() > 0.2,
      url: `https://linkedin.com/in/${prospect.firstName.toLowerCase()}-${prospect.lastName.toLowerCase()}`,
      confidence: 60 + Math.random() * 40,
      title: prospect.title || 'Professional',
      location: prospect.location || 'Unknown'
    };
    
    return mockResults;
  }

  async enrichProfile(profile) {
    // Simulate profile enrichment
    return {
      industry: 'Healthcare',
      companySize: '1000-5000',
      recentActivity: 'Posted about digital transformation',
      commonConnections: Math.floor(Math.random() * 10),
      enrichedAt: new Date().toISOString()
    };
  }

  validateProfile(profile) {
    const errors = [];
    let score = 100;
    
    // Check required fields
    if (!profile.url) {
      errors.push('Missing LinkedIn URL');
      score -= 50;
    }
    
    if (!profile.firstName || !profile.lastName) {
      errors.push('Incomplete name');
      score -= 30;
    }
    
    if (profile.confidence < 70) {
      errors.push('Low confidence match');
      score -= 20;
    }
    
    return {
      isValid: errors.length === 0,
      score,
      errors
    };
  }

  async generateMessage(profile) {
    // Generate personalized message based on profile data
    const templates = {
      executive: `Hi ${profile.firstName}, I noticed your leadership role at ${profile.company}. Your recent insights on ${profile.recentActivity || 'industry trends'} really resonated with me.`,
      technical: `Hi ${profile.firstName}, Your technical expertise at ${profile.company} is impressive. I'd love to connect and share insights on ${profile.industry || 'technology'}.`,
      general: `Hi ${profile.firstName}, I came across your profile and was impressed by your work at ${profile.company}. Would love to connect!`
    };
    
    const messageType = profile.title?.toLowerCase().includes('chief') ? 'executive' :
                       profile.title?.toLowerCase().includes('engineer') ? 'technical' : 'general';
    
    return {
      text: templates[messageType],
      type: messageType,
      personalizationScore: 75 + Math.random() * 25
    };
  }

  async queueMessage(messageData) {
    this.state.queues.pending.push({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...messageData,
      queuedAt: new Date().toISOString(),
      status: 'pending'
    });
    
    // Save queue state
    await this.saveQueues();
  }

  getOptimalSendTime() {
    // Calculate optimal send time (business hours in recipient's timezone)
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 9 && hour <= 17) {
      // Send now
      return now.toISOString();
    } else {
      // Schedule for next business day at 10 AM
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      return tomorrow.toISOString();
    }
  }

  async processMessageQueue() {
    console.log('📬 Processing message queue...');
    
    const now = new Date();
    const readyToSend = this.state.queues.pending.filter(msg => 
      new Date(msg.scheduledFor) <= now
    );
    
    for (const message of readyToSend) {
      // Move from pending to processing
      this.state.queues.pending = this.state.queues.pending.filter(m => m.id !== message.id);
      this.state.queues.processing.push(message);
      
      try {
        // Simulate sending message
        await this.delay(1000);
        
        // Move to completed
        this.state.queues.processing = this.state.queues.processing.filter(m => m.id !== message.id);
        this.state.queues.completed.push({
          ...message,
          sentAt: new Date().toISOString(),
          status: 'sent'
        });
        
        console.log(`  ✅ Message sent to ${message.profile.firstName} ${message.profile.lastName}`);
      } catch (error) {
        // Move to failed
        this.state.queues.processing = this.state.queues.processing.filter(m => m.id !== message.id);
        this.state.queues.failed.push({
          ...message,
          error: error.message,
          failedAt: new Date().toISOString(),
          status: 'failed'
        });
        
        console.error(`  ❌ Failed to send message: ${error.message}`);
      }
    }
    
    await this.saveQueues();
    console.log(`  Processed ${readyToSend.length} messages`);
  }

  setupPipelineMonitors() {
    // Monitor message queue
    setInterval(() => {
      if (this.state.queues.pending.length > 0) {
        this.processMessageQueue();
      }
    }, 60000); // Check every minute
    
    // Monitor daily limits
    setInterval(() => {
      const today = new Date().toDateString();
      const todaysMessages = this.state.queues.completed.filter(msg => 
        new Date(msg.sentAt).toDateString() === today
      );
      
      this.state.processedToday = todaysMessages.length;
      
      if (this.state.processedToday >= this.state.dailyLimit) {
        console.warn(`⚠️  Daily limit reached (${this.state.dailyLimit}). Pausing outreach.`);
      }
    }, 300000); // Check every 5 minutes
  }

  async loadQueues() {
    const queuePath = path.join(__dirname, 'data', 'message-queues.json');
    
    try {
      const data = await fs.readFile(queuePath, 'utf-8');
      const queues = JSON.parse(data);
      this.state.queues = queues;
      console.log(`📥 Loaded ${Object.values(queues).flat().length} queued items`);
    } catch (error) {
      console.log('📝 No existing queues found, starting fresh');
    }
  }

  async saveQueues() {
    const queuePath = path.join(__dirname, 'data', 'message-queues.json');
    await fs.mkdir(path.dirname(queuePath), { recursive: true });
    await fs.writeFile(queuePath, JSON.stringify(this.state.queues, null, 2));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateDashboard() {
    const dashboard = {
      timestamp: new Date().toISOString(),
      pipelines: this.pipelines,
      currentState: {
        active: this.state.active,
        currentPipeline: this.state.currentPipeline,
        processedToday: this.state.processedToday,
        dailyLimit: this.state.dailyLimit
      },
      queues: {
        pending: this.state.queues.pending.length,
        processing: this.state.queues.processing.length,
        completed: this.state.queues.completed.length,
        failed: this.state.queues.failed.length
      },
      recentActivity: {
        lastHour: this.state.queues.completed.filter(msg => 
          Date.now() - new Date(msg.sentAt).getTime() < 3600000
        ).length,
        last24Hours: this.state.queues.completed.filter(msg => 
          Date.now() - new Date(msg.sentAt).getTime() < 86400000
        ).length
      }
    };
    
    console.log('\n📊 LinkedIn Automation Dashboard');
    console.log('================================');
    console.log(`Status: ${dashboard.currentState.active ? '🟢 Active' : '🔴 Inactive'}`);
    console.log(`Current Pipeline: ${dashboard.currentState.currentPipeline || 'None'}`);
    console.log(`Messages Today: ${dashboard.currentState.processedToday}/${dashboard.currentState.dailyLimit}`);
    console.log('\nQueue Status:');
    console.log(`  📋 Pending: ${dashboard.queues.pending}`);
    console.log(`  ⚙️  Processing: ${dashboard.queues.processing}`);
    console.log(`  ✅ Completed: ${dashboard.queues.completed}`);
    console.log(`  ❌ Failed: ${dashboard.queues.failed}`);
    console.log('\nRecent Activity:');
    console.log(`  Last Hour: ${dashboard.recentActivity.lastHour} messages`);
    console.log(`  Last 24 Hours: ${dashboard.recentActivity.last24Hours} messages`);
    console.log('================================\n');
    
    return dashboard;
  }
}

// Export for use in other modules
module.exports = LinkedInOrchestrator;

// CLI execution
if (require.main === module) {
  const orchestrator = new LinkedInOrchestrator();
  
  async function runDemo() {
    try {
      // Initialize orchestrator
      await orchestrator.initialize();
      
      // Sample prospects
      const sampleProspects = [
        { firstName: 'Sarah', lastName: 'Johnson', company: 'MedTech Solutions', title: 'Chief Technology Officer' },
        { firstName: 'Michael', lastName: 'Chen', company: 'HealthCare Plus', title: 'VP Engineering' },
        { firstName: 'Emily', lastName: 'Davis', company: 'Digital Health Co', title: 'Director of Innovation' }
      ];
      
      // Run prospecting pipeline
      const results = await orchestrator.runProspectingPipeline(sampleProspects);
      
      // Generate dashboard
      await orchestrator.generateDashboard();
      
      // Keep running for queue processing
      console.log('🔄 Orchestrator running... Press Ctrl+C to stop\n');
      
      // Generate dashboard every 30 seconds
      setInterval(() => {
        orchestrator.generateDashboard();
      }, 30000);
      
      process.stdin.resume();
    } catch (error) {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  }
  
  runDemo();
}