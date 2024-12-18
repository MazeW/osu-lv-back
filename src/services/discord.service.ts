import axios from 'axios';
import NodeCache from 'node-cache';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { DiscordUser } from '../types/discord';

const cache = new NodeCache({ stdTTL: config.cache.ttl });

export class DiscordService {
  private async getUser(userId: string): Promise<DiscordUser> {
    const cacheKey = `discord-user-${userId}`;
    const cached = cache.get<DiscordUser>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(`${config.discordApi.baseUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bot ${config.discordApi.botToken}`
        }
      });

      const userInfo = {
        username: response.data.username,
        name: response.data.global_name,
        id: userId,
        avatar: response.data.avatar
      };

      cache.set(cacheKey, userInfo);
      return userInfo;
    } catch (error) {
      logger.error(`Failed to fetch Discord user ${userId}:`, error);
      return { username: "", name: "", id: userId, avatar:"" }; // Fallback to ID if API call fails pls fix
    }
  }

  async getUsernames(userIds: string[]): Promise<Map<string, string>> { // refactor to return more info
    const userMap = new Map<string, string>();

    await Promise.all(
      userIds.map(async (id) => {
        const user: DiscordUser = await this.getUser(id);
        userMap.set(id, user.name);
      })
    );

    return userMap;
  }
}