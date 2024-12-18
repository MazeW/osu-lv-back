import { UserRepository } from '../repositories/user.repository';
import { UserStatsRepository } from '../repositories/user-stats.repository';
import { OsuService } from './osu.service';
import { DiscordService } from './discord.service';
import { logger } from '../utils/logger';
import NodeCache from 'node-cache';
import { config } from '../config/config';
import { UserRanking } from '../types/osu';
import { UserStats } from '../entities/UserStats';

const CACHE_KEY = 'user-rankings';
const cache = new NodeCache({ stdTTL: config.cache.ttl });


export class RankingsService {
  private userRepository: UserRepository;
  private userStatsRepository: UserStatsRepository;
  private osuService: OsuService;
  private discordService: DiscordService;

  constructor() {
    this.userRepository = new UserRepository();
    this.userStatsRepository = new UserStatsRepository();
    this.osuService = new OsuService();
    this.discordService = new DiscordService();
  }

  async getUserRankings(): Promise<UserRanking[]> {
    try {
      // Check cache first
      const cachedRankings = cache.get<UserRanking[]>(CACHE_KEY);
      if (cachedRankings) {
        return cachedRankings;
      }

      const users = await this.userRepository.findAll();
      const rankings: UserRanking[] = [];

      // Get all stored stats first
      const storedStats = await this.userStatsRepository.findAll();
      const storedStatsMap = new Map(storedStats.map(stat => [stat.osuId, stat]));

      const discordIds = users.map(user => user.discordId);
      const discordUsernames = await this.discordService.getUsernames(discordIds);

      for (const user of users) {
        const storedStat = storedStatsMap.get(user.osuId);
        const shouldUpdateStats = !storedStat || 
          (Date.now() - storedStat.updatedAt.getTime() > config.cache.ttl * 1000);

        let stats;
        if (shouldUpdateStats) {
          stats = await this.osuService.getUserStats(user.osuId);
          if (stats.country === 'LV') {
            await this.userStatsRepository.upsert({
              osuId: user.osuId,
              globalRank: stats.globalRank,
              countryRank: stats.countryRank,
              performancePoints: stats.performancePoints,
              country: stats.country,
              osuUsername: stats.osuUsername
            });
          }
        } else {
          stats = storedStat;
        }

        if (stats.country === 'LV') { // we should only display people from LV, so if we have users from other countries in DB, skip them
          rankings.push({
            countryRank: stats.countryRank,
            osuUsername: stats.osuUsername,
            discordUsername: discordUsernames.get(user.discordId) || user.discordId,
            globalRank: stats.globalRank,
            performancePoints: stats.performancePoints,
            country: stats.country
          });
        }
      }

      const sortedRankings = rankings.sort((a, b) => a.countryRank - b.countryRank);
      
      // Cache the results
      cache.set(CACHE_KEY, sortedRankings);

      return sortedRankings;
    } catch (error) {
      logger.error('Error getting user rankings:', error);
      throw new Error('Failed to get user rankings');
    }
  }
}