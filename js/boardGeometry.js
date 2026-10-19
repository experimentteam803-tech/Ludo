(function (exports) {
  'use strict';

  const TRACK_MATRIX = [
    [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
    [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
    [0, 7],
    [0, 8],
    [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
    [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
    [7, 14],
    [8, 14],
    [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
    [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
    [14, 7],
    [14, 6],
    [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
    [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
    [7, 0],
    [6, 0]
  ];

  const HOME_PATHS_MATRIX = {
    red:    [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
    green:  [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
    yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
    blue:   [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
  };

  const GOAL_MATRIX = {
    red:    [7, 6],
    green:  [6, 7],
    yellow: [7, 8],
    blue:   [8, 7]
  };

  const YARD_MATRIX = {
    red:    [[2, 2], [2, 3], [3, 2], [3, 3]],
    green:  [[2, 11], [2, 12], [3, 11], [3, 12]],
    yellow: [[11, 11], [11, 12], [12, 11], [12, 12]],
    blue:   [[11, 2], [11, 3], [12, 2], [12, 3]]
  };

  class BoardGeometry {
    constructor(canvasSize = 600) {
      this.resize(canvasSize);
    }

    resize(size) {
      this.canvasSize = size;
      this.cellSize = size / 15;
    }

    gridToPixel(row, col) {
      return {
        x: col * this.cellSize + this.cellSize / 2,
        y: row * this.cellSize + this.cellSize / 2
      };
    }

    getTokenPixelCoordinates(color, tokenId, step) {
      if (step === -1) {
        const slot = YARD_MATRIX[color][tokenId];
        return this.gridToPixel(slot[0], slot[1]);
      }
      if (step >= 0 && step <= 50) {
        const globalIdx = (LudoRules.BOARD_PATHS.START_TILES[color] + step) % 52;
        const cell = TRACK_MATRIX[globalIdx];
        return this.gridToPixel(cell[0], cell[1]);
      }
      if (step >= 51 && step <= 55) {
        const homeIdx = step - 51;
        const cell = HOME_PATHS_MATRIX[color][homeIdx];
        return this.gridToPixel(cell[0], cell[1]);
      }
      const goal = GOAL_MATRIX[color];
      return this.gridToPixel(goal[0], goal[1]);
    }
  }

  exports.BoardGeometry = BoardGeometry;
  exports.TRACK_MATRIX = TRACK_MATRIX;
})(typeof exports === 'undefined' ? (this.LudoGeometry = {}) : exports);
