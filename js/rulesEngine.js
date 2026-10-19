(function (exports) {
  'use strict';

  const BOARD_PATHS = {
    START_TILES: { red: 0, green: 13, yellow: 26, blue: 39 },
    TURN_TILES: { red: 50, green: 11, yellow: 24, blue: 37 },
    SAFE_STAR_INDICES: [0, 8, 13, 21, 26, 34, 39, 47]
  };

  class RulesEngine {
    constructor(config = {}) {
      this.mode = config.mode || 'classic'; // 'classic', 'one_token', 'two_token'
      this.tokensPerPlayer = this.getTokensPerMode(this.mode);
    }

    getTokensPerMode(mode) {
      switch (mode) {
        case 'one_token': return 1;
        case 'two_token': return 2;
        case 'classic':
        default: return 4;
      }
    }

    isValidMove(token, dice) {
      if (token.step === 56) return false;
      if (token.step === -1) return dice === 6;
      if (token.step + dice > 56) return false;
      return true;
    }

    computeDestination(token, dice) {
      if (token.step === -1 && dice === 6) {
        return { step: 0, enteredHome: false };
      }
      const nextStep = token.step + dice;
      return {
        step: nextStep,
        enteredHome: nextStep === 56
      };
    }

    getGlobalTileIndex(color, step) {
      if (step < 0 || step > 50) return null;
      const offset = BOARD_PATHS.START_TILES[color];
      return (offset + step) % 52;
    }

    resolveCollisions(movingToken, allPlayers) {
      const captured = [];
      const globalTile = this.getGlobalTileIndex(movingToken.color, movingToken.step);

      if (globalTile === null) return captured;
      if (BOARD_PATHS.SAFE_STAR_INDICES.includes(globalTile)) return captured;

      allPlayers.forEach(player => {
        if (player.color === movingToken.color) return;

        player.tokens.forEach(tok => {
          if (tok.step >= 0 && tok.step <= 50) {
            const opponentTile = this.getGlobalTileIndex(player.color, tok.step);
            if (opponentTile === globalTile) {
              tok.step = -1; // Send back to base yard
              captured.push({ color: player.color, tokenId: tok.id });
            }
          }
        });
      });

      return captured;
    }

    isPlayerWinner(player) {
      const finished = player.tokens.filter(t => t.step === 56).length;
      return finished >= this.tokensPerPlayer;
    }
  }

  exports.RulesEngine = RulesEngine;
  exports.BOARD_PATHS = BOARD_PATHS;

})(typeof exports === 'undefined' ? (this.LudoRules = {}) : exports);
