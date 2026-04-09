# Vercel Deployment Guide

I have prepared your project for deployment on Vercel. Both the React frontend and Express backend will be hosted together in a single Vercel project.

## Changes Made
- **`vercel.json`**: Created to route `/api/*` requests to the backend and all other requests to the frontend.
- **`api/index.js`**: Created as the entry point for Vercel's serverless functions.
- **`backend/server.js`**: Modified to export the Express app for Vercel.
- **`package.json`**: Updated root dependencies to ensure Vercel installs everything needed for the backend.

## Deployment Steps

### 1. Push to GitHub
If you haven't already, push your code to a GitHub repository.

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **"New Project"**.
3. Import your GitHub repository.

### 3. Configure Build Settings
Vercel should automatically detect most settings, but ensure they match:
- **Framework Preset:** Vite (or Other)
- **Build Command:** `npm run build`
- **Output Directory:** `frontend/dist`

### 4. Set Environment Variables
In the Vercel project settings, add the following Environment Variables:
- `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
- `NODE_ENV`: `production`

### 5. Deploy
Click **"Deploy"**. Vercel will install dependencies, build the frontend, and set up the backend as a serverless function.

## Post-Deployment Check
Once deployed, your website will be live.
- Frontend: `https://your-project-name.vercel.app/`
- Backend API: `https://your-project-name.vercel.app/api`

> [!IMPORTANT]
> Ensure your MongoDB database allows connections from Vercel's IP addresses (usually by allowing all IPs `0.0.0.0/0` in MongoDB Atlas Network Access).
