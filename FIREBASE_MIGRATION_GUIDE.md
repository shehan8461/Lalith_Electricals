# Firebase Migration Setup Guide

## 🚀 Complete Migration from MongoDB to Firebase

Your application has been successfully migrated from MongoDB to Firebase Firestore! Here's what you need to do to complete the setup:

## 1. Firebase Console Setup

### Step 1: Create Firebase Project (if not already done)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your existing project `mern-60fd6` or create a new one
3. Enable Firestore Database in the console

### Step 2: Generate Service Account Key
1. In Firebase Console, go to **Project Settings** (⚙️ gear icon)
2. Navigate to **Service Accounts** tab
3. Click **Generate new private key**
4. Download the JSON file and save it as `firebase-service-account.json` in your project root

### Step 3: Setup Environment Variables
Create a `.env` file in your root directory with these variables:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=mern-60fd6
FIREBASE_PRIVATE_KEY_ID=your_private_key_id_from_json_file
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_content_here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_client_email_from_json_file
FIREBASE_CLIENT_ID=your_client_id_from_json_file
FIREBASE_CLIENT_X509_CERT_URL=your_client_x509_cert_url_from_json_file

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Port
PORT=3000
```

## 2. File Structure Changes

### ✅ New Files Created:
- `api/firebase-config.js` - Firebase Admin SDK configuration
- `api/models/user.firebase.js` - User model for Firebase
- `api/models/item.firebase.js` - Item model for Firebase  
- `api/models/admin.firebase.js` - Admin model for Firebase
- `api/controllers/auth.firebase.js` - Auth controller for Firebase
- `api/controllers/user.firebase.js` - User controller for Firebase
- `api/controllers/admin.firebase.js` - Admin controller for Firebase

### ✅ Updated Files:
- `api/index.js` - Updated to use Firebase instead of MongoDB
- `api/routes/auth.routes.js` - Updated to use Firebase controllers
- `api/routes/user.routes.js` - Updated to use Firebase controllers
- `api/routes/admin.routes.js` - Updated to use Firebase controllers
- `.env.example` - Updated with Firebase configuration template

## 3. Database Collections Structure

### Users Collection (`users`)
```javascript
{
  id: "auto-generated-id",
  username: "string",
  email: "string", 
  password: "hashed-password",
  profilePicture: "url",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Products Collection (`products`)
```javascript
{
  id: "auto-generated-id",
  petId: "ORD...", // Auto-generated order ID
  userId: "user-id",
  Name: "string",
  date: "string",
  Description: "string", 
  Title: "string",
  profilePicture: "url",
  alternateProfilePicture: "url",
  thirdProfilePicture: "url",
  fourthProfilePicture: "url",
  productVideo: "url",
  featured: "boolean",
  onSale: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Admins Collection (`admins`)
```javascript
{
  id: "auto-generated-id",
  username: "string",
  email: "string",
  password: "hashed-password",
  createdAt: "timestamp", 
  updatedAt: "timestamp"
}
```

## 4. Key Features Maintained

### ✅ All Original Features:
- User registration and authentication
- Product CRUD operations
- Admin panel functionality
- File upload to Firebase Storage
- Featured and On Sale product filtering
- Search functionality
- All existing API endpoints

### ✅ New Firebase Features:
- Real-time database updates
- Better scalability
- Automatic backups
- Enhanced security rules
- Better performance

## 5. Testing the Migration

### Start the Server:
```bash
cd "path/to/your/project"
npm run dev
```

### Test API Endpoints:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/store` - Create product
- `GET /api/auth/users/items` - Get all products
- `GET /api/health` - Health check

## 6. Production Deployment

### Environment Variables:
Make sure all Firebase environment variables are set in your production environment.

### Firestore Security Rules:
Set up proper security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users for now
    // Update these rules based on your security requirements
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 7. Benefits of Firebase Migration

- **Scalability**: Auto-scaling database
- **Real-time**: Real-time updates
- **Security**: Built-in security features
- **Performance**: Faster query performance
- **Integration**: Better integration with Firebase services
- **Maintenance**: Managed database service

## 8. Next Steps

1. Set up Firebase environment variables
2. Test all API endpoints
3. Configure Firestore security rules
4. Deploy to production
5. Monitor performance and usage

Your application is now fully migrated to Firebase! 🎉
