import { VercelRequest, VercelResponse } from '@vercel/node';

// Import the configured Express app
import app from '../index.js';

const handler = (req: VercelRequest, res: VercelResponse) => {
  // Handle the request with Express
  return app(req, res);
};

export default handler;