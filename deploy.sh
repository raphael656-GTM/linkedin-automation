#!/bin/bash

# LinkedIn Automation System Deployment Script
# Deploys all n8n workflows and sets up monitoring

set -e

echo "🚀 LinkedIn Automation System - Deployment Started"
echo "=================================================="

# Configuration
N8N_URL=${N8N_URL:-"http://localhost:5678"}
N8N_AUTH_COOKIE=${N8N_AUTH_COOKIE:-""}
GOOGLE_SHEET_ID=${GOOGLE_SHEET_ID:-""}
LEMLIST_API_KEY=${LEMLIST_API_KEY:-""}
APIFY_TOKEN=${APIFY_TOKEN:-""}

# Verify prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    
    if ! command -v n8n &> /dev/null; then
        echo "❌ n8n is not installed. Please install n8n first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if [ -z "$GOOGLE_SHEET_ID" ]; then
        echo "⚠️  Warning: GOOGLE_SHEET_ID not set. Update workflows manually."
    fi
    
    if [ -z "$LEMLIST_API_KEY" ]; then
        echo "⚠️  Warning: LEMLIST_API_KEY not set. Configure in n8n credentials."
    fi
    
    if [ -z "$APIFY_TOKEN" ]; then
        echo "⚠️  Warning: APIFY_TOKEN not set. Configure in n8n credentials."
    fi
    
    echo "✅ Prerequisites check completed"
}

# Install Node.js dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        echo "Creating package.json..."
        npm init -y
    fi
    
    npm install --save \
        axios \
        redis \
        crypto \
        fs
    
    echo "✅ Dependencies installed"
}

# Start n8n if not running
start_n8n() {
    echo "🔧 Starting n8n..."
    
    # Check if n8n is already running
    if curl -s "$N8N_URL" > /dev/null 2>&1; then
        echo "✅ n8n is already running at $N8N_URL"
    else
        echo "Starting n8n in background..."
        nohup n8n start > n8n.log 2>&1 &
        
        # Wait for n8n to start
        echo "Waiting for n8n to start..."
        for i in {1..30}; do
            if curl -s "$N8N_URL" > /dev/null 2>&1; then
                echo "✅ n8n started successfully"
                break
            fi
            sleep 2
        done
        
        if ! curl -s "$N8N_URL" > /dev/null 2>&1; then
            echo "❌ Failed to start n8n"
            exit 1
        fi
    fi
}

# Import n8n workflows
import_workflows() {
    echo "📥 Importing n8n workflows..."
    
    WORKFLOWS=(
        "01-sheets-to-lemlist-import.json"
        "02-linkedin-connection-webhook.json"
        "03-linkedin-scraping-pipeline.json"
        "04-ai-personalization.json"
        "05-message-delivery.json"
        "06-response-handling.json"
    )
    
    for workflow in "${WORKFLOWS[@]}"; do
        workflow_path="n8n-workflows/$workflow"
        
        if [ -f "$workflow_path" ]; then
            echo "Importing $workflow..."
            
            # Update workflow with actual Google Sheet ID if provided
            if [ ! -z "$GOOGLE_SHEET_ID" ]; then
                sed -i.bak "s/YOUR_GOOGLE_SHEET_ID/$GOOGLE_SHEET_ID/g" "$workflow_path"
            fi
            
            # Import workflow using n8n CLI
            n8n import:workflow --input="$workflow_path"
            
            if [ $? -eq 0 ]; then
                echo "✅ Imported $workflow"
            else
                echo "❌ Failed to import $workflow"
                exit 1
            fi
        else
            echo "⚠️  Workflow file not found: $workflow_path"
        fi
    done
    
    echo "✅ All workflows imported successfully"
}

# Set up credentials
setup_credentials() {
    echo "🔐 Setting up credentials..."
    
    # This would typically involve setting up credentials in n8n
    # For security, we'll just print instructions
    
    echo "Please configure the following credentials in n8n:"
    echo "1. Google Sheets API credentials"
    echo "2. Lemlist API key"
    echo "3. Apify API token" 
    echo "4. Claude/OpenAI API key"
    echo "5. Slack webhook URL (optional)"
    echo ""
    echo "Navigate to: $N8N_URL/credentials"
    echo "✅ Credential setup instructions displayed"
}

