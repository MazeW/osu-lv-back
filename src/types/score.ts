interface Statistics {
    count_100: number;
    count_300: number;
    count_50: number;
    count_geki: number | null;
    count_katu: number | null;
    count_miss: number;
}

interface CurrentUserAttributes {
    pin: string | null;
}

interface Beatmap {
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
    deleted_at: string | null;
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

interface Covers {
    cover: string;
    'cover@2x': string;
    card: string;
    'card@2x': string;
    list: string;
    'list@2x': string;
    slimcover: string;
    'slimcover@2x': string;
}

interface Beatmapset {
    artist: string;
    artist_unicode: string;
    covers: Covers;
    creator: string;
    favourite_count: number;
    hype: number | null;
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
    track_id: number | null;
    user_id: number;
    video: boolean;
}

interface User {
    avatar_url: string;
    country_code: string;
    default_group: string;
    id: number;
    is_active: boolean;
    is_bot: boolean;
    is_deleted: boolean;
    is_online: boolean;
    is_supporter: boolean;
    last_visit: string;
    pm_friends_only: boolean;
    profile_colour: string | null;
    username: string;
}

interface Weight {
    percentage: number;
    pp: number;
}

export interface Score {
    accuracy: number;
    best_id: number;
    created_at: string;
    id: number;
    max_combo: number;
    mode: string;
    mode_int: number;
    mods: string[];
    passed: boolean;
    perfect: boolean;
    pp: number;
    rank: string;
    replay: boolean;
    score: number;
    statistics: Statistics;
    type: string;
    user_id: number;
    current_user_attributes: CurrentUserAttributes;
    beatmap: Beatmap;
    beatmapset: Beatmapset;
    user: User;
    weight: Weight;
}
