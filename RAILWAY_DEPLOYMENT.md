# 🚀 Deploy Backend to Railway

## Step 1: Prepare Your Backend for Deployment

### Create a start script for production:
```json
{
  "scripts": {
    "start": "node api/index.js",
    "dev": "nodemon api/index.js"
  }
}
```

### Create a Procfile (optional but recommended):
```
web: node api/index.js
```

## Step 2: Deploy to Railway

1. **Go to Railway**: https://railway.app/
2. **Sign up with GitHub**
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `shehan8461/Lalith_Electricals`
5. **Select branch**: `shehan`

## Step 3: Configure Environment Variables

Add these environment variables in Railway:
```
FIREBASE_PROJECT_ID=mern-60fd6
FIREBASE_PRIVATE_KEY_ID=dab4b8e8cf68caec0ac2d5ccf7f6185f4e0971fe
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5DXMdiuXz7lyL\n/Xozh9R8NaqMmSpsWS3+IoSAiDG/Q142Kv3Iy1C7RRl5TfZDxzmxYN9R7Fay5qTf\nkWrQU4Y+GJgeWJ1Nwuc6xsIYXHM/IZKR58yXKTcYBRDn81MA3S68qZvzMDqgjDb7\nwyRX8C1J69Vs0GgZjzYURRiSsczWDhhCQ1Poby6NtCXehOafTq/rsdGmc91SJ3yY\nPiAyqG3DPcJe6YC8LuZz5AdRvK5GKkKSGX15qZjkT12hqUyoNgaVV5gu92lwkPAR\nYelMByzIvwhxvF+Mjt4gmDlc1L/CMUVcHXBE+sQnMOdxv5dkskGxiMhRTm/q2fYg\nBlNeJ1qFAgMBAAECggEAAuO9tYknnRZ5VdFYf3UHwp482Odl6dK+zuDega2R9lym\ngpigqa6VefnOfA8iKZ3IW+EmNByWKIcRz661MYQyPb3sPaREzAYW36gvwC47ypng\ngYpJyHev26btqo3UG4vYowTyVMR0Qz4hiURKQG1quCjQ5FKpdGnJT5AvcyVdjE4/\nz5w2OiGgOeVkUQkn3/wOMkP8HkslCrSoG8V//DJkSIEXKRNM/ge4SK0mKKY9VTXB\nQ601C8L+xaVK7As/VVOruZTtxzFLFVuFcGRrHiZa0mUTb6hn7hapdAT31wDQLHwM\nBJMkX3j2bjnQChQczvCTKlFh+2jmOb2H1LuJQEAV0wKBgQDvGiI3bu2itk9V41Z1\n2eXOHg53RqiMsSPcb3cGX2ZNp2I9UvAcACfmEqU6d40fnxiaV6gVnDWPjXY/qtZE\nmuclp+5iNbzX57Cf2xebetrz/plQ2m6foaZ4JqpvDIHt3Tl3fqyhWymydpMa5Ykw\nKnYCCijBJaylb7wJak0ebtYZHwKBgQDGIXHLIVR2Wx7qgeFGAFJl3O+DMk8DN+7R\nSnz3Q1M3SnODo0Tl9OjUTbVU1jeRDvHRoR0UzgZtSnUliOFyMNQ9ZX0MwERygLYw\nKfObLmMjTBpvjgEMBBvWHfIgzsnZapIIQyngoQVmlCEwYNkD8dYgOlQ4gLj89edf\ngbl6TDuD2wKBgQDmhHuYlgnlZX73f0ZMONel8LRhqm21ttKsI4rNSgyHsWi1VtDH\nLh9JYZCK3dfhNLGzm+8hZoj87ZWjrEEHw5A2bcEWTljSjz1p4QDRlZCizENkADPH\nE0I7dIu8pIJfoXlWC3rD1fBNbqREuieZmFZNgR3pmTjqBt9y9FmFjbY8YQKBgQCY\noCjdttYuunDta5HS7+qJh5GF+lo9e3fgB8aOX3GaVSL5E+u+TVSSPy5hpQd3GhEU\nUE1rum3fAQ2PFYu+AHlutmCHUxEnN5mhLp/3Oduq1DRFHRoXXI7o+XaM6V86ucq2\nzK5U2RWk+JU8hE6IqGIvv18ji511WCSdQPxVhqYOIwKBgFD4Y9sttktjtvAKJu7r\ncmiR72xLEJK8bUvS+bD8MnpJD43KgCd0EdZTa9d7ZtD2rvoRb8XRszSUVBZxIcWM\nN20zQT/cs6GzwBBHjBulf4VMzOGZ+M/8hraHvtRiVaQZS3n4Do8XSnRc++8yyQPk\niM1KVoUGEo+6CEa4miLEUNQW\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mern-60fd6.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=112758232468617659951
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mern-60fd6.iam.gserviceaccount.com
JWT_SECRET=shehan
PORT=3001
NODE_ENV=production
```

## Step 4: Update Frontend to Use Production API

Once deployed, Railway will give you a URL like: `https://your-app.railway.app`

### Update your frontend configuration:
```javascript
// client/vite.config.js
const API_URL = 'https://your-app.railway.app'; // Replace with your Railway URL

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
```

## Step 5: Redeploy Frontend

```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

Your app will be fully functional! 🎉
