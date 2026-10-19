import React, { useState } from 'react';
import { GameMode, PlayerColor, UserProfile } from './types';
import { WalletService } from './services/walletService';
import { HomePage } from './pages/HomePage';
import { GameSetupPage } from './pages/GameSetupPage';
import { GamePlayPage } from './pages/GamePlayPage';
import { WalletPage } from './pages/WalletPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FreeGameModal } from './pages/FreeGameModal';
import { SettingsModal } from './pages/SettingsModal';
import { BottomNav } from './components/BottomNav';
import { SoundManager } from './game/audio/SoundManager';
import './styles/theme.css';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(WalletService.getProfile());
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [soundEnabled, setSoundEnabled] = useState(SoundManager.sfxEnabled);

  // Match state
  const [activeMode, setActiveMode] = useState<GameMode | null>(null);
  const [isInGame, setIsInGame] = useState(false);
  const [matchConfig, setMatchConfig] = useState<{ count: number; color: PlayerColor; names: string[] } | null>(null);

  // Modals
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    SoundManager.setSfx(next);
  };

  const handleSelectMode = (mode: GameMode) => {
    SoundManager.playTap();
    setActiveMode(mode);
  };

  const handleStartMatch = (count: number, color: PlayerColor, names: string[]) => {
    setMatchConfig({ count, color, names });
    setIsInGame(true);
  };

  const handleExitMatch = () => {
    setIsInGame(false);
    setActiveMode(null);
    setMatchConfig(null);
  };

  if (isInGame && activeMode && matchConfig) {
    return (
      <GamePlayPage
        mode={activeMode}
        playerCount={matchConfig.count}
        userColor={matchConfig.color}
        playerNames={matchConfig.names}
        onExit={handleExitMatch}
      />
    );
  }

  if (activeMode && !isInGame) {
    return (
      <GameSetupPage
        mode={activeMode}
        onBack={() => setActiveMode(null)}
        onStart={handleStartMatch}
      />
    );
  }

  return (
    <div id="root">
      {currentTab === 'home' && (
        <HomePage
          profile={profile}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenSettings={() => setShowSettings(true)}
          onOpenWallet={() => setCurrentTab('wallet')}
          onSelectMode={handleSelectMode}
          onOpenFreeModal={() => setShowFreeModal(true)}
        />
      )}

      {currentTab === 'wallet' && (
        <WalletPage profile={profile} onRefresh={(p) => setProfile(p)} />
      )}

      {currentTab === 'profile' && (
        <ProfilePage profile={profile} />
      )}

      {currentTab === 'admin' && (
        <AdminDashboard />
      )}

      {showFreeModal && (
        <FreeGameModal
          onClose={() => setShowFreeModal(false)}
          onUnlocked={() => {
            setShowFreeModal(false);
            setActiveMode('classic');
          }}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />
    </div>
  );
};
