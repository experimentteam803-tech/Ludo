import React from 'react';
import { X, Award, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const ProfileModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuthStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black text-yellow-400">PLAYER PROFILE</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.avatarUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-yellow-400 object-cover shadow-lg"
          />
          <div>
            <h3 className="text-base font-black text-white">{user?.displayName}</h3>
            <span className="text-xs text-yellow-400/90 font-mono">UID: {user?.uid}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center mb-4">
          <div className="p-2.5 bg-[#142340] rounded-xl border border-gray-700">
            <span className="text-[10px] text-gray-400">Matches Played</span>
            <p className="text-base font-black text-white font-mono">48</p>
          </div>
          <div className="p-2.5 bg-[#142340] rounded-xl border border-gray-700">
            <span className="text-[10px] text-gray-400">Win Rate</span>
            <p className="text-base font-black text-yellow-400 font-mono">68.5%</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Fair-Play Account</span>
        </div>
      </div>
    </div>
  );
};
