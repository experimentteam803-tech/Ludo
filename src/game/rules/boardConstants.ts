import { PlayerColor } from '../../types/game';

// 52-cell main continuous loop
export const MAIN_BOARD_SIZE = 52;
export const HOME_CORRIDOR_LENGTH = 6;
export const FINAL_HOME_POSITION = 57;

// Entry coordinates on 0-51 shared path
export const START_POSITIONS: Record<PlayerColor, number> = {
  RED: 0,
  GREEN: 13,
  YELLOW: 26,
  BLUE: 39,
};

// Global star / safe cell positions
export const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47];

export const COLOR_ORDER: PlayerColor[] = ['RED', 'GREEN', 'YELLOW', 'BLUE'];

export const BOARD_COLORS: Record<PlayerColor, { primary: string; light: string; dark: string }> = {
  RED: { primary: '#d32f2f', light: '#ff6659', dark: '#9a0007' },
  GREEN: { primary: '#2e7d32', light: '#60ad5e', dark: '#005005' },
  YELLOW: { primary: '#fbc02d', light: '#fff263', dark: '#c49000' },
  BLUE: { primary: '#1976d2', light: '#63a4ff', dark: '#004ba0' },
};
