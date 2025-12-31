# Deployment Setup Guide - Frontend + Backend on Render

## Overview
- **Frontend**: Hosted on Render (Expo Web app)
- **Backend**: Hosted on Render (Email server with Nodemailer)
- **Database**: MongoDB Atlas or your preferred database
- **Emails**: Gmail SMTP via Nodemailer

---

## Step 1: Deploy Backend Server to Render

### 1.1 Create a new Render service
1. Go to https://render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository (or paste the code)
4. Configure:
   - **Name**: `norkcraft-email-server` (or any name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node email-server.js`
   - **Port**: 3001

### 1.2 Add Environment Variables
In Render dashboard, go to "Environment" and add:
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password-16-chars
```

### 1.3 Deploy
Click "Deploy" and wait for it to complete. You'll get a URL like:
```
https://norkcraft-email-server.onrender.com
```

---

## Step 2: Update Frontend to Use Render Backend

### 2.1 Update `.env` in registration-app folder
Change this line from:
```
EXPO_PUBLIC_BACKEND_URL=http://localhost:3001
```

To:
```
EXPO_PUBLIC_BACKEND_URL=https://norkcraft-email-server.onrender.com
```

### 2.2 Deploy Frontend
If deploying to Render:
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `norkcraft-frontend`
   - **Runtime**: Node
   - **Build Command**: `cd registration-app && npm install`
   - **Start Command**: `cd registration-app && npx expo start --web --port 3000`
   - **Port**: 3000

---

## Step 3: Test the Connection

1. Navigate to your frontend URL on Render
2. Go to Sign Up page
3. Enter email and password
4. If email is received, everything is working!

---

## Important Notes

- **Keep EMAIL_PASSWORD secret**: Never commit it to GitHub. Use Render's environment variables.
- **CORS**: The email server has CORS enabled, so requests from any domain work.
- **Free Tier**: Render puts free apps to sleep after 15 minutes of inactivity. Upgrade to "Starter" plan ($7/month) for always-on service.

---

## Troubleshooting

**Email not sending?**
- Check EMAIL_USER and EMAIL_PASSWORD in Render environment variables
- Ensure Gmail app password has no spaces
- Check Render logs for errors

**Frontend can't reach backend?**
- Verify the `EXPO_PUBLIC_BACKEND_URL` is correct and has no typos
- Check browser console for CORS errors
- Ensure backend is deployed and running on Render

