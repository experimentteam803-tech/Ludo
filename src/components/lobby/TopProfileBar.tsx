import React from 'react';
import { Settings, Plus, Bell } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface Props {
  onOpenWallet: () => void;
  onOpenStore: () => void;
  onOpenSettings: () => void;
}

export const TopProfileBar: React.FC<Props> = ({ onOpenStore, onOpenSettings }) => {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a] border-b border-yellow-500/30 shadow-lg">
      {/* Profile info */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <img
            src={user?.avatarUrl}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover shadow"
          />
          <span className="absolute -bottom-1 -right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-[#0d1b2a]" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white tracking-wide leading-none">{user?.displayName}</span>
          <span className="text-[10px] text-yellow-400/80 font-mono mt-0.5">UID: {user?.uid.slice(0, 8)}</span>
        </div>
      </div>

      {/* Balance & Settings */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenStore}
          className="flex items-center gap-1.5 bg-[#0a1128] border border-yellow-400/60 px-3 py-1 rounded-full shadow-inner"
        >
          <span className="text-yellow-400 text-xs font-bold font-mono">₹{user?.virtualCoins}</span>
          <div className="bg-yellow-500 rounded-full p-0.5 text-black">
            <Plus className="w-3 h-3 stroke-[3]" />
          </div>
        </button>

        <button className="text-yellow-400/90 hover:text-yellow-300 p-1">
          <Bell className="w-5 h-5" />
        </button>

        <button onClick={onOpenSettings} className="text-yellow-400/90 hover:text-yellow-300 p-1">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
