import axios from 'axios';
import { config } from '../config/config';
import { DiscordUser } from '../types/discord';

export class DiscordService {
  /**
   * 
   * @param userId - The ID of the user to fetch.
   * @returns {Promise<DiscordUser>} - A promise that resolves to a DiscordUser object containing username, name, id, and avatar.
   * @description Fetches a Discord user by their ID using the Discord API.
   */
  public async getUserById(userId: string): Promise<DiscordUser> {
    const response = await axios.get(`${config.discordApi.baseUrl}/users/${userId}`, {
      headers: {
        Authorization: `Bot ${config.discordApi.botToken}`
      }
    });
    if (response.status !== 200 || !response.data) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return {
      username: response.data.username,
      name: response.data.global_name,
      id: userId,
      avatar: response.data.avatar
        ? `https://cdn.discordapp.com/avatars/${userId}/${response.data.avatar}.${response.data.avatar.startsWith('a_') ? 'gif' : 'png'}` : '',
      global_name: response.data.global_name
    };
  }
}