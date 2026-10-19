import React, { useState } from 'react';
import { GameMode, PlayerColor } from '../types';

interface GameSetupPageProps {
  mode: GameMode;
  onBack: () => void;
  onStart: (playersCount: number, selectedColor: PlayerColor, names: string[]) => void;
}

export const GameSetupPage: React.FC<GameSetupPageProps> = ({ mode, onBack, onStart }) => {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [selectedColor, setSelectedColor] = useState<PlayerColor>('red');
  const [names, setNames] = useState<string[]>(['Arif Khan', 'Bot Green', 'Bot Yellow', 'Bot Blue']);

  const colors: PlayerColor[] = ['red', 'green', 'yellow', 'blue'];

  const handleNameChange = (idx: number, val: string) => {
    const updated = [...names];
    updated[idx] = val;
    setNames(updated);
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'one_token': return '1 Goti (One Token)';
      case 'two_token': return '2 Goti (Two Token)';
      case 'pass_play': return 'Pass & Play (Local)';
      case 'classic':
      default: return 'Classic Ludo';
    }
  };

  return (
    <div style={{ padding: '16px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={onBack}>
            ← Back
          </button>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-gold)' }}>{getModeTitle()}</h3>
          <div style={{ width: '40px' }} />
        </div>

        {/* Player Count Selection */}
        <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-card)', marginBottom: '14px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            SELECT PLAYER
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setPlayerCount(num)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-card)',
                  background: playerCount === num ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                  color: playerCount === num ? '#221400' : '#fff',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {num} {playerCount === num ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-card)', marginBottom: '14px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            SELECT YOUR COLOR
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {colors.map(c => (
              <div
                key={c}
                onClick={() => setSelectedColor(c)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: `var(--color-${c})`,
                  cursor: 'pointer',
                  border: selectedColor === c ? '3px solid #ffffff' : '3px solid transparent',
                  transform: selectedColor === c ? 'scale(1.15)' : 'none',
                  transition: 'transform 0.15s ease'
                }}
              />
            ))}
          </div>
        </div>

        {/* Player Names */}
        <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-card)' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            PLAYER NAMES
          </label>
          {Array.from({ length: playerCount }).map((_, i) => (
            <input
              key={i}
              type="text"
              value={names[i]}
              onChange={e => handleNameChange(i, e.target.value)}
              placeholder={`Player ${i + 1}`}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-card)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                marginBottom: '8px',
                fontSize: '0.85rem'
              }}
            />
          ))}
        </div>
      </div>

      <button
        className="btn btn-gold btn-block"
        style={{ padding: '14px', fontSize: '1rem', marginTop: '16px' }}
        onClick={() => onStart(playerCount, selectedColor, names.slice(0, playerCount))}
      >
        Play
      </button>
    </div>
  );
};
