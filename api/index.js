import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js'
import authroutes from './routes/auth.routes.js'
import adminroutes from './routes/admin.routes.js'
import publicroutes from './routes/public.routes.js'
import cookieParser from 'cookie-parser';
import { db } from './firebase-config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Firebase connection test
const connectFirebase = async () => {
    try {
        // Test Firebase connection by trying to access a collection
        const testCollection = db.collection('test');
        await testCollection.doc('connection-test').set({
            timestamp: new Date(),
            message: 'Firebase connection successful'
        });
        
        console.log('✅ Connected to Firebase Firestore');
        
        // Clean up test document
        await testCollection.doc('connection-test').delete();
        
    } catch (error) {
        console.error('❌ Firebase connection failed:', error.message);
        
        // Provide specific error messages
        if (error.message.includes('permission-denied')) {
            console.error('❌ Check your Firebase service account credentials');
        } else if (error.message.includes('project-not-found')) {
            console.error('❌ Check your Firebase project ID');
        } else if (error.message.includes('invalid-argument')) {
            console.error('❌ Check your Firebase private key format');
        }
        
        // Don't exit the process, just log the error
        console.error('⚠️  Server will continue but database operations may fail');
    }
};

// Connect to Firebase
connectFirebase();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files from React build
const clientDistPath = path.join(process.cwd(), 'client', 'dist');
console.log('Static files path:', clientDistPath);
app.use(express.static(clientDistPath));

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test Firebase connection
        const testDoc = await db.collection('test').doc('health-check').get();
        res.status(200).json({ 
            status: 'OK', 
            database: 'Firebase Firestore',
            connection: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'ERROR', 
            database: 'Firebase Firestore',
            connection: 'Disconnected',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Debug endpoint to check Firebase configuration
app.get('/api/debug/firebase', async (req, res) => {
    try {
        const hasFirebaseConfig = !!process.env.FIREBASE_CONFIG;
        const hasGCloudProject = !!process.env.GCLOUD_PROJECT;
        const hasServiceAccount = !!process.env.FIREBASE_CLIENT_EMAIL;
        
        const debugInfo = {
            environment: process.env.NODE_ENV || 'development',
            hasFirebaseConfig,
            hasGCloudProject,
            hasServiceAccount,
            projectId: process.env.GCLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'unknown',
            timestamp: new Date().toISOString()
        };
        
        // Test actual Firebase connection
        try {
            await db.collection('_debug').doc('test').set({ 
                timestamp: new Date(),
                test: 'Firebase connection test from debug endpoint'
            });
            debugInfo.firebaseTest = 'SUCCESS';
        } catch (firebaseError) {
            debugInfo.firebaseTest = 'FAILED';
            debugInfo.firebaseError = firebaseError.message;
        }
        
        res.status(200).json(debugInfo);
    } catch (error) {
        res.status(500).json({ 
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

app.use("/api/user",userRoutes)
app.use("/api/auth",authroutes)
app.use("/api/admin",adminroutes)
app.use("/api/public",publicroutes)

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
    const indexPath = path.join(process.cwd(), 'client', 'dist', 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
});

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error'
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})