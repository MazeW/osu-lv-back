import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { UserStats } from '../entities/UserStats';
import { config } from './config';
import { UserScore } from '../entities/UserScores';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, UserStats, UserScore],
  synchronize: true,
  logging: config.isDevelopment
});