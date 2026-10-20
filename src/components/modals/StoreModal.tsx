import React from 'react';
import { X, Coins } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const StoreModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateCoins } = useAuthStore();

  const coinPackages = [
    { coins: 500, price: 'FREE (Demo)' },
    { coins: 1000, price: 'FREE (Demo)' },
    { coins: 2000, price: 'FREE (Demo)' },
    { coins: 5000, price: 'FREE (Demo)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <h2 className="text-sm font-black text-yellow-400">VIRTUAL COIN REPLENISHMENT</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <p className="text-[11px] text-gray-400 mb-3">
          Virtual coins are purely for game entertainment and have zero real-world cash equivalence.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {coinPackages.map((pkg) => (
            <button
              key={pkg.coins}
              onClick={() => {
                updateCoins(pkg.coins);
                alert(`Added ${pkg.coins} Virtual Coins to test wallet!`);
              }}
              className="p-3 rounded-xl bg-gradient-to-b from-[#1b2b48] to-[#111c30] border border-yellow-500/40 text-center active:scale-95"
            >
              <span className="block text-sm font-black text-yellow-400 font-mono">+{pkg.coins}</span>
              <span className="text-[10px] text-gray-300 font-bold">{pkg.price}</span>
            </button>
          ))}
        </div>

        <div className="text-center">
          <span className="text-xs text-gray-400">Current Balance: </span>
          <span className="text-sm font-bold text-yellow-400 font-mono">₹{user?.virtualCoins}</span>
        </div>
      </div>
    </div>
  );
};
