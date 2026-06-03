# Deployment Guide: MERN E-Commerce Store

## Prerequisites
- GitHub account with repository pushed
- MongoDB Atlas account
- Render account
- Vercel account

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
5. Save this connection string - you'll need it for Render

---

## Step 2: Deploy Backend to Render

### 2.1 Connect Repository to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect your GitHub account and select the repository
5. Choose the branch (usually `main` or `master`)

### 2.2 Configure Backend Service
- **Name**: `mern-ecommerce-backend`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.3 Set Environment Variables
In Render Dashboard, go to your service → Environment:

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/mern_ecommerce_store?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
```

**Note**: Replace placeholders with actual values:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Generate a strong random string
- `CLIENT_URL`: Your Vercel frontend URL (you'll get this in Step 4)

### 2.4 Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Once live, you'll get a URL like: `https://mern-ecommerce-backend.onrender.com`
- **Save this URL - you need it for frontend configuration**

### 2.5 Verify Backend
Test your backend API:
```bash
curl https://mern-ecommerce-backend.onrender.com/
```
You should see: `{"message":"MERN E-Commerce API is running"}`

---

## Step 3: Update Frontend Environment

1. Update `frontend/.env.local` or `frontend/.env`:
```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

Example:
```
VITE_API_URL=https://mern-ecommerce-backend.onrender.com/api
```

2. Commit and push to GitHub:
```bash
git add frontend/.env.local
git commit -m "Update API URL for Render backend"
git push
```

---

## Step 4: Deploy Frontend to Vercel

### 4.1 Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Connect your GitHub account and select the repository
5. Click "Import"

### 4.2 Configure Frontend
- **Framework Preset**: Select "Vite"
- **Root Directory**: Select `frontend`
- **Build Command**: `npm run build` (should auto-detect)
- **Output Directory**: `dist` (should auto-detect)

### 4.3 Set Environment Variables
In Vercel Project Settings → Environment Variables:

```
VITE_API_URL=https://your-render-backend-url.onrender.com/api
```

Example:
```
VITE_API_URL=https://mern-ecommerce-backend.onrender.com/api
```

### 4.4 Deploy
- Click "Deploy"
- Wait for build and deployment (2-5 minutes)
- You'll get a Vercel URL like: `https://your-project-name.vercel.app`

---

## Step 5: Update Backend with Frontend URL

1. Go back to Render Dashboard
2. Select your backend service
3. Go to Environment
4. Update `CLIENT_URL` to your Vercel URL:
```
CLIENT_URL=https://your-project-name.vercel.app
```

5. Trigger a manual deploy or wait for next deployment

---

## Step 6: Test End-to-End

1. Visit your Vercel frontend URL
2. Test all features:
   - Browse products
   - Add to cart
   - Create account / Login
   - Place order
3. Check browser console for any errors
4. Monitor Render logs for backend errors

---

## Troubleshooting

### Backend Won't Start
- Check Render logs: Render Dashboard → Your Service → Logs
- Verify MONGO_URI is correct
- Verify all environment variables are set

### Frontend Can't Connect to Backend
- Check VITE_API_URL in Vercel environment variables
- Check browser console (F12) for CORS errors
- Verify backend CLIENT_URL includes your Vercel URL
- Rebuild frontend on Vercel

### CORS Errors
- Verify `CLIENT_URL` on Render matches your Vercel URL
- Restart backend service on Render
- Check that backend has `credentials: true` in CORS config

### Slow First Request
- Render free tier spins down after 15 min of inactivity
- First request after inactivity takes 30-60 seconds
- This is normal behavior

---

## Monitoring & Maintenance

### View Logs
- **Render**: Dashboard → Your Service → Logs
- **Vercel**: Dashboard → Your Project → Deployments → Click deployment → Logs

### Auto-Deploy
Both Render and Vercel automatically redeploy when you push to your branch.

### Manual Redeploy
- **Render**: Dashboard → Your Service → Manual Deploy
- **Vercel**: Dashboard → Your Project → Deployments → Click "..." → Redeploy

---

## Next Steps

1. Set up a custom domain (optional)
2. Enable HTTPS (automatic on both platforms)
3. Set up error monitoring/alerting
4. Configure automated backups for MongoDB Atlas
5. Monitor performance and logs regularly

---

## Quick Reference

| Service | URL | Status |
|---------|-----|--------|
| Backend (Render) | https://mern-ecommerce-backend.onrender.com | ✅ |
| Frontend (Vercel) | https://your-project-name.vercel.app | ✅ |
| MongoDB Atlas | https://cloud.mongodb.com | ✅ |

