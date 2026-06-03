# 🚀 Deployment Checklist

## Pre-Deployment Setup
- [ ] MongoDB Atlas account created and cluster configured
- [ ] MongoDB connection string saved
- [ ] Generated strong JWT_SECRET
- [ ] GitHub repository with all code pushed

## Backend Deployment (Render)
- [ ] Created Render account at https://render.com
- [ ] Connected GitHub account to Render
- [ ] Created new Web Service from repository
- [ ] Set Root Directory to `backend`
- [ ] Configured environment variables:
  - [ ] `PORT=5000`
  - [ ] `NODE_ENV=production`
  - [ ] `MONGO_URI=<your_atlas_connection_string>`
  - [ ] `JWT_SECRET=<your_secret_key>`
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `CLIENT_URL=<placeholder_for_now>`
- [ ] Backend deployed and running
- [ ] Tested API at: `https://<your-backend>.onrender.com/`
- [ ] Saved backend URL (e.g., `https://mern-ecommerce-backend.onrender.com`)

## Frontend Deployment (Vercel)
- [ ] Created Vercel account at https://vercel.com
- [ ] Connected GitHub account to Vercel
- [ ] Created new project from repository
- [ ] Set Root Directory to `frontend`
- [ ] Set Build Command to `npm run build`
- [ ] Set Output Directory to `dist`
- [ ] Configured environment variables:
  - [ ] `VITE_API_URL=<your_render_backend_url>/api`
- [ ] Frontend deployed and running
- [ ] Saved frontend URL (e.g., `https://your-project.vercel.app`)

## Post-Deployment Configuration
- [ ] Updated Render backend `CLIENT_URL` to Vercel frontend URL
- [ ] Triggered Render redeploy

## Testing
- [ ] Backend API responds at root endpoint
- [ ] Frontend loads successfully
- [ ] Frontend connects to backend API
- [ ] Product listing works
- [ ] User authentication works
- [ ] Cart functionality works
- [ ] Order placement works
- [ ] No CORS errors in browser console

## Monitoring
- [ ] Set up log monitoring for Render
- [ ] Set up log monitoring for Vercel
- [ ] Tested database connection in production
- [ ] Verified all environment variables are correct

## Next Steps
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerting
- [ ] Create database backups plan
- [ ] Document deployment links
- [ ] Share access with team members if needed

## Useful Links
- Backend URL: `https://your-backend.onrender.com`
- Frontend URL: `https://your-frontend.vercel.app`
- Render Dashboard: https://dashboard.render.com/
- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://cloud.mongodb.com/

