import { GameMode, MoveOption, Player, PlayerColor, Token } from '../../types';
import { COLOR_START_INDICES, SAFE_STAR_INDICES } from './boardGeometry';

export interface EngineEvents {
  onDiceRolled: (val: number, legalMoves: MoveOption[]) => void;
  onTurnChanged: (player: Player) => void;
  onTokenMoved: (token: Token, captured: boolean) => void;
  onGameOver: (winner: Player) => void;
  onExtraTurn: (reason: 'six' | 'capture' | 'goal') => void;
}

export class LudoEngine {
  public mode: GameMode;
  public players: Player[];
  public activePlayerIdx: number = 0;
  public currentDice: number | null = null;
  public hasRolled: boolean = false;
  public consecutiveSixes: number = 0;
  public isGameOver: boolean = false;
  public winner: Player | null = null;
  public tokensPerPlayer: number;
  public events: EngineEvents;

  constructor(
    mode: GameMode,
    configuredPlayers: { id: string; name: string; color: PlayerColor; isBot: boolean }[],
    events: EngineEvents
  ) {
    this.mode = mode;
    this.events = events;
    this.tokensPerPlayer = this.resolveTokenQuota(mode);

    this.players = configuredPlayers.map(p => ({
      ...p,
      hasFinished: false,
      tokens: Array.from({ length: this.tokensPerPlayer }, (_, i) => ({
        id: i,
        color: p.color,
        step: -1
      }))
    }));
  }

  private resolveTokenQuota(mode: GameMode): number {
    switch (mode) {
      case 'one_token': return 1;
      case 'two_token': return 2;
      case 'classic':
      default: return 4;
    }
  }

  public getActivePlayer(): Player {
    return this.players[this.activePlayerIdx];
  }

  public rollDice(): number {
    if (this.hasRolled || this.isGameOver) {
      return this.currentDice || 1;
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    this.currentDice = roll;
    this.hasRolled = true;

    if (roll === 6) {
      this.consecutiveSixes++;
    } else {
      this.consecutiveSixes = 0;
    }

    // 3 consecutive 6s penalty forfeits turn
    if (this.consecutiveSixes >= 3) {
      this.consecutiveSixes = 0;
      this.events.onDiceRolled(roll, []);
      setTimeout(() => this.nextTurn(), 800);
      return roll;
    }

    const legalMoves = this.calculateLegalMoves(this.getActivePlayer(), roll);
    this.events.onDiceRolled(roll, legalMoves);

    if (legalMoves.length === 0) {
      setTimeout(() => this.nextTurn(), 1000);
    } else if (this.getActivePlayer().isBot) {
      setTimeout(() => {
        const chosen = this.decideBotMove(legalMoves);
        this.executeMove(chosen.tokenId);
      }, 700);
    }

    return roll;
  }

  public calculateLegalMoves(player: Player, dice: number): MoveOption[] {
    const moves: MoveOption[] = [];
    player.tokens.forEach(tok => {
      if (tok.step === 56) return;
      if (tok.step === -1) {
        if (dice === 6) {
          moves.push({ tokenId: tok.id, fromStep: -1, toStep: 0 });
        }
      } else if (tok.step + dice <= 56) {
        moves.push({ tokenId: tok.id, fromStep: tok.step, toStep: tok.step + dice });
      }
    });
    return moves;
  }

  public executeMove(tokenId: number): boolean {
    if (!this.hasRolled || !this.currentDice || this.isGameOver) return false;

    const player = this.getActivePlayer();
    const token = player.tokens.find(t => t.id === tokenId);
    if (!token) return false;

    const legal = this.calculateLegalMoves(player, this.currentDice);
    const validMove = legal.find(m => m.tokenId === tokenId);
    if (!validMove) return false;

    token.step = validMove.toStep;
    let captured = false;
    const reachedGoal = token.step === 56;

    // Check collision on common track (0..50)
    if (token.step >= 0 && token.step <= 50) {
      const globalTile = (COLOR_START_INDICES[token.color] + token.step) % 52;
      if (!SAFE_STAR_INDICES.includes(globalTile)) {
        this.players.forEach(otherP => {
          if (otherP.color !== token.color) {
            otherP.tokens.forEach(otherTok => {
              if (otherTok.step >= 0 && otherTok.step <= 50) {
                const otherGlobal = (COLOR_START_INDICES[otherTok.color] + otherTok.step) % 52;
                if (otherGlobal === globalTile) {
                  otherTok.step = -1; // Captured! Sent back to yard
                  captured = true;
                }
              }
            });
          }
        });
      }
    }

    this.events.onTokenMoved(token, captured);

    // Win verification
    const finishedCount = player.tokens.filter(t => t.step === 56).length;
    if (finishedCount >= this.tokensPerPlayer) {
      this.isGameOver = true;
      this.winner = player;
      this.events.onGameOver(player);
      return true;
    }

    // Extra Turn rules: rolled 6, captured opponent, or token reached final goal
    const getsExtra = this.currentDice === 6 || captured || reachedGoal;

    if (getsExtra) {
      this.hasRolled = false;
      this.currentDice = null;
      const reason = captured ? 'capture' : (reachedGoal ? 'goal' : 'six');
      this.events.onExtraTurn(reason);
      if (player.isBot) {
        setTimeout(() => this.rollDice(), 800);
      }
    } else {
      this.nextTurn();
    }

    return true;
  }

  public nextTurn() {
    this.hasRolled = false;
    this.currentDice = null;
    this.consecutiveSixes = 0;
    this.activePlayerIdx = (this.activePlayerIdx + 1) % this.players.length;

    const nextP = this.getActivePlayer();
    this.events.onTurnChanged(nextP);

    if (nextP.isBot && !this.isGameOver) {
      setTimeout(() => this.rollDice(), 850);
    }
  }

  // Tactical Bot Decision Model
  private decideBotMove(moves: MoveOption[]): MoveOption {
    const curP = this.getActivePlayer();

    // 1. Capture opponent priority
    for (const m of moves) {
      if (m.toStep >= 0 && m.toStep <= 50) {
        const destGlobal = (COLOR_START_INDICES[curP.color] + m.toStep) % 52;
        if (!SAFE_STAR_INDICES.includes(destGlobal)) {
          for (const otherP of this.players) {
            if (otherP.color !== curP.color) {
              for (const tok of otherP.tokens) {
                if (tok.step >= 0 && tok.step <= 50) {
                  const oGlobal = (COLOR_START_INDICES[tok.color] + tok.step) % 52;
                  if (oGlobal === destGlobal) return m;
                }
              }
            }
          }
        }
      }
    }

    // 2. Reach goal priority
    const goalMove = moves.find(m => m.toStep === 56);
    if (goalMove) return goalMove;

    // 3. Exit yard priority
    const exitBase = moves.find(m => m.fromStep === -1);
    if (exitBase) return exitBase;

    // 4. Furthest advance priority
    return moves.sort((a, b) => b.toStep - a.toStep)[0];
  }
}
