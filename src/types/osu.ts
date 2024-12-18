export interface OsuUser {
    globalRank: number,
    countryRank: number,
    performancePoints: number,
    country: string,
    osuUsername: string
  }
  
  export interface UserRanking  extends OsuUser{
    discordUsername: string;
  }

  export interface UserStatsData extends OsuUser {
    osuId: string;
  }