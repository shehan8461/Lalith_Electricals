#!/bin/bash

echo "🧪 Testing Item Creation with Fixed Firebase Validation"
echo "======================================================"
echo ""

# Test 1: Create a user first (to get authentication token)
echo "📝 Step 1: Creating a test user..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Signup response: $SIGNUP_RESPONSE"
echo ""

# Test 2: Sign in to get authentication token
echo "🔑 Step 2: Signing in to get authentication token..."
SIGNIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/signin \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Signin response: $SIGNIN_RESPONSE"
echo ""

# Test 3: Create an item using the authentication token
echo "📦 Step 3: Creating an item with authentication..."
ITEM_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/store \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "Name": "Test Item",
    "Title": "Test Title",
    "Description": "Test Description",
    "date": "2025-07-16",
    "profilePicture": "https://example.com/image.jpg",
    "featured": false,
    "onSale": true
  }')

echo "Item creation response: $ITEM_RESPONSE"
echo ""

# Test 4: Check all items
echo "📋 Step 4: Checking all items..."
ALL_ITEMS_RESPONSE=$(curl -s http://localhost:3001/api/auth/users/items)
echo "All items response: $ALL_ITEMS_RESPONSE"
echo ""

# Cleanup
rm -f cookies.txt

echo "✅ Test completed!"
echo ""
echo "📊 Summary:"
echo "- If you see 'Item created successfully', the Firestore validation is working!"
echo "- If you see errors, check the server logs for details"
echo "- The userId is now properly extracted from the authentication token"
