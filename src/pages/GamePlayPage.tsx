import React, { useState, useEffect, useRef } from 'react';
import { GameMode, MoveOption, Player, PlayerColor, Token } from '../types';
import { LudoEngine } from '../game/engine/LudoEngine';
import { LudoCanvasBoard } from '../game/components/LudoCanvasBoard';
import { DiceBox } from '../game/components/DiceBox';
import { SoundManager } from '../game/audio/SoundManager';
import { LogOut } from 'lucide-react';

interface GamePlayPageProps {
  mode: GameMode;
  playerCount: number;
  userColor: PlayerColor;
  playerNames: string[];
  onExit: () => void;
}

export const GamePlayPage: React.FC<GamePlayPageProps> = ({
  mode,
  playerCount,
  userColor,
  playerNames,
  onExit
}) => {
  const [engine, setEngine] = useState<LudoEngine | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [diceVal, setDiceVal] = useState<number | null>(null);
  const [legalMoves, setLegalMoves] = useState<MoveOption[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    SoundManager.startMusic();

    const assignedColors: PlayerColor[] = playerCount === 2
      ? [userColor, userColor === 'red' ? 'yellow' : 'red']
      : ['red', 'green', 'yellow', 'blue'].slice(0, playerCount) as PlayerColor[];

    const initialPlayers = assignedColors.map((color, i) => ({
      id: `p_${i}`,
      name: playerNames[i] || `Player ${i + 1}`,
      color: color,
      isBot: mode === 'pass_play' ? false : i !== 0
    }));

    const eng = new LudoEngine(mode, initialPlayers, {
      onDiceRolled: (val, moves) => {
        setDiceVal(val);
        setLegalMoves(moves);
      },
      onTurnChanged: (nextP) => {
        setActivePlayer({ ...nextP });
        setDiceVal(null);
        setLegalMoves([]);
      },
      onTokenMoved: (tok, captured) => {
        SoundManager.playTokenStep();
        if (captured) SoundManager.playCapture();
        setPlayers([...eng.players]);
      },
      onGameOver: (win) => {
        SoundManager.playVictory();
        setWinner(win);
      },
      onExtraTurn: () => {
        setDiceVal(null);
        setLegalMoves([]);
      }
    });

    setEngine(eng);
    setPlayers([...eng.players]);
    setActivePlayer(eng.getActivePlayer());

    return () => {
      SoundManager.stopMusic();
    };
  }, []);

  const handleRollDice = () => {
    if (engine) engine.rollDice();
  };

  const handleTokenClick = (tokenId: number) => {
    if (engine) engine.executeMove(tokenId);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn btn-outline"
          style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          onClick={() => setShowExitConfirm(true)}
        >
          <LogOut size={16} /> Exit
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(10,20,53,0.9)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-card)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: `var(--color-${activePlayer?.color || 'red'})` }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>{activePlayer?.name}'s Turn</span>
        </div>

        <div style={{ width: '40px' }} />
      </div>

      {/* Main Board */}
      <LudoCanvasBoard
        players={players}
        activeLegalMoves={legalMoves}
        onTokenClick={handleTokenClick}
      />

      {/* Bottom Dice Controller */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', margin: '8px 0' }}>
        <DiceBox
          value={diceVal}
          disabled={!activePlayer || activePlayer.isBot || engine?.hasRolled === true}
          onRoll={handleRollDice}
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
          {activePlayer?.isBot ? 'Bot thinking...' : (legalMoves.length > 0 ? 'Tap highlighted token to move!' : 'Tap dice to roll')}
        </span>
      </div>

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '8px' }}>Quit Match</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Are you sure you want to quit the current game?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowExitConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-gold" style={{ flex: 1 }} onClick={onExit}>
                Yes, Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Winner Modal */}
      {winner && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: 'center', border: '2px solid var(--accent-gold)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '4px' }}>🏆</div>
            <h2 style={{ color: 'var(--accent-gold)', marginBottom: '6px' }}>Victory!</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
              <strong>{winner.name}</strong> has conquered the board!
            </p>
            <button className="btn btn-gold btn-block" onClick={onExit}>
              Back to Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
