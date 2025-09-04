// Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node';

// Import and configure the Express app for Vercel
import '../server/index.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set NODE_ENV to production for Vercel
  process.env.NODE_ENV = 'production';
  
  // Import the Express app dynamically
  const { default: app } = await import('../server/index.js');
  
  // Let Express handle the request
  return app(req, res);
}