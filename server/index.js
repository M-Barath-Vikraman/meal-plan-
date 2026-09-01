import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import custom middleware
import loggerMiddleware from './middleware/loggerMiddleware.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

// Import route modules
import healthRoutes from './routes/healthRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import googleRoutes from './routes/googleRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser and logging middleware
app.use(express.json());
app.use(loggerMiddleware);

// API Route mounts
app.use('/api/health', healthRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/plans', mealPlanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/google', googleRoutes);

// Catch-all for unknown /api/* endpoints (returns JSON 404)
app.use('/api', notFoundHandler);

// Production Static File Serving & SPA Fallback for React Frontend
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Serve React index.html for any non-API GET request (client-side routing fallback)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send('SmartMeal API Server is running. Run `npm run build` to serve production React frontend.');
      }
    });
  }
  next();
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 SmartMeal Express API Server running on port ${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});
