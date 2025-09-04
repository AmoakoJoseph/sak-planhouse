# Netlify Deployment Guide

## Prerequisites
- Netlify account
- Your project connected to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Your Repository
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose your Git provider and select your repository
4. Configure the build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
   - **Base directory**: Leave empty (or set to root if needed)

### 2. Environment Variables
Set these environment variables in Netlify dashboard (Site settings > Environment variables):

```
NODE_ENV=production
VITE_API_BASE_URL=https://your-backend-api.com
```

**Note**: For client-side environment variables, prefix them with `VITE_` so they're accessible in the browser.

### 3. Build Settings
The `netlify.toml` file is already configured with:
- Build command: `npm run build`
- Publish directory: `client/dist`
- Client-side routing redirects
- Security headers
- Caching strategies

### 4. Deploy
1. Push your changes to your Git repository
2. Netlify will automatically trigger a new build
3. Check the build logs for any errors
4. Your site will be available at the provided Netlify URL

## Important Notes

### Backend API
- Your Express.js backend needs to be hosted separately (e.g., on Railway, Render, or Heroku)
- Update the `VITE_API_BASE_URL` environment variable to point to your backend
- Ensure CORS is configured on your backend to allow requests from your Netlify domain

### Database
- Your PostgreSQL database should be accessible from your backend hosting
- Update the `DATABASE_URL` environment variable on your backend

### File Uploads
- The current setup stores files locally on the server
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- Update the file upload paths accordingly

## Troubleshooting

### 404 Errors
- Ensure the `_redirects` file is in the `client/public` directory
- Check that the `netlify.toml` redirects are correct
- Verify the build output directory matches the publish directory

### Build Failures
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Environment Variables
- Remember to prefix client-side variables with `VITE_`
- Check that all required variables are set
- Verify the variable names match your code

## Custom Domain
1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS records as instructed by Netlify
4. Enable HTTPS (automatic with Netlify)
