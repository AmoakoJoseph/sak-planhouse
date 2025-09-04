# Vercel Deployment Guide - UPDATED

This application is now properly configured for deployment on Vercel with both frontend and backend support.

## What Was Fixed

1. **Client Build Process**: Added proper client package.json and build configuration
2. **File Copying**: Fixed build script to copy files to correct location
3. **Static Serving**: Updated server to serve files from root directory
4. **Vercel Configuration**: Simplified vercel.json to handle routing correctly

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm i -g vercel`

## Environment Variables

Create a `.env` file in your Vercel project with these variables:

```env
DATABASE_URL=your_supabase_database_connection_string
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NODE_ENV=production
```

## Deployment Steps

### Option 1: Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub/GitLab repository
   - Vercel will automatically detect the configuration

2. **Configure Project**:
   - Framework Preset: `Other`
   - Root Directory: `./` (root of the project)
   - Build Command: `npm run build:vercel`
   - Output Directory: `./`
   - Install Command: `npm install`

3. **Environment Variables**:
   - Add all required environment variables in the Vercel dashboard:
     - `DATABASE_URL`
     - `PAYSTACK_SECRET_KEY`
     - `NODE_ENV=production`

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

### Option 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## How It Works Now

### Build Process
1. **Client Build**: The `build:vercel` script builds the React app using Vite
2. **File Copy**: Built files are copied to the root directory for Vercel to serve
3. **Server Build**: Vercel builds the Node.js server as serverless functions

### Routing
- **API Routes** (`/api/*`): Handled by the Express server (serverless functions)
- **Static Files** (`/uploads/*`): Handled by the Express server
- **Frontend Routes** (`/*`): Served as static files, with React Router handling client-side routing

### File Structure After Build
```
/
├── index.html          # React app entry point
├── assets/            # Built JavaScript/CSS files
├── server/            # Server source code (built by Vercel)
├── shared/            # Shared schemas and types
├── vercel.json        # Vercel configuration
└── build-client.js    # Build script
```

## Build Scripts

The project now has these build scripts:

- `npm run build:vercel`: Builds client and prepares for Vercel deployment
- `npm run build:client`: Builds only the client
- `npm run build`: Builds both client and server for local deployment

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables are set correctly
   - Verify all dependencies are in `package.json`
   - Check build logs in Vercel dashboard

2. **Frontend Not Loading**:
   - Ensure `build:vercel` script ran successfully
   - Verify `index.html` exists in the root after build
   - Check Vercel build logs for client build errors

3. **API Routes Not Working**:
   - Ensure `DATABASE_URL` is set correctly
   - Check function logs for database connection errors
   - Verify database is accessible from Vercel's servers

4. **404 Errors**:
   - Check that the build process completed successfully
   - Verify all static files were copied to root
   - Check Vercel routing configuration

### Debug Mode

To enable debug logging, add this to your environment variables:
```env
DEBUG=*
NODE_ENV=development
```

## Performance Optimization

1. **Function Optimization**:
   - Keep functions lightweight
   - Use connection pooling for database connections
   - Implement proper caching strategies

2. **Frontend Optimization**:
   - Enable Vite's build optimizations
   - Use code splitting for better loading performance
   - Implement proper caching headers

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **CORS**: Configure CORS properly for production
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Input Validation**: Validate all user inputs on the server side

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Project Issues**: Check your repository's issue tracker

## Next Steps After Deployment

1. **Test the Application**: Verify all routes work correctly
2. **Check API Endpoints**: Test database connections and payment processing
3. **Monitor Performance**: Use Vercel analytics to monitor function performance
4. **Set Up Custom Domain**: Configure your custom domain if needed
