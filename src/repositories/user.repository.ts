import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { logger } from '../utils/logger';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async upsert(discordId: string, osuId: string): Promise<User> {
    try {
      const existingUser = await this.repository.findOne({
        where: [
          { discordId },
          { osuId }
        ]
      });

      if (existingUser) {
        existingUser.discordId = discordId;
        existingUser.osuId = osuId;
        return this.repository.save(existingUser);
      }

      const newUser = this.repository.create({
        discordId,
        osuId
      });

      return this.repository.save(newUser);
    } catch (error) {
      logger.error('Error upserting user:', error);
      throw new Error('Failed to upsert user');
    }
  }
}