import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { RankingsService } from '../services/rankings.service';
import { logger } from '../utils/logger';

export class UsersController {
  private static userRepository = new UserRepository();
  private static rankingsService = new RankingsService();

  static async upsertUsers(req: Request, res: Response) {
    try {
      const { users } = req.body;
      
      for (const userData of users) {
        await UsersController.userRepository.upsert(
          userData.discord_id,
          userData.osu_id
        );
      }

      return res.status(201).json({ message: 'Users updated successfully' });
    } catch (error) {
      logger.error('Error upserting users:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  static async getUserRankings(req: Request, res: Response) {
    try {
      const rankings = await UsersController.rankingsService.getUserRankings();
      return res.json({ rankings });
    } catch (error) {
      logger.error('Error fetching rankings:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
}