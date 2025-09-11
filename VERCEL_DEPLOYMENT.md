# Vercel Monorepo Deployment Guide

This SAK Constructions application is configured as a **monorepo** with separate **client** and **server** deployments on Vercel for optimal performance and maintainability.

## 🏗️ Project Structure

```
sak-constructions/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.ts
├── server/                 # Backend (Express + Node.js)
│   ├── index.ts
│   ├── routes.ts
│   ├── package.json
│   ├── vercel.json
│   └── tsconfig.json
├── shared/                 # Shared schemas and types
│   └── schema.ts
└── README.md
```

## 🚀 Deployment Strategy

This project uses **separate Vercel projects** for frontend and backend:

- **Frontend**: Static React app deployed from `client/` folder
- **Backend**: Serverless functions deployed from `server/` folder
- **Benefits**: Faster builds, better isolation, independent scaling

## ⚠️ **CRITICAL: File Storage Requirements**

**This application currently uses local file storage which WILL NOT WORK on Vercel's ephemeral filesystem.**

### Before Production Deployment:
1. **Replace local uploads with cloud storage**:
   - **Recommended**: Supabase Storage (integrates well with PostgreSQL)
   - **Alternatives**: AWS S3, Cloudinary, Uploadcare
   
2. **Update file handling code**:
   - Replace `multer` local storage with cloud storage APIs
   - Generate signed URLs for file access
   - Update all file upload/download logic

3. **Environment Variables** (for cloud storage):
   ```env
   # Example for Supabase Storage
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```

**Without this change, file uploads/downloads will fail in production.**

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Project hosted on GitHub/GitLab
3. **Environment Variables**: Database and payment credentials

## 🔧 Environment Variables

### Frontend (.env in client/)
```env
VITE_API_URL=https://your-backend.vercel.app
```

### Backend (.env in server/)
```env
DATABASE_URL=your_postgresql_connection_string
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

## 📦 Deployment Steps

### Step 1: Deploy Backend (API)

1. **Create New Project** in Vercel Dashboard
2. **Import Repository** and configure:
   - **Project Name**: `sak-constructions-backend`
   - **Framework Preset**: `Other`
   - **Root Directory**: `server`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.`
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - `DATABASE_URL`
   - `PAYSTACK_SECRET_KEY`
   - `PAYSTACK_PUBLIC_KEY`
   - `SESSION_SECRET`
   - `NODE_ENV=production`

4. **Deploy** and copy the deployment URL

### Step 2: Deploy Frontend

1. **Create New Project** in Vercel Dashboard
2. **Import Repository** and configure:
   - **Project Name**: `sak-constructions-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - `VITE_API_URL=https://your-backend-url.vercel.app`

4. **Deploy**

### Step 3: Configure CORS (if needed)

If frontend and backend are on different domains, update `server/index.ts`:

```typescript
app.use(cors({
  origin: ['https://your-frontend.vercel.app'],
  credentials: true
}));
```

## 🛠️ Local Development

### Start Backend
```bash
cd server
npm install
npm run dev
```

### Start Frontend
```bash
cd client
npm install
npm run dev
```

### Full Stack Development
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend  
cd client && npm run dev
```

## 🔍 Monitoring & Testing

### Health Checks
- **Backend**: `https://your-backend.vercel.app/api/test`
- **Frontend**: Check if React app loads correctly

### Common Endpoints
- **API Base**: `https://your-backend.vercel.app/api`
- **Authentication**: `/api/auth/signin`, `/api/auth/signup`
- **Plans**: `/api/plans`
- **Admin**: `/api/admin/*` (protected)

## 🐛 Troubleshooting

### Build Failures

**Client Build Issues**:
- Check if all dependencies are in `client/package.json`
- Verify Vite configuration
- Check for TypeScript errors

**Server Build Issues**:
- Ensure all imports use `.js` extensions for ESM
- Check TypeScript configuration
- Verify environment variables are set

### Runtime Errors

**CORS Issues**:
```typescript
// In server/index.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

**Database Connection**:
- Verify `DATABASE_URL` is correct
- Check if database accepts connections from Vercel IPs
- Test connection with database client

**Session Issues**:
- Set secure session configuration for production
- Use database-backed session store for persistence

## 🔒 Security Considerations

### Production Security
1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Configure specific origins, not wildcards
3. **Session Secret**: Use strong, random session secret
4. **Rate Limiting**: Implement for API endpoints
5. **Input Validation**: Validate all user inputs

### Database Security
- Use connection pooling
- Implement query parameterization
- Regular security updates

## 🚀 Performance Optimization

### Frontend
- Enable Vite optimizations
- Use lazy loading for routes
- Optimize image sizes and formats
- Implement service worker for caching

### Backend
- Use database connection pooling
- Implement API response caching
- Optimize database queries
- Use CDN for static assets

## 📊 Monitoring

### Vercel Analytics
- Enable Web Analytics in Vercel dashboard
- Monitor function execution times
- Track build performance

### Error Tracking
- Implement error logging
- Monitor API response times
- Track user interactions

## 🔄 CI/CD Pipeline

### Automatic Deployments
- **Production**: Deploys on push to `main` branch
- **Preview**: Deploys on pull requests
- **Development**: Manual deployments

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request → triggers preview deployment
# Merge to main → triggers production deployment
```

## 📞 Support

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)
- [Express Docs](https://expressjs.com)

### Common Commands
```bash
# Local development
npm run dev                 # Start dev servers

# Building
npm run build              # Build for production
npm run preview            # Preview production build

# Database
npm run db:push            # Sync database schema
```

---

## 📝 Quick Reference

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | `https://your-app.vercel.app` | React application |
| Backend API | `https://your-api.vercel.app/api` | REST API endpoints |
| Admin Panel | `https://your-app.vercel.app/admin` | Admin interface |
| Database | PostgreSQL URL | Data storage |

**Last Updated**: December 2024  
**Architecture**: Monorepo with separate deployments  
**Framework**: React + Express + PostgreSQL