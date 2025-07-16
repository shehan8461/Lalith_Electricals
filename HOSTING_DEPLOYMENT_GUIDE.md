# 🚀 Production Hosting Guide

## Quick Setup (Recommended)

### 1. **Vercel + Firebase + Cloudinary**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd client
vercel --prod

# Deploy backend
cd ../api
vercel --prod
```

**Monthly Cost: ~$30-50**
- Domain: $12/year
- Vercel Pro: $20/month
- Cloudinary: $89/month (or start with free tier)
- Firebase: $25/month

### 2. **Railway + Cloudinary (Current Setup)**
```bash
# Deploy to Railway
railway login
railway init
railway up
```

**Monthly Cost: ~$25-40**
- Domain: $12/year
- Railway: $20/month
- Cloudinary: $89/month (or free tier)

## 🎯 **Speed Optimization Setup**

### Frontend Optimization
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', 'antd']
        }
      }
    }
  }
});
```

### Image Upload with Cloudinary
```javascript
// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'lalith-electricals',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Upload failed');
  }
};
```

### Video Upload
```javascript
export const uploadVideo = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'video',
      folder: 'lalith-electricals/videos',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    throw new Error('Video upload failed');
  }
};
```

## 📱 **Domain Setup**

### Buy Domain
1. **Namecheap**: $8-15/year
2. **GoDaddy**: $12-20/year
3. **Cloudflare**: $8-12/year (recommended)

### Configure DNS
```
# Add these DNS records:
A     @           192.0.2.1
CNAME www         yourapp.vercel.app
CNAME api         yourapi.railway.app
```

## 🔧 **Environment Variables**

### Production Environment
```env
# Database
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
JWT_SECRET=your-strong-secret
NODE_ENV=production
```

## 💰 **Pricing Breakdown**

### **Starter Plan (~$35/month)**
- Domain: $1/month
- Vercel Pro: $20/month  
- Railway: $20/month
- Cloudinary Free: $0
- **Total: ~$35/month**

### **Professional Plan (~$80/month)**
- Domain: $1/month
- Vercel Pro: $20/month
- Railway Pro: $20/month
- Cloudinary Pro: $89/month
- **Total: ~$130/month**

### **Enterprise Plan (~$200/month)**
- Domain: $1/month
- Vercel Team: $150/month
- Railway Team: $50/month
- Cloudinary Advanced: $224/month
- **Total: ~$425/month**

## 🚀 **Performance Optimizations**

### 1. **CDN Configuration**
```javascript
// Configure CDN headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});
```

### 2. **Database Optimization**
```javascript
// Add indexes for better query performance
await db.collection('items').createIndex({ userId: 1, createdAt: -1 });
await db.collection('users').createIndex({ email: 1 });
```

### 3. **Image Optimization**
```javascript
// Automatically optimize images
const optimizedUrl = cloudinary.url(publicId, {
  width: 400,
  height: 300,
  crop: 'fill',
  quality: 'auto',
  fetch_format: 'auto'
});
```

## 🛡️ **Security Setup**

### 1. **HTTPS & SSL**
- Automatic with Vercel/Railway
- Custom domain SSL included

### 2. **API Security**
```javascript
// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. **File Upload Security**
```javascript
// File type validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
if (!allowedTypes.includes(file.mimetype)) {
  throw new Error('Invalid file type');
}
```

## 🔄 **Deployment Workflow**

### 1. **Automated Deployment**
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### 2. **Environment Management**
```bash
# Production deployment
vercel --prod

# Staging deployment  
vercel --target staging
```

## 📊 **Monitoring & Analytics**

### 1. **Performance Monitoring**
- Vercel Analytics: Free
- Google Analytics: Free
- Sentry (Error tracking): $26/month

### 2. **Database Monitoring**
- Firebase Console: Free
- Custom logging: Included

## 🎯 **Next Steps**

1. **Choose hosting option**
2. **Buy domain**
3. **Setup file upload service**
4. **Configure environment variables**
5. **Deploy and test**

**Ready to start? Let me know which option you prefer!**
