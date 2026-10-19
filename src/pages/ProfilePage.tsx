import React from 'react';
import { UserProfile } from '../types';

interface ProfilePageProps {
  profile: UserProfile;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ profile }) => {
  return (
    <div style={{ padding: '16px', paddingBottom: '70px' }}>
      <h2 style={{ color: 'var(--accent-gold)', marginBottom: '14px' }}>Player Profile</h2>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '16px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#17275c', border: '2px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          {profile.avatar}
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem' }}>{profile.displayName}</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {profile.uid}</span>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800, marginTop: '2px' }}>
            Level {profile.level} Explorer
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wins</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-green)' }}>{profile.wins}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Losses</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff3366' }}>{profile.losses}</div>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Win Rate</span>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            {Math.round((profile.wins / (profile.wins + profile.losses || 1)) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};
