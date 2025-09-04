# Complete Deployment Guide for SAK Planhouse (Netlify Functions)

This guide covers deploying your entire application (frontend + backend) on Netlify using Netlify Functions.

## 🚀 Quick Start

1. **Deploy to Netlify** - Everything runs on Netlify!
2. **Set Environment Variables** in Netlify dashboard
3. **Test your application**

## 🎯 What We've Built

✅ **Frontend**: React app with Vite  
✅ **Backend**: Express-like API converted to Netlify Functions  
✅ **Database**: PostgreSQL (Neon/Supabase)  
✅ **Payments**: Paystack integration  
✅ **File Downloads**: Complete download system  

## 📱 Deployment (Netlify - Everything in One Place!)

### 1. Connect Repository to Netlify
- Go to [Netlify](https://netlify.com)
- Click "New site from Git"
- Select your repository
- Build settings are auto-configured via `netlify.toml`

### 2. Set Environment Variables in Netlify
In your Netlify dashboard → Site settings → Environment variables:

```
DATABASE_URL=your_production_database_url
PAYSTACK_PUBLIC_KEY=pk_live_your_live_key
PAYSTACK_SECRET_KEY=sk_live_your_live_key
NODE_ENV=production
```

**Important**: 
- Use your **live Paystack keys** for production
- Update `DATABASE_URL` to your production database
- No need for `VITE_API_BASE_URL` - API calls go to same domain

## 🏗️ How It Works

### Frontend (React)
- Built with Vite
- Served as static files
- Makes API calls to `/api/*` endpoints

### Backend (Netlify Functions)
- **`/api/plans`** - Get all plans
- **`/api/plans/:id`** - Get specific plan
- **`/api/payments/initialize`** - Start payment
- **`/api/payments/verify/:reference`** - Verify payment
- **`/api/downloads/:orderId`** - Get download info

### Database
- PostgreSQL (Neon/Supabase)
- Stores users, plans, orders
- Handles authentication and file management

## 🔑 Paystack Integration

### Development
- Use test keys
- Test payments work
- Orders stored in database

### Production
- Get live keys from Paystack dashboard
- Update `PAYSTACK_PUBLIC_KEY` and `PAYSTACK_SECRET_KEY` in Netlify
- Test with real payments

## 📁 File Structure

```
Your Repository
├── client/                    ← React frontend
│   ├── src/                  ← Source code
│   └── dist/                 ← Built frontend (Netlify publishes this)
├── netlify/                  ← Netlify configuration
│   └── functions/            ← Backend functions
│       └── api.js            ← Main API handler
├── netlify.toml              ← Netlify config
└── package.json              ← Dependencies and scripts
```

## 🚨 Common Issues & Solutions

### Frontend Shows 404
- ✅ Check Netlify build logs
- ✅ Ensure `netlify.toml` is configured correctly
- ✅ Verify redirects are working

### API Calls Fail
- ✅ Check Netlify Functions logs
- ✅ Verify environment variables are set
- ✅ Ensure database connection works

### Payment Issues
- ✅ Verify Paystack keys are correct
- ✅ Check Netlify Functions logs
- ✅ Ensure callback URLs are correct

## 🔄 Deployment Workflow

1. **Make changes** to your code
2. **Push to GitHub** - triggers auto-deploy
3. **Netlify builds** frontend and deploys functions
4. **Test** your deployed application

## 📊 Monitoring

### Netlify Dashboard
- View build logs
- Check function logs
- Monitor performance
- View form submissions

## 🆘 Need Help?

1. **Check Netlify build logs** for frontend issues
2. **Check Netlify Functions logs** for backend issues
3. **Verify environment variables** are set correctly
4. **Test API endpoints** directly in browser

## 🎯 Next Steps

After successful deployment:
1. Test the complete payment flow
2. Verify file downloads work
3. Test user authentication
4. Monitor for any errors
5. Set up custom domain (optional)

## 🧪 Local Development

Run both frontend and backend locally:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (Netlify Functions)
npm run dev:netlify
```

---

**Benefits of Netlify Functions:**
- ✅ **Everything in one place** - No need for separate hosting
- ✅ **Automatic scaling** - Netlify handles infrastructure
- ✅ **Pay per use** - Only pay for function executions
- ✅ **Easy deployment** - Git push triggers everything
- ✅ **Built-in CDN** - Fast global delivery
