import React, { useState } from 'react';
import { GameMode, UserProfile } from '../types';
import { TopProfileBar } from '../components/TopProfileBar';
import { BannerCarousel } from '../components/BannerCarousel';
import { NoticeModal } from '../components/NoticeModal';
import { GameModeGrid } from '../components/GameModeGrid';

interface HomePageProps {
  profile: UserProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onOpenWallet: () => void;
  onSelectMode: (mode: GameMode) => void;
  onOpenFreeModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  onOpenSettings,
  onOpenWallet,
  onSelectMode,
  onOpenFreeModal
}) => {
  const [showNotice, setShowNotice] = useState(true);

  return (
    <div style={{ paddingBottom: '70px' }}>
      <TopProfileBar
        profile={profile}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onOpenSettings={onOpenSettings}
        onOpenWallet={onOpenWallet}
      />

      {showNotice && <NoticeModal onClose={() => setShowNotice(false)} />}

      <BannerCarousel />

      <GameModeGrid onSelectMode={onSelectMode} onOpenFreeModal={onOpenFreeModal} />

      <div style={{ textAlign: 'center', margin: '8px 14px', padding: '12px', background: 'rgba(10, 20, 53, 0.6)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Need Help? Connect With Us</span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
          <button className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }} onClick={() => alert('Support WhatsApp: +91 90000 00000')}>
            💬 WhatsApp
          </button>
          <button className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px' }} onClick={() => alert('Support Telegram: @LudoRoyaleOfficial')}>
            ✈️ Telegram
          </button>
        </div>
      </div>
    </div>
  );
};
