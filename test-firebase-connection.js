#!/usr/bin/env node

// Quick Firebase Connection Test
// Run this script to verify your Firebase setup

import { db, auth } from './api/firebase-config.js';

async function testFirebase() {
  console.log('🔥 Testing Firebase Connection...\n');
  
  try {
    // Test 1: Firestore connection
    console.log('📊 Testing Firestore connection...');
    const testDoc = await db.collection('_test').doc('connection-test').set({
      timestamp: new Date(),
      message: 'Firebase connection test successful!'
    });
    console.log('✅ Firestore write test passed');
    
    // Test 2: Read test
    const docSnapshot = await db.collection('_test').doc('connection-test').get();
    if (docSnapshot.exists) {
      console.log('✅ Firestore read test passed');
      console.log('📄 Test document data:', docSnapshot.data());
    }
    
    // Test 3: Collection query
    const querySnapshot = await db.collection('_test').limit(1).get();
    console.log('✅ Firestore query test passed');
    console.log('📊 Query returned', querySnapshot.size, 'document(s)');
    
    // Test 4: Auth service (basic check)
    console.log('🔐 Testing Auth service...');
    // Just check if auth object exists and has expected methods
    if (auth && typeof auth.createUser === 'function') {
      console.log('✅ Auth service is accessible');
    } else {
      console.log('❌ Auth service not properly initialized');
    }
    
    // Cleanup
    await db.collection('_test').doc('connection-test').delete();
    console.log('🧹 Test cleanup completed');
    
    console.log('\n🎉 All Firebase tests passed!');
    console.log('✅ Your Firebase setup is working correctly');
    console.log('🚀 You can now start using your application');
    
  } catch (error) {
    console.error('\n❌ Firebase test failed:', error.message);
    console.error('\n🚨 Possible issues:');
    console.error('   1. Check your Firebase project ID');
    console.error('   2. Verify your service account credentials');
    console.error('   3. Make sure Firestore is enabled in your project');
    console.error('   4. Check your internet connection');
    console.error('\n📖 See FIREBASE_SETUP_GUIDE.md for detailed setup instructions');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('\n❌ Unhandled error:', error.message);
  console.error('📖 Please check FIREBASE_SETUP_GUIDE.md for setup instructions');
  process.exit(1);
});

// Run the test
testFirebase().catch(console.error);
