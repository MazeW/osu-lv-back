import axios from 'axios';
import NodeCache from 'node-cache';
import { config } from '../config/config';
import { OsuUser, Rankings } from '../types/osu';


export class OsuService {
  private token: string | null = null;
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: config.cache.ttl });
  }
  /**
   * Retrieves an access token from the osu! API.
   * If a token is already cached, it uses that instead.
   * @returns {Promise<string>} The access token.
   */
  private async getToken(): Promise<string> {
    const cachedToken = this.cache.get<string>('osu_token');
    if (cachedToken) {
      return cachedToken;
    }
    const response = await axios.post('https://osu.ppy.sh/oauth/token', {
      client_id: config.osuApi.clientId,
      client_secret: config.osuApi.clientSecret,
      grant_type: 'client_credentials',
      scope: 'public'
    });
    var token = response.data.access_token;
    if (!token || response.status !== 200) {
      throw new Error('Failed to retrieve access token');
    }
    this.cache.set('osu_token', token, response.data.expires_in);
    return token;

  }
  /**
   * Retrieves user statistics from the osu! API.
   * @param {string} userId - The ID of the user.
   * @param {string} mode - The game mode (default is "osu").
   * @returns {Promise<OsuUser>} The user statistics. Such as global rank, country rank, performance points, country, and username.
   */
  async getUserStats(userId: string, mode: string = "osu"): Promise<OsuUser> {

    const token = await this.getToken();
    const response = await axios.get(`${config.osuApi.baseUrl}/users/${userId}/${mode}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      globalRank: response.data.statistics.global_rank,
      countryRank: response.data.statistics.country_rank,
      performancePoints: response.data.statistics.pp,
      country: response.data.country.code,
      username: response.data.username
    };
  }

  /**
   * Retrieves user scores from the osu! API.
   * @param {string} userId - The ID of the user.
   * @param {string} type - The type of scores to retrieve (default is "best"). Possible values are "best", "recent" and "firsts"
   * @param {number} limit - The number of scores to retrieve (default is 5).
   * @param {number} offset - The offset for pagination (default is 0). Useful if you want to get outside of top 100 scores.
   * @param {string} mode - The game mode (default is "osu").
   * @description Retrieves user scores from the osu! API.
   * @returns {Promise<Rankings>} The user scores.
   */
  async getUserScores(userId: string, type: string = "best", limit: number = 5, offset: number = 0, mode: string = "osu"): Promise<Rankings> {
    const token = await this.getToken();
    const response = await axios.get(`${config.osuApi.baseUrl}/users/${userId}/scores/${type}?mode=${mode}&limit=${limit}&offset=${offset}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as Rankings;
  }
}