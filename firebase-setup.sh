#!/bin/bash

echo "🔥 Firebase Setup Helper"
echo "========================"
echo ""
echo "To get your Firebase service account key:"
echo ""
echo "1. 🌐 Go to Firebase Console: https://console.firebase.google.com/"
echo "2. 📁 Create a new project or select existing project"
echo "3. ⚙️  Click the gear icon (Project Settings)"
echo "4. 🔑 Go to 'Service accounts' tab"
echo "5. 🔐 Click 'Generate new private key'"
echo "6. 📥 Download the JSON file"
echo "7. 📋 Copy it to your project root as 'firebase-service-account.json'"
echo ""
echo "🚀 Then restart your server with: npm run dev"
echo ""
echo "📝 Alternative: Update the .env file with your Firebase credentials"
echo ""

# Check if Firebase service account file exists
if [ -f "firebase-service-account.json" ]; then
    echo "✅ Firebase service account file found!"
else
    echo "❌ Firebase service account file not found."
    echo "   Please follow the steps above to get your service account key."
fi

echo ""
echo "📊 Current project structure:"
ls -la | grep -E "(firebase|\.env)"
