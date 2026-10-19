export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export type GameMode = 'classic' | 'one_token' | 'two_token' | 'pass_play' | 'practice';

export interface Token {
  id: number;
  color: PlayerColor;
  step: number; // -1 = In Base Yard; 0..50 = Common Track; 51..55 = Home Runway; 56 = Home Goal
  animating?: boolean;
  currentX?: number;
  currentY?: number;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  isBot: boolean;
  tokens: Token[];
  hasFinished: boolean;
  rank?: number;
}

export interface MoveOption {
  tokenId: number;
  fromStep: number;
  toStep: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  avatar: string;
  coins: number;
  wins: number;
  losses: number;
  level: number;
  xp: number;
}

export interface FreeAdClaim {
  adsWatched: number;
  requiredAds: number;
  cooldownExpiresAt: number;
  unlockedSession: boolean;
}
