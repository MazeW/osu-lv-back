import { CronJob } from 'cron';
import { RankingsService } from '../services/rankings.service';
import { logger } from '../utils/logger';

export class DailyStatsJob {
  private job: CronJob;

  constructor(private rankingsService: RankingsService) {
    // Run at 3 AM every day
    this.job = new CronJob('0 3 * * *', this.execute.bind(this));
  }

  private async execute(): Promise<void> {
    try {
      logger.info('Daily stats job started');
      var resullt = await this.rankingsService.processUsers();
      logger.info(`Daily stats job completed. ${JSON.stringify(resullt)}`);
    } catch (error) {
      logger.error('Error in daily stats job:', error);
    }
  }

  start(): void {
    this.job.start();
    logger.info('Daily stats job scheduled');
  }

  stop(): void {
    this.job.stop();
    logger.info('Daily stats job stopped');
  }
}