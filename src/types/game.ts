export type PlayerColor = 'RED' | 'GREEN' | 'YELLOW' | 'BLUE';

export type GameMode = 'CLASSIC' | 'ONE_GOTI' | 'TWO_GOTI' | 'PASS_AND_PLAY' | 'VS_COMPUTER';

export interface Token {
  id: number;
  color: PlayerColor;
  stepPosition: number; // -1 for Base, 0..50 for Main Track, 51..56 for Home Corridor, 57 for Home
  isFinished: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  tokens: Token[];
  isAi: boolean;
  avatarUrl?: string;
}

export interface GameState {
  mode: GameMode;
  players: Player[];
  activePlayerIndex: number;
  diceValue: number | null;
  hasRolled: boolean;
  canRoll: boolean;
  validTokenMoves: number[];
  winner: Player | null;
  isGameOver: boolean;
  entryFee: number;
  prizePool: number;
}
