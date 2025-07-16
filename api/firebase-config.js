import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
let serviceAccount;

try {
  // Try to load service account from file
  const serviceAccountPath = join(__dirname, '../firebase-service-account.json');
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
  console.log('✅ Using Firebase service account from file');
} catch (error) {
  // If file doesn't exist, use environment variables
  const projectId = process.env.FIREBASE_PROJECT_ID || 'mern-60fd6';
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  
  if (!privateKey || !clientEmail) {
    console.error('❌ Firebase configuration missing!');
    console.error('📝 Please either:');
    console.error('   1. Add firebase-service-account.json file to project root, OR');
    console.error('   2. Set environment variables in .env file');
    console.error('');
    console.error('� See FIREBASE_SETUP_GUIDE.md for detailed setup instructions');
    console.error('');
    console.error('🔧 Server will continue without Firebase...');
    
    // Skip Firebase initialization entirely
    serviceAccount = null;
  } else {
    serviceAccount = {
      type: "service_account",
      project_id: projectId,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey.replace(/\\n/g, '\n'),
      client_email: clientEmail,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };
  }
}

let db, auth;

// Only initialize Firebase if we have valid credentials
if (serviceAccount) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
      });
    }

    db = admin.firestore();
    auth = admin.auth();
    
    console.log(`🔥 Firebase Admin SDK initialized for project: ${serviceAccount.project_id}`);
    
    // Test the connection asynchronously
    setTimeout(async () => {
      try {
        await db.collection('_health').doc('test').set({ timestamp: new Date() });
        console.log('✅ Firebase Firestore connection successful!');
      } catch (testError) {
        console.error('⚠️  Firebase connection test failed:', testError.message);
        console.error('📖 Please check FIREBASE_SETUP_GUIDE.md for setup instructions');
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error.message);
    console.error('');
    console.error('🚨 Common Firebase Setup Issues:');
    console.error('   1. Invalid or missing service account credentials');
    console.error('   2. Incorrect project ID (check your Firebase console)');
    console.error('   3. Firestore not enabled in your Firebase project');
    console.error('   4. Network connectivity issues');
    console.error('');
    console.error('📖 Please check FIREBASE_SETUP_GUIDE.md for detailed setup instructions');
    console.error('');
    serviceAccount = null; // Reset to null to create mock objects
  }
}

// Create mock objects if Firebase is not configured
if (!serviceAccount) {
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md')),
        set: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md')),
        update: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md')),
        delete: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md'))
      }),
      add: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md')),
      where: () => ({
        get: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md'))
      }),
      orderBy: () => ({
        get: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md'))
      }),
      get: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md'))
    })
  };
  
  auth = {
    createUser: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md')),
    getUserByEmail: () => Promise.reject(new Error('Firebase not configured. Please check FIREBASE_SETUP_GUIDE.md'))
  };
}

export { db, auth, admin };
