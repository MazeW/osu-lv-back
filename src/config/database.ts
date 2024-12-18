import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { UserStats } from '../entities/UserStats';
import { config } from './config';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User, UserStats],
  synchronize: true,
  logging: config.isDevelopment
});