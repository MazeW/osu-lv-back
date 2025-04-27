import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { UserScore } from '../entities/UserScores';
import { User } from '../entities/User';
import { logger } from '../utils/logger';


export class UserScoreRepository {
    private repository: Repository<UserScore>;

    constructor() {
        this.repository = AppDataSource.getRepository(UserScore);
    }

    async insert(data: Partial<UserScore>) {
        const existingScore = await this.repository.findOne({
            where: { id: data.id }
          });
        if (existingScore) {
            logger.debug(`UserScore with id ${data.id} already exists. Skipping insert.`);
            return existingScore;
        }
        const userScore = this.repository.create(data);
        return await this.repository.save(userScore);
    }

    async topScores(mode: string) {
        return await this.repository
          .createQueryBuilder('user_scores')
          .innerJoinAndMapOne('user_scores.user', User, 'user', 'user_scores.userId = user.osuId')
          .where('user_scores.mode = :mode', { mode })
          .orderBy('user_scores.pp', 'DESC')
          .limit(50)
          .getMany();
      }
}