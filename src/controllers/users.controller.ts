import { Request, Response } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { RankingsService } from '../services/rankings.service';
import { OsuService } from '../services/osu.service';
import { DiscordService } from '../services/discord.service';
import { logger } from '../utils/logger';

export class UsersController {
  private static userRepository = new UserRepository();
  private static rankingsService = new RankingsService();
  private static osuService = new OsuService();
  private static discordService = new DiscordService();
  private static isSyncing = false;

  static async upsertUsers(req: Request, res: Response) {
    try {
      const { users } = req.body;

      for (const userData of users) {
        const existingUser = await UsersController.userRepository.findByOsuId(userData.osu_id);

        if (existingUser) {
          existingUser.discordId = userData.discord_id;
          await UsersController.userRepository.save(existingUser);
        } else {
          await UsersController.userRepository.upsert(
            userData.discord_id,
            userData.osu_id
          );
        }
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
      const rankings = await UsersController.rankingsService.getRankings();
      return res.json({ rankings });
    } catch (error) {
      logger.error('Error fetching rankings:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  static async triggerSync(req: Request, res: Response) {
    if (UsersController.isSyncing) {
      return res.status(429).json({ message: 'Sync already in progress' });
    }

    UsersController.isSyncing = true;
    res.status(202).json({ message: 'Sync started' });

    try {
      await UsersController.rankingsService.processUsers();
    } catch (error) {
      logger.error('Error during sync:', error);
    } finally {
      UsersController.isSyncing = false;
    }
  }

}