import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  isDevelopment: process.env.NODE_ENV !== 'production',
  auth: {
    users: { [process.env.AUTH_USERNAME || 'admin']: process.env.AUTH_PASSWORD || 'p455w0rd' }
  },
  osuApi: {
    clientId: process.env.OSU_CLIENT_ID || '',
    clientSecret: process.env.OSU_CLIENT_SECRET || '',
    baseUrl: 'https://osu.ppy.sh/api/v2'
  },
  discordApi: {
    botToken: process.env.DISCORD_BOT_TOKEN || '',
    baseUrl: 'https://discord.com/api/v10'
  },
  cache: {
    ttl: (process.env.NODE_ENV == 'production') ? 5 * 60 * 60 : 60*15 // 5 hours cache for prod and 15 min. for dev
  }
};