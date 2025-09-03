#!/bin/bash
# Conductor.build Setup Script for LinkedIn Automation

# Check if package.json exists, create if needed
if [ ! -f "package.json" ]; then
  echo "📄 Creating package.json..."
  cat > package.json << 'EOF'
{
  "name": "linkedin-automation",
  "version": "1.0.0",
  "description": "LinkedIn automation system with AI personalization",
  "main": "index.js",
  "scripts": {
    "start": "./start.sh",
    "dev": "./conductor-dev.sh"
  },
  "dependencies": {
    "axios": "^1.6.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF
fi

# Copy configuration files
cp .env.example .env 2>/dev/null || echo "⚠️ .env.example not found, skipping"
echo "📝 Configuration files copied"

# Install dependencies
npm install
echo "📦 Dependencies installed"

# Setup n8n data directory
mkdir -p .n8n
echo "🔧 n8n directory created"

# Initialize cache directory  
mkdir -p cache
echo "💾 Cache directory initialized"

# Make scripts executable
chmod +x deploy.sh start.sh stop.sh monitor.sh
echo "🚀 Scripts made executable"

echo "✅ LinkedIn Automation workspace setup complete!"