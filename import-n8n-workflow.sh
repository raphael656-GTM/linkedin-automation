#!/bin/bash
# n8n Workflow Import Script

echo "📥 Importing LinkedIn automation workflow to n8n..."

# Check if n8n CLI is available
if command -v n8n &> /dev/null; then
    n8n import:workflow --input="/Users/raphaelberrebi/conductor/linkedin-automation/.conductor/raphael656-GTM-brasilia/n8n-workflows-generated/linkedin-only-automation-configured.json"
    echo "✅ Workflow imported successfully"
else
    echo "⚠️  n8n CLI not found. Please import the workflow manually:"
    echo "   File: /Users/raphaelberrebi/conductor/linkedin-automation/.conductor/raphael656-GTM-brasilia/n8n-workflows-generated/linkedin-only-automation-configured.json"
fi
