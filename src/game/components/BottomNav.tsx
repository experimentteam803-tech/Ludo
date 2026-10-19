import React from 'react';
import { Home, Gamepad2, Wallet, User, Shield } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab }) => {
  return (
    <nav className="bottom-nav-bar">
      <button className={`nav-tab-btn ${currentTab === 'home' ? 'active' : ''}`} onClick={() => onChangeTab('home')}>
        <Home size={20} />
        <span>Home</span>
      </button>

      <button className={`nav-tab-btn ${currentTab === 'wallet' ? 'active' : ''}`} onClick={() => onChangeTab('wallet')}>
        <Wallet size={20} />
        <span>Wallet</span>
      </button>

      <button className={`nav-tab-btn ${currentTab === 'profile' ? 'active' : ''}`} onClick={() => onChangeTab('profile')}>
        <User size={20} />
        <span>Profile</span>
      </button>

      <button className={`nav-tab-btn ${currentTab === 'admin' ? 'active' : ''}`} onClick={() => onChangeTab('admin')}>
        <Shield size={20} />
        <span>Admin</span>
      </button>
    </nav>
  );
};
