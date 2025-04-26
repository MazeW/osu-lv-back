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

export interface Beatmap {
    beatmapset_id: number;
    difficulty_rating: number;
    id: number;
    mode: string;
    status: string;
    total_length: number;
    user_id: number;
    version: string;
    accuracy: number;
    ar: number;
    bpm: number;
    convert: boolean;
    count_circles: number;
    count_sliders: number;
    count_spinners: number;
    cs: number;
    deleted_at: null | string;
    drain: number;
    hit_length: number;
    is_scoreable: boolean;
    last_updated: string;
    mode_int: number;
    passcount: number;
    playcount: number;
    ranked: number;
    url: string;
    checksum: string;
}

export interface Beatmapset {
    artist: string;
    artist_unicode: string;
    creator: string;
    favourite_count: number;
    hype: null | any;
    id: number;
    nsfw: boolean;
    offset: number;
    play_count: number;
    preview_url: string;
    source: string;
    spotlight: boolean;
    status: string;
    title: string;
    title_unicode: string;
    track_id: null | any;
    user_id: number;
    video: boolean;
}

export interface Covers {
    cover: string;
}

export interface Score {
    accuracy: number;
    best_id: number;
    created_at: string;
    id: number;
    max_combo: number;
    mode: string;
    mode_int: number;
    passed: boolean;
    perfect: boolean;
    pp: number;
    rank: string;
    replay: boolean;
    score: number;
    type: string;
    user_id: number;
    mods: string[];
    user: User;
    beatmap: Beatmap;
    beatmapset: Beatmapset & { covers: Covers };
}

export interface Rankings {
    rankings: Score[];
}