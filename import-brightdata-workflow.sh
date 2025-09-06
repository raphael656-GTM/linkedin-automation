#!/bin/bash
# Bright Data n8n Workflow Import Script

echo "📥 Importing LinkedIn automation workflow with Bright Data integration..."

# Check if n8n CLI is available
if command -v n8n &> /dev/null; then
    echo "✅ n8n CLI detected"
    echo "📦 Importing Bright Data integrated workflow..."
    
    # Import the new Bright Data workflow
    n8n import:workflow --input="./n8n-workflows-generated/linkedin-only-automation-brightdata.json"
    
    echo "✅ Workflow imported successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Open n8n at http://localhost:5678"
    echo "2. Configure Google Sheets OAuth2 credentials"
    echo "3. Configure OpenAI API credentials"
    echo "4. Set environment variables in .env file"
    echo "5. Test the workflow with a sample prospect"
    echo "6. Activate the workflow for daily execution"
else
    echo "⚠️  n8n CLI not found. Please import the workflow manually:"
    echo ""
    echo "Manual Import Steps:"
    echo "1. Open n8n interface"
    echo "2. Go to Workflows → Import from File"
    echo "3. Select: ./n8n-workflows-generated/linkedin-only-automation-brightdata.json"
    echo "4. Click Import"
    echo ""
    echo "Or install n8n CLI:"
    echo "npm install -g n8n"
fi

echo ""
echo "📚 For detailed setup instructions, see: BRIGHT-DATA-DEPLOYMENT.md"