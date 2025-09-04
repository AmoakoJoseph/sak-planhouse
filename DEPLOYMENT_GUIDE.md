# Complete Deployment Guide for SAK Planhouse

This guide covers deploying both the frontend (Netlify) and backend (Railway/Render) to make your application fully functional.

## 🚀 Quick Start

1. **Deploy Backend First** (Railway/Render)
2. **Deploy Frontend** (Netlify) 
3. **Connect Them** via environment variables

## 📱 Frontend Deployment (Netlify)

### 1. Connect Repository to Netlify
- Go to [Netlify](https://netlify.com)
- Click "New site from Git"
- Select your repository
- Build settings are auto-configured via `netlify.toml`
- **Note**: Netlify will only build the client (frontend) part

### 2. Set Environment Variables in Netlify
In your Netlify dashboard → Site settings → Environment variables:

```
VITE_API_BASE_URL=https://your-backend-url.railway.app
```

**Important**: Replace `your-backend-url.railway.app` with your actual backend URL after deployment.

## 🖥️ Backend Deployment (Railway - Recommended)

### 1. Prepare Backend
Your backend is already configured with:
- ✅ `railway.json` - Railway deployment config
- ✅ `package.json` - Build and start scripts
- ✅ `dist/` - Built server files

### 2. Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect it's a Node.js app

### 3. Set Environment Variables in Railway
In Railway dashboard → Variables tab:

```
DATABASE_URL=your_production_database_url
PAYSTACK_PUBLIC_KEY=pk_live_your_live_key
PAYSTACK_SECRET_KEY=sk_live_your_live_key
SESSION_SECRET=your_strong_random_secret
NODE_ENV=production
```

### 4. Get Your Backend URL
After deployment, Railway will give you a URL like:
`https://your-app-name-production.up.railway.app`

## 🔗 Connect Frontend to Backend

1. **Copy your backend URL** from Railway
2. **Go to Netlify** → Site settings → Environment variables
3. **Set**: `VITE_API_BASE_URL=https://your-backend-url.railway.app`
4. **Redeploy** your Netlify site

## 🗄️ Database Setup

### Option A: Use Your Current Database
If you're using Neon or Supabase, just update the `DATABASE_URL` in Railway.

### Option B: Create New Production Database
1. Create new database on Neon/Supabase
2. Update `DATABASE_URL` in Railway
3. Run migrations: `npm run db:push`

## 🔑 Paystack Keys

### Development (Current)
- Use test keys for development
- Orders stored in database
- Test payments work

### Production
- Get live keys from Paystack dashboard
- Update `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` in Railway
- Update `PAYSTACK_PUBLIC_KEY` in Netlify (if needed)

## 📁 File Structure After Deployment

```
Your Repository
├── client/dist/          ← Netlify publishes this
├── dist/                 ← Railway deploys this
├── netlify.toml         ← Netlify config
├── railway.json         ← Railway config
└── package.json         ← Build scripts
```

## 🚨 Common Issues & Solutions

### Frontend Shows 404
- ✅ Check `VITE_API_BASE_URL` is set correctly in Netlify
- ✅ Ensure backend is running and accessible
- ✅ Check browser console for API errors

### Backend API Calls Fail
- ✅ Verify environment variables in Railway
- ✅ Check Railway logs for errors
- ✅ Ensure database connection works

### Payment Issues
- ✅ Verify Paystack keys are correct
- ✅ Check backend logs for payment errors
- ✅ Ensure callback URLs are correct

## 🔄 Deployment Workflow

1. **Make changes** to your code
2. **Push to GitHub** - triggers auto-deploy
3. **Railway** builds and deploys backend (runs `npm run build:server`)
4. **Netlify** builds and deploys frontend (runs `npm run build:client`)
5. **Test** your deployed application

**Note**: 
- **Railway** runs the full build (`npm run build`) for backend deployment
- **Netlify** runs only client build (`npm run build:client`) for frontend deployment

## 📊 Monitoring

### Railway
- View logs in Railway dashboard
- Monitor resource usage
- Check deployment status

### Netlify
- View build logs
- Check form submissions
- Monitor performance

## 🆘 Need Help?

1. **Check logs** in both Railway and Netlify
2. **Verify environment variables** are set correctly
3. **Test API endpoints** directly (e.g., `curl https://your-backend.railway.app/api/plans`)
4. **Check database connection** in Railway logs

## 🎯 Next Steps

After successful deployment:
1. Test the complete payment flow
2. Verify file downloads work
3. Test user authentication
4. Monitor for any errors
5. Set up custom domain (optional)

---

**Remember**: Your frontend needs the backend running to work. Always deploy backend first, then frontend, and ensure they're connected via `VITE_API_BASE_URL`.
