// Vercel serverless function entry point
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index.js';

export default app;