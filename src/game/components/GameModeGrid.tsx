import React from 'react';
import { GameMode } from '../types';

interface GameModeGridProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenFreeModal: () => void;
}

export const GameModeGrid: React.FC<GameModeGridProps> = ({ onSelectMode, onOpenFreeModal }) => {
  return (
    <div>
      <div className="mode-grid-container">
        {/* Classic */}
        <div className="mode-yellow-card" onClick={() => onSelectMode('classic')}>
          <div className="mode-online-badge">0</div>
          <div className="mode-icon">👑</div>
          <div className="mode-title">Classic</div>
        </div>

        {/* 1 Goti */}
        <div className="mode-yellow-card" onClick={() => onSelectMode('one_token')}>
          <div className="mode-online-badge">0</div>
          <div className="mode-icon">🏆</div>
          <div className="mode-title">1 Goti</div>
        </div>

        {/* 2 Goti */}
        <div className="mode-yellow-card" onClick={() => onSelectMode('two_token')}>
          <div className="mode-online-badge">2</div>
          <div className="mode-icon">⚔️</div>
          <div className="mode-title">2 Goti</div>
        </div>

        {/* Pass & Play */}
        <div className="mode-yellow-card" onClick={() => onSelectMode('pass_play')}>
          <div className="mode-online-badge">Offline</div>
          <div className="mode-icon">👥</div>
          <div className="mode-title">Pass & Play</div>
        </div>
      </div>

      {/* Free Game CTA Card */}
      <div
        onClick={onOpenFreeModal}
        style={{
          margin: '0 14px 14px 14px',
          background: 'linear-gradient(135deg, rgba(0, 214, 111, 0.2), rgba(10, 20, 53, 0.9))',
          border: '1px solid var(--accent-green)',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <div>
          <span style={{ fontSize: '0.65rem', background: 'rgba(0, 214, 111, 0.25)', color: 'var(--accent-green)', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>
            FREE ENTRY
          </span>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', marginTop: '2px' }}>Free Game Pass</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Watch 2 short ads to unlock 1 free game</div>
        </div>
        <div style={{ fontSize: '1.8rem' }}>🎁</div>
      </div>
    </div>
  );
};
