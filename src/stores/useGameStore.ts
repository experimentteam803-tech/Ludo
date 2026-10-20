import { create } from 'zustand';
import { GameState, GameMode, PlayerColor } from '../types/game';
import { LudoEngine } from '../game/rules/ludoEngine';
import { audioManager } from '../services/audio/audioManager';

interface GameStore {
  gameState: GameState | null;
  startNewGame: (mode: GameMode, players: { id: string; name: string; color: PlayerColor; isAi: boolean }[], fee?: number, prize?: number) => void;
  rollDice: () => void;
  selectToken: (tokenId: number) => void;
  quitGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,

  startNewGame: (mode, players, fee = 0, prize = 0) => {
    const initialState = LudoEngine.createInitialState(mode, players, fee, prize);
    set({ gameState: initialState });
  },

  rollDice: () => {
    const state = get().gameState;
    if (!state || !state.canRoll) return;

    const diceValue = Math.floor(Math.random() * 6) + 1;
    const activePlayer = state.players[state.activePlayerIndex];
    const validMoves = LudoEngine.getValidMoves(activePlayer, diceValue);

    // If no legal moves, advance to next turn
    let nextIndex = state.activePlayerIndex;
    let canRoll = true;

    if (validMoves.length === 0) {
      nextIndex = (state.activePlayerIndex + 1) % state.players.length;
    } else {
      canRoll = false; // Must select token
    }

    set({
      gameState: {
        ...state,
        diceValue,
        hasRolled: true,
        canRoll,
        validTokenMoves: validMoves,
        activePlayerIndex: nextIndex,
      },
    });

    // Auto-play AI if AI turn
    setTimeout(() => {
      const updated = get().gameState;
      if (updated && updated.players[updated.activePlayerIndex].isAi && updated.canRoll) {
        get().rollDice();
      }
    }, 600);
  },

  selectToken: (tokenId: number) => {
    const state = get().gameState;
    if (!state) return;

    try {
      const { newState, captured } = LudoEngine.executeMove(state, tokenId);
      if (captured) {
        audioManager.playCapture();
      } else {
        audioManager.playTokenMove();
      }

      if (newState.winner) {
        audioManager.playVictory();
      }

      set({ gameState: newState });

      // AI response if AI turn
      setTimeout(() => {
        const nextState = get().gameState;
        if (nextState && !nextState.isGameOver && nextState.players[nextState.activePlayerIndex].isAi) {
          if (nextState.canRoll) {
            get().rollDice();
          } else if (nextState.validTokenMoves.length > 0) {
            get().selectToken(nextState.validTokenMoves[0]);
          }
        }
      }, 700);
    } catch (err) {
      console.error(err);
    }
  },

  quitGame: () => set({ gameState: null }),
}));
