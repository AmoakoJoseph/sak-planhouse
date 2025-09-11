import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register all routes
registerRoutes(app).then(() => {
  console.log('Routes registered successfully');
}).catch((error) => {
  console.error('Error registering routes:', error);
});

// Add a simple health check for the API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;


