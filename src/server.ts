import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/config';
import { AppDataSource } from './config/database';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import userRoutes from './routes/users.routes';
import { swaggerDocument } from './swagger/swagger';
import { logger } from './utils/logger';
import { RankingsService } from './services/rankings.service';
import { DailyStatsJob } from './jobs/DailyStatsUpdate';

const app = express();

app.use(express.json());
app.use(apiLimiter);
app.set('trust proxy', 1);
// API documentation
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.status(418).json({ "service running": true });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error('Error during Data Source initialization:', error);
    process.exit(1);
  });

  const rankingsService = new RankingsService();
  const dailyStatsJob = new DailyStatsJob(rankingsService);
  dailyStatsJob.start();