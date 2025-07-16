#!/bin/bash

# Firebase Setup Guide for Lalith Electricals
# This script helps you set up Firebase for your project

echo "🔥 Firebase Setup Guide for Lalith Electricals"
echo "=============================================="
echo ""

echo "📋 Step 1: Create a Firebase Project"
echo "   1. Go to https://console.firebase.google.com"
echo "   2. Click 'Add project' or 'Create a project'"
echo "   3. Enter project name: 'Lalith Electricals' (or your preferred name)"
echo "   4. The project ID will be auto-generated (e.g., 'lalith-electricals-12345')"
echo "   5. Enable Google Analytics (optional)"
echo "   6. Click 'Create project'"
echo ""

echo "📋 Step 2: Set up Firestore Database"
echo "   1. In your Firebase project, go to 'Firestore Database'"
echo "   2. Click 'Create database'"
echo "   3. Choose 'Start in test mode' (you can secure it later)"
echo "   4. Select a location (choose closest to your users)"
echo "   5. Click 'Done'"
echo ""

echo "📋 Step 3: Enable Authentication"
echo "   1. Go to 'Authentication' in the left sidebar"
echo "   2. Click 'Get started'"
echo "   3. Go to 'Sign-in method' tab"
echo "   4. Enable 'Email/Password' authentication"
echo "   5. Click 'Save'"
echo ""

echo "📋 Step 4: Generate Service Account Key"
echo "   1. Go to 'Project settings' (gear icon)"
echo "   2. Click on 'Service accounts' tab"
echo "   3. Click 'Generate new private key'"
echo "   4. Download the JSON file"
echo "   5. Rename it to 'firebase-service-account.json'"
echo "   6. Place it in your project root directory"
echo ""

echo "📋 Step 5: Update Environment Variables"
echo "   Update your .env file with the correct project ID from step 1"
echo "   Example: FIREBASE_PROJECT_ID=lalith-electricals-12345"
echo ""

echo "🚀 Step 6: Test Your Setup"
echo "   Run: npm run test-firebase"
echo "   This will verify your Firebase connection"
echo ""

echo "⚠️  Important Security Notes:"
echo "   1. Never commit firebase-service-account.json to version control"
echo "   2. Set up proper Firestore security rules in production"
echo "   3. Restrict API keys to specific domains in production"
echo ""

echo "🔧 For Production Deployment:"
echo "   1. Use environment variables instead of JSON files"
echo "   2. Set up proper IAM roles and permissions"
echo "   3. Enable Firebase App Check for additional security"
echo ""

echo "✅ Once you've completed these steps, restart your server with: npm run dev"
