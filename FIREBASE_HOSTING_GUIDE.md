# 🚀 Firebase Hosting Setup Guide

## 📋 Overview
This guide will help you deploy your MERN application to Firebase Hosting:
- Frontend (React/Vite) → Firebase Hosting
- Backend (Node.js/Express) → Firebase Functions (optional) or other hosting

## 🔧 Step 1: Login to Firebase

```bash
firebase login
```

## 🏗️ Step 2: Initialize Firebase in Your Project

```bash
cd "/Users/shehansalitha/Desktop/ react freelanzer/lalith_Electricals"
firebase init hosting
```

**Configuration Options:**
- **Existing project**: Select `mern-60fd6`
- **Public directory**: `client/dist`
- **Single-page app**: `Yes`
- **Automatic builds**: `No` (we'll build manually)
- **GitHub integration**: `No` (for now)

## 📦 Step 3: Build Your Client Application

```bash
cd client
npm install
npm run build
```

## 🌐 Step 4: Deploy to Firebase Hosting

```bash
cd ..
firebase deploy --only hosting
```

## ⚙️ Step 5: Backend Deployment Options

### Option A: Keep Backend Separate (Recommended)
- Deploy to Railway, Render, or Heroku
- Update client to use production API URL

### Option B: Firebase Functions (Advanced)
- Convert Express app to Firebase Functions
- Deploy both frontend and backend to Firebase

## 📝 Configuration Files

### firebase.json
```json
{
  "hosting": {
    "public": "client/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "mern-60fd6"
  }
}
```

## 🔄 Production Configuration

### Update Vite Config for Production
```javascript
// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### Environment Variables
Create `client/.env.production`:
```
VITE_API_URL=https://your-backend-url.com
VITE_FIREBASE_API_KEY=your_api_key_here
```

## 🚀 Quick Deploy Commands

```bash
# Build and deploy
cd client && npm run build && cd .. && firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Preview before deploying
firebase serve
```

## 📊 After Deployment

1. **Test your hosted app**: https://mern-60fd6.web.app
2. **Update API endpoints** in your client code
3. **Configure CORS** on your backend for the new domain
4. **Set up custom domain** (optional)

## 🔐 Security Considerations

1. **Firestore Rules**: Set up proper security rules
2. **API Keys**: Restrict Firebase API keys to your domain
3. **CORS**: Configure backend to accept requests from your domain
4. **Environment Variables**: Use proper production values

## 📚 Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Firebase Functions (for backend)](https://firebase.google.com/docs/functions)

---

**Next Steps**: Run the commands above to deploy your application!
