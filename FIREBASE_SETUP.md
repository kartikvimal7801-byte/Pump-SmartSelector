# Firebase Setup Guide for Cloud Sync

This guide will help you set up Firebase Firestore so that uploaded database files are synced across all devices.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter project name: `pump-selector` (or any name you prefer)
4. Disable Google Analytics (optional, you can enable later)
5. Click "Create project"
6. Wait for project creation to complete

## Step 2: Enable Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left menu
2. Click "Create database"
3. Select "Start in test mode" (for now - we'll secure it later)
4. Choose a location (closest to your users)
5. Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the `</>` (Web) icon to add a web app
5. Register app with nickname: `Pump Selector Web`
6. Copy the `firebaseConfig` object that appears

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 4: Update Your HTML Files

You need to replace the placeholder config in these files:
- `view-database.html`
- `upload-database.html`

Find this section in both files:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace it with your actual Firebase config from Step 3.

## Step 5: Set Up Firestore Security Rules (Important!)

1. In Firebase Console, go to "Firestore Database"
2. Click on "Rules" tab
3. Replace the rules with this (allows read/write for now - you can secure later):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /databaseFiles/{fileId} {
      allow read, write: if true;
    }
  }
}
```

4. Click "Publish"

**⚠️ Security Note:** The above rules allow anyone to read/write. For production, you should add authentication. For now, this works for testing.

## Step 6: Test the Setup

1. Upload a file from one device
2. Check Firebase Console → Firestore Database → You should see a `databaseFiles` collection
3. Open the site on another device
4. The file should appear automatically!

## Troubleshooting

### Files not syncing?
- Check browser console (F12) for errors
- Verify Firebase config is correct
- Check Firestore rules are published
- Make sure Firestore is enabled (not Realtime Database)

### "Permission denied" error?
- Check Firestore security rules
- Make sure rules are published (not just saved)

### Firebase not loading?
- Check internet connection
- Verify Firebase SDK URLs are correct
- Check browser console for errors

## Optional: Secure Your Database

For production, update Firestore rules to require authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /databaseFiles/{fileId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

Then set up Firebase Authentication and add admin claims to admin users.

## Free Tier Limits

Firebase Free (Spark) tier includes:
- 1 GB storage
- 50K reads/day
- 20K writes/day
- 20K deletes/day

This should be plenty for your use case. If you exceed limits, you'll be notified.

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Firebase Console → Firestore → Data (to see if data is being saved)
3. Verify all steps above are completed

