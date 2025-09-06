#!/bin/bash
# Google Apps Scripts Deployment Helper
# This script helps deploy the LinkedIn finder to Google Apps Script

echo "🚀 Deploying LinkedIn Finder to Google Apps Script..."

# Check if clasp is installed
if ! command -v clasp &> /dev/null; then
    echo "Installing @google/clasp..."
    npm install -g @google/clasp
fi

# Login to Google (if needed)
echo "📝 Ensuring you're logged in to Google..."
clasp login --status || clasp login

# Create .clasp.json if it doesn't exist
if [ ! -f ".clasp.json" ]; then
    echo "Creating new Apps Script project..."
    clasp create --title "LinkedIn Profile Finder" --type sheets
fi

# Push the script
echo "Pushing script to Google Apps Script..."
clasp push --force

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Open the script: clasp open"
echo "2. Set up triggers for automated execution"
echo "3. Configure API credentials in the script"
