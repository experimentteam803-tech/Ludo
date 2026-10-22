import React from 'react';
import { Home, Gamepad2, Gift, Wallet, User } from 'lucide-react';
import { audioManager } from '../../services/audio/audioManager';

export type NavTab = 'HOME' | 'GAMES' | 'REWARDS' | 'WALLET' | 'PROFILE';

interface Props {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { key: 'HOME', label: 'Home', icon: Home },
    { key: 'GAMES', label: 'Games', icon: Gamepad2 },
    { key: 'REWARDS', label: 'Rewards', icon: Gift },
    { key: 'WALLET', label: 'Wallet', icon: Wallet },
    { key: 'PROFILE', label: 'Profile', icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#050b18] via-[#09152e] to-[#0d1d40] border-t border-yellow-500/40 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-around py-1.5 max-w-md mx-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                audioManager.playUiTap();
                onChangeTab(t.key);
              }}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-yellow-400 font-extrabold scale-105'
                  : 'text-gray-400 font-medium hover:text-gray-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
