#!/bin/bash

echo "🔥 Firebase Service Account Setup Helper"
echo "========================================"
echo ""
echo "You have two options to set up Firebase:"
echo ""
echo "📁 OPTION 1: Service Account JSON File (Recommended)"
echo "1. Go to: https://console.firebase.google.com/"
echo "2. Select project: mern-60fd6"
echo "3. Click gear icon → Project Settings"
echo "4. Go to 'Service accounts' tab"
echo "5. Click 'Generate new private key'"
echo "6. Download the JSON file"
echo "7. Rename to: firebase-service-account.json"
echo "8. Place in project root (same level as package.json)"
echo ""
echo "⚙️ OPTION 2: Environment Variables"
echo "1. Download service account JSON (steps 1-6 above)"
echo "2. Extract values and update .env file:"
echo "   - FIREBASE_PROJECT_ID=mern-60fd6"
echo "   - FIREBASE_PRIVATE_KEY_ID=from JSON file"
echo "   - FIREBASE_PRIVATE_KEY=from JSON file"
echo "   - FIREBASE_CLIENT_EMAIL=from JSON file"
echo "   - FIREBASE_CLIENT_ID=from JSON file"
echo "   - FIREBASE_CLIENT_X509_CERT_URL=from JSON file"
echo ""

# Check current status
echo "📊 Current Status:"
echo "=================="

if [ -f "firebase-service-account.json" ]; then
    echo "✅ firebase-service-account.json: Found"
    echo "   Project ID: $(cat firebase-service-account.json | grep -o '"project_id":[^,]*' | cut -d'"' -f4)"
else
    echo "❌ firebase-service-account.json: Not found"
fi

if [ -f ".env" ]; then
    echo "✅ .env file: Found"
    echo "   Project ID: $(grep FIREBASE_PROJECT_ID .env | cut -d'=' -f2)"
    
    if grep -q "your_private_key_id_here" .env; then
        echo "⚠️  Environment variables: Need to be updated with real values"
    else
        echo "✅ Environment variables: Appear to be configured"
    fi
else
    echo "❌ .env file: Not found"
fi

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Choose Option 1 or 2 above"
echo "2. Set up your Firebase credentials"
echo "3. Restart server: npm run dev"
echo "4. Test connection: npm run test-firebase"
echo ""
echo "📝 For detailed instructions, see: FIREBASE_SETUP_GUIDE.md"
