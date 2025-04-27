export interface OsuUser {
    globalRank: number,
    countryRank: number,
    performancePoints: number,
    country: string,
    username: string,
    mode: string
  }
  
  export interface UserRanking  extends OsuUser{
    discord: any;
  }

  export interface UserStatsData extends OsuUser {
    osuId: string;
  }

  interface Mods {
    mods: string[];
}

export interface User {
    avatar_url: string;
    id: number;
    username: string;
}
