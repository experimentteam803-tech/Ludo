import { describe, it, expect } from 'vitest';
import { LudoEngine } from '../src/game/rules/ludoEngine';
import { PlayerColor } from '../src/types/game';

describe('Ludo Deterministic Rules Engine', () => {
  const configs = [
    { id: '1', name: 'Alice', color: 'RED' as PlayerColor, isAi: false },
    { id: '2', name: 'Bob', color: 'GREEN' as PlayerColor, isAi: true },
  ];

  it('initializes token positions to -1 (yard/base)', () => {
    const state = LudoEngine.createInitialState('CLASSIC', configs);
    expect(state.players[0].tokens).toHaveLength(4);
    expect(state.players[0].tokens[0].stepPosition).toBe(-1);
  });

  it('forbids exiting base without rolling a 6', () => {
    const state = LudoEngine.createInitialState('CLASSIC', configs);
    const validMovesWithFive = LudoEngine.getValidMoves(state.players[0], 5);
    expect(validMovesWithFive).toHaveLength(0);

    const validMovesWithSix = LudoEngine.getValidMoves(state.players[0], 6);
    expect(validMovesWithSix).toHaveLength(4);
  });

  it('awards bonus roll upon taking token to home', () => {
    const state = LudoEngine.createInitialState('ONE_GOTI', configs);
    state.players[0].tokens[0].stepPosition = 56; // 1 step away from finish
    state.diceValue = 1;
    state.hasRolled = true;

    const { newState, extraTurn } = LudoEngine.executeMove(state, 0);
    expect(newState.players[0].tokens[0].isFinished).toBe(true);
    expect(extraTurn).toBe(true);
    expect(newState.winner?.id).toBe('1');
  });
});
