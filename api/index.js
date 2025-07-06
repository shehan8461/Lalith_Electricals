import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js'
import authroutes from './routes/auth.routes.js'
import adminroutes from './routes/admin.routes.js'
import cookieParser from 'cookie-parser';

dotenv.config();

// MongoDB connection with improved settings
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO, {
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

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

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

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||'internal server error'
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})