# Sahayak Deployment Guide

## 🚀 Vercel Deployment (Recommended)

### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add GEMINI_API_KEY
vercel env add GEMINI_MODEL
```

### 2. Set Environment Variables in Vercel Dashboard
1. Go to your project in Vercel dashboard
2. Go to Settings > Environment Variables
3. Add: `GEMINI_API_KEY` = `your_actual_api_key_here`
4. Optional: `GEMINI_MODEL` = `gemini-2.5-flash` (or another supported model)

### 3. Benefits of Vercel Serverless Functions
- ✅ **Secure**: API keys never exposed to client
- ✅ **Fast**: Global CDN with edge functions
- ✅ **Cost-effective**: Pay only for usage
- ✅ **Scalable**: Auto-scales with demand
- ✅ **Easy**: One-click deployment

## 🔧 Local Development

### Option 1: With Vercel CLI (Recommended)
```bash
# Install dependencies
npm install

# Install Vercel CLI
npm i -g vercel

# Run locally with serverless functions
vercel dev
```

### Option 2: Traditional Vite (Fallback)
```bash
# Create .env.local file
echo VITE_GEMINI_API_KEY=your_api_key_here > .env.local

# Run development server
npm run dev
```

## 📁 Project Structure
```
├── api/
│   └── gemini.ts          # Serverless function for Gemini API
├── src/
│   └── App.tsx            # Frontend (calls /api/gemini)
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies
```

## 🔒 Security Notes
- API keys are stored securely in Vercel environment variables
- No sensitive data is exposed to the client
- CORS is properly configured for production
