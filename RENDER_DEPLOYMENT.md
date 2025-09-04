# 🚀 Render Deployment Guide for SAK Planhouse

This guide will help you deploy your full-stack SAK Planhouse application to Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your environment variables

## 🏗️ Project Structure

Your project will be deployed as:
- **Web Service**: Express.js backend API
- **Static Site**: React frontend
- **PostgreSQL Database**: For data persistence

## 🔧 Environment Variables

### Backend (Web Service) Environment Variables:

```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@host:port/database
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
SESSION_SECRET=your_session_secret_here
```

### Frontend (Static Site) Environment Variables:

```bash
VITE_API_URL=https://your-backend-service.onrender.com
```

## 🚀 Deployment Steps

### Step 1: Create PostgreSQL Database

1. Go to your Render dashboard
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `sak-planhouse-db`
   - **Database**: `sakplanhouse`
   - **User**: `sakplanhouse_user`
   - **Plan**: Starter (Free tier available)
4. Click **"Create Database"**
5. Copy the **Internal Database URL** for later use

### Step 2: Deploy Backend (Web Service)

1. Go to your Render dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `sak-planhouse-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Starter (Free tier available)

5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your_postgresql_internal_url>
   PAYSTACK_SECRET_KEY=<your_paystack_secret_key>
   PAYSTACK_PUBLIC_KEY=<your_paystack_public_key>
   SESSION_SECRET=<generate_a_random_string>
   ```

6. Click **"Create Web Service"**

### Step 3: Deploy Frontend (Static Site)

1. Go to your Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure the site:
   - **Name**: `sak-planhouse-frontend`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
   - **Plan**: Starter (Free tier available)

5. **Environment Variables**:
   ```
   VITE_API_URL=https://sak-planhouse-api.onrender.com
   ```

6. Click **"Create Static Site"**

### Step 4: Update Backend URL in Frontend

After your backend is deployed, update the frontend environment variable:
1. Go to your Static Site settings
2. Update `VITE_API_URL` to your actual backend URL
3. Redeploy the frontend

## 🔄 Automatic Deployments

Both services are configured for automatic deployments:
- **Auto Deploy**: Enabled
- **Pull Request Previews**: Enabled for frontend
- **Branch**: `main` (or your default branch)

## 📁 File Structure for Render

```
sak-planhouse/
├── render.yaml                 # Render configuration
├── package.json               # Root package.json with build scripts
├── server/                    # Backend Express.js application
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Database operations
│   └── paystack.ts           # Payment integration
├── client/                    # Frontend React application
│   ├── package.json          # Client dependencies
│   ├── src/                  # React source code
│   └── dist/                 # Built frontend (generated)
├── shared/                    # Shared types and schemas
└── uploads/                   # File uploads directory
```

## 🛠️ Build Process

### Backend Build:
1. `npm install` - Install dependencies
2. `npm run build` - Build both client and server
3. `npm start` - Start the production server

### Frontend Build:
1. `cd client && npm install` - Install client dependencies
2. `npm run build` - Build React application
3. Output goes to `client/dist/`

## 🔍 Health Checks

Your backend includes health check endpoints:
- **Health Check**: `GET /api/health`
- **Test Endpoint**: `GET /api/test`

## 📊 Monitoring

Render provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, and response time monitoring
- **Alerts**: Email notifications for service issues

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correct
   - Check if database is running
   - Ensure database credentials are valid

3. **Frontend API Calls Failing**:
   - Verify `VITE_API_URL` points to correct backend
   - Check CORS settings in backend
   - Ensure backend is running and accessible

4. **File Upload Issues**:
   - Check if `uploads/` directory exists
   - Verify file permissions
   - Check file size limits

### Debug Commands:

```bash
# Check if backend is running
curl https://your-backend.onrender.com/api/health

# Check if frontend is accessible
curl https://your-frontend.onrender.com

# Test database connection
# (Check Render logs for database connection status)
```

## 💰 Pricing

### Free Tier Limits:
- **Web Service**: 750 hours/month (enough for small projects)
- **Static Site**: Unlimited
- **PostgreSQL**: 1GB storage, 1 month retention

### Paid Plans:
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: $85/month per service

## 🔐 Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Configure CORS properly for production
3. **HTTPS**: Render provides HTTPS by default
4. **Database**: Use strong passwords and limit access
5. **File Uploads**: Validate file types and sizes

## 📈 Scaling

As your application grows:
1. **Upgrade Database**: Move to paid PostgreSQL plan
2. **Scale Backend**: Upgrade to Standard or Pro plan
3. **CDN**: Use Render's CDN for static assets
4. **Monitoring**: Set up advanced monitoring and alerts

## 🆘 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **Status Page**: [status.render.com](https://status.render.com)

---

## 🎉 Success!

Once deployed, your application will be available at:
- **Frontend**: `https://sak-planhouse-frontend.onrender.com`
- **Backend API**: `https://sak-planhouse-api.onrender.com`

Your SAK Planhouse application is now live on Render! 🚀
