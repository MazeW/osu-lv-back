import axios from 'axios';
import NodeCache from 'node-cache';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { OsuUser } from '../types/osu';

const cache = new NodeCache({ stdTTL: config.cache.ttl });

export class OsuService {
  private token: string | null = null;

  private async getToken(): Promise<string> {
    if (this.token) return this.token;

    try {
      const response = await axios.post('https://osu.ppy.sh/oauth/token', {
        client_id: config.osuApi.clientId,
        client_secret: config.osuApi.clientSecret,
        grant_type: 'client_credentials',
        scope: 'public'
      });

      this.token = response.data.access_token;
      return this.token!; // hopefully doesn't break xd
    } catch (error) {
      logger.error('Failed to get osu! API token:', error);
      throw new Error('Failed to authenticate with osu! API');
    }
  }

  async getUserStats(userId: string): Promise<OsuUser> {
    const cacheKey = `user-stats-${userId}`;
    const cached = cache.get<OsuUser>(cacheKey);
    if (cached) return cached;

    const token = await this.getToken();
    try {
      const response = await axios.get(`${config.osuApi.baseUrl}/users/${userId}/osu`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const stats: OsuUser = {
        globalRank: response.data.statistics.global_rank,
        countryRank: response.data.statistics.country_rank,
        performancePoints: response.data.statistics.pp,
        country: response.data.country.code,
        osuUsername: response.data.username
      };

      cache.set(cacheKey, stats);
      return stats;
    } catch (error) {
      logger.error(`Failed to fetch user stats for ${userId}:`, error);
      throw new Error('Failed to fetch user stats');
    }
  }
}