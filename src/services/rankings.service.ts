import { UserRepository } from '../repositories/user.repository';
import { UserStatsRepository } from '../repositories/user-stats.repository';
import { OsuService } from './osu.service';
import { DiscordService } from './discord.service';
import { logger } from '../utils/logger';
import { config } from '../config/config';
import { UserRanking } from '../types/osu';
import NodeCache from 'node-cache';

interface ProcessResult {
  success: boolean;
  errors: { osuId: string; step: string; message: string }[];
  deletedUsers: string[];
}

export class RankingsService {
  private userRepo = new UserRepository();
  private statsRepo = new UserStatsRepository();
  private osuSvc = new OsuService();
  private discordSvc = new DiscordService();
  private cache = new NodeCache({ stdTTL: config.cache.ttl });
  private delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  /**
   * Processes users by fetching their Discord and osu! stats, updating the database,
   * and handling errors.
   * @returns {Promise<ProcessResult>} The result of the processing, including success status,
   * any errors encountered, and a list of deleted users. Does not throw errors. (I hope)
   */
  async processUsers(): Promise<ProcessResult> {
    const errors: ProcessResult['errors'] = [];
    const deletedUsers: string[] = [];

    const users = await this.userRepo.findAll();
    for (const user of users) {

      if (user.deleted) {
        continue;
      }

      let discordUser;
      let retryCount = 0;

      while (true) {
        try {
          discordUser = await this.discordSvc.getUserById(user.discordId);

          const isDeleted =
            discordUser.username?.startsWith('deleted_user') &&
            discordUser.global_name === null;

          if (isDeleted) {
            await this.userRepo.markDeleted(user.osuId, true);
            deletedUsers.push(user.osuId);
            break;
          }

          await this.userRepo.upsertDiscordInfo(
            user.osuId,
            discordUser.name,
            discordUser.username,
            discordUser.avatar
          );
          break;

        } catch (err: any) {
          if (err.response?.status === 404) {
            await this.userRepo.markDeleted(user.osuId, true);
            deletedUsers.push(user.osuId);
            break;
          }

          if (err.response?.status === 429 && retryCount < 3) {
            const retryAfter = parseInt(err.response.headers['retry-after'], 10) || 1;
            const waitMs = retryAfter * 1000;
            logger.warn(`Rate limited. Retrying in ${waitMs}ms...`);
            await this.delay(waitMs);
            retryCount++;
            continue;
          }

          errors.push({
            osuId: user.osuId,
            step: 'discord',
            message: err.message
          });
          break;
        }
      }

      let stats;
      try {
        stats = await this.osuSvc.getUserStats(user.osuId);
        if (!stats) {
          throw new Error('No stats returned');
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          logger.warn(`osu! user ${user.osuId} is restricted (404)`);
          continue;
        }
        errors.push({
          osuId: user.osuId,
          step: 'osu',
          message: `[${err?.response?.status}] ${err.message}`
        });
        continue;
      }

      if ((stats.performancePoints ?? 0) <= 0) {
        continue;
      }

      try {
        await this.statsRepo.upsert({
          osuId: user.osuId,
          username: stats.username,
          globalRank: stats.globalRank ?? 0,
          countryRank: stats.countryRank ?? 0,
          performancePoints: stats.performancePoints ?? 0,
          country: stats.country,
          mode: 'osu' // todo: support other modes
        });
      } catch (err: any) {
        errors.push({
          osuId: user.osuId,
          step: 'stats-upsert',
          message: err.message
        });
      }
    }

    return {
      success: errors.length === 0,
      errors,
      deletedUsers
    };
  }
 // TODO: create an interface for the return value instead of any[]
  /**
   * Retrieves the top 50 rankings for users in Latvia (LV).
   * @returns {Promise<any[]>} An array of user rankings.
   * @description This method fetches user statistics from the database, filters out users with non-positive performance points,
   * sorts them by country rank, and returns the top 50 users along with their statistics and user information.
   * @throws {Error} If there is an error while fetching the rankings.
    */
  async getRankings(): Promise<any[]> {
    const cachedRankings = this.cache.get<any[]>('rankings');
    if (cachedRankings) {
      return cachedRankings;
    }
    const stats = await this.statsRepo.findAllLV();
    var rankings = stats
      .filter(s => s.performancePoints > 0)
      .sort((a, b) => a.countryRank - b.countryRank)
      .slice(0, 50)
      .map(s => ({
        stats: {
          countryRank: s.countryRank,
          globalRank: s.globalRank,
          performancePoints: s.performancePoints
        },
        user: {
          country: s.country,
          username: s.username,
          osuId: s.osuId,
          ...(s.discord ? {
            discordId: s.discord.discordId,
            deleted: s.discord.deleted,
            discordName: s.discord.discordName,
            discordUsername: s.discord.discordUsername,
            discordAvatar: s.discord.discordAvatar,
            createdAt: s.discord.createdAt,
            updatedAt: s.discord.updatedAt
          } : {})
        }
      }));
    this.cache.set('rankings', rankings, config.cache.ttl);
    return rankings;
  }
}
