import React from 'react';
import { UserProfile } from '../types';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { SoundManager } from '../game/audio/SoundManager';

interface TopProfileBarProps {
  profile: UserProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenWallet: () => void;
}

export const TopProfileBar: React.FC<TopProfileBarProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenWallet
}) => {
  return (
    <header className="app-header">
      <div className="profile-pill" onClick={onOpenSettings}>
        <div className="avatar-circle">{profile.avatar}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{profile.displayName}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ID: {profile.uid}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="coin-badge" onClick={onOpenWallet}>
          <div className="coin-icon">C</div>
          <span>{profile.coins.toLocaleString()}</span>
          <span style={{ color: 'var(--accent-green)', marginLeft: '2px', fontWeight: 900 }}>+</span>
        </div>

        <button
          onClick={onToggleSound}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          aria-label="Sound Toggle"
        >
          {soundEnabled ? <Volume2 size={20} color="var(--accent-gold)" /> : <VolumeX size={20} color="#788" />}
        </button>

        <button
          onClick={onOpenSettings}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          aria-label="Settings"
        >
          <Settings size={20} color="var(--accent-gold)" />
        </button>
      </div>
    </header>
  );
};
