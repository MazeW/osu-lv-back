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

  async findByOsuId(osuId: string): Promise<User | null> {
    return this.repository.findOne({ where: { osuId } });
  }
  
  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async upsert(
    discordId: string,
    osuId: string,
    discordName: string | null = null,
    discordUsername: string | null = null,
    discordAvatar: string | null = null
  ): Promise<User> {
    try {
      let user = await this.repository.findOne({ where: [{ discordId }, { osuId }] });
  
      if (user) {
        user.discordId = discordId;
        user.discordName = discordName;
        user.discordUsername = discordUsername;
        user.discordAvatar = discordAvatar;
        return this.repository.save(user);
      }
  
      user = this.repository.create({
        discordId,
        osuId,
        discordName,
        discordUsername,
        deleted: false
      });
  
      return this.repository.save(user);
    } catch (error) {
      logger.error('Error upserting user:', error);
      throw new Error('Failed to upsert user');
    }
  }

  async upsertDiscordInfo(
    osuId: string,
    discordName: string | null,
    discordUsername: string | null,
    discordAvatar: string | null = null
  ): Promise<User> {
    const user = await this.repository.findOneBy({ osuId });
    if (!user) throw new Error(`User ${osuId} not found`);
    user.discordName = discordName;
    user.discordUsername = discordUsername;
    user.discordAvatar = discordAvatar;
    return this.repository.save(user);
  }

  async markDeleted(osuId: string, deleted: boolean): Promise<void> {
    await this.repository.update({ osuId }, { deleted });
  }
}