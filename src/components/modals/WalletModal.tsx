import React from 'react';
import { X, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const WalletModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuthStore();

  const history = [
    { id: '1', title: 'Daily Login Streak', amount: '+50', type: 'IN' },
    { id: '2', title: 'Classic Match Win', amount: '+170', type: 'IN' },
    { id: '3', title: 'Tournament Entry', amount: '-100', type: 'OUT' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0e1a30] border-2 border-yellow-400 rounded-2xl w-full max-w-sm p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-yellow-400" />
            <h2 className="text-sm font-black text-yellow-400">VIRTUAL LEDGER</h2>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="bg-[#091122] p-3 rounded-xl border border-yellow-500/30 text-center mb-4">
          <span className="text-[11px] text-gray-400 uppercase font-bold">Total Virtual Balance</span>
          <p className="text-2xl font-black text-yellow-400 font-mono mt-0.5">₹{user?.virtualCoins}</p>
        </div>

        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Recent Transactions</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history.map((tx) => (
            <div key={tx.id} className="flex justify-between items-center p-2 rounded-lg bg-black/40 text-xs">
              <div className="flex items-center gap-2">
                {tx.type === 'IN' ? (
                  <ArrowDownLeft className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-red-400" />
                )}
                <span className="text-gray-200 font-medium">{tx.title}</span>
              </div>
              <span className={`font-mono font-bold ${tx.type === 'IN' ? 'text-green-400' : 'text-red-400'}`}>
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
