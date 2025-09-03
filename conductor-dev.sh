#!/bin/bash
# Run script for Conductor.build development

# Run n8n in development mode
n8n start &
N8N_PID=$!

# Start cache monitoring
echo "🔍 Monitoring cache performance..."
node -e "
const LinkedInCacheSystem = require('./utils/cache-system.js');
const cache = new LinkedInCacheSystem();

setInterval(() => {
  console.log('Cache Stats:', cache.getStats());
}, 30000);
" &
CACHE_PID=$!

# Monitor proxy health  
echo "🌐 Monitoring proxy health..."
node -e "
const ProxyManager = require('./config/proxy-config.js');
const proxy = new ProxyManager();

setInterval(async () => {
  const health = await proxy.healthCheck();
  console.log('Proxy Health:', health);
}, 60000);
" &
PROXY_PID=$!

echo "🚀 LinkedIn Automation development server started"
echo "📊 n8n Dashboard: http://localhost:5678"
echo "🔧 Webhooks available at http://localhost:5678/webhook/*"

# Keep processes running
wait $N8N_PID