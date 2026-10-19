import { PlayerColor } from '../../types';

// 52-cell primary clockwise track coordinate mapping [row, col] on a 15x15 matrix
export const TRACK_MATRIX: [number, number][] = [
  /* Red Arm */
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8],
  /* Green Arm */
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14],
  /* Yellow Arm */
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6],
  /* Blue Arm */
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0],
  [6, 0]
];

// Start cell on the 52-cell track for each color
export const COLOR_START_INDICES: Record<PlayerColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39
};

// 8 Safe star cell indices on the global common track
export const SAFE_STAR_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Dedicated 5-step home paths before reaching goal
export const HOME_PATHS_MATRIX: Record<PlayerColor, [number, number][]> = {
  red:    [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green:  [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue:   [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
};

// Center home triangle target coordinates
export const GOAL_MATRIX: Record<PlayerColor, [number, number]> = {
  red:    [7, 6],
  green:  [6, 7],
  yellow: [7, 8],
  blue:   [8, 7]
};

// Base yard slots for each player
export const YARD_SLOTS: Record<PlayerColor, [number, number][]> = {
  red:    [[2, 2], [2, 3], [3, 2], [3, 3]],
  green:  [[2, 11], [2, 12], [3, 11], [3, 12]],
  yellow: [[11, 11], [11, 12], [12, 11], [12, 12]],
  blue:   [[11, 2], [11, 3], [12, 2], [12, 3]]
};

export class BoardGeometry {
  public canvasSize: number;
  public cellSize: number;

  constructor(size: number = 600) {
    this.canvasSize = size;
    this.cellSize = size / 15;
  }

  public resize(size: number) {
    this.canvasSize = size;
    this.cellSize = size / 15;
  }

  public gridToPixel(row: number, col: number): { x: number; y: number } {
    return {
      x: col * this.cellSize + this.cellSize / 2,
      y: row * this.cellSize + this.cellSize / 2
    };
  }

  public getTokenPixelCoords(color: PlayerColor, tokenId: number, step: number): { x: number; y: number } {
    if (step === -1) {
      const slot = YARD_SLOTS[color][tokenId] || [2, 2];
      return this.gridToPixel(slot[0], slot[1]);
    }
    if (step >= 0 && step <= 50) {
      const globalIdx = (COLOR_START_INDICES[color] + step) % 52;
      const cell = TRACK_MATRIX[globalIdx];
      return this.gridToPixel(cell[0], cell[1]);
    }
    if (step >= 51 && step <= 55) {
      const homeStep = step - 51;
      const cell = HOME_PATHS_MATRIX[color][homeStep];
      return this.gridToPixel(cell[0], cell[1]);
    }
    // Reached Goal Step 56
    const goal = GOAL_MATRIX[color];
    return this.gridToPixel(goal[0], goal[1]);
  }
}
