import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SoundManager } from '../game/audio/SoundManager';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [music, setMusic] = useState(SoundManager.musicEnabled);
  const [sound, setSound] = useState(SoundManager.sfxEnabled);

  const toggleMusic = () => {
    const next = !music;
    setMusic(next);
    SoundManager.setMusic(next);
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    SoundManager.setSfx(next);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '16px', textAlign: 'center' }}>
          Settings
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Music Switch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.88rem' }}>Music</span>
            <button
              onClick={toggleMusic}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                border: 'none',
                background: music ? 'var(--accent-green)' : '#555',
                color: '#fff',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {music ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Sound Switch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.88rem' }}>Sound Effects</span>
            <button
              onClick={toggleSound}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                border: 'none',
                background: sound ? 'var(--accent-green)' : '#555',
                color: '#fff',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {sound ? 'ON' : 'OFF'}
            </button>
          </div>

          <div
            onClick={() => alert('Official Free Rules: Roll 6 to exit base. Star tiles are safe. Guide all tokens home!')}
            style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            📖 Rules & Terms
          </div>

          <div
            onClick={() => alert('Privacy: All gameplay and virtual ledger details are strictly confined to this demo.')}
            style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            🛡️ Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};