# Create monitoring script
create_monitoring() {
    echo "📊 Setting up monitoring..."
    
    cat > monitor.sh << 'EOF'
#!/bin/bash

# LinkedIn Automation System Monitor

check_workflows() {
    echo "=== Workflow Status ==="
    n8n list:workflow
    echo ""
}

check_system_health() {
    echo "=== System Health ==="
    echo "n8n Status: $(curl -s http://localhost:5678 > /dev/null && echo "✅ Running" || echo "❌ Down")"
    echo "Cache Directory: $([ -d "./cache" ] && echo "✅ Exists" || echo "❌ Missing")"
    echo "Disk Space: $(df -h . | tail -1 | awk '{print $4}') available"
    echo "Memory Usage: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2}')"
    echo ""
}

check_recent_executions() {
    echo "=== Recent Executions ==="
    echo "Check n8n execution log at: http://localhost:5678/executions"
    echo ""
}

show_analytics() {
    echo "=== Performance Analytics ==="
    if [ -f "analytics.log" ]; then
        echo "Recent analytics (last 24 hours):"
        tail -20 analytics.log
    else
        echo "No analytics data available yet"
    fi
    echo ""
}

# Main monitoring function
main() {
    echo "LinkedIn Automation System Monitor"
    echo "=================================="
    echo "Generated at: $(date)"
    echo ""
    
    check_workflows
    check_system_health
    check_recent_executions
    show_analytics
}

# Run monitoring
main
EOF

    chmod +x monitor.sh
    echo "✅ Monitor script created (./monitor.sh)"
}

# Create maintenance scripts
create_maintenance() {
    echo "🛠️ Creating maintenance scripts..."
    
    # Cache cleanup script
    cat > cleanup-cache.sh << 'EOF'
#!/bin/bash
# Clean up old cache files older than 7 days
find ./cache -name "*.json" -mtime +7 -delete 2>/dev/null || true
echo "Cache cleanup completed"
EOF
    
    # Log rotation script
    cat > rotate-logs.sh << 'EOF'
#!/bin/bash
# Rotate n8n logs
if [ -f "n8n.log" ] && [ $(stat -c%s "n8n.log") -gt 10485760 ]; then
    mv n8n.log "n8n.log.$(date +%Y%m%d)"
    touch n8n.log
    echo "Logs rotated"
fi
EOF
    
    chmod +x cleanup-cache.sh rotate-logs.sh
    echo "✅ Maintenance scripts created"
}

# Create startup script
create_startup() {
    echo "🚀 Creating startup script..."
    
    cat > start.sh << 'EOF'
#!/bin/bash
# LinkedIn Automation System Startup

echo "Starting LinkedIn Automation System..."

# Start n8n
if ! pgrep -f "n8n start" > /dev/null; then
    echo "Starting n8n..."
    nohup n8n start > n8n.log 2>&1 &
    
    # Wait for startup
    sleep 10
    
    if pgrep -f "n8n start" > /dev/null; then
        echo "✅ n8n started successfully"
    else
        echo "❌ Failed to start n8n"
        exit 1
    fi
else
    echo "✅ n8n is already running"
fi

# Display system information
echo ""
echo "System Information:"
echo "==================="
echo "n8n URL: http://localhost:5678"
echo "Webhook URLs:"
echo "  - LinkedIn Connection: http://localhost:5678/webhook/linkedin-connection"
echo "  - Scraping Trigger: http://localhost:5678/webhook/linkedin-scraping-trigger"
echo "  - AI Personalization: http://localhost:5678/webhook/ai-personalization-trigger"
echo "  - Message Delivery: http://localhost:5678/webhook/message-delivery-trigger"
echo "  - Response Handler: http://localhost:5678/webhook/lemlist-response"
echo ""
echo "Monitor with: ./monitor.sh"
echo "Stop with: ./stop.sh"
echo ""
echo "🚀 LinkedIn Automation System is ready!"
EOF
    
    chmod +x start.sh
    echo "✅ Startup script created (./start.sh)"
}

# Create stop script
create_stop() {
    echo "🛑 Creating stop script..."
    
    cat > stop.sh << 'EOF'
#!/bin/bash
# Stop LinkedIn Automation System

echo "Stopping LinkedIn Automation System..."

# Stop n8n
pkill -f "n8n start" 2>/dev/null || true

# Wait a moment
sleep 2

if ! pgrep -f "n8n start" > /dev/null; then
    echo "✅ n8n stopped successfully"
else
    echo "⚠️  n8n may still be running (check with: pgrep -f 'n8n start')"
fi

echo "🛑 LinkedIn Automation System stopped"
EOF
    
    chmod +x stop.sh
    echo "✅ Stop script created (./stop.sh)"
}

# Main deployment function
main() {
    echo "Starting deployment..."
    echo ""
    
    check_prerequisites
    install_dependencies
    start_n8n
    import_workflows
    setup_credentials
    create_monitoring
    create_maintenance
    create_startup
    create_stop
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "==================================="
    echo ""
    echo "Next steps:"
    echo "1. Configure credentials at: $N8N_URL/credentials"
    echo "2. Update Google Sheet ID in workflows if needed"
    echo "3. Configure Lemlist webhook URLs"
    echo "4. Test the workflows with sample data"
    echo ""
    echo "Useful commands:"
    echo "  ./start.sh    - Start the system"
    echo "  ./stop.sh     - Stop the system" 
    echo "  ./monitor.sh  - Check system status"
    echo ""
    echo "System Dashboard: $N8N_URL"
    echo ""
}

# Run main function
main