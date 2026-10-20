import { PlayerColor, Token, Player, GameState, GameMode } from '../../types/game';
import { START_POSITIONS, SAFE_CELLS, FINAL_HOME_POSITION, MAIN_BOARD_SIZE } from './boardConstants';

export class LudoEngine {
  public static createInitialState(
    mode: GameMode,
    playerConfigs: { id: string; name: string; color: PlayerColor; isAi: boolean }[],
    entryFee: number = 0,
    prizePool: number = 0
  ): GameState {
    const tokensPerPlayer = mode === 'ONE_GOTI' ? 1 : mode === 'TWO_GOTI' ? 2 : 4;

    const players: Player[] = playerConfigs.map((cfg) => ({
      id: cfg.id,
      name: cfg.name,
      color: cfg.color,
      isAi: cfg.isAi,
      tokens: Array.from({ length: tokensPerPlayer }, (_, i) => ({
        id: i,
        color: cfg.color,
        stepPosition: -1, // in base
        isFinished: false,
      })),
    }));

    return {
      mode,
      players,
      activePlayerIndex: 0,
      diceValue: null,
      hasRolled: false,
      canRoll: true,
      validTokenMoves: [],
      winner: null,
      isGameOver: false,
      entryFee,
      prizePool,
    };
  }

  public static getValidMoves(player: Player, dice: number): number[] {
    const validTokenIds: number[] = [];

    player.tokens.forEach((token) => {
      if (token.isFinished) return;

      if (token.stepPosition === -1) {
        if (dice === 6) validTokenIds.push(token.id);
      } else {
        const targetStep = token.stepPosition + dice;
        if (targetStep <= FINAL_HOME_POSITION) {
          validTokenIds.push(token.id);
        }
      }
    });

    return validTokenIds;
  }

  public static getGlobalPosition(token: Token): number {
    if (token.stepPosition < 0 || token.stepPosition >= 51) return -1;
    const offset = START_POSITIONS[token.color];
    return (offset + token.stepPosition) % MAIN_BOARD_SIZE;
  }

  public static executeMove(
    state: GameState,
    tokenId: number
  ): { newState: GameState; extraTurn: boolean; captured: boolean } {
    if (!state.hasRolled || state.diceValue === null) {
      throw new Error('Must roll dice before moving.');
    }

    const dice = state.diceValue;
    const currentPlayer = state.players[state.activePlayerIndex];
    const tokenIndex = currentPlayer.tokens.findIndex((t) => t.id === tokenId);

    if (tokenIndex === -1) throw new Error('Token not found');

    const updatedTokens = [...currentPlayer.tokens];
    const targetToken = { ...updatedTokens[tokenIndex] };
    let extraTurn = dice === 6;
    let captured = false;

    if (targetToken.stepPosition === -1) {
      targetToken.stepPosition = 0; // Unlock out of yard
    } else {
      targetToken.stepPosition += dice;
      if (targetToken.stepPosition === FINAL_HOME_POSITION) {
        targetToken.isFinished = true;
        extraTurn = true; // Bonus roll for taking token home
      }
    }
    updatedTokens[tokenIndex] = targetToken;

    // Capture logic if on standard loop
    const updatedPlayers = [...state.players];
    if (targetToken.stepPosition >= 0 && targetToken.stepPosition < 51) {
      const globalPos = this.getGlobalPosition(targetToken);
      const isSafe = SAFE_CELLS.includes(globalPos);

      if (!isSafe) {
        updatedPlayers.forEach((opp, pIdx) => {
          if (pIdx !== state.activePlayerIndex) {
            opp.tokens.forEach((oppToken, oIdx) => {
              if (oppToken.stepPosition >= 0 && oppToken.stepPosition < 51) {
                if (this.getGlobalPosition(oppToken) === globalPos) {
                  // Capture successful!
                  opp.tokens[oIdx] = { ...oppToken, stepPosition: -1 };
                  captured = true;
                  extraTurn = true; // Bonus roll for capture
                }
              }
            });
          }
        });
      }
    }

    updatedPlayers[state.activePlayerIndex] = {
      ...currentPlayer,
      tokens: updatedTokens,
    };

    // Check Win Condition
    const allFinished = updatedTokens.every((t) => t.isFinished);
    const winner = allFinished ? updatedPlayers[state.activePlayerIndex] : null;

    let nextIndex = state.activePlayerIndex;
    if (!extraTurn && !winner) {
      nextIndex = (state.activePlayerIndex + 1) % state.players.length;
    }

    const newState: GameState = {
      ...state,
      players: updatedPlayers,
      activePlayerIndex: nextIndex,
      diceValue: null,
      hasRolled: false,
      canRoll: !winner,
      validTokenMoves: [],
      winner,
      isGameOver: !!winner,
    };

    return { newState, extraTurn, captured };
  }
}
