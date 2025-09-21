# Google Authentication Setup Guide

## Prerequisites
1. Google Cloud Console account
2. A domain for your app (or localhost for development)

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in required fields:
   - App name: "Sahayak"
   - User support email: your email
   - Developer contact: your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (for development)

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:5178` (for development)
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:5178/auth/google/callback`
   - Your production callback URL

### 4. Install Google Auth Library
```bash
npm install @google-cloud/oauth2
```

### 5. Environment Variables
Create a `.env` file:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### 6. Update Auth Components
Replace the placeholder Google sign-in functions in:
- `src/pages/SignIn.tsx`
- `src/pages/Register.tsx`

With actual Google OAuth implementation.

## Current Implementation
The auth pages currently have placeholder Google sign-in buttons that simulate the authentication flow. To implement real Google OAuth, you'll need to:

1. Set up a backend server to handle OAuth callbacks
2. Implement the Google OAuth flow
3. Handle JWT tokens and user sessions
4. Connect to your user database

## Security Notes
- Never expose client secrets in frontend code
- Use HTTPS in production
- Implement proper session management
- Validate tokens on the backend
