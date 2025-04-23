import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { UserStats } from '../entities/UserStats';
import { logger } from '../utils/logger';
import { UserStatsData} from '../types/osu';
import { User } from '../entities/User';



export class UserStatsRepository {
  private repository: Repository<UserStats>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserStats);
  }

  async findAll(): Promise<UserStats[]> {
    return this.repository.find();
  }

  async upsert(stats: UserStatsData): Promise<UserStats> {
    try {
      const existingStats = await this.repository.findOne({
        where: { osuId: stats.osuId }
      });

      if (existingStats) {
        Object.assign(existingStats, stats);
        return this.repository.save(existingStats);
      }

      const newStats = this.repository.create(stats);
      return this.repository.save(newStats);
    } catch (error) {
      logger.error('Error upserting user stats:', error);
      throw new Error('Failed to upsert user stats');
    }
  }

  async findAllLV(): Promise<(UserStats & { discord?: string })[]> {
    return this.repository
      .createQueryBuilder('stats')
      .innerJoinAndMapOne(
        'stats.discord',
        User,
        'user',
        'user.osuId = stats.osuId'
      )
      .where('stats.country = :c', { c: 'LV' })
      .orderBy('stats.countryRank', 'ASC')
      .getMany();
  }
}