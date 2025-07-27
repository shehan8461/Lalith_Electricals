import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/user.routes.js'
import authroutes from './routes/auth.routes.js'
import adminroutes from './routes/admin.routes.js'
import uploadRoutes from './routes/upload.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv to load from the current api directory
dotenv.config({ path: path.join(__dirname, '.env') });

// MongoDB connection with improved settings
const connectDB = async () => {
    try {
        console.log('MONGO environment variable:', process.env.MONGO);
        console.log('All environment variables loaded:', Object.keys(process.env).filter(key => key.includes('MONGO')));
        
        const mongoURI = process.env.MONGO;
        if (!mongoURI) {
            throw new Error('MONGO environment variable is not defined');
        }
        
        const conn = await mongoose.connect(mongoURI, {
            // Connection timeout settings
            serverSelectionTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            // For development - retry connection
            retryWrites: true,
            w: 'majority'
        });
        
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to DB');
        });
        
        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
        
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        
        // Provide specific error messages
        if (error.message.includes('authentication failed')) {
            console.error('❌ Check your MongoDB username and password in .env file');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            console.error('❌ Check your internet connection and MongoDB Atlas URL');
        } else if (error.message.includes('IP address') || error.message.includes('whitelist')) {
            console.error('❌ Add your IP address to MongoDB Atlas Network Access whitelist');
        }
        
        // Retry after 5 seconds (max 10 retries to prevent infinite loop)
        if (!global.retryCount) global.retryCount = 0;
        if (global.retryCount < 10) {
            global.retryCount++;
            console.log(`🔄 Retrying connection in 5 seconds... (attempt ${global.retryCount}/10)`);
            setTimeout(connectDB, 5000);
        } else {
            console.error('❌ Maximum retry attempts reached. Please fix the connection issue and restart the server.');
        }
    }
};

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'https://www.lalithelectrical.com',     // main frontend domain (with www)
    'https://lalithelectrical.com',         // main frontend domain (non-www)
    'https://api.lalithelectrical.com',     // API domain
    'http://localhost:5173'                 // local dev
  ],
  credentials: true,
}));

// Connect to database
connectDB();

// Enable CORS for specific origin
app.use(cors({
  origin: [
    'https://lalithelectrical.com',
     'https://www.lalithelectrical.com',  // your frontend domain
    'http://localhost:5173',        // local dev
    'https://api.lalithelectrical.com'
  ],
  credentials: true,
}));

connectDB();
// Serve static files for uploaded images and videos
app.use('/Images', express.static(path.join(__dirname, './Images')));
app.use('/Videos', express.static(path.join(__dirname, './Videos')));

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Lalith Electricals API Server',
        status: 'Running',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString(),
        availableRoutes: [
            '/api/auth',
            '/api/user', 
            '/api/admin',
            '/api/health'
        ]
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});


app.use("/api/user",userRoutes)
app.use("/api/auth",authroutes)
app.use("/api/admin",adminroutes)
app.use('/api/upload', uploadRoutes);

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error'
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})
