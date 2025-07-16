import { db } from './api/firebase-config.js';
import dotenv from 'dotenv';

dotenv.config();

// Test Firebase connection
async function testFirebaseConnection() {
    console.log('🔥 Testing Firebase connection...');
    
    try {
        // Test writing to Firestore
        const testDoc = await db.collection('test').add({
            message: 'Firebase connection test',
            timestamp: new Date(),
            status: 'success'
        });
        
        console.log('✅ Successfully connected to Firebase!');
        console.log('📝 Test document created with ID:', testDoc.id);
        
        // Test reading from Firestore
        const doc = await db.collection('test').doc(testDoc.id).get();
        if (doc.exists) {
            console.log('📖 Successfully read test document:', doc.data());
        }
        
        // Clean up test document
        await db.collection('test').doc(testDoc.id).delete();
        console.log('🗑️ Test document cleaned up');
        
        console.log('\n🎉 Firebase is ready to use!');
        console.log('📚 Collections that will be created:');
        console.log('   - users (for user accounts)');
        console.log('   - products (for items/products)');
        console.log('   - admins (for admin accounts)');
        
    } catch (error) {
        console.error('❌ Firebase connection failed:', error.message);
        console.error('\n🔧 Please check:');
        console.error('   1. Firebase service account key is correct');
        console.error('   2. Environment variables are set properly');
        console.error('   3. Firestore is enabled in Firebase Console');
    }
}

testFirebaseConnection();
